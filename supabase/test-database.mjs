import {readFile,writeFile} from 'node:fs/promises';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
import {createHandler,createRpc} from './handler.mjs';import {verifyChunk} from './chunk.mjs';import {createRun} from './rulesets/roadster-v342/run.js';
const {PGlite}=await import(pathToFileURL(process.env.PGLITE_MODULE||'/tmp/tesla-pg-test/node_modules/@electric-sql/pglite/dist/index.js'));
const db=new PGlite(),checks=[];const check=(name,v)=>{assert.ok(v,name);checks.push(name);};
try{
 await db.exec('create role anon; create role authenticated; create role service_role;');
 const transaction=await db.exec(await readFile('supabase/test-schema.sql','utf8'));check('SQL transaction tests and ROLLBACK succeed',transaction.some(x=>x.rows?.some(r=>r.verification?.startsWith('PASS:'))));
 check('transaction left no ranking tables',!(await db.query("select to_regclass('tesla_ranking.sessions') as table_name")).rows[0].table_name);
 await db.exec(await readFile('supabase/schema.sql','utf8'));
 const rpc=createRpc({url:'https://database.test',key:'local-test-key',fetcher:async(url,options)=>{const {action,payload}=JSON.parse(options.body);try{return Response.json((await db.query('select public.tesla_ranking_rpc($1,$2) as value',[action,payload])).rows[0].value);}catch(e){return Response.json({message:e.message},{status:400});}}});
 const handle=createHandler({rpc,chunk:(r,c)=>verifyChunk(r,c,{maxTicks:64})});
 const send=async(path,body,cap)=>{const res=await handle(new Request('https://database.test/functions/v1/tesla-ranking'+path,{method:body===undefined?'GET':'POST',headers:{Origin:'https://gleb20.github.io',...(body===undefined?{}:{'Content-Type':'application/json'}),...(cap?{Authorization:'Bearer '+cap}:{})},body:body===undefined?undefined:JSON.stringify(body)}));return {status:res.status,body:await res.json()};};
 check('writes begin paused',(await send('/sessions',{ruleset:'roadster-v3.4.2'})).body.error==='new_sessions_paused');
 await db.query('update tesla_ranking.config set accepting_sessions=true,accepting_writes=true where id=true');
 const session=(await send('/sessions',{ruleset:'roadster-v3.4.2'})).body,run=createRun({seed:session.seed});run.reset();while(run.S.mode==='playing')run.step();
 await db.query('update tesla_ranking.sessions set created_at=created_at-60000 where id=$1',[session.id]);
 const replay=run.replay();check('browser cannot read another session',(await send('/sessions/'+session.id,undefined,'0'.repeat(64))).status===401);
 check('submission ignores client score',(await send('/sessions/'+session.id,{nickname:'LOCAL PILOT',replay,score:99999999},session.capability)).body.status==='pending');
 check('idempotent submission stays pending',(await send('/sessions/'+session.id,{nickname:'LOCAL PILOT',replay},session.capability)).body.status==='pending');
 check('changed submission cannot replace the original',(await send('/sessions/'+session.id,{nickname:'OTHER PILOT',replay},session.capability)).body.error==='submission_conflict');
 let final,n=0;do{final=(await send('/verify',{sessionId:session.id,capability:session.capability})).body;n++;assert.ok(n<100);}while(final.continue);
 check('many chunks continue to exact verified score',n>2&&final.status==='accepted'&&final.entry.score===run.S.score&&final.entry.ticks===run.S.tick);
 check('private state is absent from public replies',!final.replay&&!final.checkpoint&&!final.tokenHash);
 check('duplicate verify returns same public ID',(await send('/verify',{sessionId:session.id,capability:session.capability})).body.entry.id===final.entry.id);
 check('one session creates one row',(await send('/scores')).body.total===1);
 check('rank endpoint identifies own row',(await send('/scores/'+final.entry.id)).body.rank===1);
 await db.exec('set role anon;');let denied=false;try{await db.query("select public.tesla_ranking_rpc('health','{}')");}catch(e){denied=/permission denied/.test(e.message);}finally{await db.exec('reset role;');}check('actual anon database role denied RPC execution',denied);
 console.log(JSON.stringify({checks:checks.length,details:checks}));await writeFile('/tmp/tesla-supabase-database.json',JSON.stringify({checks,exactScore:final.entry.score,chunks:n},null,2));
}catch(e){console.error(e.message);process.exitCode=1;}finally{await db.close();}
