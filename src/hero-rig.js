/** Logical paper-rig coordinates: x right, y down; origin at the riding soles. */
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),mix=(a,b,t)=>a+(b-a)*clamp(t);
export const HERO_RIG=Object.freeze({id:'paper-rider-v1',shoulder:Object.freeze({x:22,y:-82}),hip:Object.freeze({x:11,y:-43}),arm:Object.freeze({upper:Math.hypot(12,17),lower:10}),leg:Object.freeze({upper:28,lower:27}),soleOffset:5,boardHalfWidth:43});
export const HERO_APPEARANCE=Object.freeze({head:'head',shirt:'#252a2d',arms:'#303536',rearLeg:'#343b43',frontLeg:'#42464c',shoes:'#e8e7dc',emblem:true});
// Anatomical identities, not target direction: +1 is drawn in the near layer.
export const HERO_HANDS=Object.freeze({grab:1,interaction:-1});
export const HERO_TRICKS=Object.freeze([
 Object.freeze({id:'tuck',tilt:-.04,bank:-.04}),
]);
export function selectTrick(){return 0;}
export function trickCarPose(trick=0,grab=0,time=0){
 const p=HERO_TRICKS[trick]||HERO_TRICKS[0],g=clamp(grab);return {x:0,y:-2*g,angle:p.bank*g-.14*Math.sin(Math.PI*clamp(time/.18))*(1-g)};
}
export function heroToWorld(point,flight={y:0,angle:0},offset=-29.5){
 const a=flight.angle||0,c=Math.cos(a),s=Math.sin(a),y=point.y+offset+65;
 return {x:c*point.x-s*y,y:s*point.x+c*y-65-(flight.y||0)};
}
export function worldToHero(point,flight={y:0,angle:0},offset=-29.5){
 const p=unrotate({x:point.x,y:point.y+(flight.y||0)+65},flight.angle||0);return {x:p.x,y:p.y-65-offset};
}
// Declarative channels share one sampler. Coordinates are for the right side;
// the rig mirrors x for the left side. Phase is in radians, frequency in Hz.
export const HERO_CLIPS=Object.freeze({
 wave:Object.freeze({elbowX:39,elbowY:-98,wristX:Object.freeze({value:46,amplitude:5,frequency:7/(2*Math.PI)}),wristY:-117}),
 brace:Object.freeze({elbowX:29,elbowY:-37,wristX:31,wristY:Object.freeze({keys:Object.freeze([[0,-30],[1,-25]])})}),
 flailLeft:Object.freeze({elbowX:-44,elbowY:-75,wristX:-65,wristY:-90}),
 flailRight:Object.freeze({elbowX:44,elbowY:-102,wristX:56,wristY:-118}),
 reboundLeft:Object.freeze({wristX:-42,wristY:-56}),
 reboundRight:Object.freeze({wristX:18,wristY:-67}),
});
export function sampleClip(clip,time=0,progress=0){
 const pose={};for(const [channel,track] of Object.entries(clip)){
  if(typeof track==='number'){pose[channel]=track;continue;}
  if(track.keys){const keys=track.keys,p=clamp(progress,keys[0][0],keys.at(-1)[0]);let i=1;while(i<keys.length-1&&p>keys[i][0])i++;const [a,b]=[keys[i-1],keys[i]];pose[channel]=mix(a[1],b[1],(p-a[0])/(b[0]-a[0]));}
  else pose[channel]=track.value+track.amplitude*Math.sin(time*track.frequency*Math.PI*2+(track.phase||0));
 }return pose;
}
export function unrotate(point,angle){return {x:point.x*Math.cos(angle)+point.y*Math.sin(angle),y:point.y*Math.cos(angle)-point.x*Math.sin(angle)};}
/** Fixed-length two-bone IK, including too-near/far targets; never stretches. */
export function solveTwoBone(root,target,upper,lower,bend=1){
 if(!(upper>0&&lower>0))throw Error('Bone lengths must be positive');
 const dx=target.x-root.x,dy=target.y-root.y,angle=Math.atan2(dy,dx),distance=clamp(Math.hypot(dx,dy),Math.abs(upper-lower)+1e-8,upper+lower-1e-8);
 const along=(upper*upper-lower*lower+distance*distance)/(2*distance),height=Math.sqrt(Math.max(0,upper*upper-along*along));
 const x=Math.cos(angle),y=Math.sin(angle),joint={x:root.x+x*along-y*height*bend,y:root.y+y*along+x*height*bend};
 return {joint,end:{x:root.x+x*distance,y:root.y+y*distance}};
}
export function raisedArm(shoulder,upper,lower,side){
 const angle=Math.atan2(-.55,side*Math.sqrt(1-.55**2)),reach=(upper+lower)*.72;
 const wrist={x:shoulder.x+reach*Math.cos(angle),y:shoulder.y+reach*Math.sin(angle)};
 const {joint:elbow}=solveTwoBone(shoulder,wrist,upper,lower,side);return {elbow,wrist};
}
/** Rotate torso-local coordinates around the hips, preserving attachment. */
export function rotateAboutHip(point,angle,rig=HERO_RIG){
 const p=unrotate({x:point.x,y:point.y-rig.hip.y},-angle);return {x:p.x,y:p.y+rig.hip.y};
}
export function boardGrabArm(side,drop,torsoAngle,rig=HERO_RIG,point=null,crouch=0,torsoShift=4*crouch){
 const shoulder={x:side*rig.shoulder.x,y:rig.shoulder.y},wrist=rotateAboutHip({x:(point?.x??side*rig.boardHalfWidth-4)-torsoShift,y:(point?.y??10)-drop},-torsoAngle,rig);
 const dx=wrist.x-shoulder.x,dy=wrist.y-shoulder.y,d=Math.hypot(dx,dy),limit=rig.arm.upper+rig.arm.lower-.1;
 if(d>limit){wrist.x=shoulder.x+dx*limit/d;wrist.y=shoulder.y+dy*limit/d;}
 const {joint:elbow,end}=solveTwoBone(shoulder,wrist,rig.arm.upper,rig.arm.lower,-side);return {shoulder,elbow,wrist:end};
}
export function seatedLegPose(side,drop,rig=HERO_RIG,impact=0){
 const compression=clamp(impact),hip={x:side*rig.hip.x,y:rig.hip.y+drop},foot=side>0?{x:57-9*compression,y:drop-22-6*compression}:{x:37-8*compression,y:drop-19-5*compression},angle=side>0?-.22:.10;
 const ankle={x:foot.x+rig.soleOffset*Math.sin(angle),y:foot.y-rig.soleOffset*Math.cos(angle)};
 const {joint:knee}=solveTwoBone(hip,ankle,rig.leg.upper,rig.leg.lower,-1);return {hip,knee,ankle,foot,angle};
}
export function sampleHeroLeg(side,{air=false,crouch=0,drop=0,seat=0,tilt=0,impact=0,grab=0,car=trickCarPose(0,grab),offset=-29.5},rig=HERO_RIG){
 let angle=air?0:side<0?-.17:.31;const support={x:side*25,y:air?-1:side<0?1.6:4.8};
 const foot=air?{...support}:unrotate(support,tilt),world={x:support.x+rig.soleOffset*Math.sin(angle),y:support.y-rig.soleOffset*Math.cos(angle)},ankle=air?world:unrotate(world,tilt);
 const hip={x:side*rig.hip.x-20*grab,y:rig.hip.y+drop},knee={x:side*(23+15*crouch),y:-25-(air?10:0)+drop*.5};
 if(air&&grab>0&&!seat){
  // Reuse the measured standing supports, transformed with the photographed hull.
  // Both feet stay planted as the knees tuck; never choose a one-foot variant.
  const roof=unrotate({x:side*25,y:offset+(side<0?1.6:4.8)},-car.angle);
  Object.assign(foot,unrotate({x:car.x+roof.x,y:car.y+roof.y-offset},tilt));
  angle=car.angle-tilt+(side<0?-.17:.31);
  const target={x:foot.x+rig.soleOffset*Math.sin(angle),y:foot.y-rig.soleOffset*Math.cos(angle)},chain=solveTwoBone(hip,target,rig.leg.upper,rig.leg.lower,target.x>=hip.x?-1:1);
  Object.assign(knee,chain.joint);Object.assign(ankle,chain.end);foot.x=ankle.x-rig.soleOffset*Math.sin(angle);foot.y=ankle.y+rig.soleOffset*Math.cos(angle);
 }
 if(seat>0){const p=seatedLegPose(side,drop,rig,impact);for(const [a,b] of [[foot,p.foot],[ankle,p.ankle],[knee,p.knee]]){a.x=mix(a.x,b.x,seat);a.y=mix(a.y,b.y,seat);}angle=mix(angle,p.angle,seat);}
 return {hip,knee,ankle,foot,angle:air&&!seat?angle:angle-tilt};
}
/** Align the existing neutral palm/finger axis with its forearm. */
export function relaxedHandAngle(arm){return Math.atan2(arm.wrist.y-arm.elbow.y,arm.wrist.x-arm.elbow.x)+Math.PI/2;}
/** Rear arm owns encounters, near left owns grab; brace/fall still override both. */
export function sampleHeroArm(side,{grind=0,air=false,crouch=0,drop=0,wave=0,taunt=0,aim=null,special=false,guns=false,facing=0,reaction={},reactionSpace='target',mouth={x:14,y:-103},grab=0,grabPoint=null,parentAngle=0,torsoAngle=.09*crouch+.55*grab,torsoShift=4*crouch-24*grab,seat=0,push=0,flail=0,time=0,falling=false,impact=0,fallAngle=0},rig=HERO_RIG){
 const acting=air||grab>0?side===HERO_HANDS.interaction:side===facing;
 const directed=reactionSpace==='target'&&aim&&acting;
 const shoulder={x:side*rig.shoulder.x,y:rig.shoulder.y},k=directed?taunt:0;
 let raised=null;
 if(k){const angle=Math.atan2(aim.y-shoulder.y,aim.x-shoulder.x),p=solveTwoBone(shoulder,{x:shoulder.x+58*Math.cos(angle),y:shoulder.y+58*Math.sin(angle)},rig.arm.upper,rig.arm.lower,side);raised={elbow:p.joint,wrist:p.end};}
 const balanceWrist={x:side*(grind?51:50),y:side<0?(grind?-85:-89):(grind?-76:-73)};
 let elbow={x:mix(side*34,raised?.elbow.x??side*34,k),y:mix(-65,raised?.elbow.y??-65,k)},wrist={x:mix(air?balanceWrist.x:side*44,raised?.wrist.x??side*44,k),y:mix(air?balanceWrist.y:-65+10*crouch,raised?.wrist.y??-65,k)};
 const armWave=falling?wave*(.8+.2*Math.sin(time*13+side)):side===1?wave:0,w=sampleClip(HERO_CLIPS.wave,time);
 elbow={x:mix(elbow.x,side*w.elbowX,armWave),y:mix(elbow.y,w.elbowY,armWave)};wrist={x:mix(wrist.x,side*w.wristX,armWave),y:mix(wrist.y,w.wristY,armWave)};
 if(grind){const balance=solveTwoBone(shoulder,balanceWrist,rig.arm.upper,rig.arm.lower,-side);elbow=balance.joint;wrist=balance.end;}
 if(side===HERO_HANDS.interaction&&reactionSpace==='self'&&reaction.reach>0){const r=reaction.reach,i=reaction.inhale;wrist.x=mix(wrist.x,mouth.x-17-40*(1-i),r);wrist.y=mix(wrist.y,mouth.y+8*(1-i),r);}
 if(special&&directed){const angle=Math.atan2(aim.y-shoulder.y,aim.x-shoulder.x);wrist={x:shoulder.x+Math.cos(angle)*58,y:shoulder.y+Math.sin(angle)*58};}
 if(grab>0&&side===HERO_HANDS.grab){const p=boardGrabArm(side,drop,torsoAngle,rig,grabPoint,crouch,torsoShift);for(const [a,b] of [[elbow,p.elbow],[wrist,p.wrist]]){a.x=mix(a.x,b.x,grab);a.y=mix(a.y,b.y,grab);}}
 if((air||grab>0)&&!falling){const p=solveTwoBone(shoulder,wrist,rig.arm.upper,rig.arm.lower,-side);elbow=p.joint;wrist=p.end;}
 if(seat>0||push>0){const weight=Math.max(seat,push),p=sampleClip(HERO_CLIPS.brace,time,push);elbow.x=mix(elbow.x,side*p.elbowX-9,weight);elbow.y=mix(elbow.y,p.elbowY,weight);wrist.x=mix(wrist.x,side*p.wristX-12,weight);wrist.y=mix(wrist.y,p.wristY,weight);}
 if(flail>0){const p=sampleClip(side<0?HERO_CLIPS.flailLeft:HERO_CLIPS.flailRight);elbow.x=mix(elbow.x,p.elbowX,flail);elbow.y=mix(elbow.y,p.elbowY,flail);wrist.x=mix(wrist.x,p.wristX,flail);wrist.y=mix(wrist.y,p.wristY,flail);}
 if(falling){
  const weight=Math.max(seat,flail),compression=clamp(impact),p=sampleClip(side<0?HERO_CLIPS.reboundLeft:HERO_CLIPS.reboundRight);
  shoulder.y+=5*compression;
  const up=unrotate({x:p.wristX,y:p.wristY+12*compression},fallAngle+.09*crouch);
  const target={x:shoulder.x+up.x,y:shoulder.y+up.y};
  const raised=solveTwoBone(shoulder,target,rig.arm.upper,rig.arm.lower,side);
  elbow={x:mix(elbow.x,raised.joint.x,weight),y:mix(elbow.y,raised.joint.y,weight)};
  wrist={x:mix(wrist.x,raised.end.x,weight),y:mix(wrist.y,raised.end.y,weight)};
 }
 // Every channel ends in the same measured idle skeleton, including blends,
 // ground poses, gestures and falling. Unreachable targets are projected.
 const fixed=solveTwoBone(shoulder,wrist,rig.arm.upper,rig.arm.lower,grab>0&&side===HERO_HANDS.grab?-side:side);
 return {shoulder,elbow:fixed.joint,wrist:fixed.end,taunt:k,wave:armWave};
}
export function createHeroAnimation(){return {taunt:0,wave:0,facing:0,airborne:false,flightIndex:0,trick:0,landingAge:1,landingStrength:0,lastVy:0};}
export function advanceHeroAnimation(state,dt,{target=false,distance=0,cameo=false,airborne=false,falling=false,vy=0,seed=0}={}){
 if(!airborne&&state.airborne&&!falling){state.landingAge=0;state.landingStrength=clamp(Math.abs(state.lastVy)/1000,.35,1);}
 else state.landingAge+=Math.max(0,dt);
 if(airborne||falling)state.landingAge=1;
 state.lastVy=vy;
 if(airborne&&!state.airborne){state.trick=selectTrick(seed,state.flightIndex++,state.flightIndex>1?state.trick:-1);}state.airborne=airborne;
 const weight=1-Math.exp(-Math.max(0,dt)*15),ease=t=>{t=clamp(t);return t*t*(3-2*t);};
 state.taunt=mix(state.taunt,target?ease((360-Math.abs(distance))/110):0,weight);state.wave=mix(state.wave,cameo?1:0,weight);state.facing=mix(state.facing,target?Math.sign(distance)||1:0,weight);return state;
}

/** One grounded compression pulse; simulation time freezes it during pause. */
export function landingCrouch(state){
 const phase=clamp(state.landingAge/.28);
 return .48*state.landingStrength*Math.sin(Math.PI*phase)**2;
}
