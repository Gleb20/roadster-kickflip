const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/Users/liubavskii/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const next=process.cwd(),old=process.env.OLD_ROOT,out=path.join(next,'docs/verification/2026-10-27-tj005-v4130/upgrade');
if(!old)throw Error('OLD_ROOT must contain the frozen 4.12.1 checkout');fs.mkdirSync(out,{recursive:true});
let root=old,corrupt=false;const checks=[],errors=[],check=(name,v)=>{assert.ok(v,name);checks.push(name)};
const server=http.createServer((req,res)=>{try{const n=new URL(req.url,'http://x').pathname.slice(1)||'index.html';if(n.includes('..'))throw Error();if(corrupt&&n==='content/package.json'){res.writeHead(200,{'Content-Type':'application/json'}).end('{}');return;}res.writeHead(200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.mp3':'audio/mpeg','.webmanifest':'application/manifest+json'})[path.extname(n)]||'application/json','Cache-Control':'no-store'}).end(fs.readFileSync(path.join(root,n)))}catch{res.writeHead(404).end()}});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}/`,b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const c=await b.newContext({viewport:{width:440,height:956},isMobile:true,hasTouch:true});await c.route('https://anzybyamdtouzxouhziu.supabase.co/**',r=>r.abort());let p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(url);
  await p.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert&&navigator.serviceWorker.controller?.state==='activated');
  check('exact 4.12.1 parent installed',await p.evaluate(()=>JSON.parse(render_game_to_text()).version==='4.12.1'));
  await p.evaluate(async()=>{
   localStorage.setItem('roadster-audio-v2',JSON.stringify({effects:.6,music:.4}));localStorage.setItem('roadster-best-v3','12345');localStorage.setItem('roadster-started-once-v1','1');localStorage.setItem('roadster-lessons-v1',JSON.stringify({finished:true,skipped:false,lessons:{jump:true}}));__qa.collection.discover('joe');
   const result={score:12345,session:{id:'00000000-0000-4000-8000-000000000004',capability:'a'.repeat(64),ruleset:'roadster-v4.11.0',localExpiresAt:Date.now()+86400000},replay:{format:1,ruleset:'roadster-v4.11.0',seed:1,ticks:100,events:[]},entry:null};
   localStorage.setItem('roadster-score-record-v1',JSON.stringify({version:1,result}));
   const {createJobStore}=await import('/src/online-store.js?v=4.12.1');await createJobStore({storage:localStorage}).put({...result,nickname:'LOCAL_PRESERVATION_FIXTURE',status:'pending',createdAt:Date.now()},{insert:true});
  });
  await p.reload();await p.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert);await p.locator('#start').tap();await p.locator('#pause').tap();root=next;
  corrupt=true;await p.evaluate(async()=>await(await navigator.serviceWorker.getRegistration()).update());await p.waitForTimeout(2500);check('incomplete content package cannot replace the working parent',await p.evaluate(async()=>JSON.parse(render_game_to_text()).version==='4.12.1'&&!(await navigator.serviceWorker.getRegistration()).waiting));corrupt=false;
  await p.evaluate(async()=>await(await navigator.serviceWorker.getRegistration()).update());await p.waitForFunction(async()=>!!(await navigator.serviceWorker.getRegistration()).waiting);
  check('new cache waits while parent attempt is paused',await p.evaluate(()=>JSON.parse(render_game_to_text()).version==='4.12.1'&&__qa.S.mode==='paused'));
  await p.locator('#pause-restart').tap();let closedTabBoundaryUsed=false;
  try{await p.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert&&JSON.parse(render_game_to_text()).version==='4.13.1',{},{timeout:12000})}
  catch{closedTabBoundaryUsed=true;await p.close();p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(url);await p.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert&&JSON.parse(render_game_to_text()).version==='4.13.1')}
  check('new release activates at a safe boundary',true);
  check('independent audio settings preserved',await p.evaluate(()=>JSON.stringify(__qa.sound.volumes)===JSON.stringify({effects:.6,music:.4})));
  check('best, collection and lesson state preserved',await p.evaluate(()=>localStorage.getItem('roadster-best-v3')==='12345'&&__qa.collection.state('joe')==='new'&&JSON.parse(localStorage.getItem('roadster-lessons-v1')).finished));
  check('finished record and pending replay preserved',await p.evaluate(async()=>{const record=JSON.parse(localStorage.getItem('roadster-score-record-v1'));const {createJobStore}=await import('/src/online-store.js?v=4.13.1');const jobs=await createJobStore({storage:localStorage}).list();return record.result.score===12345&&record.result.replay.ruleset==='roadster-v4.11.0'&&jobs.some(j=>j.nickname==='LOCAL_PRESERVATION_FIXTURE'&&j.replay.ticks===100&&j.status==='pending')}));
  await p.keyboard.press('Shift');await p.waitForFunction(()=>__qa.sound.inspect.music?.voices===8);await p.waitForFunction(()=>navigator.serviceWorker.controller?.state==='activated');
  await c.setOffline(true);await p.reload();await p.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert);await p.keyboard.press('Shift');await p.waitForFunction(()=>__qa.sound.inspect.music?.voices===8);
  check('upgraded client and all music decode offline',await p.evaluate(()=>JSON.parse(render_game_to_text()).version==='4.13.1'&&Object.keys(__qa.sound.inspect.music.errors).length===0));
  check('no runtime exceptions',errors.length===0);await p.screenshot({path:path.join(out,'offline.png')});
  fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({checks,errors,closedTabBoundaryUsed,physicalPhone:false,publicScoresSubmitted:0},null,2));console.log(JSON.stringify({checks:checks.length,errors,closedTabBoundaryUsed}));await c.close();
 }finally{await b.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
