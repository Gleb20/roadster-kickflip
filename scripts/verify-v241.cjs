const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {mkdirSync,writeFileSync,readFileSync}=require('node:fs');const {resolve}=require('node:path');const assert=require('node:assert/strict');
const out=resolve(process.argv[2]||'/tmp/tesla-v241-review');mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined});const errors=[],results=[];
try{
 const page=await browser.newPage({viewport:{width:390,height:740},isMobile:true,hasTouch:true});
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});await page.route('**/favicon.ico',r=>r.fulfill({status:204}));
 await page.addInitScript(()=>{
  window.__audioContexts=[];window.__audioSession={type:'auto'};window.__sessionChanges=[];
  Object.defineProperty(navigator,'audioSession',{value:{get type(){return __audioSession.type},set type(t){__audioSession.type=t;__sessionChanges.push(t)}}});
  const Original=AudioContext;window.AudioContext=class extends Original{constructor(...args){super(...args);__audioContexts.push(this)}};
 });
 const base=process.env.GAME_BASE_URL||'http://127.0.0.1:8766/';
 async function load(){await page.goto(base);await page.waitForFunction(()=>!document.querySelector('#start').disabled)}
 await load();assert.equal(await page.evaluate(()=>JSON.parse(render_game_to_text()).version),'2.4.1');
 await page.locator('#sound').tap();await page.waitForFunction(()=>__audioContexts[0]?.state==='running');
 assert.equal(await page.evaluate(()=>navigator.audioSession.type),'playback');
 await page.locator('#start').tap();await page.evaluate(()=>{__qa.S.next=1e9;__qa.S.obs=[]});
 // Reproduce a suspended output and use a real touch to resume it.
 await page.evaluate(()=>__audioContexts[0].suspend());
 await page.touchscreen.tap(220,330);await page.waitForFunction(()=>__audioContexts[0].state==='running');
 await page.waitForFunction(()=>__qa.S.y>30);
 await page.screenshot({path:resolve(out,'real-touch-jump.png')});
 await page.waitForFunction(()=>__qa.S.y===0&&__qa.thrusters.activeClouds>0);
 assert.equal(await page.evaluate(()=>__qa.S.particles.some(p=>p.c==='#d9ff62')),false);
 await page.waitForTimeout(110);await page.screenshot({path:resolve(out,'landing-cloud.png')});
 await page.waitForFunction(()=>__qa.thrusters.activeClouds===0);
 await page.locator('#sound').tap();assert.equal(await page.evaluate(()=>navigator.audioSession.type),'auto');
 results.push({audio:'real AudioContext suspend -> touch resume; playback session on opt-in and release on mute',landing:'real touch jump, cloud, no green landing particles, bounded cleanup'});
 // Pixel regression: a solid magenta midground cannot leak below the near terrain.
 const baseline=process.env.BASELINE_ENVIRONMENT;
 if(baseline)await page.route('**/environment-baseline.js',r=>r.fulfill({contentType:'application/javascript',body:readFileSync(baseline,'utf8')}));
 for(const [name,W,H] of [['iphone-browser',390,740],['portrait',390,844],['landscape',844,390],['desktop',1440,900]]){
  await page.setViewportSize({width:W,height:H});
  for(const roadDistance of [0,321,1140]){
   const pixels=await page.evaluate(async({W,H,roadDistance,baseline})=>{
    const {createEnvironmentRenderer}=await import('./src/environment.js?v=2.4.1');
    const zoom=Math.max(.72,Math.min(1.15,Math.min(1.25,Math.max(.68,W/650),H/430))),ground=H*.84;
    function sample(create){const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');create().draw(g,{W,H,ground,scale:Math.min(1.25,Math.max(.68,W/650),H/430),roadDistance,sceneTime:0,rocketScene(){g.fillStyle='#ff00ff';g.fillRect(0,0,W,H)}});const y=Math.ceil(ground-29-5*zoom)+1,rows=Math.floor(ground)-y;const d=g.getImageData(0,y,W,rows).data;let leaks=0;for(let i=0;i<d.length;i+=4)if(d[i]===255&&d[i+1]===0&&d[i+2]===255)leaks++;return leaks}
    const after=sample(createEnvironmentRenderer);let before=null;if(baseline){const old=await import('./environment-baseline.js');before=sample(old.createEnvironmentRenderer)}return {before,after};
   },{W,H,roadDistance,baseline:!!baseline});
   if(baseline&&W<700&&H>500)assert.ok(pixels.before>0);assert.equal(pixels.after,0,`${name} distance ${roadDistance}`);results.push({viewport:name,roadDistance,...pixels});
  }
  await load();await page.locator('#start').tap();await page.evaluate(()=>{__qa.S.mode='paused';__qa.S.next=1e9;__qa.S.obs=[];document.querySelectorAll('#game > :not(canvas)').forEach(e=>e.style.setProperty('display','none','important'));Object.assign(__qa.rocket.state,{phase:'ready',t:5,pass:.12});__qa.render()});
  await page.screenshot({path:resolve(out,name+'-spaceport.png')});
 }
 // Contact sheet uses the actual thruster and car painters, including upright ends.
 await page.setViewportSize({width:900,height:660});await load();
 await page.evaluate(async()=>{
  const {createFlipSprite}=await import('./src/roadster-flip.js?v=2.4.1');const {createThrusterEffects}=await import('./src/thrusters.js?v=2.4.1');
  const car=createFlipSprite();await car.load();const fx=createThrusterEffects();const canvas=document.createElement('canvas');canvas.width=900;canvas.height=660;canvas.style='position:fixed;inset:0;z-index:99999;width:900px;height:660px';document.body.append(canvas);const g=canvas.getContext('2d');g.fillStyle='#172a34';g.fillRect(0,0,900,660);
  const phases=[0,.164,.29,.374,.45,.525,.643,.735,.853];
  phases.forEach((phase,i)=>{const x=(i%3)*300+150,y=Math.floor(i/3)*210+110;g.save();g.translate(x,y);g.scale(1.8,1.8);fx.drawJets(g,{phase,time:0,airborne:true});car.draw(g,0,0,phase);g.restore();g.fillStyle='#f4eedf';g.font='14px Arial';g.textAlign='center';g.fillText('POSE '+i,x,y+80)});
 });await page.screenshot({path:resolve(out,'thruster-poses.png')});
 await page.emulateMedia({reducedMotion:'reduce'});await load();await page.locator('#start').tap();await page.evaluate(()=>{__qa.S.next=1e9;__qa.S.obs=[]});await page.touchscreen.tap(250,300);await page.waitForFunction(()=>__qa.S.y>30);await page.screenshot({path:resolve(out,'reduced-motion.png')});
 assert.deepEqual(errors,[]);writeFileSync(resolve(out,'results.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({checks:results.length,errors}));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
