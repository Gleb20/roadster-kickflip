const {chromium,webkit}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const checks=[];const check=(name,value)=>{assert.ok(value,name);checks.push(name)};
const root=process.env.ROOT||process.cwd(),errors=[];
const server=http.createServer((req,res)=>{try{const n=new URL(req.url,'http://x').pathname.slice(1)||'index.html';if(n.includes('..'))throw Error();res.writeHead(200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.mp3':'audio/mpeg','.webmanifest':'application/manifest+json'})[path.extname(n)]||'application/json','Cache-Control':'no-store'}).end(fs.readFileSync(path.join(root,n)))}catch{res.writeHead(404).end()}});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=process.env.ENGINE==='webkit'?await webkit.launch():await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--autoplay-policy=document-user-activation-required']});const results=[];
try{for(const mix of (process.env.FAULT?[{effects:1,music:1}]:[{effects:1,music:1},{effects:.6,music:.4},{effects:1,music:0},{effects:0,music:1},{effects:0,music:0}])){
const c=await browser.newContext({viewport:{width:440,height:956},isMobile:true,hasTouch:true});await c.route('https://anzybyamdtouzxouhziu.supabase.co/**',r=>r.abort());
await c.addInitScript(({mix,fault})=>{
localStorage.setItem('roadster-started-once-v1','1');localStorage.setItem('roadster-lessons-v1',JSON.stringify({finished:true,skipped:false,lessons:{}}));localStorage.setItem('roadster-audio-v2',JSON.stringify(mix));
const Native=window.AudioContext||window.webkitAudioContext,originalConnect=AudioNode.prototype.connect,destinations=new WeakMap();window.__captured=[];
AudioNode.prototype.connect=function(to,...args){return originalConnect.call(this,destinations.get(to)||to,...args)};
class Captured extends Native{constructor(...args){super(...args);if(fault){const suspended=this.suspend(),resume=this.resume.bind(this);this.__resumeCalls=0;this.resume=()=>{this.__resumeCalls++;return this.__resumeCalls===1?new Promise(()=>{}):suspended.then(()=>resume())}}const analyser=this.createAnalyser();analyser.fftSize=2048;originalConnect.call(analyser,this.destination);destinations.set(this.destination,analyser);const gains=[],createGain=this.createGain.bind(this);this.createGain=()=>{const n=createGain();gains.push(n);return n};window.__captured.push({context:this,analyser,gains});}}
window.AudioContext=Captured;if(window.webkitAudioContext)window.webkitAudioContext=Captured;
},{mix,fault:!!process.env.FAULT});
const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.GAME_URL||`http://127.0.0.1:${server.address().port}/`);await p.waitForFunction(()=>window.render_game_to_text&&!document.querySelector('#game').inert);
const before=await p.evaluate(()=>JSON.parse(render_game_to_text()).audio);await p.locator('#start').tap();await p.waitForTimeout(1400);
const after=await p.evaluate(()=>({state:JSON.parse(render_game_to_text()).audio,tutorial:JSON.parse(render_game_to_text()).tutorial.active,mode:JSON.parse(render_game_to_text()).mode,graphs:__captured.map(({context,analyser,gains})=>{const d=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(d);return{state:context.state,resumeCalls:context.__resumeCalls,time:context.currentTime,peak:Math.max(...d.map(Math.abs)),gains:gains.map(n=>n.gain.value)}})}));
await p.touchscreen.tap(210,600);await p.waitForTimeout(100);
const jump=await p.evaluate(()=>({state:JSON.parse(render_game_to_text()).audio,graphs:__captured.map(({analyser})=>{const d=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(d);return{peak:Math.max(...d.map(Math.abs))}})}));
check('no audio before first gesture: '+JSON.stringify(mix),before.context==='locked'||before.context==='off');
check('no training on returning-player first tap: '+JSON.stringify(mix),!after.tutorial&&after.mode==='playing');
if(process.env.EXPECT_SILENCE){check('blocked parent has zero music and effects',after.state.context==='suspended'&&after.graphs.every(x=>x.peak===0)&&jump.graphs.every(x=>x.peak===0));}
else if(mix.music||mix.effects){
 check('first touch starts shared context: '+JSON.stringify(mix),after.state.context==='running');
 if(mix.music)check('real music signal before any gameplay gesture: '+JSON.stringify(mix),after.graphs.some(x=>x.peak>.001)&&after.state.music.voices===8);
 if(mix.effects)check('one start and real jump cue: '+JSON.stringify(mix),jump.state.effects.counts.start===1&&jump.state.effects.counts.jump===1&&jump.graphs.some(x=>x.peak>.001));
 if(!mix.music)check('saved music mute retained',after.state.music.voices===0&&after.graphs.every(x=>x.peak===0));
 if(!mix.effects)check('saved effects mute retained',!jump.state.effects.counts.start&&!jump.state.effects.counts.jump);
}else check('explicit full mute is preserved',!after.state.enabled&&after.state.volumes.music===0&&after.state.volumes.effects===0&&after.graphs.length===0);
results.push({mix,before,after,jump});console.log(JSON.stringify({mix,before:before.context,context:after.state.context,voices:after.state.music?.voices,gains:after.graphs.map(x=>x.gains),peak:after.graphs.map(x=>x.peak),jumpPeak:jump.graphs.map(x=>x.peak),events:jump.state.effects?.counts}));await c.close();
}const out=path.resolve(process.env.OUT||'docs/verification/2026-10-27-audio-start-v4121/first-touch');fs.mkdirSync(out,{recursive:true});check('no runtime errors',errors.length===0);fs.writeFileSync(path.join(out,(process.env.FAULT?'blocked':'normal')+'.json'),JSON.stringify({checks,results,errors,faultInjected:!!process.env.FAULT,physicalPhone:false,engine:process.env.ENGINE||'chromium'},null,2));}finally{await browser.close();server.close()}})().catch(e=>{console.error(e);server.close();process.exit(1)});
