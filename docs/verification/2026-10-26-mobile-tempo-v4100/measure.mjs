import {writeFile} from 'node:fs/promises';
const root='file:///tmp/tesla-next-backlog-20261026/';
const {decideVisible,observe}=await import(root+'docs/verification/2026-10-24-encounter-pacing/fallback-v472/independent/observe-visible.mjs');
const results=[];
for(const version of ['before','after'])for(const seed of [17,932]){
 const prefix=version==='before'?'supabase/rulesets/roadster-v490/':'src/';
 const {createRun}=await import(root+prefix+'run.js'),{speedView}=await import(root+prefix+'speed-feedback.js');
 const run=createRun({seed});run.reset(seed,{experienced:true});const c={lastLand:0,plan:null,flying:null};let wave=0,empty=0,emptyStart=null,lastJump=0;
 const waves=[],jumps=[],emptyGaps=[],counts={};let pickups=0,maxSpawnMs=0;
 while(run.S.mode==='playing'&&run.S.t<600){
  const v=speedView(440,956,run.S.speed,run.director.state.viewStrength);
  decideVisible(run,c,(440-v.x)/v.scale);
  const t=performance.now();run.step();const ms=performance.now()-t,events=run.drainEvents();observe(run,c,events);
  for(const e of events){if(e.type==='pickup')pickups++;if(e.type==='jump'){jumps.push({time:run.S.t,score:run.S.score,gap:run.S.t-lastJump});lastJump=run.S.t;}}
  if(wave!==run.director.state.wave){wave=run.director.state.wave;const d=run.director.state.last;maxSpawnMs=Math.max(maxSpawnMs,ms);counts[d.kind]=(counts[d.kind]||0)+1;waves.push({time:run.S.t,score:run.S.score,speed:run.S.speed,kind:d.kind,decisions:d.groundDecisions,preparation:d.route.preparation});}
  const visible=[...run.S.obs,...run.S.rails].some(o=>v.x+(o.x+o.w)*v.scale>0&&v.x+o.x*v.scale<440);
  if(!visible){empty+=1/120;emptyStart??=run.S.t;}else if(emptyStart!==null){emptyGaps.push({time:emptyStart,duration:run.S.t-emptyStart,score:run.S.score});emptyStart=null;}
 }
 const result={version,seed,seconds:run.S.t,score:run.S.score,mode:run.S.mode,pickups,counts,maxSpawnMs,emptyFraction:empty/run.S.t,maxEmpty:Math.max(0,...emptyGaps.filter(x=>x.time>20).map(x=>x.duration)),waves,jumps,emptyGaps};results.push(result);
 console.log(JSON.stringify({...result,waves:undefined,jumps:undefined,emptyGaps:undefined}));
}
await writeFile('/tmp/tesla-mobile-measure.json',JSON.stringify(results,null,2));
