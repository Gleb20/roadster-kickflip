const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.GAME_URL||'http://127.0.0.1:8766',out=path.resolve(process.argv[2]||'docs/verification/2026-10-23-pickup-motion/browser');fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),checks=[],errors=[];
const check=(name,ok)=>{assert.ok(ok,name);checks.push(name);};
try{for(const [width,height] of [[320,740],[390,844],[844,390],[1440,900]]){
 const c=await b.newContext({viewport:{width,height},hasTouch:width<900,isMobile:width<900}),p=await c.newPage();await c.route('https://anzybyamdtouzxouhziu.supabase.co/**',r=>r.abort());p.on('pageerror',e=>errors.push(e.message));await p.goto(base);await p.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert);await p.locator('#start').click();
 await p.addStyleTag({content:'#paused{visibility:hidden!important}'});
 const tick=async n=>p.evaluate(n=>{const q=__qa;q.S.mode='playing';for(let i=0;i<n;i++)q.step(1/120);q.stop();q.refreshHUD();q.render();},n);
 await p.evaluate(()=>{const q=__qa;q.stop();q.S.next=q.Q.nextAt=1e9;q.S.obs=[];q.Q.active={};q.Q.hearts=0;q.Q.pickups=[{id:'life',uid:42,x:220,y:175}];q.render();});
 await p.screenshot({path:path.join(out,`hover-${width}.png`)});
 const capture=await p.evaluate(()=>{const q=__qa;q.S.mode='playing';for(let i=0;i<120&&q.Q.pickups.length;i++)q.step(1/120);q.stop();q.refreshHUD();q.render();return {hearts:q.Q.hearts,pickups:q.Q.pickups.length,flights:q.boosterPainter.inspect(q.S.t,q.P)};});
 check(`${width}: sphere captures at expanded reach and immediately grants one chip`,capture.hearts===1&&capture.pickups===0&&capture.flights.length===1);
 check(`${width}: flight starts outside the rider at full size`,capture.flights[0].x>60&&capture.flights[0].size===1);
 await p.screenshot({path:path.join(out,`capture-${width}.png`)});
 const paused=await p.evaluate(()=>JSON.stringify(__qa.boosterPainter.inspect(__qa.S.t,__qa.P)));await p.waitForTimeout(150);check(`${width}: pause freezes collection flight`,await p.evaluate(saved=>JSON.stringify(__qa.boosterPainter.inspect(__qa.S.t,__qa.P))===saved,paused));
 await tick(18);const mid=await p.evaluate(()=>__qa.boosterPainter.inspect(__qa.S.t,__qa.P)[0]);check(`${width}: icon approaches torso and shrinks`,mid.x<capture.flights[0].x&&mid.size>0&&mid.size<1);await p.screenshot({path:path.join(out,`inflight-${width}.png`)});
 await tick(22);check(`${width}: flight finishes inside rider without another charge`,await p.evaluate(()=>__qa.Q.hearts===1&&__qa.boosterPainter.inspect(__qa.S.t,__qa.P).length===0));await p.screenshot({path:path.join(out,`collected-${width}.png`)});
 await p.evaluate(()=>{const q=__qa;q.Q.hearts=2;q.Q.pickups=[{id:'life',uid:43,x:100,y:104}];});await tick(1);check(`${width}: full inventory leaves the sphere uncollected`,await p.evaluate(()=>__qa.Q.pickups.length===1&&__qa.boosterPainter.inspect(__qa.S.t,__qa.P).length===0));
 await p.evaluate(()=>{const q=__qa;q.Q.hearts=0;q.Q.pickups=[{id:'life',uid:44,x:100,y:104},{id:'life',uid:45,x:105,y:104}];});await tick(1);check(`${width}: simultaneous pickups animate independently`,await p.evaluate(()=>__qa.Q.hearts===2&&__qa.boosterPainter.inspect(__qa.S.t,__qa.P).length===2));
 await p.evaluate(()=>{__qa.start(123);__qa.stop();__qa.render();});check(`${width}: restart clears collection flight`,await p.evaluate(()=>__qa.Q.hearts===0&&__qa.boosterPainter.inspect(__qa.S.t,__qa.P).length===0));await c.close();
 }
 const c=await b.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),p=await c.newPage();await c.route('https://anzybyamdtouzxouhziu.supabase.co/**',r=>r.abort());p.on('pageerror',e=>errors.push(e.message));await p.goto(base);await p.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert);await p.locator('#start').click();
 const first=await p.evaluate(()=>{const q=__qa;q.stop();q.S.next=q.Q.nextAt=1e9;q.S.obs=[];q.Q.pickups=[{id:'life',uid:80,x:100,y:104}];q.S.mode='playing';q.step(1/120);q.stop();q.render();return q.boosterPainter.inspect(q.S.t,q.P,true)[0];});
 const half=await p.evaluate(()=>{const q=__qa;q.S.mode='playing';for(let i=0;i<7;i++)q.step(1/120);q.stop();q.render();return q.boosterPainter.inspect(q.S.t,q.P,true)[0];});check('reduced motion uses stationary fading confirmation',first.x===half.x&&first.y===half.y&&half.size===1&&half.alpha<first.alpha);await c.close();check('no runtime errors',errors.length===0);
 fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({checks,errors,controlledSimulationFrames:true,physicalPhone:false},null,2));console.log(JSON.stringify({checks:checks.length,errors}));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
