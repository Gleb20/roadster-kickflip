const {chromium}=require('/Users/liubavskii/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),assert=require('assert/strict'),{PNG}=require('/Users/liubavskii/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');
(async()=>{const out='/tmp/tesla-contour-browser';fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),checks=[],errors=[],pixels=[];const check=(n,v)=>{assert.ok(v,n);checks.push(n)};
try{for(const [width,height]of [[320,568],[440,956],[844,390],[1280,800]]){
 const c=await b.newContext({viewport:{width,height},isMobile:width<1000,hasTouch:true,reducedMotion:'reduce'}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:8776/?qa=1');await p.waitForFunction(()=>typeof render_game_to_text==='function'&&!document.querySelector('#game').inert);await p.locator('#start').tap();await p.waitForSelector('#tutorial-card');
 await p.evaluate(()=>{window.requestAnimationFrame=()=>0});await p.waitForTimeout(70);
 for(const [index,name]of [[0,'truck'],[2,'flip'],[3,'thrust'],[4,'rail'],[5,'air'],[6,'pickup']]){
 await p.evaluate(async index=>{const q=window.__qa,{tutorialScene}=await import('./src/tutorial.js?v=4.11.1');q.T.index=index;tutorialScene(q.T,q.run,()=>{});q.run.input.charging=false;q.run.input.spin=false;q.run.input.thrust=false;
 const s=JSON.parse(render_game_to_text()).camera;
 if(q.S.obs[0])q.S.obs[0].x=(innerWidth*.67-s.x)/s.scale;
 if(q.S.rails[0])q.S.rails[0].x=(innerWidth*.45-s.x)/s.scale;
 if(index===2||index===3)Object.assign(q.P,{airborne:true,y:130,angle:index===2?-1.7:0,time:.3});
 if(index===6){q.Q.pickups[0].x=(innerWidth*.7-s.x)/s.scale;q.Q.active.score=10;}
 q.syncState();q.refreshHUD();q.render();},index);
 check(width+' '+name+' focus',await p.locator('#game').getAttribute('data-lesson-target')===(name==='thrust'?'thrust':name==='pickup'?'bonus':'road'));
 if(width===440||index===4)await p.screenshot({path:out+'/'+width+'-'+name+'.png'});
 if(index===4){const result=await p.evaluate(()=>{
 const q=window.__qa,scene=document.querySelector('#scene'),ctx=scene.getContext('2d'),w=scene.width,h=scene.height,transform=ctx.getTransform(),k=w/innerWidth;
 const active=ctx.getImageData(0,0,w,h).data;q.T.active=false;q.render();const base=ctx.getImageData(0,0,w,h).data;q.T.active=true;q.render();
 const mask=document.createElement('canvas');mask.width=w;mask.height=h;const m=mask.getContext('2d');m.setTransform(transform);const cam=JSON.parse(render_game_to_text()).camera;q.railPainter.draw(m,q.S.rails,{px:cam.x,ground:cam.ground,scale:cam.scale});const alpha=m.getImageData(0,0,w,h).data;
 const r=q.S.rails[0],left=Math.ceil((cam.x+r.x*cam.scale)*k)+2,top=Math.ceil((cam.ground-r.h*cam.scale)*k)+2,bottom=Math.min(h,Math.floor(cam.ground*k)-8);
 let opaque=0,gaps=0,badOpaque=0,badGaps=0;
 for(let y=top;y<bottom;y++)for(let x=left;x<w-4;x++){const i=(y*w+x)*4,a=alpha[i+3];let err=0;for(let c=0;c<3;c++){const expected=a>=250?base[i+c]:Math.round([16,21,27][c]*.76+base[i+c]*.24);err=Math.max(err,Math.abs(active[i+c]-expected));}
 if(a>=250){opaque++;if(err>3)badOpaque++;}else if(a===0){gaps++;if(err>3)badGaps++;}}
 // The old broad road/player corridor is now dark, including beneath the rider.
 const x=Math.floor((cam.x+innerWidth*.15)*k),y=Math.floor((cam.ground+40)*k),i=(y*w+x)*4;let roadError=0;for(let c=0;c<3;c++)roadError=Math.max(roadError,Math.abs(active[i+c]-Math.round([16,21,27][c]*.76+base[i+c]*.24)));
 return {opaque,gaps,badOpaque,badGaps,roadError};});pixels.push({width,...result});console.log({width,...result});check(width+' exact opaque rail silhouette',result.opaque>30&&result.badOpaque===0);check(width+' rail holes remain dark',result.gaps>200&&result.badGaps===0);check(width+' no broad road opening',result.roadError<=3);}
 if(name==='thrust'||name==='pickup'){
 const selector=name==='thrust'?'#boost':'.powerup-card[data-booster="score"]';
 await p.locator('#lesson-input').evaluate(e=>e.style.visibility='hidden');
 const r=await p.locator(selector).boundingBox(),a=PNG.sync.read(await p.screenshot());
 await p.locator(selector).evaluate(e=>e.style.visibility='hidden');const z=PNG.sync.read(await p.screenshot());
 await p.locator(selector).evaluate(e=>e.style.visibility='');await p.locator('#lesson-input').evaluate(e=>e.style.visibility='');
 const delta=(u,v)=>{const x=Math.floor(r.x+r.width*u),y=Math.floor(r.y+r.height*v),i=(y*a.width+x)*4;return Math.max(...[0,1,2].map(c=>Math.abs(a.data[i+c]-z.data[i+c])))};
 check(width+' '+name+' transparent corner has no lit rectangle',delta(name==='thrust'?.94:.02,name==='thrust'?.94:.02)<=5);
 let maxDelta=0;for(let v=.15;v<.85;v+=.1)for(let u=.15;u<.85;u+=.1)maxDelta=Math.max(maxDelta,delta(u,v));check(width+' '+name+' shape remains visible',maxDelta>10);
 }
 if(name==='thrust')check(width+' actual thrust control undimmed',await p.locator('#boost').evaluate(e=>getComputedStyle(e).filter==='none'));
 if(name==='pickup')check(width+' actual bonus card undimmed',await p.locator('#powerups').evaluate(e=>getComputedStyle(e).filter==='none'));
 }
 check(width+' tools undimmed',await p.locator('.tools').evaluate(e=>getComputedStyle(e).filter==='none'));
 await p.locator('#pause').tap();await p.waitForSelector('#paused',{state:'visible'});await p.evaluate(()=>window.__qa.render());check(width+' pause removes dim state',!await p.locator('#game').evaluate(e=>e.classList.contains('training')));
 await p.locator('#resume').tap();await p.evaluate(()=>window.__qa.render());await p.locator('#tutorial-skip').tap();await p.evaluate(()=>window.__qa.render());check(width+' skip restores native UI',await p.locator('#boost').evaluate(e=>getComputedStyle(e).filter==='none'));
 await c.close();}
check('no runtime errors',!errors.length);fs.writeFileSync(out+'/result.json',JSON.stringify({checks,pixels,errors,physicalPhone:false},null,2));console.log(JSON.stringify({checks,pixels,errors}));}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
