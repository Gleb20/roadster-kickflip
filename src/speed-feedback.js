import {GAMEPLAY as C,basePace} from './gameplay-config.js?v=4.12.0';

// Allocate forward space before shrinking the player: all inputs are actual velocity.
const clamp01=value=>Math.max(0,Math.min(1,value));
const viewStrength=speed=>Math.max(0,Math.min(6,(speed-C.startSpeed)/300));
export function baseViewScale(width,height){
 const x=width*(width<600?.24:.29);
 return Math.min(1.25,Math.max(.68,width/650),height/430,(width-x-24)/550);
}
export function speedView(width,height,speed,strength=viewStrength(speed)){
 const baseScale=baseViewScale(width,height),v=360+300*strength,u=Math.max(0,(v-360)/380);
 const original=Math.min(1.3,strength),a=clamp01((v-550)/190),blend=a*a*(3-2*a);
 const oldScale=baseScale/(1+.44*original),oldX=width*((width<600?.24:.29)-.08*original);
 // Beyond the sustained pickup peak, retain forward sight for residual thrust.
 const zoom=Math.min(.40,.40*u)+Math.max(0,Math.min(v,1620)-1100)*.00065+Math.max(0,v-1620)*.0009;
 const nextScale=baseScale/(1+zoom),nextX=width*Math.max(width<600?.075:.09,(width<600?.24:.29)-.17*(u+.18*Math.sin(Math.PI*clamp01(u))));
 const scale=oldScale+(nextScale-oldScale)*blend,x=oldX+(nextX-oldX)*blend;
 return {scale,x,baseScale,strength,energy:clamp01((speed-C.startSpeed)/(C.maxSpeed*1.25-C.startSpeed)),sceneryScale:Math.max(.72,Math.min(1.15,baseScale))};
}
// For each side of600px the base scale is the forward-room cap until1.25.
// Forward sight decreases to each cap/breakpoint, then increases with width.
// H>=390 only lowers scale from this maximum-height envelope.
export function minimumForwardSight(speed,strength=viewStrength(speed)){
 const phone=speedView(600-1e-7,900,speed,strength),width=(550*1.25+24)/.71,desktop=speedView(width,900,speed,strength);
 return Math.min((600-1e-7-phone.x)/phone.scale,(width-desktop.x)/desktop.scale);
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
 return speedView(width,height,basePace(progress)).scale;
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

// Portrait phones: width 320..599, height >=568. Both scale-boundary extrema
// are included; height cannot reduce the forward-room scale in this range.
export function maximumMobileSight(speed,strength=viewStrength(speed)){
 return Math.max(...[320,600-1e-7].map(w=>{const v=speedView(w,Math.max(w,568),speed,strength);return (w-v.x)/v.scale;}));
}
