const clamp01=v=>Math.max(0,Math.min(1,v));
const ease=v=>{v=clamp01(v);return v*v*(3-2*v)};
export const ROCKET_TIMING=Object.freeze({launch:14,landing:14,explosion:5,delivery:12});
// Shared by the painter and failure transition: no teleport at detonation.
export function rocketLift(phase,t) {
  if(phase==='launch')return Math.pow(clamp01((t-1.8)/(ROCKET_TIMING.launch-1.8)),2);
  if(phase==='landing')return Math.pow(1-clamp01(t/ROCKET_TIMING.landing),2);
  return 0;
}
// Tower leans away before ignition, then closes after a successful touchdown.
export function towerRetraction(phase,t,kind='launch'){
  if(phase==='launch')return ease(t/1.6);
  if(phase==='ready')return kind==='landing'?1-ease(t/2.4):0;
  if(phase==='delivery')return 1-ease((t-8.5)/3.5);
  return 1;
}
export function spaceportLayout({W=1440,H,ground}){
  const mobile=W<700||H<500;
  const zoom=Math.max(.58,Math.min(.9,H/950))*(mobile?1.65:1);
  return {zoom,base:ground-35*zoom,h:112*zoom};
}
export function createRocketState(){return {phase:'ready',t:0,next:10,fail:false,crashLift:0,kind:'launch',events:0,pass:0};}
// Pure fixed-step event director; failure leaves an empty pad until replacement arrives.
export function advanceRocket(R,dt,now,random=Math.random){
  R.t+=dt;
  if((R.phase==='ready'||R.phase==='orbit')&&now>=R.next){
    R.kind=R.phase==='orbit'?'landing':'launch';R.phase=R.kind;R.t=0;R.fail=random()<.28;R.events++;
  }
  const boom=lift=>{R.crashLift=lift;R.phase='explosion';R.t=0;};
  if(R.phase==='launch'){
    if(R.fail&&R.t>=5.5)boom(rocketLift('launch',R.t));
    else if(R.t>=ROCKET_TIMING.launch){R.phase='orbit';R.t=0;R.next=now+10+random()*5;}
  }else if(R.phase==='landing'){
    if(R.fail&&R.t>=13.2)boom(rocketLift('landing',R.t));
    else if(R.t>=ROCKET_TIMING.landing){R.phase='ready';R.t=0;R.next=now+14+random()*8;}
  }else if(R.phase==='explosion'&&R.t>=ROCKET_TIMING.explosion){R.phase='delivery';R.t=0;}
  else if(R.phase==='delivery'&&R.t>=ROCKET_TIMING.delivery){R.phase='ready';R.t=0;R.next=now+12+random()*8;}
}
export function createRocketSystem({ctx,sprites,tone,view,time}){
  const R=createRocketState();
  function update(dt){
    const before=R.phase;advanceRocket(R,dt,time());
    if(before!=='explosion'&&R.phase==='explosion')tone(55,.4,'sine',.006);
    // A single spaceport passes slowly. Even boost cannot whip the scenery away.
    const {speed=360}=view();R.pass=(R.pass+dt*.006*Math.min(1.7,Math.max(.7,speed/540)))%1;
  }
  function draw(state=R,anchor){
    const {W,H,ground}=view(),{zoom,base,h}=spaceportLayout({W,H,ground});
    const span=W+660*zoom;
    const rx=anchor??(W*.78-state.pass*span+330*zoom+span)%span-330*zoom;
    const t=state.t,phase=state.phase,travel=base+h;
    const sprite=(i,x,y,w,hh,ay=1,alpha=1)=>sprites.draw(ctx,i,x,y,w,hh,ay,alpha);
    const body=(x,y,angle=0,alpha=1)=>{ctx.save();ctx.translate(x,y);ctx.rotate(angle);sprite(0,0,0,h*120/301,h,1,alpha);ctx.restore();};
    const smoke=(x,y,age,alpha=1,size=1)=>{const frame=Math.min(3,Math.floor(age*.8));sprite(8+frame,x,y,156*zoom*size,89*zoom*size,1,alpha*.55);};
    const flame=(x,y,power=1)=>{const frame=Math.floor(time()*8)%4;sprite(4+frame,x,y,26*zoom*power,69*zoom*power,0,.68);};
    const glow=(x,y,r,alpha)=>{ctx.save();ctx.globalAlpha*=alpha;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'#cb9c63');g.addColorStop(1,'#cb9c6300');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);ctx.restore();};
    ctx.save();ctx.globalAlpha*=.64;
    // Pad, rocket, hangar and effects share the same color grade and depth plane.
    sprite(2,rx-106*zoom,base+8*zoom,103*zoom,65*zoom,1,.65);
    // Fixed pad and moving tower share one ground plane with the rocket.
    sprite(17,rx+21*zoom,base+8*zoom,137*zoom,15*zoom);
    ctx.save();ctx.translate(rx+48*zoom,base-6*zoom);
    ctx.rotate(towerRetraction(phase,t,state.kind)*.21);
    sprite(16,-27*zoom,0,137*zoom,121*zoom);
    ctx.restore();
    const lift=rocketLift(phase,t)*travel;
    if(phase==='launch'||phase==='landing'){
      // Persistent segmented smoke trail uses the same smoke frames, with a hard cap.
      if(phase==='launch'&&lift>12){
        for(let i=0;i<7;i++){
          const u=(i+1)/8,py=base-lift+lift*u;
          smoke(rx,py,1+u*3,(1-u)*.35*Math.min(1,t/3),.25+u*.65);
        }
      }
      glow(rx,base-lift,55*zoom,.09);
      if(lift<100*zoom)smoke(rx,base+4*zoom,t,1-lift/(120*zoom));
      flame(rx,base-lift,phase==='landing'?.55:Math.min(1,.35+t*.13));
      body(rx,base-lift,state.fail?Math.sin(t*3)*.035:0);
    }else if(phase==='ready'){
      body(rx,base);
      if(state.kind==='landing'&&t<5)smoke(rx,base+4*zoom,t,1-t/5,1.2);
    }else if(phase==='orbit'){
      // The last smoke wisps dissipate after the ship leaves the sky.
      if(t<5)smoke(rx,base+4*zoom,3,Math.max(0,1-t/5),1.1);
    }else if(phase==='explosion'){
      const y=base-state.crashLift*travel-h*.25;
      if(t<.18)body(rx,y+h*.25,0,1-t/.18);
      const frame=Math.min(3,Math.floor(t/.8)),fade=1-clamp01((t-2.5)/2.5);
      sprite(12+frame,rx,y,150*zoom,150*zoom,.5,fade*.85);
      if(t<.7)glow(rx,y,85*zoom,.12*(1-t/.7));
      smoke(rx,base+4*zoom,t,fade,1.1);
    }else if(phase==='delivery'){
      const arrival=ease(t/5),departure=ease((t-9)/3);
      const x=rx+210*zoom*(1-arrival)+210*zoom*departure;
      sprite(3,x,base+17*zoom,92*zoom,27*zoom);
      if(t<8.5)body(x,base,-(1-ease((t-5)/3.5))*Math.PI/2);
      else body(rx,base);
    }
    ctx.restore();
  }
  return {state:R,update,draw,schedule(){Object.assign(R,createRocketState(),{next:time()+9+Math.random()*5});}};
}
