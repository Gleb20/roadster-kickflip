const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out=path.resolve(process.argv[2]||'/tmp/tesla-factory-organic-v362-art');fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH}),errors=[],checks=[];try{
for(const [label,width,height] of [['desktop',1440,900],['portrait',390,844],['landscape',844,390]]){
 const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.GAME_BASE_URL||'http://127.0.0.1:8892/');await page.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert);await page.evaluate(()=>requestAnimationFrame=()=>0);await page.waitForTimeout(40);
 // Art fixtures: production painters, arranged distance/score and obstacle placement. Not a natural playthrough.
 for(const [section,distance] of [['assembly',0],['machining',1320/.14],['storage',2640/.14],['service',3960/.14]]){
 await page.evaluate(({distance})=>{const q=__qa;q.start(17);q.S.next=1e9;q.E.bonus=10000;q.syncState();q.S.distance=distance+6000;q.syncState();q.S.distance=distance;q.syncState();q.E.bonus=10000-distance/20+.01;q.syncState();q.S.obs=[];q.spawn('truck',90);q.spawn('pump',240);q.spawn('trump',420);q.refreshHUD();q.render();}, {distance});
 await page.screenshot({path:path.join(out,`${label}-${section}.png`)});
 }
 // Render actual factory painters at two dates: forklift cannot remain on screen outside its storage interval.
 const variation=await page.evaluate(()=>{const q=__qa,c=document.createElement('canvas');c.width=1000;c.height=700;const x=c.getContext('2d'),v={W:1000,H:700,ground:580,scale:1,screenDistance:0,worldDistance:2640/.14,activeTime:35};q.factory.draw(x,v);const a=c.toDataURL();q.factory.draw(x,{...v,activeTime:25});return a!==c.toDataURL();});assert.ok(variation);checks.push(label+': logistics varies within storage section');
 await context.close();
}assert.equal(errors.length,0);fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify({checks,errors,fixture:'Arranged score, distance and obstacles; real production painters'},null,2));console.log(JSON.stringify({checks,errors}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
