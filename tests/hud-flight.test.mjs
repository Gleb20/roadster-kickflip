import test from 'node:test';
import assert from 'node:assert/strict';
import {mphFromKmh,multiplierAppearance} from '../src/hud.js';
import {boardGrabArm,HERO_RIG,rotateAboutHip} from '../src/hero-rig.js';
import {createFlight,launch,advanceFlight} from '../src/gameplay.js';

test('speed readout converts km/h to mph and multiplier uses five tier colours',()=>{
 assert.ok(Math.abs(mphFromKmh(130)-80.778)<.001);assert.ok(Math.abs(mphFromKmh(400)-248.548)<.001);assert.equal(mphFromKmh(-5),0);
 assert.deepEqual([1,1.9,2,2.9,3,4,5].map(x=>multiplierAppearance(x,1).tier),[1,1,2,2,3,4,5]);
 const low=multiplierAppearance(3,0),high=multiplierAppearance(3,1);assert.ok(high.opacity>low.opacity&&high.scale>low.scale&&high.shake>low.shake);assert.equal(multiplierAppearance(1,1).shake,0);
});
test('grab uses the idle-sized skeleton and squats with moderate torso lean to reach the roof',()=>{
 const contact={x:13,y:9.5},angle=.64,drop=43,shift=-20;
 const nearArm=boardGrabArm(1,drop,angle,HERO_RIG,contact,1,shift),point=rotateAboutHip(nearArm.wrist,angle);
 assert.ok(Math.abs(point.x+shift-contact.x)<1e-8);assert.ok(Math.abs(point.y+drop-contact.y)<1e-8);
 for(const side of [-1,1])for(const target of [contact,{x:1000,y:1000}]){
  const a=boardGrabArm(side,drop,angle,HERO_RIG,target,1,shift);
  assert.ok(Math.abs(Math.hypot(a.elbow.x-a.shoulder.x,a.elbow.y-a.shoulder.y)-HERO_RIG.arm.upper)<1e-8);
  assert.ok(Math.abs(Math.hypot(a.wrist.x-a.elbow.x,a.wrist.y-a.elbow.y)-HERO_RIG.arm.lower)<1e-8);
 }
});
test('first jump is cosmetic; manual rotation smoothly tucks and launch resets pose',()=>{
 const p=createFlight();launch(p,.5);for(let i=0;i<20;i++)advanceFlight(p,1/120);assert.equal(p.trickStarted,false);assert.equal(p.turns,0);assert.equal(p.angle,0);
 advanceFlight(p,1/120,{spin:true});assert.equal(p.trickStarted,true);assert.ok(p.grab<.1);
 for(let i=0;i<20;i++)advanceFlight(p,1/120,{spin:true});assert.equal(p.grab,1);
 p.airborne=false;advanceFlight(p,1/120);assert.ok(p.grab<1);launch(p,0);assert.equal(p.trickStarted,false);assert.equal(p.grab,0);
});
test('35 degrees / 200deg per second lands safely; inverted and fast tumbles still fail',()=>{
 const land=(angle,omega)=>{const p=createFlight();launch(p,1);p.y=.001;p.vy=-20;p.angle=angle*Math.PI/180;p.omega=omega*Math.PI/180;return advanceFlight(p,1/120);};
 assert.equal(land(35,200).good,true);assert.equal(land(45,0).good,false);assert.equal(land(0,300).good,false);assert.equal(land(180,0).good,false);
});
