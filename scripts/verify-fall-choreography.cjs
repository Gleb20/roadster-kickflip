// Arranged phase captures use the production painters; native input/recovery
// checks live in verify-fall.cjs. No separate HTML/game implementation.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out=path.resolve(process.argv[2]||'/tmp/tesla-fall-choreography'),version=require('../package.json').version;
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined}),checks=[],errors=[];
 const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
 try{
  for(const [width,height] of [[390,844],[844,390],[1440,900]]){
   const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage();
   page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
   await page.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));
   await page.goto(process.env.GAME_BASE_URL||'http://127.0.0.1:8766/');
   await page.waitForFunction(()=>window.__qa&&!document.querySelector('#game').inert);
   await page.evaluate(()=>{requestAnimationFrame=()=>0;});await page.waitForTimeout(40);
   await page.locator('#start').click();await page.evaluate(()=>{__qa.S.next=1e9;});
   await page.keyboard.press('Space');await page.keyboard.down('Space');
   await page.evaluate(()=>{for(let i=0;i<100;i++)__qa.step(1/120);});await page.keyboard.up('Space');
   check(`${width}: native input enters actual recovery`,await page.evaluate(()=>__qa.F.active));
   const samples=[];
   for(const fraction of [.14,.16,.25,.36,.38,.46,.56,.65,.76,.86,.93,.97,1]){
    const sample=await page.evaluate(async({fraction,version})=>{
     const {fallPose,fallPolygons,fallSeatContact}=await import(`./src/fall.js?v=${version}`);
     __qa.F.age=__qa.F.duration*fraction;__qa.F.active=true;__qa.syncState();__qa.refreshHUD();__qa.render();
     const pose=fallPose(__qa.F),points=fallPolygons(pose)[0];
     return {fraction,pose,seatContact:fallSeatContact(pose),lowestCar:Math.min(...points.map(v=>v.y)),scale:JSON.parse(render_game_to_text()).camera.scale};
    },{fraction,version});
    samples.push(sample);await page.screenshot({path:path.join(out,`${width}-phase-${Math.round(fraction*100)}.png`)});
   }
   for(const fraction of [.14,.36,.56]){
    const s=samples.find(s=>s.fraction===fraction);
    check(`${width}: butt grounded at${fraction}`,Math.abs(s.seatContact.y)<1e-7&&s.pose.impact>.99);
   }
   check(`${width}: nose/rear contacts rest on road`,samples.filter(s=>[.16,.38].includes(s.fraction)).every(s=>Math.abs(s.lowestCar)<1e-7));
   check(`${width}: car stays behind until third launch`,samples.filter(s=>s.fraction>=.14&&s.fraction<=.65).every(s=>s.pose.car.x+65<s.pose.rider.x));
   check(`${width}: third arc is higher and standing happens aloft`,samples.find(s=>s.fraction===.65).pose.rider.lift>samples.find(s=>s.fraction===.25).pose.rider.lift*1.7&&samples.find(s=>s.fraction===.86).pose.rider.seat===0);
   check(`${width}: car docks before feet land`,samples.find(s=>s.fraction===.93).pose.car.x===0&&samples.find(s=>s.fraction===.97).pose.rider.y===95);
   check(`${width}: no longitudinal squash/flip frames during somersault`,samples.every(s=>s.pose.car.phase===0));
   await page.evaluate(()=>{__qa.F.age=__qa.F.duration*.36;__qa.syncState();__qa.refreshHUD();__qa.render();});
   const redraw=await page.evaluate(()=>{const canvas=document.querySelector('#scene'),c=canvas.getContext('2d');__qa.render();const a=c.getImageData(0,0,canvas.width,canvas.height).data;__qa.render();const b=c.getImageData(0,0,canvas.width,canvas.height).data;let different=0;for(let i=0;i<a.length;i++)if(a[i]!==b[i])different++;return different;});
   check(`${width}: rendering does not advance contact pose`,redraw===0);
   fs.writeFileSync(path.join(out,`${width}-samples.json`),JSON.stringify(samples,null,2));await context.close();
  }
  check('no JS/console errors',errors.length===0);
  fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify({version,checks,errors},null,2));
  console.log(JSON.stringify({checks:checks.length,errors}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
