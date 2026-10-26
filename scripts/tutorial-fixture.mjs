// Genuine input-only lesson witness, also used by replay/hosted QA.
import {tutorialLesson} from '../src/tutorial.js';
export function tutorialInput(run){
 const {T,P,S,input,G}=run;if(!T.active||T.cleared)return;
 const id=tutorialLesson(T),send=action=>run.command(action);
 if(['air','pickup'].includes(id))return;
 if(!P.airborne&&!G.support&&!T.jumped){
  const object=id==='rail'?S.rails[0]:S.obs[0],charge=id==='jump'?.08:id==='rail'?.6:1;
  const ready=!object||object.x/S.speed<=(id==='rail'?.35:.27)+charge*.4;
  if(ready&&!input.charging)send('primary-down');
  if(input.charging&&input.charge>=charge)send('primary-up');
 }
 if(P.airborne&&id==='flip'){
  if(P.time>.04&&P.angle> -5.6&&!input.spin)send('primary-down');
  if(P.angle<=-5.6&&input.spin)send('primary-up');
 }
 if(P.airborne&&id==='thrust'){
  if(P.time>.1&&T.thrust<.25&&!input.thrust)send('thrust-on');
  if(T.thrust>=.25&&input.thrust)send('thrust-off');
 }
}
