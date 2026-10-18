import {GAMEPLAY as C} from './gameplay-config.js?v=3.0.3';
import {types} from './catalog.js?v=3.0.3';
import {stageAt,makePattern,validateRoute} from './routes.js?v=3.0.3';
export function createDirector({S,flight,pace,economy,spawnDistance,sceneTime=()=>S.t,random=Math.random}){
 const state={wave:0,last:null,fallbacks:0,waiting:false,hardStreak:0};
 function reset(){Object.assign(state,{wave:0,last:null,fallbacks:0,waiting:false,hardStreak:0});}
 function spawn(){
  if(flight.airborne||pace.recovery||pace.falling||S.obs.some(o=>!o.passed)){S.next=.18;state.waiting=true;return;}
  state.waiting=false;
  const stage=stageAt(pace.progress),breath=state.wave%5===4||state.hardStreak>=2;
  const pools=[['single'],['single'],['pair','single'],['hover','incoming','pair'],['precision','incoming','pair'],['mixed','precision','thrust'],['mixed','precision','thrust','incoming']];
  let kind=breath?'single':pools[stage][Math.floor(random()*pools[stage].length)];
  if(!breath&&stage===3&&pace.progress<72)kind='hover';
  const choices=types.filter(o=>!o.altitude&&(stage===0?o.h<=64:stage<2?o.h<=94:true));
  if(kind==='thrust'&&flight.fuel<65)kind='pair';
  const type=choices[Math.floor(random()*choices.length)],dx=spawnDistance();
  let obstacles=makePattern(kind,{speed:S.speed,type,dx});
  let route=validateRoute(obstacles,{flight,pace,economy,time:sceneTime(),timingMargin:C.routeTimingMargin});
  if(route&&route.fuelUsed>0&&flight.fuel-route.fuelUsed<C.routeFuelReserve)route=null;
  if(!route){state.fallbacks++;kind='single';obstacles=makePattern(kind,{speed:S.speed,type:types.find(o=>o.id==='truck'),dx});route=validateRoute(obstacles,{flight,pace,economy,time:sceneTime(),timingMargin:C.routeTimingMargin});}
  if(!route){S.next=.3;return;}
  state.hardStreak=['precision','mixed','thrust'].includes(kind)?state.hardStreak+1:0;
  state.wave++;state.last={kind,stage,route,startedAt:S.t};
  for(const o of obstacles)S.obs.push({...o,x:o.x+S.anchor,uid:++S.entityId,passed:false,nearPaid:false,latePaid:false});
  S.next=breath?2.3:1.2;
 }
 return {reset,spawn,state};
}
