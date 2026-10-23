import test from 'node:test';import assert from 'node:assert/strict';
import {createJobStore} from '../src/online-store.js';
import {createOnline,ONLINE_PENDING_KEY,ONLINE_CACHE_KEY,validNickname,projectScore} from '../src/online.js';
const session={id:'00000000-0000-4000-8000-000000000001',capability:'a'.repeat(64),ruleset:'roadster-v4.1.0',seed:1,expiresAt:1000000,issuedAt:1000};
const replay={format:1,ruleset:session.ruleset,seed:1,ticks:500,events:[]};
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};};
const make=options=>createOnline({apiUrl:'https://api.test/functions/v1/ranking/',ruleset:session.ruleset,storage:memory(),now:()=>1000,autoStart:false,...options});
test('preparation never posts a score and consumes each session once',async()=>{
 const calls=[],c=make({fetcher:async(url,o)=>{calls.push({url,o});return Response.json(session);}});await Promise.all([c.prepare(),c.prepare()]);assert.equal(calls.length,1);assert.equal(c.takeSession().id,session.id);assert.equal(c.takeSession(),null);await c.prepare();assert.ok(calls.every(c=>c.url.pathname.endsWith('/sessions')));assert.equal(c.pending.length,0);
});
test('submit durably saves and shows the score before any network call completes',async()=>{
 let calls=0;const c=make({fetcher:async()=>{calls++;throw Error('offline');}});await c.submit(session,replay,'PILOT',400);assert.equal(calls,0);assert.equal(c.entries[0].score,400);await c.flush();assert.equal(calls,1);assert.equal(c.entries[0].score,400);assert.equal(c.pending.length,1);
});
test('offline queue survives reload and sends automatically on the next connection',async()=>{
 const storage=memory();let connected=false,calls=0;const first=make({storage,connected:()=>connected,fetcher:async()=>{calls++;throw Error();}});await first.submit(session,replay,'PILOT',400);await first.flush();assert.equal(calls,0);
 const loaded=make({storage,connected:()=>connected,fetcher:async()=>{calls++;return Response.json({status:'pending',receipt:true,background:true,publicId:'public'});}});await loaded.loaded;assert.equal(loaded.entries[0].score,400);connected=true;await loaded.flush();assert.equal(calls,1);assert.equal(loaded.lookup(session.id).receipt,true);
});
test('receipt ends upload; later recovery reads status without uploading replay or calling verify',async()=>{
 const storage=memory(),paths=[];let time=1000;const c=make({storage,now:()=>time,fetcher:async(url,o)=>{paths.push([url.pathname,o.method]);return Response.json(o.method==='POST'?{status:'pending',receipt:true,publicId:'public'}:{status:'accepted',entry:{id:'public',score:400}});}});
 await c.submit(session,replay,'PILOT',400);await c.flush();time+=11000;await c.flush();assert.deepEqual(paths.map(x=>x[1]),['POST','GET']);assert.ok(paths.every(x=>!x[0].endsWith('/verify')));assert.equal(c.pending.length,0);assert.equal(c.entries.length,1);assert.equal(c.entries[0].id,'public');assert.equal(c.lookup(session.id).replay,undefined);
});
test('ambiguous upload repeats original identity, nickname and replay, deduplicating in flight',async()=>{
 let time=1000,calls=0;const bodies=[];const c=make({now:()=>time,fetcher:async(url,o)=>{bodies.push(JSON.parse(o.body));if(++calls===1)throw Error('lost response');return Response.json({status:'accepted',entry:{id:'one',score:400}});}});
 await c.submit(session,replay,'PILOT',400);await Promise.all([c.flush(),c.flush()]);await c.submit(session,replay,'OTHER',999);time+=10000;await c.flush();assert.equal(calls,2);assert.deepEqual(bodies[0],bodies[1]);assert.equal(bodies[1].nickname,'PILOT');assert.equal(bodies[1].score,400);
});
test('rejected row remains for the submitting page, disappears silently after reload and is never resubmitted',async()=>{
 const storage=memory(),rejections=[];let calls=0;const c=make({storage,onRejected:id=>rejections.push(id),fetcher:async()=>{calls++;return Response.json({status:'rejected',receipt:true,error:'verification_failed'});}});await c.submit(session,replay,'PILOT',999);await c.flush();assert.equal(c.entries.length,1);assert.deepEqual(rejections,[session.id]);
 const loaded=make({storage,fetcher:async()=>{calls++;throw Error();}});await loaded.loaded;assert.equal(loaded.entries.length,0);await loaded.flush();assert.equal(calls,1);assert.equal(loaded.pending.length,0);
});
test('rejection learned after reload removes an old overlay, while transient errors preserve it',async()=>{
 const storage=memory(),c=make({storage});await c.submit(session,replay,'PILOT',400);
 const loaded=make({storage,fetcher:async()=>Response.json({status:'rejected',receipt:true})});await loaded.loaded;assert.equal(loaded.entries.length,1);await loaded.flush();assert.equal(loaded.entries.length,0);
 const temp=make({fetcher:async()=>Response.json({error:'service_unavailable'},{status:503})});await temp.submit(session,replay,'PILOT',400);await temp.flush();assert.equal(temp.entries.length,1);assert.notEqual(temp.lookup(session.id).status,'rejected');
});
test('unavailable or corrupt persistence never claims a saved score or overwrites unknown records',async()=>{
 const blocked={getItem(){return null;},setItem(){throw Error('quota');}},c=make({storage:blocked});await assert.rejects(c.submit(session,replay,'PILOT',400),e=>e.code==='storage_unavailable');assert.equal(c.entries.length,0);
 const storage=memory();storage.setItem(ONLINE_PENDING_KEY,'{broken');const bad=make({storage});await assert.rejects(bad.submit(session,replay,'PILOT',400),e=>e.code==='storage_unavailable');assert.equal(storage.getItem(ONLINE_PENDING_KEY),'{broken');
});
test('legacy pending packets migrate without changing replay or losing terminal rejection',async()=>{
 const storage=memory();storage.setItem(ONLINE_PENDING_KEY,JSON.stringify({version:1,jobs:[{session,replay,nickname:'LEGACY',createdAt:10,status:'pending'}]}));let sent;const c=make({storage,fetcher:async(url,o)=>{sent=JSON.parse(o.body);return Response.json({status:'pending',receipt:true});}});await c.loaded;assert.equal(c.pending.length,1);await c.flush();assert.deepEqual(sent.replay,replay);assert.equal(sent.score,undefined);assert.ok(storage.getItem(ONLINE_PENDING_KEY));
});
test('cached ranking survives restart; preview adds the row with stable tie order and never duplicates confirmed ID',async()=>{
 const data={page:1,pages:1,total:2,snapshot:2,entries:[{id:'a',rank:1,score:500},{id:'b',rank:2,score:400}]};const storage=memory();storage.setItem(ONLINE_CACHE_KEY,JSON.stringify({version:1,data}));const c=make({storage});assert.deepEqual(c.cached,data);
 const p=projectScore(data,{id:'own',score:400});assert.deepEqual(p.entries.map(e=>e.rank),[1,2,3]);assert.equal(p.entries[2].own,true);assert.equal(projectScore(data,{id:'b',score:400}).entries.length,2);
 const unknown=projectScore(null,{id:'own',score:400});assert.equal(unknown.entries[0].rank,null);
});
test('preview pages contain exactly the server-ranked insertion and adjacent pages omit it',()=>{
 const own={id:'own',score:400},base={page:2,pages:3,total:21,previewRank:15,entries:[{id:'a',rank:14,score:500},{id:'b',rank:16,score:300}]};assert.deepEqual(projectScore(base,own).entries.map(e=>e.rank),[14,15,16]);assert.equal(projectScore({...base,page:3,entries:[{id:'z',rank:21,score:1}]},own).entries.length,1);
});
test('gateway key and run capability remain separate; field validation retains the public contract',async()=>{
 const c=make({apiKey:'sb_publishable_fixture',fetcher:async(url,o)=>{assert.equal(o.headers.apikey,'sb_publishable_fixture');assert.equal(o.headers.Authorization,'Bearer sb_publishable_fixture');assert.equal(o.headers['X-Run-Capability'],session.capability);return Response.json({status:'accepted',entry:{id:'one',score:400}});}});await c.submit(session,replay,'PILOT',400);await c.flush();
 for(const name of ['PILOT','  Мой   ник  ','ＰＩＬＯＴ'])assert.equal(validNickname(name),true);for(const name of ['A','<B>','AAAAAAAAAAAAA','X\u202eY'])assert.equal(validNickname(name),false);await assert.rejects(c.submit(session,replay,'PILOT',-1),e=>e.code==='invalid_score');
});

test('IndexedDB failure cannot split the durable queue into an invisible fallback store',async()=>{
 const storage=memory(),indexedDB={open(){const request={error:Error('blocked')};queueMicrotask(()=>request.onerror());return request;}};
 const client=make({storage,jobStore:createJobStore({storage,indexedDB})});await assert.rejects(client.submit(session,replay,'PILOT',400),e=>e.code==='storage_unavailable');assert.equal(storage.getItem('roadster-online-outbox-v2'),undefined);
});
