/** Paper characters: one silhouette per figure, reusable render buffers, no DOM/frame allocation. */
export function createCharacterRenderer({ctx, cutout, getState, gestureTarget, obstacleDx}) {
  const INK='#282b2d', PAPER='#f4eedf', SKIN='#edbf96';
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
  const heroSurface=surface(170,186,85,178),humanSurface=surface(102,102,51,98),cameoSurface=surface(136,150,68,112);
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
  function sneaker(c,x,y,side,size=1,color='#e9e5da'){
    c.save();c.translate(x,y);c.scale(side*size,size);
    // The ankle ends inside the padded collar, above a closed sole.
    poly(c,[[-7,-10],[4,-10],[6,-5],[14,-3],[16,1],[15,4],[-9,4],[-10,0]],color,INK,1);
    poly(c,[[-9,0],[15,0],[15,4],[-9,4]],'#aeb8ad',INK,.7);
    line(c,[[-3,-8],[4,-6],[0,-5],[6,-3]],'#fbf7eb',1.3);
    line(c,[[-5,-3],[1,-1],[9,-3]],'#414d50',1.4);c.restore();
  }
  function hand(c,x,y,side,taunt=0,wave=0,size=1){
    c.save();c.translate(x,y);c.scale(side*size,size);
    // A single palm; fingers deform with the same arm, never overlay a second limb.
    oval(c,0,0,5.3,6.1,SKIN,INK);
    line(c,[[-2,-3],[-1,-6-15*taunt-5*wave]],INK,3.8);line(c,[[-2,-3],[-1,-6-15*taunt-5*wave]],SKIN,2.4);
    for(let i=0;i<3;i++){const fx=-4+i*3;line(c,[[fx,-2],[fx+(i-1)*wave*2,-4-8*wave]],SKIN,2.1)}
    line(c,[[2,1],[3,4]],'#ba8b68',.65);c.restore();
  }
  const motion={last:NaN,taunt:0,wave:0,facing:0};
  function elon(x,y,air,pose=0){
    const {S,B,CAMEO,sceneTime}=getState(),target=CAMEO.active?null:gestureTarget();
    const dt=Number.isFinite(motion.last)?clamp(sceneTime-motion.last,0,.1):1/60;motion.last=sceneTime;
    const a=1-Math.exp(-dt*15),facing=target?Math.sign(obstacleDx(target)+target.w/2)||1:0;
    motion.taunt=mix(motion.taunt,target?1:0,a);motion.wave=mix(motion.wave,CAMEO.active?1:0,a);motion.facing=mix(motion.facing,facing,a);
    const crouch=S.charging?(.3+.7*S.charge):0,drop=27*crouch,thrust=clamp((B.factor-1)/3),taunt=motion.taunt,wave=motion.wave;
    ctx.save();ctx.translate(x,y);ctx.rotate((air?-.085:Math.sin(pose*4)*.012)-thrust*.24);
    drawFigure(heroSurface,c=>{
      for(const side of [-1,1]){limb(c,[[side*11,-43+drop],[side*(23+15*crouch),-25-(air?10:0)+drop*.5],[side*25,-6]],side<0?'#343b43':'#42464c',14);sneaker(c,side*25,-1,side,1,'#e8e7dc')}
      c.save();c.translate(4*crouch,drop);c.rotate(.09*crouch);
      poly(c,[[-25,-92],[18,-92],[27,-55],[18,-40],[-20,-42],[-28,-67]],'#252a2d');
      line(c,[[-7,-78],[8,-61]],'#f9f4e5',2.2);line(c,[[8,-78],[-7,-61]],'#f9f4e5',2.2);
      for(const side of [-1,1]){
        const normalY=air?-92:-65+10*crouch,armWave=side===1?wave:0;
        let ex=mix(side*34,side*39,taunt),ey=mix(-65,-72,taunt),hx=mix(side*44,side*47,taunt),hy=mix(normalY,-104,taunt);
        ex=mix(ex,side*39,armWave);ey=mix(ey,-98,armWave);hx=mix(hx,side*(46+5*Math.sin(sceneTime*7)),armWave);hy=mix(hy,-117,armWave);
        limb(c,[[side*22,-82],[ex,ey],[hx,hy]],'#303536',11);hand(c,hx,hy,side,taunt*(1-armWave),armWave);
      }
      c.save();c.translate(0,-92);c.rotate(motion.facing*.09+(air?.08:Math.sin(pose*3)*.018));head(c,'head',-33,-74,68,78);
      if(thrust>.025){c.globalAlpha=clamp(thrust*4);oval(c,-7,-33,9,11,'#fff9ed',INK);oval(c,13,-34,9,11,'#fff9ed',INK);oval(c,-4,-32,2,3,INK);oval(c,16,-33,2,3,INK);line(c,[[-16,-48],[-5,-51]],'#66503d',2);line(c,[[7,-51],[20,-48]],'#66503d',2);oval(c,7,-12,5+thrust*2,6+thrust*3,'#49332e');oval(c,8,-8,3,2,'#d88978');c.globalAlpha=1}
      c.restore();c.restore();
    });ctx.restore();
  }
  function body(c,color,trousers='#374352'){
    for(const s of [-1,1]){limb(c,[[s*10,-27],[s*11,-6]],trousers,9);sneaker(c,s*11,-3,s,.64,'#d9d9ce')}
    poly(c,[[-18,-55],[17,-55],[21,-24],[-20,-24]],color);
  }
  function trumpPose(o,bob=0){
    const dx=obstacleDx(o)+o.w/2,side=dx>=0?-1:1,t=ease((240-Math.abs(dx))/70),frame=Math.round(t*16),blend=frame/16;
    drawFigure(humanSurface,c=>{body(c,'#25374e','#1d293c');poly(c,[[-7,-54],[7,-54],[0,-29]],'#f2eddf');poly(c,[[0,-53],[4,-48],[2,-25],[-2,-29],[-3,-48]],'#bc3536');
      for(const s of [-1,1]){const k=s===side?blend:0,ex=mix(s*23,s*28,k),ey=mix(-39,-42,k),hx=mix(s*25,s*34,k),hy=mix(-25,-64,k);limb(c,[[s*17,-48],[ex,ey],[hx,hy]],'#25374e',7);hand(c,hx,hy,s,k,0,.67)}
      head(c,'trumpHead',-24,-94,48,43);
    },`trump:${side}:${frame}`);
  }
  function zuckerberg(){drawFigure(humanSurface,c=>{body(c,'#7e8587','#40566b');for(const s of [-1,1]){limb(c,[[s*17,-48],[s*23,-27]],'#7e8587',7);hand(c,s*23,-25,s,0,0,.6)}head(c,'zuckHead',-23,-94,46,43)},'zuck')}
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
    drawFigure(humanSurface,c=>{
      for(const s of [-1,1]){limb(c,[[s*8,-29],[s*10,-6]],SKIN,7);sneaker(c,s*10,-3,s,.58,'#8d3e36')}
      poly(c,[[-15,-56],[14,-56],[19,-23],[-19,-23]],'#773c4c');
      limb(c,[[-14,-49],[-22,-39],[-20,-29]],SKIN,6);hand(c,-20,-28,-1,0,0,.6);
      const wind=ease(t/.28),release=ease((t-.28)/.12),follow=ease((t-.4)/.6);
      const hx=mix(mix(20,-18,wind),34,release)-follow*14,hy=mix(mix(-29,-77,wind),-60,release)+follow*31;
      limb(c,[[13,-48],[mix(22,27,release),mix(-44,-51,wind)],[hx,hy]],SKIN,6);hand(c,hx,hy,1,0,0,.6);
      poly(c,[[-22,-82],[-16,-91],[-3,-94],[13,-90],[21,-80],[22,-51],[14,-49],[-18,-51],[-24,-62]],'#c5a05b');
      oval(c,-1,-72,18,20,SKIN,INK);poly(c,[[-21,-80],[-15,-91],[-3,-94],[13,-90],[20,-82],[6,-87],[-5,-80],[-18,-76]],'#e2bd70');
      oval(c,-8,-74,6.8,8,'#fff9ed',INK);oval(c,5,-75,6.6,8,'#fff9ed',INK);oval(c,-10,-74,1.9,2.5,'#466a78');oval(c,3,-75,1.9,2.5,'#466a78');
      line(c,[[-15,-84],[-7,-85]],'#876135',1);line(c,[[2,-85],[10,-84]],'#876135',1);line(c,[[-2,-72],[-4,-65],[0,-65]],'#bd8c67',.8);line(c,[[-8,-60],[-1,-58],[7,-61]],'#983f44',1.5);
      line(c,[[15,-85],[19,-65],[16,-54]],'#efcd84',1.4);line(c,[[-20,-74],[-19,-56]],'#efcd84',1.2);
    },`amber:${frame}`);
  }
  function cameoRider(headKey,x,y,color,katy=false){
    const {CAMEO}=getState(),t=CAMEO.t;
    ctx.save();ctx.translate(x,y);drawFigure(cameoSurface,c=>{
      for(const side of [-1,1]){limb(c,[[side*9,-12],[side*28,-2],[side*30,22]],color,10);sneaker(c,side*30,24,side,.7,'#d2d7ce')}
      poly(c,[[-17,-52],[17,-52],[18,-10],[-18,-10]],color);
      const side=katy?1:-1,hx=side*(37+7*Math.sin(t*7)),hy=-68;
      limb(c,[[side*15,-44],[side*31,-52],[hx,hy]],color,9);hand(c,hx,hy-3,side,0,1,.76);
      if(katy){limb(c,[[-15,-32],[-32,-18],[-53,-17]],color,8);hand(c,-55,-17,-1,0,0,.65)}
      else{limb(c,[[14,-43],[23,-26],[13,-15]],color,8);hand(c,13,-15,1,0,0,.65)}
      head(c,headKey,-25,-103,50,58);
    });ctx.restore();
  }
  return {elon,trumpPose,zuckerberg,rogozin,amber,rogozinBounce,cameoRider};
}
