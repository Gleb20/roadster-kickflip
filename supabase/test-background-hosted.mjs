// Hosted fixtures use a separate score epoch and never enter the public leaderboard.
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {ONLINE_API,ONLINE_PUBLIC_KEY} from '../src/online-config.js';
import {ruleset} from './rulesets.mjs';
const privatePath='/tmp/tesla-v420-hosted-private.json',metaPath='/tmp/tesla-v420-hosted-fixtures.json';
const request=async(path,body,cap)=>{const start=performance.now();const r=await fetch(ONLINE_API+path,{method:body?'POST':'GET',headers:{Origin:'https://gleb20.github.io',apikey:ONLINE_PUBLIC_KEY,'Content-Type':'application/json',...(cap?{'X-Run-Capability':cap}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,body:await r.json(),ms:performance.now()-start}};
if(process.argv[2]==='prepare'){
 const all=[];
 for(const [version,kind] of [['roadster-v3.4.2','valid'],['roadster-v3.8.0','valid'],['roadster-v4.0.0','valid'],['roadster-v4.1.0','valid'],['roadster-v4.1.0','fake-score'],['roadster-v4.1.0','lost-lease'],['roadster-v3.4.2','long']]){
  const response=await request('sessions',{ruleset:version});assert.equal(response.status,201);const session=response.body,m=ruleset(version),run=m.createRun({seed:session.seed});run.reset();const actions=new Map();let wave=0;
  while(run.S.mode==='playing'&&run.S.tick<432000){
   for(const a of actions.get(run.S.tick)||[])run.command(a);run.step();run.drainEvents();
   if(kind==='long'&&run.S.t<600&&run.director.state.wave!==wave){wave=run.director.state.wave;for(const e of run.director.state.last.route.actions){const tick=run.S.tick+Math.round(e.at/m.RUN_STEP),action={hold:'primary-down',jump:'primary-up','thrust-on':'thrust-on','thrust-off':'thrust-off'}[e.action];if(!actions.has(tick))actions.set(tick,[]);actions.get(tick).push(action);}}
  }
  const replay=run.replay(),expected=m.verifyReplay(replay);assert.equal(run.S.mode,'dead');if(kind==='long')assert.ok(replay.ticks>72000);all.push({session,replay,expected,kind});
 }
 await writeFile(privatePath,JSON.stringify(all),{mode:0o600});const meta=all.map(x=>({id:x.session.id,ruleset:x.session.ruleset,kind:x.kind,seconds:x.replay.ticks/120,expected:x.expected}));await writeFile(metaPath,JSON.stringify(meta,null,2));
 const ids=all.map(x=>"'"+x.session.id+"'").join(',');
 await writeFile('/tmp/tesla-v420-transfer/fixture-setup.sql',`begin;\nupdate tesla_ranking.sessions set score_epoch='qa-v420-20261023',created_at=least(created_at,floor(extract(epoch from clock_timestamp())*1000)-610000) where id in (${ids}) and status='ready' and payload_hash is null;\nselect id,ruleset,score_epoch,status from tesla_ranking.sessions where id in (${ids});\ncommit;\n`);
 console.log(JSON.stringify(meta));
}else if(process.argv[2]==='submit'){
 const all=JSON.parse(await readFile(privatePath));const receipts=[];for(const x of all){const result=await request('sessions/'+x.session.id,{nickname:'QA V420',replay:x.replay,score:x.expected.score+(x.kind==='fake-score'?1:0)},x.session.capability);assert.equal(result.status,202);assert.equal(result.body.receipt,true);assert.equal(result.body.status,'pending');receipts.push({id:x.session.id,kind:x.kind,ms:result.ms,receipt:true,status:result.body.status});}await writeFile('/tmp/tesla-v420-hosted-receipts.json',JSON.stringify(receipts,null,2));console.log(JSON.stringify(receipts));
}else if(process.argv[2]==='check'){
 const all=JSON.parse(await readFile(privatePath));const checks=[];for(const x of all){const v=await request('sessions/'+x.session.id,undefined,x.session.capability);const expectedStatus=x.kind==='fake-score'?'rejected':'accepted';assert.equal(v.body.status,expectedStatus);if(expectedStatus==='accepted'){assert.equal(v.body.entry.score,x.expected.score);assert.equal(v.body.entry.flips,x.expected.flips);assert.equal(v.body.entry.ticks,x.expected.ticks);}const duplicate=await request('sessions/'+x.session.id,{nickname:'QA V420',replay:x.replay,score:x.expected.score+(x.kind==='fake-score'?1:0)},x.session.capability);assert.equal(duplicate.body.publicId,v.body.publicId);assert.equal(duplicate.body.status,v.body.status);checks.push({id:x.session.id,kind:x.kind,status:v.body.status,exactResult:true,duplicateReceipt:true,publicId:v.body.publicId});}const scores=await request('scores');assert.ok(scores.body.entries.every(e=>!checks.some(x=>x.publicId===e.id)));const report={checks,publicScores:scores.body.total,publicFixtureWrites:0,clientVerifyRequests:0};await writeFile(process.argv[3]||'/tmp/tesla-v420-hosted-results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}
