const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const out=path.resolve(process.argv[2]||'docs/verification/2026-10-23-camera/browser');fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),checks=[],errors=[],measurements=[];const check=(n,v)=>{assert.ok(v,n);checks.push(n);};try{
 for(const [width,height] of [[320,568],[390,844],[844,390],[1440,900]]){
 const c=await b.newContext({viewport:{width,height},hasTouch:true,isMobile:width<900}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
 await p.goto(process.env.GAME_BASE_URL||'http://127.0.0.1:8781/');await p.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert);await p.locator('#start').tap();
 await p.evaluate(()=>requestAnimationFrame=()=>0);await p.waitForTimeout(40);
 const prepare=async(progress)=>p.evaluate(progress=>{const q=__qa;q.start(123);q.S.next=1e9;q.pace.progress=progress;for(let i=0;i<900;i++)q.step(1/120);q.S.obs=[];q.encounters.reset();q.spawn('truck',400);q.CAMEO.active=false;q.refreshHUD();q.render();return JSON.parse(render_game_to_text());},progress);
 const start=await prepare(0),fast=await prepare(150);check(`${width}: zoom increases visible road`,start.camera.scale/fast.camera.scale>1.35);
 check(`${width}: road baseline stable during zoom`,start.camera.ground===fast.camera.ground);
 const control=await p.locator('#boost').boundingBox();check(`${width}: road above THRUST with margin`,fast.camera.ground<control.y-15);
 const pos=await p.evaluate(()=>{const q=__qa,ctx=document.querySelector('canvas').getContext('2d'),old=ctx.translate,positions=[];ctx.translate=function(x,y){positions.push([x,y]);return old.call(this,x,y);};q.render();ctx.translate=old;return positions;});
 check(`${width}: truck uses shared road baseline`,pos.some(([x,y])=>Math.abs(x-(fast.camera.x+400*fast.camera.scale))<.01&&Math.abs(y-fast.camera.ground)<.01));
 measurements.push({width,height,start:start.camera,fast:fast.camera,control});await p.screenshot({path:path.join(out,`fast-${width}.png`)});
 await p.locator('#pause').tap();const paused=await p.evaluate(()=>render_game_to_text());await p.evaluate(()=>{for(let i=0;i<60;i++)__qa.step(1/120);});check(`${width}: pause freezes camera`,paused===await p.evaluate(()=>render_game_to_text()));await p.locator('#resume').tap();
 for(const exit of ['pause','result']){
 await p.evaluate(exit=>{const q=__qa;q.CAMEO.active=true;q.CAMEO.t=4;q.CAMEO.milestone=10000;q.CAMEO.nextScore=15000;if(exit==='result'){q.S.mode='dead';document.querySelector('#result').classList.remove('hidden');}q.render();},exit);
 if(exit==='pause')await p.locator('#pause').tap();
 await p.locator(exit==='pause'?'#pause-home':'#result-home').tap();
 const home=await p.evaluate(()=>({cameo:{...__qa.CAMEO},state:JSON.parse(render_game_to_text())}));check(`${width}: ${exit} home clears cameo and fireworks`,!home.cameo.active&&home.cameo.t===0&&home.cameo.nextScore===5000);check(`${width}: ${exit} home restores initial zoom`,home.state.mode==='menu'&&home.state.camera.scale>fast.camera.scale*1.35&&home.state.camera.lift===0);
 await p.evaluate(()=>__qa.render());await p.screenshot({path:path.join(out,`home-${exit}-${width}.png`)});await p.locator('#start').tap();}
 // Native simultaneous jump and thruster input must retain independent roles.
 await p.evaluate(()=>{__qa.S.next=1e9;__qa.S.obs=[];});
 const cd=await c.newCDPSession(p),point=(id,x,y)=>({id,x,y,radiusX:5,radiusY:5,force:1});
 await cd.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point(1,width*.45,height*.5)]});await p.evaluate(()=>{for(let i=0;i<30;i++)__qa.step(1/120);});await cd.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await cd.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point(2,control.x+control.width/2,control.y+control.height/2)]});await p.evaluate(()=>{for(let i=0;i<4;i++)__qa.step(1/120);});check(`${width}: native jump and THRUST`,await p.evaluate(()=>__qa.P.airborne&&__qa.P.thrusting));
 await cd.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point(2,control.x+control.width/2,control.y+control.height/2),point(3,width*.45,height*.5)]});await p.evaluate(()=>__qa.step(1/120));check(`${width}: native concurrent grab and THRUST`,await p.evaluate(()=>__qa.input?.spin??(__qa.run.input.spin&&__qa.P.thrusting)));
 await cd.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await c.close();
 }
 check('no runtime errors',errors.length===0);fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({checks,errors,measurements,physicalPhone:false},null,2));console.log(JSON.stringify({checks:checks.length,errors}));
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
