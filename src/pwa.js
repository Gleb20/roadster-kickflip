/** Optional installation/offline support. The game never depends on registration. */
export function createPWA({mode,lock}){
 const install=document.getElementById('pwa-install'),update=document.getElementById('pwa-update'),guide=document.getElementById('pwa-guide'),status=document.getElementById('pwa-status');
 let registration=null,prompt=null,locked=false,requested=false,offlineReady=false;
 const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 const safe=()=>['menu','dead'].includes(mode());
 function showStatus(){status.textContent=offlineReady?'Offline game copy is ready on this device.':'Preparing an offline copy when a connection is available. You can keep playing.';}
 function showUpdate(){update.hidden=!registration?.waiting;update.textContent='UPDATE READY';}
 install.hidden=standalone();
 const ios=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 document.getElementById('pwa-instructions').textContent=ios?'Open the browser Share menu, choose Add to Home Screen, then Add. Launch Tesla Jump from its new icon.':'Use Install app in the browser menu, or Add to Home screen. The game opens from its own icon where your browser supports it.';
 document.getElementById('pwa-close').onclick=()=>guide.close();
 addEventListener('beforeinstallprompt',event=>{event.preventDefault();prompt=event;install.hidden=false;});
 addEventListener('appinstalled',()=>{prompt=null;install.hidden=true;if(guide.open)guide.close();});
 install.onclick=async()=>{
  if(prompt){const current=prompt;prompt=null;try{await current.prompt();await current.userChoice;}catch{}return;}
  showStatus();guide.showModal();
 };
 async function applyUpdate(){
  if(!safe()||!registration?.waiting||locked)return false;
  locked=true;requested=true;lock(true);update.disabled=true;update.textContent='UPDATING…';
  registration.waiting.postMessage({type:'APPLY_UPDATE',safe:true});return true;
 }
 update.onclick=applyUpdate;
 async function init(){
  if(!('serviceWorker' in navigator)||!isSecureContext){status.textContent='Installation and offline support are unavailable in this browser. The game still works online.';return;}
  navigator.serviceWorker.addEventListener('message',event=>{
   if(event.data?.type==='UPDATE_BLOCKED'){
    locked=false;requested=false;lock(false);update.disabled=false;update.textContent='CLOSE OTHER GAME WINDOWS TO UPDATE';
   }
   if(event.data?.type==='OFFLINE_READY'){offlineReady=true;showStatus();}
  });
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(requested&&safe())location.reload();});
  try{
   registration=await navigator.serviceWorker.register(new URL('../sw.js',import.meta.url),{scope:new URL('../',import.meta.url).pathname,updateViaCache:'none'});
   offlineReady=!!registration.active;showStatus();showUpdate();
   const watch=worker=>{if(!worker)return;worker.addEventListener('statechange',()=>{if(worker.state==='activated'){offlineReady=true;showStatus();}if(worker.state==='installed')showUpdate();});};
   watch(registration.installing);registration.addEventListener('updatefound',()=>watch(registration.installing));
   await registration.update();showUpdate();
   addEventListener('online',()=>{registration.update().catch(()=>{});});
   document.addEventListener('visibilitychange',()=>{if(!document.hidden&&safe())registration.update().catch(()=>{});});
  }catch{status.textContent='Offline preparation is unavailable right now. The game still works online.';}
 }
 return {init,applyUpdate,get locked(){return locked;},get offlineReady(){return offlineReady;}};
}
