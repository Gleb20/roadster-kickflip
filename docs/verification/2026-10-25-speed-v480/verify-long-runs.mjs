import assert from 'node:assert/strict';import {writeFile}from'node:fs/promises';
import {createRun,verifyReplay}from'../../../src/run.js';import {speedView}from'../../../src/speed-feedback.js';import {verifyChunk}from'../../../supabase/chunk.mjs';
import {decideVisible,observe}from'../2026-10-24-encounter-pacing/fallback-v472/independent/observe-visible.mjs';
const results=[];
for(const width of[320,390,599,600,1002,1440])for(const seed of[17,932]){
 const r=createRun({seed});r.reset();const control={lastLand:0,plan:null,flying:null},counts={},spawns=[];let wave=0,maxGap=0,last=0,maxStepMs=0;
 while(r.S.mode==='playing'&&r.S.t<900){const v=speedView(width,844,r.S.speed,r.director.state.viewStrength);decideVisible(r,control,(width-v.x)/v.scale);const before=performance.now();r.step();const elapsed=performance.now()-before;observe(r,control,r.drainEvents());if(wave!==r.director.state.wave){wave=r.director.state.wave;const d=r.director.state.last;counts[d.kind]=(counts[d.kind]||0)+1;maxGap=Math.max(maxGap,r.S.t-last);last=r.S.t;maxStepMs=Math.max(maxStepMs,elapsed);spawns.push({time:r.S.t,speed:r.S.speed,kind:d.kind,preparation:d.route.preparation,fallbackRail:d.fallbackRail});}}
 assert.equal(r.S.mode,'playing',`${width}/${seed} survives`);assert.ok(counts['spaced-pair']>40&&counts['rail-air']>10);assert.ok(maxGap<15,`${width}/${seed} empty gap ${maxGap}`);
 r.command('cancel');while(r.S.mode==='playing'&&r.S.t<950){r.step();r.drainEvents();}assert.equal(r.S.mode,'dead');const replay=r.replay(),exact=verifyReplay(replay);let checkpoint=null,result,chunks=0;do{result=verifyChunk(replay,checkpoint,{maxTicks:1200,budgetMs:Infinity});checkpoint=result.checkpoint?JSON.parse(JSON.stringify(result.checkpoint)):null;chunks++;}while(result.outcome==='pending');assert.equal(result.outcome,'accepted');assert.deepEqual(result.result,exact);
 const summary={width,seed,survivedSeconds:900,flips:exact.flips,counts,maxGap,maxSpawnStepMs:maxStepMs,chunks,exactReplay:true};results.push({...summary,spawns});console.log(JSON.stringify(summary));
}
await writeFile(new URL('long-runs.json',import.meta.url),JSON.stringify({recognitionDelay:.12,visibleObjectsOnly:true,routeActionReads:0,thrustUses:0,results},null,2));
