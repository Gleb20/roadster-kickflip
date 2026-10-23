import test from 'node:test';import assert from 'node:assert/strict';
import {createWorker,createWorkerHandler} from '../worker.mjs';
test('worker advances only its stored replay and checkpoint, independently of any browser',async()=>{
 const calls=[],job={status:'verifying',id:'one',tokenHash:'private',lease:'lease',revision:2,replay:{stored:true},checkpoint:{tick:9}};
 const work=createWorker({rpc:async(action,p)=>{calls.push({action,p});return action==='take'?job:{status:'pending',progress:12000};},chunk:(r,c,o)=>{assert.equal(r,job.replay);assert.equal(c,job.checkpoint);assert.equal(o.maxTicks,432000);assert.equal(o.budgetMs,400);return {outcome:'pending',checkpoint:{tick:12000},progress:12000};}});
 assert.deepEqual(await work('one'),{processed:true,status:'pending',progress:12000});assert.deepEqual(calls.map(c=>c.action),['take','advance']);assert.equal(calls[1].p.tokenHash,'private');
});
test('worker records retry after infrastructure failure; idle/leased work does no computation',async()=>{
 let calls=[],work=createWorker({rpc:async(action)=>{calls.push(action);return action==='take'?{status:'verifying',id:'one'}:{};},chunk:()=>{throw Error('temporary');}});
 await assert.rejects(work(),/temporary/);assert.deepEqual(calls,['take','retry']);
 work=createWorker({rpc:async()=>({status:'idle'}),chunk:()=>{throw Error('must not run');}});assert.deepEqual(await work(),{processed:false});
});
test('private worker refuses missing, public and wrong credentials without running work',async()=>{
 const secret='x'.repeat(64);let calls=0;const h=createWorkerHandler({secret,work:async()=>{calls++;return {processed:true};}});
 for(const token of ['', 'sb_publishable_fixture','y'.repeat(64)])assert.equal((await h(new Request('https://worker.test',{method:'POST',headers:{Authorization:`Bearer ${token}`},body:'{}'}))).status,401);
 assert.equal(calls,0);assert.equal((await h(new Request('https://worker.test',{method:'POST',headers:{Authorization:`Bearer ${secret}`},body:JSON.stringify({sessionId:'00000000-0000-4000-8000-000000000001'})}))).status,200);assert.equal(calls,1);
});
