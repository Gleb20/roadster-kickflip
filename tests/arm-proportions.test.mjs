import test from 'node:test';import assert from 'node:assert/strict';
import {sampleHeroArm,HERO_RIG,boardGrabArm} from '../src/hero-rig.js';
const lengths=p=>[Math.hypot(p.elbow.x-p.shoulder.x,p.elbow.y-p.shoulder.y),Math.hypot(p.wrist.x-p.elbow.x,p.wrist.y-p.elbow.y)];
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
test('ordinary idle proportions are the reference in every animation, including transitions',()=>{
 const expected=[Math.hypot(12,17),10];
 for(const side of [-1,1]){
  const idle=lengths(sampleHeroArm(side,{}));idle.forEach((n,i)=>close(n,expected[i]));
  for(const t of [0,.1,.25,.5,.75,1])for(const base of [{},{air:true},{grind:1},{air:true,grab:t,drop:32*t,crouch:t},{wave:t},{air:true,taunt:t,aim:{x:100,y:-150},facing:side,special:true},{air:true,reactionSpace:'self',reaction:{reach:t,inhale:t},mouth:{x:14,y:-103}},{falling:true,seat:t,push:t,flail:t,impact:t,time:.7}]){
   const arm=sampleHeroArm(side,base);lengths(arm).forEach((n,i)=>close(n,idle[i]));
   assert.ok(Math.hypot(arm.wrist.x-arm.shoulder.x,arm.wrist.y-arm.shoulder.y)<=expected[0]+expected[1]+1e-7);
  }
 }
});
