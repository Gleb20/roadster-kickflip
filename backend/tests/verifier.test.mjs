import test from 'node:test';
import assert from 'node:assert/strict';
import {createVerifier} from '../verifier.mjs';
import {createRun} from '../rulesets/roadster-v341/run.js';
test('verifier rejects other origins and bounds concurrent CPU jobs',async()=>{
 const run=createRun({seed:9});run.reset();while(run.S.mode==='playing')run.step();let calls=0;
 const server=createVerifier({apiUrl:'http://127.0.0.1:9999',verifyKey:'fixture-secret',allowedOrigins:['https://game.test'],fetcher:async(url,options)=>{
  calls++;assert.equal(options.headers['X-Verify-Key'],'fixture-secret');
  if(url.pathname==='/internal/claim'){await new Promise(r=>setTimeout(r,50));return Response.json({status:'verifying',seed:9,ruleset:'roadster-v3.4.1',replay:run.replay(),lease:'fixture-lease'});}
  const body=JSON.parse(options.body);assert.equal(body.result.score,run.S.score);return Response.json({status:'accepted',entry:{score:body.result.score}});
 }});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
 const send=origin=>fetch(base+'/verify',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({sessionId:'00000000-0000-4000-8000-000000000000',capability:'0'.repeat(64)})});
 try{assert.equal((await send('https://evil.test')).status,403);assert.equal(calls,0);const requests=await Promise.all([send('https://game.test'),send('https://game.test')]);assert.deepEqual(requests.map(r=>r.status).sort(),[200,429]);assert.equal(calls,2);assert.equal((await fetch(base+'/health')).status,200);}finally{await new Promise(r=>server.close(r));}
});
