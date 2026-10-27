import {validatePackage,digest,canonical,gameplayContent} from './content-package.js?v=4.13.1';
export const PORTABLE_FORMAT='tesla-materials-1';
export const encodeBytes=bytes=>{let s='';for(let i=0;i<bytes.length;i+=16384)s+=String.fromCharCode(...bytes.subarray(i,i+16384));return btoa(s);};
export const decodeBytes=text=>{if(typeof text!=='string'||text.length>24*1024*1024)throw Error('Material exceeds 16 MiB');return Uint8Array.from(atob(text),c=>c.charCodeAt(0));};
export async function verifyMaterial(path,metadata,bytes,{decode=true}={}){
 if(bytes.byteLength!==metadata.bytes||await digest(bytes)!==metadata.sha256)throw Error(path+': file bytes do not match the package. Import the matching original.');
 if(metadata.kind==='image'){
  const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  if(bytes.length<24||v.getUint32(0)!==0x89504e47||v.getUint32(4)!==0x0d0a1a0a||v.getUint32(16)!==metadata.width||v.getUint32(20)!==metadata.height)throw Error(path+': keep the declared PNG dimensions and atlas layout.');
  if(decode){const bitmap=await createImageBitmap(new Blob([bytes],{type:'image/png'}));bitmap.close();}
 }else if(decode){const context=new OfflineAudioContext(2,1,24000);try{await context.decodeAudioData(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));}catch{throw Error(path+': audio could not decode. Export a playable MP3.');}}
}
export async function materialBytes(path,p,files={}){const bytes=files[path]?decodeBytes(files[path]):new Uint8Array(await(await fetch(new URL('../'+path,import.meta.url))).arrayBuffer());await verifyMaterial(path,p.resources[path],bytes,{decode:false});return bytes;}
export async function portablePackage(p,files={}){const errors=validatePackage(p);if(errors.length)throw Error(errors.join('\n'));const result={format:PORTABLE_FORMAT,package:structuredClone(p),files:{}};for(const path of Object.keys(p.resources))result.files[path]=encodeBytes(await materialBytes(path,p,files));return result;}
export async function importPortable(text){
 if(text.length>140*1024*1024)throw Error('Package exceeds 140 MiB. Choose a smaller package.');
 const item=JSON.parse(text);if(item.format!==PORTABLE_FORMAT)throw Error('Choose a .tjpack exported by Material Studio.');const errors=validatePackage(item.package);if(errors.length)throw Error(errors.join('\n'));if(!item.files||Object.keys(item.files).length!==Object.keys(item.package.resources).length)throw Error('Package is incomplete; export it again with all materials.');
 for(const path of Object.keys(item.package.resources)){const bytes=decodeBytes(item.files[path]);await verifyMaterial(path,item.package.resources[path],bytes);if(Object.values(item.package.music.tracks).some(track=>Object.values(track).includes(path))){const context=new OfflineAudioContext(2,1,24000),buffer=await context.decodeAudioData(bytes.buffer.slice(0));if(Math.abs(buffer.duration-item.package.music.seconds)>.025)throw Error(path+': prepare exactly 60 seconds for this music grid.');}}
 return item;
}
export async function replaceMaterial(p,files,path,file){
 if(!p.resources[path])throw Error('Select a material first.');if(file.size>16*1024*1024)throw Error('Choose a file below 16 MiB.');const bytes=new Uint8Array(await file.arrayBuffer()),meta={...p.resources[path],bytes:bytes.length,sha256:await digest(bytes)};
 await verifyMaterial(path,meta,bytes);
 let audioReport=null;
 if(meta.kind==='audio'){
  const context=new OfflineAudioContext(2,1,24000);let buffer;try{buffer=await context.decodeAudioData(bytes.buffer.slice(0));}catch{throw Error('Choose a playable MP3 audio file.');}
  const isMusic=Object.values(p.music.tracks).some(track=>Object.values(track).includes(path));if(isMusic&&Math.abs(buffer.duration-p.music.seconds)>.025)throw Error(`Music loop is ${buffer.duration.toFixed(3)} seconds. Prepare exactly ${p.music.seconds} seconds / 32 bars at 128 BPM.`);
  let peak=0,power=0,seam=0;for(let c=0;c<buffer.numberOfChannels;c++){const d=buffer.getChannelData(c);seam=Math.max(seam,Math.abs(d[0]-d.at(-1)));for(const v of d){peak=Math.max(peak,Math.abs(v));power+=v*v;}}
  if(isMusic&&power<1e-8)throw Error('Music file is silent. Export an audible loop.');audioReport={duration:buffer.duration,decodedSampleRate:buffer.sampleRate,channels:buffer.numberOfChannels,peak,rms:Math.sqrt(power/(buffer.length*buffer.numberOfChannels)),seam};
 }
 const next=structuredClone(p);next.resources[path]=meta;return {package:next,files:{...files,[path]:encodeBytes(bytes)},audioReport};
}
export async function packageIdentity(p){return {contentHash:await digest(canonical(p)),gameplayHash:await digest(canonical(gameplayContent(p)))};}
