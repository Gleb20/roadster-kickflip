import test from 'node:test';
import assert from 'node:assert/strict';
import {raisedArm,uprightWristAngle,pupilOffset,seatedLegPose} from '../src/characters.js';

test('raised arms keep both bone lengths fixed and put the wrist above the shoulder',()=>{
  for(const [upper,lower] of [[23,22],[15,15]])for(const side of [-1,1]){
    const shoulder={x:side*17,y:-48};
    const {elbow,wrist}=raisedArm(shoulder,upper,lower,side);
    assert.ok(Math.abs(Math.hypot(elbow.x-shoulder.x,elbow.y-shoulder.y)-upper)<1e-9);
    assert.ok(Math.abs(Math.hypot(wrist.x-elbow.x,wrist.y-elbow.y)-lower)<1e-9);
    assert.ok(wrist.y<shoulder.y);
    assert.equal(Math.sign(wrist.x-shoulder.x),side);
  }
});

test('middle fingers stay within 15 degrees of screen vertical through body lean and crouch',()=>{
  for(const tilt of [-.4,-.24,-.085,0,.09,.12])for(const side of [-1,1])for(const strength of [.01,.25,.5,1]){
    const angle=tilt+uprightWristAngle(tilt,side,strength);
    assert.ok(Math.abs(angle)<=Math.PI/12+1e-12);
    assert.ok(-Math.cos(angle)<0,'finger points up');
  }
});

test('pupils reverse at departure, track jump height and remain inside the eye',()=>{
  const eye={x:0,y:0},rx=4.32,ry=5.06;
  for(const x of [-300,-1,1,300])for(const y of [-300,-50,50,300]){
    const p=pupilOffset({x,y},eye,rx,ry);
    assert.equal(Math.sign(p.x),Math.sign(x));
    assert.equal(Math.sign(p.y),Math.sign(y));
    assert.ok((p.x/rx)**2+(p.y/ry)**2<=1+1e-12);
  }
  assert.deepEqual(pupilOffset(eye,eye,rx,ry),{x:0,y:0});
});


test('seated fall keeps separate bent legs at fixed lengths with one raised foot',()=>{
 for(const drop of [18.9,22,27]){
  const legs=[-1,1].map(side=>seatedLegPose(side,drop));
  for(const {hip,knee,ankle,foot,angle} of legs){
   assert.ok(Math.abs(Math.hypot(knee.x-hip.x,knee.y-hip.y)-28)<1e-8);
   assert.ok(Math.abs(Math.hypot(ankle.x-knee.x,ankle.y-knee.y)-27)<1e-8);
   assert.ok(Number.isFinite(angle)&&Number.isFinite(foot.x));
  }
  assert.ok(legs[0].foot.y-legs[1].foot.y>45);
  assert.ok(legs[1].foot.x-legs[0].foot.x>10);
 }
});
