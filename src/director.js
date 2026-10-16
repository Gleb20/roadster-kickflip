import {types} from './catalog.js';
import {clearPair} from './physics.js';
export function createDirector({S,B,spawnX}){
const DIRECTOR={wave:0,pending:null,gap:0};
function reset(){DIRECTOR.wave=0;DIRECTOR.pending=null;DIRECTOR.gap=0}
function spawn(){
 if(DIRECTOR.pending){
  const {type,delay}=DIRECTOR.pending;
  S.obs.push({...type,x:spawnX(),passed:false});
  S.next+=Math.max(.75,DIRECTOR.gap-delay);DIRECTOR.pending=null;return;
 }
 const stage=S.t<30?0:S.t<60?1:S.t<100?2:S.t<150?3:4;
 const [lo,hi,pairChance]=[[2.36,2.86,0],[2.05,2.45,.08],[1.77,2.20,.28],[1.64,1.96,.43],[1.54,1.87,.56]][stage];
 const breath=++DIRECTOR.wave%5===0;
 let gap=lo+Math.random()*(hi-lo)+(breath?.54:0),a=null,b=null,delay=0;
 if(!breath&&Math.random()<pairChance){
  const choices=types.filter(o=>['doge','openai','gemini','claude','pump'].includes(o.id));
  for(let k=0;k<12;k++){
   const x=choices[Math.floor(Math.random()*choices.length)],y=choices[Math.floor(Math.random()*choices.length)],d=.25+Math.random()*.14;
   if(clearPair(x,y,d,S.speed/B.factor)){a=x;b=y;delay=d;break}
  }
 }
 if(!a){
  const solo=types.filter(o=>o.id!=='rogozin'&&(stage>0||o.h<=90));
  a=S.t>=45&&Math.random()<(stage>=4?.13:stage>=2?.085:.055)?types.find(o=>o.id==='rogozin'):solo[Math.floor(Math.random()*solo.length)];
 }
 if(a.id==='rogozin'){gap=Math.max(gap,2.18);b=null}
 S.obs.push({...a,x:spawnX(),passed:false});
 DIRECTOR.gap=gap;
 if(b){DIRECTOR.pending={type:b,delay};S.next+=delay}else S.next+=gap;
}

return {reset,spawn};
}
