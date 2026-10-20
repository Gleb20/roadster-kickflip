import {validNickname,onlineMessage} from './online.js?v=3.7.1';
const el=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
export function createOnlineUI({client,beforeOpen,afterClose,currentRun}){
 const dialog=document.getElementById('online-dialog'),content=document.getElementById('online-content'),title=document.getElementById('online-title'),back=document.getElementById('online-close');
 let origin=null,view='list',page=1,snapshot,request=0,draft='',activeResult=null,fieldError=false,highlight=null;
 function status(text,error=false){const p=el('p',error?'online-error':'online-status',text);p.setAttribute('role',error?'alert':'status');return p;}
 function pendingList(){
  const jobs=client.pending;if(!jobs.length)return null;const section=el('section','online-pending'),heading=el('h3','','PENDING RESULTS');section.append(heading,el('p','online-hint','Retry only when you choose. Hiding a retry does not remove a score already sent online.'));
  for(const job of jobs){const row=el('div','online-job'),info=el('div');info.append(el('strong','',job.nickname),el('span','online-hint',`${job.status==='verifying'?'CHECKING':job.status==='sending'?'SENDING':job.status.toUpperCase()} · ${job.replay.ticks?Math.floor(job.replay.ticks/120)+'s':''}`));
   const retry=el('button','text-button','RETRY'),hide=el('button','text-button','HIDE');retry.type=hide.type='button';retry.disabled=['sending','verifying','rejected','unavailable'].includes(job.status);hide.disabled=['sending','verifying'].includes(job.status);
   retry.onclick=()=>retryJob(job);hide.onclick=()=>{client.remove(job.session.id);void list(page,snapshot);};row.append(info,retry,hide);section.append(row);if(job.error)section.append(status(onlineMessage(job.error),true));
  }return section;
 }
 function markAccepted(id,entry){const current=currentRun();if(current?.session?.id===id)current.entry=entry;}
 async function retryJob(job){const serial=++request;view='retry';content.replaceChildren(status('Checking this result. You can close this window and keep playing. The first connection may take about a minute.'));try{const result=await client.retry(job);if(result.status==='accepted')markAccepted(job.session.id,result.entry);if(serial!==request||!dialog.open)return;if(result.status==='accepted')success(result.entry);else{content.replaceChildren(status(onlineMessage(result.error||'verification_temporarily_unavailable'),true));appendBack();}}catch(error){if(serial!==request||!dialog.open)return;content.replaceChildren(status(onlineMessage(error.code),true));appendBack();}}
 function appendBack(){const button=el('button','primary','BACK TO TOP');button.type='button';button.onclick=()=>{snapshot=undefined;void list(1);};content.append(button);}
 async function list(nextPage=1,nextSnapshot){
  view='list';title.textContent='ALL-TIME TOP';const serial=++request;page=nextPage;snapshot=nextSnapshot;content.replaceChildren(status('Loading the leaderboard…'));back.textContent='CLOSE';
  try{const data=await client.list(page,snapshot);if(serial!==request||view!=='list')return;page=data.page;snapshot=data.snapshot;content.replaceChildren();
   const caption=el('p','online-hint',data.environment==='staging'?'TEST CIRCUIT · Scores are kept for the planned production move.':'ALL-TIME RESULTS');content.append(caption);
   if(!data.entries.length)content.append(status('No scores yet. Finish a connected run and post the first one.'));
   else{const table=el('table','online-table'),head=el('thead'),headrow=el('tr');for(const name of ['RANK','PILOT','SCORE']){const th=el('th','',name);th.scope='col';headrow.append(th);}head.append(headrow);table.append(head);const body=el('tbody');
    for(const entry of data.entries){const row=el('tr');if(entry.id===highlight){row.className='online-own-row';row.setAttribute('aria-current','true');}const rank=el('td'),badge=el('span',entry.rank<=3?'online-medal online-place-'+entry.rank:'',String(entry.rank));rank.append(badge);row.append(rank,el('td','online-pilot',entry.nickname),el('td','online-score',entry.score.toLocaleString()));body.append(row);}table.append(body);content.append(table);
   }
   const nav=el('nav','online-pagination');nav.setAttribute('aria-label','Leaderboard pages');const previous=el('button','text-button','← PREV'),next=el('button','text-button','NEXT →');previous.type=next.type='button';previous.disabled=page<=1;next.disabled=page>=data.pages;previous.onclick=()=>void list(page-1,snapshot);next.onclick=()=>void list(page+1,snapshot);nav.append(previous,el('span','',`${page} / ${data.pages}`),next);content.append(nav);
   const refresh=el('button','text-button','REFRESH TOP');refresh.type='button';refresh.onclick=()=>void list(1);content.append(refresh);const pending=pendingList();if(pending)content.append(pending);if(!client.persistent)content.append(status('Retry history is available for this window only. Keep it open until your result is confirmed.'));
  }catch(error){if(serial!==request||view!=='list')return;content.replaceChildren(status(onlineMessage(error.code),true));const retry=el('button','primary','RETRY LOADING');retry.type='button';retry.onclick=()=>void list(page,snapshot);content.append(retry);const pending=pendingList();if(pending)content.append(pending);}
 }
 async function showRank(id){
  view='rank';const serial=++request;title.textContent='YOUR WORLD RANK';content.replaceChildren(status('Finding your verified score…'));
  try{const rank=await client.entry(id);if(serial!==request||!dialog.open)return;highlight=id;void list(rank.page,rank.snapshot);}
  catch(error){if(serial!==request||!dialog.open)return;content.replaceChildren(status(onlineMessage(error.code),true));const retry=el('button','primary','RETRY LOADING');retry.onclick=()=>void showRank(id);content.append(retry);appendBack();}
 }
 function success(entry){
  if(!dialog.open)return;view='success';request++;title.textContent='SCORE POSTED';highlight=entry.id;
  content.replaceChildren(el('div','online-posted-score',entry.score.toLocaleString()),el('h3','online-posted-name',entry.nickname),status('Your verified score is now on the world leaderboard.'));
  const button=el('button','primary','VIEW MY RANK');button.type='button';button.onclick=()=>void showRank(entry.id);
  const share=el('button','text-button','SHARE SCORE ↗'),feedback=status('');share.type='button';feedback.hidden=true;
  share.onclick=async()=>{
   const serial=request,url=new URL(location.href);url.search='';url.hash='score/'+entry.id;
   const text=`${entry.nickname} scored ${entry.score.toLocaleString()} in Tesla Jump. Beat that flight!`;
   try{
    if(navigator.share)await navigator.share({title:'Tesla Jump',text,url:url.href});
    else if(navigator.clipboard){await navigator.clipboard.writeText(text+' '+url.href);if(serial===request){feedback.hidden=false;feedback.textContent='Score link copied.';}}
    else throw Error('clipboard');
   }catch(error){if(error.name==='AbortError'||serial!==request)return;feedback.hidden=false;feedback.textContent='Copy this public score link:';let input=content.querySelector('.online-share-link');if(!input){input=el('input','online-share-link');input.readOnly=true;input.setAttribute('aria-label','Public score link');content.append(input);}input.value=url.href;input.focus();input.select();}
  };
  content.append(button,share,feedback);
 }

 function submitView(){
  view='submit';request++;title.textContent='MAKE YOUR MARK';back.textContent='CLOSE';activeResult=currentRun();content.replaceChildren();
  if(!activeResult?.session||!activeResult.replay){content.append(status(onlineMessage(activeResult?.session?'invalid_replay':'local_run'),true));appendBack();return;}
  if(activeResult.entry){success(activeResult.entry);return;}
  const {score}=activeResult;content.append(el('div','online-posted-score',score.toLocaleString()),el('p','online-hint','Post this finished run with a public nickname. No account, email or real name is needed.'));
  const existing=client.pending.find(j=>j.session.id===activeResult.session.id),form=el('form','online-form'),label=el('label','','ARCADE NAME'),input=el('input'),hint=el('p','online-hint','3–12 letters or numbers. Spaces, - and _ are welcome.'),error=status('',true),button=el('button','primary',existing?'RETRY THIS RESULT':'POST SCORE');
  input.id='online-nickname';input.name='nickname';input.type='text';input.autocomplete='off';input.setAttribute('autocapitalize','characters');input.setAttribute('autocorrect','off');input.spellcheck=false;input.maxLength=24;input.value=existing?.nickname||draft;input.readOnly=!!existing;label.htmlFor=input.id;hint.id='online-name-hint';error.id='online-name-error';input.setAttribute('aria-describedby',hint.id+' '+error.id);error.hidden=true;button.type='submit';
  const validate=()=>{const valid=validNickname(input.value);error.hidden=valid;error.textContent=valid?'':onlineMessage('invalid_nickname');input.setAttribute('aria-invalid',String(!valid));fieldError=!valid;return valid;};input.onblur=validate;input.oninput=()=>{draft=input.value;if(fieldError)validate();};
  const progress=status(''),warning=status('Retry history is available for this window only. Keep it open until your result is confirmed.');warning.hidden=client.persistent;progress.hidden=true;
  form.append(label,input,hint,error,button);content.append(form,progress,warning);const browse=el('button','text-button','VIEW TOP & PENDING');browse.type='button';browse.onclick=()=>void list(1);content.append(browse);
  form.onsubmit=async event=>{event.preventDefault();if(button.disabled||!validate()){if(!button.disabled)input.focus();return;}const serial=request,attempt=activeResult;draft=input.value;input.readOnly=true;button.disabled=true;progress.hidden=false;progress.textContent='Checking this run. Longer runs take more time. You can close this window and keep playing; retry resumes saved progress.';
   try{const result=await client.submit(attempt.session,attempt.replay,input.value);if(result.status==='accepted')markAccepted(attempt.session.id,result.entry);if(serial!==request||view!=='submit')return;if(result.status==='accepted')success(result.entry);else{progress.textContent=onlineMessage(result.error||'verification_temporarily_unavailable');button.disabled=false;button.textContent='RETRY THIS RESULT';}}
   catch(error){if(serial!==request||view!=='submit')return;progress.textContent=onlineMessage(error.code);button.disabled=false;button.textContent='RETRY THIS RESULT';warning.hidden=client.persistent;}
  };
 }
 function close(){dialog.close();request++;afterClose?.();origin?.focus({preventScroll:true});}
 function restore(){let state=history.state?.teslaOnline;const score=location.hash.match(/^#score\/([0-9a-f-]{36})$/);if(!state&&(score||location.hash==='#leaderboard')){state=score?{view:'rank',id:score[1]}:{view:'list'};const base=new URL(location.href);base.hash='';history.replaceState({...history.state,teslaOnline:undefined},'',base);history.pushState({...history.state,teslaOnline:state},'',score?'#score/'+score[1]:'#leaderboard');}if(!state)return;if(!dialog.open){if(beforeOpen?.()===false)return;dialog.showModal();}if(state.view==='submit')submitView();else if(state.view==='rank')void showRank(state.id);else void list(1);}
 function open(trigger,kind='list'){if(dialog.open||beforeOpen?.()===false)return;origin=trigger;const url=new URL(location.href);url.hash=kind==='submit'?'post-score':'leaderboard';history.pushState({...history.state,teslaCollection:undefined,teslaOnline:{view:kind}},'',url);dialog.showModal();if(kind==='submit')submitView();else void list(1);back.focus();}
 back.onclick=()=>history.back();dialog.addEventListener('cancel',event=>{event.preventDefault();history.back();});addEventListener('popstate',()=>{if(history.state?.teslaOnline)restore();else if(dialog.open)close();});
 return {open,restore,refresh(){if(dialog.open&&view==='list'){const old=content.querySelector('.online-pending'),next=pendingList();if(old){if(next)old.replaceWith(next);else old.remove();}else if(next)content.append(next);}},get isOpen(){return dialog.open;}};
}
