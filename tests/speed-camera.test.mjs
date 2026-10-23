import test from 'node:test';import assert from 'node:assert/strict';
import {speedView,advanceSpeedView,createSpeedView,baseViewScale} from '../src/speed-feedback.js';

test('speed framing preserves the previous maximum phone horizon with larger obstacles',()=>{
 for(const w of [320,390]){const h=844,start=speedView(w,h,360),fast=speedView(w,h,660);
  const old=Math.min(1.25,Math.max(.68,w/650),h/430,(w-w*.24-24)/(660*.95))/1.4;
  assert.ok((w-fast.x-24)/fast.scale>=(w-w*.24-24)/old*.99);
  assert.ok(fast.scale>old*1.1);assert.ok(fast.x<start.x);
 }
});
test('object motion and near road flow both rise monotonically with real speed',()=>{
 for(const [w,h] of [[320,568],[390,844],[844,390],[1440,900]]){let previous=0;
 for(let speed=360;speed<=1114;speed+=2){const v=speedView(w,h,speed);assert.ok(speed*v.scale>previous);previous=speed*v.scale;}
 assert.ok(660*baseViewScale(w,h)/(360*baseViewScale(w,h))>1.8);}
});
test('camera responds to a speed change in under half a second and returns more gently',()=>{
 const s=createSpeedView();for(let i=0;i<60;i++)advanceSpeedView(s,1/120,390,844,660);
 assert.ok(s.strength>.8);const high=s.strength;for(let i=0;i<60;i++)advanceSpeedView(s,1/120,390,844,360);
 assert.ok(s.strength>high*.45&&s.strength<high*.6);
});
test('same speed gives the same frame regardless of run age and holds with zero dt',()=>{
 const a=createSpeedView(),b=createSpeedView();for(let i=0;i<600;i++){advanceSpeedView(a,1/120,390,844,550);advanceSpeedView(b,1/120,390,844,550);}
 assert.deepEqual(a,b);const before=JSON.stringify(a);advanceSpeedView(a,0,390,844,1114);assert.equal(JSON.stringify(a),before);
});
test('damped framing is equivalent across refresh rates and bounded on bonus oscillation',()=>{
 const a=createSpeedView(),b=createSpeedView();for(let i=0;i<120;i++)advanceSpeedView(a,1/120,390,844,660);for(let i=0;i<60;i++)advanceSpeedView(b,1/60,390,844,660);assert.ok(Math.abs(a.strength-b.strength)<1e-10);
 for(let i=0;i<500;i++){const v=advanceSpeedView(a,1/120,320,568,i%2?1114:180);assert.ok(a.strength>=0&&a.strength<=1.3);assert.ok(v.scale>0&&v.x>=320*.136);}
});
