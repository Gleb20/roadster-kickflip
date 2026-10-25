import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const sw=await readFile(new URL('../../../sw.js',import.meta.url),'utf8'),core=JSON.parse(sw.match(/const CORE=(\[[\s\S]*?\]);/)[1]);
const queue=[...core,{url:'sw.js',sha256:createHash('sha256').update(sw).digest('hex')}],checks=[];
await Promise.all(Array.from({length:6},async()=>{while(queue.length){const x=queue.shift();try{const r=await fetch('https://gleb20.github.io/roadster-kickflip/'+x.url+'?release=cbd8ad3',{signal:AbortSignal.timeout(30000)}),actual=createHash('sha256').update(Buffer.from(await r.arrayBuffer())).digest('hex');checks.push({url:x.url,status:r.status,match:r.ok&&actual===x.sha256});}catch(e){checks.push({url:x.url,error:String(e),match:false});}}}));
const report={version:'4.9.0',commit:'cbd8ad38a5b9c5f21712e728753500e7548166d4',checked:checks.length,failed:checks.filter(x=>!x.match),checks};await writeFile(new URL('live-hashes.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log({checked:report.checked,failed:report.failed});if(report.failed.length)process.exitCode=1;
