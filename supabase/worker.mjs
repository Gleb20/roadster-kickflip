import {verifyChunk} from './chunk.mjs';

/** One bounded lease per invocation. PostgreSQL owns replay, checkpoints and retries. */
export function createWorker({rpc,chunk=verifyChunk}={}){
 return async(sessionId)=>{
  const job=await rpc('take',{...(sessionId?{id:sessionId}:{}),lease:crypto.randomUUID()});
  if(job.status!=='verifying')return {processed:false};
  const p={id:job.id,tokenHash:job.tokenHash,lease:job.lease,revision:job.revision};
  try{
   // The compute budget remains bounded; fast runs no longer stop every 50 simulated seconds.
   const result=chunk(job.replay,job.checkpoint,{maxTicks:432000,budgetMs:400});
   const value=await rpc('advance',{...p,...result});
   return {processed:true,status:value.status,progress:value.progress};
  }catch(error){
   // Infrastructure errors are not cheating. A lost response/expired lease is safe to retry.
   try{await rpc('retry',p);}catch{}
   throw error;
  }
 };
}

export function createWorkerHandler({work,secret}){
 if(typeof secret!=='string'||secret.length<32)throw Error('Worker secret unavailable');
 return async req=>{
  if(req.method!=='POST'||req.headers.get('Authorization')!==`Bearer ${secret}`)return new Response(null,{status:401});
  try{
   const bytes=await req.text();if(bytes.length>128)return new Response(null,{status:413});
   const b=JSON.parse(bytes);if(typeof b.sessionId!=='string'||! /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(b.sessionId))return new Response(null,{status:400});
   return Response.json(await work(b.sessionId));
  }catch{return Response.json({error:'worker_unavailable'},{status:503});}
 };
}
