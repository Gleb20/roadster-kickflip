import test from 'node:test';
import assert from 'node:assert/strict';
import {createFlight,launch,advanceFlight,TAU} from '../src/gameplay.js';
const dt=1/120;
function target(extra=0){const p=createFlight();p.jumpFactor=1.25;launch(p,1);let result;for(let tick=0;tick<1200;tick++){if(tick===96)p.y+=extra;result=advanceFlight(p,dt,{spin:tick<96});if(result)return result;}throw Error('no landing');}
test('timely boosted release settles safely without passive overrun on longer flights',()=>{for(const extra of [0,500,1500,4000]){const r=target(extra);assert.equal(r.good,true,`height +${extra}`);assert.equal(r.turns,1);assert.equal(r.perfect,false);assert.ok(r.angle< -TAU,'retains natural overrotation');}});

import {resetAirRotation,createEconomy} from '../src/gameplay.js';
import {createGrind,jumpFromRail,leaveRail,advanceRail,makeRail} from '../src/rails.js';
import {createRun} from '../src/run.js';
const rad=degrees=>degrees*Math.PI/180;
function releaseAt(degrees,omega=-7.2){const p=createFlight();launch(p,1);Object.assign(p,{y:1e6,angle:-rad(degrees),omega,spinHeld:true});advanceFlight(p,dt);return p;}
function blankRun(){const r=createRun({seed:17});r.reset();r.S.next=r.Q.nextAt=1e9;return r;}
function chargedRun(){const r=blankRun();r.P.jumpFactor=1.25;launch(r.P,1);r.command('primary-down');for(let i=0;i<96;i++)r.step();return r;}

test('release latches one specific reachable turn and cannot rescue an early abort or overhold later',()=>{
 for(const degrees of [0,120,180,240,255,258.12,340,360,500,540,600,720]){
  const p=releaseAt(degrees);assert.equal(p.settleTarget,0,`release ${degrees}`);
  for(let i=0;i<500;i++){advanceFlight(p,dt);assert.equal(p.settleTarget,0,`no delayed acquisition ${degrees}`);}
 }
 for(const [degrees,target] of [[259,TAU],[270,TAU],[307,TAU],[330,TAU],[630,2*TAU],[667,2*TAU]])assert.equal(releaseAt(degrees).settleTarget,target);
 // A geometrically close upright pose is insufficient at unsafe speed.
 assert.equal(releaseAt(350,-7.2).settleTarget,0);
 assert.equal(releaseAt(350,0).settleTarget,0);
 assert.equal(releaseAt(350,1.8).settleTarget,0);
});

test('settle only dissipates angular speed, preserves direction and never directly rewrites angle',()=>{
 const p=releaseAt(307);let max=0;
 for(let i=0;i<500;i++){const angle=p.angle,omega=p.omega;advanceFlight(p,dt);assert.ok(p.omega<=0);assert.ok(Math.abs(p.omega)<=Math.abs(omega)+1e-12);assert.ok(Math.abs(p.angle-angle-p.omega*dt)<1e-12);max=Math.max(max,-p.angle);}
 assert.ok(max>TAU+rad(10)&&max<TAU+rad(40));
 assert.ok(Math.abs(p.omega)<1e-15);
 const turn=p.turns;for(let i=0;i<500;i++)advanceFlight(p,dt);assert.equal(p.turns,turn,'no phantom turn during an extended flight');
 for(const invalid of [-1,1]){const q=releaseAt(307);q.omega=invalid*1.8;q.angle=-(q.settleTarget+rad(41));advanceFlight(q,dt);assert.equal(q.settleTarget,0,'leaving sector cancels without recapture');}
});

test('rehold immediately restores manual acceleration and relatching cannot manufacture turns or fuel',()=>{
 const p=releaseAt(307);for(let i=0;i<120;i++)advanceFlight(p,dt);const omega=p.omega,angle=p.angle,fuel=p.fuel;
 advanceFlight(p,dt,{spin:true});assert.equal(p.settleTarget,0);assert.ok(Math.abs(p.omega-(omega-.5))<1e-12);assert.ok(p.angle<angle);
 for(let i=0;i<20;i++){advanceFlight(p,dt);advanceFlight(p,dt,{spin:true});}assert.equal(p.turns,1);assert.equal(p.fuel,fuel);
});

test('thrust remains roof-relative, including fuel expiry and starting again after release',()=>{
 for(const fuel of [.1,100]){
  const p=releaseAt(307);p.fuel=fuel;
  for(let i=0;i<260;i++){
   const b={...p};const thrust=i<30||i>=90;advanceFlight(p,dt,{thrust});advanceFlight(b,dt);
   const burn=thrust?Math.min(dt,b.fuel/80):0;
   assert.ok(Math.abs(p.vy-b.vy-Math.cos(p.angle)*2100*burn)<1e-7);
   if(i>200)assert.ok(Math.abs(p.omega)<1e-7);
  }
  assert.equal(p.fuel,0);assert.equal(p.turns,1);
 }
});

test('active release state survives JSON checkpoints and pause/cancel consumes no physics time',()=>{
 const a=chargedRun();a.command('primary-up');a.step();assert.equal(a.P.settleTarget,TAU);
 const b=createRun({record:false});b.restore(JSON.parse(JSON.stringify(a.snapshot())));
 a.S.mode='paused';const before=a.snapshot();for(let i=0;i<50;i++)a.step();assert.deepEqual(a.snapshot(),before);a.S.mode='playing';
 for(let i=0;i<250;i++){a.step();b.step();a.drainEvents();b.drainEvents();assert.deepEqual(a.snapshot(),b.snapshot());}
 for(const command of ['primary-up','primary-cancel','cancel']){
  const r=chargedRun();r.command(command);r.S.mode='paused';const p={...r.P};for(let i=0;i<60;i++)r.step();assert.deepEqual(r.P,p);r.S.mode='playing';r.step();assert.equal(r.P.settleTarget,TAU,command);
  const q=releaseAt(180);q.spinHeld=false;resetAirRotation(q);for(let i=0;i<500;i++)advanceFlight(q,dt);assert.equal(q.settleTarget,0,'pause cannot widen an early release');
 }
});

test('landing, launch, rail catch/exit/jump, death, rescue and reset clear transient release state',()=>{
 const p=releaseAt(307);p.y=.001;p.vy=-100;advanceFlight(p,dt);assert.equal(p.settleTarget,0);assert.equal(p.spinHeld,false);
 Object.assign(p,{settleTarget:TAU,spinHeld:true,airborne:false});launch(p,1);assert.equal(p.settleTarget,0);assert.equal(p.spinHeld,false);
 for(const action of [leaveRail,jumpFromRail]){p.settleTarget=TAU;p.spinHeld=true;action(createGrind(),p,1);assert.equal(p.settleTarget,0);assert.equal(p.spinHeld,false);}
 const caught=releaseAt(307);Object.assign(caught,{angle:0,omega:0,y:181,vy:-200});const before={...caught,y:184},g=createGrind();advanceRail(g,caught,before,[{...makeRail(-30),uid:1}],0,dt,createEconomy());assert.equal(g.support,1);assert.equal(caught.settleTarget,0);assert.equal(caught.spinHeld,false);
 for(const rescue of [false,true]){
  const r=blankRun();Object.assign(r.P,releaseAt(307),{y:0,angle:0,omega:0});if(rescue)r.Q.hearts=1;r.S.obs=[{uid:1,id:'truck',w:60,h:100,inset:5,roof:5,x:0,passed:false}];r.step();assert.equal(r.P.settleTarget,0);assert.equal(r.P.spinHeld,false);assert.equal(r.S.mode,rescue?'playing':'dead');r.reset();assert.equal(r.P.settleTarget,0);
 }
});

test('production rail jump gets the same bounded settling',()=>{
 const r=blankRun();r.P.y=182;r.G.support=1;r.P.jumpFactor=1.25;jumpFromRail(r.G,r.P,1);r.command('primary-down');for(let i=0;i<96;i++)r.step();r.command('primary-up');for(let i=0;i<400&&!r.lastLanding;i++)r.step();assert.equal(r.lastLanding.good,true);assert.equal(r.lastLanding.turns,1);assert.equal(r.lastLanding.perfect,false);
});

test('recorded spin release replays exactly through JSON chunks and forged completion is rejected',async()=>{
 const {verifyReplay,RUN_COMMANDS}=await import('../src/run.js');
 const r=createRun({seed:17});r.reset();let eligible=false;
 while(r.S.mode==='playing'){
  if(r.S.tick===0)r.command('primary-down');
  if(r.S.tick===48){r.command('primary-up');r.command('primary-down');}
  if(r.S.tick===144)r.command('primary-up');
  r.step();eligible ||= !!r.P.settleTarget;r.drainEvents();assert.ok(r.S.tick<1200);
 }
 assert.equal(eligible,true);const replay=r.replay(),expected={score:r.S.score,flips:r.E.flips,ticks:r.S.tick};assert.deepEqual(verifyReplay(replay),expected);
 let event=0,chunk=createRun({seed:replay.seed,record:false});chunk.reset();let activeCheckpoint=false;
 while(chunk.S.mode==='playing'){
  for(let i=0;i<17&&chunk.S.mode==='playing';i++){
   while(event<replay.events.length&&replay.events[event][0]===chunk.S.tick)chunk.command(RUN_COMMANDS[replay.events[event++][1]]);
   chunk.step();chunk.drainEvents();
  }
  const saved=JSON.parse(JSON.stringify(chunk.snapshot()));activeCheckpoint ||= !!saved.P.settleTarget;chunk=createRun({record:false});chunk.restore(saved);
 }
 assert.equal(activeCheckpoint,true);assert.deepEqual(chunk.snapshot(),r.snapshot());assert.equal(event,replay.events.length);
 assert.throws(()=>verifyReplay({...replay,ticks:replay.ticks+1}));assert.throws(()=>verifyReplay({...replay,ticks:replay.ticks-1}));
});
