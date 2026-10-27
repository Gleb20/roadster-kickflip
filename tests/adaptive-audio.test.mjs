import test from 'node:test';
import assert from 'node:assert/strict';
import {musicTargets,createMusic} from '../src/music.js';
import {EFFECTS,effectSamples,effectForEvent,createEffects} from '../src/sound-effects.js';
import {createSound} from '../src/sound.js';
const flush=async()=>{for(let i=0;i<16;i++)await Promise.resolve();};
function mockContext(){
 const sources=[];const param=()=>({value:0,setTargetAtTime(v){this.value=v},setValueAtTime(v){this.value=v},cancelScheduledValues(){}});
 const ctx={state:'running',currentTime:0,destination:{},createGain:()=>({gain:param(),connect(){},disconnect(){}}),createBiquadFilter:()=>({frequency:param(),Q:param(),connect(){},disconnect(){}}),createBuffer:(c,n,r)=>({duration:n/r,copyToChannel(){},getChannelData:()=>new Float32Array(n)}),decodeAudioData:async()=>({duration:60}),createBufferSource:()=>{const s={connect(){},disconnect(){},start(...args){this.started=args},stop(){this.stopped=true;}};sources.push(s);return s;}};
 return {ctx,sources};
}
test('score opens the arrangement; menu, pause, hidden and tonal handover remain restrained',()=>{
 const menu=musicTargets(),slow=musicTargets({mode:'playing',score:0}),fast=musicTargets({mode:'playing',score:30000}),boost=musicTargets({mode:'playing',score:0,boost:1});
 assert.ok(menu.volume<slow.volume&&menu.layers.lead<slow.layers.lead);
 for(const x of [fast,boost]){assert.ok(x.layers.drums>slow.layers.drums);assert.ok(x.layers.bass>slow.layers.bass);}
 assert.ok(boost.brightness>slow.brightness);
 assert.ok(musicTargets({mode:'paused'}).volume<menu.volume);assert.equal(musicTargets({visible:false}).volume,0);
 for(const progress of [0,.25,.5,.75,1]){const x=musicTargets({biome:{id:'tesla-factory',from:'spaceport',progress}});assert.ok(Math.abs(Object.values(x.biomes).reduce((s,v)=>s+v*v,0)-1)<1e-10);}
 const mid=musicTargets({mode:'playing',score:30000,biome:{id:'tesla-factory',from:'spaceport',progress:.5}});assert.equal(mid.layers.lead,fast.layers.lead);assert.ok(mid.tonalBiomes.spaceport<mid.biomes.spaceport);assert.equal(mid.brightness,fast.brightness);
});
test('late downloads stay muted; enabling reuses buffers on one shared musical phase with bounded voices',async()=>{
 const {ctx,sources}=mockContext();let resolve;const gate=new Promise(r=>resolve=r);let fetched=0;
 const config={seconds:60,tracks:{spaceport:{bed:'a'},'tesla-factory':{bed:'b'}}};
 const m=createMusic({context:ctx,destination:ctx.destination,config,fetcher:async()=>{fetched++;await gate;return {ok:true,arrayBuffer:async()=>new ArrayBuffer(1)};}});
 m.unlock();m.unlock();assert.equal(fetched,2);m.setEnabled(false);resolve();await flush();assert.equal(sources.length,0);
 ctx.currentTime=73;m.setEnabled(true);assert.equal(sources.length,2);assert.equal(sources[0].started[0],sources[1].started[0]);assert.equal(sources[0].started[1],sources[1].started[1]);assert.ok(sources[0].started[1]>12&&sources[0].started[1]<14);
 for(let i=0;i<30;i++)m.unlock();assert.equal(sources.length,2);m.setEnabled(false);assert.ok(sources.every(s=>s.stopped));assert.equal(m.inspect().voices,0);m.dispose();
});
test('music fetch/decode failure is contained and can recover on a later gesture',async()=>{
 const {ctx}=mockContext();let fail=true;const m=createMusic({context:ctx,destination:ctx.destination,config:{seconds:60,tracks:{spaceport:{bed:'x'}}},fetcher:async()=>({ok:!fail,arrayBuffer:async()=>new ArrayBuffer(1)})});m.unlock();await flush();assert.match(m.inspect().errors.spaceport,/unavailable/);fail=false;m.unlock();await flush();assert.deepEqual(m.inspect().ready,['spaceport']);assert.equal(m.inspect().voices,1);m.dispose();
});
test('canonical events produce exactly one appropriate effect, including perfect, shield and backup rescue',()=>{
 for(const [type,name] of [['jump','jump'],['pickup','pickup'],['rail-catch','rail'],['smash','shield'],['rescued','rescue'],['recovered','recover'],['death','death']])assert.equal(effectForEvent({type}),name);
 assert.equal(effectForEvent({type:'landing',landed:{good:true},result:{perfect:true}}),'perfect');
 assert.equal(effectForEvent({type:'landing',landed:{good:false},result:{perfect:true}}),'rough');assert.equal(effectForEvent({type:'air-passed'}),null);
 for(const name of Object.keys(EFFECTS)){const pcm=effectSamples(name);assert.ok(pcm.every(Number.isFinite));assert.ok(pcm.some(v=>Math.abs(v)>.01));assert.equal(pcm[0],0);assert.ok(Math.abs(pcm.at(-1))<.002);assert.ok(pcm.every(v=>Math.abs(v)<1));}
});
test('effect floods stay within eight voices; high priority feedback survives and mute clears loops',()=>{
 const {ctx}=mockContext(),e=createEffects({context:ctx,destination:ctx.destination});
 for(let i=0;i<40;i++){ctx.currentTime+=.2;e.event({type:'jump'});assert.ok(e.inspect().voices<=8);}
 e.event({type:'rescued'});assert.equal(e.inspect().counts.rescue,1);e.grind(true);assert.equal(e.inspect().grinding,true);e.setEnabled(false);assert.equal(e.inspect().voices,0);assert.equal(e.inspect().grinding,false);e.event({type:'pickup'});assert.equal(e.inspect().voices,0);
});
test('new users get gesture-unlocked audio while an explicit saved mute remains authoritative',()=>{
 assert.equal(createSound({defaultEnabled:true,AudioContext:null,storage:{getItem:()=>null}}).enabled,true);
 assert.equal(createSound({defaultEnabled:true,AudioContext:null,storage:{getItem:()=> 'off'}}).enabled,false);
});
