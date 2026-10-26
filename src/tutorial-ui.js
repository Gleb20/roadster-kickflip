import {tutorialLesson,TUTORIAL_LESSONS} from './tutorial.js?v=4.11.0';

const COPY={
 jump:['HOLD. RELEASE. JUMP.','Hold the road, then release to clear the car.'],
 charge:['GIVE YOUR JUMP SOME HEIGHT.','Fill the charge bar at least halfway, then release.'],
 flip:['ONE FLIP. A CLEAN LANDING.','Charge a high jump. In the air, hold to spin.'],
 thrust:['A LITTLE ROCKET POWER.','Jump, then hold THRUST in the air.'],
 rail:['LAND ON THE RAIL.','Charge a jump onto the rail. Ride it, then land.'],
 air:['LET IT FLY OVER YOU.','Stay on the road. There is room underneath.'],
 pickup:['CATCH THE BONUS.','Drive into it. Your active bonus appears at the top left.'],
};
const svgNS='http://www.w3.org/2000/svg';
export function createTutorialUI({root,onSkip}){
 const overlay=document.createElement('div');overlay.id='tutorial-overlay';overlay.hidden=true;
 overlay.innerHTML=`<svg id="tutorial-spotlight" aria-hidden="true"><defs><mask id="lesson-mask"><rect width="100%" height="100%" fill="white"/><g id="lesson-holes" fill="black"></g></mask></defs><rect width="100%" height="100%" fill="#10151b" fill-opacity=".76" mask="url(#lesson-mask)"/></svg><section id="tutorial-card" aria-label="Driving lesson"><div class="lesson-meta"><span id="lesson-progress"></span><span>SAFE PRACTICE</span></div><h2 id="lesson-title"></h2><p id="lesson-detail" aria-live="polite"></p><button id="tutorial-skip" type="button">Skip training</button></section><div id="lesson-input" aria-hidden="true"><svg viewBox="0 0 48 58"><path d="M19 31V9a5 5 0 0 1 10 0v17l3-4a4 4 0 0 1 7 4l-4 15-2 13H15l-7-17a5 5 0 0 1 8-5l3 3" fill="currentColor" stroke="#10151b" stroke-width="2"/></svg><kbd>SPACE</kbd><span id="lesson-action">HOLD</span></div>`;
 root.append(overlay);const get=id=>overlay.querySelector('#'+id),holes=get('lesson-holes');let last='';
 get('tutorial-skip').onclick=onSkip;
 function hole(x,y,w,h,r=20){const rect=document.createElementNS(svgNS,'rect');for(const [key,value] of Object.entries({x,y,width:w,height:h,rx:r}))rect.setAttribute(key,value);holes.append(rect);}
 return {update({T,P,G,input,S,Q,px,ground,scale,W,H,mode}){
  const visible=T.active&&mode==='playing';overlay.hidden=!visible;root.classList.toggle('training',visible);if(!visible)return;
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
  const label=[lesson,detail,action,T.attempt].join('|');if(label!==last){
   get('lesson-title').textContent=title;get('lesson-detail').textContent=detail;
   get('lesson-progress').textContent=`${T.index+1} / ${TUTORIAL_LESSONS.length}${T.attempt?' · TRY AGAIN':''}`;
   get('lesson-action').textContent=action;overlay.dataset.action=action;last=label;
  }
  holes.replaceChildren();
  // The entire road corridor and actual hero stay readable throughout a jump.
  hole(Math.max(0,px-90*scale),ground-(P.y+190)*scale,180*scale,(P.y+220)*scale);
  const object=S.obs[0]||S.rails[0]||Q.pickups[0];
  if(object?.y!==undefined)hole(px+(object.x-75)*scale,ground-(object.y+75)*scale,150*scale,150*scale);
  else if(object)hole(px+object.x*scale-20,ground-((object.altitude||0)+object.h+28)*scale,object.w*scale+40,(object.h+55)*scale);
  hole(px-60,ground-65,Math.max(260,W-px+60),125);
  const pointer=get('lesson-input');let x=Math.max(55,Math.min(W-85,W*.7)),y=Math.min(H-100,ground+42);
  if(target==='thrust'){
   const r=document.querySelector('#boost').getBoundingClientRect();hole(r.x-8,r.y-8,r.width+16,r.height+16);x=r.x+r.width/2;y=r.bottom+25;
  }
  if(target==='bonus'){
   const r=document.querySelector('#powerups')?.getBoundingClientRect();if(r?.width)hole(r.x-8,r.y-8,r.width+16,r.height+16);
  }
  // Pause and sound are always visible and usable.
  const tools=root.querySelector('.tools').getBoundingClientRect();hole(tools.x-5,tools.y-5,tools.width+10,tools.height+10);
  pointer.style.left=x+'px';pointer.style.top=Math.min(H-95,y)+'px';pointer.querySelector('kbd').textContent=target==='thrust'?'SHIFT':'SPACE';
  pointer.hidden=lesson==='air'||lesson==='pickup'||T.cleared||action==='WAIT';
 },get element(){return overlay;}};
}
