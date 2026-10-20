import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../worker.ts';
test('cutover write freeze rejects writes while leaving reads routable',async()=>{
 const env={ACCEPTING_WRITES:'false',ACCEPTING_SESSIONS:'false',MIGRATION_PROXY_URL:'',ALLOWED_ORIGINS:'https://game.test',ENVIRONMENT:'fixture',SCORE_EPOCH:'v3'};
 const response=await handler.fetch(new Request('https://old.test/sessions',{method:'POST',headers:{Origin:'https://game.test'}}),env);
 assert.equal(response.status,503);assert.equal((await response.json()).error,'writes_paused');assert.equal((await handler.fetch(new Request('https://old.test/health'),env)).status,200);
});
test('old API cutover proxy preserves capabilities and cannot turn a path into another host',async()=>{
 const original=globalThis.fetch,seen=[];globalThis.fetch=async(request)=>{seen.push(request);return Response.json({environment:'production'},{headers:{'X-Request-ID':'target-request'}});};
 const env={MIGRATION_PROXY_URL:'https://new.test',ALLOWED_ORIGINS:'https://game.test'};
 try{const response=await handler.fetch(new Request('https://old.test//evil.test/path?x=1',{headers:{Authorization:'Bearer fixture-capability'}}),env);assert.equal(response.status,200);assert.equal(response.headers.get('X-Request-ID'),'target-request');assert.equal(new URL(seen[0].url).origin,'https://new.test');assert.equal(seen[0].headers.get('authorization'),'Bearer fixture-capability');assert.equal(seen[0].headers.get('X-Tesla-Migration-Hop'),'1');
  const loop=await handler.fetch(new Request('https://old.test/health',{headers:{'X-Tesla-Migration-Hop':'1'}}),env);assert.equal(loop.status,503);assert.equal(seen.length,1);
 }finally{globalThis.fetch=original;}
});
