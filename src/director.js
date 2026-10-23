import {RAIL,makeRail,validateRailRoute} from './rails.js?v=4.4.3';
import {GAMEPLAY as C} from './gameplay-config.js?v=4.4.3';
import {types} from './catalog.js?v=4.4.3';
import {biomeAt} from './biomes.js?v=4.4.3';
import {AIR_TYPES,stageAt,makePattern,validateRoute} from './routes.js?v=4.4.3';
export function createDirector({S,flight,pace,economy,boosters,spawnDistance,sceneTime=()=>S.t,random=Math.random,relative=false}){
 const initial=()=>({wave:0,last:null,fallbacks:0,waiting:false,hardStreak:0,leg:-1,legStartedAt:0,groundSinceAir:0,airCount:0,lastAirAt:-1e9});
 const state=initial();
 function reset(){Object.assign(state,initial());}
 function spawn(){
  if(flight.airborne||pace.recovery||pace.falling||(S.rails?.length>0)||S.obs.some(o=>!o.passed)){S.next=.18;state.waiting=true;return;}
  state.waiting=false;
  const {id:biome,leg}=biomeAt(S.score||0);
  if(leg!==state.leg){state.leg=leg;state.legStartedAt=S.t;}
  if(state.wave>=RAIL.firstWave&&(state.wave-RAIL.firstWave)%RAIL.every===0&&state.last?.kind!=='air'){
   const rail=makeRail(spawnDistance()),route=validateRailRoute(rail,{flight,pace,economy,boosterState:boosters});
   if(route){state.wave++;state.hardStreak=0;state.last={kind:'rail',stage:stageAt(pace.progress),biome,leg,route,startedAt:S.t};(S.rails??=[]).push({...rail,uid:++S.entityId});S.next=route.duration+RAIL.exitSeconds;return;}
  }
  const stage=stageAt(pace.progress),afterAir=state.last?.kind==='air',breath=afterAir||state.wave%5===4||state.hardStreak>=2;
  const airDue=leg>=2&&S.t-state.legStartedAt>=8&&state.groundSinceAir>=6&&S.t-state.lastAirAt>=28;
  const pools=[['single'],['single'],['pair','single'],['single','pair'],['precision','single','pair'],['pair','precision','thrust'],['pair','precision','thrust']];
  let kind=breath||airDue?'single':pools[stage][Math.floor(random()*pools[stage].length)];
  const factoryIds=['truck','t800','bydSeal','xiaomiSu7','batteryAgv','xi'];
  const choices=types.filter(o=>!o.altitude&&o.collision!=='none'&&(o.biomes==='all'||o.biomes.includes(biome))&&(biome!=='tesla-factory'||factoryIds.includes(o.id))&&(stage===0?o.h<=64:stage<2?o.h<=94:true));
  if(kind==='thrust'&&flight.fuel<65)kind='pair';
  let type=choices[Math.floor(random()*choices.length)],dx=spawnDistance();
  if(airDue&&!breath&&state.last?.kind==='single'){
   const first=state.airCount<2;
   const pool=AIR_TYPES.filter(o=>(o.biomes==='all'||o.biomes.includes(biome))&&(!first||o.h<=55&&o.w<=110));
   const model=pool[Math.floor(random()*pool.length)];
   type={...model,altitude:first?24:32,approachSpeed:first?80:110};kind='air';
   dx=Math.max(dx,(S.speed+type.approachSpeed)*2);
  }
  let obstacles=makePattern(kind,{speed:S.speed,type,dx});
  let route=validateRoute(obstacles,{flight,pace,economy,time:sceneTime(),boosterState:boosters,allowThrust:kind!=='air',timingMargin:kind==='air'?.09:C.routeTimingMargin});
  if(route&&route.fuelUsed>0&&flight.fuel-route.fuelUsed<C.routeFuelReserve)route=null;
  if(!route){state.fallbacks++;kind='single';obstacles=makePattern(kind,{speed:S.speed,type:types.find(o=>o.id==='truck'),dx});route=validateRoute(obstacles,{flight,pace,economy,time:sceneTime(),boosterState:boosters,timingMargin:C.routeTimingMargin});}
  if(!route){S.next=.3;return;}
  state.hardStreak=['precision','thrust'].includes(kind)?state.hardStreak+1:0;
  if(kind==='air'){state.airCount++;state.groundSinceAir=0;state.lastAirAt=S.t;}else state.groundSinceAir++;
  state.wave++;state.last={kind,stage,biome,leg,route,startedAt:S.t};
  for(const o of obstacles)S.obs.push({...o,x:o.x+(relative?0:S.anchor),uid:++S.entityId,passed:false,nearPaid:false,latePaid:false});
  S.next=kind==='air'?route.duration+1.25:breath?2.3:1.2;
 }
 return {reset,spawn,state};
}
