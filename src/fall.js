import {GAMEPLAY as C} from './gameplay-config.js?v=3.0.2';
const TAU=Math.PI*2,clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);};
export function createFall(){return {active:false,age:0,rate:1,taps:0,angle:0,direction:1,reduced:false};}
export function beginFall(f,result,{reduced=false}={}){
 const angle=Math.atan2(Math.sin(result.angle),Math.cos(result.angle));
 Object.assign(f,{active:true,age:0,rate:1,taps:0,angle,direction:Math.sign(result.omega)||Math.sign(angle)||1,reduced});
}
export function hastenFall(f){if(!f.active)return false;f.taps++;f.rate=Math.min(C.fallMaxRate,f.rate+C.fallTapRate);return true;}
export function advanceFall(f,dt){
 if(!f.active)return {impacts:0,finished:false};
 const previous=f.age;f.age=Math.min(C.fallSeconds,f.age+dt*f.rate);
 const impacts=[.33,.66].filter(t=>previous<C.fallSeconds*t&&f.age>=C.fallSeconds*t).length;
 f.active=f.age<C.fallSeconds;
 return {impacts,finished:!f.active};
}
export function fallPose(f){
 const p=clamp(f.age/C.fallSeconds),t=clamp(p/.66),u=ease((p-.66)/.34),attach=ease(p/.09);
 const angle=f.angle+f.direction*TAU*2*t,carAngle=angle+.32*Math.sin(t*Math.PI);
 const bounce=Math.abs(Math.sin(t*2*Math.PI));
 const floor=(a,x,y)=>Math.abs(Math.sin(a))*x+Math.abs(Math.cos(a))*y+2;
 let car={x:18*Math.sin(t*Math.PI)+12*Math.sin(t*TAU),y:floor(carAngle,55,14)+bounce*23,angle:carAngle};
 let rider={x:-26*Math.sin(t*Math.PI)-17*Math.sin(t*TAU),y:floor(angle,52,100)+bounce*35,angle};
 const entry=(y)=>({x:Math.sin(f.angle)*(y-65),y:65+Math.cos(f.angle)*(y-65)});
 for(const [body,y] of [[car,12],[rider,95]]){const a=entry(y);body.x=a.x+(body.x-a.x)*attach;body.y=Math.max(floor(body.angle,body===car?55:52,body===car?14:100),a.y+(body.y-a.y)*attach);}
 // Last third gathers the car under the rider and settles both onto the road.
 for(const [body,y] of [[car,12],[rider,95]]){body.x*=1-u;body.y=body.y*(1-u)+y*u;body.angle+=(Math.round(body.angle/TAU)*TAU-body.angle)*u;}
 if(f.reduced){car={x:0,y:12,angle:0};rider={x:0,y:95,angle:0};}
 let shake=0;
 for(const hit of [0,.33,.66])if(p>=hit)shake=Math.max(shake,Math.exp(-(p-hit)*35));
 return {car,rider,crouch:.7*(1-u),shake:f.reduced?0:shake*3,progress:p};
}
export function fallPolygons(pose){
 return [[pose.car,[-47,-12,47,13]],[pose.rider,[-23,-70,23,68]]].map(([body,[l,b,r,t]])=>{
  const c=Math.cos(body.angle),s=Math.sin(body.angle);
  return [[l,b],[r,b],[r,t],[l,t]].map(([x,y])=>({x:body.x+c*x+s*y,y:body.y-s*x+c*y}));
 });
}
export function interpolateFall(a,b,t){
 const blend=(x,y)=>x+(y-x)*t;
 const pose={};for(const part of ['car','rider']){pose[part]={};for(const k of ['x','y','angle'])pose[part][k]=blend(a[part][k],b[part][k]);}return pose;
}
