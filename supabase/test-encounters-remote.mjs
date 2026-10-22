// Hosted checks never publish a fixture score. Capabilities remain in memory.
import assert from 'node:assert/strict';import {writeFile} from 'node:fs/promises';
import {ONLINE_API,ONLINE_PUBLIC_KEY} from '../src/online-config.js';
import * as legacy from './rulesets/roadster-v342/run.js';import * as previous from './rulesets/roadster-v380/run.js';import * as encounters from './rulesets/roadster-v400/run.js';import * as current from './rulesets/roadster-v410/run.js';
const checks=[],check=(name,v)=>{assert.ok(v,name);checks.push(name);};
async function request(path,{body,cap,origin='https://gleb20.github.io'}={}){
 const r=await fetch(ONLINE_API+path,{method:body===undefined?'GET':'POST',headers:{Origin:origin,apikey:ONLINE_PUBLIC_KEY,Authorization:'Bearer '+ONLINE_PUBLIC_KEY,...(body===undefined?{}:{'Content-Type':'application/json'}),...(cap?{'X-Run-Capability':cap}:{})},body:body===undefined?undefined:JSON.stringify(body)});return {status:r.status,body:await r.json()};
}
const before=await request('scores');check('existing scores remain readable',before.status===200&&before.body.entries.length>0);
check('unknown ruleset rejected',(await request('sessions',{body:{ruleset:'unknown'}})).status===409);
check('foreign origin rejected',(await request('sessions',{body:{ruleset:current.RULESET},origin:'https://evil.test'})).status===403);
for(const mod of [legacy,previous,encounters,current]){
 const created=await request('sessions',{body:{ruleset:mod.RULESET}});check(mod.RULESET+': session supported',created.status===201&&created.body.ruleset===mod.RULESET);const s=created.body,run=mod.createRun({seed:s.seed});run.reset();const started=Date.now();
 const commands=mod===current?new Map([[0,'primary-down'],[24,'primary-up'],[25,'primary-down'],[121,'primary-up']]):new Map();let ideal=false;
 while(run.S.mode==='playing'){const action=commands.get(run.S.tick);if(action)run.command(action);run.step();for(const e of run.drainEvents())if(e.type==='landing'&&e.result.perfect&&e.result.turns===1)ideal=true;}
 if(mod===current)check('fixture naturally earns ideal flip under new rules',ideal);
 const replay=run.replay();replay.ticks--; // Deliberately cuts off before first collision.
 await new Promise(r=>setTimeout(r,Math.max(0,started+replay.ticks*1000/120-Date.now()+250)));
 const submit=await request('sessions/'+s.id,{cap:s.capability,body:{nickname:'QA FLIGHT',replay,score:999999999}});check(mod.RULESET+': replay parsed by matching version',submit.status===202&&submit.body.status==='pending');
 let result;do{result=await request('verify',{body:{sessionId:s.id,capability:s.capability}});assert.equal(result.status,200);}while(result.body.continue);
 check(mod.RULESET+': fabricated total with incomplete replay rejected',result.body.status==='rejected'&&!result.body.entry);
 const persisted=await request('sessions/'+s.id,{cap:s.capability});check(mod.RULESET+': rejected status persists without public entry',persisted.body.status==='rejected'&&!persisted.body.entry);
}
const after=await request('scores');check('no public fixture results added',after.body.total===before.body.total);await writeFile(process.argv[2]||'/tmp/tesla-v410-hosted-checks.json',JSON.stringify({checks,publicScores:after.body.total,publicFixtureWrites:0},null,2)+'\n');console.log(JSON.stringify({checks:checks.length,publicScores:after.body.total,publicFixtureWrites:0}));
