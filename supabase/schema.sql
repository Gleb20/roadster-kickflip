-- Isolated test ranking. No browser role can access private state or submit scores.
begin;
create schema if not exists tesla_ranking;
revoke all on schema tesla_ranking from public,anon,authenticated;
create table tesla_ranking.config (
 id boolean primary key default true check(id), accepting_sessions boolean not null default false,
 accepting_writes boolean not null default false, ruleset text not null default 'roadster-v3.4.2',
 score_epoch text not null default 'v3', environment text not null default 'staging'
);
insert into tesla_ranking.config(id) values(true);
create table tesla_ranking.sessions (
 id uuid primary key, token_hash text not null, seed bigint not null check(seed between 0 and 4294967295),
 ruleset text not null, score_epoch text not null, created_at bigint not null, expires_at bigint not null,
 status text not null default 'ready' check(status in ('ready','pending','accepted','rejected')),
 payload_hash text, nickname text, replay jsonb, checkpoint jsonb, progress integer not null default 0,
 revision integer not null default 0, lease uuid, lease_until bigint, public_id uuid not null,
 failure text, chunks integer not null default 0
);
create index sessions_expiry on tesla_ranking.sessions(expires_at);
create table tesla_ranking.runs (
 seq bigint generated always as identity primary key, public_id uuid not null unique,
 session_id uuid not null unique, score_epoch text not null, ruleset text not null,
 nickname text not null check(char_length(nickname) between 3 and 12),
 score integer not null check(score between 0 and 100000000), flips integer not null check(flips between 0 and 1000000),
 ticks integer not null check(ticks between 1 and 432000), accepted_at bigint not null, source_environment text not null
);
create index runs_ranking on tesla_ranking.runs(score_epoch,score desc,accepted_at,public_id) include(seq);
create table tesla_ranking.rate_buckets(key text primary key,n bigint not null,expires_at bigint not null);
create index rate_expiry on tesla_ranking.rate_buckets(expires_at);
alter table tesla_ranking.config enable row level security;
alter table tesla_ranking.sessions enable row level security;
alter table tesla_ranking.runs enable row level security;
alter table tesla_ranking.rate_buckets enable row level security;
revoke all on all tables in schema tesla_ranking from public,anon,authenticated;
revoke all on all sequences in schema tesla_ranking from public,anon,authenticated;
-- Service-only gateway. It must reach a non-exposed schema; browser roles have no EXECUTE.
-- Anonymous players have no auth.uid(); the Edge handler authenticates per-run capabilities.
create function public.tesla_ranking_rpc(action text,payload jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare c tesla_ranking.config%rowtype; s tesla_ranking.sessions%rowtype; result jsonb;
 now_ms bigint := floor(extract(epoch from clock_timestamp())*1000); n bigint; watermark bigint;
 total bigint; page integer; pages integer; wanted integer; row_id uuid; bucket text; lease_id uuid;
begin
 select * into strict c from tesla_ranking.config where id=true for share;
 if action='health' then return jsonb_build_object('ok',true,'version','supabase-0.1.0','environment',c.environment,'ruleset',c.ruleset,'scoreEpoch',c.score_epoch,'acceptingSessions',c.accepting_sessions,'acceptingWrites',c.accepting_writes); end if;
 if action in ('scores','entry') then
  perform pg_advisory_xact_lock(7850310);
  select coalesce(max(seq),0) into watermark from tesla_ranking.runs where score_epoch=c.score_epoch;
  if action='entry' then
   select to_jsonb(r)||jsonb_build_object('id',r.public_id,'acceptedAt',r.accepted_at,'environment',r.source_environment) into result from tesla_ranking.runs r where public_id=(payload->>'id')::uuid and score_epoch=c.score_epoch;
   if result is null then raise exception 'TJ:not_found'; end if;
   select count(*)+1 into n from tesla_ranking.runs where score_epoch=c.score_epoch and (score>(result->>'score')::integer or (score=(result->>'score')::integer and (accepted_at<(result->>'accepted_at')::bigint or (accepted_at=(result->>'accepted_at')::bigint and public_id<(result->>'public_id')::uuid))));
   return jsonb_build_object('entry',result-'seq'-'session_id'-'score_epoch'-'public_id'-'accepted_at'-'source_environment','rank',n,'page',ceil(n/10.0),'snapshot',watermark);
  end if;
  if payload ? 'snapshot' then
   if (payload->>'snapshot')::bigint<0 or (payload->>'snapshot')::bigint>watermark then raise exception 'TJ:invalid_snapshot'; end if;
   watermark:=(payload->>'snapshot')::bigint;
  end if;
  select count(*) into total from tesla_ranking.runs where score_epoch=c.score_epoch and seq<=watermark;
  pages:=greatest(1,ceil(total/10.0)::integer);wanted:=coalesce((payload->>'page')::integer,1);
  if wanted<1 or wanted>10000 then raise exception 'TJ:invalid_page'; end if;page:=least(wanted,pages);
  select coalesce(jsonb_agg(x.entry order by x.rank),'[]'::jsonb) into result from (
   select jsonb_build_object('id',r.public_id,'nickname',r.nickname,'score',r.score,'flips',r.flips,'ticks',r.ticks,'acceptedAt',r.accepted_at,'ruleset',r.ruleset,'environment',r.source_environment,'rank',row_number() over(order by score desc,accepted_at,public_id)) as entry,
    row_number() over(order by score desc,accepted_at,public_id) as rank
   from tesla_ranking.runs r where score_epoch=c.score_epoch and seq<=watermark order by score desc,accepted_at,public_id limit 10 offset (page-1)*10
  ) x;
  return jsonb_build_object('environment',c.environment,'scoreEpoch',c.score_epoch,'page',page,'pages',pages,'total',total,'snapshot',watermark,'entries',result);
 end if;
 if action='create' then
  if not c.accepting_sessions then raise exception 'TJ:new_sessions_paused'; end if;
  if not c.accepting_writes then raise exception 'TJ:writes_paused'; end if;
  if payload->>'ruleset'<>c.ruleset then raise exception 'TJ:ruleset_unavailable'; end if;
  delete from tesla_ranking.sessions where id in(select id from tesla_ranking.sessions where expires_at<now_ms-604800000 limit 100);
  delete from tesla_ranking.rate_buckets where key in(select key from tesla_ranking.rate_buckets where expires_at<now_ms limit 1000);
  foreach bucket in array array['minute:'||(now_ms/60000)::text,'day:'||(now_ms/86400000)::text] loop
   insert into tesla_ranking.rate_buckets values(bucket,1,now_ms+172800000) on conflict(key) do update set n=tesla_ranking.rate_buckets.n+1 returning rate_buckets.n into n;
   if (bucket like 'minute:%' and n>120) or (bucket like 'day:%' and n>5000) then raise exception 'TJ:rate_limited'; end if;
  end loop;
  insert into tesla_ranking.sessions(id,token_hash,seed,ruleset,score_epoch,created_at,expires_at,public_id)
   values((payload->>'id')::uuid,payload->>'tokenHash',(payload->>'seed')::bigint,c.ruleset,c.score_epoch,now_ms,now_ms+86400000,(payload->>'publicId')::uuid) returning * into s;
  return jsonb_build_object('id',s.id,'seed',s.seed,'ruleset',s.ruleset,'scoreEpoch',s.score_epoch,'issuedAt',now_ms,'expiresAt',s.expires_at,'environment',c.environment);
 end if;
 row_id:=(payload->>'id')::uuid;
 select * into s from tesla_ranking.sessions where id=row_id for update;
 if not found or s.token_hash<>coalesce(payload->>'tokenHash','') then raise exception 'TJ:unauthorized'; end if;
 if action='get' then
  select jsonb_build_object('id',public_id,'nickname',nickname,'score',score,'flips',flips,'ticks',ticks,'acceptedAt',accepted_at,'ruleset',ruleset,'environment',source_environment) into result from tesla_ranking.runs where session_id=s.id;
  return jsonb_build_object('status',s.status,'entry',result,'error',s.failure,'progress',s.progress);
 end if;
 if not c.accepting_writes then raise exception 'TJ:writes_paused'; end if;
 if action='submit' then
  if s.payload_hash is not null then
   if s.payload_hash<>payload->>'payloadHash' then raise exception 'TJ:submission_conflict'; end if;
  else
   if s.expires_at<now_ms then raise exception 'TJ:session_expired'; end if;
   if (payload->'replay'->>'seed')::bigint<>s.seed or payload->'replay'->>'ruleset'<>s.ruleset then raise exception 'TJ:session_mismatch'; end if;
   if (payload->'replay'->>'ticks')::bigint*1000/120>now_ms-s.created_at+2000 then raise exception 'TJ:run_too_fast'; end if;
   bucket:='bytes:'||(now_ms/86400000)::text;
   insert into tesla_ranking.rate_buckets values(bucket,octet_length((payload->'replay')::text),now_ms+172800000) on conflict(key) do update set n=tesla_ranking.rate_buckets.n+excluded.n returning rate_buckets.n into n;
   if n>33554432 then raise exception 'TJ:rate_limited'; end if;
   update tesla_ranking.sessions set status='pending',payload_hash=payload->>'payloadHash',nickname=payload->>'nickname',replay=payload->'replay' where id=s.id;
  end if;
  return public.tesla_ranking_rpc('get',payload);
 end if;
 if action='claim' then
  if s.status in('accepted','rejected') then return public.tesla_ranking_rpc('get',payload); end if;
  if s.expires_at<now_ms then raise exception 'TJ:session_expired'; end if;
  if s.status<>'pending' or (s.lease is not null and s.lease_until>now_ms) then raise exception 'TJ:job_busy_or_unavailable'; end if;
  if s.chunks>=600 then raise exception 'TJ:verification_unavailable'; end if;
  lease_id:=(payload->>'lease')::uuid;
  update tesla_ranking.sessions set lease=lease_id,lease_until=now_ms+30000 where id=s.id;
  return jsonb_build_object('status','verifying','replay',s.replay,'checkpoint',s.checkpoint,'lease',lease_id,'revision',s.revision);
 end if;
 if action='advance' then
  if s.status<>'pending' or s.lease is distinct from (payload->>'lease')::uuid or s.revision<>(payload->>'revision')::integer then raise exception 'TJ:stale_lease'; end if;
  if s.expires_at<now_ms then raise exception 'TJ:session_expired'; end if;
  if payload->>'outcome'='accepted' then
   if (payload->'result'->>'ticks')::integer<>(s.replay->>'ticks')::integer then raise exception 'TJ:invalid_result'; end if;
   perform pg_advisory_xact_lock(7850310);
   insert into tesla_ranking.runs(public_id,session_id,score_epoch,ruleset,nickname,score,flips,ticks,accepted_at,source_environment)
    values(s.public_id,s.id,s.score_epoch,s.ruleset,s.nickname,(payload->'result'->>'score')::integer,(payload->'result'->>'flips')::integer,(payload->'result'->>'ticks')::integer,now_ms,c.environment);
   update tesla_ranking.sessions set status='accepted',checkpoint=null,progress=(replay->>'ticks')::integer,lease=null,lease_until=null,revision=revision+1,chunks=chunks+1 where id=s.id;
  elsif payload->>'outcome'='rejected' then
   update tesla_ranking.sessions set status='rejected',failure='verification_failed',checkpoint=null,lease=null,lease_until=null,revision=revision+1,chunks=chunks+1 where id=s.id;
  elsif payload->>'outcome'='pending' then
   update tesla_ranking.sessions set checkpoint=payload->'checkpoint',progress=(payload->>'progress')::integer,lease=null,lease_until=null,revision=revision+1,chunks=chunks+1 where id=s.id;
  else raise exception 'TJ:invalid_outcome'; end if;
  return public.tesla_ranking_rpc('get',payload);
 end if;
 raise exception 'TJ:not_found';
end $$;
revoke all on function public.tesla_ranking_rpc(text,jsonb) from public,anon,authenticated;
grant execute on function public.tesla_ranking_rpc(text,jsonb) to service_role;
comment on function public.tesla_ranking_rpc is 'Service-only Tesla Jump staging API. No direct browser execution.';
commit;
