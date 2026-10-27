import {previewContent} from './content-runtime.js?v=4.13.1';
/** Install support and automatic, coherent updates at a safe run boundary. */
export function createPWA({mode,lock,canReload=()=>true,restart=()=>{}}){
 const install=document.getElementById('pwa-install'),guide=document.getElementById('pwa-guide'),status=document.getElementById('pwa-status');
 const startKey='tesla-jump:start-after-update';
 let registration=null,prompt=null,locked=false,requested=false,offlineReady=false,resume=false,timer=null,bypass=false;
 const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 const safe=()=>mode()==='menu'&&canReload()&&!document.hidden;
 function rememberStart(value){try{if(value)sessionStorage.setItem(startKey,String(Date.now()));else sessionStorage.removeItem(startKey);}catch{}}
 function consumeStart(){try{const value=Number(sessionStorage.getItem(startKey));sessionStorage.removeItem(startKey);return value>0&&Date.now()-value<60000;}catch{return false;}}
 function showStatus(){status.textContent=offlineReady?'Offline game copy is ready on this device.':'Preparing an offline copy when a connection is available. You can keep playing.';}
 install.hidden=standalone();
 const ios=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 document.getElementById('pwa-instructions').textContent=ios?'Open the browser Share menu, choose Add to Home Screen, then Add. Launch Tesla Jump from its new icon.':'Use Install app in the browser menu, or Add to Home screen. The game opens from its own icon where your browser supports it.';
 document.getElementById('pwa-close').onclick=()=>{guide.close();checkpoint();};
 addEventListener('beforeinstallprompt',event=>{event.preventDefault();prompt=event;install.hidden=false;});
 addEventListener('appinstalled',()=>{prompt=null;install.hidden=true;if(guide.open)guide.close();});
 install.onclick=async()=>{
  if(prompt){const current=prompt;prompt=null;try{await current.prompt();await current.userChoice;}catch{}return;}
  showStatus();guide.showModal();
 };
 function release(){clearTimeout(timer);const retry=resume;locked=false;requested=false;resume=false;rememberStart(false);lock(false);if(retry){bypass=true;restart();}}
 function applyUpdate(runBoundary=false){
  if(locked||!registration?.waiting||!navigator.serviceWorker.controller)return false;
  if(runBoundary?(!['menu','dead','paused'].includes(mode())||!canReload()):!safe())return false;
  locked=true;requested=true;resume=runBoundary;rememberStart(resume);lock(true);
  // Another window may still be playing: the worker must approve activation.
  timer=setTimeout(release,8000);
  registration.waiting.postMessage({type:'APPLY_UPDATE',safe:true});return true;
 }
 function checkpoint(){return applyUpdate(false);}
 async function init(){
  if(!(!previewContent&&'serviceWorker' in navigator)||!isSecureContext){status.textContent='Installation and offline support are unavailable in this browser. The game still works online.';return;}
  navigator.serviceWorker.addEventListener('message',event=>{
   if(event.data?.type==='UPDATE_BLOCKED')release();
   if(event.data?.type==='OFFLINE_READY'){offlineReady=true;showStatus();}
  });
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(requested){clearTimeout(timer);location.reload();}});
  try{
   registration=await navigator.serviceWorker.register(new URL('../sw.js',import.meta.url),{scope:new URL('../',import.meta.url).pathname,updateViaCache:'none'});
   offlineReady=!!registration.active;showStatus();checkpoint();
   const watch=worker=>{if(!worker)return;worker.addEventListener('statechange',()=>{if(worker.state==='activated'){offlineReady=true;showStatus();}if(worker.state==='installed')checkpoint();});};
   watch(registration.installing);registration.addEventListener('updatefound',()=>watch(registration.installing));
   // Network checks run in the background; starting offline must stay immediate.
   const check=()=>{registration.update().then(checkpoint).catch(()=>{});};check();
   addEventListener('online',check);
   document.addEventListener('visibilitychange',()=>{if(!document.hidden&&safe())check();});
   setInterval(()=>{if(safe())check();},60000);
  }catch{status.textContent='Offline preparation is unavailable right now. The game still works online.';}
 }
 return {init,checkpoint,beforeRun:()=>{if(bypass){bypass=false;return false;}return applyUpdate(true);},consumeStart,get locked(){return locked;},get offlineReady(){return offlineReady;}};
}
