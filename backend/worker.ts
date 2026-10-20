import {HttpError,object,readJSON,replay,nickname,uuid,RULESET} from './protocol.ts';
type Session={id:string;token_hash:string;seed:number;ruleset:string;score_epoch:string;created_at:number;expires_at:number;status:string;payload_hash:string|null;nickname:string|null;replay:string|null;public_id:string|null;lease_hash:string|null;lease_until:number|null;verify_attempts:number;failure:string|null};
type Entry={public_id:string;nickname:string;score:number;flips:number;ticks:number;accepted_at:number;ruleset:string;source_environment:string};
const encoder=new TextEncoder(),DAY=86400000,ENTRY_COLUMNS='public_id,nickname,score,flips,ticks,accepted_at,ruleset,source_environment';
const hex=(bytes:ArrayBuffer)=>Array.from(new Uint8Array(bytes),v=>v.toString(16).padStart(2,'0')).join('');
const hash=async(value:string)=>hex(await crypto.subtle.digest('SHA-256',encoder.encode(value)));
function token(){return hex(crypto.getRandomValues(new Uint8Array(32)).buffer);}
async function equal(a:string,b:string){const [x,y]=await Promise.all([crypto.subtle.digest('SHA-256',encoder.encode(a)),crypto.subtle.digest('SHA-256',encoder.encode(b))]);return crypto.subtle.timingSafeEqual(x,y);}
function publicEntry(row:Entry){return {id:row.public_id,nickname:row.nickname,score:row.score,flips:row.flips,ticks:row.ticks,acceptedAt:row.accepted_at,ruleset:row.ruleset,environment:row.source_environment};}
function json(value:unknown,status=200){return Response.json(value,{status,headers:{'Cache-Control':'no-store'}});}
async function rate(env:Env,key:string,limit:number,expires:number){const row=await env.DB.prepare('INSERT INTO rate_buckets(key,n,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET n=MIN(rate_buckets.n+1,?) RETURNING n').bind(key,expires,limit+1).first<{n:number}>();if(!row||row.n>limit)throw new HttpError(429,'rate_limited');}
async function session(request:Request,env:Env,id:string){
 const value=request.headers.get('authorization')?.match(/^Bearer ([0-9a-f]{64})$/)?.[1];if(!value)throw new HttpError(401,'unauthorized');
 const row=await env.DB.prepare('SELECT * FROM sessions WHERE id=?').bind(uuid(id)).first<Session>();if(!row||!await equal(row.token_hash,await hash(value)))throw new HttpError(401,'unauthorized');return row;
}
async function sessionStatus(env:Env,row:Session){
 const entry=row.status==='accepted'?await env.DB.prepare(`SELECT ${ENTRY_COLUMNS} FROM runs WHERE session_id=?`).bind(row.id).first<Entry>():null;
 return {status:row.status,error:row.failure,entry:entry?publicEntry(entry):null,verifierUrl:env.VERIFIER_URL||null,expiresAt:row.expires_at};
}
async function internal(request:Request,env:Env,path:string){
 if(request.method!=='POST')throw new HttpError(405,'method_not_allowed');
 if(!env.VERIFY_KEY||!await equal(request.headers.get('x-verify-key')||'',env.VERIFY_KEY))throw new HttpError(401,'unauthorized');
 const body=object(await readJSON(request,4096)),id=uuid(body.sessionId),now=Date.now();
 if(path==='/internal/claim'){
  if(typeof body.capability!=='string'||! /^[0-9a-f]{64}$/.test(body.capability))throw new HttpError(401,'unauthorized');
  const row=await env.DB.prepare('SELECT * FROM sessions WHERE id=?').bind(id).first<Session>();if(!row||!await equal(row.token_hash,await hash(body.capability)))throw new HttpError(401,'unauthorized');
  if(['accepted','rejected','unavailable'].includes(row.status))return json(await sessionStatus(env,row));
  if(row.expires_at<now)throw new HttpError(410,'session_expired');
  if(row.verify_attempts>=5&&!(row.status==='verifying'&&(row.lease_until||0)>=now)){await env.DB.prepare("UPDATE sessions SET status='unavailable',failure='verification_unavailable' WHERE id=? AND verify_attempts>=5 AND status NOT IN ('accepted','rejected')").bind(id).run();const updated=await env.DB.prepare('SELECT * FROM sessions WHERE id=?').bind(id).first<Session>();if(!updated)throw new HttpError(500,'storage_error');return json(await sessionStatus(env,updated));}
  const lease=token(),leaseHash=await hash(lease);
  const claimed=await env.DB.prepare("UPDATE sessions SET status='verifying',lease_hash=?,lease_until=?,verify_attempts=verify_attempts+1 WHERE id=? AND (status='pending' OR (status='verifying' AND lease_until<?)) AND verify_attempts<5 RETURNING replay,seed,ruleset").bind(leaseHash,now+120000,id,now).first<{replay:string;seed:number;ruleset:string}>();
  if(!claimed)throw new HttpError(409,'job_busy_or_unavailable');return json({status:'verifying',sessionId:id,lease,replay:JSON.parse(claimed.replay),seed:claimed.seed,ruleset:claimed.ruleset});
 }
 if(path==='/internal/complete'){
  if(typeof body.lease!=='string')throw new HttpError(401,'unauthorized');const leaseHash=await hash(body.lease);
  const row=await env.DB.prepare("SELECT * FROM sessions WHERE id=? AND lease_hash=? AND status='verifying'").bind(id,leaseHash).first<Session>();if(!row)throw new HttpError(409,'stale_lease');
  if(body.outcome==='retry'){
   await env.DB.prepare("UPDATE sessions SET status='pending',lease_hash=NULL,lease_until=NULL WHERE id=? AND lease_hash=? AND status='verifying'").bind(id,leaseHash).run();return json({status:'pending'});
  }
  if(body.outcome==='rejected'){
   await env.DB.prepare("UPDATE sessions SET status='rejected',failure='verification_failed',lease_hash=NULL,lease_until=NULL WHERE id=? AND lease_hash=? AND status='verifying'").bind(id,leaseHash).run();return json({status:'rejected'});
  }
  if(body.outcome!=='accepted')throw new HttpError(400,'invalid_outcome');
  const result=object(body.result);
  for(const [key,max] of [['score',100000000],['flips',1000000],['ticks',432000]] as const)if(typeof result[key]!=='number'||!Number.isSafeInteger(result[key])||result[key]<0||result[key]>max)throw new HttpError(400,'invalid_result');
  if(result.ticks===0||result.ticks!==replay(JSON.parse(row.replay||'null')).ticks)throw new HttpError(400,'invalid_result');
  await env.DB.batch([
   env.DB.prepare("INSERT INTO runs(public_id,session_id,score_epoch,ruleset,nickname,score,flips,ticks,accepted_at,source_environment) SELECT public_id,id,score_epoch,ruleset,nickname,?,?,?,?,? FROM sessions WHERE id=? AND lease_hash=? AND status='verifying' ON CONFLICT(session_id) DO NOTHING").bind(result.score,result.flips,result.ticks,now,env.ENVIRONMENT,id,leaseHash),
   env.DB.prepare("UPDATE sessions SET status='accepted',failure=NULL,lease_hash=NULL,lease_until=NULL WHERE id=? AND lease_hash=? AND status='verifying' AND EXISTS(SELECT 1 FROM runs WHERE session_id=?)").bind(id,leaseHash,id)
  ]);
  const accepted=await env.DB.prepare('SELECT * FROM sessions WHERE id=?').bind(id).first<Session>();if(!accepted)throw new HttpError(500,'storage_error');return json(await sessionStatus(env,accepted));
 }
 throw new HttpError(404,'not_found');
}
async function route(request:Request,env:Env){
 const url=new URL(request.url),path=url.pathname,now=Date.now();
 if(request.method==='POST'&&env.ACCEPTING_WRITES!=='true')throw new HttpError(503,'writes_paused');
 if(path.startsWith('/internal/'))return internal(request,env,path);
 if(path==='/health'&&request.method==='GET')return json({ok:true,version:'0.1.0',environment:env.ENVIRONMENT,ruleset:RULESET,scoreEpoch:env.SCORE_EPOCH,acceptingSessions:env.ACCEPTING_SESSIONS==='true',acceptingWrites:env.ACCEPTING_WRITES==='true'});
 const allowed=env.ALLOWED_ORIGINS.split(',').map(v=>v.trim()),origin=request.headers.get('origin');
 if(request.method==='OPTIONS'){if(!origin||!allowed.includes(origin))throw new HttpError(403,'origin_not_allowed');return new Response(null,{status:204});}
 if(request.method!=='GET'&&(!origin||!allowed.includes(origin)))throw new HttpError(403,'origin_not_allowed');
 if(path==='/sessions'&&request.method==='POST'){
  if(env.ACCEPTING_SESSIONS!=='true')throw new HttpError(503,'new_sessions_paused');
  const body=object(await readJSON(request,1024));if(body.ruleset!==RULESET)throw new HttpError(409,'ruleset_unavailable');
  const day=Math.floor(now/DAY),key=await crypto.subtle.importKey('raw',encoder.encode(env.RATE_KEY),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const ipHash=hex(await crypto.subtle.sign('HMAC',key,encoder.encode(`${day}:${request.headers.get('CF-Connecting-IP')||'local'}`)));
  await rate(env,`ip:${day}:${ipHash}:${Math.floor(now/300000)}`,60,now+DAY);await rate(env,`global:${day}`,5000,(day+2)*DAY);
  const id=crypto.randomUUID(),capability=token(),seed=crypto.getRandomValues(new Uint32Array(1))[0],expires=now+DAY;
  await env.DB.prepare('INSERT INTO sessions(id,token_hash,seed,ruleset,score_epoch,created_at,expires_at) VALUES(?,?,?,?,?,?,?)').bind(id,await hash(capability),seed,RULESET,env.SCORE_EPOCH,now,expires).run();
  return json({id,capability,seed,ruleset:RULESET,scoreEpoch:env.SCORE_EPOCH,expiresAt:expires,issuedAt:now,environment:env.ENVIRONMENT},201);
 }
 const match=path.match(/^\/sessions\/([^/]+)$/);
 if(match){const row=await session(request,env,match[1]);
  if(request.method==='GET')return json(await sessionStatus(env,row));
  if(request.method!=='POST')throw new HttpError(405,'method_not_allowed');
  const body=object(await readJSON(request)),name=nickname(body.nickname),record=replay(body.replay);
  if(record.seed!==row.seed||record.ruleset!==row.ruleset)throw new HttpError(409,'session_mismatch');
  const canonical=JSON.stringify({nickname:name,replay:record}),payloadHash=await hash(canonical);
  if(row.payload_hash){if(!await equal(row.payload_hash,payloadHash))throw new HttpError(409,'submission_conflict');return json(await sessionStatus(env,row));}
  if(row.expires_at<now)throw new HttpError(410,'session_expired');
  if(record.ticks/120*1000>now-row.created_at+2000)throw new HttpError(400,'run_too_fast');
  await env.DB.prepare("UPDATE sessions SET status='pending',payload_hash=?,nickname=?,replay=?,submitted_at=?,public_id=? WHERE id=? AND status='ready' AND payload_hash IS NULL").bind(payloadHash,name,JSON.stringify(record),now,crypto.randomUUID(),row.id).run();
  const updated=await env.DB.prepare('SELECT * FROM sessions WHERE id=?').bind(row.id).first<Session>();if(!updated)throw new HttpError(500,'storage_error');if(!updated.payload_hash||!await equal(updated.payload_hash,payloadHash))throw new HttpError(409,'submission_conflict');return json(await sessionStatus(env,updated),202);
 }
 if(path==='/scores'&&request.method==='GET'){
  const requested=Number(url.searchParams.get('page')||1),wantedSnapshot=url.searchParams.get('snapshot');if(!Number.isInteger(requested)||requested<1||requested>10000)throw new HttpError(400,'invalid_page');
  const max=await env.DB.prepare('SELECT COALESCE(MAX(seq),0) AS seq FROM runs').first<{seq:number}>(),watermark=wantedSnapshot===null?max?.seq||0:Number(wantedSnapshot);
  if(!Number.isSafeInteger(watermark)||watermark<0||watermark>(max?.seq||0))throw new HttpError(400,'invalid_snapshot');
  const count=await env.DB.prepare('SELECT COUNT(*) AS total FROM runs WHERE score_epoch=? AND seq<=?').bind(env.SCORE_EPOCH,watermark).first<{total:number}>(),total=count?.total||0,pages=Math.max(1,Math.ceil(total/10)),page=Math.min(requested,pages);
  const rows=await env.DB.prepare(`SELECT ${ENTRY_COLUMNS} FROM runs WHERE score_epoch=? AND seq<=? ORDER BY score DESC,accepted_at,public_id LIMIT 10 OFFSET ?`).bind(env.SCORE_EPOCH,watermark,(page-1)*10).all<Entry>();
  return json({environment:env.ENVIRONMENT,scoreEpoch:env.SCORE_EPOCH,page,pages,total,snapshot:watermark,entries:rows.results.map((row,i)=>({...publicEntry(row),rank:(page-1)*10+i+1}))});
 }
 if(path.startsWith('/scores/')&&request.method==='GET'){
  const id=uuid(path.slice(8)),row=await env.DB.prepare(`SELECT ${ENTRY_COLUMNS} FROM runs WHERE public_id=? AND score_epoch=?`).bind(id,env.SCORE_EPOCH).first<Entry>();if(!row)throw new HttpError(404,'not_found');
  const watermark=await env.DB.prepare('SELECT COALESCE(MAX(seq),0) AS seq FROM runs').first<{seq:number}>();
  const above=await env.DB.prepare('SELECT COUNT(*) AS n FROM runs WHERE score_epoch=? AND seq<=? AND (score>? OR (score=? AND (accepted_at<? OR (accepted_at=? AND public_id<?))))').bind(env.SCORE_EPOCH,watermark?.seq||0,row.score,row.score,row.accepted_at,row.accepted_at,row.public_id).first<{n:number}>(),rank=(above?.n||0)+1;return json({entry:publicEntry(row),rank,page:Math.ceil(rank/10),snapshot:watermark?.seq||0});
 }
 throw new HttpError(404,'not_found');
}
export default {
 async fetch(request,env){
  const requestId=crypto.randomUUID();let response:Response;
  try{if(env.MIGRATION_PROXY_URL){const target=new URL(env.MIGRATION_PROXY_URL),source=new URL(request.url);if(target.protocol!=='https:'||target.origin===source.origin||request.headers.has('X-Tesla-Migration-Hop'))throw new HttpError(503,'migration_unavailable');target.pathname=source.pathname;target.search=source.search;const forwarded=new Request(target,request);forwarded.headers.set('X-Tesla-Migration-Hop','1');response=await fetch(forwarded,{redirect:'manual'});}else response=await route(request,env);}catch(error){if(error instanceof HttpError)response=json({error:error.code,requestId},error.status);else{console.error(JSON.stringify({event:'api_error',requestId}));response=json({error:'service_unavailable',requestId},503);}}
  const headers=new Headers(response.headers),origin=request.headers.get('origin');if(origin&&env.ALLOWED_ORIGINS.split(',').map(s=>s.trim()).includes(origin))headers.set('Access-Control-Allow-Origin',origin);
  headers.set('Vary','Origin');headers.set('Access-Control-Allow-Methods','GET,POST,OPTIONS');headers.set('Access-Control-Allow-Headers','Content-Type,Authorization');headers.set('X-Content-Type-Options','nosniff');if(!headers.has('X-Request-ID'))headers.set('X-Request-ID',requestId);if(response.status===429)headers.set('Retry-After','300');return new Response(response.body,{status:response.status,headers});
 },
 async scheduled(_event,env){const now=Date.now();await env.DB.batch([env.DB.prepare('DELETE FROM rate_buckets WHERE expires_at<?').bind(now),env.DB.prepare('DELETE FROM sessions WHERE expires_at<?').bind(now-7*DAY)]);}
} satisfies ExportedHandler<Env>;
