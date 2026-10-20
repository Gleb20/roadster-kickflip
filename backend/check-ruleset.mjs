import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('./rulesets/roadster-v341/',import.meta.url),manifest=JSON.parse(await readFile(new URL('manifest.json',root),'utf8'));
for(const [file,expected] of Object.entries(manifest.files)){const actual=createHash('sha256').update(await readFile(new URL(file,root))).digest('hex');if(actual!==expected)throw Error('Immutable verifier source changed: '+file);}
console.log(JSON.stringify({ruleset:manifest.ruleset,files:Object.keys(manifest.files).length,verified:true}));
