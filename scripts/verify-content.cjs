const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out=path.resolve(process.argv[2]||'/tmp/tesla-content-browser');fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined}),checks=[],errors=[];
 try{for(const [width,height] of [[1440,1100],[390,1100],[844,390]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:width<900,hasTouch:width<900}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await page.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));
  await page.goto(new URL('?review=obstacles',process.env.GAME_BASE_URL||'http://127.0.0.1:8766/').href);
  await page.waitForFunction(()=>window.render_game_to_text&&document.querySelector('#loading-screen').hidden);
  const info=await page.evaluate(async()=>{requestAnimationFrame=()=>0;const c=await import('./src/content.js?v=3.4.1');window.__qa?.setSceneTime(0);window.__qa?.render();return {count:c.OBSTACLES.length,errors:c.validateContent(),materials:[...document.images].filter(i=>i.src.includes('png')).every(i=>i.complete),version:JSON.parse(render_game_to_text()).version};});
  assert.equal(info.count,19);checks.push(`${width}x${height}: 19 definitions`);assert.deepEqual(info.errors,[]);checks.push(`${width}x${height}: content schema valid`);assert.equal(info.version,'3.4.1');checks.push(`${width}x${height}: current version`);
  await page.screenshot({path:path.join(out,`cast-${width}.png`)});await context.close();
 }
 assert.deepEqual(errors,[]);checks.push('no JS or console errors');fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks:checks.length,errors}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
