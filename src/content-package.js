import {SCENE_PROFILES,VISUAL_PROFILES,REACTION_PROFILES,REQUIRED_MATERIALS} from './content-profiles.js?v=4.13.1';
/** Shared pure contract used by the compiler, desktop studio and game. */
export const CONTENT_ABI='tesla-content-1',CONTENT_SCHEMA=1;
export function freezeContent(value){if(value&&typeof value==='object'){for(const item of Object.values(value))freezeContent(item);Object.freeze(value);}return value;}
export function canonical(value){if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';return JSON.stringify(value);}
export async function digest(value){const bytes=typeof value==='string'?new TextEncoder().encode(value):value;return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');}
export function gameplayContent(p){return {cycle:p.cycle,biomes:p.biomes.map(b=>({id:b.id,groundPool:b.groundPool})),rarities:p.rarities,obstacles:p.obstacles.map(({displayName,description,provenance,...o})=>o),animations:p.animations};}
export function safeResource(path){return typeof path==='string'&&path.length<240&&/^[a-zA-Z0-9][a-zA-Z0-9_./-]*\.(png|mp3)$/.test(path)&&!path.split('/').some(x=>x==='..'||x==='.'||!x);}
function validatePackageFields(p){
 const errors=[],fail=(at,text)=>errors.push(at+': '+text),list=v=>Array.isArray(v),object=v=>v&&typeof v==='object'&&!Array.isArray(v),id=v=>typeof v==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(v),positive=v=>Number.isFinite(v)&&v>0;
 if(!object(p))return ['Package must be a JSON object'];
 if(p.schemaVersion!==CONTENT_SCHEMA)fail('schemaVersion','this game needs schema 1');if(p.engineAbi!==CONTENT_ABI)fail('engineAbi','game and studio need tesla-content-1');
 if(!id(p.id)||!/^\d+\.\d+\.\d+$/.test(p.version||''))fail('identity','use a stable ID and major.minor.patch version');
 if(!/^roadster-v\d+\.\d+\.\d+$/.test(p.ruleset||''))fail('ruleset','choose a supported frozen ruleset');
 if(!object(p.resources)||!object(p.assets)||!list(p.obstacles)||!list(p.biomes)||!list(p.cycle)||!list(p.animations)||!object(p.rarities)||!object(p.music))return [...errors,'Package needs resources, assets, obstacles, biomes, cycle, animations, rarities and music'];
 if(p.obstacles.length>200||p.biomes.length>20||Object.keys(p.resources).length>500)fail('package','resource/entity budget exceeded');
 for(const [r,w] of Object.entries(p.rarities))if(!id(r)||!positive(w)||w>1000)fail('rarities.'+r,'use a positive weight up to 1000');
 const resources=p.resources,biomes=new Set(),obstacles=new Set();let bytes=0;
 for(const [path,binding] of Object.entries(REQUIRED_MATERIALS)){const r=resources[path];if(!r||r.kind!==binding.kind||binding.kind==='image'&&(r.width!==binding.width||r.height!==binding.height))fail(path,'engine profile needs the original material kind and pixel layout');}
 if(p.animations.some(a=>!REACTION_PROFILES.includes(a)))fail('animations','unregistered reaction profile');
 for(const [path,r] of Object.entries(resources)){
  if(!safeResource(path)||!object(r)){fail('resources','use local PNG/MP3 paths');continue;}
  if(!/^[a-f0-9]{64}$/.test(r.sha256)||!Number.isSafeInteger(r.bytes)||r.bytes<1||r.bytes>16*1024*1024)fail(path,'file needs SHA-256 and a size below 16 MiB');bytes+=r.bytes||0;
  if(r.kind==='image'){if(r.mediaType!=='image/png'||!Number.isInteger(r.width)||!Number.isInteger(r.height)||r.width<1||r.height<1||r.width>8192||r.height>8192||r.width*r.height>20000000)fail(path,'PNG dimensions must fit the 20 megapixel budget');if(r.layout!=='fixed')fail(path,'this profile requires the original pixel layout');}
  else if(r.kind!=='audio'||r.mediaType!=='audio/mpeg')fail(path,'choose a PNG image or MP3 audio file');
 }
 if(bytes>96*1024*1024)fail('resources','package exceeds 96 MiB');
 for(const [key,a] of Object.entries(p.assets))if(!id(key)||!resources[a?.file])fail('assets.'+key,'reference a resource in this package');
 for(const b of p.biomes){if(!object(b)||!id(b.id)||biomes.has(b.id)){fail('biomes','duplicate or missing ID');continue;}biomes.add(b.id);if(SCENE_PROFILES[b.scenery?.profile]!==b.id)fail(b.id,'renderer profile is not registered in this engine');if(!list(b.scenery?.layers))fail(b.id,'layers are missing');else for(const layer of b.scenery.layers)for(const path of layer.resources||[])if(!resources[path])fail(b.id,'unknown layer resource '+path);if(b.groundPool!==null&&!list(b.groundPool))fail(b.id,'ground pool must be a list or null');}
 for(const o of p.obstacles){
  if(!object(o)||!id(o.id)||obstacles.has(o.id)){fail('obstacles','duplicate or missing ID');continue;}obstacles.add(o.id);
  if(!positive(o.w)||!positive(o.h)||o.w>1000||o.h>1000||o.h<=6)fail(o.id,'world dimensions are outside supported limits');
  if(!Object.hasOwn(p.rarities,o.rarity))fail(o.id,'unknown rarity');if(typeof o.description!=='string'||o.description.length>2000||typeof o.displayName!=='string'||o.displayName.length>120)fail(o.id,'supply a name and description');
  if(o.biomes!=='all'&&(!list(o.biomes)||!o.biomes.length||o.biomes.some(b=>!biomes.has(b))))fail(o.id,'unknown biome');
  if(!['ground','air'].includes(o.placement)||!['ground-center','air-bottom-center'].includes(o.anchor)||o.placement==='air'&&!positive(o.altitude)||o.placement==='ground'&&!!o.altitude)fail(o.id,'placement/anchor/altitude do not match');
  if(o.inset!==undefined&&(!Number.isFinite(o.inset)||o.inset<0||o.inset*2>=o.w))fail(o.id,'collision inset is outside the sprite');
  if(!['box','trampoline','none'].includes(o.collision)||!['photo','cutout','character','prop','drone','sprite'].includes(o.visual?.renderer)||!list(o.visual?.assets))fail(o.id,'unsupported collision or renderer profile');
  if(!VISUAL_PROFILES[o.visual?.renderer]?.includes(o.visual?.key))fail(o.id,'unregistered visual key');
  for(const a of o.visual?.assets||[])if(!p.assets[a])fail(o.id,'unknown asset '+a);
  for(const who of ['hero','obstacle']){const r=o.reactions?.[who];if(typeof r?.enabled!=='boolean'||r.enabled&&(!p.animations.includes(r.animationId)||!['near','airborne-near','passage'].includes(r.trigger)||!['target','self'].includes(r.space)||!positive(r.range)))fail(o.id,'unknown '+who+' reaction');}
 }
 for(const b of p.biomes)for(const o of b.groundPool||[])if(!obstacles.has(o))fail(b.id,'unknown pool member '+o);
 if(!p.cycle.length||p.cycle.some(b=>!biomes.has(b)))fail('cycle','reference known biomes');
 const m=p.music;if(m.bpm!==128||m.bars!==32||m.seconds!==60||m.beatsPerBar!==4)fail('music','this engine uses 128 BPM, 4/4, 32 bars / 60 seconds');
 for(const b of p.biomes){const track=m.tracks?.[b.id];if(!object(track)||!track.bed)fail(b.id,'supply a complete loop as bed, or synchronized stems');else for(const [role,path] of Object.entries(track)){if(!['bed','lead','bass','drums'].includes(role)||resources[path]?.kind!=='audio')fail(b.id,'unknown music role or audio resource '+role);}}
 return errors;
}
/** One RNG draw after safety/biome filters; equal weights retain the legacy mapping. */
export function pickByRarity(pool,random,weights){if(!pool.length)return null;const values=pool.map(o=>weights[o.rarity]||0),total=values.reduce((a,b)=>a+b,0);if(values.every(w=>w===values[0])&&values[0]>0)return pool[Math.min(pool.length-1,Math.floor(random()*pool.length))];if(!(total>0))return null;let target=Math.min(1-Number.EPSILON,Math.max(0,random()))*total;for(let i=0;i<pool.length;i++){target-=values[i];if(target<0)return pool[i];}return pool.at(-1);}

export function validatePackage(p){try{return validatePackageFields(p);}catch{return ['Package structure is incomplete. Start from a full exported package and preserve its lists and references.'];}}
