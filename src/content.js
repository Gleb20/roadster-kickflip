// @ts-check
// @ts-ignore Browser cache identity is checked by the content build.
import {CONTENT} from './content-runtime.js?v=4.13.1';
/** @typedef {import('./content-types.js').ObstacleDefinition} ObstacleDefinition */
export const BIOMES=Object.freeze(CONTENT.biomes.map((/** @type {{id:string}} */ b)=>b.id));
export const BIOME_CYCLE=CONTENT.cycle;
export const ANIMATIONS=CONTENT.animations;
export const ASSETS=CONTENT.assets;
/** @type {readonly ObstacleDefinition[]} */
export const OBSTACLES=/** @type {readonly ObstacleDefinition[]} */ (/** @type {unknown} */ (CONTENT.obstacles));
export const PROP_TYPES=Object.freeze(OBSTACLES.filter(o=>['muscleCoupe','muscleCompact','pickup'].includes(o.id)));
export const AIR_TYPES=Object.freeze(OBSTACLES.filter(o=>o.placement==='air'));
const definitionsById=new Map(OBSTACLES.map(o=>[o.id,o]));
/** @param {string} id */
export const obstacleDefinition=id=>definitionsById.get(id);
/** @param {string} biome */
export const eligibleObstacles=biome=>BIOMES.includes(biome)?OBSTACLES.filter(o=>o.biomes==='all'||o.biomes.includes(biome)):[];

/** @param {readonly ObstacleDefinition[]} definitions */
export function validateContent(definitions=OBSTACLES){
 const errors=[],ids=new Set();
 for(const o of definitions){
  if(!o.id||ids.has(o.id))errors.push(`duplicate or missing id: ${o.id}`);ids.add(o.id);
  if(!Number.isFinite(o.w)||!Number.isFinite(o.h)||o.w<=0||o.h<=6)errors.push(`${o.id}: invalid size`);
  if(!['ground','air'].includes(o.placement))errors.push(`${o.id}: invalid placement`);
  if(o.placement==='air'&&(!Number.isFinite(o.altitude)||!(Number(o.altitude)>0)))errors.push(`${o.id}: invalid altitude`);
  if(o.placement==='ground'&&o.altitude)errors.push(`${o.id}: ground altitude`);
  if(!['ground-center','air-bottom-center'].includes(o.anchor))errors.push(`${o.id}: invalid anchor`);
  if(o.biomes!=='all'&&(!Array.isArray(o.biomes)||!o.biomes.length||o.biomes.some(b=>!BIOMES.includes(b))))errors.push(`${o.id}: unknown biome`);
  if(!o.visual||!['photo','cutout','character','prop','drone','sprite'].includes(o.visual.renderer))errors.push(`${o.id}: missing renderer`);
  for(const id of o.visual?.assets||[])if(!Object.hasOwn(ASSETS,id))errors.push(`${o.id}: unknown asset ${id}`);
  if(!['box','trampoline','none'].includes(o.collision))errors.push(`${o.id}: missing collision profile`);
  if(o.inset!==undefined&&(!Number.isFinite(o.inset)||o.inset<0||o.inset*2>=o.w))errors.push(`${o.id}: invalid inset`);
  for(const direction of /** @type {const} */ (['hero','obstacle'])){
   const r=o.reactions?.[direction];
   if(!r||typeof r.enabled!=='boolean')errors.push(`${o.id}: missing ${direction} reaction`);
   else if(r.enabled&&(!ANIMATIONS.includes(r.animationId)||!['near','airborne-near','passage'].includes(r.trigger)||!(r.range>0)||!['target','self'].includes(r.space)))errors.push(`${o.id}: missing animation ${r.animationId}`);
  }
 }
 return errors;
}
const contentErrors=validateContent();
if(contentErrors.length)throw new Error(`Invalid content: ${contentErrors.join('; ')}`);
