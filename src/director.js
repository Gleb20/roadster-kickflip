import {advanceSpeedView} from './speed-feedback.js?v=4.6.3';
import {RAIL,makeRail} from './rails.js?v=4.6.3';
import {types} from './catalog.js?v=4.6.3';
import {biomeAt} from './biomes.js?v=4.6.3';
import {AIR_TYPES,stageAt,makePattern} from './routes.js?v=4.6.3';
import {ENCOUNTER,encounterBudget,validateEncounter} from './encounter-routes.js?v=4.6.3';
const factoryIds=['truck','t800','bydSeal','xiaomiSu7','batteryAgv','xi'];
const eligible=(o,biome)=>o.biomes==='all'||o.biomes.includes(biome);
const airSpeed={ufo:65,primeDrone:70,twitterBird:95,starlink:45,regulatorDrone:60,sikorsky:35,qualitySkull:75};
export function createDirector({S,flight,pace,economy,boosters,spawnDistance,sceneTime=()=>S.t,random=Math.random,relative=false}){
 const initial=()=>({wave:0,last:null,viewStrength:0,viewAt:0,fallbacks:0,waiting:false,leg:-1,legStartedAt:0,legDistance:0,groundSinceAir:0,airCount:0,lastAirAt:-1e9,railCount:0,lastRailAirAt:-1e9,phase:'introduce',flow:0,active:false,restUntil:null,restSeconds:ENCOUNTER.rest,recoveryWaves:0,history:[],seen:[],sinceTall:2,budget:null});
 const state=initial();
 function reset(){Object.assign(state,initial());}
 function recover(){state.recoveryWaves=2;state.restUntil=null;state.active=true;state.restSeconds=ENCOUNTER.accentRest;state.phase='rest';}
 const settled=()=>!flight.airborne&&flight.y<1&&!pace.recovery&&!pace.falling&&pace.stumble<=0;
 const clear=()=>(S.rails||[]).every(r=>r.x+r.w< -180)&&S.obs.every(o=>o.x+o.w< -180||o.smashed);
 function update(){
  const view={strength:state.viewStrength};advanceSpeedView(view,Math.max(0,S.t-state.viewAt),1002,900,S.speed);state.viewStrength=view.strength;state.viewAt=S.t;
  const target=biomeAt(S.score||0);if(target.leg!==state.leg){state.leg=target.leg;state.legStartedAt=S.t;state.legDistance=S.distance||0;}
  if(state.active&&clear()&&!pace.falling&&!pace.recovery){state.active=false;state.restUntil=S.t+state.restSeconds;S.next=Math.max(S.next,state.restSeconds);}
 }
 function spawn(){
  update();
  if(!clear()||!settled()||state.restUntil!==null&&S.t+1e-8<state.restUntil){S.next=0;state.waiting=true;return;}
  state.waiting=false;state.restUntil=null;
  const {id:biome,leg}=biomeAt(S.score||0),stage=stageAt(pace.progress),budget=encounterBudget();state.budget=budget;
  const familiar=S.t-state.legStartedAt<8||(S.distance!==undefined&&S.distance-state.legDistance<2200),simple=pace.progress<35||familiar||state.recoveryWaves>0,fast=S.speed>760;
  const candidate=()=>{if(budget.candidates>=3||budget.exhausted)return false;budget.candidates++;return true;};
  const opts={flight,pace,economy,boosterState:boosters,time:sceneTime(),budget,viewStrength:Math.max(0,state.viewStrength-.02)};
  const dx=Math.max(spawnDistance(),S.speed*1.8+180),railDue=state.wave>=RAIL.firstWave&&(state.wave-RAIL.firstWave)%RAIL.every===0;
  let kind='single',obstacles=[],rail=null,route=null,fallbackRail=false;
  const airPool=AIR_TYPES.filter(o=>eligible(o,biome)),pick=pool=>pool[Math.min(pool.length-1,Math.floor(random()*pool.length))];
  if(railDue&&!state.recoveryWaves){
   rail=makeRail(dx);kind='rail';
   const combined=pace.progress>=150&&!familiar&&!state.recoveryWaves&&!fast&&state.airCount>=2&&state.groundSinceAir>=4&&S.t-state.lastAirAt>=ENCOUNTER.airCooldown&&state.railCount>=2&&state.railCount%3===2&&S.t-state.lastRailAirAt>=ENCOUNTER.railAirCooldown;
   if(combined&&candidate()){
    const small=airPool.filter(o=>o.w<=110&&o.h<=60&&state.seen.includes(o.id)),model=pick(small);
    if(model){obstacles=[{...model,x:dx-150,approachSpeed:airSpeed[model.id],passed:false}];route=validateEncounter(obstacles,{...opts,rail,policies:[[.5,.15],[.5,.2]]});if(route){const bypass=validateEncounter(obstacles,{...opts,rail,noInput:true});if(bypass){kind='rail-air';route.bypass=bypass;}else route=null;}}
   }
   if(!route&&candidate()){obstacles=[];route=validateEncounter([],{...opts,rail});}
   if(!route)rail=null;
  }
  // Leave the approach to each eligible third rail free of a separate air
  // pass, so the shared air cooldown can mature before the combined encounter.
  const reserveRailAir=pace.progress>=150&&state.airCount>=2&&state.railCount>=2&&state.railCount%3===2;
  const airDue=!reserveRailAir&&pace.progress>=90&&!familiar&&!state.recoveryWaves&&state.groundSinceAir>=4&&S.t-state.lastAirAt>=ENCOUNTER.airCooldown;
  if(!route&&airDue&&candidate()){
   const pool=state.airCount<2?airPool.filter(o=>o.w<=110&&o.h<=60):airPool,model=pick(pool);
   if(model){kind='air-pass';obstacles=[{...model,x:dx,approachSpeed:airSpeed[model.id],passed:false}];route=validateEncounter(obstacles,{...opts,noInput:true});}
  }
  if(!route){
   const accent=!simple&&!fast&&state.phase==='accent',recent=state.history.slice(-2),repeat=recent.length===2&&recent[0]===recent[1]?recent[0]:null;
   const choices=types.filter(o=>!o.altitude&&o.collision!=='none'&&eligible(o,biome)&&(biome!=='tesla-factory'||factoryIds.includes(o.id))&&(simple?o.h<=64:true)&&(o.h<90||state.sinceTall>=2)&&o.id!==repeat);
   // At most three candidates. An unsuitable complex/tall choice becomes a
   // canonical low single, then an empty rest; never an exhaustive search.
   for(let attempt=0;attempt<2&&!route&&candidate();attempt++){
    const fallback=choices.filter(o=>o.h<=45),type=attempt===1?(fallback.find(o=>o.id===(S.speed<430&&biome==='spaceport'?'v8':'truck'))||pick(fallback)):pick(choices);if(!type)break;
    kind=attempt===0&&type.h<90&&state.seen.includes(type.id)&&accent&&S.speed<=700&&state.last?.kind!=='spaced-pair'?pick(['spaced-pair','low-cluster']):'single';
    obstacles=makePattern(kind,{speed:S.speed,type,dx,gapSeconds:pace.progress<90?.65:.45});
    route=validateEncounter(obstacles,{...opts,tallSingle:kind==='single'&&type.h>=90,minGroundGap:pace.progress<90?.65:.45});
    if(!route)state.fallbacks++;
   }
  }
  // Ground rejection must not lock progression. A free rail is a real optional
  // encounter with a verified catch and safe ground bypass, even off cadence.
  if(!route&&candidate()){rail=makeRail(dx);obstacles=[];kind='rail';route=validateEncounter([],{...opts,rail});fallbackRail=!!route;}
  if(!route){state.budget=budget;state.phase='rest';state.restUntil=S.t+.25;S.next=.25;return;}
  state.wave++;state.active=true;state.restUntil=null;
  if(rail){state.railCount++;if(kind==='rail-air'){state.lastRailAirAt=S.t;state.airCount++;state.groundSinceAir=0;state.lastAirAt=S.t;}}
  if(kind==='air-pass'){state.airCount++;state.groundSinceAir=0;state.lastAirAt=S.t;}else if(kind!=='rail-air')state.groundSinceAir++;
  const tallSingle=kind==='single'&&obstacles[0]?.h>=90;
  if(tallSingle)state.sinceTall=0;else if(['single','rail','air-pass'].includes(kind))state.sinceTall++;
  const accent=['spaced-pair','low-cluster','rail-air'].includes(kind);
  state.restSeconds=accent?ENCOUNTER.accentRest:ENCOUNTER.rest;
  for(const o of obstacles)if(!state.seen.includes(o.id))state.seen.push(o.id);
  state.history.push(obstacles.find(o=>!o.altitude)?.id||kind);state.history=state.history.slice(-4);
  if(state.recoveryWaves>0)state.recoveryWaves--;
  if(accent||state.phase==='accent'){state.phase='rest';state.flow=0;}
  else if(state.phase==='rest'||state.phase==='introduce'){state.phase='flow';state.flow=1;}
  else if(++state.flow>=3)state.phase='accent';
  state.last={kind,fallbackRail,tallSingle,stage,biome,leg,route,startedAt:S.t,restSeconds:state.restSeconds};
  for(const o of obstacles)S.obs.push({...o,x:o.x+(relative?0:S.anchor),uid:++S.entityId,passed:false,nearPaid:false,latePaid:false});
  if(rail)(S.rails??=[]).push({...rail,uid:++S.entityId});
  // This is only a polling clock. The real rest is armed by update() after
  // the rider, rail and threats have all cleared the encounter.
  S.next=.18;
 }
 return {reset,spawn,update,recover,state};
}
