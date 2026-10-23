import {writeFile} from 'node:fs/promises';import {pathToFileURL} from 'node:url';import {decideVisible,observe} from './observe-visible.mjs';
const dir=process.argv[2],file=process.argv[3],seconds=Number(process.argv[4]||300),{createRun}=await import(pathToFileURL(dir+'/src/run.js'));
const {speedView}=await import(pathToFileURL(dir+'/src/speed-feedback.js'));const results=[];
for(const seed of [17,932,9,56]){
 const r=createRun({seed});r.reset();const c={lastLand:0,plan:null,flying:null},waves=[],events=[],jumps=[],slides=[];let wave=0,uid=0,catchAt=null;
 while(r.S.mode==='playing'&&r.S.t<seconds){
  const v=speedView(390,844,r.S.speed,r.director.state.viewStrength);decideVisible(r,c,(390-v.x)/v.scale);r.step();const es=r.drainEvents();observe(r,c,es);
  for(const e of es){if(e.type==='jump')jumps.push({time:r.S.t,charge:e.charge,kind:c.flying?.kind,flip:c.flying?.flip});
   if(e.type==='rail-catch')catchAt={time:r.S.t,speed:r.S.speed,rail:r.S.rails.find(x=>x.uid===r.G.support)};
   if(e.type==='rail-exit'&&catchAt){slides.push({from:catchAt.time,to:r.S.t,seconds:r.S.t-catchAt.time,speed:catchAt.speed,width:catchAt.rail?.w});catchAt=null;}
   if(['death','rescued','landing','pickup'].includes(e.type))events.push({time:r.S.t,...e});
  }
  if(wave!==r.director.state.wave){wave=r.director.state.wave;const obs=r.S.obs.filter(o=>o.uid>uid),rails=r.S.rails.filter(o=>o.uid>uid);uid=r.S.entityId;
   waves.push({time:r.S.t,kind:r.director.state.last?.kind,biome:r.director.state.last?.biome,speed:r.S.speed,grounds:obs.filter(o=>!o.altitude).map(o=>({id:o.id,x:o.x,w:o.w,h:o.h})),air:obs.filter(o=>o.altitude).map(o=>o.id),rails:rails.map(x=>({x:x.x,w:x.w}))});
  }
 }
 const counts={};for(const w of waves)counts[w.kind]=(counts[w.kind]||0)+1;
 results.push({seed,mode:r.S.mode,seconds:r.S.t,flips:r.E.flips,waves,jumps,slides,events,counts,lastObjects:r.S.obs,lastFlight:r.P});
 console.log(JSON.stringify({seed,mode:r.S.mode,seconds:r.S.t,flips:r.E.flips,counts,jumps:jumps.length,slides:slides.length,lastEvent:events.at(-1)}));
}
await writeFile(file,JSON.stringify({source:dir,routeActionReads:0,thrustUses:0,viewport:[390,844],recognitionDelay:.12,visibleObjectsOnly:true,noBlindFreestyle:true,results},null,2));
