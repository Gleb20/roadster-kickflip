const {chromium}=require('/Users/liubavskii/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const out=process.cwd()+'/docs/verification/2026-10-22-enemies-v400';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Users/liubavskii/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});const checks=[],errors=[];
try{
 for(const [width,height] of [[390,844],[320,740],[844,390],[1440,900]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:width<900,isMobile:width<900});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8766/');await page.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert);
  if(width<900)await page.tap('#start');else await page.click('#start');
  await page.evaluate(()=>{requestAnimationFrame=()=>0;__qa.S.obs=[];__qa.S.next=1e9;});
  if(width<900)await page.touchscreen.tap(width*.5,height*.48);else await page.keyboard.press('Space');
  // With the display scheduler stopped, step the recorded native input explicitly.
  await page.evaluate(()=>{for(let i=0;i<12;i++)__qa.step(1/120);});assert.ok(await page.evaluate(()=>__qa.P.y>0),'native jump');checks.push(`native first input ${width}`);
  for(const id of ['xi','ufo','sikorsky','homelessRow']){
   const value=await page.evaluate(id=>{__qa.start(73);requestAnimationFrame=()=>0;__qa.S.obs=[];__qa.S.next=1e9;__qa.encounters.reset();if(id==='homelessRow')__qa.spawn(id,210);else __qa.encounters.show(id,200,id==='xi'?96:205);for(let i=0;i<12;i++)__qa.step(1/120);__qa.stop();document.querySelectorAll('#game > :not(canvas)').forEach(el=>el.style.setProperty('display','none','important'));__qa.render();return JSON.parse(render_game_to_text());},id);
   assert.equal(value.mode,'paused');if(id==='ufo')assert.ok(value.encounters.some(a=>a.id==='ufo'));
   await page.screenshot({path:`${out}/${width}-${id}.png`});checks.push(`render ${id} ${width}`);
  }
  // Pause must keep actor positions, head and bolts stable.
  const paused=await page.evaluate(()=>JSON.parse(render_game_to_text()).encounters);await page.evaluate(()=>{for(let i=0;i<120;i++)__qa.step(1/120);});assert.deepEqual(await page.evaluate(()=>JSON.parse(render_game_to_text()).encounters),paused);checks.push(`pause ${width}`);
  await context.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:1100}});page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8766/assets/concepts/enemies-v400/review.html');await page.waitForFunction(()=>document.querySelectorAll('article').length===15);await page.waitForFunction(()=>[...document.querySelectorAll('article img')].every(x=>x.complete&&x.naturalWidth));await page.screenshot({path:out+'/gallery.png',fullPage:true});checks.push('gallery 15 assets decoded');await page.selectOption('#cast','ufo');await page.waitForTimeout(250);await page.selectOption('#cast','xi');await page.waitForTimeout(250);checks.push('gallery switches scenario');
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/browser.json',JSON.stringify({checks,errors,scope:'Native jump input with deterministic local arranged encounter screenshots; browser emulation only.'},null,2));console.log(JSON.stringify({checks:checks.length,errors}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
