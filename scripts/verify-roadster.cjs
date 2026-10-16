// Local rendered regression check; reuse an installed Playwright and Chromium.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {mkdirSync,writeFileSync}=require('node:fs');
const {resolve}=require('node:path');
const assert=require('node:assert/strict');
const out=resolve(process.argv[2]||'/tmp/tesla-roadster-review');mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],results=[];
  // The dev server has no favicon; keep that browser-only request out of asset QA.
  await page.route('**/favicon.ico',route=>route.fulfill({status:204}));
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.addInitScript(()=>{
   // Observe actual wheel pixels' transforms on the scene canvas.
   window.__wheelDraws=[];
   const draw=CanvasRenderingContext2D.prototype.drawImage;
   CanvasRenderingContext2D.prototype.drawImage=function(img,...args){
    if(this.canvas.id==='scene'&&args.length===2&&[40,38].includes(img.width)&&img.height===img.width){
     const t=this.getTransform(),radius=img.width/2-1,dpr=this.canvas.height/innerHeight;
     window.__wheelDraws.push({bottom:(t.f+t.d*(args[1]+img.height/2+radius))/dpr});
    }
    return draw.call(this,img,...args);
   };
  });
  async function load(query=''){
   await page.goto((process.env.GAME_BASE_URL||'http://127.0.0.1:8766/')+query);
   await page.waitForFunction(()=>!document.querySelector('#start').disabled);
  }
  await load();await page.click('#start');await page.locator('#start').blur();
  await page.evaluate(()=>{__qa.S.next=1e9;__qa.S.obs=[];});
  await page.keyboard.down('Space');await page.waitForFunction(()=>__qa.S.charge>.95);
  assert.ok(await page.evaluate(()=>__qa.roadsterMotion.compression>1),'real hold compresses suspension');
  await page.screenshot({path:resolve(out,'charge.png')});
  await page.keyboard.up('Space');await page.waitForFunction(()=>__qa.S.y>70);
  await page.screenshot({path:resolve(out,'jump.png')});
  await page.waitForFunction(()=>__qa.S.y===0&&__qa.roadsterMotion.compression>1);
  await page.screenshot({path:resolve(out,'landing.png')});
  await page.waitForFunction(()=>Math.abs(__qa.roadsterMotion.compression)<.02);
  await page.keyboard.press('p');
  const frozen=await page.evaluate(()=>JSON.stringify(__qa.roadsterMotion));
  await page.waitForTimeout(100);
  assert.equal(await page.evaluate(()=>JSON.stringify(__qa.roadsterMotion)),frozen,'pause freezes wheels and spring');
  await page.click('#resume');assert.equal(await page.evaluate(()=>__qa.S.mode),'playing');
  await page.click('#boost');assert.equal(await page.evaluate(()=>__qa.B.state),'active');
  await page.waitForFunction(()=>__qa.B.factor>1.5).catch(async e=>{throw new Error(e.message+' '+await page.evaluate(()=>render_game_to_text()));});
  results.push({realInput:'charge, jump, landing spring, pause/resume and boost passed'});
  await page.evaluate(()=>{__qa.stop();document.querySelectorAll('#game > :not(canvas)').forEach(el=>el.style.setProperty('display','none','important'));__qa.S.y=0;__qa.S.charging=false;__qa.B.factor=1;__qa.B.state='ready';Object.assign(__qa.roadsterMotion,{compression:0,velocity:0});});
  for(const [name,width,height] of [['desktop',1440,900],['portrait',390,844],['landscape',844,390]]){
   await page.setViewportSize({width,height});
   const geometry=await page.evaluate(()=>{__wheelDraws=[];__qa.render();return {ground:innerHeight*.84,wheels:__wheelDraws};});
   assert.equal(geometry.wheels.length,2);
   geometry.wheels.forEach(w=>assert.ok(Math.abs(w.bottom-geometry.ground)<.01,`${name}: tyre touches road`));
   await page.screenshot({path:resolve(out,name+'.png')});results.push({name,...geometry});
  }
  await page.setViewportSize({width:1440,height:900});
  // Compare equal-position frames; only the photographic rims change.
  const wheelImages=[];
  for(const [name,angle,compression] of [['wheel-a',0,0],['wheel-b',.7,0],['squat',.7,1.8]]){
   await page.evaluate(({angle,compression})=>{Object.assign(__qa.roadsterMotion,{wheelAngle:angle,compression});__qa.render();},{angle,compression});
   const pixels=await page.screenshot({path:resolve(out,name+'.png'),clip:{x:345,y:685,width:145,height:90}});
   wheelImages.push(pixels);
  }
  assert.ok(!wheelImages[0].equals(wheelImages[1]),'rim rotation changes visible pixels');
  assert.ok(!wheelImages[1].equals(wheelImages[2]),'suspension changes visible body pixels');
  // Full integrated rocket cycles, accelerated with the real 120 Hz step.
  for(const scenario of ['success','launch-failure','landing-failure']){
   const timeline=await page.evaluate(scenario=>{
    const q=__qa,random=Math.random;Math.random=()=>scenario==='success'?.9:.1;
    q.setSceneTime(0);q.start();q.S.next=1e9;q.S.obs=[];
    Object.assign(q.rocket.state,{phase:scenario==='landing-failure'?'orbit':'ready',next:.1});
    const phases=[];
    try{
     for(let i=0;i<100*120;i++){
      q.step(1/120);
      const r=q.rocket.state;
      if(phases.at(-1)?.phase!==r.phase)phases.push({phase:r.phase,t:i/120});
      // Exercise effects throughout every phase, not just its first frame.
      if(i%30===0)q.render();
      if(scenario==='success'&&r.phase==='ready'&&r.events===2)break;
      if(scenario!=='success'&&r.phase==='ready'&&r.events>0)break;
     }
     return phases;
    }finally{Math.random=random;q.stop();}
   },scenario);
   const phases=timeline.map(s=>s.phase);
   assert.ok(phases.includes(scenario==='landing-failure'?'landing':'launch'));
   if(scenario==='success'){assert.ok(phases.includes('orbit'));assert.ok(phases.includes('landing'));}
   else {assert.ok(phases.includes('explosion'));assert.ok(phases.includes('delivery'));}
   assert.equal(phases.at(-1),'ready');results.push({scenario,timeline});
  }
  // Visible in-scene rocket states at the actual atmospheric depth.
  for(const [name,phase,t] of [['launch','launch',7],['land','landing',12],['explosion','explosion',1.2],['delivery','delivery',7]]){
   await page.evaluate(({phase,t})=>{const q=__qa;q.S.y=0;q.S.charging=false;q.B.factor=1;q.B.state='ready';q.S.particles=[];q.CAMEO.active=false;Object.assign(q.rocket.state,{phase,t,pass:.25,crashLift:.09,kind:'landing'});q.render();},{phase,t});
   await page.screenshot({path:resolve(out,'rocket-'+name+'.png')});
  }
  for(const review of ['flip','spaceport']){await load('?review='+review);await page.screenshot({path:resolve(out,review+'.png')});}
  assert.deepEqual(errors,[]);
  writeFileSync(resolve(out,'results.json'),JSON.stringify({errors,results},null,2));
  console.log(JSON.stringify({checks:results.length,errors,out}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
