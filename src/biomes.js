import {BIOME_CYCLE} from './content.js?v=3.6.0';
// Presentation clock: simulation seconds, independent of score and difficulty.
// This release keeps the ranked obstacle stream/physics unchanged.
export const BIOME_SECONDS=150,BIOME_TRANSITION_SECONDS=4;
export const SCENERY_CYCLE=BIOME_CYCLE;
export function biomeAt(seconds=0){
 const time=Number.isFinite(seconds)?Math.max(0,seconds):0;
 const leg=Math.floor(time/BIOME_SECONDS),age=time-leg*BIOME_SECONDS;
 const id=SCENERY_CYCLE[leg%SCENERY_CYCLE.length];
 const from=leg?SCENERY_CYCLE[(leg-1)%SCENERY_CYCLE.length]:id;
 const u=leg?Math.min(1,age/BIOME_TRANSITION_SECONDS):1;
 return {id,from,leg,age,mix:u*u*(3-2*u),nextIn:BIOME_SECONDS-age};
}
