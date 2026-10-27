import test from 'node:test';
import assert from 'node:assert/strict';
import {createSound} from '../src/sound.js';
const flush=async()=>{for(let i=0;i<30;i++)await Promise.resolve()};
function fixture(){
 const contexts=[];
 const param=()=>({value:1,setValueAtTime(v){this.value=v},setTargetAtTime(v){this.value=v},linearRampToValueAtTime(v){this.value=v},exponentialRampToValueAtTime(v){this.value=v},cancelScheduledValues(){},setValueCurveAtTime(){}});
 class Context{
  state='suspended';currentTime=0;destination={};resumes=[];
  constructor(){contexts.push(this)}
  resume(){return new Promise((resolve,reject)=>this.resumes.push({resolve:()=>{this.state='running';resolve()},reject}))}
  createGain(){return{gain:param(),connect(){},disconnect(){}}}
  createBiquadFilter(){return{frequency:param(),Q:param(),connect(){},disconnect(){}}}
  createBuffer(c,n,r){return{duration:n/r,copyToChannel(){},getChannelData:()=>new Float32Array(n)}}
  createBufferSource(){return{connect(){},disconnect(){},start(){},stop(){}}}
  decodeAudioData(){return Promise.resolve({duration:60})}
 }
 const sound=createSound({AudioContext:Context,storage:{getItem:()=>null,setItem(){}},defaultEnabled:true,music:true,fetcher:async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)}),loadThrust:async()=>new ArrayBuffer(1)});
 return {sound,contexts};
}
test('a later gesture retries an unresolved resume, restoring both music and effects',async()=>{
 const {sound,contexts}=fixture();sound.unlock();await flush();const ctx=contexts[0];
 assert.equal(ctx.resumes.length,1);assert.equal(sound.inspect.music.voices,0);
 sound.unlock();assert.equal(ctx.resumes.length,2,'new gesture must retry rather than remain locked behind the first promise');
 ctx.resumes[1].resolve();await flush();sound.event({type:'jump'});
 assert.equal(sound.inspect.context,'running');assert.equal(sound.inspect.music.voices,8);assert.equal(sound.inspect.effects.counts.jump,1);
});
test('the canonical start cue survives asynchronous first-gesture resume exactly once',async()=>{
 const {sound,contexts}=fixture();sound.unlock();sound.event({type:'start'});
 contexts[0].resumes[0].resolve();await flush();assert.equal(sound.inspect.effects.counts.start,1);
 sound.unlock();await flush();assert.equal(sound.inspect.effects.counts.start,1);
});
test('an earlier resume rejection cannot discard a newer pending cue',async()=>{
 const {sound,contexts}=fixture();sound.unlock();sound.unlock();sound.event({type:'start'});
 const ctx=contexts[0];ctx.resumes[0].reject(Error('Old gesture did not resume'));await flush();
 ctx.resumes[1].resolve();await flush();assert.equal(sound.inspect.effects.counts.start,1);assert.equal(sound.inspect.music.voices,8);
});
test('a stale resume cannot clear the new context pending cue; mute and hidden discard queued cues',async()=>{
 const {sound,contexts}=fixture();sound.unlock();const old=contexts[0];old.state='closed';sound.unlock();const next=contexts[1];sound.event({type:'start'});
 assert.equal(next.resumes.length,1,'a replacement context starts its own resume');old.resumes[0].resolve();await flush();assert.equal(sound.inspect.context,'suspended');next.resumes[0].resolve();await flush();assert.equal(sound.inspect.effects.counts.start,1);
 for(const action of ['mute','hidden']){
  const f=fixture();f.sound.unlock();f.sound.event({type:'start'});
  if(action==='mute')f.sound.setVolume('effects',0);else f.sound.setVisible(false);
  for(const r of f.contexts[0].resumes)r.resolve();await flush();assert.equal(f.sound.inspect.effects.counts.start,undefined);
 }
});
