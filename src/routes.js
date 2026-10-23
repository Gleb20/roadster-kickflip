import {advanceBoosters,activeBooster} from './boosters.js?v=4.6.3';
import {GAMEPLAY as C} from './gameplay-config.js?v=4.6.3';
import {createFlight,launch,advanceFlight,createPace,createEconomy,advancePace,advanceStreak,advanceEconomy,settleLanding,sweptCollision,nearWindow,passObstacle} from './gameplay.js?v=4.6.3';
export const STAGES=C.stages;
export function stageAt(progress){return STAGES.filter(t=>progress>=t).length-1;}
import {AIR_TYPES} from './content.js?v=4.6.3';
export {AIR_TYPES};
export function makePattern(kind,{speed=360,type={id:'truck',w:110,h:41},dx=900,gapSeconds=.65}={}){
 const item=offset=>({...type,x:dx+offset,passed:false});
 // Canonical dimensions; no fuel train or miniature cars in the current rules.
 if(['pair','spaced-pair','mixed'].includes(kind))return [item(0),item(speed*(.9+gapSeconds)+type.w)];
 if(['precision','thrust','low-cluster'].includes(kind))return [item(0),item(type.w+35)];
 return [item(0)];
}
// Shared simulation, actual charge duration, cloned inputs and a grounded safe exit.
export function validateRoute(obstacles,{flight=createFlight(),pace=createPace(),economy=createEconomy(),time=0,boosterState=null,allowThrust=true,burns=null,timingMargin=0,leads=[.1,.11,.115,.12,.125,.14,.16,.2,.3,.4,.5,.65],charges=[0,.5,1]}={}){
  if(flight.airborne||pace.stumble>0)return null;
  for(const burn of burns??(allowThrust&&flight.fuel>0?[0,.35,.65,1.1]:[0]))for(const charge of charges)for(const lead of leads){
    const q=boosterState?structuredClone(boosterState):null;const p={...flight},r=structuredClone(pace),e={...economy},obs=obstacles.map(o=>({...o})),actions=[];
    let charging=false,held=0,elapsed=0,lateTarget=null,lastThrust=false,nearLandings=0,lateTakeoffs=0;
    const dt=1/120;
    for(let tick=0;tick<1440;tick++){
      elapsed=tick*dt;
      const next=obs.find(o=>o.x+o.w> -47&&(!o.altitude||o.altitude<163));
      if(!p.airborne&&next){
        const ttc=(next.x+(next.inset||5)-47)/Math.max(1,r.speed+(next.approachSpeed||0));
        if(!charging&&ttc<=lead+charge*C.chargeSeconds){charging=true;held=0;actions.push({at:elapsed,action:'hold'});}
        if(charging){held+=dt;if(held+1e-9>=charge*C.chargeSeconds+(charge>0?dt:0)){lateTarget=nearWindow(next.x+(next.inset||5)-47,r.speed+(next.approachSpeed||0))?next:null;p.jumpFactor=q&&activeBooster(q,'jump')?1.25:1;launch(p,charge);charging=false;actions.push({at:elapsed,action:'jump',charge});}}
      }
      if(q){advanceBoosters(q,dt);r.boost=.35*q.speedBlend;e.scoreFactor=activeBooster(q,'score')?3:1;}
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
        if(timingMargin>0&&(!validateRoute(obstacles,{flight,pace,economy,time,boosterState,charges:[charge],leads:[lead-timingMargin],burns:[burn]})||!validateRoute(obstacles,{flight,pace,economy,time,boosterState,charges:[charge],leads:[lead+timingMargin],burns:[burn]})))break;
        return {charge,lead,burn,actions,nearLandings,lateTakeoffs,duration:elapsed,fuelUsed:flight.fuel-p.fuel,exit:{y:0,angle:0,vx:p.vx},clearanceVerified:true,timingMargin};
      }
    }
  }
  return null;
}
