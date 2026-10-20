import {readFile,writeFile} from 'node:fs/promises';import {createHash,randomUUID} from 'node:crypto';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import {verifyChunk} from './chunk.mjs';
const {PGlite}=await import(pathToFileURL(process.env.PGLITE_MODULE||'/tmp/tesla-pg-test/node_modules/@electric-sql/pglite/dist/index.js'));
const a=new PGlite(),b=new PGlite(),schema=await readFile('supabase/schema.sql','utf8'),checks=[];
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const sha=x=>createHash('sha256').update(JSON.stringify(canonical(x))).digest('hex');
const tables={config:'id',sessions:'id',runs:'seq',rate_buckets:'key'},query=async(db,sql,params=[])=> (await db.query(sql,params)).rows;
const rpc=async(db,action,payload)=> (await query(db,'select public.tesla_ranking_rpc($1,$2) as v',[action,payload]))[0].v;
try{
 for(const db of [a,b])await db.exec('create role anon;create role authenticated;create role service_role;');
 await a.exec((await readFile('supabase/test-schema.sql','utf8')).replace(/rollback;\s*$/,'commit;'));await b.exec(schema);
 const original=(await query(a,'select * from tesla_ranking.sessions order by id limit 1'))[0],cp=verifyChunk(original.replay,null,{maxTicks:64}),pendingId=randomUUID();
 for(const state of ['ready','pending','rejected'])await query(a,'insert into tesla_ranking.sessions(id,token_hash,seed,ruleset,score_epoch,created_at,expires_at,status,public_id,nickname,replay,checkpoint,progress,payload_hash,failure) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)',[state==='pending'?pendingId:randomUUID(),'fixture-hash',19,'roadster-v3.4.2','v3',Date.now()-100000,Date.now()+86400000,state,randomUUID(),state==='ready'?null:'FIXTURE',state==='ready'?null:original.replay,state==='pending'?cp.checkpoint:null,state==='pending'?cp.progress:0,state==='ready'?null:'fixture-payload',state==='rejected'?'verification_failed':null]);
 await query(a,'update tesla_ranking.config set accepting_sessions=false,accepting_writes=false where id=true');
 const exported={};for(const [table,key] of Object.entries(tables))exported[table]=await query(a,`select * from tesla_ranking.${table} order by ${key}`);
 for(const table of ['sessions','runs','rate_buckets'])assert.equal((await query(b,`select count(*) as n from tesla_ranking.${table}`))[0].n,0);
 await query(b,'delete from tesla_ranking.config where id=true');
 for(const [table,rows] of Object.entries(exported))for(const row of rows){const names=Object.keys(row),values=names.map(k=>row[k]);await query(b,`insert into tesla_ranking.${table}(${names.map(k=>'"'+k+'"').join(',')}) ${table==='runs'?'overriding system value ':''}values(${names.map((_,i)=>'$'+(i+1)).join(',')})`,values);}
 await query(b,"select setval(pg_get_serial_sequence('tesla_ranking.runs','seq'),(select max(seq) from tesla_ranking.runs),true)");
 for(const [table,key] of Object.entries(tables)){const actual=await query(b,`select * from tesla_ranking.${table} order by ${key}`);assert.equal(sha(actual),sha(exported[table]));checks.push({table,rows:actual.length,sha256:sha(actual),equal:true});}
 const order=async db=>query(db,'select seq,public_id,score,accepted_at from tesla_ranking.runs order by score desc,accepted_at,public_id');assert.equal(sha(await order(a)),sha(await order(b)));
 await query(b,'update tesla_ranking.config set accepting_sessions=true,accepting_writes=true where id=true');let value;
 do{const lease=randomUUID(),p={id:pendingId,tokenHash:'fixture-hash',lease},job=await rpc(b,'claim',p),result=verifyChunk(job.replay,job.checkpoint,{maxTicks:64});value=await rpc(b,'advance',{...p,revision:job.revision,...result});}while(value.status==='pending');
 assert.equal(value.status,'accepted');assert.equal(value.entry.score,73);assert.equal((await query(b,'select max(seq) as n from tesla_ranking.runs'))[0].n,14);assert.equal((await query(a,'select count(*) as n from tesla_ranking.runs'))[0].n,13);
 const report={checks,fullRankOrderEqual:true,pendingCheckpointResumed:true,capabilityHashPreserved:true,newIdentitySequence:14,sourceUntouched:true};await writeFile('/tmp/tesla-supabase-migration.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}catch(e){console.error(e.message);process.exitCode=1;}finally{await a.close();await b.close();}
