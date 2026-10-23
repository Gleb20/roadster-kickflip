import {validNickname,onlineMessage,projectScore} from './online.js?v=4.7.0';
const el=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
export function createOnlineUI({client,beforeOpen,afterClose,currentRun}){
 const dialog=document.getElementById('online-dialog'),content=document.getElementById('online-content'),title=document.getElementById('online-title'),back=document.getElementById('online-close');
 let origin=null,view='list',request=0,draft='',activeResult=null,fieldError=false,source=null,focusId=null,currentPage=1,acceptedFocus=false;
 const message=(text,error=false)=>{const p=el('p',error?'online-error':'online-status',text);p.setAttribute('role',error?'alert':'status');return p;};
 const own=()=>client.entries.find(e=>e.sessionId===focusId);
 function render(){
  const entry=own(),data=projectScore(source,entry);currentPage=data.page;content.replaceChildren();
  if(!data.entries.length){content.append(message(source?'No scores yet. Make your mark.':'ALL-TIME TOP'));}
  else{
   const table=el('table','online-table'),head=el('thead'),hr=el('tr');for(const text of ['RANK','PILOT','SCORE']){const th=el('th','',text);th.scope='col';hr.append(th);}head.append(hr);table.append(head);const body=el('tbody');
   for(const e of data.entries){const row=el('tr',e.own?'online-own-row':'');if(e.own)row.setAttribute('aria-current','true');const cell=el('td'),badge=el('span',e.rank&&e.rank<=3?'online-medal online-place-'+e.rank:'',e.rank?String(e.rank):'—');cell.append(badge);row.append(cell,el('td','online-pilot',e.nickname),el('td','online-score',e.score.toLocaleString()));body.append(row);}table.append(body);content.append(table);
  }
  const nav=el('nav','online-pagination');nav.setAttribute('aria-label','Leaderboard pages');const previous=el('button','text-button','← PREV'),next=el('button','text-button','NEXT →');previous.type=next.type='button';previous.disabled=data.page<=1;next.disabled=data.page>=data.pages;previous.onclick=()=>void list(data.page-1,focusId);next.onclick=()=>void list(data.page+1,focusId);nav.append(previous,el('span','',`${data.page} / ${data.pages}`),next);content.append(nav);
  const play=el('button','primary','BACK TO GAME'),refresh=el('button','text-button','REFRESH TOP');play.type=refresh.type='button';play.onclick=()=>{history.back();};refresh.onclick=()=>void list(1,null);content.append(play,refresh);
  if(entry?.accepted){const share=el('button','text-button','SHARE SCORE ↗');share.type='button';share.onclick=async()=>{const url=new URL(location.href);url.search='';url.hash='score/'+entry.id;const text=`${entry.nickname} scored ${entry.score.toLocaleString()} in Tesla Jump.`;try{if(navigator.share)await navigator.share({title:'Tesla Jump',text,url:url.href});else if(navigator.clipboard){await navigator.clipboard.writeText(text+' '+url.href);share.textContent='LINK COPIED';}}catch{}};content.append(share);}
 }
 async function list(page=null,focused=focusId){
  view='list';title.textContent='ALL-TIME TOP';back.textContent='CLOSE';const serial=++request;focusId=focused;source=client.cached;acceptedFocus=!!own()?.accepted;render();
  try{
   const entry=own();let data;
   if(entry?.accepted){const rank=await client.entry(entry.id);data=await client.list(page||rank.page);}
   else if(entry)data=await client.preview(entry.score,page);
   else data=await client.list(page||1);
   if(serial!==request||view!=='list')return;source=data;render();
  }catch{if(serial!==request||view!=='list')return;if(!source&&!own()){content.replaceChildren(message('The leaderboard is unavailable right now.'));const refresh=el('button','primary','REFRESH TOP');refresh.type='button';refresh.onclick=()=>void list(page,focused);content.append(refresh);}}
 }
 async function showRank(id){
  view='list';title.textContent='ALL-TIME TOP';const serial=++request;focusId=null;source=client.cached;render();
  try{const rank=await client.entry(id),data=await client.list(rank.page,rank.snapshot);if(serial!==request)return;source={...data,entries:data.entries.map(e=>({...e,own:e.id===id}))};render();}catch{if(serial===request)content.replaceChildren(message(onlineMessage('network')));}
 }
 function submitView(){
  view='submit';request++;title.textContent='MAKE YOUR MARK';back.textContent='CLOSE';activeResult=currentRun();content.replaceChildren();
  if(!activeResult?.session||!activeResult.replay){content.append(message(onlineMessage('local_run'),true));return;}
  const existing=client.lookup(activeResult.session.id);
  if(existing){void list(null,activeResult.session.id);return;}
  if(activeResult.entry){void showRank(activeResult.entry.id);return;}
  content.append(el('div','online-posted-score',activeResult.score.toLocaleString()),el('p','online-hint','Choose your arcade name.'));
  const form=el('form','online-form'),label=el('label','','ARCADE NAME'),input=el('input'),hint=el('p','online-hint','3–12 letters or numbers. Spaces, - and _ are welcome.'),error=message('',true),button=el('button','primary','SUBMIT SCORE');
  input.id='online-nickname';input.name='nickname';input.type='text';input.autocomplete='off';input.setAttribute('autocapitalize','characters');input.setAttribute('autocorrect','off');input.spellcheck=false;input.maxLength=24;input.value=draft;label.htmlFor=input.id;hint.id='online-name-hint';error.id='online-name-error';input.setAttribute('aria-describedby',hint.id+' '+error.id);error.hidden=true;button.type='submit';
  const validate=()=>{const valid=validNickname(input.value);error.hidden=valid;error.textContent=valid?'':onlineMessage('invalid_nickname');input.setAttribute('aria-invalid',String(!valid));fieldError=!valid;return valid;};input.onblur=validate;input.oninput=()=>{draft=input.value;if(fieldError)validate();};form.append(label,input,hint,error,button);content.append(form);
  form.onsubmit=async event=>{event.preventDefault();if(button.disabled||!validate())return;const serial=request,attempt=activeResult;draft=input.value;button.disabled=true;
   try{await client.submit(attempt.session,attempt.replay,input.value,attempt.score);if(serial!==request||!dialog.open)return;const url=new URL(location.href);url.hash='leaderboard';history.replaceState({...history.state,teslaOnline:{view:'list'}},'',url);void list(null,attempt.session.id);}
   catch(e){if(serial!==request)return;error.hidden=false;error.textContent=onlineMessage(e.code);button.disabled=false;}
  };
 }
 function close(){dialog.close();request++;afterClose?.();origin?.focus({preventScroll:true});}
 function restore(){let state=history.state?.teslaOnline;const score=location.hash.match(/^#score\/([0-9a-f-]{36})$/);if(!state&&(score||location.hash==='#leaderboard')){state=score?{view:'rank',id:score[1]}:{view:'list'};const base=new URL(location.href);base.hash='';history.replaceState({...history.state,teslaOnline:undefined},'',base);history.pushState({...history.state,teslaOnline:state},'',score?'#score/'+score[1]:'#leaderboard');}if(!state)return;if(!dialog.open){if(beforeOpen?.()===false)return;dialog.showModal();}if(state.view==='submit')submitView();else if(state.view==='rank')void showRank(state.id);else void list(null,client.entries.filter(e=>!e.accepted).at(-1)?.sessionId||null);}
 function open(trigger,kind='list'){if(dialog.open||beforeOpen?.()===false)return;origin=trigger;const url=new URL(location.href);url.hash=kind==='submit'?'post-score':'leaderboard';history.pushState({...history.state,teslaCollection:undefined,teslaOnline:{view:kind}},'',url);dialog.showModal();if(kind==='submit')submitView();else void list(null,client.entries.filter(e=>!e.accepted).at(-1)?.sessionId||null);back.focus();}
 back.onclick=()=>history.back();dialog.addEventListener('cancel',event=>{event.preventDefault();history.back();});addEventListener('popstate',()=>{if(history.state?.teslaOnline)restore();else if(dialog.open)close();});
 return {open,restore,refresh(){if(dialog.open&&view==='list'){if(focusId&&!own()){void list(null,null);return;}const accepted=!!own()?.accepted;if(accepted&&!acceptedFocus){acceptedFocus=true;void list(null,focusId);}else render();}},get isOpen(){return dialog.open;}};
}
