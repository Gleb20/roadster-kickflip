import {GAMEPLAY as C} from './gameplay-config.js?v=4.11.0';
import {uprightError,resetAirRotation,createFlight,advanceFlight,launch,createPace,createEconomy,advancePace,advanceEconomy,advanceStreak} from './gameplay.js?v=4.11.0';
import {activeBooster,advanceBoosters} from './boosters.js?v=4.11.0';
export const RAIL=Object.freeze({height:190,length:720,belly:8,pointsPerUnit:.1,firstWave:3,every:7,exitSeconds:1.25});
export const makeRail=(x,width=RAIL.length)=>({x,w:width,h:RAIL.height,paid:[],passed:false});
export const createGrind=()=>({support:null,age:0,exit:null,exitAge:1,pending:0,distance:0,turns:0});
// Same 65-unit pivot as the collision proxy and photographed hull. The belly,
// rather than the tyres, touches the rail; accepted angles are never snapped.
export const railContactHeight=p=>p.y+65+(RAIL.belly-65)*Math.cos(p.angle);
export function leaveRail(g,p){
 resetAirRotation(p);
 g.support=null;g.age=0;g.exit='end';g.exitAge=0;p.airborne=true;p.angle=uprightError(p.angle);p.omega=0;p.maxTurn=Math.max(0,-p.angle);p.turns=0;p.time=0;p.launchVelocity=0;p.trickStarted=true;
}
export function jumpFromRail(g,p,charge){
 const y=p.y,angle=uprightError(p.angle);leaveRail(g,p);p.airborne=false;launch(p,charge);p.y+=y;p.angle=angle;p.trickStarted=true;g.exit='jump';
}
function newDistance(rail,a,b){
 a=Math.max(0,a);b=Math.min(rail.w,b);if(b<=a)return 0;
 let fresh=b-a;for(const [l,r] of rail.paid)fresh-=Math.max(0,Math.min(b,r)-Math.max(a,l));
 const ranges=[...rail.paid,[a,b]].sort((x,y)=>x[0]-y[0]),merged=[];
 for(const range of ranges){const last=merged.at(-1);if(last&&range[0]<=last[1])last[1]=Math.max(last[1],range[1]);else merged.push([...range]);}rail.paid=merged;return Math.max(0,fresh);
}
/** Move rider-relative rails and resolve a swept downward top crossing only. */
export function advanceRail(g,p,before,rails,travel,dt,e,{spoiled=false,blocked=false}={}){
 g.exitAge=Math.min(1,g.exitAge+dt);
 const events=[],oldXs=rails.map(r=>r.x);for(const r of rails){r.x-=travel;r.passed=r.x+r.w<0;}
 let fraction=0,rail=rails.find(r=>r.uid===g.support);
 if(g.support&&!rail){leaveRail(g,p);events.push({type:'rail-exit',reason:'end'});return events;}
 if(!rail&&!blocked&&before.airborne){
  const old=railContactHeight(before),now=railContactHeight(p);
  const good=p.vy<=0&&Math.abs(uprightError(p.angle))<=C.landingAngle+1e-9&&Math.abs(p.omega)<=C.landingOmega;
  if(good&&old>=RAIL.height&&now<=RAIL.height&&old>now){
   fraction=(old-RAIL.height)/(old-now);
   rail=rails.find((r,i)=>{const x=oldXs[i]-travel*fraction;return x<=0&&x+r.w>=0;});
   if(rail){resetAirRotation(p);g.support=rail.uid;g.age=0;g.turns+=Math.max(p.turns,Math.round(-p.angle/(Math.PI*2)));p.turns=0;p.airborne=false;p.omega=0;p.vy=0;p.thrusting=false;p.grab=0;events.push({type:'rail-catch',uid:rail.uid,impact:Math.abs(before.vy)});}
  }
 }
 if(rail){
  const i=rails.indexOf(rail),start=-oldXs[i]+travel*fraction,end=-rail.x;
  const distance=newDistance(rail,start,end);
  if(!spoiled){g.distance+=distance;g.pending+=distance*RAIL.pointsPerUnit*e.multiplier/10*(e.scoreFactor||1);}
  g.age+=dt*(1-fraction);p.y=rail.h-65-(RAIL.belly-65)*Math.cos(p.angle);p.vy=0;p.omega=0;p.thrusting=false;
  if(distance>0)events.push({type:'rail-travel',uid:rail.uid,distance,points:spoiled?0:distance*RAIL.pointsPerUnit*e.multiplier/10*(e.scoreFactor||1)});
  if(rail.x+rail.w<=0){leaveRail(g,p);events.push({type:'rail-exit',reason:'end'});}
 }
 return events;
}
/** Actual production physics, no fuel: verify catch and safe grounded exit at
 * three launch timings. The no-input route is independently safe by geometry. */
export function validateRailRoute(rail,{flight=createFlight(),pace=createPace(),economy=createEconomy(),boosterState=null,margin=.09}={}){
 if(flight.airborne||pace.recovery||pace.falling)return null;
 const simulate=(lead,charge)=>{
  const p={...flight},r=structuredClone(pace),e={...economy},q=boosterState?structuredClone(boosterState):null,g=createGrind(),rails=[{...structuredClone(rail),uid:1}],actions=[];
  let jumped=false,caught=false,charging=false,held=0;
  for(let tick=0;tick<1800;tick++){
   const dt=1/120,t=tick*dt;
   if(!jumped&&rails[0].x/Math.max(1,r.speed)<=lead+charge*C.chargeSeconds){
    if(!charging){charging=true;actions.push({at:t,action:'hold'});}held+=dt;
    if(held+1e-9>=charge*C.chargeSeconds+(charge>0?dt:0)){p.jumpFactor=q&&activeBooster(q,'jump')?1.25:1;launch(p,Math.min(1,(held-dt)/C.chargeSeconds));jumped=true;actions.push({at:t,action:'jump',charge});}
   }
   if(q){advanceBoosters(q,dt);r.boost=.35*q.speedBlend;}advanceEconomy(e,dt);advanceStreak(e,dt);
   const before={...p},landed=advanceFlight(p,dt);advancePace(r,e,p,dt);
   const events=advanceRail(g,p,before,rails,r.speed*dt,dt,e);if(events.some(v=>v.type==='rail-catch'))caught=true;
   if(landed&&!g.support){if(!landed.good)return null;if(caught&&rails[0].passed)return {charge,lead,burn:0,actions,duration:t,fuelUsed:0,clearanceVerified:true,timingMargin:margin,exit:{y:0,angle:0,vx:p.vx}};}
  }return null;
 };
 for(const charge of [.5,1])for(const lead of [.25,.35,.45,.55]){const route=simulate(lead,charge);if(route&&simulate(lead-margin,charge)&&simulate(lead+margin,charge))return route;}return null;
}
