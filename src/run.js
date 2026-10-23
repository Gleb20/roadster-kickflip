import {RAIL,createGrind,advanceRail,jumpFromRail} from './rails.js?v=4.4.1';
import {createBoosters,collectBooster,advanceBoosters,activeBooster,offerBooster} from './boosters.js?v=4.4.1';
import {GAMEPLAY as C} from './gameplay-config.js?v=4.4.1';
import {createFlight,launch,advanceFlight,createEconomy,advanceEconomy,advanceStreak,passObstacle,settleLanding,rewardAction,createPace,advancePace,stumble,sweptCollision,nearWindow} from './gameplay.js?v=4.4.1';
import {createFall,beginFall,advanceFall,hastenFall,fallPose} from './fall.js?v=4.4.1';
import {createDirector} from './director.js?v=4.4.1';
import {createRandom} from './random.js?v=4.4.1';
export const RULESET='roadster-v4.4.0',RUN_STEP=1/120;
export const RUN_COMMANDS=Object.freeze(['primary-down','primary-up','primary-cancel','thrust-on','thrust-off','cancel']);
const MAX_RECORDED_TICKS=120*60*60,MAX_RECORDED_EVENTS=24000;
/** The browser and verifier call this same simulation. Obstacles are rider-relative. */
export function createRun({seed=0,record=true,reducedMotion=false}={}){
 const S={mode:'menu',tick:0,t:0,distance:0,score:0,speed:C.startSpeed,next:1.7,obs:[],rails:[],entityId:0,anchor:0},Q=createBoosters(seed),G=createGrind(),P=createFlight(),E=createEconomy(),pace=createPace(),F=createFall(),input={charging:false,charge:0,spin:false,thrust:false};
 let random=createRandom(seed),events=[],log=[],lateId=null,lastLanding=null,recordable=true;
 const director=createDirector({S,flight:P,pace,economy:E,boosters:Q,random:()=>random.next(),relative:true,sceneTime:()=>S.t,spawnDistance:()=>Math.max(900,S.speed*1.5+180)});
 function clear(){Object.assign(input,{charging:false,charge:0,spin:false,thrust:false});P.thrusting=false;}
 function sync(){S.t=S.tick*RUN_STEP;S.speed=pace.speed;S.score=Math.floor(S.distance/20+E.bonus);}
 function reset(nextSeed=seed){seed=nextSeed;random=createRandom(seed);Object.assign(Q,createBoosters(seed));Object.assign(G,createGrind());Object.assign(P,createFlight());Object.assign(E,createEconomy());Object.assign(pace,createPace());Object.assign(F,createFall());Object.assign(S,{mode:'playing',tick:0,t:0,distance:0,score:0,speed:C.startSpeed,next:1.7,obs:[],rails:[],entityId:0,lastCharge:0});clear();events=[];log=[];lateId=null;lastLanding=null;recordable=true;director.reset();}
 function jump(){
  if(S.mode!=='playing'||P.airborne||F.active||pace.stumble>0)return false;
  lateId=null;for(const o of S.obs){if(o.altitude||o.passed)continue;if(nearWindow(o.x+(o.inset||5)-47,S.speed+(o.approachSpeed||0))){lateId=o.uid;break;}}
  const charge=input.charge;P.jumpFactor=activeBooster(Q,'jump')?1.25:1;if(G.support)jumpFromRail(G,P,charge);else{Q.spoiledFlight=false;launch(P,charge);}S.lastCharge=charge;input.charging=false;input.charge=0;input.spin=false;events.push({type:'jump',charge});return true;
 }
 function command(action){
  if(!RUN_COMMANDS.includes(action))throw Error('Unknown run command');
  if(S.mode!=='playing')return false;
  if(record&&recordable){if(log.length>=MAX_RECORDED_EVENTS)recordable=false;else log.push([S.tick,RUN_COMMANDS.indexOf(action)]);}
  if(action==='cancel'){clear();return true;}
  if(action==='primary-cancel'){input.spin=false;input.charging=false;input.charge=0;return true;}
  if(action==='thrust-off'){input.thrust=false;return true;}
  if(action==='thrust-on'){if(!F.active)input.thrust=true;return true;}
  if(action==='primary-up'){if(input.charging)jump();input.spin=false;return true;}
  if(F.active)return hastenFall(F);
  if(pace.stumble>0)return false;
  if(P.airborne){P.trickStarted=true;input.spin=true;}else{input.charging=true;input.charge=0;}return true;
 }
 function step(){
  if(S.mode!=='playing')return {landed:null,impacts:0};
  S.tick++;if(S.tick>MAX_RECORDED_TICKS)recordable=false;sync();
  if(input.charging)input.charge=Math.min(1,input.charge+RUN_STEP/C.chargeSeconds);
  advanceBoosters(Q,RUN_STEP);E.scoreFactor=activeBooster(Q,'score')?3:1;pace.boost=.35*Q.speedBlend;
  advanceEconomy(E,RUN_STEP);advanceStreak(E,RUN_STEP);
  // Accessibility changes the drawing, never collision geometry or ranked rules.
  const physicsFall=()=>fallPose({...F,reduced:false}),wasFalling=F.active,before={...P,fallPose:F.active?physicsFall():null};
  let landed=null,fallStep={impacts:0,finished:false};
  if(wasFalling){fallStep=advanceFall(F,RUN_STEP);if(fallStep.finished){clear();S.next=Math.max(S.next,.8);events.push({type:'recovered'});}}
  else landed=advanceFlight(P,RUN_STEP,{spin:input.spin,thrust:input.thrust});
  pace.falling=F.active;advancePace(pace,E,P,RUN_STEP);S.distance+=pace.speed*RUN_STEP;E.bonus+=pace.speed*RUN_STEP/20*(E.scoreFactor-1);sync();
  events.push(...advanceRail(G,P,before,S.rails,S.speed*RUN_STEP,RUN_STEP,E,{spoiled:Q.spoiledFlight,blocked:wasFalling}));
  if(G.support){landed=null;input.spin=false;}
  const after=wasFalling?{...P,fallPose:physicsFall()}:landed?{...P,angle:landed.angle}:P;
  for(const o of S.obs){const old=o.x;o.x-=(S.speed+(o.approachSpeed||0))*RUN_STEP;
   if(o.smashed){o.smashAge+=RUN_STEP;continue;}
   if(sweptCollision(before,after,o,old,o.x,S.t,RUN_STEP)){
    if(activeBooster(Q,'shield')){o.smashed=true;o.smashAge=0;if(!o.passed){o.passed=true;passObstacle(E);}events.push({type:'smash',obstacle:{...o}});continue;}
    if(Q.grace>0||Q.ghostIds.includes(o.uid)){if(!Q.ghostIds.includes(o.uid))Q.ghostIds.push(o.uid);}
    else if(Q.hearts>0){const oldMultiplier=E.multiplier;Q.hearts--;Q.grace=2;Q.ghostIds.push(o.uid);Q.spoiledFlight=true;G.pending=G.distance=G.turns=0;E.multiplier=10;E.meter=0;E.decay=0;E.streak=0;E.streakLeft=0;events.push({type:'rescued',oldMultiplier});}
    else {S.mode='dead';G.pending=G.distance=G.turns=0;clear();sync();events.push({type:'death',obstacle:o});return {landed,impacts:fallStep.impacts};}
   }
   if(!o.passed&&o.x+o.w< -50){o.passed=true;passObstacle(E);if(o.altitude)events.push({type:'air-passed'});}
  }
  for(const orb of Q.pickups){const old=orb.x;orb.x-=S.speed*RUN_STEP;
   const inReach=Math.min(old,orb.x)<=112&&Math.max(old,orb.x)>=-112&&Math.abs(P.y+78-orb.y)<=122;
   if(!F.active&&inReach&&collectBooster(Q,orb.id)){orb.collected=true;events.push({type:'pickup',id:orb.id,uid:orb.uid,x:orb.x,y:orb.y});}
  }
  Q.pickups=Q.pickups.filter(o=>!o.collected&&o.x> -180);
  Q.ghostIds=Q.ghostIds.filter(id=>S.obs.some(o=>o.uid===id&&o.x+o.w> -180));
  if(landed){let late=0,near=0;const target=S.obs.find(o=>o.uid===lateId);
   if(target&&!target.latePaid&&target.x+target.w-(target.inset||5)< -47){late=1;target.latePaid=true;}
   for(const o of S.obs){if(o.altitude||o.nearPaid)continue;if(nearWindow(-47-(o.x+o.w-(o.inset||5)),S.speed)){near++;o.nearPaid=true;}}
   if(!Q.spoiledFlight)landed={...landed,turns:landed.turns+G.turns};
   const grindPoints=landed.good&&!Q.spoiledFlight?G.pending:0,grindDistance=landed.good&&!Q.spoiledFlight?G.distance:0;
   const oldMultiplier=E.multiplier;lastLanding=settleLanding(E,P,Q.spoiledFlight?{...landed,turns:0,perfect:false}:landed,Q.spoiledFlight?{late:0,near:0}:{late,near});Q.spoiledFlight=false;
   E.bonus+=grindPoints;lastLanding.points+=grindPoints;Object.assign(lastLanding,{grindPoints,grindDistance});if(grindDistance>0){rewardAction(E);S.next=Math.max(S.next,RAIL.exitSeconds);}Object.assign(G,createGrind());
   if(!landed.good){stumble(pace);beginFall(F,landed,{reduced:reducedMotion,speed:pace.recovery.target});pace.falling=true;P.angle=0;P.omega=0;P.vx=0;P.grab=0;clear();advancePace(pace,E,P,0);}
   events.push({type:'landing',landed,result:lastLanding,late,near,oldMultiplier});lateId=null;
  }
  if(!P.airborne&&!G.support&&Math.abs(P.angle)>.001){P.angle*=Math.exp(-RUN_STEP*18);P.omega=0;}
  S.obs=S.obs.filter(o=>o.smashed?o.smashAge<1.2:o.uid===lateId||o.x+o.w>(o.id==='joe'?-480:-400));
  S.rails=S.rails.filter(r=>r.x+r.w> -200||r.uid===G.support);
  offerBooster(Q,{time:S.t,speed:S.speed,clear:!P.airborne&&!G.support&&!S.rails.length&&!F.active&&!pace.recovery&&S.obs.every(o=>o.passed)});
  S.next-=RUN_STEP;if(S.next<=0&&!Q.pickups.length)director.spawn();sync();return {landed,impacts:fallStep.impacts};
 }
 function snapshot(){return structuredClone({seed,S,P,E,pace,F,Q,G,input,random:random.state,director:director.state,lateId,lastLanding});}
 function restore(saved){seed=saved.seed;for(const [a,b] of [[G,saved.G],[Q,saved.Q],[S,saved.S],[P,saved.P],[E,saved.E],[pace,saved.pace],[F,saved.F],[input,saved.input],[director.state,saved.director]])Object.assign(a,structuredClone(b));random=createRandom(seed);random.restore(saved.random);lateId=saved.lateId;lastLanding=structuredClone(saved.lastLanding);events=[];}
 function replay(){return recordable?{format:1,ruleset:RULESET,seed,ticks:S.tick,events:log.map(e=>[...e])}:null;}
 return {S,P,E,pace,F,Q,G,input,director,reset,jump,command,step,sync,snapshot,restore,replay,drainEvents(){const next=events;events=[];return next;},get lastLanding(){return lastLanding;},get seed(){return seed;},get recordable(){return recordable;}};
}
export function validateReplay(value){
 if(!value||value.format!==1||value.ruleset!==RULESET||!Number.isInteger(value.seed)||value.seed<0||value.seed>0xffffffff||!Number.isInteger(value.ticks)||value.ticks<1||value.ticks>MAX_RECORDED_TICKS||!Array.isArray(value.events)||value.events.length>MAX_RECORDED_EVENTS)throw Error('Invalid or unsupported replay');
 let previous=-1;for(const event of value.events){if(!Array.isArray(event)||event.length!==2||!Number.isInteger(event[0])||event[0]<previous||event[0]<0||event[0]>=value.ticks||!Number.isInteger(event[1])||event[1]<0||event[1]>=RUN_COMMANDS.length)throw Error('Invalid replay input');previous=event[0];}return value;
}
export function verifyReplay(value){const replay=validateReplay(value),run=createRun({seed:replay.seed,record:false});run.reset();let event=0;while(run.S.tick<replay.ticks&&run.S.mode==='playing'){while(event<replay.events.length&&replay.events[event][0]===run.S.tick)run.command(RUN_COMMANDS[replay.events[event++][1]]);run.step();run.drainEvents();}if(run.S.mode!=='dead'||run.S.tick!==replay.ticks||event!==replay.events.length)throw Error('Replay does not end at its first collision');return {score:run.S.score,flips:run.E.flips,ticks:run.S.tick};}
