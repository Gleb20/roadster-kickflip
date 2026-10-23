const RATE=24000,TAU=Math.PI*2;
export const EFFECTS=Object.freeze({jump:{seconds:.14,gain:.16,priority:1,cooldown:.09},pickup:{seconds:.23,gain:.18,priority:3,cooldown:.07},perfect:{seconds:.30,gain:.18,priority:3,cooldown:.16},landing:{seconds:.09,gain:.10,priority:0,cooldown:.10},rough:{seconds:.20,gain:.15,priority:2,cooldown:.2},shield:{seconds:.27,gain:.22,priority:4,cooldown:.085},rescue:{seconds:.48,gain:.22,priority:5,cooldown:.4},death:{seconds:.44,gain:.22,priority:6,cooldown:.4},rail:{seconds:.11,gain:.12,priority:1,cooldown:.15},recover:{seconds:.17,gain:.10,priority:1,cooldown:.4},start:{seconds:.15,gain:.10,priority:1,cooldown:.2},ui:{seconds:.07,gain:.08,priority:1,cooldown:.1}});

/** Original reproducible arcade effects. No borrowed samples or network dependency. */
export function effectSamples(name,variant=0,rate=RATE){
 const def=EFFECTS[name];if(!def)throw Error('Unknown sound effect');
 const data=new Float32Array(Math.ceil(def.seconds*rate));let seed=0x4a554d50+variant,phase=0;
 for(let i=0;i<data.length;i++){
  const t=i/rate,u=t/def.seconds;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/2147483648-1;
  const envelope=Math.min(1,t/.004)*Math.min(1,(def.seconds-t)/.018)*Math.exp(-u*2.4);
  let f=440,value=0;
  if(name==='jump'){f=210+480*u;phase+=TAU*f/rate;value=.65*Math.sin(phase)+.18*Math.sin(phase*2)+noise*.10*(1-u);}
  else if(name==='pickup'||name==='perfect'||name==='start'||name==='recover'||name==='ui'){
   const notes=name==='perfect'?[587.33,698.46,880]:name==='pickup'?[440,587.33,880]:[293.66,440];
   f=notes[Math.min(notes.length-1,Math.floor(u*notes.length))]*Math.pow(2,variant/24);phase+=TAU*f/rate;
   value=.66*Math.sin(phase)+.15*Math.sin(phase*3);
  }else if(name==='shield'){f=420-210*u;phase+=TAU*f/rate;value=.48*Math.sin(phase)+.22*Math.sin(phase*2.76)+noise*.25*Math.exp(-u*10);}
  else if(name==='rescue'){f=u<.3?440*(1-u*2):220+400*(u-.3);phase+=TAU*f/rate;value=.6*Math.sin(phase)+noise*.14*Math.exp(-u*7)+.12*Math.sin(phase*1.5);}
  else if(name==='death'){f=180*Math.exp(-u*2);phase+=TAU*f/rate;value=.6*Math.sin(phase)+noise*.3*Math.exp(-u*4);}
  else if(name==='rail'){f=760;phase+=TAU*f/rate;value=.3*Math.sin(phase)+.22*Math.sin(phase*2.31)+noise*.22;}
  else{f=name==='rough'?100:155;phase+=TAU*f/rate;value=.65*Math.sin(phase)+noise*.14;}
  data[i]=value*envelope;
 }
 return data;
}
export function effectForEvent(event){
 if(event.type==='jump')return 'jump';if(event.type==='pickup')return 'pickup';
 if(event.type==='landing')return !event.landed.good?'rough':event.result.perfect?'perfect':'landing';
 return {'rail-catch':'rail',smash:'shield',rescued:'rescue',death:'death',recovered:'recover',start:'start',ui:'ui','fall-impact':'landing'}[event.type]||null;
}
export function createEffects({context,destination,duck=()=>{}}){
 const buffers=new Map(),voices=new Set(),fading=new Set(),last=new Map(),counts={};let grind=null,enabled=true;
 const now=()=>context.currentTime;
 function buffer(name,variant=0){const key=name+variant;if(buffers.has(key))return buffers.get(key);const samples=effectSamples(name,variant),b=context.createBuffer(1,samples.length,RATE);b.copyToChannel(samples,0);buffers.set(key,b);return b;}
 function clean(v){try{v.source.disconnect();v.gain.disconnect();}catch{}voices.delete(v);}
 function stopGrind(immediate=false){
  if(grind){const old=grind;grind=null;fading.add(old);old.source.onended=()=>{old.source.disconnect();old.filter.disconnect();old.gain.disconnect();fading.delete(old);};
   try{const t=now();old.gain.gain.cancelScheduledValues(t);old.gain.gain.setTargetAtTime(0,t,.012);old.source.stop(t+.08);}catch{}
  }
  while(fading.size>(immediate?0:2)){const old=fading.values().next().value;try{old.gain.gain.setValueAtTime(0,now());old.source.stop();old.source.disconnect();old.filter.disconnect();old.gain.disconnect();}catch{}fading.delete(old);}
 }
 function stop(){stopGrind(true);for(const v of [...voices]){try{v.source.stop();}catch{}clean(v);}}
 function play(name,variant=0){
  if(!enabled||context.state!=='running')return;const def=EFFECTS[name],t=now();if(t-(last.get(name)??-99)<def.cooldown)return;
  last.set(name,t);if(name==='death')stop();
  if(voices.size>=8){const old=[...voices].sort((a,b)=>a.priority-b.priority||a.at-b.at)[0];if(old.priority>def.priority)return;try{old.source.stop();}catch{}clean(old);}
  try{const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer(name,variant);gain.gain.value=def.gain;source.connect(gain);gain.connect(destination);
   const v={source,gain,at:t,priority:def.priority};voices.add(v);source.onended=()=>clean(v);source.start();counts[name]=(counts[name]||0)+1;
   if(def.priority>=3)duck(name==='death'?.4:.75,def.seconds);
  }catch{}
 }
 return {
  event(event){const name=effectForEvent(event);if(name)play(name,event.type==='pickup'?['shield','speed','jump','life','score'].indexOf(event.id)*2:0);},
  grind(active,speed=360){
   if(!active||!enabled||context.state!=='running'){stopGrind();return;}
   if(!grind){try{const source=context.createBufferSource(),b=context.createBuffer(1,RATE,RATE),data=b.getChannelData(0);let seed=450;for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=seed/2147483648-1;}
    const filter=context.createBiquadFilter(),gain=context.createGain();source.buffer=b;source.loop=true;filter.type='bandpass';filter.Q.value=.65;gain.gain.value=0;source.connect(filter);filter.connect(gain);gain.connect(destination);source.start();grind={source,filter,gain};
   }catch{return;}}
   grind.filter.frequency.setTargetAtTime(1100+Math.min(900,speed),now(),.12);grind.gain.gain.setTargetAtTime(.038,now(),.025);
  },
  setEnabled(value){enabled=value;if(!enabled)stop();},stop,
  inspect(){return {voices:voices.size,grinding:!!grind,counts:{...counts}};},
 };
}
