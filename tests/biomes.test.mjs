import test from 'node:test';
import assert from 'node:assert/strict';
import {biomeAt,biomeEdge,createBiomeScene,BIOME_FIRST_SECONDS} from '../src/biomes.js';
import {createRun} from '../src/run.js';

test('first transition starts at exactly40 active seconds for every seed',()=>{
 assert.equal(BIOME_FIRST_SECONDS,40);
 for(const seed of [0,1,17,932,0xffffffff]){
  for(const t of [0,39,40-1/120])assert.equal(biomeAt(t,seed).leg,0);
  assert.equal(biomeAt(40,seed).id,'tesla-factory');assert.equal(biomeAt(40,seed).leg,1);
 }
});
test('subsequent intervals are independently seeded whole seconds within30–50 inclusive',()=>{
 const intervals=new Set(),schedules=new Set();
 for(let seed=0;seed<100;seed++){
  let at=40;const schedule=[];
  for(let leg=1;leg<=30;leg++){
   const b=biomeAt(at,seed),duration=b.nextAt-at;intervals.add(duration);schedule.push(duration);
   assert.equal(b.leg,leg);assert.equal(b.id,leg%2?'tesla-factory':'spaceport');
   assert.ok(duration>=30&&duration<=50&&Number.isInteger(duration));
   assert.equal(biomeAt(b.nextAt-1/120,seed).leg,leg);assert.equal(biomeAt(b.nextAt,seed).leg,leg+1);
   assert.deepEqual(biomeAt(at,seed),b);at=b.nextAt;
  }
  schedules.add(schedule.join(','));
 }
 assert.equal(intervals.size,21);assert.equal(schedules.size,100);
});
test('score and multipliers cannot change either scenery or the director biome',()=>{
 for(const time of [39,40,60,100])for(const score of [0,6999,7000,1e9]){
  const r=createRun({seed:17});r.reset();Object.assign(r.S,{t:time,score,distance:time*360});r.E.bonus=score;r.E.multiplier=100;r.E.scoreFactor=3;r.director.update();
  const scene=createBiomeScene();scene.update(time,r.S.distance,{seed:r.seed});
  assert.equal(scene.state.leg,biomeAt(time,17).leg);assert.equal(r.director.state.leg,scene.state.leg);
 }
});
test('timed entry preserves the fixed world doorway and score-independent travel',()=>{
 const scene=createBiomeScene();scene.update(39,70000);assert.equal(scene.state.moving,false);
 scene.reset();scene.update(40,20,{ahead:1000,behind:300});assert.equal(scene.state.id,'tesla-factory');assert.equal(scene.state.edgeAt,1020);
 const initial=biomeEdge(scene.state,20,200,1);scene.update(41,320);assert.equal(scene.state.edgeAt,1020);assert.equal(biomeEdge(scene.state,320,200,1),initial-300);
 scene.update(44,1320);assert.equal(scene.state.moving,false);assert.equal(scene.state.progress,1);assert.equal(scene.state.from,'tesla-factory');
});
test('pause and resize preserve the timer and doorway; retry resets to40',()=>{
 const r=createRun({seed:932});r.reset();r.S.mode='paused';const before=r.snapshot();for(let n=0;n<240;n++)r.step();assert.deepEqual(r.snapshot(),before);
 const scene=createBiomeScene();scene.update(40,100,{ahead:900,behind:350,seed:932});scene.update(41,400,{seed:932});const paused={...scene.state};
 for(let i=0;i<50;i++)scene.update(41,400,{ahead:2000,behind:900,seed:932});assert.deepEqual(scene.state,paused);
 scene.reset();assert.equal(scene.state.id,'spaceport');assert.equal(scene.state.moving,false);assert.equal(scene.state.nextAt,40);
 r.reset(17);assert.equal(r.S.seed,17);assert.equal(r.S.t,0);
});
test('serialized checkpoint restores the same schedule and director across a boundary',()=>{
 const r=createRun({seed:932});r.reset();r.S.t=39.99;r.S.tick=4799;r.S.next=1e9;r.director.update();
 const copy=createRun();copy.restore(JSON.parse(JSON.stringify(r.snapshot())));
 for(let i=0;i<5;i++){r.step();copy.step();assert.deepEqual(copy.snapshot(),r.snapshot());}
 assert.equal(r.director.state.leg,1);assert.equal(copy.seed,932);
});
test('invalid or negative elapsed time stays at the start',()=>{for(const t of [-5,NaN,Infinity])assert.equal(biomeAt(t).id,'spaceport');});
