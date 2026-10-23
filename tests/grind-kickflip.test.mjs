import test from 'node:test';import assert from 'node:assert/strict';
import {createRun} from '../src/run.js';import {jumpCarPose} from '../src/roadster-flip.js';
const blank=()=>{const r=createRun({seed:17});r.reset();r.S.next=r.Q.nextAt=1e9;return r;};
const frames=r=>{const seen=new Set();for(let i=0;i<240&&r.P.airborne;i++){seen.add(jumpCarPose(r.P,1550,{railJump:r.G.exit==='jump'}).frame);r.step();}return seen;};
test('ordinary ground and rail jump keep the existing full nine-frame kickflip',()=>{
 const r=blank();r.command('primary-down');for(let i=0;i<24;i++)r.step();r.command('primary-up');assert.equal(jumpCarPose(r.P,1550).cosmetic,true);assert.equal(frames(r).size,9);
 r.S.rails=[{uid:1,x:-50,w:720,h:190,paid:[],passed:false}];Object.assign(r.P,{y:191,vy:-300,airborne:true,angle:0,omega:0,trickStarted:false});for(let i=0;i<12&&!r.G.support;i++)r.step();assert.ok(r.G.support);
 r.command('primary-down');for(let i=0;i<24;i++)r.step();r.command('primary-up');assert.equal(jumpCarPose(r.P,1550,{railJump:true}).cosmetic,true);assert.equal(frames(r).size,9);
});
test('rail jump cosmetic flip yields to actual spin and thrust; walking off an edge does not launch a flip',()=>{
 const p={airborne:true,trickStarted:true,latched:false,launchVelocity:780,time:.2,omega:0,grab:0};assert.equal(jumpCarPose(p,1550,{railJump:true}).cosmetic,true);
 for(const change of [{omega:-.5},{grab:.1},{latched:true},{launchVelocity:0}])assert.equal(jumpCarPose({...p,...change},1550,{railJump:true}).cosmetic,false);
 assert.equal(jumpCarPose({...p,launchVelocity:0},1550).cosmetic,false);
});
