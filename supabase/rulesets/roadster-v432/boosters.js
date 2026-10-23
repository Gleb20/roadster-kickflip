/** Deterministic power-ups. Time is simulation time; render frames and wall clocks never spend a charge. */
export const BOOSTERS=Object.freeze({
 shield:Object.freeze({name:'INVINCIBLE',seconds:8,color:'#7ce5f3'}),
 speed:Object.freeze({name:'OVERDRIVE',seconds:8,color:'#ffad62'}),
 jump:Object.freeze({name:'HIGH JUMP',seconds:12,color:'#d9ff62'}),
 life:Object.freeze({name:'EXTRA LIFE',seconds:0,color:'#ff6a78'}),
 score:Object.freeze({name:'SCORE ×3',seconds:10,color:'#ffc86d'}),
});
export function createBoosters(seed=0){return {active:{},hearts:0,grace:0,ghostIds:[],speedBlend:0,pickups:[],nextAt:8,serial:0,bag:[],random:(seed^0xa53c9e17)>>>0,spoiledFlight:false};}
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
export function offerBooster(q,{time,speed,clear}){
 if(!clear||q.pickups.length||time<q.nextAt)return null;
 if(!q.bag.length){q.bag=Object.keys(BOOSTERS);for(let i=q.bag.length-1;i>0;i--){const j=Math.floor(random(q)*(i+1));[q.bag[i],q.bag[j]]=[q.bag[j],q.bag[i]];}}
 const eligible=id=>id==='life'?q.hearts<2:activeBooster(q,id)||Object.keys(q.active).length<3;
 let index=q.bag.findIndex(eligible);if(index<0){q.nextAt=time+2;return null;}
 const id=q.bag.splice(index,1)[0],pickup={id,uid:++q.serial,x:Math.max(900,speed*1.9+180),y:q.serial===1||random(q)<.55?104:240};
 q.pickups.push(pickup);
 // Occasional pairs create real combinations without shortening every breather.
 if(q.serial>1&&random(q)<.4){const second=q.bag.findIndex(other=>other!==id&&eligible(other));if(second>=0){const next=q.bag.splice(second,1)[0];q.pickups.push({id:next,uid:++q.serial,x:pickup.x+240,y:pickup.y});}}
 q.nextAt=time+14+random(q)*6;return pickup;
}
