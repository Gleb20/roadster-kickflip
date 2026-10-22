import test from 'node:test';
import assert from 'node:assert/strict';
import {OBSTACLES,BIOMES,ASSETS,validateContent,obstacleDefinition,eligibleObstacles} from '../src/content.js';

test('retained legacy types preserve geometry and replacement IDs are explicit',async()=>{
 const {OBSTACLES:legacy}=await import('../supabase/rulesets/roadster-v380/content.js');
 const removed=new Set(['simpsonsCouch','hoverDrone','incomingDrone']);
 for(const old of legacy.filter(o=>!removed.has(o.id))){const current=obstacleDefinition(old.id);assert.deepEqual([current.w,current.h],[old.w,old.h]);}
 for(const id of removed)assert.equal(obstacleDefinition(id),undefined);
 assert.equal(OBSTACLES.length,29);assert.deepEqual(validateContent(),[]);
});
test('invalid content cannot enter the game silently',()=>{
 const base=obstacleDefinition('truck');
 const errors=list=>validateContent(list);
 assert.match(errors([base,base]).join(' '),/duplicate/);
 assert.match(errors([{...base,w:NaN}]).join(' '),/size/);
 assert.match(errors([{...base,biomes:['missing']}]).join(' '),/biome/);
 assert.match(errors([{...base,visual:{...base.visual,assets:['missing']}}]).join(' '),/asset/);
 assert.match(errors([{...base,reactions:{...base.reactions,hero:{enabled:true,animationId:'missing'}}}]).join(' '),/animation/);
 assert.match(errors([{...base,placement:'air'}]).join(' '),/altitude/);
});
test('reaction direction, anchors and biome membership are explicit and immutable',()=>{
 assert.equal(obstacleDefinition('trump').reactions.hero.animationId,'taunt');
 assert.equal(obstacleDefinition('trump').reactions.obstacle.animationId,'angry-look');
 assert.equal(obstacleDefinition('amber').reactions.hero.enabled,false);
 assert.equal(obstacleDefinition('amber').reactions.obstacle.animationId,'throw');
 assert.equal(obstacleDefinition('v8').anchor,'ground-center');
 assert.ok(Object.isFrozen(obstacleDefinition('trump').reactions.hero));
 assert.ok(Object.isFrozen(BIOMES));assert.ok(Object.isFrozen(ASSETS));
 assert.equal(eligibleObstacles('spaceport').length,23);
 assert.ok(eligibleObstacles('tesla-factory').every(o=>o.biomes==='all'||o.biomes.includes('tesla-factory')));
 assert.equal(eligibleObstacles('missing').length,0);
});
