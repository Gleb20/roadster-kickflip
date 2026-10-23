import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL,fileURLToPath} from 'node:url';
import path from 'node:path';

// Pure local fixture builder. The caller may reuse this for a server-owned QA seed.
export function rotationFixture(module,seed=17){
 const run=module.createRun({seed});run.reset();let activeCheckpoint=null;
 while(run.S.mode==='playing'){
  if(run.S.tick===0)run.command('primary-down');
  if(run.S.tick===48){run.command('primary-up');run.command('primary-down');}
  if(run.S.tick===144)run.command('primary-up');
  run.step();run.drainEvents();
  if(run.P.settleTarget&&!activeCheckpoint)activeCheckpoint=JSON.parse(JSON.stringify(run.snapshot()));
  assert.ok(run.S.tick<120*90,'positive spin fixture must finish within90s');
 }
 assert.ok(activeCheckpoint,'fixture must exercise the new release state');
 const replay=run.replay(),expected=module.verifyReplay(replay);
 assert.equal(expected.flips,1,'first controlled flip is banked');
 // Resume the actual saved active-release state, not a client-authored state.
 const resumed=module.createRun({record:false});resumed.restore(activeCheckpoint);
 while(resumed.S.mode==='playing'){resumed.step();resumed.drainEvents();}
 assert.deepEqual(resumed.snapshot(),run.snapshot());
 assert.throws(()=>module.verifyReplay({...replay,ticks:replay.ticks-1}));
 assert.throws(()=>module.verifyReplay({...replay,ticks:replay.ticks+1}));
 return {replay,expected,activeCheckpoint,negative:{fakeScore:expected.score+1,fakeEnd:{...replay,ticks:replay.ticks+1}},notes:{kind:'single controlled release; no QA state injection, no booster, no network',sourceRuleset:module.RULESET}};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const source=process.env.FIXTURE_MODULE,expectedRuleset=process.env.EXPECTED_RULESET;
 assert.ok(source&&expectedRuleset,'Set FIXTURE_MODULE to the final frozen run.js and EXPECTED_RULESET explicitly');
 const resolved=path.resolve(source);
 assert.ok(process.env.ALLOW_UNFROZEN_FIXTURE==='1'||resolved.includes(path.sep+'rulesets'+path.sep),'Release fixture must use a frozen ruleset module');
 const module=await import(pathToFileURL(resolved));assert.equal(module.RULESET,expectedRuleset);
 const seed=Number(process.env.FIXTURE_SEED||17);assert.ok(Number.isInteger(seed)&&seed>=0&&seed<=0xffffffff);
 const fixture=rotationFixture(module,seed),out=path.resolve(process.env.FIXTURE_OUT||'/tmp/tesla-rotation-fixture');await mkdir(out,{recursive:true});
 await writeFile(path.join(out,'spin.json'),JSON.stringify(fixture,null,2));
 console.log(JSON.stringify({ruleset:expectedRuleset,seed,expected:fixture.expected,activeTick:fixture.activeCheckpoint.S.tick,unfrozenRehearsal:process.env.ALLOW_UNFROZEN_FIXTURE==='1',networkRequests:0,out}));
}
