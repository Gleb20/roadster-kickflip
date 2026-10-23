// Measures painted shoe soles against photographed car alpha, and painted hips against hull alpha.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');const {resolve}=require('node:path');
const baseline=process.env.EXPECT_BASELINE==='1',out=resolve(process.argv[2]||'docs/verification/2026-10-18-contact-v248');fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined});try{
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2}),errors=[],checks=[],failures=[],samples=[];
 const check=(ok,name,data)=>{checks.push(name);if(!ok)failures.push({name,data})};
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});await page.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));
 await page.goto(process.env.GAME_BASE_URL||'http://127.0.0.1:8766/');await page.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert&&document.querySelector('#loading-screen').hidden);
 await page.click('#start');await page.keyboard.press('ShiftLeft');assert.equal(await page.evaluate(()=>__qa.B.state),'active');
 await page.keyboard.down('Space');await page.waitForFunction(()=>__qa.S.charge>.2);await page.keyboard.up('Space');await page.waitForFunction(()=>__qa.S.y>30);check(true,'real Shift boost and Space jump');
 await page.evaluate(async()=>{
  const load=async src=>{const img=new Image();img.src=src;await img.decode();return img};
  const car=await load('assets/roadster-flip/atlas.png'),cast=await load('paper-cast.png');
  const pixels=(img,w,h,args)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.drawImage(img,...args);return g.getImageData(0,0,w,h).data};
  window.__contactPixels={car:pixels(car,256,160,[0,0,256,160,0,0,256,160]),hull:pixels(cast,1030,325,[135,310,515,162.5,0,0,1030,325]),riders:{}};
  for(const id of ['bezos','katy'])__contactPixels.riders[id]=pixels(await load('assets/characters/'+id+'-v247.png'),640,512,[0,0]);
  const proto=CanvasRenderingContext2D.prototype,begin=proto.beginPath,move=proto.moveTo,line=proto.lineTo,close=proto.closePath,draw=proto.drawImage,fillText=proto.fillText;
  window.__contact={local:[],soles:[],riders:[],hull:null,text:[]};
  proto.beginPath=function(){this.__points=[];return begin.call(this)};proto.moveTo=function(x,y){this.__points=[[x,y]];return move.call(this,x,y)};proto.lineTo=function(x,y){this.__points?.push([x,y]);return line.call(this,x,y)};
  proto.closePath=function(){
   if(this.canvas.width===255&&[279,321].includes(this.canvas.height)&&JSON.stringify(this.__points)==='[[-9,0],[15,0],[15,4],[-9,4]]'){
    const t=this.getTransform();__contact.local.push([t.transformPoint({x:-9,y:4}),t.transformPoint({x:15,y:4})]);
   }return close.call(this);
  };
  proto.drawImage=function(img,...args){
   if(this.canvas.id==='scene'){
    const t=this.getTransform();
    if(img.width===255&&[279,321].includes(img.height))__contact.soles=__contact.local.map(pair=>pair.map(p=>t.transformPoint({x:p.x/1.5-85,y:p.y/1.5-178})));
    if(img.src?.includes('bezos-v247')||img.src?.includes('katy-v247'))__contact.riders.push({id:img.src.includes('bezos')?'bezos':'katy',t:Array.from([t.a,t.b,t.c,t.d,t.e,t.f]),args});
    if(img.src?.endsWith('/paper-cast.png')&&args[0]===135)__contact.hull={t:Array.from([t.a,t.b,t.c,t.d,t.e,t.f]),args};
   }return draw.call(this,img,...args);
  };
  proto.fillText=function(str,...args){if(this.canvas.id==='scene')__contact.text.push(str);return fillText.call(this,str,...args)};
  __qa.stop();document.querySelectorAll('#game > :not(canvas)').forEach(el=>el.style.setProperty('display','none','important'));
 });
 for(const [view,width,height] of [['desktop',1440,900],['portrait',390,844],['landscape',844,390]]){
  await page.setViewportSize({width,height});
  await page.waitForFunction(()=>{const c=document.querySelector('#scene'),d=c.getContext('2d').getTransform().a;return Math.abs(c.width/d-innerWidth)<1&&Math.abs(c.height/d-innerHeight)<1});
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  for(const factor of [1,2.46,4])for(const charge of [0,1]){
   const result=await page.evaluate(({factor,charge})=>{
    const q=__qa;q.S.obs=[];q.S.particles=[];q.S.y=0;q.S.charging=!!charge;q.S.charge=charge;q.CAMEO.active=false;q.B.factor=factor;q.B.state=factor>1?'active':'ready';q.roadsterMotion.compression=1.8*charge;
    for(let i=0;i<30;i++){q.setSceneTime(20+i/60);q.render()}
    __contact={local:[],soles:[],riders:[],hull:null,text:[]};q.render();
    const ctx=document.querySelector('#scene').getContext('2d'),d=ctx.getTransform().a,scale=JSON.parse(render_game_to_text()).camera.scale,px=innerWidth*(innerWidth<600?.24:.29),ground=JSON.parse(render_game_to_text()).camera.ground;
    return __contact.soles.map(pair=>pair.map(p=>{
     const x=(p.x/d-px)/scale,y=(p.y/d-ground)/scale-q.roadsterMotion.compression,sx=Math.round(128+x*256/108);let top=0;
     while(top<113&&__contactPixels.car[(top*256+sx)*4+3]<180)top++;
     const surface=(top-112.5)*108/256;return {x,y,surface,error:y-surface};
    }));
   },{factor,charge});
   samples.push({view,factor,charge,soles:result});check(result.length===2&&result.flat().every(p=>Math.abs(p.error)<2),`${view}: both soles contact car, factor=${factor}, charge=${charge}`,result);
   if(!charge&&(!baseline||view==='desktop'&&factor===4)||!baseline&&charge&&factor===4)await page.screenshot({path:resolve(out,`${view}-boost-${factor}-charge-${charge}.png`)});
  }
  for(const t of [3.4,4.4]){
   const contacts=await page.evaluate(t=>{
    const q=__qa;q.S.obs=[];q.S.y=0;q.S.charging=false;q.B.factor=1;q.B.state='ready';q.CAMEO.active=true;q.CAMEO.t=t;q.CAMEO.milestone=5000;__contact={local:[],soles:[],riders:[],hull:null,text:[]};q.render();
    const hull=__contact.hull,inv=new DOMMatrix(hull.t).inverse();
    return __contact.riders.slice(0,2).map(r=>{
     const [sx,,sw,sh,x,y,w,h]=r.args,frame=sx/320,data=__contactPixels.riders[r.id],mat=new DOMMatrix(r.t),hipX=220;let hipY=-1;
     for(let row=250;row<470;row++){const k=(row*640+frame*320+hipX)*4;if(data[k+3]>180&&data[k+2]>data[k]*1.5&&data[k+2]>data[k+1]*1.2)hipY=row}
     const point=inv.transformPoint(mat.transformPoint({x:x+hipX/sw*w,y:y+hipY/sh*h}));
     const column=Math.round((point.x+160)/320*1030);let row=0;while(row<325&&__contactPixels.hull[(row*1030+column)*4+3]<180)row++;
     const hullTop=-5+row/325*85;return {id:r.id,frame,hipY:point.y,hullTop,gap:hullTop-point.y};
    });
   },t);
   samples.push({view,cameoTime:t,contacts});check(contacts.length===2&&contacts.every(p=>p.gap<=0&&p.gap>-4),`${view}: hips overlap hull, time=${t}`,contacts);
   if(!baseline||view==='desktop')await page.screenshot({path:resolve(out,`${view}-riders-${t}.png`)});
  }
 }
 const labels=await page.evaluate(()=>{const q=__qa;q.CAMEO.active=false;q.S.obs=[];q.spawn('amber',100);q.spawn('zuck',220);q.spawn('rogozin',340);__contact.text=[];q.render();return __contact.text.filter(t=>q.types.some(o=>o.name===t))});check(labels.length===0,'no obstacle names in running scene',labels);
 const collision=await page.evaluate(()=>{document.querySelectorAll('#game > :not(canvas)').forEach(el=>el.style.removeProperty('display'));const q=__qa;q.start();q.spawn('amber',-20);q.step(1/120);return {visible:getComputedStyle(document.querySelector('#result')).display!=='none',mode:q.S.mode,reason:document.querySelector('#reason').textContent,name:q.types.find(t=>t.id==='amber').name}});check(collision.visible&&collision.mode==='dead'&&collision.reason.includes(collision.name),'collision screen retains obstacle name',collision);
 if(!baseline)await page.screenshot({path:resolve(out,'collision-name.png')});
 check(errors.length===0,'no JS/console errors',errors);fs.writeFileSync(resolve(out,'results.json'),JSON.stringify({baseline,checks,failures,samples,errors},null,2));
 if(baseline){assert.ok(failures.some(f=>f.name.includes('soles')));assert.ok(failures.some(f=>f.name.includes('hips')));assert.ok(failures.some(f=>f.name.includes('names')))}else assert.deepEqual(failures,[]);
 console.log(JSON.stringify({checks:checks.length,expectedBaselineFailures:baseline?failures.length:undefined,failures:baseline?undefined:failures,errors,out}));
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
