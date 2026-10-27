import {resourceUrl} from './content-runtime.js?v=4.13.1';
// Nine video-derived poses, normalized to 256 x 160 with one centre anchor.
// The final key closes the loop on the original upright frame.
const keys = [0, .10, .25, .35, .43, .53, .67, .78, .92, 1];
export function flipFrameAt(jumpPhase) {
  const phase = Math.max(0, Math.min(1, (jumpPhase - .08) / .84));
  for (let i = 0; i < keys.length - 1; i++) {
    if (phase < (keys[i] + keys[i + 1]) / 2) return i;
  }
  return 0;
}
/** Ordinary jumps retain the independent nine-frame kickflip; grabs share one hull. */
export function jumpCarPose(flight,gravity,{railJump=false}={}){
 // Rail simulation marks its linked flight as a trick for bookkeeping. Only
 // actual rider rotation/grab overrides the ordinary photographed kickflip.
 const ordinary=!flight.trickStarted||(railJump&&!flight.omega&&!flight.grab);
 const cosmetic=!!flight.airborne&&flight.launchVelocity>0&&ordinary&&!flight.latched;
 const phase=cosmetic?Math.min(1,flight.time/(2*flight.launchVelocity/gravity)):0;
 return {cosmetic,phase,frame:flipFrameAt(phase),gap:cosmetic?Math.sin(phase*Math.PI)*24:0};
}
// Measured on upright frame 0. Both tyre contact patches share this baseline.
export const ROADSTER_BASELINE = 112.5;
export const ROADSTER_WIDTH = 108;
export const ROADSTER_WHEELS = Object.freeze([
  Object.freeze({x:52.5,y:93.5,r:19,rim:13.5}),
  Object.freeze({x:192.5,y:94.5,r:18,rim:13}),
]);
export function createRoadsterMotion() {
  return {compression:0,velocity:0,wheelAngle:0,airborne:false};
}
// Cosmetic spring only: jump height, collision bounds and charge stay unchanged.
export function advanceRoadsterMotion(m,dt,{grounded,speed,charge=0,impactSpeed=0}) {
  if(grounded && m.airborne)m.velocity+=Math.min(60,impactSpeed*.075);
  if(!grounded && !m.airborne)m.velocity-=16;
  m.airborne=!grounded;
  const target=grounded?1.8*charge:0;
  m.velocity+=((target-m.compression)*260-m.velocity*19)*dt;
  m.compression+=m.velocity*dt;
  m.wheelAngle=(m.wheelAngle+speed*dt/(19*ROADSTER_WIDTH/256))%(Math.PI*2);
}
export function createFlipSprite() {
  const image = new Image();
  let body;
  const wheels=[];
  function bakeRollingLayers() {
    body=document.createElement('canvas');body.width=256;body.height=160;
    const g=body.getContext('2d');g.drawImage(image,0,0,256,160,0,0,256,160);
    for(const wheel of ROADSTER_WHEELS){
      // Reuse the photographed tyres and actual Roadster rims, without invented spokes.
      const tyre=document.createElement('canvas');tyre.width=tyre.height=wheel.r*2+2;
      const t=tyre.getContext('2d'),centre=tyre.width/2;
      t.beginPath();t.arc(centre,centre,wheel.r,0,Math.PI*2);t.clip();
      t.drawImage(image,centre-wheel.x,centre-wheel.y);
      const rim=document.createElement('canvas');rim.width=rim.height=wheel.rim*2+2;
      const r=rim.getContext('2d'),rc=rim.width/2;
      r.beginPath();r.arc(rc,rc,wheel.rim,0,Math.PI*2);r.clip();
      // Exposure is baked once so the dark spokes remain legible at game size.
      r.filter='brightness(2)';r.drawImage(image,rc-wheel.x,rc-wheel.y);
      wheels.push({tyre,rim});
      g.globalCompositeOperation='destination-out';
      g.beginPath();g.arc(wheel.x,wheel.y,wheel.r+1,0,Math.PI*2);g.fill();
    }
  }
  return {
    load() {
      return new Promise((resolve, reject) => {
        image.onload = ()=>{bakeRollingLayers();resolve();}; image.onerror = reject;
        image.src = resourceUrl(new URL('../assets/roadster-flip/atlas.png', import.meta.url).href);
      });
    },
    drawFrame(ctx, frame, x, y, width = 108) {
      const height = width * 160 / 256;
      ctx.drawImage(image, (frame % 3) * 256, Math.floor(frame / 3) * 160,
        256, 160, x - width / 2, y - 6 - height / 2, width, height);
    },
    draw(ctx, x, y, phase, motion={compression:0,wheelAngle:0}, width=ROADSTER_WIDTH) {
      if(!body)return;
      const frame=flipFrameAt(phase),k=width/256;
      // Preserve the nine photographed airborne poses; use the same baseline at
      // the upright ends so takeoff and landing cannot snap to another anchor.
      if(frame!==0){
        const height=160*k;
        this.drawFrame(ctx,frame,x,y-ROADSTER_BASELINE*k+6+height/2,width);
        return;
      }
      ctx.save();ctx.translate(x-width/2,y-ROADSTER_BASELINE*k);ctx.scale(k,k);
      ROADSTER_WHEELS.forEach((wheel,i)=>{
        const {tyre,rim}=wheels[i];
        ctx.drawImage(tyre,wheel.x-tyre.width/2,wheel.y-tyre.height/2);
        ctx.save();ctx.translate(wheel.x,wheel.y);ctx.rotate(motion.wheelAngle);
        ctx.drawImage(rim,-rim.width/2,-rim.height/2);ctx.restore();
      });
      ctx.drawImage(body,0,motion.compression/k);
      ctx.restore();
    }
  };
}
