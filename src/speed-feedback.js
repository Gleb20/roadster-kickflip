import {GAMEPLAY as C} from './gameplay-config.js?v=4.5.0';

// Allocate forward space before shrinking the player: all inputs are actual velocity.
const clamp01=value=>Math.max(0,Math.min(1,value));
const viewStrength=speed=>Math.max(0,Math.min(1.3,(speed-C.startSpeed)/(C.maxSpeed-C.startSpeed)));
export function baseViewScale(width,height){
 const x=width*(width<600?.24:.29);
 return Math.min(1.25,Math.max(.68,width/650),height/430,(width-x-24)/550);
}
export function speedView(width,height,speed,strength=viewStrength(speed)){
 const baseScale=baseViewScale(width,height),x=width*((width<600?.24:.29)-.08*strength);
 return {scale:baseScale/(1+.44*strength),x,baseScale,strength,
  energy:clamp01((speed-C.startSpeed)/(C.maxSpeed*1.25-C.startSpeed)),
  sceneryScale:Math.max(.72,Math.min(1.15,baseScale))/(1+.18*strength)};
}
export const createSpeedView=()=>({strength:0});
export function advanceSpeedView(state,dt,width,height,speed){
 const target=viewStrength(speed);
 const rate=target>state.strength?4:1.25;
 state.strength+=(target-state.strength)*(1-Math.exp(-Math.max(0,dt)*rate));
 return speedView(width,height,speed,state.strength);
}
// Static normal-ramp framing retained for previews; live camera reads effective speed.
export function viewScale(width,height,progress){
 return speedView(width,height,C.startSpeed+(C.maxSpeed-C.startSpeed)*clamp01(progress/C.rampSeconds)).scale;
}

// Keep the world above the thumb controls, including short landscape viewports.
export function roadBaseline(height){return Math.min(height*.76,height-130);}

export function speedFeedback(pace,streak,pickup=0){
  const bonus=Math.max(0,Math.min(C.maxStreak,streak,pace.speed/Math.max(1,pace.base)-1));
  const intensity=Math.max(bonus/C.maxStreak,pickup);
  return {
    factor:1+bonus,intensity,lean:-.035*intensity,
    impossibru:pace.base>=C.maxSpeed-1e-6&&bonus>=C.maxStreak-1e-6,
    flameLength:bonus>0||pickup>0?20+35*intensity:0,
    flameOpacity:bonus>0||pickup>0?.12+.24*intensity:0,
  };
}
