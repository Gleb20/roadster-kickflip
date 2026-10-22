import * as legacy from './rulesets/roadster-v342/run.js';
import * as previous from './rulesets/roadster-v380/run.js';
import * as current from './rulesets/roadster-v400/run.js';
const supported=new Map([legacy,previous,current].map(r=>[r.RULESET,r]));
export function ruleset(id){const r=supported.get(id);if(!r)throw Error('Unsupported ruleset');return r;}
