// Existing photo-referenced paper sprites plus the two new industrial background props.
export const FACTORY_ASSETS=Object.freeze(['rear-wall','conveyor','body-shell','forklift','robot-base','robot-upper','robot-fore','robot-grip','rack-v362','machine-v362']);
export const FACTORY_SECTION_WIDTH=1320;
export const FACTORY_SECTIONS=Object.freeze(['assembly','machining','storage','service']);
export const factorySection=index=>FACTORY_SECTIONS[((index%FACTORY_SECTIONS.length)+FACTORY_SECTIONS.length)%FACTORY_SECTIONS.length];
const wrap=(n,d)=>((n%d)+d)%d;
const pivot={shoulder:[156.753,48.426],upper:[[44.835,52.394],[273.622,58.441]],fore:[[36.762,36.286],[241.048,36.286]],grip:[1.286,37.357]};
const contact={'rack-v362':321/341,'machine-v362':331/341};
// Bake once: low-contrast background values, with alpha untouched. No frame filters.
function grade(image){
 const c=document.createElement('canvas');c.width=image.width;c.height=image.height;
 const x=c.getContext('2d');x.drawImage(image,0,0);const data=x.getImageData(0,0,c.width,c.height),p=data.data;
 for(let i=0;i<p.length;i+=4){const grey=p[i]*.2126+p[i+1]*.7152+p[i+2]*.0722;for(let k=0;k<3;k++)p[i+k]=32+(grey+(p[i+k]-grey)*.4)*.30;}
 x.putImageData(data,0,0);return c;
}
export function createFactoryRenderer(){
 const images=new Map();let ready=false;
 function sprite(ctx,id,x,y,width){
  const img=images.get(id),height=width*img.height/img.width;
  ctx.drawImage(img,x-width/2,y-height*(contact[id]||1),width,height);
 }
 function arm(ctx,id,start,end,x,y,angle,s){
  const dx=end[0]-start[0],dy=end[1]-start[1],length=Math.hypot(dx,dy)*s;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle-Math.atan2(dy,dx));ctx.scale(s,s);
  ctx.drawImage(images.get(id),-start[0],-start[1]);ctx.restore();
  return [x+Math.cos(angle)*length,y+Math.sin(angle)*length];
 }
 function robot(ctx,x,base,z,t,mirror){
  ctx.save();ctx.translate(x,base);ctx.scale(mirror,1);
  const s=.24*z,img=images.get('robot-base');
  ctx.drawImage(img,-img.width*s/2,-img.height*s,img.width*s,img.height*s);
  const shoulder=[(pivot.shoulder[0]-img.width/2)*s,(pivot.shoulder[1]-img.height)*s];
  const a=-1.32+Math.sin(t*.55)*.13,b=.28+Math.sin(t*.55+.8)*.16;
  const elbow=arm(ctx,'robot-upper',...pivot.upper,...shoulder,a,s);
  const wrist=arm(ctx,'robot-fore',...pivot.fore,...elbow,b,s);
  ctx.save();ctx.translate(...wrist);ctx.rotate(-.1);ctx.scale(s,s);
  ctx.drawImage(images.get('robot-grip'),-pivot.grip[0],-pivot.grip[1]);ctx.restore();ctx.restore();
 }
 return {
  async load(){await Promise.all(FACTORY_ASSETS.map(async id=>{const img=new Image();img.src=`assets/factory/${id}.png`;await img.decode();images.set(id,grade(img));}));ready=true;},
  get ready(){return ready;},
  draw(ctx,{W,H,ground,scale,screenDistance,worldDistance,activeTime,reducedMotion=false}){
   if(!ready)return;
   const z=Math.max(.72,Math.min(1.15,scale)),t=reducedMotion?0:activeTime,distance=worldDistance??screenDistance/z;
   ctx.fillStyle='#2b3b43';ctx.fillRect(0,0,W,H);
   const wall=images.get('rear-wall'),wallBase=ground-105*z,wh=Math.max(300,wallBase),ww=wh*wall.width/wall.height;
   const wallOffset=wrap(distance*.035*z,ww);
   for(let x=-wallOffset;x<W;x+=ww)ctx.drawImage(wall,x,wallBase-wh,ww+.5,wh);
   ctx.fillStyle='#34464d';ctx.fillRect(0,wallBase,W,Math.max(0,H-wallBase));
   const bay=FACTORY_SECTION_WIDTH,travel=distance*.14,first=Math.floor(travel/bay)-1,last=Math.ceil((travel+W/z)/bay)+1;
   for(let i=first;i<=last;i++){
    const x=(i*bay-travel)*z,type=factorySection(i),base=ground-100*z;
    if(x>W||x+bay*z<0)continue;
    ctx.save();ctx.beginPath();ctx.rect(x+34*z,0,(bay-68)*z,Math.max(0,ground-46*z));ctx.clip();
    if(type==='assembly'){
     sprite(ctx,'conveyor',x+650*z,base,760*z);
     robot(ctx,x+430*z,base-6*z,z,t,1);robot(ctx,x+900*z,base-6*z,z,t+3,-1);
     for(let n=0;n<2;n++){
      const part=wrap(t*18+n*330,650),alpha=Math.min(1,part/32,(650-part)/32);
      ctx.save();ctx.globalAlpha*=Math.max(0,alpha);sprite(ctx,'body-shell',x+(330+part)*z,base-78*z,150*z);ctx.restore();
     }
    }else if(type==='machining'){
     sprite(ctx,'machine-v362',x+390*z,base-32*z,245*z);sprite(ctx,'machine-v362',x+870*z,base-32*z,210*z);
    }else if(type==='storage'){
     // Far logistics only; no viewport-wide conveyor-belt wrap that keeps a truck visible.
     const phase=wrap(t+i*7,44);
     if(phase<18){const local=-120+(bay+240)*phase/18;sprite(ctx,'forklift',x+local*z,base-35*z,90*z);}
     sprite(ctx,'rack-v362',x+370*z,base-43*z,350*z);sprite(ctx,'rack-v362',x+940*z,base-43*z,300*z);
    }else{
     // A service aisle gives the production line breathing room between dense bays.
     sprite(ctx,'machine-v362',x+1060*z,base-48*z,130*z);
    }
    ctx.restore();
   }
   // Quiet, dark plane behind gameplay silhouettes; no machinery at the road edge.
   const veil=ctx.createLinearGradient(0,ground-155*z,0,ground);veil.addColorStop(0,'#1c303a00');veil.addColorStop(1,'#1c303acc');ctx.fillStyle=veil;ctx.fillRect(0,ground-155*z,W,155*z);
   ctx.fillStyle='#2d424a';ctx.fillRect(0,ground-10*z,W,Math.max(0,H-ground+10*z));
   ctx.fillStyle='#8b8958';ctx.fillRect(0,ground-9*z,W,2*z);
   ctx.fillStyle='#59706f';ctx.fillRect(0,ground,W,1.5);
   const road=ctx.createLinearGradient(0,ground,0,H);road.addColorStop(0,'#2d424b');road.addColorStop(1,'#354b52');ctx.fillStyle=road;ctx.fillRect(0,ground+2,W,Math.max(0,H-ground));
   const roadOffset=wrap(screenDistance,440);ctx.strokeStyle='#506165';ctx.lineWidth=.7;
   for(let x=-roadOffset;x<W;x+=440){ctx.beginPath();ctx.moveTo(x,ground+3);ctx.lineTo(x-35,H);ctx.stroke();}
   ctx.fillStyle='#92915a';const stripeY=ground+Math.min(34,(H-ground)*.35);
   for(let x=-wrap(screenDistance,160);x<W;x+=160)ctx.fillRect(x,stripeY,70,2);
  },
  drawEntrance(ctx,{W,H,ground,scale},edge,toFactory){
   if(!ready)return;const z=Math.max(.72,Math.min(1.15,scale)),width=46*z;
   if(edge < -width||edge>W+width)return;
   ctx.save();ctx.beginPath();ctx.rect(0,0,W,Math.min(H,ground));ctx.clip();
   // Existing wall's steel column material forms the physical doorway at the seam.
   for(let y=0;y<ground;y+=256*z)ctx.drawImage(images.get('rear-wall'),170,180,42,256,edge-width/2,y,width,256*z);
   ctx.fillStyle='#182b34';ctx.fillRect(edge-width/2,0,4*z,Math.min(H,ground));ctx.fillRect(edge+width/2-4*z,0,4*z,Math.min(H,ground));
   const roofY=Math.max(16,ground*.07);ctx.fillStyle='#243841';ctx.fillRect(toFactory?edge:0,roofY,toFactory?Math.max(0,W-edge):Math.max(0,edge),10*z);
   ctx.fillStyle='#858452';for(let y=ground-60*z;y<ground-8*z;y+=14*z){ctx.beginPath();ctx.moveTo(edge-15*z,y);ctx.lineTo(edge+15*z,y-9*z);ctx.lineTo(edge+15*z,y-4*z);ctx.lineTo(edge-15*z,y+5*z);ctx.fill();}
   ctx.restore();
  },
 };
}
