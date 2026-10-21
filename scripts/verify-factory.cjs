const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out=path.resolve(process.argv[2]||'/tmp/tesla-factory-assembly');fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH}),errors=[],checks=[],measurements=[];const check=(n,v)=>{assert.ok(v,n);checks.push(n);};try{
for(const [label,width,height] of [['desktop',1440,900],['portrait',390,844],['small-phone',320,568],['landscape',844,390]]){
 const context=await browser.newContext({viewport:{width,height},hasTouch:width<900}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.GAME_BASE_URL||'http://127.0.0.1:8907/');await page.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert);await page.evaluate(()=>requestAnimationFrame=()=>0);await page.waitForTimeout(40);
 await page.evaluate(()=>{const q=__qa;q.start(17);q.S.obs=[];q.S.next=1e9;q.E.bonus=7000;q.syncState();q.S.distance=6000;q.syncState();q.coach.dismiss(0);q.refreshHUD();q.render();});
 const first=await page.evaluate(()=>__qa.factory.production);check(label+': entering factory selects a model',first&&first.leg===1);
 for(const elapsed of [2,4.8,9.8,14.8,19.8,24,32]){
  await page.evaluate(elapsed=>{__qa.S.t=elapsed;__qa.factory.update({id:'tesla-factory',leg:1},elapsed);__qa.render();},elapsed);
  const state=await page.evaluate(()=>__qa.factory.production);check(`${label}: cycle ${elapsed}s stable model`,state.model===first.model);
  if(elapsed===32)check(label+': next body changes color or keeps Cybertruck steel',state.model==='cybertruck'?state.color==='steel':state.color!==first.color);
  await page.screenshot({path:path.join(out,`${label}-${elapsed}.png`)});
 }
 const before=await page.evaluate(()=>__qa.factory.production);await page.setViewportSize({width:width+14,height});check(label+': resize preserves the exact body',JSON.stringify(await page.evaluate(()=>__qa.factory.production))===JSON.stringify(before));await page.setViewportSize({width,height});
 await page.evaluate(()=>{__qa.E.bonus=14000-__qa.S.distance/20;__qa.syncState();__qa.E.bonus=21000-__qa.S.distance/20;__qa.syncState();});const next=await page.evaluate(()=>__qa.factory.production);check(label+': reentry chooses a different model',next.leg===3&&next.model!==first.model);
 // Production painter fixtures cover every approved color/stage; actual game assets and IK rig.
 const review=label==='portrait'?await page.evaluate(async()=>{
  const {createFactoryRenderer}=await import('./src/factory.js?v=3.9.1');const {FACTORY_MODELS}=await import('./src/factory-production.js?v=3.9.1');
  const c=document.createElement('canvas');c.width=1200;c.height=720;const ctx=c.getContext('2d');const views=[];
  for(let m=0;m<4;m++)for(let color=0;color<(m===3?1:3);color++){
   let call=0;const r=createFactoryRenderer({random:()=>call++===0?(m+.1)/4:(color+.1)/3});await r.load();r.update({id:'tesla-factory',leg:1},0);
   for(let stage=0;stage<5;stage++){const t=stage*5+4.8;r.update({id:'tesla-factory',leg:1},t);const v={W:1200,H:720,ground:605,scale:1,screenDistance:320,worldDistance:2400,activeTime:t};r.draw(ctx,v);views.push({model:FACTORY_MODELS[m],color:r.production.color,stage,data:c.toDataURL()});}
  }return views;
 }):[];
 if(label==='portrait'){for(const v of review)fs.writeFileSync(path.join(out,`line-${v.model}-${v.color}-${v.stage}.png`),Buffer.from(v.data.split(',')[1],'base64'));check('all ten model/color combinations complete five production stages',review.length===50);}
 const timing=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=innerWidth;c.height=innerHeight;const x=c.getContext('2d'),start=performance.now();for(let i=0;i<150;i++)__qa.factory.draw(x,{W:innerWidth,H:innerHeight,ground:innerHeight*.84,scale:.68,screenDistance:i*2,worldDistance:i*2,activeTime:__qa.S.t});return (performance.now()-start)/150;});measurements.push({label,meanFactoryDrawMs:timing});check(label+': no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth));await context.close();
}check('no runtime errors',errors.length===0);fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify({checks,errors,measurements,fixture:'Arranged score/time/distance; real production painter, assets, IK and cycle state. Not a physical-device acceptance.'},null,2));console.log(JSON.stringify({checks:checks.length,errors,measurements}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
