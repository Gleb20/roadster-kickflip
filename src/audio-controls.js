/** Native sliders and a bounded presentation layer; no gameplay commands. */
export const AUDIO_ART=Object.freeze(['muted','quiet','shush','neutral','loud'].map(name=>'assets/ui/audio-v470/elon-'+name+'.png'));
export function volumeTier(value){const n=Math.max(0,Math.min(1,Number.isFinite(value)?value:0));return n===0?0:Math.ceil(n*4);}
const names=['muted','quiet','shush','neutral','loud'];
// Each state is registered against the same normalized head anchor. Values are refined from final art.
const eyes=[[.386,.590,.623,.590],[.386,.590,.623,.590],[.386,.590,.623,.590],[.386,.590,.623,.590],[.386,.590,.623,.590]];
const svg=(content,classes='')=>`<svg class="${classes}" viewBox="0 0 44 44" aria-hidden="true" focusable="false">${content}</svg>`;
function speaker(){
 let leds='';for(let x=0;x<6;x++)for(let y=0;y<5;y++)leds+=`<rect class="eq-led eq-row-${y}" x="${12+x*3.2}" y="${7+y*1.8}" width="2.1" height="1.1" rx=".35" style="--col:${x};--row:${y}"/>`;
 return svg(`<g class="speaker-shadow"><ellipse cx="22" cy="41" rx="10" ry="1.3"/></g><g class="speaker-cabinet"><path class="speaker-box" d="M9 3h26v36H9z"/><path class="speaker-edge" d="M9 3h26v36H9z"/><rect class="eq-screen" x="11" y="5" width="22" height="13" rx="1.4"/>${leds}<path class="eq-cross" d="m18 8 8 7m0-7-8 7"/><g class="speaker-cone"><circle class="speaker-ring" cx="22" cy="28" r="8.2"/><circle class="speaker-inner" cx="22" cy="28" r="5.8"/><circle class="speaker-dome" cx="22" cy="28" r="2.8"/></g><path class="speaker-screws" d="M12 21h.01M32 21h.01M12 36h.01M32 36h.01"/></g>`,'speaker-art');
}
export function createAudioControls({sound,entry,pauseButton,pauseSlot,popover,root=document.getElementById('game'),reducedMotion=matchMedia('(prefers-reduced-motion: reduce)')}){
 const content=document.createElement('fieldset');content.className='audio-settings';content.lang='ru';content.innerHTML=`<legend id="audio-title">Настройки звука</legend><div class="audio-rows">${['effects','music'].map((id,i)=>`<div class="audio-row" data-channel="${id}"><div class="audio-art ${id==='effects'?'elon-art':'music-art'}" aria-hidden="true">${i?speaker():`<img alt="" width="192" height="192" draggable="false"><i class="eye eye-left"></i><i class="eye eye-right"></i>`}</div><div class="audio-control"><div class="audio-caption"><label for="audio-${id}">${i?'Музыка':'Эффекты'}</label><output aria-hidden="true" for="audio-${id}" id="audio-${id}-value"></output></div><input id="audio-${id}" type="range" min="0" max="100" step="1"></div></div>`).join('')}</div>`;
 popover.append(content);popover.lang='ru';popover.setAttribute('role','dialog');popover.setAttribute('aria-labelledby','audio-title');popover.hidden=true;
 entry.setAttribute('aria-label','Настройки звука');entry.setAttribute('aria-haspopup','dialog');entry.setAttribute('aria-controls',popover.id);entry.setAttribute('aria-expanded','false');entry.removeAttribute('aria-pressed');
 entry.innerHTML='<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h4l5-5v14l-5-5H4ZM17 8q5 4 0 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span>SOUND</span>';
 const rows=new Map([...content.querySelectorAll('.audio-row')].map(el=>[el.dataset.channel,{el,input:el.querySelector('input'),output:el.querySelector('output'),art:el.querySelector('.audio-art')} ]));
 let mode=null,open=false,closing=false,overlayMotion=null,frame=0,last=0,px=0,py=0,hasPointer=false,lookX=0,lookY=0,registeredTier=-1;
 const morphs=new Set();let ghost=null;
 const on=(el,type,fn,options)=>{if(el.addEventListener){el.addEventListener(type,fn,options);return ()=>el.removeEventListener(type,fn,options);}el.addListener(fn);return ()=>el.removeListener(fn);};const cleanups=[];
 const visible=()=>!document.hidden&&(mode==='paused'||open&&!closing);
 function sync(){
  const volumes=sound.volumes;
  for(const [name,row] of rows){const value=Math.round(volumes[name]*100),tier=volumeTier(volumes[name]);row.input.value=String(value);row.output.value=value+'%';row.output.textContent=value+'%';row.input.setAttribute('aria-valuetext',value===0?'Выключено':value+'%');row.el.dataset.tier=String(tier);row.input.style.setProperty('--volume',value+'%');
   if(name==='effects'&&registeredTier!==tier){const img=row.art.querySelector('img');img.src=AUDIO_ART[tier];row.art.dataset.expression=names[tier];const e=eyes[tier];row.art.style.setProperty('--eye-left',e[0]*100+'%');row.art.style.setProperty('--eye-left-y',e[1]*100+'%');row.art.style.setProperty('--eye-right',e[2]*100+'%');row.art.style.setProperty('--eye-right-y',e[3]*100+'%');registeredTier=tier;}
  }
  entry.dataset.muted=String(!sound.enabled);
 }
 function animateFrame(now){
  if(!visible()){frame=0;content.dataset.live='false';return;}
  if(now-last>30){last=now;const audio=sound.inspect;content.dataset.live=String(!!(sound.volumes.music&&audio.context==='running'&&audio.music?.voices));
   let x=0,y=0;const head=rows.get('effects').art;
   if(hasPointer&&!reducedMotion.matches){const r=head.getBoundingClientRect();x=Math.max(-1.6,Math.min(1.6,(px-r.left-r.width/2)/90));y=Math.max(-1.2,Math.min(1.2,(py-r.top-r.height/2)/90));}
   lookX+=(x-lookX)*.3;lookY+=(y-lookY)*.3;head.style.setProperty('--look-x',lookX.toFixed(3)+'px');head.style.setProperty('--look-y',lookY.toFixed(3)+'px');
  }
  frame=requestAnimationFrame(animateFrame);
 }
 function wake(){if(visible()&&!frame)frame=requestAnimationFrame(animateFrame);}
 function place(){const rect=entry.getBoundingClientRect(),w=Math.min(320,innerWidth-24),left=Math.max(12,Math.min(innerWidth-w-12,rect.right-w));popover.style.width=w+'px';popover.style.left=left+'px';popover.style.top=rect.bottom+10+'px';popover.style.setProperty('--audio-origin',rect.left+rect.width/2-left+'px');}
 function finishOverlay(){overlayMotion?.cancel();overlayMotion=null;if(!open){popover.hidden=true;popover.classList.remove('is-open');closing=false;}}
 function close({focus=false,immediate=false}={}){
  if(!open&&!closing)return;open=false;closing=true;entry.setAttribute('aria-expanded','false');popover.style.pointerEvents='none';
  overlayMotion?.cancel();if(immediate||reducedMotion.matches||!popover.animate){finishOverlay();}else{overlayMotion=popover.animate([{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(-5px) scale(.97)'}],{duration:140,easing:'cubic-bezier(.4,0,1,1)'});overlayMotion.onfinish=finishOverlay;}
  if(focus)entry.focus({preventScroll:true});
 }
 function show(keyboard=false){
  if(['playing','paused'].includes(mode))return;overlayMotion?.cancel();open=true;closing=false;popover.hidden=false;popover.style.pointerEvents='auto';popover.classList.add('is-open');entry.setAttribute('aria-expanded','true');place();sync();sound.unlock();
  if(!reducedMotion.matches&&popover.animate)overlayMotion=popover.animate([{opacity:0,transform:'translateY(-7px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:220,easing:'cubic-bezier(.16,1,.3,1)'});
  if(keyboard)rows.get('effects').input.focus({preventScroll:true});wake();
 }
 function clearMorph(){for(const a of morphs)a.cancel();morphs.clear();ghost?.remove();ghost=null;for(const button of [entry,pauseButton]){button.style.removeProperty('will-change');}}
 function morph(from,to,oldMarkup){
  if(reducedMotion.matches||!to.animate||!from.width)return;clearMorph();const rect=to.getBoundingClientRect(),sx=from.width/rect.width,sy=from.height/rect.height,dx=from.right-rect.right,dy=from.top-rect.top;
  to.style.willChange='transform';const duration=260,easing='cubic-bezier(.22,1,.36,1)';
  const a=to.animate([{transform:`translate(${dx}px,${dy}px) scale(${sx},${sy})`,borderRadius:`${22/sx}px / 22px`},{transform:'translate(0,0) scale(1)',borderRadius:'22px / 22px'}],{duration,easing});morphs.add(a);a.onfinish=()=>{morphs.delete(a);to.style.removeProperty('will-change');};
  for(const child of to.children){const b=child.animate([{opacity:0,transform:`scaleX(${1/sx}) scale(.8)`},{opacity:1,transform:'scaleX(1) scale(1)'}],{duration:210,delay:45,easing,fill:'backwards'});morphs.add(b);b.onfinish=()=>morphs.delete(b);}
  ghost=document.createElement('div');ghost.className='audio-morph-out';ghost.setAttribute('aria-hidden','true');ghost.innerHTML=oldMarkup;Object.assign(ghost.style,{left:from.left+'px',top:from.top+'px',width:from.width+'px',height:from.height+'px'});document.body.append(ghost);const old=ghost;
  const c=old.animate([{opacity:1,transform:'translate(0,0) scale(1)'},{opacity:0,transform:`translate(${rect.right-from.right}px,${rect.top-from.top}px) scale(.78)`}],{duration:130,easing:'ease-out'});morphs.add(c);c.onfinish=()=>{old.remove();if(ghost===old)ghost=null;morphs.delete(c);};
 }
 cleanups.push(on(entry,'click',e=>open?close():show(e.detail===0)));
 cleanups.push(on(document,'pointerdown',e=>{if(open&&!popover.contains(e.target)&&!entry.contains(e.target))close();},{capture:true,passive:true}));
 cleanups.push(on(document,'focusin',e=>{if(open&&!popover.contains(e.target)&&!entry.contains(e.target))close();}));
 cleanups.push(on(document,'keydown',e=>{if(open&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close({focus:true});}},{capture:true}));
 cleanups.push(on(document,'pointermove',e=>{if(visible()){px=e.clientX;py=e.clientY;hasPointer=true;}},{passive:true}));
 cleanups.push(on(document,'pointerup',e=>{if(e.pointerType!=='mouse')hasPointer=false;},{passive:true}));
 cleanups.push(on(document,'pointercancel',()=>{hasPointer=false;},{passive:true}));
 cleanups.push(on(document,'visibilitychange',()=>{if(document.hidden){close({immediate:true});content.dataset.live='false';clearMorph();}else wake();}));
 cleanups.push(on(window,'resize',()=>{clearMorph();if(open)place();}));
 cleanups.push(on(reducedMotion,'change',()=>{clearMorph();overlayMotion?.cancel();if(closing)finishOverlay();if(reducedMotion.matches){lookX=lookY=0;}wake();}));
 for(const [name,row] of rows){cleanups.push(on(row.input,'input',()=>{sound.setVolume(name,Number(row.input.value)/100);sync();wake();}));cleanups.push(on(row.input,'change',()=>{if(name==='effects')sound.event({type:'ui'});}));}
 sync();
 return {
  setMode(next){
   const race=next==='playing'||next==='paused',oldRace=mode==='playing'||mode==='paused',oldButton=oldRace?pauseButton:entry,from=oldButton.getBoundingClientRect(),oldMarkup=oldButton.innerHTML;
   if(next===mode)return;const previous=mode;mode=next;close({immediate:true});entry.hidden=race;pauseButton.hidden=!race;pauseButton.setAttribute('aria-label',next==='paused'?'Resume':'Pause');
   if(next==='paused'){pauseSlot.append(content);pauseSlot.hidden=false;}else{popover.append(content);pauseSlot.hidden=true;}
   if(previous!==null&&race!==oldRace)morph(from,race?pauseButton:entry,oldMarkup);sync();wake();
  },
  close,sync,show,
  inspect(){return {mode,open,closing,morphs:morphs.size,visible:visible()};},
  destroy(){close({immediate:true});clearMorph();cancelAnimationFrame(frame);for(const fn of cleanups)fn();content.remove();},
 };
}
