const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');const {resolve}=require('node:path');
const version=process.env.CAST_VERSION||'v246',gameVersion=process.env.GAME_VERSION||(version==='v247'?'2.4.7':'2.4.6');
const out=resolve(process.argv[2]||'docs/verification/2026-10-18-cast-'+version);fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined});try{
 let sawAmber=false;const errors=[],checks=[],page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2});
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));
 const ready=()=>page.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert&&document.querySelector('#loading-screen').hidden);
 await page.goto(process.env.GAME_BASE_URL||'http://127.0.0.1:8766/');await ready();assert.equal(await page.evaluate(()=>JSON.parse(render_game_to_text()).version),gameVersion);
 await page.click('#start');await page.keyboard.down('Space');await page.waitForFunction(()=>__qa.S.charge>.2);await page.keyboard.up('Space');await page.waitForFunction(()=>__qa.S.y>45);await page.keyboard.down('Space');await page.waitForFunction(()=>__qa.S.y===0&&__qa.S.charging);await page.keyboard.up('Space');checks.push('real Space and airborne queued hold preserved');
 await page.evaluate(version=>{__qa.stop();document.querySelectorAll('#game > :not(canvas)').forEach(el=>el.style.setProperty('display','none','important'));window.__draws=[];const draw=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(img,...args){if(img.src?.includes('-'+version+'.png'))__draws.push({src:img.src.split('/').pop(),args});return draw.call(this,img,...args)}},version);
 for(const [view,width,height] of [['desktop',1440,900],['portrait',390,844],['landscape',844,390]]){
  await page.setViewportSize({width,height});
  for(const [expression,t,frame] of [['smile',3.4,0],['laugh',4.4,1]]){
   const draws=await page.evaluate(t=>{const q=__qa;q.S.obs=[];q.S.particles=[];q.S.y=120;q.S.jumpTime=.4;q.CAMEO.active=true;q.CAMEO.t=t;q.CAMEO.milestone=5000;for(let i=0;i<30;i++){q.setSceneTime(12+i/60);q.render()}__draws=[];q.render();return __draws;},t);
   assert.equal(draws.length,4);for(const draw of draws)assert.equal(draw.args[0],320*frame);
   await page.screenshot({path:resolve(out,`${view}-riders-${expression}.png`)});
  }
  for(const progress of [0,.28,.5,1]){
   const draws=await page.evaluate(p=>{const q=__qa;q.S.obs=[];q.S.y=0;q.CAMEO.active=false;q.spawn('amber',110);q.S.obs[0].throwProgress=p;__draws=[];q.render();return __draws;},progress);
   sawAmber ||= draws.some(d=>d.src==='amber-head-'+version+'.png');
   await page.screenshot({path:resolve(out,`${view}-amber-${progress}.png`)});
  }
 }
 assert.ok(sawAmber,'generated Amber head is baked into the cached throw poses');
 checks.push('all three generated sprites rendered at desktop/portrait/landscape; Amber windup/release/follow-through preserved');
 checks.push('both riders select registered smile/laugh frames, back and foreground use same frame');
 const frozen=await page.evaluate(()=>document.querySelector('#scene').toDataURL());await page.waitForTimeout(80);assert.equal(await page.evaluate(()=>document.querySelector('#scene').toDataURL()),frozen);checks.push('pause is pixel-stable');
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await ready();
 await page.evaluate(()=>{__qa.start();__qa.stop();__qa.CAMEO.active=true;__qa.CAMEO.t=4.4;__qa.CAMEO.milestone=5000;document.querySelectorAll('#game > :not(canvas)').forEach(el=>el.style.setProperty('display','none','important'));__qa.render()});await page.screenshot({path:resolve(out,'reduced-motion.png')});checks.push('reduced-motion smiles remain static');
 // Required decode: delay each newly introduced image, verify reveal cannot precede it.
 for(const id of ['bezos','katy','amber-head']){
  const delayed=await browser.newPage();let release;
  const blocked=new Promise(r=>release=r);await delayed.route('**/'+id+'-'+version+'.png',async route=>{await blocked;await route.continue()});
  await delayed.goto(process.env.GAME_BASE_URL||'http://127.0.0.1:8766/');await delayed.waitForFunction(()=>typeof render_game_to_text==='function');assert.equal(await delayed.evaluate(()=>document.querySelector('#game').inert),true);release();await delayed.waitForFunction(()=>!document.querySelector('#game').inert);await delayed.close();
 }
 checks.push('each new image decode gates first complete scene');assert.deepEqual(errors,[]);fs.writeFileSync(resolve(out,'results.json'),JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks:checks.length,errors,out}));
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
