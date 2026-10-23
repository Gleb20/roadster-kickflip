import {COLLECTION_COPY} from './collection-copy.js?v=4.4.0';

export function createCollectionUI({store,definitions,preview,beforeOpen,afterClose}){
 const dialog=document.getElementById('collection-dialog'),grid=document.getElementById('collection-grid'),detail=document.getElementById('collection-detail');
 const title=document.getElementById('collection-title'),summary=document.getElementById('collection-summary'),back=document.getElementById('collection-back');
 const byId=new Map(definitions.map(o=>[o.id,o]));let selected=null,scroll=0,origin=null;
 const element=(tag,className,text)=>{const e=document.createElement(tag);e.className=className;if(text)e.textContent=text;return e;};
 function portrait(def,locked){
  const canvas=element('canvas','collection-portrait');canvas.width=384;canvas.height=328;canvas.setAttribute('aria-hidden','true');
  const c=canvas.getContext('2d');c.drawImage(preview(def),0,0,canvas.width,canvas.height);
  if(locked){c.globalCompositeOperation='source-in';c.fillStyle='#080d11';c.fillRect(0,0,canvas.width,canvas.height);}
  return canvas;
 }
 function header(){
  const count=definitions.filter(o=>store.state(o.id)!=='locked').length;
  summary.textContent=`${count} / ${definitions.length} DISCOVERED`;
  document.getElementById('collection-storage').hidden=store.persistent;
 }
 function renderGrid(){
  selected=null;title.textContent='ENCOUNTER FILES';back.textContent='CLOSE';detail.hidden=true;grid.hidden=false;grid.replaceChildren();header();
  for(const def of definitions){
   const state=store.state(def.id),locked=state==='locked',card=element(locked?'article':'button','collection-card');
   card.dataset.id=def.id;card.dataset.state=state;
   if(!locked){card.type='button';card.setAttribute('aria-label',`${COLLECTION_COPY[def.id]?.[0]||def.name}${state==='new'?', new encounter':''}`);card.onclick=()=>openDetail(def.id);}
   else card.setAttribute('aria-label','Unknown encounter. Meet it during a run to unlock.');
   card.append(portrait(def,locked),element('span','collection-card-name',locked?'???':COLLECTION_COPY[def.id]?.[0]||def.name));
   if(state==='new')card.append(element('span','collection-new','NEW'));
   grid.append(card);
  }
  dialog.querySelector('.collection-scroll').scrollTop=scroll;
 }
 function renderDetail(id){
  const def=byId.get(id);if(!def||store.state(id)==='locked'){renderGrid();return;}
  selected=id;title.textContent='ENCOUNTER FILE';back.textContent='← COLLECTION';grid.hidden=true;detail.hidden=false;detail.replaceChildren();
  try{
   const copy=COLLECTION_COPY[id]||[def.name,'A familiar face in an unfamiliar lane.'];
   const art=element('div','collection-detail-art');art.append(portrait(def,false));
   const info=element('div','collection-detail-copy');info.append(element('span','collection-id',`FILE ${String(definitions.indexOf(def)+1).padStart(2,'0')}`),element('h3','',copy[0]),element('p','collection-description',copy[1]));
   const properties=element('dl','collection-properties');
   for(const [label,value] of [['TYPE',def.category],['PLACEMENT',def.placement==='air'?'AIRBORNE':'GROUND'],['BIOME',def.biomes==='all'?'ANYWHERE':def.biomes.join(' / ')],['REACTIONS',def.reactions.hero.enabled&&def.reactions.obstacle.enabled?'MUTUAL':def.reactions.hero.enabled?'HERO REACTS':def.reactions.obstacle.enabled?'OBJECT REACTS':'NONE']]){
    properties.append(element('dt','',label),element('dd','',value));
   }
   info.append(properties);detail.append(art,info);
   store.view(id);header();
  }catch{
   detail.append(element('p','','This portrait could not load. Return to the collection and try again.'));
  }
  dialog.querySelector('.collection-scroll').scrollTop=0;back.focus({preventScroll:true});
 }
 function route(view,id){
  const url=new URL(location.href);url.hash=view==='detail'?`collection/${id}`:'collection';
  history.pushState({...history.state,teslaOnline:undefined,teslaCollection:{view,id}},'',url);
 }
 function openDetail(id){scroll=dialog.querySelector('.collection-scroll').scrollTop;route('detail',id);renderDetail(id);}
 function close(){dialog.close();afterClose?.();origin?.focus({preventScroll:true});}
 function goBack(){if(!dialog.open)return;history.back();}
 function restore(){
  const state=history.state?.teslaCollection;if(!state)return;
  if(!dialog.open){if(beforeOpen?.()===false)return;dialog.showModal();}
  if(state.view==='detail')renderDetail(state.id);else renderGrid();
 }
 back.onclick=goBack;dialog.addEventListener('cancel',event=>{event.preventDefault();goBack();});
 addEventListener('popstate',()=>{
  const state=history.state?.teslaCollection;
  if(!dialog.open){if(state)restore();return;}
  if(state?.view==='detail')renderDetail(state.id);
  else if(state?.view==='grid'){const last=selected;renderGrid();grid.querySelector(`button[data-id="${last}"]`)?.focus({preventScroll:true});}
  else close();
 });
 return {
  get isOpen(){return dialog.open;},
  restore,
  open(trigger){if(dialog.open||beforeOpen?.()===false)return;origin=trigger;scroll=0;renderGrid();route('grid');dialog.showModal();back.focus();},
 };
}
