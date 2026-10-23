import {BOOSTERS,activeBooster,canCollectBooster} from './boosters.js?v=4.6.4';
export const PICKUP_FLIGHT_SECONDS=.32;
const clamp=value=>Math.max(0,Math.min(1,value));
function riderTarget(p){return {x:Math.sin(p.angle||0)*35,y:p.y+65+Math.cos(p.angle||0)*35};}
export function pickupPose(o,p,time,{reduced=false,attract=true}={}){
 const bob=reduced?0:Math.sin(time*2.8+o.uid*.7)*6,target=riderTarget(p),y=o.y+bob;
 const proximity=clamp(1-Math.hypot((o.x-target.x)/240,(y-target.y)/180));
 const pull=reduced||!attract?0:proximity*proximity*.55;
 return {x:o.x+(target.x-o.x)*pull,y:y+(target.y-y)*pull};
}
export function collectionPose(start,p,age,reduced=false){
 const t=clamp(age/(reduced?.13:PICKUP_FLIGHT_SECONDS)),target=riderTarget(p),travel=t*t;
 return {x:reduced?start.x:start.x+(target.x-start.x)*travel,y:reduced?start.y:start.y+(target.y-start.y)*travel,size:reduced?1:1-travel,alpha:reduced?1-t:1-clamp((t-.65)/.35),done:t>=1};
}
export function createBoosterPainter(){
 const images=Object.fromEntries(Object.keys(BOOSTERS).map(id=>[id,new Image()]));
 let flights=[];
 function load(){return Promise.all(Object.entries(images).map(([id,img])=>new Promise((resolve,reject)=>{img.onload=()=>img.decode().then(resolve,reject);img.onerror=reject;img.src=new URL('../assets/boosters/holo-v431/'+id+'.png',import.meta.url).href;})));}
 function drawOrb(ctx,id,{x,y,scale,alpha=1,spin=1}){
   const r=29*scale;ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);
   const glow=ctx.createRadialGradient(0,0,r*.3,0,0,r*1.6);glow.addColorStop(0,BOOSTERS[id].color+'40');glow.addColorStop(1,BOOSTERS[id].color+'00');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(0,0,r*1.6,0,Math.PI*2);ctx.fill();
   ctx.fillStyle='#192a3866';ctx.strokeStyle=BOOSTERS[id].color;ctx.lineWidth=1.4*scale;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.stroke();
   ctx.strokeStyle='#fff9';ctx.lineWidth=1.5*scale;ctx.beginPath();ctx.arc(-r*.08,-r*.08,r*.76,3.7,4.6);ctx.stroke();
   ctx.scale(spin,1);ctx.drawImage(images[id],-r*.83,-r*.83,r*1.66,r*1.66);ctx.restore();
 }
 function drawPickups(ctx,q,{px,ground,scale,time,flight,reduced=false,falling=false}){
  for(const o of q.pickups){const pose=pickupPose(o,flight,time,{reduced,attract:!falling&&canCollectBooster(q,o.id)}),x=px+pose.x*scale;
   if(x< -60||x>ctx.canvas.width+60)continue;
   drawOrb(ctx,o.id,{x,y:ground-pose.y*scale,scale,spin:reduced?1:Math.cos(time*2.6+o.uid*.4)});
  }
 }
 function collect(event,time,flight,reduced=false){flights.push({...event,start:pickupPose(event,flight,time,{reduced}),at:time});flights=flights.slice(-8);}
 function drawCollections(ctx,{px,ground,scale,time,flight,reduced=false}){
  flights=flights.filter(f=>time>=f.at&&!collectionPose(f.start,flight,time-f.at,reduced).done);
  for(const f of flights){const pose=collectionPose(f.start,flight,time-f.at,reduced);drawOrb(ctx,f.id,{x:px+pose.x*scale,y:ground-pose.y*scale,scale:scale*pose.size,alpha:pose.alpha});}
 }
 function aura(ctx,q,{x,y,scale,time,reduced=false}){
  if(!activeBooster(q,'shield'))return;
  const warning=q.active.shield<2;ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  ctx.globalAlpha=warning&&!reduced?.45+.35*(.5+.5*Math.sin(time*9)):.8;ctx.strokeStyle='#9cf4ff';ctx.lineWidth=2;ctx.shadowColor='#7ce5f3';ctx.shadowBlur=18*scale;
  ctx.fillStyle='#7ce5f30b';ctx.beginPath();ctx.ellipse(0,-76,68,112,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.strokeStyle='#7ce5f344';ctx.beginPath();ctx.ellipse(0,-76,74,118,0,0,Math.PI*2);ctx.stroke();ctx.restore();
 }
 return {load,drawPickups,aura,collect,drawCollections,reset(){flights=[];},inspect(time,flight,reduced=false){return flights.map(f=>({id:f.id,age:time-f.at,...collectionPose(f.start,flight,time-f.at,reduced)}));}};
}
