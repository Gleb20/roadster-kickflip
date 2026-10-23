import {performance} from 'node:perf_hooks';
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const base=resolve(process.argv[2]||'/tmp/tesla-audio-v450-20261023');
const source=path=>pathToFileURL(resolve(base,path)).href;
const {createFlight,createPace,createEconomy,collisionAt}=await import(source('src/gameplay.js'));
const {AIR_TYPES,obstacleDefinition}=await import(source('src/content.js'));
const {makePattern,validateRoute}=await import(source('src/routes.js'));
const {speedView}=await import(source('src/speed-feedback.js'));
const samples=[];
for(const speed of [360,510,660,825,1113.75,1373.75])for(const kind of ['single','pair','precision','thrust']){
 const pace=createPace(),economy=createEconomy(),flight=createFlight(100);
 pace.progress=Math.max(0,Math.min(150,(speed-360)/2));pace.base=Math.min(speed,660);
 if(speed>=825){economy.streak=.25;economy.streakLeft=4;}
 if(speed>=1113.75)pace.boost=.35;
 if(speed>=1373.75)flight.vx=260;
 pace.speed=speed;
 const obs=makePattern(kind,{speed,type:obstacleDefinition('truck'),dx:Math.max(900,speed*1.5+180)});
 const start=performance.now(),route=validateRoute(obs,{flight,pace,economy,timingMargin:.035}),ms=performance.now()-start;
 samples.push({speed,kind,count:obs.length,span:obs.at(-1).x+obs.at(-1).w-obs[0].x,edgeGaps:obs.slice(1).map((o,i)=>+(o.x-obs[i].x-obs[i].w).toFixed(3)),route:route?{charge:route.charge,lead:route.lead,burn:route.burn,fuelUsed:route.fuelUsed}:null,ms:+ms.toFixed(3)});
}
const air=AIR_TYPES.map(o=>({id:o.id,altitude:o.altitude,w:o.w,h:o.h,hitsUprightGround:collisionAt(createFlight(),o,0),biomes:o.biomes}));
const visibility=[];for(const width of [320,390,844,1440])for(const speed of [360,660,825,1113.75]){
 const v=speedView(width,width>600?390:844,speed),visibleWorld=(width-v.x)/v.scale;
 visibility.push({width,speed,visibleWorld:+visibleWorld.toFixed(2),stationaryTTC:+((visibleWorld-47)/speed).toFixed(3),incoming110TTC:+((visibleWorld-47)/(speed+110)).toFixed(3)});
}
const report={base:'44579d2e5d44a5aec3d4f76192d2e2a145b71db7',version:'4.5.0',samples,air,visibility,notes:['Synthetic state matrix, not player success probability.','Timing is a single cold/warm mixed host measurement, not phone latency or a statistical benchmark.','1373.75 is multiplicative speed ceiling plus vx bound; individual reachable combinations require run tests.','Visibility uses settled camera and first screen-edge entry, not full silhouette or charge-ready visibility.']};
await writeFile(process.argv[3]||'/tmp/tesla-director-audit-20261023/audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
