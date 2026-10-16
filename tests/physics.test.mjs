import test from 'node:test';
import assert from 'node:assert/strict';
import {createClock} from '../src/clock.js';
import {types} from '../src/catalog.js';
import {STEP, START_SPEED, MAX_SPEED, RAMP_SECONDS, JUMP_SPEED, GRAVITY, CHARGE_SECONDS, ROGOZIN_PEAK, jumpHeight, obstacleBoxes, hitsObstacle, clearPair} from '../src/physics.js';

const near = (a, b, tolerance = 1e-7) => assert.ok(Math.abs(a - b) <= tolerance, `${a} differs from ${b}`);

function simulateSchedule(timestamps) {
  const clock = createClock();
  const state = {time: 0, distance: 0, charge: 0, ticks: 0, interruptions: 0};
  for (const timestamp of timestamps) clock.advance(timestamp, dt => {
    state.time += dt;
    const speed = START_SPEED + (MAX_SPEED - START_SPEED) * Math.min(1, state.time / RAMP_SECONDS);
    state.distance += speed * dt;
    state.charge = Math.min(1, state.charge + dt / CHARGE_SECONDS);
    state.ticks++;
  }, () => state.interruptions++);
  return state;
}

test('30, 60, 120 Hz and uneven frames run the same 60 seconds of physics', () => {
  const uniform = fps => Array.from({length: fps * 60 + 1}, (_, i) => i * 1000 / fps);
  const schedules = [uniform(30), uniform(60), uniform(120)];
  const uneven = [0], intervals = [8, 17, 33, 12, 45, 24, 9, 52];
  for (let i = 0; uneven.at(-1) < 60000; i++) uneven.push(Math.min(60000, uneven.at(-1) + intervals[i % intervals.length]));
  schedules.push(uneven);
  const baseline = simulateSchedule(schedules[0]);
  assert.equal(baseline.ticks, Math.round(60 / STEP));
  for (const timestamps of schedules) {
    const result = simulateSchedule(timestamps);
    near(result.time, 60);
    near(result.distance, baseline.distance);
    assert.equal(result.charge, 1);
    assert.equal(result.interruptions, 0);
    assert.equal(result.ticks, baseline.ticks);
  }
});

test('a long interruption pauses explicitly, while reset discards stale wall time', () => {
  const clock = createClock();
  let elapsed = 0, pauses = 0;
  const step = dt => elapsed += dt;
  clock.advance(0, step);
  clock.advance(100, step);
  near(elapsed, .1);
  clock.advance(1100, step, () => pauses++);
  assert.equal(pauses, 1);
  near(elapsed, .1);
  clock.advance(1200, step);
  near(elapsed, .2);
  clock.reset();
  clock.advance(100000, step);
  near(elapsed, .2);
  clock.advance(100100, step);
  near(elapsed, .3);
});

test('jump apex and landing depend on seconds, and charge is bounded', () => {
  for (const charge of [0, .5, 1]) {
    const velocity = JUMP_SPEED + charge * 60;
    near(jumpHeight(velocity / GRAVITY, charge), velocity ** 2 / (2 * GRAVITY));
    near(jumpHeight(2 * velocity / GRAVITY, charge), 0);
    assert.equal(jumpHeight(2, charge), 0);
  }
  near(jumpHeight(.4, -1), jumpHeight(.4, 0));
  near(jumpHeight(.4, 2), jumpHeight(.4, 1));
});

const person = types.find(o=>o.id==='trump');
const trampoline = types.find(o=>o.id==='rogozin');
const samples = types;

test('Rogozin has a bounded silhouette with a narrow body, no invisible charge wall', () => {
  for (let time = 0; time < 3; time += .01) {
    const boxes = obstacleBoxes(trampoline, time);
    assert.ok(Math.max(...boxes.map(b => b.top)) <= ROGOZIN_PEAK);
    assert.equal(hitsObstacle(trampoline, 0, 1000, time), false);
    assert.equal(hitsObstacle(trampoline, 0, 0, time), true);
    assert.equal(hitsObstacle(trampoline, -106, 30, time), false);
  }
  assert.equal(hitsObstacle(person, 300, 0), false);
  assert.equal(hitsObstacle(person, 0, 0), true);
  assert.equal(hitsObstacle(person, 0, 94), false);
});

// Independent trajectory sweep: no use of the director's analytical window formula.
function survives(obstacles, speed, launchTime, charge = 0, phase = 0) {
  for (let tick = 0; tick <= 600; tick++) {
    const time = tick / 240;
    const height = time < launchTime ? 0 : jumpHeight(time - launchTime, charge);
    for (const [obstacle, delay] of obstacles) {
      const dx = speed * (1 + delay - time);
      if (hitsObstacle(obstacle, dx, height, phase + time)) return false;
    }
  }
  return true;
}
function winningLaunches(obstacles, speed, charge = 0, phase = 0) {
  const winning = [];
  for (let tick = 0; tick <= 200; tick++) {
    const launch = tick / 200;
    if (survives(obstacles, speed, launch, charge, phase)) winning.push(launch);
  }
  return winning;
}

test('each obstacle has a reachable launch window across progression and trampoline phases', () => {
  for (const speed of [START_SPEED, (START_SPEED + MAX_SPEED) / 2, MAX_SPEED]) {
    for (const obstacle of samples) {
      for (const phase of obstacle.id === 'rogozin' ? [0, .2, .4, .6] : [0]) {
        const wins = winningLaunches([[obstacle, 0]], speed, 0, phase);
        assert.ok(wins.length >= 12, `${obstacle.id} at speed ${speed}, phase ${phase}: only ${wins.length} launch samples`);
      }
    }
  }
});

test('every accepted representative pair can be cleared with a normal tap', () => {
  const pairTypes = samples.filter(o => ['doge', 'openai', 'gemini', 'claude', 'pump'].includes(o.id));
  let accepted = 0;
  for (const speed of [START_SPEED, (START_SPEED + MAX_SPEED) / 2, MAX_SPEED]) {
    for (const a of pairTypes) for (const b of pairTypes) for (const delay of [.25, .32, .39]) {
      if (!clearPair(a, b, delay, speed)) continue;
      accepted++;
      const wins = winningLaunches([[a, 0], [b, delay]], speed);
      assert.ok(wins.length >= 12, `${a.id}/${b.id}, ${speed}, delay ${delay}: insufficient physical window`);
    }
  }
  assert.ok(accepted > 100, `too few playable pairs: ${accepted}`);
  assert.equal(clearPair({...person, h: 1000}, person, .3, MAX_SPEED), false);
});
