import {createMusic} from './music.js?v=4.5.0';
import {createEffects} from './sound-effects.js?v=4.5.0';
/** One gesture-unlocked audio context shared by music and bounded effects. */
export function normalisePressureBuffer(buffer){
  if(!buffer.getChannelData)return 1;
  let sum=0,count=0,peak=0;
  for(let c=0;c<buffer.numberOfChannels;c++)for(const v of buffer.getChannelData(c)){sum+=v*v;peak=Math.max(peak,Math.abs(v));count++;}
  if(!peak||!count)return 1;
  const factor=Math.min(.12/Math.sqrt(sum/count),.8/peak);
  for(let c=0;c<buffer.numberOfChannels;c++){const data=buffer.getChannelData(c);for(let i=0;i<data.length;i++)data[i]*=factor;}
  return factor;
}
export function createSound({storage,AudioContext=globalThis.AudioContext||globalThis.webkitAudioContext,audioSession=globalThis.navigator?.audioSession,music=false,defaultEnabled=false,fetcher=globalThis.fetch,loadThrust=async()=>{const r=await fetch(new URL('../assets/audio/thrust-pressure-hiss.mp3',import.meta.url));if(!r.ok)throw Error('Sound unavailable');return r.arrayBuffer();}}={}) {
  let enabled=defaultEnabled,context,master,effectBus,effects,musicPlayer,resuming=null,pending=null,previousSession;
  let scene={mode:'menu',visible:true};
  let thrustWanted=false,thrustBuffer=null,thrustLoading=null,voice=null,normalisation=1;
  const voices=new Set();
  function stopThrust(immediate=false){
    const old=voice;voice=null;if(!old)return;
    try{
      const now=context.currentTime;old.gain.gain.cancelScheduledValues(now);
      if(immediate){old.gain.gain.setValueAtTime(0,now);old.source.stop();old.clean();}
      else{old.gain.gain.setValueAtTime(.2,now);old.gain.gain.linearRampToValueAtTime(0,now+.06);old.source.stop(now+.07);}
    }catch{old.clean();}
  }
  function syncThrust(){
    if(!enabled||context?.state!=='running'){stopThrust(true);return;}
    if(!thrustWanted){stopThrust();return;}
    if(!thrustBuffer||voice)return;
    try{
      // Rapid taps cannot leave a growing collection of fading sources.
      while(voices.size>=2){const old=voices.values().next().value;try{old.source.stop();}catch{}old.clean();}
      const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();
      source.buffer=thrustBuffer;source.loop=true;source.loopStart=.35;source.loopEnd=Math.min(2.8,thrustBuffer.duration);
      filter.type='highpass';filter.frequency.value=420;
      source.connect(filter);filter.connect(gain);gain.connect(effectBus||master);
      const current={source,gain,clean(){source.disconnect();filter.disconnect();gain.disconnect();voices.delete(current);if(voice===current)voice=null;}};
      voice=current;voices.add(current);source.onended=current.clean;
      const now=context.currentTime;gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.2,now+.015);
      source.start(now,.12);
    }catch{stopThrust(true);}
  }
  function prepareThrust(){
    if(thrustBuffer||thrustLoading||!context?.decodeAudioData)return;
    thrustLoading=Promise.resolve().then(loadThrust).then(data=>context.decodeAudioData(data)).then(buffer=>{normalisation=normalisePressureBuffer(buffer);thrustBuffer=buffer;thrustLoading=null;syncThrust();},()=>{thrustLoading=null;});
  }
  try{storage??=globalThis.localStorage;const saved=storage?.getItem('roadster-sound-v1');enabled=saved==='on'||saved!=='off'&&defaultEnabled;}catch{}
  function session(active){
    if(!audioSession)return;
    try{
      if(active){previousSession??=audioSession.type;if(audioSession.type!=='playback')audioSession.type='playback'}
      else if(previousSession!==undefined){audioSession.type=previousSession;previousSession=undefined}
    }catch{}
  }
  function play([f,d,type,v]){
    try{
      const oscillator=context.createOscillator(),gain=context.createGain(),now=context.currentTime;
      oscillator.type=type;
      oscillator.frequency.setValueAtTime(f,now);
      oscillator.frequency.exponentialRampToValueAtTime(f*.5,now+d);
      gain.gain.setValueAtTime(v,now);gain.gain.exponentialRampToValueAtTime(.001,now+d);
      oscillator.connect(gain);gain.connect(master);
      oscillator.onended=()=>{oscillator.disconnect();gain.disconnect()};
      oscillator.start();oscillator.stop(now+d);
    }catch{}
  }
  function unlock(){
    if(!enabled||!AudioContext)return;
    session(true);
    try{
      if(!context||context.state==='closed'){
        musicPlayer?.dispose();try{context=new AudioContext({sampleRate:24000});}catch{context=new AudioContext();}master=context.createGain();
        if(context.createDynamicsCompressor){const limiter=context.createDynamicsCompressor();limiter.threshold.value=-4;limiter.knee.value=3;limiter.ratio.value=12;limiter.attack.value=.003;limiter.release.value=.18;master.connect(limiter);limiter.connect(context.destination);}else master.connect(context.destination);
        effectBus=context.createGain();effectBus.gain.value=.85;effectBus.connect(master);
        effects=createEffects({context,destination:effectBus,duck:(...args)=>musicPlayer?.duck(...args)});
        musicPlayer=music?createMusic({context,destination:master,fetcher}):null;
        // Prime the output inside the actual touch/key gesture, including older Safari.
        if(context.createBufferSource){
          const source=context.createBufferSource();source.buffer=context.createBuffer(1,1,22050);
          source.connect(master);source.onended=()=>source.disconnect();source.start(0);
        }
      }
      master.gain.setValueAtTime(1,context.currentTime);
      prepareThrust();
      musicPlayer?.setEnabled(enabled);musicPlayer?.update(scene);
      // Safari can be 'interrupted', as well as 'suspended', after leaving the tab.
      if(context.state!=='running'&&!resuming){
        resuming=Promise.resolve(context.resume()).then(()=>{
          resuming=null;const next=pending;pending=null;
          if(enabled&&context.state==='running'&&next&&Date.now()-next.at<300)play(next.args);
          syncThrust();
          if(enabled){musicPlayer?.unlock();musicPlayer?.update(scene);}
        },()=>{resuming=null;pending=null});
      }
    }catch{}
  }
  return {
    event(event){if(enabled&&scene.visible!==false)effects?.event(event);},
    setScene(next){scene=next;musicPlayer?.update(scene);effects?.grind(enabled&&scene.visible!==false&&scene.mode==='playing'&&scene.grinding,scene.speed);},
    setVisible(visible){scene={...scene,visible};musicPlayer?.update(scene);if(!visible){pending=null;stopThrust(true);effects?.stop();try{context?.suspend?.()?.catch?.(()=>{});}catch{}}},
    get inspect(){return {enabled,context:context?.state||'locked',music:musicPlayer?.inspect()||null,effects:effects?.inspect()||null};},
    scrape(){
      if(!enabled||context?.state!=='running'||!context.createBuffer)return;
      try{const n=Math.floor(context.sampleRate*.105),buffer=context.createBuffer(1,n,context.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<n;i++)data[i]=(Math.random()*2-1)*Math.sin(Math.PI*i/n);const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();source.buffer=buffer;filter.type='bandpass';filter.frequency.value=2100;filter.Q.value=2.5;gain.gain.value=.035;source.connect(filter);filter.connect(gain);gain.connect(master);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};source.start();}catch{}
    },
    impact(){
      if(!enabled||context?.state!=='running')return;
      try{const n=Math.floor(context.sampleRate*.22),buffer=context.createBuffer(1,n,context.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<n;i++)data[i]=(Math.random()*2-1)*Math.exp(-i/n*5);const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();source.buffer=buffer;filter.type='lowpass';filter.frequency.value=1200;gain.gain.value=.13;source.connect(filter);filter.connect(gain);gain.connect(master);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};source.start();}catch{}
    },
    get enabled(){return enabled},
    get state(){return !enabled?'off':context?.state||'locked'},
    get thrust(){return {wanted:thrustWanted,active:!!voice,ready:!!thrustBuffer,voices:voices.size,normalisation};},
    unlock,
    setThrust(active){thrustWanted=!!active;syncThrust();},
    toggle(){
      enabled=!enabled;try{storage?.setItem('roadster-sound-v1',enabled?'on':'off')}catch{}
      effects?.setEnabled(enabled);musicPlayer?.setEnabled(enabled);
      if(enabled){unlock();syncThrust();}else{pending=null;stopThrust(true);for(const old of [...voices]){try{old.source.stop();}catch{}old.clean();}if(master)master.gain.setValueAtTime(0,context.currentTime);session(false)}
      return enabled;
    },
    tone(f,d=.1,type='sine',v=.04){
      if(!enabled||!context)return;
      const args=[f,d,type,v];
      if(context.state==='running')play(args);
      else if(resuming)pending={args,at:Date.now()};
    }
  };
}
