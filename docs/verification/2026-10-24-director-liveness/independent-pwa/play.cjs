const {chromium}=require('/Users/liubavskii/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
const out=process.argv[2],url=process.argv[3],duration=Number(process.argv[4]||150);
fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const errors=[],samples=[],changes=[];
try{const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});await c.route('https://anzybyamdtouzxouhziu.supabase.co/**',r=>r.abort());const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(url);await p.waitForFunction(()=>window.render_game_to_text&&!document.querySelector('#game').inert);await p.waitForFunction(()=>navigator.serviceWorker.controller?.state==='activated',null,{timeout:90000});await c.setOffline(true);await p.reload();await p.waitForFunction(()=>window.render_game_to_text&&!document.querySelector('#game').inert);const cd=await c.newCDPSession(p),state=()=>p.evaluate(()=>JSON.parse(render_game_to_text()));
const touch=down=>cd.send('Input.dispatchTouchEvent',{type:down?'touchStart':'touchEnd',touchPoints:down?[{id:1,x:160,y:430,radiusX:4,radiusY:4,force:1}]:[]});
await p.locator('#start').tap();let phase='ground',lastSample=-1,lastWave=-1,lastShot=-1,held=false;const began=Date.now();
while((Date.now()-began)/1000<duration){const s=await state();if(s.mode!=='playing')break;
if(s.director.wave!==lastWave){lastWave=s.director.wave;changes.push({time:s.time,wave:lastWave,kind:s.director.kind,obstacles:s.obstacles,speed:s.speed});}
if(Math.floor(s.time/10)>lastSample){lastSample=Math.floor(s.time/10);samples.push(s);fs.writeFileSync(out+'/progress.json',JSON.stringify({samples,changes,errors},null,2));console.log(JSON.stringify({time:s.time,wave:s.director.wave,flips:s.flips,phase,speed:s.speed,fall:s.fall.active,mode:s.mode}));}
if(Math.floor(s.time/60)>lastShot){lastShot=Math.floor(s.time/60);await p.screenshot({path:out+'/play-'+lastShot+'.png'});}
if(s.fall.active){if(held){await touch(false);held=false;}phase='ground';}
else if(!s.airborne){if(phase!=='charge'){if(held)await touch(false);await touch(true);held=true;phase='charge';}else if(s.charge>=.75){await touch(false);held=false;phase='launch';}}
else if(phase==='launch'||phase==='ground'){await touch(true);held=true;phase='spin';}
else if(phase==='spin'&&s.angle<=-5){await touch(false);held=false;phase='coast';}
await p.waitForTimeout(20);
}
if(held)await touch(false);const end=await state();await p.screenshot({path:out+'/end.png'});fs.writeFileSync(out+'/result.json',JSON.stringify({url,offline:true,nativeTouch:true,physicalDevice:false,publicScoreSubmissions:0,end,changes,samples,errors},null,2));console.log(JSON.stringify({end:{version:end.version,time:end.time,wave:end.director.wave,flips:end.flips,mode:end.mode},errors}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
