import test from 'node:test';
import assert from 'node:assert/strict';
import {createBoosters,collectBooster,advanceBoosters,activeBooster,BOOSTERS} from '../src/boosters.js';
import {createRun,RUN_STEP,verifyReplay} from '../src/run.js';
import {launch,advanceFlight,createFlight,createEconomy,passObstacle,settleLanding} from '../src/gameplay.js';
const blank=()=>{const r=createRun({seed:11});r.reset();r.S.next=1e9;r.Q.nextAt=1e9;return r;};
const hit=r=>r.S.obs.push({id:'truck',w:110,h:41,inset:5,x:0,uid:++r.S.entityId,passed:false});
test('three timed slots, two hearts, refresh without strength stacking',()=>{
 const q=createBoosters(7);for(const id of ['shield','speed','jump'])assert.ok(collectBooster(q,id));assert.equal(collectBooster(q,'score'),false);
 advanceBoosters(q,1);assert.ok(collectBooster(q,'shield'));assert.equal(q.active.shield,BOOSTERS.shield.seconds);
 assert.ok(collectBooster(q,'life'));assert.ok(collectBooster(q,'life'));assert.equal(collectBooster(q,'life'),false);assert.equal(q.hearts,2);
});
test('shield smashes once, preserves combo and never consumes a heart',()=>{
 const r=blank();collectBooster(r.Q,'shield');collectBooster(r.Q,'life');r.E.multiplier=30;r.E.meter=1;hit(r);r.step();
 assert.equal(r.S.mode,'playing');assert.equal(r.Q.hearts,1);assert.equal(r.E.multiplier,30);assert.equal(r.S.obs[0].smashed,true);const bonus=r.E.bonus;for(let i=0;i<20;i++)r.step();assert.equal(r.E.bonus,bonus);assert.equal(r.drainEvents().filter(e=>e.type==='smash').length,1);
});
test('automatic heart rescue preserves points and active effects and protects through a wide obstacle',()=>{
 const r=blank();collectBooster(r.Q,'life');collectBooster(r.Q,'life');collectBooster(r.Q,'score');r.E.bonus=300;r.E.multiplier=40;r.E.streak=.2;
 hit(r);r.S.obs[0].w=2500;r.step();assert.equal(r.S.mode,'playing');assert.equal(r.Q.hearts,1);assert.equal(r.E.multiplier,10);assert.equal(r.E.streak,0);assert.ok(r.E.bonus>=300);assert.ok(activeBooster(r.Q,'score'));
 for(let i=0;i<900;i++)r.step();assert.equal(r.Q.hearts,1);assert.equal(r.S.mode,'playing');hit(r);r.step();assert.equal(r.Q.hearts,0);
});
test('no hearts retains lethal collision and paused step freezes all timers',()=>{
 const r=blank();collectBooster(r.Q,'jump');r.S.mode='paused';const before=r.snapshot();for(let i=0;i<120;i++)r.step();assert.deepEqual(r.snapshot(),before);r.S.mode='playing';hit(r);r.step();assert.equal(r.S.mode,'dead');
});
test('jump strength is captured at takeoff and timed speed fades smoothly',()=>{
 const r=blank();collectBooster(r.Q,'jump');r.Q.active.jump=.02;r.command('primary-down');r.command('primary-up');const takeoff=r.P.vy;assert.ok(takeoff>560);for(let i=0;i<4;i++)r.step();assert.equal(activeBooster(r.Q,'jump'),false);assert.equal(r.P.launchVelocity,takeoff);
 const a=createFlight(),b=createFlight();launch(a);launch(b);for(let i=0;i<4;i++)advanceFlight(b,RUN_STEP);assert.ok(r.P.y>b.y);
 const s=blank();collectBooster(s.Q,'speed');const base=s.S.speed;s.step();assert.ok(s.S.speed>base);assert.ok(s.S.speed<base*1.1);s.Q.active.speed=.01;for(let i=0;i<100;i++)s.step();assert.equal(s.Q.speedBlend,0);
});
test('x3 applies once above x5 and expires independently of combo',()=>{
 const e=createEconomy();e.multiplier=50;e.scoreFactor=3;assert.equal(passObstacle(e),750);const p=createFlight();assert.equal(settleLanding(e,p,{good:true,perfect:true,turns:1},{late:0,near:0}).points,2250);assert.equal(e.multiplier,50);
 const r=blank();collectBooster(r.Q,'score');r.Q.active.score=.01;r.E.multiplier=50;r.E.meter=1;r.step();r.step();assert.equal(r.E.scoreFactor,1);assert.equal(r.E.multiplier,50);
});
test('seeded pickup schedule and checkpoint restoration are deterministic',()=>{
 const a=createRun({seed:12}),b=createRun({seed:12});a.reset();b.reset();for(const r of [a,b]){r.S.next=1e9;r.Q.nextAt=0;}
 for(let i=0;i<5;i++){a.step();b.step();}assert.deepEqual(a.Q,b.Q);assert.equal(a.Q.pickups.length,1);
 const c=createRun({record:false});c.restore(JSON.parse(JSON.stringify(a.snapshot())));for(let i=0;i<300;i++){a.step();c.step();}assert.deepEqual(c.snapshot(),a.snapshot());
});
test('real pickup, altered jump and speed replay exactly in the server checkpoint simulation',async()=>{
 const {verifyChunk}=await import('../supabase/chunk.mjs');const r=createRun({seed:17}),actions=new Map();r.reset();let wave=0,pickups=0;
 while(r.S.mode==='playing'){
  for(const action of actions.get(r.S.tick)||[])r.command(action);r.step();for(const e of r.drainEvents())if(e.type==='pickup')pickups++;
  if(r.director.state.wave!==wave){wave=r.director.state.wave;if(r.S.t<95)for(const e of r.director.state.last.route.actions){const tick=r.S.tick+Math.round(e.at/RUN_STEP);if(!actions.has(tick))actions.set(tick,[]);actions.get(tick).push({hold:'primary-down',jump:'primary-up','thrust-on':'thrust-on','thrust-off':'thrust-off'}[e.action]);}}
  assert.ok(r.S.t<240);
 }
 assert.ok(pickups>=3);assert.deepEqual(verifyReplay(r.replay()),{score:r.S.score,flips:r.E.flips,ticks:r.S.tick});let state=null,result;
 do{result=verifyChunk(r.replay(),state,{maxTicks:277,budgetMs:Infinity});state=result.checkpoint?JSON.parse(JSON.stringify(result.checkpoint)):null;}while(result.outcome==='pending');assert.equal(result.outcome,'accepted');assert.equal(result.result.score,r.S.score);
 assert.equal(verifyChunk({...r.replay(),ticks:r.S.tick+1},null,{maxTicks:1e6,budgetMs:Infinity}).outcome,'rejected');
});
test('score pickup triples distance earnings without multiplying previously banked points',()=>{
 const a=blank(),b=blank();a.E.bonus=b.E.bonus=500;collectBooster(b.Q,'score');for(let i=0;i<120;i++){a.step();b.step();}assert.equal(a.S.distance,b.S.distance);assert.ok(Math.abs((b.S.score-500)-3*(a.S.score-500))<=2);assert.equal(a.E.multiplier,b.E.multiplier);
});
test('restart clears all temporary state including captured jump strength and score factor',()=>{
 const r=blank();collectBooster(r.Q,'life');collectBooster(r.Q,'score');r.E.scoreFactor=3;r.P.jumpFactor=1.25;r.pace.boost=.35;r.Q.grace=2;r.reset();assert.equal(r.Q.hearts,0);assert.deepEqual(r.Q.active,{});assert.equal(r.E.scoreFactor,1);assert.equal(r.P.jumpFactor,1);assert.equal(r.pace.boost,0);
});
test('heart rescue cancels the impacted flight reward instead of confirming old flips on landing',()=>{
 const r=blank();collectBooster(r.Q,'life');r.P.airborne=true;r.P.y=8;r.P.vy=-100;r.P.maxTurn=Math.PI*2;r.P.turns=1;hit(r);r.S.obs[0].w=1000;r.step();assert.ok(r.Q.spoiledFlight);for(let i=0;i<90;i++)r.step();assert.equal(r.E.flips,0);assert.equal(r.E.bonus,0);assert.equal(r.S.mode,'playing');
});

test('expanded pickup capture reaches beyond the sphere, grants once and leaves full or falling riders alone',()=>{
 const r=blank();r.Q.pickups=[{id:'life',uid:91,x:108,y:195}];r.step();assert.equal(r.Q.hearts,1);assert.equal(r.Q.pickups.length,0);const events=r.drainEvents().filter(e=>e.type==='pickup');assert.equal(events.length,1);assert.equal(events[0].uid,91);assert.ok(Number.isFinite(events[0].x));for(let i=0;i<50;i++)r.step();assert.equal(r.Q.hearts,1);
 const full=blank();collectBooster(full.Q,'life');collectBooster(full.Q,'life');full.Q.pickups=[{id:'life',uid:1,x:108,y:104}];full.step();assert.equal(full.Q.pickups.length,1);assert.equal(full.drainEvents().filter(e=>e.type==='pickup').length,0);
 const fallen=blank();fallen.F.active=true;fallen.Q.pickups=[{id:'life',uid:8,x:100,y:104}];fallen.step();assert.equal(fallen.Q.hearts,0);assert.equal(fallen.Q.pickups.length,1);
 const far=blank();far.Q.pickups=[{id:'life',uid:1,x:108,y:205}];far.step();assert.equal(far.Q.hearts,0);
});
test('enlarged pickup sweep does not miss fast crossings and freezes on pause',()=>{
 const r=blank();r.Q.pickups=[{id:'score',uid:2,x:115,y:100}];r.P.vx=40000;r.step();assert.ok(activeBooster(r.Q,'score'));assert.equal(r.drainEvents().filter(e=>e.type==='pickup').length,1);
 const p=blank();p.Q.pickups=[{id:'life',uid:1,x:110,y:104}];p.S.mode='paused';const saved=p.snapshot();p.step();assert.deepEqual(p.snapshot(),saved);
});

test('pickup motion floats, leans toward the rider and flies into a moving torso while shrinking',async()=>{
 const {pickupPose,collectionPose,PICKUP_FLIGHT_SECONDS}=await import('../src/booster-art.js'),orb={x:150,y:104,uid:3},p={y:0,angle:0};
 const a=pickupPose(orb,p,0,{attract:false}),b=pickupPose(orb,p,.5,{attract:false});assert.equal(a.x,b.x);assert.notEqual(a.y,b.y);assert.ok(Math.abs(a.y-orb.y)<=6);
 const leaned=pickupPose(orb,p,0);assert.ok(leaned.x<a.x&&leaned.x>0);
 const start=pickupPose(orb,p,0),first=collectionPose(start,p,0),mid=collectionPose(start,{y:40,angle:0},PICKUP_FLIGHT_SECONDS*.5),last=collectionPose(start,{y:80,angle:0},PICKUP_FLIGHT_SECONDS);
 assert.equal(first.x,start.x);assert.equal(first.size,1);assert.ok(mid.x<start.x);assert.ok(mid.size<1&&mid.size>0);assert.equal(last.x,0);assert.equal(last.y,180);assert.equal(last.size,0);assert.equal(last.done,true);
 const reduced=pickupPose(orb,p,1,{reduced:true});assert.deepEqual(reduced,{x:150,y:104});const fade=collectionPose(reduced,p,.065,true);assert.equal(fade.x,150);assert.equal(fade.y,104);assert.equal(fade.size,1);assert.ok(fade.alpha>0&&fade.alpha<1);
});
