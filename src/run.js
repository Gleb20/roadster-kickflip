import {GAMEPLAY as C} from './gameplay-config.js?v=3.5.0';
import {createFlight,launch,advanceFlight,createEconomy,advanceEconomy,advanceStreak,passObstacle,settleLanding,createPace,advancePace,stumble,sweptCollision,nearWindow} from './gameplay.js?v=3.5.0';
import {createFall,beginFall,advanceFall,hastenFall,fallPose} from './fall.js?v=3.5.0';
import {createDirector} from './director.js?v=3.5.0';
import {createRandom} from './random.js?v=3.5.0';
export const RULESET='roadster-v3.4.2',RUN_STEP=1/120;
export const RUN_COMMANDS=Object.freeze(['primary-down','primary-up','primary-cancel','thrust-on','thrust-off','cancel']);
const MAX_RECORDED_TICKS=120*60*60,MAX_RECORDED_EVENTS=24000;
/** The browser and verifier call this same simulation. Obstacles are rider-relative. */
export function createRun({seed=0,record=true,reducedMotion=false}={}){
 const S={mode:'menu',tick:0,t:0,distance:0,score:0,speed:C.startSpeed,next:1.7,obs:[],entityId:0,anchor:0},P=createFlight(),E=createEconomy(),pace=createPace(),F=createFall(),input={charging:false,charge:0,spin:false,thrust:false};
 let random=createRandom(seed),events=[],log=[],lateId=null,lastLanding=null,recordable=true;
 const director=createDirector({S,flight:P,pace,economy:E,random:()=>random.next(),relative:true,sceneTime:()=>S.t,spawnDistance:()=>Math.max(900,S.speed*1.5+180)});
 function clear(){Object.assign(input,{charging:false,charge:0,spin:false,thrust:false});P.thrusting=false;}
 function sync(){S.t=S.tick*RUN_STEP;S.speed=pace.speed;S.score=Math.floor(S.distance/20+E.bonus);}
 function reset(nextSeed=seed){seed=nextSeed;random=createRandom(seed);Object.assign(P,createFlight());Object.assign(E,createEconomy());Object.assign(pace,createPace());Object.assign(F,createFall());Object.assign(S,{mode:'playing',tick:0,t:0,distance:0,score:0,speed:C.startSpeed,next:1.7,obs:[],entityId:0,lastCharge:0});clear();events=[];log=[];lateId=null;lastLanding=null;recordable=true;director.reset();}
 function jump(){
  if(S.mode!=='playing'||P.airborne||F.active||pace.stumble>0)return false;
  lateId=null;for(const o of S.obs){if(o.altitude||o.passed)continue;if(nearWindow(o.x+(o.inset||5)-47,S.speed+(o.approachSpeed||0))){lateId=o.uid;break;}}
  const charge=input.charge;launch(P,charge);S.lastCharge=charge;input.charging=false;input.charge=0;input.spin=false;events.push({type:'jump',charge});return true;
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
  advanceEconomy(E,RUN_STEP);advanceStreak(E,RUN_STEP);
  // Accessibility changes the drawing, never collision geometry or ranked rules.
  const physicsFall=()=>fallPose({...F,reduced:false}),wasFalling=F.active,before={...P,fallPose:F.active?physicsFall():null};
  let landed=null,fallStep={impacts:0,finished:false};
  if(wasFalling){fallStep=advanceFall(F,RUN_STEP);if(fallStep.finished){clear();S.next=Math.max(S.next,.8);events.push({type:'recovered'});}}
  else landed=advanceFlight(P,RUN_STEP,{spin:input.spin,thrust:input.thrust});
  pace.falling=F.active;advancePace(pace,E,P,RUN_STEP);S.distance+=pace.speed*RUN_STEP;sync();
  const after=wasFalling?{...P,fallPose:physicsFall()}:landed?{...P,angle:landed.angle}:P;
  for(const o of S.obs){const old=o.x;o.x-=(S.speed+(o.approachSpeed||0))*RUN_STEP;
   if(sweptCollision(before,after,o,old,o.x,S.t,RUN_STEP)){S.mode='dead';clear();sync();events.push({type:'death',obstacle:o});return {landed,impacts:fallStep.impacts};}
   if(!o.passed&&o.x+o.w< -50){o.passed=true;passObstacle(E);if(o.altitude)events.push({type:'air-passed'});}
  }
  if(landed){let late=0,near=0;const target=S.obs.find(o=>o.uid===lateId);
   if(target&&!target.latePaid&&target.x+target.w-(target.inset||5)< -47){late=1;target.latePaid=true;}
   for(const o of S.obs){if(o.altitude||o.nearPaid)continue;if(nearWindow(-47-(o.x+o.w-(o.inset||5)),S.speed)){near++;o.nearPaid=true;}}
   const oldMultiplier=E.multiplier;lastLanding=settleLanding(E,P,landed,{late,near});
   if(!landed.good){stumble(pace);beginFall(F,landed,{reduced:reducedMotion,speed:pace.recovery.target});pace.falling=true;P.angle=0;P.omega=0;P.vx=0;P.grab=0;clear();advancePace(pace,E,P,0);}
   events.push({type:'landing',landed,result:lastLanding,late,near,oldMultiplier});lateId=null;
  }
  if(!P.airborne&&Math.abs(P.angle)>.001){P.angle*=Math.exp(-RUN_STEP*18);P.omega=0;}
  S.obs=S.obs.filter(o=>o.uid===lateId||o.x+o.w>(o.id==='joe'?-480:-400));
  S.next-=RUN_STEP;if(S.next<=0)director.spawn();sync();return {landed,impacts:fallStep.impacts};
 }
 function snapshot(){return structuredClone({seed,S,P,E,pace,F,input,random:random.state,director:director.state,lateId,lastLanding});}
 function restore(saved){seed=saved.seed;for(const [a,b] of [[S,saved.S],[P,saved.P],[E,saved.E],[pace,saved.pace],[F,saved.F],[input,saved.input],[director.state,saved.director]])Object.assign(a,structuredClone(b));random=createRandom(seed);random.restore(saved.random);lateId=saved.lateId;lastLanding=structuredClone(saved.lastLanding);events=[];}
 function replay(){return recordable?{format:1,ruleset:RULESET,seed,ticks:S.tick,events:log.map(e=>[...e])}:null;}
 return {S,P,E,pace,F,input,director,reset,jump,command,step,sync,snapshot,restore,replay,drainEvents(){const next=events;events=[];return next;},get lastLanding(){return lastLanding;},get seed(){return seed;},get recordable(){return recordable;}};
}
export function validateReplay(value){
 if(!value||value.format!==1||value.ruleset!==RULESET||!Number.isInteger(value.seed)||value.seed<0||value.seed>0xffffffff||!Number.isInteger(value.ticks)||value.ticks<1||value.ticks>MAX_RECORDED_TICKS||!Array.isArray(value.events)||value.events.length>MAX_RECORDED_EVENTS)throw Error('Invalid or unsupported replay');
 let previous=-1;for(const event of value.events){if(!Array.isArray(event)||event.length!==2||!Number.isInteger(event[0])||event[0]<previous||event[0]<0||event[0]>=value.ticks||!Number.isInteger(event[1])||event[1]<0||event[1]>=RUN_COMMANDS.length)throw Error('Invalid replay input');previous=event[0];}return value;
}
export function verifyReplay(value){const replay=validateReplay(value),run=createRun({seed:replay.seed,record:false});run.reset();let event=0;while(run.S.tick<replay.ticks&&run.S.mode==='playing'){while(event<replay.events.length&&replay.events[event][0]===run.S.tick)run.command(RUN_COMMANDS[replay.events[event++][1]]);run.step();run.drainEvents();}if(run.S.mode!=='dead'||run.S.tick!==replay.ticks||event!==replay.events.length)throw Error('Replay does not end at its first collision');return {score:run.S.score,flips:run.E.flips,ticks:run.S.tick};}
