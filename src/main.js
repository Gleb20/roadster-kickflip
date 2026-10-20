import {loading} from './loading.js?v=3.1.0';
import {createThrusterEffects} from './thrusters.js?v=3.1.0';
import {createSound} from './sound.js?v=3.1.0';
import {createSpaceportSprites} from './spaceport-sprites.js?v=3.1.0';
import {createFlipSprite, createRoadsterMotion, advanceRoadsterMotion} from './roadster-flip.js?v=3.1.0';
import {createRocketSystem,spaceportLayout} from './rocket.js?v=3.1.0';
import {createDirector} from './director.js?v=3.1.0';
import {types} from './catalog.js?v=3.1.0';
import {obstacleDefinition} from './content.js?v=3.1.0';
import {START_SPEED, START_KMH} from './physics.js?v=3.1.0';
import {GAMEPLAY as C} from './gameplay-config.js?v=3.1.0';
import {createFlight,launch,advanceFlight,createEconomy,advanceEconomy,advanceStreak,passObstacle,settleLanding,createPace,advancePace,stumble,uprightError,sweptCollision,nearWindow} from './gameplay.js?v=3.1.0';
import {AIR_TYPES,stageAt} from './routes.js?v=3.1.0';
import {createCoach} from './coaching.js?v=3.1.0';
import {createHUD,mphFromKmh} from './hud.js?v=3.1.0';
import {viewScale,speedFeedback} from './speed-feedback.js?v=3.1.0';
import {createFall,beginFall,advanceFall,hastenFall,fallPose} from './fall.js?v=3.1.0';
import {createSlapstick} from './slapstick.js?v=3.1.0';
import {createClock} from './clock.js?v=3.1.0';
import {createEnvironmentRenderer} from './environment.js?v=3.1.0';
import {createCharacterRenderer} from './characters.js?v=3.1.0';
import {createPropRenderer} from './props.js?v=3.1.0';
import {createPhotoRenderer} from './photo-cutouts.js?v=3.1.0';
const elements=new Map();
const $=id=>elements.get(id) || (elements.set(id,document.getElementById(id)),elements.get(id));
const canvas=$('scene'),ctx=canvas.getContext('2d',{alpha:false});
const clock=createClock();
const photos=createPhotoRenderer();
const spaceportSprites=createSpaceportSprites();
const flipSprite=createFlipSprite();
const roadsterMotion=createRoadsterMotion();
const thrusters=createThrusterEffects();
const environment=createEnvironmentRenderer(), props=createPropRenderer(photos);
const slapstick=createSlapstick(), projectiles=slapstick.projectiles;
function updateProjectiles(dt){slapstick.update(dt,S.obs,obstacleDx);}
function drawProjectiles(){slapstick.draw(ctx,{px,ground,scale});}
const reviewMode=new URLSearchParams(location.search).get('review');
const flipReview=reviewMode==='flip';
const spaceportReview=reviewMode==='spaceport';
const artReview=reviewMode==='obstacles'||flipReview||spaceportReview;
const S={mode:'menu',t:0,distance:0,score:0,bonus:0,flips:0,y:0,vy:0,jumpTime:0,speed:START_SPEED,next:1.8,obs:[],particles:[],toast:0,lastCharge:0};
let best=0;try{best=Number(localStorage.getItem(C.bestKey))||0}catch{}$('best').textContent=String(best).padStart(5,'0');
let W,H,scale,ground,px,sceneTime=0,screenRoadDistance=0;
const P=createFlight(),E=createEconomy(),pace=createPace(),F=createFall();
let storage;try{storage=localStorage;}catch{}
const coach=createCoach(storage);
const hud=createHUD();
const B={state:'ready',charge:0,left:0,duration:0,level:1,factor:1};
const primaryInputs=new Set(),thrustInputs=new Set();
let spinning=false,chargingInput=false,lateTarget=null,lastLanding=null;
let chargeValue=0,cameraLift=0;
Object.assign(S,{charging:false,charge:0,anchor:0,entityId:0});
function syncState(){
 const fallen=F.active?fallPose(F):null;
 S.falling=F.active;S.fallCrouch=fallen?.crouch||0;S.fallSeat=fallen?.rider.seat||0;S.fallPush=fallen?.push||0;S.fallFlail=fallen?.flail||0;S.y=P.y;S.grab=P.grab;S.vy=P.vy;S.jumpTime=P.time;S.flips=E.flips;S.charge=chargeValue;S.charging=chargingInput;
 S.bonus=E.bonus;S.score=Math.floor(S.distance/20+E.bonus);S.baseSpeed=pace.base;S.speed=pace.speed;
 const progress=Math.min(1,pace.progress/C.rampSeconds),cruise=C.startSpeed+(C.maxSpeed-C.startSpeed)*progress;
 S.kmh=(130+270*progress)*S.speed/cruise;Object.assign(B,speedFeedback(pace,E.streak));B.state=B.factor>1?'active':'ready';B.charge=P.fuel/100;B.left=E.streakLeft;
}
function boostUI(){
 hud.update({mode:S.mode,falling:F.active,score:S.score,multiplier:E.multiplier/10,meter:E.meter,streak:E.streak,kmh:S.kmh||START_KMH,fuel:P.fuel,thrusting:P.thrusting,turns:P.turns,pending:P.airborne?C.flipFactor*P.turns*(P.turns+1)*E.multiplier/10:0});
 const lesson=F.active?null:coach.next(pace.progress,S.mode==='playing');$('jump').classList.toggle('hidden',!lesson);
 if(lesson){$('coach-title').textContent=lesson.text;$('coach-detail').textContent=lesson.detail;}
}
function obstacleDx(o){return o.x-S.anchor;}
function gestureTarget(){
 if(F.active)return null;
 let nearest=null,distance=300;
 for(const o of S.obs){const r=obstacleDefinition(o.id)?.reactions.hero,dx=Math.abs(obstacleDx(o)+o.w/2);if(r?.enabled&&r.trigger!=='passage'&&(r.trigger!=='airborne-near'||S.y>0)&&dx<Math.min(distance,r.range)){nearest=o;distance=dx;}}
 return nearest;
}
function joeTarget(){
 if(F.active)return null;
 let nearest=null,distance=650;
 for(const o of S.obs){const dx=obstacleDx(o)+o.w/2;if(o.id==='joe'&&dx<650&&dx>-480&&Math.abs(dx)<distance){nearest=o;distance=Math.abs(dx);}}
 return nearest;
}
function playerPose(){
 const cosmetic=P.airborne&&!P.trickStarted&&!P.latched,phase=cosmetic?Math.min(1,P.time/(2*P.launchVelocity/C.gravity)):0;
 const gap=cosmetic?Math.sin(phase*Math.PI)*24:P.airborne?10*(1-P.attach)*(1-P.grab):0;
 return {phase,gap,cosmetic,y:-P.y-29.5+roadsterMotion.compression};
}
const iconPaths={arrow:'M5 19 19 5M5 5h14v14',restart:'M4 11a8 8 0 1 1 2 7M4 4v7h7',play:'m8 5 11 7-11 7Z',pause:'M8 5v14M16 5v14',sound:'M4 10h4l5-5v14l-5-5H4ZM17 8q5 4 0 8',jump:'M5 17q7-14 14-10M13 5l6 2-2 6'};
function icon(name){return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${iconPaths[name]}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
function resize(){
  const previousAnchor=scale?S.anchor:null;
  W=innerWidth;H=innerHeight;
  const cap=matchMedia('(pointer:coarse)').matches?1.5:2;
  const d=Math.min(devicePixelRatio||1,cap,Math.sqrt(3000000/(W*H)));
  canvas.width=Math.round(W*d);canvas.height=Math.round(H*d);
  ctx.setTransform(d,0,0,d,0,0);
  scale=viewScale(W,H,pace.progress);
  ground=H*.84;px=W<600?W*.24:W*.29;
  S.anchor=px/scale;
  if(previousAnchor!==null){const delta=S.anchor-previousAnchor;for(const o of S.obs)o.x+=delta;}
  clock.reset();
}
addEventListener('resize',resize);resize();
const sound=createSound();
const tone=(...args)=>sound.tone(...args);
function soundUI(){
  const enabled=sound.enabled,button=$('sound');
  button.innerHTML=icon('sound')+'<span>SOUND '+(enabled?'ON':'OFF')+'</span>';
  button.setAttribute('aria-label',enabled?'Turn sound off':'Turn sound on');
  button.setAttribute('aria-pressed',String(enabled));
}
soundUI();
// Capture touch completion before game handlers prevent default or stop bubbling.
for(const event of ['pointerup','touchend','keydown'])addEventListener(event,()=>sound.unlock(),{capture:true,passive:true});
function ui(){for(const [id,mode] of [['menu','menu'],['result','dead'],['paused','paused']])$(id).classList.toggle('hidden',S.mode!==mode);boostUI();}
function cancelCharge(){primaryInputs.clear();thrustInputs.clear();spinning=false;chargingInput=false;chargeValue=0;P.thrusting=false;sound.setThrust(false);syncState();}
function start(){
 if(!spritesReady||artReview||$('game').inert)return;
 sound.unlock();cancelCharge();Object.assign(P,createFlight());Object.assign(E,createEconomy());Object.assign(pace,createPace());Object.assign(F,createFall());
 Object.assign(S,{mode:'playing',t:0,distance:0,score:0,bonus:0,flips:0,next:1.7,obs:[],particles:[],toast:0,entityId:0});
 lateTarget=null;lastLanding=null;cameraLift=0;scale=viewScale(W,H,0);S.anchor=px/scale;$('toast').textContent='';hud.reset();coach.beginRun();director.reset();Object.assign(roadsterMotion,createRoadsterMotion());thrusters.reset();
 Object.assign(CAMEO,{t:0,active:false,nextScore:5000,milestone:0});rocket.schedule();projectiles.length=0;clock.reset();syncState();ui();tone(500);
}
function beginCharge(){
 if(S.mode!=='playing'||F.active||pace.stumble>0)return false;
 if(P.airborne){P.trickStarted=true;spinning=true;}else{chargingInput=true;chargeValue=0;}
 syncState();return true;
}
function jump(){
 if(S.mode!=='playing'||P.airborne||F.active||pace.stumble>0)return;
 lateTarget=null;
 for(const o of S.obs){if(o.altitude||o.passed)continue;const gap=obstacleDx(o)+(o.inset||5)-47;if(nearWindow(gap,S.speed+(o.approachSpeed||0))){lateTarget=o;break;}}
 launch(P,chargeValue);S.lastCharge=chargeValue;chargingInput=false;chargeValue=0;spinning=false;
 coach.complete('jump');if(S.lastCharge>=.5)coach.complete('charge');syncState();tone(660,.18,'triangle');
}
function releaseCharge(){if(chargingInput)jump();spinning=false;}
function pause(){cancelCharge();clock.reset();if(S.mode==='playing')S.mode='paused';else if(S.mode==='paused'){sound.unlock();S.mode='playing';}ui();}
function pressPrimary(token){if(primaryInputs.has(token))return;const empty=primaryInputs.size===0;primaryInputs.add(token);if(empty){if(F.active)hastenFall(F);else beginCharge();}}
function releasePrimary(token,cancel=false){if(!primaryInputs.delete(token)||primaryInputs.size)return;if(cancel){spinning=false;chargingInput=false;chargeValue=0;}else releaseCharge();}
$('boost').onclick=e=>e.preventDefault();
$('start').onclick=start;$('restart').onclick=start;$('resume').onclick=pause;$('pause').onclick=pause;
$('replay-tutorial').onclick=()=>{coach.reset();start();};
$('jump').onclick=()=>coach.dismiss(pace.progress);
$('game').addEventListener('pointerdown',e=>{
 if(e.button!==0||S.mode!=='playing')return;
 const token='p'+e.pointerId;
 if(e.target.closest('#boost')){e.preventDefault();if(!F.active)thrustInputs.add(token);}
 else if(e.target.closest('button,a'))return;
 else{e.preventDefault();pressPrimary(token);}
 try{$('game').setPointerCapture(e.pointerId);}catch{}
});
function endPointer(e,cancel=false){const token='p'+e.pointerId;releasePrimary(token,cancel);thrustInputs.delete(token);}
addEventListener('pointerup',e=>endPointer(e));addEventListener('pointercancel',e=>endPointer(e,true));
$('game').addEventListener('lostpointercapture',e=>endPointer(e,true));
// Safari may begin a native range/callout even with inherited user-select:none.
function clearGameSelection(){const selection=getSelection();if(selection&&!selection.isCollapsed&&($('game').contains(selection.anchorNode)||$('game').contains(selection.focusNode)))selection.removeAllRanges();}
for(const event of ['selectstart','dragstart','contextmenu'])$('game').addEventListener(event,e=>e.preventDefault(),{capture:true});
document.addEventListener('selectionchange',clearGameSelection);
$('game').addEventListener('pointerdown',clearGameSelection,{capture:true});
$('game').addEventListener('touchstart',clearGameSelection,{capture:true,passive:true});
$('sound').onclick=()=>{sound.toggle();soundUI();tone(600);};
const thrustKeys=['KeyB','ShiftLeft','ShiftRight'];const jumpKeys=['Space','ArrowUp','KeyW'];
addEventListener('keydown',e=>{
 if($('game').inert)return;
 const thrust=thrustKeys.includes(e.code)||(e.code==='Enter'&&document.activeElement===$('boost'));
 if(thrust||jumpKeys.includes(e.code)){
  e.preventDefault();if(e.repeat)return;
  if(jumpKeys.includes(e.code)&&['menu','dead'].includes(S.mode)){start();return;}
  if(S.mode!=='playing')return;
  if(thrust){if(!F.active)thrustInputs.add(e.code);}else pressPrimary(e.code);
 }
 if(['Escape','KeyP'].includes(e.code)&&!e.repeat)pause();
});
addEventListener('keyup',e=>{if(jumpKeys.includes(e.code)){if(S.mode==='playing')e.preventDefault();releasePrimary(e.code);}if(thrustKeys.includes(e.code)||e.code==='Enter')thrustInputs.delete(e.code);});
addEventListener('blur',()=>{if(S.mode==='playing')pause();else cancelCharge();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&S.mode==='playing')pause();});
const director=createDirector({S,flight:P,pace,economy:E,sceneTime:()=>sceneTime,spawnDistance:()=>Math.max((W-px)/scale+120,S.speed*1.5+180)});
function die(o){cancelCharge();syncState();S.mode='dead';tone(90,.35,'sawtooth');const record=S.score>best;if(record){best=S.score;try{localStorage.setItem(C.bestKey,best);}catch{}}$('best').textContent=String(best).padStart(5,'0');$('finalScore').textContent=S.score;$('finalBest').textContent=best;$('flips').textContent=E.flips;$('reason').textContent='You hit '+o.name+'. Ready for another launch?';$('endlabel').textContent=record?'NEW PERSONAL BEST!':'NOT EVERYTHING TAKES OFF.';$('toast').textContent='';ui();}
function toast(message){$('toast').textContent=message;S.toast=1.5;}
function update(dt){
 if(S.mode!=='playing')return;
 S.t+=dt;
 if(chargingInput)chargeValue=Math.min(1,chargeValue+dt/C.chargeSeconds);
 advanceEconomy(E,dt);advanceStreak(E,dt);
 const wasFalling=F.active,before={...P,fallPose:F.active?fallPose(F):null};
 let landed=null,fallStep={impacts:0,finished:false};
 if(wasFalling){fallStep=advanceFall(F,dt);if(fallStep.finished){cancelCharge();S.next=Math.max(S.next,.8);toast('BACK ON BOARD');}}
 else landed=advanceFlight(P,dt,{spin:spinning,thrust:thrustInputs.size>0});
 pace.falling=F.active;
 advancePace(pace,E,P,dt);
 sound.setThrust(P.thrusting);
 if(P.thrusting)coach.complete('thrust');
 S.distance+=pace.speed*dt;screenRoadDistance+=pace.speed*scale*dt;syncState();
 const collisionPose=wasFalling?{...P,fallPose:fallPose(F)}:landed?{...P,angle:landed.angle}:P;
 for(const o of S.obs){
  const old=obstacleDx(o);o.x-=(S.speed+(o.approachSpeed||0))*dt;const dx=obstacleDx(o);
  if(sweptCollision(before,collisionPose,o,old,dx,sceneTime,dt)){die(o);return;}
  if(!o.passed&&dx+o.w< -50){o.passed=true;passObstacle(E);if(o.altitude)coach.complete('air');}
 }
 if(landed){
  let late=0,near=0;
  if(lateTarget&&!lateTarget.latePaid&&obstacleDx(lateTarget)+lateTarget.w-(lateTarget.inset||5)< -47){late=1;lateTarget.latePaid=true;}
  for(const o of S.obs){if(o.altitude||o.nearPaid)continue;const gap=-47-(obstacleDx(o)+o.w-(o.inset||5));if(nearWindow(gap,S.speed)){near++;o.nearPaid=true;}}
  const oldMultiplier=E.multiplier;
  lastLanding=settleLanding(E,P,landed,{late,near});
  if(!landed.good){hud.dropMultiplier(oldMultiplier/10);stumble(pace);beginFall(F,landed,{reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,speed:pace.recovery.target});pace.falling=true;P.angle=0;P.omega=0;P.vx=0;P.grab=0;cancelCharge();advancePace(pace,E,P,0);toast('ROUGH LANDING · TAP TO GET UP');S.toast=F.duration+.3;tone(100,.2);}
  else{if(landed.turns)coach.complete('flip');if(late||near)coach.complete('near');if(lastLanding.points)toast(`${landed.turns?landed.turns+' FLIP'+(landed.turns>1?'S':'')+' · ':''}${late?'LATE +25 · ':''}${near?'CLOSE +25 · ':''}+${Math.round(lastLanding.points)}`);tone(130,.08);}
  lateTarget=null;
 }
 if(!P.airborne&&Math.abs(P.angle)>.001){P.angle*=Math.exp(-dt*18);P.omega=0;}
 thrusters.update(dt,{impactSpeed:landed?.impact||(fallStep.impacts?180:0),speed:S.speed});
 advanceRoadsterMotion(roadsterMotion,dt,{grounded:!P.airborne,speed:S.speed,charge:chargeValue,impactSpeed:landed?.impact||0});
 S.obs=S.obs.filter(o=>o===lateTarget||obstacleDx(o)+o.w>(o.id==='joe'?-480:-400));
 S.next-=dt;if(S.next<=0)director.spawn();
 if(S.toast>0){S.toast-=dt;if(S.toast<=0)$('toast').textContent='';}
 updateCameo(dt);syncState();
 const desiredScale=viewScale(W,H,pace.progress);
 scale+=(desiredScale-scale)*(1-Math.exp(-dt*2));
 const targetLift=Math.max(0,(P.y+200)*scale-ground+Math.max(140,H*.23));cameraLift+=(targetLift-cameraLift)*(1-Math.exp(-dt*8));
}
function poly(points,color,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke()}}
function rect(x,y,w,h,c,r=0){ctx.fillStyle=c;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function ellipse(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()}
function line(p,c,w=2){ctx.beginPath();p.forEach((v,i)=>i?ctx.lineTo(...v):ctx.moveTo(...v));ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke()}
function text(t,x,y,size,c,align='center'){ctx.fillStyle=c;ctx.font=`bold ${size}px Arial`;ctx.textAlign=align;ctx.fillText(t,x,y)}
let spritesReady=false;
const atlas=new Image(),extras=new Image(),cast=new Image(),joeSprite=new Image();
const castSprites={bezos:new Image(),katy:new Image(),amber:new Image()};
const droneSprite=new Image();
$('start').disabled=true;$('start').textContent='LOADING CUTOUTS…';
const loadSprite=async(img,src)=>{img.src=src;await img.decode();};
loading.load([
  {name:'interface stylesheet',load:()=>loading.stylesReady},
  {name:'collage atlas',load:()=>loadSprite(atlas,'collage-atlas.png')},
  {name:'scene extras',load:()=>loadSprite(extras,'collage-extras.png')},
  {name:'spaceport / VFX',load:()=>spaceportSprites.load()},
  {name:'paper cast',load:()=>loadSprite(cast,'paper-cast.png')},
  {name:'Joe / podcast cutout',load:()=>loadSprite(joeSprite,'assets/characters/joe-rogan.png')},
  ...Object.entries(castSprites).map(([id,img])=>({name:id+' / paper character',load:()=>loadSprite(img,'assets/characters/'+(id==='amber'?'amber-head':id)+'-v247.png')})),
  {name:'airborne drone',load:()=>loadSprite(droneSprite,'assets/obstacles/phantom-v3.png')},
  {name:'photo cutouts',load:()=>photos.load()},
  {name:'kickflip / 9 poses',load:()=>flipSprite.load()},
]).then(ready=>{
  if(!ready)return;
  spritesReady=true;
  // Prepare the complete first scene, including cleaned/cached hero face, while
  // the loader still covers the game. A drawing failure must keep start blocked.
  render(0,sceneTime);
  clock.reset();$('start').disabled=false;$('start').innerHTML='LET’S GO '+icon('arrow');
  loading.finish();
}).catch(()=>{spritesReady=false;loading.fail();});
const cutouts={zuckHead:[cast,40,130,340,395],rogozinHead:[cast,425,140,345,390],bezosHead:[cast,805,165,320,365],katyHead:[cast,1145,140,350,435],toyRocket:[cast,270,620,1030,325],head:[atlas,40,40,380,410],roadster:[atlas,475,185,550,180],v8:[atlas,1025,185,510,180],trump:[atlas,90,490,300,505],trumpHead:[atlas,90,490,300,282],truck:[atlas,450,655,635,260],rocket:[atlas,1190,455,195,545],protest:[extras,0,110,890,825],doge:[extras,945,145,585,790]};
function cutout(key,x,y,w,h,target=ctx){const [img,sx,sy,sw,sh]=cutouts[key];if(!img.complete||!img.naturalWidth)return false;target.drawImage(img,sx*img.naturalWidth/1536,sy*img.naturalHeight/1024,sw*img.naturalWidth/1536,sh*img.naturalHeight/1024,x,y,w,h);return true}
function car(x,y,phase=0){flipSprite.draw(ctx,x,y,phase,roadsterMotion)}
const characters=createCharacterRenderer({ctx,cutout,getState:()=>({S,B,CAMEO,sceneTime,scale,heroY:playerPose().y}),gestureTarget,joeTarget,obstacleDx,joeSprite,castSprites});
const {elon,trumpPose,zuckerberg,rogozin,amber,joe,cameoRider,cameoLeg,drawMoneyStreams}=characters;
function boostFlame(x,y){
 if(!B.flameLength)return;
 const len=B.flameLength*(1+Math.sin(sceneTime*31)*.06),width=3+2*B.intensity;
 ctx.save();ctx.translate(x,y);ctx.globalAlpha=B.flameOpacity;
 poly([[-43,-width],[-57,-width*.7],[-43-len,0],[-57,width*.7],[-43,width]],'#89d7e7');
 poly([[-44,-1.5],[-44-len*.55,0],[-44,1.5]],'#e4f1e8');ctx.restore();
}
function speedStreaks(){
 if(!B.intensity)return;ctx.save();ctx.globalAlpha=B.intensity*.12;
 for(let i=0;i<6;i++){const y=H*.25+(i*83)%(H*.6),x=W-((screenRoadDistance*1.25+i*137)%(W+160));line([[x,y],[x+18+18*B.intensity,y]],'#a0c9d1',1);}
 ctx.restore();
}
function drawObstacleArt(o,bob=0){
 const visual=obstacleDefinition(o.id)?.visual;if(!visual)return false;
 if(visual.renderer==='drone'){ctx.drawImage(droneSprite,-o.w/2,-o.h,o.w,o.h);return true;}
 if(visual.renderer==='character')return ({joe,amber,rogozin,zuck:zuckerberg,trump:trumpPose}[visual.key])?.(o,bob);
 if(visual.renderer==='photo')return photos.drawGround(ctx,visual.key,o.w,o.h);
 if(visual.renderer==='cutout')return cutout(visual.key,-o.w/2,-o.h+bob,o.w,o.h);
 return props.draw(ctx,visual.key,o.w,o.h);
}
function obstacle(o){ctx.save();ctx.translate(px+obstacleDx(o)*scale,ground+cameraLift-(o.altitude||0)*scale);ctx.scale(scale,scale);const bob=obstacleDefinition(o.id)?.visual.bob?Math.sin(Math.floor(sceneTime*7)+o.x*.01)*1.1:0;ctx.translate(o.w/2,0);ctx.rotate(bob*.008);drawObstacleArt(o,bob);ctx.rotate(-bob*.008);ctx.restore()}

const CAMEO={active:false,t:0,nextScore:5000,milestone:0};
function updateCameo(dt){
 if(CAMEO.active){CAMEO.t+=dt;if(CAMEO.t>=12)CAMEO.active=false}
 if(!CAMEO.active&&S.score>=CAMEO.nextScore){CAMEO.milestone=CAMEO.nextScore;CAMEO.nextScore+=5000;CAMEO.active=true;CAMEO.t=0}
}
function milestoneFireworks(){if(!CAMEO.active)return;const t=CAMEO.t;if(t<1.5||t>10)return;ctx.save();
 for(let n=0;n<5;n++){const age=(t-1.5-n*.38)%2.5;if(age<0||age>1.5)continue;const x=W*(.12+n*.18),y=H*(.20+(n%3)*.075),r=age*Math.min(85,W*.16);ctx.globalAlpha=(1-age/1.5)*.75;
 for(let i=0;i<14;i++){const a=i*Math.PI/7+n;const c=['#d9ff62','#f3b775','#9ed9ed'][n%3];line([[x+Math.cos(a)*r*.76,y+Math.sin(a)*r*.76+age*age*12],[x+Math.cos(a)*r,y+Math.sin(a)*r+age*age*12]],c,2)}}ctx.restore();
}

function cameoScene(){if(!CAMEO.active)return;const t=CAMEO.t,k=Math.min(scale,.95),x=W*.58+Math.sin(t*1.4)*9,visible=ease(t/2)*(1-ease((t-9)/3)),y=-180+(H*.38+180)*visible;
 ctx.save();ctx.translate(x,y);ctx.scale(k,k);
 // Ropes remain upright and exit the viewport; no thrust, smoke or collision.
 for(const rx of [-116,112]){line([[rx,-H/k-200],[rx,18]],'#b8ab91',2);ellipse(rx,18,4,3,'#e3dac2')}
 cameoRider('katyHead',38,6);cameoRider('bezosHead',-15,4);
 cutout('toyRocket',-160,-5,320,85);
 // Foreground bent legs make the seated, straddling pose readable.
 cameoLeg('katyHead',38,6);cameoLeg('bezosHead',-15,4);
 if(t>2&&t<9){rect(-155,-153,310,36,'#f5eee2',5);poly([[-18,-118],[-6,-108],[0,-118]],'#f5eee2');text('ELON, '+CAMEO.milestone.toLocaleString('en-US')+'! CONGRATS!',0,-130,12,'#25374e')}
 ctx.restore();
}

const rocket=createRocketSystem({ctx,sprites:spaceportSprites,tone,view:()=>({W,H,ground:ground+cameraLift,speed:S.speed}),time:()=>sceneTime});
const R=rocket.state;
const ease=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
function background(){environment.draw(ctx,{W,H,ground:ground+cameraLift,scale,screenDistance:screenRoadDistance,sceneTime,rocketScene:rocket.draw});}
// Read-only art contact sheet uses the actual game painters, with no extra HTML build.
function reviewObstacles() {
  ctx.fillStyle='#172027';ctx.fillRect(0,0,W,H);
  text('ROADSTER / OBSTACLE CAST',W/2,35,16,'#f4eedf');
  if(!spritesReady){text('LOADING',W/2,H/2,14,'#f4eedf');return;}
  const cols=W<700?2:4,rows=Math.ceil(types.length/cols),cw=W/cols,ch=(H-65)/rows;
  types.forEach((type,i)=>{
    const x=(i%cols+.5)*cw,y=65+Math.floor(i/cols)*ch;
    const zoom=Math.min((cw-32)/150,(ch-35)/135,2.2);
    ctx.save();ctx.translate(x,y+ch-29);ctx.scale(zoom,zoom);
    drawObstacleArt({...type,x:px/scale+300,throwProgress:type.id==='amber'?.5:0});ctx.restore();
    text(type.name,x,y+ch-8,Math.min(10,cw/18),'#bac6bd');
  });
}
function reviewFlip(time) {
 ctx.fillStyle='#172027';ctx.fillRect(0,0,W,H);
 text('ROADSTER / VIDEO KICKFLIP — 9 FRAMES',W/2,30,14,'#f4eedf');
 if(!spritesReady)return;
 const cw=W/3,ch=(H-160)/3;
 for(let i=0;i<9;i++){
  const x=(i%3+.5)*cw,y=60+(Math.floor(i/3)+.5)*ch;
  flipSprite.drawFrame(ctx,i,x,y,Math.min(cw*.76,ch*1.7,290));
  text(String(i+1).padStart(2,'0'),x,y+ch*.4,10,'#bac6bd');
 }
 flipSprite.draw(ctx,W/2,H-45,(time*.65)%1);
}
function reviewSpaceport(){
 ctx.fillStyle='#172a34';ctx.fillRect(0,0,W,H);
 if(!spritesReady)return;
 text('SPACEPORT / SPRITE & FACE REVIEW',W/2,28,13,'#c2cec4');
 const states=[['launch',3],['launch',7],['landing',12],['ready',1],['explosion',.5],['explosion',2.8]];
 const cw=W/3,ch=(H-220)/2;
 states.forEach(([phase,t],i)=>{
   const col=i%3,row=Math.floor(i/3),x=(col+.5)*cw,y=50+(row+1)*ch;
   ctx.save();ctx.beginPath();ctx.rect(col*cw,45+row*ch,cw,ch);ctx.clip();
   ctx.translate(x-W*.5,y-spaceportLayout({W,H,ground}).base);rocket.draw({...R,phase,t,kind:'landing',pass:0,crashLift:.01},W*.5);ctx.restore();
   text(phase+' / '+t+'s',x,y+15,10,'#a9bbb9');
 });
 const saved={...B};
 [0,.05,C.maxStreak].forEach((streak,i)=>{
   Object.assign(B,speedFeedback({base:C.maxSpeed,speed:C.maxSpeed*(1+streak)},streak));B.state=i?'active':'ready';ctx.save();ctx.translate(W*(i+.5)/3,H-32);ctx.scale(.9,.9);elon(0,0,false,0);ctx.restore();
   text(['NORMAL','+5% SPEED','MAX SPEED'][i],W*(i+.5)/3,H-10,10,'#c2cec4');
 });Object.assign(B,saved);
}
function drawFallenPlayer(ds,worldGround,time){
 const pose=fallPose(F);
 ctx.save();ctx.translate(px,worldGround);ctx.scale(ds,ds);
 ctx.save();ctx.translate(pose.car.x,-pose.car.y);ctx.rotate(pose.car.angle);car(0,12,pose.car.phase);ctx.restore();
 ctx.save();ctx.translate(pose.rider.x,-pose.rider.y);ctx.rotate(pose.rider.angle);elon(0,65.5,pose.progress>.77&&pose.progress<.97,time);ctx.restore();
 ctx.restore();
}
function render(dt,time){
 if(spaceportReview){reviewSpaceport();return;}
 if(flipReview){reviewFlip(performance.now()/1000);return;}
 if(artReview){reviewObstacles();return;}
 const shake=F.active&&S.mode==='playing'?fallPose(F).shake:0;canvas.style.transform=shake?`translate(${Math.sin(F.age*83)*shake}px,${Math.cos(F.age*97)*shake}px)`:'';
 characters.beginFrame();background(time);milestoneFireworks();cameoScene();speedStreaks();
 const demo=S.mode==='menu',x=px,ds=scale,hop=P.y;
 const worldGround=ground+cameraLift;
 ellipse(x,worldGround+1.5*ds,46*ds,Math.max(1.3,3.5-hop*.012)*ds,'#0007');
 for(const o of S.obs)obstacle(o);
 ctx.save();ctx.translate(0,cameraLift);drawProjectiles();ctx.restore();
 ctx.save();ctx.translate(px,worldGround);ctx.scale(ds,ds);thrusters.drawDust(ctx);ctx.restore();
 if(F.active)drawFallenPlayer(ds,worldGround,time);else{
 ctx.save();ctx.translate(x,worldGround-hop*ds);ctx.scale(ds,ds);
 ctx.translate(0,-65);ctx.rotate(P.angle);ctx.translate(0,65);
 const {phase,gap,cosmetic}=playerPose();
 if(E.streak>0)boostFlame(-2,-11.5+roadsterMotion.compression);
 if(cosmetic)thrusters.drawJets(ctx,{phase,time:sceneTime,airborne:true,groundDistance:P.y-gap});
 else thrusters.drawFlightJets(ctx,{active:P.thrusting,assisting:P.airborne&&!spinning&&Math.abs(uprightError(P.angle))>.02,time:sceneTime,gap});
 car(0,gap,phase);
 elon(0,-29.5+roadsterMotion.compression,P.airborne,time);
 if(chargingInput){rect(-28,17,56,5,'#45574f',2);rect(-28,17,56*chargeValue,5,'#d9ff62',2);line([[0,17],[0,22]],'#fff',1);}
 ctx.restore();}drawMoneyStreams();
 for(const p of S.particles){ctx.globalAlpha=Math.max(0,p.life);rect(p.x,p.y,3,3,p.c);}
 ctx.globalAlpha=1;
 if(demo)text('ELON / ROCKET RIDER',x,ground+31,8,'#b5c7bd');
}
let lastHud=0;
const perf={frames:0,fps:0,meanRenderMs:0,p95RenderMs:0,samples:[],since:0};
function step(dt){
  if(S.mode==='playing'||S.mode==='menu'){
    sceneTime+=dt;
    if(S.mode==='playing')rocket.update(dt);else {screenRoadDistance+=START_SPEED*scale*dt;advanceRoadsterMotion(roadsterMotion,dt,{grounded:true,speed:START_SPEED});}
  }
  update(dt);
  if(S.mode!=='paused'){
    for(const p of S.particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=300*dt;}
    S.particles=S.particles.filter(p=>p.life>0);
  }
  if(S.mode==='playing')updateProjectiles(dt);
}
function frame(ts){
  if(!spritesReady){requestAnimationFrame(frame);return;}
  clock.advance(ts,step,()=>{if(S.mode==='playing')pause();});
  if(!perf.since)perf.since=ts;
  const begin=performance.now();render(0,sceneTime);
  const duration=performance.now()-begin;perf.samples.push(duration);perf.frames++;
  if(ts-perf.since>=1000){
    perf.fps=Math.round(perf.frames*1000/(ts-perf.since));
    perf.meanRenderMs=perf.samples.reduce((a,b)=>a+b,0)/perf.samples.length;
    perf.p95RenderMs=[...perf.samples].sort((a,b)=>a-b)[Math.floor(perf.samples.length*.95)];
    perf.frames=0;perf.samples.length=0;perf.since=ts;
  }
  if(ts-lastHud>100){
    boostUI();
    lastHud=ts;
  }
  requestAnimationFrame(frame);
}
ui();if(artReview)document.querySelectorAll('#game > :not(canvas)').forEach(el=>el.style.setProperty('display','none','important'));requestAnimationFrame(frame);
window.render_game_to_text=()=>JSON.stringify({version:C.version,time:S.t,progress:pace.progress,stage:stageAt(pace.progress),mode:S.mode,score:S.score,best,y:P.y,fall:{active:F.active,age:F.age,duration:F.duration,rate:F.rate,taps:F.taps,progress:F.active?fallPose(F).progress:1},speed:S.speed,camera:{scale,screenSpeed:S.speed*scale,roadScroll:screenRoadDistance},speedFeedback:{factor:B.factor,lean:B.lean||0,impossibru:!!B.impossibru,flameLength:B.flameLength||0,flameOpacity:B.flameOpacity||0},kmh:S.kmh,baseSpeed:pace.base,playerX:S.anchor,angle:P.angle,omega:P.omega,airborne:P.airborne,spinning,cosmeticFlip:playerPose().cosmetic,grab:P.grab,mph:mphFromKmh(S.kmh||START_KMH),thrustAudio:sound.thrust,thrusting:P.thrusting,fuel:P.fuel,latched:P.latched,turns:P.turns,pending:C.flipFactor*P.turns*(P.turns+1)*E.multiplier/10,flips:E.flips,multiplier:E.multiplier/10,meter:E.meter,streak:E.streak,recovery:pace.recovery,charging:chargingInput,charge:chargeValue,lastLanding,obstacles:S.obs.map(o=>({type:o.id,dx:obstacleDx(o),w:o.w,h:o.h,altitude:o.altitude||0,approachSpeed:o.approachSpeed||0})),director:{wave:director.state.wave,kind:director.state.last?.kind,fallbacks:director.state.fallbacks},tutorial:coach.done,perf:{fps:perf.fps,meanRenderMs:perf.meanRenderMs,p95RenderMs:perf.p95RenderMs},sound:sound.enabled,rocket:{phase:R.phase,nextEventIn:Math.max(0,R.next-sceneTime),events:R.events}});
if(['localhost','127.0.0.1'].includes(location.hostname)){
 window.__qa={S,B,P,E,F,pace,CAMEO,types:[...types,...AIR_TYPES],start,step,render:()=>render(0,sceneTime),beginCharge,releaseCharge,jump,pause,coach,hud,director,syncState,refreshHUD:boostUI,
 setTime(t){S.t=t;pace.progress=t;},setSceneTime(t){sceneTime=t;},obstacleDx,
 spawn(id,dx=260){const type=[...types,...AIR_TYPES].find(o=>o.id===id);S.obs.push({...type,x:S.anchor+dx,uid:++S.entityId,passed:false});},
 rocket,roadsterMotion,thrusters,stop(){S.mode='paused';ui();},projectiles,characters,sound,
 launch(charge){launch(P,charge);syncState();},get lastLanding(){return lastLanding;}};
}
