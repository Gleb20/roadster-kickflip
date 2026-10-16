import {fileURLToPath} from 'node:url';
import {readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
for(const name of readdirSync(new URL('../src/',import.meta.url)).filter(n=>n.endsWith('.js'))){
 const result=spawnSync(process.execPath,['--check',fileURLToPath(new URL('../src/'+name,import.meta.url))],{stdio:'inherit'});
 if(result.status!==0)process.exit(result.status||1);
}
