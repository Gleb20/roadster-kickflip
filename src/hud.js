const MILES_PER_KM=.6213711922;
export const mphFromKmh=value=>Math.max(0,value)*MILES_PER_KM;
export function multiplierAppearance(value,meter){
  const fill=Math.max(0,Math.min(1,meter));
  return {tier:Math.max(1,Math.min(5,Math.floor(value))),scale:.88+.17*fill,opacity:.42+.58*fill,shake:value>1?fill*1.1:0};
}
export function createHUD({root=document.getElementById('game'),reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches}={}){
  const $=id=>document.getElementById(id),score=$('score'),multiplier=$('multiplier');
  let columns=[],lastScore='',lastMode='',fall=null;
  function odometer(value,instant=false){
    const next=String(Math.max(0,Math.floor(value))).padStart(5,'0');
    score.setAttribute('aria-label','Score '+Math.floor(value));
    if(next===lastScore&&!instant)return;
    if(columns.length!==next.length){
      for(const c of columns)c.animation?.cancel();score.replaceChildren();columns=[];
      for(const char of next){
        const cell=document.createElement('span'),strip=document.createElement('span');cell.className='odometer-column';strip.className='odometer-strip';cell.setAttribute('aria-hidden','true');
        for(let n=0;n<20;n++){const digit=document.createElement('span');digit.textContent=n%10;strip.append(digit);}
        cell.append(strip);score.append(cell);columns.push({strip,value:Number(char),animation:null});
      }
      instant=true;
    }
    columns.forEach((c,i)=>{
      const n=Number(next[i]);if(n===c.value&&!instant)return;
      let from=c.value;
      if(c.animation?.playState==='running'){
        const style=getComputedStyle(c.strip),matrix=new DOMMatrixReadOnly(style.transform);
        from=((-matrix.m42/parseFloat(style.fontSize))%10+10)%10;
      }
      c.animation?.cancel();c.strip.style.transform=`translateY(${-n}em)`;
      if(!instant&&!reducedMotion()){
        const target=n<from?n+10:n;
        c.animation=c.strip.animate([{transform:`translateY(${-from}em)`},{transform:`translateY(${-target}em)`}],{duration:230,easing:'cubic-bezier(.16,1,.3,1)'});
      }
      c.value=n;
    });lastScore=next;
  }
  function mode(value){
    if(lastMode===value)return;
    const sound=$('sound'),oldLeft=sound.getBoundingClientRect().left;
    sound.getAnimations().forEach(animation=>animation.cancel());
    lastMode=value;root.dataset.mode=value;
    const race=['playing','paused'].includes(value);
    for(const id of ['race-score','speedometer','boost'])$(id).classList.toggle('hidden',!race);
    $('pause').hidden=!race;
    const shift=oldLeft-sound.getBoundingClientRect().left;
    if(shift&&!reducedMotion())sound.animate([{transform:`translateX(${shift}px)`},{transform:'translateX(0)'}],{duration:240,easing:'cubic-bezier(.16,1,.3,1)'});
    if(value==='paused')fall?.animation.pause();else fall?.animation.play();
    if(value==='menu'||value==='dead'){fall?.node.remove();fall=null;}
  }
  function update(s){
    mode(s.mode);odometer(s.score);
    const a=multiplierAppearance(s.multiplier,s.meter);
    multiplier.textContent='×'+s.multiplier.toFixed(1);multiplier.dataset.tier=String(a.tier);
    multiplier.style.setProperty('--combo-scale',String(a.scale));multiplier.style.setProperty('--combo-alpha',String(a.opacity));multiplier.style.setProperty('--combo-shake',a.shake+'px');multiplier.style.setProperty('--combo-saturation',String(.45+.55*s.meter));
    const speed=Math.round(mphFromKmh(s.kmh));$('speed-value').textContent=speed;$('speedometer').setAttribute('aria-label',`${speed} miles per hour. Earned boost ${Math.round(s.streak*100)} percent`);
    $('streak-fill').style.strokeDashoffset=String(1-s.streak/.25);$('streak-value').textContent=s.streak>.001?'+'+Math.round(s.streak*100)+'%':'';
    const fuel=Math.ceil(s.fuel),button=$('boost');button.disabled=s.mode!=='playing'||!!s.falling;button.classList.toggle('active',s.thrusting);button.classList.toggle('empty',fuel===0);
    button.setAttribute('aria-pressed',String(s.thrusting));button.setAttribute('aria-label',`Hold for airborne thrust. Fuel ${fuel} percent`);
    button.style.setProperty('--thrust-charge',String(Math.max(0,Math.min(1,s.fuel/100))));
    $('thrust-fill').style.strokeDashoffset=String(1-s.fuel/100);$('boost-time').textContent=fuel+'%';
    $('pending').textContent=s.pending>0?`${s.turns} FLIP${s.turns>1?'S':''} · ${Math.round(s.pending)} PENDING`:'';
  }
  function dropMultiplier(value){
    if(value<=1)return;fall?.animation.cancel();fall?.node.remove();
    const rect=multiplier.getBoundingClientRect(),style=getComputedStyle(multiplier),node=document.createElement('span');
    node.className='fallen-multiplier';node.textContent='×'+value.toFixed(1);node.style.cssText=`left:${rect.left}px;top:${rect.top}px;color:${style.color};font-size:${style.fontSize};`;
    root.append(node);
    const animation=node.animate(reducedMotion()?[{opacity:.7},{opacity:0}]:[{transform:'translate(0,0) rotate(0)',opacity:1},{transform:'translate(14px,22px) rotate(14deg)',opacity:.9,offset:.3},{transform:'translate(28px,110px) rotate(38deg)',opacity:0}],{duration:reducedMotion()?130:650,easing:'cubic-bezier(.4,0,1,1)'});
    fall={node,animation};animation.onfinish=()=>{node.remove();if(fall?.node===node)fall=null;};
  }
  return {update,mode,dropMultiplier,reset(){fall?.animation.cancel();fall?.node.remove();fall=null;odometer(0,true);}};
}
