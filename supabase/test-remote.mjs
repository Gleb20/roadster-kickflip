// Real staging API checks. Keeps per-run capabilities only in memory.
import assert from 'node:assert/strict';import {writeFile} from 'node:fs/promises';
import {createRun,verifyReplay} from './rulesets/roadster-v342/run.js';
import {ONLINE_PUBLIC_KEY} from '../src/online-config.js';
const base='https://anzybyamdtouzxouhziu.supabase.co/functions/v1/tesla-ranking',checks=[],created=[],entries=[];
const check=(n,v)=>{assert.ok(v,n);checks.push(n);};
async function request(path,{body,cap,origin='https://gleb20.github.io'}={}){const response=await fetch(base+path,{method:body===undefined?'GET':'POST',headers:{Origin:origin,apikey:ONLINE_PUBLIC_KEY,Authorization:'Bearer '+ONLINE_PUBLIC_KEY,...(body===undefined?{}:{'Content-Type':'application/json'}),...(cap?{'X-Run-Capability':cap}:{})},body:body===undefined?undefined:JSON.stringify(body)});return {status:response.status,body:await response.json(),cors:response.headers.get('access-control-allow-origin')};}
const fixtures=[];
try{
 check('real Edge health uses 3.4.2 ruleset',(await request('/health')).body.ruleset==='roadster-v3.4.2');
 check('cross-origin write denied',(await request('/sessions',{body:{ruleset:'roadster-v3.4.2'},origin:'https://evil.test'})).status===403);
 check('obsolete ruleset denied',(await request('/sessions',{body:{ruleset:'old'}})).status===409);
 for(let i=0;i<13;i++){const value=await request('/sessions',{body:{ruleset:'roadster-v3.4.2'}});assert.equal(value.status,201,JSON.stringify(value.body));const s=value.body;created.push(s.id);const r=createRun({seed:s.seed});r.reset();while(r.S.mode==='playing')r.step();fixtures.push({s,replay:r.replay(),expected:verifyReplay(r.replay()),readyAt:Date.now()+r.S.tick*1000/120});}
 // Respect the server's elapsed-run check; these ordinary no-input runs last <10s.
 await new Promise(r=>setTimeout(r,Math.max(0,...fixtures.map(f=>f.readyAt-Date.now()))+300));
 for(let i=0;i<fixtures.length;i++){const {s,replay,expected}=fixtures[i],payload={nickname:'QA '+String(i+1).padStart(2,'0'),replay,score:99999999};
  check('capability denial '+i,(await request('/sessions/'+s.id,{cap:'0'.repeat(64)})).status===401);
  const submit=await request('/sessions/'+s.id,{cap:s.capability,body:payload});assert.equal(submit.body.status,'pending',JSON.stringify(submit.body));
  let verified,n=0;do{verified=await request('/verify',{body:{sessionId:s.id,capability:s.capability}});assert.equal(verified.status,200,JSON.stringify(verified.body));n++;assert.ok(n<20);}while(verified.body.continue);
  const e=verified.body.entry;entries.push(e.id);check('server-computed exact result '+i,e.score===expected.score&&e.ticks===expected.ticks&&e.flips===expected.flips);
  check('idempotent public result '+i,(await request('/sessions/'+s.id,{cap:s.capability,body:payload})).body.entry.id===e.id);
  check('changed nickname conflict '+i,(await request('/sessions/'+s.id,{cap:s.capability,body:{...payload,nickname:'CHANGED'}})).body.error==='submission_conflict');
 }
 const one=(await request('/scores')).body,two=(await request('/scores?page=2&snapshot='+one.snapshot)).body;
 check('real two-page pagination',one.entries.length===10&&two.entries.length>=3&&one.total>=13);
 check('ranks and no duplicates',two.entries[0].rank===11&&new Set([...one.entries,...two.entries].map(e=>e.id)).size===one.entries.length+two.entries.length);
 check('CORS permits actual Pages origin',(await request('/scores')).cors==='https://gleb20.github.io');
 const own=(await request('/scores/'+entries[0])).body;check('own public rank resolves',own.entry.id===entries[0]&&own.rank>=1);
 const report={checks,createdSessionIds:created,publicIds:entries,passed:true};await writeFile('/tmp/tesla-supabase-remote.json',JSON.stringify(report,null,2));console.log(JSON.stringify({checks:checks.length,sessionIds:created,publicIds:entries,passed:true}));
}catch(e){await writeFile('/tmp/tesla-supabase-remote.json',JSON.stringify({checks,createdSessionIds:created,publicIds:entries,passed:false,error:e.message},null,2));console.error(e.message);process.exitCode=1;}
