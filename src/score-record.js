/** One finished personal best, retained for an explicit later submission. */
export const SCORE_RECORD_KEY='roadster-score-record-v1';
export function createScoreRecord({storage,ruleset,now=Date.now}){
 let result=null,persistent=!!storage,writable=!!storage;
 const valid=r=>r&&Number.isSafeInteger(r.score)&&r.score>=0&&(!r.entry||(typeof r.entry.id==='string'&&r.entry.score===r.score))&&(!r.session||(
  /^[0-9a-f-]{36}$/.test(r.session.id)&&/^[0-9a-f]{64}$/.test(r.session.capability)&&Number.isFinite(r.session.localExpiresAt)&&
  r.session.ruleset===ruleset&&r.replay?.ruleset===ruleset&&Number.isSafeInteger(r.replay.ticks)&&Array.isArray(r.replay.events)));
 try{const raw=storage?.getItem(SCORE_RECORD_KEY);if(raw){const data=JSON.parse(raw);if(data.version!==1||!valid(data.result))throw Error();result=data.result;}}
 catch{persistent=false;writable=false;}
 function save(){if(writable)try{storage.setItem(SCORE_RECORD_KEY,JSON.stringify({version:1,result}));}catch{persistent=false;writable=false;}}
 return {
  matching(score){return result?.score===score?result:null;},
  keep(attempt,best){
   if(attempt.score!==best||!valid(attempt))return;
   if(result?.score===best&&(result.entry||result.session&&result.replay&&result.session.localExpiresAt>now()))return;
   result=structuredClone(attempt);save();
  },
  accepted(id,entry){if(result?.session?.id!==id||entry?.score!==result.score)return;result.entry=entry;save();},
  canPost(attempt){return !!(attempt?.session&&attempt.replay&&!attempt.entry&&attempt.session.localExpiresAt>now());},
  get persistent(){return persistent;},
 };
}
