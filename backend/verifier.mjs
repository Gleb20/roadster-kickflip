import {createServer} from 'node:http';
import {Worker} from 'node:worker_threads';
import {pathToFileURL} from 'node:url';
const ID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,TOKEN=/^[0-9a-f]{64}$/;
function verify(replay){return new Promise(resolve=>{
 const worker=new Worker(new URL('./verify-thread.mjs',import.meta.url),{workerData:replay,resourceLimits:{maxOldGenerationSizeMb:96}});let settled=false;
 const finish=result=>{if(settled)return;settled=true;clearTimeout(timer);void worker.terminate();resolve(result);},timer=setTimeout(()=>finish({outcome:'retry'}),60000);
 worker.once('message',finish);worker.once('error',()=>finish({outcome:'retry'}));worker.once('exit',()=>finish({outcome:'retry'}));
});}
export function createVerifier({apiUrl,verifyKey,allowedOrigins,fetcher=fetch}){
 const base=new URL(apiUrl);if(base.protocol!=='https:'&&!['127.0.0.1','localhost'].includes(base.hostname))throw Error('Verifier API must use HTTPS');if(!verifyKey)throw Error('Missing verifier key');let busy=false;
 async function api(path,body){const response=await fetcher(new URL(path,base),{method:'POST',headers:{'Content-Type':'application/json','X-Verify-Key':verifyKey},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});const length=Number(response.headers.get('content-length'));if(length>524288)throw Error('Unexpected API response');const reader=response.body.getReader(),chunks=[];let size=0;try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>524288){await reader.cancel();throw Error('Unexpected API response');}chunks.push(Buffer.from(value));}}finally{reader.releaseLock();}return {ok:response.ok,status:response.status,body:JSON.parse(Buffer.concat(chunks).toString('utf8'))};}
 const server=createServer(async(req,res)=>{
  const origin=req.headers.origin,headers={'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin'};if(allowedOrigins.includes(origin))headers['Access-Control-Allow-Origin']=origin;
  const send=(status,value)=>{if(!res.destroyed)res.writeHead(status,headers).end(JSON.stringify(value));};
  if(req.url==='/health'&&req.method==='GET'){send(200,{ok:true,service:'tesla-jump-verifier',version:'0.1.0',ruleset:'roadster-v3.4.1',busy});return;}
  if(!allowedOrigins.includes(origin)){send(403,{error:'origin_not_allowed'});return;}
  if(req.method==='OPTIONS'){headers['Access-Control-Allow-Methods']='POST,OPTIONS';headers['Access-Control-Allow-Headers']='Content-Type';send(204,null);return;}
  if(req.url!=='/verify'||req.method!=='POST'){send(404,{error:'not_found'});return;}
  if(busy){send(429,{error:'verifier_busy',retryable:true});return;}
  let body;try{if(!req.headers['content-type']?.startsWith('application/json')){send(415,{error:'json_required'});return;}let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>4096){send(413,{error:'body_too_large'});return;}chunks.push(chunk);}body=JSON.parse(Buffer.concat(chunks).toString('utf8'));if(!ID.test(body.sessionId)||!TOKEN.test(body.capability))throw Error();}catch{send(400,{error:'invalid_body'});return;}
  if(busy){send(429,{error:'verifier_busy',retryable:true});return;}
  busy=true;let claimed=null;
  try{
   const claim=await api('/internal/claim',body);if(!claim.ok){send(claim.status,claim.body);return;}
   if(['accepted','rejected','unavailable'].includes(claim.body.status)){send(200,claim.body);return;}
   claimed=claim.body;const input=claimed.replay;
   const result=input?.seed===claimed.seed&&input?.ruleset===claimed.ruleset?await verify(input):{outcome:'rejected'};
   const complete=await api('/internal/complete',{sessionId:body.sessionId,lease:claimed.lease,...result});send(complete.status,complete.body);
  }catch{
   if(claimed){try{await api('/internal/complete',{sessionId:body.sessionId,lease:claimed.lease,outcome:'retry'});}catch{}}
   send(503,{error:'verification_temporarily_unavailable',retryable:true});
  }finally{busy=false;}
 });
 server.requestTimeout=15000;server.headersTimeout=8000;return server;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const origins=(process.env.ALLOWED_ORIGINS||'https://gleb20.github.io').split(',').map(s=>s.trim()),server=createVerifier({apiUrl:process.env.API_URL,verifyKey:process.env.VERIFY_KEY,allowedOrigins:origins});
 server.listen(Number(process.env.PORT)||8790,'0.0.0.0',()=>console.log(JSON.stringify({event:'verifier_ready',version:'0.1.0'})));
 process.on('SIGTERM',()=>{server.close();setTimeout(()=>process.exit(0),25000).unref();});
}
