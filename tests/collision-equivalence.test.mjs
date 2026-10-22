import test from 'node:test';
import assert from 'node:assert/strict';
import {sweptCollision,createFlight,createPace,createEconomy} from '../src/gameplay.js';
import {makePattern,validateRoute} from '../src/routes.js';
import {createRun} from '../src/run.js';
import {types} from '../src/catalog.js';
import {createRandom} from '../src/random.js';
import {createFall,beginFall,advanceFall,fallPose} from '../src/fall.js';
import {sweptCollision as originalCollision} from '../supabase/rulesets/roadster-v380/gameplay.js';
import {validateRoute as originalRoute} from '../supabase/rulesets/roadster-v380/routes.js';
import {createRun as originalRun,verifyReplay as originalVerify} from '../supabase/rulesets/roadster-v400/run.js';

test('sweep pruning matches the frozen verifier across boundaries, fast crossings and reversed travel',()=>{
 const random=createRandom(5873),dxs=[180,180+1e-9,180-1e-9,-400,-180,-180-1e-9,900,0];
 for(let i=0;i<2400;i++){
  const before={y:random.next()*1000,angle:(random.next()-.5)*12,grab:random.next()},after={y:before.y+(random.next()-.5)*160,angle:before.angle+(random.next()-.5)*2,grab:random.next()};
  const hazards=types.filter(o=>o.collision!=='none'),obstacle={...hazards[i%hazards.length]},dx=i<dxs.length*types.length?dxs[i%dxs.length]:random.next()*1800-900,move=(random.next()-.5)*800,time=random.next()*200;
  assert.equal(sweptCollision(before,after,obstacle,dx,dx+move,time,1/120),originalCollision(before,after,obstacle,dx,dx+move,time,1/120),`sample ${i}`);
 }
 const p={y:0,angle:0},o={id:'truck',w:110,h:41};
 for(const [a,b] of [[200,-400],[-400,200],[181,181],[-291,-291],[180,180],[-290,-290]])assert.equal(sweptCollision(p,p,o,a,b,0,1/120),originalCollision(p,p,o,a,b,0,1/120));
 assert.equal(sweptCollision(p,p,o,200,-400,0,1/120),true,'crossing the whole collision window must still hit');
});

test('falling rider and car retain exact swept collision results',()=>{
 const fall=createFall();beginFall(fall,{angle:-1.2,omega:-7.2,impact:800},{speed:450});
 for(let i=0;i<420;i++){
  const before={y:0,angle:0,fallPose:fallPose(fall)};advanceFall(fall,1/120);const after={y:0,angle:0,fallPose:fallPose(fall)};
  for(const dx of [-500,-200,-50,50,180,181,500])for(const obstacle of types.filter(o=>!o.altitude&&o.collision!=='none'))assert.equal(sweptCollision(before,after,obstacle,dx,dx-5,i/120,1/120),originalCollision(before,after,obstacle,dx,dx-5,i/120,1/120));
 }
});

test('all route patterns retain exact choices, timing margins and action schedules',()=>{
 for(const progress of [0,65,130,160])for(const fuel of [0,50,100])for(const kind of ['single','pair','hover','incoming','precision','mixed','thrust']){
  const flight=createFlight(fuel),pace=createPace(),economy=createEconomy();pace.progress=progress;pace.base=pace.speed=360+300*Math.min(1,progress/150);
  const obstacles=makePattern(kind,{speed:pace.speed,dx:1000,type:types.find(o=>o.id==='truck')}),options={flight,pace,economy,time:progress,timingMargin:.035};
  assert.deepEqual(validateRoute(obstacles,options),originalRoute(obstacles,options),`${progress}/${fuel}/${kind}`);
 }
});

test('seeded runs and completed replays remain identical to the frozen server ruleset',()=>{
 for(const seed of [17,932,93817]){
  const run=createRun({seed}),original=originalRun({seed}),actions=new Map();run.reset();original.reset();let wave=0;
  while(run.S.mode==='playing'){
   for(const action of actions.get(run.S.tick)||[]){run.command(action);original.command(action);}
   run.step();original.step();run.drainEvents();original.drainEvents();
   assert.equal(run.S.tick,original.S.tick);assert.equal(run.S.mode,original.S.mode);
   if(run.director.state.wave!==wave){wave=run.director.state.wave;assert.deepEqual(run.snapshot(),original.snapshot());
    if(run.S.t<30)for(const event of run.director.state.last.route.actions){const tick=run.S.tick+Math.round(event.at*120),action={hold:'primary-down',jump:'primary-up','thrust-on':'thrust-on','thrust-off':'thrust-off'}[event.action];if(!actions.has(tick))actions.set(tick,[]);actions.get(tick).push(action);}
   }
   assert.ok(run.S.t<60,'fixture should finish after witness inputs stop');
  }
  assert.deepEqual(run.snapshot(),original.snapshot());assert.deepEqual(originalVerify(run.replay()),{score:run.S.score,flips:run.E.flips,ticks:run.S.tick});
 }
});
