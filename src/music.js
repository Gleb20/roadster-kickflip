import {MUSIC} from './music-content.js?v=4.12.1';

const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:a));
const smooth=(a,b,v)=>{const x=clamp((v-a)/(b-a));return x*x*(3-2*x);};
/** Cosmetic audio state only. Never writes to the ranked simulation. */
export function musicTargets(scene={}){
 const mode=scene.mode||'menu',playing=mode==='playing';
 const score=Math.max(0,Number.isFinite(scene.score)?scene.score:0),training=!!scene.training;
 const boost=playing&&!training?clamp(scene.boost):0;
 const intensity=playing?(training?.08:clamp(smooth(0,30000,score)+boost*.2)):0;
 const biome=scene.biome||{id:'spaceport',from:'spaceport',progress:1};
 const blend=biome.id===biome.from?1:clamp(biome.progress);
 const factory=biome.id==='tesla-factory'?blend:biome.from==='tesla-factory'?1-blend:0;
 const biomes={spaceport:factory===1?0:Math.cos(factory*Math.PI/2),'tesla-factory':Math.sin(factory*Math.PI/2)};
 // Only competing tonal parts recede at the handover; rhythm and harmony keep moving.
 const tonal=1-.4*Math.sin(factory*Math.PI);
 const quiet=mode==='menu'?.18:mode==='paused'?.12:mode==='dead'?.16:.58;
 return {intensity,volume:scene.visible===false?0:quiet,brightness:playing?9500+boost*1000:1150,
  biomes,tonalBiomes:Object.fromEntries(Object.entries(biomes).map(([id,v])=>[id,v*tonal])),
  layers:!playing?{bed:.8,lead:.16,bass:.08,drums:.035}:training?{bed:.8,lead:.28,bass:.12,drums:.06}:
   {bed:.8+boost*.04,lead:clamp(.28+.72*smooth(7500,30000,score)+boost*.12),
    bass:clamp(smooth(0,7500,score)+boost*.16),drums:clamp(smooth(2500,15000,score)+boost*.2)}};
}

export function createMusic({context,destination,fetcher=globalThis.fetch,config=MUSIC}={}){
 const output=context.createGain(),duck=context.createGain(),tone=context.createBiquadFilter();
 tone.type='lowpass';tone.frequency.value=1150;tone.Q.value=.35;
 output.gain.value=0;duck.gain.value=1;tone.connect(output);output.connect(duck);duck.connect(destination);
 const groups=new Map(),voices=new Map(),loads=new Map();
 let enabled=true,disposed=false,scene={mode:'menu'},targets=musicTargets(scene),origin=context.currentTime+.03,requests=0,last=-1,duckUntil=0;
 const bar=60/(config.bpm||128)*4;
 let factory=0,transition=null;
 const errors={};
 function blend(now){
  if(!transition)return factory;
  const p=clamp((now-transition.at)/transition.duration);
  factory=transition.from+(transition.to-transition.from)*p;
  if(p===1)transition=null;
  return factory;
 }
 function weighted(value){return musicTargets({...scene,biome:{id:'tesla-factory',from:'spaceport',progress:value}});}
 function weight(value,id,layer){const t=weighted(value);return (layer==='lead'||layer==='bass'?t.tonalBiomes:t.biomes)[id]||0;}
 function automateMix(n,id){
  const now=context.currentTime,value=blend(now),p=n.mix.gain;
  p.cancelScheduledValues(0);p.setValueAtTime(weight(value,id,n.layer),now);
  if(transition){
   const at=Math.max(now,transition.at),duration=transition.at+transition.duration-at;
   const curve=Float32Array.from({length:65},(_,i)=>weight(value+(transition.to-value)*i/64,id,n.layer));
   p.setValueCurveAtTime(curve,at,duration);
  }
 }
 function stop(){for(const nodes of voices.values())for(const n of nodes){try{n.source.stop();n.source.disconnect();n.gain.disconnect();n.mix.disconnect();}catch{}}voices.clear();}
 function start(id){
  if(disposed||!enabled||context.state!=='running'||voices.has(id)||!groups.has(id))return;
  const now=context.currentTime,when=now+.035,offset=((when-origin)%config.seconds+config.seconds)%config.seconds;
  const nodes=[];
  for(const [layer,buffer] of Object.entries(groups.get(id))){
   const source=context.createBufferSource(),gain=context.createGain(),mix=context.createGain();source.buffer=buffer;source.loop=true;source.loopStart=0;source.loopEnd=Math.min(config.seconds,buffer.duration);
   gain.gain.value=0;source.connect(gain);gain.connect(mix);mix.connect(tone);const n={source,gain,mix,layer};automateMix(n,id);source.start(when,Math.min(offset,source.loopEnd-.001));nodes.push(n);
  }
  voices.set(id,nodes);last=-1;apply();
 }
 function prepare(id){
  if(disposed||groups.has(id)||loads.has(id)||!fetcher)return;
  requests++;const tracks=config.tracks[id];
  const work=Promise.all(Object.entries(tracks).map(async([layer,file])=>{
   const response=await fetcher(new URL('../'+file,import.meta.url));if(!response.ok)throw Error('Music file unavailable');
   const buffer=await context.decodeAudioData(await response.arrayBuffer());
   if(buffer.duration<config.seconds-.025)throw Error('Incomplete music buffer');
   return [layer,buffer];
  })).then(entries=>{if(disposed)return;groups.set(id,Object.fromEntries(entries));delete errors[id];start(id);},e=>{if(!disposed)errors[id]=String(e.message||e);}).finally(()=>loads.delete(id));
  loads.set(id,work);
 }
 function apply(){
  if(disposed)return;
  const now=context.currentTime;if(now-last<.045)return;last=now;
  const value=blend(now),id=scene.biome?.id==='tesla-factory'?'tesla-factory':'spaceport',wanted=id==='tesla-factory'?1:0;
  // Do not fade the audible biome into a missing/failed download.
  if(voices.has(id)&&wanted!==(transition?.to??value)){
   transition={from:value,to:wanted,at:origin+Math.ceil((now+.035-origin)/bar)*bar,duration:bar};
   for(const [bio,nodes] of voices)for(const n of nodes)automateMix(n,bio);
  }
  targets=weighted(value);output.gain.setTargetAtTime(enabled?targets.volume:0,now,.18);tone.frequency.setTargetAtTime(targets.brightness,now,.25);
  for(const nodes of voices.values())for(const n of nodes)n.gain.gain.setTargetAtTime(targets.layers[n.layer],now,.24);
 }
 return {
  update(next){if(scene.mode!==next.mode||scene.visible!==next.visible||scene.training!==next.training)last=-1;scene=next;apply();},
  unlock(){if(disposed||!enabled)return;for(const id of Object.keys(config.tracks)){prepare(id);start(id);}last=-1;apply();},
  setEnabled(value){if(disposed)return;enabled=!!value;if(!enabled){output.gain.cancelScheduledValues(context.currentTime);output.gain.setValueAtTime(0,context.currentTime);stop();}else{this.unlock();}},
  duck(amount=.75,seconds=.18){const now=context.currentTime;if(!enabled)return;duckUntil=Math.max(duckUntil,now+seconds);duck.gain.cancelScheduledValues(now);duck.gain.setTargetAtTime(amount,now,.012);duck.gain.setTargetAtTime(1,duckUntil,.18);},
  inspect(){return {enabled,ready:[...groups.keys()],loading:[...loads.keys()],errors:{...errors},requests,voices:[...voices.values()].reduce((n,v)=>n+v.length,0),seconds:config.seconds,origin,transition:transition?{...transition}:null,phase:((context.currentTime-origin)%config.seconds+config.seconds)%config.seconds,targets};},
  dispose(){disposed=true;enabled=false;stop();output.disconnect();duck.disconnect();tone.disconnect();},
 };
}
