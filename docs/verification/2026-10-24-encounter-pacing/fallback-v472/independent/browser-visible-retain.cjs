const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/Users/liubavskii/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
const [out,url,durationText,version,offlineText]=process.argv.slice(2),duration=Number(durationText||180),offline=offlineText==='offline';
fs.mkdirSync(out,{recursive:true});
(async()=>{const {decideVisible}=await import(pathToFileURL(process.env.PACING_POLICY||path.join(__dirname,'observe-visible.mjs')));const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),errors=[],waves=[],samples=[],inputs=[],slides=[];
try{const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:offline?'allow':'block'});await context.route('https://anzybyamdtouzxouhziu.supabase.co/**',r=>r.abort());const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
await page.goto(url);const ready=()=>page.waitForFunction(()=>window.render_game_to_text&&!document.querySelector('#game').inert);await ready();if(offline){await page.waitForFunction(()=>navigator.serviceWorker.controller?.state==='activated',null,{timeout:90000});await context.setOffline(true);await page.reload();await ready();}
const read=()=>page.evaluate(()=>JSON.parse(render_game_to_text())),installed=await read();if(version&&installed.version!==version)throw Error('Installed '+installed.version+' expected '+version);
const qaAvailable=await page.evaluate(()=>typeof window.__qa!=='undefined'),cdp=await context.newCDPSession(page);let held=false;
const command=async a=>{if(a==='primary-down'){if(held)return;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:160,y:430,radiusX:4,radiusY:4,force:1}]});held=true;}
else if(a==='primary-up'||a==='primary-cancel'){if(!held)return;await cdp.send('Input.dispatchTouchEvent',{type:a==='primary-cancel'?'touchCancel':'touchEnd',touchPoints:[]});held=false;}else throw Error('Unexpected command '+a);};
await page.locator('#start').tap();const c={lastLand:0,plan:null,flying:null};let wasAir=false,wasGrind=false,airAt=0,spinStarted=false,lastWave=-1,lastSample=-1,lastShot=-1,catchAt=null;const began=Date.now();
while((Date.now()-began)/1000<duration*5){const s=await read();if(s.time>=duration||s.mode==='dead')break;if(s.mode==='paused'){inputs.push({time:s.time,event:'resume-after-frame-interruption'});await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});held=false;c.plan=null;await page.locator('#resume').tap();continue;}if(s.mode!=='playing')break;
 if(s.fall.active&&held){await command('primary-cancel');inputs.push({time:s.time,event:'release-on-fall'});}if(s.airborne&&!wasAir){airAt=s.time;spinStarted=false;}if(wasAir&&!s.airborne&&!s.grind.support){if(held)await command('primary-cancel');c.lastLand=s.time;c.plan=null;c.flying=null;spinStarted=false;}
 if(!wasGrind&&s.grind.support){if(held)await command('primary-cancel');catchAt={time:s.time,width:s.rails.find(r=>r.uid===s.grind.support)?.w,speed:s.speed};c.plan=null;c.flying=null;}
 if(wasGrind&&!s.grind.support&&catchAt){slides.push({...catchAt,seconds:s.time-catchAt.time});catchAt=null;}
 wasAir=s.airborne;wasGrind=!!s.grind.support;
 const actions=[],r={S:{t:s.time,tick:Math.round(s.time*120),speed:s.speed,obs:s.obstacles.map((o,i)=>({...o,id:o.type,x:o.dx,uid:o.uid??i+1000,passed:o.dx+o.w< -50})),rails:s.rails},P:{airborne:s.airborne,time:s.time-airAt,angle:s.angle,trickStarted:spinStarted},F:s.fall,G:s.grind,pace:{stumble:0},input:{charging:s.charging,charge:s.charge,spin:s.spinning},command:a=>{actions.push(a);if(a==='primary-down'){if(r.P.airborne)r.input.spin=true;else{r.input.charging=true;r.input.charge=0;}}else{r.input.charging=false;r.input.charge=0;r.input.spin=false;}}};
 // The public snapshot used to omit obstacle uid. Match objects across frames
 // by order/type until they leave; a new wave invalidates the previous plan.
 if(s.director.wave!==lastWave){lastWave=s.director.wave;c.plan=null;waves.push({time:s.time,...s.director,obstacles:s.obstacles,rails:s.rails,speed:s.speed,biome:s.biome.id});}
 decideVisible(r,c,(390-s.camera.x)/s.camera.scale);for(const a of actions){inputs.push({time:s.time,action:a,plan:c.flying??c.plan});await command(a);if(a==='primary-down'&&s.airborne)spinStarted=true;}
 if(Math.floor(s.time/10)>lastSample){lastSample=Math.floor(s.time/10);samples.push(s);fs.writeFileSync(out+'/progress.json',JSON.stringify({samples,waves,slides,errors},null,2));console.log(JSON.stringify({time:s.time,wave:s.director.wave,flips:s.flips,mode:s.mode,speed:s.speed}));}
 if(Math.floor(s.time/60)>lastShot){lastShot=Math.floor(s.time/60);await page.screenshot({path:out+'/play-'+lastShot+'.png'});}
 await page.waitForTimeout(15);
}
if(held)await command('primary-cancel');const end=await read();await page.screenshot({path:out+'/end.png'});fs.writeFileSync(out+'/result.json',JSON.stringify({url,version:end.version,offline,nativeTouch:true,qaAvailable,routeActionReads:0,visibleObjectsOnly:true,recognitionDelay:.12,noBlindFreestyle:true,publicScoreSubmissions:0,physicalDevice:false,end,waves,samples,slides,inputs,errors},null,2));console.log(JSON.stringify({time:end.time,version:end.version,mode:end.mode,waves:end.director.wave,flips:end.flips,errors}));
// Retain only this isolated profile's own finished replay for a failed pacing diagnostic.
if(process.env.PACING_RETAIN_REPLAY==='1'){
 try{await page.waitForFunction(()=>JSON.parse(render_game_to_text()).mode==='dead',null,{timeout:60000});const saved=await page.evaluate(()=>{const data=JSON.parse(localStorage.getItem('roadster-score-record-v1')||'null');return data?.result?{score:data.result.score,replay:data.result.replay}:null;});if(saved)fs.writeFileSync(out+'/own-finished-replay.json',JSON.stringify(saved,null,2),{mode:0o600});}
 catch(error){fs.writeFileSync(out+'/replay-retention-note.txt',String(error));}
}
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
