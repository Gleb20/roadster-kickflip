import test from 'node:test';
import assert from 'node:assert/strict';
import {createRandom} from '../src/random.js';
import {createRun,verifyReplay,validateReplay,RUN_STEP} from '../src/run.js';
test('seeded random state survives serialisation and rejects invalid seeds',()=>{
 const a=createRandom(0),b=createRandom(0xffffffff);const first=Array.from({length:20},()=>a.next());assert.ok(first.every(n=>n>=0&&n<1));assert.notDeepEqual(first,Array.from({length:20},()=>b.next()));
 const saved=JSON.parse(JSON.stringify({state:a.state})),expected=Array.from({length:50},()=>a.next());b.restore(saved.state);assert.deepEqual(Array.from({length:50},()=>b.next()),expected);assert.throws(()=>createRandom(-1));
});
test('completed run replays to its exact first collision and ignores supplied score claims',()=>{
 for(const seed of [0,17,0xffffffff]){const r=createRun({seed});r.reset();while(r.S.mode==='playing'){r.step();r.drainEvents();}const replay=r.replay();assert.deepEqual(verifyReplay({...replay,score:999999999}),{score:r.S.score,flips:r.E.flips,ticks:r.S.tick});assert.throws(()=>verifyReplay({...replay,ticks:replay.ticks-1}));assert.throws(()=>verifyReplay({...replay,ticks:replay.ticks+1}));}
});
test('charge, spin, thrust, cancellation and recovery use the same recorded commands',()=>{
 const r=createRun({seed:71});r.reset();
 const actions=new Map([[0,['primary-down']],[48,['primary-up']],[60,['primary-down','thrust-on']],[95,['thrust-off']],[132,['primary-up']],[160,['primary-down']],[161,['primary-cancel']],[180,['cancel']]]);
 while(r.S.mode==='playing'){for(const a of actions.get(r.S.tick)||[])r.command(a);r.step();r.drainEvents();}
 assert.ok(r.replay().events.length>=8);assert.deepEqual(verifyReplay(r.replay()),{score:r.S.score,flips:r.E.flips,ticks:r.S.tick});
});
test('paused render time, viewport and reduced motion cannot alter replay physics',()=>{
 const a=createRun({seed:9}),b=createRun({seed:9,reducedMotion:true});a.reset();b.reset();
 for(let i=0;i<200;i++){a.S.anchor=i*3.14159;b.S.anchor=-i*8;for(const r of [a,b]){if(i===0)r.command('primary-down');if(i===48)r.command('primary-up');if(i===70)r.command('primary-down');if(i===140)r.command('primary-up');r.step();r.drainEvents();}}
 const saved=JSON.parse(JSON.stringify(a.snapshot())),c=createRun({record:false});c.restore(saved);
 while(a.S.mode==='playing'){for(const r of [a,b,c]){r.step();r.drainEvents();}}
 for(const r of [b,c]){assert.equal(r.S.tick,a.S.tick);assert.equal(r.S.score,a.S.score);assert.deepEqual(r.P,a.P);assert.deepEqual(r.E,a.E);assert.deepEqual(r.S.obs,a.S.obs);}
 assert.equal(a.S.t,a.S.tick*RUN_STEP);
});
test('replay parser bounds ticks/events and rejects malformed or unsupported inputs',()=>{
 const r=createRun();r.reset();r.step();const valid=r.replay();
 for(const mutation of [{ruleset:'unknown'},{ticks:0},{ticks:432001},{seed:-1},{events:[[0,99]]},{events:[[1,0],[0,1]]},{events:[[0,.1]]},{events:[[0,0,0]]},{events:Array(24001).fill([0,0])}])assert.throws(()=>validateReplay({...valid,...mutation}));
 r.S.mode='paused';const t=r.S.tick;r.step();assert.equal(r.S.tick,t);assert.equal(r.command('primary-down'),false);r.S.mode='playing';assert.throws(()=>r.command('teleport'));
});
test('service recording limit does not end the endless casual simulation',()=>{
 const r=createRun({seed:4});r.reset();r.S.tick=432000;r.S.next=1e9;r.step();
 assert.equal(r.S.mode,'playing');assert.equal(r.recordable,false);assert.equal(r.replay(),null);r.step();assert.equal(r.S.tick,432002);
});
