// Authorized release QA only. Submit requires read-back proof of an isolated QA epoch.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {ONLINE_API,ONLINE_PUBLIC_KEY} from '../src/online-config.js';
import {ruleset} from './rulesets.mjs';
import {rotationFixture} from '../scripts/prepare-rotation-fixture.mjs';
const version='roadster-v4.6.1',epoch='qa-v461-20261024-rotation',privatePath=process.env.QA_PRIVATE||'/tmp/tesla-v461-hosted-private.json',proofPath=process.env.QA_PROOF||'/tmp/tesla-v461-qa-proof.json',out=new URL('../docs/verification/2026-10-24-rotation-v461/',import.meta.url);await mkdir(out,{recursive:true});
const request=async(path,body,cap)=>{const start=performance.now(),response=await fetch(ONLINE_API+path,{method:body?'POST':'GET',headers:{Origin:'https://gleb20.github.io',apikey:ONLINE_PUBLIC_KEY,'Content-Type':'application/json',...(cap?{'X-Run-Capability':cap}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(90000)});return {status:response.status,body:await response.json(),ms:performance.now()-start};};
const meta=x=>({id:x.session.id,ruleset:x.session.ruleset,kind:x.kind,seconds:x.replay.ticks/120,expected:x.expected,activeTick:x.activeTick||null,railAirCount:x.railAirCount||0});
if(process.argv[2]==='prepare'){
 assert.equal((await request('health')).body.autonomousVerification,true);
 let exists=true;try{await access(privatePath);}catch{exists=false;}assert.equal(exists,false,'Existing private fixture file requires inspection; do not create duplicate sessions');await writeFile(privatePath,'[]',{mode:0o600,flag:'wx'});
 const versions=['roadster-v3.4.2','roadster-v3.8.0','roadster-v4.0.0','roadster-v4.1.0','roadster-v4.3.0','roadster-v4.3.2','roadster-v4.4.0','roadster-v4.4.2','roadster-v4.6.0',version],cases=[...versions.map(v=>[v,'valid']),[version,'fake-score'],[version,'fake-end']],all=[];
 for(const [tag,kind]of cases){
  const response=await request('sessions',{ruleset:tag});assert.equal(response.status,201,tag);const session=response.body,module=ruleset(tag),item={session,kind};all.push(item);await writeFile(privatePath,JSON.stringify(all),{mode:0o600});
  if(tag===version){const f=rotationFixture(module,session.seed);Object.assign(item,{replay:f.replay,expected:f.expected,activeTick:f.activeCheckpoint.S.tick});}
  else{const run=module.createRun({seed:session.seed}),actions=new Map();run.reset();let wave=0,railAirCount=0;
   while(run.S.mode==='playing'){
    for(const a of actions.get(run.S.tick)||[])run.command(a);run.step();run.drainEvents();
    if(tag==='roadster-v4.6.0'&&(run.S.t<240||railAirCount===0)&&run.S.t<600&&run.director.state.wave!==wave){wave=run.director.state.wave;if(run.director.state.last.kind==='rail-air')railAirCount++;for(const e of run.director.state.last.route.actions){const tick=run.S.tick+Math.round(e.at/module.RUN_STEP),a={hold:'primary-down',jump:'primary-up','thrust-on':'thrust-on','thrust-off':'thrust-off'}[e.action];if(!actions.has(tick))actions.set(tick,[]);actions.get(tick).push(a);}}
    assert.ok(run.S.t<660,'bounded historical fixture');
   }
   const replay=run.replay();Object.assign(item,{replay,expected:module.verifyReplay(replay),railAirCount});if(tag==='roadster-v4.6.0')assert.ok(railAirCount>0,'retain real director rail-air witness');
  }
  await writeFile(privatePath,JSON.stringify(all),{mode:0o600});
 }
 await writeFile(new URL('hosted-fixtures.json',out),JSON.stringify(all.map(meta),null,2));
 let sql='begin;\ndo $$\ndeclare n integer;\nbegin\n';for(const x of all){assert.match(x.session.id,/^[0-9a-f-]{36}$/);sql+=`update tesla_ranking.sessions set score_epoch='${epoch}',created_at=least(created_at,floor(extract(epoch from clock_timestamp())*1000)-${Math.ceil(x.replay.ticks*1000/120)+1000}) where id='${x.session.id}' and status='ready' and payload_hash is null;\nget diagnostics n=row_count;if n<>1 then raise exception 'QA session precondition failed: ${x.session.id}';end if;\n`;}
 sql+='end $$;\nselect id,ruleset,score_epoch,status,payload_hash from tesla_ranking.sessions where id in ('+all.map(x=>"'"+x.session.id+"'").join(',')+');\ncommit;\n';await writeFile('/tmp/tesla-v461-fixture-setup.sql',sql);console.log(JSON.stringify({fixtures:all.map(meta),setupSql:'/tmp/tesla-v461-fixture-setup.sql',proofRequired:proofPath}));
}else if(process.argv[2]==='submit'){
 const all=JSON.parse(await readFile(privatePath)),proof=JSON.parse(await readFile(proofPath));assert.ok(Array.isArray(proof));assert.equal(proof.length,all.length);for(const x of all){const row=proof.find(r=>r.id===x.session.id);assert.ok(row);assert.equal(row.score_epoch,epoch);assert.equal(row.status,'ready');assert.equal(row.payload_hash,null);assert.equal(row.ruleset,x.session.ruleset);}
 const receipts=[];for(const x of all){const replay=x.kind==='fake-end'?{...x.replay,ticks:x.replay.ticks+1}:x.replay,response=await request('sessions/'+x.session.id,{nickname:'QA ROTATION',replay,score:x.expected.score+(x.kind==='fake-score'?1:0)},x.session.capability);assert.equal(response.status,202);assert.equal(response.body.receipt,true);receipts.push({id:x.session.id,kind:x.kind,ms:response.ms,status:response.body.status,receipt:true});}
 await writeFile(new URL('hosted-receipts.json',out),JSON.stringify(receipts,null,2));console.log(JSON.stringify(receipts));
}else if(process.argv[2]==='check'){
 const all=JSON.parse(await readFile(privatePath)),checks=[];for(const x of all){const response=await request('sessions/'+x.session.id,undefined,x.session.capability),expectedStatus=x.kind==='valid'?'accepted':'rejected';assert.equal(response.body.status,expectedStatus);if(expectedStatus==='accepted')for(const k of ['score','flips','ticks'])assert.equal(response.body.entry[k],x.expected[k]);checks.push({...meta(x),status:response.body.status,publicId:response.body.publicId||response.body.entry?.id,exactResult:true});}
 const scores=await request('scores');assert.ok(scores.body.entries.every(e=>!checks.some(x=>x.publicId===e.id)));const report={checks,publicScores:scores.body.total,publicFixtureWrites:0,clientVerifyRequests:0,autonomousCompletion:true,epoch};await writeFile(new URL('hosted-results.json',out),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}else throw Error('Use prepare, submit or check explicitly');
