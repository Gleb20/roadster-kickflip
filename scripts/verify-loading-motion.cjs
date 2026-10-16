const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {createServer}=require('node:http');const {readFile,mkdir,writeFile}=require('node:fs/promises');
const {resolve,extname,sep}=require('node:path');const assert=require('node:assert/strict');
const root=resolve(process.env.GAME_SOURCE_ROOT||'.'),out=resolve(process.argv[2]||'/tmp/tesla-motion-review');
const key='roadster-materials-ready-v1';
(async()=>{
 await mkdir(out,{recursive:true});let delay=0,headDelay=0;
 // Real browser cache tests must not use Playwright routing: it disables HTTP cache.
 const server=createServer(async(req,res)=>{
  const name=new URL(req.url,'http://localhost').pathname;
  if(name==='/favicon.ico'){res.writeHead(204).end();return;}
  const file=resolve(root,'.'+(name==='/'?'/index.html':name));
  if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}
  try{
   const body=await readFile(file);const pause=name.endsWith('/collage-atlas.png')?Math.max(delay,headDelay):name.endsWith('.png')?delay:0;
   if(pause)await new Promise(r=>setTimeout(r,pause));
   res.writeHead(200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png'})[extname(file)]||'application/octet-stream','Cache-Control':name.endsWith('.html')||name==='/'?'no-cache':'public, max-age=86400'});res.end(body);
  }catch{res.writeHead(404).end();}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}/`;
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined});const errors=[],results=[];
 async function page(context){const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await p.addInitScript(()=>{
   window.__loaderMotion={shownAt:null,leavingAt:null,hiddenAt:null,opacity:[]};
   addEventListener('DOMContentLoaded',()=>{
    const screen=document.querySelector('#loading-screen'),console=screen.querySelector('.loader-console'),probe=__loaderMotion;
    function observe(){const t=performance.now();if(screen.classList.contains('is-visible')&&probe.shownAt===null)probe.shownAt=t;if(screen.classList.contains('is-leaving')&&probe.leavingAt===null)probe.leavingAt=t;if(screen.hidden&&probe.hiddenAt===null)probe.hiddenAt=t;}
    new MutationObserver(observe).observe(screen,{attributes:true});observe();
    function sample(){if(probe.hiddenAt!==null)return;probe.opacity.push({t:performance.now(),value:Number(getComputedStyle(console).opacity)});requestAnimationFrame(sample)}sample();
   });
  });return p;
 }
 async function complete(p){await p.waitForFunction(()=>document.querySelector('#loading-screen').hidden);assert.equal(await p.locator('#game').getAttribute('inert'),null);return p.evaluate(()=>({...__loaderMotion,resources:performance.getEntriesByType('resource').filter(e=>e.initiatorType==='img'||e.name.includes('/style.css')).map(e=>({name:new URL(e.name).pathname,transfer:e.transferSize,body:e.decodedBodySize}))}));}
 async function evict(context){const p=await context.newPage();const cdp=await context.newCDPSession(p);await cdp.send('Network.clearBrowserCache');await p.close();}
 try{
  const context=await browser.newContext({viewport:{width:390,height:740}});await evict(context);
  const first=await page(context);await first.goto(base,{waitUntil:'domcontentloaded'});
  await first.waitForFunction(()=>document.querySelector('#loading-percent').textContent==='100%'&&!document.querySelector('#loading-screen').hidden);
  await first.keyboard.press('Space');assert.equal(await first.evaluate(()=>JSON.parse(render_game_to_text()).mode),'menu');
  await first.waitForTimeout(300);await first.screenshot({path:resolve(out,'first-visit.png')});const cold=await complete(first);
  assert.ok(cold.leavingAt-cold.shownAt>=2980);assert.ok(cold.opacity.some(s=>s.value>0&&s.value<1),'smooth intermediate opacity');assert.ok(cold.resources.some(r=>r.transfer>0));
  results.push({scenario:'first network visit: smooth appearance, at least 3 seconds, no keyboard bypass',...cold});await first.close();
  const warm=await page(context);await warm.goto(base,{waitUntil:'domcontentloaded'});const cached=await complete(warm);
  assert.equal(cached.shownAt,null);assert.ok(cached.resources.length>=7);assert.ok(cached.resources.every(r=>r.transfer===0&&r.body>0),'real HTTP cache');
  assert.ok(cached.opacity.every(s=>s.value===0));results.push({scenario:'real HTTP cache: no loader appearance or opacity flash',...cached});
  await warm.reload({waitUntil:'domcontentloaded'});const reload=await complete(warm);assert.equal(reload.shownAt,null);results.push({scenario:'cached reload skips loader',...reload});
  await warm.evaluate(key=>localStorage.removeItem(key),key);await warm.close();
  const oldCache=await page(context);await oldCache.goto(base,{waitUntil:'domcontentloaded'});const noMarker=await complete(oldCache);assert.equal(noMarker.shownAt,null);results.push({scenario:'already cached materials without visit marker: no intro',...noMarker});await oldCache.close();
  await evict(context);delay=650;
  const miss=await page(context);await miss.goto(base,{waitUntil:'domcontentloaded'});await miss.waitForFunction(()=>document.querySelector('#loading-screen').classList.contains('is-visible'));await miss.waitForTimeout(250);await miss.screenshot({path:resolve(out,'returning-cache-miss.png')});
  const missed=await complete(miss);assert.ok(missed.shownAt!==null);assert.ok(missed.hiddenAt-missed.shownAt<2900);results.push({scenario:'returning visitor with evicted cache: loader only while needed, no three-second hold',...missed});await miss.close();delay=0;
  await context.close();
  const slowContext=await browser.newContext({viewport:{width:1440,height:900}});await evict(slowContext);headDelay=4100;
  const slow=await page(slowContext);await slow.goto(base,{waitUntil:'domcontentloaded'});await slow.waitForFunction(()=>document.querySelector('#loading-screen').classList.contains('is-visible'));await slow.waitForTimeout(3100);
  assert.equal(await slow.locator('#loading-screen').isVisible(),true);assert.equal(await slow.locator('#start').isDisabled(),true);assert.equal(await slow.locator('#loading-percent').textContent(),'85%');
  const long=await complete(slow);assert.ok(long.leavingAt-long.shownAt>3500);results.push({scenario:'first load longer than three seconds: face readiness still gates reveal',...long});await slowContext.close();headDelay=0;
  const reducedContext=await browser.newContext({reducedMotion:'reduce'});await evict(reducedContext);const reduced=await page(reducedContext);await reduced.goto(base,{waitUntil:'domcontentloaded'});await reduced.waitForFunction(()=>document.querySelector('#loading-screen').classList.contains('is-visible'));
  assert.equal(await reduced.locator('.loader-console').evaluate(e=>getComputedStyle(e).transitionDuration),'0s');assert.equal(await reduced.locator('.loader-pose.is-active').getAttribute('data-pose'),'0');const reducedTrace=await complete(reduced);assert.ok(reducedTrace.hiddenAt-reducedTrace.shownAt>=2980);results.push({scenario:'reduced motion: static three-second first visit',...reducedTrace});await reducedContext.close();
  const blockedContext=await browser.newContext();await evict(blockedContext);await blockedContext.addInitScript(()=>{Storage.prototype.getItem=function(){throw new Error('Storage unavailable')};Storage.prototype.setItem=function(){throw new Error('Storage unavailable')}});
  const blocked=await page(blockedContext);await blocked.goto(base,{waitUntil:'domcontentloaded'});await complete(blocked);await blocked.reload({waitUntil:'domcontentloaded'});const blockedCache=await complete(blocked);assert.equal(blockedCache.shownAt,null);results.push({scenario:'unavailable storage: successful first load and cached reload without intro',...blockedCache});await blockedContext.close();
  assert.deepEqual(errors,[]);await writeFile(resolve(out,'motion.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({scenarios:results.length,errors}));
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exit(1)});
