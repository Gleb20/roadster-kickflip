const {chromium}=require('playwright'),assert=require('assert/strict'),fs=require('fs'),path=require('path');
const out=path.resolve('docs/verification/2026-10-23-grind/kickflip-v3');fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),checks=[],errors=[];const check=(n,v)=>{assert.ok(v,n);checks.push(n)};try{
for(const width of [390,1440]){const c=await b.newContext({viewport:{width,height:width===390?844:900}}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:8774/');await p.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert);await p.locator('#start').click();await p.addStyleTag({content:'#paused{visibility:hidden!important}'});
for(const where of ['ground','rail']){
 const result=await p.evaluate(where=>{const q=__qa;q.stop();q.run.reset(17);q.characters.reset();q.S.mode='playing';q.S.next=q.Q.nextAt=1e9;q.S.obs=[];q.Q.pickups=[];
 if(where==='rail'){q.S.rails=[{uid:700,x:-50,w:720,h:190,paid:[],passed:false}];Object.assign(q.P,{y:191,vy:-300,airborne:true});for(let i=0;i<12&&!q.G.support;i++)q.step(1/120);}
 q.run.command('primary-down');for(let i=0;i<24;i++)q.step(1/120);q.run.command('primary-up');let first=JSON.parse(render_game_to_text()).carAnimation,frames=new Set(),sample=null;
 for(let i=0;i<240&&q.P.airborne;i++){q.step(1/120);q.render();const pose=JSON.parse(render_game_to_text()).carAnimation;frames.add(pose.frame);if(pose.frame===4&&!sample)sample=q.run.snapshot();}q.stop();return {first,frames:[...frames],sample};},where);
 check(width+': '+where+' ordinary jump starts cosmetic kickflip',result.first.cosmetic);check(width+': '+where+' traverses all nine photographed frames',result.frames.length===9);
 await p.evaluate(sample=>{const q=__qa;q.run.restore(sample);q.stop();document.querySelector('#toast').textContent='';q.hud.reset();q.syncState();q.refreshHUD();q.hud.mode('playing');q.render()},result.sample);await p.screenshot({path:path.join(out,where+'-flip-'+width+'.png')});
 if(where==='rail'){const manual=await p.evaluate(()=>{const q=__qa;q.S.mode='playing';q.run.command('primary-down');for(let i=0;i<4;i++)q.step(1/120);q.stop();return JSON.parse(render_game_to_text()).carAnimation.cosmetic});check(width+': real grab overrides automatic car flip',manual===false);}
}
await c.close();}check('no browser runtime errors',errors.length===0);fs.writeFileSync(out+'/checks.json',JSON.stringify({checks,errors,arrangedFlights:true,physicalDevice:false},null,2));console.log(JSON.stringify({checks:checks.length,errors}));}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
