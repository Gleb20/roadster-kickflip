import {GAMEPLAY as C} from './gameplay-config.js?v=4.4.1';
export const LESSONS=[
  {id:'jump',at:0,text:'HOLD, THEN RELEASE TO JUMP',detail:'A quick tap clears a low obstacle.'},
  {id:'charge',at:15,text:'CHARGE AT LEAST HALFWAY',detail:'More height gives you time for a flip.'},
  {id:'flip',at:20,text:'IN THE AIR: HOLD TO FLIP',detail:'Grab to spin faster. Release to straighten and slow down.'},
  {id:'thrust',at:35,text:'HOLD THRUST / SHIFT IN THE AIR',detail:'Jets push away from the underbody. Land flips to refuel.'},
  {id:'air',at:60,text:'LOW FLYER. JUMP CLEAR.',detail:'Incoming aircraft cross your lane. Time a clean jump.'},
  {id:'near',at:90,text:'LAND CLOSE. JUMP LATE.',detail:'Tight landings and late takeoffs earn +25 base points.'},
];
export function createCoach(storage){
  let done={};try{done=JSON.parse(storage?.getItem(C.tutorialKey)||'{}')||{};}catch{}
  let hiddenUntil=0,last='',shown=0;
  const save=()=>{try{storage?.setItem(C.tutorialKey,JSON.stringify(done));}catch{}};
  return {
    beginRun(){hiddenUntil=0;last='';shown=0;},
    complete(id){if(done[id])return;done[id]=true;save();},
    reset(){done={};hiddenUntil=0;last='';save();},
    dismiss(time){hiddenUntil=time+15;},
    next(time,playing=true,{air=false}={}){
      if(!playing||time<hiddenUntil)return null;
      const eligible=LESSONS.filter(l=>l.id!=='air'&&time>=l.at&&!done[l.id]);
      // Re-present the contextually important lesson instead of blocking on lesson one.
      const lesson=air&&!done.air?LESSONS.find(l=>l.id==='air'):eligible.at(-1);if(!lesson)return null;
      if(last!==lesson.id){last=lesson.id;shown=time;}
      if(time-shown>7)return null;
      return lesson;
    },
    get done(){return {...done};},
  };
}
