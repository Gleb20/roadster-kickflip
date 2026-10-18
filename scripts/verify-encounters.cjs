// Local Chromium regression: real keyboard/pointer/touch input, then controlled visual fixtures.
const assert=require('node:assert/strict');
const {mkdirSync,writeFileSync}=require('node:fs');const {resolve}=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const out=resolve(process.argv[2]||'docs/verification/2026-10-18-encounters');mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined});
 try{
 const errors=[],checks=[];
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2});
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.route('**/favicon.ico',route=>route.fulfill({status:204,body:''}));
 await page.goto(process.env.GAME_BASE_URL||'http://127.0.0.1:8766/');
 await page.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert&&document.querySelector('#loading-screen').hidden);
 await page.click('#start'); // Leave focus on the button to catch native Space clicks/restarts.
 await page.keyboard.down('Space');await page.waitForFunction(()=>__qa.S.charge>.2);await page.keyboard.up('Space');await page.waitForFunction(()=>__qa.S.y>45);
 assert.equal(await page.evaluate(()=>__qa.S.flips),1);checks.push('Space after focused Start charges and jumps without restarting');
 await page.keyboard.down('Space');assert.equal(await page.evaluate(()=>!!__qa.S.queuedCharge&&!__qa.S.charging&&__qa.S.charge===0),true);
 await page.waitForFunction(()=>__qa.S.y===0&&__qa.S.charging);await page.waitForFunction(()=>__qa.S.charge>.2);await page.keyboard.up('Space');assert.equal(await page.evaluate(()=>__qa.S.flips),2);checks.push('airborne Space hold waits for landing, then charges the next jump');
 await page.waitForFunction(()=>__qa.S.y>45);await page.mouse.move(900,400);await page.mouse.down();assert.equal(await page.evaluate(()=>!!__qa.S.queuedCharge),true);await page.mouse.up();assert.equal(await page.evaluate(()=>!!__qa.S.queuedCharge),false);
 await page.waitForFunction(()=>__qa.S.y===0);assert.equal(await page.evaluate(()=>__qa.S.charging),false);checks.push('release in flight cancels queued pointer charge without jumping on landing');
 // Restart resets obstacles between independent real-input scenarios.
 await page.evaluate(()=>__qa.start());await page.keyboard.press('ShiftLeft');assert.equal(await page.evaluate(()=>__qa.B.state),'active');checks.push('left Shift activates boost');
 await page.evaluate(()=>__qa.start());await page.keyboard.press('ShiftRight');assert.equal(await page.evaluate(()=>__qa.B.state),'active');checks.push('right Shift activates boost');
 await page.evaluate(()=>__qa.start());await page.mouse.down();await page.mouse.up();await page.waitForFunction(()=>__qa.S.y>45);await page.mouse.down();await page.waitForFunction(()=>__qa.S.y===0&&__qa.S.charging);await page.mouse.up();assert.equal(await page.evaluate(()=>__qa.S.flips),2);checks.push('mouse can prepare the next jump before landing');
 await page.waitForFunction(()=>__qa.S.y>45);await page.mouse.down();await page.keyboard.press('p');await page.mouse.up();assert.equal(await page.evaluate(()=>!__qa.S.queuedCharge&&!__qa.S.charging&&__qa.S.mode==='paused'),true);await page.click('#resume');checks.push('pause cancels held and queued input');
 await page.evaluate(()=>__qa.start());await page.keyboard.down('Space');await page.evaluate(()=>dispatchEvent(new Event('blur')));await page.keyboard.up('Space');assert.equal(await page.evaluate(()=>__qa.S.mode==='paused'&&!__qa.S.queuedCharge&&!__qa.S.charging),true);checks.push('blur cancels input and pauses');
 // Touch uses the browser input pipeline; no synthetic DOM pointerdown.
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>__qa.start());
 const cdp=await page.context().newCDPSession(page);
 const touch=async(type)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'||type==='touchCancel'?[]:[{x:270,y:420}]});
 await touch('touchStart');await page.waitForFunction(()=>__qa.S.charge>.2);await touch('touchEnd');await page.waitForFunction(()=>__qa.S.y>45);await touch('touchStart');await page.waitForFunction(()=>__qa.S.y===0&&__qa.S.charging);await touch('touchEnd');assert.equal(await page.evaluate(()=>__qa.S.flips),2);checks.push('touch hold in flight prepares and releases a second jump');
 await page.waitForFunction(()=>__qa.S.y>45);await touch('touchStart');await touch('touchCancel');assert.equal(await page.evaluate(()=>!__qa.S.queuedCharge&&!__qa.S.charging),true);checks.push('touch cancellation clears queued charge');
 // Instrument actual gun painter: four cannons and bounded screen-space notes.
 await page.evaluate(()=>{window.__art={guns:0,notes:0};const fill=CanvasRenderingContext2D.prototype.fill;CanvasRenderingContext2D.prototype.fill=function(...args){if(this.fillStyle==='#e3b952')__art.guns++;if(this.canvas.id==='scene'&&['#bfdb9d','#e2e8b8'].includes(this.fillStyle))__art.notes++;return fill.apply(this,args)}});
 await page.evaluate(()=>{__qa.stop();document.querySelectorAll('#game > :not(canvas)').forEach(el=>el.style.setProperty('display','none','important'))});
 for(const [name,width,height] of [['desktop',1440,900],['portrait',390,844],['landscape',844,390]]){
  await page.setViewportSize({width,height});
  for(const id of ['zuck','rogozin','cameo','amber']){
   for(const [phase,dx,y] of id==='zuck'||id==='rogozin'?[['approach',125,140],['overhead',-25,170],['depart',-130,70]]:[['pose',110,id==='cameo'?140:0]]){
    const result=await page.evaluate(({id,dx,y})=>{const q=__qa;q.S.obs=[];q.S.particles=[];q.S.y=y;q.S.jumpTime=.4;q.S.charging=false;q.B.factor=1;q.B.state='ready';q.CAMEO.active=id==='cameo';q.CAMEO.t=5;q.CAMEO.milestone=5000;if(id!=='cameo')q.spawn(id,dx);for(let i=0;i<30;i++){q.setSceneTime(10+i/60);q.render()}__art={guns:0,notes:0};q.render();return __art;},{id,dx,y});
    if(id==='zuck'){assert.equal(result.guns,4);assert.equal(result.notes,52);}
    else assert.equal(result.guns,0);
    await page.screenshot({path:resolve(out,`${name}-${id}-${phase}.png`)});
   }
  }
 }
 const frozen=await page.evaluate(()=>document.querySelector('#scene').toDataURL());await page.waitForTimeout(80);assert.equal(await page.evaluate(()=>document.querySelector('#scene').toDataURL()),frozen);checks.push('paused scene remains pixel-identical');
 checks.push('DPR 2 visual fixtures: desktop, portrait, landscape; approach, overhead, departure; four guns and 52 notes');
 await page.evaluate(()=>{__qa.S.obs=[];__qa.S.y=0;__qa.CAMEO.active=false;__art={guns:0,notes:0};__qa.render()});assert.equal(await page.evaluate(()=>__art.guns+__art.notes),0);checks.push('weapons and notes disappear after encounter');
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await page.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert&&document.querySelector('#loading-screen').hidden);
 await page.evaluate(()=>{__qa.start();__qa.stop();__qa.S.y=140;__qa.spawn('zuck',110);document.querySelectorAll('#game > :not(canvas)').forEach(el=>el.style.setProperty('display','none','important'));__qa.render()});await page.screenshot({path:resolve(out,'reduced-motion.png')});checks.push('reduced motion renders a sparse static cash exchange');
 assert.deepEqual(errors,[]);writeFileSync(resolve(out,'results.json'),JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks:checks.length,errors,out}));}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
