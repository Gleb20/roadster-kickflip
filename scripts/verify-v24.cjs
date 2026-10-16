const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {mkdirSync,writeFileSync}=require('node:fs');
const {resolve}=require('node:path');
const assert=require('node:assert/strict');
const out=resolve(process.argv[2]||'/tmp/tesla-v24-review');mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined});
 const errors=[],results=[];
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.route('**/favicon.ico',r=>r.fulfill({status:204}));
  await page.addInitScript(()=>{
   window.__tones=0;const start=OscillatorNode.prototype.start;
   OscillatorNode.prototype.start=function(...args){window.__tones++;return start.apply(this,args)};
  });
  async function load(query=''){
   await page.goto((process.env.GAME_BASE_URL||'http://127.0.0.1:8766/')+query);
   await page.waitForFunction(()=>document.querySelector('#loading-screen').hidden&&!document.querySelector('#start').disabled);
   assert.equal(await page.evaluate(()=>JSON.parse(render_game_to_text()).version),process.env.GAME_VERSION||require('../package.json').version);
  }
  async function noRussian(){assert.equal(await page.evaluate(()=>/[А-Яа-яЁё]/.test(document.body.textContent+Array.from(document.querySelectorAll('[aria-label]')).map(n=>n.ariaLabel).join(''))),false)}
  await load();await noRussian();assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'false');
  await page.locator('#sound').focus();await page.keyboard.press('Enter');
  await page.waitForFunction(()=>window.__tones>0);
  assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'true');
  await load();assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'true');
  assert.equal(await page.evaluate(()=>__tones),0);
  await page.click('#start');await page.locator('#start').blur();
  await page.evaluate(()=>{__qa.S.next=1e9;__qa.S.obs=[]});
  await page.waitForFunction(()=>__tones>0);
  await page.keyboard.down('Space');await page.waitForFunction(()=>__qa.S.charge>.9);await page.keyboard.up('Space');
  await page.waitForFunction(()=>__qa.S.y>50);await page.keyboard.press('p');await noRussian();
  assert.equal(await page.evaluate(()=>__qa.S.mode),'paused');await page.click('#resume');
  await page.click('#sound');const count=await page.evaluate(()=>__tones);
  await page.click('#boost');await page.waitForFunction(()=>__qa.B.factor>2);
  assert.equal(await page.evaluate(()=>__tones),count);
  await page.screenshot({path:resolve(out,'boost.png')});
  results.push({sound:'keyboard opt-in, WebAudio synthesis, persisted reload, user unlock and mute passed'});
  // Real-time controlled encounter, with an actual keyboard jump over Joe.
  await page.evaluate(()=>{__qa.start();__qa.S.next=1e9;__qa.S.obs=[];__qa.spawn('joe',600)});
  await page.waitForFunction(()=>JSON.parse(render_game_to_text()).joe?.dx<500);
  await page.screenshot({path:resolve(out,'joe-approach.png')});
  await page.waitForFunction(()=>JSON.parse(render_game_to_text()).joe?.dx<300);
  await page.screenshot({path:resolve(out,'joe-inhale.png')});
  await page.keyboard.down('Space');await page.waitForTimeout(120);await page.keyboard.up('Space');
  await page.waitForFunction(()=>JSON.parse(render_game_to_text()).joe?.dx<40);
  await page.screenshot({path:resolve(out,'joe-jump.png')});
  await page.waitForFunction(()=>JSON.parse(render_game_to_text()).joe?.dx< -210);
  await page.screenshot({path:resolve(out,'joe-depart.png')});
  await page.waitForFunction(()=>JSON.parse(render_game_to_text()).joe===null);
  assert.equal(await page.evaluate(()=>__qa.S.mode),'playing');
  await page.screenshot({path:resolve(out,'joe-settled.png')});
  results.push({encounter:'approach, inhale, real jump, meme/exhale, departure and cleanup passed'});
  // Freeze individual actual painters at useful points for visual inspection.
  for(const [name,phase,t,kind] of [['pad-ready','ready',10,'launch'],['tower-opening','launch',1,'launch'],['launch','launch',4,'launch'],['touchdown','ready',0,'landing'],['tower-closed','ready',3,'landing']]){
   await page.evaluate(({phase,t,kind})=>{__qa.S.mode='paused';document.querySelector('#paused').classList.add('hidden');Object.assign(__qa.rocket.state,{phase,t,kind,pass:.24,fail:false});__qa.render()},{phase,t,kind});
   await page.screenshot({path:resolve(out,name+'.png')});
  }
  for(const mode of ['spaceport','flip','obstacles']){await load('?review='+mode);await page.screenshot({path:resolve(out,mode+'.png')})}
  for(const [name,width,height] of [['portrait',390,844],['landscape',844,390]]){
   await page.setViewportSize({width,height});await load();await noRussian();
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.click('#start');await page.evaluate(()=>{__qa.S.next=1e9;__qa.S.obs=[]});
   await page.mouse.move(width*.4,height*.55);await page.mouse.down();await page.waitForTimeout(160);await page.mouse.up();
   await page.waitForFunction(()=>__qa.S.y>20);await page.screenshot({path:resolve(out,name+'.png')});
  }
  await page.emulateMedia({reducedMotion:'reduce'});await load();await page.click('#start');await page.evaluate(()=>{__qa.S.next=1e9;__qa.S.obs=[];__qa.spawn('joe',-100);__qa.render()});await page.screenshot({path:resolve(out,'reduced-motion.png')});
  await page.evaluate(()=>{__qa.S.mode='playing';__qa.S.obs=[];__qa.S.next=1e9;__qa.spawn('joe',0);__qa.step(1/120)});
  assert.equal(await page.evaluate(()=>__qa.S.mode),'dead');await noRussian();await page.click('#restart');assert.equal(await page.evaluate(()=>__qa.S.mode),'playing');
  assert.deepEqual(errors,[]);writeFileSync(resolve(out,'results.json'),JSON.stringify({results,errors},null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
