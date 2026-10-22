import {createFactoryProduction,FACTORY_MODELS,FACTORY_COLORS,assemblyAction,FACTORY_DEPTH,robotIdlePose} from './factory-production.js?v=4.0.0';
const equipment=['rear-wall','machine-v362','assembly-conveyor-cutout','assembly-rack-cutout','assembly-robot-base','assembly-robot-upper','assembly-robot-fore','assembly-tool-grip','assembly-tool-paint'];
export const FACTORY_ASSETS=Object.freeze([...equipment,...FACTORY_MODELS.flatMap(model=>[
 ...(model==='cybertruck'?['steel']:FACTORY_COLORS).flatMap(color=>Array.from({length:5},(_,n)=>`${model}-${color}-${n}`)),
 ...['door','glass','wheel'].map(part=>`${model}-part-${part}`),
])]);
const wrap=(n,d)=>((n%d)+d)%d,clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n)),mix=(a,b,t)=>a+(b-a)*t;
// The same axle/belt line is used for all five frames; wheel-less shells hang on skids.
const bodyLift={'model-s':[12,12,12,12,0],'model-x':[12,12,12,12,0],roadster:[9,9,9,9,0],cybertruck:[13,13,13,13,0]};
function grade(image,saturation,brightness,offset=0){
 const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const x=c.getContext('2d');x.drawImage(image,0,0);
 const data=x.getImageData(0,0,c.width,c.height),p=data.data;
 for(let i=0;i<p.length;i+=4){const grey=p[i]*.2126+p[i+1]*.7152+p[i+2]*.0722;for(let k=0;k<3;k++)p[i+k]=offset+(grey+(p[i+k]-grey)*saturation)*brightness;}
 x.putImageData(data,0,0);return c;
}
export function createFactoryRenderer({random=Math.random}={}){
 const images=new Map(),production=createFactoryProduction(random),patterns=new WeakMap();let ready=false,grain;
 function part(ctx,id,x,y,width,angle=0){const img=images.get(id),h=width*img.height/img.width;ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.drawImage(img,-width/2,-h/2,width,h);ctx.restore();}
 function concreteGrain(){const tile=document.createElement('canvas');tile.width=128;tile.height=96;const x=tile.getContext('2d');for(let i=0;i<440;i++){const px=(i*73+19)%128,py=(i*47+Math.floor(i/128)*13)%96;x.fillStyle=i%3?'#152e3611':'#bcc5bd12';x.fillRect(px,py,i%7===0?2:1,1);}return tile;}

 function sprite(ctx,id,x,bottom,width){const img=images.get(id),h=width*img.height/img.width;ctx.drawImage(img,x-width/2,bottom-h,width,h);}
 function link(ctx,id,a,b,start,end,s){
  ctx.save();ctx.translate(...start);ctx.rotate(Math.atan2(end[1]-start[1],end[0]-start[0])-Math.atan2(b[1]-a[1],b[0]-a[0]));ctx.scale(s,s);ctx.drawImage(images.get(id),-a[0],-a[1]);ctx.restore();
 }
 function robot(ctx,x,base,z,target,tool='grip',angle=0){
  const s=.18*z,img=images.get('assembly-robot-base');ctx.drawImage(img,x-img.width*s/2,base-img.height*s,img.width*s,img.height*s);
  const shoulder=[x+40*s,base-214*s],l1=297*s,l2=279*s;
  let dx=target[0]-shoulder[0],dy=target[1]-shoulder[1],d=clamp(Math.hypot(dx,dy),Math.abs(l1-l2)+.01,l1+l2-.01);
  const direction=Math.atan2(dy,dx),a=direction-Math.acos(clamp((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1));
  const elbow=[shoulder[0]+Math.cos(a)*l1,shoulder[1]+Math.sin(a)*l1],wrist=[shoulder[0]+Math.cos(direction)*d,shoulder[1]+Math.sin(direction)*d];
  link(ctx,'assembly-robot-upper',[66,76],[363,87],shoulder,elbow,s);link(ctx,'assembly-robot-fore',[56,56],[335,55],elbow,wrist,s);
  const ts=.105*z,grip=images.get('assembly-tool-'+tool),pivot=tool==='paint'?[20,150]:[20,80];
  ctx.save();ctx.translate(...wrist);ctx.rotate(angle);ctx.drawImage(grip,-pivot[0]*ts,-pivot[1]*ts,grip.width*ts,grip.height*ts);ctx.restore();
  return [wrist[0]+Math.cos(angle)*37*z,wrist[1]+Math.sin(angle)*37*z];
 }
 return {
  async load(){await Promise.all(FACTORY_ASSETS.map(async id=>{
   const img=new Image();img.src=`assets/factory/${id}.png`;await img.decode();
   images.set(id,id==='rear-wall'?grade(img,.4,.30,32):id==='machine-v362'||id==='assembly-rack-cutout'?grade(img,.55,.47,18):grade(img,.62,.60,12));
  }));grain=concreteGrain();ready=true;},
  get ready(){return ready;},get production(){return production.state;},
  reset(){production.reset();},update(biome,time){production.update(biome,time);},
  draw(ctx,{W,H,ground,scale,screenDistance,worldDistance,activeTime,reducedMotion=false}){
   if(!ready)return;
   const z=clamp(scale,.68,1.05),distance=worldDistance??screenDistance/z;
   const state=production.state,t=reducedMotion?22:state?.elapsed||0;
   ctx.fillStyle='#293a43';ctx.fillRect(0,0,W,H);
   const wall=images.get('rear-wall'),wallBase=ground-222*z,wh=Math.max(300,wallBase),ww=wh*wall.width/wall.height;
   for(let x=-wrap(distance*FACTORY_DEPTH.wall*z,ww);x<W;x+=ww)ctx.drawImage(wall,x,wallBase-wh,ww+.5,wh);
   ctx.fillStyle='#35454b';ctx.fillRect(0,wallBase,W,H-wallBase);
   // Wall-side storage and CNC alternate on a slower parallax plane behind production.
   const bay=620*z,offset=wrap(distance*FACTORY_DEPTH.storage*z,bay*2);
   for(let x=-offset-bay;x<W+bay;x+=bay){
    const index=Math.round((x+offset)/bay);
    if(wrap(index,2)===0)sprite(ctx,'assembly-rack-cutout',x+bay*.5,ground-226*z,290*z);
    else sprite(ctx,'machine-v362',x+bay*.5,ground-226*z,180*z);
   }
   // A quieter, smaller production plane; its camera and repeated stations never reset at a new body.
   const q=z*FACTORY_DEPTH.lineScale,absolute=reducedMotion?22:(state?.cycle||0)*30+t;
   const carWorld=-120+48*absolute,carX=W*(.42+.05*Math.sin(absolute*Math.PI/60)),camera=carWorld-carX/q;
   const beltBottom=ground-138*z,beltTop=beltBottom-60*q;
   const beltWidth=480*q,beltOffset=wrap(camera*q,beltWidth);
   // Broad low-contrast contact/cast shadows tie the line to the hangar floor.
   const shadow=ctx.createLinearGradient(0,beltBottom-3*q,0,beltBottom+58*z);shadow.addColorStop(0,'#10272f55');shadow.addColorStop(.3,'#10272f2b');shadow.addColorStop(1,'#10272f00');ctx.fillStyle=shadow;ctx.fillRect(0,beltBottom-3*q,W,58*z+3*q);
   for(let x=-beltOffset;x<W+beltWidth;x+=120*q){ctx.fillStyle='#122b3216';ctx.beginPath();ctx.moveTo(x-9*q,beltBottom-3*q);ctx.lineTo(x+10*q,beltBottom-3*q);ctx.lineTo(x+39*z,beltBottom+42*z);ctx.lineTo(x+9*z,beltBottom+42*z);ctx.fill();}

   for(let x=-beltOffset-beltWidth;x<W+beltWidth;x+=beltWidth)sprite(ctx,'assembly-conveyor-cutout',x+beltWidth*.5,beltBottom,beltWidth+.5);
   ctx.strokeStyle='#5a686d';ctx.lineWidth=.7*q;
   for(let x=-wrap((camera+(reducedMotion?0:absolute*22))*q,18*q);x<W;x+=18*q){ctx.beginPath();ctx.moveTo(x,beltTop+9*q);ctx.lineTo(x+5*q,beltTop+9*q);ctx.stroke();}
   if(state){
    const stage=reducedMotion?4:state.stage,model=state.model,cw=(model==='cybertruck'?232:model==='roadster'?202:216)*q;
    const blend=reducedMotion||stage===0?1:clamp((t-stage*5)/.32),fade=blend*blend*(3-2*blend);
    const lift=stage===0?bodyLift[model][0]:mix(bodyLift[model][stage-1],bodyLift[model][stage],fade),carBottom=beltTop+3*q-lift*q;
    const alpha=reducedMotion?1:clamp(Math.min(t/1.4,(30-t)/1.4));
    if(stage<4){ctx.fillStyle='#606e73';for(const x of [-.30,.30])ctx.fillRect(carX+cw*x-4*q,carBottom-q,8*q,beltTop-carBottom+6*q);}
    ctx.save();ctx.globalAlpha*=alpha;
    // The body is behind every articulated arm, wrist, tool and carried part.
    if(blend<1){ctx.save();ctx.globalAlpha*=1-fade;sprite(ctx,`${model}-${state.color}-${stage-1}`,carX,carBottom,cw);ctx.restore();}
    ctx.save();ctx.globalAlpha*=fade;sprite(ctx,`${model}-${state.color}-${stage}`,carX,carBottom,cw);ctx.restore();ctx.restore();
    const first=Math.floor((camera-200)/240),last=Math.ceil((camera+W/q+200)/240);
    for(let index=first;index<=last;index++){
     const station=120+index*240,x=(station-camera)*q,i=index-(reducedMotion?0:state.cycle||0)*6;
     const action=!reducedMotion&&i>=0&&i<4?assemblyAction(t,i):{pickup:0,reach:0,carry:0};
     const idle=robotIdlePose(index,absolute,reducedMotion),step=wrap(index,6),partName=step===3||step===5?'wheel':step===2?'glass':'door';
     const partId=`${model}-part-${partName}`,partWidth=(partName==='wheel'?29:partName==='glass'?62:48)*q,paint=step===1&&model!=='cybertruck';
     // A small supply stack sits on the production plane, outside the travel aisle.
     const supply=[x+76*q,beltBottom-22*q];
     ctx.fillStyle='#192f3655';ctx.beginPath();ctx.ellipse(supply[0],beltBottom+q,35*q,5*q,0,0,Math.PI*2);ctx.fill();
     for(let n=0;n<3;n++)part(ctx,partId,supply[0]+(n-1)*3*q,supply[1]+(2-n)*4*q,partWidth*.83,(n-1)*.065);
     const height=i===3?5:i===2?(model==='roadster'?28:model==='cybertruck'?38:44):(model==='roadster'?18:28),contactX=t-i*5<=5?carX:x;
     const contact=[contactX+(i===3?cw*.33:i===2?cw*.03:0),carBottom-height*q],contactAngle=i===2?-.14:i===1?.15:0;
     const home=[x+idle.x*q,beltBottom+idle.y*q],fromIdle=action.pickup,fit=action.reach;
     const tipTarget=[home[0]*(1-fromIdle)+supply[0]*(fromIdle-fit)+contact[0]*fit,home[1]*(1-fromIdle)+supply[1]*(fromIdle-fit)+contact[1]*fit];
     const transit=clamp((t-i*5-2)/2.4),retreat=1-clamp((t-i*5-5)/1.25);
     if(action.pickup>0)tipTarget[1]-=Math.sin(transit*Math.PI)*28*q*retreat;
     const angle=idle.angle*(1-fromIdle)+contactAngle*fit,wrist=[tipTarget[0]-Math.cos(angle)*37*q,tipTarget[1]-Math.sin(angle)*37*q];
     const tip=robot(ctx,x+20*q,beltBottom-2*q,q,wrist,paint?'paint':'grip',angle);
     const carry=action.carry+(1-fromIdle)*idle.carry;
     if(carry>0){
      ctx.save();ctx.globalAlpha*=alpha*carry;
      if(paint){
       if(action.reach>.65){const color={red:'215,70,62',blue:'76,128,211',white:'216,223,220'}[state.color];const mist=ctx.createRadialGradient(...tip,0,...tip,17*q);mist.addColorStop(0,`rgba(${color},.22)`);mist.addColorStop(1,`rgba(${color},0)`);ctx.fillStyle=mist;ctx.fillRect(tip[0]-17*q,tip[1]-17*q,34*q,34*q);}
      }else part(ctx,partId,...tip,partWidth,angle*.45);
      ctx.restore();
     }
    }
   }
   // Open concrete travel aisle. One continuous yellow safety boundary, no traffic markings.
   const veil=ctx.createLinearGradient(0,ground-80*z,0,ground-16*z);veil.addColorStop(0,'#253b4400');veil.addColorStop(1,'#253b4477');ctx.fillStyle=veil;ctx.fillRect(0,ground-80*z,W,64*z);
   const floor=ctx.createLinearGradient(0,ground-18*z,0,H);floor.addColorStop(0,'#46565a');floor.addColorStop(1,'#59666a');ctx.fillStyle=floor;ctx.fillRect(0,ground-18*z,W,H-ground+18*z);
   ctx.fillStyle='#b6a259';ctx.fillRect(0,ground-18*z,W,3*z);ctx.fillStyle='#263d43';ctx.fillRect(0,ground-14*z,W,2*z);
   ctx.strokeStyle='#35494f';ctx.lineWidth=.8*z;const slab=360*z;
   for(let x=-wrap(screenDistance,slab);x<W+slab;x+=slab){ctx.beginPath();ctx.moveTo(x,ground-10*z);ctx.lineTo(x-42*z,H);ctx.stroke();}
   ctx.strokeStyle='#78818455';ctx.beginPath();ctx.moveTo(0,ground+(H-ground)*.62);ctx.lineTo(W,ground+(H-ground)*.62);ctx.stroke();
   // Fine, world-anchored concrete grain and gently different slab tones.
   let texture=patterns.get(ctx);if(!texture){texture=ctx.createPattern(grain,'repeat');patterns.set(ctx,texture);}
   const scroll=wrap(screenDistance,128);ctx.save();ctx.translate(-scroll,0);ctx.fillStyle=texture;ctx.fillRect(scroll,ground-10*z,W,H-ground+10*z);ctx.restore();
   const firstSlab=Math.floor(screenDistance/slab);
   for(let x=-wrap(screenDistance,slab),n=firstSlab;x<W;x+=slab,n++){
    ctx.fillStyle=['#a1aba904','#162e3605','#a1aba908','#162e3603'][wrap(n,4)];ctx.beginPath();ctx.moveTo(x,ground-10*z);ctx.lineTo(x+slab,ground-10*z);ctx.lineTo(x+slab-42*z,H);ctx.lineTo(x-42*z,H);ctx.fill();
    const y=ground+(H-ground)*(.37+wrap(n,3)*.14);ctx.fillStyle='#142f3609';ctx.beginPath();ctx.ellipse(x+slab*.54,y,26*z,4*z,-.06,0,Math.PI*2);ctx.fill();
   }

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
