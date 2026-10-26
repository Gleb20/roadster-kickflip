import test from 'node:test';
import assert from 'node:assert/strict';
import {createRun,verifyReplay,validateReplay} from '../src/run.js';
import {TUTORIAL_LESSONS} from '../src/tutorial.js';
import {tutorialInput} from '../scripts/tutorial-fixture.mjs';
import {createClock} from '../src/clock.js';
import {createTutorialProgress} from '../src/coaching.js';
import {createRun as previousRun} from '../supabase/rulesets/roadster-v4100/run.js';

test('fixed tutorial is completed with real inputs and continues into a verifiable ordinary run',()=>{
 const r=createRun({seed:93817});r.reset(93817,{tutorial:true});const completed=[];
 while(r.S.tick<18000&&r.T.active){tutorialInput(r);r.drainEvents();r.step();completed.push(...r.drainEvents().filter(e=>e.type==='tutorial-complete').map(e=>e.lesson));}
 assert.deepEqual(completed,TUTORIAL_LESSONS,JSON.stringify(r.T));assert.equal(r.S.mode,'playing');assert.equal(r.S.score,175);assert.equal(r.input.spin,false);assert.equal(r.input.thrust,false);
 const score=r.S.score;while(r.S.mode==='playing'&&r.S.tick<24000){r.step();r.drainEvents();}
 assert.equal(r.S.mode,'dead');assert.ok(r.S.score>score);assert.equal(verifyReplay(r.replay()).score,r.S.score);
});
test('protected retries cannot die or farm distance and cannot restart tutorial mid-run',()=>{
 const r=createRun();r.reset(12,{tutorial:true});for(let i=0;i<6000;i++){r.step();r.drainEvents();}
 assert.equal(r.S.mode,'playing');assert.ok(r.T.attempt>10);assert.equal(r.S.score,0);assert.equal(r.command('tutorial-start'),false);
 assert.equal(r.command('tutorial-skip'),true);assert.equal(r.T.active,false);assert.equal(r.command('tutorial-skip'),false);assert.equal(r.input.charging,false);
 while(r.S.mode==='playing')r.step();assert.equal(verifyReplay(r.replay()).score,r.S.score);
});
test('tutorial layout is seed-independent and checkpoints preserve retries/progression',()=>{
 const a=createRun({seed:5}),b=createRun({seed:99});a.reset(5,{tutorial:true});b.reset(99,{tutorial:true});assert.deepEqual(a.S.obs,b.S.obs);
 for(let i=0;i<300;i++){tutorialInput(a);a.step();a.drainEvents();}
 const saved=a.snapshot(),copy=createRun({seed:5,record:false});copy.restore(saved);
 for(let i=0;i<1500;i++){tutorialInput(a);tutorialInput(copy);a.step();copy.step();a.drainEvents();copy.drainEvents();}
 assert.deepEqual(a.snapshot(),copy.snapshot());
});
test('replay rejects duplicated, late or out-of-order tutorial grants',()=>{
 const envelope=events=>({format:1,ruleset:'roadster-v4.11.0',seed:1,ticks:100,events});
 for(const events of [[[1,7]],[[0,7],[0,7]],[[0,0],[0,7]],[[0,8]],[[0,7],[1,8],[2,8]]])assert.throws(()=>validateReplay(envelope(events)));
 assert.doesNotThrow(()=>validateReplay(envelope([[0,6],[0,7],[1,8]])));
});
test('slow motion scales elapsed time while pause and interruptions keep fixed physics steps',()=>{
 for(const fps of [30,60,120]){const c=createClock(),steps=[];for(let i=0;i<=fps*10;i++)c.advance(i*1000/fps,dt=>steps.push(dt),()=>{},.38);assert.equal(steps.length,456);assert.ok(steps.every(dt=>dt===1/120));}
 const c=createClock();let ticks=0,interruptions=0;c.advance(0,()=>ticks++);c.advance(200,()=>ticks++,()=>{},0);assert.equal(ticks,0);c.advance(1000,()=>ticks++,()=>interruptions++,.38);assert.equal(interruptions,1);assert.equal(ticks,0);
});
test('lesson persistence keeps existing players quiet and skip requires an explicit replay',()=>{
 const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
 let p=createTutorialProgress(storage);assert.equal(p.shouldStart(false),true);assert.equal(p.shouldStart(true),false);p.complete('jump');p.skip();p=createTutorialProgress(storage);assert.equal(p.state.lessons.jump,true);assert.equal(p.shouldStart(false),false);p.reset();assert.equal(p.shouldStart(false),true);p.finish();assert.equal(createTutorialProgress(storage).shouldStart(false),false);
 assert.doesNotThrow(()=>{const blocked=createTutorialProgress({getItem(){throw Error()},setItem(){throw Error()}});blocked.complete('jump');blocked.skip();blocked.reset();});
});
test('practice cannot advance biome time and protection ends on skip',()=>{
 const r=createRun();r.reset(45,{tutorial:true});for(let i=0;i<6000;i++)r.step();assert.equal(r.S.playTime,0);r.command('tutorial-skip');for(let i=0;i<60;i++)r.step();assert.equal(r.S.playTime,.5);assert.equal(r.S.score,9);while(r.S.mode==='playing')r.step();assert.equal(r.S.mode,'dead');
});
test('a later ordinary attempt resets every practice offset',()=>{
 const r=createRun();r.reset(1,{tutorial:true});for(let i=0;i<900;i++)r.step();r.command('tutorial-skip');r.reset(1,{experienced:true});const clean=createRun();clean.reset(1,{experienced:true});
 for(let i=0;i<500;i++){r.step();clean.step();r.drainEvents();clean.drainEvents();}assert.deepEqual(r.snapshot(),clean.snapshot());
});
test('ordinary first and experienced attempts retain the prior pace, physics and encounters',()=>{
 for(const seed of [17,932,93817])for(const experienced of [false,true]){
  const a=createRun({seed}),b=previousRun({seed});a.reset(seed,{experienced});b.reset(seed,{experienced});const actions=new Map();let wave=0;
  while(a.S.mode==='playing'){
   for(const action of actions.get(a.S.tick)||[]){a.command(action);b.command(action);}
   a.step();b.step();a.drainEvents();b.drainEvents();assert.equal(a.S.mode,b.S.mode);
   if(b.director.state.wave!==wave){wave=b.director.state.wave;if(b.S.t<30)for(const e of b.director.state.last.route.actions){const tick=b.S.tick+Math.round(e.at*120),action={hold:'primary-down',jump:'primary-up','thrust-on':'thrust-on','thrust-off':'thrust-off'}[e.action];if(!actions.has(tick))actions.set(tick,[]);actions.get(tick).push(action);}}
   assert.ok(a.S.t<60);
  }
  const current=a.snapshot(),previous=b.snapshot();delete current.T;delete current.S.playTime;delete current.pace.scoreOffset;assert.deepEqual(current,previous);
 }
});
