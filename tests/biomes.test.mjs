import test from 'node:test';
import assert from 'node:assert/strict';
import {biomeAt,biomeEdge,createBiomeScene,BIOME_SCORE_STEP} from '../src/biomes.js';

test('each10000 current-run points advances the scenery cycle',()=>{
 assert.equal(BIOME_SCORE_STEP,10000);
 for(const [score,id,leg] of [[0,'spaceport',0],[9999,'spaceport',0],[10000,'tesla-factory',1],[19999,'tesla-factory',1],[20000,'spaceport',2],[30000,'tesla-factory',3]]){const b=biomeAt(score);assert.equal(b.id,id);assert.equal(b.leg,leg);assert.equal(b.nextAt,(leg+1)*10000);}
});
test('score alone starts entry; a fixed world edge moves with distance rather than a timer',()=>{
 const scene=createBiomeScene();scene.update(9999,100000);assert.equal(scene.state.id,'spaceport');assert.equal(scene.state.moving,false);
 scene.reset();scene.update(10000,20,{ahead:1000,behind:300});assert.equal(scene.state.id,'tesla-factory');assert.equal(scene.state.moving,true);assert.equal(scene.state.edgeAt,1020);
 const initial=biomeEdge(scene.state,20,200,1);scene.update(10020,320);assert.equal(scene.state.edgeAt,1020);assert.equal(biomeEdge(scene.state,320,200,1),initial-300);
 scene.update(10100,1320);assert.equal(scene.state.moving,false);assert.equal(scene.state.progress,1);assert.equal(scene.state.from,'tesla-factory');
});
test('pause and resize do not move the stored world doorway; retry resets it',()=>{
 const scene=createBiomeScene();scene.update(10000,100,{ahead:900,behind:350});scene.update(10010,400);const paused={...scene.state};
 for(let i=0;i<50;i++)scene.update(10010,400,{ahead:2000,behind:900});assert.deepEqual(scene.state,paused);
 assert.equal(biomeEdge(scene.state,400,100,.5),400);assert.equal(biomeEdge(scene.state,400,200,1),800);
 scene.reset();assert.equal(scene.state.id,'spaceport');assert.equal(scene.state.moving,false);assert.equal(scene.state.nextAt,10000);
});
test('bonus jumps select the actual score band without queued or phantom entries',()=>{
 const scene=createBiomeScene();scene.update(35000,1);assert.equal(scene.state.leg,3);assert.equal(scene.state.id,'tesla-factory');scene.update(45000,2);assert.equal(scene.state.id,'spaceport');assert.equal(scene.state.from,'tesla-factory');
 scene.reset();scene.update(25000,1);assert.equal(scene.state.id,'spaceport');assert.equal(scene.state.moving,false);
});
test('cameos and invalid scores do not trigger factory',()=>{for(const score of [5000,-5,NaN,Infinity])assert.equal(biomeAt(score).id,'spaceport');});
