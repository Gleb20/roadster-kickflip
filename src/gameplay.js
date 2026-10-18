import {GAMEPLAY as C} from './gameplay-config.js?v=3.0.4';
import {obstacleBoxes} from './physics.js?v=3.0.4';
import {fallPolygons,interpolateFall} from './fall.js?v=3.0.4';
export const TAU=Math.PI*2;
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const approach=(x,target,amount)=>x<target?Math.min(target,x+amount):Math.max(target,x-amount);
export function uprightError(angle,direction=-1){
  let e=((angle+Math.PI)%TAU+TAU)%TAU-Math.PI;
  if(Math.abs(Math.abs(e)-Math.PI)<1e-9)e=-Math.sign(direction||-1)*Math.PI;
  return e;
}
export function createFlight(fuel=C.initialFuel){return {y:0,vy:0,vx:0,angle:0,omega:0,airborne:false,time:0,fuel,thrusting:false,latched:false,attach:0,maxTurn:0,turns:0,lastDirection:-1,trickStarted:false,grab:0,launchVelocity:0};}
export function launch(p,charge=0){
  if(p.airborne)return false;
  Object.assign(p,{y:.001,vy:C.jumpSpeed+C.chargedSpeed*clamp(charge,0,1),angle:0,omega:0,airborne:true,time:0,latched:false,attach:0,maxTurn:0,turns:0,trickStarted:false,grab:0,launchVelocity:C.jumpSpeed+C.chargedSpeed*clamp(charge,0,1)});
  return true;
}
// Shared by live play and route validation. No DOM, audio, timers or randomness.
export function advanceFlight(p,dt,{spin=false,thrust=false}={}){
  p.thrusting=false;
  const gripTarget=p.airborne&&p.trickStarted?1:0;
  p.grab=approach(p.grab,gripTarget,dt/ .16);
  if(!p.airborne){p.vx*=Math.exp(-C.horizontalDrag*dt);return null;}
  p.time+=dt;
  const error=uprightError(p.angle,p.lastDirection);
  if(spin){p.trickStarted=true;p.lastDirection=-1;p.omega=approach(p.omega,-C.spinSpeed,C.spinAcceleration*dt);}
  else {
    // Braking distance makes the assistance settle without an instantaneous snap.
    const target=-Math.sign(error)*Math.min(C.assistSpeed,Math.sqrt(2*C.assistAcceleration*Math.abs(error)));
    p.omega=approach(p.omega,target,C.assistAcceleration*dt);
    if(Math.abs(error)<.002&&Math.abs(p.omega)<.15)p.omega=-error/dt;
  }
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
  const good=Math.abs(uprightError(p.angle))<=C.landingAngle&&Math.abs(p.omega)<=C.landingOmega;
  // A wheel-aligned landing completes the last few degrees within the accepted
  // landing tolerance. Do not lose a whole turn at 358 degrees, or count jitter.
  const turns=good?Math.max(p.turns,Math.round(-p.angle/TAU)):p.turns;
  const result={good,turns,impact:Math.abs(p.vy),angle:p.angle,omega:p.omega};
  p.turns=turns;
  p.y=0;p.vy=0;p.airborne=false;p.thrusting=false;
  if(result.good){p.angle=0;p.omega=0;}
  return result;
}
export function createEconomy(){return {bonus:0,multiplier:10,meter:0,decay:0,streak:0,streakLeft:0,flips:0};}
export function comboSeconds(e){return C.comboDuration-C.comboFalloff*(e.multiplier/10-1);}
export function rewardAction(e,count=1){e.multiplier=Math.min(C.maxMultiplier,e.multiplier+count*C.multiplierStep);e.meter=1;e.decay=0;}
export function advanceEconomy(e,dt){
  if(e.meter>0){const used=Math.min(dt,e.meter*comboSeconds(e));e.meter=Math.max(0,e.meter-used/comboSeconds(e));dt-=used;}
  if(e.meter===0&&e.multiplier>10){e.decay+=dt;while(e.decay+1e-9>=C.comboDecaySeconds&&e.multiplier>10){e.multiplier--;e.decay-=C.comboDecaySeconds;}}
}
export function advanceStreak(e,dt){const used=Math.min(dt,e.streakLeft);e.streakLeft-=used;e.streak=Math.max(0,e.streak-(dt-used)*C.streakDecay);}
export function passObstacle(e){const points=C.obstaclePoints*e.multiplier/10;e.bonus+=points;return points;}
export function settleLanding(e,p,result,{late=0,near=0}={}){
  if(!result.good){e.multiplier=10;e.meter=0;e.decay=0;e.streak=0;e.streakLeft=0;return {points:0,turns:0,late:0,near:0,good:false};}
  const n=result.turns,points=(C.flipFactor*n*(n+1)+C.nearPoints*(late+near))*e.multiplier/10;
  e.bonus+=points;e.flips+=n;p.fuel=Math.min(C.tank,p.fuel+C.fuelPerFlip*n);
  if(n+late+near)rewardAction(e,n+late+near);
  if(n||near){e.streak=Math.min(C.maxStreak,e.streak+C.streakStep);e.streakLeft=C.streakHold;}
  return {points,turns:n,late,near,good:true};
}
export function createPace(){return {progress:0,base:C.startSpeed,speed:C.startSpeed,recovery:null,stumble:0,falling:false};}
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
  pace.speed=Math.max(60,pace.base*(1+e.streak)+p.vx);return pace.speed;
}
// Collision proxies rotate with the same pivot (65 above tyre baseline) as the art.
export function playerPolygons(p){
  if(p.fallPose)return fallPolygons(p.fallPose);
  const c=Math.cos(p.angle),s=Math.sin(p.angle);
  return [[-47,0,47,25],[-23,25,23,163-32*(p.grab||0)]].map(([l,b,r,t])=>[[l,b],[r,b],[r,t],[l,t]].map(([x,y])=>({x:c*x+s*(y-65),y:p.y+65-s*x+c*(y-65)})));
}
function overlaps(poly,rect){
  const axes=[{x:1,y:0},{x:0,y:1}];
  for(let i=0;i<2;i++){const a=poly[i],b=poly[i+1];axes.push({x:-(b.y-a.y),y:b.x-a.x});}
  for(const a of axes){const ps=poly.map(p=>p.x*a.x+p.y*a.y),rs=rect.map(p=>p.x*a.x+p.y*a.y);if(Math.max(...ps)<=Math.min(...rs)||Math.max(...rs)<=Math.min(...ps))return false;}
  return true;
}
export function collisionAt(p,o,dx,time=0){
  if(dx>180||dx+o.w < -180)return false;
  const polygons=playerPolygons(p);
  return obstacleBoxes(o,time).some(b=>{const bottom=o.altitude||0,top=bottom+b.top;const rect=[{x:dx+b.left,y:bottom},{x:dx+b.right,y:bottom},{x:dx+b.right,y:top},{x:dx+b.left,y:top}];return polygons.some(poly=>overlaps(poly,rect));});
}
// Adaptive substeps protect narrow silhouettes at top speed and during angular motion.
export function sweptCollision(before,after,o,dxBefore,dxAfter,time,dt){
  const fallTravel=before.fallPose&&after.fallPose?Math.abs(after.fallPose.rider.angle-before.fallPose.rider.angle)*170+Math.abs(after.fallPose.rider.y-before.fallPose.rider.y):0;
  const n=Math.max(1,Math.ceil((Math.abs(dxAfter-dxBefore)+Math.abs(after.y-before.y)+Math.abs(after.angle-before.angle)*170+fallTravel)/4));
  for(let i=0;i<=n;i++){const f=i/n,p={y:before.y+(after.y-before.y)*f,angle:before.angle+(after.angle-before.angle)*f,grab:(before.grab||0)+((after.grab||0)-(before.grab||0))*f};if(before.fallPose&&after.fallPose)p.fallPose=interpolateFall(before.fallPose,after.fallPose,f);if(collisionAt(p,o,dxBefore+(dxAfter-dxBefore)*f,time-dt+dt*f))return true;}
  return false;
}
export function nearWindow(distance,speed){return distance>=0&&distance<=Math.max(0,speed)*C.nearSeconds+1e-8;}
