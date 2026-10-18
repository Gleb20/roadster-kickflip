import test from 'node:test';
import assert from 'node:assert/strict';
import {createSound,normalisePressureBuffer} from '../src/sound.js';
test('sound opt-in persists, waits for user unlock and mutes immediately',()=>{
 const values=new Map(),events=[];let created=0;
 const storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 class AudioContext{
  state='running';currentTime=0;destination={};
  constructor(){created++}
  createGain(){return {gain:{setValueAtTime:v=>events.push(['gain',v]),exponentialRampToValueAtTime:()=>{}},connect(){},disconnect(){}}}
  createOscillator(){return {frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){},start(){events.push(['start'])},stop(){}}}
 }
 const sound=createSound({storage,AudioContext});
 sound.tone(440);assert.equal(created,0);assert.equal(sound.enabled,false);
 sound.toggle();assert.equal(created,1);sound.tone(440);assert.ok(events.some(e=>e[0]==='start'));
 const restored=createSound({storage,AudioContext});assert.equal(restored.enabled,true);assert.equal(created,1);
 restored.unlock();assert.equal(created,2);
 sound.toggle();assert.equal(events.at(-1)[1],0);
 const count=events.length;sound.tone(440);assert.equal(events.length,count);
});
test('unavailable storage and audio never prevent gameplay',()=>{
 const storage={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
 const sound=createSound({storage,AudioContext:null});sound.toggle();sound.unlock();sound.tone(400);
 assert.equal(sound.enabled,true);
});

test('Safari resumes interrupted audio and keeps the first effect across async unlock',async()=>{
 let context,resolveResume,started=0;
 const audioSession={type:'auto'};
 class Context{
  state='suspended';currentTime=0;destination={};
  constructor(){context=this}
  createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}}}
  createOscillator(){return {frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){},start(){started++},stop(){}}}
  resume(){return new Promise(resolve=>{resolveResume=()=>{this.state='running';resolve()}})}
 }
 const sound=createSound({storage:{getItem:()=>null,setItem(){}},AudioContext:Context,audioSession});
 sound.toggle();assert.equal(audioSession.type,'playback');
 sound.tone(600);assert.equal(started,0);resolveResume();await Promise.resolve();await Promise.resolve();
 assert.equal(started,1,'first confirmation effect survives pending resume');
 context.state='interrupted';sound.unlock();sound.tone(700);resolveResume();await Promise.resolve();await Promise.resolve();
 assert.equal(started,2,'interrupted Safari context resumes on the next gesture');
 sound.toggle();assert.equal(audioSession.type,'auto');
});

function hissContext(){
 let context;const sources=[];class Context{
  state='running';currentTime=0;destination={};
  constructor(){context=this;}
  createGain(){const gain={value:1,setValueAtTime(v){this.value=v},linearRampToValueAtTime(v){this.value=v},exponentialRampToValueAtTime(v){this.value=v},cancelScheduledValues(){}};return {gain,connect(){},disconnect(){}};}
  createBuffer(){return {duration:1/22050};}
  createBufferSource(){const s={loop:false,connect(){},disconnect(){this.disconnected=true},start(...args){this.started=args},stop(...args){this.stopped=args;},finish(){this.onended?.();}};sources.push(s);return s;}
  createBiquadFilter(){return {frequency:{value:0},connect(){},disconnect(){}};}
  decodeAudioData(){return Promise.resolve({duration:5});}
  resume(){this.state='running';return Promise.resolve();}
 }
 return {Context,sources,get context(){return context;}};
}
const flushAudio=async()=>{for(let i=0;i<10;i++)await Promise.resolve();};
test('recorded pressure hiss loads once, loops only during thrust, caps fading nodes and stops on mute',async()=>{
 const mock=hissContext();let loads=0;const sound=createSound({storage:{getItem:()=>null,setItem(){}},AudioContext:mock.Context,loadThrust:async()=>{loads++;return new ArrayBuffer(1);}});
 sound.setThrust(true);assert.equal(mock.sources.length,0,'no playback before sound opt-in');sound.toggle();await flushAudio();assert.equal(sound.thrust.ready,true);assert.equal(sound.thrust.active,true);
 const source=mock.sources.find(s=>s.loop);assert.equal(source.loopStart,.35);assert.equal(source.loopEnd,2.8);assert.equal(source.started[1],.12);
 sound.setThrust(false);assert.equal(sound.thrust.active,false);source.finish();assert.equal(sound.thrust.voices,0);
 for(let i=0;i<30;i++){sound.setThrust(true);sound.setThrust(false);assert.ok(sound.thrust.voices<=2);}
 sound.toggle();assert.equal(sound.thrust.voices,0);sound.toggle();await flushAudio();assert.equal(loads,1);
});
test('late audio decode cannot resurrect a released thrust; interruption resumes a held one',async()=>{
 const mock=hissContext();let resolveLoad;const sound=createSound({storage:{getItem:()=>null,setItem(){}},AudioContext:mock.Context,loadThrust:()=>new Promise(resolve=>{resolveLoad=resolve})});
 sound.toggle();sound.setThrust(true);await flushAudio();sound.setThrust(false);resolveLoad(new ArrayBuffer(1));await flushAudio();assert.equal(sound.thrust.ready,true);assert.equal(sound.thrust.active,false);
 mock.context.state='interrupted';sound.setThrust(true);assert.equal(sound.thrust.active,false);sound.unlock();await flushAudio();assert.equal(sound.thrust.active,true);sound.setThrust(false);
});


test('quiet pressure recording is normalised without exceeding peak ceiling',()=>{
 const data=new Float32Array([.003,-.003,.003,-.003]),buffer={numberOfChannels:1,getChannelData:()=>data};
 const factor=normalisePressureBuffer(buffer);assert.ok(factor>30);assert.ok(Math.abs(data[0]-.12)<1e-6);
 const loud=new Float32Array([1,-1,0,0]);normalisePressureBuffer({numberOfChannels:1,getChannelData:()=>loud});assert.ok(Math.max(...loud)<=.800001);
 assert.equal(normalisePressureBuffer({numberOfChannels:1,getChannelData:()=>new Float32Array(10)}),1);
});
