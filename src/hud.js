import {BOOSTERS} from './boosters.js?v=4.7.3';
const MILES_PER_KM=.6213711922;
export const mphFromKmh=value=>Math.max(0,value)*MILES_PER_KM;
export function multiplierAppearance(value,meter){
  const fill=Math.max(0,Math.min(1,meter));
  return {tier:Math.max(1,Math.min(5,Math.floor(value))),scale:.88+.17*fill,opacity:.42+.58*fill,shake:value>1?fill*1.1:0};
}
export function createHUD({root=document.getElementById('game'),reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches}={}){
  const $=id=>document.getElementById(id),score=$('score'),multiplier=$('multiplier');
  const powerups=document.createElement('div');powerups.id='powerups';powerups.className='hidden';powerups.setAttribute('role','group');powerups.setAttribute('aria-label','Active power-ups');root.append(powerups);
  const hearts=document.createElement('span');hearts.className='powerup-hearts';powerups.append(hearts);
  for(let i=0;i<2;i++){const img=document.createElement('img');img.src='assets/boosters/holo-v431/life.png';img.alt='';img.width=22;img.height=22;hearts.append(img);}
  const cards=new Map();for(const [id,def] of Object.entries(BOOSTERS)){if(id==='life')continue;const card=document.createElement('span');card.className='powerup-card';card.dataset.booster=id;card.style.setProperty('--powerup-color',def.color);card.innerHTML=`<img src="assets/boosters/holo-v431/${id}.png" alt="" width="30" height="30"><svg viewBox="0 0 44 44" aria-hidden="true"><rect x="2" y="2" width="40" height="40" rx="10" pathLength="1"/></svg>`;powerups.append(card);cards.set(id,card);}
  function updatePowerups(q,mode){
    const race=['playing','paused'].includes(mode);powerups.classList.toggle('hidden',!race||!q||!q.hearts&&!Object.keys(q.active).length);if(!q)return;
    hearts.hidden=q.hearts===0;hearts.setAttribute('aria-label',`${q.hearts} backup ${q.hearts===1?'chip':'chips'} (extra lives)`);[...hearts.children].forEach((img,i)=>img.hidden=i>=q.hearts);
    for(const [id,card] of cards){const seconds=q.active[id]||0;card.hidden=seconds<=0;card.setAttribute('aria-label',`${BOOSTERS[id].name}, ${Math.ceil(seconds)} seconds remaining`);card.querySelector('rect').style.strokeDashoffset=String(1-seconds/BOOSTERS[id].seconds);card.classList.toggle('expiring',seconds>0&&seconds<2);}
  }
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
    lastMode=value;root.dataset.mode=value;
    const race=['playing','paused'].includes(value);
    for(const id of ['race-score','speedometer','boost'])$(id).classList.toggle('hidden',!race);
    $('pause').hidden=!race;
    if(value==='paused')fall?.animation.pause();else fall?.animation.play();
    if(value==='menu'||value==='dead'){fall?.node.remove();fall=null;}
  }
  function update(s){
    mode(s.mode);odometer(s.score);updatePowerups(s.boosters,s.mode);
    const a=multiplierAppearance(s.multiplier,s.meter);
    multiplier.textContent='×'+s.multiplier.toFixed(1);multiplier.dataset.tier=String(a.tier);
    multiplier.style.setProperty('--combo-scale',String(a.scale));multiplier.style.setProperty('--combo-alpha',String(a.opacity));multiplier.style.setProperty('--combo-shake',a.shake+'px');multiplier.style.setProperty('--combo-saturation',String(.45+.55*s.meter));
    const speed=Math.round(mphFromKmh(s.kmh));$('speed-value').textContent=speed;$('speedometer').setAttribute('aria-label',`${speed} miles per hour. Earned boost ${Math.round(s.streak*100)} percent`);
    $('streak-fill').style.strokeDashoffset=String(1-s.streak/.25);$('streak-value').textContent=s.streak>.001?'+'+Math.round(s.streak*100)+'%':'';
    const fuel=Math.ceil(s.fuel),button=$('boost');button.disabled=s.mode!=='playing'||!!s.falling;button.classList.toggle('active',s.thrusting);button.classList.toggle('empty',fuel===0);
    button.setAttribute('aria-pressed',String(s.thrusting));button.setAttribute('aria-label',`Hold for airborne thrust. Fuel ${fuel} percent`);
    button.style.setProperty('--thrust-charge',String(Math.max(0,Math.min(1,s.fuel/100))));
    $('thrust-fill').style.strokeDashoffset=String(1-s.fuel/100);$('boost-time').textContent=fuel+'%';
    $('pending').textContent=s.pending>0?`${s.turns?s.turns+' FLIP'+(s.turns>1?'S':'')+' · ':''}${s.grindDistance>0?'GRIND · ':''}${Math.round(s.pending)} PENDING`:'';
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
