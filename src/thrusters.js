import {flipFrameAt,ROADSTER_BASELINE,ROADSTER_WIDTH} from './roadster-flip.js?v=4.11.4';
// Source-pixel nozzle anchors measured on each of the nine photographed poses.
// The car rolls about its long axis: exhaust points up while the car is inverted.
const POSES=[
  {y:105,angle:0}, {y:116,angle:.35*Math.PI},
  {y:99,angle:.5*Math.PI}, {y:53,angle:.8*Math.PI},
  {y:47,angle:Math.PI}, {y:49,angle:1.2*Math.PI},
  {y:85,angle:1.5*Math.PI}, {y:111,angle:1.7*Math.PI},
  {y:111,angle:1.92*Math.PI},
];
export function thrusterPose(phase){
  const frame=flipFrameAt(phase),pose=POSES[frame],k=ROADSTER_WIDTH/256;
  return {frame,angle:pose.angle,ports:[78,174].map(x=>({x:(x-128)*k,y:(pose.y-ROADSTER_BASELINE)*k}))};
}
export function createThrusterEffects({reducedMotion}={}){
  const media=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
  const dust=[];let landingAge=Infinity;
  return {
    reset(){dust.length=0;landingAge=Infinity},
    update(dt,{impactSpeed=0,speed=0,impactX=0}={}){
      landingAge+=dt;
      for(const cloud of dust){cloud.age+=dt;cloud.x-=speed*dt;}
      while(dust.length&&dust[0].age>=.72)dust.shift();
      if(impactSpeed>0){landingAge=0;dust.push({age:0,x:impactX});if(dust.length>3)dust.shift();}
    },
    get activeClouds(){return dust.length},
    get landingAge(){return landingAge},
    drawFlightJets(ctx,{active=false,assisting=false,time=0,gap=0}={}){
      if(!active&&!assisting)return;
      const quiet=reducedMotion?reducedMotion():media?.matches;
      const length=active?(quiet?42:48+Math.sin(time*53)*5):10;
      ctx.save();ctx.globalAlpha=active?.92:.5;
      for(const x of [-23,23]){
        ctx.beginPath();ctx.moveTo(x-3,gap-3);ctx.quadraticCurveTo(x-7,gap+length*.45,x,gap+length);ctx.quadraticCurveTo(x+7,gap+length*.45,x+3,gap-3);ctx.fillStyle='#73ddeb';ctx.fill();
        ctx.beginPath();ctx.moveTo(x-1.5,gap-3);ctx.lineTo(x,gap+length*.75);ctx.lineTo(x+1.5,gap-3);ctx.fillStyle='#f2fff8';ctx.fill();
      }
      ctx.restore();
    },
    drawJets(ctx,{phase,time,airborne,compression=0,groundDistance=Infinity}){
      if(!airborne&&landingAge>.16)return;
      const pose=thrusterPose(phase),quiet=reducedMotion?reducedMotion():media?.matches;
      const power=airborne?.9:Math.max(0,1-landingAge/.16)*.55;
      const length=(quiet?24:42+Math.sin(time*53)*5)*power;
      ctx.save();
      // Touchdown exhaust ends at the road rather than shining through it.
      if(!airborne||Number.isFinite(groundDistance)){ctx.beginPath();ctx.rect(-100,-200,200,200+(airborne?Math.max(0,groundDistance):0));ctx.clip();}
      for(const port of pose.ports){
        ctx.save();ctx.translate(port.x,port.y+(pose.frame===0?compression:0));ctx.rotate(-pose.angle);
        ctx.globalAlpha=.85;
        ctx.beginPath();ctx.moveTo(-3,0);ctx.quadraticCurveTo(-6,length*.45,0,length);ctx.quadraticCurveTo(6,length*.45,3,0);ctx.fillStyle='#73ddeb';ctx.fill();
        ctx.beginPath();ctx.moveTo(-1.6,0);ctx.lineTo(0,length*.78);ctx.lineTo(1.6,0);ctx.fillStyle='#f2fff8';ctx.fill();
        ctx.restore();
      }ctx.restore();
    },
    drawDust(ctx){
      for(const cloud of dust){
        const progress=cloud.age/.72,spread=progress*22;
        ctx.save();ctx.globalAlpha=(1-progress)*.32;
        for(let i=0;i<5;i++){
          const x=cloud.x+(i-2)*(7+spread*.45),y=-2-(i%2)*2-progress*3;
          ctx.beginPath();ctx.ellipse(x,y,8+spread*.25,3+progress*3,0,0,Math.PI*2);ctx.fillStyle='#a7bbb6';ctx.fill();
        }ctx.restore();
      }
    }
  };
}
