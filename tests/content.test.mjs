import test from 'node:test';
import assert from 'node:assert/strict';
import {OBSTACLES,BIOMES,ASSETS,validateContent,obstacleDefinition,eligibleObstacles} from '../src/content.js';

test('all 19 legacy types retain their geometry, IDs and stable order',()=>{
 assert.deepEqual(OBSTACLES.map(o=>o.id),['v8','trump','protest','truck','doge','pump','zuck','openai','claude','gemini','rogozin','amber','joe','muscleCoupe','muscleCompact','pickup','simpsonsCouch','hoverDrone','incomingDrone']);
 assert.deepEqual(OBSTACLES.map(o=>[o.w,o.h]),[[108,36],[54,94],[102,94],[110,41],[52,64],[54,78],[62,94],[70,68],[84,73],[58,78],[88,130],[58,94],[76,94],[138,45],[112,38],[140,57],[136,88],[92,40],[92,40]]);
 assert.deepEqual(validateContent(),[]);
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
 assert.equal(eligibleObstacles('spaceport').length,19);
 assert.ok(eligibleObstacles('tesla-factory').every(o=>o.biomes==='all'||o.biomes.includes('tesla-factory')));
 assert.equal(eligibleObstacles('missing').length,0);
});
