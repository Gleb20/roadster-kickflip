// Independent input policy: reads objects and flight, never director.route.
function decideSeen(r,c){
 const send=a=>{r.command(a);c.commands?.push({tick:r.S.tick,action:a});};
 if(r.F.active||r.pace.stumble>0){if(r.input.charging||r.input.spin)send('primary-cancel');c.plan=null;return;}
 if(r.G.support){if(r.input.charging||r.input.spin)send('primary-cancel');return;}
 if(r.P.airborne){
  if(c.flying?.flip&&!r.P.trickStarted&&r.P.time>=.05)send('primary-down');
  if(r.input.spin&&r.P.angle<=-5)send('primary-up');
  return;
 }
 const grounds=r.S.obs.filter(o=>!o.altitude&&!o.smashed&&!o.passed&&o.x+(o.inset||5)>47).sort((a,b)=>a.x-b.x);
 const g=grounds[0],rail=r.S.rails.filter(o=>o.x+o.w>0&&o.x>=-30).sort((a,b)=>a.x-b.x)[0];
 const air=r.S.obs.some(o=>o.altitude&&o.x+o.w>-60&&o.x/(r.S.speed+(o.approachSpeed||0))<2.5);
 const gt=g?(g.x+(g.inset||5)-47)/r.S.speed:Infinity,rt=rail?rail.x/r.S.speed:Infinity;
 const canCatch=rail&&(!g||rail.x<=g.x+60&&g.x+g.w<rail.x+rail.w-80);
 const key=canCatch?'rail:'+rail.uid:g?'ground:'+g.uid:null;
 if(c.plan?.key!==key){if(r.input.charging)send('primary-cancel');c.plan=null;}
 if(!key)return;
 if(!c.plan){
  if(canCatch)c.plan={key,kind:'rail',charge:.5,lead:air?.15:.35,flip:false,uid:rail.uid};
  else if(g){const next=grounds[1],gap=next?(next.x-g.x)/r.S.speed:Infinity;
   const flip=!air&&!rail&&gap>2.2&&g.h<=94&&gt>1&&(r.S.t-c.lastLand>.25||gt>1.2);
   c.plan={key,kind:'ground',uid:g.uid,flip,charge:flip?.75:g.h<=45?.08:g.h<=78?.25:g.h<=100?.35:.45,lead:flip?.5:g.h<=45?.2:g.h<=78?.24:.32};
  }else c.plan={key,kind:'free',charge:.75,lead:0,flip:true};
 }
 const p=c.plan,ttc=p.kind==='rail'?rt:gt;
 if(!r.input.charging&&(p.kind==='free'||ttc<=p.charge*.4+p.lead))send('primary-down');
 if(r.input.charging&&r.input.charge+1e-8>=p.charge){c.flying={...p};send('primary-up');c.plan=null;}
}
export function observe(r,c,events){for(const e of events){
 if(e.type==='landing'){c.lastLand=r.S.t;c.flying=null;c.plan=null;}
 if(e.type==='rail-catch'){c.flying=null;c.plan=null;}
}}

export function decideVisible(r,c,sight){
 c.firstSeen??=new Map();
 const seen=(o,isRail=false)=>{if(o.x>sight-20)return false;const key=(isRail?'rail:':'obstacle:')+o.uid;if(!c.firstSeen.has(key))c.firstSeen.set(key,r.S.t);return r.S.t-c.firstSeen.get(key)>=.12;};
 const sensed={...r,S:{...r.S,obs:r.S.obs.filter(o=>seen(o)),rails:r.S.rails.filter(o=>seen(o,true))}};
 decideSeen(sensed,c);
}
