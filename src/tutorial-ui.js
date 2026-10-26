import {tutorialLesson,TUTORIAL_LESSONS} from './tutorial.js?v=4.11.4';

const COPY={
 jump:['HOLD. RELEASE. JUMP.','Hold the road, then release to clear the car.'],
 charge:['GIVE YOUR JUMP SOME HEIGHT.','Fill the charge bar at least halfway, then release.'],
 flip:['ONE FLIP. A CLEAN LANDING.','Charge a high jump. In the air, hold to spin.'],
 thrust:['A LITTLE ROCKET POWER.','Jump, then hold THRUST in the air.'],
 rail:['LAND ON THE RAIL.','Charge a jump onto the rail. Ride it, then land.'],
 air:['LET IT FLY OVER YOU.','Stay on the road. There is room underneath.'],
 pickup:['CATCH THE BONUS.','Drive into it. Your active bonus appears at the top left.'],
};
export function createTutorialUI({root,onSkip}){
 const overlay=document.createElement('div');overlay.id='tutorial-overlay';overlay.hidden=true;
 overlay.innerHTML=`<section id="tutorial-card" aria-label="Driving lesson"><div class="lesson-meta"><span id="lesson-progress"></span></div><h2 id="lesson-title"></h2><p id="lesson-detail" aria-live="polite"></p><button id="tutorial-skip" type="button">SKIP TRAINING</button></section><div id="lesson-input" aria-hidden="true"><span class="lesson-touch"><i class="lesson-dot"></i><i class="lesson-wave"></i><i class="lesson-wave"></i></span><kbd>SPACE</kbd><span id="lesson-action">HOLD</span></div>`;
 root.append(overlay);const get=id=>overlay.querySelector('#'+id);let last='',sceneTop=0,interactive=false;const contacts=new Map(),pointer=get('lesson-input');
 const measure=()=>{
  if(overlay.hidden)return;
  const bottom=get('tutorial-card').getBoundingClientRect().bottom-root.getBoundingClientRect().top+12;
  root.style.setProperty('--lesson-ui-bottom',bottom+'px');
  sceneTop=bottom+(root.dataset.lessonTarget==='bonus'?52:0);
 };
 new ResizeObserver(measure).observe(get('tutorial-card'));addEventListener('resize',measure);
 // Presentation follows accepted game pointers; these hooks never issue commands.
 const currentContact=()=>[...contacts.values()].reverse().find(p=>p.target===root.dataset.lessonTarget);
 function position(x,y){
  const W=root.clientWidth,H=root.clientHeight;
  pointer.style.left=x+'px';pointer.style.top=y+'px';
  const labelX=Math.max(64,Math.min(W-64,x))-x;
  const above=y-80, labelY=above>=sceneTop+8?above:Math.max(sceneTop+8,y+56);
  pointer.style.setProperty('--lesson-label-x',labelX+'px');
  pointer.style.setProperty('--lesson-label-y',(Math.min(H-42,labelY)-y)+'px');
 }
 function showContact(){
  const contact=currentContact();pointer.classList.toggle('is-held',!!contact);
  if(contact&&interactive){position(contact.x,contact.y);pointer.hidden=false;}
 }
 const resetContact=()=>{contacts.clear();pointer.classList.remove('is-held');};
 get('tutorial-skip').onclick=onSkip;
 return {update({T,P,G,input,S,ground,W,H,mode,heldPrimary=false,heldThrust=false}){
  const visible=T.active&&mode==='playing';overlay.hidden=!visible;root.classList.toggle('training',visible);if(!visible){delete root.dataset.lessonTarget;root.style.removeProperty('--lesson-ui-bottom');sceneTop=0;interactive=false;resetContact();return;}
  const lesson=tutorialLesson(T),jumped=P.airborne||!!G.support;
  let [title,detail]=COPY[lesson],action=jumped?'RELEASE':'HOLD',target='road';
  if(lesson==='jump'||lesson==='charge'||lesson==='rail'){
   const approach=S.obs[0]||S.rails[0];
   if(!jumped&&!input.charging&&approach?.x>400){action='WAIT';detail='Let it approach. Get ready to hold the road.';}
   if(input.charging){action=input.charge>=(lesson==='jump'?.08:.6)?'RELEASE':'HOLD';detail=action==='RELEASE'?'Release now to jump.':'Keep holding to build your jump.';}
   if(jumped){action='RELEASE';detail=G.support?'Ride to the end, or jump off. Land safely.':'Hands off. Let the car land upright.';}
  }
  if(lesson==='flip'){
   if(!jumped){action=input.charge>=.9?'RELEASE':'HOLD';detail=action==='RELEASE'?'Release for a high jump.':'Hold until the charge bar is full.';}
   else{action=P.angle<=-5.5||P.time>.95?'RELEASE':'HOLD';detail=action==='RELEASE'?'Release to brake the spin. Land with the wheels down.':'Hold the road now to grab and spin.';}
  }
  if(lesson==='thrust'&&jumped){target='thrust';action=T.thrust>=.18?'RELEASE':'HOLD';detail=action==='RELEASE'?'Release THRUST and land.':'Hold THRUST now. Watch the fuel gauge.';}
  if(lesson==='air'){action='HANDS OFF';detail='Stay on the road. Let the aircraft pass above you.';}
  if(lesson==='pickup'){action='COLLECT';target='bonus';if(T.collected)detail='SCORE ×3 is active. The ring shows its time remaining.';}
  if(T.cleared){action='NICE!';detail='You got it. Keep rolling.';}
  const label=[lesson,detail,action,T.attempt].join('|'),changed=label!==last;if(changed){
   get('lesson-title').textContent=title;get('lesson-detail').textContent=detail;
   get('lesson-progress').textContent=`${T.index+1} / ${TUTORIAL_LESSONS.length}${T.attempt?' · TRY AGAIN':''}`;
   get('lesson-action').textContent=action;overlay.dataset.action=action;last=label;
  }
  // Highlight the real controls, including their transparent corners; no bbox cutouts.
  root.dataset.lessonTarget=target;if(changed||!sceneTop)measure();
  interactive=lesson!=='air'&&lesson!=='pickup'&&!T.cleared;
  let x=Math.max(55,Math.min(W-85,W*.7)),y=Math.min(H-100,ground+42);
  if(target==='thrust'){
   const r=root.querySelector('#boost').getBoundingClientRect();x=r.x+r.width/2;y=r.y+r.height/2;
  }
  const contact=currentContact();if(contact){x=contact.x;y=contact.y;}
  position(x,target==='thrust'||contact?y:Math.min(H-100,y));pointer.querySelector('kbd').textContent=target==='thrust'?'SHIFT':'SPACE';
  const held=target==='thrust'?heldThrust:heldPrimary;pointer.classList.toggle('is-held',held);
  pointer.hidden=lesson==='air'||lesson==='pickup'||T.cleared||action==='WAIT'||action==='RELEASE'&&!held;
 },contact(event,target){
  if(!root.classList.contains('training'))return;
  const r=root.getBoundingClientRect();contacts.set(event.pointerId,{target,x:event.clientX-r.x,y:event.clientY-r.y});showContact();
 },moveContact(event){
  const contact=contacts.get(event.pointerId);if(!contact)return;
  const r=root.getBoundingClientRect();contact.x=event.clientX-r.x;contact.y=event.clientY-r.y;showContact();
 },releaseContact(id){contacts.delete(id);showContact();},resetContact,
 get sceneTop(){return sceneTop;},get element(){return overlay;}};
}
