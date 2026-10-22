import test from 'node:test';
import assert from 'node:assert/strict';
import {GAMEPLAY as C} from '../src/gameplay-config.js';
import {createFlight,launch,advanceFlight,createEconomy,advanceEconomy,advanceStreak,passObstacle,settleLanding,createPace,advancePace,stumble,recoverySpeed,uprightError,collisionAt,sweptCollision,nearWindow,TAU,rewardAction} from '../src/gameplay.js';
import {makePattern,validateRoute,stageAt} from '../src/routes.js';
import {createCoach} from '../src/coaching.js';
import {createDirector} from '../src/director.js';
const dt=1/120,near=(a,b,eps=1e-7)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
function flight(q,hold,{fuel=0,burn=0,delay=0,spinDelay=0}={}){const p=createFlight(fuel);launch(p,q);for(let t=0;t<6;t+=dt){const r=advanceFlight(p,dt,{spin:t>=spinDelay&&t<spinDelay+hold,thrust:t>=delay&&t<delay+burn});if(r)return {p,r,t};}throw Error('Flight did not land');}

test('tap cannot land a flip; charged grabs have bounded release windows',()=>{
 for(const q of [0])for(let hold=.3;hold<1.4;hold+=.01){const {r}=flight(q,hold);assert.ok(!r.good||r.turns===0,`unexpected flip at ${q}/${hold}`);}
 const {r}=flight(.5,.8);assert.equal(r.good,true);assert.equal(r.turns,1);
 assert.equal(flight(.5,2).r.good,false,'assistance must not guarantee a landing');
 const double=flight(1,1.55,{fuel:100,delay:0,burn:.65,spinDelay:.65});assert.equal(double.r.good,true);assert.equal(double.r.turns,2);
});
test('thrust has local roof direction, finite fuel and no ground consumption',()=>{
 for(const angle of [0,Math.PI/2,Math.PI,3*Math.PI/2]){const p=createFlight(50);launch(p,1);p.angle=angle;const baseline={...p};advanceFlight(p,dt,{thrust:true});advanceFlight(baseline,dt);const vy=p.vy-baseline.vy,vx=p.vx-baseline.vx;if(angle===0)assert.ok(vy>0);if(angle===Math.PI/2)assert.ok(vx>0);if(angle===Math.PI)assert.ok(vy<0);if(angle===3*Math.PI/2)assert.ok(vx<0);near(p.fuel,50-C.fuelPerSecond*dt);assert.equal(p.latched,true);}
 const grounded=createFlight(50);advanceFlight(grounded,1,{thrust:true});assert.equal(grounded.fuel,50);
 const p=createFlight(.1);launch(p,1);advanceFlight(p,dt,{thrust:true});assert.equal(p.fuel,0);advanceFlight(p,dt,{thrust:true});assert.equal(p.thrusting,false);assert.equal(p.latched,true);
});
test('upright error preserves tie direction; releasing never invents rotation or duplicates turns',()=>{
 near(uprightError(Math.PI,-1),Math.PI);near(uprightError(Math.PI,1),-Math.PI);
 for(const angle of [.8,-.8]){const p=createFlight();launch(p,1);p.angle=angle;advanceFlight(p,dt);near(p.angle,angle);near(p.omega,0);}
 const p=createFlight();launch(p,1);p.angle=-TAU*2;p.maxTurn=TAU*2;p.turns=2;for(let i=0;i<20;i++)advanceFlight(p,dt);assert.equal(p.turns,2,'no duplicate turn from boundary jitter');
});
test('only landed flips refill fuel; failed landing resets series but preserves tank',()=>{
 const e=createEconomy(),p=createFlight(20);passObstacle(e);assert.equal(e.bonus,50);
 const result=settleLanding(e,p,{good:true,turns:2},{late:1,near:1});assert.equal(result.points,350);assert.equal(e.multiplier,14);assert.equal(p.fuel,70);assert.equal(e.flips,2);near(e.streak,.05);
 const oldBonus=e.bonus;settleLanding(e,p,{good:false,turns:3},{late:1,near:1});assert.equal(e.bonus,oldBonus);assert.equal(p.fuel,70);assert.equal(e.multiplier,10);assert.equal(e.streak,0);
});
test('integer tenths cap at x5; support expires faster at high multipliers; refresh resets decay',()=>{
 const a=createEconomy(),b=createEconomy();rewardAction(a);rewardAction(b,100);assert.equal(b.multiplier,50);
 advanceEconomy(a,3.3);advanceEconomy(b,3.3);assert.ok(a.meter>0);assert.equal(b.meter,0);
 advanceEconomy(b,.4);assert.equal(b.multiplier,49);rewardAction(b);assert.equal(b.multiplier,50);assert.equal(b.decay,0);assert.equal(b.meter,1);
 advanceEconomy(b,100);assert.equal(b.multiplier,10);
});
test('speed series increases once per landing and expires continuously across a long tick',()=>{
 const e=createEconomy(),p=createFlight();for(let i=0;i<10;i++)settleLanding(e,p,{good:true,turns:2},{near:1});near(e.streak,.25);assert.equal(e.streakLeft,4);advanceStreak(e,4.5);near(e.streak,.2);advanceStreak(e,3);near(e.streak,0);
});
test('recovery duration grows nonlinearly and rejoins original ramp without hidden progress',()=>{
 const durations=[];
 for(const progress of [0,75,150]){const pace=createPace(),e=createEconomy(),p=createFlight();pace.progress=progress;advancePace(pace,e,p,0);const target=pace.base;stumble(pace);const r={...pace.recovery};durations.push(r.duration);near(pace.base,target*.55);
  const t1=r.duration*.2,t2=r.duration*.4;assert.ok(recoverySpeed(r,t2)-recoverySpeed(r,t1)>recoverySpeed(r,t1)-recoverySpeed(r,0));
  let previous=pace.base;while(pace.recovery){advancePace(pace,e,p,dt);assert.ok(pace.base>=previous-1e-6);previous=pace.base;}near(pace.base,target);near(pace.progress,progress);
  advancePace(pace,e,p,dt);near(pace.progress,progress+dt);near(pace.base,Math.min(660,target+2*dt));
  const eps=1e-6,endDerivative=(recoverySpeed(r,r.duration)-recoverySpeed(r,r.duration-eps))/eps;near(endDerivative,target>=660?0:2,.02);
 }
 assert.ok(durations[0]<durations[1]&&durations[1]<durations[2]);
});
test('near windows include exact boundary and exclude collision and distant cases',()=>{
 assert.equal(nearWindow(43.2,360),true);assert.equal(nearWindow(43.201,360),false);assert.equal(nearWindow(-.001,360),false);
});
test('air hitboxes include upper/lower bounds and swept collision catches tunnelling',()=>{
 const p=createFlight();const drone={id:'hoverDrone',w:92,h:40,inset:8,altitude:300};assert.equal(collisionAt(p,drone,0),false);p.y=220;assert.equal(collisionAt(p,drone,0),true);p.y=350;assert.equal(collisionAt(p,drone,0),false);
 assert.equal(sweptCollision({y:0,angle:0},{y:0,angle:0},{id:'truck',w:30,h:41},150,-150,1,dt),true);
 p.y=0;p.angle=Math.PI/2;assert.equal(collisionAt(p,{id:'truck',w:30,h:100},60),true,'rotation changes silhouette');
});
test('route validation clones state, rejects fuel-less thrust trains and validates all stages',()=>{
 for(const speed of [360,510,660]){const pace=createPace();pace.progress=(speed-360)/2;pace.base=pace.speed=speed;const e=createEconomy(),p=createFlight(100),initial=JSON.stringify({pace,e,p});
  for(const kind of ['single','pair','hover','incoming','precision','mixed','thrust']){const result=validateRoute(makePattern(kind,{speed,dx:1000}),{pace,economy:e,flight:p});assert.ok(result,`${kind}/${speed}`);assert.equal(result.clearanceVerified,true);assert.equal(result.exit.y,0);}
  assert.equal(JSON.stringify({pace,e,p}),initial);
  assert.equal(validateRoute(makePattern('thrust',{speed,dx:1000}),{pace,economy:e,flight:createFlight(0)}),null);
 }
 assert.deepEqual([0,15,35,60,90,120,150].map(stageAt),[0,1,2,3,4,5,6]);
});
test('seeded directors use breathers, grounded entrances, recoverable empty-fuel fallback',()=>{
 let seed=17;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(const progress of [0,20,40,65,95,130,160]){const pace=createPace();pace.progress=progress;pace.base=pace.speed=360+300*Math.min(1,progress/150);const p=createFlight(0),e=createEconomy(),S={t:progress,speed:pace.speed,obs:[],anchor:100,entityId:0};const d=createDirector({S,flight:p,pace,economy:e,spawnDistance:()=>1200,random});for(let i=0;i<10;i++){S.obs=[];d.spawn();assert.ok(S.obs.length);assert.ok(d.state.last.route);if(i%5===4)assert.equal(d.state.last.kind,'single');}}
});
test('coaching is contextual, persistent, dismissible and never blocks controls',()=>{
 let writes=0;const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>{writes++;data.set(k,v);}};
 const c=createCoach(storage);assert.equal(c.next(0).id,'jump');c.complete('jump');for(let i=0;i<120;i++)c.complete('jump');assert.equal(writes,1);assert.equal(c.next(0),null);assert.equal(c.next(36).id,'thrust');c.dismiss(36);assert.equal(c.next(37),null);assert.equal(createCoach(storage).done.jump,true);c.reset();assert.deepEqual(c.done,{});
 assert.doesNotThrow(()=>createCoach({getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}}).complete('jump'));
});

test('new flight/pace/economy are invariant under 30/60/120 Hz and uneven display schedules',async()=>{
 const {createClock}=await import('../src/clock.js');
 const run=stamps=>{const c=createClock(),p=createFlight(100),e=createEconomy(),pace=createPace();let t=0,last=0;for(const stamp of stamps)c.advance(stamp,step=>{if(t>=.2&&last===0){launch(p,1);last=1;}const result=advanceFlight(p,step,{thrust:t>.3&&t<.8,spin:t>.9&&t<2.2});advanceEconomy(e,step);advanceStreak(e,step);advancePace(pace,e,p,step);if(result){settleLanding(e,p,result);if(!result.good)stumble(pace);}t+=step;});return {p,e,pace,t};};
 const uniform=fps=>Array.from({length:fps*10+1},(_,i)=>i*1000/fps),baseline=run(uniform(30));
 for(const fps of [60,120])assert.deepEqual(run(uniform(fps)),baseline);
 const stamps=[0],gaps=[8,17,33,12,45,24];let i=0;while(stamps.at(-1)<10000)stamps.push(Math.min(10000,stamps.at(-1)+gaps[i++%gaps.length]));assert.deepEqual(run(stamps),baseline);
});

test('precision patterns retain a short ground group and forgiving timing without an aerial ceiling',()=>{
 for(const speed of [360,510,660,825]){const pace=createPace(),e=createEconomy();pace.progress=Math.min(150,(speed-360)/2);pace.base=Math.min(660,speed);pace.speed=speed;if(speed>660){e.streak=.25;e.streakLeft=4;}
  const obs=makePattern('precision',{speed,dx:1200}),air=obs.filter(o=>o.altitude),ground=obs.filter(o=>!o.altitude);
  assert.equal(air.length,0);assert.ok(ground.length<=3);
  const route=validateRoute(obs,{pace,economy:e,flight:createFlight(0),timingMargin:C.routeTimingMargin});assert.ok(route,`speed ${speed}`);assert.equal(route.timingMargin,C.routeTimingMargin);
  for(const offset of [-C.routeTimingMargin,C.routeTimingMargin])assert.ok(validateRoute(obs,{pace,economy:e,flight:createFlight(0),charges:[route.charge],leads:[route.lead+offset],burns:[route.burn]}));
 }
});
