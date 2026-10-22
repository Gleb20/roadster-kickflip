import {FACTORY_ASSETS} from '../src/factory.js';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {ASSETS} from '../src/content.js';
const root=new URL('../',import.meta.url),pkg=JSON.parse(await readFile(new URL('package.json',root),'utf8'));
const files=new Set(['index.html','style.css',...Object.values(ASSETS).map(a=>a.file),
 'assets/characters/bezos-v247.png','assets/characters/katy-v247.png','assets/spaceport/spaceport-atlas.png','assets/roadster-flip/atlas.png',
 'manifest.webmanifest','icons/icon-192.png','icons/icon-512.png',
 'assets/ui/collection-mystery.png','assets/ui/ATTRIBUTION.md']);
for(const name of await readdir(new URL('src/',root)))if(name.endsWith('.js'))files.add('src/'+name);
for(const name of await readdir(new URL('assets/audio/',root)))if(name.endsWith('.mp3'))files.add('assets/audio/'+name);
for(const id of FACTORY_ASSETS)files.add('assets/factory/'+id+'.png');
files.add('assets/factory/ATTRIBUTION.md');
files.add('assets/encounters/v400/ATTRIBUTION.md');
const core=[];
for(const file of [...files].sort()){
 const bytes=await readFile(new URL(file,root));
 core.push({url:file+(file.startsWith('src/')&&file.endsWith('.js')&&file!=='src/enemy-sprite-data.js'||file==='style.css'?'?v='+pkg.version:''),sha256:createHash('sha256').update(bytes).digest('hex')});
}
const template=await readFile(new URL('scripts/sw-template.js',root),'utf8');
const result=template.replace('__VERSION__',pkg.version).replace('__CORE__',JSON.stringify(core,null,1));
if(process.argv.includes('--check')){
 if(await readFile(new URL('sw.js',root),'utf8')!==result)throw Error('PWA hashes are stale. Run npm run build:pwa.');
 const manifest=JSON.parse(await readFile(new URL('manifest.webmanifest',root),'utf8'));
 if(manifest.scope!=='./'||manifest.id!=='./'||manifest.display!=='standalone')throw Error('Unexpected PWA identity/scope');
 for(const size of [192,512]){const png=await readFile(new URL(`icons/icon-${size}.png`,root));if(png.readUInt32BE(16)!==size||png.readUInt32BE(20)!==size)throw Error('Incorrect icon dimensions');}
 console.log(`PWA OK: ${core.length} hashed resources; scope-relative manifest and 192/512 icons`);
}else{await writeFile(new URL('sw.js',root),result);console.log(`PWA ${pkg.version}: ${core.length} resources`);}
