import test from 'node:test';
import assert from 'node:assert/strict';
import {musicTargets,createMusic} from '../src/music.js';

const scene=(score,extra={})=>({mode:'playing',score,...extra});
test('score stages add bass, drums, then lead through 30000; speed and lost combos cannot undo them',()=>{
 const points=[0,2500,7500,15000,30000,100000],stages=points.map(n=>musicTargets(scene(n)));
 assert.equal(stages[0].layers.bass,0);assert.equal(stages[0].layers.drums,0);
 assert.ok(stages[1].layers.bass>0&&stages[1].layers.drums===0);
 assert.equal(stages[2].layers.bass,1);assert.ok(stages[2].layers.drums>0);
 assert.equal(stages[3].layers.drums,1);assert.ok(stages[3].layers.lead<1);
 assert.equal(stages[4].layers.lead,1);assert.deepEqual(stages[4],stages[5]);
 for(let i=1;i<stages.length;i++)for(const layer of ['bed','lead','bass','drums'])assert.ok(stages[i].layers[layer]>=stages[i-1].layers[layer]);
 assert.deepEqual(musicTargets(scene(7500,{speed:1100,multiplier:6,streak:.25})),musicTargets(scene(7500,{speed:360,multiplier:1,streak:0})));
 assert.equal(stages[0].volume,stages[4].volume);assert.equal(stages[0].brightness,stages[4].brightness);
});
test('boost is a modest temporary accent and training stays light at normal playback rate',()=>{
 const base=musicTargets(scene(7500)),boost=musicTargets(scene(7500,{boost:1})),training=musicTargets(scene(100000,{training:true,boost:1}));
 assert.ok(boost.layers.drums>base.layers.drums&&boost.layers.lead>base.layers.lead);
 assert.equal(boost.volume,base.volume);assert.ok(boost.intensity-base.intensity<=.201);
 assert.deepEqual(training,musicTargets(scene(0,{training:true})));
 assert.ok(training.layers.drums<.1&&training.layers.bass<.2);
 assert.deepEqual(musicTargets(scene(NaN)),musicTargets(scene(0)));
});

function context(){
 const sources=[],params=[];
 const param=()=>{const p={value:0,events:[],setTargetAtTime(...a){this.events.push(['target',...a]);this.value=a[0]},setValueAtTime(...a){this.events.push(['value',...a]);this.value=a[0]},setValueCurveAtTime(...a){this.events.push(['curve',...a])},cancelScheduledValues(t){this.events.push(['cancel',t])}};params.push(p);return p};
 return {sources,params,state:'running',currentTime:0,destination:{},createGain:()=>({gain:param(),connect(){},disconnect(){}}),createBiquadFilter:()=>({frequency:param(),Q:param(),connect(){},disconnect(){}}),decodeAudioData:async()=>({duration:60}),createBufferSource(){const s={connect(){},disconnect(){},start(...args){this.started=args},stop(){this.stopped=true}};sources.push(s);return s}};
}
const flush=async()=>{for(let i=0;i<30;i++)await Promise.resolve()};
test('biome handover starts on the next bar, retains the old track while loading, and keeps sources phase aligned',async()=>{
 const ctx=context();let factoryReady;const gate=new Promise(r=>factoryReady=r);
 const m=createMusic({context:ctx,destination:ctx.destination,config:{bpm:128,seconds:60,tracks:{spaceport:{bed:'a',lead:'a'},'tesla-factory':{bed:'b',lead:'b'}}},fetcher:async url=>{if(String(url).endsWith('/b'))await gate;return{ok:true,arrayBuffer:async()=>new ArrayBuffer(1)}}});
 m.update(scene(15000));m.unlock();await flush();ctx.currentTime=2.1;
 m.update(scene(15000,{biome:{id:'tesla-factory',from:'spaceport',progress:1}}));
 assert.equal(m.inspect().targets.biomes.spaceport,1);assert.equal(m.inspect().transition,null);
 factoryReady();await flush();const t=m.inspect().transition;
 assert.ok(t&&t.at>=ctx.currentTime);assert.ok(Math.abs((t.at-m.inspect().origin)/(60/128*4)-Math.round((t.at-m.inspect().origin)/(60/128*4)))<1e-10);
 assert.equal(ctx.sources.length,4);assert.ok(ctx.sources.every(s=>!s.playbackRate));
 ctx.currentTime=t.at+t.duration/2;m.update(scene(15000,{biome:{id:'tesla-factory',from:'spaceport',progress:1}}));
 const mid=m.inspect().targets;assert.ok(Math.abs(mid.biomes.spaceport**2+mid.biomes['tesla-factory']**2-1)<1e-10);
 assert.equal(mid.brightness,musicTargets(scene(15000)).brightness);assert.ok(mid.tonalBiomes.spaceport<mid.biomes.spaceport);
 ctx.currentTime=t.at+t.duration+.01;m.update(scene(15000,{biome:{id:'tesla-factory'}}));assert.equal(m.inspect().targets.biomes['tesla-factory'],1);
 m.setEnabled(false);assert.equal(m.inspect().voices,0);m.dispose();m.unlock();await flush();assert.equal(m.inspect().voices,0);
});
test('disposing during a pending download cannot connect new sources',async()=>{
 const ctx=context();let ready;const gate=new Promise(r=>ready=r);
 const m=createMusic({context:ctx,destination:ctx.destination,config:{seconds:60,tracks:{spaceport:{bed:'a'}}},fetcher:async()=>{await gate;return{ok:true,arrayBuffer:async()=>new ArrayBuffer(1)}}});
 m.unlock();m.dispose();ready();await flush();assert.equal(ctx.sources.length,0);m.setEnabled(true);m.unlock();assert.equal(ctx.sources.length,0);
});
test('visibility, pause and training changes bypass frame throttling',()=>{
 const ctx=context(),m=createMusic({context:ctx,destination:ctx.destination,fetcher:null});
 m.update(scene(30000));assert.equal(m.inspect().targets.layers.lead,1);
 m.update(scene(30000,{training:true}));assert.equal(m.inspect().targets.layers.drums,.06);
 m.update({mode:'paused'});assert.equal(m.inspect().targets.volume,.12);
 m.update({mode:'paused',visible:false});assert.equal(m.inspect().targets.volume,0);m.dispose();
});
