import {readFile,writeFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
import {validatePackage,canonical,gameplayContent} from '../src/content-package.js';
const root=new URL('../',import.meta.url),p=JSON.parse(await readFile(new URL('content/package.json',root),'utf8'));p.music.beatsPerBar??=4;
const runSource=await readFile(new URL('src/run.js',root),'utf8');if(runSource.match(/export const RULESET='([^']+)'/)?.[1]!==p.ruleset)throw Error('Package ruleset does not match the game simulation');
const errors=validatePackage(p);if(errors.length)throw Error(errors.join('\n'));
for(const [path,r] of Object.entries(p.resources)){const bytes=await readFile(new URL(path,root));if(createHash('sha256').update(bytes).digest('hex')!==r.sha256||bytes.length!==r.bytes)throw Error(path+': changed bytes; update the draft resource metadata');if(r.kind==='image'&&(bytes.readUInt32BE(16)!==r.width||bytes.readUInt32BE(20)!==r.height))throw Error(path+': image dimensions mismatch');}
const sha=x=>createHash('sha256').update(canonical(x)).digest('hex'),physicsHash=sha(gameplayContent(p));
const lock=JSON.parse(await readFile(new URL('content/rulesets.json',root),'utf8'));
if(lock[p.ruleset]!==physicsHash)throw Error('Gameplay content changed. Freeze a new server ruleset and register its gameplay hash before publication. Never relabel an existing ruleset.');
const {contentHash:ignored,...body}=p;const result='// Generated from content/package.json. Run npm run build:content.\nexport const BUNDLED='+JSON.stringify({...body,gameplayHash:physicsHash,contentHash:sha(body)})+';\n';
const target=new URL('src/content-bundle.js',root);if(process.argv.includes('--check')){if(await readFile(target,'utf8')!==result)throw Error('Content bundle is stale');}else await writeFile(target,result);console.log('Content OK: '+p.obstacles.length+' obstacles, '+p.biomes.length+' biomes, '+Object.keys(p.resources).length+' verified materials; '+p.ruleset);
