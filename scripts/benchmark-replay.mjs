import {performance} from 'node:perf_hooks';
import {writeFile,mkdir} from 'node:fs/promises';
import {createRun,RUN_STEP,verifyReplay} from '../src/run.js';
const durations=process.argv.slice(2).map(Number);if(!durations.length)durations.push(30,600,3590);
await mkdir('/tmp/tesla-replay-bench',{recursive:true});
for(const seconds of durations){
 const run=createRun({seed:93817}),actions=new Map();run.reset();let wave=0,maxStepMs=0;const started=performance.now();
 while(run.S.mode==='playing'&&run.S.tick<(seconds+20)/RUN_STEP){
  for(const a of actions.get(run.S.tick)||[])run.command(a);
  const before=performance.now();run.step();maxStepMs=Math.max(maxStepMs,performance.now()-before);run.drainEvents();
  if(run.S.t<seconds&&run.director.state.wave!==wave){wave=run.director.state.wave;for(const event of run.director.state.last.route.actions){const tick=run.S.tick+Math.round(event.at/RUN_STEP),action={hold:'primary-down',jump:'primary-up','thrust-on':'thrust-on','thrust-off':'thrust-off'}[event.action];if(!actions.has(tick))actions.set(tick,[]);actions.get(tick).push(action);}}
 }
 const generationMs=performance.now()-started,replay=run.replay();if(!replay||run.S.mode!=='dead')throw Error(`Fixture ${seconds}s did not finish within replay limits`);
 const before=performance.now(),result=verifyReplay(replay),verificationMs=performance.now()-before;
 const report={requestedSeconds:seconds,actualSeconds:run.S.t,earlyDeath:run.S.t<seconds,score:result.score,waves:run.director.state.wave,events:replay.events.length,bytes:JSON.stringify(replay).length,generationMs,verificationMs,maxStepMs};
 await writeFile(`/tmp/tesla-replay-bench/${seconds}.json`,JSON.stringify({report,replay},null,2));console.log(JSON.stringify(report));
}
