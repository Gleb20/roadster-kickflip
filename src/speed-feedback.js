import {GAMEPLAY as C} from './gameplay-config.js?v=3.4.2';

// Frame the normal ramp; temporary bonuses must remain visible as faster motion.
export function viewScale(width,height,progress){
  const anchor=width*(width<600?.24:.29);
  const cruise=C.startSpeed+(C.maxSpeed-C.startSpeed)*Math.max(0,Math.min(1,progress/C.rampSeconds));
  return Math.min(1.25,Math.max(.68,width/650),height/430,(width-anchor-24)/Math.max(550,cruise*.95));
}

export function speedFeedback(pace,streak){
  const bonus=Math.max(0,Math.min(C.maxStreak,streak,pace.speed/Math.max(1,pace.base)-1));
  const intensity=bonus/C.maxStreak;
  return {
    factor:1+bonus,intensity,lean:-.035*intensity,
    impossibru:pace.base>=C.maxSpeed-1e-6&&bonus>=C.maxStreak-1e-6,
    flameLength:bonus>0?20+35*intensity:0,
    flameOpacity:bonus>0?.12+.24*intensity:0,
  };
}
