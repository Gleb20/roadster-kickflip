import {createJobStore} from './online-store.js?v=4.4.0';
export const ONLINE_PENDING_KEY='roadster-online-pending-v1';
export const ONLINE_CACHE_KEY='roadster-ranking-cache-v1';
export const validNickname=value=>typeof value==='string'&&[...value.normalize('NFKC').trim().replace(/ +/g,' ')].length>=3&&[...value.normalize('NFKC').trim().replace(/ +/g,' ')].length<=12&&/^[\p{L}\p{N} _-]+$/u.test(value.normalize('NFKC').trim().replace(/ +/g,' '));
const normalName=value=>value.normalize('NFKC').trim().replace(/ +/g,' ');
const finished=j=>['accepted','rejected'].includes(j.status);
const permanent=new Set(['invalid_replay','invalid_score','body_too_large','session_expired','session_mismatch','unauthorized','verification_failed','submission_conflict','not_found']);
export class OnlineError extends Error{constructor(code){super(code);this.code=code;}}
/** Local presentation only. The public table still contains server-verified rows. */
export function projectScore(data,entry){
 const base=data||{page:1,pages:1,total:0,entries:[]};if(!entry)return base;
 if(base.entries.some(e=>e.id===entry.id))return {...base,entries:base.entries.map(e=>e.id===entry.id?{...e,own:true}:e)};
 let rank=base.previewRank;
 if(!rank&&data){const first=base.entries[0],last=base.entries.at(-1),lower=base.entries.find(e=>e.score<entry.score);
  if(lower&&(base.page===1||entry.score<=first.score))rank=lower.rank;
  else if(base.page===base.pages&&(!first||entry.score<=first.score||base.page===1))rank=base.total+1;
 }
 const projected=base.entries.map(e=>({...e,rank:base.previewRank?e.rank:rank&&e.rank>=rank?e.rank+1:e.rank}));
 projected.push({...entry,rank:rank||null,own:true});projected.sort((a,b)=>(a.rank??Infinity)-(b.rank??Infinity));
 const page=base.previewRank?base.page:rank?Math.ceil(rank/10):base.page,total=base.total+(base.previewRank?0:1);
 return {...base,page,pages:Math.max(1,Math.ceil(total/10)),total,entries:projected.filter(e=>!rank||Math.ceil(e.rank/10)===page).slice(0,11)};
}
export function createOnline({apiUrl,apiKey=null,ruleset,storage,jobStore=createJobStore({storage}),fetcher=fetch,now=Date.now,enabled=true,connected=()=>typeof navigator==='undefined'||navigator.onLine!==false,onChange=()=>{},onAccepted=()=>{},onRejected=()=>{},autoStart=typeof window!=='undefined'}={}){
 let jobs=[],next=null,preparing=null,lastPrepareError=null,persistent=true,cache=null,timer=null,pumping=null,started=false,disposed=false;
 const submittedHere=new Set();
 try{const saved=JSON.parse(storage?.getItem(ONLINE_CACHE_KEY)||'null');if(saved?.version===1&&Array.isArray(saved.data?.entries))cache=saved.data;}catch{}
 const valid=j=>j?.session&&/^[0-9a-f-]{36}$/.test(j.session.id)&&/^[0-9a-f]{64}$/.test(j.session.capability)&&Number.isFinite(j.createdAt)&&typeof j.nickname==='string'&&(finished(j)||j.replay?.ruleset);
 const loaded=jobStore.list().then(values=>{if(!Array.isArray(values)||!values.every(valid))throw Error('Invalid outbox');jobs=values.map(j=>({...j,status:j.status==='unavailable'?'receipt':finished(j)?j.status:j.receipt?'receipt':'queued',nextAt:0,attempts:0}));onChange();}).catch(()=>{persistent=false;});
 function update(job){const i=jobs.findIndex(j=>j.session.id===job.session.id);if(i<0)jobs.push(job);else jobs[i]=job;}
 async function persist(job,insert=false){try{const saved=await jobStore.put(job,{insert});update(saved);return saved;}catch{persistent=false;throw new OnlineError('storage_unavailable');}}
 async function request(path,{method='GET',body,capability,timeout=12000}={}){
  const controller=new AbortController(),abort=setTimeout(()=>controller.abort(),timeout);
  try{const response=await fetcher(new URL(path.replace(/^\/+/,''),apiUrl.endsWith('/')?apiUrl:apiUrl+'/'),{method,headers:{...(body===undefined?{}:{'Content-Type':'application/json'}),...(apiKey?{apikey:apiKey,Authorization:'Bearer '+apiKey}:{}),...(capability?(apiKey?{'X-Run-Capability':capability}:{Authorization:'Bearer '+capability}):{})},body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'});const data=await response.json();if(!response.ok)throw new OnlineError(data.error||'network');return data;}
  catch(error){if(error instanceof OnlineError)throw error;throw new OnlineError('network');}finally{clearTimeout(abort);}
 }
 async function prepare(){
  if(!enabled||!connected()){lastPrepareError='network';onChange();return null;}
  if(preparing)return preparing;if(next&&next.localExpiresAt>now()+60000)return next;
  preparing=(async()=>{try{const value=await request('/sessions',{method:'POST',body:{ruleset}});if(value.ruleset!==ruleset||!Number.isInteger(value.seed)||!value.id||!value.capability)throw new OnlineError('ruleset_unavailable');next={...value,localExpiresAt:now()+value.expiresAt-(value.issuedAt||now())};lastPrepareError=null;return next;}catch(error){lastPrepareError=error?.code||'network';return null;}finally{preparing=null;onChange();}})();return preparing;
 }
 function takeSession(){const value=next&&next.localExpiresAt>now()+60000?next:null;next=null;void prepare();return value;}
 function schedule(){
  clearTimeout(timer);if(!started||disposed||!enabled||!persistent)return;
  const pending=jobs.filter(j=>!finished(j));if(!pending.length)return;
  timer=setTimeout(()=>void flush(),Math.max(1000,Math.min(60000,Math.min(...pending.map(j=>j.nextAt||0))-now())));timer?.unref?.();
 }
 async function deliver(job){
  const was=job.status;
  try{
   const value=await request('/sessions/'+job.session.id,{...(job.receipt?{}:{method:'POST',body:{nickname:job.nickname,replay:job.replay,...(Number.isSafeInteger(job.score)?{score:job.score}:{})}}),capability:job.session.capability});
   job.error=null;job.attempts=0;job.publicId=value.publicId||job.publicId;
   if(value.status==='accepted'){job.status='accepted';job.entry=value.entry;job.receipt=true;delete job.replay;}
   else if(value.status==='rejected'){job.status='rejected';job.error='verification_failed';delete job.replay;}
   else if(value.receipt){job.status='receipt';job.receipt=true;job.nextAt=now()+10000;}
   else{job.status='queued';job.nextAt=now()+10000;}
   await persist(job);
   if(job.status==='accepted'&&was!=='accepted')onAccepted(job.session.id,job.entry);
   if(job.status==='rejected'&&was!=='rejected')onRejected(job.session.id);
  }catch(error){
   job.error=error?.code||'network';
   if(permanent.has(job.error)){job.status='rejected';delete job.replay;onRejected(job.session.id);}
   else{job.attempts=(job.attempts||0)+1;job.nextAt=now()+Math.min(300000,2000*2**Math.min(job.attempts,8));}
   try{await persist(job);}catch{}
  }
  onChange();
 }
 async function flush(){
  if(pumping)return pumping;
  pumping=(async()=>{await loaded;if(!enabled||!persistent||!connected()||disposed)return;
   for(const job of [...jobs]){if(disposed||!connected())break;if(!finished(job)&&(!job.nextAt||job.nextAt<=now()))await deliver(job);}
  })();try{await pumping;}finally{pumping=null;schedule();}
 }
 function wake(){if(!next)void prepare();for(const j of jobs)if(!finished(j))j.nextAt=0;void flush();}
 function visibility(){if(globalThis.document?.visibilityState==='visible')wake();}
 function start(){if(started||disposed)return;started=true;globalThis.addEventListener?.('online',wake);globalThis.document?.addEventListener('visibilitychange',visibility);void loaded.then(()=>flush());}
 function dispose(){disposed=true;clearTimeout(timer);globalThis.removeEventListener?.('online',wake);globalThis.document?.removeEventListener('visibilitychange',visibility);}
 async function submit(session,replay,nickname,score){
  if(!validNickname(nickname))throw new OnlineError('invalid_nickname');if(!session||!replay)throw new OnlineError('local_run');
  if(!Number.isSafeInteger(score)||score<0||score>100000000)throw new OnlineError('invalid_score');
  await loaded;if(!persistent)throw new OnlineError('storage_unavailable');
  let job=jobs.find(j=>j.session.id===session.id);
  if(!job){if(jobs.filter(j=>!finished(j)).length>=20)throw new OnlineError('pending_limit');job=await persist({session:{...session},replay:structuredClone(replay),nickname:normalName(nickname),score,createdAt:now(),status:'queued',receipt:false,nextAt:0,attempts:0},true);}
  if(job.status!=='rejected')submittedHere.add(job.session.id);onChange();if(started)void flush();return job;
 }
 async function list(page=1,snapshot){const value=await request(`/scores?page=${page}${snapshot===undefined?'':'&snapshot='+snapshot}`);if(page===1){cache=value;try{storage?.setItem(ONLINE_CACHE_KEY,JSON.stringify({version:1,data:value}));}catch{}}return value;}
 async function estimateRank(score){if(!Number.isSafeInteger(score)||score<0)throw new OnlineError('invalid_score');const data=await preview(score);return {rank:data.previewRank,snapshot:data.snapshot};}
 const preview=(score,page)=>request('/preview?score='+score+(page?'&page='+page:''));
 function visible(){return jobs.filter(j=>Number.isSafeInteger(j.score)&&(j.status!=='rejected'||submittedHere.has(j.session.id))).map(j=>({...j.entry,id:j.entry?.id||j.publicId||j.session.id,sessionId:j.session.id,nickname:j.nickname,score:j.entry?.score??j.score,createdAt:j.createdAt,accepted:j.status==='accepted'}));}
 if(autoStart)start();
 return {prepare,takeSession,submit,flush,wake,start,dispose,loaded,list,preview,estimateRank,entry:id=>request('/scores/'+id),lookup:id=>jobs.find(j=>j.session.id===id),get entries(){return visible();},get cached(){return cache;},get pending(){return jobs.filter(j=>!finished(j)).map(j=>({...j}));},get persistent(){return persistent;},get ready(){return !!next;},get prepareError(){return lastPrepareError;}};
}
export function onlineMessage(code){return ({invalid_nickname:'Use 3–12 letters or numbers. Spaces, - and _ are welcome.',storage_unavailable:'This device could not save your score. Free some storage and try again.',pending_limit:'This device is full of saved scores. Connect to send them before adding another.',local_run:'Connect before starting a run to post it online.',invalid_score:'This score could not be saved.',network:'The leaderboard is unavailable right now.'})[code]||'The leaderboard is unavailable right now.';}
