import {OBSTACLES,AIR_TYPES} from './content.js?v=4.11.4';
import {makeRail,createGrind} from './rails.js?v=4.11.4';
import {createFlight,createEconomy} from './gameplay.js?v=4.11.4';

export const TUTORIAL_LESSONS=Object.freeze(['jump','charge','flip','thrust','rail','air','pickup']);
export const createTutorial=()=>({active:false,started:false,index:0,age:0,attempt:0,settle:0,earned:0,offset:0,ticks:0,charge:0,thrust:0,caught:false,cleared:false,jumped:false,collected:false,retry:false});
export const tutorialLesson=t=>TUTORIAL_LESSONS[t.index]||null;
// A fixed, seed-independent prefix; ordinary procedural generation resumes afterwards.
export function tutorialScene(t,{S,P,E,Q,G,pace},clear){
 clear();Object.assign(P,createFlight());Object.assign(G,createGrind());
 Object.assign(E,createEconomy());E.bonus=t.earned;
 Q.active={};Q.pickups=[];Q.hearts=0;Q.grace=0;Q.ghostIds=[];Q.speedBlend=0;Q.spoiledFlight=false;
 Object.assign(pace,{base:360,speed:360,boost:0,recovery:null,stumble:0,falling:false});
 Object.assign(t,{age:0,settle:0,charge:0,thrust:0,caught:false,cleared:false,jumped:false,collected:false,retry:false});
 S.obs=[];S.rails=[];S.next=2;
 const lesson=tutorialLesson(t),uid=()=>++S.entityId;
 if(lesson==='jump'||lesson==='charge')S.obs=[{...OBSTACLES.find(o=>o.id==='truck'),x:900,uid:uid(),passed:false}];
 if(lesson==='rail')S.rails=[{...makeRail(900,720),uid:uid()}];
 if(lesson==='air')S.obs=[{...AIR_TYPES.find(o=>o.altitude>=210),x:900,uid:uid(),approachSpeed:0,passed:false}];
 if(lesson==='pickup')Q.pickups=[{id:'score',x:650,y:90,uid:uid()}];
}
export function advanceTutorial(t,state,events,dt,clear){
 const {S,P,E,pace,G}=state,lesson=tutorialLesson(t);t.age+=dt;t.ticks++;
 // No repeat farming: distance and ordinary awards from protected practice are
 // excluded, with one fixed 25-point award for each genuinely completed lesson.
 t.offset=S.distance;E.bonus=t.earned;
 pace.base=pace.speed=360;pace.boost=0;E.streak=0;E.multiplier=10;
 for(const e of events){
  if(e.type==='jump'){t.jumped=true;t.charge=e.charge;}
  if(e.type==='rail-catch')t.caught=true;
  if(e.type==='air-passed'&&!P.airborne&&!t.jumped)t.cleared=true;
  if(e.type==='pickup')t.collected=true;
  if(e.type==='landing'){
   if(!e.landed.good)t.retry=true;
   else if(lesson==='jump'&&t.jumped&&S.obs.every(o=>o.passed)||lesson==='charge'&&t.charge>=.5&&S.obs.every(o=>o.passed)||lesson==='flip'&&e.landed.turns>=1||lesson==='thrust'&&t.thrust>=.18||lesson==='rail'&&t.caught&&e.result.grindDistance>=150)t.cleared=true;
  }
 }
 if(P.thrusting)t.thrust+=dt;
 if(lesson==='pickup'&&t.collected&&t.age>2)t.cleared=true;
 // A safe but missed attempt never completes a skill on a timer.
 if(!t.cleared&&!P.airborne&&!G.support&&((lesson==='jump'||lesson==='charge')&&S.obs.every(o=>o.passed)||lesson==='rail'&&S.rails.every(r=>r.passed)||lesson==='air'&&S.obs.every(o=>o.passed)&&!t.cleared||lesson==='pickup'&&!t.collected&&!state.Q.pickups.length))t.retry=true;
 if(t.retry){t.attempt++;tutorialScene(t,state,clear);events.push({type:'tutorial-retry',lesson});return;}
 if(t.cleared){t.settle+=dt;if(t.settle>=.9&&!P.airborne&&!G.support){
  t.earned+=25;t.index++;t.attempt=0;events.push({type:'tutorial-complete',lesson});
  if(t.index>=TUTORIAL_LESSONS.length){finishTutorial(t,state,clear);events.push({type:'tutorial-finished'});}
  else tutorialScene(t,state,clear);
 }}
 E.bonus=t.earned;
}
export function finishTutorial(t,{S,P,E,Q,G,pace},clear){
 clear();t.active=false;t.offset=S.distance;S.obs=[];S.rails=[];S.next=2;
 Object.assign(P,createFlight());Object.assign(G,createGrind());Object.assign(E,createEconomy());E.bonus=t.earned;
 Q.pickups=[];Q.hearts=0;Q.grace=0;Q.ghostIds=[];Q.speedBlend=0;Q.spoiledFlight=false;Q.nextAt=S.t+8;
 Object.assign(pace,{base:360,speed:360,progress:0,experienced:false,boost:0,recovery:null,stumble:0,falling:false});
}
export const tutorialTimeScale=t=>t.active&&!t.cleared?.38:1;
