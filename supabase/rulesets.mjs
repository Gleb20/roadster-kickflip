import * as legacy from './rulesets/roadster-v342/run.js';
import * as current from './rulesets/roadster-v380/run.js';
const supported=new Map([legacy,current].map(r=>[r.RULESET,r]));
export function ruleset(id){const r=supported.get(id);if(!r)throw Error('Unsupported ruleset');return r;}
