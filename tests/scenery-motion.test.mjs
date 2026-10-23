import test from 'node:test';
import assert from 'node:assert/strict';
import {createSceneryMotion,advanceSceneryMotion,sceneryScaleFor} from '../src/scenery-motion.js';

test('scenery eases into acceleration and deceleration without overshoot or reversing',()=>{
 const s=createSceneryMotion();
 for(const target of [1100,60,825,0,360]){
  const initial=s.speed;
  for(let i=0;i<360;i++){
   const before={...s};advanceSceneryMotion(s,1/120,target,.72);
   assert.ok(s.distance>=before.distance);
   assert.ok(s.speed>=Math.min(initial,target)-1e-10&&s.speed<=Math.max(initial,target)+1e-10);
   assert.ok(Math.abs(s.speed-before.speed)<Math.abs(target-before.speed)*.034+1e-10);
  }
  assert.ok(Math.abs(s.speed-target)<.15);
 }
});
test('filter retains a perceptible boost and responds gently to a landing reward',()=>{
 const s=createSceneryMotion();advanceSceneryMotion(s,.4,825,.72);
 assert.ok(s.speed>700&&s.speed<825);
 const before=s.speed;advanceSceneryMotion(s,1/120,before*1.05,.72);
 assert.ok(s.speed>before&&s.speed<before*1.002);
});
test('distance and response are independent of update frequency',()=>{
 const run=hz=>{const s=createSceneryMotion();for(const speed of [825,90,360])for(let i=0;i<hz*2;i++)advanceSceneryMotion(s,1/hz,speed,.72);return s;};
 const expected=run(120);for(const hz of [30,60,144]){const s=run(hz);assert.ok(Math.abs(s.distance-expected.distance)<1e-8);assert.ok(Math.abs(s.speed-expected.speed)<1e-8);}
});
test('pause freezes both velocity and tile phase; old travel never amplifies a speed change',()=>{
 const a=createSceneryMotion(),b={speed:a.speed,distance:1e7};
 advanceSceneryMotion(a,0,900,.72);assert.deepEqual(a,createSceneryMotion());
 advanceSceneryMotion(a,1/120,825,.72);advanceSceneryMotion(b,1/120,825,.72);
 assert.ok(Math.abs((b.distance-1e7)-a.distance)<1e-8);
 for(const base of [.45,.68,1.25])assert.equal(sceneryScaleFor(base),Math.max(.72,Math.min(1.15,base)));
});
