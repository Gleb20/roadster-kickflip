/** Deterministic power-ups. Time is simulation time; render frames and wall clocks never spend a charge. */
export const BOOSTERS=Object.freeze({
 shield:Object.freeze({name:'INVINCIBLE',seconds:8,color:'#7ce5f3'}),
 speed:Object.freeze({name:'OVERDRIVE',seconds:8,color:'#ffad62'}),
 jump:Object.freeze({name:'HIGH JUMP',seconds:12,color:'#d9ff62'}),
 life:Object.freeze({name:'EXTRA LIFE',seconds:0,color:'#ff6a78'}),
 score:Object.freeze({name:'SCORE ×3',seconds:10,color:'#ffc86d'}),
});
export function createBoosters(seed=0){return {active:{},hearts:0,grace:0,ghostIds:[],speedBlend:0,pickups:[],nextAt:8,serial:0,bag:[],bagCycle:0,random:(seed^0xa53c9e17)>>>0,spoiledFlight:false};}
export const activeBooster=(q,id)=>(q?.active[id]||0)>0;
export function canCollectBooster(q,id){return !!BOOSTERS[id]&&(id==='life'?q.hearts<2:activeBooster(q,id)||Object.keys(q.active).length<3);}
export function collectBooster(q,id){
 const def=BOOSTERS[id];if(!canCollectBooster(q,id))return false;
 if(id==='life'){if(q.hearts>=2)return false;q.hearts++;return true;}
 if(!activeBooster(q,id)&&Object.keys(q.active).length>=3)return false;
 q.active[id]=def.seconds;return true;
}
export function advanceBoosters(q,dt){
 for(const id of Object.keys(q.active)){q.active[id]=Math.max(0,q.active[id]-dt);if(q.active[id]===0)delete q.active[id];}
 q.grace=Math.max(0,q.grace-dt);
 const target=activeBooster(q,'speed')?1:0,delta=dt/(target?.6:.8);
 q.speedBlend=target?Math.min(1,q.speedBlend+delta):Math.max(0,q.speedBlend-delta);
}
function random(q){q.random=(Math.imul(q.random,1664525)+1013904223)>>>0;return q.random/4294967296;}

// The whole magnet capture region plus the upright rider and 24-unit margin.
// Moving air enemies sweep left relative to a pickup during its approach.
export function safePickupSpot(spot,obstacles,speed){
 const horizon=Math.max(0,spot.x-112)/Math.max(60,speed*.55);
 return obstacles.every(o=>{
  if(o.smashed||o.collision==='none')return true;
  const left=o.x-(o.approachSpeed||0)*horizon,right=o.x+o.w;
  if(spot.x+160<left||spot.x-160>right)return true;
  const bottom=o.altitude||0,top=bottom+o.h;
  return spot.y-200>top+24||spot.y+207<bottom-24;
 });
}
export function pickupSpots(obstacles,rails,speed){
 const live=obstacles.filter(o=>!o.smashed&&o.x>0).sort((a,b)=>a.x-b.x),spots=[];
 for(let i=0;i<live.length;i++){
  const a=live[i],b=live[i+1];
  if(!a.altitude&&a.h<=130)spots.push({x:a.x+a.w/2,y:a.h+230});
  if(b&&b.x-a.x-a.w>400)spots.push({x:(a.x+a.w+b.x)/2,y:104});
 }
 for(const rail of rails)spots.push({x:rail.x+rail.w*.55,y:rail.h+90});
 return spots.filter(p=>p.x>0&&p.y<=380&&safePickupSpot(p,live,speed));
}
export function offerBooster(q,{time,speed,clear,obstacles=[],rails=[]}){
 if(!clear||q.pickups.length||time<q.nextAt)return null;
 const spots=pickupSpots(obstacles,rails,speed);if(!spots.length)return null;
 if(!q.bag.length){
  q.bagCycle++;q.bag=Object.keys(BOOSTERS).filter(id=>id!=='life'||q.bagCycle%3===0);
  for(let i=q.bag.length-1;i>0;i--){const j=Math.floor(random(q)*(i+1));[q.bag[i],q.bag[j]]=[q.bag[j],q.bag[i]];}
 }
 const eligible=id=>id==='life'?q.hearts<2:activeBooster(q,id)||Object.keys(q.active).length<3;
 const index=q.bag.findIndex(eligible);if(index<0)return null;
 const id=q.bag.splice(index,1)[0],spot=spots[Math.floor(random(q)*spots.length)];
 const pickup={id,uid:++q.serial,...spot};q.pickups.push(pickup);
 // Pairs require a second safe spot, never just a blind fixed offset.
 if(q.serial>1&&random(q)<.4){
  const otherSpot=spots.find(p=>Math.abs(p.x-spot.x)>300),next=q.bag.findIndex(other=>other!==id&&eligible(other));
  if(otherSpot&&next>=0)q.pickups.push({id:q.bag.splice(next,1)[0],uid:++q.serial,...otherSpot});
 }
 q.nextAt=time+14+random(q)*6;return pickup;
}
