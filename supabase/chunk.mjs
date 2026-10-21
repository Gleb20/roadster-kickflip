import {ruleset} from './rulesets.mjs';
/** Checkpoints originate only from the service-owned database, never the browser. */
export function verifyChunk(value,checkpoint=null,{maxTicks=6000,budgetMs=400,now=()=>performance.now()}={}){
 const {createRun,validateReplay,RUN_COMMANDS}=ruleset(value?.ruleset);
 const replay=validateReplay(value),run=createRun({seed:replay.seed,record:false});run.reset();let event=0;
 if(checkpoint){run.restore(checkpoint.run);event=checkpoint.event;}
 const start=run.S.tick,started=now();
 while(run.S.tick<replay.ticks&&run.S.mode==='playing'&&run.S.tick-start<maxTicks){
  while(event<replay.events.length&&replay.events[event][0]===run.S.tick)run.command(RUN_COMMANDS[replay.events[event++][1]]);
  run.step();run.drainEvents();
  if((run.S.tick-start)%32===0&&now()-started>=budgetMs)break;
 }
 if(run.S.mode==='dead'||run.S.tick===replay.ticks){
  if(run.S.mode!=='dead'||run.S.tick!==replay.ticks||event!==replay.events.length)return {outcome:'rejected',progress:run.S.tick};
  return {outcome:'accepted',result:{score:run.S.score,flips:run.E.flips,ticks:run.S.tick}};
 }
 return {outcome:'pending',progress:run.S.tick,checkpoint:{run:run.snapshot(),event}};
}
