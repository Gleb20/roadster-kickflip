import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import * as current from '../src/run.js';
import * as frozen from '../supabase/rulesets/roadster-v473/run.js';
import {biomeAt} from '../src/biomes.js';
import {verifyChunk} from '../supabase/chunk.mjs';
import {decide,observe} from './pacing-play-inputs.mjs';
const results=[];
for(const seed of [17,932,56,2026]){
 const r=current.createRun({seed});r.reset();const control={lastLand:0,plan:null,flying:null},visits=[];let leg=-1,pickups=0,checkpoint=false;
 while(r.S.mode==='playing'&&r.S.t<180){
  decide(r,control);r.step();const events=r.drainEvents();observe(r,control,events);pickups+=events.filter(e=>e.type==='pickup').length;
  const b=biomeAt(r.S.t,seed);if(b.leg!==leg){visits.push({time:r.S.t,score:r.S.score,...b});leg=b.leg;}
  if(!checkpoint&&r.S.t>=90){const copy=current.createRun({record:false});copy.restore(JSON.parse(JSON.stringify(r.snapshot())));const c=structuredClone(control);for(let i=0;i<480;i++){decide(r,control);decide(copy,c);r.step();copy.step();observe(r,control,r.drainEvents());observe(copy,c,copy.drainEvents());assert.deepEqual(copy.snapshot(),r.snapshot());}checkpoint=true;}
 }
 assert.equal(r.S.mode,'playing','180s run '+seed);assert.equal(visits[1].time,40);assert.ok(visits.length>=4);assert.ok(pickups>0);
 r.command('cancel');while(r.S.mode==='playing'&&r.S.t<240){r.step();r.drainEvents();}assert.equal(r.S.mode,'dead');
 const replay=r.replay(),expected=current.verifyReplay(replay);assert.deepEqual(frozen.verifyReplay(replay),expected);
 let cp=null,result,chunks=0;do{result=verifyChunk(replay,cp,{maxTicks:997,budgetMs:Infinity});cp=result.checkpoint?JSON.parse(JSON.stringify(result.checkpoint)):null;chunks++;assert.ok(chunks<100);}while(result.outcome==='pending');
 assert.equal(result.outcome,'accepted');assert.deepEqual(result.result,expected);assert.equal(verifyChunk({...replay,ticks:replay.ticks+1},null,{maxTicks:1e6,budgetMs:Infinity}).outcome,'rejected');
 results.push({seed,visits,pickups,checkpoint,chunks,result:expected});
}
await writeFile(process.argv[2]||'/tmp/tesla-timed-runs.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
