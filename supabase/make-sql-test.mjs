import {readFile,writeFile} from 'node:fs/promises';import {createRun,verifyReplay} from './rulesets/roadster-v342/run.js';
const r=createRun({seed:19});r.reset();while(r.S.mode==='playing')r.step();const replay=r.replay(),result=verifyReplay(replay);
const p={id:'00000000-0000-4000-8000-000000000001',tokenHash:'fixture-hash',seed:19,ruleset:replay.ruleset,publicId:'00000000-0000-4000-8000-000000000002'};
const quoted=v=>"'"+JSON.stringify(v).replaceAll("'","''")+"'::jsonb";
const sql=(await readFile('supabase/schema.sql','utf8')).replace(/commit;\s*$/,'')+`
do $$
declare p jsonb := ${quoted(p)}; v jsonb; good integer:=0;
begin
 if has_function_privilege('anon','public.tesla_ranking_rpc(text,jsonb)','execute') or has_function_privilege('authenticated','public.tesla_ranking_rpc(text,jsonb)','execute') then raise exception 'browser RPC exposed'; end if;
 if exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='tesla_ranking' and c.relkind='r' and not c.relrowsecurity) then raise exception 'RLS missing'; end if;
 begin perform public.tesla_ranking_rpc('create',p);raise exception 'freeze failed';exception when raise_exception then if sqlerrm<>'TJ:new_sessions_paused' then raise;end if;end;
 update tesla_ranking.config set accepting_sessions=true,accepting_writes=true where id=true;
 v:=public.tesla_ranking_rpc('create',p);if v->>'seed'<>'19' then raise exception 'seed failed'; end if;
 begin perform public.tesla_ranking_rpc('get',p||'{"tokenHash":"wrong"}');raise exception 'auth failed';exception when raise_exception then if sqlerrm<>'TJ:unauthorized' then raise;end if;end;
 update tesla_ranking.sessions set created_at=created_at-100000 where id='00000000-0000-4000-8000-000000000001';
 p:=p||${quoted({nickname:'TEST PILOT',payloadHash:'fixture-payload',replay})};
 v:=public.tesla_ranking_rpc('submit',p);if v->>'status'<>'pending' then raise exception 'submit failed';end if;
 perform public.tesla_ranking_rpc('submit',p);
 begin perform public.tesla_ranking_rpc('submit',p||'{"payloadHash":"conflict"}');raise exception 'dedup failed';exception when raise_exception then if sqlerrm<>'TJ:submission_conflict' then raise;end if;end;
 p:=p||'{"lease":"00000000-0000-4000-8000-000000000003"}';v:=public.tesla_ranking_rpc('claim',p);
 begin perform public.tesla_ranking_rpc('claim',p);raise exception 'lease failed';exception when raise_exception then if sqlerrm<>'TJ:job_busy_or_unavailable' then raise;end if;end;
 p:=p||jsonb_build_object('revision',v->'revision');v:=public.tesla_ranking_rpc('advance',p||${quoted({outcome:'accepted',result})});
 if v->>'status'<>'accepted' or (v->'entry'->>'score')::integer<>${result.score} then raise exception 'accept failed';end if;
 v:=public.tesla_ranking_rpc('claim',p);if v->>'status'<>'accepted' then raise exception 'idempotency failed';end if;
 for i in 1..12 loop insert into tesla_ranking.runs(public_id,session_id,score_epoch,ruleset,nickname,score,flips,ticks,accepted_at,source_environment) values(gen_random_uuid(),gen_random_uuid(),'v3','roadster-v3.4.2','FIXTURE',100+i,0,1000,i,'staging');end loop;
 v:=public.tesla_ranking_rpc('scores','{"page":1}');if v->>'total'<>'13' or jsonb_array_length(v->'entries')<>10 then raise exception 'first page failed';end if;
 p:=jsonb_build_object('page',2,'snapshot',v->'snapshot');v:=public.tesla_ranking_rpc('scores',p);if jsonb_array_length(v->'entries')<>3 or v->'entries'->0->>'rank'<>'11' then raise exception 'second page failed';end if;
end $$;
select 'PASS: RLS, browser privilege denial, freezes, seed, capability, replay submission, deduplication, conflict, lease, acceptance, idempotency, two pages, ranks' as verification;
rollback;
`;
await writeFile('supabase/test-schema.sql',sql);
const {escape}=await import('node:querystring');
const html=x=>x.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');await writeFile('/tmp/tesla-supabase-transfer/test.html','<!doctype html><title>SQL transaction test</title><textarea aria-label="Source code" style="width:95vw;height:80vh">'+html(sql)+'</textarea>');console.log({bytes:sql.length,result});
