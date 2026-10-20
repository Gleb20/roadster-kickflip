import test from 'node:test';
import assert from 'node:assert/strict';
import {createOnline,ONLINE_PENDING_KEY,validNickname} from '../src/online.js';
const session={id:'00000000-0000-4000-8000-000000000001',capability:'a'.repeat(64),ruleset:'roadster-v3.4.1',seed:1,expiresAt:1000000,issuedAt:1000},record={format:1,ruleset:session.ruleset,seed:1,ticks:500,events:[]};
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v),data};};
test('ranking preparation never posts a score and consumes each issued session once',async()=>{
 const calls=[],client=createOnline({apiUrl:'https://api.test',ruleset:session.ruleset,storage:memory(),now:()=>1000,fetcher:async(url,options)=>{calls.push({url:String(url),options});return Response.json(session);}});
 await Promise.all([client.prepare(),client.prepare()]);assert.equal(calls.length,1);assert.equal(client.takeSession().id,session.id);assert.equal(client.takeSession(),null);await client.prepare();assert.ok(calls.every(c=>new URL(c.url).pathname==='/sessions'));assert.equal(client.pending.length,0);
});
test('only explicit submission creates a retry; reload never posts it automatically',async()=>{
 const storage=memory();let calls=0;
 const client=createOnline({apiUrl:'https://api.test',ruleset:session.ruleset,storage,now:()=>1000,fetcher:async()=>{calls++;throw Error('offline');}});
 await assert.rejects(client.submit(session,record,'PILOT 1'),e=>e.code==='network');assert.equal(calls,1);assert.equal(client.pending.length,1);
 const saved=JSON.parse(storage.getItem(ONLINE_PENDING_KEY));assert.equal(saved.jobs[0].nickname,'PILOT 1');
 const loaded=createOnline({apiUrl:'https://api.test',ruleset:session.ruleset,storage,now:()=>2000,fetcher:async()=>{calls++;return Response.json({status:'accepted',entry:{id:'public',score:70}});}});
 assert.equal(calls,1);await loaded.retry(loaded.pending[0]);assert.equal(calls,2);assert.equal(loaded.pending.length,0);assert.equal(JSON.parse(storage.getItem(ONLINE_PENDING_KEY)).jobs.length,0);
});
test('retries reuse the same nickname/replay after an ambiguous response and deduplicate in flight',async()=>{
 let resolve,calls=0;const gate=new Promise(r=>resolve=r),payloads=[];const client=createOnline({apiUrl:'https://api.test',ruleset:session.ruleset,storage:memory(),now:()=>1000,fetcher:async(url,options)=>{calls++;payloads.push(JSON.parse(options.body));await gate;return Response.json({status:'accepted',entry:{id:'one',score:70}});}});
 const a=client.submit(session,record,'PILOT ONE'),b=client.submit(session,record,'OTHER NAME');resolve();assert.equal((await a).entry.id,(await b).entry.id);assert.equal(calls,1);assert.equal(payloads[0].nickname,'PILOT ONE');assert.deepEqual(payloads[0].replay,record);
});
test('unknown/corrupt storage is preserved and blocked storage remains a working in-memory retry',async()=>{
 for(const raw of ['{broken',JSON.stringify({version:2,jobs:[]})]){const storage=memory();storage.setItem(ONLINE_PENDING_KEY,raw);const c=createOnline({apiUrl:'https://api.test',ruleset:session.ruleset,storage,now:()=>1000,fetcher:async()=>{throw Error();}});await assert.rejects(c.submit(session,record,'PILOT'));assert.equal(c.persistent,false);assert.equal(c.pending.length,1);assert.equal(storage.getItem(ONLINE_PENDING_KEY),raw);}
 const c=createOnline({apiUrl:'https://api.test',ruleset:session.ruleset,storage:{getItem(){throw Error();},setItem(){throw Error();}},fetcher:async()=>{throw Error();}});await assert.rejects(c.submit(session,record,'PILOT'));assert.equal(c.pending.length,1);
});
test('offline preparation is silent and nickname validation matches the public contract',async()=>{
 let calls=0;const c=createOnline({apiUrl:'https://api.test',ruleset:session.ruleset,connected:()=>false,fetcher:async()=>{calls++;}});assert.equal(await c.prepare(),null);assert.equal(c.takeSession(),null);assert.equal(calls,0);
 for(const name of ['PILOT','  Мой   ник  ','ＰＩＬＯＴ'])assert.equal(validNickname(name),true);for(const name of ['A','<B>','AAAAAAAAAAAAA','X\u202eY'])assert.equal(validNickname(name),false);
});
test('terminal verification failures remain terminal after reload and keep local retry history truthful',async()=>{
 const storage=memory(),client=createOnline({apiUrl:'https://api.test',ruleset:session.ruleset,storage,now:()=>1000,fetcher:async()=>Response.json({status:'rejected',error:'verification_failed'})});
 await client.submit(session,record,'PILOT');assert.equal(client.pending[0].status,'rejected');
 const loaded=createOnline({apiUrl:'https://api.test',ruleset:session.ruleset,storage,now:()=>2000});assert.equal(loaded.pending[0].status,'rejected');assert.equal(loaded.pending[0].error,'verification_failed');
 loaded.remove(session.id);assert.equal(loaded.pending.length,0);
});
test('Supabase nested API path and chunk continuation survive a transient network loss',async()=>{
 const storage=memory(),paths=[];let chunk=0,fail=true;
 const fetcher=async(url,options)=>{paths.push(url.pathname);if(url.pathname.endsWith('/sessions/'+session.id))return Response.json({status:'pending',verifierUrl:'https://api.test/functions/v1/ranking/'});if(url.pathname.endsWith('/verify')){chunk++;if(fail&&chunk===2)throw Error('offline');return Response.json(chunk<3?{status:'pending',continue:true,progress:1200}:{status:'accepted',entry:{id:'verified'}});}throw Error('Unexpected path');};
 const client=createOnline({apiUrl:'https://api.test/functions/v1/ranking/',ruleset:session.ruleset,storage,fetcher,now:()=>1000});await assert.rejects(client.submit(session,record,'PILOT'),e=>e.code==='network');assert.equal(client.pending.length,1);assert.equal(chunk,2);fail=false;
 const result=await client.retry(client.pending[0]);assert.equal(result.entry.id,'verified');assert.equal(client.pending.length,0);assert.ok(paths.every(p=>p.startsWith('/functions/v1/ranking/')));
});
test('Supabase gateway key and per-run capability use separate headers',async()=>{
 const c=createOnline({apiUrl:'https://api.test/functions/v1/ranking/',apiKey:'sb_publishable_fixture',ruleset:session.ruleset,storage:memory(),fetcher:async(url,o)=>{assert.equal(o.headers.apikey,'sb_publishable_fixture');assert.equal(o.headers.Authorization,'Bearer sb_publishable_fixture');assert.equal(o.headers['X-Run-Capability'],session.capability);return Response.json({status:'accepted',entry:{id:'one'}});}});assert.equal((await c.submit(session,record,'PILOT')).entry.id,'one');
});
test('chunked service uses the configured HTTPS endpoint when no verifier URL is returned',async()=>{
 const paths=[];const c=createOnline({apiUrl:'https://api.test/functions/v1/ranking/',ruleset:session.ruleset,storage:memory(),fetcher:async(url)=>{paths.push(String(url));return Response.json(url.pathname.endsWith('/verify')?{status:'accepted',entry:{id:'final'}}:{status:'pending',continue:true,verifierUrl:null});}});assert.equal((await c.submit(session,record,'PILOT')).entry.id,'final');assert.equal(paths[1],'https://api.test/functions/v1/ranking/verify');
});
test('accepted callback persists an explicitly retried score independently of dialog state',async()=>{
 const accepted=[],client=createOnline({apiUrl:'https://api.test',ruleset:session.ruleset,storage:memory(),now:()=>1000,onAccepted:(id,entry)=>accepted.push({id,entry}),fetcher:async()=>Response.json({status:'accepted',entry:{id:'public-best',score:400}})});
 await client.submit(session,record,'PILOT');assert.deepEqual(accepted,[{id:session.id,entry:{id:'public-best',score:400}}]);
});
