// @ts-check
import {ENEMY_SPRITES} from './enemy-sprite-data.js';
/** One content definition per stable ID. Pixel storage never defines world size. */
/** @typedef {import('./content-types.js').ObstacleDefinition} ObstacleDefinition */
/** @typedef {import('./content-types.js').Reaction} Reaction */

/** @template T @param {T} value @returns {T} */
function freeze(value){
 if(value&&typeof value==='object'){for(const item of Object.values(value))freeze(item);Object.freeze(value);}
 return value;
}
export const BIOMES=freeze(['spaceport','tesla-factory']);
export const BIOME_CYCLE=freeze(['spaceport','tesla-factory']);
export const ANIMATIONS=freeze(['taunt','angry-look','point-and-laugh','trampoline-bounce','money-guns','podcast','throw','lightning','reptile','look']);
export const ASSETS=freeze({
 ...Object.fromEntries(Object.entries(ENEMY_SPRITES).map(([id,s])=>['encounter_'+id,{file:s.file}])),
 collage:{file:'collage-atlas.png'},extras:{file:'collage-extras.png'},cast:{file:'paper-cast.png'},
 photos:{file:'obstacle-photos.png'},joe:{file:'assets/characters/joe-rogan.png'},
 amber:{file:'assets/characters/amber-head-v247.png'},drone:{file:'assets/obstacles/phantom-v3.png'},
});
/** @type {Reaction} */
const none={enabled:false};
/** @param {string} animationId @param {'near'|'airborne-near'|'passage'} trigger @param {number} range @param {'target'|'self'} space @returns {Reaction} */
const reaction=(animationId,trigger='near',range=300,space='target')=>({enabled:true,animationId,trigger,range,space});
/** @param {import('./content-types.js').LegacyObstacle} base @param {import('./content-types.js').DefinitionOptions} options @returns {ObstacleDefinition} */
function define(base,options={}){
 return freeze({...base,definitionVersion:1,category:options.category||'object',placement:base.altitude?'air':'ground',
  anchor:base.altitude?'air-bottom-center':'ground-center',biomes:options.biomes||'all',
  visual:{renderer:options.renderer||'prop',key:options.key||base.id,assets:options.assets||[],bob:options.bob||false},
  collision:options.collision||'box',reactions:{hero:options.hero||none,obstacle:options.obstacle||none},
  collectible:true,provenance:'assets-provenance.json'});
}
/** @param {string} id @param {string} name @param {import('./content-types.js').DefinitionOptions} options @param {number} [altitude] */
function spriteDefinition(id,name,options,altitude=0){
 const s=ENEMY_SPRITES[/** @type {keyof typeof ENEMY_SPRITES} */ (id)];
 return define({id,name,w:s.w,h:s.h,inset:id==='t800'?10:5,...(altitude?{altitude}: {})},{...options,renderer:'sprite',assets:['encounter_'+id]});
}
export const OBSTACLES=freeze([
 define({id:'v8',name:'V8 • VERY LOUD',w:108,h:36},{renderer:'photo',assets:['photos'],category:'vehicle'}),
 define({id:'trump',name:'TARIFF MAN',w:54,h:94},{renderer:'character',assets:['collage'],category:'person',bob:true,hero:reaction('taunt'),obstacle:reaction('angry-look')}),
 define({id:'protest',name:'COUCH CRITICS',w:102,h:94},{renderer:'cutout',assets:['extras'],bob:true,category:'group'}),
 define({id:'truck',name:'CYBERBRICK',w:110,h:41},{renderer:'photo',assets:['photos'],category:'vehicle'}),
 define({id:'doge',name:'MUCH WOW',w:52,h:64},{renderer:'cutout',assets:['extras'],bob:true,category:'animal'}),
 define({id:'pump',name:'BIG OIL',w:54,h:78},{}),
 define({id:'zuck',name:'ZUCK',w:62,h:94,inset:5},{renderer:'character',assets:['cast'],category:'person',hero:reaction('money-guns','airborne-near'),obstacle:reaction('money-guns','airborne-near')}),
 define({id:'openai',name:'OPENAI',w:70,h:68,inset:5},{category:'emblem'}),
 define({id:'claude',name:'CLAUDE',w:84,h:73,inset:6},{category:'emblem'}),
 define({id:'gemini',name:'GEMINI',w:58,h:78,inset:4},{category:'emblem'}),
 define({id:'rogozin',name:'ROGOZIN / TRAMPOLINE',w:88,h:130,inset:4},{renderer:'character',assets:['cast'],category:'person',biomes:['spaceport'],collision:'trampoline',hero:reaction('point-and-laugh','airborne-near'),obstacle:reaction('trampoline-bounce','passage')}),
 define({id:'amber',name:'AMBER HEARD',w:58,h:94,inset:9},{renderer:'character',assets:['amber'],category:'person',obstacle:reaction('throw','passage')}),
 define({id:'joe',name:'JOE ROGAN',w:76,h:94,inset:10},{renderer:'character',assets:['joe'],category:'person',hero:reaction('podcast','passage',650,'self'),obstacle:reaction('podcast','passage',650,'self')}),
 define({id:'muscleCoupe',name:'AMERICAN MUSCLE',w:138,h:45,inset:6},{renderer:'photo',assets:['photos'],category:'vehicle'}),
 define({id:'muscleCompact',name:'SMALL BLOCK / BIG EGO',w:112,h:38,inset:5},{renderer:'photo',assets:['photos'],category:'vehicle'}),
 define({id:'pickup',name:'BIG TRUCK ENERGY',w:140,h:57,inset:6},{renderer:'photo',assets:['photos'],category:'vehicle'}),
 ...[
  ['homelessRow','SPARE CHANGE','group','all'],
  ['t800','T-800 / AUTOMATION','person',['tesla-factory']],
  ['bydSeal','BYD SEAL','vehicle',['tesla-factory']],
  ['xiaomiSu7','XIAOMI SU7','vehicle',['tesla-factory']],
  ['batteryAgv','BATTERY SWAP','vehicle',['tesla-factory']],
 ].map(([id,name,category,biomes])=>spriteDefinition(String(id),String(name),{category:String(category),biomes:Array.isArray(biomes)?biomes:'all'})),
 ...[
  ['ufo','UNIDENTIFIED FLYING OPPORTUNITY','all'],
  ['primeDrone','PRIME PERSONAL SPACE','all'],
  ['twitterBird','THE FORMER BIRD',['spaceport']],
  ['starlink','STARLINK / WRONG ORBIT',['spaceport']],
  ['regulatorDrone','APPROVAL PENDING','all'],
  ['sikorsky','SIKORSKY / VS-300',['spaceport']],
  ['qualitySkull','QUALITY CONTROL',['tesla-factory']],
 ].map(([id,name,biomes])=>spriteDefinition(String(id),String(name),{category:'flying enemy',biomes:Array.isArray(biomes)?biomes:'all',collision:'box',hero:reaction(id==='ufo'?'reptile':'look','near',320)},32)),
 spriteDefinition('xi','COMRADE XI',{category:'person',biomes:['tesla-factory'],collision:'box',hero:reaction('lightning','near',380),obstacle:reaction('lightning','near',380)}),
]);
export const PROP_TYPES=freeze(OBSTACLES.filter(o=>['muscleCoupe','muscleCompact','pickup'].includes(o.id)));
export const AIR_TYPES=freeze(OBSTACLES.filter(o=>o.placement==='air'));
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
