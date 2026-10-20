const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const out=path.resolve(process.argv[2]||'/tmp/tesla-replay-browser');fs.mkdirSync(out,{recursive:true});
(async()=>{const {verifyReplay}=await import('../src/run.js'),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined}),checks=[],errors=[],runs=[];const check=(name,v)=>{assert.ok(v,name);checks.push(name);};
try{for(const [width,height] of [[390,844],[844,390],[1440,900]]){
 const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.GAME_BASE_URL||'http://127.0.0.1:8766/');await page.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert);await page.evaluate(()=>{requestAnimationFrame=()=>0;});await page.waitForTimeout(50);await page.evaluate(()=>__qa.start(73219));
 const step=n=>page.evaluate(n=>{for(let i=0;i<n;i++)__qa.step(1/120);__qa.refreshHUD();__qa.render();},n);
 await page.keyboard.down('Space');await step(24);await page.keyboard.up('Space');await page.keyboard.down('Space');await step(104);await page.keyboard.up('Space');await step(80);
 await page.keyboard.press('KeyP');const tick=await page.evaluate(()=>__qa.S.tick);await step(200);check(`${width}: paused wall time is not replay time`,await page.evaluate(t=>__qa.S.tick===t,tick));await page.keyboard.press('KeyP');
 await page.setViewportSize({width:width===390?414:width,height});await step(1800);const result=await page.evaluate(()=>({replay:__qa.run.replay(),score:__qa.S.score,ticks:__qa.S.tick,flips:__qa.E.flips,mode:__qa.S.mode}));
 check(`${width}: native inputs reach a completed attempt`,result.mode==='dead');check(`${width}: browser replay matches independent Node simulation`,JSON.stringify(verifyReplay(result.replay))===JSON.stringify({score:result.score,flips:result.flips,ticks:result.ticks}));
 runs.push(result);await context.close();
 }check('viewport/resizing leaves the same commands and outcome',runs.every(r=>JSON.stringify(r)===JSON.stringify(runs[0])));check('no runtime errors',errors.length===0);fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify({checks,errors,runs},null,2));console.log(JSON.stringify({checks:checks.length,errors}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
