import {RULESET,validateReplay} from './rulesets/roadster-v342/run.js';
import {verifyChunk} from './chunk.mjs';
const enc=new TextEncoder(),ORIGINS=['https://gleb20.github.io','http://127.0.0.1:8766','http://127.0.0.1:8767','http://localhost:8767'];
class ApiError extends Error{constructor(code,status=400){super(code);this.code=code;this.status=status;}}
const hex=b=>Array.from(new Uint8Array(b),v=>v.toString(16).padStart(2,'0')).join('');
const hash=async v=>hex(await crypto.subtle.digest('SHA-256',enc.encode(v)));
const id=v=>{if(typeof v!=='string'||! /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(v))throw new ApiError('invalid_id');return v;};
const name=v=>{if(typeof v!=='string')throw new ApiError('invalid_nickname');v=v.normalize('NFKC').trim().replace(/ +/g,' ');if([...v].length<3||[...v].length>12||! /^[\p{L}\p{N} _-]+$/u.test(v))throw new ApiError('invalid_nickname');return v;};
async function body(req,max=524288){
 if(!req.headers.get('content-type')?.toLowerCase().startsWith('application/json'))throw new ApiError('json_required',415);
 if(Number(req.headers.get('content-length'))>max)throw new ApiError('body_too_large',413);
 const reader=req.body?.getReader();if(!reader)throw new ApiError('invalid_body');let n=0;const chunks=[];
 try{while(true){const x=await reader.read();if(x.done)break;n+=x.value.length;if(n>max){await reader.cancel();throw new ApiError('body_too_large',413);}chunks.push(x.value);}}finally{reader.releaseLock();}
 const bytes=new Uint8Array(n);let i=0;for(const x of chunks){bytes.set(x,i);i+=x.length;}
 try{const v=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));if(!v||typeof v!=='object'||Array.isArray(v))throw Error();return v;}catch{throw new ApiError('invalid_body');}
}
export function createHandler({rpc,chunk=verifyChunk}={}){
 return async req=>{
  const origin=req.headers.get('origin'),headers={'Cache-Control':'no-store','Vary':'Origin','X-Content-Type-Options':'nosniff','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type,Authorization,apikey,X-Run-Capability'};
  if(ORIGINS.includes(origin))headers['Access-Control-Allow-Origin']=origin;
  const json=(v,status=200)=>Response.json(v,{status,headers});
  try{
   const url=new URL(req.url),prefix='/functions/v1/tesla-ranking',path=url.pathname.replace(/^\/(?:functions\/v1\/)?tesla-ranking(?=\/|$)/,'')||'/';
   if(req.method==='OPTIONS'){if(!ORIGINS.includes(origin))throw new ApiError('origin_not_allowed',403);return new Response(null,{status:204,headers});}
   if(req.method!=='GET'&&!ORIGINS.includes(origin))throw new ApiError('origin_not_allowed',403);
   if(path==='/health'&&req.method==='GET')return json(await rpc('health',{}));
   if(path==='/scores'&&req.method==='GET'){
    const page=Number(url.searchParams.get('page')||1),snapshot=url.searchParams.get('snapshot');if(!Number.isInteger(page)||page<1||page>10000)throw new ApiError('invalid_page');
    if(snapshot!==null&&(!Number.isSafeInteger(Number(snapshot))||Number(snapshot)<0))throw new ApiError('invalid_snapshot');
    return json(await rpc('scores',{page,...(snapshot===null?{}:{snapshot:Number(snapshot)})}));
   }
   if(path.startsWith('/scores/')&&req.method==='GET')return json(await rpc('entry',{id:id(path.slice(8))}));
   if(path==='/sessions'&&req.method==='POST'){
    const b=await body(req,1024);if(b.ruleset!==RULESET)throw new ApiError('ruleset_unavailable',409);
    const capability=hex(crypto.getRandomValues(new Uint8Array(32))),value=await rpc('create',{id:crypto.randomUUID(),publicId:crypto.randomUUID(),tokenHash:await hash(capability),seed:crypto.getRandomValues(new Uint32Array(1))[0],ruleset:RULESET});
    return json({...value,capability},201);
   }
   const match=path.match(/^\/sessions\/([^/]+)$/);
   const decorate=v=>({...v,continue:v.status==='pending',verifierUrl:null});
   if(match){
    const cap=req.headers.get('x-run-capability')||req.headers.get('authorization')?.match(/^Bearer ([0-9a-f]{64})$/)?.[1];if(!cap||! /^[0-9a-f]{64}$/.test(cap))throw new ApiError('unauthorized',401);
    const p={id:id(match[1]),tokenHash:await hash(cap)};
    if(req.method==='GET')return json(decorate(await rpc('get',p)));
    if(req.method!=='POST')throw new ApiError('method_not_allowed',405);
    const b=await body(req),nickname=name(b.nickname);try{validateReplay(b.replay);}catch{throw new ApiError('invalid_replay');}
    const replay={format:1,ruleset:b.replay.ruleset,seed:b.replay.seed,ticks:b.replay.ticks,events:b.replay.events.map(e=>[e[0],e[1]])};
    return json(decorate(await rpc('submit',{...p,nickname,replay,payloadHash:await hash(JSON.stringify({nickname,replay}))})),202);
   }
   if(path==='/verify'&&req.method==='POST'){
    const b=await body(req,1024);if(typeof b.capability!=='string'||! /^[0-9a-f]{64}$/.test(b.capability))throw new ApiError('unauthorized',401);
    const p={id:id(b.sessionId),tokenHash:await hash(b.capability),lease:crypto.randomUUID()},job=await rpc('claim',p);
    if(job.status!=='verifying')return json(decorate(job));
    const result=chunk(job.replay,job.checkpoint);
    return json(decorate(await rpc('advance',{...p,revision:job.revision,...result})));
   }
   throw new ApiError('not_found',404);
  }catch(e){if(e instanceof ApiError)return json({error:e.code},e.status);return json({error:'service_unavailable'},503);}
 };
}
export function createRpc({url,key,fetcher=fetch}){
 return async(action,payload)=>{
  const res=await fetcher(url+'/rest/v1/rpc/tesla_ranking_rpc',{method:'POST',headers:{'Content-Type':'application/json',apikey:key,...(key.startsWith('sb_secret_')?{}:{Authorization:'Bearer '+key})},body:JSON.stringify({action,payload}),signal:AbortSignal.timeout(12000)});
  const value=await res.json();if(!res.ok){const code=value.message?.match(/TJ:([a-z_]+)/)?.[1];if(code){const status=code==='unauthorized'?401:code==='not_found'?404:code==='rate_limited'?429:code.includes('paused')?503:code.includes('conflict')||code.includes('busy')||code==='stale_lease'?409:code==='session_expired'?410:400;throw new ApiError(code,status);}throw Error('Database request failed');}return value;
 };
}
