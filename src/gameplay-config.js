// All v3 balance values use logical world units and simulation seconds.
export const GAMEPLAY = Object.freeze({
  version:'3.3.0', gravity:1550, jumpSpeed:560, chargedSpeed:440, chargeSeconds:.4,
  spinSpeed:6.2, spinAcceleration:60, assistSpeed:3.5, assistAcceleration:28,
  landingAngle:Math.PI*2/9, landingOmega:Math.PI*4/3,
  thrustAcceleration:2100, horizontalDrag:1.8, maxHorizontal:260,
  tank:100, initialFuel:50, fuelPerSecond:80, fuelPerFlip:25, attachSeconds:.12,
  obstaclePoints:50, flipFactor:50, nearPoints:25, nearSeconds:.12,
  maxMultiplier:50, multiplierStep:1, comboDuration:8, comboFalloff:1.2, comboDecaySeconds:.5,
  streakStep:.05, maxStreak:.25, streakHold:4, streakDecay:.1,
  fallSeconds:2.8, fallSpeedSeconds:.65, fallMaxRate:1.6, fallTapRate:.15, routeTimingMargin:.035, routeFuelReserve:20,
  stumbleSeconds:.3, recoveryRatio:.55, recoveryMin:1.2, recoveryExtra:2.8,
  startSpeed:360, maxSpeed:660, rampSeconds:150,
  stages:Object.freeze([0,15,35,60,90,120,150]),
  bestKey:'roadster-best-v3', tutorialKey:'roadster-coach-v3',
});
