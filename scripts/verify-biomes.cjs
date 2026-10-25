const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out=path.resolve(process.argv[2]||'/tmp/tesla-timed-biomes-browser');fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH}),checks=[],errors=[];
const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
try{for(const [label,width,height] of [['desktop',1440,900],['phone',390,844]]){
 const context=await browser.newContext({viewport:{width,height},hasTouch:label==='phone'}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.GAME_BASE_URL||'http://127.0.0.1:8899/');await page.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert&&document.querySelector('#loading-screen').hidden);
 await page.evaluate(()=>{requestAnimationFrame=()=>0;});await page.waitForTimeout(50);
 if(label==='phone')await page.locator('#start').tap();else await page.locator('#start').click();
 const state=()=>page.evaluate(()=>JSON.parse(render_game_to_text()));
 const step=async ticks=>page.evaluate(n=>{for(let i=0;i<n;i++)__qa.step(1/120);__qa.refreshHUD();__qa.render();},ticks);
 check(label+': native start enters play',(await state()).mode==='playing');
 await page.evaluate(()=>{__qa.start(17);__qa.S.next=1e9;__qa.S.obs=[];__qa.setTime(39);__qa.E.bonus=1000000;__qa.syncState();__qa.refreshHUD();__qa.render();});
 check(label+': million-point bonus before40 cannot switch biome',(await state()).biome.leg===0);
 await page.evaluate(()=>{__qa.E.bonus=0;__qa.setTime(40);__qa.syncState();__qa.refreshHUD();__qa.render();});let b=(await state()).biome;
 check(label+':40 starts factory independently of score',b.id==='tesla-factory'&&b.moving&&b.progress===0);
 check(label+': next switch lies between70 and90',b.nextAt>=70&&b.nextAt<=90);
 check(label+': HUD follows timed location',await page.locator('#biome-label').textContent()==='TESLA FACTORY');
 await step(90);await page.screenshot({path:path.join(out,label+'-transition.png')});
 if(label==='phone')await page.locator('#pause').tap();else await page.keyboard.press('KeyP');
 const paused=await state();await step(600);check(label+': pause freezes timer and boundary',JSON.stringify((await state()).biome)===JSON.stringify(paused.biome)&&(await state()).time===paused.time);
 if(label==='phone')await page.locator('#resume').tap();else await page.keyboard.press('KeyP');
 await step(720);check(label+': existing moving doorway completes',(await state()).biome.progress===1);await page.screenshot({path:path.join(out,label+'-factory.png')});
 const beforeResize=(await state()).biome.edgeAt;await page.setViewportSize({width:width+8,height});check(label+': resize retains world doorway',(await state()).biome.edgeAt===beforeResize);
 for(let n=0;n<4;n++){
  b=(await state()).biome;
  await page.evaluate(at=>{__qa.setTime(at-1/120);__qa.E.bonus+=1000000;__qa.syncState();__qa.refreshHUD();},b.nextAt);
  check(label+': bonus cannot skip leg'+b.leg,(await state()).biome.leg===b.leg);
  await page.evaluate(at=>{__qa.setTime(at);__qa.syncState();__qa.refreshHUD();__qa.render();},b.nextAt);
  const next=(await state()).biome;check(label+': exact deadline advances one leg'+next.leg,next.leg===b.leg+1&&next.nextAt-b.nextAt>=30&&next.nextAt-b.nextAt<=50);
 }
 await page.evaluate(()=>{__qa.start(932);__qa.refreshHUD();__qa.render();});check(label+': retry resets timer and spaceport',(await state()).time===0&&(await state()).biome.id==='spaceport'&&(await state()).biome.nextAt===40);
 await context.close();
}
check('no runtime errors',errors.length===0);console.log(JSON.stringify({checks:checks.length,errors}));
}finally{fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({checks,errors},null,2));await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
