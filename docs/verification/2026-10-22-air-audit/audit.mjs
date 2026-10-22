import {pathToFileURL} from 'node:url';
import {writeFileSync} from 'node:fs';
const root=process.cwd();
const {makePattern,validateRoute}=await import(pathToFileURL(root+'/src/routes.js'));
const {createFlight,createPace,createEconomy,collisionAt}=await import(pathToFileURL(root+'/src/gameplay.js'));
const {createRun}=await import(pathToFileURL(root+'/src/run.js'));
const {GAMEPLAY:C}=await import(pathToFileURL(root+'/src/gameplay-config.js'));
const rows=[];
for(const speed of [360,510,660,825]){
 const pace=createPace(),e=createEconomy();pace.progress=Math.min(150,(speed-360)/2);pace.base=Math.min(660,speed);pace.speed=speed;if(speed>660){e.streak=.25;e.streakLeft=4;}
 for(const kind of ['hover','incoming','precision','mixed']){
  const obstacles=makePattern(kind,{speed,dx:1200}),ground=obstacles.filter(o=>!o.altitude);
  const witness=validateRoute(obstacles,{pace,economy:e,flight:createFlight(0),timingMargin:C.routeTimingMargin});
  let both=0,groundOnly=0,fullOnly=0,neither=0,example=null;
  for(const charge of [0,.25,.5,.75,1])for(const lead of [.08,.1,.12,.14,.16,.2,.25,.3,.4,.5,.65,.8]){
   const options={pace,economy:e,flight:createFlight(0),charges:[charge],leads:[lead],burns:[0]};
   const full=!!validateRoute(obstacles,options),bare=!!validateRoute(ground,options);
   if(full&&bare)both++;else if(bare){groundOnly++;example??={charge,lead};}else if(full)fullOnly++;else neither++;
  }
  const run=createRun({seed:1,record:false});run.reset();run.S.next=1e6;Object.assign(run.pace,pace);Object.assign(run.E,e);run.S.obs=obstacles.map((o,i)=>({...o,uid:i+1}));
  while(run.S.mode==='playing'&&run.S.tick<1440&&run.S.obs.some(o=>!o.passed))run.step();
  rows.push({speed,kind,obstacles:obstacles.map(({id,x,w,h,altitude,approachSpeed})=>({id,x,w,h,altitude,approachSpeed})),noInput:{alive:run.S.mode==='playing',allPassed:run.S.obs.every(o=>o.passed),time:run.S.t,bonus:run.E.bonus},witness:witness&&{charge:witness.charge,lead:witness.lead,burn:witness.burn,timingMargin:witness.timingMargin},grid:{count:60,both,groundOnly,fullOnly,neither,example}});
 }
}
const result={date:'2026-10-22',version:C.version,scope:'Deterministic current-core characterization, not browser/phone playtesting. No-spin, zero-fuel controls. Grid measures sampled action plans, not probability or continuous safe-window width.',groundedHeroTop:163,routeTimingMargin:C.routeTimingMargin,rows};
writeFileSync(process.argv[2]||'/tmp/tesla-air-audit-20261022.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
