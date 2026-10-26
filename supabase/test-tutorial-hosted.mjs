// Owned fixtures are isolated before submission, never written to the public epoch.
import assert from 'node:assert/strict';import {readFile,writeFile,readdir,mkdir} from 'node:fs/promises';
import {ONLINE_API,ONLINE_PUBLIC_KEY} from '../src/online-config.js';import {ruleset} from './rulesets.mjs';import {tutorialInput} from '../scripts/tutorial-fixture.mjs';
const privatePath='/tmp/tesla-v4110-hosted-private.json',out=new URL('../docs/verification/2026-10-26-tj003-v4110/',import.meta.url);await mkdir(out,{recursive:true});
const request=async(path,body,cap)=>{const r=await fetch(ONLINE_API+path,{method:body?'POST':'GET',headers:{Origin:'https://gleb20.github.io',apikey:ONLINE_PUBLIC_KEY,'Content-Type':'application/json',...(cap?{'X-Run-Capability':cap}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(60000)});return {status:r.status,body:await r.json()}};
if(process.argv[2]==='prepare'){
 const versions=[];for(const folder of await readdir(new URL('./rulesets/',import.meta.url))){try{const manifest=JSON.parse(await readFile(new URL('./rulesets/'+folder+'/manifest.json',import.meta.url)));versions.push(manifest.ruleset)}catch{}}
 const cases=versions.map(v=>[v,'valid']).concat(['valid-tutorial','valid-skip','valid-retry','fake-score','fake-end'].map(k=>['roadster-v4.11.0',k])),all=[];
 for(const [version,kind] of cases){const response=await request('sessions',{ruleset:version});assert.equal(response.status,201,version+': '+JSON.stringify(response.body));const session=response.body,m=ruleset(version),r=m.createRun({seed:session.seed});r.reset(session.seed,{tutorial:kind.includes('tutorial')||kind.includes('skip')||kind.includes('retry')||kind.startsWith('fake')});
  while(r.S.mode==='playing'){
   if(kind==='valid-skip'&&r.S.tick===300)r.command('tutorial-skip');
   if(r.T?.active&&kind!=='valid-skip'&&!(kind==='valid-retry'&&r.S.tick<600))tutorialInput(r);
   r.drainEvents();r.step();r.drainEvents();assert.ok(r.S.tick<24000,'fixture bounded');
  }
  const replay=r.replay(),expected=m.verifyReplay(replay);all.push({session,replay,expected,kind});
 }
 await writeFile(privatePath,JSON.stringify(all),{mode:0o600});const meta=all.map(x=>({id:x.session.id,ruleset:x.session.ruleset,kind:x.kind,expected:x.expected}));await writeFile(new URL('hosted-fixtures.json',out),JSON.stringify(meta,null,2));
 let sql='begin;\n';for(const x of all)sql+=`update tesla_ranking.sessions set score_epoch='qa-v4110-20261026',created_at=least(created_at,floor(extract(epoch from clock_timestamp())*1000)-${Math.ceil(x.replay.ticks*1000/120)+1000}) where id='${x.session.id}' and status='ready' and payload_hash is null;\n`;
 sql+='select score_epoch,count(*) fixtures from tesla_ranking.sessions where id in ('+all.map(x=>"'"+x.session.id+"'").join(',')+') group by score_epoch;\ncommit;\n';await writeFile('/tmp/tesla-v4110-fixture-setup.sql',sql);console.log(JSON.stringify({prepared:meta.length,versions:versions.length}));
}else if(process.argv[2]==='submit'){
 const all=JSON.parse(await readFile(privatePath)),receipts=[];for(const x of all){const replay=x.kind==='fake-end'?{...x.replay,ticks:x.replay.ticks+1}:x.replay;const r=await request('sessions/'+x.session.id,{nickname:'QA V4110',replay,score:x.expected.score+(x.kind==='fake-score'?1:0)},x.session.capability);assert.equal(r.status,202);assert.equal(r.body.receipt,true);receipts.push({id:x.session.id,kind:x.kind,receipt:true});}
 await writeFile(new URL('hosted-receipts.json',out),JSON.stringify(receipts,null,2));console.log(JSON.stringify({receipts:receipts.length}));
}else if(process.argv[2]==='check'){
 const all=JSON.parse(await readFile(privatePath)),checks=[];for(const x of all){const r=await request('sessions/'+x.session.id,undefined,x.session.capability),status=x.kind.startsWith('valid')?'accepted':'rejected';assert.equal(r.body.status,status,x.kind+' '+x.session.ruleset);if(status==='accepted'){for(const k of ['score','flips','ticks'])assert.equal(r.body.entry[k],x.expected[k]);}checks.push({id:x.session.id,ruleset:x.session.ruleset,kind:x.kind,status,exact:true,publicId:r.body.publicId||r.body.entry?.id});}
 const scores=await request('scores');assert.ok(scores.body.entries.every(e=>!checks.some(x=>x.publicId===e.id)));const result={checks,publicScores:scores.body.total,publicFixtureWrites:0,autonomousCompletion:true};await writeFile(new URL('hosted-results.json',out),JSON.stringify(result,null,2));console.log(JSON.stringify({accepted:checks.filter(x=>x.status==='accepted').length,rejected:checks.filter(x=>x.status==='rejected').length,publicScores:result.publicScores,publicFixtureWrites:0}));
}
