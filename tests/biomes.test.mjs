import test from 'node:test';
import assert from 'node:assert/strict';
import {biomeAt,BIOME_SECONDS} from '../src/biomes.js';
import {createRun} from '../src/run.js';

test('factory begins at 2:30 active time and returns in an ordered repeating cycle',()=>{
 assert.equal(BIOME_SECONDS,150);
 assert.equal(biomeAt(149.999).id,'spaceport');
 assert.deepEqual([biomeAt(150).id,biomeAt(300).id,biomeAt(450).id],['tesla-factory','spaceport','tesla-factory']);
 assert.equal(biomeAt(150).mix,0);assert.equal(biomeAt(152).mix,.5);assert.equal(biomeAt(154).mix,1);
 assert.equal(biomeAt(299).mix,1);assert.equal(biomeAt(300).from,'tesla-factory');
 assert.equal(biomeAt(3600).leg,24);
});
test('clock follows a no-trick run, freezes on pause/death, resets on retry',()=>{
 const run=createRun();run.reset();run.S.next=1e9;
 for(let i=0;i<18000;i++)run.step();
 assert.equal(run.S.t,150);assert.equal(run.E.flips,0);assert.equal(biomeAt(run.S.t).id,'tesla-factory');
 const score=run.S.score;run.S.mode='paused';for(let i=0;i<600;i++)run.step();
 assert.equal(run.S.t,150);assert.equal(run.S.score,score);
 run.S.mode='dead';run.step();assert.equal(run.S.t,150);
 run.reset();assert.equal(biomeAt(run.S.t).id,'spaceport');
});
test('invalid preview times remain in the initial biome',()=>{
 for(const t of [-5,NaN,Infinity])assert.equal(biomeAt(t).id,'spaceport');
});
