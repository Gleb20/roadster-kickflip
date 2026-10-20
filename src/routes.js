import {GAMEPLAY as C} from './gameplay-config.js?v=3.6.2';
import {createFlight,launch,advanceFlight,createPace,createEconomy,advancePace,advanceStreak,advanceEconomy,settleLanding,sweptCollision,nearWindow,passObstacle} from './gameplay.js?v=3.6.2';
export const STAGES=C.stages;
export function stageAt(progress){return STAGES.filter(t=>progress>=t).length-1;}
import {AIR_TYPES} from './content.js?v=3.6.2';
export {AIR_TYPES};
export function makePattern(kind,{speed=360,type={id:'truck',w:110,h:41},dx=900}={}){
  const item=(o,offset=0)=>({...o,x:dx+offset,passed:false});
  if(kind==='hover')return [item(AIR_TYPES[0])];
  if(kind==='incoming')return [item(AIR_TYPES[1])];
  if(kind==='precision'){
    // Two low cars at most, a single high drone and room to prepare the next jump.
    const span=Math.min(200,Math.max(110,speed*.40-94)),cars=[],n=Math.min(2,Math.ceil(span/110)),width=(span-20*(n-1))/n;
    for(let i=0;i<n;i++)cars.push(item({id:'truck',name:'CYBERBRICK',w:width,h:41*width/110,inset:4},i*(width+20)));
    cars.push(item({id:'truck',name:'CYBERBRICK',w:110,h:41,inset:5},speed*1.15));
    cars.push(item({...AIR_TYPES[0],altitude:400},span*.5));
    return cars;
  }
  if(kind==='mixed')return [item(type),item(AIR_TYPES[1],speed*.65),item(type.h<=57?type:{id:'truck',name:'CYBERBRICK',w:110,h:41,inset:5},speed*1.65)];
  if(kind==='thrust'){const n=Math.min(6,Math.max(4,Math.ceil(speed*1.65/165)));return Array.from({length:n},(_,i)=>item({id:'truck',name:'CYBERBRICK',w:110,h:41,inset:5},i*165));}
  if(kind==='pair')return [item(type),item(type,speed*1.5)];
  return [item(type)];
}
// Shared simulation, actual charge duration, cloned inputs and a grounded safe exit.
export function validateRoute(obstacles,{flight=createFlight(),pace=createPace(),economy=createEconomy(),time=0,allowThrust=true,burns=null,timingMargin=0,leads=[.1,.11,.115,.12,.125,.14,.16,.2,.3,.4,.5,.65],charges=[0,.5,1]}={}){
  if(flight.airborne||pace.stumble>0)return null;
  for(const charge of charges)for(const lead of leads)for(const burn of burns??(allowThrust&&flight.fuel>0?[0,.35,.65,1.1]:[0])){
    const p={...flight},r=structuredClone(pace),e={...economy},obs=obstacles.map(o=>({...o})),actions=[];
    let charging=false,held=0,elapsed=0,lateTarget=null,lastThrust=false,nearLandings=0,lateTakeoffs=0;
    const dt=1/120;
    for(let tick=0;tick<1440;tick++){
      elapsed=tick*dt;
      const next=obs.find(o=>o.x+o.w> -47&&(!o.altitude||o.altitude<163));
      if(!p.airborne&&next){
        const ttc=(next.x+(next.inset||5)-47)/Math.max(1,r.speed+(next.approachSpeed||0));
        if(!charging&&ttc<=lead+charge*C.chargeSeconds){charging=true;held=0;actions.push({at:elapsed,action:'hold'});}
        if(charging){held+=dt;if(held+1e-9>=charge*C.chargeSeconds+(charge>0?dt:0)){lateTarget=nearWindow(next.x+(next.inset||5)-47,r.speed+(next.approachSpeed||0))?next:null;launch(p,charge);charging=false;actions.push({at:elapsed,action:'jump',charge});}}
      }
      const before={...p},useThrust=p.airborne&&p.time>=.18&&p.time<.18+burn;
      if(useThrust!==lastThrust){actions.push({at:elapsed,action:useThrust?'thrust-on':'thrust-off'});lastThrust=useThrust;}
      const landed=advanceFlight(p,dt,{thrust:useThrust});
      advanceEconomy(e,dt);advanceStreak(e,dt);advancePace(r,e,p,dt);
      const after=landed?{...p,angle:landed.angle}:p;
      let alive=true;
      for(const o of obs){const old=o.x;o.x-=(r.speed+(o.approachSpeed||0))*dt;if(sweptCollision(before,after,o,old,o.x,time+elapsed,dt)){alive=false;break;}if(!o.passed&&o.x+o.w< -50){o.passed=true;passObstacle(e);}}
      if(!alive||landed&&!landed.good)break;
      if(landed){let near=0;const late=lateTarget&&lateTarget.x+lateTarget.w-(lateTarget.inset||5)< -47?1:0;for(const o of obs)if(!o.altitude&&!o.nearPaid&&nearWindow(-47-(o.x+o.w-(o.inset||5)),r.speed)){near++;o.nearPaid=true;}settleLanding(e,p,landed,{late,near});nearLandings+=near;lateTakeoffs+=late;lateTarget=null;}
      if(obs.every(o=>o.x+o.w< -180)&&!p.airborne){
        if(timingMargin>0&&(!validateRoute(obstacles,{flight,pace,economy,time,charges:[charge],leads:[lead-timingMargin],burns:[burn]})||!validateRoute(obstacles,{flight,pace,economy,time,charges:[charge],leads:[lead+timingMargin],burns:[burn]})))break;
        return {charge,lead,burn,actions,nearLandings,lateTakeoffs,duration:elapsed,fuelUsed:flight.fuel-p.fuel,exit:{y:0,angle:0,vx:p.vx},clearanceVerified:true,timingMargin};
      }
    }
  }
  return null;
}
