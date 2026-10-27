const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=process.cwd(),out=path.join(root,'docs/verification/2026-10-27-audio-start-v4121',process.env.GAME_URL?'public':'browser');
fs.mkdirSync(out,{recursive:true});
const checks=[],errors=[],check=(name,value)=>{assert.ok(value,name);checks.push(name)};
const server=http.createServer((req,res)=>{try{const n=decodeURIComponent(new URL(req.url,'http://x').pathname).slice(1)||'index.html';if(n.includes('..'))throw Error();const file=path.join(root,n);res.writeHead(200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp3':'audio/mpeg','.png':'image/png','.webmanifest':'application/manifest+json'})[path.extname(file)]||'application/json','Cache-Control':'no-store'}).end(fs.readFileSync(file));}catch{res.writeHead(404).end()}});
(async()=>{
 if(!process.env.GAME_URL)await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  for(const [width,height] of [[440,956],[844,390],[1440,900]]){
   const mobile=width<1000,c=await browser.newContext({viewport:{width,height},isMobile:mobile,hasTouch:mobile}),p=await c.newPage();
   const press=selector=>mobile?p.locator(selector).tap():p.locator(selector).click();
   p.on('pageerror',e=>errors.push(e.message));
   let submissions=0;await c.route('https://anzybyamdtouzxouhziu.supabase.co/**',r=>{if(/submit/.test(r.request().url()))submissions++;return r.abort()});
   await p.goto(process.env.GAME_URL||`http://127.0.0.1:${server.address().port}/`);
   await p.waitForFunction(()=>window.render_game_to_text&&!document.querySelector('#game').inert);
   check(`${width}: correct version`,await p.evaluate(()=>JSON.parse(render_game_to_text()).version==='4.12.1'));
   if(process.env.GAME_URL)check(`${width}: no public QA hook`,await p.evaluate(()=>typeof __qa==='undefined'));
   await p.keyboard.press('Shift');await p.waitForFunction(()=>JSON.parse(render_game_to_text()).audio.music?.voices===8);
   check(`${width}: all stems load on a single context`,await p.evaluate(()=>{const m=JSON.parse(render_game_to_text()).audio.music;return m.requests===2&&m.ready.length===2&&Object.keys(m.errors).length===0}));
   await press('#start');await p.waitForFunction(()=>JSON.parse(render_game_to_text()).tutorial.active);
   await p.waitForFunction(()=>JSON.parse(render_game_to_text()).audio.music.targets.layers.drums===.06);
   check(`${width}: real tutorial selects a light normal-tempo mix`,await p.evaluate(()=>{const m=JSON.parse(render_game_to_text()).audio.music;return m.seconds===60&&m.targets.layers.drums===.06&&m.targets.layers.bass===.12}));
   await press('#tutorial-skip');await p.waitForFunction(()=>!JSON.parse(render_game_to_text()).tutorial.active);
   await p.waitForFunction(()=>JSON.parse(render_game_to_text()).audio.music.targets.layers.drums===0);
   check(`${width}: Skip returns to score-based arrangement`,await p.evaluate(()=>JSON.parse(render_game_to_text()).audio.music.targets.layers.drums===0));
   if(!process.env.GAME_URL){
    await p.evaluate(()=>{window.requestAnimationFrame=()=>0;__qa.S.next=1e9;__qa.Q.nextAt=1e9;__qa.S.obs=[]});await p.waitForTimeout(80);
    const stages=[];
    for(const score of [0,2500,7500,15000,30000,100000]){
     stages.push(await p.evaluate(async score=>{const q=__qa;q.E.bonus=score;q.S.obs=[];q.syncState();await new Promise(r=>setTimeout(r,60));q.step(1/120);return{score:q.S.score,targets:q.sound.inspect.music.targets}},score));
    }
    check(`${width}: real score opens bass, drums and lead`,stages[0].targets.layers.drums===0&&stages[2].targets.layers.bass===1&&stages[3].targets.layers.drums===1&&stages[4].targets.layers.lead===1);
    await p.evaluate(()=>{__qa.sound.setScene({mode:'playing',score:7500,boost:1});});await p.waitForTimeout(70);
    await p.evaluate(()=>__qa.sound.setScene({mode:'playing',score:7500,boost:1}));const boosted=await p.evaluate(()=>__qa.sound.inspect.music.targets);
    await p.waitForTimeout(70);await p.evaluate(()=>__qa.sound.setScene({mode:'playing',score:7500,boost:0}));const settled=await p.evaluate(()=>__qa.sound.inspect.music.targets);
    check(`${width}: boost releases to earned instrumentation`,boosted.layers.drums>settled.layers.drums&&settled.layers.bass===1);
    const transitions=[];
    for(const id of ['tesla-factory','spaceport']){
     await p.waitForTimeout(60);await p.evaluate(id=>__qa.sound.setScene({mode:'playing',score:30000,biome:{id,from:id,progress:1}}),id);
     const t=await p.evaluate(()=>__qa.sound.inspect.music);transitions.push(t);
     check(`${width}: ${id} schedules one bar on the shared grid`,!!t.transition&&Math.abs((t.transition.at-t.origin)/1.875-Math.round((t.transition.at-t.origin)/1.875))<1e-8&&t.transition.duration===1.875);
     await p.waitForTimeout(Math.max(0,(t.transition.at+t.transition.duration)*1000-(await p.evaluate(()=>__qa.sound.inspect.music.phase))*1000)+120);
     await p.evaluate(id=>__qa.sound.setScene({mode:'playing',score:30000,biome:{id}}),id);
     check(`${width}: ${id} finishes with eight sources`,await p.evaluate(id=>{const x=__qa.sound.inspect.music;return x.voices===8&&x.targets.biomes[id]===1},id));
    }
    fs.writeFileSync(path.join(out,`stages-${width}.json`),JSON.stringify({stages,boosted,settled,transitions},null,2));
   }
   await press('#pause');await p.waitForTimeout(90);
   check(`${width}: pause preserves quiet music`,await p.evaluate(()=>JSON.parse(render_game_to_text()).mode==='paused'&&JSON.parse(render_game_to_text()).audio.music.targets.volume===.12));
   await press('#resume');check(`${width}: resume works`,await p.evaluate(()=>JSON.parse(render_game_to_text()).mode==='playing'));
   await press('#pause');await press('#pause-home');await p.waitForTimeout(80);
   await p.evaluate(()=>{const a=window.__qa?.sound;if(a)a.setVolume('music',0)});
   if(!process.env.GAME_URL){
    check(`${width}: zero music immediately stops sources`,await p.evaluate(()=>__qa.sound.inspect.music.voices===0));
    await p.evaluate(()=>__qa.sound.setVolume('music',.65));await p.waitForFunction(()=>__qa.sound.inspect.music.voices===8);
    check(`${width}: music restore reuses decoded buffers`,await p.evaluate(()=>__qa.sound.inspect.music.requests===2));
    await p.evaluate(()=>__qa.sound.setVisible(false));await p.waitForTimeout(80);
    check(`${width}: hidden context suspends`,await p.evaluate(()=>__qa.sound.inspect.context==='suspended'&&__qa.sound.inspect.music.targets.volume===0));
    await p.evaluate(()=>__qa.sound.setVisible(true));await p.keyboard.press('Shift');await p.waitForFunction(()=>__qa.sound.inspect.context==='running');
   }
   await p.waitForFunction(()=>navigator.serviceWorker.controller?.state==='activated');
   await c.setOffline(true);await p.reload();await p.waitForFunction(()=>window.render_game_to_text&&!document.querySelector('#game').inert);
   await p.keyboard.press('Shift');await p.waitForFunction(()=>JSON.parse(render_game_to_text()).audio.music?.voices===8);
   check(`${width}: offline reload has exact release and all stems`,await p.evaluate(()=>JSON.parse(render_game_to_text()).version==='4.12.1'&&Object.keys(JSON.parse(render_game_to_text()).audio.music.errors).length===0));
   await p.screenshot({path:path.join(out,`offline-${width}.png`)});
   check(`${width}: no scores submitted`,submissions===0);
   if(!process.env.GAME_URL&&width===440){
    await c.setOffline(false);
    const decoded=await p.evaluate(async()=>{
     const {MUSIC}=await import('/src/music-content.js?v=4.12.1'),ctx=new OfflineAudioContext(2,48000,24000),data=[];
     for(const [id,files] of Object.entries(MUSIC.tracks))for(const [layer,file] of Object.entries(files)){
      const b=await ctx.decodeAudioData(await(await fetch(file)).arrayBuffer());let sum=0,peak=0,step=0,seam=0;
      for(let c=0;c<b.numberOfChannels;c++){const d=b.getChannelData(c);seam=Math.max(seam,Math.abs(d[0]-d.at(-1)));for(let i=0;i<d.length;i++){sum+=d[i]**2;peak=Math.max(peak,Math.abs(d[i]));if(i)step=Math.max(step,Math.abs(d[i]-d[i-1]));}}
      data.push({id,layer,duration:b.duration,peak,rms:Math.sqrt(sum/(b.length*b.numberOfChannels)),step,seam});
     }return data;
    });
    check('eight decoded loops are 60 seconds and retain bounded seams',decoded.length===8&&decoded.every(d=>Math.abs(d.duration-60)<.001&&d.peak<1&&d.seam<=d.step));
    fs.writeFileSync(path.join(out,'decoded.json'),JSON.stringify(decoded,null,2));
    const rendered=await p.evaluate(async()=>{
     const {createMusic}=await import('/src/music.js?v=4.12.1');const results=[];
     for(const score of [0,2500,7500,15000,30000]){
      const a=new OfflineAudioContext(2,24000*14,24000),proxy=new Proxy(a,{get(t,k){if(k==='state')return'running';const v=t[k];return typeof v==='function'?v.bind(t):v}});
      const m=createMusic({context:proxy,destination:a.destination});m.update({mode:'playing',score});m.unlock();
      while(m.inspect().loading.length)await new Promise(r=>setTimeout(r,5));
      const snapshots=[];
      for(const [at,id] of [[4,'tesla-factory'],[9,'spaceport']])a.suspend(at).then(()=>{m.update({mode:'playing',score,biome:{id}});snapshots.push(m.inspect());return a.resume()});
      const b=await a.startRendering();let peak=0,step=0,sum=0;const windows=[];
      for(let i=0;i<b.length;i++){let power=0;for(let c=0;c<2;c++){const d=b.getChannelData(c),v=d[i];peak=Math.max(peak,Math.abs(v));sum+=v*v;power+=v*v;if(i)step=Math.max(step,Math.abs(v-d[i-1]));}const w=Math.floor(i/6000);windows[w]=(windows[w]||0)+power;}
      results.push({score,peak,step,rms:Math.sqrt(sum/(b.length*2)),quarterSecondRms:windows.map(x=>Math.sqrt(x/12000)),snapshots});m.dispose();
     }return results;
    });
    check('real scheduled Web Audio renders both directions without clipping',rendered.every(r=>r.peak<.95));
    check('transitions have no silent quarter-second after initial fade-in',rendered.every(r=>r.quarterSecondRms.slice(4).every(v=>v>.001)));
    fs.writeFileSync(path.join(out,'renders.json'),JSON.stringify(rendered,null,2));
   }
   await c.close();
  }
  check('no runtime exceptions',errors.length===0);
  fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({checks,errors,physicalPhone:false,subjectiveListening:false},null,2));console.log(JSON.stringify({checks:checks.length,errors}));
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
