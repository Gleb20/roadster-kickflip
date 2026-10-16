import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADSTER_BASELINE,ROADSTER_WHEELS,ROADSTER_WIDTH,createRoadsterMotion,advanceRoadsterMotion,flipFrameAt} from '../src/roadster-flip.js';
const tick=(m,input,n=1)=>{for(let i=0;i<n;i++)advanceRoadsterMotion(m,1/120,input);};
test('both tyres touch the shared road anchor, including at the upright flip endpoints',()=>{
 for(const wheel of ROADSTER_WHEELS)assert.equal(wheel.y+wheel.r,ROADSTER_BASELINE);
 assert.equal(flipFrameAt(0),0);assert.equal(flipFrameAt(1),0);
 assert.equal(new Set(Array.from({length:101},(_,i)=>flipFrameAt(i/100))).size,9);
});
test('wheel rotation covers travelled distance, including boost, independently of render frequency',()=>{
 const radius=19*ROADSTER_WIDTH/256;
 for(const speed of [360,660,2640]){
  const m=createRoadsterMotion();tick(m,{grounded:true,speed},120);
  assert.ok(Math.abs(m.wheelAngle-(speed/radius)%(2*Math.PI))<1e-10);
  const before=m.wheelAngle;tick(m,{grounded:true,speed:0},120);assert.equal(m.wheelAngle,before);
 }
});
test('charge compresses the body; takeoff extends it; landing dips and settles without moving tyres',()=>{
 const m=createRoadsterMotion();tick(m,{grounded:true,speed:360,charge:1},120);
 assert.ok(m.compression>1.7&&m.compression<1.9);
 tick(m,{grounded:false,speed:360},120);
 assert.ok(Math.abs(m.compression)<.01);
 tick(m,{grounded:true,speed:360,impactSpeed:820});
 let peak=m.compression,min=0;
 for(let i=0;i<120;i++){tick(m,{grounded:true,speed:360});peak=Math.max(peak,m.compression);min=Math.min(min,m.compression);}
 assert.ok(peak>1.3&&peak<3,`landing peak ${peak}`);
 assert.ok(min>-.6);assert.ok(Math.abs(m.compression)<.01);
});
