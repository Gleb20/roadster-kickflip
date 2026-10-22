import {AIR_TYPES,obstacleDefinition} from './content.js?v=4.0.0';

// Cosmetic state uses a hash of run seed/wave, never the ranked RNG or score.
export function encounterChoice(seed,wave,biome){
 const pool=AIR_TYPES.filter(o=>o.biomes==='all'||o.biomes.includes(biome));
 let hash=(seed>>>0)^Math.imul(wave,0x9e3779b9);
 hash=Math.imul(hash^(hash>>>16),0x85ebca6b);
 hash=Math.imul(hash^(hash>>>13),0xc2b2ae35);
 hash=(hash^(hash>>>16))>>>0;
 return pool[hash%pool.length];
}
export function createEncounters(){
 const state={actors:[],wave:0,leg:-1,nextXi:Infinity,nextVat:Infinity};
 function reset(){Object.assign(state,{actors:[],wave:0,leg:-1,nextXi:Infinity,nextVat:Infinity});}
 function show(id,x=300,altitude){
  const def=obstacleDefinition(id);if(!def)return null;
  const actor={...def,x,altitude:altitude??(id==='xi'?96:def.altitude||0),approachSpeed:id==='xi'?0:240,discovered:false};state.actors.push(actor);return actor;
 }
 function update(dt,{seed=0,wave=0,route,speed,distance,biome,leg=0,moving=false,obstacles=[]}){
  for(const a of state.actors)a.x-=(a.id==='moltenVat'?speed*.3:speed+a.approachSpeed)*dt;
  state.actors=state.actors.filter(a=>a.x+a.w>-450);
  if(leg!==state.leg){state.leg=leg;state.nextXi=distance+speed*2;state.nextVat=distance+speed*5;}
  if(wave!==state.wave){
   state.wave=wave;
   const ground=obstacles.find(o=>!o.altitude&&!o.passed);
   if(ground&&wave%4===1){
    const def=encounterChoice(seed,wave,biome);
    const takeoff=(route?.charge||0)*.4+(route?.lead||.14);
    const ttc=(ground.x+(ground.inset||5)-47)/Math.max(60,speed);
    const passIn=ttc-takeoff-.75-def.w/(speed+240);
    if(passIn>=.25)show(def.id,(speed+240)*passIn,205);
   }
  }
  if(biome==='tesla-factory'&&!moving&&distance>=state.nextXi&&!state.actors.some(a=>a.id==='xi')){
   show('xi',Math.max(750,speed*1.8));state.nextXi=distance+speed*22;
  }
  if(biome==='tesla-factory'&&!moving&&distance>=state.nextVat){state.nextVat=distance+speed*35;state.actors.push({id:'moltenVat',x:1300,w:164,h:135,altitude:90,approachSpeed:-speed*.7,discovered:true});}
 }
 return {state,reset,show,update,get target(){return state.actors.filter(a=>a.id!=='moltenVat'&&Math.abs(a.x+a.w/2)<380).sort((a,b)=>Math.abs(a.x+a.w/2)-Math.abs(b.x+b.w/2))[0]||null;}};
}

export function xiHands(actor){
 const right=actor.x+actor.w/2<0;
 return [{x:.08,y:.64},{x:.40,y:.54}].map(p=>({x:actor.x+(right?1-p.x:p.x)*actor.w,y:-(actor.altitude||0)-p.y*actor.h}));
}
export function lightningPaths(from,to,time,{reduced=false,phase=0}={}){
 const dx=to.x-from.x,dy=to.y-from.y,length=Math.hypot(dx,dy)||1;
 const beat=reduced?0:Math.floor(time*9)+phase;
 const points=[from];
 for(let i=1;i<9;i++){
  const f=i/9,noise=reduced?Math.sin(i*2.1)*2:Math.sin(i*7.13+beat*2.39)*Math.min(9,length*.035);
  points.push({x:from.x+dx*f-dy/length*noise,y:from.y+dy*f+dx/length*noise});
 }
 points.push(to);return points;
}
