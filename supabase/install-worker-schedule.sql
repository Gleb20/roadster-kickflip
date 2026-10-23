-- Run only after the private worker has been deployed and its matching secret stored in Vault.
-- Required Vault names: tesla_ranking_worker_url, tesla_ranking_worker_secret.
begin;
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
do $$ begin
 if (select count(*) from vault.decrypted_secrets where name in ('tesla_ranking_worker_url','tesla_ranking_worker_secret'))<>2 then
  raise exception 'Worker URL/secret are missing from Vault';
 end if;
end $$;
create or replace function tesla_ranking.dispatch() returns integer language plpgsql security definer set search_path='' as $$
declare task record; endpoint text; token text; slots integer; sent integer:=0;
 now_ms bigint:=floor(extract(epoch from clock_timestamp())*1000);
begin
 if not pg_try_advisory_xact_lock(7850311) then return 0; end if;
 if not exists(select 1 from tesla_ranking.config where id=true and accepting_writes and autonomous_verification) then return 0; end if;
 select decrypted_secret into strict endpoint from vault.decrypted_secrets where name='tesla_ranking_worker_url';
 select decrypted_secret into strict token from vault.decrypted_secrets where name='tesla_ranking_worker_secret';
 if endpoint !~ '^https://[a-z0-9]+[.]supabase[.]co/functions/v1/tesla-ranking-worker$' or length(token)<32 then raise exception 'Invalid worker configuration'; end if;
 select greatest(0,4-count(*)) into slots from tesla_ranking.sessions where status='pending' and (dispatch_after>now_ms or lease_until>now_ms);
 for task in select id from tesla_ranking.sessions where status='pending' and chunks<600
  and next_attempt_at<=now_ms and dispatch_after<=now_ms and (lease is null or lease_until<=now_ms)
  order by next_attempt_at,created_at limit slots for update skip locked
 loop
  update tesla_ranking.sessions set dispatch_after=now_ms+30000 where id=task.id;
  perform net.http_post(url:=endpoint,headers:=jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||token),body:=jsonb_build_object('sessionId',task.id),timeout_milliseconds:=15000);
  sent:=sent+1;
 end loop;
 return sent;
end $$;
revoke all on function tesla_ranking.dispatch() from public,anon,authenticated;
-- Idle runs issue no HTTP calls; the scheduler is only a database queue check.
select cron.schedule('tesla-ranking-worker','10 seconds','select tesla_ranking.dispatch()');
update tesla_ranking.config set autonomous_verification=true where id=true;
select tesla_ranking.dispatch();
commit;
