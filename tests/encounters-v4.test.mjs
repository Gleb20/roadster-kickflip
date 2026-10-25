import test from 'node:test';
import assert from 'node:assert/strict';
import {makePattern,validateRoute} from '../src/routes.js';
import {createDirector} from '../src/director.js';
import {createFlight,createPace,createEconomy,collisionAt} from '../src/gameplay.js';
import {obstacleDefinition} from '../src/content.js';
import {createCollection,COLLECTION_KEY} from '../src/collection.js';
import {createEncounters,xiHands,lightningPaths} from '../src/encounters.js';
import {createRun} from '../src/run.js';

test('ground compatibility templates never form an aerial ceiling',()=>{
 for(const speed of [360,510,660,825])for(const kind of ['single','pair','precision','mixed','hover','incoming']){
  const obs=makePattern(kind,{speed,dx:1200});
  assert.ok(obs.length>0,kind);
  assert.ok(obs.every(o=>!o.altitude),`${kind}/${speed} must contain only ground hazards`);
  const pace=createPace();pace.progress=Math.min(150,(speed-360)/2);pace.base=Math.min(660,speed);pace.speed=speed;
  const economy=createEconomy();if(speed>660){economy.streak=.25;economy.streakLeft=4;}
  assert.ok(validateRoute(obs,{pace,economy,flight:createFlight(0),timingMargin:.035}),`${kind}/${speed}`);
 }
});

test('factory and spaceport generation use their own eligible ground pools',()=>{
 for(const biome of ['spaceport','tesla-factory']){
  const p=createFlight(100),pace=createPace(),economy=createEconomy();pace.progress=95;pace.speed=pace.base=550;
  const S={t:biome==='tesla-factory'?45:25,score:1000,speed:550,obs:[],entityId:0,anchor:0};
  let i=0;const d=createDirector({S,flight:p,pace,economy,spawnDistance:()=>1200,random:()=>((i++*37)%97)/97});
  const seen=new Set();for(let n=0;n<30;n++){S.obs=[];S.rails=[];d.update();d.state.restUntil=null;d.spawn();for(const o of S.obs){seen.add(o.id);const def=obstacleDefinition(o.id);assert.ok(def.biomes==='all'||def.biomes.includes(biome),`${o.id}/${biome}`);assert.notEqual(def.collision,'none');}}
  if(biome==='tesla-factory')assert.ok([...seen].some(id=>['bydSeal','xiaomiSu7','batteryAgv','t800'].includes(id)));
 }
});

test('Simpsons discovery migrates once while historical and viewed entries survive',()=>{
 let raw=JSON.stringify({version:1,entries:{simpsonsCouch:{firstEncounteredAt:10,firstViewedAt:20}}});
 const storage={getItem:k=>k===COLLECTION_KEY?raw:null,setItem:(k,v)=>{raw=v;}};
 const c=createCollection(storage,['homelessRow']);assert.equal(c.state('homelessRow'),'viewed');
 assert.deepEqual(c.snapshot().entries.simpsonsCouch,{firstEncounteredAt:10,firstViewedAt:20});
 assert.deepEqual(c.snapshot().entries.homelessRow,{firstEncounteredAt:10,firstViewedAt:20});
 assert.equal(createCollection(storage,['homelessRow']).state('homelessRow'),'viewed');
});

test('decorative updates never consume run RNG, score, fuel or commands',()=>{
 const a=createRun({seed:42}),b=createRun({seed:42}),effects=createEncounters();a.reset();b.reset();
 for(let i=0;i<400;i++){
  a.step();b.step();effects.update(1/120,{seed:42,wave:a.director.state.wave,route:a.director.state.last?.route,speed:a.S.speed,distance:a.S.distance,biome:'spaceport',obstacles:a.S.obs});
  assert.deepEqual(a.snapshot(),b.snapshot());
 }
 assert.equal(effects.state.actors.length,0);
});

test('two-way lightning endpoints follow both Xi hands through the pass and stay finite',()=>{
 for(const x of [-200,0,200]){
  const actor={...obstacleDefinition('xi'),x,altitude:0},hands=xiHands(actor),hero={x:20,y:-110};
  assert.equal(hands.length,2);assert.notDeepEqual(hands[0],hands[1]);
  for(const reduced of [false,true])for(const time of [0,.3,1]){
   for(const [from,to] of [[hero,hands[0]],[hands[1],hero]]){const points=lightningPaths(from,to,time,{reduced});assert.deepEqual(points[0],from);assert.deepEqual(points.at(-1),to);assert.ok(points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));}
  }
 }
});
