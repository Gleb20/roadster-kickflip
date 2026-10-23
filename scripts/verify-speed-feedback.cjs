const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const out=path.resolve(process.argv[2]||'docs/verification/2026-10-18-speed-feedback');fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined});const checks=[],errors=[],measurements=[];try{
 const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await page.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));
 await page.goto(process.env.GAME_BASE_URL||'http://127.0.0.1:8766/');await page.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert);await page.evaluate(()=>requestAnimationFrame=()=>0);await page.waitForTimeout(40);
 const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
 for(const [width,height] of [[390,844],[320,640],[844,390],[1440,900]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(60);
  for(const progress of [0,75,150]){
   const rows=[];
   for(const streak of [0,.05,.25]){
    const row=await page.evaluate(({progress,streak})=>{
     const q=__qa;q.start();q.S.next=1e9;q.pace.progress=progress;q.E.streak=streak;q.E.streakLeft=100;for(let i=0;i<900;i++){q.pace.progress=progress;q.step(1/120);}q.spawn('truck',1000);
     const read=()=>{const s=JSON.parse(render_game_to_text()),c=document.querySelector('#scene').getContext('2d'),translate=c.translate,px=innerWidth*(innerWidth<600?.24:.29);let x;
      c.translate=function(a,b){if(this===c&&Math.abs(b-s.camera.ground)<.001&&a>px)x=a;return translate.call(this,a,b);};try{q.render();}finally{c.translate=translate;}
      return {x,dx:q.obstacleDx(q.S.obs[0]),...s};};
     // Hold the base ramp steady to isolate earned speed from camera motion.
     const before=read();for(let i=0;i<30;i++){q.pace.progress=progress;q.step(1/120);}const after=read();return {progress,streak,scale:after.camera.scale,logical:(before.dx-after.dx)/.25,pixels:(before.x-after.x)/.25,road:(after.camera.roadScroll-before.camera.roadScroll)/.25,feedback:after.speedFeedback};
    },{progress,streak});rows.push(row);measurements.push({width,height,...row});
   }
   for(const row of rows.slice(1)){
    check(`${width}x${height} / ${progress}s / +${row.streak*100}% actual obstacle motion`,Math.abs(row.pixels/rows[0].pixels-(1+row.streak))<.002);
    check(`${width}x${height} / ${progress}s / +${row.streak*100}% road follows obstacles`,Math.abs(row.road-row.pixels)<.1);
    check(`${width}x${height} / ${progress}s / +${row.streak*100}% no compensating zoom`,Math.abs(row.scale-rows[0].scale)<1e-9);
    check(`${width}x${height} / ${progress}s / +${row.streak*100}% face only at actual limit`,row.feedback.impossibru===(progress===150&&row.streak===.25));
   }
  }
 }
 for(const [name,width,height] of [['mobile',390,844],['landscape',844,390]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(60);
  for(const streak of [0,.05,.25]){
   await page.evaluate(streak=>{const q=__qa;q.start();q.S.next=1e9;q.pace.progress=150;q.E.streak=streak;q.E.streakLeft=100;for(let i=0;i<900;i++){q.pace.progress=150;q.step(1/120);}q.S.obs=[];q.spawn('truck',350);q.setSceneTime(12);q.refreshHUD();q.render();},streak);await page.waitForTimeout(260);await page.screenshot({path:path.join(out,`${name}-${Math.round(streak*100)}.png`)});
  }
 }
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(60);
 await page.evaluate(()=>{__qa.start();__qa.S.next=1e9;});const step=n=>page.evaluate(n=>{for(let i=0;i<n;i++)__qa.step(1/120);__qa.refreshHUD();__qa.render();},n);
 await page.keyboard.down('Space');await step(24);await page.keyboard.up('Space');await page.keyboard.down('Space');await step(96);await page.keyboard.up('Space');await step(160);
 const landed=await page.evaluate(()=>JSON.parse(render_game_to_text()));check('native manual flip earns real five percent speed without extreme face',landed.lastLanding?.good&&landed.flips===1&&Math.abs(landed.speed/landed.baseSpeed-1.05)<1e-9&&!landed.speedFeedback.impossibru);
 await page.waitForTimeout(260);await page.screenshot({path:path.join(out,'native-first-flip.png')});
 check('zero page/console errors',errors.length===0);fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify({checks,errors,measurements,nativeLanding:landed},null,2));console.log(JSON.stringify({checks:checks.length,errors,topMobile:measurements.filter(r=>r.width===390&&r.progress===150)}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
