import {obstacleDefinition} from './content.js?v=4.13.0';
// Simulation uses logical CSS units. Rendering pixel ratio never changes gameplay.
export const STEP = 1 / 120;
export const START_SPEED = 360;
export const MAX_SPEED = 660;
export const START_KMH = 130;
export const MAX_KMH = 400;
export const RAMP_SECONDS = 150;
export const JUMP_SPEED = 760;
export const GRAVITY = 1550;
export const CHARGE_SECONDS = .4;
export const HUMAN_HEIGHT = 94;
export const ROGOZIN_PEAK = 130;

export function jumpHeight(time, charge = 0) {
  const velocity = JUMP_SPEED + 60 * Math.max(0, Math.min(1, charge));
  return Math.max(0, velocity * time - .5 * GRAVITY * time * time);
}

export function rogozinBounce(time) {
  return 20 * Math.abs(Math.sin(time * 4.5));
}

export function obstacleBoxes(o, time = 0) {
  if ((o.collision||obstacleDefinition(o.id)?.collision) === 'trampoline') {
    return [
      {left: 6, right: o.w - 6, top: 16},
      {left: o.w / 2 - 18, right: o.w / 2 + 18, top: 108 + rogozinBounce(time)},
    ];
  }
  const inset = o.inset ?? 5;
  return [{left: inset, right: o.w - inset, top: o.h - 6}];
}

export function hitsObstacle(o, dx, y, time = 0) {
  return obstacleBoxes(o, time).some(b => dx + b.left < 29 && dx + b.right > -25 && y < b.top);
}

// Find a shared launch window with clearance, using the same boxes as collisions.
export function clearPair(a, b, delay, speed) {
  let min = -Infinity, max = Infinity;
  for (const [o, offset] of [[a, 0], [b, delay]]) {
    for (const box of obstacleBoxes(o)) {
      const height = box.top + 8;
      const discriminant = JUMP_SPEED ** 2 - 2 * GRAVITY * height;
      if (discriminant < 0) return false;
      const enter = (JUMP_SPEED - Math.sqrt(discriminant)) / GRAVITY;
      const leave = (JUMP_SPEED + Math.sqrt(discriminant)) / GRAVITY;
      min = Math.max(min, offset + (box.right + 25) / speed - leave);
      max = Math.min(max, offset + (box.left - 29) / speed - enter);
    }
  }
  return max - min > .07;
}
