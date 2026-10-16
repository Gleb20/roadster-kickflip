/** Optional synthesized effects. Audio is unlocked only by a user gesture. */
export function createSound({storage,AudioContext=globalThis.AudioContext||globalThis.webkitAudioContext,audioSession=globalThis.navigator?.audioSession}={}) {
  let enabled=false,context,master,resuming=null,pending=null,previousSession;
  try{storage??=globalThis.localStorage;enabled=storage?.getItem('roadster-sound-v1')==='on'}catch{}
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
        context=new AudioContext();master=context.createGain();master.connect(context.destination);
        // Prime the output inside the actual touch/key gesture, including older Safari.
        if(context.createBufferSource){
          const source=context.createBufferSource();source.buffer=context.createBuffer(1,1,22050);
          source.connect(master);source.onended=()=>source.disconnect();source.start(0);
        }
      }
      master.gain.setValueAtTime(1,context.currentTime);
      // Safari can be 'interrupted', as well as 'suspended', after leaving the tab.
      if(context.state!=='running'&&!resuming){
        resuming=Promise.resolve(context.resume()).then(()=>{
          resuming=null;const next=pending;pending=null;
          if(enabled&&context.state==='running'&&next&&Date.now()-next.at<300)play(next.args);
        },()=>{resuming=null;pending=null});
      }
    }catch{}
  }
  return {
    get enabled(){return enabled},
    get state(){return !enabled?'off':context?.state||'locked'},
    unlock,
    toggle(){
      enabled=!enabled;try{storage?.setItem('roadster-sound-v1',enabled?'on':'off')}catch{}
      if(enabled)unlock();else{pending=null;if(master)master.gain.setValueAtTime(0,context.currentTime);session(false)}
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
