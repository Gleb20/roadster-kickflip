import test from 'node:test';import assert from 'node:assert/strict';
import {sampleHeroArm,HERO_RIG,relaxedHandAngle} from '../src/hero-rig.js';
test('free jump and grind arms reach out with soft elbows and fixed limb lengths',()=>{
 for(const state of [{air:true},{grind:1}])for(const side of [-1,1]){
  const arm=sampleHeroArm(side,state),u={x:arm.elbow.x-arm.shoulder.x,y:arm.elbow.y-arm.shoulder.y},l={x:arm.wrist.x-arm.elbow.x,y:arm.wrist.y-arm.elbow.y};
  assert.ok(side*(arm.wrist.x-arm.shoulder.x)>(HERO_RIG.arm.upper+HERO_RIG.arm.lower)*.8,'hands extend away from the torso');
  assert.ok((u.x*l.x+u.y*l.y)/(HERO_RIG.arm.upper*HERO_RIG.arm.lower)>.7,'elbows remain softly bent, not doubled back');
  assert.ok(Math.abs(Math.hypot(u.x,u.y)-HERO_RIG.arm.upper)<1e-7);assert.ok(Math.abs(Math.hypot(l.x,l.y)-HERO_RIG.arm.lower)<1e-7);
  const a=relaxedHandAngle(arm);assert.ok(Math.abs(Math.cos(a-Math.PI/2)*l.y-Math.sin(a-Math.PI/2)*l.x)<1e-7);
 }
});
test('existing grab and interaction hand targets remain independent of relaxed wrist orientation',()=>{
 for(const side of [-1,1]){const a=sampleHeroArm(side,{air:true,grab:1,drop:32,grabPoint:{x:16,y:11}});assert.ok(Number.isFinite(relaxedHandAngle(a)));}
 const neutral=sampleHeroArm(1,{air:true,grab:1,drop:32,grabPoint:{x:16,y:11}}),acting=sampleHeroArm(1,{air:true,grab:1,drop:32,grabPoint:{x:16,y:11},taunt:1,aim:{x:-150,y:-180},special:true,facing:-1});assert.deepEqual(acting.wrist,neutral.wrist);
});
