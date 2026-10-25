import {GAMEPLAY as C} from './gameplay-config.js?v=4.7.3';
import {obstacleBoxes} from './physics.js?v=4.7.3';
import {fallPolygons,interpolateFall} from './fall.js?v=4.7.3';
export const TAU=Math.PI*2;
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const approach=(x,target,amount)=>x<target?Math.min(target,x+amount):Math.max(target,x-amount);
export function uprightError(angle,direction=-1){
  let e=((angle+Math.PI)%TAU+TAU)%TAU-Math.PI;
  if(Math.abs(Math.abs(e)-Math.PI)<1e-9)e=-Math.sign(direction||-1)*Math.PI;
  return e;
}
export function resetAirRotation(p){p.spinHeld=false;p.settleTarget=0;}
export function createFlight(fuel=C.initialFuel){return {spinHeld:false,settleTarget:0,y:0,vy:0,vx:0,angle:0,omega:0,airborne:false,time:0,fuel,thrusting:false,latched:false,attach:0,maxTurn:0,turns:0,lastDirection:-1,trickStarted:false,grab:0,launchVelocity:0,jumpFactor:1};}
export function launch(p,charge=0){
  if(p.airborne)return false;
  resetAirRotation(p);
  Object.assign(p,{y:.001,vy:(C.jumpSpeed+C.chargedSpeed*clamp(charge,0,1))*(p.jumpFactor||1),angle:0,omega:0,airborne:true,time:0,latched:false,attach:0,maxTurn:0,turns:0,trickStarted:false,grab:0,launchVelocity:(C.jumpSpeed+C.chargedSpeed*clamp(charge,0,1))*(p.jumpFactor||1)});
  return true;
}
// Shared by live play and route validation. No DOM, audio, timers or randomness.
export function advanceFlight(p,dt,{spin=false,thrust=false}={}){
  p.thrusting=false;
  const gripTarget=p.airborne&&spin?1:0;
  p.grab=approach(p.grab,gripTarget,dt/(gripTarget?.12:.18));
  if(!p.airborne){resetAirRotation(p);p.vx*=Math.exp(-C.horizontalDrag*dt);return null;}
  p.time+=dt;
  if(spin){p.settleTarget=0;p.trickStarted=true;p.lastDirection=-1;p.omega=approach(p.omega,-C.spinSpeed,C.spinAcceleration*dt);}
  else {
    if(p.spinHeld){
      // Latch this release and this turn only. A rough early abort must not
      // become eligible later merely because the old release floor drifts on.
      const progress=-p.angle,turn=Math.max(1,Math.round(progress/TAU));
      const target=turn*TAU,stopping=progress+p.omega*p.omega/(2*C.releaseDeceleration);
      p.settleTarget=p.omega<0&&progress>=(turn-1)*TAU+C.settleMinTurn&&Math.abs(target-progress)<=C.settleApproach&&Math.abs(stopping-target)<=C.landingAngle?target:0;
    }
    // Opening the body brakes the existing rotation, without reversing or
    // rotating toward a chosen angle. Untouched ordinary jumps remain upright.
    const target=Math.sign(p.omega)*Math.min(Math.abs(p.omega),C.releaseSpeed);
    p.omega=approach(p.omega,target,C.releaseDeceleration*dt);
    if(p.settleTarget){
      const past=-p.angle-p.settleTarget;
      if(p.omega>0||past>C.landingAngle||past< -C.settleApproach)p.settleTarget=0;
      else if(Math.abs(p.omega)<=C.releaseSpeed+1e-9){
        // Dissipative only: no target torque, angle assignment or sign change.
        // Retain the narrow PERFECT window, then ease into a natural lean.
        const u=clamp((past-C.perfectAngle)/(C.settleFullAngle-C.perfectAngle),0,1);
        p.omega*=Math.exp(-C.settleDamping*u*u*(3-2*u)*dt);
      }
    }
  }
  p.spinHeld=spin;
  p.angle+=p.omega*dt;
  p.maxTurn=Math.max(p.maxTurn,-p.angle);
  p.turns=Math.floor((p.maxTurn+1e-7)/TAU);
  const burn=thrust?Math.min(dt,p.fuel/C.fuelPerSecond):0;
  if(burn>0){
    p.fuel=Math.max(0,p.fuel-burn*C.fuelPerSecond);p.thrusting=true;p.latched=true;
    p.vx+=Math.sin(p.angle)*C.thrustAcceleration*burn;
    p.vy+=Math.cos(p.angle)*C.thrustAcceleration*burn;
  }
  if(p.latched)p.attach=Math.min(1,p.attach+dt/C.attachSeconds);
  p.vx=clamp(p.vx*Math.exp(-C.horizontalDrag*dt),-C.maxHorizontal,C.maxHorizontal);
  // Exact constant-acceleration position update; fixed-step input remains deterministic.
  p.y+=p.vy*dt-.5*C.gravity*dt*dt;p.vy-=C.gravity*dt;
  if(p.y>0)return null;
  const good=Math.abs(uprightError(p.angle))<=C.landingAngle+1e-9&&Math.abs(p.omega)<=C.landingOmega;
  // A wheel-aligned landing completes the last few degrees within the accepted
  // landing tolerance. Do not lose a whole turn at 358 degrees, or count jitter.
  const turns=good?Math.max(p.turns,Math.round(-p.angle/TAU)):p.turns;
  const perfect=good&&Math.abs(uprightError(p.angle))<=C.perfectAngle+1e-9;
  const result={good,perfect,turns,impact:Math.abs(p.vy),angle:p.angle,omega:p.omega};
  p.turns=turns;
  p.y=0;p.vy=0;p.airborne=false;p.thrusting=false;resetAirRotation(p);
  if(result.good){p.angle=0;p.omega=0;}
  return result;
}
export function createEconomy(){return {scoreFactor:1,bonus:0,multiplier:10,meter:0,decay:0,streak:0,streakLeft:0,flips:0};}
export function comboSeconds(e){return C.comboDuration-C.comboFalloff*(e.multiplier/10-1);}
export function rewardAction(e,count=1){e.multiplier=Math.min(C.maxMultiplier,e.multiplier+count*C.multiplierStep);e.meter=1;e.decay=0;}
export function advanceEconomy(e,dt){
  if(e.meter>0){const used=Math.min(dt,e.meter*comboSeconds(e));e.meter=Math.max(0,e.meter-used/comboSeconds(e));dt-=used;}
  if(e.meter===0&&e.multiplier>10){e.decay+=dt;while(e.decay+1e-9>=C.comboDecaySeconds&&e.multiplier>10){e.multiplier--;e.decay-=C.comboDecaySeconds;}}
}
export function advanceStreak(e,dt){const used=Math.min(dt,e.streakLeft);e.streakLeft-=used;e.streak=Math.max(0,e.streak-(dt-used)*C.streakDecay);}
export function passObstacle(e){const points=C.obstaclePoints*e.multiplier/10*(e.scoreFactor||1);e.bonus+=points;return points;}
export function settleLanding(e,p,result,{late=0,near=0}={}){
  if(!result.good){e.multiplier=10;e.meter=0;e.decay=0;e.streak=0;e.streakLeft=0;return {points:0,turns:0,late:0,near:0,perfect:false,good:false};}
  const n=result.turns,perfect=!!result.perfect,points=(C.flipFactor*n*(n+1)+C.nearPoints*(late+near)+C.perfectPoints*Number(perfect))*e.multiplier/10*(e.scoreFactor||1);
  e.bonus+=points;e.flips+=n;p.fuel=Math.min(C.tank,p.fuel+C.fuelPerFlip*n);
  if(n+late+near+Number(perfect))rewardAction(e,n+late+near+Number(perfect));
  if(n||near){e.streak=Math.min(C.maxStreak,e.streak+C.streakStep);e.streakLeft=C.streakHold;}
  return {points,turns:n,late,near,perfect,good:true};
}
export function createPace(){return {boost:0,progress:0,base:C.startSpeed,speed:C.startSpeed,recovery:null,stumble:0,falling:false};}
export function stumble(pace){
  const target=pace.recovery?.target??pace.base,r=clamp((target-C.startSpeed)/(C.maxSpeed-C.startSpeed),0,1);
  pace.recovery={target,age:0,duration:C.recoveryMin+C.recoveryExtra*r**1.5};pace.stumble=C.stumbleSeconds;pace.base=target*C.recoveryRatio;
}
export function recoverySpeed(r,t){
  const T=r.duration,d=r.target*(1-C.recoveryRatio),v0=r.target*C.recoveryRatio,h=.15,a=T-h;
  if(t<=a)return v0+d*(t/T)**2;
  const u=clamp((t-a)/h,0,1),start=v0+d*(a/T)**2,slope=2*d*a/T**2,endSlope=r.target>=C.maxSpeed?0:(C.maxSpeed-C.startSpeed)/C.rampSeconds;
  return (2*u**3-3*u*u+1)*start+(u**3-2*u*u+u)*h*slope+(-2*u**3+3*u*u)*r.target+(u**3-u*u)*h*endSlope;
}
export function advancePace(pace,e,p,dt){
  if(pace.recovery){
    pace.stumble=Math.max(0,pace.stumble-dt);const r=pace.recovery;r.age=Math.min(r.duration,r.age+dt);pace.base=recoverySpeed(r,r.age);
    if(r.age>=r.duration){pace.base=r.target;pace.recovery=null;}
  }else if(!pace.falling){pace.progress+=dt;pace.base=C.startSpeed+(C.maxSpeed-C.startSpeed)*Math.min(1,pace.progress/C.rampSeconds);}
  pace.speed=Math.max(60,pace.base*(1+e.streak)*(1+(pace.boost||0))+p.vx);return pace.speed;
}
// Collision proxies rotate with the same pivot (65 above tyre baseline) as the art.
export function playerPolygons(p){
  if(p.fallPose)return fallPolygons(p.fallPose);
  const c=Math.cos(p.angle),s=Math.sin(p.angle);
  return [[-47,0,47,25],[-23,25,23,163-32*(p.grab||0)]].map(([l,b,r,t])=>[[l,b],[r,b],[r,t],[l,t]].map(([x,y])=>({x:c*x+s*(y-65),y:p.y+65-s*x+c*(y-65)})));
}
function overlaps(poly,rect){
  const axes=[{x:1,y:0},{x:0,y:1}];
  for(let i=0;i<(poly.length===4?2:poly.length);i++){const a=poly[i],b=poly[(i+1)%poly.length];axes.push({x:-(b.y-a.y),y:b.x-a.x});}
  for(const a of axes){
    let pmin=Infinity,pmax=-Infinity,rmin=Infinity,rmax=-Infinity;
    for(const p of poly){const value=p.x*a.x+p.y*a.y;pmin=Math.min(pmin,value);pmax=Math.max(pmax,value);}
    for(const p of rect){const value=p.x*a.x+p.y*a.y;rmin=Math.min(rmin,value);rmax=Math.max(rmax,value);}
    if(pmax<=rmin||rmax<=pmin)return false;
  }
  return true;
}
export function collisionAt(p,o,dx,time=0){
  if(o.collision==='none')return false;
  if(dx>180||dx+o.w < -180)return false;
  const polygons=playerPolygons(p);
  return obstacleBoxes(o,time).some(b=>{const bottom=o.altitude||0,top=bottom+b.top;const rect=[{x:dx+b.left,y:bottom},{x:dx+b.right,y:bottom},{x:dx+b.right,y:top},{x:dx+b.left,y:top}];return polygons.some(poly=>overlaps(poly,rect));});
}
// Adaptive substeps protect narrow silhouettes at top speed and during angular motion.
export function sweptCollision(before,after,o,dxBefore,dxAfter,time,dt){
  // collisionAt rejects this entire interval. Skip identical misses before
  // allocating/interpolating substeps, including in the route search.
  if(Math.min(dxBefore,dxAfter)>180||Math.max(dxBefore,dxAfter)+o.w< -180)return false;
  const fallTravel=before.fallPose&&after.fallPose?Math.max(...['rider','car'].map(part=>Math.abs(after.fallPose[part].angle-before.fallPose[part].angle)*(part==='car'?55:170)+Math.abs(after.fallPose[part].y-before.fallPose[part].y)+Math.abs(after.fallPose[part].x-before.fallPose[part].x))):0;
  const n=Math.max(1,Math.ceil((Math.abs(dxAfter-dxBefore)+Math.abs(after.y-before.y)+Math.abs(after.angle-before.angle)*170+fallTravel)/4));
  for(let i=0;i<=n;i++){const f=i/n,p={y:before.y+(after.y-before.y)*f,angle:before.angle+(after.angle-before.angle)*f,grab:(before.grab||0)+((after.grab||0)-(before.grab||0))*f};if(before.fallPose&&after.fallPose)p.fallPose=interpolateFall(before.fallPose,after.fallPose,f);if(collisionAt(p,o,dxBefore+(dxAfter-dxBefore)*f,time-dt+dt*f))return true;}
  return false;
}
export function nearWindow(distance,speed){return distance>=0&&distance<=Math.max(0,speed)*C.nearSeconds+1e-8;}
