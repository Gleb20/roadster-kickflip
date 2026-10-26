import {GAMEPLAY as C} from './gameplay-config.js?v=4.11.1';
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);},mix=(a,b,t)=>a+(b-a)*t;
// Shared contact times drive pose, dust and camera response, independent of FPS.
export const FALL_CONTACTS=Object.freeze([.14,.36,.56]);
export const FALL_CAR_CONTACTS=Object.freeze([.16,.38]);
// Side-view support hull measured on the existing upright 108px Roadster.
// Coordinates are Canvas x/right, y/down around car(0,12), not new artwork.
export const FALL_CAR_HULL=Object.freeze([[-49,-7],[-8,-15],[8,-15],[48.5,0],[47,6],[27,12],[-34,12],[-46,5]].map(Object.freeze));
export function fallCarSupport(angle){return Math.max(...FALL_CAR_HULL.map(([x,y])=>x*Math.sin(angle)+y*Math.cos(angle)));}
const arc=(p,a,b,height)=>{const t=clamp((p-a)/(b-a));return t<1e-12||t>1-1e-12?0:height*4*t*(1-t);};
const pulse=(p,hit)=>ease((p-hit+.035)/.035)*(1-ease((p-hit)/.055));
function track(keys,p){let i=1;while(i<keys.length-1&&p>keys[i][0])i++;const [a,b]=[keys[i-1],keys[i]];return mix(a[1],b[1],ease((p-a[0])/(b[0]-a[0])));}
export function createFall(){return {active:false,age:0,duration:C.fallSeconds,rate:1,taps:0,angle:0,reduced:false};}
export function beginFall(f,result,{reduced=false,speed=C.startSpeed}={}){
 const angle=Math.atan2(Math.sin(result.angle),Math.cos(result.angle));
 const severity=clamp((speed-C.startSpeed)/(740-C.startSpeed));
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
 const p=clamp(f.age/f.duration),sit=ease(p/.14),stand=ease((p-.68)/.16),gather=ease((p-.70)/.22),settle=clamp((p-.97)/.03);
 const impact=Math.max(...FALL_CONTACTS.map(hit=>pulse(p,hit))),seat=sit*(1-stand);
 const crouch=(.72+.18*impact)*seat+(settle===1?0:.1*Math.sin(settle*Math.PI));
 // Exactly two low butt rebounds. The third contact itself launches the much
 // higher reunion arc; standing starts in flight, with no planted-hand push.
 const lift=p<.36?arc(p,.14,.36,32):p<.56?arc(p,.36,.56,28):arc(p,.56,.97,112);
 const angle=mix(f.angle,-.64,sit)*(1-stand);
 // Rear hip + the existing trouser/outline radius is the seated road anchor.
 // Compressing the torso or changing lean cannot make the pelvis drift down.
 const seatAnchor=-11*Math.sin(angle)+(22.5+27*crouch)*Math.cos(angle)+9;
 const rider={x:34*sit*(1-gather),y:mix(95,seatAnchor,seat)+lift,angle,seat,crouch,lift};
 const entry=y=>({x:Math.sin(f.angle)*(y-65),y:65+Math.cos(f.angle)*(y-65)});
 const e=entry(95),c=entry(12);
 rider.x+=e.x*(1-sit);rider.y+=(e.y-95)*(1-sit);
 // The original side-view photograph pitches end-over-end: nose, roof, rear,
 // upright. Height follows its support hull, so the rotating ends meet ground.
 const carAngle=track([[0,f.angle],[.16,.95],[.29,Math.PI],[.38,2*Math.PI-1.02],[.54,2*Math.PI],[1,2*Math.PI]],p);
 const carHop=p<.16?arc(p,0,.16,20):p<.38?arc(p,.16,.38,22):arc(p,.38,.54,8);
 const car={x:gather===1?0:mix(c.x,-88,ease(p/.16))*(1-gather),y:p>=.54?12:mix(c.y,fallCarSupport(carAngle)+carHop,ease(p/.06)),angle:carAngle,phase:0};
 let shake=0;for(const hit of FALL_CONTACTS)if(p>=hit)shake=Math.max(shake,Math.exp(-(p-hit)*40));
 const pose={car,rider,crouch,impact,flail:sit*(1-ease((p-.82)/.12)),push:0,shake:shake*2.4,progress:p};
 if(f.reduced){pose.car={x:0,y:12,angle:0,phase:0};pose.rider={x:0,y:95,angle:0,seat:0,crouch};pose.shake=0;pose.push=0;pose.flail=0;}
 return pose;
}
export function fallPolygons(pose){
 // Lower/shorter seated silhouette follows the same leg extension and torso drop.
 const seat=pose.rider.seat||0,crouch=pose.rider.crouch||0;
 const rider=[[-23,-70+4*seat],[23+48*seat,-70+4*seat],[23+48*seat,68-27*crouch],[-23,68-27*crouch]];
 return [[pose.car,FALL_CAR_HULL.map(([x,y])=>[x,-y])],[pose.rider,rider]].map(([body,vertices])=>{
  const c=Math.cos(body.angle),s=Math.sin(body.angle);
  return vertices.map(([x,y])=>({x:body.x+c*x+s*y,y:body.y-s*x+c*y}));
 });
}
/** Seated rear hip contact, in world x/right and height above the road. */
export function fallSeatContact(pose){
 const {x,y,angle}=pose.rider,hipY=22.5+27*pose.crouch;
 return {x:x-11*Math.cos(angle)-hipY*Math.sin(angle),y:y+11*Math.sin(angle)-hipY*Math.cos(angle)-9};
}
export function interpolateFall(a,b,t){
 const pose={};for(const part of ['car','rider']){pose[part]={};for(const k of ['x','y','angle','seat','crouch','phase'])pose[part][k]=mix(a[part][k]||0,b[part][k]||0,t);}return pose;
}
