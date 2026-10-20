import {parentPort,workerData} from 'node:worker_threads';
import {verifyReplay} from './rulesets/roadster-v341/run.js';
try{parentPort.postMessage({outcome:'accepted',result:verifyReplay(workerData)});}catch(error){
 const invalid=['Invalid or unsupported replay','Invalid replay input','Replay does not end at its first collision'].includes(error.message);
 parentPort.postMessage({outcome:invalid?'rejected':'retry'});
}
