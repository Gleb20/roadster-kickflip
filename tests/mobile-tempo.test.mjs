import test from 'node:test';
import assert from 'node:assert/strict';
import {createRun} from '../src/run.js';
import {speedView} from '../src/speed-feedback.js';

test('an uncollected pickup does not reserve an empty road instead of the next encounter',()=>{
 const run=createRun({seed:17});run.reset();run.S.next=0;
 run.Q.pickups=[{id:'score',uid:1,x:900,y:300}];run.Q.nextAt=1e9;
 run.step();assert.ok(run.S.obs.length||run.S.rails.length,'pickup must not block director');
});

test('experienced start is faster, deterministic, and cannot be selected mid-run',()=>{
 const a=createRun({seed:17}),b=createRun({seed:17});a.reset();b.reset(17,{experienced:true});
 assert.ok(b.S.speed>a.S.speed*1.2);assert.equal(b.replay().events[0][0],0);
 b.step();assert.equal(b.command('experienced-start'),false);
});

test('mobile encounter geometry starts outside the portrait viewport',()=>{
 let checked=0,air=0;
 for(const seed of [17,56,932])for(const speed of [550,740,960]){
  const run=createRun({seed});run.reset();Object.assign(run.pace,{base:speed,speed,progress:150});
  Object.assign(run.S,{t:100,tick:12000,speed,score:70000});
  run.director.update();
  Object.assign(run.director.state,{groundCount:7,airCount:3,groundSinceAir:9,lastAirAt:0,lastRailAirAt:0,viewStrength:(speed-360)/300,viewAt:100,legStartedAt:50,airBiomes:['spaceport','tesla-factory']});
  run.director.spawn();if(run.director.state.last?.kind==='rail-air')air++;
  for(const o of [...run.S.obs,...run.S.rails])for(const [w,h] of [[320,568],[390,844],[440,956]]){
   const view=speedView(w,h,speed,run.director.state.viewStrength);
   assert.ok(view.x+o.x*view.scale>=w,`${seed}/${speed}/${o.id}: ${view.x+o.x*view.scale} < ${w}`);checked++;
  }
 }
 assert.ok(checked>0);assert.ok(air>0,'actual accepted air/rail candidate required');
});

import {scoreStage,scorePace} from '../src/gameplay-config.js';
import {safePickupSpot,pickupSpots,createBoosters,offerBooster} from '../src/boosters.js';
import {obstacleDefinition} from '../src/content.js';
import {validateReplay,verifyReplay} from '../src/run.js';
import {verifyChunk} from '../supabase/chunk.mjs';

test('challenge follows score, including bonus thresholds, while first-run relief is temporary',()=>{
 assert.equal(scoreStage(99999),5);assert.equal(scoreStage(100000),6);
 for(const score of [0,2500,7500,15000,30000,60000,100000]){
  assert.ok(scorePace(score,true,0)>scorePace(score,false,0));
  assert.equal(scorePace(score,true,20),scorePace(score,false,20));
 }
 assert.ok(scorePace(100000,true)>scorePace(30000,true));
 assert.equal(scorePace(100000,true),scorePace(1000000,true));
});

test('a score jump changes the future challenge without teleporting visible obstacles',()=>{
 const r=createRun({seed:17});r.reset(17,{experienced:true});r.S.next=1e9;
 r.S.obs=[{...obstacleDefinition('truck'),uid:1,x:300}];
 const oldSpeed=r.S.speed;r.E.bonus=100000;const x=r.S.obs[0].x;r.step();
 assert.ok(r.S.speed-oldSpeed<=70/120+1e-8);
 assert.ok(Math.abs(r.S.obs[0].x-(x-r.S.speed/120))<1e-8);
 assert.equal(r.S.obs[0].uid,1);
});

test('pickup placement accounts for the capture region and moving air enemies',()=>{
 const ground={...obstacleDefinition('truck'),x:1000};
 assert.equal(safePickupSpot({x:1055,y:104},[ground],900),false);
 assert.equal(safePickupSpot({x:1055,y:ground.h+230},[ground],900),true);
 const air={...obstacleDefinition('primeDrone'),x:1350,approachSpeed:100};
 assert.equal(safePickupSpot({x:1055,y:air.altitude+30},[air],900),false);
 const pair=[ground,{...ground,x:1650}];const spots=pickupSpots(pair,[],900);
 assert.ok(spots.some(s=>s.y===104));assert.ok(spots.some(s=>s.y>200));
 for(const s of spots)assert.ok(safePickupSpot(s,pair,900));
 const q=createBoosters(17);q.nextAt=0;const before=structuredClone(q);
 assert.equal(offerBooster(q,{time:1,speed:900,clear:true,obstacles:[],rails:[]}),null);
 assert.deepEqual(q,before,'no safe site defers the bonus without spending its bag');
});

test('both start profiles replay exactly in full and JSON checkpoint verification',()=>{
 for(const experienced of [false,true]){
  const r=createRun({seed:17});r.reset(17,{experienced});while(r.S.mode==='playing'&&r.S.t<30)r.step();
  assert.equal(r.S.mode,'dead');const replay=r.replay(),exact=verifyReplay(replay);let checkpoint=null,result;
  do{result=verifyChunk(replay,checkpoint,{maxTicks:37,budgetMs:Infinity});checkpoint=result.checkpoint?JSON.parse(JSON.stringify(result.checkpoint)):null;}while(result.outcome==='pending');
  assert.equal(result.outcome,'accepted');assert.deepEqual(result.result,exact);
  for(const events of [[[1,6]],[[0,6],[0,6]],[[0,0],[0,6]]])assert.throws(()=>validateReplay({...replay,events}));
 }
});

test('score-driven encounter matrix keeps a bounded proved hazard across boosts and thrust',()=>{
 for(const score of [0,7500,30000,60000,100000,180000])for(const boost of [0,.05,8])for(const streak of [0,.25])for(const vx of [-260,0,260]){
  const r=createRun({seed:932});r.reset(932,{experienced:true});const base=scorePace(score,true,45),speed=base*(1+streak)*(boost?1.35:1)+vx;
  Object.assign(r.S,{t:45,tick:5400,score,speed,next:0});Object.assign(r.E,{bonus:score,streak,streakLeft:4});Object.assign(r.pace,{base,speed,progress:45,boost:boost?.35:0});r.P.vx=vx;
  Object.assign(r.Q,{nextAt:1e9,active:boost?{speed:boost}:{},speedBlend:boost?1:0});r.director.update();
  Object.assign(r.director.state,{wave:10,groundCount:10,groundSinceAir:9,lastAirAt:0,airCount:3,viewStrength:Math.max(0,(speed-360)/300),viewAt:45,legStartedAt:40,airBiomes:['spaceport','tesla-factory'],history:['truck','truck'],active:false,restUntil:null,sinceTall:2});
  r.director.spawn();let waited=0;while(r.director.state.wave===10&&waited++<120){r.step();r.drainEvents();}
  const d=r.director.state.last,context=JSON.stringify({score,boost,streak,vx,waited});assert.equal(r.director.state.wave,11,context);assert.ok(d.groundDecisions||d.airDecisions,context);assert.equal(d.fallbackRail,false,context);assert.ok(d.route.clearanceVerified,context);assert.ok(r.director.state.budget.ticks<=18000&&r.director.state.budget.policies<=48,context);
 }
});
