import {STEP} from './physics.js?v=4.6.0';

// Preserve elapsed time at 30/60/120 Hz. Long interruptions pause explicitly.
export function createClock(step = STEP) {
  let previous = null, accumulator = 0;
  return {
    reset() { previous = null; accumulator = 0; },
    advance(timestamp, update, interrupted = () => {}) {
      if (previous === null) { previous = timestamp; return 0; }
      const elapsed = Math.max(0, (timestamp - previous) / 1000);
      previous = timestamp;
      if (elapsed > .25) { accumulator = 0; interrupted(); return 0; }
      accumulator += elapsed;
      while (accumulator + 1e-10 >= step) {
        update(step);
        accumulator = Math.max(0, accumulator - step);
      }
      return accumulator / step;
    },
  };
}
