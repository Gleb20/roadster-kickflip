import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {webcrypto} from 'node:crypto';

const root=new URL('../',import.meta.url),code=await readFile(new URL('sw.js',root),'utf8');
function harness(){
 const handlers=new Map(),buckets=new Map(),messages=[];let clients=[{id:'a',url:'https://game.test/roadster-kickflip/',postMessage:m=>messages.push(m)}],skips=0,network=true,tamper=false;
 const prefix='tesla-jump:/roadster-kickflip/:';
 for(const name of [prefix+'old-1',prefix+'old-2','another-app'])buckets.set(name,new Map());
 const storage={keys:async()=>[...buckets.keys()],delete:async name=>buckets.delete(name),open:async name=>{
  if(!buckets.has(name))buckets.set(name,new Map());const b=buckets.get(name);
  return {put:async(url,response)=>b.set(url,response.clone()),match:async request=>b.get(typeof request==='string'?request:request.url)?.clone()};
 }};
 const fetch=async request=>{
  if(!network)throw Error('offline');const url=new URL(typeof request==='string'?request:request.url);
  const file=url.pathname.replace('/roadster-kickflip/','');
  const bytes=await readFile(new URL(file,root));return new Response(tamper&&file==='style.css'?'wrong version':bytes);
 };
 const self={registration:{scope:'https://game.test/roadster-kickflip/'},clients:{claim:async()=>{},matchAll:async()=>clients},skipWaiting:async()=>{skips++;},addEventListener:(name,fn)=>handlers.set(name,fn)};
 vm.runInNewContext(code,{self,caches:storage,fetch,crypto:webcrypto,URL,Request,Response,Uint8Array,Promise,Error,Array});
 const run=async(name,extra={})=>{let pending;handlers.get(name)({waitUntil:p=>{pending=p;},respondWith:p=>{pending=p;},...extra});return await pending;};
 return {run,buckets,messages,get skips(){return skips;},set clients(value){clients=value;},set network(value){network=value;},set tamper(value){tamper=value;}};
}
test('offline installation verifies bytes and retains other applications',async()=>{
 const h=harness();await h.run('install');assert.equal(h.skips,0);const current=[...h.buckets.keys()].find(k=>k.endsWith(':3.4.1'));assert.ok(h.buckets.get(current).size>=40);
 await h.run('activate');assert.ok(h.buckets.has('another-app'));assert.ok(!h.buckets.has('tesla-jump:/roadster-kickflip/:old-1'));assert.ok(h.buckets.has('tesla-jump:/roadster-kickflip/:old-2'));
 h.network=false;const response=await h.run('fetch',{request:{url:'https://game.test/roadster-kickflip/?v=3.4.1',method:'GET',mode:'navigate'}});assert.match(await response.text(),/id="game"/);
 assert.equal(await h.run('fetch',{request:{url:'https://api.test/scores',method:'GET',mode:'cors'}}),undefined);
 assert.equal(await h.run('fetch',{request:{url:'https://game.test/roadster-kickflip/scores',method:'POST',mode:'cors'}}),undefined);
});
test('an incomplete or mixed-version install cannot replace a working offline copy',async()=>{
 const h=harness();h.tamper=true;await assert.rejects(h.run('install'),/incomplete/);assert.ok(h.buckets.has('tesla-jump:/roadster-kickflip/:old-2'));assert.ok(h.buckets.has('another-app'));assert.equal([...h.buckets.keys()].some(k=>k.endsWith(':3.4.1')),false);assert.equal(h.skips,0);
});
test('explicit activation is limited to a safe single window',async()=>{
 const h=harness(),source={id:'a',postMessage:m=>h.messages.push(m)};
 h.clients=[{id:'a',url:'https://game.test/roadster-kickflip/'},{id:'b',url:'https://game.test/roadster-kickflip/'}];
 await h.run('message',{data:{type:'APPLY_UPDATE',safe:true},source});assert.equal(h.skips,0);assert.equal(h.messages.at(-1).type,'UPDATE_BLOCKED');
 h.clients=[{id:'a',url:'https://game.test/roadster-kickflip/'}];await h.run('message',{data:{type:'APPLY_UPDATE',safe:false},source});assert.equal(h.skips,0);
 await h.run('message',{data:{type:'APPLY_UPDATE',safe:true},source});assert.equal(h.skips,1);
});
