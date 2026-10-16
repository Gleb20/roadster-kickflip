import {loading} from './loading.js?v=2.4.2';
import {createThrusterEffects} from './thrusters.js?v=2.4.1';
import {createSound} from './sound.js?v=2.4.1';
import {createSpaceportSprites} from './spaceport-sprites.js?v=2.4.1';
import {createFlipSprite, flipFrameAt, createRoadsterMotion, advanceRoadsterMotion} from './roadster-flip.js?v=2.4.1';
import {createRocketSystem,spaceportLayout} from './rocket.js?v=2.4.1';
import {createDirector} from './director.js?v=2.4.1';
import {types} from './catalog.js?v=2.4.1';
import {START_SPEED, MAX_SPEED, START_KMH, MAX_KMH, RAMP_SECONDS, JUMP_SPEED, GRAVITY, CHARGE_SECONDS, jumpHeight, hitsObstacle} from './physics.js';
import {createSlapstick} from './slapstick.js';
import {createClock} from './clock.js';
import {createEnvironmentRenderer} from './environment.js?v=2.4.1';
import {createCharacterRenderer} from './characters.js?v=2.4.1';
import {createPropRenderer} from './props.js?v=2.1.0';
import {createPhotoRenderer} from './photo-cutouts.js';
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
let best=0;try{best=Number(localStorage.getItem('roadster-best-v1'))||0}catch{}$('best').textContent=String(best).padStart(5,'0');
let W,H,scale,ground,px,sceneTime=0,roadDistance=0;
let learnedJump=false;try{learnedJump=localStorage.getItem('roadster-charge-learned-v1')==='1'}catch{}

Object.assign(S,{charging:false,charge:0,launchSpeed:JUMP_SPEED});

const B={state:'ready',charge:1,left:0,duration:5,level:1,factor:1};
let activePointer=null,activeKey=null;
function resetBoost(){Object.assign(B,{state:'ready',charge:1,left:0,duration:5,level:1,factor:1});S.baseSpeed=START_SPEED;S.kmh=START_KMH;S.speed=START_SPEED;boostUI()}
function activateBoost(){if(S.mode!=='playing'||B.state==='active'||B.charge<1)return false;B.level=B.charge>=2?2:1;B.duration=B.level===2?7:5;B.left=B.duration;B.charge=0;B.state='active';tone(B.level===2?75:110,.4,'sawtooth',.035);boostUI();return true}
function boostUI(){$('speed-readout').classList.toggle('hidden',!['playing','paused'].includes(S.mode));$('speed-value').textContent=Math.round((S.kmh||START_KMH)*B.factor);$('speed-fill').style.width=(Math.min(1,(S.kmh||START_KMH)/MAX_KMH)*100)+'%';const el=$('boost'),active=B.state==='active',ready=B.charge>=1,superReady=B.charge>=2;
el.classList.toggle('hidden',!['playing','paused'].includes(S.mode));el.disabled=S.mode!=='playing'||(!active&&!ready)||active;
el.classList.toggle('active',active);el.classList.toggle('super',superReady||(active&&B.level===2));
$('boost-ring').style.strokeDashoffset=String(289*(1-(active?B.left/B.duration:Math.min(1,B.charge))));
$('boost-overcharge').style.strokeDashoffset=String(239*(1-(active?0:Math.max(0,B.charge-1))));
$('boost-title').textContent=superReady||(active&&B.level===2)?'BOOST X2':'BOOST';
$('boost-time').textContent=active?B.left.toFixed(1)+'s':ready?(superReady?'+300%':'+146%'):Math.ceil((1-B.charge)*30)+'s';
$('boost-note').textContent=active?'ACTIVE':superReady?'MAX POWER':ready?'X2 IN '+Math.ceil((2-B.charge)*30)+'s':'CHARGING';
el.setAttribute('aria-label',active?'Boost active':ready?(superReady?'Boost X2: 300 percent extra speed for 7 seconds':'Boost: 146 percent extra speed for 5 seconds'):'Boost recharging');}
function updateBoost(dt){let rest=dt;if(B.state==='active'){const used=Math.min(rest,B.left);B.left=Math.max(0,B.left-used);rest-=used;if(B.left<1e-8){B.left=0;B.state='charging'}}
if(B.state!=='active'){B.charge=Math.min(2,B.charge+rest/30);B.state=B.charge>=2?'super':B.charge>=1?'ready':'charging'}
const target=B.state==='active'?(B.level===2?4:2.46):1,old=B.factor;
B.factor+=(target-B.factor)*(1-Math.exp(-dt/(target>old?.16:.48)));if(Math.abs(B.factor-target)<.0001)B.factor=target;
// Widen world spacing and camera range together: no obstacle jumps when boost starts or ends.
const player=px/scale;for(const o of S.obs)o.x=player+(o.x-player)*B.factor/old;
S.speed=S.baseSpeed*B.factor}
function obstacleDx(o){return(o.x-px/scale)/B.factor}
function gestureTarget(){
 let nearest=null,distance=300;
 for(const o of S.obs){const dx=Math.abs(obstacleDx(o)+o.w/2);if(o.id==='trump'&&dx<distance){nearest=o;distance=dx;}}
 return nearest;
}
function joeTarget(){
 let nearest=null,distance=650;
 for(const o of S.obs){const dx=obstacleDx(o)+o.w/2;if(o.id==='joe'&&dx<650&&dx>-480&&Math.abs(dx)<distance){nearest=o;distance=Math.abs(dx);}}
 return nearest;
}
function playerPose(){
 const phase=S.y>0?Math.min(1,S.jumpTime/(2*S.launchSpeed/GRAVITY)):0;
 const gap=S.y>0?Math.sin(phase*Math.PI)*24:0;
 return {phase,gap,y:-S.y-29.5-gap*.2+roadsterMotion.compression};
}
const iconPaths={arrow:'M5 19 19 5M5 5h14v14',restart:'M4 11a8 8 0 1 1 2 7M4 4v7h7',play:'m8 5 11 7-11 7Z',pause:'M8 5v14M16 5v14',sound:'M4 10h4l5-5v14l-5-5H4ZM17 8q5 4 0 8',jump:'M5 17q7-14 14-10M13 5l6 2-2 6'};
function icon(name){return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${iconPaths[name]}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
function resize(){
  const previousAnchor=scale?px/scale:null;
  W=innerWidth;H=innerHeight;
  const cap=matchMedia('(pointer:coarse)').matches?1.5:2;
  const d=Math.min(devicePixelRatio||1,cap,Math.sqrt(3000000/(W*H)));
  canvas.width=Math.round(W*d);canvas.height=Math.round(H*d);
  ctx.setTransform(d,0,0,d,0,0);
  scale=Math.min(1.25,Math.max(.68,W/650),H/430);
  ground=H*.84;px=W<600?W*.24:W*.29;
  if(previousAnchor!==null){const delta=px/scale-previousAnchor;for(const o of S.obs)o.x+=delta;}
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
function ui(){for(let [id,mode] of [['menu','menu'],['result','dead'],['paused','paused']])$(id).classList.toggle('hidden',S.mode!==mode);$('jump').classList.toggle('hidden',S.mode!=='playing'||learnedJump);$('pause').style.visibility=['playing','paused'].includes(S.mode)?'visible':'hidden';boostUI()}
function start(){if(!spritesReady||artReview)return;sound.unlock();cancelCharge();Object.assign(S,{mode:'playing',t:0,distance:0,score:0,bonus:0,flips:0,y:0,vy:0,jumpTime:0,speed:START_SPEED,next:1.7,obs:[],particles:[],toast:0,charging:false,charge:0,launchSpeed:JUMP_SPEED,lastCharge:0});resetBoost();Object.assign(roadsterMotion,createRoadsterMotion());thrusters.reset();director.reset();Object.assign(CAMEO,{t:0,active:false,nextScore:5000,milestone:0});rocket.schedule();$('toast').textContent='';$('score').textContent='00000';$('status').textContent='0 M / '+START_KMH+' KM/H';projectiles.length=0;clock.reset();ui();tone(500)}
function cancelCharge(){S.charging=false;S.charge=0;activePointer=null;activeKey=null}
function beginCharge(){if(S.mode!=='playing'||S.y>0||S.charging)return false;S.charging=true;S.charge=0;return true}
function jump(){if(S.mode!=='playing'||S.y>0){cancelCharge();return}const power=S.charge;S.lastCharge=power;cancelCharge();S.launchSpeed=JUMP_SPEED+60*power;S.vy=S.launchSpeed;S.y=.01;S.jumpTime=0;S.flips++;learnedJump=true;$('jump').classList.add('hidden');try{localStorage.setItem('roadster-charge-learned-v1','1')}catch{}S.bonus+=10;burst(px,ground-8,14+Math.round(power*8),'#c9f9ff');tone(660+power*150,.18,'triangle')}
function releaseCharge(){if(S.charging)jump()}
function pause(){cancelCharge();clock.reset();if(S.mode==='playing')S.mode='paused';else if(S.mode==='paused'){sound.unlock();S.mode='playing';}ui()}
$('boost').onclick=activateBoost;$('boost').addEventListener('pointerdown',e=>e.stopPropagation());
$('start').onclick=start;$('restart').onclick=start;$('resume').onclick=pause;$('pause').onclick=pause;
$('game').addEventListener('pointerdown',e=>{if(e.button!==0||!e.isPrimary||activePointer!==null||activeKey!==null)return;if(e.target.closest('button,a')&&!e.target.closest('#jump'))return;e.preventDefault();if(beginCharge()){activePointer=e.pointerId;try{$('game').setPointerCapture(e.pointerId)}catch{}}});
addEventListener('pointerup',e=>{if(e.pointerId!==activePointer)return;e.preventDefault();releaseCharge()});
addEventListener('pointercancel',e=>{if(e.pointerId===activePointer)cancelCharge()});
$('game').addEventListener('lostpointercapture',e=>{if(e.pointerId===activePointer)cancelCharge()});
for(const event of ['selectstart','dragstart','contextmenu'])$('game').addEventListener(event,e=>e.preventDefault());
$('sound').onclick=()=>{sound.toggle();soundUI();tone(600)};
addEventListener('keydown',e=>{if(['KeyB','ShiftLeft','ShiftRight'].includes(e.code)&&!e.repeat){e.preventDefault();activateBoost();return}if(['Space','ArrowUp','KeyW'].includes(e.code)){e.preventDefault();if(e.repeat)return;if(S.mode==='menu'||S.mode==='dead'){start();return}if(activePointer===null&&activeKey===null&&beginCharge())activeKey=e.code}if((e.code==='Escape'||e.code==='KeyP')&&!e.repeat)pause()});
addEventListener('keyup',e=>{if(e.code!==activeKey)return;e.preventDefault();releaseCharge()});
addEventListener('blur',()=>{if(S.mode==='playing')pause();else cancelCharge()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&S.mode==='playing')pause()});
function burst(x,y,n,c){for(let i=0;i<n;i++)S.particles.push({x,y,vx:(Math.random()-.5)*180,vy:-Math.random()*160,life:.5+Math.random()*.3,c})}


const director=createDirector({S,B,spawnX:()=>px/scale+(W/scale+120-px/scale)*B.factor});
function die(o){cancelCharge();S.score=Math.floor(S.distance/20)+S.bonus;S.mode='dead';tone(90,.35,'sawtooth');burst(px,ground-S.y*scale,24,'#ff835e');const record=S.score>best;if(record){best=S.score;try{localStorage.setItem('roadster-best-v1',best)}catch{}}$('best').textContent=String(best).padStart(5,'0');$('finalScore').textContent=S.score;$('flips').textContent=S.flips;$('reason').textContent='You hit '+o.name+'. Ready for another launch?';$('endlabel').textContent=record?'NEW PERSONAL BEST!':'NOT EVERYTHING TAKES OFF.';$('toast').textContent='';ui()}
function update(dt) {
  if (S.mode !== 'playing') return;
  S.t += dt;
  if (S.charging) S.charge = Math.min(1, S.charge + dt / CHARGE_SECONDS);
  const progression = Math.min(1, S.t / RAMP_SECONDS);
  S.baseSpeed = START_SPEED + (MAX_SPEED - START_SPEED) * progression;
  S.kmh = START_KMH + (MAX_KMH - START_KMH) * progression;
  updateBoost(dt);
  S.distance += S.speed * dt;
  roadDistance += S.speed * dt;
  S.score = Math.floor(S.distance / 20) + S.bonus;
  updateCameo(dt);
  S.next -= dt;
  if (S.next <= 0) director.spawn();
  let impactSpeed=0;
  if (S.y > 0) {
    S.jumpTime += dt;
    S.vy = S.launchSpeed - GRAVITY * S.jumpTime;
    S.y = jumpHeight(S.jumpTime, S.lastCharge);
    if (S.y <= 0) {
      impactSpeed=Math.abs(S.vy);
      S.y = 0; S.vy = 0;
      tone(130, .08);
    }
  }
  thrusters.update(dt,{impactSpeed,speed:S.speed});
  advanceRoadsterMotion(roadsterMotion,dt,{grounded:S.y===0,speed:S.speed,charge:S.charge,impactSpeed});
  for (const o of S.obs) {
    o.x -= S.speed * dt;
    const dx = obstacleDx(o);
    if (hitsObstacle(o, dx, S.y, sceneTime)) { die(o); break; }
    if (!o.passed && dx + o.w < -30) {
      o.passed = true; S.bonus += 50; S.toast = .8;
      $('toast').textContent = ['CLEAN FLIP +50', 'TO THE MOON +50', 'ABSOLUTELY +50'][Math.floor(Math.random() * 3)];
      tone(920, .12);
    }
  }
  S.obs = S.obs.filter(o => o.id==='joe' ? obstacleDx(o)+o.w/2>-480 : obstacleDx(o) + px / scale + o.w > -100);
  if (S.toast > 0) { S.toast -= dt; if (S.toast <= 0) $('toast').textContent = ''; }
  S.score = Math.floor(S.distance / 20) + S.bonus;
}
function poly(points,color,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke()}}
function rect(x,y,w,h,c,r=0){ctx.fillStyle=c;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function ellipse(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()}
function line(p,c,w=2){ctx.beginPath();p.forEach((v,i)=>i?ctx.lineTo(...v):ctx.moveTo(...v));ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke()}
function text(t,x,y,size,c,align='center'){ctx.fillStyle=c;ctx.font=`bold ${size}px Arial`;ctx.textAlign=align;ctx.fillText(t,x,y)}
let spritesReady=false;
const atlas=new Image(),extras=new Image(),cast=new Image();
$('start').disabled=true;$('start').textContent='LOADING CUTOUTS…';
const loadSprite=async(img,src)=>{img.src=src;await img.decode();};
loading.load([
  {name:'interface stylesheet',load:()=>loading.stylesReady},
  {name:'collage atlas',load:()=>loadSprite(atlas,'collage-atlas.png')},
  {name:'scene extras',load:()=>loadSprite(extras,'collage-extras.png')},
  {name:'spaceport / VFX',load:()=>spaceportSprites.load()},
  {name:'paper cast',load:()=>loadSprite(cast,'paper-cast.png')},
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
function paperLimb(points,color,width){line(points,'#282b2d',width+1.3);line(points,color,width)}
function car(x,y,phase=0){flipSprite.draw(ctx,x,y,phase,roadsterMotion)}
const characters=createCharacterRenderer({ctx,cutout,getState:()=>({S,B,CAMEO,sceneTime,heroY:playerPose().y}),gestureTarget,joeTarget,obstacleDx,photos});
const {elon,trumpPose,zuckerberg,rogozin,amber,joe,cameoRider}=characters;
function boostFlame(x,y){if(B.factor<1.03)return;const intensity=(B.factor-1)/3,len=(65+intensity*140)*(1+Math.sin(sceneTime*47)*.1);ctx.save();ctx.translate(x,y);ctx.globalAlpha=Math.min(1,intensity*3);
ctx.save();ctx.scale(1,.32);const glow=ctx.createRadialGradient(-50,0,1,-50,0,len);glow.addColorStop(0,B.level===2?'#ca82ff65':'#73eaff65');glow.addColorStop(1,'#68dfff00');ctx.fillStyle=glow;ctx.fillRect(-50-len,-len,2*len,2*len);ctx.restore();
poly([[-43,-9],[-70,-15],[-len*.8,-6],[-len-45,0],[-len*.7,7],[-72,13],[-43,6]],B.level===2?'#ad77ff':'#59dfff');poly([[-46,-5],[-83,-7],[-len*.75-20,0],[-80,7],[-46,4]],'#fff1ab');poly([[-44,-3],[-105,0],[-44,3]],'#fffdf1');for(let i=0;i<5;i++){const progress=(sceneTime*(1.9+i*.08)+i*.19)%1;line([[-65-progress*len,i%2?12:-12],[-75-progress*len,i%2?12:-12]],'#adf3ff',1.5)}ctx.restore()}
function speedStreaks(){if(B.factor<1.05)return;ctx.save();ctx.globalAlpha=Math.min(.55,(B.factor-1)*.2);for(let i=0;i<18;i++){const y=H*.25+(i*83)%(H*.6),x=W-((sceneTime*(500+B.factor*160)+i*137)%(W+300));line([[x,y],[x+30+B.factor*18,y]],B.level===2?'#d3a2ef':'#a0e6ed',i%3?1:2)}ctx.restore()}
function drawObstacleArt(o,bob=0){return (o.id==='joe'?joe(o):o.id==='amber'?amber(o):o.id==='rogozin'?rogozin(o):o.id==='zuck'?zuckerberg():o.id==='trump'?trumpPose(o,bob):photos.has(o.id)?photos.drawGround(ctx,o.id,o.w,o.h):cutouts[o.id]?cutout(o.id,-o.w/2,-o.h+bob,o.w,o.h):props.draw(ctx,o.id,o.w,o.h));}
function obstacle(o){ctx.save();ctx.translate(px+obstacleDx(o)*scale,ground);ctx.scale(scale,scale);const bob=['trump','protest','doge'].includes(o.id)?Math.sin(Math.floor(sceneTime*7)+o.x*.01)*1.1:0;ctx.translate(o.w/2,0);ctx.rotate(bob*.008);drawObstacleArt(o,bob);ctx.rotate(-bob*.008);text(o.name,0,18,8,'#a9b3aa');ctx.restore()}

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
 cameoRider('katyHead',38,6,'#3768a1',true);cameoRider('bezosHead',-15,4,'#2e5682');
 cutout('toyRocket',-160,-5,320,85);
 // Foreground bent legs make the seated, straddling pose readable.
 for(const rx of [-15,38])paperLimb([[rx,-6],[rx-24,4],[rx-20,36]],'#37618d',11);
 paperLimb([[21,-25],[5,-13],[-27,-14]],'#3768a1',8);ellipse(-27,-14,5,5,'#edbc90');
 if(t>2&&t<9){rect(-155,-153,310,36,'#f5eee2',5);poly([[-18,-118],[-6,-108],[0,-118]],'#f5eee2');text('ELON, '+CAMEO.milestone.toLocaleString('en-US')+'! CONGRATS!',0,-130,12,'#25374e')}
 ctx.restore();
}

const rocket=createRocketSystem({ctx,sprites:spaceportSprites,tone,view:()=>({W,H,ground,speed:S.speed}),time:()=>sceneTime});
const R=rocket.state;
const ease=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
function background(){environment.draw(ctx,{W,H,ground,scale,roadDistance,sceneTime,rocketScene:rocket.draw});}
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
 [1,2.46,4].forEach((factor,i)=>{
   B.factor=factor;B.state=i?'active':'ready';ctx.save();ctx.translate(W*(i+.5)/3,H-32);ctx.scale(.9,.9);elon(0,0,false,0);ctx.restore();
   text(['NORMAL','BOOST','BOOST X2'][i],W*(i+.5)/3,H-10,10,'#c2cec4');
 });Object.assign(B,saved);
}
function render(dt,time){
 if(spaceportReview){reviewSpaceport();return;}
 if(flipReview){reviewFlip(performance.now()/1000);return;}
 if(artReview){reviewObstacles();return;}
 background(time);milestoneFireworks();cameoScene();speedStreaks();
 const demo=S.mode==='menu',x=px,ds=scale,hop=S.y;
 ellipse(x,ground+1.5*ds,46*ds,Math.max(1.3,3.5-hop*.012)*ds,'#0007');
 for(const o of S.obs)obstacle(o);
 drawProjectiles();ctx.save();ctx.translate(px,ground);ctx.scale(ds,ds);thrusters.drawDust(ctx);ctx.restore();ctx.save();ctx.translate(x,ground-hop*ds);ctx.scale(ds,ds);
 let {phase,gap}=playerPose();if(demo){phase=0;gap=0;}
 if(S.y>0){
   for(let k=0;k<3;k++)line([[-36-k*12,4+gap],[-70-k*20,11+gap]],'#b8f8ff55',2);
 }
 boostFlame(-2,gap-11.5+roadsterMotion.compression);
 ctx.save();ctx.translate(0,gap);
 thrusters.drawJets(ctx,{phase,time:sceneTime,airborne:S.y>0,compression:roadsterMotion.compression,groundDistance:S.y-gap});ctx.restore();
 car(0,gap,phase);
 elon(0,-29.5-gap*.2+roadsterMotion.compression,S.y>0,time);
 if(S.charging){rect(-28,17,56,4,'#45574f',2);rect(-28,17,56*S.charge,4,'#d9ff62',2);}
 ctx.restore();
 for(const p of S.particles){ctx.globalAlpha=Math.max(0,p.life);rect(p.x,p.y,3,3,p.c);}
 ctx.globalAlpha=1;
 if(demo)text('ELON / ROCKET RIDER',x,ground+31,8,'#b5c7bd');
}
let lastHud=0;
const perf={frames:0,fps:0,meanRenderMs:0,p95RenderMs:0,samples:[],since:0};
function step(dt){
  if(S.mode==='playing'||S.mode==='menu'){
    sceneTime+=dt;
    if(S.mode==='playing')rocket.update(dt);else {roadDistance+=START_SPEED*dt;advanceRoadsterMotion(roadsterMotion,dt,{grounded:true,speed:START_SPEED});}
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
    boostUI();$('score').textContent=String(S.score).padStart(5,'0');
    if(S.mode==='playing')$('status').textContent=`${Math.floor(S.distance/10)} M / ${Math.round(S.kmh*B.factor)} KM/H`;
    lastHud=ts;
  }
  requestAnimationFrame(frame);
}
ui();if(artReview)document.querySelectorAll('#game > :not(canvas)').forEach(el=>el.style.setProperty('display','none','important'));requestAnimationFrame(frame);
window.render_game_to_text=()=>JSON.stringify({version:"2.4.2",carFrame:flipFrameAt(S.y>0?Math.min(1,S.jumpTime/(2*S.launchSpeed/GRAVITY)):0),time:S.t,perf:{fps:perf.fps,meanRenderMs:perf.meanRenderMs,p95RenderMs:perf.p95RenderMs},mode:S.mode,score:S.score,best,y:S.y,speed:S.speed,playerX:px/scale,obstacles:S.obs.map(o=>({type:o.id,x:o.x,w:o.w,h:o.h})),flips:S.flips,charging:S.charging,charge:S.charge,kmh:S.kmh*B.factor,baseKmh:S.kmh,boost:{state:B.state,charge:B.charge,left:B.left,level:B.level,factor:B.factor},cameo:{active:CAMEO.active,t:CAMEO.t,milestone:CAMEO.milestone,nextScore:CAMEO.nextScore},sound:sound.enabled,audio:{state:sound.state,session:navigator.audioSession?.type||'unsupported'},joe:joeTarget()?{dx:obstacleDx(joeTarget())+joeTarget().w/2}:null,rocket:{phase:R.phase,nextEventIn:Math.max(0,R.next-sceneTime),events:R.events}});


if(['localhost','127.0.0.1'].includes(location.hostname)){
  window.__qa={S,B,CAMEO,types,start,step,render:()=>render(0,sceneTime),beginCharge,releaseCharge,activateBoost,pause,
    setTime(t){S.t=t;},setSceneTime(t){sceneTime=t;},obstacleDx,
    spawn(id,dx=260){const type=types.find(o=>o.id===id);S.obs.push({...type,x:px/scale+dx*B.factor,passed:false});},
    rocket,roadsterMotion,thrusters,stop(){S.mode='paused';ui();},projectiles,characters,sound};
}
