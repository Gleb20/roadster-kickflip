import * as legacy from './rulesets/roadster-v342/run.js';
import * as previous from './rulesets/roadster-v380/run.js';
import * as encounters from './rulesets/roadster-v400/run.js';
import * as current from './rulesets/roadster-v410/run.js';
import * as boosters from './rulesets/roadster-v430/run.js';
import * as magnetic from './rulesets/roadster-v432/run.js';
import * as rails from './rulesets/roadster-v440/run.js';
import * as rareBackup from './rulesets/roadster-v442/run.js';
import * as director from './rulesets/roadster-v460/run.js';
import * as airRotation from './rulesets/roadster-v461/run.js';
import * as liveness from './rulesets/roadster-v463/run.js';
import * as pacing from './rulesets/roadster-v470/run.js';
import * as fallback from './rulesets/roadster-v471/run.js';
import * as reserve from './rulesets/roadster-v472/run.js';
import * as timedBiomes from './rulesets/roadster-v473/run.js';
import * as speedPlateau from './rulesets/roadster-v480/run.js';
const supported=new Map([legacy,previous,encounters,current,boosters,magnetic,rails,rareBackup,director,airRotation,liveness,pacing,fallback,reserve,timedBiomes,speedPlateau].map(r=>[r.RULESET,r]));
export function ruleset(id){const r=supported.get(id);if(!r)throw Error('Unsupported ruleset');return r;}
