import assert from 'node:assert/strict';import {writeFile,mkdir} from 'node:fs/promises';
import {createRun,RUN_STEP,verifyReplay} from '../src/run.js';import {verifyChunk} from '../supabase/chunk.mjs';
const results=[];
for(const seed of [17,932]){
 const r=createRun({seed}),actions=new Map();r.reset();let wave=0,catches=0,banked=0,captureTick=0,firstCatch=0,spawns=0;
 while(r.S.mode==='playing'){
  for(const a of actions.get(r.S.tick)||[])r.command(a);r.step();
  for(const e of r.drainEvents()){if(e.type==='rail-catch'){catches++;captureTick||=r.S.tick+2;firstCatch||=r.S.t;}if(e.type==='landing'&&e.result.grindPoints>0)banked+=e.result.grindPoints;}
  if(r.director.state.wave!==wave){wave=r.director.state.wave;if(r.director.state.last.kind==='rail')spawns++;
   if(r.S.t<180)for(const a of r.director.state.last.route.actions){const tick=r.S.tick+Math.round(a.at/RUN_STEP);if(!actions.has(tick))actions.set(tick,[]);actions.get(tick).push({hold:'primary-down',jump:'primary-up','thrust-on':'thrust-on','thrust-off':'thrust-off'}[a.action]);}
  }assert.ok(r.S.t<260);
 }
 assert.ok(r.S.t>180);assert.ok(catches>=2);assert.ok(banked>0);
 const replay=r.replay(),expected=verifyReplay(replay);assert.deepEqual(expected,{score:r.S.score,flips:r.E.flips,ticks:r.S.tick});
 let checkpoint=null,v;do{v=verifyChunk(replay,checkpoint,{maxTicks:1e6,budgetMs:Infinity});checkpoint=v.checkpoint?JSON.parse(JSON.stringify(v.checkpoint)):null;}while(v.outcome==='pending');assert.equal(v.outcome,'accepted');assert.deepEqual(v.result,expected);
 let n=0,midrail=false;checkpoint=null;do{v=verifyChunk(replay,checkpoint,{maxTicks:n===0?captureTick:157,budgetMs:Infinity});checkpoint=v.checkpoint?JSON.parse(JSON.stringify(v.checkpoint)):null;if(checkpoint?.state?.G?.support||checkpoint?.run?.G?.support||checkpoint?.G?.support)midrail=true;n++;}while(v.outcome==='pending');assert.equal(v.outcome,'accepted');assert.deepEqual(v.result,expected);
 assert.ok(midrail);results.push({seed,seconds:r.S.t,spawns,catches,firstCatch,banked,expected,chunks:n,midrail});
}
const out=process.argv[2]||'docs/verification/2026-10-23-grind/runs';await mkdir(out,{recursive:true});await writeFile(out+'/summary.json',JSON.stringify({results,scriptedWitnesses:true,humanAcceptance:false},null,2));console.log(JSON.stringify(results));
