import test from 'node:test';
import assert from 'node:assert/strict';
import {createRocketState,advanceRocket} from '../src/rocket.js';
function run(state,seconds,random=()=>.8,start=0){let now=start;for(let i=0;i<Math.round(seconds*120);i++){now+=1/120;advanceRocket(state,1/120,now,random);}return now;}
test('successful launch reaches orbit, lands, settles and waits before relaunch',()=>{
 const s=createRocketState();let t=run(s,24.2);assert.equal(s.phase,'orbit');
 t=run(s,14.2,()=>.8,t);assert.equal(s.phase,'landing');
 t=run(s,14.2,()=>.8,t);assert.equal(s.phase,'ready');assert.equal(s.kind,'landing');assert.equal(s.events,2);
 run(s,5,()=>.8,t);assert.equal(s.phase,'ready');
});
test('failed launch and failed landing recover through explosion and delivery',()=>{
 for(const phase of ['launch','landing']){
  const s={...createRocketState(),phase,fail:true};let t=run(s,phase==='launch'?5.6:13.3);assert.equal(s.phase,'explosion');
  t=run(s,5.1,()=>.8,t);assert.equal(s.phase,'delivery');
  run(s,12.1,()=>.8,t);assert.equal(s.phase,'ready');assert.ok(s.next>t);
 }
});
test('fresh state clears passage, failure and event counters on restart',()=>{
 assert.deepEqual(createRocketState(),{phase:'ready',t:0,next:10,fail:false,crashLift:0,kind:'launch',events:0,pass:0});
});
test('failure explosion starts at the actual rocket altitude without a visible teleport',async()=>{
 const {rocketLift}=await import('../src/rocket.js');
 for(const [phase,t] of [['launch',5.5],['landing',13.2]]){
  const s={...createRocketState(),phase,fail:true,t:t-1/120};
  advanceRocket(s,1/120,t,()=>.8);
  assert.equal(s.phase,'explosion');
  assert.ok(Math.abs(s.crashLift-rocketLift(phase,t))<1e-10);
 }
 assert.equal(rocketLift('launch',0),0);assert.equal(rocketLift('launch',14),1);
 assert.equal(rocketLift('landing',0),1);assert.equal(rocketLift('landing',14),0);
});
