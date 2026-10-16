const clamp01=v=>Math.max(0,Math.min(1,v));
const ease=v=>{v=clamp01(v);return v*v*(3-2*v)};
export function createRocketSystem({ctx,cutout,launchpad,tone,poly,rect,ellipse,line,text,paperLimb,view,time}) {
function comicBurst(x,y,r,label,alpha=1){ctx.save();ctx.translate(x,y);ctx.globalAlpha=alpha;const points=[];for(let i=0;i<24;i++){let a=i*Math.PI/12,rr=i%2?r*.65:r;points.push([Math.cos(a)*rr,Math.sin(a)*rr*.55])}poly(points,'#ffcf62','#e76d3b');text(label,0,5,Math.max(12,r*.24),'#3a2b27');ctx.restore()}
// Event starts are 20–40 seconds apart, including recovery after a failure.
const randomGap=()=>20+Math.random()*20;
const R={phase:'ready',t:0,next:randomGap(),eventStart:null,fail:false,crashLift:0,kind:'launch',events:0};
function rocketEvent(now){R.kind=R.phase==='orbit'?'landing':'launch';R.phase=R.kind;R.t=0;R.fail=Math.random()<.28;R.eventStart=now;R.next=now+randomGap();R.events++}
function rocketBoom(lift){R.crashLift=lift;R.phase='explosion';R.t=0;tone(55,.6,'sawtooth',.025)}
function updateRocket(dt){R.t+=dt;
if((R.phase==='ready'||R.phase==='orbit')&&time()>=R.next)rocketEvent(time());
if(R.phase==='launch'){if(R.fail&&R.t>=2)rocketBoom(50);else if(R.t>=6){R.phase='orbit';R.t=0}}
else if(R.phase==='landing'){if(R.fail&&R.t>=5.2)rocketBoom(3);else if(R.t>=6){R.phase='ready';R.t=0}}
else if(R.phase==='explosion'&&R.t>=3.5){R.phase='delivery';R.t=0}
else if(R.phase==='delivery'&&R.t>=10){R.phase='ready';R.t=0}
}

function rocketBody(x,y,h,angle=0,alpha=1){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha=alpha*.84;cutout('rocket',-h*.15,-h,h*.3,h);ctx.restore()}
function exhaust(x,y,power=1){const f=(Math.sin(time()*37)*.12+1)*power;
poly([[x-10,y-4],[x-21,y+18*f],[x-9,y+12*f],[x-3,y+60*f],[x+7,y+29*f],[x+17,y+35*f],[x+10,y-4]],'#ee6a3c','#ffcf74');poly([[x-5,y-3],[x-8,y+17*f],[x+1,y+40*f],[x+7,y+14*f],[x+5,y-3]],'#fff3b6');}
function launchSmoke(x,y,t,opacity=1){ctx.save();ctx.globalAlpha=opacity;for(let i=0;i<10;i++){const spread=10+i*7+Math.min(t,4)*13;ellipse(x+(i%2?1:-1)*spread,y-i%3*4,12+spread*.2,7+spread*.1,['#cfc7b28a','#e8dcc07a','#85918c80'][i%3])}ctx.restore()}
function crawler(x,y,loaded,h,raise=0,elevate=0){ctx.save();ctx.translate(x,y);
// Two continuous tracks and an elevating launch cradle.
rect(-77,-17,154,23,'#eee9dc',10);rect(-74,-14,148,17,'#283238',8);
for(let i=0;i<12;i++){const tx=-64+i*12;ellipse(tx,-5,5,5,'#727b77');line([[tx+Math.sin(time()*10)*3,-12],[tx+Math.sin(time()*10)*3+4,1]],'#afb5a4',1)}
rect(-79,-26,158,12,'#c4c8ad',3);rect(-77,-25,28,16,'#727f70',3);rect(-74,-23,14,8,'#b9d8d1',1);
for(let i=0;i<9;i++)poly([[-45+i*13,-25],[-39+i*13,-25],[-44+i*13,-15],[-50+i*13,-15]],'#a7893c');
const angle=-(1-ease(raise))*Math.PI/2,hingeX=22;
line([[hingeX,-28],[hingeX-45*(1-raise),-30-70*raise]],'#e4debd',4);
if(elevate>0)paperLimb([[hingeX,-28],[hingeX,-29-elevate]],'#717e75',5);if(loaded)rocketBody(hingeX,-29-elevate,h,angle,1);
text('SPACE DELIVERY',-4,-31,7,'#dae1c6');ctx.restore()}
function rocketScene(){const {W,H,ground}=view();const padH=Math.min(310,Math.max(195,H*.33)),padW=padH*2/3,rx=Math.min(W*.77,W-padW*.62-12),padBottom=ground-38,padTop=padBottom-padH*.96,base=padTop+padH*.735,h=padH*.62,t=R.t,phase=R.phase,travel=H+h;
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

return {state:R,update:updateRocket,draw:rocketScene,schedule:()=>{R.next=time()+randomGap();}};
}
