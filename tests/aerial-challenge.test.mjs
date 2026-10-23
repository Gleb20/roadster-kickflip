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

test('Xi remains a ground hazard while ordinary flying enemies clear an upright ground rider',()=>{
 assert.ok(collisionAt(createFlight(),obstacleDefinition('xi'),0));
 for(const o of AIR_TYPES){assert.equal(o.collision,'box');assert.ok(o.altitude>=205);assert.equal(collisionAt(createFlight(),o,0),false);assert.ok(collisionAt({...createFlight(),y:o.altitude},o,0));}
});
test('all air models have zero-input fuel-free underpasses at the complete speed envelope',()=>{
 for(const speed of [360,660,825,1113.75,1373.75])for(const type of AIR_TYPES){
  const pace=createPace(),economy=createEconomy();pace.progress=150;pace.base=660;pace.speed=speed;
  const obs=makePattern('air-pass',{speed,type:{...type,approachSpeed:100},dx:Math.max(1170,speed*1.8)});
  const route=validateRoute(obs,{flight:createFlight(0),pace,economy,allowThrust:false,timingMargin:.09});assert.ok(route,`${type.id}/${speed}`);assert.equal(route.fuelUsed,0);assert.deepEqual(route.actions,[]);
 }
});
test('factory generation retains its eligible canonical vehicles',()=>{
 const {S,director}=directorFixture(7500),seen=new Set();for(let i=0;i<100;i++){S.obs=[];S.rails=[];director.update();S.t+=5;director.spawn();for(const o of S.obs)seen.add(o.id);}assert.ok(seen.has('bydSeal')||seen.has('xiaomiSu7')||seen.has('batteryAgv'));
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
