export const VAT_WIDTH=320;
export const VAT_HEIGHT=VAT_WIDTH*414/768;
// Only background scenery lives here. Every opponent belongs to the ranked run.
export function createEncounters(){
 const state={actors:[],leg:-1,nextVat:0};
 function reset(){Object.assign(state,{actors:[],leg:-1,nextVat:0});}
 function update(dt,{speed,distance,biome,leg=0,moving=false}){
  for(const a of state.actors)a.x-=speed*.12*dt;
  state.actors=state.actors.filter(a=>a.x+a.w>-450);
  if(leg!==state.leg){state.leg=leg;state.nextVat=distance+speed*5;}
  if(biome==='tesla-factory'&&!moving&&distance>=state.nextVat){
   state.nextVat=distance+speed*35;
   state.actors.push({id:'moltenVat',x:1300,w:VAT_WIDTH,h:VAT_HEIGHT,discovered:true});
  }
 }
 return {state,reset,update};
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
