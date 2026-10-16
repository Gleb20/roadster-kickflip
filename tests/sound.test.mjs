import test from 'node:test';
import assert from 'node:assert/strict';
import {createSound} from '../src/sound.js';
test('sound opt-in persists, waits for user unlock and mutes immediately',()=>{
 const values=new Map(),events=[];let created=0;
 const storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 class AudioContext{
  state='running';currentTime=0;destination={};
  constructor(){created++}
  createGain(){return {gain:{setValueAtTime:v=>events.push(['gain',v]),exponentialRampToValueAtTime:()=>{}},connect(){},disconnect(){}}}
  createOscillator(){return {frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){},start(){events.push(['start'])},stop(){}}}
 }
 const sound=createSound({storage,AudioContext});
 sound.tone(440);assert.equal(created,0);assert.equal(sound.enabled,false);
 sound.toggle();assert.equal(created,1);sound.tone(440);assert.ok(events.some(e=>e[0]==='start'));
 const restored=createSound({storage,AudioContext});assert.equal(restored.enabled,true);assert.equal(created,1);
 restored.unlock();assert.equal(created,2);
 sound.toggle();assert.equal(events.at(-1)[1],0);
 const count=events.length;sound.tone(440);assert.equal(events.length,count);
});
test('unavailable storage and audio never prevent gameplay',()=>{
 const storage={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
 const sound=createSound({storage,AudioContext:null});sound.toggle();sound.unlock();sound.tone(400);
 assert.equal(sound.enabled,true);
});
