/** Optional ranking transport. No automatic public submissions or gameplay locks. */
export const ONLINE_PENDING_KEY='roadster-online-pending-v1';
export const validNickname=value=>typeof value==='string'&&[...value.normalize('NFKC').trim().replace(/ +/g,' ')].length>=3&&[...value.normalize('NFKC').trim().replace(/ +/g,' ')].length<=12&&/^[\p{L}\p{N} _-]+$/u.test(value.normalize('NFKC').trim().replace(/ +/g,' '));
const normalName=value=>value.normalize('NFKC').trim().replace(/ +/g,' ');
export class OnlineError extends Error{constructor(code){super(code);this.code=code;}}
export function createOnline({apiUrl,apiKey=null,ruleset,storage,fetcher=fetch,now=Date.now,localVerifier=null,onChange=()=>{},onAccepted=()=>{},enabled=true,connected=()=>typeof navigator==='undefined'||navigator.onLine!==false}){
 let next=null,preparing=null,lastPrepareError=null,persistent=!!storage,jobs=[],writable=!!storage;const sending=new Map();
 try{
  const raw=storage?.getItem(ONLINE_PENDING_KEY);
  if(raw){const data=JSON.parse(raw),valid=j=>j?.session&&/^[0-9a-f-]{36}$/.test(j.session.id)&&/^[0-9a-f]{64}$/.test(j.session.capability)&&typeof j.nickname==='string'&&j.replay&&Number.isFinite(j.createdAt);
   if(data.version!==1||!Array.isArray(data.jobs)||data.jobs.length>20||!data.jobs.every(valid))throw Error();
   jobs=data.jobs.filter(j=>now()-j.createdAt<7*86400000).map(j=>({...j,status:['rejected','unavailable'].includes(j.status)?j.status:'pending'}));
  }
 }catch{persistent=false;writable=false;}

 function save(){if(writable)try{storage.setItem(ONLINE_PENDING_KEY,JSON.stringify({version:1,jobs:jobs.map(j=>({...j,error:j.error||null,status:['rejected','unavailable'].includes(j.status)?j.status:'pending'}))}));}catch{persistent=false;writable=false;}onChange();}
 async function request(path,{method='GET',body,capability,url=apiUrl,timeout=12000}={}){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
  try{const response=await fetcher(new URL(path.replace(/^\/+/,''),url.endsWith('/')?url:url+'/'),{method,headers:{...(body===undefined?{}:{'Content-Type':'application/json'}),...(apiKey?{apikey:apiKey,Authorization:'Bearer '+apiKey}:{}),...(capability?(apiKey?{'X-Run-Capability':capability}:{Authorization:'Bearer '+capability}):{})},body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'});const data=await response.json();if(!response.ok)throw new OnlineError(data.error||'network');return data;}
  catch(error){if(error instanceof OnlineError)throw error;throw new OnlineError('network');}finally{clearTimeout(timer);}
 }
 async function prepare(){
  if(!enabled||!connected()){lastPrepareError='network';onChange();return null;}
  if(preparing)return preparing;if(next&&next.localExpiresAt>now()+60000)return next;
  preparing=(async()=>{try{const value=await request('/sessions',{method:'POST',body:{ruleset}});if(value.ruleset!==ruleset||!Number.isInteger(value.seed)||!value.id||!value.capability)throw new OnlineError('ruleset_unavailable');next={...value,localExpiresAt:now()+value.expiresAt-(value.issuedAt||now())};lastPrepareError=null;return next;}catch(error){lastPrepareError=error?.code||'network';return null;}finally{preparing=null;onChange();}})();return preparing;
 }
 function takeSession(){const value=next&&next.localExpiresAt>now()+60000?next:null;next=null;void prepare();return value;}
 function remove(id){jobs=jobs.filter(j=>j.session.id!==id);save();}
 async function send(job){
  if(sending.has(job.session.id))return sending.get(job.session.id);
  const task=(async()=>{job.error=null;job.status='sending';onChange();
   try{
    let value=await request('/sessions/'+job.session.id,{method:'POST',capability:job.session.capability,body:{nickname:job.nickname,replay:job.replay}});
    if(!['accepted','rejected','unavailable'].includes(value.status)){
     job.status='verifying';onChange();const url=value.verifierUrl||localVerifier||(value.continue?apiUrl:null);
     if(!url)throw new OnlineError('verification_temporarily_unavailable');
     const deadline=now()+180000;let chunks=0;
     do{value=await request('/verify',{method:'POST',url,body:{sessionId:job.session.id,capability:job.session.capability},timeout:90000});job.progress=value.progress||0;onChange();chunks++;}while(value.continue&&now()<deadline&&chunks<600);
     if(value.continue)throw new OnlineError('verification_temporarily_unavailable');
    }
    job.status=value.status;job.entry=value.entry||null;
    if(value.status==='accepted'){remove(job.session.id);onAccepted(job.session.id,value.entry);return value;}
    job.error=value.error||(value.status==='rejected'?'verification_failed':'verification_temporarily_unavailable');save();return value;
   }catch(error){job.status='pending';job.error=error?.code||'network';save();throw error;}
   finally{sending.delete(job.session.id);onChange();}
  })();sending.set(job.session.id,task);return task;
 }
 async function submit(session,replay,nickname){
  if(!validNickname(nickname))throw new OnlineError('invalid_nickname');if(!session||!replay)throw new OnlineError('local_run');
  let job=jobs.find(j=>j.session.id===session.id);
  if(!job){if(jobs.length>=20)throw new OnlineError('pending_limit');job={session:{...session},replay:structuredClone(replay),nickname:normalName(nickname),createdAt:now(),status:'pending',error:null};jobs.push(job);save();}
  return send(job);
 }
 async function estimateRank(score){
  if(!Number.isSafeInteger(score)||score<0)throw new OnlineError('invalid_score');
  const first=await request('/scores?page=1');
  if(!first.entries.length)return {rank:1,snapshot:first.snapshot};
  const inspect=data=>data.entries.find(entry=>entry.score<score)?.rank;
  const top=inspect(first);if(top)return {rank:top,snapshot:first.snapshot};
  let low=2,high=first.pages,rank=first.total+1;
  while(low<=high){const page=Math.floor((low+high)/2),data=await request(`/scores?page=${page}&snapshot=${first.snapshot}`),found=inspect(data);
   if(found!==undefined){rank=found;high=page-1;}else low=page+1;
  }
  return {rank,snapshot:first.snapshot};
 }
 return {estimateRank,prepare,takeSession,submit,retry:job=>send(jobs.find(j=>j.session.id===job.session.id)||job),remove,list:(page=1,snapshot)=>request(`/scores?page=${page}${snapshot===undefined?'':'&snapshot='+snapshot}`),entry:id=>request('/scores/'+id),get pending(){return jobs.map(j=>({...j}));},get persistent(){return persistent;},get ready(){return !!next;},get prepareError(){return lastPrepareError;}};
}
export function onlineMessage(code){return ({
 invalid_nickname:'Use 3–12 letters or numbers. Spaces, - and _ are welcome.',
 network:'The ranking could not be reached. Check your connection and retry.',
 session_expired:'The submission window has expired. Your local score remains; start a new run to submit another result.',
 verification_failed:'This run could not be verified. Your local score remains. Try another run.',
 verification_unavailable:'Verification is unavailable for this attempt. Your local score remains.',
 verification_temporarily_unavailable:'Verification is not ready yet. Retry this result in a moment.',
 job_busy_or_unavailable:'This result is still being checked. Wait a moment, then retry.',
 verifier_busy:'The checker is busy. Retry this result in a moment.',
 submission_conflict:'This run was already submitted with different details. Retry its original pending entry below.',
 rate_limited:'Too many recent online attempts. Keep playing and try the ranking again in a few minutes.',
 ruleset_unavailable:'Online scores need a newer game version. Apply the update between runs.',
 pending_limit:'There are 20 pending results. Resolve or dismiss one below before adding another.',
 local_run:'This run began without an online session. Its score is local. Connect before starting the next attempt.',
 invalid_replay:'This attempt cannot be submitted. Its local score remains.',
 body_too_large:'This replay is too large for online verification. Its local score remains.',
 run_too_fast:'The run timing could not be confirmed. Wait a moment and retry the same result.',
 writes_paused:'Posting is paused for maintenance. Retry this result later; local play is available.',
 new_sessions_paused:'Online submissions are temporarily paused. You can keep playing.',
 })[code]||'The ranking is unavailable right now. Keep this window open and retry.';}
