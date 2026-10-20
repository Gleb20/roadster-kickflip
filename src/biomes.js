import {BIOME_CYCLE} from './content.js?v=3.6.1';
// Only the current run's score selects scenery. Time animates the crossfade.
// Ranked obstacle generation, scoring and physics stay unchanged.
export const BIOME_SCORE_STEP=10000,BIOME_TRANSITION_SECONDS=4;
export const SCENERY_CYCLE=BIOME_CYCLE;
export function biomeAt(score=0){
 const points=Number.isFinite(score)?Math.max(0,score):0;
 const leg=Math.floor(points/BIOME_SCORE_STEP),nextAt=(leg+1)*BIOME_SCORE_STEP;
 return {id:SCENERY_CYCLE[leg%SCENERY_CYCLE.length],leg,nextAt,nextIn:nextAt-points};
}
export function createBiomeScene(){
 let state,changedAt=0;
 function reset(){const target=biomeAt(0);state={...target,from:target.id,age:0,mix:1};changedAt=0;}
 reset();
 return {reset,get state(){return state;},update(score,time){
  const target=biomeAt(score);
  if(target.leg!==state.leg){state={...target,from:state.id,age:0,mix:0};changedAt=time;}
  const age=Math.max(0,time-changedAt),u=Math.min(1,age/BIOME_TRANSITION_SECONDS);
  state={...state,...target,age,mix:state.from===target.id?1:u*u*(3-2*u)};
 }};
}
