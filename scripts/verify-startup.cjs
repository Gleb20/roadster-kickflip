const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {mkdirSync,writeFileSync}=require('node:fs');
const {resolve}=require('node:path');
const assert=require('node:assert/strict');
const out=resolve(process.argv[2]||'/tmp/tesla-startup-review');mkdirSync(out,{recursive:true});
const base=process.env.GAME_BASE_URL||'http://127.0.0.1:8766/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined});
 const errors=[],results=[];
 try{
  for(const [name,viewport] of [['portrait',{width:390,height:740}],['desktop',{width:1440,height:900}]]){
   const context=await browser.newContext({viewport,isMobile:name==='portrait',hasTouch:true});const p=await context.newPage();
   p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});await p.route('**/favicon.ico',r=>r.fulfill({status:204}));
   await p.addInitScript(()=>{
    window.__startupProbe={decoded:[],headCopies:[],firstHero:null,startEnabled:null};
    const decode=HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode=async function(){
     await decode.call(this);
     if(new URL(this.src).pathname.endsWith('/collage-atlas.png')){
      window.__headDownloadComplete=true;
      await new Promise(resolve=>window.__releaseHeadDecode=resolve);
     }
     __startupProbe.decoded.push(new URL(this.src).pathname.split('/').pop());
    };
    const draw=CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage=function(source,...args){
     const result=draw.call(this,source,...args);
     if(source instanceof HTMLImageElement&&source.src.endsWith('/collage-atlas.png')&&args.length===8&&Math.abs(args[0]-40*source.naturalWidth/1536)<.01&&Math.abs(args[1]-40*source.naturalHeight/1024)<.01){
      const pixels=this.getImageData(0,0,160,180).data;let visible=0,dark=0,skin=0;
      for(let i=0;i<pixels.length;i+=4){const [r,g,b,a]=pixels.slice(i,i+4);if(a<128)continue;visible++;if(Math.max(r,g,b)<100)dark++;if(r>g+12&&g>b+5)skin++;}
      __startupProbe.headCopies.push({visible,dark,skin,decoded:__startupProbe.decoded.includes('collage-atlas.png')});
     }
     if(this.canvas.id==='scene'&&source instanceof HTMLCanvasElement&&source.width===255&&source.height===321&&!__startupProbe.firstHero){
      __startupProbe.firstHero={headPrepared:__startupProbe.headCopies.length>0,loaderVisible:!document.querySelector('#loading-screen').hidden};
     }
     return result;
    };
    addEventListener('DOMContentLoaded',()=>{
     const start=document.querySelector('#start');
     new MutationObserver(()=>{if(!start.disabled&&!__startupProbe.startEnabled)__startupProbe.startEnabled={headPrepared:__startupProbe.headCopies.length>0,completeHeroDrawn:!!__startupProbe.firstHero};}).observe(start,{attributes:true,attributeFilter:['disabled']});
    });
   });
   await p.goto(base,{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>window.__headDownloadComplete&&document.querySelector('#loading-progress').value===7);
   await p.waitForTimeout(700);
   assert.equal(await p.locator('#loading-percent').textContent(),'87%');assert.equal(await p.locator('#start').isDisabled(),true);assert.equal(await p.locator('#game').getAttribute('inert'),'');
   assert.equal(await p.evaluate(()=>__startupProbe.headCopies.length),0);assert.equal(await p.evaluate(()=>__startupProbe.firstHero),null);
   await p.screenshot({path:resolve(out,name+'-waiting-for-face.png')});
   await p.evaluate(()=>__releaseHeadDecode());await p.waitForFunction(()=>document.querySelector('#loading-screen').hidden);
   const probe=await p.evaluate(()=>__startupProbe);
   assert.deepEqual(probe.firstHero,{headPrepared:true,loaderVisible:true});assert.deepEqual(probe.startEnabled,{headPrepared:true,completeHeroDrawn:true});
   assert.equal(probe.headCopies[0].decoded,true);assert.ok(probe.headCopies[0].visible>3000);assert.ok(probe.headCopies[0].dark>100);assert.ok(probe.headCopies[0].skin>1000);
   const state=await p.evaluate(()=>JSON.parse(render_game_to_text()));assert.equal(state.version,'2.4.4');
   await p.screenshot({path:resolve(out,name+'-first-complete-scene.png')});
   if(name==='portrait')await p.screenshot({path:resolve(out,'face-detail.png'),clip:{x:50,y:470,width:90,height:140},scale:'css'});
   await p.locator('#start').tap();await p.locator('#boost').tap();await p.waitForFunction(()=>JSON.parse(render_game_to_text()).boost.factor>1.5);
   await p.screenshot({path:resolve(out,name+'-boost-face.png')});
   await p.touchscreen.tap(viewport.width*.55,viewport.height*.45);await p.waitForFunction(()=>JSON.parse(render_game_to_text()).y>20);
   await p.locator('#pause').tap();assert.equal(await p.evaluate(()=>JSON.parse(render_game_to_text()).mode),'paused');await p.locator('#resume').tap();
   results.push({viewport:name,held:'decoded collage atlas only',progressWhileHeld:87,probe,realInput:'start / boost / jump / pause / resume',productionQA:await p.evaluate(()=>typeof window.__qa)});
   await context.close();
  }
  // A failed first-frame face preparation must never expose a partial game.
  const broken=await browser.newPage();await broken.route('**/favicon.ico',r=>r.fulfill({status:204}));
  broken.on('pageerror',e=>errors.push(e.message));
  await broken.addInitScript(()=>{
   const draw=CanvasRenderingContext2D.prototype.drawImage;
   CanvasRenderingContext2D.prototype.drawImage=function(source,...args){
    if(source instanceof HTMLImageElement&&source.src.endsWith('/collage-atlas.png')&&args.length===8&&Math.abs(args[0]-40*source.naturalWidth/1536)<.01)throw new Error('Synthetic face preparation failure');
    return draw.call(this,source,...args);
   };
  });
  await broken.goto(base);await broken.waitForFunction(()=>document.querySelector('#loading-screen').classList.contains('has-error'));
  assert.equal(await broken.locator('#start').isDisabled(),true);assert.equal(await broken.locator('#game').getAttribute('inert'),'');assert.equal(await broken.locator('#loading-retry').isVisible(),true);
  results.push({scenario:'failed first complete scene preparation keeps game blocked and offers retry'});await broken.close();
  assert.deepEqual(errors,[]);writeFileSync(resolve(out,'startup.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({scenarios:results.length,errors}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
