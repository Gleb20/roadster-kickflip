import test from 'node:test';
import assert from 'node:assert/strict';
import {HERO_HANDS,HERO_TRICKS,selectTrick,trickCarPose,heroToWorld,worldToHero,sampleHeroArm,sampleHeroLeg} from '../src/hero-rig.js';
import {createCash,advanceCash} from '../src/cash.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
test('airborne tuck folds knees up toward chest rather than down through the car',()=>{
 for(let trick=0;trick<HERO_TRICKS.length;trick++)for(const side of [-1,1]){
  const p=sampleHeroLeg(side,{air:true,grab:1,crouch:1,drop:32,trick});
  near(Math.hypot(p.knee.x-p.hip.x,p.knee.y-p.hip.y),28);near(Math.hypot(p.ankle.x-p.knee.x,p.ankle.y-p.knee.y),27);
  if(trick===0)assert.ok(p.knee.y<p.hip.y-15,'compact tuck raises both knees');
 }
});
test('front anatomical left grip survives rear-arm interactions and never swaps with target side',()=>{
 assert.deepEqual(HERO_HANDS,{grab:1,interaction:-1});
 for(const facing of [-1,1])for(const angle of [0,.7,Math.PI,Math.PI*1.5]){
  const base={air:true,grab:1,drop:32,parentAngle:angle,grabPoint:{x:16,y:11}};
  const neutral=sampleHeroArm(1,base),acting=sampleHeroArm(1,{...base,special:true,guns:true,taunt:1,aim:{x:facing*150,y:-180},facing});
  assert.deepEqual(acting.wrist,neutral.wrist);
  const rear=sampleHeroArm(-1,{...base,special:true,guns:true,taunt:1,aim:{x:facing*150,y:-180},facing});
  assert.notDeepEqual(rear.wrist,sampleHeroArm(-1,base).wrist);
  for(const p of [acting,rear]){near(Math.hypot(p.elbow.x-p.shoulder.x,p.elbow.y-p.shoulder.y),36);near(Math.hypot(p.wrist.x-p.elbow.x,p.wrist.y-p.elbow.y),36);}
 }
});
test('car roof faces the rider through every trick and complete turns; encounter points transform back to the same world target',()=>{
 for(let trick=0;trick<HERO_TRICKS.length;trick++)for(const grab of [0,.1,.5,1])for(let a=-Math.PI*4;a<Math.PI*4;a+=.17){
  const car=trickCarPose(trick,grab,.3),roof={x:Math.sin(car.angle),y:-Math.cos(car.angle)},toward={x:-car.x,y:-70-car.y};
  assert.ok(roof.x*toward.x+roof.y*toward.y>55,'roof, never tyres, faces torso');
  const p={x:170,y:-86},flight={y:250,angle:a},local=worldToHero(p,flight,-29.5),world=heroToWorld(local,flight,-29.5);
  near(world.x,p.x);near(world.y,p.y);
 }
});
test('emitted cash persists after firing stops, starts falling continuously, scrolls with world and expires with a hard budget',()=>{
 const cash=createCash(),streams=[{id:'hero',from:{x:0,y:-150},to:{x:140,y:-60},targetMoves:true}];
 for(let i=0;i<60;i++)advanceCash(cash,1/120,{streams,speed:360});assert.ok(cash.notes.length>=3);
 const before=cash.notes.map(p=>({id:p.id,x:p.x,y:p.y}));advanceCash(cash,0,{streams:[],speed:360});
 assert.equal(cash.notes.length,before.length);assert.ok(cash.notes.every(p=>p.falling));
 cash.notes.forEach((p,i)=>{near(p.x,before[i].x);near(p.y,before[i].y);});
 const oldY=cash.notes[0].y;for(let i=0;i<60;i++)advanceCash(cash,1/120,{streams:[],speed:360});assert.ok(cash.notes[0].y>oldY+10);
 for(let i=0;i<2400;i++)advanceCash(cash,1/120,{streams,speed:360});assert.ok(cash.notes.length<=cash.limit);
 for(let i=0;i<1200;i++)advanceCash(cash,1/120,{streams:[],speed:360});assert.equal(cash.notes.length,0);
});
