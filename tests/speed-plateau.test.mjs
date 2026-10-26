import test from 'node:test';import assert from 'node:assert/strict';
import {GAMEPLAY as C,basePace,basePaceSlope} from '../src/gameplay-config.js';
import {createPace,createFlight,createEconomy,advancePace,stumble} from '../src/gameplay.js';
import {speedView,minimumForwardSight} from '../src/speed-feedback.js';
test('first twenty seconds retain the original pace, then ease into a stable faster plateau',()=>{
 for(let t=0;t<=20;t+=.25)assert.equal(basePace(t),360+2*t);
 assert.equal(basePace(150),960);assert.equal(basePace(900),960);assert.equal(basePaceSlope(150),0);
 let last=360;for(let t=0;t<180;t+=.05){const v=basePace(t);assert.ok(v>=last-1e-9&&v<=960);last=v;}
 assert.ok(Math.abs(basePaceSlope(20+1e-6)-2)<1e-6);
});
test('late objects move at least 29 percent faster than 4.8.0 without shrinking',()=>{
 for(const w of [320,390]){const v=speedView(w,844,960),oldBase=Math.min(1.25,Math.max(.68,w/650),844/430,(w-w*.24-24)/550),old=740*oldBase/1.4;
 assert.ok(960*v.scale/old>=1.29&&960*v.scale/old<=1.35);assert.ok(v.scale>=oldBase/1.4);}
});
test('reaction horizon is a lower bound including both sides of the mobile breakpoint',()=>{
 for(const speed of [360,400,550,960,1200,1620,1880])for(const strength of [0,.13,.6,1,1.3,2,3.9,5.1]){
 const bound=minimumForwardSight(speed,strength);
 for(let w=320;w<=1600;w+=3)for(const h of [390,568,844,1200]){const v=speedView(w,h,speed,strength);assert.ok((w-v.x)/v.scale>=bound-1e-7,`${speed}/${strength}/${w}/${h}`);}
 for(const w of [599.999,600,1002.112676056338]){const v=speedView(w,900,speed,strength);assert.ok((w-v.x)/v.scale>=bound-1e-7);}
 }
});
test('recovery rejoins the same nonlinear progression with no speed discontinuity',()=>{
 for(const progress of [20,75,120,150]){const p=createPace(),f=createFlight(),e=createEconomy();p.progress=progress;p.base=basePace(progress);p.speed=p.base;stumble(p);let prior=p.base;
 while(p.recovery){advancePace(p,e,f,1/120);assert.ok(p.base>=prior-1e-8);prior=p.base;}
 assert.equal(p.base,basePace(progress));advancePace(p,e,f,1/120);assert.ok(p.base-prior<.07);}
 assert.equal(C.maxSpeed,1100);
});
