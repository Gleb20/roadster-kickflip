import assert from 'node:assert/strict';import {writeFile,mkdir} from 'node:fs/promises';import {performance} from 'node:perf_hooks';
import {createRun,RUN_STEP,verifyReplay} from '../src/run.js';import {verifyChunk} from '../supabase/chunk.mjs';import {createRandom} from '../src/random.js';import {AIR_TYPES,obstacleDefinition} from '../src/content.js';import {biomeAt} from '../src/biomes.js';import {simulateEncounter,encounterBudget,ENCOUNTER} from '../src/encounter-routes.js';import {createFlight,createPace,createEconomy,advancePace,stumble} from '../src/gameplay.js';import {createBoosters} from '../src/boosters.js';import {createDirector} from '../src/director.js';
const out=process.argv[2]||'docs/verification/2026-10-23-director',summary={node:process.version,structuralSeeds:1000,structuralSpawns:0,matrix:[],runs:[],timing:{checks:0,failures:[]},physicalDevice:false};await mkdir(out,{recursive:true});
const stats=values=>{const a=values.slice().sort((a,b)=>a-b);return {n:a.length,p50:a[Math.floor(a.length*.5)]??0,p95:a[Math.floor(a.length*.95)]??0,max:a.at(-1)??0};};
function fixture(seed,progress,score,{fuel=0,boost=false,streak=0,vx=0}={}){const flight=createFlight(fuel),pace=createPace(),economy=createEconomy(),boosters=createBoosters(seed);Object.assign(pace,{progress,base:360+300*Math.min(1,progress/150)});economy.streak=streak;economy.streakLeft=streak?4:0;flight.vx=vx;if(boost){boosters.active.speed=8;boosters.speedBlend=1;pace.boost=.35;}advancePace(pace,economy,flight,0);const S={t:progress+20,distance:30000,score,speed:pace.speed,next:0,obs:[],rails:[],anchor:0,entityId:0},random=createRandom(seed),director=createDirector({S,flight,pace,economy,boosters,relative:true,random:()=>random.next(),spawnDistance:()=>Math.max(900,S.speed*1.8+180)});director.update();Object.assign(director.state,{legStartedAt:S.t-20,legDistance:S.distance-4000,groundSinceAir:6,seen:AIR_TYPES.map(o=>o.id)});return {S,flight,pace,economy,boosters,director};}
const cold=[],warm=[];
for(let seed=0;seed<1000;seed++){const f=fixture(seed,[0,35,90,150][seed%4],seed%2?7500:1000,{fuel:[0,20,50,100][seed%4],boost:seed%7===0,streak:seed%5===0?.25:0,vx:seed%11===0?260:0});for(let i=0;i<3;i++){const before=f.director.state.wave,t0=performance.now();f.director.spawn();(i===0?cold:warm).push(performance.now()-t0);const last=f.director.state.last,budget=f.director.state.budget;if(budget){assert.ok(budget.candidates<=3);assert.ok(budget.policies<=ENCOUNTER.policyBudget+1);assert.ok(budget.ticks<=ENCOUNTER.tickBudget+1);}if(before!==f.director.state.wave){summary.structuralSpawns++;assert.ok(f.S.obs.length<=2);assert.equal(last.route.fuelUsed,0);assert.ok(last.route.actions.every(a=>!a.action.startsWith('thrust')));for(const o of f.S.obs){const def=obstacleDefinition(o.id);assert.equal(o.w,def.w);assert.equal(o.h,def.h);assert.ok(def.biomes==='all'||def.biomes.includes(biomeAt(f.S.score).id));if(o.altitude)assert.ok(o.altitude>=205);}}f.S.obs=[];f.S.rails=[];f.director.update();f.S.t+=8;}}
summary.spawnBench={cold:stats(cold),warm:stats(warm)};
for(const progress of [0,35-1/120,35,90-1/120,90,150-1/120,150])for(const score of [6999,7000,13999,14000])for(const fuel of [0,20,50,100]){const f=fixture(17,progress,score,{fuel});f.director.spawn();summary.matrix.push({progress,score,fuel,kind:f.director.state.last?.kind||'rest',speed:f.S.speed});}
for(const base of [360,510,660])for(const boost of [false,true])for(const streak of [0,.25])for(const vx of [0,260])for(const model of AIR_TYPES){const f=fixture(17,(base-360)/2,model.biomes?.includes?.('tesla-factory')?7500:1000,{fuel:0,boost,streak,vx});const obstacle={...model,x:f.S.speed*2+300,approachSpeed:95};assert.ok(simulateEncounter([obstacle],{...f,boosterState:f.boosters,noInput:true,requireCatch:false}));}
summary.airUnderpasses=3*2*2*2*AIR_TYPES.length;
const mapping={hold:'primary-down',jump:'primary-up'};
function routeActions(actions,start,plan,variation={}){
 for(let i=0;i<actions.length;i+=2){const hold=actions[i],jump=actions[i+1];if(!jump)continue;
  const v=typeof variation==='function'?variation():variation,shift=v.shift||0,chargeShift=v.chargeShift||0;
  const release=jump.at+shift,duration=Math.max(0,jump.at-hold.at+chargeShift*.4);
  for(const [a,at] of [[hold,release-duration],[jump,release]]){const tick=start+Math.max(0,Math.round(at/RUN_STEP));if(!plan.has(tick))plan.set(tick,[]);plan.get(tick).push(mapping[a.action]);}
 }
}
const allSpawnMs=[];let naturalRailAir=null,naturalPair=null,allBefore=null,allDuring=null;
for(const imperfect of [false,true])for(const seed of [17,932,9,56]){
 const r=createRun({seed});r.reset();const actions=new Map(),random=createRandom(seed+123),counts={},ids={},spawnMs=[],restGaps=[],airGaps=[],railAirGaps=[];let wave=0,clearAt=null,previousAir=-1e9,previousRailAir=-1e9,checkpoints=0,pickups=0,rescues=0,maxSpeed=0,fallCount=0,catches=0,maxBudget=0,beforeRailAir=null;
 while(r.S.mode==='playing'&&r.S.t<600){
  for(const action of actions.get(r.S.tick)||[])if(action)r.command(action);
  const previousBudget=r.director.state.budget,wasActive=r.director.state.active,start=performance.now();r.step();const ms=performance.now()-start;if(previousBudget!==r.director.state.budget&&r.director.state.budget){spawnMs.push(ms);allSpawnMs.push(ms);maxBudget=Math.max(maxBudget,r.director.state.budget.ticks);}
  maxSpeed=Math.max(maxSpeed,r.S.speed);
  for(const e of r.drainEvents()){if(e.type==='pickup')pickups++;if(e.type==='rescued')rescues++;if(e.type==='rail-catch'){catches++;if(beforeRailAir&&!allDuring){allDuring=r.snapshot();const clone=createRun({record:false});clone.restore(JSON.parse(JSON.stringify(allDuring)));for(let k=0;k<83;k++){r.step();clone.step();r.drainEvents();clone.drainEvents();}assert.deepEqual(clone.snapshot(),r.snapshot());checkpoints++;}}if(e.type==='landing'&&!e.landed.good)fallCount++;}
  if(wasActive&&!r.director.state.active&&r.director.state.restUntil!==null)clearAt=r.director.state.restUntil-r.director.state.restSeconds;
  if(r.director.state.wave!==wave){
   wave=r.director.state.wave;const last=r.director.state.last;counts[last.kind]=(counts[last.kind]||0)+1;
   if(clearAt!==null){restGaps.push(r.S.t-clearAt);assert.ok(r.S.t-clearAt>=1.5-1e-8);clearAt=null;}
   assert.equal(last.route.fuelUsed,0);const nowGround=r.S.obs.filter(o=>!o.altitude&&o.x>0);for(const o of r.S.obs.filter(o=>o.x>0)){ids[o.id]=(ids[o.id]||0)+1;const def=obstacleDefinition(o.id);assert.ok(def.biomes==='all'||def.biomes.includes(last.biome));}
   if(last.kind==='rail-air'){railAirGaps.push(r.S.t-previousRailAir);assert.ok(r.S.t-previousRailAir>=30);previousRailAir=r.S.t;beforeRailAir=r.snapshot();if(!naturalRailAir){naturalRailAir=beforeRailAir;allBefore=beforeRailAir;}}
   if(last.kind==='air-pass'||last.kind==='rail-air'){airGaps.push(r.S.t-previousAir);assert.ok(r.S.t-previousAir>=28);previousAir=r.S.t;}
   if(!imperfect&&['single','spaced-pair','low-cluster'].includes(last.kind)){
    const obs=nowGround.map(o=>({...o})),pair=last.kind==='spaced-pair';
    if(pair&&!naturalPair)naturalPair=r.snapshot();
    const leads=pair||last.tallSingle?[-.09,-.06,-.03,0,.03,.06,.09]:[-.06,-.03,0,.03,.06];
    const charges=pair?[last.route.charge]:last.tallSingle?[Math.max(0,last.route.charge-.1),last.route.charge,last.route.charge+.1]:[Math.max(0,last.route.charge-.05),last.route.charge,last.route.charge+.05];
    for(const charge of charges)for(const first of leads)for(const second of pair?leads:[first]){summary.timing.checks++;const proof=simulateEncounter(obs,{flight:r.P,pace:r.pace,economy:r.E,boosterState:r.Q,time:r.S.t,charge,lead:last.route.lead+first,secondLead:last.route.lead+second,minGroundGap:pair?.45:0,budget:encounterBudget()});if(!proof)summary.timing.failures.push({seed,time:r.S.t,kind:last.kind,charge,first,second});}
   }
   const variation=imperfect?()=>({shift:(random.next()-.5)*.12,chargeShift:(random.next()-.5)*.1}):{};routeActions(last.route.actions,r.S.tick,actions,variation);
  }
 }
 const ended=r.S.mode==='dead'?r.drainEvents():null;
 summary.runs.push({seed,imperfect,seconds:r.S.t,mode:r.S.mode,score:r.S.score,biomeLeg:biomeAt(r.S.score).leg,waves:wave,counts,ids,pickups,rescues,fallCount,catches,maxSpeed,maxBudget,rest:stats(restGaps),airMin:Math.min(...airGaps.slice(1)),railAirMin:Math.min(...railAirGaps.slice(1)),spawnStepMs:stats(spawnMs),fallbacks:r.director.state.fallbacks,checkpoints});
 if(!imperfect){assert.equal(r.S.mode,'playing','nominal scripted witness');assert.ok(biomeAt(r.S.score).leg>=2);assert.ok(counts['rail-air']>0);}
 if(!imperfect&&seed===17){
  // End normally by withholding future actions; no fabricated terminal packet.
  actions.clear();r.command('cancel');while(r.S.mode==='playing'&&r.S.t<900){r.step();r.drainEvents();}
  const replay=r.replay(),expected=verifyReplay(replay);assert.deepEqual(expected,{score:r.S.score,flips:r.E.flips,ticks:r.S.tick});let checkpoint=null,result,chunks=0;const timings=[];do{const started=performance.now();result=verifyChunk(replay,checkpoint,{maxTicks:1000,budgetMs:Infinity});timings.push(performance.now()-started);checkpoint=result.checkpoint?JSON.parse(JSON.stringify(result.checkpoint)):null;chunks++;}while(result.outcome==='pending');assert.equal(result.outcome,'accepted');assert.deepEqual(result.result,expected);summary.serverReplay={expected,chunks,chunkMs:stats(timings)};await writeFile(out+'/replay.json',JSON.stringify(replay));
 }
}
summary.spawnStepMs=stats(allSpawnMs);assert.equal(summary.timing.failures.length,0);assert.ok(naturalRailAir&&allDuring&&naturalPair);await writeFile(out+'/natural-rail-air.json',JSON.stringify(naturalRailAir));await writeFile(out+'/natural-pair.json',JSON.stringify(naturalPair));await writeFile(out+'/mid-rail-air.json',JSON.stringify(allDuring));await writeFile(out+'/matrix.json',JSON.stringify(summary,null,2));console.log(JSON.stringify({...summary,matrix:summary.matrix.length,runs:summary.runs.map(({ids,...r})=>r)},null,2));
