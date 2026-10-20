import {GAMEPLAY as C} from './gameplay-config.js?v=3.4.1';
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);},mix=(a,b,t)=>a+(b-a)*t;
// Shared contact times drive pose, dust and camera response, independent of FPS.
export const FALL_CONTACTS=Object.freeze([.14,.36,.56]);
export function createFall(){return {active:false,age:0,duration:C.fallSeconds,rate:1,taps:0,angle:0,reduced:false};}
export function beginFall(f,result,{reduced=false,speed=C.startSpeed}={}){
 const angle=Math.atan2(Math.sin(result.angle),Math.cos(result.angle));
 const severity=clamp((speed-C.startSpeed)/(C.maxSpeed-C.startSpeed));
 Object.assign(f,{active:true,age:0,duration:C.fallSeconds+C.fallSpeedSeconds*severity,rate:1,taps:0,angle,reduced});
}
export function hastenFall(f){if(!f.active)return false;f.taps++;f.rate=Math.min(C.fallMaxRate,f.rate+C.fallTapRate);return true;}
export function advanceFall(f,dt){
 if(!f.active)return {impacts:0,finished:false};
 const previous=f.age;f.age=Math.min(f.duration,f.age+dt*f.rate);
 const impacts=FALL_CONTACTS.filter(t=>previous<f.duration*t&&f.age>=f.duration*t).length;
 f.active=f.age<f.duration;
 return {impacts,finished:!f.active};
}
export function fallPose(f){
 const p=clamp(f.age/f.duration),sit=ease(p/.14),stand=ease((p-.68)/.11),settle=ease((p-.94)/.06);
 let bounce=0,phase=0,carHop=0;
 let left=0;
 for(let i=0;i<FALL_CONTACTS.length;i++){
  const right=FALL_CONTACTS[i];
  if(p>=left&&p<right-1e-10){
   const t=clamp((p-left)/(right-left)),arc=4*t*(1-t);
   phase=t<1e-9?0:t;carHop=arc*[24,20,12][i];
   if(i>0)bounce=arc*[0,38,24][i];
   break;
  }
  left=right;
 }
 const launch=clamp((p-.77)/.20),jump=4*launch*(1-launch),gather=ease((p-.77)/.19);
 const seat=sit*(1-stand),crouch=mix(.7,1,ease((p-.56)/.12))*(1-ease((p-.77)/.17));
 const rider={x:mix(-28*sit,0,gather),y:mix(mix(mix(95,54,sit),68,stand)+bounce,95,gather)+55*jump,
  angle:mix(f.angle,-.46,sit)*(1-ease((p-.56)/.20)),seat,crouch};
 // Lean about the seated pelvis so the bottom keeps the same road contact.
 const pelvis=23.5+27*crouch;
 rider.y+=(Math.cos(rider.angle)-Math.cos(-.12))*pelvis*seat;
 // Upright photographed pose at every contact; three complete longitudinal flips.
 const car={x:38*sit*(1-gather),y:12+carHop+15*jump,angle:f.angle*(1-sit)+.13*Math.sin(phase*Math.PI*2),phase};
 const entry=y=>({x:Math.sin(f.angle)*(y-65),y:65+Math.cos(f.angle)*(y-65)});
 const e=entry(95),c=entry(12);
 rider.x+=e.x*(1-sit);rider.y+=(e.y-95)*(1-sit);
 car.x+=c.x*(1-sit);car.y+=(c.y-12)*(1-sit);
 // Final compression lands the rider exactly onto the normal riding anchor.
 rider.y-=3*Math.sin(settle*Math.PI);car.y-=1.5*Math.sin(settle*Math.PI);
 let shake=0;for(const hit of FALL_CONTACTS)if(p>=hit)shake=Math.max(shake,Math.exp(-(p-hit)*40));
 const pose={car,rider,crouch,flail:seat*(.65+.35*clamp(bounce/20))*(1-ease((p-.56)/.10)),push:ease((p-.64)/.08)*(1-ease((p-.77)/.06)),shake:shake*2.4,progress:p};
 if(f.reduced){pose.car={x:0,y:12,angle:0,phase:0};pose.rider={x:0,y:95,angle:0,seat:0,crouch};pose.shake=0;pose.push=0;pose.flail=0;}
 return pose;
}
export function fallPolygons(pose){
 // Lower/shorter seated silhouette follows the same leg extension and torso drop.
 const seat=pose.rider.seat||0,crouch=pose.rider.crouch||0;
 return [[pose.car,[-47,-12,47,13+(pose.car.phase?10:0)]],[pose.rider,[-23,-70+4*seat,23+48*seat,68-27*crouch]]].map(([body,[l,b,r,t]])=>{
  const c=Math.cos(body.angle),s=Math.sin(body.angle);
  return [[l,b],[r,b],[r,t],[l,t]].map(([x,y])=>({x:body.x+c*x+s*y,y:body.y-s*x+c*y}));
 });
}
export function interpolateFall(a,b,t){
 const pose={};for(const part of ['car','rider']){pose[part]={};for(const k of ['x','y','angle','seat','crouch','phase'])pose[part][k]=mix(a[part][k]||0,b[part][k]||0,t);}return pose;
}
