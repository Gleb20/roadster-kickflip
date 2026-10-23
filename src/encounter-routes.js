import {GAMEPLAY as C} from './gameplay-config.js?v=4.7.0';
import {createFlight,createPace,createEconomy,launch,advanceFlight,advancePace,advanceEconomy,advanceStreak,settleLanding,passObstacle,sweptCollision,nearWindow,rewardAction} from './gameplay.js?v=4.7.0';
import {createGrind,advanceRail} from './rails.js?v=4.7.0';
import {advanceBoosters,activeBooster} from './boosters.js?v=4.7.0';
import {speedView,advanceSpeedView} from './speed-feedback.js?v=4.7.0';
export const ENCOUNTER=Object.freeze({tickBudget:18000,policyBudget:40,window:.18,sample:.03,rest:.25,accentRest:.45,airCooldown:14,railAirCooldown:16,tallPreparation:.74,tallErrorPreparation:.64});
export const encounterBudget=()=>({ticks:0,policies:0,candidates:0,exhausted:false});
// Minimum forward sight over supported viewports. Live validation advances the
// same damped effective-speed camera as the renderer; this helper is static.
export function preparationSeconds(type,pace,{charge=0,lead=.2,speed=pace.speed,viewStrength=null}={}){
 const strength=viewStrength??Math.max(0,Math.min(1.3,(speed-C.startSpeed)/300)-.02);
 // The minimum forward horizon over W>=320,H>=390 occurs where the
 // desktop 550-unit horizon cap meets the maximum base scale 1.25. Smaller
 // heights can only reduce scale; phone anchors put the rider farther back.
 const width=(550*1.25+24)/.71,view=speedView(width,900,speed,strength);
 const silhouette=(width-view.x)/view.scale-type.w-47;
 return silhouette/Math.max(60,speed+(type.approachSpeed||0))-charge*C.chargeSeconds-lead;
}
/** One combined production-physics witness. The fixed budget is shared by all
 * candidates of a spawn; CPU time never changes the deterministic outcome. */
export function simulateEncounter(obstacles,{flight=createFlight(),pace=createPace(),economy=createEconomy(),boosterState=null,time=0,rail=null,charge=.4,lead=.2,secondLead=lead,noInput=false,requireCatch=!!rail,budget=encounterBudget(),minGroundGap=0,prefix=null,stopBeforeHold=null,viewStrength=0,targetMode=rail?'rail':'ground',forbidCatch=false,minSlide=0}={}){
 if(flight.airborne||pace.recovery||pace.falling||pace.stumble>0||budget.exhausted)return null;
 if(budget.policies>=ENCOUNTER.policyBudget){budget.exhausted=true;return null;}budget.policies++;
 const p={...(prefix?.p||flight)},r=structuredClone(prefix?.r||pace),e={...(prefix?.e||economy)},q=prefix?structuredClone(prefix.q):boosterState?structuredClone(boosterState):null,g=prefix?structuredClone(prefix.g):createGrind(),rails=prefix?structuredClone(prefix.rails):rail?[{...structuredClone(rail),uid:1}]:[],obs=(prefix?.obs||obstacles).map(o=>({...o})),actions=[],preparations=[];
 const view={strength:prefix?.view?.strength??viewStrength},visibleAt=prefix?.visibleAt?[...prefix.visibleAt]:obs.map(()=>null);
 let charging=false,holdTick=0,jumps=0,caught=false,groundSince=null,minGap=Infinity,lateTarget=null,nearLandings=0,lateTakeoffs=0,firstPreparation=Infinity,catchAt=null,exitAt=null,grindDistance=0;
 const dt=1/120,chargeTicks=Math.round(charge*C.chargeSeconds/dt),groundTargets=obs.filter(o=>!o.altitude);
 const horizon=Math.min(1800,Math.ceil((Math.max(0,...obstacles.map(o=>o.x+o.w),rail?rail.x+rail.w:0)+300)/Math.max(60,Math.min(pace.speed,pace.base)) *120+360));
 for(let tick=prefix?.tick||0;tick<horizon;tick++){
  if(budget.ticks>=ENCOUNTER.tickBudget){budget.exhausted=true;return null;}budget.ticks++;
  const t=tick*dt,nextGround=groundTargets.find(o=>!o.targeted&&o.x+o.w> -47),target=targetMode==='rail'&&rail&&jumps===0?rails[0]:nextGround,isRailTarget=target===rails[0];
  const width=(550*1.25+24)/.71,framing=speedView(width,900,r.speed,view.strength),sight=(width-framing.x)/framing.scale;
  for(let i=0;i<obs.length;i++)if(visibleAt[i]===null&&obs[i].x+obs[i].w<=sight)visibleAt[i]=t;
  if(stopBeforeHold!==null&&target&&(target.x+(target.inset||5)-(isRailTarget?0:47))/Math.max(1,r.speed+(target.approachSpeed||0))<=stopBeforeHold)return {p,r,e,q,g,rails,obs,tick,view,visibleAt};
  if(!noInput&&!p.airborne&&!g.support&&target){
   const targetLead=jumps>0?secondLead:lead,ttc=(target.x+(target.inset||5)-(isRailTarget?0:47))/Math.max(1,r.speed+(target.approachSpeed||0));
   if(!charging&&ttc<=targetLead+chargeTicks*dt){
    if(groundSince!==null){const gap=t-groundSince;minGap=Math.min(minGap,gap);if(gap+1e-8<minGroundGap)return null;}
    charging=true;holdTick=tick;actions.push({at:t,action:'hold'});
    const indices=isRailTarget?obs.flatMap((o,i)=>o.altitude?[i]:[]):[obs.indexOf(target)],prep=indices.length?Math.min(...indices.map(i=>visibleAt[i]===null?0:t-visibleAt[i])):Infinity;
    firstPreparation=Math.min(firstPreparation,prep);preparations.push({target:isRailTarget?'rail':target.id,holdAt:t,visibleAt:indices.length?Math.max(...indices.map(i=>visibleAt[i]??t)):null,seconds:Number.isFinite(prep)?prep:null});
   }
   if(charging&&tick-holdTick>=chargeTicks){
    const usedCharge=(tick-holdTick)*dt/C.chargeSeconds;p.jumpFactor=q&&activeBooster(q,'jump')?1.25:1;
    lateTarget=!isRailTarget&&nearWindow(target.x+(target.inset||5)-47,r.speed+(target.approachSpeed||0))?target:null;
    launch(p,usedCharge);target.targeted=true;jumps++;charging=false;actions.push({at:t,action:'jump',charge:usedCharge});
   }
  }
  if(q){advanceBoosters(q,dt);r.boost=.35*q.speedBlend;e.scoreFactor=activeBooster(q,'score')?3:1;}
  advanceEconomy(e,dt);advanceStreak(e,dt);const before={...p};let landed=advanceFlight(p,dt);advancePace(r,e,p,dt);advanceSpeedView(view,dt,1002,900,r.speed);
  if(rail){const events=advanceRail(g,p,before,rails,r.speed*dt,dt,e);if(events.some(v=>v.type==='rail-catch')){if(forbidCatch)return null;caught=true;catchAt=t+dt;}if(events.some(v=>v.type==='rail-exit'))exitAt=t+dt;grindDistance=g.distance;if(g.support)landed=null;}
  const after=landed?{...p,angle:landed.angle}:p;
  for(const o of obs){const old=o.x;o.x-=(r.speed+(o.approachSpeed||0))*dt;if(sweptCollision(before,after,o,old,o.x,time+t+dt,dt))return null;if(!o.passed&&o.x+o.w< -50){o.passed=true;passObstacle(e);}}
  if(landed){
   if(!landed.good)return null;
   let near=0;const late=lateTarget&&lateTarget.x+lateTarget.w-(lateTarget.inset||5)< -47?1:0;
   for(const o of obs)if(!o.altitude&&!o.nearPaid&&nearWindow(-47-(o.x+o.w-(o.inset||5)),r.speed)){near++;o.nearPaid=true;}
   settleLanding(e,p,landed,{late,near});nearLandings+=near;lateTakeoffs+=late;lateTarget=null;groundSince=t+dt;
   if(g.distance>0){e.bonus+=g.pending;rewardAction(e);Object.assign(g,createGrind());}
  }
  if(obs.every(o=>o.x+o.w< -180)&&rails.every(o=>o.x+o.w< -180)&&!p.airborne&&!g.support){
   if(requireCatch&&(!caught||exitAt===null||exitAt-catchAt+1e-8<minSlide))return null;
   return {charge,lead,secondLead,burn:0,actions,duration:t+dt,fuelUsed:0,preparations,nearLandings,lateTakeoffs,caught,catchAt,exitAt,slideSeconds:catchAt===null?0:(exitAt??t+dt)-catchAt,grindDistance,jumps,minGroundGap:Number.isFinite(minGap)?minGap:null,preparation:Number.isFinite(firstPreparation)?firstPreparation:null,clearanceVerified:true,visibility:obs.map((o,i)=>({id:o.id,at:visibleAt[i]})),exit:{y:0,angle:0,vx:p.vx}};
  }
 }
 return null;
}
export function prepareEncounter(obstacles,options,policies,budget=encounterBudget()){
 // Include the earliest actual charge+timing corner, not just the nominal
 // input. The prefix must never skip a hold that a witness intends to make.
 const maxTrigger=Math.max(...policies.map(([charge,lead])=>lead+.09+Math.round(Math.min(1,charge+.1)*C.chargeSeconds*120)/120));
 return simulateEncounter(obstacles,{...options,budget,noInput:true,requireCatch:false,stopBeforeHold:maxTrigger});
}
/** Seven contiguous samples, including their interior; pair timing is also
 * varied independently. Large charge/error matrices belong to offline checks. */
export function validateEncounter(obstacles,options={}){
 const budget=options.budget||encounterBudget(),rail=options.rail,groundRoute=!rail||options.targetMode==='ground';
 if(options.noInput)return simulateEncounter(obstacles,{...options,budget,requireCatch:false,noInput:true});
 const type=obstacles.find(o=>!o.altitude),speed=options.pace?.speed||360,h=type?.h||0;
 const lowCharge=Math.max(0,.19-Math.max(0,speed-360)*.0016),lowLead=.15+Math.min(.03,Math.max(0,speed-360)*.00025);
 let policies=options.policies||(!groundRoute?[[.5,.35],[.5,.5],[1,.35]]:h<=45?[[lowCharge,lowLead],[speed<500?.2:.1,.16]]:h<=78?(speed>=760?[[.1,.21],[.2,.22]]:[[speed<410?.3:.2,h<=64?.2:.24],[.3,.24]]):h<=100?[[speed<460?.3:.2,.27],[.3,.28]]:[[.3,.3],[.4,.28],[.5,.27]]);
 if(options.tallSingle&&groundRoute)policies=[[.3,.32],[.35,.3],[.4,.28]];
 const fastGround=groundRoute&&!!type&&!options.tallSingle&&h<=78&&speed>=760;
 const fastPreparation=.85-Math.min(1,Math.max(0,(speed-825)/(1113.75-825)))*.27;
 const minPreparation=options.tallSingle?(h>120?.72:ENCOUNTER.tallPreparation):fastGround?fastPreparation:.9,minErrorPreparation=options.tallSingle?(h>120?.62:ENCOUNTER.tallErrorPreparation):fastGround?fastPreparation-.1:.8;
 // All candidate policies share the idle approach. Simulate it once, then
 // clone that exact state before the earliest possible hold. No rounded-state
 // cache or alternative physics is involved; actions retain their absolute time.
 const prefix=prepareEncounter(obstacles,options,policies,budget);
 if(!prefix?.p)return null;
 const proof={...options,budget,prefix};
 for(const [charge,lead] of policies){
  const base=simulateEncounter(obstacles,{...proof,charge,lead});if(!base)continue;
  // Optional rails have a safe no-input bypass, but their reward route still
  // needs a broad input window. Mandatory ground routes also need visibility.
  if((groundRoute||obstacles.some(o=>o.altitude))&&(base.preparation??0)<minPreparation)continue;
  let ok=true;
  for(let i=-3;i<=3&&ok;i++){if(i===0)continue;const shifted=simulateEncounter(obstacles,{...proof,charge,lead:lead+i*.03});if(!shifted||(groundRoute||obstacles.some(o=>o.altitude))&&(shifted.preparation??0)<minErrorPreparation)ok=false;}
  if(ok&&base.jumps>1){
   const offsets=[-.09,-.06,-.03,.03,.06,.09];
   for(const shift of offsets)for(const first of [false,true]){const sample=simulateEncounter(obstacles,{...proof,charge,lead:lead+(first?shift:0),secondLead:lead+(first?0:shift)});if(!sample||(sample.preparation??0)<minErrorPreparation){ok=false;break;}}
   if(ok)for(const first of [-.09,.09])for(const second of [-.09,.09]){const sample=simulateEncounter(obstacles,{...proof,charge,lead:lead+first,secondLead:lead+second});if(!sample||(sample.preparation??0)<minErrorPreparation){ok=false;break;}}
  }
  if(ok&&groundRoute)for(const c of [Math.max(0,charge-.1),Math.min(1,charge+.1)]){if(!simulateEncounter(obstacles,{...proof,charge:c,lead})){ok=false;break;}}
  if(ok&&groundRoute)for(const c of [Math.max(0,charge-(options.tallSingle?.1:.05)),Math.min(1,charge+(options.tallSingle?.1:.05))])for(const offset of options.tallSingle?[-.09,.09]:[-.06,.06]){if(!simulateEncounter(obstacles,{...proof,charge:c,lead:lead+offset})){ok=false;break;}}
  if(ok)return {...base,preparation:rail&&!obstacles.length?null:base.preparation,preparationTarget:rail&&!obstacles.length?null:minPreparation,errorPreparationTarget:minErrorPreparation,timingMargin:.09,timingWindow:.18,sampleStep:.03};
  if(budget.exhausted)return null;
 }
 return null;
}
