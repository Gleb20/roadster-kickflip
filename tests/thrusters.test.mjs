import test from 'node:test';
import assert from 'node:assert/strict';
import {thrusterPose,createThrusterEffects} from '../src/thrusters.js';
test('exhaust stays attached to each pose and turns upward during the inverted frames',()=>{
 const seen=new Set();
 for(let p=0;p<=1;p+=.005){
  const pose=thrusterPose(p);seen.add(pose.frame);
  assert.equal(pose.ports.length,2);
  for(const port of pose.ports){assert.ok(Math.abs(port.x)<54);assert.ok(Math.abs(port.y)<29);}
  if([3,4,5].includes(pose.frame))assert.ok(Math.cos(pose.angle)<0);
 }
 assert.equal(seen.size,9);assert.equal(thrusterPose(0).angle,0);assert.equal(thrusterPose(1).angle,0);
});
test('landing clouds scroll with the world, expire, and reset without particle growth',()=>{
 const effects=createThrusterEffects();
 effects.update(1/120,{impactSpeed:800});assert.equal(effects.activeClouds,1);assert.equal(effects.landingAge,0);
 effects.update(.2,{speed:360});assert.equal(effects.activeClouds,1);
 effects.update(.6);assert.equal(effects.activeClouds,0);
 for(let i=0;i<10;i++)effects.update(.01,{impactSpeed:800});assert.equal(effects.activeClouds,3);
 effects.reset();assert.equal(effects.activeClouds,0);assert.equal(effects.landingAge,Infinity);
});
