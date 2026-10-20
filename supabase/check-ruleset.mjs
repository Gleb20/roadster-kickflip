import {readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
const root=new URL('./rulesets/roadster-v342/',import.meta.url),manifest=JSON.parse(await readFile(new URL('manifest.json',root),'utf8'));
for(const [file,expected] of Object.entries(manifest.files)){if(createHash('sha256').update(await readFile(new URL(file,root))).digest('hex')!==expected)throw Error('Frozen ruleset changed: '+file);}
console.log(JSON.stringify({ruleset:manifest.ruleset,source:manifest.sourceCommit,files:Object.keys(manifest.files).length,verified:true}));
