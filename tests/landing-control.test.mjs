import test from 'node:test';import assert from 'node:assert/strict';
import {createFlight,launch,advanceFlight,createEconomy,settleLanding,TAU} from '../src/gameplay.js';
import {GAMEPLAY as C} from '../src/gameplay-config.js';
import {createHeroAnimation,advanceHeroAnimation,landingCrouch} from '../src/hero-rig.js';
const dt=1/120;
function land(q,hold){const p=createFlight();launch(p,q);for(let t=0;t<3;t+=dt){const r=advanceFlight(p,dt,{spin:t<hold});if(r)return r;}throw Error('no landing');}
test('hold tucks and speeds up; release opens and brakes without automatic alignment; rehold works',()=>{
 const p=createFlight();launch(p,1);for(let i=0;i<30;i++)advanceFlight(p,dt,{spin:true});assert.equal(p.grab,1);assert.equal(p.omega,-7.2);
 const angle=p.angle;for(let i=0;i<30;i++)advanceFlight(p,dt);assert.equal(p.grab,0);assert.ok(Math.abs(p.omega+1.8)<1e-9);assert.ok(p.angle<angle);assert.ok(p.angle< -1,'does not auto-align');
 for(let i=0;i<20;i++)advanceFlight(p,dt,{spin:true});assert.equal(p.grab,1);assert.equal(p.omega,-7.2);
});
test('ordinary jump stays upright; controlled release lands a flip, overhold falls',()=>{
 const ordinary=land(0,0);assert.equal(ordinary.good,true);assert.equal(ordinary.perfect,true);
 const ideal=land(.5,.8);assert.equal(ideal.good,true);assert.equal(ideal.perfect,true);assert.equal(ideal.turns,1);
 assert.equal(land(.5,3).good,false);assert.equal(land(.5,.3).good,false);
 // Forgiving zone is substantially wider than the perfect window.
 assert.equal(land(.5,.7).good,true);assert.equal(land(.5,.7).perfect,false);
});
test('perfect +/-10 and safe +/-40 degree boundaries repeat across full turns and reject fast impact',()=>{
 for(const turns of [0,1,2])for(const sign of [-1,1])for(const [degrees,good,perfect] of [[0,true,true],[10,true,true],[10.01,true,false],[40,true,false],[40.01,false,false]]){
  const p=createFlight();launch(p,1);p.y=.001;p.vy=-100;p.angle=-turns*TAU+sign*degrees*Math.PI/180;p.omega=0;
  const r=advanceFlight(p,dt);assert.equal(r.good,good,`${turns}/${sign}/${degrees}`);assert.equal(r.perfect,perfect);
 }
 const p=createFlight();launch(p,1);p.y=.001;p.vy=-100;p.angle=0;p.omega=-7.2;assert.equal(advanceFlight(p,dt,{spin:true}).perfect,false);
});
test('perfect bonus uses current multiplier once; safe has normal rewards; failed has none',()=>{
 for(const [perfect,good,expected] of [[true,true,300],[false,true,200],[true,false,0]]){
  const e=createEconomy(),p=createFlight(0);e.multiplier=20;const r=settleLanding(e,p,{good,perfect,turns:1});assert.equal(r.points,expected);assert.equal(e.bonus,expected);assert.equal(r.perfect,good&&perfect);assert.equal(p.fuel,good?25:0);
 }
});
test('touchdown compresses then extends once, freezes with zero dt, resets and excludes fall/new flight',()=>{
 const s=createHeroAnimation();advanceHeroAnimation(s,dt,{airborne:true,vy:-800});advanceHeroAnimation(s,dt,{airborne:false});assert.equal(landingCrouch(s),0);
 advanceHeroAnimation(s,.14);const peak=landingCrouch(s);assert.ok(peak>.3&&peak<.5);advanceHeroAnimation(s,0);assert.equal(landingCrouch(s),peak);advanceHeroAnimation(s,.14);assert.ok(landingCrouch(s)<1e-8);
 advanceHeroAnimation(s,dt,{airborne:true});assert.ok(landingCrouch(s)<1e-8);advanceHeroAnimation(s,dt,{falling:true});assert.ok(landingCrouch(s)<1e-8);assert.equal(landingCrouch(createHeroAnimation()),0);
});
