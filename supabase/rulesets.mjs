import * as legacy from './rulesets/roadster-v342/run.js';
import * as previous from './rulesets/roadster-v380/run.js';
import * as encounters from './rulesets/roadster-v400/run.js';
import * as current from './rulesets/roadster-v410/run.js';
import * as boosters from './rulesets/roadster-v430/run.js';
import * as magnetic from './rulesets/roadster-v432/run.js';
import * as rails from './rulesets/roadster-v440/run.js';
import * as rareBackup from './rulesets/roadster-v442/run.js';
const supported=new Map([legacy,previous,encounters,current,boosters,magnetic,rails,rareBackup].map(r=>[r.RULESET,r]));
export function ruleset(id){const r=supported.get(id);if(!r)throw Error('Unsupported ruleset');return r;}
