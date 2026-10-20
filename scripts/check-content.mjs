import {access,readFile} from 'node:fs/promises';
import {ASSETS,OBSTACLES,validateContent} from '../src/content.js';
const errors=validateContent();
for(const [id,{file}] of Object.entries(ASSETS)){
 try{await access(new URL('../'+file,import.meta.url));}catch{errors.push(`${id}: missing ${file}`);}
}
for(const def of OBSTACLES){
 if(def.visual.renderer==='character'){
  const required={joe:'joe',amber:'amber',rogozin:'rogozin',zuck:'zuckerberg',trump:'trumpPose'}[def.visual.key];
  const source=await readFile(new URL('../src/characters.js',import.meta.url),'utf8');
  if(!required||!source.includes(`function ${required}(`))errors.push(`${def.id}: missing character painter`);
 }
}
if(errors.length)throw new Error(errors.join('\n'));
console.log(`Content OK: ${OBSTACLES.length} obstacle definitions, ${Object.keys(ASSETS).length} material sources`);
