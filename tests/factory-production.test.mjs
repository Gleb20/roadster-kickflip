import test from 'node:test';
import assert from 'node:assert/strict';
import {createFactoryProduction,PRODUCTION_SECONDS} from '../src/factory-production.js';
const factory=leg=>({id:'tesla-factory',leg}),space=leg=>({id:'spaceport',leg});
test('visits vary models; each complete body keeps its color and model',()=>{
 let calls=0;const line=createFactoryProduction(()=>{calls++;return 0;});line.update(space(0),0);assert.equal(line.state,null);
 line.update(factory(1),90);const first=line.state;assert.equal(first.model,'model-s');assert.equal(first.color,'red');
 for(const elapsed of [0,4.9,5,10,15,20,29.9]){line.update(factory(1),90+elapsed);assert.equal(line.state.model,first.model);assert.equal(line.state.color,first.color);assert.equal(line.state.stage,Math.min(4,Math.floor(elapsed/5)));}
 const before=calls;line.update(factory(1),119.9);assert.equal(calls,before);line.update(factory(1),90+PRODUCTION_SECONDS);assert.notEqual(line.state.color,first.color);assert.equal(line.state.stage,0);
 line.update(space(2),200);line.update(factory(3),250);assert.notEqual(line.state.model,first.model);assert.equal(line.state.cycle,0);assert.equal(line.state.elapsed,0);
});
test('pause, repeated render snapshots and resize cannot consume random or mutate a cycle',()=>{
 let calls=0;const line=createFactoryProduction(()=>{calls++;return .6;});line.update(factory(1),10);line.update(factory(1),23.4);const expected=line.state,before=calls;
 for(let i=0;i<60;i++){line.update(factory(1),23.4);const snapshot=line.state;snapshot.color='bad';assert.deepEqual(line.state,expected);}assert.equal(calls,before);
 line.reset();assert.equal(line.state,null);line.update(factory(1),0);assert.notEqual(line.state.model,expected.model);
});
test('Cybertruck stays steel for repeated cycles and skips paint-specific color draws',()=>{
 let calls=0;const line=createFactoryProduction(()=>{calls++;return .999;});line.update(factory(1),20);assert.equal(line.state.model,'cybertruck');assert.equal(calls,1);
 line.update(factory(1),20+PRODUCTION_SECONDS*4+12);assert.equal(line.state.color,'steel');assert.equal(line.state.stage,2);assert.equal(line.state.cycle,4);assert.equal(calls,1);
});

test('the outgoing line keeps assembling until the physical factory doorway has passed',()=>{
 const line=createFactoryProduction(()=>0);line.update(factory(1),50);line.update({...space(2),from:'tesla-factory',moving:true},57);assert.equal(line.state.elapsed,7);assert.equal(line.state.stage,1);
 line.update({...space(2),from:'spaceport',moving:false},60);assert.equal(line.state.elapsed,7);
});
