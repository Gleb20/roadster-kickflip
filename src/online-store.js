const KEY='roadster-online-outbox-v2',LEGACY='roadster-online-pending-v1';
const terminal=j=>['accepted','rejected'].includes(j?.status);
const merge=(old,next)=>terminal(old)&&!terminal(next)?old:next;
/** Per-run IndexedDB writes prevent two tabs from replacing each other's outbox. */
export function createJobStore({storage,indexedDB=globalThis.indexedDB}={}){
 let database;
 const legacy=()=>{const raw=storage?.getItem(LEGACY);if(!raw)return [];const d=JSON.parse(raw);if(d.version!==1||!Array.isArray(d.jobs))throw Error('Unknown legacy outbox');return d.jobs;};
 const fallback={
  async list(){const raw=storage?.getItem(KEY);if(!raw)return legacy();const d=JSON.parse(raw);if(d.version!==2||!Array.isArray(d.jobs))throw Error('Unknown outbox');return d.jobs;},
  async put(job,{insert=false}={}){
   if(!storage)throw Error('Storage unavailable');
   const raw=storage.getItem(KEY),d=raw?JSON.parse(raw):{version:2,jobs:legacy()};if(d.version!==2||!Array.isArray(d.jobs))throw Error('Unknown outbox');
   const at=d.jobs.findIndex(j=>j.session.id===job.session.id),old=d.jobs[at],value=old&&insert?old:merge(old,job);
   if(at<0)d.jobs.push(value);else d.jobs[at]=value;storage.setItem(KEY,JSON.stringify(d));return structuredClone(value);
  }
 };
 async function open(){
  if(!indexedDB)return null;
  if(!database)database=new Promise((resolve,reject)=>{const r=indexedDB.open('tesla-ranking-outbox',1);r.onupgradeneeded=()=>{r.result.createObjectStore('jobs',{keyPath:'session.id'});r.result.createObjectStore('meta');};r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('Storage blocked'));r.onsuccess=()=>resolve(r.result);});
  return database;
 }
 async function tx(mode,action){
  const db=await open();if(!db)return null;
  return new Promise((resolve,reject)=>{const t=db.transaction(['jobs','meta'],mode);let result;t.oncomplete=()=>resolve(result);t.onerror=t.onabort=()=>reject(t.error||Error('Storage failed'));action(t, value=>{result=value;});});
 }
 return {
  async list(){
   if(!await open())return fallback.list();
   const imported=await tx('readonly',(t,done)=>{const r=t.objectStore('meta').get('legacyImported');r.onsuccess=()=>done(r.result);});
   const old=imported?[]:await fallback.list();
   return tx('readwrite',(t,done)=>{const jobs=t.objectStore('jobs'),meta=t.objectStore('meta'),mark=meta.get('legacyImported');mark.onsuccess=()=>{
    const read=()=>{const all=jobs.getAll();all.onsuccess=()=>done(all.result);};
    if(!mark.result&&old.length){let remaining=old.length;for(const job of old){const get=jobs.get(job.session.id);get.onsuccess=()=>{if(!get.result)jobs.put(job);if(--remaining===0)read();};}meta.put(true,'legacyImported');}
    else{meta.put(true,'legacyImported');read();}
   };});
  },
  async put(job,{insert=false}={}){
   if(!await open())return fallback.put(job,{insert});
   return tx('readwrite',(t,done)=>{const store=t.objectStore('jobs'),get=store.get(job.session.id);get.onsuccess=()=>{const value=get.result&&insert?get.result:merge(get.result,job);store.put(value);done(structuredClone(value));};});
  }
 };
}
