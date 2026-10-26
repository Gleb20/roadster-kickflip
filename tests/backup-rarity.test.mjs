import test from 'node:test';
import assert from 'node:assert/strict';
import {createBoosters,offerBooster} from '../src/boosters.js';
import {createRun} from '../src/run.js';
function sample(seed){
 const q=createBoosters(seed),offers=[];let cycles=0,time=8;
 while(cycles<3||q.bag.length){
  if(!q.bag.length)cycles++;
  offerBooster(q,{time,speed:400,clear:true,obstacles:[{x:1000,w:110,h:41}]});
  offers.push(...q.pickups.map(p=>p.id));q.pickups=[];time+=21;
  assert.ok(offers.length<30);
 }
 return offers;
}
test('backup is absent from two initial bags and occurs once per twelve ordinary boosts',()=>{
 for(let seed=0;seed<64;seed++){
  const offers=sample(seed),counts=Object.fromEntries(['shield','speed','jump','life','score'].map(id=>[id,offers.filter(x=>x===id).length]));
  assert.deepEqual(counts,{shield:3,speed:3,jump:3,life:1,score:3},'seed '+seed);
  assert.ok(offers.indexOf('life')>=8,'no early backup, seed '+seed);
  assert.deepEqual(sample(seed),offers,'seeded order is stable');
 }
});
test('backup cycle survives JSON checkpoints, resets on restart and never offers a third charge',()=>{
 const a=createRun({seed:21});a.reset();a.S.next=1e9;
 let attempts=0;while(a.Q.bagCycle<2){assert.ok(attempts++<30,'bounded bag generation');offerBooster(a.Q,{time:a.S.t+100,speed:400,clear:true,obstacles:[{x:1000,w:110,h:41}]});a.Q.pickups=[];a.S.t+=30;}
 const b=createRun({record:false});b.restore(JSON.parse(JSON.stringify(a.snapshot())));
 for(let i=0;i<30;i++){
  for(const r of [a,b]){r.Q.hearts=2;offerBooster(r.Q,{time:10000+i*30,speed:400,clear:true,obstacles:[{x:1000,w:110,h:41}]});assert.ok(r.Q.pickups.every(p=>p.id!=='life'));r.Q.pickups=[];}
  assert.deepEqual(b.Q,a.Q);
 }
 a.reset();assert.equal(a.Q.bagCycle,0);
});
