import test from 'node:test';
import assert from 'node:assert/strict';
import {createRun,RUN_STEP} from '../src/run.js';
import {createGrind,railContactHeight,advanceRail,RAIL,makeRail,validateRailRoute} from '../src/rails.js';
import {createFlight,launch,advanceFlight} from '../src/gameplay.js';
const blank=()=>{const r=createRun({seed:11});r.reset();r.S.next=r.Q.nextAt=1e9;return r;};
const catchRail=(r,{angle=0,omega=0}={})=>{r.S.rails=[{...makeRail(-100),uid:1}];Object.assign(r.P,{y:RAIL.height-65-(RAIL.belly-65)*Math.cos(angle)+1,vy:-300,airborne:true,angle,omega});for(let i=0;i<15&&!r.G.support;i++)r.step();};
test('rail is one-way and optional: drive below, rise through and miss bad angles',()=>{
 const r=blank();r.S.rails=[{...makeRail(-100),uid:1}];for(let i=0;i<60;i++)r.step();assert.equal(r.S.mode,'playing');assert.equal(r.G.support,null);assert.equal(r.G.pending,0);
 for(const pose of [{angle:Math.PI,omega:0},{angle:0,omega:5}]){const q=blank();catchRail(q,pose);assert.equal(q.G.support,null);assert.equal(q.S.mode,'playing');}
 const q=blank();q.S.rails=[{...makeRail(-100),uid:1}];Object.assign(q.P,{y:RAIL.height-20,vy:300,airborne:true});for(let i=0;i<20;i++)q.step();assert.equal(q.G.support,null);assert.equal(q.P.airborne,true);
});
test('descending capture preserves angle and pending reward until good ground landing',()=>{
 const r=blank();catchRail(r,{angle:.15});assert.equal(r.G.support,1);assert.equal(r.P.angle,.15);assert.equal(r.P.airborne,false);assert.ok(Math.abs(railContactHeight(r.P)-RAIL.height)<1e-8);
 for(let i=0;i<20;i++)r.step();assert.ok(r.G.pending>0);assert.equal(r.E.bonus,0);assert.equal(r.drainEvents().filter(e=>e.type==='landing').length,0);
 for(let i=0;i<500&&!r.lastLanding;i++)r.step();assert.equal(r.lastLanding.good,true);assert.ok(r.lastLanding.grindPoints>0);assert.equal(r.G.pending,0);
});
test('held primary does not jump on capture; new press can charge and jump from support',()=>{
 const r=blank();r.input.spin=true;catchRail(r);assert.ok(r.G.support);r.command('primary-up');assert.equal(r.G.support,1);r.command('primary-down');for(let i=0;i<24;i++)r.step();const y=r.P.y;r.command('primary-up');assert.equal(r.G.support,null);assert.equal(r.P.airborne,true);assert.ok(r.P.y>=y);assert.ok(r.P.vy>560);assert.ok(r.G.pending>0);
});
test('distance reward is independent of speed and cannot pay the same interval twice',()=>{
 for(const travel of [3,9,30]){const p=createFlight(),g=createGrind(),rail={...makeRail(0),w:1000,uid:1};g.support=1;p.y=RAIL.height-8;const e={multiplier:10,scoreFactor:1};let exits=0;
 for(let i=0;g.support&&i<1000;i++)exits+=advanceRail(g,p,{...p},[rail],travel,RUN_STEP,e).filter(v=>v.type==='rail-exit').length;
 assert.ok(Math.abs(g.pending-100)<1e-8);assert.equal(g.distance,1000);assert.equal(exits,1);assert.equal(p.vy,0);assert.equal(p.airborne,true);
 rail.x=-100;g.support=1;p.airborne=false;advanceRail(g,p,{...p},[rail],50,RUN_STEP,{multiplier:50,scoreFactor:3});assert.ok(Math.abs(g.pending-100)<1e-8);
 }
});
test('x3 expiry affects only new grind distance; settlement never multiplies it again',()=>{
 const r=blank();catchRail(r);r.Q.active.score=.1;r.E.multiplier=20;r.E.meter=1;let paid=0;
 while(!r.lastLanding){r.step();for(const e of r.drainEvents())if(e.type==='rail-travel')paid+=e.points;}
 // Include reward already earned on the catch frame.
 assert.ok(r.lastLanding.grindPoints>=paid);assert.ok(r.lastLanding.grindPoints-paid<1);assert.ok(r.lastLanding.grindPoints>r.lastLanding.grindDistance*.1*2);assert.equal(r.E.scoreFactor,1);
 const settled=r.E.bonus;for(let i=0;i<20;i++)r.step();assert.equal(r.E.bonus,settled);
});
test('jump booster is captured at rail takeoff; supported thrust spends no fuel',()=>{
 const r=blank();catchRail(r);const fuel=r.P.fuel;r.command('thrust-on');for(let i=0;i<4;i++)r.step();assert.equal(r.P.fuel,fuel);assert.equal(r.P.thrusting,false);r.command('thrust-off');r.Q.active.jump=.01;r.command('primary-down');r.command('primary-up');assert.equal(r.P.launchVelocity,560*1.25);r.step();r.step();assert.equal(r.Q.active.jump,undefined);assert.equal(r.P.launchVelocity,700);
});
test('chip rescue discards the unfinished grind; shield preserves it; rough ground landing discards it',()=>{
 for(const shield of [false,true]){const r=blank();catchRail(r);for(let i=0;i<12;i++)r.step();const pending=r.G.pending;r.Q.hearts=1;if(shield)r.Q.active.shield=2;r.S.obs.push({id:'truck',x:0,w:100,h:100,altitude:r.P.y,uid:8});r.step();assert.equal(r.S.mode,'playing');assert.equal(r.Q.hearts,shield?1:0);if(shield)assert.ok(r.G.pending>=pending);else assert.equal(r.G.pending,0);r.S.obs=[];while(!r.lastLanding)r.step();assert.equal(r.lastLanding.grindPoints>0,shield);}
 const r=blank();catchRail(r);for(let i=0;i<5;i++)r.step();r.command('primary-down');r.command('primary-up');Object.assign(r.P,{y:1,vy:-200,angle:Math.PI,omega:0});r.step();assert.equal(r.lastLanding.good,false);assert.equal(r.lastLanding.grindPoints,0);assert.equal(r.G.pending,0);
});
test('successive flights on one rail keep turns without banking at either capture',()=>{
 const r=blank();catchRail(r,{angle:-Math.PI*2});assert.equal(r.G.turns,1);assert.equal(r.E.flips,0);r.command('primary-down');r.command('primary-up');Object.assign(r.P,{y:RAIL.height+1,vy:-300,angle:-Math.PI*2,omega:0});for(let i=0;i<15&&!r.G.support;i++)r.step();assert.equal(r.G.turns,2);assert.equal(r.E.flips,0);while(!r.lastLanding)r.step();assert.equal(r.lastLanding.turns,2);assert.equal(r.E.flips,2);
});
test('pause freezes rail support and reward; checkpoint roundtrip and restart preserve their contracts',()=>{
 const r=blank();catchRail(r);r.S.mode='paused';const saved=r.snapshot();for(let i=0;i<20;i++)r.step();assert.deepEqual(r.snapshot(),saved);r.S.mode='playing';const c=createRun({record:false});c.restore(JSON.parse(JSON.stringify(r.snapshot())));for(let i=0;i<500;i++){r.step();c.step();r.drainEvents();c.drainEvents();}assert.deepEqual(c.snapshot(),r.snapshot());r.reset();assert.deepEqual(r.G,createGrind());assert.deepEqual(r.S.rails,[]);
});
test('rail generator admits safe fuel-free routes at ordinary, boosted and maximum speed',()=>{
 for(const speed of [360,510,660])for(const boosted of [false,true]){const r=blank();r.pace.progress=(speed-360)/2;r.pace.base=r.pace.speed=speed;r.S.speed=speed;if(boosted){r.Q.active={speed:8,jump:8};r.Q.speedBlend=1;r.pace.boost=.35;r.S.speed=r.pace.speed=speed*1.35;}
 r.P.fuel=0;r.director.state.wave=RAIL.firstWave;r.director.spawn();assert.equal(r.director.state.last.kind,'rail');const route=r.director.state.last.route,actions=new Map();for(const a of route.actions){const tick=Math.round(a.at/RUN_STEP);if(!actions.has(tick))actions.set(tick,[]);actions.get(tick).push(a.action==='hold'?'primary-down':'primary-up');}
 let captured=false,landed=false;for(let i=0;i<1500&&!landed;i++){for(const a of actions.get(r.S.tick)||[])r.command(a);r.step();for(const e of r.drainEvents()){if(e.type==='rail-catch')captured=true;if(e.type==='landing'&&captured)landed=e.landed.good;}}
 assert.ok(captured,`capture at ${speed}, boost=${boosted}`);assert.ok(landed);assert.equal(r.P.fuel,0);assert.equal(r.S.obs.length,0);
 }
});
test('an actual ground landing leaves a full breather before the next wave',()=>{
 const r=blank();catchRail(r);r.S.next=0;while(!r.lastLanding)r.step();assert.ok(r.S.next>=RAIL.exitSeconds-RUN_STEP-1e-8);assert.equal(r.S.obs.length,0);
});
