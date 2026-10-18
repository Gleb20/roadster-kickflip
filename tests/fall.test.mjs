import test from 'node:test';
import assert from 'node:assert/strict';
import {createFall,beginFall,hastenFall,advanceFall,fallPose,fallPolygons} from '../src/fall.js';
import {createFlight,createEconomy,createPace,stumble,advancePace,sweptCollision} from '../src/gameplay.js';
import {createClock} from '../src/clock.js';
import {createDirector} from '../src/director.js';

test('fall rolls twice, returns both figures exactly to riding, and tapping accelerates without a pose jump',()=>{
 const run=taps=>{const f=createFall();beginFall(f,{angle:1,omega:3});let t=0,hits=0,index=0;while(f.active){if(index<taps.length&&t>=taps[index]){const before=fallPose(f);hastenFall(f);assert.deepEqual(fallPose(f),before);index++;}hits+=advanceFall(f,1/120).impacts;t+=1/120;}return {t,hits,pose:fallPose(f),f};};
 const normal=run([]),fast=run([.05,.15,.25,.35]);assert.equal(normal.hits,2);assert.equal(fast.hits,2);assert.ok(fast.t<normal.t*.7);assert.ok(fast.f.rate<=2.6);
 for(const r of [normal,fast]){assert.ok(Math.abs(r.pose.car.x)<1e-9);assert.equal(r.pose.car.y,12);assert.equal(r.pose.rider.y,95);assert.ok(Math.abs(Math.sin(r.pose.car.angle))<1e-9);assert.equal(r.pose.crouch,0);}
});
test('fall is deterministic across frame rates; reduced motion keeps feedback without shake/rotation',()=>{
 const run=fps=>{const clock=createClock(),f=createFall();beginFall(f,{angle:-1,omega:-3});let t=0;for(let i=0;i<=fps*3;i++)clock.advance(i*1000/fps,dt=>{if(t>=.3&&f.taps===0)hastenFall(f);advanceFall(f,dt);t+=dt;});return f;};
 assert.deepEqual(run(30),run(60));assert.deepEqual(run(60),run(120));
 const f=createFall();beginFall(f,{angle:2,omega:5},{reduced:true});advanceFall(f,.4);const pose=fallPose(f);assert.equal(pose.shake,0);assert.equal(pose.car.angle,0);assert.equal(pose.rider.angle,0);assert.ok(pose.crouch>0);
});
test('fall does not stop world motion or grant obstacle immunity, and freezes progression until rising',()=>{
 const f=createFall(),p=createFlight(),e=createEconomy(),pace=createPace();beginFall(f,{angle:.8,omega:4});stumble(pace);pace.falling=true;let distance=0;
 for(let i=0;i<200;i++){advancePace(pace,e,p,1/120);distance+=pace.speed/120;}assert.ok(distance>0);assert.equal(pace.progress,0);
 const pose=fallPose(f),polys=fallPolygons(pose);assert.equal(polys.length,2);assert.ok(polys.flat().every(v=>Number.isFinite(v.x)&&Number.isFinite(v.y)));
 assert.equal(sweptCollision({y:0,angle:0,fallPose:pose},{y:0,angle:0,fallPose:pose},{id:'truck',w:120,h:300},200,-200,1,1/120),true);
});
test('director alternates breathing space after two complex patterns, keeps fuel reserve and waits during falling',()=>{
 const pace=createPace(),e=createEconomy(),p=createFlight(100);pace.progress=155;pace.base=660;pace.speed=660;
 const S={t:155,speed:660,obs:[],anchor:100,entityId:0},d=createDirector({S,flight:p,pace,economy:e,spawnDistance:()=>1200,random:()=>.01});
 for(let i=0;i<8;i++){S.obs=[];d.spawn();assert.ok(d.state.last.route.timingMargin>=.035);assert.ok(d.state.hardStreak<=2);if(i===2)assert.equal(d.state.last.kind,'single');}
 const wave=d.state.wave;pace.falling=true;S.obs=[];d.spawn();assert.equal(d.state.wave,wave);
});
