// Encounter progress is local and independent of the current run/score.
export const COLLECTION_KEY='roadster-collection-v1';
export function createCollection(storage,ids,now=Date.now){
 const known=new Set(ids),entries=Object.create(null);let persistent=!!storage,writable=!!storage;
 try{
  const raw=storage?.getItem(COLLECTION_KEY);
  if(raw){
   const saved=JSON.parse(raw);
   if(saved?.version!==1||!saved.entries||typeof saved.entries!=='object')throw Error('Unsupported collection data');
   for(const [id,value] of Object.entries(saved.entries)){
    if(!/^[a-zA-Z0-9_-]{1,80}$/.test(id)||!value||!Number.isFinite(value.firstEncounteredAt))continue;
    entries[id]={firstEncounteredAt:value.firstEncounteredAt,firstViewedAt:Number.isFinite(value.firstViewedAt)?value.firstViewedAt:null};
   }
  }
 }catch{persistent=false;writable=false;}
 let migrated=false;if(known.has('homelessRow')&&entries.simpsonsCouch&&!entries.homelessRow){entries.homelessRow={...entries.simpsonsCouch};migrated=true;}
 function save(){if(!writable)return;try{storage.setItem(COLLECTION_KEY,JSON.stringify({version:1,entries}));}catch{persistent=false;writable=false;}}
 if(migrated)save();
 return {
  get persistent(){return persistent;},
  state(id){return !known.has(id)||!entries[id]?'locked':entries[id].firstViewedAt===null?'new':'viewed';},
  discover(id){if(!known.has(id)||entries[id])return false;entries[id]={firstEncounteredAt:now(),firstViewedAt:null};save();return true;},
  view(id){if(!known.has(id)||!entries[id]||entries[id].firstViewedAt!==null)return false;entries[id].firstViewedAt=now();save();return true;},
  snapshot(){return JSON.parse(JSON.stringify({version:1,entries}));},
 };
}
