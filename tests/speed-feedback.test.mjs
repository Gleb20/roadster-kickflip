import test from 'node:test';
import assert from 'node:assert/strict';
import {viewScale,speedFeedback} from '../src/speed-feedback.js';
import {createFlight,createEconomy,settleLanding,createPace,advancePace,collisionAt} from '../src/gameplay.js';

test('earned landing speed closes the same obstacle sooner at the same camera scale',()=>{
 const timeToObstacle=landings=>{
  const p=createFlight(),e=createEconomy(),pace=createPace();pace.progress=150;
  for(let i=0;i<landings;i++)settleLanding(e,p,{good:true,turns:1});
  const o={id:'truck',w:110,h:41,inset:5};let dx=800,t=0;
  while(!collisionAt(p,o,dx)){advancePace(pace,e,p,1/120);dx-=pace.speed/120;t+=1/120;}
  return t;
 };
 const normal=timeToObstacle(0),first=timeToObstacle(1),full=timeToObstacle(5);
 assert.ok(first<normal*.96);assert.ok(full<normal*.81);
});

test('normal-ramp framing preserves a usable visible approach at maximum earned speed',()=>{
 for(const [w,h] of [[320,640],[390,844],[844,390],[1440,900]])for(const progress of [0,75,150]){
  const scale=viewScale(w,h,progress),base=360+300*Math.min(1,progress/150);
  const visibleApproach=(w-w*(w<600?.24:.29)-24)/(base*1.25*scale);
  assert.ok(visibleApproach>=.75,'retain time to charge and react at full earned speed');
  assert.ok(scale>0&&scale<=1.25);
 }
});

test('Impossibru needs maximum base pace and full actual earned speed, not the first trick',()=>{
 for(const [base,speed,streak] of [[360,378,.05],[360,450,.25],[660,693,.05],[660,660,.25],[659,823.75,.25],[660,824,.25]])assert.equal(speedFeedback({base,speed},streak).impossibru,false);
 assert.equal(speedFeedback({base:740,speed:925},.25).impossibru,true);
 const cancelled=speedFeedback({base:660,speed:600},.25);assert.equal(cancelled.factor,1);assert.equal(cancelled.flameOpacity,0);
});

test('speed cues follow actual gain, cap flame length and opacity, and lean at most two degrees',()=>{
 let last=0;
 for(const bonus of [0,.05,.1,.15,.2,.25]){
  const cue=speedFeedback({base:660,speed:660*(1+bonus)},bonus);
  assert.ok(Math.abs(cue.factor-(1+bonus))<1e-12);assert.ok(cue.intensity>=last);last=cue.intensity;
  assert.ok(Math.abs(cue.lean)<=.035);assert.ok(cue.flameLength<=55);assert.ok(cue.flameOpacity<=.36);
 }
 const partial=speedFeedback({base:660,speed:693},.25);assert.ok(Math.abs(partial.intensity-.2)<1e-12);
});
