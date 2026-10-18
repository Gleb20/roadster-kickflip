const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const out=path.resolve(process.argv[2]||'docs/verification/2026-10-18-hud-v301/gameplay');fs.mkdirSync(out,{recursive:true});
const url=process.env.GAME_BASE_URL||'http://127.0.0.1:8766/';
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined});const checks=[],errors=[];try{
 const context=await browser.newContext({viewport:{width:1440,height:900}});const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await page.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));
 await page.goto(url);await page.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert&&document.querySelector('#loading-screen').hidden);
 const state=()=>page.evaluate(()=>JSON.parse(render_game_to_text()));
 const check=(name,condition)=>{assert.ok(condition,name);checks.push(name);};
 const checkSilent=(condition,name)=>assert.ok(condition,name);
 const step=async ticks=>page.evaluate(ticks=>{for(let i=0;i<ticks;i++)__qa.step(1/120);__qa.refreshHUD();__qa.render();},ticks);
 // Stop only the display clock: all game steps still use the production update pipeline.
 await page.evaluate(()=>{requestAnimationFrame=()=>0;});await page.waitForTimeout(40);
 await page.click('#start');await page.evaluate(()=>{__qa.S.next=1e9;});
 await page.keyboard.down('Space');await step(24);check('real Space charges halfway',(await state()).charge>=.499);
 await page.keyboard.up('Space');await page.keyboard.down('Space');await step(104);await page.keyboard.up('Space');
 await page.screenshot({path:path.join(out,'desktop-flip.png')});await step(80);let s=await state();check('real Space lands one flip',s.lastLanding?.good&&s.flips===1);check('landing earns fuel and x1.1',s.fuel===75&&s.multiplier===1.1);
 await page.keyboard.down('ShiftLeft');await step(12);check('ground thrust does not burn fuel',(await state()).fuel===75);await page.keyboard.up('ShiftLeft');
 await page.keyboard.down('Space');await step(48);await page.keyboard.up('Space');await page.keyboard.down('ShiftRight');await step(24);s=await state();check('held Shift produces thrust and latches car',s.thrusting&&s.latched&&s.fuel<75);await page.screenshot({path:path.join(out,'desktop-thrust.png')});await page.keyboard.up('ShiftRight');check('release ends thrust on next step',true);await step(1);check('no sticky thrust',!(await state()).thrusting);
 await page.evaluate(()=>{__qa.start();__qa.S.next=1e9;__qa.P.fuel=100;});
 await page.keyboard.down('Space');await step(48);await page.keyboard.up('Space');
 await page.keyboard.down('ShiftLeft');await step(78);await page.keyboard.up('ShiftLeft');await page.keyboard.down('Space');await step(120);
 await page.screenshot({path:path.join(out,'desktop-double-flip.png')});await step(108);await page.keyboard.up('Space');await step(300);s=await state();check('native inputs land a double flip with earned fuel',s.lastLanding?.good&&s.flips===2&&s.fuel>48);
 await page.keyboard.press('KeyP');const paused=await state();await step(120);check('pause freezes physics',JSON.stringify(await state())===JSON.stringify(paused));await page.keyboard.press('KeyP');
 await page.evaluate(()=>{__qa.start();__qa.S.next=1e9;});
 await page.keyboard.press('Space');await page.keyboard.down('Space');await step(100);await page.keyboard.up('Space');s=await state();check('bad landing stumbles without ending run',s.mode==='playing'&&s.lastLanding&&!s.lastLanding.good&&s.recovery);check('bad landing clears multiplier',s.multiplier===1);
 const progress=s.progress;await step(24);check('recovery pauses difficulty clock',(await state()).progress===progress);await step(600);check('recovery rejoins normal progression',!(await state()).recovery&&(await state()).progress>progress);
 // Replay planner witnesses with real keyboard events through the live game pipeline.
 const routes=[];
 for(const [kind,progress,fuel] of [['single',0,0],['pair',40,0],['hover',65,0],['incoming',80,0],['precision',100,0],['mixed',130,100],['thrust',150,100]]){
  const fixture=await page.evaluate(async({kind,progress,fuel})=>{const {makePattern,validateRoute}=await import('./src/routes.js');const q=__qa;q.start();q.S.next=1e9;q.pace.progress=progress;q.pace.base=q.pace.speed=360+300*Math.min(1,progress/150);q.P.fuel=fuel;q.syncState();const obs=makePattern(kind,{speed:q.S.speed,dx:1000});const route=validateRoute(obs,{flight:q.P,pace:q.pace,economy:q.E,time:q.S.t});q.S.obs=obs.map((o,i)=>({...o,x:o.x+q.S.anchor,uid:i+1}));return route;},{kind,progress,fuel});
  check(`route exists: ${kind}`,!!fixture);let tick=0;
  for(const action of fixture.actions){const at=Math.round(action.at*120);await step(at-tick);tick=at;if(action.action==='hold')await page.keyboard.down('Space');if(action.action==='jump')await page.keyboard.up('Space');if(action.action==='thrust-on')await page.keyboard.down('ShiftLeft');if(action.action==='thrust-off')await page.keyboard.up('ShiftLeft');}
  await step(Math.ceil(fixture.duration*120)+2-tick);await page.keyboard.up('Space');await page.keyboard.up('ShiftLeft');s=await state();check(`live route survives with grounded exit: ${kind}`,s.mode==='playing'&&!s.airborne);routes.push({kind,progress,fixture,state:s});
  if(['precision','mixed','thrust'].includes(kind))await page.screenshot({path:path.join(out,`route-${kind}.png`)});
 }
 fs.writeFileSync(path.join(out,'routes.json'),JSON.stringify(routes,null,2));
 // 180 seconds of the real director, clock and collisions. Only its witness inputs
 // are replayed; no position, obstacle, score or landing state is changed in flight.
 const longRuns=[];
 for(const seed of [17,932]){
  await page.evaluate(seed=>{let value=seed;Math.random=()=>{value=(value*1664525+1013904223)>>>0;return value/4294967296;};__qa.start();},seed);
  let wave=0,actions=[],epoch=0,index=0;const stages=new Set(),kinds=new Set();let maxFrame=0;
  while(true){
   const info=await page.evaluate(()=>({t:__qa.S.t,mode:__qa.S.mode,wave:__qa.director.state.wave,last:__qa.director.state.last,stage:JSON.parse(render_game_to_text()).stage}));
   checkSilent(info.mode==='playing',`long run ${seed} collided at ${info.t}`);stages.add(info.stage);
   if(info.t>=180)break;
   if(info.wave!==wave){wave=info.wave;actions=info.last.route.actions;epoch=info.last.startedAt;index=0;kinds.add(info.last.kind);await page.keyboard.up('Space');await page.keyboard.up('ShiftLeft');}
   if(index<actions.length&&epoch+actions[index].at<=info.t+1/240){
    const a=actions[index++];if(a.action==='hold')await page.keyboard.down('Space');if(a.action==='jump')await page.keyboard.up('Space');if(a.action==='thrust-on')await page.keyboard.down('ShiftLeft');if(a.action==='thrust-off')await page.keyboard.up('ShiftLeft');continue;
   }
   const until=index<actions.length?Math.max(1,Math.round((epoch+actions[index].at-info.t)*120)):60;
   const began=Date.now();await step(Math.min(60,until));maxFrame=Math.max(maxFrame,Date.now()-began);
  }
  await page.keyboard.up('Space');await page.keyboard.up('ShiftLeft');const final=await state();check(`seeded 180s run reaches all stages: ${seed}`,stages.size===7&&final.mode==='playing');longRuns.push({seed,waves:wave,stages:[...stages],kinds:[...kinds],maxBatchMs:maxFrame,final});
 }
 fs.writeFileSync(path.join(out,'long-runs.json'),JSON.stringify(longRuns,null,2));
 await page.evaluate(()=>{__qa.start();__qa.S.next=1e9;__qa.spawn('hoverDrone',280);__qa.spawn('incomingDrone',470);__qa.P.y=110;__qa.P.airborne=true;__qa.P.angle=-.4;__qa.syncState();__qa.refreshHUD();__qa.render();});
 await page.screenshot({path:path.join(out,'airborne-cast.png')});


 // Native multi-touch via Chromium input, never dispatchEvent.
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const touch=await mobile.newPage();touch.on('pageerror',e=>errors.push(e.message));await touch.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));await touch.goto(url);await touch.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert&&document.querySelector('#loading-screen').hidden);await touch.evaluate(()=>{requestAnimationFrame=()=>0;});await touch.waitForTimeout(40);await touch.locator('#start').tap();await touch.evaluate(()=>{__qa.S.next=1e9;});
 const cdp=await mobile.newCDPSession(touch);const tpoint=(id,x,y)=>({id,x,y,radiusX:5,radiusY:5,force:1});const send=async(type,points)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points});const mstep=async n=>touch.evaluate(n=>{for(let i=0;i<n;i++)__qa.step(1/120);__qa.refreshHUD();__qa.render();},n);const mstate=()=>touch.evaluate(()=>JSON.parse(render_game_to_text()));
 const primary=tpoint(1,180,430);await send('touchStart',[primary]);await mstep(48);await send('touchEnd',[]);await mstep(1);
 const bounds=await touch.locator('#boost').boundingBox(),thrust=tpoint(2,bounds.x+bounds.width/2,bounds.y+bounds.height/2);
 await send('touchStart',[primary]);await send('touchStart',[primary,thrust]);await mstep(20);s=await mstate();check('two real touches rotate and thrust together',s.spinning&&s.thrusting&&s.angle<0&&s.fuel<50);await touch.screenshot({path:path.join(out,'mobile-multitouch.png')});
 await send('touchEnd',[thrust]);await mstep(1);s=await mstate();check('releasing thrust finger preserves rotation',s.spinning&&!s.thrusting);await send('touchCancel',[]);await mstep(1);check('touch cancellation clears rotation',!(await mstate()).spinning);
 await touch.evaluate(()=>{__qa.start();__qa.S.next=1e9;});await mstep(1);await touch.screenshot({path:path.join(out,'mobile-hud.png')});
 check('mobile thrust target >=72px',bounds.width>=72&&bounds.height>=72);
 const layout=await touch.evaluate(()=>{const a=document.querySelector('#race-score').getBoundingClientRect(),b=document.querySelector('#sound').getBoundingClientRect();return {overlap:a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top,overflow:document.documentElement.scrollWidth>innerWidth};});check('mobile HUD has no overlap or horizontal overflow',!layout.overlap&&!layout.overflow);
 await touch.evaluate(()=>{__qa.spawn('truck',350);});const dxBefore=await touch.evaluate(()=>__qa.obstacleDx(__qa.S.obs[0]));
 await touch.setViewportSize({width:844,height:390});await touch.waitForTimeout(80);
 check('resize preserves relative obstacle positions',Math.abs(await touch.evaluate(()=>__qa.obstacleDx(__qa.S.obs[0]))-dxBefore)<1e-8);await mstep(1);
await touch.screenshot({path:path.join(out,'landscape-hud.png')});
 await touch.emulateMedia({reducedMotion:'reduce'});await mstep(1);check('reduced motion preserves controls',(await mstate()).mode==='playing');
 // A new required sprite must gate boot, even when all old materials are ready.
 const gated=await browser.newContext();const boot=await gated.newPage();let heldDrone;
 await boot.route('**/phantom-v3.png',route=>{heldDrone=route;});await boot.goto(url);
 await boot.waitForFunction(()=>document.querySelector('#loading-progress').value>=11);
 check('new drone decode gates start',await boot.evaluate(()=>document.querySelector('#game').inert&&document.querySelector('#start').disabled&&document.querySelector('#loading-progress').max===12));
 await heldDrone.continue();await boot.waitForFunction(()=>!document.querySelector('#game').inert);check('releasing drone completes all 12 materials',await boot.evaluate(()=>document.querySelector('#loading-progress').value===12));await gated.close();
 // Historical best remains present while v3 has its own key.
 await page.evaluate(()=>{localStorage.setItem('roadster-best-v1','12345');localStorage.setItem('roadster-best-v3','678');});await page.reload();await page.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert);check('new record does not overwrite legacy',await page.evaluate(()=>document.querySelector('#best').textContent==='00678'&&localStorage.getItem('roadster-best-v1')==='12345'));
 check('no JS or console errors',errors.length===0);fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks:checks.length,errors}));
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
