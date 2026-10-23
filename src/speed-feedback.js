import {GAMEPLAY as C} from './gameplay-config.js?v=4.4.1';

// Widen the normal ramp horizon; temporary bonuses still read as faster motion.
export function viewScale(width,height,progress){
  const anchor=width*(width<600?.24:.29);
  const ramp=Math.max(0,Math.min(1,progress/C.rampSeconds));
  const cruise=C.startSpeed+(C.maxSpeed-C.startSpeed)*ramp;
  const base=Math.min(1.25,Math.max(.68,width/650),height/430,(width-anchor-24)/Math.max(550,cruise*.95));
  return base/(1+.4*ramp);
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
