import {advanceSpeedView} from './speed-feedback.js';
import {makeRail} from './rails.js';
import {types} from './catalog.js';
import {biomeAt} from './biomes.js';
import {AIR_TYPES,stageAt,makePattern} from './routes.js';
import {ENCOUNTER,encounterBudget,validateEncounter} from './encounter-routes.js';
const factoryIds=['truck','t800','bydSeal','xiaomiSu7','batteryAgv','xi'];
const eligible=(o,biome)=>o.biomes==='all'||o.biomes.includes(biome);
const airSpeed={ufo:65,primeDrone:70,twitterBird:95,starlink:45,regulatorDrone:60,sikorsky:35,qualitySkull:75};
export const RAIL_LENGTHS=Object.freeze([880,1120,1440,1680]);
export function railLength(speed,index,lastWidth=null){const bag=speed>=1000?[1440,1680]:speed>=740?[1120,1440]:[880,1120],pick=index%bag.length;return bag[pick]===lastWidth?bag[(pick+1)%bag.length]:bag[pick];}
export function createDirector({S,flight,pace,economy,boosters,spawnDistance,sceneTime=()=>S.t,random=Math.random,relative=false}){
 const initial=()=>({wave:0,groundCount:0,last:null,viewStrength:0,viewAt:0,fallbacks:0,waiting:false,leg:-1,legStartedAt:0,legDistance:0,biomeFirstSeen:{},airBiomes:[],groundSinceAir:0,airCount:0,lastAirAt:-1e9,railCount:0,lastRailWidth:null,lastRailAirAt:-1e9,phase:'introduce',flow:0,active:false,restUntil:null,restSeconds:ENCOUNTER.rest,recoveryWaves:0,history:[],seen:[],sinceTall:2,budget:null});
 const state=initial();
 function reset(){Object.assign(state,initial());}
 function recover(){state.recoveryWaves=2;state.restUntil=null;state.active=true;state.restSeconds=.9;state.phase='rest';}
 const settled=()=>!flight.airborne&&flight.y<1&&!pace.recovery&&!pace.falling&&pace.stumble<=0;
 const clear=()=>(S.rails||[]).every(r=>r.x+r.w< -100)&&S.obs.every(o=>o.x+o.w< -100||o.smashed);
 function update(){
  const view={strength:state.viewStrength};advanceSpeedView(view,Math.max(0,S.t-state.viewAt),1002,900,S.speed);state.viewStrength=view.strength;state.viewAt=S.t;
  const target=biomeAt(S.score||0);if(target.leg!==state.leg){state.leg=target.leg;state.legStartedAt=S.t;state.legDistance=S.distance||0;}
  state.biomeFirstSeen[target.id]??=S.t;
  if(state.active&&clear()&&!pace.falling&&!pace.recovery){state.active=false;state.restUntil=S.t+state.restSeconds;S.next=Math.max(S.next,state.restSeconds);}
 }
 function spawn(){
  update();
  if(!clear()||!settled()||state.restUntil!==null&&S.t+1e-8<state.restUntil){S.next=0;state.waiting=true;return;}
  state.waiting=false;state.restUntil=null;
  const {id:biome,leg}=biomeAt(S.score||0),stage=stageAt(pace.progress),budget=encounterBudget();state.budget=budget;
  const familiar=S.t-state.legStartedAt<2,simple=state.groundCount<3||state.recoveryWaves>0;
  const candidate=()=>{if(budget.candidates>=3||budget.exhausted)return false;budget.candidates++;return true;};
  const opts={flight,pace,economy,boosterState:boosters,time:sceneTime(),budget,viewStrength:Math.max(0,state.viewStrength-.02)};
  const dx=Math.max(600,S.speed*1.45+120),pick=pool=>pool.length?pool[Math.min(pool.length-1,Math.floor(random()*pool.length))]:null;
  let kind='single',obstacles=[],rail=null,route=null,fallbackRail=false,bypass=null;
  const airPool=AIR_TYPES.filter(o=>eligible(o,biome)),airIntro=!state.airBiomes.includes(biome)&&S.t-state.biomeFirstSeen[biome]>=3;
  const airDue=S.t>=22&&!state.recoveryWaves&&state.groundCount>=3&&((airIntro&&S.t-state.lastAirAt>=8)||(!familiar&&state.groundSinceAir>=3&&S.t-state.lastAirAt>=ENCOUNTER.airCooldown));
  if(airDue&&candidate()){
   const small=airPool.filter(o=>o.w<=110&&o.h<=60),specific=small.filter(o=>Array.isArray(o.biomes)),model=pick(airIntro&&specific.length?specific:state.airCount<2?small:airPool);
   if(model){
    const combine=!airIntro&&state.airCount>=1&&state.airCount%2===1&&state.groundCount>=6&&S.t-state.lastRailAirAt>=ENCOUNTER.railAirCooldown;
    kind=combine?'rail-air':'air-pass';rail=combine?makeRail(dx,railLength(S.speed,state.railCount,state.lastRailWidth)):null;
    obstacles=[{...model,x:combine?dx-S.speed*.6:dx,approachSpeed:airSpeed[model.id],passed:false}];
    if(combine){route=validateEncounter(obstacles,{...opts,rail,policies:[[.5,.15],[.5,.2]],minSlide:S.speed>=740?.6:.85});if(route){bypass=validateEncounter(obstacles,{...opts,rail,noInput:true});if(!bypass)route=null;}}
    else route=validateEncounter(obstacles,{...opts,noInput:true});
    if(!route){rail=null;obstacles=[];}
   }
  }
  if(!route){
   const recent=state.history.slice(-2),repeat=recent.length===2&&recent[0]===recent[1]?recent[0]:null;
   const choices=types.filter(o=>!o.altitude&&o.collision!=='none'&&eligible(o,biome)&&(biome!=='tesla-factory'||factoryIds.includes(o.id))&&(simple?o.h<=64:true)&&(o.h<90||state.sinceTall>=2)&&o.id!==repeat);
   const pairEvery=stage>=6?2:stage>=3?3:4,pairDue=!simple&&!familiar&&state.groundCount%pairEvery===0,overlayDue=!simple&&!familiar&&state.groundCount%3===1;
   for(let attempt=0;attempt<2&&!route&&candidate();attempt++){
    const lows=choices.filter(o=>o.h<=45),type=attempt===0&&pairDue?(lows.find(o=>o.id==='truck')||pick(lows)):attempt===1?(lows.find(o=>o.id===(S.speed<430&&biome==='spaceport'?'v8':'truck'))||pick(lows)):pick(choices);if(!type)break;
    kind=attempt===0&&pairDue?'spaced-pair':'single';obstacles=makePattern(kind,{speed:S.speed,type,dx,gapSeconds:.45});
    route=validateEncounter(obstacles,{...opts,tallSingle:kind==='single'&&type.h>=90,minGroundGap:kind==='spaced-pair'?.3:0});
    if(route&&attempt===0&&overlayDue&&type.h<=64&&budget.policies<18&&candidate()){
     // Both paths use the real catch/collision resolver. The ground proof must
     // explicitly finish without catching; the optional route must catch.
     const overlay=makeRail(dx-S.speed*.3,railLength(S.speed,state.railCount,state.lastRailWidth)),shared={...opts,rail:overlay};
     const ground=validateEncounter(obstacles,{...shared,targetMode:'ground',requireCatch:false,forbidCatch:true});
     const catchRoute=ground&&validateEncounter(obstacles,{...shared,minSlide:S.speed>=740?.6:.85});
     if(catchRoute){rail=overlay;bypass=ground;route=catchRoute;kind='rail-ground';}
    }
    if(!route)state.fallbacks++;
   }
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
  state.restSeconds=state.groundCount>3&&state.groundCount%7===0?.9:grounds.length>1?ENCOUNTER.accentRest:ENCOUNTER.rest;
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
