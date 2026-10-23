import test from 'node:test';
import assert from 'node:assert/strict';
import {createDirector} from '../src/director.js';
import {AIR_TYPES,obstacleDefinition} from '../src/content.js';
import {createFlight,createPace,createEconomy,collisionAt} from '../src/gameplay.js';
import {validateRoute,makePattern} from '../src/routes.js';

function directorFixture(score=14500){
 const flight=createFlight(0),pace=createPace(),economy=createEconomy();pace.progress=150;pace.base=pace.speed=660;
 const S={t:180,score,speed:660,next:0,obs:[],entityId:0,anchor:0};let n=0;
 const director=createDirector({S,flight,pace,economy,spawnDistance:()=>1170,random:()=>((++n*37)%97)/97});
 return {S,flight,pace,economy,director};
}

test('Xi and every flying model are actual grounded-player collision hazards',()=>{
 for(const o of [...AIR_TYPES,obstacleDefinition('xi')]){assert.equal(o.collision,'box',o.id);assert.ok(collisionAt(createFlight(),o,0),o.id);assert.equal(collisionAt({...createFlight(),y:450},o,0),false,o.id);}
});

test('all air models have broad zero-fuel jump routes even at maximum boosted speed',()=>{
 for(const speed of [360,660,825])for(const type of AIR_TYPES){
  const pace=createPace(),economy=createEconomy();pace.progress=150;pace.base=Math.min(speed,660);pace.speed=speed;
  if(speed>660){economy.streak=.25;economy.streakLeft=4;}
  const obs=makePattern('air',{speed,type:{...type,approachSpeed:100},dx:Math.max(1170,speed*1.8)});
  assert.equal(obs.length,1);assert.ok(obs[0].altitude>0);
  const route=validateRoute(obs,{flight:createFlight(0),pace,economy,allowThrust:false,timingMargin:.09});
  assert.ok(route,`${type.id}/${speed}`);assert.equal(route.fuelUsed,0);
 }
});

test('air unlocks on third leg, stays rare, is isolated and gets a ground breather',()=>{
 for(const score of [1000,7500,14500,21500]){
  const {S,director}=directorFixture(score);const waves=[];
  for(let i=0;i<48;i++){S.obs=[];S.t+=5;director.spawn();waves.push({time:S.t,kind:director.state.last.kind,obs:[...S.obs],wait:S.next,route:director.state.last.route});}
  const air=waves.flatMap((w,i)=>w.kind==='air'?[i]:[]);
  if(score<14000){assert.equal(air.length,0);continue;}
  assert.ok(air.length>=2&&air.length<=7,`${score}: ${air.length}`);
  for(const i of air){assert.equal(waves[i].obs.length,1);assert.equal(waves[i-1].kind,'single');assert.equal(waves[i+1]?.kind,'single');assert.equal(waves[i].route.fuelUsed,0);assert.ok(waves[i].route.timingMargin>=.09);assert.ok(waves[i].wait>=waves[i].route.duration+1.2);}
  for(let i=1;i<air.length;i++){assert.ok(air[i]-air[i-1]>=7);assert.ok(waves[air[i]].time-waves[air[i-1]].time>=28);}
 }
});

test('Xi enters the factory ground generator as an ordinary single or pair',()=>{
 const {S,director}=directorFixture(7500),seen=new Set();
 for(let i=0;i<100;i++){S.obs=[];S.t+=5;director.spawn();for(const o of S.obs){seen.add(o.id);if(o.id==='xi'){assert.equal(o.altitude||0,0);assert.equal(o.collision,'box');}}}
 assert.ok(seen.has('xi'));
});


test('frozen 4.1 late-air replay and checkpoint retain their original collision contract',async()=>{
 const {createRun}=await import('../supabase/rulesets/roadster-v410/run.js');const {verifyChunk}=await import('../supabase/chunk.mjs');
 const run=createRun({seed:17}),actions=new Map();run.reset();let wave=0,airSeen=false,death=null;
 while(run.S.mode==='playing'){
  for(const action of actions.get(run.S.tick)||[])run.command(action);
  run.step();for(const e of run.drainEvents())if(e.type==='death')death=e.obstacle;
  if(run.director.state.wave!==wave){wave=run.director.state.wave;
   if(run.director.state.last.kind==='air'){airSeen=true;assert.ok(run.director.state.last.leg>=2);actions.clear();run.command('cancel');}
   else if(!airSeen)for(const a of run.director.state.last.route.actions){const at=run.S.tick+Math.round(a.at*120);if(!actions.has(at))actions.set(at,[]);actions.get(at).push({hold:'primary-down',jump:'primary-up','thrust-on':'thrust-on','thrust-off':'thrust-off'}[a.action]);}
  }
  assert.ok(run.S.t<240);
 }
 assert.ok(airSeen);assert.ok(death.altitude>0);let checkpoint=null,result;
 do{result=verifyChunk(run.replay(),checkpoint,{maxTicks:277,budgetMs:Infinity});checkpoint=result.checkpoint?JSON.parse(JSON.stringify(result.checkpoint)):null;}while(result.outcome==='pending');
 assert.equal(result.outcome,'accepted');assert.equal(result.result.score,run.S.score);
});
