import test from 'node:test';
import assert from 'node:assert/strict';
import {createSound} from '../src/sound.js';
import {volumeTier} from '../src/audio-controls.js';
const storage=value=>{const m=new Map(Object.entries(value||{}));return{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),m};};
const flush=async()=>{for(let i=0;i<20;i++)await Promise.resolve();};
function fixture(){let ctx;const sources=[],gains=[];const param=()=>({value:1,setValueAtTime(v){this.value=v},setTargetAtTime(v){this.value=v},linearRampToValueAtTime(v){this.value=v},exponentialRampToValueAtTime(v){this.value=v},cancelScheduledValues(){}});
 class Context{state='running';currentTime=0;destination={};constructor(){ctx=this}createGain(){const x={gain:param(),connect(to){this.to=to},disconnect(){}};gains.push(x);return x;}createBiquadFilter(){return{frequency:param(),Q:param(),connect(){},disconnect(){}};}createBuffer(c,n,r){return{duration:n/r,numberOfChannels:c,copyToChannel(){},getChannelData:()=>new Float32Array(n)};}decodeAudioData(){return Promise.resolve({duration:60});}createBufferSource(){const x={connect(){},disconnect(){},start(){},stop(){this.stopped=true;}};sources.push(x);return x;}}
 return{Context,sources,gains,get ctx(){return ctx;}};
}
test('quarter boundaries include a distinct zero and put exact25/50/75 in their lower quarter',()=>{
 assert.deepEqual([0,.001,.25,.251,.5,.501,.75,.751,1].map(volumeTier),[0,1,1,2,2,3,3,4,4]);
});
test('legacy saved mute/on migrate; a valid independent mix takes precedence, malformed mixes fall back safely',()=>{
 const make=v=>createSound({AudioContext:null,defaultEnabled:true,storage:storage(v)});
 assert.deepEqual(make({'roadster-sound-v1':'off'}).volumes,{effects:0,music:0});
 assert.deepEqual(make({'roadster-sound-v1':'on'}).volumes,{effects:1,music:1});
 assert.deepEqual(make({'roadster-sound-v1':'off','roadster-audio-v2':'{"effects":0.25,"music":0.6}'}).volumes,{effects:.25,music:.6});
 assert.deepEqual(make({'roadster-sound-v1':'off','roadster-audio-v2':'{"effects":2,"music":0.6}'}).volumes,{effects:0,music:0});
 assert.deepEqual(make({'roadster-audio-v2':'bad-json'}).volumes,{effects:1,music:1});
});
test('changing one channel persists both levels, clamps finite input and rejects invalid values',()=>{
 const s=storage(),sound=createSound({AudioContext:null,storage:s,defaultEnabled:true});sound.setVolume('effects',.25);assert.deepEqual(sound.volumes,{effects:.25,music:1});sound.setVolume('music',.6);assert.deepEqual(JSON.parse(s.m.get('roadster-audio-v2')),{effects:.25,music:.6});
 for(const [k,v] of [['x',.2],['music',NaN],['music',Infinity],['effects','0.4']])assert.equal(sound.setVolume(k,v),false);
 assert.deepEqual(createSound({AudioContext:null,storage:s}).volumes,{effects:.25,music:.6});sound.setVolume('effects',-1);sound.setVolume('music',2);assert.deepEqual(sound.volumes,{effects:0,music:1});
});
test('zero effects stops held and fading thrust without stopping music; zero music stops its voices without disabling effects',async()=>{
 const f=fixture(),s=storage(),sound=createSound({AudioContext:f.Context,storage:s,defaultEnabled:true,music:true,loadThrust:async()=>new ArrayBuffer(1),fetcher:async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)})});sound.unlock();await flush();assert.equal(sound.inspect.music.voices,8);sound.setThrust(true);assert.equal(sound.thrust.active,true);sound.setThrust(false);sound.setThrust(true);
 sound.setVolume('effects',0);assert.equal(sound.thrust.voices,0);assert.equal(sound.inspect.music.voices,8);assert.equal(sound.enabled,true);sound.event({type:'jump'});assert.equal(sound.inspect.effects.counts.jump,undefined);assert.equal(f.gains[1].gain.value,0);
 const requests=sound.inspect.music.requests;sound.setVolume('effects',.4);sound.event({type:'jump'});assert.equal(sound.inspect.effects.counts.jump,1);sound.setVolume('music',0);assert.equal(sound.inspect.music.voices,0);assert.equal(sound.enabled,true);assert.equal(f.gains[1].gain.value,.34);
 f.ctx.currentTime=73;sound.setVolume('music',.6);await flush();assert.equal(sound.inspect.music.voices,8);assert.equal(sound.inspect.music.requests,requests,'buffers reused after unmute');assert.ok(sound.inspect.music.phase>12&&sound.inspect.music.phase<14);assert.equal(f.gains[2].gain.value,.6);
});
test('late music decode while music alone is muted cannot resurrect sources or silence the other channel',async()=>{
 const f=fixture();let release;const gate=new Promise(r=>release=r);const sound=createSound({AudioContext:f.Context,storage:storage(),defaultEnabled:true,music:true,loadThrust:async()=>new ArrayBuffer(1),fetcher:async()=>{await gate;return{ok:true,arrayBuffer:async()=>new ArrayBuffer(1)}}});sound.unlock();sound.setVolume('music',0);release();await flush();assert.equal(sound.inspect.music.voices,0);sound.event({type:'jump'});assert.equal(sound.inspect.effects.counts.jump,1);sound.setVolume('effects',0);assert.equal(sound.enabled,false);
});
