import {scoreStage} from './gameplay-config.js?v=4.11.0';
import {advanceSpeedView,maximumMobileSight} from './speed-feedback.js?v=4.11.0';
import {makeRail} from './rails.js?v=4.11.0';
import {types} from './catalog.js?v=4.11.0';
import {biomeAt} from './biomes.js?v=4.11.0';
import {AIR_TYPES,stageAt,makePattern} from './routes.js?v=4.11.0';
import {ENCOUNTER,encounterBudget,validateEncounter} from './encounter-routes.js?v=4.11.0';
const factoryIds=['truck','t800','bydSeal','xiaomiSu7','batteryAgv','xi'];
const eligible=(o,biome)=>o.biomes==='all'||o.biomes.includes(biome);
export const canonicalGroundFallback=pool=>pool.reduce((best,o)=>!best||o.w<best.w||o.w===best.w&&o.h<best.h?o:best,null);
const airSpeed={ufo:65,primeDrone:70,twitterBird:95,starlink:45,regulatorDrone:60,sikorsky:35,qualitySkull:75};
export const RAIL_LENGTHS=Object.freeze([880,1120,1440,1680,1920,2160]);
export function railLength(speed,index,lastWidth=null){const bag=speed>=1400?[1920,2160]:speed>=1000?[1440,1680]:speed>=740?[1120,1440]:[880,1120],pick=index%bag.length;return bag[pick]===lastWidth?bag[(pick+1)%bag.length]:bag[pick];}
export function createDirector({S,flight,pace,economy,boosters,spawnDistance,sceneTime=()=>S.t,random=Math.random,relative=false}){
 const initial=()=>({wave:0,groundCount:0,last:null,viewStrength:0,viewAt:0,fallbacks:0,waiting:false,leg:-1,legStartedAt:0,legDistance:0,biomeFirstSeen:{},airBiomes:[],groundSinceAir:0,airCount:0,lastAirAt:-1e9,railCount:0,lastRailWidth:null,lastRailAirAt:-1e9,phase:'introduce',flow:0,active:false,restUntil:null,restSeconds:ENCOUNTER.rest,recoveryWaves:0,history:[],seen:[],sinceTall:2,budget:null});
 const state=initial();
 function reset(){Object.assign(state,initial());}
 function recover(){state.recoveryWaves=2;state.restUntil=null;state.active=true;state.restSeconds=.9;state.phase='rest';}
 const settled=()=>!flight.airborne&&flight.y<1&&!pace.recovery&&!pace.falling&&pace.stumble<=0;
 const clear=()=>(S.rails||[]).every(r=>r.x+r.w< -100)&&S.obs.every(o=>o.x+o.w< -100||o.smashed);
 function update(){
  const view={strength:state.viewStrength};advanceSpeedView(view,Math.max(0,S.t-state.viewAt),1002,900,S.speed);state.viewStrength=view.strength;state.viewAt=S.t;
  const target=biomeAt(S.playTime??S.t,S.seed||0);if(target.leg!==state.leg){state.leg=target.leg;state.legStartedAt=S.t;state.legDistance=S.distance||0;}
  state.biomeFirstSeen[target.id]??=S.t;
  if(state.active&&clear()&&!pace.falling&&!pace.recovery){state.active=false;state.restUntil=S.t+state.restSeconds;S.next=Math.max(S.next,state.restSeconds);}
 }
 function spawn(){
  update();
  if(!clear()||!settled()||state.restUntil!==null&&S.t+1e-8<state.restUntil){S.next=0;state.waiting=true;return;}
  state.waiting=false;state.restUntil=null;
  const {id:biome,leg}=biomeAt(S.playTime??S.t,S.seed||0),stage=pace.scoreDriven?scoreStage(S.score):stageAt(pace.progress),budget=encounterBudget();state.budget=budget;
  const familiar=S.t-state.legStartedAt<2,simple=state.groundCount<3||state.recoveryWaves>0;
  const candidate=()=>{if(budget.candidates>=3||budget.exhausted)return false;budget.candidates++;return true;};
  const opts={flight,pace,economy,boosterState:boosters,time:sceneTime(),budget,viewStrength:Math.max(0,state.viewStrength-.02)};
  const entry=maximumMobileSight(S.speed,state.viewStrength)+64,dx=Math.max(entry,600,S.speed*1.45+120),pick=pool=>pool.length?pool[Math.min(pool.length-1,Math.floor(random()*pool.length))]:null;
  let kind='single',obstacles=[],rail=null,route=null,fallbackRail=false,bypass=null;
  const recent=state.history.slice(-2),repeat=recent.length===2&&recent[0]===recent[1]?recent[0]:null;
  const choices=types.filter(o=>!o.altitude&&o.collision!=='none'&&eligible(o,biome)&&(biome!=='tesla-factory'||factoryIds.includes(o.id))&&(simple?o.h<=64:true)&&(o.h<90||state.sinceTall>=2)&&o.id!==repeat);
  const pairEvery=stage>=6?2:stage>=3?3:4,pairDue=!simple&&!familiar&&state.groundCount%pairEvery===0,overlayDue=!simple&&!familiar&&state.groundCount%3===1;
  // Save a complete ordinary ground path before discretionary pair/overlay
  // search spends this tick's fixed budget. A failed accent cannot erase it.
  const lows=choices.filter(o=>o.h<=45),canonical=canonicalGroundFallback(lows);
  let reserve=null;
  if(canonical&&candidate()){
   const items=makePattern('single',{speed:S.speed,type:canonical,dx});
   const proof=validateEncounter(items,{...opts,fallbackGround:true});
   if(proof)reserve={obstacles:items,route:proof};
  }
  const airPool=AIR_TYPES.filter(o=>eligible(o,biome)),airIntro=!state.airBiomes.includes(biome)&&S.t-state.biomeFirstSeen[biome]>=3;
  const pressure=stage>=4&&!simple&&!familiar;
  const airDue=S.t>=22&&!state.last?.fallbackRail&&!state.recoveryWaves&&state.groundCount>=3&&((airIntro&&S.t-state.lastAirAt>=8)||(!familiar&&state.groundSinceAir>=(stage>=6?7:pressure?5:3)&&S.t-state.lastAirAt>=(pressure?22:ENCOUNTER.airCooldown)));
  if(airDue&&candidate()){
   const small=airPool.filter(o=>o.w<=110&&o.h<=60),specific=small.filter(o=>Array.isArray(o.biomes)),model=pick(airIntro&&specific.length?specific:state.airCount<2?small:airPool);
   if(model){
    const combine=!airIntro&&state.airCount>=1&&state.airCount%2===1&&state.groundCount>=6&&S.t-state.lastRailAirAt>=ENCOUNTER.railAirCooldown;
    const airX=combine?Math.max(entry,dx-S.speed*.6):dx,railX=airX+S.speed*.6;
    kind=combine?'rail-air':'air-pass';rail=combine?makeRail(railX,railLength(S.speed,state.railCount,state.lastRailWidth)):null;
    obstacles=[{...model,x:airX,approachSpeed:airSpeed[model.id],passed:false}];
    if(combine){route=validateEncounter(obstacles,{...opts,rail,policies:[[.5,.15],[.5,.2]],minSlide:S.speed>=740?.6:.85});if(route){bypass=validateEncounter(obstacles,{...opts,rail,noInput:true});if(!bypass)route=null;}}
    else route=validateEncounter(obstacles,{...opts,noInput:true});
    if(!route){rail=null;obstacles=[];}
   }
  }
  if(!route){
   const chainDue=pressure&&state.groundCount%(stage>=6?7:3)!==(stage>=6?6:2);
   const type=chainDue?canonical:pairDue?(lows.find(o=>o.id==='truck')||pick(lows)):overlayDue&&reserve?canonical:pick(choices);
   if(type&&candidate()){
    kind=chainDue?'pressure-chain':pairDue?'spaced-pair':'single';obstacles=makePattern(kind,{speed:S.speed,type,dx,gapSeconds:chainDue?.09:.35,chainTypes:chainDue?[canonical,pick(lows)||canonical,canonical]:null});
    route=kind==='single'&&reserve&&type.id===canonical.id?reserve.route:validateEncounter(obstacles,{...opts,tallSingle:kind==='single'&&type.h>=90,minGroundGap:kind==='pressure-chain'?.12:kind==='spaced-pair'?.3:0});
    if(route&&!chainDue&&overlayDue&&type.h<=64&&budget.policies<26&&candidate()){
     const overlay=makeRail(Math.max(entry,dx-S.speed*.3),railLength(S.speed,state.railCount,state.lastRailWidth)),shared={...opts,rail:overlay};
     const ground=validateEncounter(obstacles,{...shared,fallbackGround:true,targetMode:'ground',requireCatch:false,forbidCatch:true});
     const catchRoute=ground&&validateEncounter(obstacles,{...shared,minSlide:S.speed>=740?.6:.85});
     if(catchRoute){rail=overlay;bypass=ground;route=catchRoute;kind='rail-ground';}
    }
   }
   if(!route&&reserve){kind='single';obstacles=reserve.obstacles;route=reserve.route;rail=null;bypass=null;state.fallbacks++;}

  }
  if(!route&&candidate()){rail=makeRail(dx,railLength(S.speed,state.railCount,state.lastRailWidth));obstacles=[];kind='rail';route=validateEncounter([],{...opts,rail,minSlide:S.speed>=740?.6:.85});fallbackRail=!!route;}
  if(!route){state.budget=budget;state.phase='rest';state.restUntil=S.t+.25;S.next=.25;return;}
  state.wave++;state.active=true;state.restUntil=null;
  const grounds=obstacles.filter(o=>!o.altitude),airs=obstacles.filter(o=>o.altitude);
  if(rail){state.lastRailWidth=rail.w;state.railCount++;if(kind==='rail-air')state.lastRailAirAt=S.t;}
  if(airs.length){state.airCount++;state.groundSinceAir=0;state.lastAirAt=S.t;if(!state.airBiomes.includes(biome))state.airBiomes.push(biome);}
  if(grounds.length){state.groundCount++;state.groundSinceAir++;}
  const tallSingle=kind==='single'&&grounds[0]?.h>=90;
  if(tallSingle)state.sinceTall=0;else if(grounds.length)state.sinceTall++;
  state.restSeconds=state.groundCount>3&&state.groundCount%7===0?.65:grounds.length>1?(stage>=6?.2:.3):ENCOUNTER.rest;
  for(const o of obstacles)if(!state.seen.includes(o.id))state.seen.push(o.id);
  if(grounds.length){state.history.push(grounds[0].id);state.history=state.history.slice(-4);}
  if(state.recoveryWaves>0&&grounds.length)state.recoveryWaves--;
  state.phase=simple?'introduce':grounds.length>1?'accent':'flow';
  state.last={kind,fallbackRail,tallSingle,stage,biome,leg,route,bypass,groundDecisions:bypass?.jumps??(grounds.length?route.jumps:0),airDecisions:airs.length?1:0,startedAt:S.t,restSeconds:state.restSeconds,railWidth:rail?.w??null};
  for(const o of obstacles)S.obs.push({...o,x:o.x+(relative?0:S.anchor),uid:++S.entityId,passed:false,nearPaid:false,latePaid:false});
  if(rail)(S.rails??=[]).push({...rail,uid:++S.entityId});
  S.next=0;
 }
 return {reset,spawn,update,recover,state};
}
