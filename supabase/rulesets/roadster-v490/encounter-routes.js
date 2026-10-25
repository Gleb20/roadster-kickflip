import {GAMEPLAY as C} from './gameplay-config.js';
import {createFlight,createPace,createEconomy,launch,advanceFlight,advancePace,advanceEconomy,advanceStreak,settleLanding,passObstacle,sweptCollision,nearWindow,rewardAction} from './gameplay.js';
import {createGrind,advanceRail} from './rails.js';
import {advanceBoosters,activeBooster} from './boosters.js';
import {minimumForwardSight,advanceSpeedView} from './speed-feedback.js';
export const ENCOUNTER=Object.freeze({tickBudget:18000,policyBudget:48,window:.18,sample:.03,rest:.25,accentRest:.45,airCooldown:14,railAirCooldown:16,tallPreparation:.74,tallErrorPreparation:.64});
export const encounterBudget=()=>({ticks:0,policies:0,candidates:0,exhausted:false});
// Minimum forward sight over supported viewports. Live validation advances the
// same damped effective-speed camera as the renderer; this helper is static.
export function preparationSeconds(type,pace,{charge=0,lead=.2,speed=pace.speed,viewStrength=null}={}){
 const strength=viewStrength??Math.max(0,Math.min(6,(speed-C.startSpeed)/300)-.02);
 const silhouette=minimumForwardSight(speed,strength)-type.w-47;
 return silhouette/Math.max(60,speed+(type.approachSpeed||0))-charge*C.chargeSeconds-lead;
}
/** One combined production-physics witness. The fixed budget is shared by all
 * candidates of a spawn; CPU time never changes the deterministic outcome. */
export function simulateEncounter(obstacles,{flight=createFlight(),pace=createPace(),economy=createEconomy(),boosterState=null,time=0,rail=null,charge=.4,lead=.2,secondLead=lead,jumpLeads=null,burn=0,burnAt=.18,noInput=false,requireCatch=!!rail,budget=encounterBudget(),minGroundGap=0,prefix=null,stopBeforeHold=null,viewStrength=0,targetMode=rail?'rail':'ground',forbidCatch=false,minSlide=0}={}){
 if(flight.airborne||pace.recovery||pace.falling||pace.stumble>0||budget.exhausted)return null;
 if(budget.policies>=ENCOUNTER.policyBudget){budget.exhausted=true;return null;}budget.policies++;
 const p={...(prefix?.p||flight)},r=structuredClone(prefix?.r||pace),e={...(prefix?.e||economy)},q=prefix?structuredClone(prefix.q):boosterState?structuredClone(boosterState):null,g=prefix?structuredClone(prefix.g):createGrind(),rails=prefix?structuredClone(prefix.rails):rail?[{...structuredClone(rail),uid:1}]:[],obs=(prefix?.obs||obstacles).map(o=>({...o})),actions=[],preparations=[];
 const view={strength:prefix?.view?.strength??viewStrength},visibleAt=prefix?.visibleAt?[...prefix.visibleAt]:obs.map(()=>null);
 let lastThrust=false,charging=false,holdTick=0,jumps=0,caught=false,groundSince=null,minGap=Infinity,lateTarget=null,nearLandings=0,lateTakeoffs=0,firstPreparation=Infinity,catchAt=null,exitAt=null,grindDistance=0;
 const dt=1/120,chargeTicks=Math.round(charge*C.chargeSeconds/dt),groundTargets=obs.filter(o=>!o.altitude);
 const horizon=Math.min(1800,Math.ceil((Math.max(0,...obstacles.map(o=>o.x+o.w),rail?rail.x+rail.w:0)+300)/Math.max(60,Math.min(pace.speed,pace.base)) *120+360));
 for(let tick=prefix?.tick||0;tick<horizon;tick++){
  if(budget.ticks>=ENCOUNTER.tickBudget){budget.exhausted=true;return null;}budget.ticks++;
  const t=tick*dt,nextGround=groundTargets.find(o=>!o.targeted&&o.x+o.w> -47),target=targetMode==='rail'&&rail&&jumps===0?rails[0]:nextGround,isRailTarget=target===rails[0];
  const sight=minimumForwardSight(r.speed,view.strength);
  for(let i=0;i<obs.length;i++)if(visibleAt[i]===null&&obs[i].x+obs[i].w<=sight)visibleAt[i]=t;
  if(stopBeforeHold!==null&&target&&(target.x+(target.inset||5)-(isRailTarget?0:47))/Math.max(1,r.speed+(target.approachSpeed||0))<=stopBeforeHold)return {p,r,e,q,g,rails,obs,tick,view,visibleAt};
  if(!noInput&&!p.airborne&&!g.support&&target){
   const targetLead=jumpLeads?.[jumps]??(jumps>0?secondLead:lead),ttc=(target.x+(target.inset||5)-(isRailTarget?0:47))/Math.max(1,r.speed+(target.approachSpeed||0));
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
  advanceEconomy(e,dt);advanceStreak(e,dt);const before={...p};const useThrust=p.airborne&&p.time>=burnAt&&p.time<burnAt+burn;if(useThrust!==lastThrust){actions.push({at:t,action:useThrust?'thrust-on':'thrust-off'});lastThrust=useThrust;}let landed=advanceFlight(p,dt,{thrust:useThrust});advancePace(r,e,p,dt);advanceSpeedView(view,dt,1002,900,r.speed);
  if(rail){const events=advanceRail(g,p,before,rails,r.speed*dt,dt,e);if(events.some(v=>v.type==='rail-catch')){if(forbidCatch)return null;if(!caught)catchAt=t+dt;caught=true;}if(events.some(v=>v.type==='rail-exit'))exitAt=t+dt;grindDistance=g.distance;if(g.support)landed=null;}
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
   return {charge,lead,secondLead,burn,actions,duration:t+dt,fuelUsed:flight.fuel-p.fuel,preparations,nearLandings,lateTakeoffs,caught,catchAt,exitAt,slideSeconds:catchAt===null?0:(exitAt??t+dt)-catchAt,grindDistance,jumps,minGroundGap:Number.isFinite(minGap)?minGap:null,preparation:Number.isFinite(firstPreparation)?firstPreparation:null,clearanceVerified:true,visibility:obs.map((o,i)=>({id:o.id,at:visibleAt[i]})),exit:{y:0,angle:0,vx:p.vx}};
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
 let policies=options.policies||(!groundRoute?[[.5,.35],[.5,.5],[1,.35]]:h<=45?(speed<420?[[lowCharge,lowLead],[.15,.16],[.1,.16],[0,.165]]:speed<550?[[.1,.16],[.15,.16],[0,.165]]:[[0,.165],[.1,.16],[0,.18]]):h<=78?(speed>=760?[[.1,.21],[.2,.22]]:[[speed<410?.3:.2,h<=64?.2:.24],[.3,.24]]):h<=100?[[speed<460?.3:.2,.27],[.3,.28]]:[[.3,.3],[.4,.28],[.5,.27]]);
 if(options.fallbackGround&&!options.policies&&groundRoute&&h<=45){
  // A pickup expiring during the approach needs a slow-speed jump policy,
  // while a sustained pickup needs the short uncharged timing band.
  const expiring=(options.boosterState?.active?.speed??0)>0&&(options.boosterState.active.speed<.5),v=expiring?options.pace.base:speed;
  const c=Math.max(0,(type.w>=115?.25:.19)-Math.max(0,v-360)*(type.w>=115?.0025:.0016)),l=v<400?.15:.155;
  const first=v<420?[c,l]:expiring&&type.w>=115?[c+.025,.155]:v<550?[.1,.16]:[0,.165];
  policies=[first,[0,.165],[0,.163],[0,.167],[.1,.16],[.15,.16],[.125,.155],[.15,.155],[.2,.15],[.25,.15]].filter((p,i,a)=>a.findIndex(q=>q[0]===p[0]&&q[1]===p[1])===i);
 }
 if(options.tallSingle&&groundRoute&&!options.policies)policies=[h>120?[.34,.3]:h<=100?[.26,.27]:[.3,.31],[.32,.3],[.34,.3]];
 const fastGround=groundRoute&&!!type&&!options.tallSingle&&h<=78&&speed>=760;
 const fastPreparation=.85-Math.min(1,Math.max(0,(speed-825)/(1113.75-825)))*.27;
 const fallbackLow=options.fallbackGround&&groundRoute&&!!type&&h<=45;
 const pressure=Math.max(0,Math.min(1,(speed-740)/220));
 const relief=pressure*(speed>=1200?.27:.20);
 const minPreparation=Math.max(options.tallSingle?.5:.45,(options.tallSingle?(h>120?.72:ENCOUNTER.tallPreparation):fastGround?Math.max(.58,fastPreparation-(fallbackLow?.02:0)):fallbackLow?.85:.9)-relief),minErrorPreparation=Math.max(options.tallSingle?.4:.35,(options.tallSingle?(h>120?.62:ENCOUNTER.tallErrorPreparation):fastGround?Math.max(.48,fastPreparation-.1-(fallbackLow?.02:0)):fallbackLow?.75:.8)-relief);
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
  if((groundRoute||obstacles.some(o=>o.altitude))&&(base.preparation??0)+1e-8<minPreparation)continue;
  let ok=true;
  for(let i=-3;i<=3&&ok;i++){if(i===0)continue;const shifted=simulateEncounter(obstacles,{...proof,charge,lead:lead+i*.03});if(!shifted||(groundRoute||obstacles.some(o=>o.altitude))&&(shifted.preparation??0)+1e-8<minErrorPreparation)ok=false;}
  if(ok&&base.jumps===2){
   const offsets=[-.09,-.06,-.03,.03,.06,.09];
   for(const shift of offsets)for(const first of [false,true]){const sample=simulateEncounter(obstacles,{...proof,charge,lead:lead+(first?shift:0),secondLead:lead+(first?0:shift)});if(!sample||(sample.preparation??0)+1e-8<minErrorPreparation){ok=false;break;}}
   if(ok)for(const first of [-.09,.09])for(const second of [-.09,.09]){const sample=simulateEncounter(obstacles,{...proof,charge,lead:lead+first,secondLead:lead+second});if(!sample||(sample.preparation??0)+1e-8<minErrorPreparation){ok=false;break;}}
  }
  if(ok&&base.jumps>2){
   // Vary each jump independently and all endpoint combinations. The uniform
   // seven-sample sweep above also covers interior timing across the sequence.
   const n=base.jumps,variations=[];
   for(let j=0;j<n;j++)for(const shift of [-.09,.09])variations.push(Array.from({length:n},(_,i)=>lead+(i===j?shift:0)));
   for(let mask=0;mask<2**n;mask++)variations.push(Array.from({length:n},(_,i)=>lead+((mask>>i)&1?.09:-.09)));
   for(const jumpLeads of variations){const sample=simulateEncounter(obstacles,{...proof,charge,lead,jumpLeads});if(!sample||(sample.preparation??0)+1e-8<minErrorPreparation){ok=false;break;}}
  }
  if(ok&&groundRoute)for(const c of [Math.max(0,charge-.1),Math.min(1,charge+.1)]){if(!simulateEncounter(obstacles,{...proof,charge:c,lead})){ok=false;break;}}
  if(ok&&groundRoute)for(const c of [Math.max(0,charge-(options.tallSingle?.1:.05)),Math.min(1,charge+(options.tallSingle?.1:.05))])for(const offset of options.tallSingle?[-.09,.09]:[-.06,.06]){if(!simulateEncounter(obstacles,{...proof,charge:c,lead:lead+offset})){ok=false;break;}}
  if(ok)return {...base,preparation:rail&&!obstacles.length?null:base.preparation,preparationTarget:rail&&!obstacles.length?null:minPreparation,errorPreparationTarget:minErrorPreparation,timingMargin:.09,timingWindow:.18,sampleStep:.03};
  if(budget.exhausted)return null;
 }
 return null;
}
