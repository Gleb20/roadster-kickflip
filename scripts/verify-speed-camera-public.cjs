const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.GAME_URL||'https://gleb20.github.io/roadster-kickflip/?v=4.4.3',out=path.resolve(process.argv[2]||'docs/verification/2026-10-23-speed-camera/public');fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),checks=[],errors=[];const check=(n,v)=>{assert.ok(v,n);checks.push(n);};try{
 for(const [width,height] of [[390,844],[1440,900]]){
 const mobile=width<600,c=await b.newContext({viewport:{width,height},hasTouch:mobile,isMobile:mobile}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(base);await p.waitForFunction(()=>window.render_game_to_text&&!document.querySelector('#game').inert);
 check(`${width}: public version4.4.3 and QA seam unavailable`,await p.evaluate(()=>JSON.parse(render_game_to_text()).version==='4.4.3'&&typeof __qa==='undefined'));
 await p.waitForFunction(()=>navigator.serviceWorker.controller?.state==='activated',{},{timeout:90000});
 if(mobile)await p.locator('#start').tap();else await p.locator('#start').click();
 const cd=mobile?await c.newCDPSession(p):null,point={id:1,x:width*.45,y:height*.55,radiusX:5,radiusY:5,force:1};
 if(mobile)await cd.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});else await p.keyboard.down('Space');await p.waitForTimeout(150);if(mobile)await cd.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});else await p.keyboard.up('Space');
 await p.waitForFunction(()=>JSON.parse(render_game_to_text()).airborne);check(`${width}: native jump on public game`,true);
 const s=await p.evaluate(()=>JSON.parse(render_game_to_text())),button=await p.locator('#boost').boundingBox();check(`${width}: raised road clears controls`,s.camera.baseline<button.y-15);
 if(mobile)await p.locator('#pause').tap();else await p.keyboard.press('KeyP');
 const paused=await p.evaluate(()=>render_game_to_text());await p.waitForTimeout(180);check(`${width}: pause freezes public run and camera`,paused===await p.evaluate(()=>render_game_to_text()));
 if(mobile)await p.locator('#resume').tap();else await p.locator('#resume').click();check(`${width}: resume continues`,await p.evaluate(()=>JSON.parse(render_game_to_text()).mode==='playing'));
 if(mobile)await p.locator('#pause').tap();else await p.keyboard.press('KeyP');await p.locator('#pause-home').click();const home=await p.evaluate(()=>JSON.parse(render_game_to_text()));check(`${width}: Home resets camera`,home.mode==='menu'&&home.camera.lift===0&&home.camera.scale>=s.camera.scale);
 await p.screenshot({path:path.join(out,`home-${width}.png`)});await c.setOffline(true);await p.reload();await p.waitForFunction(()=>window.render_game_to_text&&!document.querySelector('#game').inert);
 check(`${width}: cold offline launch has exact new version`,await p.evaluate(()=>JSON.parse(render_game_to_text()).version==='4.4.3'));if(mobile)await p.locator('#start').tap();else await p.locator('#start').click();check(`${width}: offline attempt starts`,await p.evaluate(()=>JSON.parse(render_game_to_text()).mode==='playing'));await p.screenshot({path:path.join(out,`offline-${width}.png`)});await c.close();}
 check('no runtime errors',errors.length===0);fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({checks,errors,physicalPhone:false,publicFixtureScores:0},null,2));console.log(JSON.stringify({checks:checks.length,errors}));
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
