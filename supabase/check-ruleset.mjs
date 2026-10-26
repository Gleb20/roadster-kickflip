import {readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
for(const folder of ['roadster-v342','roadster-v380','roadster-v400','roadster-v410','roadster-v430','roadster-v432','roadster-v440','roadster-v442','roadster-v460','roadster-v461','roadster-v463','roadster-v470','roadster-v471','roadster-v472','roadster-v473','roadster-v480','roadster-v490','roadster-v4100','roadster-v4110']){
 const root=new URL('./rulesets/'+folder+'/',import.meta.url),manifest=JSON.parse(await readFile(new URL('manifest.json',root),'utf8'));
 for(const [file,expected] of Object.entries(manifest.files)){if(createHash('sha256').update(await readFile(new URL(file,root))).digest('hex')!==expected)throw Error('Frozen ruleset changed: '+file);}
 console.log(JSON.stringify({ruleset:manifest.ruleset,files:Object.keys(manifest.files).length,verified:true}));
}
