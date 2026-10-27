// All v3 balance values use logical world units and simulation seconds.
export const GAMEPLAY = Object.freeze({
  version:'4.13.0', gravity:1550, jumpSpeed:560, chargedSpeed:440, chargeSeconds:.4,
  spinSpeed:7.2, spinAcceleration:60, releaseSpeed:1.8, releaseDeceleration:24,
  settleMinTurn:Math.PI*17/12, settleApproach:Math.PI*7/12, settleFullAngle:Math.PI*5/36, settleDamping:16,
  landingAngle:Math.PI*2/9, landingOmega:Math.PI*4/3, perfectAngle:Math.PI/18, perfectPoints:50,
  thrustAcceleration:2100, horizontalDrag:1.8, maxHorizontal:260,
  tank:100, initialFuel:50, fuelPerSecond:80, fuelPerFlip:25, attachSeconds:.12,
  obstaclePoints:50, flipFactor:50, nearPoints:25, nearSeconds:.12,
  maxMultiplier:50, multiplierStep:1, comboDuration:8, comboFalloff:1.2, comboDecaySeconds:.5,
  streakStep:.05, maxStreak:.25, streakHold:4, streakDecay:.1,
  fallSeconds:2.8, fallSpeedSeconds:.65, fallMaxRate:1.6, fallTapRate:.15, routeTimingMargin:.035, routeFuelReserve:20,
  stumbleSeconds:.3, recoveryRatio:.55, recoveryMin:1.2, recoveryExtra:2.8,
  startSpeed:360, maxSpeed:1100, rampSeconds:150,
  stages:Object.freeze([0,15,35,60,90,120,150]),
  bestKey:'roadster-best-v3', tutorialKey:'roadster-coach-v3',
});

// Preserve the original opening, then reach a finite smooth late-run plateau.
export function basePace(progress){
 if(progress<=20)return GAMEPLAY.startSpeed+2*Math.max(0,progress);
 const u=Math.max(0,Math.min(1,(progress-20)/130));
 return 400+260*u+1160*u*u-860*u*u*u;
}
export function basePaceSlope(progress){
 if(progress<=20)return 2;if(progress>=150)return 0;
 const u=(progress-20)/130;return (260+2320*u-2580*u*u)/130;
}

// Score drives the challenge; a point bonus is deliberately allowed to advance it.
export const SCORE_STAGES=Object.freeze([0,2500,7500,15000,30000,60000,100000]);
export function scoreStage(score){return SCORE_STAGES.filter(n=>score>=n).length-1;}
export function scorePace(score,experienced=false,seconds=0){
 const speeds=[520,590,680,790,910,1010,1100],n=Math.max(0,score),i=scoreStage(n);
 const next=Math.min(i+1,speeds.length-1),u=next===i?0:(n-SCORE_STAGES[i])/(SCORE_STAGES[next]-SCORE_STAGES[i]);
 const target=speeds[i]+(speeds[next]-speeds[i])*u;
 return target-(experienced?0:Math.max(0,160-seconds*8));
}
