import test from 'node:test';
import assert from 'node:assert/strict';
import {createScoreRecord,SCORE_RECORD_KEY} from '../src/score-record.js';
const ruleset='roadster-v3.4.2',memory=()=>{const m=new Map();return {getItem:k=>m.get(k),setItem:(k,v)=>m.set(k,v)};};
const attempt=(score=400,id='00000000-0000-4000-8000-000000000001')=>({score,session:{id,capability:'a'.repeat(64),ruleset,localExpiresAt:1000},replay:{format:1,ruleset,seed:1,ticks:100,events:[]},entry:null});
const create=(storage,now=()=>100)=>createScoreRecord({storage,ruleset,now});
test('finished best can be posted after reload; accepted identity survives expired capability',()=>{
 const storage=memory(),a=attempt(),record=create(storage);record.keep(a,400);
 const reload=create(storage);assert.equal(reload.canPost(reload.matching(400)),true);assert.equal(reload.matching(500),null);
 const entry={id:'public-best',score:400,nickname:'PILOT'};reload.accepted(a.session.id,entry);
 const expired=create(storage,()=>2000);assert.equal(expired.canPost(expired.matching(400)),false);assert.deepEqual(expired.matching(400).entry,entry);
});
test('late acceptance of an older run cannot mark the new best as posted',()=>{
 const r=create(memory()),old=attempt(),next=attempt(800,'00000000-0000-4000-8000-000000000002');r.keep(old,400);r.keep(next,800);
 r.accepted(old.session.id,{id:'old',score:400});assert.equal(r.matching(800).entry,null);
 r.accepted(next.session.id,{id:'wrong-score',score:900});assert.equal(r.matching(800).entry,null);
 r.keep(old,800);assert.equal(r.matching(800).session.id,next.session.id);
});
test('an unrecorded local best never inherits the rank of an earlier posted score; ties preserve a posted best',()=>{
 const r=create(memory()),a=attempt();r.keep(a,400);r.accepted(a.session.id,{id:'posted',score:400});r.keep(attempt(400,'00000000-0000-4000-8000-000000000002'),400);assert.equal(r.matching(400).entry.id,'posted');
 r.keep({score:900,session:null,replay:null,entry:null},900);assert.equal(r.matching(900).entry,null);assert.equal(r.canPost(r.matching(900)),false);
});
test('expired replay is displayed honestly and a tied fresh connected run can replace it',()=>{
 const storage=memory(),r=create(storage);r.keep(attempt(),400);const later=create(storage,()=>2000);assert.equal(later.canPost(later.matching(400)),false);
 const fresh=attempt();fresh.session.localExpiresAt=4000;later.keep(fresh,400);assert.equal(later.canPost(later.matching(400)),true);
});
test('corrupt or newer saves are preserved; blocked storage still retains current-window best',()=>{
 for(const raw of ['bad',JSON.stringify({version:2,result:attempt()})]){const storage=memory();storage.setItem(SCORE_RECORD_KEY,raw);const r=create(storage);r.keep(attempt(),400);assert.equal(r.persistent,false);assert.equal(r.canPost(r.matching(400)),true);assert.equal(storage.getItem(SCORE_RECORD_KEY),raw);}
 const r=create({getItem(){throw Error();},setItem(){throw Error();}});r.keep(attempt(),400);assert.equal(r.persistent,false);assert.equal(r.matching(400).score,400);
});

test('gameplay upgrade preserves old finished best and can store a new-version record afterwards',()=>{
 const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)},now=()=>100;
 const old={score:123,session:{id:'00000000-0000-4000-8000-000000000001',capability:'a'.repeat(64),ruleset:'roadster-v3.4.2',localExpiresAt:1000},replay:{ruleset:'roadster-v3.4.2',ticks:100,events:[]}};
 createScoreRecord({storage,ruleset:'roadster-v3.4.2',now}).keep(old,123);
 const next=createScoreRecord({storage,ruleset:'roadster-v3.8.0',compatibleRulesets:['roadster-v3.4.2','roadster-v3.8.0'],now});assert.equal(next.persistent,true);assert.equal(next.canPost(next.matching(123)),true);assert.deepEqual(next.matching(123),old);
 const current={...old,score:150,session:{...old.session,ruleset:'roadster-v3.8.0'},replay:{...old.replay,ruleset:'roadster-v3.8.0'}};next.keep(current,150);assert.deepEqual(next.matching(150),current);assert.equal(createScoreRecord({storage,ruleset:'roadster-v3.8.0',now}).matching(150).score,150);
});

test('rejected best cannot be resubmitted after reload and a new equal run can replace it',()=>{
 const storage=memory(),r=create(storage),a=attempt();r.keep(a,400);r.rejected(a.session.id);
 const reload=create(storage);assert.equal(reload.canPost(reload.matching(400)),false);
 const fresh=attempt(400,'00000000-0000-4000-8000-000000000002');reload.keep(fresh,400);assert.equal(reload.canPost(reload.matching(400)),true);assert.equal(reload.matching(400).session.id,fresh.session.id);
});
