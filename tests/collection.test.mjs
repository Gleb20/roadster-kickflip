import test from 'node:test';
import assert from 'node:assert/strict';
import {createCollection,COLLECTION_KEY} from '../src/collection.js';
const storage=()=>{const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),map};};
test('encounter and first view are separate persistent transitions',()=>{
 const s=storage();let now=10;const c=createCollection(s,['truck','joe'],()=>now++);
 assert.equal(c.state('truck'),'locked');assert.equal(c.discover('truck'),true);assert.equal(c.state('truck'),'new');
 assert.equal(c.discover('truck'),false);assert.equal(c.state('truck'),'new');
 const reload=createCollection(s,['truck','joe'],()=>now++);assert.equal(reload.state('truck'),'new');
 assert.equal(reload.view('joe'),false);assert.equal(reload.view('truck'),true);assert.equal(reload.state('truck'),'viewed');
 assert.equal(createCollection(s,['truck','joe']).state('truck'),'viewed');assert.equal(reload.discover('truck'),false);assert.equal(reload.state('truck'),'viewed');
 assert.equal(reload.discover('unknown'),false);assert.equal(reload.view('unknown'),false);
});
test('unavailable, corrupt and future storage never break play or overwrite unknown versions',()=>{
 const unavailable=createCollection({getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}},['truck']);
 assert.equal(unavailable.discover('truck'),true);assert.equal(unavailable.state('truck'),'new');assert.equal(unavailable.persistent,false);
 for(const value of ['broken',JSON.stringify({version:99,entries:{truck:{firstEncounteredAt:4}}})]){
  const s=storage();s.setItem(COLLECTION_KEY,value);const c=createCollection(s,['truck']);c.discover('truck');assert.equal(c.state('truck'),'new');assert.equal(s.getItem(COLLECTION_KEY),value);assert.equal(c.persistent,false);
 }
});
test('removed IDs and viewed status survive catalogue changes without exposing mutable state',()=>{
 const s=storage();const c=createCollection(s,['truck','joe']);c.discover('joe');c.view('joe');
 const updated=createCollection(s,['truck']);updated.discover('truck');const restored=createCollection(s,['truck','joe']);assert.equal(restored.state('joe'),'viewed');
 const copy=restored.snapshot();copy.entries.joe.firstViewedAt=null;assert.equal(restored.state('joe'),'viewed');
});
