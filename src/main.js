import {createRocketSystem} from './rocket.js';
import {createDirector} from './director.js?v=2.1.0';
import {types} from './catalog.js?v=2.1.0';
import {START_SPEED, MAX_SPEED, START_KMH, MAX_KMH, RAMP_SECONDS, JUMP_SPEED, GRAVITY, CHARGE_SECONDS, jumpHeight, hitsObstacle} from './physics.js';
import {createSlapstick} from './slapstick.js';
import {createClock} from './clock.js';
import {createEnvironmentRenderer} from './environment.js';
import {createCharacterRenderer} from './characters.js?v=2.1.0';
import {createPropRenderer} from './props.js?v=2.1.0';
import {createPhotoRenderer} from './photo-cutouts.js';
const elements=new Map();
const $=id=>elements.get(id) || (elements.set(id,document.getElementById(id)),elements.get(id));
const canvas=$('scene'),ctx=canvas.getContext('2d',{alpha:false});
const clock=createClock();
const photos=createPhotoRenderer();
const environment=createEnvironmentRenderer(), props=createPropRenderer(photos);
const slapstick=createSlapstick(), projectiles=slapstick.projectiles;
function updateProjectiles(dt){slapstick.update(dt,S.obs,obstacleDx);}
function drawProjectiles(){slapstick.draw(ctx,{px,ground,scale});}
const artReview=new URLSearchParams(location.search).get('review')==='obstacles';
const S={mode:'menu',t:0,distance:0,score:0,bonus:0,flips:0,y:0,vy:0,jumpTime:0,speed:START_SPEED,next:1.8,obs:[],particles:[],toast:0,lastCharge:0};
let best=0;try{best=Number(localStorage.getItem('roadster-best-v1'))||0}catch{}$('best').textContent=String(best).padStart(5,'0');
let W,H,scale,ground,px,sound=false,audio,sceneTime=0,roadDistance=0;
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
$('boost-note').textContent=active?'РАСХОД':superReady?'МАКСИМУМ':ready?'X2 ЧЕРЕЗ '+Math.ceil((2-B.charge)*30)+'s':'ЗАРЯДКА';
el.setAttribute('aria-label',active?'Буст активен':ready?(superReady?'Буст X2: плюс 300 процентов на 7 секунд':'Буст: плюс 146 процентов на 5 секунд'):'Буст заряжается');}
function updateBoost(dt){let rest=dt;if(B.state==='active'){const used=Math.min(rest,B.left);B.left=Math.max(0,B.left-used);rest-=used;if(B.left<1e-8){B.left=0;B.state='charging'}}
if(B.state!=='active'){B.charge=Math.min(2,B.charge+rest/30);B.state=B.charge>=2?'super':B.charge>=1?'ready':'charging'}
const target=B.state==='active'?(B.level===2?4:2.46):1,old=B.factor;
B.factor+=(target-B.factor)*(1-Math.exp(-dt/(target>old?.16:.48)));if(Math.abs(B.factor-target)<.0001)B.factor=target;
// Widen world spacing and camera range together: no obstacle jumps when boost starts or ends.
const player=px/scale;for(const o of S.obs)o.x=player+(o.x-player)*B.factor/old;
S.speed=S.baseSpeed*B.factor}
function obstacleDx(o){return(o.x-px/scale)/B.factor}
function gestureTarget(){return S.obs.find(o=>o.id==='trump'&&Math.abs(obstacleDx(o)+o.w/2)<230)}
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
function tone(f,d=.1,type='sine',v=.04){if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();let o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(f,audio.currentTime);o.frequency.exponentialRampToValueAtTime(f*.5,audio.currentTime+d);g.gain.setValueAtTime(v,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+d);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+d)}catch{}}
function ui(){for(let [id,mode] of [['menu','menu'],['result','dead'],['paused','paused']])$(id).classList.toggle('hidden',S.mode!==mode);$('jump').classList.toggle('hidden',S.mode!=='playing'||learnedJump);$('pause').style.visibility=['playing','paused'].includes(S.mode)?'visible':'hidden';boostUI()}
function start(){if(!spritesReady||artReview)return;cancelCharge();Object.assign(S,{mode:'playing',t:0,distance:0,score:0,bonus:0,flips:0,y:0,vy:0,jumpTime:0,speed:START_SPEED,next:1.7,obs:[],particles:[],toast:0,charging:false,charge:0,launchSpeed:JUMP_SPEED,lastCharge:0});resetBoost();director.reset();Object.assign(CAMEO,{t:0,active:false,nextScore:5000,milestone:0});rocket.schedule();$('toast').textContent='';$('score').textContent='00000';$('status').textContent='0 M / '+START_KMH+' KM/H';projectiles.length=0;clock.reset();ui();tone(500)}
function cancelCharge(){S.charging=false;S.charge=0;activePointer=null;activeKey=null}
function beginCharge(){if(S.mode!=='playing'||S.y>0||S.charging)return false;S.charging=true;S.charge=0;return true}
function jump(){if(S.mode!=='playing'||S.y>0){cancelCharge();return}const power=S.charge;S.lastCharge=power;cancelCharge();S.launchSpeed=JUMP_SPEED+60*power;S.vy=S.launchSpeed;S.y=.01;S.jumpTime=0;S.flips++;learnedJump=true;$('jump').classList.add('hidden');try{localStorage.setItem('roadster-charge-learned-v1','1')}catch{}S.bonus+=10;burst(px,ground-8,14+Math.round(power*8),'#c9f9ff');tone(660+power*150,.18,'triangle')}
function releaseCharge(){if(S.charging)jump()}
function pause(){cancelCharge();clock.reset();if(S.mode==='playing')S.mode='paused';else if(S.mode==='paused')S.mode='playing';ui()}
$('boost').onclick=activateBoost;$('boost').addEventListener('pointerdown',e=>e.stopPropagation());
$('start').onclick=start;$('restart').onclick=start;$('resume').onclick=pause;$('pause').onclick=pause;
$('game').addEventListener('pointerdown',e=>{if(e.button!==0||!e.isPrimary||activePointer!==null||activeKey!==null)return;if(e.target.closest('button,a')&&!e.target.closest('#jump'))return;e.preventDefault();if(beginCharge()){activePointer=e.pointerId;try{$('game').setPointerCapture(e.pointerId)}catch{}}});
addEventListener('pointerup',e=>{if(e.pointerId!==activePointer)return;e.preventDefault();releaseCharge()});
addEventListener('pointercancel',e=>{if(e.pointerId===activePointer)cancelCharge()});
$('game').addEventListener('lostpointercapture',e=>{if(e.pointerId===activePointer)cancelCharge()});
for(const event of ['selectstart','dragstart','contextmenu'])$('game').addEventListener(event,e=>e.preventDefault());
$('sound').onclick=()=>{sound=!sound;$('sound').innerHTML=icon('sound')+'<span>'+(sound?'ON':'OFF')+'</span>';$('sound').setAttribute('aria-label',sound?'Выключить звук':'Включить звук');tone(600)};
addEventListener('keydown',e=>{if(['KeyB','ShiftLeft','ShiftRight'].includes(e.code)&&!e.repeat){e.preventDefault();activateBoost();return}if(['Space','ArrowUp','KeyW'].includes(e.code)){e.preventDefault();if(e.repeat)return;if(S.mode==='menu'||S.mode==='dead'){start();return}if(activePointer===null&&activeKey===null&&beginCharge())activeKey=e.code}if((e.code==='Escape'||e.code==='KeyP')&&!e.repeat)pause()});
addEventListener('keyup',e=>{if(e.code!==activeKey)return;e.preventDefault();releaseCharge()});
addEventListener('blur',()=>{if(S.mode==='playing')pause();else cancelCharge()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&S.mode==='playing')pause()});
function burst(x,y,n,c){for(let i=0;i<n;i++)S.particles.push({x,y,vx:(Math.random()-.5)*180,vy:-Math.random()*160,life:.5+Math.random()*.3,c})}


const director=createDirector({S,B,spawnX:()=>px/scale+(W/scale+120-px/scale)*B.factor});
function die(o){cancelCharge();S.score=Math.floor(S.distance/20)+S.bonus;S.mode='dead';tone(90,.35,'sawtooth');burst(px,ground-S.y*scale,24,'#ff835e');const record=S.score>best;if(record){best=S.score;try{localStorage.setItem('roadster-best-v1',best)}catch{}}$('best').textContent=String(best).padStart(5,'0');$('finalScore').textContent=S.score;$('flips').textContent=S.flips;$('reason').textContent='На пути оказался '+o.name+'. Ещё один запуск?';$('endlabel').textContent=record?'НОВЫЙ ЛИЧНЫЙ РЕКОРД!':'НЕ ВСЁ ВЗЛЕТАЕТ.';$('toast').textContent='';ui()}
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
  if (S.y > 0) {
    S.jumpTime += dt;
    S.vy = S.launchSpeed - GRAVITY * S.jumpTime;
    S.y = jumpHeight(S.jumpTime, S.lastCharge);
    if (S.y <= 0) {
      S.y = 0; S.vy = 0;
      burst(px, ground - 5, 8, '#d9ff62');
      tone(130, .08);
    }
  }
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
  S.obs = S.obs.filter(o => obstacleDx(o) + px / scale + o.w > -100);
  if (S.toast > 0) { S.toast -= dt; if (S.toast <= 0) $('toast').textContent = ''; }
  S.score = Math.floor(S.distance / 20) + S.bonus;
}
function poly(points,color,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke()}}
function rect(x,y,w,h,c,r=0){ctx.fillStyle=c;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function ellipse(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()}
function line(p,c,w=2){ctx.beginPath();p.forEach((v,i)=>i?ctx.lineTo(...v):ctx.moveTo(...v));ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke()}
function text(t,x,y,size,c,align='center'){ctx.fillStyle=c;ctx.font=`bold ${size}px Arial`;ctx.textAlign=align;ctx.fillText(t,x,y)}
let spritesReady=false;
const atlas=new Image(),extras=new Image(),launchpad=new Image(),cast=new Image();
$('start').disabled=true;$('start').textContent='ЗАГРУЖАЕМ ВЫРЕЗКИ…';
const loadSprite=(img,src)=>new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=src});
Promise.all([loadSprite(atlas,'collage-atlas.png'),loadSprite(extras,'collage-extras.png'),loadSprite(launchpad,'starbase-pad.png'),loadSprite(cast,'paper-cast.png'),photos.load()]).then(()=>{spritesReady=true;$('start').disabled=false;$('start').innerHTML='НАЧАТЬ '+icon('arrow')}).catch(()=>{$('start').textContent='ОБНОВИТЕ СТРАНИЦУ';$('menu').querySelector('p').textContent='Не удалось загрузить графику. Проверьте интернет и обновите страницу.'});
const cutouts={zuckHead:[cast,40,130,340,395],rogozinHead:[cast,425,140,345,390],bezosHead:[cast,805,165,320,365],katyHead:[cast,1145,140,350,435],toyRocket:[cast,270,620,1030,325],head:[atlas,40,40,380,410],roadster:[atlas,475,185,550,180],v8:[atlas,1025,185,510,180],trump:[atlas,90,490,300,505],trumpHead:[atlas,90,490,300,282],truck:[atlas,450,655,635,260],rocket:[atlas,1190,455,195,545],protest:[extras,0,110,890,825],doge:[extras,945,145,585,790]};
function cutout(key,x,y,w,h,target=ctx){const [img,sx,sy,sw,sh]=cutouts[key];if(!img.complete||!img.naturalWidth)return false;target.drawImage(img,sx*img.naturalWidth/1536,sy*img.naturalHeight/1024,sw*img.naturalWidth/1536,sh*img.naturalHeight/1024,x,y,w,h);return true}
function paperLimb(points,color,width){line(points,'#282b2d',width+1.3);line(points,color,width)}
function car(x,y,flip=0){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(flip)*.12);ctx.scale(1,Math.cos(flip));if(!cutout('roadster',-49,-23,98,34)){rect(-45,-10,90,18,'#eee9db',4)}if(Math.cos(flip)<-.2){ctx.globalAlpha=.72;rect(-30,-4,60,9,'#28333b',3);ctx.globalAlpha=1}ctx.restore()}
const characters=createCharacterRenderer({ctx,cutout,getState:()=>({S,B,CAMEO,sceneTime}),gestureTarget,obstacleDx,photos});
const {elon,trumpPose,zuckerberg,rogozin,amber,cameoRider}=characters;
function boostFlame(x,y){if(B.factor<1.03)return;const intensity=(B.factor-1)/3,len=(65+intensity*140)*(1+Math.sin(sceneTime*47)*.1);ctx.save();ctx.translate(x,y);ctx.globalAlpha=Math.min(1,intensity*3);
ctx.save();ctx.scale(1,.32);const glow=ctx.createRadialGradient(-50,0,1,-50,0,len);glow.addColorStop(0,B.level===2?'#ca82ff65':'#73eaff65');glow.addColorStop(1,'#68dfff00');ctx.fillStyle=glow;ctx.fillRect(-50-len,-len,2*len,2*len);ctx.restore();
poly([[-43,-9],[-70,-15],[-len*.8,-6],[-len-45,0],[-len*.7,7],[-72,13],[-43,6]],B.level===2?'#ad77ff':'#59dfff');poly([[-46,-5],[-83,-7],[-len*.75-20,0],[-80,7],[-46,4]],'#fff1ab');poly([[-44,-3],[-105,0],[-44,3]],'#fffdf1');for(let i=0;i<5;i++){const progress=(sceneTime*(1.9+i*.08)+i*.19)%1;line([[-65-progress*len,i%2?12:-12],[-75-progress*len,i%2?12:-12]],'#adf3ff',1.5)}ctx.restore()}
function speedStreaks(){if(B.factor<1.05)return;ctx.save();ctx.globalAlpha=Math.min(.55,(B.factor-1)*.2);for(let i=0;i<18;i++){const y=H*.25+(i*83)%(H*.6),x=W-((sceneTime*(500+B.factor*160)+i*137)%(W+300));line([[x,y],[x+30+B.factor*18,y]],B.level===2?'#d3a2ef':'#a0e6ed',i%3?1:2)}ctx.restore()}
function drawObstacleArt(o,bob=0){return (o.id==='amber'?amber(o):o.id==='rogozin'?rogozin(o):o.id==='zuck'?zuckerberg():o.id==='trump'?trumpPose(o,bob):photos.has(o.id)?photos.drawGround(ctx,o.id,o.w,o.h):cutouts[o.id]?cutout(o.id,-o.w/2,-o.h+bob,o.w,o.h):props.draw(ctx,o.id,o.w,o.h));}
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
 if(t>2&&t<9){rect(-155,-153,310,36,'#f5eee2',5);poly([[-18,-118],[-6,-108],[0,-118]],'#f5eee2');text('ИЛОН, '+CAMEO.milestone.toLocaleString('ru-RU')+'! ПОЗДРАВЛЯЮ!',0,-130,12,'#25374e')}
 ctx.restore();
}

const rocket=createRocketSystem({ctx,cutout,launchpad,tone,poly,rect,ellipse,line,text,paperLimb,view:()=>({W,H,ground}),time:()=>sceneTime});
const R=rocket.state;
const ease=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
function background(){environment.draw(ctx,{W,H,ground,scale,roadDistance,sceneTime,rocketScene:rocket.draw});}
// Read-only art contact sheet uses the actual game painters, with no extra HTML build.
function reviewObstacles() {
  ctx.fillStyle='#172027';ctx.fillRect(0,0,W,H);
  text('ROADSTER / OBSTACLE CAST',W/2,35,16,'#f4eedf');
  if(!spritesReady){text('ЗАГРУЗКА',W/2,H/2,14,'#f4eedf');return;}
  const cols=W<700?2:4,rows=Math.ceil(types.length/cols),cw=W/cols,ch=(H-65)/rows;
  types.forEach((type,i)=>{
    const x=(i%cols+.5)*cw,y=65+Math.floor(i/cols)*ch;
    const zoom=Math.min((cw-32)/150,(ch-35)/135,2.2);
    ctx.save();ctx.translate(x,y+ch-29);ctx.scale(zoom,zoom);
    drawObstacleArt({...type,x:px/scale+300,throwProgress:type.id==='amber'?.5:0});ctx.restore();
    text(type.name,x,y+ch-8,Math.min(10,cw/18),'#bac6bd');
  });
}
function render(dt,time){if(artReview){reviewObstacles();return;}background(time);milestoneFireworks();cameoScene();speedStreaks();let demo=S.mode==='menu';let x=px;let ds=scale;let hop=S.y;ellipse(x,ground+5,48*ds,Math.max(2,7-hop*.015)*ds,'#0007');for(const o of S.obs)obstacle(o);drawProjectiles();ctx.save();ctx.translate(x,ground-hop*ds-12*ds);ctx.scale(ds,ds);let phase=S.y>0?Math.min(1,S.jumpTime/(2*S.launchSpeed/GRAVITY)):0;if(demo)phase=0;let gap=S.y>0?Math.sin(phase*Math.PI)*24:0;if(S.y>0){for(let k=0;k<3;k++)line([[-36-k*12,8+gap],[-70-k*20,15+gap]],'#b8f8ff55',2);if(phase<.2||phase>.82){poly([[-30,7],[-41,46+Math.sin(sceneTime*43)*8],[-20,7]],'#d0fcff66');poly([[25,7],[30,36+Math.sin(sceneTime*37)*6],[37,7]],'#d0fcff66')}}boostFlame(-2,gap-4);car(0,gap,phase*Math.PI*2);elon(0,-22-gap*.2,S.y>0,time);if(S.charging){rect(-28,17,56,4,'#45574f',2);rect(-28,17,56*S.charge,4,'#d9ff62',2)};ctx.restore();for(const p of S.particles){ctx.globalAlpha=Math.max(0,p.life);rect(p.x,p.y,3,3,p.c)}ctx.globalAlpha=1;if(demo){text('ELON / ROCKET RIDER',x,ground+31,8,'#b5c7bd');}}
let lastHud=0;
const perf={frames:0,fps:0,meanRenderMs:0,p95RenderMs:0,samples:[],since:0};
function step(dt){
  if(S.mode==='playing'||S.mode==='menu'){
    sceneTime+=dt;
    if(S.mode==='playing')rocket.update(dt);else roadDistance+=START_SPEED*dt;
  }
  update(dt);
  if(S.mode!=='paused'){
    for(const p of S.particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=300*dt;}
    S.particles=S.particles.filter(p=>p.life>0);
  }
  if(S.mode==='playing')updateProjectiles(dt);
}
function frame(ts){
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
window.render_game_to_text=()=>JSON.stringify({version:"2.1.0",time:S.t,perf:{fps:perf.fps,meanRenderMs:perf.meanRenderMs,p95RenderMs:perf.p95RenderMs},mode:S.mode,score:S.score,best,y:S.y,speed:S.speed,playerX:px/scale,obstacles:S.obs.map(o=>({type:o.id,x:o.x,w:o.w,h:o.h})),flips:S.flips,charging:S.charging,charge:S.charge,kmh:S.kmh*B.factor,baseKmh:S.kmh,boost:{state:B.state,charge:B.charge,left:B.left,level:B.level,factor:B.factor},cameo:{active:CAMEO.active,t:CAMEO.t,milestone:CAMEO.milestone,nextScore:CAMEO.nextScore},rocket:{phase:R.phase,nextEventIn:Math.max(0,R.next-sceneTime),events:R.events}});


if(['localhost','127.0.0.1'].includes(location.hostname)){
  window.__qa={S,B,CAMEO,types,start,step,render:()=>render(0,sceneTime),beginCharge,releaseCharge,activateBoost,pause,
    setTime(t){S.t=t;},setSceneTime(t){sceneTime=t;},obstacleDx,
    spawn(id,dx=260){const type=types.find(o=>o.id===id);S.obs.push({...type,x:px/scale+dx*B.factor,passed:false});},
    stop(){S.mode='paused';ui();},projectiles,characters};
}
