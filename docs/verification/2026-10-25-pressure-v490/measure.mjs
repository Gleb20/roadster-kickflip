import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {createRun,verifyReplay} from '../../../src/run.js';
import {createRun as oldRun} from '../../../supabase/rulesets/roadster-v480/run.js';
import {speedView} from '../../../src/speed-feedback.js';
import {speedView as oldView} from '../../../supabase/rulesets/roadster-v480/speed-feedback.js';
import {decideVisible,observe} from '../2026-10-24-encounter-pacing/fallback-v472/independent/observe-visible.mjs';
import {verifyChunk} from '../../../supabase/chunk.mjs';
const results=[];
for(const version of ['4.8.0','4.9.0'])for(const width of [390,600])for(const seed of [17,932]){
 const old=version==='4.8.0',run=(old?oldRun:createRun)({seed});run.reset();const c={lastLand:0,plan:null,flying:null},counts={},waves=[],jumps=[];let wave=0,maxSpawnMs=0;
 while(run.S.mode==='playing'&&run.S.t<600){
  const v=(old?oldView:speedView)(width,844,run.S.speed,run.director.state.viewStrength);decideVisible(run,c,(width-v.x)/v.scale);
  const before=performance.now();run.step();const ms=performance.now()-before,events=run.drainEvents();
  if(events.some(e=>e.type==='jump'))jumps.push(run.S.t);observe(run,c,events);
  if(wave!==run.director.state.wave){wave=run.director.state.wave;const d=run.director.state.last;maxSpawnMs=Math.max(maxSpawnMs,ms);counts[d.kind]=(counts[d.kind]||0)+1;waves.push({t:run.S.t,score:run.S.score,kind:d.kind,decisions:d.groundDecisions,preparation:d.route.preparation});}
 }
 const late=waves.filter(x=>x.t>=150),seconds=Math.max(0,run.S.t-150),decisions=late.reduce((s,x)=>s+x.decisions,0);
 const report={version,width,seed,mode:run.S.mode,seconds:run.S.t,score:run.S.score,counts,lateDecisionsPerMinute:decisions/seconds*60,latePassiveFraction:late.filter(x=>x.decisions===0).length/late.length,maxSpawnMs,waves,jumps};
 if(!old){
  assert.equal(run.S.mode,'playing',`${width}/${seed} died at ${run.S.t}`);
  assert.ok(counts['pressure-chain']>=20,'triples must actually reach play');
  run.command('cancel');while(run.S.mode==='playing'&&run.S.t<650){run.step();run.drainEvents();}
  const replay=run.replay(),exact=verifyReplay(replay);let checkpoint=null,chunk;
  do{chunk=verifyChunk(replay,checkpoint,{maxTicks:1200,budgetMs:Infinity});checkpoint=chunk.checkpoint?JSON.parse(JSON.stringify(chunk.checkpoint)):null;}while(chunk.outcome==='pending');
  assert.equal(chunk.outcome,'accepted');assert.deepEqual(chunk.result,exact);report.exactReplay=true;
 }
 results.push(report);console.log(JSON.stringify({...report,waves:undefined,jumps:undefined}));
}
for(const n of results.filter(x=>x.version==='4.9.0')){const o=results.find(x=>x.version==='4.8.0'&&x.width===n.width&&x.seed===n.seed);assert.ok(n.lateDecisionsPerMinute>=o.lateDecisionsPerMinute*1.3);assert.ok(n.latePassiveFraction<o.latePassiveFraction);}
await writeFile(new URL('measurements.json',import.meta.url),JSON.stringify({recognitionSeconds:.12,routeActionReads:0,thrustUses:0,results},null,2));
