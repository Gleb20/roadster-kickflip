const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {mkdirSync,writeFileSync}=require('node:fs');
const {resolve}=require('node:path');
const assert=require('node:assert/strict');
const out=resolve(process.argv[2]||'/tmp/tesla-loading-review');mkdirSync(out,{recursive:true});
const base=process.env.GAME_BASE_URL||'http://127.0.0.1:8766/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined});
 const results=[],errors=[];
 async function page(options={}){
  const p=await browser.newPage({viewport:{width:1440,height:900},...options});
  p.on('pageerror',e=>errors.push(e.message));
  p.on('console',m=>{if(m.type()==='error'&&!p.expectedNetworkFailure)errors.push(m.text())});
  await p.route('**/favicon.ico',r=>r.fulfill({status:204}));return p;
 }
 async function ready(p){await p.waitForFunction(()=>document.getElementById('loading-screen').hidden);assert.equal(await p.locator('#game').getAttribute('inert'),null);assert.equal(await p.locator('#start').isEnabled(),true);}
 try{
  const p=await page();const pending=[];
  await p.route('**/*.png',r=>new Promise(resolve=>pending.push({url:r.request().url(),release:async()=>{await r.continue();resolve();}})));
  await p.goto(base,{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>typeof render_game_to_text==='function');
  for(let i=0;i<100&&pending.length<7;i++)await p.waitForTimeout(30);
  assert.equal(pending.length,7);
  assert.equal(await p.locator('#game').getAttribute('inert'),'');
  await p.keyboard.press('Space');
  assert.equal(await p.evaluate(()=>JSON.parse(render_game_to_text()).mode),'menu');
  assert.equal(await p.locator('#loading-progress').getAttribute('value'),'1');
  const poses=await p.evaluate(()=>new Promise(resolve=>{
   const seen=new Set(),begin=performance.now();function tick(){seen.add(document.querySelector('.loader-pose.is-active').dataset.pose);if(performance.now()-begin>2900)resolve([...seen]);else requestAnimationFrame(tick)}tick();
  }));assert.equal(poses.length,9);
  await pending[0].release();await p.waitForFunction(()=>document.querySelector('#loading-progress').value===2);
  assert.equal(await p.locator('.loader-segment.is-filled').count(),15);
  assert.equal(await p.locator('#loading-percent').textContent(),'25%');
  for(const [name,width,height] of [['desktop',1440,900],['portrait',390,740],['small-portrait',320,568],['landscape',844,390]]){
   await p.setViewportSize({width,height});await p.waitForTimeout(160);
   const fits=await p.locator('.loader-console').evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight});assert.equal(fits,true,name);
   await p.screenshot({path:resolve(out,name+'.png')});
  }
  // Freeze each real vector pose into a contact sheet for visual inspection.
  await p.setViewportSize({width:1080,height:960});
  await p.evaluate(()=>{
   const grid=document.createElement('div');grid.id='contact';grid.style='position:fixed;inset:0;z-index:1000;display:grid;grid-template-columns:repeat(3,1fr);background:#10151b;color:#f3f5f4';
   const style=document.createElement('style');style.textContent='#contact .loader-ink {animation:none;stroke-dashoffset:0} #contact .loader-base {opacity:0} #contact svg {width:320px;margin:auto}';grid.append(style);
   for(let i=0;i<9;i++){const svg=document.querySelector('.loader-instrument').cloneNode(true);svg.querySelectorAll('.loader-pose').forEach(el=>el.classList.toggle('is-active',el.dataset.pose===String(i)));grid.append(svg)}document.body.append(grid);
  });await p.screenshot({path:resolve(out,'nine-vector-poses.png')});await p.evaluate(()=>document.getElementById('contact').remove());
  for(let i=1;i<6;i++){await pending[i].release();await p.waitForFunction(n=>document.querySelector('#loading-progress').value===n,i+2);}
  assert.equal(await p.locator('#loading-percent').textContent(),'87%');assert.equal(await p.locator('#loading-screen').isVisible(),true);
  await pending[6].release();await ready(p);
  assert.equal(await p.locator('#loading-percent').textContent(),'100%');assert.equal(await p.locator('.loader-segment.is-filled').count(),60);
  await p.setViewportSize({width:390,height:740});await p.screenshot({path:resolve(out,'ready.png')});
  await p.click('#start');await p.evaluate(()=>{__qa.S.next=1e9;__qa.S.obs=[]});
  await p.keyboard.down('Space');await p.waitForTimeout(160);await p.keyboard.up('Space');await p.waitForFunction(()=>__qa.S.y>20);
  await p.click('#pause');assert.equal(await p.evaluate(()=>JSON.parse(render_game_to_text()).mode),'paused');await p.click('#resume');
  await p.click('#boost');assert.equal(await p.evaluate(()=>JSON.parse(render_game_to_text()).boost.state),'active');
  results.push({scenario:'stylesheet + seven independently released decoded assets',poses:poses.sort(),progress:[0,12,25,37,50,62,75,87,100],viewports:4,realInput:'start / charge / jump / pause / resume / boost'});await p.close();

  // A resource failure stays visible, and the native retry reloads successfully.
  const failed=await page();failed.expectedNetworkFailure=true;await failed.route('**/paper-cast.png',r=>r.fulfill({status:503,body:'unavailable'}));
  await failed.goto(base);await failed.waitForFunction(()=>document.getElementById('loading-screen').classList.contains('has-error'));
  assert.equal(await failed.locator('#loading-retry').isVisible(),true);assert.equal(await failed.locator('#start').isDisabled(),true);
  await failed.screenshot({path:resolve(out,'asset-error.png')});
  await failed.unroute('**/paper-cast.png');await failed.click('#loading-retry');await ready(failed);results.push({scenario:'asset failure -> visible retry -> successful reload'});await failed.close();

  const timeout=await page();const timedAssets=[];
  await timeout.addInitScript(()=>{const original=window.setTimeout;window.setTimeout=(fn,ms,...args)=>original(fn,ms===30000?400:ms,...args)});
  await timeout.route('**/*.png',r=>new Promise(resolve=>timedAssets.push(async()=>{await r.continue();resolve()})));
  await timeout.goto(base,{waitUntil:'domcontentloaded'});await timeout.waitForFunction(()=>document.querySelector('#loading-screen').classList.contains('has-error'));
  for(const release of timedAssets)await release();await timeout.waitForTimeout(500);
  assert.equal(await timeout.locator('#loading-screen').isVisible(),true);assert.equal(await timeout.locator('#start').isDisabled(),true);
  results.push({scenario:'30-second deadline (accelerated) stays failed after late material completion'});await timeout.close();

  const reduced=await page({reducedMotion:'reduce'});const delayed=[];
  await reduced.route('**/*.png',r=>new Promise(resolve=>delayed.push(async()=>{await r.continue();resolve()})));
  await reduced.goto(base,{waitUntil:'domcontentloaded'});await reduced.waitForTimeout(700);
  assert.equal(await reduced.locator('.loader-pose.is-active').getAttribute('data-pose'),'0');
  assert.equal(await reduced.locator('.loader-sweep').evaluate(e=>getComputedStyle(e).animationName),'none');
  await reduced.screenshot({path:resolve(out,'reduced-motion.png')});for(const release of delayed)await release();await ready(reduced);
  results.push({scenario:'reduced motion: static upright vector / no sweep, successful reveal'});await reduced.close();

  const critical=await page();let releaseCSS,releaseModule;
  await critical.route('**/style.css*',r=>new Promise(resolve=>{releaseCSS=async()=>{await r.continue();resolve()}}));
  await critical.route('**/src/loading.js*',r=>new Promise(resolve=>{releaseModule=async()=>{await r.continue();resolve()}}));
  await critical.goto(base,{waitUntil:'commit'});await critical.locator('#loading-title').waitFor();
  assert.equal(await critical.locator('#loading-screen').evaluate(e=>getComputedStyle(e).position),'fixed');
  assert.equal(await critical.locator('#loading-screen svg image').count(),0);
  assert.equal(await critical.locator('.loader-pose.is-active').count(),1);
  await critical.waitForFunction(()=>document.querySelector('#loading-screen').classList.contains('is-visible'));
  await critical.screenshot({path:resolve(out,'before-css-and-js.png'),timeout:5000});
  await releaseCSS();await releaseModule();await ready(critical);results.push({scenario:'inline instrument visible before game CSS, JS modules and images'});await critical.close();

  for(const path of ['**/src/main.js*','**/src/loading.js*']){
   const moduleFailure=await page();moduleFailure.expectedNetworkFailure=true;await moduleFailure.route(path,r=>r.fulfill({status:503,body:'unavailable'}));await moduleFailure.goto(base);
   await moduleFailure.locator('#loading-retry').waitFor({state:'visible'});assert.equal(await moduleFailure.locator('#loading-title').textContent(),'Loading failed');
   results.push({scenario:'module failure -> retry',module:path});await moduleFailure.close();
  }
  const cssFailure=await page();cssFailure.expectedNetworkFailure=true;await cssFailure.route('**/style.css*',r=>r.fulfill({status:503,body:'unavailable'}));await cssFailure.goto(base);await cssFailure.locator('#loading-retry').waitFor({state:'visible',timeout:35000});results.push({scenario:'stylesheet failure -> retry'});await cssFailure.close();
  const cached=await page();await cached.goto(base);await ready(cached);await cached.reload();await ready(cached);results.push({scenario:'normal first visit and repeat reload complete'});await cached.close();
  assert.deepEqual(errors,[]);
  writeFileSync(resolve(out,'results.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({scenarios:results.length,errors}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
