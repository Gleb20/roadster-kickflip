import test from 'node:test';import assert from 'node:assert/strict';
import {createRun,verifyReplay,RUN_STEP} from '../rulesets/roadster-v342/run.js';
import {verifyChunk} from '../chunk.mjs';import {createHandler} from '../handler.mjs';
const fixture=()=>{const run=createRun({seed:19});run.reset();while(run.S.mode==='playing')run.step();return run.replay();};
test('service checkpoints preserve exact replay result and resume after interruption',()=>{
 const r=fixture(),expected=verifyReplay(r);let c=null,n=0,v;
 do{v=verifyChunk(r,c,{maxTicks:77,budgetMs:Infinity});c=v.checkpoint?JSON.parse(JSON.stringify(v.checkpoint)):null;n++;}while(v.outcome==='pending');
 assert.ok(n>2);assert.deepEqual(v.result,expected);assert.equal(v.outcome,'accepted');
 assert.equal(verifyChunk({...r,ticks:r.ticks-1}).outcome,'rejected');assert.equal(verifyChunk({...r,ticks:r.ticks+1}).outcome,'rejected');
});
test('verification yields at the bounded time budget',()=>{let clock=0;const r=fixture(),v=verifyChunk(r,null,{maxTicks:6000,budgetMs:2,now:()=>clock+=2});assert.equal(v.outcome,'pending');assert.equal(v.progress,32);});
test('endpoint rejects wrong origins and streamed oversized data before database access',async()=>{
 let calls=0;const handle=createHandler({rpc:async()=>{calls++;return {};}});
 const req=(path,body,origin='https://evil.test')=>new Request('https://x.test/functions/v1/tesla-ranking'+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
 assert.equal((await handle(req('/sessions',{ruleset:'roadster-v3.4.2'}))).status,403);assert.equal(calls,0);
 assert.equal((await handle(req('/sessions',{ruleset:'old'},'https://gleb20.github.io'))).status,409);assert.equal(calls,0);
 assert.equal((await handle(req('/sessions',{ruleset:'roadster-v3.4.2',filler:'a'.repeat(1500)},'https://gleb20.github.io'))).status,413);assert.equal(calls,0);
 const allowed=await handle(new Request('https://x.test/functions/v1/tesla-ranking/health',{headers:{Origin:'https://gleb20.github.io'}}));assert.equal(allowed.headers.get('Access-Control-Allow-Origin'),'https://gleb20.github.io');assert.equal(calls,1);
});
test('verification uses only stored replay/checkpoint and hides private claim payload',async()=>{
 const r=fixture(),seen=[];const handle=createHandler({rpc:async(action,p)=>{seen.push({action,p});return action==='claim'?{status:'verifying',replay:r,checkpoint:null,revision:3}:{status:'accepted',entry:{score:7}};},chunk:(value,checkpoint)=>{assert.deepEqual(value,r);assert.equal(checkpoint,null);return {outcome:'accepted',result:{score:7,flips:0,ticks:r.ticks}};}});
 const res=await handle(new Request('https://x.test/functions/v1/tesla-ranking/verify',{method:'POST',headers:{Origin:'https://gleb20.github.io','Content-Type':'application/json'},body:JSON.stringify({sessionId:'00000000-0000-4000-8000-000000000001',capability:'a'.repeat(64),score:9999,checkpoint:{bad:true}})}));
 const value=await res.json();assert.equal(value.entry.score,7);assert.equal(value.replay,undefined);assert.equal(value.checkpoint,undefined);assert.equal(seen[1].p.revision,3);assert.equal(seen[1].p.result.score,7);assert.notEqual(seen[0].p.tokenHash,'a'.repeat(64));
});
test('server RPC supports current secret keys without treating them as JWTs',async()=>{
 const {createRpc}=await import('../handler.mjs');for(const key of ['sb_secret_fixture','legacy-jwt-fixture']){
  const rpc=createRpc({url:'https://db.test',key,fetcher:async(url,o)=>{assert.equal(o.headers.apikey,key);assert.equal(o.headers.Authorization,key.startsWith('sb_secret_')?undefined:'Bearer '+key);return Response.json({ok:true});}});assert.deepEqual(await rpc('health',{}),{ok:true});
 }
});
test('hosted gateway rewritten path and custom capability header are supported',async()=>{
 let seen;const h=createHandler({rpc:async(action,p)=>{seen={action,p};return {status:'pending'};}});
 const res=await h(new Request('https://edge.test/tesla-ranking/sessions/00000000-0000-4000-8000-000000000001',{headers:{Authorization:'Bearer sb_publishable_fixture','X-Run-Capability':'a'.repeat(64)}}));assert.equal(res.status,200);assert.equal(seen.action,'get');
});

test('new gameplay freezes independently and both rulesets verify interrupted checkpoints exactly',async()=>{
 const current=await import('../../src/run.js'),frozen=await import('../rulesets/roadster-v400/run.js');
 for(const module of [current,frozen]){
  const r=module.createRun({seed:73});r.reset();const actions=new Map([[0,'primary-down'],[24,'primary-up'],[25,'primary-down'],[121,'primary-up']]);
  while(r.S.mode==='playing'){const a=actions.get(r.S.tick);if(a)r.command(a);r.step();r.drainEvents();}
  const replay=r.replay(),expected=module.verifyReplay(replay);assert.deepEqual(frozen.verifyReplay(replay),expected);let checkpoint=null,result;
  do{result=verifyChunk(replay,checkpoint,{maxTicks:73,budgetMs:Infinity});checkpoint=result.checkpoint?structuredClone(result.checkpoint):null;}while(result.outcome==='pending');
  assert.equal(result.outcome,'accepted');assert.deepEqual(result.result,expected);
 }
});
test('session creation and replay submission explicitly support both versions, with no unknown fallback',async()=>{
 for(const ruleset of ['roadster-v3.4.2','roadster-v3.8.0','roadster-v4.0.0']){
  const handle=createHandler({rpc:async(action,p)=>{assert.equal(action,'create');assert.equal(p.ruleset,ruleset);return {ruleset};}});
  const res=await handle(new Request('https://x.test/tesla-ranking/sessions',{method:'POST',headers:{Origin:'https://gleb20.github.io','Content-Type':'application/json'},body:JSON.stringify({ruleset})}));assert.equal(res.status,201);assert.equal((await res.json()).ruleset,ruleset);
 }
 assert.throws(()=>verifyChunk({...fixture(),ruleset:'unknown'}));
});

test('legacy 3.8 finished records still verify through version dispatch',async()=>{const m=await import('../rulesets/roadster-v380/run.js');const r=m.createRun({seed:19});r.reset();while(r.S.mode==='playing')r.step();const replay=r.replay(),expected=m.verifyReplay(replay);let checkpoint=null,result;do{result=verifyChunk(replay,checkpoint,{maxTicks:73,budgetMs:Infinity});checkpoint=result.checkpoint?structuredClone(result.checkpoint):null;}while(result.outcome==='pending');assert.deepEqual(result.result,expected);});
