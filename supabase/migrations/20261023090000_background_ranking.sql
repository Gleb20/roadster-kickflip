-- Add durable worker scheduling without changing accepted rows or frozen rulesets.
begin;
alter table tesla_ranking.config add column autonomous_verification boolean not null default false;
alter table tesla_ranking.sessions add column received_at bigint;
alter table tesla_ranking.sessions add column claimed_score integer check(claimed_score between 0 and 100000000);
alter table tesla_ranking.sessions add column next_attempt_at bigint not null default 0;
alter table tesla_ranking.sessions add column dispatch_after bigint not null default 0;
alter table tesla_ranking.sessions add column attempts integer not null default 0;
create index sessions_pending_work on tesla_ranking.sessions(next_attempt_at,created_at) where status='pending' and chunks<600;
-- Offline delivery gets seven days. Once received, processing no longer expires with the ticket.
update tesla_ranking.sessions set expires_at=greatest(expires_at,created_at+604800000) where status='ready';
do $migration$
declare source text;
begin
 select pg_get_functiondef('public.tesla_ranking_rpc(text,jsonb)'::regprocedure) into source;
 if position('roadster-v4.1.0' in source)=0 or position('if action=''advance'' then' in source)=0 then raise exception 'Unexpected ranking RPC; no changes applied'; end if;
 source:=replace(source,'''supabase-0.1.0''','''supabase-0.2.0''');
 source:=replace(source,'''acceptingWrites'',c.accepting_writes','''acceptingWrites'',c.accepting_writes,''autonomousVerification'',c.autonomous_verification');
 source:=replace(source,'where expires_at<now_ms-604800000 limit 100','where status<>''pending'' and expires_at<now_ms-604800000 limit 100');
 source:=replace(source,'now_ms+86400000','now_ms+604800000');
 source:=replace(source,'if s.expires_at<now_ms then','if s.status=''ready'' and s.expires_at<now_ms then');
 source:=replace(source,'row_id:=(payload->>''id'')::uuid;', $insert$
 if action='preview' then
  perform pg_advisory_xact_lock(7850310);
  if (payload->>'score')::bigint not between 0 and 100000000 then raise exception 'TJ:invalid_score'; end if;
  select coalesce(max(seq),0),count(*) into watermark,total from tesla_ranking.runs where score_epoch=c.score_epoch;
  select count(*)+1 into n from tesla_ranking.runs where score_epoch=c.score_epoch and score>=(payload->>'score')::integer;
  pages:=greatest(1,ceil((total+1)/10.0)::integer);page:=least(pages,greatest(1,coalesce((payload->>'page')::integer,ceil(n/10.0)::integer)));
  select coalesce(jsonb_agg(x.entry order by x.rank),'[]'::jsonb) into result from (
   select jsonb_build_object('id',r.public_id,'nickname',r.nickname,'score',r.score,'acceptedAt',r.accepted_at,'rank',
    row_number() over(order by score desc,accepted_at,public_id)+case when score<(payload->>'score')::integer then 1 else 0 end) as entry,
    row_number() over(order by score desc,accepted_at,public_id)+case when score<(payload->>'score')::integer then 1 else 0 end as rank
   from tesla_ranking.runs r where score_epoch=c.score_epoch
  ) x where x.rank between (page-1)*10+1 and page*10;
  return jsonb_build_object('environment',c.environment,'page',page,'pages',pages,'total',total+1,'snapshot',watermark,'previewRank',n,'entries',result);
 end if;
 if action='take' then
  if not c.accepting_writes then raise exception 'TJ:writes_paused'; end if;
  select * into s from tesla_ranking.sessions
   where status='pending' and chunks<600 and next_attempt_at<=now_ms
    and (lease is null or lease_until<=now_ms)
    and (not(payload ? 'id') or id=(payload->>'id')::uuid)
   order by next_attempt_at,created_at limit 1 for update skip locked;
  if not found then return jsonb_build_object('status','idle'); end if;
  lease_id:=(payload->>'lease')::uuid;
  update tesla_ranking.sessions set lease=lease_id,lease_until=now_ms+30000,
   dispatch_after=now_ms+30000,attempts=attempts+1 where id=s.id;
  return jsonb_build_object('status','verifying','id',s.id,'tokenHash',s.token_hash,
   'replay',s.replay,'checkpoint',s.checkpoint,'lease',lease_id,'revision',s.revision);
 end if;
 row_id:=(payload->>'id')::uuid;
 $insert$);
 source:=replace(source,'''error'',s.failure,''progress'',s.progress','''error'',s.failure,''progress'',s.progress,''publicId'',s.public_id,''receipt'',s.payload_hash is not null,''background'',c.autonomous_verification');
 source:=replace(source,'if action=''submit'' then', $insert$
 if action='retry' then
  if s.status='pending' and s.lease=(payload->>'lease')::uuid and s.revision=(payload->>'revision')::integer then
   update tesla_ranking.sessions set lease=null,lease_until=null,dispatch_after=0,
    next_attempt_at=now_ms+least(300000,5000*power(2,least(attempts,6)))::bigint where id=s.id;
  end if;
  return jsonb_build_object('ok',true);
 end if;
 if action='submit' then
  if payload ? 'claimedScore' and s.claimed_score is not null and s.claimed_score<>(payload->>'claimedScore')::integer then raise exception 'TJ:submission_conflict'; end if;
 $insert$);
 source:=replace(source,'nickname=payload->>''nickname'',replay=payload->''replay'' where id=s.id;',
  'nickname=payload->>''nickname'',replay=payload->''replay'',claimed_score=(payload->>''claimedScore'')::integer,received_at=now_ms where id=s.id;');
 source:=replace(source,'if payload->>''outcome''=''accepted'' then', $insert$
 if payload->>'outcome'='accepted' and s.claimed_score is not null and s.claimed_score<>(payload->'result'->>'score')::integer then
  payload:=jsonb_set(payload,'{outcome}','"rejected"');
 end if;
 if payload->>'outcome'='accepted' then
 $insert$);
 source:=replace(source,'chunks=chunks+1 where id=s.id','chunks=chunks+1,attempts=0,next_attempt_at=now_ms,dispatch_after=0 where id=s.id');
 execute source;
end $migration$;
-- Private dispatch is installed separately once its Vault secret and worker URL exist.
-- A trigger schedules committed jobs; pg_cron recovers lost dispatches and expired leases.
create function tesla_ranking.wake_worker() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if to_regprocedure('tesla_ranking.dispatch()') is not null then perform tesla_ranking.dispatch(); end if;
 return null;
end $$;
create trigger tesla_ranking_wake after insert or update of status,checkpoint on tesla_ranking.sessions
 for each statement execute function tesla_ranking.wake_worker();
revoke all on function tesla_ranking.wake_worker() from public,anon,authenticated;
commit;
