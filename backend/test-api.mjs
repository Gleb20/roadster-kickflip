/** Integration checks against local workerd/D1 and the actual Node verifier. */
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {createRun} from './rulesets/roadster-v341/run.js';
const base=process.env.TEST_API_URL||'http://127.0.0.1:8787',verifier=process.env.TEST_VERIFIER_URL||'http://127.0.0.1:8790',origin='http://127.0.0.1:8766',checks=[];
const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
async function request(path,{method='GET',body,capability,headers={},url=base}={}){const response=await fetch(url+path,{method,headers:{Origin:origin,...(body===undefined?{}:{'Content-Type':'application/json'}),...(capability?{Authorization:'Bearer '+capability}:{}),...headers},body:body===undefined?undefined:JSON.stringify(body)});return {status:response.status,body:await response.json(),headers:response.headers};}
const issue=async()=>{const r=await request('/sessions',{method:'POST',body:{ruleset:'roadster-v3.4.1'}});assert.equal(r.status,201);return r.body;};
const fixture=seed=>{const r=createRun({seed});r.reset();while(r.S.mode==='playing'){r.step();r.drainEvents();}return {replay:r.replay(),score:r.S.score,flips:r.E.flips,ticks:r.S.tick};};
const submit=(s,replay,name='TEST PILOT')=>request('/sessions/'+s.id,{method:'POST',capability:s.capability,body:{nickname:name,replay,score:999999999}});
const verify=s=>request('/verify',{method:'POST',body:{sessionId:s.id,capability:s.capability},url:verifier});
const started=Date.now(),sessions=await Promise.all(Array.from({length:15},issue)),fixtures=sessions.map(s=>fixture(s.seed));
check('unknown ruleset rejected',(await request('/sessions',{method:'POST',body:{ruleset:'untrusted'}})).status===409);
check('cross-origin writes rejected',(await request('/sessions',{method:'POST',body:{ruleset:'roadster-v3.4.1'},headers:{Origin:'https://evil.test'}})).status===403);
check('session capability required',(await request('/sessions/'+sessions[0].id)).status===401);
check('verifier private key required',(await request('/internal/claim',{method:'POST',body:{sessionId:sessions[0].id,capability:sessions[0].capability}})).status===401);
check('HTML/control nickname rejected',(await submit(sessions[0],fixtures[0].replay,'<script>')).status===400);
check('session seed cannot be replaced',(await submit(sessions[0],fixtures[1].replay)).status===409);
check('malformed replay rejected',(await submit(sessions[0],{...fixtures[0].replay,events:[[0,99]]})).status===400);
check('body limit enforced',(await request('/sessions',{method:'POST',body:{ruleset:'roadster-v3.4.1',padding:'x'.repeat(1100)}})).status===413);
const early=await submit(sessions[0],fixtures[0].replay);check('faster-than-wall-clock attempt rejected',early.status===400&&early.body.error==='run_too_fast');
const wait=Math.max(...fixtures.map(f=>f.ticks/120*1000))-1900-(Date.now()-started);if(wait>0)await new Promise(r=>setTimeout(r,wait));
const first=sessions[0],record=fixtures[0];let r=await submit(first,record.replay);check('completed run enters pending',r.status===202&&r.body.status==='pending');
check('same run retry is idempotent',(await submit(first,record.replay)).body.status==='pending');check('changed nickname conflicts after submission',(await submit(first,record.replay,'OTHER PILOT')).status===409);
r=await verify(first);check('Node verifier accepts and computes score',r.status===200&&r.body.status==='accepted'&&r.body.entry.score===record.score&&r.body.entry.flips===record.flips);
const publicId=r.body.entry.id;check('post-verification retry returns same public ID',(await submit(first,record.replay)).body.entry.id===publicId);check('repeated verification returns existing result',(await verify(first)).body.entry.id===publicId);
check('token is absent from public entry',!JSON.stringify((await request('/scores/'+publicId)).body).includes(first.capability));
const tampered={...fixtures[1].replay,ticks:fixtures[1].ticks-1};await submit(sessions[1],tampered);r=await verify(sessions[1]);check('plausible input envelope with false ending is rejected by simulation',r.body.status==='rejected');
for(let i=2;i<13;i++){await submit(sessions[i],fixtures[i].replay,'PILOT '+String(i).padStart(2,'0'));assert.equal((await verify(sessions[i])).body.status,'accepted');}
const page1=await request('/scores'),page2=await request('/scores?page=2&snapshot='+page1.body.snapshot);check('old-school pagination exposes ten then two rows',page1.body.entries.length===10&&page2.body.entries.length===2&&page1.body.total===12&&page1.body.pages===2);check('pages have no duplicate records',new Set([...page1.body.entries,...page2.body.entries].map(e=>e.id)).size===12);
check('ranks and score ordering are global',page1.body.entries[0].rank===1&&page2.body.entries[0].rank===11&&page1.body.entries.every((e,i,a)=>!i||a[i-1].score>=e.score));
await submit(sessions[13],fixtures[13].replay,'NEW PILOT');await verify(sessions[13]);check('page snapshot stays stable after a new submission',(await request('/scores?page=2&snapshot='+page1.body.snapshot)).body.total===12);check('refresh includes new result',(await request('/scores')).body.total===13);
await submit(sessions[14],fixtures[14].replay,'LAST PILOT');const claim=await request('/internal/claim',{method:'POST',body:{sessionId:sessions[14].id,capability:sessions[14].capability},headers:{'X-Verify-Key':'local-test-only'}});assert.equal(claim.body.status,'verifying');
check('only one lease can claim a pending job',(await request('/internal/claim',{method:'POST',body:{sessionId:sessions[14].id,capability:sessions[14].capability},headers:{'X-Verify-Key':'local-test-only'}})).status===409);
check('stale lease cannot write a score',(await request('/internal/complete',{method:'POST',body:{sessionId:sessions[14].id,lease:'wrong',outcome:'accepted',result:{score:99999999,flips:0,ticks:fixtures[14].ticks}},headers:{'X-Verify-Key':'local-test-only'}})).status===409);
await request('/internal/complete',{method:'POST',body:{sessionId:sessions[14].id,lease:claim.body.lease,outcome:'retry'},headers:{'X-Verify-Key':'local-test-only'}});check('infrastructure retry preserves the submitted job',(await verify(sessions[14])).body.status==='accepted');
let limited=false;for(let i=0;i<61;i++){r=await request('/sessions',{method:'POST',body:{ruleset:'roadster-v3.4.1'}});if(r.status===429){limited=true;break;}}check('session burst rate is bounded',limited);
await mkdir('/tmp/tesla-ranking-evidence',{recursive:true});await writeFile('/tmp/tesla-ranking-evidence/api.json',JSON.stringify({checks,fixtures:fixtures.map(({replay,...result})=>result)},null,2));console.log(JSON.stringify({checks:checks.length}));
