import {validatePackage} from './content-package.js?v=4.13.0';
import {decodeBytes,verifyMaterial} from './studio-package.js?v=4.13.0';
if(parent===window)throw Error('Preview must be opened from Material Studio');
await new Promise((resolve,reject)=>{
 const timer=setTimeout(()=>reject(Error('Open this preview from Material Studio.')),20000);
 const receive=async event=>{
  if(event.source!==parent||event.origin!==location.origin||event.data?.type!=='TESLA_PREVIEW_PACKAGE')return;
  removeEventListener('message',receive);clearTimeout(timer);
  try{
   const {package:p,files={}}=event.data,errors=validatePackage(p);if(errors.length)throw Error(errors.join('; '));const urls={};
   for(const [path,text] of Object.entries(files)){if(!p.resources[path])throw Error('Unknown preview material');const bytes=decodeBytes(text);await verifyMaterial(path,p.resources[path],bytes);urls[path]=URL.createObjectURL(new Blob([bytes],{type:p.resources[path].mediaType}));}
   globalThis.__TESLA_CONTENT_PREVIEW__={package:p,urls};
   const style=document.createElement('style');style.textContent='#game > :not(#scene){display:none!important} #loading-screen{display:none!important} body,#game{background:#10151b}';document.head.append(style);resolve();
  }catch(error){parent.postMessage({type:'TESLA_PREVIEW_ERROR',message:String(error.message)},location.origin);reject(error);}
 };
 addEventListener('message',receive);parent.postMessage({type:'TESLA_PREVIEW_REQUEST'},location.origin);
});
