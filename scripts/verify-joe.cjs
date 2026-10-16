const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {mkdirSync,writeFileSync}=require('node:fs');
const {resolve}=require('node:path');
const assert=require('node:assert/strict');
const base=process.env.GAME_BASE_URL||'http://127.0.0.1:8766/';
const out=resolve(process.argv[2]||'/tmp/tesla-joe-review');mkdirSync(out,{recursive:true});
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined});
 const errors=[],results=[];
 try{
  const p=await b.newPage({viewport:{width:1440,height:900}});
  p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!p.expectedFailure)errors.push(m.text())});
  await p.route('**/favicon.ico',r=>r.fulfill({status:204}));
  let releaseJoe;
  await p.route('**/assets/characters/joe-rogan.png',r=>new Promise(resolve=>{releaseJoe=async()=>{await r.continue();resolve()}}));
  await p.goto(base,{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>document.querySelector('#loading-progress').value===7);
  assert.equal(await p.locator('#loading-percent').textContent(),'87%');
  assert.equal(await p.locator('#game').getAttribute('inert'),'');
  await p.keyboard.press('Space');assert.equal(await p.evaluate(()=>JSON.parse(render_game_to_text()).mode),'menu');
  await releaseJoe();await p.waitForFunction(()=>document.querySelector('#loading-screen').hidden);
  await p.unroute('**/assets/characters/joe-rogan.png');
  results.push({scenario:'Joe alone held: 87%, inert, keyboard blocked; decode releases startup'});
  const bounds=await p.evaluate(async()=>{
   const image=new Image();image.src='assets/characters/joe-rogan.png';await image.decode();
   const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const x=c.getContext('2d');x.drawImage(image,0,0);
   const d=x.getImageData(0,0,c.width,c.height).data;let left=c.width,right=0,top=c.height,bottom=0,transparent=0;
   for(let y=0;y<c.height;y++)for(let xx=0;xx<c.width;xx++){const a=d[(y*c.width+xx)*4+3];if(a===0)transparent++;if(a>16){left=Math.min(left,xx);right=Math.max(right,xx);top=Math.min(top,y);bottom=Math.max(bottom,y)}}
   return {width:c.width,height:c.height,left,right,top,bottom,transparent};
  });
  assert.equal(bounds.width,512);assert.equal(bounds.height,768);assert.ok(bounds.top>20&&bounds.left>10&&bounds.right<502&&bounds.bottom<758);assert.ok(bounds.transparent>100000);
  results.push({scenario:'transparent sprite has intact alpha margins on all four sides',bounds});
  for(const [name,w,h] of [['desktop',1440,900],['portrait',390,844],['small-portrait',320,568],['landscape',844,390]]){
   await p.setViewportSize({width:w,height:h});
   for(const [side,dx] of [['approach',180],['depart',-90]]){
    await p.evaluate(dx=>{__qa.start();__qa.S.next=1e9;__qa.S.obs=[];__qa.spawn('joe',dx);__qa.S.mode='paused';__qa.render();document.querySelectorAll('#game > :not(canvas)').forEach(n=>n.style.setProperty('display','none','important'))},dx);
    await p.screenshot({path:resolve(out,name+'-'+side+'.png')});
   }
  }
  // Inspect the actual Joe painter enlarged; its own image must be mirrored on departure.
  await p.setViewportSize({width:1000,height:700});
  const calls=await p.evaluate(()=>{
   const c=document.querySelector('#scene'),x=c.getContext('2d'),draw=x.drawImage,records=[];
   x.drawImage=function(source,...args){if(source instanceof HTMLImageElement&&source.src.includes('joe-rogan.png'))records.push({args,transform:this.getTransform().a});return draw.call(this,source,...args)};
   x.setTransform(1,0,0,1,0,0);x.fillStyle='#172027';x.fillRect(0,0,c.width,c.height);
   for(const [position,dx] of [[300,180],[750,-90]]){__qa.S.obs=[];__qa.spawn('joe',dx);x.save();x.translate(position,620);x.scale(5,5);__qa.characters.joe(__qa.S.obs[0]);x.restore()}
   x.drawImage=draw;const still=document.createElement('img');still.src=c.toDataURL();still.style='position:fixed;inset:0;width:100vw;height:100vh;z-index:1000';document.body.append(still);return records;
  });
  assert.equal(calls.length,2);assert.ok(calls[0].transform>0&&calls[1].transform<0);
  await p.screenshot({path:resolve(out,'joe-detail-both-directions.png')});
  results.push({scenario:'four viewports, approach/departure; enlarged actual painter reverses gaze and smile toward Elon',calls});
  p.expectedFailure=true;await p.route('**/assets/characters/joe-rogan.png',r=>r.fulfill({status:503,body:'unavailable'}));
  await p.goto(base);await p.waitForFunction(()=>document.querySelector('#loading-screen').classList.contains('has-error'));
  assert.equal(await p.locator('#start').isDisabled(),true);assert.equal(await p.locator('#loading-retry').isVisible(),true);
  await p.unroute('**/assets/characters/joe-rogan.png');p.expectedFailure=false;await p.click('#loading-retry');await p.waitForFunction(()=>document.querySelector('#loading-screen').hidden);
  results.push({scenario:'Joe sprite failure blocks start, retry recovers'});
  assert.deepEqual(errors,[]);writeFileSync(resolve(out,'joe.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({scenarios:results.length,errors}));
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});
