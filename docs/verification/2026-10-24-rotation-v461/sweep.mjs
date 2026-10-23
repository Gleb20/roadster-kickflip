import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const baseline=process.argv[2]||'/tmp/tesla-rotation-before-20261024',candidate=process.argv[3]||process.cwd();
const load=async root=>({...await import(pathToFileURL(path.join(root,'src/gameplay.js'))),...await import(pathToFileURL(path.join(root,'src/rails.js')))});
const A=await load(baseline),B=await load(candidate),dt=1/120,deg=x=>x*180/Math.PI;
function flight(api,{charge,factor,rail,profile,hold,extend=0}){
 const p=api.createFlight(profile==='none'?0:100);p.jumpFactor=factor;
 if(rail){p.y=182;api.jumpFromRail({...api.createGrind(),support:1},p,charge);}else api.launch(p,charge);
 let eligible=false,release=null,r;
 for(let tick=0;tick<1500;tick++){
  const spin=tick<hold,thrust=profile==='through-release'?tick>=12:profile==='late-thrust'?tick>=108:profile==='pulsed'?(tick<12||tick>=110&&tick<130):false;
  if(tick===hold){release={angle:deg(p.angle),omega:p.omega};p.y+=extend;}
  r=api.advanceFlight(p,dt,{spin,thrust});eligible ||= !!p.settleTarget;
  if(r)return {good:r.good,perfect:r.perfect,angle:deg(r.angle),omega:r.omega,turns:r.turns,time:(tick+1)*dt,eligible,release};
 }
 throw Error('no contact');
}
const windows=(rows,key)=>{const out=[];for(const row of rows){if(!row[key])continue;const last=out.at(-1);if(last&&last[1]===row.hold-1)last[1]=row.hold;else out.push([row.hold,row.hold]);}return out;};
const groups=[],changes=[],totals={cases:0,failToSafe:0,failToPerfect:0,safeToFail:0,perfectToSafe:0,safeToPerfect:0,turnChanges:0};
for(const charge of [0,.25,.5,.75,1])for(const factor of [1,1.25])for(const rail of [false,true])for(const profile of ['none','through-release','late-thrust','pulsed']){
 const a=[],b=[],changed=[];
 for(let hold=0;hold<=300;hold++){
  const input={charge,factor,rail,profile,hold},old=flight(A,input),now=flight(B,input);a.push({hold,...old});b.push({hold,...now});totals.cases++;
  const diff=Object.keys(totals).filter(k=>k!=='cases');
  const flags={failToSafe:!old.good&&now.good,failToPerfect:!old.good&&now.perfect,safeToFail:old.good&&!now.good,perfectToSafe:old.perfect&&now.good&&!now.perfect,safeToPerfect:old.good&&!old.perfect&&now.perfect,turnChanges:old.turns!==now.turns};
  for(const k of diff)if(flags[k])totals[k]++;
  if(Object.values(flags).some(Boolean)){const row={...input,old,now,flags};changes.push(row);changed.push(hold);}
 }
 groups.push({charge,factor,rail,profile,baseline:{safe:windows(a,'good'),perfect:windows(a,'perfect')},candidate:{safe:windows(b,'good'),perfect:windows(b,'perfect'),eligible:windows(b,'eligible')},changed});
}
const target=[0,500,1500,4000].map(extend=>({extend,baseline:flight(A,{charge:1,factor:1.25,rail:false,profile:'none',hold:96,extend}),candidate:flight(B,{charge:1,factor:1.25,rail:false,profile:'none',hold:96,extend})}));
const output={description:'Fixed 120 Hz controlled flights, including actual jumpFromRail. Counts are not human success probabilities. hold and windows are physics ticks.',baseline,candidate,totals,target,groups,changes};
fs.writeFileSync(new URL('./sweep.json',import.meta.url),JSON.stringify(output,null,2));
console.log(JSON.stringify({totals,target,regressions:changes.filter(r=>r.flags.safeToFail||r.flags.perfectToSafe)},null,2));
