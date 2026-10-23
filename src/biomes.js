import {BIOME_CYCLE} from './content.js?v=4.7.0';
// Score selects scenery; a fixed world boundary is driven past the rider.
// The director uses this same biome selection for the versioned ground pool.
export const BIOME_SCORE_STEP=7000;
export const SCENERY_CYCLE=BIOME_CYCLE;
export function biomeAt(score=0){
 const points=Number.isFinite(score)?Math.max(0,score):0;
 const leg=Math.floor(points/BIOME_SCORE_STEP),nextAt=(leg+1)*BIOME_SCORE_STEP;
 return {id:SCENERY_CYCLE[leg%SCENERY_CYCLE.length],leg,nextAt,nextIn:nextAt-points};
}
export function createBiomeScene(){
 let state;
 function reset(){const target=biomeAt(0);state={...target,from:target.id,edgeAt:0,start:0,end:0,progress:1,moving:false};}
 reset();
 return {reset,get state(){return state;},update(score,distance,{ahead=1200,behind=500}={}){
  const target=biomeAt(score);
  if(target.leg!==state.leg){state={...target,from:state.id,edgeAt:distance+ahead,start:distance,end:distance+ahead+behind,progress:0,moving:state.id!==target.id};}
  const progress=state.moving?Math.max(0,Math.min(1,(distance-state.start)/Math.max(1,state.end-state.start))):1;
  state={...state,...target,progress,moving:state.moving&&progress<1};
  if(!state.moving)state.from=state.id;
 }};
}
export const biomeEdge=(state,distance,anchor,scale)=>anchor+(state.edgeAt-distance)*scale;
