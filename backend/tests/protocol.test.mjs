import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {nickname,replay,readJSON} from '../protocol.ts';
import {createRun} from '../rulesets/roadster-v341/run.js';
test('frozen verifier sources retain their published hashes',async()=>{
 const root=new URL('../rulesets/roadster-v341/',import.meta.url),manifest=JSON.parse(await readFile(new URL('manifest.json',root),'utf8'));
 for(const [file,sha] of Object.entries(manifest.files))assert.equal(createHash('sha256').update(await readFile(new URL(file,root))).digest('hex'),sha,file);
});
test('public nickname normalises benign input and excludes markup, controls and misleading direction',()=>{
 assert.equal(nickname('  ＰＩＬＯＴ   42 '),'PILOT 42');assert.equal(nickname('Мой ник'),'Мой ник');
 for(const value of ['A','1234567890123','<script>','PILOT\u202e','A\nB','A😀B',null])assert.throws(()=>nickname(value));
});
test('API canonical replay retains validated controls and ignores score claims',()=>{
 const run=createRun({seed:12});run.reset();while(run.S.mode==='playing')run.step();const value={...run.replay(),score:999999999},canonical=replay(value);
 assert.equal('score' in canonical,false);assert.notEqual(canonical.events,value.events);assert.throws(()=>replay({...value,events:[[value.ticks,0]]}));
});
test('JSON body bounds apply to streamed/chunked bytes before parsing',async()=>{
 let cancelled=false;const body=new ReadableStream({pull(controller){controller.enqueue(new Uint8Array(600));},cancel(){cancelled=true;}});
 const request=new Request('http://localhost',{method:'POST',headers:{'Content-Type':'application/json'},body,duplex:'half'});
 await assert.rejects(readJSON(request,1024),e=>e.code==='body_too_large');assert.equal(cancelled,true);
 await assert.rejects(readJSON(new Request('http://localhost',{method:'POST',body:'{}'})),e=>e.code==='json_required');
 await assert.rejects(readJSON(new Request('http://localhost',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'})),e=>e.code==='invalid_json');
});
