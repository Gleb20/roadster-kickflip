// Compare scheduling overhead on identical, completed replay fixtures. No network calls.
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {verifyChunk} from '../supabase/chunk.mjs';
const files=process.argv.slice(2);if(!files.length)throw Error('Pass JSON fixtures containing replay');
const rows=[];
for(const file of files){
 const {replay}=JSON.parse(await readFile(file,'utf8')),results=[];
 for(const maxTicks of [6000,432000]){
  let checkpoint=null,output,chunks=0,checkpointBytes=0,maxChunkMs=0;const started=performance.now();
  do{const before=performance.now();output=verifyChunk(replay,checkpoint,{maxTicks,budgetMs:400});maxChunkMs=Math.max(maxChunkMs,performance.now()-before);checkpoint=output.checkpoint?JSON.parse(JSON.stringify(output.checkpoint)):null;checkpointBytes+=JSON.stringify(checkpoint).length;chunks++;if(chunks>600)throw Error('Unfinished fixture');}while(output.outcome==='pending');
  results.push({maxTicks,chunks,totalMs:performance.now()-started,maxChunkMs,checkpointBytes,outcome:output.outcome,result:output.result});
 }
 assert.equal(results[0].outcome,'accepted');assert.deepEqual(results[0].result,results[1].result);rows.push({seconds:replay.ticks/120,ruleset:replay.ruleset,results});
}
const out=process.env.BENCHMARK_OUTPUT||'/tmp/tesla-score-worker-benchmark.json';await writeFile(out,JSON.stringify(rows,null,2));console.log(JSON.stringify({fixtures:rows.length,out,exactResults:true}));
