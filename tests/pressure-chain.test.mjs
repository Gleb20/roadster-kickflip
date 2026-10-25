import test from 'node:test';
import assert from 'node:assert/strict';
import {createFlight,createPace,createEconomy} from '../src/gameplay.js';
import {createBoosters} from '../src/boosters.js';
import {makePattern} from '../src/routes.js';
import {obstacleDefinition} from '../src/content.js';
import {validateEncounter,simulateEncounter} from '../src/encounter-routes.js';
import {createRun} from '../src/run.js';
import {createRun as oldRun} from '../supabase/rulesets/roadster-v480/run.js';

function options(speed=960,fuel=0){
 const pace={...createPace(),base:960,progress:150,speed,boost:speed>1300?.35:0},economy=createEconomy(),boosterState=createBoosters(17);
 if(speed>960){economy.streak=.25;economy.streakLeft=4;}
 if(speed>1300){boosterState.active.speed=8;boosterState.speedBlend=1;}
 return {pace,economy,boosterState,flight:createFlight(fuel),viewStrength:(speed-360)/300};
}
const chain=(speed,id='truck')=>makePattern('pressure-chain',{speed,type:obstacleDefinition(id),dx:speed*1.45+120,gapSeconds:.09});

test('late triples have independent zero-fuel jumps across the full timing grid',()=>{
 for(const speed of [960,1200,1620])for(const id of ['truck','batteryAgv']){
  const obs=chain(speed,id),opts=options(speed),r=validateEncounter(obs,{...opts,minGroundGap:.12});
  assert.ok(r,`${id}/${speed}`);assert.equal(r.jumps,3);assert.equal(r.fuelUsed,0);assert.equal(r.timingWindow,.18);
  for(const a of [-.09,0,.09])for(const b of [-.09,0,.09])for(const c of [-.09,0,.09]){
   const proof=simulateEncounter(obs,{...opts,charge:r.charge,lead:r.lead,jumpLeads:[r.lead+a,r.lead+b,r.lead+c],minGroundGap:.12});
   assert.ok(proof,`${id}/${speed}/${a}/${b}/${c}`);assert.ok(proof.preparation+1e-8>=r.errorPreparationTarget);
  }
 }
});
test('the same triple offers one long powered flight instead of three jumps',()=>{
 const obs=chain(960),ground=validateEncounter(obs,options()),powered=simulateEncounter(obs,{...options(960,80),charge:.5,lead:.25,burn:.9});
 assert.equal(ground.jumps,3);assert.equal(powered.jumps,1);assert.ok(powered.fuelUsed<=73&&powered.fuelUsed>=70);
 assert.ok(powered.actions.some(a=>a.action==='thrust-on'));
 for(const lead of [.22,.25,.28])for(const burn of [.87,.9,.93])assert.equal(simulateEncounter(obs,{...options(960,80),charge:.5,lead,burn})?.jumps,1);
 assert.ok(validateEncounter(obs,options(960,0)),'empty fuel never removes the ground route');
});
test('first twenty seconds keep the published physical state for identical player inputs',()=>{
 for(const seed of [17,932]){const a=createRun({seed}),b=oldRun({seed});a.reset();b.reset();const inputs=new Map();let wave=0;
  while(a.S.mode==='playing'&&a.S.t<20){
   for(const input of inputs.get(a.S.tick)||[]){a.command(input);b.command(input);}
   a.step();b.step();a.drainEvents();b.drainEvents();assert.deepEqual(a.S,b.S);assert.deepEqual(a.P,b.P);
   if(a.director.state.wave!==wave){wave=a.director.state.wave;for(const e of a.director.state.last.route.actions){const tick=a.S.tick+Math.round(e.at*120);if(!inputs.has(tick))inputs.set(tick,[]);inputs.get(tick).push(e.action==='hold'?'primary-down':'primary-up');}}
  }
  assert.equal(a.S.mode,'playing');
 }
});
