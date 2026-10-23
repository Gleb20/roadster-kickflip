import {createAudioControls} from './audio-controls.js?v=4.6.3';
import {createRailPainter} from './rail-art.js?v=4.6.3';
import {BOOSTERS,activeBooster} from './boosters.js?v=4.6.3';
import {createBoosterPainter} from './booster-art.js?v=4.6.3';
import {createBiomeScene,biomeEdge} from './biomes.js?v=4.6.3';
import {createEnemySprites} from './enemy-sprites.js?v=4.6.3';
import {createEncounters,xiHands,lightningPaths,VAT_WIDTH,VAT_HEIGHT} from './encounters.js?v=4.6.3';
import {createFactoryRenderer} from './factory.js?v=4.6.3';
import {ONLINE_API,ONLINE_PUBLIC_KEY} from './online-config.js?v=4.6.3';
import {createOnline} from './online.js?v=4.6.3';
import {createScoreRecord} from './score-record.js?v=4.6.3';
import {createOnlineUI} from './online-ui.js?v=4.6.3';
import {createRun,RUN_STEP,RULESET} from './run.js?v=4.6.3';
import {createPWA} from './pwa.js?v=4.6.3';
import {createCollection} from './collection.js?v=4.6.3';
import {createCollectionUI} from './collection-ui.js?v=4.6.3';
import {createObstaclePainter} from './obstacle-art.js?v=4.6.3';
import {loading} from './loading.js?v=4.6.3';
import {createThrusterEffects} from './thrusters.js?v=4.6.3';
import {createSound} from './sound.js?v=4.6.3';
import {createSpaceportSprites} from './spaceport-sprites.js?v=4.6.3';
import {createFlipSprite, jumpCarPose, createRoadsterMotion, advanceRoadsterMotion} from './roadster-flip.js?v=4.6.3';
import {createRocketSystem,spaceportLayout} from './rocket.js?v=4.6.3';
import {types} from './catalog.js?v=4.6.3';
import {obstacleDefinition} from './content.js?v=4.6.3';
import {START_SPEED, START_KMH} from './physics.js?v=4.6.3';
import {GAMEPLAY as C} from './gameplay-config.js?v=4.6.3';
import {launch,uprightError} from './gameplay.js?v=4.6.3';
import {AIR_TYPES,stageAt} from './routes.js?v=4.6.3';
import {createCoach} from './coaching.js?v=4.6.3';
import {createHUD,mphFromKmh} from './hud.js?v=4.6.3';
import {roadBaseline,speedFeedback,baseViewScale,createSpeedView,advanceSpeedView} from './speed-feedback.js?v=4.6.3';
import {fallPose,fallSeatContact} from './fall.js?v=4.6.3';
import {createSlapstick} from './slapstick.js?v=4.6.3';
import {createClock} from './clock.js?v=4.6.3';
import {createEnvironmentRenderer} from './environment.js?v=4.6.3';
import {createCharacterRenderer} from './characters.js?v=4.6.3';
import {createPropRenderer} from './props.js?v=4.6.3';
import {createPhotoRenderer} from './photo-cutouts.js?v=4.6.3';
const elements=new Map();
const $=id=>elements.get(id) || (elements.set(id,document.getElementById(id)),elements.get(id));
const canvas=$('scene'),ctx=canvas.getContext('2d',{alpha:false});
const clock=createClock();
const photos=createPhotoRenderer();
const boosterPainter=createBoosterPainter(),railPainter=createRailPainter();
const enemySprites=createEnemySprites(),encounters=createEncounters();
const spaceportSprites=createSpaceportSprites();
const flipSprite=createFlipSprite();
const roadsterMotion=createRoadsterMotion();
const thrusters=createThrusterEffects();
const factory=createFactoryRenderer(),biomeScene=createBiomeScene();
const reducedScenery=matchMedia('(prefers-reduced-motion: reduce)');
const environment=createEnvironmentRenderer(), props=createPropRenderer(photos);
const slapstick=createSlapstick(), projectiles=slapstick.projectiles;
function updateProjectiles(dt){slapstick.update(dt,S.obs,obstacleDx);}
function drawProjectiles(){slapstick.draw(ctx,{px,ground,scale});}
const reviewMode=new URLSearchParams(location.search).get('review');
const flipReview=reviewMode==='flip';
const spaceportReview=reviewMode==='spaceport';
const encounterReview=reviewMode==='encounters';
const artReview=reviewMode==='obstacles'||flipReview||spaceportReview||encounterReview;
const run=createRun({reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches}),S=run.S;
Object.assign(S,{bonus:0,flips:0,y:0,vy:0,jumpTime:0,particles:[],toast:0,lastCharge:0});
let best=0;try{best=Number(localStorage.getItem(C.bestKey))||0}catch{}$('best').textContent=String(best).padStart(5,'0');
let W,H,scale,ground,px,sceneTime=0,screenRoadDistance=0;
const speedCamera=createSpeedView();
let speedFrame;
function frameCamera(dt){speedFrame=advanceSpeedView(speedCamera,dt,W,H,pace.speed);scale=speedFrame.scale;px=speedFrame.x;}
const {P,E,pace,F,Q,G,input}=run;
let storage;try{storage=localStorage;}catch{}
const collection=createCollection(storage,types.map(o=>o.id));let collectionUI,pwa;
const localHost=['localhost','127.0.0.1'].includes(location.hostname);
let onlineUI,activeOnline=null,completedOnline=null,onlineTarget=null;
const scoreRecord=createScoreRecord({storage,ruleset:RULESET,compatibleRulesets:['roadster-v3.4.2','roadster-v3.8.0','roadster-v4.0.0','roadster-v4.1.0','roadster-v4.3.0','roadster-v4.3.2','roadster-v4.4.0','roadster-v4.4.2','roadster-v4.6.0','roadster-v4.6.1',RULESET]});
let recordRank=null,rankRequest=0;
function refreshScoreActions(){
 const saved=scoreRecord.matching(best),posted=!!saved?.entry,canPost=scoreRecord.canPost(saved),rank=$('best-rank');
 $('best').textContent=String(best).padStart(5,'0');
 rank.replaceChildren();rank.setAttribute('aria-busy',String(best>0&&!recordRank));
 if(!best)rank.textContent='Your next launch starts here.';
 else if(recordRank?.score===best&&recordRank.rank){
  if(!posted&&!online.lookup(saved?.session?.id))rank.append('Would rank ');
  const number=document.createElement('b');number.textContent='#'+recordRank.rank.toLocaleString();rank.append(number,' globally');
 }else rank.textContent='';
 $('post-best').hidden=!canPost;$('post-best').textContent='SUBMIT BEST ↗';
 $('pause-score').textContent=S.score.toLocaleString();
 if(completedOnline){
  const eligible=!!completedOnline.session&&!!completedOnline.replay;
  $('post-score').hidden=!eligible;$('post-score').textContent=completedOnline.entry||online.lookup(completedOnline.session?.id)?'VIEW SCORE ↗':'SUBMIT SCORE ↗';
 }
}
async function refreshRecordRank(){
 const score=best,saved=scoreRecord.matching(score),id=saved?.entry?.id,serial=++rankRequest;
 recordRank=null;refreshScoreActions();if(!score||saved?.rejected)return;
 try{const data=await(id?online.entry(id):online.estimateRank(score));if(serial!==rankRequest||best!==score)return;recordRank={score,rank:data.rank};}
 catch{if(serial!==rankRequest)return;recordRank={score,error:true};}
 refreshScoreActions();
}
const online=createOnline({apiUrl:ONLINE_API,apiKey:ONLINE_PUBLIC_KEY,ruleset:RULESET,storage,enabled:!localHost||new URLSearchParams(location.search).get('online')==='1',onAccepted:(id,entry)=>{scoreRecord.accepted(id,entry);if(completedOnline?.session?.id===id)completedOnline.entry=entry;refreshScoreActions();void refreshRecordRank();},onRejected:id=>{scoreRecord.rejected(id);refreshScoreActions();},onChange:()=>{onlineUI?.refresh();}});
const coach=createCoach(storage);
const hud=createHUD();
const B={state:'ready',charge:0,left:0,duration:0,level:1,factor:1};
const primaryInputs=new Set(),thrustInputs=new Set();
let lastLanding=null;
let cameraLift=0;
Object.assign(S,{charging:false,charge:0,anchor:0,entityId:0});
function syncState(){
 const fallen=F.active?fallPose(F):null;
 S.grind=G;S.falling=F.active;S.fallCrouch=fallen?.crouch||0;S.fallImpact=fallen?.impact||0;S.fallAngle=fallen?.rider.angle||0;S.fallSeat=fallen?.rider.seat||0;S.fallPush=fallen?.push||0;S.fallFlail=fallen?.flail||0;S.y=P.y;S.grab=P.grab;S.vy=P.vy;S.jumpTime=P.time;S.flips=E.flips;S.charge=input.charge;S.charging=input.charging;
 S.bonus=E.bonus;S.score=Math.floor(S.distance/20+E.bonus);biomeScene.update(S.score,S.distance,{ahead:(W-px+64)/scale,behind:(px+64)/scale});factory.update(biomeScene.state,S.t);S.baseSpeed=pace.base;S.speed=pace.speed;
 const progress=Math.min(1,pace.progress/C.rampSeconds),cruise=C.startSpeed+(C.maxSpeed-C.startSpeed)*progress;
 S.kmh=(130+270*progress)*S.speed/cruise;Object.assign(B,speedFeedback(pace,E.streak,Q.speedBlend));B.state=B.factor>1?'active':'ready';B.charge=P.fuel/100;B.left=E.streakLeft;
}
function boostUI(){
 hud.update({mode:S.mode,falling:F.active,score:S.score,boosters:Q,multiplier:E.multiplier/10*(E.scoreFactor||1),meter:E.meter,streak:E.streak,kmh:S.kmh||START_KMH,fuel:P.fuel,thrusting:P.thrusting,turns:P.turns+G.turns,grinding:!!G.support,grindDistance:G.distance,pending:(P.airborne||G.support)&&!Q.spoiledFlight?C.flipFactor*(P.turns+G.turns)*(P.turns+G.turns+1)*E.multiplier/10*(E.scoreFactor||1)+G.pending:0});
 const location=biomeScene.state.id==='tesla-factory'?'TESLA FACTORY':'SPACEPORT';
 if($('biome-label').textContent!==location)$('biome-label').textContent=location;
 const lesson=F.active?null:coach.next(pace.progress,S.mode==='playing',{air:S.obs.some(o=>o.altitude&&!o.passed)});$('jump').classList.toggle('hidden',!lesson);
 if(lesson){$('coach-title').textContent=lesson.text;$('coach-detail').textContent=lesson.detail;}
}
function obstacleDx(o){return o.x;}
function gestureTarget(){
 if(F.active)return null;
 const xi=S.obs.find(o=>o.id==='xi'&&Math.abs(o.x+o.w/2)<360);
 if(xi)return xi;
 let nearest=null,distance=360;
 for(const o of [...S.obs,...encounters.state.actors]){const r=obstacleDefinition(o.id)?.reactions.hero,dx=Math.abs(obstacleDx(o)+o.w/2);if(r?.enabled&&r.trigger!=='passage'&&(r.trigger!=='airborne-near'||S.y>0)&&dx<Math.min(distance,r.range+60)){nearest=o;distance=dx;}}
 return nearest;
}
function joeTarget(){
 if(F.active)return null;
 let nearest=null,distance=650;
 for(const o of S.obs){const dx=obstacleDx(o)+o.w/2;if(o.id==='joe'&&dx<650&&dx>-480&&Math.abs(dx)<distance){nearest=o;distance=Math.abs(dx);}}
 return nearest;
}
const iconPaths={arrow:'M5 19 19 5M5 5h14v14',restart:'M4 11a8 8 0 1 1 2 7M4 4v7h7',play:'m8 5 11 7-11 7Z',pause:'M8 5v14M16 5v14',sound:'M4 10h4l5-5v14l-5-5H4ZM17 8q5 4 0 8',jump:'M5 17q7-14 14-10M13 5l6 2-2 6'};
function icon(name){return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${iconPaths[name]}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
function resize(){
  W=innerWidth;H=innerHeight;
  const cap=matchMedia('(pointer:coarse)').matches?1.5:2;
  const d=Math.min(devicePixelRatio||1,cap,Math.sqrt(3000000/(W*H)));
  canvas.width=Math.round(W*d);canvas.height=Math.round(H*d);
  ctx.setTransform(d,0,0,d,0,0);
  frameCamera(0);
  ground=roadBaseline(H);
  S.anchor=px/scale;
  // Camera/resize never changes simulation coordinates.
  clock.reset();
}
addEventListener('resize',resize);resize();
const sound=createSound({music:true,defaultEnabled:true});
function soundScene(){sound.setScene({mode:S.mode,visible:!document.hidden,speed:S.speed,multiplier:E.multiplier/10*(E.scoreFactor||1),boost:Q.speedBlend||0,streak:E.streak,biome:biomeScene.state,grinding:!!G.support});}
const audioControls=createAudioControls({sound,entry:$('sound'),pauseButton:$('pause'),pauseSlot:$('pause-audio'),popover:$('sound-popover')});
// Capture touch completion before game handlers prevent default or stop bubbling.
for(const event of ['pointerup','touchend','keydown'])addEventListener(event,()=>sound.unlock(),{capture:true,passive:true});
function ui(){audioControls.setMode(S.mode);soundScene();if(S.mode==='menu')pwa?.checkpoint();refreshScoreActions();for(const [id,mode] of [['menu','menu'],['result','dead'],['paused','paused']])$(id).classList.toggle('hidden',S.mode!==mode);boostUI();}
function cancelCharge(){primaryInputs.clear();thrustInputs.clear();run.command('cancel');sound.setThrust(false);syncState();}
function start(seed){
 if(!spritesReady||artReview||$('game').inert||pwa?.locked)return;
 if(pwa?.beforeRun())return;
 sound.unlock();if($('replay-tutorial').checked){coach.reset();$('replay-tutorial').checked=false;}cancelCharge();activeOnline=typeof seed==='number'?null:online.takeSession();completedOnline=null;const nextSeed=typeof seed==='number'?seed:activeOnline?.seed??crypto.getRandomValues(new Uint32Array(1))[0];run.reset(nextSeed);boosterPainter.reset();biomeScene.reset();factory.reset();encounters.reset();sceneTime=0;rocketLeg=0;Object.assign(S,{particles:[],toast:0});lastLanding=null;
 cameraLift=0;speedCamera.strength=0;frameCamera(0);S.anchor=px/scale;$('toast').textContent='';hud.reset();coach.beginRun();director.reset();Object.assign(roadsterMotion,createRoadsterMotion());thrusters.reset();characters.reset();
 Object.assign(CAMEO,{t:0,active:false,nextScore:5000,milestone:0});rocket.schedule();projectiles.length=0;clock.reset();syncState();ui();sound.event({type:'start'});
}
function beginCharge(){const started=run.command('primary-down');syncState();return started;}
function jump(){const started=run.jump();consumeRunEvents();syncState();return started;}
function releaseCharge(){run.command('primary-up');consumeRunEvents();syncState();}
function pause(){if(S.mode==='paused'&&pwa?.locked)return;cancelCharge();clock.reset();if(S.mode==='playing')S.mode='paused';else if(S.mode==='paused'){sound.unlock();S.mode='playing';}ui();if(S.mode==='paused')$('resume').focus({preventScroll:true});}
function pressPrimary(token){if(primaryInputs.has(token))return;const empty=primaryInputs.size===0;primaryInputs.add(token);if(empty)beginCharge();}
function releasePrimary(token,cancel=false){if(!primaryInputs.delete(token)||primaryInputs.size)return;if(cancel)run.command('primary-cancel');else releaseCharge();}
$('boost').onclick=e=>e.preventDefault();
$('start').onclick=start;$('restart').onclick=start;$('resume').onclick=pause;$('pause').onclick=pause;
$('pause-restart').onclick=start;
function home(){if(pwa?.locked)return;cancelCharge();run.reset();boosterPainter.reset();S.mode='menu';biomeScene.reset();factory.reset();encounters.reset();characters.reset();thrusters.reset();projectiles.length=0;activeOnline=null;completedOnline=null;sceneTime=0;cameraLift=0;speedCamera.strength=0;frameCamera(0);Object.assign(CAMEO,{t:0,active:false,nextScore:5000,milestone:0});clock.reset();syncState();ui();collectionTeaser();$('start').focus({preventScroll:true});void refreshRecordRank();}
$('pause-home').onclick=home;$('result-home').onclick=home;
$('tip-dismiss').onclick=()=>{coach.dismiss(pace.progress);boostUI();};
function gameplayTarget(target){return !!target.closest('#boost')||!target.closest('button,a,input,textarea,select,[contenteditable]');}
$('game').addEventListener('pointerdown',e=>{
 if(e.button!==0||S.mode!=='playing')return;
 const token='p'+e.pointerId;
 if(e.target.closest('#boost')){e.preventDefault();if(!F.active)thrustInputs.add(token);}
 else if(!gameplayTarget(e.target))return;
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
// Cancel the native long-press gesture before Safari starts its loupe. Pointer
// events remain the sole source of game commands; native UI clicks stay intact.
function preventGameGesture(e){
 clearGameSelection();
 if(S.mode==='playing'&&!$('game').inert&&gameplayTarget(e.target)&&e.cancelable)e.preventDefault();
}
for(const event of ['touchstart','touchmove'])$('game').addEventListener(event,preventGameGesture,{capture:true,passive:false});
const thrustKeys=['KeyB','ShiftLeft','ShiftRight'];const jumpKeys=['Space','ArrowUp','KeyW'];
addEventListener('keydown',e=>{
 if(e.target?.closest?.('#tip-dismiss')&&['Space','Enter'].includes(e.code))return;
 if(document.querySelector('dialog[open]')||audioControls.inspect().open)return;
 if($('game').inert)return;
 if(e.target?.closest?.('input,textarea,select')||S.mode!=='playing'&&jumpKeys.includes(e.code)&&e.target?.closest?.('button,a')?.getClientRects().length)return;
 const thrust=thrustKeys.includes(e.code)||(e.code==='Enter'&&document.activeElement===$('boost'));
 if(thrust||jumpKeys.includes(e.code)){
  e.preventDefault();if(e.repeat)return;
  if(jumpKeys.includes(e.code)&&['menu','dead'].includes(S.mode)){start();return;}
  if(S.mode!=='playing')return;
  if(thrust){if(!F.active)thrustInputs.add(e.code);}else pressPrimary(e.code);
 }
 if(['Escape','KeyP'].includes(e.code)&&!e.repeat)pause();
});
addEventListener('keyup',e=>{if(jumpKeys.includes(e.code)){if(S.mode==='playing'&&!e.target?.closest?.('#tip-dismiss'))e.preventDefault();releasePrimary(e.code);}if(thrustKeys.includes(e.code)||e.code==='Enter')thrustInputs.delete(e.code);});
addEventListener('blur',()=>{if(S.mode==='playing')pause();else cancelCharge();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&S.mode==='playing')pause();sound.setVisible(!document.hidden);soundScene();});
const director=run.director;
function die(o){
 cancelCharge();syncState();S.mode='dead';completedOnline={session:activeOnline,replay:run.replay(),score:S.score,entry:null};
 const record=S.score>best;if(record){best=S.score;try{localStorage.setItem(C.bestKey,best);}catch{}}
 scoreRecord.keep(completedOnline,best);
 $('result').classList.toggle('is-record',record);$('record-celebration').hidden=!record;
 $('result-title').textContent=record?'PERSONAL BEST.':'FLIGHT COMPLETE.';
 $('finalScore').textContent=S.score.toLocaleString();$('finalBest').textContent=best.toLocaleString();$('flips').textContent=E.flips;
 $('reason').textContent='You hit '+o.name+'.';$('endlabel').textContent=record?'NEW PERSONAL BEST!':'NOT EVERYTHING TAKES OFF.';$('toast').textContent='';ui();
}

function toast(message){$('toast').textContent=message;S.toast=1.5;}
function consumeRunEvents(){
 for(const event of run.drainEvents()){
  sound.event(event);
  if(event.type==='jump'){coach.complete('jump');if(event.charge>=.5)coach.complete('charge');}
  if(event.type==='death')die(event.obstacle);
  if(event.type==='pickup'){boosterPainter.collect(event,S.t,P,reducedScenery.matches);toast(event.id==='life'?'BACKUP CHIP':BOOSTERS[event.id].name);}
  if(event.type==='rescued'){hud.dropMultiplier(event.oldMultiplier/10*(E.scoreFactor||1));toast('CHIP SAVED YOU');}
  if(event.type==='recovered'){primaryInputs.clear();thrustInputs.clear();toast('BACK ON BOARD');}
  if(event.type==='air-passed')coach.complete('air');
  if(event.type==='landing'){
   const {landed,result,oldMultiplier,late,near}=event;lastLanding=result;
   if(!landed.good){hud.dropMultiplier(oldMultiplier/10*(E.scoreFactor||1));primaryInputs.clear();thrustInputs.clear();sound.setThrust(false);toast('ROUGH LANDING · TAP TO GET UP');S.toast=F.duration+.3;}
   else{if(landed.turns)coach.complete('flip');if(late||near)coach.complete('near');if(result.points)toast(`${landed.turns?landed.turns+' FLIP'+(landed.turns>1?'S':'')+' · ':''}${result.grindDistance>0?'GRIND '+Math.round(result.grindPoints)+' · ':''}${result.perfect?'PERFECT +50 · ':''}${late?'LATE +25 · ':''}${near?'CLOSE +25 · ':''}+${Math.round(result.points)}`);}
  }
 }
}
function update(dt){
 if(S.mode!=='playing')return;
 if(input.thrust!==(thrustInputs.size>0))run.command(thrustInputs.size?'thrust-on':'thrust-off');
 const previousDistance=S.distance,result=run.step();screenRoadDistance+=(S.distance-previousDistance)*baseViewScale(W,H);syncState();
 encounters.update(dt,{speed:S.speed,distance:S.distance,biome:biomeScene.state.id,leg:biomeScene.state.leg,moving:biomeScene.state.moving});
 // Discover visible encounters before presenting a collision result.
 for(const o of [...S.obs,...encounters.state.actors]){const sx=px+o.x*scale,sy=ground+cameraLift-(o.altitude||0)*scale;if(sx+o.w*scale>0&&sx<W&&sy>0&&sy-o.h*scale<H)collection.discover(o.id);}
 consumeRunEvents();if(S.mode==='dead')return;
 sound.setThrust(P.thrusting);if(P.thrusting)coach.complete('thrust');
 thrusters.update(dt,{impactSpeed:result.landed?.impact||(result.impacts?180:0),impactX:result.impacts?fallSeatContact(fallPose(F)).x:0,speed:S.speed});
 advanceRoadsterMotion(roadsterMotion,dt,{grounded:!P.airborne,speed:S.speed,charge:input.charge,impactSpeed:result.landed?.impact||0});
 if(S.toast>0){S.toast-=dt;if(S.toast<=0)$('toast').textContent='';}
 updateCameo(dt);syncState();
 frameCamera(dt);
 const headroom=Math.min(140,H*.23,ground-200*scale);
 const targetLift=Math.max(0,(P.y+200)*scale-ground+headroom);cameraLift+=(targetLift-cameraLift)*(1-Math.exp(-dt*8));
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
  {name:'Tesla factory / assembly floor',load:()=>factory.load()},
  {name:'paper cast',load:()=>loadSprite(cast,'paper-cast.png')},
  {name:'Joe / podcast cutout',load:()=>loadSprite(joeSprite,'assets/characters/joe-rogan.png')},
  ...Object.entries(castSprites).map(([id,img])=>({name:id+' / paper character',load:()=>loadSprite(img,'assets/characters/'+(id==='amber'?'amber-head':id)+'-v247.png')})),
  {name:'encounter cast',load:()=>enemySprites.load()},
  {name:'airborne drone',load:()=>loadSprite(droneSprite,'assets/obstacles/phantom-v3.png')},
  {name:'grind rail',load:()=>railPainter.load()},
  {name:'power-up cutouts',load:()=>boosterPainter.load()},
  {name:'photo cutouts',load:()=>photos.load()},
  {name:'kickflip / 9 poses',load:()=>flipSprite.load()},
]).then(ready=>{
  if(!ready)return;
  spritesReady=true;
  // Prepare the complete first scene, including cleaned/cached hero face, while
  // the loader still covers the game. A drawing failure must keep start blocked.
  render(0,sceneTime);
  clock.reset();$('collection-menu').disabled=false;$('start').disabled=false;$('start').innerHTML='LET’S GO '+icon('arrow');
  loading.finish();
}).catch(()=>{spritesReady=false;loading.fail();});
const cutouts={zuckHead:[cast,40,130,340,395],rogozinHead:[cast,425,140,345,390],bezosHead:[cast,805,165,320,365],katyHead:[cast,1145,140,350,435],toyRocket:[cast,270,620,1030,325],head:[atlas,40,40,380,410],roadster:[atlas,475,185,550,180],v8:[atlas,1025,185,510,180],trump:[atlas,90,490,300,505],trumpHead:[atlas,90,490,300,282],truck:[atlas,450,655,635,260],rocket:[atlas,1190,455,195,545],protest:[extras,0,110,890,825],doge:[extras,945,145,585,790]};
function cutout(key,x,y,w,h,target=ctx){const [img,sx,sy,sw,sh]=cutouts[key];if(!img.complete||!img.naturalWidth)return false;target.drawImage(img,sx*img.naturalWidth/1536,sy*img.naturalHeight/1024,sw*img.naturalWidth/1536,sh*img.naturalHeight/1024,x,y,w,h);return true}
function car(x,y,phase=0){flipSprite.draw(ctx,x,y,phase,roadsterMotion)}
const characters=createCharacterRenderer({ctx,cutout,getState:()=>({S,B,CAMEO,sceneTime,scale,flight:P,seed:run.seed,heroOffset:-29.5+roadsterMotion.compression,heroY:-P.y-29.5+roadsterMotion.compression}),gestureTarget,joeTarget,obstacleDx,joeSprite,castSprites,enemySprites});
const {elon,trumpPose,zuckerberg,rogozin,amber,joe,cameoRider,cameoLeg,drawMoneyStreams}=characters;
function boostFlame(x,y){
 if(!B.flameLength)return;
 const len=B.flameLength*(1+Math.sin(sceneTime*31)*.06),width=3+2*B.intensity;
 ctx.save();ctx.translate(x,y);ctx.globalAlpha=B.flameOpacity;
 poly([[-43,-width],[-57,-width*.7],[-43-len,0],[-57,width*.7],[-43,width]],'#89d7e7');
 poly([[-44,-1.5],[-44-len*.55,0],[-44,1.5]],'#e4f1e8');ctx.restore();
}
function speedStreaks(){
 if(S.mode==='menu'||reducedScenery.matches||speedFrame.energy<.03)return;
 ctx.save();ctx.globalAlpha=speedFrame.energy*.16;
 // Keep the reaction corridor clear: only sky-edge and below-road optic flow.
 for(let i=0;i<10;i++){
  const y=i<4?96+i*13:ground+cameraLift+18+(i-4)*19;
  if(y>H-12)continue;
  const x=W-((screenRoadDistance*(i<4?.55:1.18)+i*137)%(W+150));
  line([[x,y],[x+12+42*speedFrame.energy,y]],'#a0c9d1',i<4?.8:1.1);
 }
 ctx.restore();
}

const drawObstacleArt=createObstaclePainter({ctx,characters,photos,props,cutout,droneSprite,definition:obstacleDefinition,enemySprites});
const portraitCache=new Map();
function collectionPortrait(def){
 if(portraitCache.has(def.id))return portraitCache.get(def.id);
 const image=document.createElement('canvas');image.width=384;image.height=328;const c=image.getContext('2d');
 const neutral=createCharacterRenderer({ctx:c,cutout,getState:()=>({S:{y:0},B:{},CAMEO:{active:false},sceneTime:0,scale:1,heroY:0}),gestureTarget:()=>null,joeTarget:()=>null,obstacleDx:()=>1000,joeSprite,castSprites,enemySprites});
 const draw=createObstaclePainter({ctx:c,characters:neutral,photos,props,cutout,droneSprite,definition:obstacleDefinition,enemySprites});
 const k=Math.min(300/def.w,260/def.h);c.translate(192,294);c.scale(k,k);draw({...def,x:1000},0);
 portraitCache.set(def.id,image);return image;
}
collectionUI=createCollectionUI({store:collection,definitions:types,preview:collectionPortrait,
 beforeOpen:()=>{if(!spritesReady||$('game').inert||S.mode==='playing')return false;cancelCharge();clock.reset();},afterClose:()=>{cancelCharge();clock.reset();collectionTeaser();}});
onlineUI=createOnlineUI({client:online,currentRun:()=>onlineTarget,beforeOpen:()=>{if(!spritesReady||$('game').inert||S.mode==='playing')return false;cancelCharge();clock.reset();},afterClose:()=>{cancelCharge();clock.reset();}});
$('leaderboard-menu').onclick=()=>onlineUI.open($('leaderboard-menu'));
function openScore(trigger,attempt){onlineTarget=attempt;onlineUI.open(trigger,'submit');}
$('post-score').onclick=()=>openScore($('post-score'),completedOnline);
$('post-best').onclick=()=>openScore($('post-best'),scoreRecord.matching(best));
addEventListener('online',()=>{void online.prepare();void refreshRecordRank();});
pwa=createPWA({mode:()=>S.mode,canReload:()=>!document.querySelector('dialog[open]'),restart:()=>start(),lock:locked=>{cancelCharge();for(const id of ['start','restart','resume','pause-restart','pause-home','result-home'])$(id).disabled=locked;}});
$('game').addEventListener('tesla-ready',async()=>{if(!artReview){await online.loaded;collectionUI.restore();onlineUI.restore();void online.prepare();if(!localHost||new URLSearchParams(location.search).get('online')==='1')void online.list(1).catch(()=>{});void refreshRecordRank();await pwa.init();if(pwa.consumeStart()){await online.prepare();if(S.mode==='menu')start();}}},{once:true});
$('collection-menu').onclick=()=>collectionUI.open($('collection-menu'));
function collectionTeaser(){const found=types.filter(o=>collection.state(o.id)!=='locked').length;$('collection-menu').setAttribute('aria-label',`Legend: ${found} of ${types.length} encounters found`);}
collectionTeaser();


function drawFactoryVats(){
 const z=Math.min(1.05,speedFrame.sceneryScale);
 for(const a of encounters.state.actors){
  ctx.save();ctx.translate(px+(a.x+a.w/2)*scale,ground+cameraLift-236*z);ctx.scale(z*.8,z*.8);
  enemySprites.draw(ctx,a.id,a.w,a.h,{alpha:.50});ctx.restore();
 }
}
function drawLightning(){
 if(F.active)return;
 const xi=gestureTarget();if(xi?.id!=='xi')return;
 const hand=characters.interactionHand(),hands=xiHands(xi);
 const pass=Math.max(0,1-Math.abs(xi.x+xi.w/2)/380);
 ctx.save();ctx.globalAlpha=pass*(reducedScenery.matches?.42:.78);
 const bolt=(from,to,color,phase)=>{
  const points=lightningPaths(from,to,sceneTime,{reduced:reducedScenery.matches,phase});
  ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle=color;ctx.lineWidth=3;ctx.stroke();ctx.strokeStyle='#eef4ff';ctx.lineWidth=.8;ctx.stroke();
 };
 bolt(hand,hands[0],'#78dfff',0);bolt(hands[1],hand,'#bb9bff',3);ctx.restore();
}

function obstacle(o){ctx.save();ctx.translate(px+obstacleDx(o)*scale,ground+cameraLift-(o.altitude||0)*scale);ctx.scale(scale,scale);const bob=obstacleDefinition(o.id)?.visual.bob?Math.sin(Math.floor(sceneTime*7)+o.x*.01)*1.1:0;ctx.translate(o.w/2,0);if(o.id==='xi'&&o.x+o.w/2<0)ctx.scale(-1,1);ctx.rotate(bob*.008);drawObstacleArt(o,bob);ctx.rotate(-bob*.008);ctx.restore()}

const CAMEO={active:false,t:0,nextScore:5000,milestone:0};
function updateCameo(dt){
 if(CAMEO.active){CAMEO.t+=dt;if(CAMEO.t>=12)CAMEO.active=false}
 if(!CAMEO.active&&S.score>=CAMEO.nextScore){CAMEO.milestone=CAMEO.nextScore;CAMEO.nextScore+=5000;CAMEO.active=true;CAMEO.t=0}
}
function milestoneFireworks(){if(!CAMEO.active||S.mode==='menu')return;const t=CAMEO.t;if(t<1.5||t>10)return;ctx.save();
 for(let n=0;n<5;n++){const age=(t-1.5-n*.38)%2.5;if(age<0||age>1.5)continue;const x=W*(.12+n*.18),y=H*(.20+(n%3)*.075),r=age*Math.min(85,W*.16);ctx.globalAlpha=(1-age/1.5)*.75;
 for(let i=0;i<14;i++){const a=i*Math.PI/7+n;const c=['#d9ff62','#f3b775','#9ed9ed'][n%3];line([[x+Math.cos(a)*r*.76,y+Math.sin(a)*r*.76+age*age*12],[x+Math.cos(a)*r,y+Math.sin(a)*r+age*age*12]],c,2)}}ctx.restore();
}

function cameoScene(){if(!CAMEO.active||S.mode==='menu')return;const t=CAMEO.t,k=Math.min(scale,.95),x=W*.58+Math.sin(t*1.4)*9,visible=ease(t/2)*(1-ease((t-9)/3)),y=-180+(H*.38+180)*visible;
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

const rocket=createRocketSystem({ctx,sprites:spaceportSprites,tone:()=>{},view:()=>({W,H,ground:ground+cameraLift,speed:S.speed}),time:()=>sceneTime});
const R=rocket.state;
const ease=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
function background(){
 ctx.fillStyle='#172b34';ctx.fillRect(0,0,W,H);
 const biome=biomeScene.state,view={W,H,ground:ground+cameraLift,scale,sceneryScale:speedFrame.sceneryScale,screenDistance:screenRoadDistance,worldDistance:S.distance,sceneTime,activeTime:S.t,reducedMotion:reducedScenery.matches,rocketScene:rocket.draw,drawBehindLine:drawFactoryVats};
 const draw=id=>id==='tesla-factory'?factory.draw(ctx,view):environment.draw(ctx,view);
 if(biome.moving){
  const edge=biomeEdge(biome,S.distance,px,scale),cut=Math.max(0,Math.min(W,edge));
  ctx.save();ctx.beginPath();ctx.rect(0,0,cut,H);ctx.clip();draw(biome.from);ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(cut,0,W-cut,H);ctx.clip();draw(biome.id);ctx.restore();
  factory.drawEntrance(ctx,view,edge,biome.id==='tesla-factory');
 }else draw(biome.id);
}
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
 ctx.save();ctx.translate(pose.car.x,-pose.car.y);ctx.rotate(pose.car.angle);flipSprite.draw(ctx,0,12,0,{compression:0,wheelAngle:roadsterMotion.wheelAngle});ctx.restore();
 ctx.save();ctx.translate(pose.rider.x,-pose.rider.y);ctx.rotate(pose.rider.angle);elon(0,65.5,false,time);ctx.restore();
 ctx.restore();
}

function prepareEncounterReview(time){
 const params=new URLSearchParams(location.search),id=params.get('id')||'xi',def=obstacleDefinition(id);
 if(!def)return;
 const phase=reducedScenery.matches?2.5:time%8;
 encounters.state.actors=[];const x=250-phase*70;
 S.obs=[{...def,x,passed:false}];
 const factoryMode=id==='xi'||id==='t800'||id==='bydSeal'||id==='xiaomiSu7'||id==='batteryAgv'||id==='qualitySkull';
 if(factoryMode){biomeScene.update(7500,0);biomeScene.update(7500,4000);factory.update(biomeScene.state,time);}
 else biomeScene.reset();
 if(factoryMode)encounters.state.actors.push({id:'moltenVat',x:(W*.72-px)/scale-VAT_WIDTH/2,w:VAT_WIDTH,h:VAT_HEIGHT});
 Object.assign(P,{airborne:false,y:0,angle:0,grab:0});Object.assign(S,{y:0,grab:0,falling:false});CAMEO.active=false;
 characters.update(1/120);
}

function render(dt,time){
 if(encounterReview)prepareEncounterReview(time);
 if(spaceportReview){reviewSpaceport();return;}
 if(flipReview){reviewFlip(performance.now()/1000);return;}
 if(reviewMode==='obstacles'){reviewObstacles();return;}
 const shake=F.active&&S.mode==='playing'?fallPose(F).shake:0;canvas.style.transform=shake?`translate(${Math.sin(F.age*83)*shake}px,${Math.cos(F.age*97)*shake}px)`:'';
 background(time);milestoneFireworks();cameoScene();speedStreaks();
 const demo=S.mode==='menu',x=px,ds=scale,hop=P.y;
 const worldGround=ground+cameraLift;
 ellipse(x,worldGround+1.5*ds,46*ds,Math.max(1.3,3.5-hop*.012)*ds,'#0007');
 railPainter.draw(ctx,S.rails,{px,ground:worldGround,scale});
 for(const o of S.obs){if(o.smashed){ctx.save();const a=o.smashAge;ctx.globalAlpha=Math.max(0,1-a/1.2);const cx=px+(o.x+o.w/2)*scale,cy=worldGround-o.h*scale/2;ctx.translate(cx+a*1000*scale,cy-a*550*scale);if(!reducedScenery.matches)ctx.rotate(a*6);ctx.translate(-cx,-cy);obstacle(o);ctx.restore();}else obstacle(o);}
 boosterPainter.drawPickups(ctx,Q,{px,ground:worldGround,scale,time:S.t,flight:P,falling:F.active,reduced:reducedScenery.matches});
 boosterPainter.aura(ctx,Q,{x:px,y:worldGround-hop*ds,scale:ds,time:S.t,reduced:reducedScenery.matches});
 ctx.save();ctx.translate(0,cameraLift);drawProjectiles();ctx.restore();
 ctx.save();ctx.translate(px,worldGround);ctx.scale(ds,ds);thrusters.drawDust(ctx);ctx.restore();
 ctx.save();if(Q.grace>0&&!reducedScenery.matches)ctx.globalAlpha=Math.sin(S.t*12)>0?1:.35;
 if(F.active)drawFallenPlayer(ds,worldGround,time);else{
 ctx.save();ctx.translate(x,worldGround-hop*ds);ctx.scale(ds,ds);
 ctx.translate(0,-65);ctx.rotate(P.angle);ctx.translate(0,65);

 if(E.streak>0||Q.speedBlend>0)boostFlame(-2,-11.5+roadsterMotion.compression);
 // Cosmetic kickflip belongs to ordinary jumps; manual grabs keep the roof toward the rider.
 const jump=jumpCarPose(P,C.gravity,{railJump:G.exit==='jump'}),board=characters.carPose();
 ctx.save();ctx.translate(board.x,board.y);ctx.rotate(board.angle);
 if(jump.cosmetic)thrusters.drawJets(ctx,{phase:jump.phase,time:sceneTime,airborne:true,groundDistance:P.y-jump.gap});
 else thrusters.drawFlightJets(ctx,{active:P.thrusting,assisting:false,time:sceneTime,gap:0});
 car(0,jump.gap,jump.phase);ctx.restore();
 elon(0,-29.5+roadsterMotion.compression,P.airborne,time);
 if(input.charging){rect(-28,17,56,5,'#45574f',2);rect(-28,17,56*input.charge,5,'#d9ff62',2);line([[0,17],[0,22]],'#fff',1);}
 ctx.restore();}ctx.restore();railPainter.sparks(ctx,G,{px,ground:worldGround,scale,time:S.t,flight:P,reduced:reducedScenery.matches});ctx.save();ctx.translate(px,worldGround);ctx.scale(ds,ds);drawMoneyStreams();drawLightning();ctx.restore();
 boosterPainter.drawCollections(ctx,{px,ground:worldGround,scale,time:S.t,flight:P,reduced:reducedScenery.matches});
 for(const p of S.particles){ctx.globalAlpha=Math.max(0,p.life);rect(p.x,p.y,3,3,p.c);}
 ctx.globalAlpha=1;
}
let lastHud=0,rocketLeg=0;
const perf={frames:0,fps:0,meanRenderMs:0,p95RenderMs:0,samples:[],since:0};
function step(dt){
  if(S.mode==='playing'||S.mode==='menu'){
    sceneTime+=dt;
    if(S.mode==='playing'){const biome=biomeScene.state;if(biome.id==='spaceport'){if(biome.leg!==rocketLeg){rocket.schedule();rocketLeg=biome.leg;}rocket.update(dt);}}else {screenRoadDistance+=START_SPEED*baseViewScale(W,H)*dt;advanceRoadsterMotion(roadsterMotion,dt,{grounded:true,speed:START_SPEED});}
  }
  update(dt);soundScene();
  if(S.mode==='playing'||S.mode==='menu')characters.update(dt);
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
window.render_game_to_text=()=>JSON.stringify({version:C.version,grind:G,rails:S.rails,boosters:Q,effectiveMultiplier:E.multiplier/10*(E.scoreFactor||1),biome:biomeScene.state,time:S.t,progress:pace.progress,stage:stageAt(pace.progress),mode:S.mode,score:S.score,best,collection:{discovered:types.filter(o=>collection.state(o.id)!=='locked').length,new:types.filter(o=>collection.state(o.id)==='new').length},y:P.y,fall:{active:F.active,age:F.age,duration:F.duration,rate:F.rate,taps:F.taps,progress:F.active?fallPose(F).progress:1},speed:S.speed,camera:{scale,x:px,strength:speedCamera.strength,energy:speedFrame.energy,sceneryScale:speedFrame.sceneryScale,roadPixelSpeed:S.speed*baseViewScale(W,H),ground:ground+cameraLift,baseline:ground,lift:cameraLift,screenSpeed:S.speed*scale,roadScroll:screenRoadDistance},speedFeedback:{factor:B.factor,lean:B.lean||0,impossibru:!!B.impossibru,flameLength:B.flameLength||0,flameOpacity:B.flameOpacity||0},kmh:S.kmh,baseSpeed:pace.base,playerX:S.anchor,angle:P.angle,omega:P.omega,airborne:P.airborne,spinning:input.spin,cosmeticFlip:jumpCarPose(P,C.gravity,{railJump:G.exit==='jump'}).cosmetic,carAnimation:jumpCarPose(P,C.gravity,{railJump:G.exit==='jump'}),visual:characters.inspect(),encounters:encounters.state.actors.map(a=>({id:a.id,x:a.x,altitude:a.altitude})),grab:P.grab,mph:mphFromKmh(S.kmh||START_KMH),thrustAudio:sound.thrust,thrusting:P.thrusting,fuel:P.fuel,latched:P.latched,turns:P.turns,pending:C.flipFactor*P.turns*(P.turns+1)*E.multiplier/10,flips:E.flips,multiplier:E.multiplier/10,meter:E.meter,streak:E.streak,recovery:pace.recovery,charging:input.charging,charge:input.charge,lastLanding,obstacles:S.obs.map(o=>({type:o.id,dx:obstacleDx(o),w:o.w,h:o.h,altitude:o.altitude||0,approachSpeed:o.approachSpeed||0})),director:{wave:director.state.wave,kind:director.state.last?.kind,fallbacks:director.state.fallbacks},tutorial:coach.done,perf:{fps:perf.fps,meanRenderMs:perf.meanRenderMs,p95RenderMs:perf.p95RenderMs},sound:sound.enabled,audio:sound.inspect,factory:factory.production,rocket:{phase:R.phase,nextEventIn:Math.max(0,R.next-sceneTime),events:R.events}});
if(['localhost','127.0.0.1'].includes(location.hostname)){
 window.__qa={railPainter,G,boosterPainter,run,S,B,P,E,F,Q,pace,CAMEO,collection,collectionUI,types:[...types,...AIR_TYPES],start,step,render:()=>render(0,sceneTime),beginCharge,releaseCharge,jump,pause,coach,hud,director,syncState,refreshHUD:boostUI,
 setTime(t){S.t=t;S.tick=Math.round(t/RUN_STEP);pace.progress=t;},setSceneTime(t){sceneTime=t;},obstacleDx,
 spawn(id,dx=260){const type=[...types,...AIR_TYPES].find(o=>o.id===id);S.obs.push({...type,x:dx,uid:++S.entityId,passed:false});},
 encounters,enemySprites,factory,rocket,roadsterMotion,thrusters,stop(){S.mode='paused';ui();},projectiles,characters,sound,audioControls,
 launch(charge){launch(P,charge);syncState();},get lastLanding(){return lastLanding;}};
}
