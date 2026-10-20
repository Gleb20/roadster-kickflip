// Staging-only long fixture. A separate, explicitly scoped SQL adjustment is
// needed for this QA session's start time; never relax the public timing check.
import {writeFile,readFile} from 'node:fs/promises';import {createRun,verifyReplay,RUN_STEP} from './rulesets/roadster-v342/run.js';import {ONLINE_API,ONLINE_PUBLIC_KEY} from '../src/online-config.js';
const headers={Origin:'https://gleb20.github.io',apikey:ONLINE_PUBLIC_KEY,Authorization:'Bearer '+ONLINE_PUBLIC_KEY,'Content-Type':'application/json'};
const req=async(path,body,cap)=>{const r=await fetch(ONLINE_API+path,{method:'POST',headers:{...headers,...(cap?{'X-Run-Capability':cap}:{})},body:JSON.stringify(body)});const b=await r.json();if(!r.ok)throw Error(JSON.stringify({status:r.status,error:b.error||b.message}));return b;};
if(process.argv[2]==='prepare'){
 const s=await req('sessions',{ruleset:'roadster-v3.4.2'}),r=createRun({seed:s.seed}),actions=new Map();r.reset();let wave=0;
 while(r.S.mode==='playing'&&r.S.tick<432000){
  for(const a of actions.get(r.S.tick)||[])r.command(a);r.step();r.drainEvents();
  if(r.S.t<3590&&r.director.state.wave!==wave){wave=r.director.state.wave;for(const e of r.director.state.last.route.actions){const tick=r.S.tick+Math.round(e.at/RUN_STEP),action={hold:'primary-down',jump:'primary-up','thrust-on':'thrust-on','thrust-off':'thrust-off'}[e.action];if(!actions.has(tick))actions.set(tick,[]);actions.get(tick).push(action);}}
 }
 const replay=r.replay();if(!replay||r.S.mode!=='dead'||r.S.t<3500)throw Error('Long fixture did not reach target duration');const expected=verifyReplay(replay);
 await writeFile('/tmp/tesla-supabase-hour-private.json',JSON.stringify({s,replay,expected}),{mode:0o600});console.log(JSON.stringify({sessionId:s.id,seconds:r.S.t,score:expected.score,events:replay.events.length}));
}else{
 const {s,replay,expected}=JSON.parse(await readFile('/tmp/tesla-supabase-hour-private.json','utf8'));
 await req('sessions/'+s.id,{nickname:'QA HOUR',replay},s.capability);let value,n=0;const timings=[];do{const started=performance.now();value=await req('verify',{sessionId:s.id,capability:s.capability});timings.push(performance.now()-started);n++;if(n>600)throw Error('Too many chunks');}while(value.continue);if(value.status!=='accepted'||JSON.stringify({score:value.entry.score,flips:value.entry.flips,ticks:value.entry.ticks})!==JSON.stringify(expected))throw Error('Hosted result mismatch');const report={passed:true,sessionId:s.id,publicId:value.entry.id,seconds:replay.ticks/120,score:expected.score,chunks:n,maxHttpMs:Math.max(...timings),totalHttpMs:timings.reduce((a,b)=>a+b),exactResult:true};await writeFile('/tmp/tesla-supabase-hour-remote.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}
