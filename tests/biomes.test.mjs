import test from 'node:test';
import assert from 'node:assert/strict';
import {biomeAt,createBiomeScene,BIOME_SCORE_STEP} from '../src/biomes.js';

test('each 10000 current-run points advances the ordered repeating scenery cycle',()=>{
 assert.equal(BIOME_SCORE_STEP,10000);
 for(const [score,id,leg] of [[0,'spaceport',0],[9999,'spaceport',0],[10000,'tesla-factory',1],[19999,'tesla-factory',1],[20000,'spaceport',2],[30000,'tesla-factory',3]]){
  const b=biomeAt(score);assert.equal(b.id,id);assert.equal(b.leg,leg);assert.equal(b.nextAt,(leg+1)*10000);assert.equal(b.nextIn,b.nextAt-score);
 }
});
test('elapsed time cannot trigger or delay a score threshold',()=>{
 const scene=createBiomeScene();scene.update(9999,600);assert.equal(scene.state.id,'spaceport');
 scene.update(10000,600);assert.equal(scene.state.id,'tesla-factory');assert.equal(scene.state.mix,0);
 scene.reset();scene.update(10000,2);assert.equal(scene.state.id,'tesla-factory');
 scene.update(10000,4);assert.equal(scene.state.mix,.5);scene.update(10000,6);assert.equal(scene.state.mix,1);
});
test('pause freezes crossfade and reset forgets previous score and transition',()=>{
 const scene=createBiomeScene();scene.update(10000,10);scene.update(10025,11);
 const paused={...scene.state};for(let i=0;i<50;i++)scene.update(10025,11);assert.deepEqual(scene.state,paused);
 scene.reset();assert.equal(scene.state.id,'spaceport');assert.equal(scene.state.leg,0);assert.equal(scene.state.mix,1);assert.equal(scene.state.nextAt,10000);
});
test('bonus points crossing multiple thresholds select the actual score band immediately',()=>{
 const scene=createBiomeScene();scene.update(35000,1);assert.equal(scene.state.leg,3);assert.equal(scene.state.id,'tesla-factory');assert.equal(scene.state.nextAt,40000);
 scene.update(45000,2);assert.equal(scene.state.leg,4);assert.equal(scene.state.id,'spaceport');assert.equal(scene.state.from,'tesla-factory');
 scene.reset();scene.update(25000,1);assert.equal(scene.state.id,'spaceport');assert.equal(scene.state.mix,1);
});
test('5000-point cameos and invalid scores do not trigger the factory',()=>{
 for(const score of [5000,-5,NaN,Infinity])assert.equal(biomeAt(score).id,'spaceport');
});
