'use strict';
const $=id=>document.getElementById(id),canvas=$('scene'),ctx=canvas.getContext('2d');
const S={mode:'menu',t:0,distance:0,score:0,bonus:0,flips:0,y:0,vy:0,jumpTime:0,speed:285,next:1.8,obs:[],particles:[],toast:0,lastCharge:0};
let best=0;try{best=Number(localStorage.getItem('roadster-best-v1'))||0}catch{}$('best').textContent=String(best).padStart(5,'0');
let W,H,scale,ground,px,last=0,sound=false,audio,sceneTime=0,roadDistance=0;
let learnedJump=false;try{learnedJump=localStorage.getItem('roadster-charge-learned-v1')==='1'}catch{}
const JUMP_SPEED=760, GRAVITY=1550, CHARGE_SECONDS=.40;
Object.assign(S,{charging:false,charge:0,launchSpeed:JUMP_SPEED});
const MAX_KMH=400, RAMP_SECONDS=150;
const B={state:'ready',charge:1,left:0,duration:5,level:1,factor:1};
let activePointer=null,activeKey=null;
function resetBoost(){Object.assign(B,{state:'ready',charge:1,left:0,duration:5,level:1,factor:1});S.baseSpeed=285;S.kmh=95;S.speed=285;boostUI()}
function activateBoost(){if(S.mode!=='playing'||B.state==='active'||B.charge<1)return false;B.level=B.charge>=2?2:1;B.duration=B.level===2?7:5;B.left=B.duration;B.charge=0;B.state='active';tone(B.level===2?75:110,.4,'sawtooth',.035);boostUI();return true}
function boostUI(){$('speed-readout').classList.toggle('hidden',!['playing','paused'].includes(S.mode));$('speed-value').textContent=Math.round((S.kmh||95)*B.factor);$('speed-fill').style.width=(Math.min(1,(S.kmh||95)/MAX_KMH)*100)+'%';const el=$('boost'),active=B.state==='active',ready=B.charge>=1,superReady=B.charge>=2;
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
S.speed=S.baseSpeed*B.factor;boostUI()}
function obstacleDx(o){return(o.x-px/scale)/B.factor}
function gestureTarget(){return S.obs.find(o=>o.id==='trump'&&Math.abs(obstacleDx(o)+o.w/2)<230)}
const iconPaths={arrow:'M5 19 19 5M5 5h14v14',restart:'M4 11a8 8 0 1 1 2 7M4 4v7h7',play:'m8 5 11 7-11 7Z',pause:'M8 5v14M16 5v14',sound:'M4 10h4l5-5v14l-5-5H4ZM17 8q5 4 0 8',jump:'M5 17q7-14 14-10M13 5l6 2-2 6'};
function icon(name){return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${iconPaths[name]}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
function resize(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;canvas.width=W*d;canvas.height=H*d;ctx.setTransform(d,0,0,d,0,0);scale=Math.min(1.25,Math.max(.68,W/650));ground=H*.84;px=W<600?W*.24:W*.29;}addEventListener('resize',resize);resize();
function tone(f,d=.1,type='sine',v=.04){if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();let o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(f,audio.currentTime);o.frequency.exponentialRampToValueAtTime(f*.5,audio.currentTime+d);g.gain.setValueAtTime(v,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+d);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+d)}catch{}}
function ui(){for(let [id,mode] of [['menu','menu'],['result','dead'],['paused','paused']])$(id).classList.toggle('hidden',S.mode!==mode);$('jump').classList.toggle('hidden',S.mode!=='playing'||learnedJump);$('pause').style.visibility=['playing','paused'].includes(S.mode)?'visible':'hidden';boostUI()}
function start(){if(!spritesReady)return;cancelCharge();Object.assign(S,{mode:'playing',t:0,distance:0,score:0,bonus:0,flips:0,y:0,vy:0,jumpTime:0,speed:285,next:5.0,obs:[],particles:[],toast:0,charging:false,charge:0,launchSpeed:JUMP_SPEED,lastCharge:0});resetBoost();resetDirector();Object.assign(CAMEO,{t:0,active:false,nextScore:5000,milestone:0});R.next=sceneTime+randomGap();$('toast').textContent='';$('score').textContent='00000';$('status').textContent='0 M / 95 KM/H';ui();tone(500)}
function cancelCharge(){S.charging=false;S.charge=0;activePointer=null;activeKey=null}
function beginCharge(){if(S.mode!=='playing'||S.y>0||S.charging)return false;S.charging=true;S.charge=0;return true}
function jump(){if(S.mode!=='playing'||S.y>0){cancelCharge();return}const power=S.charge;S.lastCharge=power;cancelCharge();S.launchSpeed=JUMP_SPEED+60*power;S.vy=S.launchSpeed;S.y=.01;S.jumpTime=0;S.flips++;learnedJump=true;$('jump').classList.add('hidden');try{localStorage.setItem('roadster-charge-learned-v1','1')}catch{}S.bonus+=10;burst(px,ground-8,14+Math.round(power*8),'#c9f9ff');tone(660+power*150,.18,'triangle')}
function releaseCharge(){if(S.charging)jump()}
function pause(){cancelCharge();if(S.mode==='playing')S.mode='paused';else if(S.mode==='paused')S.mode='playing';ui()}
$('boost').onclick=activateBoost;$('boost').addEventListener('pointerdown',e=>e.stopPropagation());
$('start').onclick=start;$('restart').onclick=start;$('resume').onclick=pause;$('pause').onclick=pause;
$('game').addEventListener('pointerdown',e=>{if(e.button!==0||!e.isPrimary||activePointer!==null||activeKey!==null)return;if(e.target.closest('button,a')&&!e.target.closest('#jump'))return;e.preventDefault();if(beginCharge()){activePointer=e.pointerId;try{$('game').setPointerCapture(e.pointerId)}catch{}}});
addEventListener('pointerup',e=>{if(e.pointerId!==activePointer)return;e.preventDefault();releaseCharge()});
addEventListener('pointercancel',e=>{if(e.pointerId===activePointer)cancelCharge()});
$('game').addEventListener('lostpointercapture',e=>{if(e.pointerId===activePointer)cancelCharge()});
for(const event of ['selectstart','dragstart','contextmenu'])$('game').addEventListener(event,e=>e.preventDefault());
$('sound').onclick=()=>{sound=!sound;$('sound').innerHTML=icon('sound')+'<span>'+(sound?'ON':'OFF')+'</span>';$('sound').setAttribute('aria-label',sound?'Выключить звук':'Включить звук');tone(600)};
addEventListener('keydown',e=>{if(e.code==='KeyB'&&!e.repeat){e.preventDefault();activateBoost();return}if(['Space','ArrowUp','KeyW'].includes(e.code)){e.preventDefault();if(e.repeat)return;if(S.mode==='menu'||S.mode==='dead'){start();return}if(activePointer===null&&activeKey===null&&beginCharge())activeKey=e.code}if((e.code==='Escape'||e.code==='KeyP')&&!e.repeat)pause()});
addEventListener('keyup',e=>{if(e.code!==activeKey)return;e.preventDefault();releaseCharge()});
addEventListener('blur',()=>{if(S.mode==='playing')pause();else cancelCharge()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&S.mode==='playing')pause()});
function burst(x,y,n,c){for(let i=0;i<n;i++)S.particles.push({x,y,vx:(Math.random()-.5)*180,vy:-Math.random()*160,life:.5+Math.random()*.3,c})}
const types=[{id:'v8',name:'V8 • VERY LOUD',w:108,h:40},{id:'trump',name:'TARIFF MAN',w:54,h:90},{id:'protest',name:'ДИВАННЫЕ КРИТИКИ',w:94,h:87},{id:'truck',name:'CYBERBRICK',w:110,h:48},{id:'doge',name:'MUCH WOW',w:52,h:64},{id:'pump',name:'BIG OIL',w:54,h:78},{id:'zuck',name:'ZUCK',w:62,h:105,inset:5},{id:'openai',name:'OPENAI',w:70,h:68,inset:5},{id:'claude',name:'CLAUDE',w:84,h:73,inset:6},{id:'gemini',name:'GEMINI',w:58,h:78,inset:4},{id:'rogozin',name:'РОГОЗИН / ЗАЖМИ ПРЫЖОК',w:88,h:194,inset:4}];

const DIRECTOR={wave:0,pending:null,gap:0};
function resetDirector(){DIRECTOR.wave=0;DIRECTOR.pending=null;DIRECTOR.gap=0}
function clearPair(a,b,delay,speed){
 let min=-Infinity,max=Infinity;
 for(const [o,offset] of [[a,0],[b,delay]]){
  const r=obstacleBoxes(o)[0],h=r.top+8,d=760*760-2*GRAVITY*h;
  if(d<0)return false;
  const enter=(760-Math.sqrt(d))/GRAVITY,leave=(760+Math.sqrt(d))/GRAVITY;
  min=Math.max(min,offset+(r.right+25)/speed-leave);
  max=Math.min(max,offset+(r.left-29)/speed-enter);
 }
 return max-min>.045;
}
function spawnDirector(){
 if(DIRECTOR.pending){
  const {type,delay}=DIRECTOR.pending;
  S.obs.push({...type,x:px/scale+(W/scale+120-px/scale)*B.factor,passed:false});
  S.next=Math.max(.75,DIRECTOR.gap-delay);DIRECTOR.pending=null;return;
 }
 const stage=S.t<30?0:S.t<60?1:S.t<100?2:S.t<150?3:4;
 const [lo,hi,pairChance]=[[2.36,2.86,0],[2.05,2.45,.08],[1.77,2.20,.28],[1.64,1.96,.43],[1.54,1.87,.56]][stage];
 const breath=++DIRECTOR.wave%5===0;
 let gap=lo+Math.random()*(hi-lo)+(breath?.54:0),a=null,b=null,delay=0;
 if(!breath&&Math.random()<pairChance){
  const choices=types.filter(o=>['doge','openai','gemini','claude','pump'].includes(o.id));
  for(let k=0;k<12;k++){
   const x=choices[Math.floor(Math.random()*choices.length)],y=choices[Math.floor(Math.random()*choices.length)],d=.25+Math.random()*.14;
   if(clearPair(x,y,d,S.speed/B.factor)){a=x;b=y;delay=d;break}
  }
 }
 if(!a){
  const solo=types.filter(o=>o.id!=='rogozin'&&(stage>0||o.h<=90));
  a=S.t>=45&&Math.random()<(stage>=4?.13:stage>=2?.085:.055)?types.find(o=>o.id==='rogozin'):solo[Math.floor(Math.random()*solo.length)];
 }
 if(a.id==='rogozin'){gap=Math.max(gap,2.18);b=null}
 S.obs.push({...a,x:px/scale+(W/scale+120-px/scale)*B.factor,passed:false});
 DIRECTOR.gap=gap;
 if(b){DIRECTOR.pending={type:b,delay};S.next=delay}else S.next=gap;
}
function rogozinCue(){
 if(S.mode!=='playing')return;
 const o=S.obs.find(v=>v.id==='rogozin'&&!v.passed&&obstacleDx(v)>0);
 if(!o)return;
 const dx=obstacleDx(o),seconds=(dx-29)/Math.max(1,S.speed/B.factor);
 if(seconds>.38&&seconds<1.28&&px+dx*scale>W-45)text('ЗАЖМИ ПРЫЖОК',W<620?W-86:W-140,ground-Math.max(105,212*scale),W<620?10:12,'#d9ff62');
}

function die(o){cancelCharge();S.mode='dead';tone(90,.35,'sawtooth');burst(px,ground-S.y*scale,24,'#ff835e');const record=S.score>best;if(record){best=S.score;try{localStorage.setItem('roadster-best-v1',best)}catch{}}$('best').textContent=String(best).padStart(5,'0');$('finalScore').textContent=S.score;$('flips').textContent=S.flips;$('reason').textContent='На пути оказался '+o.name+'. Ещё один запуск?';$('endlabel').textContent=record?'НОВЫЙ ЛИЧНЫЙ РЕКОРД!':'НЕ ВСЁ ВЗЛЕТАЕТ.';$('toast').textContent='';ui()}
function update(dt){if(S.mode!=='playing')return;S.t+=dt;if(S.charging)S.charge=Math.min(1,S.charge+dt/CHARGE_SECONDS);const progression=Math.min(1,S.t/RAMP_SECONDS);S.baseSpeed=285+375*progression;S.kmh=95+(MAX_KMH-95)*progression;updateBoost(dt);S.distance+=S.speed*dt;roadDistance+=S.speed*dt;S.score=Math.floor(S.distance/20)+S.bonus;updateCameo(dt);S.next-=dt;if(S.next<=0)spawnDirector();if(S.y>0){S.jumpTime+=dt;S.vy-=GRAVITY*dt;S.y+=S.vy*dt;if(S.y<=0){S.y=0;S.vy=0;burst(px,ground-5,8,'#d9ff62');tone(130,.08)}}for(const o of S.obs){o.x-=S.speed*dt;let dx=obstacleDx(o);if(hitsObstacle(o,dx,S.y)){die(o);break}if(!o.passed&&dx+o.w<-30){o.passed=true;S.bonus+=50;S.toast=.8;$('toast').textContent=['CLEAN FLIP +50','TO THE MOON +50','ABSOLUTELY +50'][Math.floor(Math.random()*3)];tone(920,.12)}}S.obs=S.obs.filter(o=>obstacleDx(o)+px/scale+o.w>-100);S.toast-=dt;if(S.toast<=0)$('toast').textContent='';$('score').textContent=String(S.score).padStart(5,'0');$('status').textContent=`${Math.floor(S.distance/10)} M / ${Math.round(S.kmh*B.factor)} KM/H`}
function poly(points,color,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke()}}
function rect(x,y,w,h,c,r=0){ctx.fillStyle=c;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function ellipse(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()}
function line(p,c,w=2){ctx.beginPath();p.forEach((v,i)=>i?ctx.lineTo(...v):ctx.moveTo(...v));ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke()}
function text(t,x,y,size,c,align='center'){ctx.fillStyle=c;ctx.font=`bold ${size}px Arial`;ctx.textAlign=align;ctx.fillText(t,x,y)}
function wheel(x,y,r){ellipse(x,y,r,r,'#080d12');ellipse(x,y,r*.55,r*.55,'#6a7983');line([[x-r*.4,y],[x+r*.4,y]],'#c0c8c9',2)}
let spritesReady=false;
const atlas=new Image(),extras=new Image(),launchpad=new Image(),cast=new Image();
$('start').disabled=true;$('start').textContent='ЗАГРУЖАЕМ ВЫРЕЗКИ…';
const loadSprite=(img,src)=>new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=src});
Promise.all([loadSprite(atlas,'collage-atlas.png'),loadSprite(extras,'collage-extras.png'),loadSprite(launchpad,'starbase-pad.png'),loadSprite(cast,'paper-cast.png')]).then(()=>{spritesReady=true;$('start').disabled=false;$('start').innerHTML='НАЧАТЬ '+icon('arrow')}).catch(()=>{$('start').textContent='ОБНОВИТЕ СТРАНИЦУ';$('menu').querySelector('p').textContent='Не удалось загрузить графику. Проверьте интернет и обновите страницу.'});
const cutouts={zuckHead:[cast,40,130,340,395],rogozinHead:[cast,425,140,345,390],bezosHead:[cast,805,165,320,365],katyHead:[cast,1145,140,350,435],toyRocket:[cast,270,620,1030,325],head:[atlas,40,40,380,410],roadster:[atlas,475,185,550,180],v8:[atlas,1025,185,510,180],trump:[atlas,90,490,300,505],trumpHead:[atlas,90,490,300,282],truck:[atlas,450,655,635,260],rocket:[atlas,1190,455,195,545],protest:[extras,0,110,890,825],doge:[extras,945,145,585,790]};
function cutout(key,x,y,w,h){const [img,sx,sy,sw,sh]=cutouts[key];if(!img.complete||!img.naturalWidth)return false;ctx.drawImage(img,sx*img.naturalWidth/1536,sy*img.naturalHeight/1024,sw*img.naturalWidth/1536,sh*img.naturalHeight/1024,x,y,w,h);return true}
function paperLimb(points,color,width){line(points,'#f5eee2',width+3);line(points,color,width)}
function car(x,y,flip=0){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(flip)*.12);ctx.scale(1,Math.cos(flip));if(!cutout('roadster',-49,-23,98,34)){rect(-45,-10,90,18,'#eee9db',4)}if(Math.cos(flip)<-.2){ctx.globalAlpha=.72;rect(-30,-4,60,9,'#28333b',3);ctx.globalAlpha=1}ctx.restore()}
function elon(x,y,air,pose=0){ctx.save();ctx.translate(x,y);const crouch=S.charging?(.3+.7*S.charge):0,drop=27*crouch;
const thrust=(B.factor-1)/3;ctx.rotate((air?-.085:Math.sin(Math.floor(pose*9)*.45)*.018)-thrust*.24);
const bend=air?10:0;
paperLimb([[-11,-43+drop],[-22-15*crouch,-25-bend+drop*.5],[-25,0]],'#343b43',15);paperLimb([[12,-43+drop],[24+15*crouch,-27-bend+drop*.5],[25,0]],'#42464c',15);
paperLimb([[-33,1],[-17,1]],'#181d23',7);paperLimb([[17,1],[35,1]],'#181d23',7);
ctx.save();ctx.translate(4*crouch,drop);ctx.rotate(.09*crouch);
poly([[-26,-92],[18,-92],[27,-55],[18,-40],[-20,-42],[-28,-67]],'#252a2d','#f5eee2');text('X',0,-63,24,'#fff7e8');
const taunt=CAMEO.active?null:gestureTarget(),facing=taunt?Math.sign(obstacleDx(taunt)+taunt.w/2)||1:0;const handY=air?-92:-65+10*crouch;
paperLimb([[-22,-82],[-35,-65],[-44,handY]],'#303536',12);if(CAMEO.active)waveArm(22,-82,'#303536',sceneTime,1);else paperLimb([[22,-82],[33,-65],[44,handY-2]],'#303536',12);
for(const hx of (CAMEO.active?[-44]:[-44,44])){ellipse(hx,handY,7,8,'#f5eee2');ellipse(hx,handY,5,6,'#e8ba8d')}if(facing){paperLimb([[facing*22,-82],[facing*38,-74],[facing*47,-103]],'#303536',12);rudeHand(facing*47,-111,1,facing)}
ctx.save();ctx.translate(0,-92);ctx.rotate(facing?facing*.1:air?.11:Math.sin(Math.floor(pose*6))*.025);if(!cutout('head',-34,-74,72,79))ellipse(0,-39,28,36,'#ecc29e');if(B.factor>1.1)scaredFace(thrust);ctx.restore();ctx.restore();ctx.restore()}
function rudeHand(x,y,size=1,facing=1){ctx.save();ctx.translate(x,y);ctx.scale(size*facing,size);
// A closed fist with only the middle finger extended, drawn as a paper puppet part.
poly([[-8,8],[-9,-2],[-6,-5],[-3,-3],[-3,-18],[-1,-21],[2,-20],[3,-3],[6,-4],[8,-2],[10,-1],[10,7],[6,12],[-4,12]],'#edbc90','#fff0db');
line([[-5,0],[-5,5]],'#b98461',1);line([[5,0],[5,5]],'#b98461',1);line([[8,1],[8,5]],'#b98461',1);ctx.restore()}
function scaredFace(power){ellipse(3,-29,24,23,'#eac19b');ellipse(-7,-33,11,14,'#fff8ed');ellipse(14,-35,11,14,'#fff8ed');ellipse(-3,-32,2,3,'#22252a');ellipse(18,-34,2,3,'#22252a');line([[-17,-49],[-5,-53]],'#66503d',2.5);line([[7,-54],[20,-51]],'#66503d',2.5);ellipse(7,-10,6+power*2,8+power*3,'#49332e');ellipse(8,-5,4,3,'#d88978');poly([[-25,-39],[-29,-27],[-22,-28]],'#b6f1f6')}
function trumpPose(o,bob){const dx=obstacleDx(o)+o.w/2,taunt=Math.abs(dx)<230,side=dx>0?-1:1;
paperLimb([[-10,-23],[-11,-5]],'#1d293c',11);paperLimb([[10,-23],[11,-5]],'#1d293c',11);paperLimb([[-17,-3],[-7,-3]],'#111925',5);paperLimb([[7,-3],[17,-3]],'#111925',5);
poly([[-20,-52],[19,-52],[24,-20],[-22,-20]],'#25374e','#f5eee2');poly([[-9,-51],[9,-51],[0,-24]],'#f2eddf');poly([[0,-49],[5,-44],[2,-18],[-3,-22],[-4,-44]],'#bc3536');
for(const d of [-1,1]){if(taunt&&d===side){paperLimb([[d*17,-45],[d*29,-38],[d*36,-62]],'#25374e',8);rudeHand(d*36,-68,.8,d)}else{paperLimb([[d*18,-45],[d*24,-24]],'#25374e',8);ellipse(d*24,-22,4,5,'#edbc90')}}
ctx.save();ctx.translate(0,bob);ctx.rotate(taunt?side*.08:0);cutout('trumpHead',-27,-94,54,51);ctx.restore()}
function boostFlame(x,y){if(B.factor<1.03)return;const intensity=(B.factor-1)/3,len=(65+intensity*140)*(1+Math.sin(sceneTime*47)*.1);ctx.save();ctx.translate(x,y);ctx.globalAlpha=Math.min(1,intensity*3);
ctx.save();ctx.scale(1,.32);const glow=ctx.createRadialGradient(-50,0,1,-50,0,len);glow.addColorStop(0,B.level===2?'#ca82ff65':'#73eaff65');glow.addColorStop(1,'#68dfff00');ctx.fillStyle=glow;ctx.fillRect(-50-len,-len,2*len,2*len);ctx.restore();
poly([[-43,-9],[-70,-15],[-len*.8,-6],[-len-45,0],[-len*.7,7],[-72,13],[-43,6]],B.level===2?'#ad77ff':'#59dfff');poly([[-46,-5],[-83,-7],[-len*.75-20,0],[-80,7],[-46,4]],'#fff1ab');poly([[-44,-3],[-105,0],[-44,3]],'#fffdf1');for(let i=0;i<5;i++){const progress=(sceneTime*(1.9+i*.08)+i*.19)%1;line([[-65-progress*len,i%2?12:-12],[-75-progress*len,i%2?12:-12]],'#adf3ff',1.5)}ctx.restore()}
function speedStreaks(){if(B.factor<1.05)return;ctx.save();ctx.globalAlpha=Math.min(.55,(B.factor-1)*.2);for(let i=0;i<18;i++){const y=H*.25+(i*83)%(H*.6),x=W-((sceneTime*(500+B.factor*160)+i*137)%(W+300));line([[x,y],[x+30+B.factor*18,y]],B.level===2?'#d3a2ef':'#a0e6ed',i%3?1:2)}ctx.restore()}
function paperProp(o){const w=o.w,h=o.h;
if(o.id==='pump'){
rect(-w/2+5,-h,w-14,h-6,'#f3ede0',4);rect(-w/2+8,-h+3,w-20,h-12,'#b64c3d',3);rect(-17,-h+10,28,23,'#24343d',2);text('V8',-3,-h+17+12,12,'#e1f2bd');rect(-18,-32,30,17,'#e9d9b9',2);text('OIL',-3,-20,10,'#713e31');paperLimb([[15,-h+18],[26,-h+10],[28,-22],[18,-19],[18,-40]],'#2a3035',5);rect(-25,-8,48,8,'#e6dbc8',2);
}else{
line([[0,-h+15],[7,-h-2]],'#f3eee3',3);ellipse(7,-h-2,4,4,'#d9ff62');rect(-30,-h+10,60,h-17,'#eee8db',12);rect(-26,-h+14,52,25,'#434e55',9);ellipse(-11,-h+25,8,9,'#fff8e7');ellipse(11,-h+25,8,9,'#fff8e7');ellipse(-8,-h+24,3,4,'#161b23');ellipse(13,-h+24,3,4,'#161b23');text('AI',0,-13,12,'#5d686c');wheel(-20,-6,8);wheel(20,-6,8);
}}
function obstacle(o){ctx.save();ctx.translate(px+obstacleDx(o)*scale,ground);ctx.scale(scale,scale);const bob=['trump','protest','doge'].includes(o.id)?Math.sin(Math.floor(sceneTime*7)+o.x*.01)*1.1:0;ctx.translate(o.w/2,0);ctx.rotate(bob*.008);(o.id==='rogozin'?rogozin(o):o.id==='zuck'?zuckerberg():['openai','claude','gemini'].includes(o.id)?logoPuppet(o):o.id==='trump'?trumpPose(o,bob):cutouts[o.id]?cutout(o.id,-o.w/2,-o.h+bob,o.w,o.h):paperProp(o));ctx.rotate(-bob*.008);text(o.name,0,18,8,'#a9b3aa');ctx.restore()}

// Separate silhouettes: the trampoline and narrow body never create a wide invisible wall.
function rogozinBounce(){return 3*Math.abs(Math.sin(sceneTime*4.5))}
function obstacleBoxes(o){
 if(o.id==='rogozin'){const b=rogozinBounce();return [{left:4,right:84,top:16},{left:25,right:63,top:188+b}]}
 const inset=o.inset??4;return [{left:inset,right:o.w-inset,top:o.h-8}];
}
function hitsObstacle(o,dx,y){return obstacleBoxes(o).some(b=>dx+b.left<29&&dx+b.right>-25&&(y<b.top||(o.id==='rogozin'&&b.top>100&&S.lastCharge<.98)))}
function waveArm(x,y,color,t,side){const hx=x+side*(22+7*Math.sin(t*7)),hy=y-24;paperLimb([[x,y],[x+side*16,y-8],[hx,hy]],color,10);ellipse(hx,hy-4,6,8,'#f5eee2');ellipse(hx,hy-4,4,6,'#edbc90');for(let i=0;i<3;i++)paperLimb([[hx-3+i*3,hy-8],[hx-4+i*4,hy-14]],'#edbc90',2)}
function zuckerberg(){
 paperLimb([[-11,-31],[-12,-5]],'#40566b',12);paperLimb([[11,-31],[12,-5]],'#40566b',12);
 poly([[-21,-65],[21,-65],[23,-29],[-22,-29]],'#7e8587','#f5eee2');
 paperLimb([[-20,-59],[-27,-34]],'#7e8587',9);paperLimb([[20,-59],[27,-34]],'#7e8587',9);
 cutout('zuckHead',-27,-108,54,57);
}
function rogozin(o){
 const b=rogozinBounce();paperLimb([[-35,-14],[-39,0]],'#65747a',4);paperLimb([[35,-14],[39,0]],'#65747a',4);
 ellipse(0,-17,44,7,'#f5eee2');ellipse(0,-17,40,4,'#566b6c');
 ctx.save();ctx.translate(0,-20-b);
 paperLimb([[-11,-48],[-18,-27],[-15,-3]],'#27364e',13);paperLimb([[11,-48],[18,-27],[15,-3]],'#27364e',13);
 poly([[-20,-115],[20,-115],[23,-48],[-22,-48]],'#34445a','#f5eee2');
 poly([[-6,-115],[6,-115],[0,-70]],'#d6d9d1');
 paperLimb([[-19,-105],[-29,-78],[-25,-60]],'#34445a',10);paperLimb([[19,-105],[29,-78],[25,-60]],'#34445a',10);
 cutout('rogozinHead',-23,-174,46,62);ctx.restore();
}
function logoPuppet(o){
 const w=o.w,h=o.h;ctx.save();ctx.translate(0,-h/2);
 if(o.id==='claude'){const points=[];for(let i=0;i<32;i++){const a=i*Math.PI/16,r=i%2?w*.25:w*.49;points.push([Math.cos(a)*r,Math.sin(a)*r*.86])}poly(points,'#cb8669','#f5eee2')}
 else if(o.id==='gemini'){poly([[0,-h/2],[9,-13],[w/2,0],[9,13],[0,h/2],[-9,13],[-w/2,0],[-9,-13]],'#82a7df','#f5eee2')}
 else {for(let i=0;i<6;i++){ctx.save();ctx.rotate(i*Math.PI/3);line([[0,-28],[19,-28],[29,-10],[20,7],[0,7],[-9,-10],[0,-28]],'#f5eee2',9);line([[0,-28],[19,-28],[29,-10],[20,7],[0,7],[-9,-10],[0,-28]],'#62a98e',5);ctx.restore()}}
 for(const x of [-10,10]){ellipse(x,-1,10,12,'#fff8ed');ellipse(x-3,0,3,4,'#172127')}ctx.restore();
}
const CAMEO={active:false,t:0,nextScore:5000,milestone:0};
function updateCameo(dt){
 if(CAMEO.active){CAMEO.t+=dt;if(CAMEO.t>=12)CAMEO.active=false}
 if(!CAMEO.active&&S.score>=CAMEO.nextScore){CAMEO.milestone=CAMEO.nextScore;CAMEO.nextScore+=5000;CAMEO.active=true;CAMEO.t=0}
}
function milestoneFireworks(){if(!CAMEO.active)return;const t=CAMEO.t;if(t<1.5||t>10)return;ctx.save();
 for(let n=0;n<5;n++){const age=(t-1.5-n*.38)%2.5;if(age<0||age>1.5)continue;const x=W*(.12+n*.18),y=H*(.20+(n%3)*.075),r=age*Math.min(85,W*.16);ctx.globalAlpha=(1-age/1.5)*.75;
 for(let i=0;i<14;i++){const a=i*Math.PI/7+n;const c=['#d9ff62','#f3b775','#9ed9ed'][n%3];line([[x+Math.cos(a)*r*.76,y+Math.sin(a)*r*.76+age*age*12],[x+Math.cos(a)*r,y+Math.sin(a)*r+age*age*12]],c,2)}}ctx.restore();
}

function cameoRider(head,x,y,color,katy=false){ctx.save();ctx.translate(x,y);
 paperLimb([[-9,-12],[-28,-2],[-30,25]],color,11);paperLimb([[9,-12],[28,-2],[30,25]],color,11);
 poly([[-17,-52],[17,-52],[18,-10],[-18,-10]],color,'#f5eee2');
 cutout(head,-25,-103,50,58);waveArm(katy?15:-15,-44,color,CAMEO.t,katy?1:-1);
 if(katy)paperLimb([[-15,-32],[-32,-18],[-56,-17]],color,8);
 else paperLimb([[14,-43],[23,-26],[13,-15]],color,8);ctx.restore();}
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

function comicBurst(x,y,r,label,alpha=1){ctx.save();ctx.translate(x,y);ctx.globalAlpha=alpha;const points=[];for(let i=0;i<24;i++){let a=i*Math.PI/12,rr=i%2?r*.65:r;points.push([Math.cos(a)*rr,Math.sin(a)*rr*.55])}poly(points,'#ffcf62','#e76d3b');text(label,0,5,Math.max(12,r*.24),'#3a2b27');ctx.restore()}
// Event starts are 20–40 seconds apart, including recovery after a failure.
const randomGap=()=>20+Math.random()*20;
const R={phase:'ready',t:0,next:randomGap(),eventStart:null,fail:false,crashLift:0,kind:'launch',events:0};
function rocketEvent(now){R.kind=R.phase==='orbit'?'landing':'launch';R.phase=R.kind;R.t=0;R.fail=Math.random()<.28;R.eventStart=now;R.next=now+randomGap();R.events++}
function rocketBoom(lift){R.crashLift=lift;R.phase='explosion';R.t=0;tone(55,.6,'sawtooth',.025)}
function updateRocket(dt){R.t+=dt;
if((R.phase==='ready'||R.phase==='orbit')&&sceneTime>=R.next)rocketEvent(sceneTime);
if(R.phase==='launch'){if(R.fail&&R.t>=2)rocketBoom(50);else if(R.t>=6){R.phase='orbit';R.t=0}}
else if(R.phase==='landing'){if(R.fail&&R.t>=5.2)rocketBoom(3);else if(R.t>=6){R.phase='ready';R.t=0}}
else if(R.phase==='explosion'&&R.t>=3.5){R.phase='delivery';R.t=0}
else if(R.phase==='delivery'&&R.t>=10){R.phase='ready';R.t=0}
}
const clamp01=v=>Math.max(0,Math.min(1,v)),ease=v=>{v=clamp01(v);return v*v*(3-2*v)};
function rocketBody(x,y,h,angle=0,alpha=1){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha=alpha*.84;cutout('rocket',-h*.15,-h,h*.3,h);ctx.restore()}
function exhaust(x,y,power=1){const f=(Math.sin(sceneTime*37)*.12+1)*power;
poly([[x-10,y-4],[x-21,y+18*f],[x-9,y+12*f],[x-3,y+60*f],[x+7,y+29*f],[x+17,y+35*f],[x+10,y-4]],'#ee6a3c','#ffcf74');poly([[x-5,y-3],[x-8,y+17*f],[x+1,y+40*f],[x+7,y+14*f],[x+5,y-3]],'#fff3b6');}
function launchSmoke(x,y,t,opacity=1){ctx.save();ctx.globalAlpha=opacity;for(let i=0;i<10;i++){const spread=10+i*7+Math.min(t,4)*13;ellipse(x+(i%2?1:-1)*spread,y-i%3*4,12+spread*.2,7+spread*.1,['#cfc7b28a','#e8dcc07a','#85918c80'][i%3])}ctx.restore()}
function crawler(x,y,loaded,h,raise=0,elevate=0){ctx.save();ctx.translate(x,y);
// Two continuous tracks and an elevating launch cradle.
rect(-77,-17,154,23,'#eee9dc',10);rect(-74,-14,148,17,'#283238',8);
for(let i=0;i<12;i++){const tx=-64+i*12;ellipse(tx,-5,5,5,'#727b77');line([[tx+Math.sin(sceneTime*10)*3,-12],[tx+Math.sin(sceneTime*10)*3+4,1]],'#afb5a4',1)}
rect(-79,-26,158,12,'#c4c8ad',3);rect(-77,-25,28,16,'#727f70',3);rect(-74,-23,14,8,'#b9d8d1',1);
for(let i=0;i<9;i++)poly([[-45+i*13,-25],[-39+i*13,-25],[-44+i*13,-15],[-50+i*13,-15]],'#a7893c');
const angle=-(1-ease(raise))*Math.PI/2,hingeX=22;
line([[hingeX,-28],[hingeX-45*(1-raise),-30-70*raise]],'#e4debd',4);
if(elevate>0)paperLimb([[hingeX,-28],[hingeX,-29-elevate]],'#717e75',5);if(loaded)rocketBody(hingeX,-29-elevate,h,angle,1);
text('SPACE DELIVERY',-4,-31,7,'#dae1c6');ctx.restore()}
function rocketScene(){const padH=Math.min(310,Math.max(195,H*.33)),padW=padH*2/3,rx=Math.min(W*.77,W-padW*.62-12),padBottom=ground-38,padTop=padBottom-padH*.96,base=padTop+padH*.735,h=padH*.62,t=R.t,phase=R.phase,travel=H+h;
if(launchpad.complete&&launchpad.naturalWidth){ctx.save();ctx.globalAlpha=.9;ctx.drawImage(launchpad,rx-padW*.38,padTop,padW,padH);ctx.restore()}
// Access road joins the sprite foundation and remains behind the playable road.
line([[rx-padW*.25,padBottom-2],[W,padBottom-2]],'#4c6161',3);
let lift=0,angle=0;
if(phase==='launch'){lift=Math.pow(Math.max(0,t-.65)/5.35,2)*travel;angle=R.fail?Math.sin(t*13)*.05:0}
if(phase==='landing'){lift=Math.pow(1-clamp01(t/6),2)*travel;angle=R.fail?Math.sin(t*8)*.09:Math.sin(t*3)*.018}
if(phase==='launch'||phase==='landing'){
const glow=ctx.createRadialGradient(rx,base-lift,4,rx,base-lift,150);glow.addColorStop(0,'#ffbe4d30');glow.addColorStop(1,'#ff9a2000');ctx.fillStyle=glow;ctx.fillRect(rx-160,base-lift-160,320,320);
exhaust(rx,base-lift,phase==='landing'?.45+lift/travel:Math.min(1.2,.4+t*.35));if(lift<120)launchSmoke(rx,base,t,1-lift/160);
rocketBody(rx+Math.sin(t*40)*.9,base-lift,h,angle);
if(phase==='launch'&&t>.5&&t<1.8)comicBurst(rx-55,base-h*.6,40,'FWOOSH!',Math.min(1,(1.8-t)*2));
}else if(phase==='ready') {rocketBody(rx,base,h);if(R.kind==='landing'&&t<2){launchSmoke(rx,base,1,1-t/2);text('STILL IN ONE PIECE.',rx,base-h-12,9,'#bdd59c')}}
else if(phase==='explosion'){
const fade=1-clamp01((t-1)/2.5),by=base-R.crashLift;
rocketBody(rx,by,h,.12*Math.sin(t*8),fade);
ctx.save();ctx.globalAlpha=fade;
for(let i=0;i<12;i++){const a=i*Math.PI*2/12,dist=(18+t*35)*(1+i%3*.2);ellipse(rx+Math.cos(a)*dist,by-h*.35+Math.sin(a)*dist*.65,18+t*4,16+t*3,i%3===0?'#ffdd7a':i%3===1?'#ed773d':'#6b6e67')}
for(let i=0;i<10;i++){const a=i*2.4;ctx.save();ctx.translate(rx+Math.cos(a)*t*44,by-h*.35-Math.sin(a)*t*40+t*t*16);ctx.rotate(t*(i%2?2:-3));rect(-3,-6,6,12,i%2?'#d4d7ce':'#edac54');ctx.restore()}
ctx.restore();if(t<2.5)comicBurst(rx-20,by-h*.48,Math.min(78,35+t*70),'KABOOM!',Math.min(1,(2.5-t)*2));launchSmoke(rx,base,t,fade);
}else if(phase==='delivery'){
let x,loaded=t<7,raise=t<3.5?0:ease((t-3.5)/2.5);
if(t<3.5)x=(W+220)+(rx-22-W-220)*ease(t/3.5);
else if(t<7)x=rx-22;
else x=rx-22+(W+220-rx+22)*ease((t-7)/3);
if(t>=6.5)rocketBody(rx,base,h);
const crawlerY=padBottom-5,elevate=Math.max(0,crawlerY-29-base)*ease((t-5.8)/.7);crawler(x,crawlerY,loaded&&t<6.5,h,raise,elevate);
}
}
function background(time){const grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,'#10151d');grad.addColorStop(.7,'#1b303b');grad.addColorStop(1,'#101c23');ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);for(let i=0;i<65;i++){let x=(i*157.13)%W,y=(i*i*31.7)%(ground*.78);ellipse(x,y,i%5===0?1.2:.65,i%5===0?1.2:.65,'#79929966')}const mx=W*.82,my=H*.26;ellipse(mx,my,44,44,'#aec7be12');ellipse(mx,my,29,29,'#c9d2b7');ellipse(mx-9,my-9,8,6,'#adbda5');ellipse(mx+10,my+7,5,8,'#b7c3ac');const shift=roadDistance*scale*.08;for(let i=-1;i<W/180+2;i++){let x=i*180-shift%180;poly([[x,ground-42],[x+45,ground-130],[x+125,ground-52],[x+180,ground-105],[x+230,ground]],'#1d333d')}rocketScene();rect(0,ground-38,W,38,'#172932');for(let i=0;i<8;i++){let x=(i*231-roadDistance*.15)%(W+250);rect(x,ground-52,110,14,'#253d46');rect(x+9,ground-46,14,3,'#c2dc8955')}line([[0,ground],[W,ground]],'#8daca1',2);rect(0,ground+2,W,H-ground,'#111d24');for(let i=-1;i<W/110+2;i++){let x=i*110-(roadDistance*scale)%110;line([[x,ground+42],[x+50,ground+42]],'#48605c',2)}for(let i=0;i<5;i++)line([[0,ground+74+i*30],[W,ground+74+i*30]],'#23323a',.5)}
function render(dt,time){background(time);milestoneFireworks();cameoScene();speedStreaks();let demo=S.mode==='menu';let x=px;let ds=scale;let hop=S.y;ellipse(x,ground+5,48*ds,Math.max(2,7-hop*.015)*ds,'#0007');for(const o of S.obs)obstacle(o);rogozinCue();ctx.save();ctx.translate(x,ground-hop*ds-12*ds);ctx.scale(ds,ds);let phase=S.y>0?Math.min(1,S.jumpTime/(2*S.launchSpeed/GRAVITY)):0;if(demo)phase=0;let gap=S.y>0?Math.sin(phase*Math.PI)*24:0;if(S.y>0){for(let k=0;k<3;k++)line([[-36-k*12,8+gap],[-70-k*20,15+gap]],'#b8f8ff55',2);if(phase<.2||phase>.82){poly([[-30,7],[-41,38+Math.random()*16],[-20,7]],'#d0fcff66');poly([[25,7],[30,30+Math.random()*12],[37,7]],'#d0fcff66')}}boostFlame(-2,gap-4);car(0,gap,phase*Math.PI*2);elon(0,-22-gap*.2,S.y>0,time);if(S.charging){rect(-28,17,56,4,'#45574f',2);rect(-28,17,56*S.charge,4,'#d9ff62',2)};ctx.restore();for(const p of S.particles){if(S.mode!=='paused'){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=300*dt}ctx.globalAlpha=Math.max(0,p.life);rect(p.x,p.y,3,3,p.c)}ctx.globalAlpha=1;S.particles=S.particles.filter(p=>p.life>0);if(demo){text('ELON / ROCKET RIDER',x,ground+31,8,'#b5c7bd');}}
function frame(ts){let dt=Math.min((ts-last)/1000||0,.025);last=ts;if(S.mode==='playing'||S.mode==='menu'){sceneTime+=dt;if(S.mode==='playing')updateRocket(dt);else roadDistance+=95*dt}update(dt);render(dt,sceneTime);requestAnimationFrame(frame)}ui();requestAnimationFrame(frame);
window.render_game_to_text=()=>JSON.stringify({mode:S.mode,score:S.score,best,y:S.y,speed:S.speed,playerX:px/scale,obstacles:S.obs.map(o=>({type:o.id,x:o.x,w:o.w,h:o.h})),flips:S.flips,charging:S.charging,charge:S.charge,kmh:S.kmh*B.factor,baseKmh:S.kmh,boost:{state:B.state,charge:B.charge,left:B.left,level:B.level,factor:B.factor},cameo:{active:CAMEO.active,t:CAMEO.t,milestone:CAMEO.milestone,nextScore:CAMEO.nextScore},rocket:{phase:R.phase,nextEventIn:Math.max(0,R.next-sceneTime),events:R.events}});
