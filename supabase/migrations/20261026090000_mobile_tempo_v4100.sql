-- Add4100 mobile tempo; preserve all17 earlier verifiers, queues and scores.
begin;
do $$
declare source text;
 old_guard text := 'not in (''roadster-v3.4.2'',''roadster-v3.8.0'',''roadster-v4.0.0'',''roadster-v4.1.0'',''roadster-v4.3.0'',''roadster-v4.3.2'',''roadster-v4.4.0'',''roadster-v4.4.2'',''roadster-v4.6.0'',''roadster-v4.6.1'',''roadster-v4.6.3'',''roadster-v4.7.0'',''roadster-v4.7.1'',''roadster-v4.7.2'',''roadster-v4.7.3'',''roadster-v4.8.0'',''roadster-v4.9.0'')';
 new_guard text := 'not in (''roadster-v3.4.2'',''roadster-v3.8.0'',''roadster-v4.0.0'',''roadster-v4.1.0'',''roadster-v4.3.0'',''roadster-v4.3.2'',''roadster-v4.4.0'',''roadster-v4.4.2'',''roadster-v4.6.0'',''roadster-v4.6.1'',''roadster-v4.6.3'',''roadster-v4.7.0'',''roadster-v4.7.1'',''roadster-v4.7.2'',''roadster-v4.7.3'',''roadster-v4.8.0'',''roadster-v4.9.0'',''roadster-v4.10.0'')';
begin
 select pg_get_functiondef('public.tesla_ranking_rpc(text,jsonb)'::regprocedure) into source;
 if position(new_guard in source)>0 then return; end if;
 if position(old_guard in source)=0 then raise exception 'Unexpected deployed ruleset guard; no changes applied'; end if;
 execute replace(source,old_guard,new_guard);
 if position(new_guard in pg_get_functiondef('public.tesla_ranking_rpc(text,jsonb)'::regprocedure))=0 then raise exception 'New ruleset guard was not installed'; end if;
end $$;
commit;
