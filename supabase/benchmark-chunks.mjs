import {readFile,writeFile} from 'node:fs/promises';import {verifyReplay} from './rulesets/roadster-v342/run.js';import {verifyChunk} from './chunk.mjs';
const reports=[];
for(const seconds of [30,600,3590]){
 const {replay}=JSON.parse(await readFile(`/tmp/tesla-replay-bench/${seconds}.json`)),expected=verifyReplay(replay);let checkpoint=null,value,elapsed=[],sizes=[],count=0;
 do{const start=performance.now();value=verifyChunk(replay,checkpoint);elapsed.push(performance.now()-start);if(value.checkpoint){const json=JSON.stringify(value.checkpoint);sizes.push(json.length);checkpoint=JSON.parse(json);}count++;}while(value.outcome==='pending');
 if(JSON.stringify(value.result)!==JSON.stringify(expected))throw Error('Chunked result mismatch');reports.push({seconds:replay.ticks/120,score:expected.score,chunks:count,maxChunkMs:Math.max(...elapsed),meanChunkMs:elapsed.reduce((a,b)=>a+b)/count,maxCheckpointBytes:Math.max(0,...sizes),exactResult:true});
}
await writeFile('/tmp/tesla-supabase-chunks.json',JSON.stringify(reports,null,2));console.log(JSON.stringify(reports));
