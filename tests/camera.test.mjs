import test from 'node:test';
import assert from 'node:assert/strict';
import {viewScale,roadBaseline} from '../src/speed-feedback.js';

test('camera widens the late-run horizon by at least 35 percent without changing launch framing',()=>{
 for(const [w,h] of [[320,640],[390,844],[844,390],[1440,900]]){
  const anchor=w*(w<600?.24:.29),room=w-anchor-24;
  assert.equal(viewScale(w,h,0),Math.min(1.25,Math.max(.68,w/650),h/430,room/550));
  const previous=Math.min(1.25,Math.max(.68,w/650),h/430,room/(660*.95));
  const final=viewScale(w,h,150);
  assert.ok(previous/final>=1.35);
  assert.ok(final>0);
  let last=viewScale(w,h,0);
  for(let t=1;t<=150;t++){const next=viewScale(w,h,t);assert.ok(next<=last+1e-12);last=next;}
 }
});

test('road stays above the touch instruments in portrait and landscape independently of zoom',()=>{
 for(const [w,h] of [[320,568],[390,844],[844,390],[1440,900]]){
  const road=roadBaseline(h);
  assert.ok(road<=h*.76);
  assert.ok(h-road>=130);
 }
});
