import test from 'node:test';
import assert from 'node:assert/strict';
import {HERO_TRICKS,selectTrick,sampleHeroArm,sampleHeroLeg,trickCarPose} from '../src/hero-rig.js';
import {joeReaction} from '../src/encounter.js';
import {obstacleDefinition} from '../src/content.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
test('one approved compact grab is used on every flight',()=>{
 assert.equal(HERO_TRICKS.length,1);
 for(let i=0;i<100;i++)assert.equal(selectTrick(i*713,i,0),0);
});
test('both soles follow photographed roof supports through car bank and rider lean',()=>{
 for(const side of [-1,1])for(const tilt of [-.085,-.04,.2])for(const grab of [.1,.5,1]){
  const car=trickCarPose(0,grab,.3),p=sampleHeroLeg(side,{air:true,grab,crouch:grab,drop:32*grab,tilt,car,offset:-29.5});
  const rotate=(p,a)=>({x:p.x*Math.cos(a)-p.y*Math.sin(a),y:p.x*Math.sin(a)+p.y*Math.cos(a)});
  const world=rotate(p.foot,tilt),support=rotate({x:side*25,y:-29.5+(side<0?1.6:4.8)},car.angle);
  near(world.x,car.x+support.x);near(world.y-29.5,car.y+support.y);
  near(p.angle+tilt,car.angle+(side<0?-.17:.31));
  near(Math.hypot(p.knee.x-p.hip.x,p.knee.y-p.hip.y),28);near(Math.hypot(p.ankle.x-p.knee.x,p.ankle.y-p.knee.y),27);
  if(grab===1)assert.ok(p.knee.y<p.hip.y-10);
 }
});
test('all directed rear-arm gestures point toward the target in any local quadrant',()=>{
 for(const id of ['trump','zuck','rogozin'])for(const aim of [{x:240,y:40},{x:-240,y:40},{x:70,y:-340},{x:-70,y:200}]){
  assert.equal(obstacleDefinition(id).reactions.hero.space,'target');
  const p=sampleHeroArm(-1,{air:true,grab:1,drop:32,taunt:1,aim,special:id!=='trump',reactionSpace:'target'});
  const a={x:p.wrist.x-p.shoulder.x,y:p.wrist.y-p.shoulder.y},b={x:aim.x-p.shoulder.x,y:aim.y-p.shoulder.y};
  near((a.x*b.x+a.y*b.y)/(Math.hypot(a.x,a.y)*Math.hypot(b.x,b.y)),1);
 }
});
test('podcast hand holds the joint at the mouth for inhalation, withdraws before smoke, and never aims at Joe',()=>{
 assert.equal(obstacleDefinition('joe').reactions.hero.space,'self');
 const mouth={x:15,y:-102},pose=(dx,aim)=>sampleHeroArm(-1,{air:true,grab:1,drop:32,reaction:joeReaction(dx),reactionSpace:'self',mouth,aim,special:true,taunt:1});
 for(const dx of [250,200,100]){const a=pose(dx,{x:999,y:400}),b=pose(dx,{x:-999,y:-400});assert.deepEqual(a.wrist,b.wrist);near(a.wrist.x+17,mouth.x);near(a.wrist.y,mouth.y);assert.equal(joeReaction(dx).smoke,0);}
 for(const dx of [-1,-60,-120]){const p=pose(dx);assert.ok(Math.hypot(p.wrist.x+17-mouth.x,p.wrist.y-mouth.y)>35);assert.equal(joeReaction(dx).inhale,0);assert.ok(joeReaction(dx).smoke>0);}
});

const {jumpCarPose}=await import('../src/roadster-flip.js');
test('ordinary jump plays every kickflip frame while manual grab and latched flight stay roof-up',()=>{
 const frames=new Set();
 for(let i=0;i<=120;i++){const p={airborne:true,time:i/120,launchVelocity:775,trickStarted:false,latched:false};const a=jumpCarPose(p,1550);assert.equal(a.cosmetic,true);frames.add(a.frame);for(const manual of [{trickStarted:true},{latched:true},{airborne:false}]){const b=jumpCarPose({...p,...manual},1550);assert.equal(b.cosmetic,false);assert.equal(b.frame,0);}}
 assert.deepEqual([...frames].sort(),[0,1,2,3,4,5,6,7,8]);
});
