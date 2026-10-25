import {createRandom} from './random.js?v=4.9.0';
import {BIOME_CYCLE} from './content.js?v=4.9.0';
// Active run seconds select scenery and the director's obstacle pool.
// A separate seeded stream keeps the schedule replayable without consuming gameplay RNG.
export const BIOME_FIRST_SECONDS=40,BIOME_MIN_SECONDS=30,BIOME_MAX_SECONDS=50;
export const SCENERY_CYCLE=BIOME_CYCLE;
export function biomeAt(time=0,seed=0){
 const elapsed=Number.isFinite(time)?Math.max(0,time):0,random=createRandom((seed^0xb10be123)>>>0);
 let leg=0,nextAt=BIOME_FIRST_SECONDS;
 while(elapsed>=nextAt){leg++;nextAt+=BIOME_MIN_SECONDS+Math.floor(random.next()*(BIOME_MAX_SECONDS-BIOME_MIN_SECONDS+1));}
 return {id:SCENERY_CYCLE[leg%SCENERY_CYCLE.length],leg,nextAt,nextIn:nextAt-elapsed};
}
export function createBiomeScene(){
 let state;
 function reset(){const target=biomeAt(0);state={...target,from:target.id,edgeAt:0,start:0,end:0,progress:1,moving:false};}
 reset();
 return {reset,get state(){return state;},update(time,distance,{ahead=1200,behind=500,seed=0}={}){
  const target=biomeAt(time,seed);
  if(target.leg!==state.leg){state={...target,from:state.id,edgeAt:distance+ahead,start:distance,end:distance+ahead+behind,progress:0,moving:state.id!==target.id};}
  const progress=state.moving?Math.max(0,Math.min(1,(distance-state.start)/Math.max(1,state.end-state.start))):1;
  state={...state,...target,progress,moving:state.moving&&progress<1};
  if(!state.moving)state.from=state.id;
 }};
}
export const biomeEdge=(state,distance,anchor,scale)=>anchor+(state.edgeAt-distance)*scale;
