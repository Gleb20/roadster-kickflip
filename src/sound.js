/** Optional synthesized effects. Audio is unlocked only by a user gesture. */
export function createSound({storage,AudioContext=globalThis.AudioContext||globalThis.webkitAudioContext}={}) {
  let enabled=false,context,master;
  try{storage??=globalThis.localStorage;enabled=storage?.getItem('roadster-sound-v1')==='on'}catch{}
  function unlock(){
    if(!enabled||!AudioContext)return;
    try{context??=new AudioContext();if(!master){master=context.createGain();master.connect(context.destination);}master.gain.setValueAtTime(1,context.currentTime);if(context.state==='suspended')context.resume().catch(()=>{});}catch{}
  }
  return {
    get enabled(){return enabled},
    unlock,
    toggle(){enabled=!enabled;try{storage?.setItem('roadster-sound-v1',enabled?'on':'off')}catch{}if(enabled)unlock();else if(master)master.gain.setValueAtTime(0,context.currentTime);return enabled},
    tone(f,d=.1,type='sine',v=.04){
      if(!enabled||!context||context.state!=='running')return;
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
  };
}
