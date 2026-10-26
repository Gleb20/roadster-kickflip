const {chromium}=require('/Users/liubavskii/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),assert=require('assert/strict');
(async()=>{
 const out='/tmp/tesla-tj003-browser';fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const checks=[],errors=[];const check=(n,v)=>{assert.ok(v,n);checks.push(n)};
 try{
 const c=await b.newContext({viewport:{width:440,height:956},isMobile:true,hasTouch:true}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(['error','warning'].includes(m.type()))errors.push(m.type()+': '+m.text())});
 await p.goto('http://127.0.0.1:8776/?qa=1');await p.waitForFunction(()=>typeof render_game_to_text==='function'&&!document.querySelector('#game').inert);
 check('correct app',await p.title()==='ROADSTER / KICKFLIP');await p.locator('#start').tap();await p.waitForSelector('#tutorial-card');
 check('new player starts tutorial',await p.evaluate(()=>JSON.parse(render_game_to_text()).tutorial.active));await p.screenshot({path:out+'/mobile-start.png'});
 // Freeze display-driven simulation only; drive production fixed steps with real keyboard transitions.
 await p.evaluate(()=>{window.__stepEnabled=false;const original=window.__qa.step;window.__qa.fixed=()=>original(1/120);window.requestAnimationFrame=()=>0;});
 const advance=async n=>p.evaluate(n=>{for(let i=0;i<n;i++)window.__qa.fixed();},n);
 const read=()=>p.evaluate(()=>{const q=window.__qa;return {T:structuredClone(q.T),P:structuredClone(q.P),input:structuredClone(q.run.input),G:structuredClone(q.run.G),S:{mode:q.S.mode,speed:q.S.speed,obs:structuredClone(q.S.obs),rails:structuredClone(q.S.rails),score:q.S.score}}});
 let pressed=false,thrust=false,previous=-1;
 for(let i=0;i<5000;i++){
  const {T,P,input,G,S}=await read();if(!T.active)break;
  if(T.index!==previous){previous=T.index;await p.evaluate(()=>window.__qa.render());await p.screenshot({path:out+'/lesson-'+T.index+'.png'});}
  const id=['jump','charge','flip','thrust','rail','air','pickup'][T.index];
  if(!T.cleared&&!['air','pickup'].includes(id)){
   if(!P.airborne&&!G.support&&!T.jumped){const object=id==='rail'?S.rails[0]:S.obs[0],charge=id==='jump'?.08:id==='rail'?.6:1;
    if((!object||object.x/S.speed<=(id==='rail'?.35:.27)+charge*.4)&&!input.charging&&!pressed){await p.keyboard.down('Space');pressed=true;}
    if(input.charging&&input.charge>=charge&&pressed){await p.keyboard.up('Space');pressed=false;}
   }
   if(P.airborne&&id==='flip'){
    if(P.time>.04&&P.angle> -5.6&&!input.spin&&!pressed){await p.keyboard.down('Space');pressed=true;}
    if(P.angle<=-5.6&&pressed){await p.keyboard.up('Space');pressed=false;}
   }
   if(P.airborne&&id==='thrust'){
    if(P.time>.1&&T.thrust<.25&&!thrust){await p.keyboard.down('ShiftLeft');thrust=true;}
    if(T.thrust>=.25&&thrust){await p.keyboard.up('ShiftLeft');thrust=false;}
   }
  }
  await advance(3);
 }
 console.log(JSON.stringify(await read()));check('all lessons finish via keyboard',!(await read()).T.active);check('all lessons persisted',await p.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('roadster-lessons-v1')).lessons).length===7));
 check('continues same run with practice score',(await read()).S.score>=175);check('clean input at exit',!(await read()).input.spin&&!(await read()).input.thrust);
 await p.reload();await p.waitForFunction(()=>typeof render_game_to_text==='function'&&!document.querySelector('#game').inert);await p.locator('#start').tap();check('returning player no automatic training',!await p.evaluate(()=>JSON.parse(render_game_to_text()).tutorial.active));
 await p.locator('#pause').tap();await p.locator('#pause-home').tap();await p.locator('#replay-tutorial').check();await p.locator('#start').tap();check('explicit replay starts tutorial',await p.evaluate(()=>JSON.parse(render_game_to_text()).tutorial.active));await p.locator('#tutorial-skip').tap();
 check('skip continues playing',await p.evaluate(()=>{const s=JSON.parse(render_game_to_text());return !s.tutorial.active&&s.mode==='playing'&&!s.charging&&!s.thrusting}));
 await p.locator('#pause').tap();await p.locator('#pause-home').tap();await p.locator('#start').tap();check('skip does not repeat automatically',!await p.evaluate(()=>JSON.parse(render_game_to_text()).tutorial.active));
 check('no runtime errors',errors.length===0);fs.writeFileSync(out+'/result.json',JSON.stringify({checks,errors,browserPlugin:'absent',physicalPhone:false},null,2));console.log(JSON.stringify({checks,errors}));
 await c.close();
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});
