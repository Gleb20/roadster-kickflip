import test from 'node:test';
import assert from 'node:assert/strict';
import {HERO_RIG,HERO_CLIPS,solveTwoBone,sampleClip,sampleHeroLeg,sampleHeroArm,createHeroAnimation,advanceHeroAnimation} from '../src/hero-rig.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
test('two-bone targets stay finite and preserve lengths outside the reachable ring',()=>{
 for(const upper of [15,28,36])for(const lower of [15,27,36])for(const target of [{x:0,y:0},{x:1000,y:-1000},{x:-4,y:9}])for(const side of [-1,1]){
  const root={x:0,y:0},{joint,end}=solveTwoBone(root,target,upper,lower,side);
  near(Math.hypot(joint.x,joint.y),upper);near(Math.hypot(end.x-joint.x,end.y-joint.y),lower);assert.ok(Number.isFinite(end.x)&&Number.isFinite(end.y));
 }assert.throws(()=>solveTwoBone({x:0,y:0},{x:1,y:1},0,2));
});
test('standing sole anchors remain on the photographed board through crouch and lean',()=>{
 for(const side of [-1,1])for(const tilt of [-.4,-.1,0,.2])for(const crouch of [0,.5,1]){
  const p=sampleHeroLeg(side,{tilt,crouch,drop:27*crouch});
  const world={x:p.foot.x*Math.cos(tilt)-p.foot.y*Math.sin(tilt),y:p.foot.x*Math.sin(tilt)+p.foot.y*Math.cos(tilt)};
  near(world.x,side*25);near(world.y,side<0?1.6:4.8);near(p.angle+tilt,side<0?-.17:.31);
 }
});
test('one deterministic sampler gives grab/fall priority over gesture layers',()=>{
 const a=sampleHeroArm(1,{grab:1,drop:20,wave:1,taunt:1,aim:{x:300,y:-20},facing:1,time:99}),b=sampleHeroArm(1,{grab:1,drop:20});assert.deepEqual(a.wrist,b.wrist);assert.deepEqual(a.elbow,b.elbow);
 const f=sampleHeroArm(-1,{grab:1,seat:1,push:1,flail:1,wave:1});assert.deepEqual(f.elbow,{x:-44,y:-75});assert.deepEqual(f.wrist,{x:-65,y:-90});
 const replacement={...HERO_RIG,shoulder:{x:18,y:-65},arm:{upper:30,lower:25}};const p=sampleHeroArm(1,{grab:1,drop:10},replacement);near(Math.hypot(p.elbow.x-p.shoulder.x,p.elbow.y-p.shoulder.y),30);near(Math.hypot(p.wrist.x-p.elbow.x,p.wrist.y-p.elbow.y),25);
 assert.deepEqual(sampleClip(HERO_CLIPS.brace,0,-1),sampleClip(HERO_CLIPS.brace,0,0));assert.deepEqual(sampleClip(HERO_CLIPS.brace,0,2),sampleClip(HERO_CLIPS.brace,0,1));
});
test('animation transitions depend on simulation time and sampling never advances them',()=>{
 const samples=[];for(const hz of [30,60,120]){const s=createHeroAnimation();for(let i=0;i<hz;i++)advanceHeroAnimation(s,1/hz,{target:true,distance:250,cameo:true});samples.push(s);}
 for(const field of ['taunt','wave','facing'])for(const s of samples)near(s[field],samples[0][field]);
 const before=structuredClone(samples[0]);for(let i=0;i<100;i++)sampleHeroArm(1,{wave:samples[0].wave,time:1});assert.deepEqual(samples[0],before);
});

test('fall impact lowers the raised hands and shoulders, and folds both forward legs without stretching',()=>{
 for(const side of [-1,1]){
  const rebound=sampleHeroArm(side,{falling:true,seat:1,flail:1,impact:0});
  const impact=sampleHeroArm(side,{falling:true,seat:1,flail:1,impact:1});
  assert.ok(rebound.wrist.y<rebound.shoulder.y-35,'both arms reach upward');
  assert.ok(impact.wrist.y>rebound.wrist.y+8);assert.ok(impact.shoulder.y>rebound.shoulder.y+3);
  for(const p of [rebound,impact]){near(Math.hypot(p.elbow.x-p.shoulder.x,p.elbow.y-p.shoulder.y),36);near(Math.hypot(p.wrist.x-p.elbow.x,p.wrist.y-p.elbow.y),36);}
  const a=sampleHeroLeg(side,{seat:1,drop:22,impact:0}),b=sampleHeroLeg(side,{seat:1,drop:22,impact:1});
  assert.ok(a.foot.x>a.hip.x+25);assert.ok(b.foot.x<a.foot.x-6,'feet draw inward at impact');
  for(const p of [a,b]){near(Math.hypot(p.knee.x-p.hip.x,p.knee.y-p.hip.y),28);near(Math.hypot(p.ankle.x-p.knee.x,p.ankle.y-p.knee.y),27);}
 }
});
