import {MUSIC} from './music-content.js?v=4.10.0';

const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:a));
const smooth=(a,b,v)=>{const x=clamp((v-a)/(b-a));return x*x*(3-2*x);};
/** Cosmetic audio state only. Never writes to the ranked simulation. */
export function musicTargets(scene={}){
 const mode=scene.mode||'menu',playing=mode==='playing';
 const pace=clamp((scene.speed-360)/300),bonus=clamp((scene.multiplier-1)/5);
 const intensity=playing?Math.max(pace*.82,bonus*.85,clamp(scene.boost)*.98,clamp(scene.streak/.25)*.8):0;
 const biome=scene.biome||{id:'spaceport',from:'spaceport',progress:1};
 const blend=biome.id===biome.from?1:clamp(biome.progress);
 const factory=biome.id==='tesla-factory'?blend:biome.from==='tesla-factory'?1-blend:0;
 const bridge=1-.62*Math.sin(factory*Math.PI);
 const quiet=mode==='menu'?.18:mode==='paused'?.12:mode==='dead'?.16:.60/Math.sqrt(1+intensity*.8);
 return {intensity,volume:scene.visible===false?0:quiet,brightness:playing?1300+smooth(0,.65,intensity)*9500*bridge:1150,
  biomes:{spaceport:Math.cos(factory*Math.PI/2),'tesla-factory':Math.sin(factory*Math.PI/2)},
  layers:{bed:.80,lead:(playing?.24+.76*smooth(.05,.72,intensity):.16)*bridge,
   bass:(playing?.20+.80*smooth(.02,.48,intensity):.08)*(.7+.3*bridge),drums:playing?.10+.90*smooth(.12,.88,intensity):.035}};
}

export function createMusic({context,destination,fetcher=globalThis.fetch,config=MUSIC}={}){
 const output=context.createGain(),duck=context.createGain(),tone=context.createBiquadFilter();
 tone.type='lowpass';tone.frequency.value=1150;tone.Q.value=.35;
 output.gain.value=0;duck.gain.value=1;tone.connect(output);output.connect(duck);duck.connect(destination);
 const groups=new Map(),voices=new Map(),loads=new Map();
 let enabled=true,scene={mode:'menu'},targets=musicTargets(scene),origin=context.currentTime+.03,requests=0,last=-1,duckUntil=0;
 const errors={};
 function stop(){for(const nodes of voices.values())for(const n of nodes){try{n.source.stop();n.source.disconnect();n.gain.disconnect();}catch{}}voices.clear();}
 function start(id){
  if(!enabled||context.state!=='running'||voices.has(id)||!groups.has(id))return;
  const now=context.currentTime,when=now+.035,offset=((when-origin)%config.seconds+config.seconds)%config.seconds;
  const nodes=[];
  for(const [layer,buffer] of Object.entries(groups.get(id))){
   const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;source.loop=true;source.loopStart=0;source.loopEnd=Math.min(config.seconds,buffer.duration);
   gain.gain.value=0;source.connect(gain);gain.connect(tone);source.start(when,Math.min(offset,source.loopEnd-.001));nodes.push({source,gain,layer});
  }
  voices.set(id,nodes);last=-1;apply();
 }
 function prepare(id){
  if(groups.has(id)||loads.has(id)||!fetcher)return;
  requests++;const tracks=config.tracks[id];
  const work=Promise.all(Object.entries(tracks).map(async([layer,file])=>{
   const response=await fetcher(new URL('../'+file,import.meta.url));if(!response.ok)throw Error('Music file unavailable');
   const buffer=await context.decodeAudioData(await response.arrayBuffer());
   if(buffer.duration<config.seconds-.025)throw Error('Incomplete music buffer');
   return [layer,buffer];
  })).then(entries=>{groups.set(id,Object.fromEntries(entries));delete errors[id];start(id);},e=>{errors[id]=String(e.message||e);}).finally(()=>loads.delete(id));
  loads.set(id,work);
 }
 function apply(){
  const now=context.currentTime;if(now-last<.045)return;last=now;
  targets=musicTargets(scene);output.gain.setTargetAtTime(enabled?targets.volume:0,now,.55);tone.frequency.setTargetAtTime(targets.brightness,now,.9);
  for(const [id,nodes] of voices)for(const n of nodes)n.gain.gain.setTargetAtTime(targets.biomes[id]*targets.layers[n.layer],now,.65);
 }
 return {
  update(next){scene=next;apply();},
  unlock(){if(!enabled)return;for(const id of Object.keys(config.tracks)){prepare(id);start(id);}last=-1;apply();},
  setEnabled(value){enabled=!!value;if(!enabled){output.gain.cancelScheduledValues(context.currentTime);output.gain.setValueAtTime(0,context.currentTime);stop();}else{this.unlock();}},
  duck(amount=.75,seconds=.18){const now=context.currentTime;if(!enabled)return;duckUntil=Math.max(duckUntil,now+seconds);duck.gain.cancelScheduledValues(now);duck.gain.setTargetAtTime(amount,now,.012);duck.gain.setTargetAtTime(1,duckUntil,.18);},
  inspect(){return {enabled,ready:[...groups.keys()],loading:[...loads.keys()],errors:{...errors},requests,voices:[...voices.values()].reduce((n,v)=>n+v.length,0),seconds:config.seconds,phase:((context.currentTime-origin)%config.seconds+config.seconds)%config.seconds,targets};},
  dispose(){enabled=false;stop();output.disconnect();duck.disconnect();tone.disconnect();},
 };
}
