// Existing photo-referenced paper assets; unchanged PNGs and credits in assets/factory/.
export const FACTORY_ASSETS=Object.freeze(['rear-wall','conveyor','body-shell','forklift','robot-base','robot-upper','robot-fore','robot-grip','worker-0','worker-1','worker-2']);
const wrap=(n,d)=>((n%d)+d)%d;
const pivot={shoulder:[156.753,48.426],upper:[[44.835,52.394],[273.622,58.441]],fore:[[36.762,36.286],[241.048,36.286]],grip:[1.286,37.357]};
export function createFactoryRenderer(){
 const images=new Map();let ready=false;
 function sprite(ctx,id,x,y,width,anchor=.5){
  const img=images.get(id),height=width*img.height/img.width;
  ctx.drawImage(img,x-width*anchor,y-height,width,height);
 }
 function arm(ctx,id,start,end,x,y,angle,s){
  const dx=end[0]-start[0],dy=end[1]-start[1],length=Math.hypot(dx,dy)*s;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle-Math.atan2(dy,dx));ctx.scale(s,s);
  ctx.drawImage(images.get(id),-start[0],-start[1]);ctx.restore();
  return [x+Math.cos(angle)*length,y+Math.sin(angle)*length];
 }
 function robot(ctx,x,base,z,t,mirror){
  ctx.save();ctx.translate(x,base);ctx.scale(mirror,1);
  const s=.62*z,img=images.get('robot-base');
  ctx.drawImage(img,-img.width*s/2,-img.height*s,img.width*s,img.height*s);
  const shoulder=[(pivot.shoulder[0]-img.width/2)*s,(pivot.shoulder[1]-img.height)*s];
  const a=-1.12+Math.sin(t*.7)*.18,b=.63+Math.sin(t*.7+.8)*.18;
  const elbow=arm(ctx,'robot-upper',...pivot.upper,...shoulder,a,s);
  const wrist=arm(ctx,'robot-fore',...pivot.fore,...elbow,b,s);
  ctx.save();ctx.translate(...wrist);ctx.rotate(-.1);ctx.scale(s,s);
  ctx.drawImage(images.get('robot-grip'),-pivot.grip[0],-pivot.grip[1]);ctx.restore();ctx.restore();
 }
 return {
  async load(){await Promise.all(FACTORY_ASSETS.map(async id=>{const img=new Image();img.src=`assets/factory/${id}.png`;await img.decode();images.set(id,img);}));ready=true;},
  get ready(){return ready;},
  draw(ctx,{W,H,ground,scale,screenDistance,activeTime,reducedMotion=false}){
   if(!ready)return;
   const z=Math.max(.72,Math.min(1.15,scale)),t=reducedMotion?0:activeTime;
   // Fully opaque scene allows a bounded crossfade with no flashing sky/holes.
   ctx.fillStyle='#abb5b4';ctx.fillRect(0,0,W,H);
   const wall=images.get('rear-wall'),wallBase=ground-105*z,wh=Math.max(300,wallBase),ww=wh*wall.width/wall.height;
   const wallOffset=wrap(screenDistance*.035,ww);
   for(let x=-wallOffset;x<W;x+=ww)ctx.drawImage(wall,x,wallBase-wh,ww+.5,wh);
   ctx.fillStyle='#7f8988';ctx.fillRect(0,wallBase,W,Math.max(0,H-wallBase));
   const span=1120*z,offset=wrap(screenDistance*.09,span),base=ground-64*z;
   for(let x=-offset-span;x<W+span;x+=span){
    // Machinery shares the assembly floor; each joint is anchored to its neighbour.
    robot(ctx,x+240*z,base,z,t,1);robot(ctx,x+760*z,base,z,t+3,-1);
    sprite(ctx,'conveyor',x+530*z,base+4*z,940*z);
    for(let n=0;n<2;n++){
     const travel=wrap(t*25+n*400,810),fade=Math.min(1,travel/28,(810-travel)/28);
     ctx.save();ctx.globalAlpha*=Math.max(0,fade);sprite(ctx,'body-shell',x+(120+travel)*z,base-108*z,155*z);ctx.restore();
    }
    for(let n=0;n<3;n++)sprite(ctx,'worker-'+n,x+(90+n*410)*z,base+17*z,42*z);
   }
   // Logistics lane behind gameplay. Wheels remain on one fixed floor baseline.
   const fw=180*z,fx=wrap(t*37-screenDistance*.12,W+fw*2)-fw;
   sprite(ctx,'forklift',fx,ground-24*z,fw);
   ctx.fillStyle='#929a98';ctx.fillRect(0,ground-12*z,W,Math.max(0,H-ground+12*z));
   ctx.fillStyle='#d3b648';ctx.fillRect(0,ground-10*z,W,3*z);
   // Continuous concrete ground uses the same integrated pixel travel as spaceport.
   ctx.fillStyle='#596560';ctx.fillRect(0,ground,W,2);
   ctx.fillStyle='#b7bfba';ctx.fillRect(0,ground+2,W,Math.max(0,H-ground));
   const roadOffset=wrap(screenDistance,440);
   ctx.strokeStyle='#89948e';ctx.lineWidth=1;
   for(let x=-roadOffset;x<W;x+=440){ctx.beginPath();ctx.moveTo(x,ground+3);ctx.lineTo(x-35,H);ctx.stroke();}
   ctx.fillStyle='#e0c250';
   const stripeY=ground+Math.min(34,(H-ground)*.35);
   for(let x=-wrap(screenDistance,160);x<W;x+=160)ctx.fillRect(x,stripeY,82,3);
  },
 };
}
