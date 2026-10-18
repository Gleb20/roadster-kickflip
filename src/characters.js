import {joeReaction} from './encounter.js?v=2.4.0';
/** Paper characters: one silhouette per figure, reusable render buffers and cached face bases. */
// A compact raised forearm; the middle finger always stays upright in screen space.
export function raisedArm(shoulder,upper,lower,side){
  const angle=Math.atan2(-.55,side*Math.sqrt(1-.55**2));
  const reach=(upper+lower)*.72,bend=Math.acos((upper*upper+reach*reach-lower*lower)/(2*upper*reach));
  const elbow={x:shoulder.x+upper*Math.cos(angle+side*bend),y:shoulder.y+upper*Math.sin(angle+side*bend)};
  const wrist={x:shoulder.x+reach*Math.cos(angle),y:shoulder.y+reach*Math.sin(angle)};
  return {elbow,wrist};
}
export function uprightWristAngle(parentAngle,side,strength){
  const limit=Math.PI/12;
  return Math.max(-limit,Math.min(limit,side*Math.PI/18*strength))-parentAngle;
}
export function pupilOffset(target,eye,rx,ry){
  const dx=target.x-eye.x,dy=target.y-eye.y,distance=Math.hypot(dx,dy)||1;
  return {x:dx/distance*rx,y:dy/distance*ry};
}
// A two-bone reach to the Roadster edge, in the crouched torso's local frame.
export function boardGrabArm(side,drop,torsoAngle){
  const shoulder={x:side*22,y:-82},world={x:side*43-4,y:10-drop};
  const c=Math.cos(torsoAngle),s=Math.sin(torsoAngle);
  let wrist={x:c*world.x+s*world.y,y:-s*world.x+c*world.y};
  const dx=wrist.x-shoulder.x,dy=wrist.y-shoulder.y,d=Math.min(71.9,Math.hypot(dx,dy)),a=Math.atan2(dy,dx),bend=Math.acos(d/72);
  const distance=Math.hypot(dx,dy);if(distance>d)wrist={x:shoulder.x+dx*d/distance,y:shoulder.y+dy*d/distance};
  const elbow={x:shoulder.x+36*Math.cos(a-side*bend),y:shoulder.y+36*Math.sin(a-side*bend)};
  return {shoulder,elbow,wrist};
}
export function createCharacterRenderer({ctx, cutout, getState, gestureTarget, joeTarget, obstacleDx, joeSprite, castSprites}) {
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INK='#282b2d', PAPER='#f4eedf', SKIN='#edbf96';
  const companyX=new Path2D('M18.244 2.25h3.308l-7.227 8.26L22.828 21.75h-6.657l-5.214-6.817L4.992 21.75H1.682l7.73-8.835L1.254 2.25H8.08l4.713 6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117Z');
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const mix=(a,b,t)=>a+(b-a)*t;
  const ease=t=>{t=clamp(t);return t*t*(3-2*t)};
  const heads=new Map(), poses=new Map();
  const R=1.5, OUTLINE=1.65;
  function canvas(w,h){const c=document.createElement('canvas');c.width=Math.ceil(w);c.height=Math.ceil(h);return c}
  function surface(w,h,ox,oy){
    const color=canvas(w*R,h*R),white=canvas(w*R,h*R),result=canvas(w*R,h*R);
    return {w,h,ox,oy,color,white,result,c:color.getContext('2d'),m:white.getContext('2d'),r:result.getContext('2d')};
  }
  const heroSurface=surface(170,214,85,178),humanSurface=surface(102,102,51,98),amberSurface=surface(102,112,51,108);
  function line(c,points,color,width=1){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=color;c.lineWidth=width;c.lineJoin='round';c.lineCap='round';c.stroke()}
  function poly(c,p,color,stroke=INK,width=1){c.beginPath();p.forEach((v,i)=>i?c.lineTo(...v):c.moveTo(...v));c.closePath();c.fillStyle=color;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.lineJoin='round';c.stroke()}}
  function oval(c,x,y,rx,ry,color,stroke){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=color;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=.8;c.stroke()}}
  function limb(c,p,color,width){line(c,p,INK,width+1.3);line(c,p,color,width)}
  function drawSurface(s,draw){
    const {c,m,r,w,h,ox,oy}=s;
    c.setTransform(R,0,0,R,0,0);c.clearRect(0,0,w,h);c.save();c.translate(ox,oy);draw(c);c.restore();
    m.setTransform(1,0,0,1,0,0);m.clearRect(0,0,s.white.width,s.white.height);m.drawImage(s.color,0,0);
    m.globalCompositeOperation='source-in';m.fillStyle=PAPER;m.fillRect(0,0,s.white.width,s.white.height);m.globalCompositeOperation='source-over';
    r.setTransform(1,0,0,1,0,0);r.clearRect(0,0,s.result.width,s.result.height);
    for(let i=0;i<8;i++){const a=i*Math.PI/4;r.drawImage(s.white,Math.cos(a)*OUTLINE*R,Math.sin(a)*OUTLINE*R)}
    r.drawImage(s.color,0,0);return s.result;
  }
  function drawFigure(s,draw,key){
    let image=key&&poses.get(key);
    if(!image){image=drawSurface(s,draw);if(key){const copy=canvas(image.width,image.height);copy.getContext('2d').drawImage(image,0,0);poses.set(key,copy);image=copy;
      // Bounded FIFO: includes every taunt and throw frame, without unbounded sessions.
      if(poses.size>96)poses.delete(poses.keys().next().value);
    }}
    ctx.drawImage(image,0,0,image.width,image.height,-s.ox,-s.oy,s.w,s.h);
  }
  function cleanHead(key){
    if(heads.has(key))return heads.get(key);
    const image=canvas(160,180),c=image.getContext('2d',{willReadFrequently:true});
    if(!cutout(key,0,0,160,180,c))return null;
    // Strip only the pale paper connected to transparency. Eyes/teeth remain enclosed.
    const pixels=c.getImageData(0,0,160,180),d=pixels.data,n=160*180,seen=new Uint8Array(n),queue=new Int32Array(n);let end=0,start=0;
    function eligible(i){const k=i*4;return d[k+3]<28||(Math.min(d[k],d[k+1],d[k+2])>195&&Math.max(d[k],d[k+1],d[k+2])-Math.min(d[k],d[k+1],d[k+2])<38)}
    function push(i){if(!seen[i]&&eligible(i)){seen[i]=1;queue[end++]=i}}
    for(let x=0;x<160;x++){push(x);push(179*160+x)}for(let y=0;y<180;y++){push(y*160);push(y*160+159)}
    while(start<end){const i=queue[start++],x=i%160,y=(i/160)|0;d[i*4+3]=0;if(x)push(i-1);if(x<159)push(i+1);if(y)push(i-160);if(y<179)push(i+160)}
    // Keep the largest connected silhouette, removing stray atlas paper specks.
    seen.fill(0);let largest=[];
    for(let seed=0;seed<n;seed++){if(seen[seed]||d[seed*4+3]<28)continue;start=0;end=1;queue[0]=seed;seen[seed]=1;
      while(start<end){const i=queue[start++],x=i%160,y=(i/160)|0;for(const j of [x?i-1:-1,x<159?i+1:-1,y?i-160:-1,y<179?i+160:-1])if(j>=0&&!seen[j]&&d[j*4+3]>=28){seen[j]=1;queue[end++]=j}}
      if(end>largest.length)largest=Array.from(queue.subarray(0,end));
    }
    seen.fill(0);for(const i of largest)seen[i]=1;let left=160,top=180,right=0,bottom=0;
    for(let i=0;i<n;i++){if(!seen[i]){d[i*4+3]=0;continue}const x=i%160,y=(i/160)|0;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)}
    c.putImageData(pixels,0,0);const head={image,left,top,w:right-left+1,h:bottom-top+1};heads.set(key,head);return head;
  }
  function head(c,key,x,y,w,h){const a=cleanHead(key);if(a&&a.w>0)c.drawImage(a.image,a.left,a.top,a.w,a.h,x,y,w,h);else oval(c,x+w/2,y+h/2,w*.48,h*.48,SKIN,INK)}
  const faceBases=new Map();
  function faceBase(c,key){
    if(!faceBases.has(key)){
      if(!cleanHead(key))return;
      const image=canvas(key==='head'?136:96,key==='head'?156:86),b=image.getContext('2d');
      if(key==='head'){
        b.scale(2,2);b.translate(33,74);head(b,key,-33,-74,68,78);
        // Opaque replacement: original eyes, brows and smile never show through.
        b.beginPath();b.moveTo(-19,-52);b.bezierCurveTo(-12,-62,16,-64,25,-54);
        b.bezierCurveTo(30,-43,33,-16,25,-7);b.bezierCurveTo(12,5,-10,1,-20,-12);
        b.bezierCurveTo(-24,-24,-24,-42,-19,-52);b.closePath();b.fillStyle='#f3c99a';b.fill();
      }else{
        b.scale(2,2);b.translate(24,94);head(b,key,-24,-94,48,43);
        b.beginPath();b.moveTo(-16,-78);b.bezierCurveTo(-11,-81,5,-79,9,-75);
        b.bezierCurveTo(15,-68,11,-56,3,-54);b.bezierCurveTo(-9,-52,-20,-60,-18,-69);
        b.closePath();b.fillStyle='#efba83';b.fill();
      }
      faceBases.set(key,image);
    }
    const hero=key==='head';c.drawImage(faceBases.get(key),hero?-33:-24,hero?-74:-94,hero?68:48,hero?78:43);
  }
  function eyes(c,centres,target,rx,ry){
    for(const [x,y] of centres){
      oval(c,x,y,rx,ry,'#fff9ed',INK);
      const pupil=pupilOffset(target,{x,y},rx*.48,ry*.46);
      oval(c,x+pupil.x,y+pupil.y,rx*.23,ry*.27,INK);
    }
  }
  function heroHead(c,boosted,target,angry,reaction){
    if(reaction.laugh){faceBase(c,'head');laugh(c,3,-30,1.05);return;}
    if(reaction.meme>.05||reaction.inhale>.15){
      faceBase(c,'head');
      // Sideways glance, pursed lips and the raised brow from the podcast meme.
      for(const x of [-8,13]){
        oval(c,x,-34,8,4.2,'#fff9ed',INK);oval(c,x-2,-34,2,2.6,INK);
        line(c,[[x-8,-43],[x,-46-(x>0?3:0)],[x+8,-42]],'#66503d',2);
        line(c,[[x-7,-26],[x,-24],[x+6,-26]],'#b48660',1);
      }
      line(c,[[1,-30],[-1,-22],[5,-21]],'#b48660',1);
      if(reaction.meme>.05){
        line(c,[[-9,-10],[-3,-14],[7,-14],[16,-9]],INK,1.8);
        line(c,[[-3,-8],[6,-7],[12,-9]],'#b48660',1.2);
      }else oval(c,14,-11,3,2.5,'#624337',INK);
      return;
    }
    if(boosted&&!target){
      faceBase(c,'head');
      // Impossibru: arched brows, tightly squinting eyes and a compressed grimace.
      for(const x of [-8,14]){
        line(c,[[x-8,-46],[x-2,-51],[x+6,-47]],INK,2.3);
        line(c,[[x-8,-34],[x,-37],[x+7,-34]],INK,1.8);
        line(c,[[x-7,-30],[x,-28],[x+6,-30]],'#8b644b',1);
        line(c,[[x-7,-41],[x-2,-43],[x+4,-41]],'#b48660',.8);
      }
      line(c,[[2,-34],[-2,-24],[5,-23],[9,-26]],'#8b644b',1.2);
      poly(c,[[-12,-13],[-5,-18],[8,-18],[20,-12],[17,-7],[-7,-7]],'#624337',INK,1);
      poly(c,[[-8,-13],[-3,-15],[9,-15],[16,-12],[15,-10],[-6,-10]],'#f7efdc','#f7efdc',.5);
      for(const side of [-1,1]){
        line(c,[[side*18,-24],[side*23,-19],[side*23,-9]],'#9b7254',1);
        line(c,[[side*14,-4],[side*8,-2]],'#9b7254',1);
      }
      return;
    }
    if(!boosted&&!target){head(c,'head',-33,-74,68,78);return;}
    faceBase(c,'head');
    eyes(c,[[-7,-33],[13,-34]],target||{x:65,y:-25},9,11);
    line(c,[[-16,-49+angry*4],[-1,-50+angry*11]],'#66503d',2.5);
    line(c,[[5,-50+angry*11],[22,-49+angry*3]],'#66503d',2.5);
    line(c,[[3,-29],[1,-23],[5,-22]],'#b48660',1);
    if(angry>.1){
      line(c,[[-7,-10],[1,-13],[12,-12],[18,-8]],INK,1.5);
    }else{
      oval(c,7,-11,6.5,8,'#49332e');oval(c,8,-7,3,2,'#d88978');
    }
  }
  function donnyHead(c,target,angry){
    if(!target||angry<=.01){head(c,'trumpHead',-24,-94,48,43);return;}
    faceBase(c,'trumpHead');
    eyes(c,[[-10,-71],[2,-70]],target,5.3,5.8);
    line(c,[[-16,-80],[-5,-75]],'#967040',2);
    line(c,[[0,-75],[9,-78]],'#967040',2);
    line(c,[[-5,-68],[-7,-63],[-3,-63]],'#b48660',.8);
    line(c,[[-11,-57],[-6,-60],[0,-59],[4,-56]],INK,1.1);
  }
  function localPoint(c,point,s){
    return c.getTransform().inverse().transformPoint({x:(point.x+s.ox)*R,y:(point.y+s.oy)*R});
  }
  function unrotate(point,angle){
    return {x:point.x*Math.cos(angle)+point.y*Math.sin(angle),y:point.y*Math.cos(angle)-point.x*Math.sin(angle)};
  }
  function sneaker(c,x,y,side,size=1,color='#e9e5da'){
    c.save();c.translate(x,y);c.scale(side*size,size);
    // The ankle ends inside the padded collar, above a closed sole.
    poly(c,[[-7,-10],[4,-10],[6,-5],[14,-3],[16,1],[15,4],[-9,4],[-10,0]],color,INK,1);
    poly(c,[[-9,0],[15,0],[15,4],[-9,4]],'#aeb8ad',INK,.7);
    line(c,[[-3,-8],[4,-6],[0,-5],[6,-3]],'#fbf7eb',1.3);
    line(c,[[-5,-3],[1,-1],[9,-3]],'#414d50',1.4);c.restore();
  }
  function hand(c,x,y,side,taunt=0,wave=0,size=1,angle=0){
    c.save();c.translate(x,y);c.rotate(angle);c.scale(side*size,size);
    // A single palm; fingers deform with the same arm, never overlay a second limb.
    oval(c,0,0,5.3,6.1,SKIN,INK);
    if(taunt>.001){
      line(c,[[0,-3],[0,-6-8*taunt]],INK,3.8);line(c,[[0,-3],[0,-6-8*taunt]],SKIN,2.4);
      // Folded fingers and a tucked thumb make the raised middle finger legible.
      for(const fx of [-3,0,3])oval(c,fx,-1,1.4,2.1,SKIN,'#ba8b68');
      line(c,[[4,0],[2,2],[-1,2]],'#ba8b68',.8);
    }else if(wave>.1){
      for(let i=0;i<4;i++){const fx=-4+i*2.6;limb(c,[[fx,-2],[fx+(i-1.5)*2,-9-(i===1||i===2?3:0)]],SKIN,2.1);}
      limb(c,[[4,1],[9,-3]],SKIN,2.4);
    }else{
      line(c,[[-2,-3],[-1,-6-5*wave]],INK,3.8);line(c,[[-2,-3],[-1,-6-5*wave]],SKIN,2.4);
      for(let i=0;i<3;i++){const fx=-4+i*3;line(c,[[fx,-2],[fx+(i-1)*wave*2,-4-8*wave]],SKIN,2.1)}
    }
    line(c,[[2,1],[3,4]],'#ba8b68',.65);c.restore();
  }
  const muzzles={elon:[],zuck:[]};
  function beginFrame(){muzzles.elon.length=0;muzzles.zuck.length=0;}
  function laugh(c,x,y,size=1){
    const {sceneTime}=getState(),beat=reducedMotion?.5:(1+Math.sin(sceneTime*22))*.5;
    c.save();c.translate(x,y);c.scale(size,size);
    for(const ex of [-9,9]){line(c,[[ex-6,-5],[ex,-8],[ex+6,-5]],INK,1.8);line(c,[[ex-5,-14],[ex,-16],[ex+5,-14]],'#715039',1.4);}
    oval(c,0,10,10,7+beat*4,'#482e2b',INK);
    poly(c,[[-8,5],[8,5],[6,8],[-6,8]],'#fff7e5',null);oval(c,0,14+beat*2,5,2,'#dc8a87');
    c.restore();
  }
  function pointingHand(c,x,y,target,size=1){
    const angle=Math.atan2(target.y-y,target.x-x);
    c.save();c.translate(x,y);c.rotate(angle);c.scale(size,size);
    oval(c,0,0,5,5,SKIN,INK);limb(c,[[1,-3],[15,-3]],SKIN,3.2);
    for(const fy of [0,3])oval(c,1,fy,2,1.7,SKIN,'#ba8b68');c.restore();
  }
  function moneyGun(c,x,y,target,size,who,surface){
    const angle=Math.atan2(target.y-y,target.x-x);
    c.save();c.translate(x,y);c.rotate(angle);c.scale(size,size);
    // Boxy gold cash cannon, top-loading banknotes and a separate grip.
    poly(c,[[-10,-11],[17,-11],[20,-6],[20,1],[-10,1]],'#e3b952');
    poly(c,[[-6,0],[2,0],[-1,12],[-7,11]],'#886839');
    poly(c,[[1,-14],[14,-14],[14,-10],[0,-10]],'#c5e3ab','#568267');
    line(c,[[18,-9],[18,-1]],'#563e2e',2);line(c,[[-7,-7],[12,-7]],'#fff0a5',1.5);
    const p=c.getTransform().transformPoint({x:21,y:-5});
    muzzles[who].push(ctx.getTransform().transformPoint({x:p.x/R-surface.ox,y:p.y/R-surface.oy}));
    c.restore();hand(c,x,y,1,0,0,size*.75);
  }
  function drawMoneyStreams(){
    const {sceneTime}=getState();
    if(muzzles.elon.length!==2||muzzles.zuck.length!==2)return;
    for(const [from,to] of [['elon','zuck'],['zuck','elon']])for(let gun=0;gun<2;gun++){
      const a=muzzles[from][gun],b=muzzles[to][gun],dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy)||1;
      const count=reducedMotion?4:13,k=Math.hypot(ctx.getTransform().a,ctx.getTransform().b)*getState().scale;
      ctx.save();ctx.setTransform(1,0,0,1,0,0);
      for(let i=0;i<count;i++){
        const t=reducedMotion?(i+.5)/count:(sceneTime*1.7+i/count+gun*.17)%1;
        const spread=Math.sin(t*Math.PI)*Math.sin(i*2.4+gun)*18*k;
        const x=a.x+dx*t-dy/length*spread,y=a.y+dy*t+dx/length*spread-18*k*Math.sin(t*Math.PI);
        ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(dy,dx)+(reducedMotion?0:Math.sin(sceneTime*8+i)*.9));
        ctx.scale(k,k*(reducedMotion?1:.4+.6*Math.abs(Math.sin(t*9+i))));ctx.globalAlpha=.85;
        poly(ctx,[[-6,-3],[6,-3],[6,3],[-6,3]],i%2?'#bfdb9d':'#e2e8b8','#416549',.7);
        oval(ctx,0,0,1.5,2,'#759b69');line(ctx,[[-4,-1],[-3,-1],[3,1],[4,1]],'#759b69',.7);ctx.restore();
      }
      ctx.restore();
    }
  }
  const motion={last:NaN,taunt:0,wave:0,facing:0};
  function elon(x,y,air,pose=0){
    const {S,B,CAMEO,sceneTime,heroY}=getState(),podcast=CAMEO.active?null:joeTarget?.();
    const reaction=joeReaction(podcast?obstacleDx(podcast)+podcast.w/2:NaN);
    const target=CAMEO.active||podcast?null:gestureTarget();
    const dt=Number.isFinite(motion.last)?clamp(sceneTime-motion.last,0,.1):1/60;motion.last=sceneTime;
    const dx=target?obstacleDx(target)+target.w/2:0;
    const a=1-Math.exp(-dt*15),facing=target?Math.sign(dx)||1:0;
    motion.taunt=mix(motion.taunt,target?ease((300-Math.abs(dx))/100):0,a);motion.wave=mix(motion.wave,CAMEO.active?1:0,a);motion.facing=mix(motion.facing,facing,a);
    const grab=clamp(S.grab||0),crouch=Math.max(S.charging?(.3+.7*S.charge):0,grab),drop=27*crouch+5*grab,taunt=motion.taunt*(1-grab),wave=motion.wave*(1-grab);
    const tilt=((air?-.085:Math.sin(pose*4)*.012)+(B.lean||0))*(1-grab);
    const opponent=target?unrotate({x:dx,y:-71-heroY},tilt):null;
    ctx.save();ctx.translate(x,y);ctx.rotate(tilt);
    drawFigure(heroSurface,c=>{
      let jointHand;
      for(const side of [-1,1]){
        // Measured on upright Roadster frame 0: soles follow its rear deck/bonnet.
        // Keep those supports fixed while the hips and torso lean under boost.
        const shoeAngle=air?0:side<0?-.17:.31;
        const support={x:side*25,y:air?-1:side<0?1.6:4.8};
        const foot=air?support:unrotate(support,tilt);
        const ankleWorld={x:support.x+5*Math.sin(shoeAngle),y:support.y-5*Math.cos(shoeAngle)};
        const ankle=air?ankleWorld:unrotate(ankleWorld,tilt);
        limb(c,[[side*11,-43+drop],[side*(23+15*crouch),-25-(air?10:0)+drop*.5],[ankle.x,ankle.y]],side<0?'#343b43':'#42464c',14);
        c.save();c.translate(foot.x,foot.y);c.rotate(air?0:shoeAngle-tilt);sneaker(c,0,0,side,1,'#e8e7dc');c.restore();
      }
      c.save();c.translate(4*crouch,drop);c.rotate(.09*crouch);
      poly(c,[[-25,-92],[18,-92],[27,-55],[18,-40],[-20,-42],[-28,-67]],'#252a2d');
      c.save();c.translate(-12,-84);c.fillStyle='#f9f4e5';c.fill(companyX,'evenodd');c.restore();
      for(const side of [-1,1]){
        const normalY=air?-92:-65+10*crouch,armWave=side===1?wave:0;
        const special=target&&target.id!=='trump'&&grab<.5,guns=target?.id==='zuck'&&grab<.5;
        const k=opponent&&side===facing?taunt:0,arm=k?raisedArm({x:side*22,y:-82},23,22,side):null;
        let ex=mix(side*34,arm?.elbow.x??side*34,k),ey=mix(-65,arm?.elbow.y??-65,k),hx=mix(side*44,arm?.wrist.x??side*44,k),hy=mix(normalY,arm?.wrist.y??normalY,k);
        ex=mix(ex,side*39,armWave);ey=mix(ey,-98,armWave);hx=mix(hx,side*(46+5*Math.sin(sceneTime*7)),armWave);hy=mix(hy,-117,armWave);
        if(side===1&&reaction.reach>0){
          const r=reaction.reach,i=reaction.inhale;
          ex=mix(ex,35,r);ey=mix(ey,-77-i*7,r);
          hx=mix(hx,40-i*6,r);hy=mix(hy,-92-i*11,r);
        }
        const aim=opponent?localPoint(c,opponent,heroSurface):null;
        if(special){
          const near=side===facing;
          if(guns||near){const angle=Math.atan2(aim.y+82,aim.x-side*22);ex=side*22+Math.cos(angle)*22;ey=-82+Math.sin(angle)*22;hx=side*22+Math.cos(angle)*43;hy=-82+Math.sin(angle)*43+(guns?side*7:0);}
        }
        if(grab>0){
          const arm=boardGrabArm(side,drop,.09*crouch);
          ex=mix(ex,arm.elbow.x,grab);ey=mix(ey,arm.elbow.y,grab);hx=mix(hx,arm.wrist.x,grab);hy=mix(hy,arm.wrist.y,grab);
        }
        const wristAngle=k?uprightWristAngle(tilt+.09*crouch,side,k):0;
        limb(c,[[side*22,-82],[ex,ey],[hx,hy]],'#303536',11);
        if(guns)moneyGun(c,hx,hy,aim,1,'elon',heroSurface);
        else if(special&&side===facing)pointingHand(c,hx,hy,aim);
        else hand(c,hx,hy,side,special?0:k*(1-armWave),armWave,1,wristAngle);
        if(side===1&&reaction.reach>.08&&grab<.5)jointHand={x:hx,y:hy};
      }
      c.save();c.translate(0,-92);c.rotate(motion.facing*.09+(air?.08:Math.sin(pose*3)*.018));heroHead(c,!!B.impossibru,opponent?localPoint(c,opponent,heroSurface):null,taunt,{...reaction,laugh:target&&target.id!=='trump'});
      c.restore();
      if(jointHand){
        const {x,y}=jointHand;
        line(c,[[x-2,y-2],[x-17,y-4]],'#e6dbc3',3);
        line(c,[[x-17,y-4],[x-20,y-4.5]],'#e99356',2.5);
      }
      if(reaction.smoke>.01){
        c.save();c.globalAlpha=.35*reaction.smoke;
        for(let i=0;i<6;i++){
          const age=reducedMotion?i/6:(sceneTime*.45+i/6)%1;
          oval(c,19+age*48+Math.sin(i*2)*6,-107-age*47,4+age*12,3+age*8,'#c1c8c3');
        }c.restore();
      }
      c.restore();
    });ctx.restore();
  }
  function body(c,color,trousers='#374352'){
    for(const s of [-1,1]){limb(c,[[s*10,-27],[s*11,-6]],trousers,9);sneaker(c,s*11,-3,s,.64,'#d9d9ce')}
    poly(c,[[-18,-55],[17,-55],[21,-24],[-20,-24]],color);
  }
  function trumpPose(o,bob=0){
    const {S,CAMEO,heroY}=getState(),dx=obstacleDx(o)+o.w/2,side=dx>=0?-1:1;
    const blend=CAMEO.active?0:ease((300-Math.abs(dx))/100);
    const crouch=S.charging?(.3+.7*S.charge):0;
    const target=blend>0?unrotate({x:-dx,y:heroY-125+27*crouch},bob*.008):null;
    drawFigure(humanSurface,c=>{body(c,'#25374e','#1d293c');poly(c,[[-7,-54],[7,-54],[0,-29]],'#f2eddf');poly(c,[[0,-53],[4,-48],[2,-25],[-2,-29],[-3,-48]],'#bc3536');
      for(const s of [-1,1]){
        const k=target&&s===side?blend:0,arm=k?raisedArm({x:s*17,y:-48},15,15,s):null;
        const ex=mix(s*23,arm?.elbow.x??s*23,k),ey=mix(-39,arm?.elbow.y??-39,k),hx=mix(s*25,arm?.wrist.x??s*25,k),hy=mix(-25,arm?.wrist.y??-25,k);
        limb(c,[[s*17,-48],[ex,ey],[hx,hy]],'#25374e',7);hand(c,hx,hy,s,k,0,.67,k?uprightWristAngle(bob*.008,s,k):0);
      }
      donnyHead(c,target,blend);
    },target?null:'trump:idle');
  }
  function joe(o){
    // The generated silhouette includes the entire headband and separate boom mic.
    // Draw directly: the old 102px human buffer clipped the top of Joe's head.
    const dx=obstacleDx(o)+o.w/2;
    ctx.save();
    ctx.scale(dx<0?-1:1,1); // Keep the smile and gaze toward Elon after passing.
    // Source alpha bounds map to 94px tall, shoes and stand on the road.
    ctx.drawImage(joeSprite,-41.5,-98.8,68.5,102.75);
    ctx.restore();
  }
  function zuckerberg(o){
    const {S,CAMEO,heroY}=getState(),dx=obstacleDx(o)+o.w/2;
    const active=S.y>0&&!CAMEO.active&&gestureTarget()===o;
    drawFigure(active?heroSurface:humanSurface,c=>{
      body(c,'#7e8587','#40566b');
      for(const side of [-1,1]){
        let hx=side*23,hy=-25;
        const target={x:-dx,y:heroY-80};
        if(active){const angle=Math.atan2(target.y+48,target.x-side*17);hx=side*17+Math.cos(angle)*27;hy=-48+Math.sin(angle)*27+side*5;}
        limb(c,[[side*17,-48],[(side*17+hx)/2,-43],[hx,hy]],'#7e8587',7);
        if(active)moneyGun(c,hx,hy,target,.7,'zuck',heroSurface);else hand(c,hx,hy,side,0,0,.6);
      }
      head(c,'zuckHead',-23,-94,46,43);
      if(active){oval(c,0,-72,18,17,'#efc49d');laugh(c,0,-74,.72);}
    },active?null:'zuck');
  }
  function rogozinBounce(){return 20*Math.abs(Math.sin(getState().sceneTime*3.8))}
  function rogozin(o){
    // 94 px person + 16 px trampoline + 20 px jump = 130 px peak.
    const bounce=rogozinBounce();ctx.save();
    ctx.lineCap='round';ctx.strokeStyle=PAPER;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-33,-13);ctx.lineTo(-37,-1);ctx.moveTo(33,-13);ctx.lineTo(37,-1);ctx.stroke();ctx.strokeStyle='#65747a';ctx.lineWidth=3;ctx.stroke();
    oval(ctx,0,-13,42,5.5,PAPER);oval(ctx,0,-13,39.5,3,'#566b6c');line(ctx,[[-31,-11],[-22,-8],[-12,-11],[-2,-8],[8,-11],[18,-8],[29,-11]],'#a8b6ac',.8);
    ctx.translate(0,-16-bounce);drawFigure(humanSurface,c=>{body(c,'#34445a','#27364e');poly(c,[[-5,-54],[5,-54],[0,-32]],'#d6d9d1');
      for(const s of [-1,1]){limb(c,[[s*17,-49],[s*26,-39],[s*23,-30]],'#34445a',7);hand(c,s*23,-29,s,0,0,.6)}head(c,'rogozinHead',-23,-94,46,43);
    },'rogozin');ctx.restore();
  }
  function amber(o={}){
    // Fictional paper slapstick character; the projectile is cosmetic and owned by the game world.
    const p=clamp(o.throwProgress||0),frame=Math.round(p*24),t=frame/24;
    drawFigure(amberSurface,c=>{
      for(const s of [-1,1]){limb(c,[[s*8,-29],[s*10,-6]],SKIN,7);sneaker(c,s*10,-3,s,.58,'#8d3e36')}
      poly(c,[[-15,-56],[14,-56],[19,-23],[-19,-23]],'#773c4c');
      limb(c,[[-14,-49],[-22,-39],[-20,-29]],SKIN,6);hand(c,-20,-28,-1,0,0,.6);
      const wind=ease(t/.28),release=ease((t-.28)/.12),follow=ease((t-.4)/.6);
      const hx=mix(mix(20,-18,wind),34,release)-follow*14,hy=mix(mix(-29,-77,wind),-60,release)+follow*31;
      limb(c,[[13,-48],[mix(22,27,release),mix(-44,-51,wind)],[hx,hy]],SKIN,6);hand(c,hx,hy,1,0,0,.6);
      c.drawImage(castSprites.amber,-29.5,-101,59,59);
    },`amber:${frame}`);
  }
  function seatedSprite(key,x,y,foreground=false){
    const katy=key==='katyHead',id=katy?'katy':'bezos',t=getState().CAMEO.t;
    // Registered whole-figure frames; scene time freezes faces with pause.
    const phase=(t+(katy?.55:0))%2.8,frame=!reducedMotion&&phase>1.55&&phase<2.25?1:0;
    ctx.save();ctx.translate(x,y);
    if(foreground){ctx.beginPath();ctx.rect(-65,-1,130,48);ctx.clip();}
    // Source hip underside: about y=383 (Katy), y=417 (Bezos).
    // Hull top is y=14.4; overlap it by ~2px instead of leaving a sky gap.
    const top=katy?-97:-105;
    ctx.drawImage(castSprites[id],frame*320,0,320,512,-45,top,90,144);
    ctx.restore();
  }
  function cameoLeg(headKey,x,y){seatedSprite(headKey,x,y,true);}
  function cameoRider(headKey,x,y){seatedSprite(headKey,x,y);}
  return {elon,trumpPose,zuckerberg,rogozin,amber,joe,rogozinBounce,cameoRider,cameoLeg,beginFrame,drawMoneyStreams};
}
