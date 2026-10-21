import {createFactoryProduction,FACTORY_MODELS,FACTORY_COLORS} from './factory-production.js?v=3.9.0';
const equipment=['rear-wall','machine-v362','assembly-conveyor-cutout','assembly-rack-cutout','assembly-robot-base','assembly-robot-upper','assembly-robot-fore','assembly-tool-grip','assembly-tool-paint'];
export const FACTORY_ASSETS=Object.freeze([...equipment,...FACTORY_MODELS.flatMap(model=>[
 ...(model==='cybertruck'?['steel']:FACTORY_COLORS).flatMap(color=>Array.from({length:5},(_,n)=>`${model}-${color}-${n}`)),
 ...['door','glass','wheel'].map(part=>`${model}-part-${part}`),
])]);
const wrap=(n,d)=>((n%d)+d)%d,clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n)),mix=(a,b,t)=>a+(b-a)*t;
const names={'model-s':'MODEL S','model-x':'MODEL X',roadster:'ROADSTER',cybertruck:'CYBERTRUCK'};
// The same axle/belt line is used for all five frames; wheel-less shells hang on skids.
const bodyLift={'model-s':[12,12,12,12,0],'model-x':[12,12,12,12,0],roadster:[9,9,9,9,0],cybertruck:[13,13,13,13,0]};
function grade(image,saturation,brightness,offset=0){
 const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const x=c.getContext('2d');x.drawImage(image,0,0);
 const data=x.getImageData(0,0,c.width,c.height),p=data.data;
 for(let i=0;i<p.length;i+=4){const grey=p[i]*.2126+p[i+1]*.7152+p[i+2]*.0722;for(let k=0;k<3;k++)p[i+k]=offset+(grey+(p[i+k]-grey)*saturation)*brightness;}
 x.putImageData(data,0,0);return c;
}
export function createFactoryRenderer({random=Math.random}={}){
 const images=new Map(),production=createFactoryProduction(random);let ready=false;
 function sprite(ctx,id,x,bottom,width){const img=images.get(id),h=width*img.height/img.width;ctx.drawImage(img,x-width/2,bottom-h,width,h);}
 function link(ctx,id,a,b,start,end,s){
  ctx.save();ctx.translate(...start);ctx.rotate(Math.atan2(end[1]-start[1],end[0]-start[0])-Math.atan2(b[1]-a[1],b[0]-a[0]));ctx.scale(s,s);ctx.drawImage(images.get(id),-a[0],-a[1]);ctx.restore();
 }
 function robot(ctx,x,base,z,target,tool='grip'){
  const s=.18*z,img=images.get('assembly-robot-base');ctx.drawImage(img,x-img.width*s/2,base-img.height*s,img.width*s,img.height*s);
  const shoulder=[x+40*s,base-214*s],l1=297*s,l2=279*s;
  let dx=target[0]-shoulder[0],dy=target[1]-shoulder[1],d=clamp(Math.hypot(dx,dy),Math.abs(l1-l2)+.01,l1+l2-.01);
  const direction=Math.atan2(dy,dx),a=direction+Math.acos(clamp((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1));
  const elbow=[shoulder[0]+Math.cos(a)*l1,shoulder[1]+Math.sin(a)*l1],wrist=[shoulder[0]+Math.cos(direction)*d,shoulder[1]+Math.sin(direction)*d];
  link(ctx,'assembly-robot-upper',[66,76],[363,87],shoulder,elbow,s);link(ctx,'assembly-robot-fore',[56,56],[335,55],elbow,wrist,s);
  const ts=.105*z,grip=images.get('assembly-tool-'+tool),pivot=tool==='paint'?[20,150]:[20,80];
  ctx.drawImage(grip,wrist[0]-pivot[0]*ts,wrist[1]-pivot[1]*ts,grip.width*ts,grip.height*ts);
  return [wrist[0]+37*z,wrist[1]];
 }
 return {
  async load(){await Promise.all(FACTORY_ASSETS.map(async id=>{
   const img=new Image();img.src=`assets/factory/${id}.png`;await img.decode();
   images.set(id,id==='rear-wall'?grade(img,.4,.30,32):id==='machine-v362'||id==='assembly-rack-cutout'?grade(img,.55,.47,18):grade(img,.80,.78,7));
  }));ready=true;},
  get ready(){return ready;},get production(){return production.state;},
  reset(){production.reset();},update(biome,time){production.update(biome,time);},
  draw(ctx,{W,H,ground,scale,screenDistance,worldDistance,activeTime,reducedMotion=false}){
   if(!ready)return;
   const z=clamp(scale,.68,1.05),distance=worldDistance??screenDistance/z;
   const state=production.state,t=reducedMotion?22:state?.elapsed||0;
   ctx.fillStyle='#293a43';ctx.fillRect(0,0,W,H);
   const wall=images.get('rear-wall'),wallBase=ground-185*z,wh=Math.max(300,wallBase),ww=wh*wall.width/wall.height;
   for(let x=-wrap(distance*.025*z,ww);x<W;x+=ww)ctx.drawImage(wall,x,wallBase-wh,ww+.5,wh);
   ctx.fillStyle='#35454b';ctx.fillRect(0,wallBase,W,H-wallBase);
   // Wall-side storage and CNC alternate on a slower parallax plane behind production.
   const bay=620*z,offset=wrap(distance*.055*z,bay*2);
   for(let x=-offset-bay;x<W+bay;x+=bay){
    const index=Math.round((x+offset)/bay);
    if(wrap(index,2)===0)sprite(ctx,'assembly-rack-cutout',x+bay*.5,ground-186*z,365*z);
    else sprite(ctx,'machine-v362',x+bay*.5,ground-186*z,220*z);
   }
   // The production camera follows each body slowly, so a whole assembly is legible on phones.
   const p=t/30,carWorld=-120+1440*p,carX=W*(.32+.32*p),camera=carWorld-carX/z;
   const beltBottom=ground-91*z,beltTop=beltBottom-60*z;
   const beltWidth=480*z,beltOffset=wrap(camera*z,beltWidth);
   for(let x=-beltOffset-beltWidth;x<W+beltWidth;x+=beltWidth)sprite(ctx,'assembly-conveyor-cutout',x+beltWidth*.5,beltBottom,beltWidth+.5);
   // Small moving rollers preserve belt motion without moving its structural legs.
   ctx.strokeStyle='#69767a';ctx.lineWidth=1*z;
   for(let x=-wrap((camera+(reducedMotion?0:t*22))*z,18*z);x<W;x+=18*z){ctx.beginPath();ctx.moveTo(x,beltTop+9*z);ctx.lineTo(x+5*z,beltTop+9*z);ctx.stroke();}
   if(state){
    const stage=reducedMotion?4:state.stage,model=state.model,cw=(model==='cybertruck'?232:model==='roadster'?202:216)*z;
    const carBottom=beltTop+3*z-bodyLift[model][stage]*z;
    // Floor-mounted bases and elbow joints stay behind the car, with tool contact in front.
    const stations=[120,360,600,840],current=Math.min(3,state.stage),phase=clamp((t%5-2.2)/2.8),eased=phase*phase*(3-2*phase);
    let tip=null;
    for(let i=0;i<stations.length;i++){
     const x=(stations[i]-camera)*z;if(x < -150*z||x>W+150*z)continue;
     const active=i===current&&state.stage<4&&!reducedMotion;
     const height=i===3?5:i===2?(model==='roadster'?28:model==='cybertruck'?38:44):(model==='roadster'?18:28);
     const destination=[carX+(i===3?cw*.33:i===2?cw*.03:0),carBottom-height*z];
     const wrist=active?[mix(x-45*z,destination[0]-37*z,eased),mix(beltTop-75*z,destination[1],eased)]:[x-40*z,beltTop-65*z];
     const end=robot(ctx,x+20*z,beltBottom-2*z,z,wrist,i===1&&model!=='cybertruck'?'paint':'grip');
     if(active)tip=end;
    }
    // Skids support the shell up to wheel installation.
    if(stage<4){ctx.fillStyle='#707d80';for(const x of [-.30,.30])ctx.fillRect(carX+cw*x-5*z,carBottom-1*z,10*z,beltTop-carBottom+6*z);}
    const alpha=reducedMotion?1:Math.min(1,t/1.4,(30-t)/1.4);ctx.save();ctx.globalAlpha*=clamp(alpha);
    sprite(ctx,`${model}-${state.color}-${stage}`,carX,carBottom,cw);
    if(tip&&phase>0&&phase<1){
     if(current===1&&model!=='cybertruck'){
      // Soft paint spray is confined to the panel being worked on.
      const color={red:'215,70,62',blue:'76,128,211',white:'216,223,220'}[state.color];
      const mist=ctx.createRadialGradient(...tip,0,...tip,21*z);mist.addColorStop(0,`rgba(${color},.35)`);mist.addColorStop(1,`rgba(${color},0)`);ctx.fillStyle=mist;ctx.fillRect(tip[0]-21*z,tip[1]-21*z,42*z,42*z);
     }else{
      const part=current===3?'wheel':current===2?'glass':'door',width=(part==='wheel'?29:part==='glass'?62:48)*z;
      const img=images.get(`${model}-part-${part}`);
      sprite(ctx,`${model}-part-${part}`,tip[0],tip[1]+width*img.height/img.width/2,width);
     }
    }
    ctx.restore();
    // A modest physical sign identifies the model without competing with the HUD.
    ctx.fillStyle='#1c2b32';ctx.fillRect(16*z,wallBase-34*z,158*z,24*z);ctx.fillStyle='#aab9b9';ctx.font=`${10*z}px system-ui`;ctx.fillText('TESLA  /  '+names[model],25*z,wallBase-18*z);
   }
   // Open concrete travel aisle. One continuous yellow safety boundary, no traffic markings.
   const veil=ctx.createLinearGradient(0,ground-80*z,0,ground-16*z);veil.addColorStop(0,'#253b4400');veil.addColorStop(1,'#253b4477');ctx.fillStyle=veil;ctx.fillRect(0,ground-80*z,W,64*z);
   const floor=ctx.createLinearGradient(0,ground-18*z,0,H);floor.addColorStop(0,'#46565a');floor.addColorStop(1,'#59666a');ctx.fillStyle=floor;ctx.fillRect(0,ground-18*z,W,H-ground+18*z);
   ctx.fillStyle='#b6a259';ctx.fillRect(0,ground-18*z,W,3*z);ctx.fillStyle='#263d43';ctx.fillRect(0,ground-14*z,W,2*z);
   ctx.strokeStyle='#35494f';ctx.lineWidth=.8*z;const slab=360*z;
   for(let x=-wrap(screenDistance,slab);x<W+slab;x+=slab){ctx.beginPath();ctx.moveTo(x,ground-10*z);ctx.lineTo(x-42*z,H);ctx.stroke();}
   ctx.strokeStyle='#78818455';ctx.beginPath();ctx.moveTo(0,ground+(H-ground)*.62);ctx.lineTo(W,ground+(H-ground)*.62);ctx.stroke();
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
