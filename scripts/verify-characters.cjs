// Optional rendered regression check. Uses an existing Playwright installation.
// Start npm run dev first; PLAYWRIGHT_MODULE / CHROMIUM_EXECUTABLE_PATH select local tooling.
const {createRequire}=require('node:module');
const {mkdirSync,writeFileSync}=require('node:fs');
const {resolve}=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=createRequire(__filename)(process.env.PLAYWRIGHT_MODULE||'playwright');
const out=resolve(process.argv[2]||'/tmp/tesla-jump-character-review');mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],results=[];
  page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.addInitScript(()=>{
   window.__draws={pupils:[],fingers:[]};
   const proto=CanvasRenderingContext2D.prototype,ellipse=proto.ellipse,lineTo=proto.lineTo,drawImage=proto.drawImage;
   proto.ellipse=function(x,y,rx,ry,...rest){
    const who=Math.abs(rx-2.07)<.001?'elon':Math.abs(rx-1.219)<.001?'donny':null;
    if(who)window.__draws.pupils.push({who,x,y});
    return ellipse.call(this,x,y,rx,ry,...rest);
   };
   proto.lineTo=function(x,y){
    if(x===0&&y<-6.05&&y>=-14.01){
     const who=this.canvas.width===255?'elon':this.canvas.width===153?'donny':null;
     if(who){const t=this.getTransform(),a=t.transformPoint({x:0,y:-3}),b=t.transformPoint({x,y});window.__draws.fingers.push({who,x:t.e/1.5-(who==='elon'?85:51),dx:b.x-a.x,dy:b.y-a.y});}
    }
    return lineTo.call(this,x,y);
   };
   proto.drawImage=function(source,...args){
    if(this.canvas.id==='scene'){
     const who=source.width===255&&source.height===279?'elon':source.width===153&&source.height===153?'donny':null;
     if(who){
      const t=this.getTransform();
      for(const finger of window.__draws.fingers.filter(f=>f.who===who)){
       const dx=t.a*finger.dx+t.c*finger.dy,dy=t.b*finger.dx+t.d*finger.dy;
       finger.screenAngle=Math.atan2(dx,-dy)*180/Math.PI;
      }
     }
    }
    return drawImage.call(this,source,...args);
   };
  });
  const load=async(query='')=>{await page.goto((process.env.GAME_BASE_URL||'http://127.0.0.1:8766/')+query);await page.waitForFunction(()=>!document.querySelector('#start').disabled);};
  await load();
  // Real input, before deterministic visual states.
  await page.click('#start');await page.locator('#start').blur();
  await page.keyboard.down('Space');await page.waitForFunction(()=>__qa.S.charge>.3).catch(async error=>{console.error(JSON.stringify({errors,state:await page.evaluate(()=>render_game_to_text())}));throw error;});await page.keyboard.up('Space');
  await page.waitForFunction(()=>__qa.S.y>30);results.push({realInput:'keyboard charge and jump passed'});
  await page.keyboard.press('p');assert.equal(await page.evaluate(()=>__qa.S.mode),'paused');
  await page.click('#resume');assert.equal(await page.evaluate(()=>__qa.S.mode),'playing');
  await page.click('#boost');await page.waitForFunction(()=>__qa.B.state==='active');
  results.push({realInput:'pause, resume and pointer boost passed'});
  await page.evaluate(()=>{__qa.stop();document.querySelectorAll('#game > :not(canvas)').forEach(el=>el.style.setProperty('display','none','important'));});
  let tick=1;
  async function pose(name,dx,y,phase=0,factor=1,charging=false){
   const draws=await page.evaluate(({dx,y,phase,factor,charging,tick})=>{
    const q=__qa;q.S.obs=[];q.S.particles=[];q.S.charging=charging;q.S.charge=charging?1:0;q.B.factor=factor;q.B.state=factor>1?'active':'ready';q.CAMEO.active=false;
    q.spawn('trump',dx-27);q.S.y=y;q.S.launchSpeed=760;q.S.jumpTime=phase*1520/1550;
    for(let i=0;i<40;i++){q.setSceneTime(tick+i/60);q.render();}
    window.__draws={pupils:[],fingers:[]};q.render();return window.__draws;
   },{dx,y,phase,factor,charging,tick:tick+=2});
   for(const who of ['elon','donny']){
    const pupils=draws.pupils.filter(p=>p.who===who),fingers=draws.fingers.filter(p=>p.who===who);
    assert.equal(pupils.length,2,`${name}: ${who} has two moving pupils`);
    assert.equal(fingers.length,2,`${name}: ${who} makes one gesture (two strokes of one finger)`);
    for(const finger of fingers){
     assert.ok(Number.isFinite(finger.screenAngle),`${name}: screen angle measured after body transforms`);
     assert.ok(Math.abs(finger.screenAngle)<=15.001,`${name}: ${who} middle finger is vertical +/-15 degrees, got ${finger.screenAngle}`);
    }
    if(Math.abs(dx)>=100){
     assert.equal(Math.sign(fingers[0].x),Math.sign(dx)*(who==='elon'?1:-1),`${name}: only nearest hand gestures`);

     const centres=who==='elon'?[-7,13]:[-10,2];
     pupils.forEach((p,i)=>assert.equal(Math.sign(p.x-centres[i]),Math.sign(dx)*(who==='elon'?1:-1),`${name}: pupils turn toward opponent`));
    }
    const centresY=who==='elon'?[-33,-34]:[-71,-70];
    pupils.forEach((p,i)=>assert.equal(Math.sign(p.y-centresY[i]),who==='elon'?1:-1,`${name}: pupils track opponent height`));
   }
   await page.screenshot({path:resolve(out,name+'.png')});results.push({name,...draws});return draws;
  }
  await pose('approach',145,0);
  await page.screenshot({path:resolve(out,'approach-detail.png'),clip:{x:310,y:485,width:390,height:300}});
  await pose('flip',25,145,.48);
  await pose('depart',-155,15,.92);
  await pose('approach-entry',250,0);await pose('depart-exit',-275,25,.95,4);
  const low=await pose('level-ground',145,0),high=await pose('level-air',145,170,.5);
  const donnyY=d=>d.pupils.find(p=>p.who==='donny').y;
  assert.ok(donnyY(high)<donnyY(low),'Donny looks higher at the same horizontal position; no stale pose cache');
  await pose('boost',145,0,0,2.46);await pose('boost-x2',-155,120,.65,4);await pose('boost-x2-approach',145,120,.5,4);await pose('boost-crouch',145,0,0,4,true);
  await pose('crouch',145,0,0,1,true);
  for(const [name,width,height] of [['portrait',390,844],['landscape',844,390]]){
   await page.setViewportSize({width,height});await pose(name,125,0);
  }
  await page.setViewportSize({width:1440,height:900});
  await page.emulateMedia({reducedMotion:'reduce'});await pose('reduced-motion',145,0);
  await page.evaluate(()=>{__qa.S.obs=[];__qa.B.factor=1;__qa.B.state='ready';__qa.S.y=0;__qa.S.charging=false;window.__draws={pupils:[],fingers:[]};__qa.render();});
  assert.equal(await page.evaluate(()=>__draws.fingers.length),0,'no opponent: no taunt');
  for(const review of ['spaceport','flip','obstacles']){
   await load('?review='+review);await page.screenshot({path:resolve(out,review==='flip'?'kickflip.png':review+'.png')});
  }
  // Verify the served public version separately from local implementation.
  await page.goto('https://gleb20.github.io/roadster-kickflip/');await page.waitForFunction(()=>typeof render_game_to_text==='function');
  results.push({live:await page.evaluate(()=>JSON.parse(render_game_to_text()).version)});
  assert.deepEqual(errors,[]);writeFileSync(resolve(out,'results.json'),JSON.stringify({errors,results},null,2));
  console.log(JSON.stringify({checks:results.length,errors,out}));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
