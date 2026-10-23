// Presentation only: distant scenery follows velocity without changing the run,
// the obstacle camera or the immediate near-road speed cue.
export const createSceneryMotion = (speed = 360) => ({speed, distance: 0});

export function advanceSceneryMotion(state, dt, speed, pixelScale) {
  if (!(dt > 0)) return;
  const target = Math.max(0, speed);
  const rate = target > state.speed ? 4 : 3;
  const response = -Math.expm1(-dt * rate);
  // Integrate the filtered velocity exactly; changing speed never reinterprets
  // old travel. The same elapsed time gives the same phase at any frame rate.
  state.distance += (target * dt + (state.speed - target) * response / rate) * pixelScale;
  state.speed += (target - state.speed) * response;
}

// A repeated panorama has a fixed tile size. Speed-dependent tile widths turn
// accumulated travel into a phase jump (and can rewind a long-running scene).
export const sceneryScaleFor = baseScale => Math.max(.72, Math.min(1.15, baseScale));
