import {performance} from 'node:perf_hooks';
import {writeFile} from 'node:fs/promises';
import {createRun,RUN_STEP} from '/tmp/tesla-audio-v450-20261023/src/run.js';
const results=[];
for(const seed of [17,932,2026,42]){
 const r=createRun({seed}),actions=new Map(),waves=[];r.reset();let wave=0,readySince=null,previousKind=null,maxSpeed=0;
 while(r.S.mode==='playing'&&r.S.t<240){
  for(const a of actions.get(r.S.tick)||[])r.command(a);
  const start=performance.now();r.step();const ms=performance.now()-start;
  const events=r.drainEvents();maxSpeed=Math.max(maxSpeed,r.S.speed);
  if(r.director.state.wave!==wave){
   wave=r.director.state.wave;const last=r.director.state.last;
   waves.push({at:r.S.t,kind:last.kind,previousKind,count:r.S.obs.filter(o=>!o.passed).length,readyRest:readySince===null?null:r.S.t-readySince,stepMs:ms});previousKind=last.kind;readySince=null;
   for(const a of last.route.actions){const tick=r.S.tick+Math.round(a.at/RUN_STEP);if(!actions.has(tick))actions.set(tick,[]);actions.get(tick).push({hold:'primary-down',jump:'primary-up','thrust-on':'thrust-on','thrust-off':'thrust-off'}[a.action]);}
  }
  const ready=!r.P.airborne&&!r.G.support&&!r.F.active&&!r.pace.recovery&&!r.S.rails.length&&r.S.obs.every(o=>o.passed);
  if(ready)readySince??=r.S.t;else readySince=null;
 }
 const times=waves.map(w=>w.stepMs).sort((a,b)=>a-b),rests=waves.slice(1).map(w=>w.readyRest).filter(v=>v!==null);
 results.push({seed,mode:r.S.mode,t:r.S.t,score:r.S.score,maxSpeed,waves: waves.length,maxObjects:Math.max(...waves.map(w=>w.count)),minReadyRest:Math.min(...rests),p95SpawnStepMs:times[Math.floor(times.length*.95)],maxSpawnStepMs:times.at(-1),waveDetails:waves});
}
await writeFile('/tmp/tesla-director-audit-20261023/baseline-runs.json',JSON.stringify({note:'Machine witness play; not human success probability. Timing is host-specific, single process; ready includes retained rail lifetime.',results},null,2));
console.log(JSON.stringify(results.map(({waveDetails,...r})=>r)));
