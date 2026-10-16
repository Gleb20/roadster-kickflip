import test from 'node:test';
import assert from 'node:assert/strict';
import {joeReaction} from '../src/encounter.js';
import {towerRetraction,spaceportLayout} from '../src/rocket.js';
test('Joe encounter raises the hand, inhales, reacts while passing, then settles',()=>{
 for(const dx of [NaN,700,-500])assert.deepEqual(joeReaction(dx),{reach:0,inhale:0,meme:0,smoke:0});
 assert.ok(joeReaction(500).reach>0);
 assert.ok(joeReaction(200).inhale>.99);
 assert.ok(joeReaction(-100).meme>.99);
 assert.ok(joeReaction(-100).smoke>.99);
 assert.ok(joeReaction(-400).reach<.3);
 // No temporal jumps at phase boundaries, regardless of boost or draw cadence.
 for(let dx=650;dx>-480;dx-=1)for(const key of ['reach','inhale','meme','smoke']){
  const a=joeReaction(dx)[key],b=joeReaction(dx-1)[key];
  assert.ok(a>=0&&a<=1);assert.ok(Math.abs(a-b)<.025);
 }
});
test('tower clears the rocket before liftoff and closes only after successful touchdown',()=>{
 assert.equal(towerRetraction('ready',10),0);
 assert.equal(towerRetraction('launch',0),0);
 assert.equal(towerRetraction('launch',1.6),1);
 assert.equal(towerRetraction('landing',14),1);
 assert.equal(towerRetraction('ready',0,'landing'),1);
 assert.equal(towerRetraction('ready',2.4,'landing'),0);
 for(const phase of ['orbit','explosion'])assert.equal(towerRetraction(phase,1),1);
 assert.equal(towerRetraction('delivery',0),1);assert.equal(towerRetraction('delivery',12),0);
 for(const H of [390,844,900]){
  const {base,zoom,h}=spaceportLayout({H,ground:H*.84});
  assert.ok(H*.84-base<34);assert.ok(h<108);assert.ok(zoom>0);
 }
});

test('mobile spaceport is enlarged without changing the desktop layout',()=>{
 const desktop=spaceportLayout({W:1440,H:844,ground:700});
 const mobile=spaceportLayout({W:390,H:844,ground:700});
 assert.equal(mobile.h/desktop.h,1.65);
 assert.equal(desktop.zoom,844/950);
});
