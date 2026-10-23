var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};

// supabase/rulesets/roadster-v342/run.js
var run_exports = {};
__export(run_exports, {
  RULESET: () => RULESET,
  RUN_COMMANDS: () => RUN_COMMANDS,
  RUN_STEP: () => RUN_STEP,
  createRun: () => createRun,
  validateReplay: () => validateReplay,
  verifyReplay: () => verifyReplay
});

// supabase/rulesets/roadster-v342/gameplay-config.js?v=3.4.2
var GAMEPLAY = Object.freeze({
  version: "3.4.2",
  gravity: 1550,
  jumpSpeed: 560,
  chargedSpeed: 440,
  chargeSeconds: 0.4,
  spinSpeed: 6.2,
  spinAcceleration: 60,
  assistSpeed: 3.5,
  assistAcceleration: 28,
  landingAngle: Math.PI * 2 / 9,
  landingOmega: Math.PI * 4 / 3,
  thrustAcceleration: 2100,
  horizontalDrag: 1.8,
  maxHorizontal: 260,
  tank: 100,
  initialFuel: 50,
  fuelPerSecond: 80,
  fuelPerFlip: 25,
  attachSeconds: 0.12,
  obstaclePoints: 50,
  flipFactor: 50,
  nearPoints: 25,
  nearSeconds: 0.12,
  maxMultiplier: 50,
  multiplierStep: 1,
  comboDuration: 8,
  comboFalloff: 1.2,
  comboDecaySeconds: 0.5,
  streakStep: 0.05,
  maxStreak: 0.25,
  streakHold: 4,
  streakDecay: 0.1,
  fallSeconds: 2.8,
  fallSpeedSeconds: 0.65,
  fallMaxRate: 1.6,
  fallTapRate: 0.15,
  routeTimingMargin: 0.035,
  routeFuelReserve: 20,
  stumbleSeconds: 0.3,
  recoveryRatio: 0.55,
  recoveryMin: 1.2,
  recoveryExtra: 2.8,
  startSpeed: 360,
  maxSpeed: 660,
  rampSeconds: 150,
  stages: Object.freeze([0, 15, 35, 60, 90, 120, 150]),
  bestKey: "roadster-best-v3",
  tutorialKey: "roadster-coach-v3"
});

// supabase/rulesets/roadster-v342/content.js?v=3.4.2
function freeze(value) {
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) freeze(item);
    Object.freeze(value);
  }
  return value;
}
var BIOMES = freeze(["spaceport", "tesla-factory"]);
var BIOME_CYCLE = freeze(["spaceport", "tesla-factory"]);
var ANIMATIONS = freeze(["taunt", "angry-look", "point-and-laugh", "trampoline-bounce", "money-guns", "podcast", "throw"]);
var ASSETS = freeze({
  collage: { file: "collage-atlas.png" },
  extras: { file: "collage-extras.png" },
  cast: { file: "paper-cast.png" },
  photos: { file: "obstacle-photos.png" },
  joe: { file: "assets/characters/joe-rogan.png" },
  amber: { file: "assets/characters/amber-head-v247.png" },
  drone: { file: "assets/obstacles/phantom-v3.png" }
});
var none = { enabled: false };
var reaction = (animationId, trigger = "near", range = 300) => ({ enabled: true, animationId, trigger, range });
function define(base, options = {}) {
  return freeze({
    ...base,
    definitionVersion: 1,
    category: options.category || "object",
    placement: base.altitude ? "air" : "ground",
    anchor: base.altitude ? "air-bottom-center" : "ground-center",
    biomes: options.biomes || "all",
    visual: { renderer: options.renderer || "prop", key: options.key || base.id, assets: options.assets || [], bob: options.bob || false },
    collision: options.collision || "box",
    reactions: { hero: options.hero || none, obstacle: options.obstacle || none },
    collectible: true,
    provenance: "assets-provenance.json"
  });
}
var OBSTACLES = freeze([
  define({ id: "v8", name: "V8 \u2022 VERY LOUD", w: 108, h: 36 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define({ id: "trump", name: "TARIFF MAN", w: 54, h: 94 }, { renderer: "character", assets: ["collage"], category: "person", bob: true, hero: reaction("taunt"), obstacle: reaction("angry-look") }),
  define({ id: "protest", name: "COUCH CRITICS", w: 102, h: 94 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "group" }),
  define({ id: "truck", name: "CYBERBRICK", w: 110, h: 41 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define({ id: "doge", name: "MUCH WOW", w: 52, h: 64 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "animal" }),
  define({ id: "pump", name: "BIG OIL", w: 54, h: 78 }, {}),
  define({ id: "zuck", name: "ZUCK", w: 62, h: 94, inset: 5 }, { renderer: "character", assets: ["cast"], category: "person", hero: reaction("money-guns", "airborne-near"), obstacle: reaction("money-guns", "airborne-near") }),
  define({ id: "openai", name: "OPENAI", w: 70, h: 68, inset: 5 }, { category: "emblem" }),
  define({ id: "claude", name: "CLAUDE", w: 84, h: 73, inset: 6 }, { category: "emblem" }),
  define({ id: "gemini", name: "GEMINI", w: 58, h: 78, inset: 4 }, { category: "emblem" }),
  define({ id: "rogozin", name: "ROGOZIN / TRAMPOLINE", w: 88, h: 130, inset: 4 }, { renderer: "character", assets: ["cast"], category: "person", biomes: ["spaceport"], collision: "trampoline", hero: reaction("point-and-laugh", "airborne-near"), obstacle: reaction("trampoline-bounce", "passage") }),
  define({ id: "amber", name: "AMBER HEARD", w: 58, h: 94, inset: 9 }, { renderer: "character", assets: ["amber"], category: "person", obstacle: reaction("throw", "passage") }),
  define({ id: "joe", name: "JOE ROGAN", w: 76, h: 94, inset: 10 }, { renderer: "character", assets: ["joe"], category: "person", hero: reaction("podcast", "passage", 650), obstacle: reaction("podcast", "passage", 650) }),
  define({ id: "muscleCoupe", name: "AMERICAN MUSCLE", w: 138, h: 45, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define({ id: "muscleCompact", name: "SMALL BLOCK / BIG EGO", w: 112, h: 38, inset: 5 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define({ id: "pickup", name: "BIG TRUCK ENERGY", w: 140, h: 57, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define({ id: "simpsonsCouch", name: "EVERGREEN TERRACE", w: 136, h: 88, inset: 6 }, { category: "group" }),
  define({ id: "hoverDrone", name: "HOVER DRONE", w: 92, h: 40, inset: 8, altitude: 300, approachSpeed: 0 }, { renderer: "drone", assets: ["drone"], category: "drone" }),
  define({ id: "incomingDrone", name: "INCOMING DRONE", w: 92, h: 40, inset: 8, altitude: 220, approachSpeed: 110 }, { renderer: "drone", assets: ["drone"], category: "drone" })
]);
var PROP_TYPES = freeze(OBSTACLES.filter((o) => ["muscleCoupe", "muscleCompact", "pickup", "simpsonsCouch"].includes(o.id)));
var AIR_TYPES = freeze(OBSTACLES.filter((o) => o.placement === "air"));
var definitionsById = new Map(OBSTACLES.map((o) => [o.id, o]));
var obstacleDefinition = (id2) => definitionsById.get(id2);
function validateContent(definitions = OBSTACLES) {
  const errors = [], ids = /* @__PURE__ */ new Set();
  for (const o of definitions) {
    if (!o.id || ids.has(o.id)) errors.push(`duplicate or missing id: ${o.id}`);
    ids.add(o.id);
    if (!Number.isFinite(o.w) || !Number.isFinite(o.h) || o.w <= 0 || o.h <= 6) errors.push(`${o.id}: invalid size`);
    if (!["ground", "air"].includes(o.placement)) errors.push(`${o.id}: invalid placement`);
    if (o.placement === "air" && (!Number.isFinite(o.altitude) || !(Number(o.altitude) > 0))) errors.push(`${o.id}: invalid altitude`);
    if (o.placement === "ground" && o.altitude) errors.push(`${o.id}: ground altitude`);
    if (!["ground-center", "air-bottom-center"].includes(o.anchor)) errors.push(`${o.id}: invalid anchor`);
    if (o.biomes !== "all" && (!Array.isArray(o.biomes) || !o.biomes.length || o.biomes.some((b) => !BIOMES.includes(b)))) errors.push(`${o.id}: unknown biome`);
    if (!o.visual || !["photo", "cutout", "character", "prop", "drone"].includes(o.visual.renderer)) errors.push(`${o.id}: missing renderer`);
    for (const id2 of o.visual?.assets || []) if (!Object.hasOwn(ASSETS, id2)) errors.push(`${o.id}: unknown asset ${id2}`);
    if (!["box", "trampoline"].includes(o.collision)) errors.push(`${o.id}: missing collision profile`);
    if (o.inset !== void 0 && (!Number.isFinite(o.inset) || o.inset < 0 || o.inset * 2 >= o.w)) errors.push(`${o.id}: invalid inset`);
    for (
      const direction of
      /** @type {const} */
      ["hero", "obstacle"]
    ) {
      const r = o.reactions?.[direction];
      if (!r || typeof r.enabled !== "boolean") errors.push(`${o.id}: missing ${direction} reaction`);
      else if (r.enabled && (!ANIMATIONS.includes(r.animationId) || !["near", "airborne-near", "passage"].includes(r.trigger) || !(r.range > 0))) errors.push(`${o.id}: missing animation ${r.animationId}`);
    }
  }
  return errors;
}
var contentErrors = validateContent();
if (contentErrors.length) throw new Error(`Invalid content: ${contentErrors.join("; ")}`);

// supabase/rulesets/roadster-v342/physics.js?v=3.4.2
var STEP = 1 / 120;
function rogozinBounce(time) {
  return 20 * Math.abs(Math.sin(time * 4.5));
}
function obstacleBoxes(o, time = 0) {
  if ((o.collision || obstacleDefinition(o.id)?.collision) === "trampoline") {
    return [
      { left: 6, right: o.w - 6, top: 16 },
      { left: o.w / 2 - 18, right: o.w / 2 + 18, top: 108 + rogozinBounce(time) }
    ];
  }
  const inset = o.inset ?? 5;
  return [{ left: inset, right: o.w - inset, top: o.h - 6 }];
}

// supabase/rulesets/roadster-v342/fall.js?v=3.4.2
var clamp = (x) => Math.max(0, Math.min(1, x));
var ease = (x) => {
  x = clamp(x);
  return x * x * (3 - 2 * x);
};
var mix = (a, b, t) => a + (b - a) * t;
var FALL_CONTACTS = Object.freeze([0.14, 0.36, 0.56]);
var FALL_CAR_CONTACTS = Object.freeze([0.16, 0.38]);
var FALL_CAR_HULL = Object.freeze([[-49, -7], [-8, -15], [8, -15], [48.5, 0], [47, 6], [27, 12], [-34, 12], [-46, 5]].map(Object.freeze));
function fallCarSupport(angle) {
  return Math.max(...FALL_CAR_HULL.map(([x, y]) => x * Math.sin(angle) + y * Math.cos(angle)));
}
var arc = (p, a, b, height) => {
  const t = clamp((p - a) / (b - a));
  return t < 1e-12 || t > 1 - 1e-12 ? 0 : height * 4 * t * (1 - t);
};
var pulse = (p, hit) => ease((p - hit + 0.035) / 0.035) * (1 - ease((p - hit) / 0.055));
function track(keys, p) {
  let i = 1;
  while (i < keys.length - 1 && p > keys[i][0]) i++;
  const [a, b] = [keys[i - 1], keys[i]];
  return mix(a[1], b[1], ease((p - a[0]) / (b[0] - a[0])));
}
function createFall() {
  return { active: false, age: 0, duration: GAMEPLAY.fallSeconds, rate: 1, taps: 0, angle: 0, reduced: false };
}
function beginFall(f, result, { reduced = false, speed = GAMEPLAY.startSpeed } = {}) {
  const angle = Math.atan2(Math.sin(result.angle), Math.cos(result.angle));
  const severity = clamp((speed - GAMEPLAY.startSpeed) / (GAMEPLAY.maxSpeed - GAMEPLAY.startSpeed));
  Object.assign(f, { active: true, age: 0, duration: GAMEPLAY.fallSeconds + GAMEPLAY.fallSpeedSeconds * severity, rate: 1, taps: 0, angle, reduced });
}
function hastenFall(f) {
  if (!f.active) return false;
  f.taps++;
  f.rate = Math.min(GAMEPLAY.fallMaxRate, f.rate + GAMEPLAY.fallTapRate);
  return true;
}
function advanceFall(f, dt) {
  if (!f.active) return { impacts: 0, finished: false };
  const previous = f.age;
  f.age = Math.min(f.duration, f.age + dt * f.rate);
  const impacts = FALL_CONTACTS.filter((t) => previous < f.duration * t && f.age >= f.duration * t).length;
  f.active = f.age < f.duration;
  return { impacts, finished: !f.active };
}
function fallPose(f) {
  const p = clamp(f.age / f.duration), sit = ease(p / 0.14), stand = ease((p - 0.68) / 0.16), gather = ease((p - 0.7) / 0.22), settle = clamp((p - 0.97) / 0.03);
  const impact = Math.max(...FALL_CONTACTS.map((hit) => pulse(p, hit))), seat = sit * (1 - stand);
  const crouch = (0.72 + 0.18 * impact) * seat + (settle === 1 ? 0 : 0.1 * Math.sin(settle * Math.PI));
  const lift = p < 0.36 ? arc(p, 0.14, 0.36, 32) : p < 0.56 ? arc(p, 0.36, 0.56, 28) : arc(p, 0.56, 0.97, 112);
  const angle = mix(f.angle, -0.64, sit) * (1 - stand);
  const seatAnchor = -11 * Math.sin(angle) + (22.5 + 27 * crouch) * Math.cos(angle) + 9;
  const rider = { x: 34 * sit * (1 - gather), y: mix(95, seatAnchor, seat) + lift, angle, seat, crouch, lift };
  const entry = (y) => ({ x: Math.sin(f.angle) * (y - 65), y: 65 + Math.cos(f.angle) * (y - 65) });
  const e = entry(95), c = entry(12);
  rider.x += e.x * (1 - sit);
  rider.y += (e.y - 95) * (1 - sit);
  const carAngle = track([[0, f.angle], [0.16, 0.95], [0.29, Math.PI], [0.38, 2 * Math.PI - 1.02], [0.54, 2 * Math.PI], [1, 2 * Math.PI]], p);
  const carHop = p < 0.16 ? arc(p, 0, 0.16, 20) : p < 0.38 ? arc(p, 0.16, 0.38, 22) : arc(p, 0.38, 0.54, 8);
  const car = { x: gather === 1 ? 0 : mix(c.x, -88, ease(p / 0.16)) * (1 - gather), y: p >= 0.54 ? 12 : mix(c.y, fallCarSupport(carAngle) + carHop, ease(p / 0.06)), angle: carAngle, phase: 0 };
  let shake = 0;
  for (const hit of FALL_CONTACTS) if (p >= hit) shake = Math.max(shake, Math.exp(-(p - hit) * 40));
  const pose = { car, rider, crouch, impact, flail: sit * (1 - ease((p - 0.82) / 0.12)), push: 0, shake: shake * 2.4, progress: p };
  if (f.reduced) {
    pose.car = { x: 0, y: 12, angle: 0, phase: 0 };
    pose.rider = { x: 0, y: 95, angle: 0, seat: 0, crouch };
    pose.shake = 0;
    pose.push = 0;
    pose.flail = 0;
  }
  return pose;
}
function fallPolygons(pose) {
  const seat = pose.rider.seat || 0, crouch = pose.rider.crouch || 0;
  const rider = [[-23, -70 + 4 * seat], [23 + 48 * seat, -70 + 4 * seat], [23 + 48 * seat, 68 - 27 * crouch], [-23, 68 - 27 * crouch]];
  return [[pose.car, FALL_CAR_HULL.map(([x, y]) => [x, -y])], [pose.rider, rider]].map(([body2, vertices]) => {
    const c = Math.cos(body2.angle), s = Math.sin(body2.angle);
    return vertices.map(([x, y]) => ({ x: body2.x + c * x + s * y, y: body2.y - s * x + c * y }));
  });
}
function interpolateFall(a, b, t) {
  const pose = {};
  for (const part of ["car", "rider"]) {
    pose[part] = {};
    for (const k of ["x", "y", "angle", "seat", "crouch", "phase"]) pose[part][k] = mix(a[part][k] || 0, b[part][k] || 0, t);
  }
  return pose;
}

// supabase/rulesets/roadster-v342/gameplay.js?v=3.4.2
var TAU = Math.PI * 2;
var clamp2 = (x, a, b) => Math.max(a, Math.min(b, x));
var approach = (x, target, amount) => x < target ? Math.min(target, x + amount) : Math.max(target, x - amount);
function uprightError(angle, direction = -1) {
  let e = ((angle + Math.PI) % TAU + TAU) % TAU - Math.PI;
  if (Math.abs(Math.abs(e) - Math.PI) < 1e-9) e = -Math.sign(direction || -1) * Math.PI;
  return e;
}
function createFlight(fuel = GAMEPLAY.initialFuel) {
  return { y: 0, vy: 0, vx: 0, angle: 0, omega: 0, airborne: false, time: 0, fuel, thrusting: false, latched: false, attach: 0, maxTurn: 0, turns: 0, lastDirection: -1, trickStarted: false, grab: 0, launchVelocity: 0 };
}
function launch(p, charge = 0) {
  if (p.airborne) return false;
  Object.assign(p, { y: 1e-3, vy: GAMEPLAY.jumpSpeed + GAMEPLAY.chargedSpeed * clamp2(charge, 0, 1), angle: 0, omega: 0, airborne: true, time: 0, latched: false, attach: 0, maxTurn: 0, turns: 0, trickStarted: false, grab: 0, launchVelocity: GAMEPLAY.jumpSpeed + GAMEPLAY.chargedSpeed * clamp2(charge, 0, 1) });
  return true;
}
function advanceFlight(p, dt, { spin = false, thrust = false } = {}) {
  p.thrusting = false;
  const gripTarget = p.airborne && p.trickStarted ? 1 : 0;
  p.grab = approach(p.grab, gripTarget, dt / 0.16);
  if (!p.airborne) {
    p.vx *= Math.exp(-GAMEPLAY.horizontalDrag * dt);
    return null;
  }
  p.time += dt;
  const error = uprightError(p.angle, p.lastDirection);
  if (spin) {
    p.trickStarted = true;
    p.lastDirection = -1;
    p.omega = approach(p.omega, -GAMEPLAY.spinSpeed, GAMEPLAY.spinAcceleration * dt);
  } else {
    const target = -Math.sign(error) * Math.min(GAMEPLAY.assistSpeed, Math.sqrt(2 * GAMEPLAY.assistAcceleration * Math.abs(error)));
    p.omega = approach(p.omega, target, GAMEPLAY.assistAcceleration * dt);
    if (Math.abs(error) < 2e-3 && Math.abs(p.omega) < 0.15) p.omega = -error / dt;
  }
  p.angle += p.omega * dt;
  p.maxTurn = Math.max(p.maxTurn, -p.angle);
  p.turns = Math.floor((p.maxTurn + 1e-7) / TAU);
  const burn = thrust ? Math.min(dt, p.fuel / GAMEPLAY.fuelPerSecond) : 0;
  if (burn > 0) {
    p.fuel = Math.max(0, p.fuel - burn * GAMEPLAY.fuelPerSecond);
    p.thrusting = true;
    p.latched = true;
    p.vx += Math.sin(p.angle) * GAMEPLAY.thrustAcceleration * burn;
    p.vy += Math.cos(p.angle) * GAMEPLAY.thrustAcceleration * burn;
  }
  if (p.latched) p.attach = Math.min(1, p.attach + dt / GAMEPLAY.attachSeconds);
  p.vx = clamp2(p.vx * Math.exp(-GAMEPLAY.horizontalDrag * dt), -GAMEPLAY.maxHorizontal, GAMEPLAY.maxHorizontal);
  p.y += p.vy * dt - 0.5 * GAMEPLAY.gravity * dt * dt;
  p.vy -= GAMEPLAY.gravity * dt;
  if (p.y > 0) return null;
  const good = Math.abs(uprightError(p.angle)) <= GAMEPLAY.landingAngle && Math.abs(p.omega) <= GAMEPLAY.landingOmega;
  const turns = good ? Math.max(p.turns, Math.round(-p.angle / TAU)) : p.turns;
  const result = { good, turns, impact: Math.abs(p.vy), angle: p.angle, omega: p.omega };
  p.turns = turns;
  p.y = 0;
  p.vy = 0;
  p.airborne = false;
  p.thrusting = false;
  if (result.good) {
    p.angle = 0;
    p.omega = 0;
  }
  return result;
}
function createEconomy() {
  return { bonus: 0, multiplier: 10, meter: 0, decay: 0, streak: 0, streakLeft: 0, flips: 0 };
}
function comboSeconds(e) {
  return GAMEPLAY.comboDuration - GAMEPLAY.comboFalloff * (e.multiplier / 10 - 1);
}
function rewardAction(e, count = 1) {
  e.multiplier = Math.min(GAMEPLAY.maxMultiplier, e.multiplier + count * GAMEPLAY.multiplierStep);
  e.meter = 1;
  e.decay = 0;
}
function advanceEconomy(e, dt) {
  if (e.meter > 0) {
    const used = Math.min(dt, e.meter * comboSeconds(e));
    e.meter = Math.max(0, e.meter - used / comboSeconds(e));
    dt -= used;
  }
  if (e.meter === 0 && e.multiplier > 10) {
    e.decay += dt;
    while (e.decay + 1e-9 >= GAMEPLAY.comboDecaySeconds && e.multiplier > 10) {
      e.multiplier--;
      e.decay -= GAMEPLAY.comboDecaySeconds;
    }
  }
}
function advanceStreak(e, dt) {
  const used = Math.min(dt, e.streakLeft);
  e.streakLeft -= used;
  e.streak = Math.max(0, e.streak - (dt - used) * GAMEPLAY.streakDecay);
}
function passObstacle(e) {
  const points = GAMEPLAY.obstaclePoints * e.multiplier / 10;
  e.bonus += points;
  return points;
}
function settleLanding(e, p, result, { late = 0, near = 0 } = {}) {
  if (!result.good) {
    e.multiplier = 10;
    e.meter = 0;
    e.decay = 0;
    e.streak = 0;
    e.streakLeft = 0;
    return { points: 0, turns: 0, late: 0, near: 0, good: false };
  }
  const n = result.turns, points = (GAMEPLAY.flipFactor * n * (n + 1) + GAMEPLAY.nearPoints * (late + near)) * e.multiplier / 10;
  e.bonus += points;
  e.flips += n;
  p.fuel = Math.min(GAMEPLAY.tank, p.fuel + GAMEPLAY.fuelPerFlip * n);
  if (n + late + near) rewardAction(e, n + late + near);
  if (n || near) {
    e.streak = Math.min(GAMEPLAY.maxStreak, e.streak + GAMEPLAY.streakStep);
    e.streakLeft = GAMEPLAY.streakHold;
  }
  return { points, turns: n, late, near, good: true };
}
function createPace() {
  return { progress: 0, base: GAMEPLAY.startSpeed, speed: GAMEPLAY.startSpeed, recovery: null, stumble: 0, falling: false };
}
function stumble(pace) {
  const target = pace.recovery?.target ?? pace.base, r = clamp2((target - GAMEPLAY.startSpeed) / (GAMEPLAY.maxSpeed - GAMEPLAY.startSpeed), 0, 1);
  pace.recovery = { target, age: 0, duration: GAMEPLAY.recoveryMin + GAMEPLAY.recoveryExtra * r ** 1.5 };
  pace.stumble = GAMEPLAY.stumbleSeconds;
  pace.base = target * GAMEPLAY.recoveryRatio;
}
function recoverySpeed(r, t) {
  const T = r.duration, d = r.target * (1 - GAMEPLAY.recoveryRatio), v0 = r.target * GAMEPLAY.recoveryRatio, h = 0.15, a = T - h;
  if (t <= a) return v0 + d * (t / T) ** 2;
  const u = clamp2((t - a) / h, 0, 1), start = v0 + d * (a / T) ** 2, slope = 2 * d * a / T ** 2, endSlope = r.target >= GAMEPLAY.maxSpeed ? 0 : (GAMEPLAY.maxSpeed - GAMEPLAY.startSpeed) / GAMEPLAY.rampSeconds;
  return (2 * u ** 3 - 3 * u * u + 1) * start + (u ** 3 - 2 * u * u + u) * h * slope + (-2 * u ** 3 + 3 * u * u) * r.target + (u ** 3 - u * u) * h * endSlope;
}
function advancePace(pace, e, p, dt) {
  if (pace.recovery) {
    pace.stumble = Math.max(0, pace.stumble - dt);
    const r = pace.recovery;
    r.age = Math.min(r.duration, r.age + dt);
    pace.base = recoverySpeed(r, r.age);
    if (r.age >= r.duration) {
      pace.base = r.target;
      pace.recovery = null;
    }
  } else if (!pace.falling) {
    pace.progress += dt;
    pace.base = GAMEPLAY.startSpeed + (GAMEPLAY.maxSpeed - GAMEPLAY.startSpeed) * Math.min(1, pace.progress / GAMEPLAY.rampSeconds);
  }
  pace.speed = Math.max(60, pace.base * (1 + e.streak) + p.vx);
  return pace.speed;
}
function playerPolygons(p) {
  if (p.fallPose) return fallPolygons(p.fallPose);
  const c = Math.cos(p.angle), s = Math.sin(p.angle);
  return [[-47, 0, 47, 25], [-23, 25, 23, 163 - 32 * (p.grab || 0)]].map(([l, b, r, t]) => [[l, b], [r, b], [r, t], [l, t]].map(([x, y]) => ({ x: c * x + s * (y - 65), y: p.y + 65 - s * x + c * (y - 65) })));
}
function overlaps(poly, rect) {
  const axes = [{ x: 1, y: 0 }, { x: 0, y: 1 }];
  for (let i = 0; i < (poly.length === 4 ? 2 : poly.length); i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    axes.push({ x: -(b.y - a.y), y: b.x - a.x });
  }
  for (const a of axes) {
    const ps = poly.map((p) => p.x * a.x + p.y * a.y), rs = rect.map((p) => p.x * a.x + p.y * a.y);
    if (Math.max(...ps) <= Math.min(...rs) || Math.max(...rs) <= Math.min(...ps)) return false;
  }
  return true;
}
function collisionAt(p, o, dx, time = 0) {
  if (dx > 180 || dx + o.w < -180) return false;
  const polygons = playerPolygons(p);
  return obstacleBoxes(o, time).some((b) => {
    const bottom = o.altitude || 0, top = bottom + b.top;
    const rect = [{ x: dx + b.left, y: bottom }, { x: dx + b.right, y: bottom }, { x: dx + b.right, y: top }, { x: dx + b.left, y: top }];
    return polygons.some((poly) => overlaps(poly, rect));
  });
}
function sweptCollision(before, after, o, dxBefore, dxAfter, time, dt) {
  const fallTravel = before.fallPose && after.fallPose ? Math.max(...["rider", "car"].map((part) => Math.abs(after.fallPose[part].angle - before.fallPose[part].angle) * (part === "car" ? 55 : 170) + Math.abs(after.fallPose[part].y - before.fallPose[part].y) + Math.abs(after.fallPose[part].x - before.fallPose[part].x))) : 0;
  const n = Math.max(1, Math.ceil((Math.abs(dxAfter - dxBefore) + Math.abs(after.y - before.y) + Math.abs(after.angle - before.angle) * 170 + fallTravel) / 4));
  for (let i = 0; i <= n; i++) {
    const f = i / n, p = { y: before.y + (after.y - before.y) * f, angle: before.angle + (after.angle - before.angle) * f, grab: (before.grab || 0) + ((after.grab || 0) - (before.grab || 0)) * f };
    if (before.fallPose && after.fallPose) p.fallPose = interpolateFall(before.fallPose, after.fallPose, f);
    if (collisionAt(p, o, dxBefore + (dxAfter - dxBefore) * f, time - dt + dt * f)) return true;
  }
  return false;
}
function nearWindow(distance, speed) {
  return distance >= 0 && distance <= Math.max(0, speed) * GAMEPLAY.nearSeconds + 1e-8;
}

// supabase/rulesets/roadster-v342/routes.js?v=3.4.2
var STAGES = GAMEPLAY.stages;
function stageAt(progress) {
  return STAGES.filter((t) => progress >= t).length - 1;
}
function makePattern(kind, { speed = 360, type = { id: "truck", w: 110, h: 41 }, dx = 900 } = {}) {
  const item = (o, offset = 0) => ({ ...o, x: dx + offset, passed: false });
  if (kind === "hover") return [item(AIR_TYPES[0])];
  if (kind === "incoming") return [item(AIR_TYPES[1])];
  if (kind === "precision") {
    const span = Math.min(200, Math.max(110, speed * 0.4 - 94)), cars = [], n = Math.min(2, Math.ceil(span / 110)), width = (span - 20 * (n - 1)) / n;
    for (let i = 0; i < n; i++) cars.push(item({ id: "truck", name: "CYBERBRICK", w: width, h: 41 * width / 110, inset: 4 }, i * (width + 20)));
    cars.push(item({ id: "truck", name: "CYBERBRICK", w: 110, h: 41, inset: 5 }, speed * 1.15));
    cars.push(item({ ...AIR_TYPES[0], altitude: 400 }, span * 0.5));
    return cars;
  }
  if (kind === "mixed") return [item(type), item(AIR_TYPES[1], speed * 0.65), item(type.h <= 57 ? type : { id: "truck", name: "CYBERBRICK", w: 110, h: 41, inset: 5 }, speed * 1.65)];
  if (kind === "thrust") {
    const n = Math.min(6, Math.max(4, Math.ceil(speed * 1.65 / 165)));
    return Array.from({ length: n }, (_, i) => item({ id: "truck", name: "CYBERBRICK", w: 110, h: 41, inset: 5 }, i * 165));
  }
  if (kind === "pair") return [item(type), item(type, speed * 1.5)];
  return [item(type)];
}
function validateRoute(obstacles, { flight = createFlight(), pace = createPace(), economy = createEconomy(), time = 0, allowThrust = true, burns = null, timingMargin = 0, leads = [0.1, 0.11, 0.115, 0.12, 0.125, 0.14, 0.16, 0.2, 0.3, 0.4, 0.5, 0.65], charges = [0, 0.5, 1] } = {}) {
  if (flight.airborne || pace.stumble > 0) return null;
  for (const charge of charges) for (const lead of leads) for (const burn of burns ?? (allowThrust && flight.fuel > 0 ? [0, 0.35, 0.65, 1.1] : [0])) {
    const p = { ...flight }, r = structuredClone(pace), e = { ...economy }, obs = obstacles.map((o) => ({ ...o })), actions = [];
    let charging = false, held = 0, elapsed = 0, lateTarget = null, lastThrust = false, nearLandings = 0, lateTakeoffs = 0;
    const dt = 1 / 120;
    for (let tick = 0; tick < 1440; tick++) {
      elapsed = tick * dt;
      const next = obs.find((o) => o.x + o.w > -47 && (!o.altitude || o.altitude < 163));
      if (!p.airborne && next) {
        const ttc = (next.x + (next.inset || 5) - 47) / Math.max(1, r.speed + (next.approachSpeed || 0));
        if (!charging && ttc <= lead + charge * GAMEPLAY.chargeSeconds) {
          charging = true;
          held = 0;
          actions.push({ at: elapsed, action: "hold" });
        }
        if (charging) {
          held += dt;
          if (held + 1e-9 >= charge * GAMEPLAY.chargeSeconds + (charge > 0 ? dt : 0)) {
            lateTarget = nearWindow(next.x + (next.inset || 5) - 47, r.speed + (next.approachSpeed || 0)) ? next : null;
            launch(p, charge);
            charging = false;
            actions.push({ at: elapsed, action: "jump", charge });
          }
        }
      }
      const before = { ...p }, useThrust = p.airborne && p.time >= 0.18 && p.time < 0.18 + burn;
      if (useThrust !== lastThrust) {
        actions.push({ at: elapsed, action: useThrust ? "thrust-on" : "thrust-off" });
        lastThrust = useThrust;
      }
      const landed = advanceFlight(p, dt, { thrust: useThrust });
      advanceEconomy(e, dt);
      advanceStreak(e, dt);
      advancePace(r, e, p, dt);
      const after = landed ? { ...p, angle: landed.angle } : p;
      let alive = true;
      for (const o of obs) {
        const old = o.x;
        o.x -= (r.speed + (o.approachSpeed || 0)) * dt;
        if (sweptCollision(before, after, o, old, o.x, time + elapsed, dt)) {
          alive = false;
          break;
        }
        if (!o.passed && o.x + o.w < -50) {
          o.passed = true;
          passObstacle(e);
        }
      }
      if (!alive || landed && !landed.good) break;
      if (landed) {
        let near = 0;
        const late = lateTarget && lateTarget.x + lateTarget.w - (lateTarget.inset || 5) < -47 ? 1 : 0;
        for (const o of obs) if (!o.altitude && !o.nearPaid && nearWindow(-47 - (o.x + o.w - (o.inset || 5)), r.speed)) {
          near++;
          o.nearPaid = true;
        }
        settleLanding(e, p, landed, { late, near });
        nearLandings += near;
        lateTakeoffs += late;
        lateTarget = null;
      }
      if (obs.every((o) => o.x + o.w < -180) && !p.airborne) {
        if (timingMargin > 0 && (!validateRoute(obstacles, { flight, pace, economy, time, charges: [charge], leads: [lead - timingMargin], burns: [burn] }) || !validateRoute(obstacles, { flight, pace, economy, time, charges: [charge], leads: [lead + timingMargin], burns: [burn] }))) break;
        return { charge, lead, burn, actions, nearLandings, lateTakeoffs, duration: elapsed, fuelUsed: flight.fuel - p.fuel, exit: { y: 0, angle: 0, vx: p.vx }, clearanceVerified: true, timingMargin };
      }
    }
  }
  return null;
}

// supabase/rulesets/roadster-v342/director.js?v=3.4.2
function createDirector({ S, flight, pace, economy, spawnDistance, sceneTime = () => S.t, random: random3 = Math.random, relative = false }) {
  const state = { wave: 0, last: null, fallbacks: 0, waiting: false, hardStreak: 0 };
  function reset() {
    Object.assign(state, { wave: 0, last: null, fallbacks: 0, waiting: false, hardStreak: 0 });
  }
  function spawn() {
    if (flight.airborne || pace.recovery || pace.falling || S.obs.some((o) => !o.passed)) {
      S.next = 0.18;
      state.waiting = true;
      return;
    }
    state.waiting = false;
    const stage = stageAt(pace.progress), breath = state.wave % 5 === 4 || state.hardStreak >= 2;
    const pools = [["single"], ["single"], ["pair", "single"], ["hover", "incoming", "pair"], ["precision", "incoming", "pair"], ["mixed", "precision", "thrust"], ["mixed", "precision", "thrust", "incoming"]];
    let kind = breath ? "single" : pools[stage][Math.floor(random3() * pools[stage].length)];
    if (!breath && stage === 3 && pace.progress < 72) kind = "hover";
    const choices = OBSTACLES.filter((o) => !o.altitude && (stage === 0 ? o.h <= 64 : stage < 2 ? o.h <= 94 : true));
    if (kind === "thrust" && flight.fuel < 65) kind = "pair";
    const type = choices[Math.floor(random3() * choices.length)], dx = spawnDistance();
    let obstacles = makePattern(kind, { speed: S.speed, type, dx });
    let route = validateRoute(obstacles, { flight, pace, economy, time: sceneTime(), timingMargin: GAMEPLAY.routeTimingMargin });
    if (route && route.fuelUsed > 0 && flight.fuel - route.fuelUsed < GAMEPLAY.routeFuelReserve) route = null;
    if (!route) {
      state.fallbacks++;
      kind = "single";
      obstacles = makePattern(kind, { speed: S.speed, type: OBSTACLES.find((o) => o.id === "truck"), dx });
      route = validateRoute(obstacles, { flight, pace, economy, time: sceneTime(), timingMargin: GAMEPLAY.routeTimingMargin });
    }
    if (!route) {
      S.next = 0.3;
      return;
    }
    state.hardStreak = ["precision", "mixed", "thrust"].includes(kind) ? state.hardStreak + 1 : 0;
    state.wave++;
    state.last = { kind, stage, route, startedAt: S.t };
    for (const o of obstacles) S.obs.push({ ...o, x: o.x + (relative ? 0 : S.anchor), uid: ++S.entityId, passed: false, nearPaid: false, latePaid: false });
    S.next = breath ? 2.3 : 1.2;
  }
  return { reset, spawn, state };
}

// supabase/rulesets/roadster-v342/random.js?v=3.4.2
function createRandom(seed) {
  if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) throw Error("Invalid run seed");
  let state = seed;
  return { next() {
    state = state + 1831565813 >>> 0;
    let t = state;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }, get state() {
    return state;
  }, restore(value) {
    if (!Number.isInteger(value) || value < 0 || value > 4294967295) throw Error("Invalid random state");
    state = value;
  } };
}

// supabase/rulesets/roadster-v342/run.js
var RULESET = "roadster-v3.4.2";
var RUN_STEP = 1 / 120;
var RUN_COMMANDS = Object.freeze(["primary-down", "primary-up", "primary-cancel", "thrust-on", "thrust-off", "cancel"]);
var MAX_RECORDED_TICKS = 120 * 60 * 60;
var MAX_RECORDED_EVENTS = 24e3;
function createRun({ seed = 0, record = true, reducedMotion = false } = {}) {
  const S = { mode: "menu", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY.startSpeed, next: 1.7, obs: [], entityId: 0, anchor: 0 }, P = createFlight(), E = createEconomy(), pace = createPace(), F = createFall(), input = { charging: false, charge: 0, spin: false, thrust: false };
  let random3 = createRandom(seed), events = [], log = [], lateId = null, lastLanding = null, recordable = true;
  const director = createDirector({ S, flight: P, pace, economy: E, random: () => random3.next(), relative: true, sceneTime: () => S.t, spawnDistance: () => Math.max(900, S.speed * 1.5 + 180) });
  function clear() {
    Object.assign(input, { charging: false, charge: 0, spin: false, thrust: false });
    P.thrusting = false;
  }
  function sync() {
    S.t = S.tick * RUN_STEP;
    S.speed = pace.speed;
    S.score = Math.floor(S.distance / 20 + E.bonus);
  }
  function reset(nextSeed = seed) {
    seed = nextSeed;
    random3 = createRandom(seed);
    Object.assign(P, createFlight());
    Object.assign(E, createEconomy());
    Object.assign(pace, createPace());
    Object.assign(F, createFall());
    Object.assign(S, { mode: "playing", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY.startSpeed, next: 1.7, obs: [], entityId: 0, lastCharge: 0 });
    clear();
    events = [];
    log = [];
    lateId = null;
    lastLanding = null;
    recordable = true;
    director.reset();
  }
  function jump() {
    if (S.mode !== "playing" || P.airborne || F.active || pace.stumble > 0) return false;
    lateId = null;
    for (const o of S.obs) {
      if (o.altitude || o.passed) continue;
      if (nearWindow(o.x + (o.inset || 5) - 47, S.speed + (o.approachSpeed || 0))) {
        lateId = o.uid;
        break;
      }
    }
    const charge = input.charge;
    launch(P, charge);
    S.lastCharge = charge;
    input.charging = false;
    input.charge = 0;
    input.spin = false;
    events.push({ type: "jump", charge });
    return true;
  }
  function command(action) {
    if (!RUN_COMMANDS.includes(action)) throw Error("Unknown run command");
    if (S.mode !== "playing") return false;
    if (record && recordable) {
      if (log.length >= MAX_RECORDED_EVENTS) recordable = false;
      else log.push([S.tick, RUN_COMMANDS.indexOf(action)]);
    }
    if (action === "cancel") {
      clear();
      return true;
    }
    if (action === "primary-cancel") {
      input.spin = false;
      input.charging = false;
      input.charge = 0;
      return true;
    }
    if (action === "thrust-off") {
      input.thrust = false;
      return true;
    }
    if (action === "thrust-on") {
      if (!F.active) input.thrust = true;
      return true;
    }
    if (action === "primary-up") {
      if (input.charging) jump();
      input.spin = false;
      return true;
    }
    if (F.active) return hastenFall(F);
    if (pace.stumble > 0) return false;
    if (P.airborne) {
      P.trickStarted = true;
      input.spin = true;
    } else {
      input.charging = true;
      input.charge = 0;
    }
    return true;
  }
  function step() {
    if (S.mode !== "playing") return { landed: null, impacts: 0 };
    S.tick++;
    if (S.tick > MAX_RECORDED_TICKS) recordable = false;
    sync();
    if (input.charging) input.charge = Math.min(1, input.charge + RUN_STEP / GAMEPLAY.chargeSeconds);
    advanceEconomy(E, RUN_STEP);
    advanceStreak(E, RUN_STEP);
    const physicsFall = () => fallPose({ ...F, reduced: false }), wasFalling = F.active, before = { ...P, fallPose: F.active ? physicsFall() : null };
    let landed = null, fallStep = { impacts: 0, finished: false };
    if (wasFalling) {
      fallStep = advanceFall(F, RUN_STEP);
      if (fallStep.finished) {
        clear();
        S.next = Math.max(S.next, 0.8);
        events.push({ type: "recovered" });
      }
    } else landed = advanceFlight(P, RUN_STEP, { spin: input.spin, thrust: input.thrust });
    pace.falling = F.active;
    advancePace(pace, E, P, RUN_STEP);
    S.distance += pace.speed * RUN_STEP;
    sync();
    const after = wasFalling ? { ...P, fallPose: physicsFall() } : landed ? { ...P, angle: landed.angle } : P;
    for (const o of S.obs) {
      const old = o.x;
      o.x -= (S.speed + (o.approachSpeed || 0)) * RUN_STEP;
      if (sweptCollision(before, after, o, old, o.x, S.t, RUN_STEP)) {
        S.mode = "dead";
        clear();
        sync();
        events.push({ type: "death", obstacle: o });
        return { landed, impacts: fallStep.impacts };
      }
      if (!o.passed && o.x + o.w < -50) {
        o.passed = true;
        passObstacle(E);
        if (o.altitude) events.push({ type: "air-passed" });
      }
    }
    if (landed) {
      let late = 0, near = 0;
      const target = S.obs.find((o) => o.uid === lateId);
      if (target && !target.latePaid && target.x + target.w - (target.inset || 5) < -47) {
        late = 1;
        target.latePaid = true;
      }
      for (const o of S.obs) {
        if (o.altitude || o.nearPaid) continue;
        if (nearWindow(-47 - (o.x + o.w - (o.inset || 5)), S.speed)) {
          near++;
          o.nearPaid = true;
        }
      }
      const oldMultiplier = E.multiplier;
      lastLanding = settleLanding(E, P, landed, { late, near });
      if (!landed.good) {
        stumble(pace);
        beginFall(F, landed, { reduced: reducedMotion, speed: pace.recovery.target });
        pace.falling = true;
        P.angle = 0;
        P.omega = 0;
        P.vx = 0;
        P.grab = 0;
        clear();
        advancePace(pace, E, P, 0);
      }
      events.push({ type: "landing", landed, result: lastLanding, late, near, oldMultiplier });
      lateId = null;
    }
    if (!P.airborne && Math.abs(P.angle) > 1e-3) {
      P.angle *= Math.exp(-RUN_STEP * 18);
      P.omega = 0;
    }
    S.obs = S.obs.filter((o) => o.uid === lateId || o.x + o.w > (o.id === "joe" ? -480 : -400));
    S.next -= RUN_STEP;
    if (S.next <= 0) director.spawn();
    sync();
    return { landed, impacts: fallStep.impacts };
  }
  function snapshot() {
    return structuredClone({ seed, S, P, E, pace, F, input, random: random3.state, director: director.state, lateId, lastLanding });
  }
  function restore(saved) {
    seed = saved.seed;
    for (const [a, b] of [[S, saved.S], [P, saved.P], [E, saved.E], [pace, saved.pace], [F, saved.F], [input, saved.input], [director.state, saved.director]]) Object.assign(a, structuredClone(b));
    random3 = createRandom(seed);
    random3.restore(saved.random);
    lateId = saved.lateId;
    lastLanding = structuredClone(saved.lastLanding);
    events = [];
  }
  function replay() {
    return recordable ? { format: 1, ruleset: RULESET, seed, ticks: S.tick, events: log.map((e) => [...e]) } : null;
  }
  return { S, P, E, pace, F, input, director, reset, jump, command, step, sync, snapshot, restore, replay, drainEvents() {
    const next = events;
    events = [];
    return next;
  }, get lastLanding() {
    return lastLanding;
  }, get seed() {
    return seed;
  }, get recordable() {
    return recordable;
  } };
}
function validateReplay(value) {
  if (!value || value.format !== 1 || value.ruleset !== RULESET || !Number.isInteger(value.seed) || value.seed < 0 || value.seed > 4294967295 || !Number.isInteger(value.ticks) || value.ticks < 1 || value.ticks > MAX_RECORDED_TICKS || !Array.isArray(value.events) || value.events.length > MAX_RECORDED_EVENTS) throw Error("Invalid or unsupported replay");
  let previous = -1;
  for (const event of value.events) {
    if (!Array.isArray(event) || event.length !== 2 || !Number.isInteger(event[0]) || event[0] < previous || event[0] < 0 || event[0] >= value.ticks || !Number.isInteger(event[1]) || event[1] < 0 || event[1] >= RUN_COMMANDS.length) throw Error("Invalid replay input");
    previous = event[0];
  }
  return value;
}
function verifyReplay(value) {
  const replay = validateReplay(value), run = createRun({ seed: replay.seed, record: false });
  run.reset();
  let event = 0;
  while (run.S.tick < replay.ticks && run.S.mode === "playing") {
    while (event < replay.events.length && replay.events[event][0] === run.S.tick) run.command(RUN_COMMANDS[replay.events[event++][1]]);
    run.step();
    run.drainEvents();
  }
  if (run.S.mode !== "dead" || run.S.tick !== replay.ticks || event !== replay.events.length) throw Error("Replay does not end at its first collision");
  return { score: run.S.score, flips: run.E.flips, ticks: run.S.tick };
}

// supabase/rulesets/roadster-v380/run.js
var run_exports2 = {};
__export(run_exports2, {
  RULESET: () => RULESET2,
  RUN_COMMANDS: () => RUN_COMMANDS2,
  RUN_STEP: () => RUN_STEP2,
  createRun: () => createRun2,
  validateReplay: () => validateReplay2,
  verifyReplay: () => verifyReplay2
});

// supabase/rulesets/roadster-v380/gameplay-config.js
var GAMEPLAY2 = Object.freeze({
  version: "3.8.0",
  gravity: 1550,
  jumpSpeed: 560,
  chargedSpeed: 440,
  chargeSeconds: 0.4,
  spinSpeed: 7.2,
  spinAcceleration: 60,
  releaseSpeed: 1.8,
  releaseDeceleration: 24,
  landingAngle: Math.PI * 2 / 9,
  landingOmega: Math.PI * 4 / 3,
  perfectAngle: Math.PI / 18,
  perfectPoints: 50,
  thrustAcceleration: 2100,
  horizontalDrag: 1.8,
  maxHorizontal: 260,
  tank: 100,
  initialFuel: 50,
  fuelPerSecond: 80,
  fuelPerFlip: 25,
  attachSeconds: 0.12,
  obstaclePoints: 50,
  flipFactor: 50,
  nearPoints: 25,
  nearSeconds: 0.12,
  maxMultiplier: 50,
  multiplierStep: 1,
  comboDuration: 8,
  comboFalloff: 1.2,
  comboDecaySeconds: 0.5,
  streakStep: 0.05,
  maxStreak: 0.25,
  streakHold: 4,
  streakDecay: 0.1,
  fallSeconds: 2.8,
  fallSpeedSeconds: 0.65,
  fallMaxRate: 1.6,
  fallTapRate: 0.15,
  routeTimingMargin: 0.035,
  routeFuelReserve: 20,
  stumbleSeconds: 0.3,
  recoveryRatio: 0.55,
  recoveryMin: 1.2,
  recoveryExtra: 2.8,
  startSpeed: 360,
  maxSpeed: 660,
  rampSeconds: 150,
  stages: Object.freeze([0, 15, 35, 60, 90, 120, 150]),
  bestKey: "roadster-best-v3",
  tutorialKey: "roadster-coach-v3"
});

// supabase/rulesets/roadster-v380/content.js
function freeze2(value) {
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) freeze2(item);
    Object.freeze(value);
  }
  return value;
}
var BIOMES2 = freeze2(["spaceport", "tesla-factory"]);
var BIOME_CYCLE2 = freeze2(["spaceport", "tesla-factory"]);
var ANIMATIONS2 = freeze2(["taunt", "angry-look", "point-and-laugh", "trampoline-bounce", "money-guns", "podcast", "throw"]);
var ASSETS2 = freeze2({
  collage: { file: "collage-atlas.png" },
  extras: { file: "collage-extras.png" },
  cast: { file: "paper-cast.png" },
  photos: { file: "obstacle-photos.png" },
  joe: { file: "assets/characters/joe-rogan.png" },
  amber: { file: "assets/characters/amber-head-v247.png" },
  drone: { file: "assets/obstacles/phantom-v3.png" }
});
var none2 = { enabled: false };
var reaction2 = (animationId, trigger = "near", range = 300, space = "target") => ({ enabled: true, animationId, trigger, range, space });
function define2(base, options = {}) {
  return freeze2({
    ...base,
    definitionVersion: 1,
    category: options.category || "object",
    placement: base.altitude ? "air" : "ground",
    anchor: base.altitude ? "air-bottom-center" : "ground-center",
    biomes: options.biomes || "all",
    visual: { renderer: options.renderer || "prop", key: options.key || base.id, assets: options.assets || [], bob: options.bob || false },
    collision: options.collision || "box",
    reactions: { hero: options.hero || none2, obstacle: options.obstacle || none2 },
    collectible: true,
    provenance: "assets-provenance.json"
  });
}
var OBSTACLES2 = freeze2([
  define2({ id: "v8", name: "V8 \u2022 VERY LOUD", w: 108, h: 36 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define2({ id: "trump", name: "TARIFF MAN", w: 54, h: 94 }, { renderer: "character", assets: ["collage"], category: "person", bob: true, hero: reaction2("taunt"), obstacle: reaction2("angry-look") }),
  define2({ id: "protest", name: "COUCH CRITICS", w: 102, h: 94 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "group" }),
  define2({ id: "truck", name: "CYBERBRICK", w: 110, h: 41 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define2({ id: "doge", name: "MUCH WOW", w: 52, h: 64 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "animal" }),
  define2({ id: "pump", name: "BIG OIL", w: 54, h: 78 }, {}),
  define2({ id: "zuck", name: "ZUCK", w: 62, h: 94, inset: 5 }, { renderer: "character", assets: ["cast"], category: "person", hero: reaction2("money-guns", "airborne-near"), obstacle: reaction2("money-guns", "airborne-near") }),
  define2({ id: "openai", name: "OPENAI", w: 70, h: 68, inset: 5 }, { category: "emblem" }),
  define2({ id: "claude", name: "CLAUDE", w: 84, h: 73, inset: 6 }, { category: "emblem" }),
  define2({ id: "gemini", name: "GEMINI", w: 58, h: 78, inset: 4 }, { category: "emblem" }),
  define2({ id: "rogozin", name: "ROGOZIN / TRAMPOLINE", w: 88, h: 130, inset: 4 }, { renderer: "character", assets: ["cast"], category: "person", biomes: ["spaceport"], collision: "trampoline", hero: reaction2("point-and-laugh", "airborne-near"), obstacle: reaction2("trampoline-bounce", "passage") }),
  define2({ id: "amber", name: "AMBER HEARD", w: 58, h: 94, inset: 9 }, { renderer: "character", assets: ["amber"], category: "person", obstacle: reaction2("throw", "passage") }),
  define2({ id: "joe", name: "JOE ROGAN", w: 76, h: 94, inset: 10 }, { renderer: "character", assets: ["joe"], category: "person", hero: reaction2("podcast", "passage", 650, "self"), obstacle: reaction2("podcast", "passage", 650, "self") }),
  define2({ id: "muscleCoupe", name: "AMERICAN MUSCLE", w: 138, h: 45, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define2({ id: "muscleCompact", name: "SMALL BLOCK / BIG EGO", w: 112, h: 38, inset: 5 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define2({ id: "pickup", name: "BIG TRUCK ENERGY", w: 140, h: 57, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define2({ id: "simpsonsCouch", name: "EVERGREEN TERRACE", w: 136, h: 88, inset: 6 }, { category: "group" }),
  define2({ id: "hoverDrone", name: "HOVER DRONE", w: 92, h: 40, inset: 8, altitude: 300, approachSpeed: 0 }, { renderer: "drone", assets: ["drone"], category: "drone" }),
  define2({ id: "incomingDrone", name: "INCOMING DRONE", w: 92, h: 40, inset: 8, altitude: 220, approachSpeed: 110 }, { renderer: "drone", assets: ["drone"], category: "drone" })
]);
var PROP_TYPES2 = freeze2(OBSTACLES2.filter((o) => ["muscleCoupe", "muscleCompact", "pickup", "simpsonsCouch"].includes(o.id)));
var AIR_TYPES2 = freeze2(OBSTACLES2.filter((o) => o.placement === "air"));
var definitionsById2 = new Map(OBSTACLES2.map((o) => [o.id, o]));
var obstacleDefinition2 = (id2) => definitionsById2.get(id2);
function validateContent2(definitions = OBSTACLES2) {
  const errors = [], ids = /* @__PURE__ */ new Set();
  for (const o of definitions) {
    if (!o.id || ids.has(o.id)) errors.push(`duplicate or missing id: ${o.id}`);
    ids.add(o.id);
    if (!Number.isFinite(o.w) || !Number.isFinite(o.h) || o.w <= 0 || o.h <= 6) errors.push(`${o.id}: invalid size`);
    if (!["ground", "air"].includes(o.placement)) errors.push(`${o.id}: invalid placement`);
    if (o.placement === "air" && (!Number.isFinite(o.altitude) || !(Number(o.altitude) > 0))) errors.push(`${o.id}: invalid altitude`);
    if (o.placement === "ground" && o.altitude) errors.push(`${o.id}: ground altitude`);
    if (!["ground-center", "air-bottom-center"].includes(o.anchor)) errors.push(`${o.id}: invalid anchor`);
    if (o.biomes !== "all" && (!Array.isArray(o.biomes) || !o.biomes.length || o.biomes.some((b) => !BIOMES2.includes(b)))) errors.push(`${o.id}: unknown biome`);
    if (!o.visual || !["photo", "cutout", "character", "prop", "drone"].includes(o.visual.renderer)) errors.push(`${o.id}: missing renderer`);
    for (const id2 of o.visual?.assets || []) if (!Object.hasOwn(ASSETS2, id2)) errors.push(`${o.id}: unknown asset ${id2}`);
    if (!["box", "trampoline"].includes(o.collision)) errors.push(`${o.id}: missing collision profile`);
    if (o.inset !== void 0 && (!Number.isFinite(o.inset) || o.inset < 0 || o.inset * 2 >= o.w)) errors.push(`${o.id}: invalid inset`);
    for (
      const direction of
      /** @type {const} */
      ["hero", "obstacle"]
    ) {
      const r = o.reactions?.[direction];
      if (!r || typeof r.enabled !== "boolean") errors.push(`${o.id}: missing ${direction} reaction`);
      else if (r.enabled && (!ANIMATIONS2.includes(r.animationId) || !["near", "airborne-near", "passage"].includes(r.trigger) || !(r.range > 0) || !["target", "self"].includes(r.space))) errors.push(`${o.id}: missing animation ${r.animationId}`);
    }
  }
  return errors;
}
var contentErrors2 = validateContent2();
if (contentErrors2.length) throw new Error(`Invalid content: ${contentErrors2.join("; ")}`);

// supabase/rulesets/roadster-v380/physics.js
var STEP2 = 1 / 120;
function rogozinBounce2(time) {
  return 20 * Math.abs(Math.sin(time * 4.5));
}
function obstacleBoxes2(o, time = 0) {
  if ((o.collision || obstacleDefinition2(o.id)?.collision) === "trampoline") {
    return [
      { left: 6, right: o.w - 6, top: 16 },
      { left: o.w / 2 - 18, right: o.w / 2 + 18, top: 108 + rogozinBounce2(time) }
    ];
  }
  const inset = o.inset ?? 5;
  return [{ left: inset, right: o.w - inset, top: o.h - 6 }];
}

// supabase/rulesets/roadster-v380/fall.js
var clamp3 = (x) => Math.max(0, Math.min(1, x));
var ease2 = (x) => {
  x = clamp3(x);
  return x * x * (3 - 2 * x);
};
var mix2 = (a, b, t) => a + (b - a) * t;
var FALL_CONTACTS2 = Object.freeze([0.14, 0.36, 0.56]);
var FALL_CAR_CONTACTS2 = Object.freeze([0.16, 0.38]);
var FALL_CAR_HULL2 = Object.freeze([[-49, -7], [-8, -15], [8, -15], [48.5, 0], [47, 6], [27, 12], [-34, 12], [-46, 5]].map(Object.freeze));
function fallCarSupport2(angle) {
  return Math.max(...FALL_CAR_HULL2.map(([x, y]) => x * Math.sin(angle) + y * Math.cos(angle)));
}
var arc2 = (p, a, b, height) => {
  const t = clamp3((p - a) / (b - a));
  return t < 1e-12 || t > 1 - 1e-12 ? 0 : height * 4 * t * (1 - t);
};
var pulse2 = (p, hit) => ease2((p - hit + 0.035) / 0.035) * (1 - ease2((p - hit) / 0.055));
function track2(keys, p) {
  let i = 1;
  while (i < keys.length - 1 && p > keys[i][0]) i++;
  const [a, b] = [keys[i - 1], keys[i]];
  return mix2(a[1], b[1], ease2((p - a[0]) / (b[0] - a[0])));
}
function createFall2() {
  return { active: false, age: 0, duration: GAMEPLAY2.fallSeconds, rate: 1, taps: 0, angle: 0, reduced: false };
}
function beginFall2(f, result, { reduced = false, speed = GAMEPLAY2.startSpeed } = {}) {
  const angle = Math.atan2(Math.sin(result.angle), Math.cos(result.angle));
  const severity = clamp3((speed - GAMEPLAY2.startSpeed) / (GAMEPLAY2.maxSpeed - GAMEPLAY2.startSpeed));
  Object.assign(f, { active: true, age: 0, duration: GAMEPLAY2.fallSeconds + GAMEPLAY2.fallSpeedSeconds * severity, rate: 1, taps: 0, angle, reduced });
}
function hastenFall2(f) {
  if (!f.active) return false;
  f.taps++;
  f.rate = Math.min(GAMEPLAY2.fallMaxRate, f.rate + GAMEPLAY2.fallTapRate);
  return true;
}
function advanceFall2(f, dt) {
  if (!f.active) return { impacts: 0, finished: false };
  const previous = f.age;
  f.age = Math.min(f.duration, f.age + dt * f.rate);
  const impacts = FALL_CONTACTS2.filter((t) => previous < f.duration * t && f.age >= f.duration * t).length;
  f.active = f.age < f.duration;
  return { impacts, finished: !f.active };
}
function fallPose2(f) {
  const p = clamp3(f.age / f.duration), sit = ease2(p / 0.14), stand = ease2((p - 0.68) / 0.16), gather = ease2((p - 0.7) / 0.22), settle = clamp3((p - 0.97) / 0.03);
  const impact = Math.max(...FALL_CONTACTS2.map((hit) => pulse2(p, hit))), seat = sit * (1 - stand);
  const crouch = (0.72 + 0.18 * impact) * seat + (settle === 1 ? 0 : 0.1 * Math.sin(settle * Math.PI));
  const lift = p < 0.36 ? arc2(p, 0.14, 0.36, 32) : p < 0.56 ? arc2(p, 0.36, 0.56, 28) : arc2(p, 0.56, 0.97, 112);
  const angle = mix2(f.angle, -0.64, sit) * (1 - stand);
  const seatAnchor = -11 * Math.sin(angle) + (22.5 + 27 * crouch) * Math.cos(angle) + 9;
  const rider = { x: 34 * sit * (1 - gather), y: mix2(95, seatAnchor, seat) + lift, angle, seat, crouch, lift };
  const entry = (y) => ({ x: Math.sin(f.angle) * (y - 65), y: 65 + Math.cos(f.angle) * (y - 65) });
  const e = entry(95), c = entry(12);
  rider.x += e.x * (1 - sit);
  rider.y += (e.y - 95) * (1 - sit);
  const carAngle = track2([[0, f.angle], [0.16, 0.95], [0.29, Math.PI], [0.38, 2 * Math.PI - 1.02], [0.54, 2 * Math.PI], [1, 2 * Math.PI]], p);
  const carHop = p < 0.16 ? arc2(p, 0, 0.16, 20) : p < 0.38 ? arc2(p, 0.16, 0.38, 22) : arc2(p, 0.38, 0.54, 8);
  const car = { x: gather === 1 ? 0 : mix2(c.x, -88, ease2(p / 0.16)) * (1 - gather), y: p >= 0.54 ? 12 : mix2(c.y, fallCarSupport2(carAngle) + carHop, ease2(p / 0.06)), angle: carAngle, phase: 0 };
  let shake = 0;
  for (const hit of FALL_CONTACTS2) if (p >= hit) shake = Math.max(shake, Math.exp(-(p - hit) * 40));
  const pose = { car, rider, crouch, impact, flail: sit * (1 - ease2((p - 0.82) / 0.12)), push: 0, shake: shake * 2.4, progress: p };
  if (f.reduced) {
    pose.car = { x: 0, y: 12, angle: 0, phase: 0 };
    pose.rider = { x: 0, y: 95, angle: 0, seat: 0, crouch };
    pose.shake = 0;
    pose.push = 0;
    pose.flail = 0;
  }
  return pose;
}
function fallPolygons2(pose) {
  const seat = pose.rider.seat || 0, crouch = pose.rider.crouch || 0;
  const rider = [[-23, -70 + 4 * seat], [23 + 48 * seat, -70 + 4 * seat], [23 + 48 * seat, 68 - 27 * crouch], [-23, 68 - 27 * crouch]];
  return [[pose.car, FALL_CAR_HULL2.map(([x, y]) => [x, -y])], [pose.rider, rider]].map(([body2, vertices]) => {
    const c = Math.cos(body2.angle), s = Math.sin(body2.angle);
    return vertices.map(([x, y]) => ({ x: body2.x + c * x + s * y, y: body2.y - s * x + c * y }));
  });
}
function interpolateFall2(a, b, t) {
  const pose = {};
  for (const part of ["car", "rider"]) {
    pose[part] = {};
    for (const k of ["x", "y", "angle", "seat", "crouch", "phase"]) pose[part][k] = mix2(a[part][k] || 0, b[part][k] || 0, t);
  }
  return pose;
}

// supabase/rulesets/roadster-v380/gameplay.js
var TAU2 = Math.PI * 2;
var clamp4 = (x, a, b) => Math.max(a, Math.min(b, x));
var approach2 = (x, target, amount) => x < target ? Math.min(target, x + amount) : Math.max(target, x - amount);
function uprightError2(angle, direction = -1) {
  let e = ((angle + Math.PI) % TAU2 + TAU2) % TAU2 - Math.PI;
  if (Math.abs(Math.abs(e) - Math.PI) < 1e-9) e = -Math.sign(direction || -1) * Math.PI;
  return e;
}
function createFlight2(fuel = GAMEPLAY2.initialFuel) {
  return { y: 0, vy: 0, vx: 0, angle: 0, omega: 0, airborne: false, time: 0, fuel, thrusting: false, latched: false, attach: 0, maxTurn: 0, turns: 0, lastDirection: -1, trickStarted: false, grab: 0, launchVelocity: 0 };
}
function launch2(p, charge = 0) {
  if (p.airborne) return false;
  Object.assign(p, { y: 1e-3, vy: GAMEPLAY2.jumpSpeed + GAMEPLAY2.chargedSpeed * clamp4(charge, 0, 1), angle: 0, omega: 0, airborne: true, time: 0, latched: false, attach: 0, maxTurn: 0, turns: 0, trickStarted: false, grab: 0, launchVelocity: GAMEPLAY2.jumpSpeed + GAMEPLAY2.chargedSpeed * clamp4(charge, 0, 1) });
  return true;
}
function advanceFlight2(p, dt, { spin = false, thrust = false } = {}) {
  p.thrusting = false;
  const gripTarget = p.airborne && spin ? 1 : 0;
  p.grab = approach2(p.grab, gripTarget, dt / (gripTarget ? 0.12 : 0.18));
  if (!p.airborne) {
    p.vx *= Math.exp(-GAMEPLAY2.horizontalDrag * dt);
    return null;
  }
  p.time += dt;
  if (spin) {
    p.trickStarted = true;
    p.lastDirection = -1;
    p.omega = approach2(p.omega, -GAMEPLAY2.spinSpeed, GAMEPLAY2.spinAcceleration * dt);
  } else {
    const target = Math.sign(p.omega) * Math.min(Math.abs(p.omega), GAMEPLAY2.releaseSpeed);
    p.omega = approach2(p.omega, target, GAMEPLAY2.releaseDeceleration * dt);
  }
  p.angle += p.omega * dt;
  p.maxTurn = Math.max(p.maxTurn, -p.angle);
  p.turns = Math.floor((p.maxTurn + 1e-7) / TAU2);
  const burn = thrust ? Math.min(dt, p.fuel / GAMEPLAY2.fuelPerSecond) : 0;
  if (burn > 0) {
    p.fuel = Math.max(0, p.fuel - burn * GAMEPLAY2.fuelPerSecond);
    p.thrusting = true;
    p.latched = true;
    p.vx += Math.sin(p.angle) * GAMEPLAY2.thrustAcceleration * burn;
    p.vy += Math.cos(p.angle) * GAMEPLAY2.thrustAcceleration * burn;
  }
  if (p.latched) p.attach = Math.min(1, p.attach + dt / GAMEPLAY2.attachSeconds);
  p.vx = clamp4(p.vx * Math.exp(-GAMEPLAY2.horizontalDrag * dt), -GAMEPLAY2.maxHorizontal, GAMEPLAY2.maxHorizontal);
  p.y += p.vy * dt - 0.5 * GAMEPLAY2.gravity * dt * dt;
  p.vy -= GAMEPLAY2.gravity * dt;
  if (p.y > 0) return null;
  const good = Math.abs(uprightError2(p.angle)) <= GAMEPLAY2.landingAngle + 1e-9 && Math.abs(p.omega) <= GAMEPLAY2.landingOmega;
  const turns = good ? Math.max(p.turns, Math.round(-p.angle / TAU2)) : p.turns;
  const perfect = good && Math.abs(uprightError2(p.angle)) <= GAMEPLAY2.perfectAngle + 1e-9;
  const result = { good, perfect, turns, impact: Math.abs(p.vy), angle: p.angle, omega: p.omega };
  p.turns = turns;
  p.y = 0;
  p.vy = 0;
  p.airborne = false;
  p.thrusting = false;
  if (result.good) {
    p.angle = 0;
    p.omega = 0;
  }
  return result;
}
function createEconomy2() {
  return { bonus: 0, multiplier: 10, meter: 0, decay: 0, streak: 0, streakLeft: 0, flips: 0 };
}
function comboSeconds2(e) {
  return GAMEPLAY2.comboDuration - GAMEPLAY2.comboFalloff * (e.multiplier / 10 - 1);
}
function rewardAction2(e, count = 1) {
  e.multiplier = Math.min(GAMEPLAY2.maxMultiplier, e.multiplier + count * GAMEPLAY2.multiplierStep);
  e.meter = 1;
  e.decay = 0;
}
function advanceEconomy2(e, dt) {
  if (e.meter > 0) {
    const used = Math.min(dt, e.meter * comboSeconds2(e));
    e.meter = Math.max(0, e.meter - used / comboSeconds2(e));
    dt -= used;
  }
  if (e.meter === 0 && e.multiplier > 10) {
    e.decay += dt;
    while (e.decay + 1e-9 >= GAMEPLAY2.comboDecaySeconds && e.multiplier > 10) {
      e.multiplier--;
      e.decay -= GAMEPLAY2.comboDecaySeconds;
    }
  }
}
function advanceStreak2(e, dt) {
  const used = Math.min(dt, e.streakLeft);
  e.streakLeft -= used;
  e.streak = Math.max(0, e.streak - (dt - used) * GAMEPLAY2.streakDecay);
}
function passObstacle2(e) {
  const points = GAMEPLAY2.obstaclePoints * e.multiplier / 10;
  e.bonus += points;
  return points;
}
function settleLanding2(e, p, result, { late = 0, near = 0 } = {}) {
  if (!result.good) {
    e.multiplier = 10;
    e.meter = 0;
    e.decay = 0;
    e.streak = 0;
    e.streakLeft = 0;
    return { points: 0, turns: 0, late: 0, near: 0, perfect: false, good: false };
  }
  const n = result.turns, perfect = !!result.perfect, points = (GAMEPLAY2.flipFactor * n * (n + 1) + GAMEPLAY2.nearPoints * (late + near) + GAMEPLAY2.perfectPoints * Number(perfect)) * e.multiplier / 10;
  e.bonus += points;
  e.flips += n;
  p.fuel = Math.min(GAMEPLAY2.tank, p.fuel + GAMEPLAY2.fuelPerFlip * n);
  if (n + late + near + Number(perfect)) rewardAction2(e, n + late + near + Number(perfect));
  if (n || near) {
    e.streak = Math.min(GAMEPLAY2.maxStreak, e.streak + GAMEPLAY2.streakStep);
    e.streakLeft = GAMEPLAY2.streakHold;
  }
  return { points, turns: n, late, near, perfect, good: true };
}
function createPace2() {
  return { progress: 0, base: GAMEPLAY2.startSpeed, speed: GAMEPLAY2.startSpeed, recovery: null, stumble: 0, falling: false };
}
function stumble2(pace) {
  const target = pace.recovery?.target ?? pace.base, r = clamp4((target - GAMEPLAY2.startSpeed) / (GAMEPLAY2.maxSpeed - GAMEPLAY2.startSpeed), 0, 1);
  pace.recovery = { target, age: 0, duration: GAMEPLAY2.recoveryMin + GAMEPLAY2.recoveryExtra * r ** 1.5 };
  pace.stumble = GAMEPLAY2.stumbleSeconds;
  pace.base = target * GAMEPLAY2.recoveryRatio;
}
function recoverySpeed2(r, t) {
  const T = r.duration, d = r.target * (1 - GAMEPLAY2.recoveryRatio), v0 = r.target * GAMEPLAY2.recoveryRatio, h = 0.15, a = T - h;
  if (t <= a) return v0 + d * (t / T) ** 2;
  const u = clamp4((t - a) / h, 0, 1), start = v0 + d * (a / T) ** 2, slope = 2 * d * a / T ** 2, endSlope = r.target >= GAMEPLAY2.maxSpeed ? 0 : (GAMEPLAY2.maxSpeed - GAMEPLAY2.startSpeed) / GAMEPLAY2.rampSeconds;
  return (2 * u ** 3 - 3 * u * u + 1) * start + (u ** 3 - 2 * u * u + u) * h * slope + (-2 * u ** 3 + 3 * u * u) * r.target + (u ** 3 - u * u) * h * endSlope;
}
function advancePace2(pace, e, p, dt) {
  if (pace.recovery) {
    pace.stumble = Math.max(0, pace.stumble - dt);
    const r = pace.recovery;
    r.age = Math.min(r.duration, r.age + dt);
    pace.base = recoverySpeed2(r, r.age);
    if (r.age >= r.duration) {
      pace.base = r.target;
      pace.recovery = null;
    }
  } else if (!pace.falling) {
    pace.progress += dt;
    pace.base = GAMEPLAY2.startSpeed + (GAMEPLAY2.maxSpeed - GAMEPLAY2.startSpeed) * Math.min(1, pace.progress / GAMEPLAY2.rampSeconds);
  }
  pace.speed = Math.max(60, pace.base * (1 + e.streak) + p.vx);
  return pace.speed;
}
function playerPolygons2(p) {
  if (p.fallPose) return fallPolygons2(p.fallPose);
  const c = Math.cos(p.angle), s = Math.sin(p.angle);
  return [[-47, 0, 47, 25], [-23, 25, 23, 163 - 32 * (p.grab || 0)]].map(([l, b, r, t]) => [[l, b], [r, b], [r, t], [l, t]].map(([x, y]) => ({ x: c * x + s * (y - 65), y: p.y + 65 - s * x + c * (y - 65) })));
}
function overlaps2(poly, rect) {
  const axes = [{ x: 1, y: 0 }, { x: 0, y: 1 }];
  for (let i = 0; i < (poly.length === 4 ? 2 : poly.length); i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    axes.push({ x: -(b.y - a.y), y: b.x - a.x });
  }
  for (const a of axes) {
    const ps = poly.map((p) => p.x * a.x + p.y * a.y), rs = rect.map((p) => p.x * a.x + p.y * a.y);
    if (Math.max(...ps) <= Math.min(...rs) || Math.max(...rs) <= Math.min(...ps)) return false;
  }
  return true;
}
function collisionAt2(p, o, dx, time = 0) {
  if (dx > 180 || dx + o.w < -180) return false;
  const polygons = playerPolygons2(p);
  return obstacleBoxes2(o, time).some((b) => {
    const bottom = o.altitude || 0, top = bottom + b.top;
    const rect = [{ x: dx + b.left, y: bottom }, { x: dx + b.right, y: bottom }, { x: dx + b.right, y: top }, { x: dx + b.left, y: top }];
    return polygons.some((poly) => overlaps2(poly, rect));
  });
}
function sweptCollision2(before, after, o, dxBefore, dxAfter, time, dt) {
  const fallTravel = before.fallPose && after.fallPose ? Math.max(...["rider", "car"].map((part) => Math.abs(after.fallPose[part].angle - before.fallPose[part].angle) * (part === "car" ? 55 : 170) + Math.abs(after.fallPose[part].y - before.fallPose[part].y) + Math.abs(after.fallPose[part].x - before.fallPose[part].x))) : 0;
  const n = Math.max(1, Math.ceil((Math.abs(dxAfter - dxBefore) + Math.abs(after.y - before.y) + Math.abs(after.angle - before.angle) * 170 + fallTravel) / 4));
  for (let i = 0; i <= n; i++) {
    const f = i / n, p = { y: before.y + (after.y - before.y) * f, angle: before.angle + (after.angle - before.angle) * f, grab: (before.grab || 0) + ((after.grab || 0) - (before.grab || 0)) * f };
    if (before.fallPose && after.fallPose) p.fallPose = interpolateFall2(before.fallPose, after.fallPose, f);
    if (collisionAt2(p, o, dxBefore + (dxAfter - dxBefore) * f, time - dt + dt * f)) return true;
  }
  return false;
}
function nearWindow2(distance, speed) {
  return distance >= 0 && distance <= Math.max(0, speed) * GAMEPLAY2.nearSeconds + 1e-8;
}

// supabase/rulesets/roadster-v380/routes.js
var STAGES2 = GAMEPLAY2.stages;
function stageAt2(progress) {
  return STAGES2.filter((t) => progress >= t).length - 1;
}
function makePattern2(kind, { speed = 360, type = { id: "truck", w: 110, h: 41 }, dx = 900 } = {}) {
  const item = (o, offset = 0) => ({ ...o, x: dx + offset, passed: false });
  if (kind === "hover") return [item(AIR_TYPES2[0])];
  if (kind === "incoming") return [item(AIR_TYPES2[1])];
  if (kind === "precision") {
    const span = Math.min(200, Math.max(110, speed * 0.4 - 94)), cars = [], n = Math.min(2, Math.ceil(span / 110)), width = (span - 20 * (n - 1)) / n;
    for (let i = 0; i < n; i++) cars.push(item({ id: "truck", name: "CYBERBRICK", w: width, h: 41 * width / 110, inset: 4 }, i * (width + 20)));
    cars.push(item({ id: "truck", name: "CYBERBRICK", w: 110, h: 41, inset: 5 }, speed * 1.15));
    cars.push(item({ ...AIR_TYPES2[0], altitude: 400 }, span * 0.5));
    return cars;
  }
  if (kind === "mixed") return [item(type), item(AIR_TYPES2[1], speed * 0.65), item(type.h <= 57 ? type : { id: "truck", name: "CYBERBRICK", w: 110, h: 41, inset: 5 }, speed * 1.65)];
  if (kind === "thrust") {
    const n = Math.min(6, Math.max(4, Math.ceil(speed * 1.65 / 165)));
    return Array.from({ length: n }, (_, i) => item({ id: "truck", name: "CYBERBRICK", w: 110, h: 41, inset: 5 }, i * 165));
  }
  if (kind === "pair") return [item(type), item(type, speed * 1.5)];
  return [item(type)];
}
function validateRoute2(obstacles, { flight = createFlight2(), pace = createPace2(), economy = createEconomy2(), time = 0, allowThrust = true, burns = null, timingMargin = 0, leads = [0.1, 0.11, 0.115, 0.12, 0.125, 0.14, 0.16, 0.2, 0.3, 0.4, 0.5, 0.65], charges = [0, 0.5, 1] } = {}) {
  if (flight.airborne || pace.stumble > 0) return null;
  for (const charge of charges) for (const lead of leads) for (const burn of burns ?? (allowThrust && flight.fuel > 0 ? [0, 0.35, 0.65, 1.1] : [0])) {
    const p = { ...flight }, r = structuredClone(pace), e = { ...economy }, obs = obstacles.map((o) => ({ ...o })), actions = [];
    let charging = false, held = 0, elapsed = 0, lateTarget = null, lastThrust = false, nearLandings = 0, lateTakeoffs = 0;
    const dt = 1 / 120;
    for (let tick = 0; tick < 1440; tick++) {
      elapsed = tick * dt;
      const next = obs.find((o) => o.x + o.w > -47 && (!o.altitude || o.altitude < 163));
      if (!p.airborne && next) {
        const ttc = (next.x + (next.inset || 5) - 47) / Math.max(1, r.speed + (next.approachSpeed || 0));
        if (!charging && ttc <= lead + charge * GAMEPLAY2.chargeSeconds) {
          charging = true;
          held = 0;
          actions.push({ at: elapsed, action: "hold" });
        }
        if (charging) {
          held += dt;
          if (held + 1e-9 >= charge * GAMEPLAY2.chargeSeconds + (charge > 0 ? dt : 0)) {
            lateTarget = nearWindow2(next.x + (next.inset || 5) - 47, r.speed + (next.approachSpeed || 0)) ? next : null;
            launch2(p, charge);
            charging = false;
            actions.push({ at: elapsed, action: "jump", charge });
          }
        }
      }
      const before = { ...p }, useThrust = p.airborne && p.time >= 0.18 && p.time < 0.18 + burn;
      if (useThrust !== lastThrust) {
        actions.push({ at: elapsed, action: useThrust ? "thrust-on" : "thrust-off" });
        lastThrust = useThrust;
      }
      const landed = advanceFlight2(p, dt, { thrust: useThrust });
      advanceEconomy2(e, dt);
      advanceStreak2(e, dt);
      advancePace2(r, e, p, dt);
      const after = landed ? { ...p, angle: landed.angle } : p;
      let alive = true;
      for (const o of obs) {
        const old = o.x;
        o.x -= (r.speed + (o.approachSpeed || 0)) * dt;
        if (sweptCollision2(before, after, o, old, o.x, time + elapsed, dt)) {
          alive = false;
          break;
        }
        if (!o.passed && o.x + o.w < -50) {
          o.passed = true;
          passObstacle2(e);
        }
      }
      if (!alive || landed && !landed.good) break;
      if (landed) {
        let near = 0;
        const late = lateTarget && lateTarget.x + lateTarget.w - (lateTarget.inset || 5) < -47 ? 1 : 0;
        for (const o of obs) if (!o.altitude && !o.nearPaid && nearWindow2(-47 - (o.x + o.w - (o.inset || 5)), r.speed)) {
          near++;
          o.nearPaid = true;
        }
        settleLanding2(e, p, landed, { late, near });
        nearLandings += near;
        lateTakeoffs += late;
        lateTarget = null;
      }
      if (obs.every((o) => o.x + o.w < -180) && !p.airborne) {
        if (timingMargin > 0 && (!validateRoute2(obstacles, { flight, pace, economy, time, charges: [charge], leads: [lead - timingMargin], burns: [burn] }) || !validateRoute2(obstacles, { flight, pace, economy, time, charges: [charge], leads: [lead + timingMargin], burns: [burn] }))) break;
        return { charge, lead, burn, actions, nearLandings, lateTakeoffs, duration: elapsed, fuelUsed: flight.fuel - p.fuel, exit: { y: 0, angle: 0, vx: p.vx }, clearanceVerified: true, timingMargin };
      }
    }
  }
  return null;
}

// supabase/rulesets/roadster-v380/director.js
function createDirector2({ S, flight, pace, economy, spawnDistance, sceneTime = () => S.t, random: random3 = Math.random, relative = false }) {
  const state = { wave: 0, last: null, fallbacks: 0, waiting: false, hardStreak: 0 };
  function reset() {
    Object.assign(state, { wave: 0, last: null, fallbacks: 0, waiting: false, hardStreak: 0 });
  }
  function spawn() {
    if (flight.airborne || pace.recovery || pace.falling || S.obs.some((o) => !o.passed)) {
      S.next = 0.18;
      state.waiting = true;
      return;
    }
    state.waiting = false;
    const stage = stageAt2(pace.progress), breath = state.wave % 5 === 4 || state.hardStreak >= 2;
    const pools = [["single"], ["single"], ["pair", "single"], ["hover", "incoming", "pair"], ["precision", "incoming", "pair"], ["mixed", "precision", "thrust"], ["mixed", "precision", "thrust", "incoming"]];
    let kind = breath ? "single" : pools[stage][Math.floor(random3() * pools[stage].length)];
    if (!breath && stage === 3 && pace.progress < 72) kind = "hover";
    const choices = OBSTACLES2.filter((o) => !o.altitude && (stage === 0 ? o.h <= 64 : stage < 2 ? o.h <= 94 : true));
    if (kind === "thrust" && flight.fuel < 65) kind = "pair";
    const type = choices[Math.floor(random3() * choices.length)], dx = spawnDistance();
    let obstacles = makePattern2(kind, { speed: S.speed, type, dx });
    let route = validateRoute2(obstacles, { flight, pace, economy, time: sceneTime(), timingMargin: GAMEPLAY2.routeTimingMargin });
    if (route && route.fuelUsed > 0 && flight.fuel - route.fuelUsed < GAMEPLAY2.routeFuelReserve) route = null;
    if (!route) {
      state.fallbacks++;
      kind = "single";
      obstacles = makePattern2(kind, { speed: S.speed, type: OBSTACLES2.find((o) => o.id === "truck"), dx });
      route = validateRoute2(obstacles, { flight, pace, economy, time: sceneTime(), timingMargin: GAMEPLAY2.routeTimingMargin });
    }
    if (!route) {
      S.next = 0.3;
      return;
    }
    state.hardStreak = ["precision", "mixed", "thrust"].includes(kind) ? state.hardStreak + 1 : 0;
    state.wave++;
    state.last = { kind, stage, route, startedAt: S.t };
    for (const o of obstacles) S.obs.push({ ...o, x: o.x + (relative ? 0 : S.anchor), uid: ++S.entityId, passed: false, nearPaid: false, latePaid: false });
    S.next = breath ? 2.3 : 1.2;
  }
  return { reset, spawn, state };
}

// supabase/rulesets/roadster-v380/random.js
function createRandom2(seed) {
  if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) throw Error("Invalid run seed");
  let state = seed;
  return { next() {
    state = state + 1831565813 >>> 0;
    let t = state;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }, get state() {
    return state;
  }, restore(value) {
    if (!Number.isInteger(value) || value < 0 || value > 4294967295) throw Error("Invalid random state");
    state = value;
  } };
}

// supabase/rulesets/roadster-v380/run.js
var RULESET2 = "roadster-v3.8.0";
var RUN_STEP2 = 1 / 120;
var RUN_COMMANDS2 = Object.freeze(["primary-down", "primary-up", "primary-cancel", "thrust-on", "thrust-off", "cancel"]);
var MAX_RECORDED_TICKS2 = 120 * 60 * 60;
var MAX_RECORDED_EVENTS2 = 24e3;
function createRun2({ seed = 0, record = true, reducedMotion = false } = {}) {
  const S = { mode: "menu", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY2.startSpeed, next: 1.7, obs: [], entityId: 0, anchor: 0 }, P = createFlight2(), E = createEconomy2(), pace = createPace2(), F = createFall2(), input = { charging: false, charge: 0, spin: false, thrust: false };
  let random3 = createRandom2(seed), events = [], log = [], lateId = null, lastLanding = null, recordable = true;
  const director = createDirector2({ S, flight: P, pace, economy: E, random: () => random3.next(), relative: true, sceneTime: () => S.t, spawnDistance: () => Math.max(900, S.speed * 1.5 + 180) });
  function clear() {
    Object.assign(input, { charging: false, charge: 0, spin: false, thrust: false });
    P.thrusting = false;
  }
  function sync() {
    S.t = S.tick * RUN_STEP2;
    S.speed = pace.speed;
    S.score = Math.floor(S.distance / 20 + E.bonus);
  }
  function reset(nextSeed = seed) {
    seed = nextSeed;
    random3 = createRandom2(seed);
    Object.assign(P, createFlight2());
    Object.assign(E, createEconomy2());
    Object.assign(pace, createPace2());
    Object.assign(F, createFall2());
    Object.assign(S, { mode: "playing", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY2.startSpeed, next: 1.7, obs: [], entityId: 0, lastCharge: 0 });
    clear();
    events = [];
    log = [];
    lateId = null;
    lastLanding = null;
    recordable = true;
    director.reset();
  }
  function jump() {
    if (S.mode !== "playing" || P.airborne || F.active || pace.stumble > 0) return false;
    lateId = null;
    for (const o of S.obs) {
      if (o.altitude || o.passed) continue;
      if (nearWindow2(o.x + (o.inset || 5) - 47, S.speed + (o.approachSpeed || 0))) {
        lateId = o.uid;
        break;
      }
    }
    const charge = input.charge;
    launch2(P, charge);
    S.lastCharge = charge;
    input.charging = false;
    input.charge = 0;
    input.spin = false;
    events.push({ type: "jump", charge });
    return true;
  }
  function command(action) {
    if (!RUN_COMMANDS2.includes(action)) throw Error("Unknown run command");
    if (S.mode !== "playing") return false;
    if (record && recordable) {
      if (log.length >= MAX_RECORDED_EVENTS2) recordable = false;
      else log.push([S.tick, RUN_COMMANDS2.indexOf(action)]);
    }
    if (action === "cancel") {
      clear();
      return true;
    }
    if (action === "primary-cancel") {
      input.spin = false;
      input.charging = false;
      input.charge = 0;
      return true;
    }
    if (action === "thrust-off") {
      input.thrust = false;
      return true;
    }
    if (action === "thrust-on") {
      if (!F.active) input.thrust = true;
      return true;
    }
    if (action === "primary-up") {
      if (input.charging) jump();
      input.spin = false;
      return true;
    }
    if (F.active) return hastenFall2(F);
    if (pace.stumble > 0) return false;
    if (P.airborne) {
      P.trickStarted = true;
      input.spin = true;
    } else {
      input.charging = true;
      input.charge = 0;
    }
    return true;
  }
  function step() {
    if (S.mode !== "playing") return { landed: null, impacts: 0 };
    S.tick++;
    if (S.tick > MAX_RECORDED_TICKS2) recordable = false;
    sync();
    if (input.charging) input.charge = Math.min(1, input.charge + RUN_STEP2 / GAMEPLAY2.chargeSeconds);
    advanceEconomy2(E, RUN_STEP2);
    advanceStreak2(E, RUN_STEP2);
    const physicsFall = () => fallPose2({ ...F, reduced: false }), wasFalling = F.active, before = { ...P, fallPose: F.active ? physicsFall() : null };
    let landed = null, fallStep = { impacts: 0, finished: false };
    if (wasFalling) {
      fallStep = advanceFall2(F, RUN_STEP2);
      if (fallStep.finished) {
        clear();
        S.next = Math.max(S.next, 0.8);
        events.push({ type: "recovered" });
      }
    } else landed = advanceFlight2(P, RUN_STEP2, { spin: input.spin, thrust: input.thrust });
    pace.falling = F.active;
    advancePace2(pace, E, P, RUN_STEP2);
    S.distance += pace.speed * RUN_STEP2;
    sync();
    const after = wasFalling ? { ...P, fallPose: physicsFall() } : landed ? { ...P, angle: landed.angle } : P;
    for (const o of S.obs) {
      const old = o.x;
      o.x -= (S.speed + (o.approachSpeed || 0)) * RUN_STEP2;
      if (sweptCollision2(before, after, o, old, o.x, S.t, RUN_STEP2)) {
        S.mode = "dead";
        clear();
        sync();
        events.push({ type: "death", obstacle: o });
        return { landed, impacts: fallStep.impacts };
      }
      if (!o.passed && o.x + o.w < -50) {
        o.passed = true;
        passObstacle2(E);
        if (o.altitude) events.push({ type: "air-passed" });
      }
    }
    if (landed) {
      let late = 0, near = 0;
      const target = S.obs.find((o) => o.uid === lateId);
      if (target && !target.latePaid && target.x + target.w - (target.inset || 5) < -47) {
        late = 1;
        target.latePaid = true;
      }
      for (const o of S.obs) {
        if (o.altitude || o.nearPaid) continue;
        if (nearWindow2(-47 - (o.x + o.w - (o.inset || 5)), S.speed)) {
          near++;
          o.nearPaid = true;
        }
      }
      const oldMultiplier = E.multiplier;
      lastLanding = settleLanding2(E, P, landed, { late, near });
      if (!landed.good) {
        stumble2(pace);
        beginFall2(F, landed, { reduced: reducedMotion, speed: pace.recovery.target });
        pace.falling = true;
        P.angle = 0;
        P.omega = 0;
        P.vx = 0;
        P.grab = 0;
        clear();
        advancePace2(pace, E, P, 0);
      }
      events.push({ type: "landing", landed, result: lastLanding, late, near, oldMultiplier });
      lateId = null;
    }
    if (!P.airborne && Math.abs(P.angle) > 1e-3) {
      P.angle *= Math.exp(-RUN_STEP2 * 18);
      P.omega = 0;
    }
    S.obs = S.obs.filter((o) => o.uid === lateId || o.x + o.w > (o.id === "joe" ? -480 : -400));
    S.next -= RUN_STEP2;
    if (S.next <= 0) director.spawn();
    sync();
    return { landed, impacts: fallStep.impacts };
  }
  function snapshot() {
    return structuredClone({ seed, S, P, E, pace, F, input, random: random3.state, director: director.state, lateId, lastLanding });
  }
  function restore(saved) {
    seed = saved.seed;
    for (const [a, b] of [[S, saved.S], [P, saved.P], [E, saved.E], [pace, saved.pace], [F, saved.F], [input, saved.input], [director.state, saved.director]]) Object.assign(a, structuredClone(b));
    random3 = createRandom2(seed);
    random3.restore(saved.random);
    lateId = saved.lateId;
    lastLanding = structuredClone(saved.lastLanding);
    events = [];
  }
  function replay() {
    return recordable ? { format: 1, ruleset: RULESET2, seed, ticks: S.tick, events: log.map((e) => [...e]) } : null;
  }
  return { S, P, E, pace, F, input, director, reset, jump, command, step, sync, snapshot, restore, replay, drainEvents() {
    const next = events;
    events = [];
    return next;
  }, get lastLanding() {
    return lastLanding;
  }, get seed() {
    return seed;
  }, get recordable() {
    return recordable;
  } };
}
function validateReplay2(value) {
  if (!value || value.format !== 1 || value.ruleset !== RULESET2 || !Number.isInteger(value.seed) || value.seed < 0 || value.seed > 4294967295 || !Number.isInteger(value.ticks) || value.ticks < 1 || value.ticks > MAX_RECORDED_TICKS2 || !Array.isArray(value.events) || value.events.length > MAX_RECORDED_EVENTS2) throw Error("Invalid or unsupported replay");
  let previous = -1;
  for (const event of value.events) {
    if (!Array.isArray(event) || event.length !== 2 || !Number.isInteger(event[0]) || event[0] < previous || event[0] < 0 || event[0] >= value.ticks || !Number.isInteger(event[1]) || event[1] < 0 || event[1] >= RUN_COMMANDS2.length) throw Error("Invalid replay input");
    previous = event[0];
  }
  return value;
}
function verifyReplay2(value) {
  const replay = validateReplay2(value), run = createRun2({ seed: replay.seed, record: false });
  run.reset();
  let event = 0;
  while (run.S.tick < replay.ticks && run.S.mode === "playing") {
    while (event < replay.events.length && replay.events[event][0] === run.S.tick) run.command(RUN_COMMANDS2[replay.events[event++][1]]);
    run.step();
    run.drainEvents();
  }
  if (run.S.mode !== "dead" || run.S.tick !== replay.ticks || event !== replay.events.length) throw Error("Replay does not end at its first collision");
  return { score: run.S.score, flips: run.E.flips, ticks: run.S.tick };
}

// supabase/rulesets/roadster-v400/run.js
var run_exports3 = {};
__export(run_exports3, {
  RULESET: () => RULESET3,
  RUN_COMMANDS: () => RUN_COMMANDS3,
  RUN_STEP: () => RUN_STEP3,
  createRun: () => createRun3,
  validateReplay: () => validateReplay3,
  verifyReplay: () => verifyReplay3
});

// supabase/rulesets/roadster-v400/gameplay-config.js?v=4.0.0
var GAMEPLAY3 = Object.freeze({
  version: "4.0.0",
  gravity: 1550,
  jumpSpeed: 560,
  chargedSpeed: 440,
  chargeSeconds: 0.4,
  spinSpeed: 7.2,
  spinAcceleration: 60,
  releaseSpeed: 1.8,
  releaseDeceleration: 24,
  landingAngle: Math.PI * 2 / 9,
  landingOmega: Math.PI * 4 / 3,
  perfectAngle: Math.PI / 18,
  perfectPoints: 50,
  thrustAcceleration: 2100,
  horizontalDrag: 1.8,
  maxHorizontal: 260,
  tank: 100,
  initialFuel: 50,
  fuelPerSecond: 80,
  fuelPerFlip: 25,
  attachSeconds: 0.12,
  obstaclePoints: 50,
  flipFactor: 50,
  nearPoints: 25,
  nearSeconds: 0.12,
  maxMultiplier: 50,
  multiplierStep: 1,
  comboDuration: 8,
  comboFalloff: 1.2,
  comboDecaySeconds: 0.5,
  streakStep: 0.05,
  maxStreak: 0.25,
  streakHold: 4,
  streakDecay: 0.1,
  fallSeconds: 2.8,
  fallSpeedSeconds: 0.65,
  fallMaxRate: 1.6,
  fallTapRate: 0.15,
  routeTimingMargin: 0.035,
  routeFuelReserve: 20,
  stumbleSeconds: 0.3,
  recoveryRatio: 0.55,
  recoveryMin: 1.2,
  recoveryExtra: 2.8,
  startSpeed: 360,
  maxSpeed: 660,
  rampSeconds: 150,
  stages: Object.freeze([0, 15, 35, 60, 90, 120, 150]),
  bestKey: "roadster-best-v3",
  tutorialKey: "roadster-coach-v3"
});

// supabase/rulesets/roadster-v400/enemy-sprite-data.js
var ENEMY_SPRITES = Object.freeze({ "sikorsky": { "file": "assets/encounters/v400/sikorsky.png", "w": 176, "h": 89.146, "pixels": [768, 389], "sourcePixels": [1536, 1024], "sourceCrop": [13, 146, 1520, 909], "alphaExtrema": [0, 255], "sha256": "5619dd383d0bbb6ed7115f767f21f1e86e720d2aeb9ce3f0f41a182f15da3520" }, "xi": { "file": "assets/encounters/v400/xi.png", "w": 72, "h": 109.281, "pixels": [506, 768], "sourcePixels": [1024, 1536], "sourceCrop": [51, 65, 978, 1471], "alphaExtrema": [0, 255], "sha256": "56f56642f4f29a2b3c6655a442be59d4df5f781327c20299fa9ff596f69c6ac0" }, "t800": { "file": "assets/encounters/v400/t800.png", "w": 57, "h": 109.44, "pixels": [400, 768], "sourcePixels": [1024, 1536], "sourceCrop": [183, 66, 925, 1489], "alphaExtrema": [0, 255], "sha256": "1661f9bf004a65db0c178ca6d7b17e42d9963299f627f450016e9443125495f8" }, "ufo": { "file": "assets/encounters/v400/ufo.png", "w": 104, "h": 47.26, "pixels": [768, 349], "sourcePixels": [1672, 940], "sourceCrop": [141, 130, 1535, 763], "alphaExtrema": [0, 255], "sha256": "926e3e760155afe3acbc9215b35465a78e3a49039762c7ff89f8bf1c1e8ec358" }, "primeDrone": { "file": "assets/encounters/v400/primeDrone.png", "w": 110, "h": 48.984, "pixels": [768, 342], "sourcePixels": [1821, 864], "sourceCrop": [10, 31, 1812, 833], "alphaExtrema": [0, 255], "sha256": "a46783dc00dd76be690c29c72f92fa834a02b2522aac366058cc2972822ab681" }, "twitterBird": { "file": "assets/encounters/v400/twitterBird.png", "w": 76, "h": 50.568, "pixels": [768, 511], "sourcePixels": [1536, 1024], "sourceCrop": [85, 50, 1460, 964], "alphaExtrema": [0, 255], "sha256": "46436e2c78ac2ac104426b8bc898f047cb8ee934a9b1a5dd08631a554f5ee94e" }, "homelessRow": { "file": "assets/encounters/v400/homelessRow.png", "w": 142, "h": 40.122, "pixels": [768, 217], "sourcePixels": [2073, 758], "sourceCrop": [79, 124, 2012, 670], "alphaExtrema": [0, 255], "sha256": "03ed702ddb2d5cd06d2c6174b8e88edce01a22adbae68570d268de367ea49806" }, "bydSeal": { "file": "assets/encounters/v400/bydSeal.png", "w": 138, "h": 44.562, "pixels": [768, 248], "sourcePixels": [2172, 724], "sourceCrop": [144, 74, 2061, 693], "alphaExtrema": [0, 255], "sha256": "840376084d808030f6900dbad884a825703c1dd7736fc147db457098759d8b69" }, "xiaomiSu7": { "file": "assets/encounters/v400/xiaomiSu7.png", "w": 138, "h": 42.047, "pixels": [768, 234], "sourcePixels": [1903, 826], "sourceCrop": [26, 190, 1877, 753], "alphaExtrema": [0, 255], "sha256": "3187a0f29bc97d4a73a1186cc1fbd60785ac6beea61dc55a10d7d70184e20bab" }, "batteryAgv": { "file": "assets/encounters/v400/batteryAgv.png", "w": 118, "h": 41.177, "pixels": [768, 268], "sourcePixels": [2012, 782], "sourceCrop": [131, 113, 1878, 722], "alphaExtrema": [0, 255], "sha256": "82d12e8efdb89038ea0351b7dc942754be9ab9f78aed29a88b2c4a12a8cc6d79" }, "qualitySkull": { "file": "assets/encounters/v400/qualitySkull.png", "w": 76, "h": 40.87, "pixels": [768, 413], "sourcePixels": [1536, 1024], "sourceCrop": [183, 152, 1413, 814], "alphaExtrema": [0, 255], "sha256": "955bb780f34142f0f9302839283022730bfd1c7688c48c46ac59cc18ad994d4b" }, "starlink": { "file": "assets/encounters/v400/starlink.png", "w": 112, "h": 69.271, "pixels": [768, 475], "sourcePixels": [1559, 1009], "sourceCrop": [76, 97, 1491, 973], "alphaExtrema": [0, 255], "sha256": "3988083ecbf0294a0c50b44df0bd8283347a56d5d9ffabe36ff6aa3a281d9e08" }, "regulatorDrone": { "file": "assets/encounters/v400/regulatorDrone.png", "w": 106, "h": 47.065, "pixels": [768, 341], "sourcePixels": [1536, 1024], "sourceCrop": [15, 176, 1521, 845], "alphaExtrema": [0, 255], "sha256": "99140365f63c6e6af46fafbfd90380459ae5e0a4e5709dfc371ebd1c3a5cf830" }, "reptileHead": { "file": "assets/encounters/v400/reptileHead.png", "w": 68, "h": 79.416, "pixels": [274, 320], "sourcePixels": [1173, 1341], "sourceCrop": [121, 97, 1077, 1212], "alphaExtrema": [0, 255], "sha256": "dc627f44d9efbaae3b93c44c5377ce25b518751b691071cf11a26f3670bcfa49" }, "moltenVat": { "file": "assets/encounters/v400/moltenVat.png", "w": 164, "h": 134.745, "pixels": [768, 631], "sourcePixels": [1351, 1164], "sourceCrop": [54, 71, 1298, 1093], "alphaExtrema": [0, 255], "sha256": "f7fe4d31e0588da095c2647e5548d3b8bebdd67aa9cbdcfe6e619963bd1198ca" } });

// supabase/rulesets/roadster-v400/content.js?v=4.0.0
function freeze3(value) {
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) freeze3(item);
    Object.freeze(value);
  }
  return value;
}
var BIOMES3 = freeze3(["spaceport", "tesla-factory"]);
var BIOME_CYCLE3 = freeze3(["spaceport", "tesla-factory"]);
var ANIMATIONS3 = freeze3(["taunt", "angry-look", "point-and-laugh", "trampoline-bounce", "money-guns", "podcast", "throw", "lightning", "reptile", "look"]);
var ASSETS3 = freeze3({
  ...Object.fromEntries(Object.entries(ENEMY_SPRITES).map(([id2, s]) => ["encounter_" + id2, { file: s.file }])),
  collage: { file: "collage-atlas.png" },
  extras: { file: "collage-extras.png" },
  cast: { file: "paper-cast.png" },
  photos: { file: "obstacle-photos.png" },
  joe: { file: "assets/characters/joe-rogan.png" },
  amber: { file: "assets/characters/amber-head-v247.png" },
  drone: { file: "assets/obstacles/phantom-v3.png" }
});
var none3 = { enabled: false };
var reaction3 = (animationId, trigger = "near", range = 300, space = "target") => ({ enabled: true, animationId, trigger, range, space });
function define3(base, options = {}) {
  return freeze3({
    ...base,
    definitionVersion: 1,
    category: options.category || "object",
    placement: base.altitude ? "air" : "ground",
    anchor: base.altitude ? "air-bottom-center" : "ground-center",
    biomes: options.biomes || "all",
    visual: { renderer: options.renderer || "prop", key: options.key || base.id, assets: options.assets || [], bob: options.bob || false },
    collision: options.collision || "box",
    reactions: { hero: options.hero || none3, obstacle: options.obstacle || none3 },
    collectible: true,
    provenance: "assets-provenance.json"
  });
}
function spriteDefinition(id2, name2, options, altitude = 0) {
  const s = ENEMY_SPRITES[
    /** @type {keyof typeof ENEMY_SPRITES} */
    id2
  ];
  return define3({ id: id2, name: name2, w: s.w, h: s.h, inset: id2 === "t800" ? 10 : 5, ...altitude ? { altitude } : {} }, { ...options, renderer: "sprite", assets: ["encounter_" + id2] });
}
var OBSTACLES3 = freeze3([
  define3({ id: "v8", name: "V8 \u2022 VERY LOUD", w: 108, h: 36 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define3({ id: "trump", name: "TARIFF MAN", w: 54, h: 94 }, { renderer: "character", assets: ["collage"], category: "person", bob: true, hero: reaction3("taunt"), obstacle: reaction3("angry-look") }),
  define3({ id: "protest", name: "COUCH CRITICS", w: 102, h: 94 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "group" }),
  define3({ id: "truck", name: "CYBERBRICK", w: 110, h: 41 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define3({ id: "doge", name: "MUCH WOW", w: 52, h: 64 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "animal" }),
  define3({ id: "pump", name: "BIG OIL", w: 54, h: 78 }, {}),
  define3({ id: "zuck", name: "ZUCK", w: 62, h: 94, inset: 5 }, { renderer: "character", assets: ["cast"], category: "person", hero: reaction3("money-guns", "airborne-near"), obstacle: reaction3("money-guns", "airborne-near") }),
  define3({ id: "openai", name: "OPENAI", w: 70, h: 68, inset: 5 }, { category: "emblem" }),
  define3({ id: "claude", name: "CLAUDE", w: 84, h: 73, inset: 6 }, { category: "emblem" }),
  define3({ id: "gemini", name: "GEMINI", w: 58, h: 78, inset: 4 }, { category: "emblem" }),
  define3({ id: "rogozin", name: "ROGOZIN / TRAMPOLINE", w: 88, h: 130, inset: 4 }, { renderer: "character", assets: ["cast"], category: "person", biomes: ["spaceport"], collision: "trampoline", hero: reaction3("point-and-laugh", "airborne-near"), obstacle: reaction3("trampoline-bounce", "passage") }),
  define3({ id: "amber", name: "AMBER HEARD", w: 58, h: 94, inset: 9 }, { renderer: "character", assets: ["amber"], category: "person", obstacle: reaction3("throw", "passage") }),
  define3({ id: "joe", name: "JOE ROGAN", w: 76, h: 94, inset: 10 }, { renderer: "character", assets: ["joe"], category: "person", hero: reaction3("podcast", "passage", 650, "self"), obstacle: reaction3("podcast", "passage", 650, "self") }),
  define3({ id: "muscleCoupe", name: "AMERICAN MUSCLE", w: 138, h: 45, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define3({ id: "muscleCompact", name: "SMALL BLOCK / BIG EGO", w: 112, h: 38, inset: 5 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define3({ id: "pickup", name: "BIG TRUCK ENERGY", w: 140, h: 57, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  ...[
    ["homelessRow", "SPARE CHANGE", "group", "all"],
    ["t800", "T-800 / AUTOMATION", "person", ["tesla-factory"]],
    ["bydSeal", "BYD SEAL", "vehicle", ["tesla-factory"]],
    ["xiaomiSu7", "XIAOMI SU7", "vehicle", ["tesla-factory"]],
    ["batteryAgv", "BATTERY SWAP", "vehicle", ["tesla-factory"]]
  ].map(([id2, name2, category, biomes]) => spriteDefinition(String(id2), String(name2), { category: String(category), biomes: Array.isArray(biomes) ? biomes : "all" })),
  ...[
    ["ufo", "UNIDENTIFIED FLYING OPPORTUNITY", "all"],
    ["primeDrone", "PRIME PERSONAL SPACE", "all"],
    ["twitterBird", "THE FORMER BIRD", ["spaceport"]],
    ["starlink", "STARLINK / WRONG ORBIT", ["spaceport"]],
    ["regulatorDrone", "APPROVAL PENDING", "all"],
    ["sikorsky", "SIKORSKY / VS-300", ["spaceport"]],
    ["qualitySkull", "QUALITY CONTROL", ["tesla-factory"]]
  ].map(([id2, name2, biomes]) => spriteDefinition(String(id2), String(name2), { category: "flyby", biomes: Array.isArray(biomes) ? biomes : "all", collision: "none", hero: reaction3(id2 === "ufo" ? "reptile" : "look", "near", 320) }, 240)),
  spriteDefinition("xi", "COMRADE XI", { category: "person", biomes: ["tesla-factory"], collision: "none", hero: reaction3("lightning", "near", 380), obstacle: reaction3("lightning", "near", 380) })
]);
var PROP_TYPES3 = freeze3(OBSTACLES3.filter((o) => ["muscleCoupe", "muscleCompact", "pickup"].includes(o.id)));
var AIR_TYPES3 = freeze3(OBSTACLES3.filter((o) => o.placement === "air"));
var definitionsById3 = new Map(OBSTACLES3.map((o) => [o.id, o]));
var obstacleDefinition3 = (id2) => definitionsById3.get(id2);
function validateContent3(definitions = OBSTACLES3) {
  const errors = [], ids = /* @__PURE__ */ new Set();
  for (const o of definitions) {
    if (!o.id || ids.has(o.id)) errors.push(`duplicate or missing id: ${o.id}`);
    ids.add(o.id);
    if (!Number.isFinite(o.w) || !Number.isFinite(o.h) || o.w <= 0 || o.h <= 6) errors.push(`${o.id}: invalid size`);
    if (!["ground", "air"].includes(o.placement)) errors.push(`${o.id}: invalid placement`);
    if (o.placement === "air" && (!Number.isFinite(o.altitude) || !(Number(o.altitude) > 0))) errors.push(`${o.id}: invalid altitude`);
    if (o.placement === "ground" && o.altitude) errors.push(`${o.id}: ground altitude`);
    if (!["ground-center", "air-bottom-center"].includes(o.anchor)) errors.push(`${o.id}: invalid anchor`);
    if (o.biomes !== "all" && (!Array.isArray(o.biomes) || !o.biomes.length || o.biomes.some((b) => !BIOMES3.includes(b)))) errors.push(`${o.id}: unknown biome`);
    if (!o.visual || !["photo", "cutout", "character", "prop", "drone", "sprite"].includes(o.visual.renderer)) errors.push(`${o.id}: missing renderer`);
    for (const id2 of o.visual?.assets || []) if (!Object.hasOwn(ASSETS3, id2)) errors.push(`${o.id}: unknown asset ${id2}`);
    if (!["box", "trampoline", "none"].includes(o.collision)) errors.push(`${o.id}: missing collision profile`);
    if (o.inset !== void 0 && (!Number.isFinite(o.inset) || o.inset < 0 || o.inset * 2 >= o.w)) errors.push(`${o.id}: invalid inset`);
    for (
      const direction of
      /** @type {const} */
      ["hero", "obstacle"]
    ) {
      const r = o.reactions?.[direction];
      if (!r || typeof r.enabled !== "boolean") errors.push(`${o.id}: missing ${direction} reaction`);
      else if (r.enabled && (!ANIMATIONS3.includes(r.animationId) || !["near", "airborne-near", "passage"].includes(r.trigger) || !(r.range > 0) || !["target", "self"].includes(r.space))) errors.push(`${o.id}: missing animation ${r.animationId}`);
    }
  }
  return errors;
}
var contentErrors3 = validateContent3();
if (contentErrors3.length) throw new Error(`Invalid content: ${contentErrors3.join("; ")}`);

// supabase/rulesets/roadster-v400/physics.js?v=4.0.0
var STEP3 = 1 / 120;
function rogozinBounce3(time) {
  return 20 * Math.abs(Math.sin(time * 4.5));
}
function obstacleBoxes3(o, time = 0) {
  if ((o.collision || obstacleDefinition3(o.id)?.collision) === "trampoline") {
    return [
      { left: 6, right: o.w - 6, top: 16 },
      { left: o.w / 2 - 18, right: o.w / 2 + 18, top: 108 + rogozinBounce3(time) }
    ];
  }
  const inset = o.inset ?? 5;
  return [{ left: inset, right: o.w - inset, top: o.h - 6 }];
}

// supabase/rulesets/roadster-v400/fall.js?v=4.0.0
var clamp5 = (x) => Math.max(0, Math.min(1, x));
var ease3 = (x) => {
  x = clamp5(x);
  return x * x * (3 - 2 * x);
};
var mix3 = (a, b, t) => a + (b - a) * t;
var FALL_CONTACTS3 = Object.freeze([0.14, 0.36, 0.56]);
var FALL_CAR_CONTACTS3 = Object.freeze([0.16, 0.38]);
var FALL_CAR_HULL3 = Object.freeze([[-49, -7], [-8, -15], [8, -15], [48.5, 0], [47, 6], [27, 12], [-34, 12], [-46, 5]].map(Object.freeze));
function fallCarSupport3(angle) {
  return Math.max(...FALL_CAR_HULL3.map(([x, y]) => x * Math.sin(angle) + y * Math.cos(angle)));
}
var arc3 = (p, a, b, height) => {
  const t = clamp5((p - a) / (b - a));
  return t < 1e-12 || t > 1 - 1e-12 ? 0 : height * 4 * t * (1 - t);
};
var pulse3 = (p, hit) => ease3((p - hit + 0.035) / 0.035) * (1 - ease3((p - hit) / 0.055));
function track3(keys, p) {
  let i = 1;
  while (i < keys.length - 1 && p > keys[i][0]) i++;
  const [a, b] = [keys[i - 1], keys[i]];
  return mix3(a[1], b[1], ease3((p - a[0]) / (b[0] - a[0])));
}
function createFall3() {
  return { active: false, age: 0, duration: GAMEPLAY3.fallSeconds, rate: 1, taps: 0, angle: 0, reduced: false };
}
function beginFall3(f, result, { reduced = false, speed = GAMEPLAY3.startSpeed } = {}) {
  const angle = Math.atan2(Math.sin(result.angle), Math.cos(result.angle));
  const severity = clamp5((speed - GAMEPLAY3.startSpeed) / (GAMEPLAY3.maxSpeed - GAMEPLAY3.startSpeed));
  Object.assign(f, { active: true, age: 0, duration: GAMEPLAY3.fallSeconds + GAMEPLAY3.fallSpeedSeconds * severity, rate: 1, taps: 0, angle, reduced });
}
function hastenFall3(f) {
  if (!f.active) return false;
  f.taps++;
  f.rate = Math.min(GAMEPLAY3.fallMaxRate, f.rate + GAMEPLAY3.fallTapRate);
  return true;
}
function advanceFall3(f, dt) {
  if (!f.active) return { impacts: 0, finished: false };
  const previous = f.age;
  f.age = Math.min(f.duration, f.age + dt * f.rate);
  const impacts = FALL_CONTACTS3.filter((t) => previous < f.duration * t && f.age >= f.duration * t).length;
  f.active = f.age < f.duration;
  return { impacts, finished: !f.active };
}
function fallPose3(f) {
  const p = clamp5(f.age / f.duration), sit = ease3(p / 0.14), stand = ease3((p - 0.68) / 0.16), gather = ease3((p - 0.7) / 0.22), settle = clamp5((p - 0.97) / 0.03);
  const impact = Math.max(...FALL_CONTACTS3.map((hit) => pulse3(p, hit))), seat = sit * (1 - stand);
  const crouch = (0.72 + 0.18 * impact) * seat + (settle === 1 ? 0 : 0.1 * Math.sin(settle * Math.PI));
  const lift = p < 0.36 ? arc3(p, 0.14, 0.36, 32) : p < 0.56 ? arc3(p, 0.36, 0.56, 28) : arc3(p, 0.56, 0.97, 112);
  const angle = mix3(f.angle, -0.64, sit) * (1 - stand);
  const seatAnchor = -11 * Math.sin(angle) + (22.5 + 27 * crouch) * Math.cos(angle) + 9;
  const rider = { x: 34 * sit * (1 - gather), y: mix3(95, seatAnchor, seat) + lift, angle, seat, crouch, lift };
  const entry = (y) => ({ x: Math.sin(f.angle) * (y - 65), y: 65 + Math.cos(f.angle) * (y - 65) });
  const e = entry(95), c = entry(12);
  rider.x += e.x * (1 - sit);
  rider.y += (e.y - 95) * (1 - sit);
  const carAngle = track3([[0, f.angle], [0.16, 0.95], [0.29, Math.PI], [0.38, 2 * Math.PI - 1.02], [0.54, 2 * Math.PI], [1, 2 * Math.PI]], p);
  const carHop = p < 0.16 ? arc3(p, 0, 0.16, 20) : p < 0.38 ? arc3(p, 0.16, 0.38, 22) : arc3(p, 0.38, 0.54, 8);
  const car = { x: gather === 1 ? 0 : mix3(c.x, -88, ease3(p / 0.16)) * (1 - gather), y: p >= 0.54 ? 12 : mix3(c.y, fallCarSupport3(carAngle) + carHop, ease3(p / 0.06)), angle: carAngle, phase: 0 };
  let shake = 0;
  for (const hit of FALL_CONTACTS3) if (p >= hit) shake = Math.max(shake, Math.exp(-(p - hit) * 40));
  const pose = { car, rider, crouch, impact, flail: sit * (1 - ease3((p - 0.82) / 0.12)), push: 0, shake: shake * 2.4, progress: p };
  if (f.reduced) {
    pose.car = { x: 0, y: 12, angle: 0, phase: 0 };
    pose.rider = { x: 0, y: 95, angle: 0, seat: 0, crouch };
    pose.shake = 0;
    pose.push = 0;
    pose.flail = 0;
  }
  return pose;
}
function fallPolygons3(pose) {
  const seat = pose.rider.seat || 0, crouch = pose.rider.crouch || 0;
  const rider = [[-23, -70 + 4 * seat], [23 + 48 * seat, -70 + 4 * seat], [23 + 48 * seat, 68 - 27 * crouch], [-23, 68 - 27 * crouch]];
  return [[pose.car, FALL_CAR_HULL3.map(([x, y]) => [x, -y])], [pose.rider, rider]].map(([body2, vertices]) => {
    const c = Math.cos(body2.angle), s = Math.sin(body2.angle);
    return vertices.map(([x, y]) => ({ x: body2.x + c * x + s * y, y: body2.y - s * x + c * y }));
  });
}
function interpolateFall3(a, b, t) {
  const pose = {};
  for (const part of ["car", "rider"]) {
    pose[part] = {};
    for (const k of ["x", "y", "angle", "seat", "crouch", "phase"]) pose[part][k] = mix3(a[part][k] || 0, b[part][k] || 0, t);
  }
  return pose;
}

// supabase/rulesets/roadster-v400/gameplay.js?v=4.0.0
var TAU3 = Math.PI * 2;
var clamp6 = (x, a, b) => Math.max(a, Math.min(b, x));
var approach3 = (x, target, amount) => x < target ? Math.min(target, x + amount) : Math.max(target, x - amount);
function uprightError3(angle, direction = -1) {
  let e = ((angle + Math.PI) % TAU3 + TAU3) % TAU3 - Math.PI;
  if (Math.abs(Math.abs(e) - Math.PI) < 1e-9) e = -Math.sign(direction || -1) * Math.PI;
  return e;
}
function createFlight3(fuel = GAMEPLAY3.initialFuel) {
  return { y: 0, vy: 0, vx: 0, angle: 0, omega: 0, airborne: false, time: 0, fuel, thrusting: false, latched: false, attach: 0, maxTurn: 0, turns: 0, lastDirection: -1, trickStarted: false, grab: 0, launchVelocity: 0 };
}
function launch3(p, charge = 0) {
  if (p.airborne) return false;
  Object.assign(p, { y: 1e-3, vy: GAMEPLAY3.jumpSpeed + GAMEPLAY3.chargedSpeed * clamp6(charge, 0, 1), angle: 0, omega: 0, airborne: true, time: 0, latched: false, attach: 0, maxTurn: 0, turns: 0, trickStarted: false, grab: 0, launchVelocity: GAMEPLAY3.jumpSpeed + GAMEPLAY3.chargedSpeed * clamp6(charge, 0, 1) });
  return true;
}
function advanceFlight3(p, dt, { spin = false, thrust = false } = {}) {
  p.thrusting = false;
  const gripTarget = p.airborne && spin ? 1 : 0;
  p.grab = approach3(p.grab, gripTarget, dt / (gripTarget ? 0.12 : 0.18));
  if (!p.airborne) {
    p.vx *= Math.exp(-GAMEPLAY3.horizontalDrag * dt);
    return null;
  }
  p.time += dt;
  if (spin) {
    p.trickStarted = true;
    p.lastDirection = -1;
    p.omega = approach3(p.omega, -GAMEPLAY3.spinSpeed, GAMEPLAY3.spinAcceleration * dt);
  } else {
    const target = Math.sign(p.omega) * Math.min(Math.abs(p.omega), GAMEPLAY3.releaseSpeed);
    p.omega = approach3(p.omega, target, GAMEPLAY3.releaseDeceleration * dt);
  }
  p.angle += p.omega * dt;
  p.maxTurn = Math.max(p.maxTurn, -p.angle);
  p.turns = Math.floor((p.maxTurn + 1e-7) / TAU3);
  const burn = thrust ? Math.min(dt, p.fuel / GAMEPLAY3.fuelPerSecond) : 0;
  if (burn > 0) {
    p.fuel = Math.max(0, p.fuel - burn * GAMEPLAY3.fuelPerSecond);
    p.thrusting = true;
    p.latched = true;
    p.vx += Math.sin(p.angle) * GAMEPLAY3.thrustAcceleration * burn;
    p.vy += Math.cos(p.angle) * GAMEPLAY3.thrustAcceleration * burn;
  }
  if (p.latched) p.attach = Math.min(1, p.attach + dt / GAMEPLAY3.attachSeconds);
  p.vx = clamp6(p.vx * Math.exp(-GAMEPLAY3.horizontalDrag * dt), -GAMEPLAY3.maxHorizontal, GAMEPLAY3.maxHorizontal);
  p.y += p.vy * dt - 0.5 * GAMEPLAY3.gravity * dt * dt;
  p.vy -= GAMEPLAY3.gravity * dt;
  if (p.y > 0) return null;
  const good = Math.abs(uprightError3(p.angle)) <= GAMEPLAY3.landingAngle + 1e-9 && Math.abs(p.omega) <= GAMEPLAY3.landingOmega;
  const turns = good ? Math.max(p.turns, Math.round(-p.angle / TAU3)) : p.turns;
  const perfect = good && Math.abs(uprightError3(p.angle)) <= GAMEPLAY3.perfectAngle + 1e-9;
  const result = { good, perfect, turns, impact: Math.abs(p.vy), angle: p.angle, omega: p.omega };
  p.turns = turns;
  p.y = 0;
  p.vy = 0;
  p.airborne = false;
  p.thrusting = false;
  if (result.good) {
    p.angle = 0;
    p.omega = 0;
  }
  return result;
}
function createEconomy3() {
  return { bonus: 0, multiplier: 10, meter: 0, decay: 0, streak: 0, streakLeft: 0, flips: 0 };
}
function comboSeconds3(e) {
  return GAMEPLAY3.comboDuration - GAMEPLAY3.comboFalloff * (e.multiplier / 10 - 1);
}
function rewardAction3(e, count = 1) {
  e.multiplier = Math.min(GAMEPLAY3.maxMultiplier, e.multiplier + count * GAMEPLAY3.multiplierStep);
  e.meter = 1;
  e.decay = 0;
}
function advanceEconomy3(e, dt) {
  if (e.meter > 0) {
    const used = Math.min(dt, e.meter * comboSeconds3(e));
    e.meter = Math.max(0, e.meter - used / comboSeconds3(e));
    dt -= used;
  }
  if (e.meter === 0 && e.multiplier > 10) {
    e.decay += dt;
    while (e.decay + 1e-9 >= GAMEPLAY3.comboDecaySeconds && e.multiplier > 10) {
      e.multiplier--;
      e.decay -= GAMEPLAY3.comboDecaySeconds;
    }
  }
}
function advanceStreak3(e, dt) {
  const used = Math.min(dt, e.streakLeft);
  e.streakLeft -= used;
  e.streak = Math.max(0, e.streak - (dt - used) * GAMEPLAY3.streakDecay);
}
function passObstacle3(e) {
  const points = GAMEPLAY3.obstaclePoints * e.multiplier / 10;
  e.bonus += points;
  return points;
}
function settleLanding3(e, p, result, { late = 0, near = 0 } = {}) {
  if (!result.good) {
    e.multiplier = 10;
    e.meter = 0;
    e.decay = 0;
    e.streak = 0;
    e.streakLeft = 0;
    return { points: 0, turns: 0, late: 0, near: 0, perfect: false, good: false };
  }
  const n = result.turns, perfect = !!result.perfect, points = (GAMEPLAY3.flipFactor * n * (n + 1) + GAMEPLAY3.nearPoints * (late + near) + GAMEPLAY3.perfectPoints * Number(perfect)) * e.multiplier / 10;
  e.bonus += points;
  e.flips += n;
  p.fuel = Math.min(GAMEPLAY3.tank, p.fuel + GAMEPLAY3.fuelPerFlip * n);
  if (n + late + near + Number(perfect)) rewardAction3(e, n + late + near + Number(perfect));
  if (n || near) {
    e.streak = Math.min(GAMEPLAY3.maxStreak, e.streak + GAMEPLAY3.streakStep);
    e.streakLeft = GAMEPLAY3.streakHold;
  }
  return { points, turns: n, late, near, perfect, good: true };
}
function createPace3() {
  return { progress: 0, base: GAMEPLAY3.startSpeed, speed: GAMEPLAY3.startSpeed, recovery: null, stumble: 0, falling: false };
}
function stumble3(pace) {
  const target = pace.recovery?.target ?? pace.base, r = clamp6((target - GAMEPLAY3.startSpeed) / (GAMEPLAY3.maxSpeed - GAMEPLAY3.startSpeed), 0, 1);
  pace.recovery = { target, age: 0, duration: GAMEPLAY3.recoveryMin + GAMEPLAY3.recoveryExtra * r ** 1.5 };
  pace.stumble = GAMEPLAY3.stumbleSeconds;
  pace.base = target * GAMEPLAY3.recoveryRatio;
}
function recoverySpeed3(r, t) {
  const T = r.duration, d = r.target * (1 - GAMEPLAY3.recoveryRatio), v0 = r.target * GAMEPLAY3.recoveryRatio, h = 0.15, a = T - h;
  if (t <= a) return v0 + d * (t / T) ** 2;
  const u = clamp6((t - a) / h, 0, 1), start = v0 + d * (a / T) ** 2, slope = 2 * d * a / T ** 2, endSlope = r.target >= GAMEPLAY3.maxSpeed ? 0 : (GAMEPLAY3.maxSpeed - GAMEPLAY3.startSpeed) / GAMEPLAY3.rampSeconds;
  return (2 * u ** 3 - 3 * u * u + 1) * start + (u ** 3 - 2 * u * u + u) * h * slope + (-2 * u ** 3 + 3 * u * u) * r.target + (u ** 3 - u * u) * h * endSlope;
}
function advancePace3(pace, e, p, dt) {
  if (pace.recovery) {
    pace.stumble = Math.max(0, pace.stumble - dt);
    const r = pace.recovery;
    r.age = Math.min(r.duration, r.age + dt);
    pace.base = recoverySpeed3(r, r.age);
    if (r.age >= r.duration) {
      pace.base = r.target;
      pace.recovery = null;
    }
  } else if (!pace.falling) {
    pace.progress += dt;
    pace.base = GAMEPLAY3.startSpeed + (GAMEPLAY3.maxSpeed - GAMEPLAY3.startSpeed) * Math.min(1, pace.progress / GAMEPLAY3.rampSeconds);
  }
  pace.speed = Math.max(60, pace.base * (1 + e.streak) + p.vx);
  return pace.speed;
}
function playerPolygons3(p) {
  if (p.fallPose) return fallPolygons3(p.fallPose);
  const c = Math.cos(p.angle), s = Math.sin(p.angle);
  return [[-47, 0, 47, 25], [-23, 25, 23, 163 - 32 * (p.grab || 0)]].map(([l, b, r, t]) => [[l, b], [r, b], [r, t], [l, t]].map(([x, y]) => ({ x: c * x + s * (y - 65), y: p.y + 65 - s * x + c * (y - 65) })));
}
function overlaps3(poly, rect) {
  const axes = [{ x: 1, y: 0 }, { x: 0, y: 1 }];
  for (let i = 0; i < (poly.length === 4 ? 2 : poly.length); i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    axes.push({ x: -(b.y - a.y), y: b.x - a.x });
  }
  for (const a of axes) {
    let pmin = Infinity, pmax = -Infinity, rmin = Infinity, rmax = -Infinity;
    for (const p of poly) {
      const value = p.x * a.x + p.y * a.y;
      pmin = Math.min(pmin, value);
      pmax = Math.max(pmax, value);
    }
    for (const p of rect) {
      const value = p.x * a.x + p.y * a.y;
      rmin = Math.min(rmin, value);
      rmax = Math.max(rmax, value);
    }
    if (pmax <= rmin || rmax <= pmin) return false;
  }
  return true;
}
function collisionAt3(p, o, dx, time = 0) {
  if (o.collision === "none") return false;
  if (dx > 180 || dx + o.w < -180) return false;
  const polygons = playerPolygons3(p);
  return obstacleBoxes3(o, time).some((b) => {
    const bottom = o.altitude || 0, top = bottom + b.top;
    const rect = [{ x: dx + b.left, y: bottom }, { x: dx + b.right, y: bottom }, { x: dx + b.right, y: top }, { x: dx + b.left, y: top }];
    return polygons.some((poly) => overlaps3(poly, rect));
  });
}
function sweptCollision3(before, after, o, dxBefore, dxAfter, time, dt) {
  if (Math.min(dxBefore, dxAfter) > 180 || Math.max(dxBefore, dxAfter) + o.w < -180) return false;
  const fallTravel = before.fallPose && after.fallPose ? Math.max(...["rider", "car"].map((part) => Math.abs(after.fallPose[part].angle - before.fallPose[part].angle) * (part === "car" ? 55 : 170) + Math.abs(after.fallPose[part].y - before.fallPose[part].y) + Math.abs(after.fallPose[part].x - before.fallPose[part].x))) : 0;
  const n = Math.max(1, Math.ceil((Math.abs(dxAfter - dxBefore) + Math.abs(after.y - before.y) + Math.abs(after.angle - before.angle) * 170 + fallTravel) / 4));
  for (let i = 0; i <= n; i++) {
    const f = i / n, p = { y: before.y + (after.y - before.y) * f, angle: before.angle + (after.angle - before.angle) * f, grab: (before.grab || 0) + ((after.grab || 0) - (before.grab || 0)) * f };
    if (before.fallPose && after.fallPose) p.fallPose = interpolateFall3(before.fallPose, after.fallPose, f);
    if (collisionAt3(p, o, dxBefore + (dxAfter - dxBefore) * f, time - dt + dt * f)) return true;
  }
  return false;
}
function nearWindow3(distance, speed) {
  return distance >= 0 && distance <= Math.max(0, speed) * GAMEPLAY3.nearSeconds + 1e-8;
}

// supabase/rulesets/roadster-v400/biomes.js?v=4.0.0
var BIOME_SCORE_STEP = 7e3;
var SCENERY_CYCLE = BIOME_CYCLE3;
function biomeAt(score = 0) {
  const points = Number.isFinite(score) ? Math.max(0, score) : 0;
  const leg = Math.floor(points / BIOME_SCORE_STEP), nextAt = (leg + 1) * BIOME_SCORE_STEP;
  return { id: SCENERY_CYCLE[leg % SCENERY_CYCLE.length], leg, nextAt, nextIn: nextAt - points };
}

// supabase/rulesets/roadster-v400/routes.js?v=4.0.0
var STAGES3 = GAMEPLAY3.stages;
function stageAt3(progress) {
  return STAGES3.filter((t) => progress >= t).length - 1;
}
function makePattern3(kind, { speed = 360, type = { id: "truck", w: 110, h: 41 }, dx = 900 } = {}) {
  const item = (o, offset = 0) => ({ ...o, x: dx + offset, passed: false });
  if (kind === "hover" || kind === "incoming") return [item(type)];
  if (kind === "precision") {
    const span = Math.min(200, Math.max(110, speed * 0.4 - 94)), cars = [], n = Math.min(2, Math.ceil(span / 110)), width = (span - 20 * (n - 1)) / n;
    for (let i = 0; i < n; i++) cars.push(item({ id: "truck", name: "CYBERBRICK", w: width, h: 41 * width / 110, inset: 4 }, i * (width + 20)));
    cars.push(item({ id: "truck", name: "CYBERBRICK", w: 110, h: 41, inset: 5 }, speed * 1.15));
    return cars;
  }
  if (kind === "mixed") return [item(type), item(type.h <= 57 ? type : { id: "truck", name: "CYBERBRICK", w: 110, h: 41, inset: 5 }, speed * 1.65)];
  if (kind === "thrust") {
    const n = Math.min(6, Math.max(4, Math.ceil(speed * 1.65 / 165)));
    return Array.from({ length: n }, (_, i) => item({ id: "truck", name: "CYBERBRICK", w: 110, h: 41, inset: 5 }, i * 165));
  }
  if (kind === "pair") return [item(type), item(type, speed * 1.5)];
  return [item(type)];
}
function validateRoute3(obstacles, { flight = createFlight3(), pace = createPace3(), economy = createEconomy3(), time = 0, allowThrust = true, burns = null, timingMargin = 0, leads = [0.1, 0.11, 0.115, 0.12, 0.125, 0.14, 0.16, 0.2, 0.3, 0.4, 0.5, 0.65], charges = [0, 0.5, 1] } = {}) {
  if (flight.airborne || pace.stumble > 0) return null;
  for (const charge of charges) for (const lead of leads) for (const burn of burns ?? (allowThrust && flight.fuel > 0 ? [0, 0.35, 0.65, 1.1] : [0])) {
    const p = { ...flight }, r = structuredClone(pace), e = { ...economy }, obs = obstacles.map((o) => ({ ...o })), actions = [];
    let charging = false, held = 0, elapsed = 0, lateTarget = null, lastThrust = false, nearLandings = 0, lateTakeoffs = 0;
    const dt = 1 / 120;
    for (let tick = 0; tick < 1440; tick++) {
      elapsed = tick * dt;
      const next = obs.find((o) => o.x + o.w > -47 && (!o.altitude || o.altitude < 163));
      if (!p.airborne && next) {
        const ttc = (next.x + (next.inset || 5) - 47) / Math.max(1, r.speed + (next.approachSpeed || 0));
        if (!charging && ttc <= lead + charge * GAMEPLAY3.chargeSeconds) {
          charging = true;
          held = 0;
          actions.push({ at: elapsed, action: "hold" });
        }
        if (charging) {
          held += dt;
          if (held + 1e-9 >= charge * GAMEPLAY3.chargeSeconds + (charge > 0 ? dt : 0)) {
            lateTarget = nearWindow3(next.x + (next.inset || 5) - 47, r.speed + (next.approachSpeed || 0)) ? next : null;
            launch3(p, charge);
            charging = false;
            actions.push({ at: elapsed, action: "jump", charge });
          }
        }
      }
      const before = { ...p }, useThrust = p.airborne && p.time >= 0.18 && p.time < 0.18 + burn;
      if (useThrust !== lastThrust) {
        actions.push({ at: elapsed, action: useThrust ? "thrust-on" : "thrust-off" });
        lastThrust = useThrust;
      }
      const landed = advanceFlight3(p, dt, { thrust: useThrust });
      advanceEconomy3(e, dt);
      advanceStreak3(e, dt);
      advancePace3(r, e, p, dt);
      const after = landed ? { ...p, angle: landed.angle } : p;
      let alive = true;
      for (const o of obs) {
        const old = o.x;
        o.x -= (r.speed + (o.approachSpeed || 0)) * dt;
        if (sweptCollision3(before, after, o, old, o.x, time + elapsed, dt)) {
          alive = false;
          break;
        }
        if (!o.passed && o.x + o.w < -50) {
          o.passed = true;
          passObstacle3(e);
        }
      }
      if (!alive || landed && !landed.good) break;
      if (landed) {
        let near = 0;
        const late = lateTarget && lateTarget.x + lateTarget.w - (lateTarget.inset || 5) < -47 ? 1 : 0;
        for (const o of obs) if (!o.altitude && !o.nearPaid && nearWindow3(-47 - (o.x + o.w - (o.inset || 5)), r.speed)) {
          near++;
          o.nearPaid = true;
        }
        settleLanding3(e, p, landed, { late, near });
        nearLandings += near;
        lateTakeoffs += late;
        lateTarget = null;
      }
      if (obs.every((o) => o.x + o.w < -180) && !p.airborne) {
        if (timingMargin > 0 && (!validateRoute3(obstacles, { flight, pace, economy, time, charges: [charge], leads: [lead - timingMargin], burns: [burn] }) || !validateRoute3(obstacles, { flight, pace, economy, time, charges: [charge], leads: [lead + timingMargin], burns: [burn] }))) break;
        return { charge, lead, burn, actions, nearLandings, lateTakeoffs, duration: elapsed, fuelUsed: flight.fuel - p.fuel, exit: { y: 0, angle: 0, vx: p.vx }, clearanceVerified: true, timingMargin };
      }
    }
  }
  return null;
}

// supabase/rulesets/roadster-v400/director.js?v=4.0.0
function createDirector3({ S, flight, pace, economy, spawnDistance, sceneTime = () => S.t, random: random3 = Math.random, relative = false }) {
  const state = { wave: 0, last: null, fallbacks: 0, waiting: false, hardStreak: 0 };
  function reset() {
    Object.assign(state, { wave: 0, last: null, fallbacks: 0, waiting: false, hardStreak: 0 });
  }
  function spawn() {
    if (flight.airborne || pace.recovery || pace.falling || S.obs.some((o) => !o.passed)) {
      S.next = 0.18;
      state.waiting = true;
      return;
    }
    state.waiting = false;
    const stage = stageAt3(pace.progress), breath = state.wave % 5 === 4 || state.hardStreak >= 2;
    const pools = [["single"], ["single"], ["pair", "single"], ["single", "pair"], ["precision", "single", "pair"], ["pair", "precision", "thrust"], ["pair", "precision", "thrust"]];
    let kind = breath ? "single" : pools[stage][Math.floor(random3() * pools[stage].length)];
    const biome = biomeAt(S.score || 0).id;
    const factoryIds = ["truck", "t800", "bydSeal", "xiaomiSu7", "batteryAgv"];
    const choices = OBSTACLES3.filter((o) => !o.altitude && o.collision !== "none" && (o.biomes === "all" || o.biomes.includes(biome)) && (biome !== "tesla-factory" || factoryIds.includes(o.id)) && (stage === 0 ? o.h <= 64 : stage < 2 ? o.h <= 94 : true));
    if (kind === "thrust" && flight.fuel < 65) kind = "pair";
    const type = choices[Math.floor(random3() * choices.length)], dx = spawnDistance();
    let obstacles = makePattern3(kind, { speed: S.speed, type, dx });
    let route = validateRoute3(obstacles, { flight, pace, economy, time: sceneTime(), timingMargin: GAMEPLAY3.routeTimingMargin });
    if (route && route.fuelUsed > 0 && flight.fuel - route.fuelUsed < GAMEPLAY3.routeFuelReserve) route = null;
    if (!route) {
      state.fallbacks++;
      kind = "single";
      obstacles = makePattern3(kind, { speed: S.speed, type: OBSTACLES3.find((o) => o.id === "truck"), dx });
      route = validateRoute3(obstacles, { flight, pace, economy, time: sceneTime(), timingMargin: GAMEPLAY3.routeTimingMargin });
    }
    if (!route) {
      S.next = 0.3;
      return;
    }
    state.hardStreak = ["precision", "mixed", "thrust"].includes(kind) ? state.hardStreak + 1 : 0;
    state.wave++;
    state.last = { kind, stage, biome, route, startedAt: S.t };
    for (const o of obstacles) S.obs.push({ ...o, x: o.x + (relative ? 0 : S.anchor), uid: ++S.entityId, passed: false, nearPaid: false, latePaid: false });
    S.next = breath ? 2.3 : 1.2;
  }
  return { reset, spawn, state };
}

// supabase/rulesets/roadster-v400/random.js?v=4.0.0
function createRandom3(seed) {
  if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) throw Error("Invalid run seed");
  let state = seed;
  return { next() {
    state = state + 1831565813 >>> 0;
    let t = state;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }, get state() {
    return state;
  }, restore(value) {
    if (!Number.isInteger(value) || value < 0 || value > 4294967295) throw Error("Invalid random state");
    state = value;
  } };
}

// supabase/rulesets/roadster-v400/run.js
var RULESET3 = "roadster-v4.0.0";
var RUN_STEP3 = 1 / 120;
var RUN_COMMANDS3 = Object.freeze(["primary-down", "primary-up", "primary-cancel", "thrust-on", "thrust-off", "cancel"]);
var MAX_RECORDED_TICKS3 = 120 * 60 * 60;
var MAX_RECORDED_EVENTS3 = 24e3;
function createRun3({ seed = 0, record = true, reducedMotion = false } = {}) {
  const S = { mode: "menu", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY3.startSpeed, next: 1.7, obs: [], entityId: 0, anchor: 0 }, P = createFlight3(), E = createEconomy3(), pace = createPace3(), F = createFall3(), input = { charging: false, charge: 0, spin: false, thrust: false };
  let random3 = createRandom3(seed), events = [], log = [], lateId = null, lastLanding = null, recordable = true;
  const director = createDirector3({ S, flight: P, pace, economy: E, random: () => random3.next(), relative: true, sceneTime: () => S.t, spawnDistance: () => Math.max(900, S.speed * 1.5 + 180) });
  function clear() {
    Object.assign(input, { charging: false, charge: 0, spin: false, thrust: false });
    P.thrusting = false;
  }
  function sync() {
    S.t = S.tick * RUN_STEP3;
    S.speed = pace.speed;
    S.score = Math.floor(S.distance / 20 + E.bonus);
  }
  function reset(nextSeed = seed) {
    seed = nextSeed;
    random3 = createRandom3(seed);
    Object.assign(P, createFlight3());
    Object.assign(E, createEconomy3());
    Object.assign(pace, createPace3());
    Object.assign(F, createFall3());
    Object.assign(S, { mode: "playing", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY3.startSpeed, next: 1.7, obs: [], entityId: 0, lastCharge: 0 });
    clear();
    events = [];
    log = [];
    lateId = null;
    lastLanding = null;
    recordable = true;
    director.reset();
  }
  function jump() {
    if (S.mode !== "playing" || P.airborne || F.active || pace.stumble > 0) return false;
    lateId = null;
    for (const o of S.obs) {
      if (o.altitude || o.passed) continue;
      if (nearWindow3(o.x + (o.inset || 5) - 47, S.speed + (o.approachSpeed || 0))) {
        lateId = o.uid;
        break;
      }
    }
    const charge = input.charge;
    launch3(P, charge);
    S.lastCharge = charge;
    input.charging = false;
    input.charge = 0;
    input.spin = false;
    events.push({ type: "jump", charge });
    return true;
  }
  function command(action) {
    if (!RUN_COMMANDS3.includes(action)) throw Error("Unknown run command");
    if (S.mode !== "playing") return false;
    if (record && recordable) {
      if (log.length >= MAX_RECORDED_EVENTS3) recordable = false;
      else log.push([S.tick, RUN_COMMANDS3.indexOf(action)]);
    }
    if (action === "cancel") {
      clear();
      return true;
    }
    if (action === "primary-cancel") {
      input.spin = false;
      input.charging = false;
      input.charge = 0;
      return true;
    }
    if (action === "thrust-off") {
      input.thrust = false;
      return true;
    }
    if (action === "thrust-on") {
      if (!F.active) input.thrust = true;
      return true;
    }
    if (action === "primary-up") {
      if (input.charging) jump();
      input.spin = false;
      return true;
    }
    if (F.active) return hastenFall3(F);
    if (pace.stumble > 0) return false;
    if (P.airborne) {
      P.trickStarted = true;
      input.spin = true;
    } else {
      input.charging = true;
      input.charge = 0;
    }
    return true;
  }
  function step() {
    if (S.mode !== "playing") return { landed: null, impacts: 0 };
    S.tick++;
    if (S.tick > MAX_RECORDED_TICKS3) recordable = false;
    sync();
    if (input.charging) input.charge = Math.min(1, input.charge + RUN_STEP3 / GAMEPLAY3.chargeSeconds);
    advanceEconomy3(E, RUN_STEP3);
    advanceStreak3(E, RUN_STEP3);
    const physicsFall = () => fallPose3({ ...F, reduced: false }), wasFalling = F.active, before = { ...P, fallPose: F.active ? physicsFall() : null };
    let landed = null, fallStep = { impacts: 0, finished: false };
    if (wasFalling) {
      fallStep = advanceFall3(F, RUN_STEP3);
      if (fallStep.finished) {
        clear();
        S.next = Math.max(S.next, 0.8);
        events.push({ type: "recovered" });
      }
    } else landed = advanceFlight3(P, RUN_STEP3, { spin: input.spin, thrust: input.thrust });
    pace.falling = F.active;
    advancePace3(pace, E, P, RUN_STEP3);
    S.distance += pace.speed * RUN_STEP3;
    sync();
    const after = wasFalling ? { ...P, fallPose: physicsFall() } : landed ? { ...P, angle: landed.angle } : P;
    for (const o of S.obs) {
      const old = o.x;
      o.x -= (S.speed + (o.approachSpeed || 0)) * RUN_STEP3;
      if (sweptCollision3(before, after, o, old, o.x, S.t, RUN_STEP3)) {
        S.mode = "dead";
        clear();
        sync();
        events.push({ type: "death", obstacle: o });
        return { landed, impacts: fallStep.impacts };
      }
      if (!o.passed && o.x + o.w < -50) {
        o.passed = true;
        passObstacle3(E);
        if (o.altitude) events.push({ type: "air-passed" });
      }
    }
    if (landed) {
      let late = 0, near = 0;
      const target = S.obs.find((o) => o.uid === lateId);
      if (target && !target.latePaid && target.x + target.w - (target.inset || 5) < -47) {
        late = 1;
        target.latePaid = true;
      }
      for (const o of S.obs) {
        if (o.altitude || o.nearPaid) continue;
        if (nearWindow3(-47 - (o.x + o.w - (o.inset || 5)), S.speed)) {
          near++;
          o.nearPaid = true;
        }
      }
      const oldMultiplier = E.multiplier;
      lastLanding = settleLanding3(E, P, landed, { late, near });
      if (!landed.good) {
        stumble3(pace);
        beginFall3(F, landed, { reduced: reducedMotion, speed: pace.recovery.target });
        pace.falling = true;
        P.angle = 0;
        P.omega = 0;
        P.vx = 0;
        P.grab = 0;
        clear();
        advancePace3(pace, E, P, 0);
      }
      events.push({ type: "landing", landed, result: lastLanding, late, near, oldMultiplier });
      lateId = null;
    }
    if (!P.airborne && Math.abs(P.angle) > 1e-3) {
      P.angle *= Math.exp(-RUN_STEP3 * 18);
      P.omega = 0;
    }
    S.obs = S.obs.filter((o) => o.uid === lateId || o.x + o.w > (o.id === "joe" ? -480 : -400));
    S.next -= RUN_STEP3;
    if (S.next <= 0) director.spawn();
    sync();
    return { landed, impacts: fallStep.impacts };
  }
  function snapshot() {
    return structuredClone({ seed, S, P, E, pace, F, input, random: random3.state, director: director.state, lateId, lastLanding });
  }
  function restore(saved) {
    seed = saved.seed;
    for (const [a, b] of [[S, saved.S], [P, saved.P], [E, saved.E], [pace, saved.pace], [F, saved.F], [input, saved.input], [director.state, saved.director]]) Object.assign(a, structuredClone(b));
    random3 = createRandom3(seed);
    random3.restore(saved.random);
    lateId = saved.lateId;
    lastLanding = structuredClone(saved.lastLanding);
    events = [];
  }
  function replay() {
    return recordable ? { format: 1, ruleset: RULESET3, seed, ticks: S.tick, events: log.map((e) => [...e]) } : null;
  }
  return { S, P, E, pace, F, input, director, reset, jump, command, step, sync, snapshot, restore, replay, drainEvents() {
    const next = events;
    events = [];
    return next;
  }, get lastLanding() {
    return lastLanding;
  }, get seed() {
    return seed;
  }, get recordable() {
    return recordable;
  } };
}
function validateReplay3(value) {
  if (!value || value.format !== 1 || value.ruleset !== RULESET3 || !Number.isInteger(value.seed) || value.seed < 0 || value.seed > 4294967295 || !Number.isInteger(value.ticks) || value.ticks < 1 || value.ticks > MAX_RECORDED_TICKS3 || !Array.isArray(value.events) || value.events.length > MAX_RECORDED_EVENTS3) throw Error("Invalid or unsupported replay");
  let previous = -1;
  for (const event of value.events) {
    if (!Array.isArray(event) || event.length !== 2 || !Number.isInteger(event[0]) || event[0] < previous || event[0] < 0 || event[0] >= value.ticks || !Number.isInteger(event[1]) || event[1] < 0 || event[1] >= RUN_COMMANDS3.length) throw Error("Invalid replay input");
    previous = event[0];
  }
  return value;
}
function verifyReplay3(value) {
  const replay = validateReplay3(value), run = createRun3({ seed: replay.seed, record: false });
  run.reset();
  let event = 0;
  while (run.S.tick < replay.ticks && run.S.mode === "playing") {
    while (event < replay.events.length && replay.events[event][0] === run.S.tick) run.command(RUN_COMMANDS3[replay.events[event++][1]]);
    run.step();
    run.drainEvents();
  }
  if (run.S.mode !== "dead" || run.S.tick !== replay.ticks || event !== replay.events.length) throw Error("Replay does not end at its first collision");
  return { score: run.S.score, flips: run.E.flips, ticks: run.S.tick };
}

// supabase/rulesets/roadster-v410/run.js
var run_exports4 = {};
__export(run_exports4, {
  RULESET: () => RULESET4,
  RUN_COMMANDS: () => RUN_COMMANDS4,
  RUN_STEP: () => RUN_STEP4,
  createRun: () => createRun4,
  validateReplay: () => validateReplay4,
  verifyReplay: () => verifyReplay4
});

// supabase/rulesets/roadster-v410/gameplay-config.js?v=4.1.0
var GAMEPLAY4 = Object.freeze({
  version: "4.1.0",
  gravity: 1550,
  jumpSpeed: 560,
  chargedSpeed: 440,
  chargeSeconds: 0.4,
  spinSpeed: 7.2,
  spinAcceleration: 60,
  releaseSpeed: 1.8,
  releaseDeceleration: 24,
  landingAngle: Math.PI * 2 / 9,
  landingOmega: Math.PI * 4 / 3,
  perfectAngle: Math.PI / 18,
  perfectPoints: 50,
  thrustAcceleration: 2100,
  horizontalDrag: 1.8,
  maxHorizontal: 260,
  tank: 100,
  initialFuel: 50,
  fuelPerSecond: 80,
  fuelPerFlip: 25,
  attachSeconds: 0.12,
  obstaclePoints: 50,
  flipFactor: 50,
  nearPoints: 25,
  nearSeconds: 0.12,
  maxMultiplier: 50,
  multiplierStep: 1,
  comboDuration: 8,
  comboFalloff: 1.2,
  comboDecaySeconds: 0.5,
  streakStep: 0.05,
  maxStreak: 0.25,
  streakHold: 4,
  streakDecay: 0.1,
  fallSeconds: 2.8,
  fallSpeedSeconds: 0.65,
  fallMaxRate: 1.6,
  fallTapRate: 0.15,
  routeTimingMargin: 0.035,
  routeFuelReserve: 20,
  stumbleSeconds: 0.3,
  recoveryRatio: 0.55,
  recoveryMin: 1.2,
  recoveryExtra: 2.8,
  startSpeed: 360,
  maxSpeed: 660,
  rampSeconds: 150,
  stages: Object.freeze([0, 15, 35, 60, 90, 120, 150]),
  bestKey: "roadster-best-v3",
  tutorialKey: "roadster-coach-v3"
});

// supabase/rulesets/roadster-v410/enemy-sprite-data.js
var ENEMY_SPRITES2 = Object.freeze({ "sikorsky": { "file": "assets/encounters/v400/sikorsky.png", "w": 176, "h": 89.146, "pixels": [768, 389], "sourcePixels": [1536, 1024], "sourceCrop": [13, 146, 1520, 909], "alphaExtrema": [0, 255], "sha256": "5619dd383d0bbb6ed7115f767f21f1e86e720d2aeb9ce3f0f41a182f15da3520" }, "xi": { "file": "assets/encounters/v400/xi.png", "w": 72, "h": 109.281, "pixels": [506, 768], "sourcePixels": [1024, 1536], "sourceCrop": [51, 65, 978, 1471], "alphaExtrema": [0, 255], "sha256": "56f56642f4f29a2b3c6655a442be59d4df5f781327c20299fa9ff596f69c6ac0" }, "t800": { "file": "assets/encounters/v400/t800.png", "w": 57, "h": 109.44, "pixels": [400, 768], "sourcePixels": [1024, 1536], "sourceCrop": [183, 66, 925, 1489], "alphaExtrema": [0, 255], "sha256": "1661f9bf004a65db0c178ca6d7b17e42d9963299f627f450016e9443125495f8" }, "ufo": { "file": "assets/encounters/v400/ufo.png", "w": 104, "h": 47.26, "pixels": [768, 349], "sourcePixels": [1672, 940], "sourceCrop": [141, 130, 1535, 763], "alphaExtrema": [0, 255], "sha256": "926e3e760155afe3acbc9215b35465a78e3a49039762c7ff89f8bf1c1e8ec358" }, "primeDrone": { "file": "assets/encounters/v400/primeDrone.png", "w": 110, "h": 48.984, "pixels": [768, 342], "sourcePixels": [1821, 864], "sourceCrop": [10, 31, 1812, 833], "alphaExtrema": [0, 255], "sha256": "a46783dc00dd76be690c29c72f92fa834a02b2522aac366058cc2972822ab681" }, "twitterBird": { "file": "assets/encounters/v400/twitterBird.png", "w": 76, "h": 50.568, "pixels": [768, 511], "sourcePixels": [1536, 1024], "sourceCrop": [85, 50, 1460, 964], "alphaExtrema": [0, 255], "sha256": "46436e2c78ac2ac104426b8bc898f047cb8ee934a9b1a5dd08631a554f5ee94e" }, "homelessRow": { "file": "assets/encounters/v400/homelessRow.png", "w": 142, "h": 40.122, "pixels": [768, 217], "sourcePixels": [2073, 758], "sourceCrop": [79, 124, 2012, 670], "alphaExtrema": [0, 255], "sha256": "03ed702ddb2d5cd06d2c6174b8e88edce01a22adbae68570d268de367ea49806" }, "bydSeal": { "file": "assets/encounters/v400/bydSeal.png", "w": 138, "h": 44.562, "pixels": [768, 248], "sourcePixels": [2172, 724], "sourceCrop": [144, 74, 2061, 693], "alphaExtrema": [0, 255], "sha256": "840376084d808030f6900dbad884a825703c1dd7736fc147db457098759d8b69" }, "xiaomiSu7": { "file": "assets/encounters/v400/xiaomiSu7.png", "w": 138, "h": 42.047, "pixels": [768, 234], "sourcePixels": [1903, 826], "sourceCrop": [26, 190, 1877, 753], "alphaExtrema": [0, 255], "sha256": "3187a0f29bc97d4a73a1186cc1fbd60785ac6beea61dc55a10d7d70184e20bab" }, "batteryAgv": { "file": "assets/encounters/v400/batteryAgv.png", "w": 118, "h": 41.177, "pixels": [768, 268], "sourcePixels": [2012, 782], "sourceCrop": [131, 113, 1878, 722], "alphaExtrema": [0, 255], "sha256": "82d12e8efdb89038ea0351b7dc942754be9ab9f78aed29a88b2c4a12a8cc6d79" }, "qualitySkull": { "file": "assets/encounters/v400/qualitySkull.png", "w": 76, "h": 40.87, "pixels": [768, 413], "sourcePixels": [1536, 1024], "sourceCrop": [183, 152, 1413, 814], "alphaExtrema": [0, 255], "sha256": "955bb780f34142f0f9302839283022730bfd1c7688c48c46ac59cc18ad994d4b" }, "starlink": { "file": "assets/encounters/v400/starlink.png", "w": 112, "h": 69.271, "pixels": [768, 475], "sourcePixels": [1559, 1009], "sourceCrop": [76, 97, 1491, 973], "alphaExtrema": [0, 255], "sha256": "3988083ecbf0294a0c50b44df0bd8283347a56d5d9ffabe36ff6aa3a281d9e08" }, "regulatorDrone": { "file": "assets/encounters/v400/regulatorDrone.png", "w": 106, "h": 47.065, "pixels": [768, 341], "sourcePixels": [1536, 1024], "sourceCrop": [15, 176, 1521, 845], "alphaExtrema": [0, 255], "sha256": "99140365f63c6e6af46fafbfd90380459ae5e0a4e5709dfc371ebd1c3a5cf830" }, "reptileHead": { "file": "assets/encounters/v400/reptileHead.png", "w": 68, "h": 79.416, "pixels": [274, 320], "sourcePixels": [1173, 1341], "sourceCrop": [121, 97, 1077, 1212], "alphaExtrema": [0, 255], "sha256": "dc627f44d9efbaae3b93c44c5377ce25b518751b691071cf11a26f3670bcfa49" }, "moltenVat": { "file": "assets/encounters/v400/moltenVat.png", "w": 164, "h": 134.745, "pixels": [768, 631], "sourcePixels": [1351, 1164], "sourceCrop": [54, 71, 1298, 1093], "alphaExtrema": [0, 255], "sha256": "f7fe4d31e0588da095c2647e5548d3b8bebdd67aa9cbdcfe6e619963bd1198ca" } });

// supabase/rulesets/roadster-v410/content.js?v=4.1.0
function freeze4(value) {
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) freeze4(item);
    Object.freeze(value);
  }
  return value;
}
var BIOMES4 = freeze4(["spaceport", "tesla-factory"]);
var BIOME_CYCLE4 = freeze4(["spaceport", "tesla-factory"]);
var ANIMATIONS4 = freeze4(["taunt", "angry-look", "point-and-laugh", "trampoline-bounce", "money-guns", "podcast", "throw", "lightning", "reptile", "look"]);
var ASSETS4 = freeze4({
  ...Object.fromEntries(Object.entries(ENEMY_SPRITES2).map(([id2, s]) => ["encounter_" + id2, { file: s.file }])),
  collage: { file: "collage-atlas.png" },
  extras: { file: "collage-extras.png" },
  cast: { file: "paper-cast.png" },
  photos: { file: "obstacle-photos.png" },
  joe: { file: "assets/characters/joe-rogan.png" },
  amber: { file: "assets/characters/amber-head-v247.png" },
  drone: { file: "assets/obstacles/phantom-v3.png" }
});
var none4 = { enabled: false };
var reaction4 = (animationId, trigger = "near", range = 300, space = "target") => ({ enabled: true, animationId, trigger, range, space });
function define4(base, options = {}) {
  return freeze4({
    ...base,
    definitionVersion: 1,
    category: options.category || "object",
    placement: base.altitude ? "air" : "ground",
    anchor: base.altitude ? "air-bottom-center" : "ground-center",
    biomes: options.biomes || "all",
    visual: { renderer: options.renderer || "prop", key: options.key || base.id, assets: options.assets || [], bob: options.bob || false },
    collision: options.collision || "box",
    reactions: { hero: options.hero || none4, obstacle: options.obstacle || none4 },
    collectible: true,
    provenance: "assets-provenance.json"
  });
}
function spriteDefinition2(id2, name2, options, altitude = 0) {
  const s = ENEMY_SPRITES2[
    /** @type {keyof typeof ENEMY_SPRITES} */
    id2
  ];
  return define4({ id: id2, name: name2, w: s.w, h: s.h, inset: id2 === "t800" ? 10 : 5, ...altitude ? { altitude } : {} }, { ...options, renderer: "sprite", assets: ["encounter_" + id2] });
}
var OBSTACLES4 = freeze4([
  define4({ id: "v8", name: "V8 \u2022 VERY LOUD", w: 108, h: 36 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define4({ id: "trump", name: "TARIFF MAN", w: 54, h: 94 }, { renderer: "character", assets: ["collage"], category: "person", bob: true, hero: reaction4("taunt"), obstacle: reaction4("angry-look") }),
  define4({ id: "protest", name: "COUCH CRITICS", w: 102, h: 94 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "group" }),
  define4({ id: "truck", name: "CYBERBRICK", w: 110, h: 41 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define4({ id: "doge", name: "MUCH WOW", w: 52, h: 64 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "animal" }),
  define4({ id: "pump", name: "BIG OIL", w: 54, h: 78 }, {}),
  define4({ id: "zuck", name: "ZUCK", w: 62, h: 94, inset: 5 }, { renderer: "character", assets: ["cast"], category: "person", hero: reaction4("money-guns", "airborne-near"), obstacle: reaction4("money-guns", "airborne-near") }),
  define4({ id: "openai", name: "OPENAI", w: 70, h: 68, inset: 5 }, { category: "emblem" }),
  define4({ id: "claude", name: "CLAUDE", w: 84, h: 73, inset: 6 }, { category: "emblem" }),
  define4({ id: "gemini", name: "GEMINI", w: 58, h: 78, inset: 4 }, { category: "emblem" }),
  define4({ id: "rogozin", name: "ROGOZIN / TRAMPOLINE", w: 88, h: 130, inset: 4 }, { renderer: "character", assets: ["cast"], category: "person", biomes: ["spaceport"], collision: "trampoline", hero: reaction4("point-and-laugh", "airborne-near"), obstacle: reaction4("trampoline-bounce", "passage") }),
  define4({ id: "amber", name: "AMBER HEARD", w: 58, h: 94, inset: 9 }, { renderer: "character", assets: ["amber"], category: "person", obstacle: reaction4("throw", "passage") }),
  define4({ id: "joe", name: "JOE ROGAN", w: 76, h: 94, inset: 10 }, { renderer: "character", assets: ["joe"], category: "person", hero: reaction4("podcast", "passage", 650, "self"), obstacle: reaction4("podcast", "passage", 650, "self") }),
  define4({ id: "muscleCoupe", name: "AMERICAN MUSCLE", w: 138, h: 45, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define4({ id: "muscleCompact", name: "SMALL BLOCK / BIG EGO", w: 112, h: 38, inset: 5 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define4({ id: "pickup", name: "BIG TRUCK ENERGY", w: 140, h: 57, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  ...[
    ["homelessRow", "SPARE CHANGE", "group", "all"],
    ["t800", "T-800 / AUTOMATION", "person", ["tesla-factory"]],
    ["bydSeal", "BYD SEAL", "vehicle", ["tesla-factory"]],
    ["xiaomiSu7", "XIAOMI SU7", "vehicle", ["tesla-factory"]],
    ["batteryAgv", "BATTERY SWAP", "vehicle", ["tesla-factory"]]
  ].map(([id2, name2, category, biomes]) => spriteDefinition2(String(id2), String(name2), { category: String(category), biomes: Array.isArray(biomes) ? biomes : "all" })),
  ...[
    ["ufo", "UNIDENTIFIED FLYING OPPORTUNITY", "all"],
    ["primeDrone", "PRIME PERSONAL SPACE", "all"],
    ["twitterBird", "THE FORMER BIRD", ["spaceport"]],
    ["starlink", "STARLINK / WRONG ORBIT", ["spaceport"]],
    ["regulatorDrone", "APPROVAL PENDING", "all"],
    ["sikorsky", "SIKORSKY / VS-300", ["spaceport"]],
    ["qualitySkull", "QUALITY CONTROL", ["tesla-factory"]]
  ].map(([id2, name2, biomes]) => spriteDefinition2(String(id2), String(name2), { category: "flying enemy", biomes: Array.isArray(biomes) ? biomes : "all", collision: "box", hero: reaction4(id2 === "ufo" ? "reptile" : "look", "near", 320) }, 32)),
  spriteDefinition2("xi", "COMRADE XI", { category: "person", biomes: ["tesla-factory"], collision: "box", hero: reaction4("lightning", "near", 380), obstacle: reaction4("lightning", "near", 380) })
]);
var PROP_TYPES4 = freeze4(OBSTACLES4.filter((o) => ["muscleCoupe", "muscleCompact", "pickup"].includes(o.id)));
var AIR_TYPES4 = freeze4(OBSTACLES4.filter((o) => o.placement === "air"));
var definitionsById4 = new Map(OBSTACLES4.map((o) => [o.id, o]));
var obstacleDefinition4 = (id2) => definitionsById4.get(id2);
function validateContent4(definitions = OBSTACLES4) {
  const errors = [], ids = /* @__PURE__ */ new Set();
  for (const o of definitions) {
    if (!o.id || ids.has(o.id)) errors.push(`duplicate or missing id: ${o.id}`);
    ids.add(o.id);
    if (!Number.isFinite(o.w) || !Number.isFinite(o.h) || o.w <= 0 || o.h <= 6) errors.push(`${o.id}: invalid size`);
    if (!["ground", "air"].includes(o.placement)) errors.push(`${o.id}: invalid placement`);
    if (o.placement === "air" && (!Number.isFinite(o.altitude) || !(Number(o.altitude) > 0))) errors.push(`${o.id}: invalid altitude`);
    if (o.placement === "ground" && o.altitude) errors.push(`${o.id}: ground altitude`);
    if (!["ground-center", "air-bottom-center"].includes(o.anchor)) errors.push(`${o.id}: invalid anchor`);
    if (o.biomes !== "all" && (!Array.isArray(o.biomes) || !o.biomes.length || o.biomes.some((b) => !BIOMES4.includes(b)))) errors.push(`${o.id}: unknown biome`);
    if (!o.visual || !["photo", "cutout", "character", "prop", "drone", "sprite"].includes(o.visual.renderer)) errors.push(`${o.id}: missing renderer`);
    for (const id2 of o.visual?.assets || []) if (!Object.hasOwn(ASSETS4, id2)) errors.push(`${o.id}: unknown asset ${id2}`);
    if (!["box", "trampoline", "none"].includes(o.collision)) errors.push(`${o.id}: missing collision profile`);
    if (o.inset !== void 0 && (!Number.isFinite(o.inset) || o.inset < 0 || o.inset * 2 >= o.w)) errors.push(`${o.id}: invalid inset`);
    for (
      const direction of
      /** @type {const} */
      ["hero", "obstacle"]
    ) {
      const r = o.reactions?.[direction];
      if (!r || typeof r.enabled !== "boolean") errors.push(`${o.id}: missing ${direction} reaction`);
      else if (r.enabled && (!ANIMATIONS4.includes(r.animationId) || !["near", "airborne-near", "passage"].includes(r.trigger) || !(r.range > 0) || !["target", "self"].includes(r.space))) errors.push(`${o.id}: missing animation ${r.animationId}`);
    }
  }
  return errors;
}
var contentErrors4 = validateContent4();
if (contentErrors4.length) throw new Error(`Invalid content: ${contentErrors4.join("; ")}`);

// supabase/rulesets/roadster-v410/physics.js?v=4.1.0
var STEP4 = 1 / 120;
function rogozinBounce4(time) {
  return 20 * Math.abs(Math.sin(time * 4.5));
}
function obstacleBoxes4(o, time = 0) {
  if ((o.collision || obstacleDefinition4(o.id)?.collision) === "trampoline") {
    return [
      { left: 6, right: o.w - 6, top: 16 },
      { left: o.w / 2 - 18, right: o.w / 2 + 18, top: 108 + rogozinBounce4(time) }
    ];
  }
  const inset = o.inset ?? 5;
  return [{ left: inset, right: o.w - inset, top: o.h - 6 }];
}

// supabase/rulesets/roadster-v410/fall.js?v=4.1.0
var clamp7 = (x) => Math.max(0, Math.min(1, x));
var ease4 = (x) => {
  x = clamp7(x);
  return x * x * (3 - 2 * x);
};
var mix4 = (a, b, t) => a + (b - a) * t;
var FALL_CONTACTS4 = Object.freeze([0.14, 0.36, 0.56]);
var FALL_CAR_CONTACTS4 = Object.freeze([0.16, 0.38]);
var FALL_CAR_HULL4 = Object.freeze([[-49, -7], [-8, -15], [8, -15], [48.5, 0], [47, 6], [27, 12], [-34, 12], [-46, 5]].map(Object.freeze));
function fallCarSupport4(angle) {
  return Math.max(...FALL_CAR_HULL4.map(([x, y]) => x * Math.sin(angle) + y * Math.cos(angle)));
}
var arc4 = (p, a, b, height) => {
  const t = clamp7((p - a) / (b - a));
  return t < 1e-12 || t > 1 - 1e-12 ? 0 : height * 4 * t * (1 - t);
};
var pulse4 = (p, hit) => ease4((p - hit + 0.035) / 0.035) * (1 - ease4((p - hit) / 0.055));
function track4(keys, p) {
  let i = 1;
  while (i < keys.length - 1 && p > keys[i][0]) i++;
  const [a, b] = [keys[i - 1], keys[i]];
  return mix4(a[1], b[1], ease4((p - a[0]) / (b[0] - a[0])));
}
function createFall4() {
  return { active: false, age: 0, duration: GAMEPLAY4.fallSeconds, rate: 1, taps: 0, angle: 0, reduced: false };
}
function beginFall4(f, result, { reduced = false, speed = GAMEPLAY4.startSpeed } = {}) {
  const angle = Math.atan2(Math.sin(result.angle), Math.cos(result.angle));
  const severity = clamp7((speed - GAMEPLAY4.startSpeed) / (GAMEPLAY4.maxSpeed - GAMEPLAY4.startSpeed));
  Object.assign(f, { active: true, age: 0, duration: GAMEPLAY4.fallSeconds + GAMEPLAY4.fallSpeedSeconds * severity, rate: 1, taps: 0, angle, reduced });
}
function hastenFall4(f) {
  if (!f.active) return false;
  f.taps++;
  f.rate = Math.min(GAMEPLAY4.fallMaxRate, f.rate + GAMEPLAY4.fallTapRate);
  return true;
}
function advanceFall4(f, dt) {
  if (!f.active) return { impacts: 0, finished: false };
  const previous = f.age;
  f.age = Math.min(f.duration, f.age + dt * f.rate);
  const impacts = FALL_CONTACTS4.filter((t) => previous < f.duration * t && f.age >= f.duration * t).length;
  f.active = f.age < f.duration;
  return { impacts, finished: !f.active };
}
function fallPose4(f) {
  const p = clamp7(f.age / f.duration), sit = ease4(p / 0.14), stand = ease4((p - 0.68) / 0.16), gather = ease4((p - 0.7) / 0.22), settle = clamp7((p - 0.97) / 0.03);
  const impact = Math.max(...FALL_CONTACTS4.map((hit) => pulse4(p, hit))), seat = sit * (1 - stand);
  const crouch = (0.72 + 0.18 * impact) * seat + (settle === 1 ? 0 : 0.1 * Math.sin(settle * Math.PI));
  const lift = p < 0.36 ? arc4(p, 0.14, 0.36, 32) : p < 0.56 ? arc4(p, 0.36, 0.56, 28) : arc4(p, 0.56, 0.97, 112);
  const angle = mix4(f.angle, -0.64, sit) * (1 - stand);
  const seatAnchor = -11 * Math.sin(angle) + (22.5 + 27 * crouch) * Math.cos(angle) + 9;
  const rider = { x: 34 * sit * (1 - gather), y: mix4(95, seatAnchor, seat) + lift, angle, seat, crouch, lift };
  const entry = (y) => ({ x: Math.sin(f.angle) * (y - 65), y: 65 + Math.cos(f.angle) * (y - 65) });
  const e = entry(95), c = entry(12);
  rider.x += e.x * (1 - sit);
  rider.y += (e.y - 95) * (1 - sit);
  const carAngle = track4([[0, f.angle], [0.16, 0.95], [0.29, Math.PI], [0.38, 2 * Math.PI - 1.02], [0.54, 2 * Math.PI], [1, 2 * Math.PI]], p);
  const carHop = p < 0.16 ? arc4(p, 0, 0.16, 20) : p < 0.38 ? arc4(p, 0.16, 0.38, 22) : arc4(p, 0.38, 0.54, 8);
  const car = { x: gather === 1 ? 0 : mix4(c.x, -88, ease4(p / 0.16)) * (1 - gather), y: p >= 0.54 ? 12 : mix4(c.y, fallCarSupport4(carAngle) + carHop, ease4(p / 0.06)), angle: carAngle, phase: 0 };
  let shake = 0;
  for (const hit of FALL_CONTACTS4) if (p >= hit) shake = Math.max(shake, Math.exp(-(p - hit) * 40));
  const pose = { car, rider, crouch, impact, flail: sit * (1 - ease4((p - 0.82) / 0.12)), push: 0, shake: shake * 2.4, progress: p };
  if (f.reduced) {
    pose.car = { x: 0, y: 12, angle: 0, phase: 0 };
    pose.rider = { x: 0, y: 95, angle: 0, seat: 0, crouch };
    pose.shake = 0;
    pose.push = 0;
    pose.flail = 0;
  }
  return pose;
}
function fallPolygons4(pose) {
  const seat = pose.rider.seat || 0, crouch = pose.rider.crouch || 0;
  const rider = [[-23, -70 + 4 * seat], [23 + 48 * seat, -70 + 4 * seat], [23 + 48 * seat, 68 - 27 * crouch], [-23, 68 - 27 * crouch]];
  return [[pose.car, FALL_CAR_HULL4.map(([x, y]) => [x, -y])], [pose.rider, rider]].map(([body2, vertices]) => {
    const c = Math.cos(body2.angle), s = Math.sin(body2.angle);
    return vertices.map(([x, y]) => ({ x: body2.x + c * x + s * y, y: body2.y - s * x + c * y }));
  });
}
function interpolateFall4(a, b, t) {
  const pose = {};
  for (const part of ["car", "rider"]) {
    pose[part] = {};
    for (const k of ["x", "y", "angle", "seat", "crouch", "phase"]) pose[part][k] = mix4(a[part][k] || 0, b[part][k] || 0, t);
  }
  return pose;
}

// supabase/rulesets/roadster-v410/gameplay.js?v=4.1.0
var TAU4 = Math.PI * 2;
var clamp8 = (x, a, b) => Math.max(a, Math.min(b, x));
var approach4 = (x, target, amount) => x < target ? Math.min(target, x + amount) : Math.max(target, x - amount);
function uprightError4(angle, direction = -1) {
  let e = ((angle + Math.PI) % TAU4 + TAU4) % TAU4 - Math.PI;
  if (Math.abs(Math.abs(e) - Math.PI) < 1e-9) e = -Math.sign(direction || -1) * Math.PI;
  return e;
}
function createFlight4(fuel = GAMEPLAY4.initialFuel) {
  return { y: 0, vy: 0, vx: 0, angle: 0, omega: 0, airborne: false, time: 0, fuel, thrusting: false, latched: false, attach: 0, maxTurn: 0, turns: 0, lastDirection: -1, trickStarted: false, grab: 0, launchVelocity: 0 };
}
function launch4(p, charge = 0) {
  if (p.airborne) return false;
  Object.assign(p, { y: 1e-3, vy: GAMEPLAY4.jumpSpeed + GAMEPLAY4.chargedSpeed * clamp8(charge, 0, 1), angle: 0, omega: 0, airborne: true, time: 0, latched: false, attach: 0, maxTurn: 0, turns: 0, trickStarted: false, grab: 0, launchVelocity: GAMEPLAY4.jumpSpeed + GAMEPLAY4.chargedSpeed * clamp8(charge, 0, 1) });
  return true;
}
function advanceFlight4(p, dt, { spin = false, thrust = false } = {}) {
  p.thrusting = false;
  const gripTarget = p.airborne && spin ? 1 : 0;
  p.grab = approach4(p.grab, gripTarget, dt / (gripTarget ? 0.12 : 0.18));
  if (!p.airborne) {
    p.vx *= Math.exp(-GAMEPLAY4.horizontalDrag * dt);
    return null;
  }
  p.time += dt;
  if (spin) {
    p.trickStarted = true;
    p.lastDirection = -1;
    p.omega = approach4(p.omega, -GAMEPLAY4.spinSpeed, GAMEPLAY4.spinAcceleration * dt);
  } else {
    const target = Math.sign(p.omega) * Math.min(Math.abs(p.omega), GAMEPLAY4.releaseSpeed);
    p.omega = approach4(p.omega, target, GAMEPLAY4.releaseDeceleration * dt);
  }
  p.angle += p.omega * dt;
  p.maxTurn = Math.max(p.maxTurn, -p.angle);
  p.turns = Math.floor((p.maxTurn + 1e-7) / TAU4);
  const burn = thrust ? Math.min(dt, p.fuel / GAMEPLAY4.fuelPerSecond) : 0;
  if (burn > 0) {
    p.fuel = Math.max(0, p.fuel - burn * GAMEPLAY4.fuelPerSecond);
    p.thrusting = true;
    p.latched = true;
    p.vx += Math.sin(p.angle) * GAMEPLAY4.thrustAcceleration * burn;
    p.vy += Math.cos(p.angle) * GAMEPLAY4.thrustAcceleration * burn;
  }
  if (p.latched) p.attach = Math.min(1, p.attach + dt / GAMEPLAY4.attachSeconds);
  p.vx = clamp8(p.vx * Math.exp(-GAMEPLAY4.horizontalDrag * dt), -GAMEPLAY4.maxHorizontal, GAMEPLAY4.maxHorizontal);
  p.y += p.vy * dt - 0.5 * GAMEPLAY4.gravity * dt * dt;
  p.vy -= GAMEPLAY4.gravity * dt;
  if (p.y > 0) return null;
  const good = Math.abs(uprightError4(p.angle)) <= GAMEPLAY4.landingAngle + 1e-9 && Math.abs(p.omega) <= GAMEPLAY4.landingOmega;
  const turns = good ? Math.max(p.turns, Math.round(-p.angle / TAU4)) : p.turns;
  const perfect = good && Math.abs(uprightError4(p.angle)) <= GAMEPLAY4.perfectAngle + 1e-9;
  const result = { good, perfect, turns, impact: Math.abs(p.vy), angle: p.angle, omega: p.omega };
  p.turns = turns;
  p.y = 0;
  p.vy = 0;
  p.airborne = false;
  p.thrusting = false;
  if (result.good) {
    p.angle = 0;
    p.omega = 0;
  }
  return result;
}
function createEconomy4() {
  return { bonus: 0, multiplier: 10, meter: 0, decay: 0, streak: 0, streakLeft: 0, flips: 0 };
}
function comboSeconds4(e) {
  return GAMEPLAY4.comboDuration - GAMEPLAY4.comboFalloff * (e.multiplier / 10 - 1);
}
function rewardAction4(e, count = 1) {
  e.multiplier = Math.min(GAMEPLAY4.maxMultiplier, e.multiplier + count * GAMEPLAY4.multiplierStep);
  e.meter = 1;
  e.decay = 0;
}
function advanceEconomy4(e, dt) {
  if (e.meter > 0) {
    const used = Math.min(dt, e.meter * comboSeconds4(e));
    e.meter = Math.max(0, e.meter - used / comboSeconds4(e));
    dt -= used;
  }
  if (e.meter === 0 && e.multiplier > 10) {
    e.decay += dt;
    while (e.decay + 1e-9 >= GAMEPLAY4.comboDecaySeconds && e.multiplier > 10) {
      e.multiplier--;
      e.decay -= GAMEPLAY4.comboDecaySeconds;
    }
  }
}
function advanceStreak4(e, dt) {
  const used = Math.min(dt, e.streakLeft);
  e.streakLeft -= used;
  e.streak = Math.max(0, e.streak - (dt - used) * GAMEPLAY4.streakDecay);
}
function passObstacle4(e) {
  const points = GAMEPLAY4.obstaclePoints * e.multiplier / 10;
  e.bonus += points;
  return points;
}
function settleLanding4(e, p, result, { late = 0, near = 0 } = {}) {
  if (!result.good) {
    e.multiplier = 10;
    e.meter = 0;
    e.decay = 0;
    e.streak = 0;
    e.streakLeft = 0;
    return { points: 0, turns: 0, late: 0, near: 0, perfect: false, good: false };
  }
  const n = result.turns, perfect = !!result.perfect, points = (GAMEPLAY4.flipFactor * n * (n + 1) + GAMEPLAY4.nearPoints * (late + near) + GAMEPLAY4.perfectPoints * Number(perfect)) * e.multiplier / 10;
  e.bonus += points;
  e.flips += n;
  p.fuel = Math.min(GAMEPLAY4.tank, p.fuel + GAMEPLAY4.fuelPerFlip * n);
  if (n + late + near + Number(perfect)) rewardAction4(e, n + late + near + Number(perfect));
  if (n || near) {
    e.streak = Math.min(GAMEPLAY4.maxStreak, e.streak + GAMEPLAY4.streakStep);
    e.streakLeft = GAMEPLAY4.streakHold;
  }
  return { points, turns: n, late, near, perfect, good: true };
}
function createPace4() {
  return { progress: 0, base: GAMEPLAY4.startSpeed, speed: GAMEPLAY4.startSpeed, recovery: null, stumble: 0, falling: false };
}
function stumble4(pace) {
  const target = pace.recovery?.target ?? pace.base, r = clamp8((target - GAMEPLAY4.startSpeed) / (GAMEPLAY4.maxSpeed - GAMEPLAY4.startSpeed), 0, 1);
  pace.recovery = { target, age: 0, duration: GAMEPLAY4.recoveryMin + GAMEPLAY4.recoveryExtra * r ** 1.5 };
  pace.stumble = GAMEPLAY4.stumbleSeconds;
  pace.base = target * GAMEPLAY4.recoveryRatio;
}
function recoverySpeed4(r, t) {
  const T = r.duration, d = r.target * (1 - GAMEPLAY4.recoveryRatio), v0 = r.target * GAMEPLAY4.recoveryRatio, h = 0.15, a = T - h;
  if (t <= a) return v0 + d * (t / T) ** 2;
  const u = clamp8((t - a) / h, 0, 1), start = v0 + d * (a / T) ** 2, slope = 2 * d * a / T ** 2, endSlope = r.target >= GAMEPLAY4.maxSpeed ? 0 : (GAMEPLAY4.maxSpeed - GAMEPLAY4.startSpeed) / GAMEPLAY4.rampSeconds;
  return (2 * u ** 3 - 3 * u * u + 1) * start + (u ** 3 - 2 * u * u + u) * h * slope + (-2 * u ** 3 + 3 * u * u) * r.target + (u ** 3 - u * u) * h * endSlope;
}
function advancePace4(pace, e, p, dt) {
  if (pace.recovery) {
    pace.stumble = Math.max(0, pace.stumble - dt);
    const r = pace.recovery;
    r.age = Math.min(r.duration, r.age + dt);
    pace.base = recoverySpeed4(r, r.age);
    if (r.age >= r.duration) {
      pace.base = r.target;
      pace.recovery = null;
    }
  } else if (!pace.falling) {
    pace.progress += dt;
    pace.base = GAMEPLAY4.startSpeed + (GAMEPLAY4.maxSpeed - GAMEPLAY4.startSpeed) * Math.min(1, pace.progress / GAMEPLAY4.rampSeconds);
  }
  pace.speed = Math.max(60, pace.base * (1 + e.streak) + p.vx);
  return pace.speed;
}
function playerPolygons4(p) {
  if (p.fallPose) return fallPolygons4(p.fallPose);
  const c = Math.cos(p.angle), s = Math.sin(p.angle);
  return [[-47, 0, 47, 25], [-23, 25, 23, 163 - 32 * (p.grab || 0)]].map(([l, b, r, t]) => [[l, b], [r, b], [r, t], [l, t]].map(([x, y]) => ({ x: c * x + s * (y - 65), y: p.y + 65 - s * x + c * (y - 65) })));
}
function overlaps4(poly, rect) {
  const axes = [{ x: 1, y: 0 }, { x: 0, y: 1 }];
  for (let i = 0; i < (poly.length === 4 ? 2 : poly.length); i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    axes.push({ x: -(b.y - a.y), y: b.x - a.x });
  }
  for (const a of axes) {
    let pmin = Infinity, pmax = -Infinity, rmin = Infinity, rmax = -Infinity;
    for (const p of poly) {
      const value = p.x * a.x + p.y * a.y;
      pmin = Math.min(pmin, value);
      pmax = Math.max(pmax, value);
    }
    for (const p of rect) {
      const value = p.x * a.x + p.y * a.y;
      rmin = Math.min(rmin, value);
      rmax = Math.max(rmax, value);
    }
    if (pmax <= rmin || rmax <= pmin) return false;
  }
  return true;
}
function collisionAt4(p, o, dx, time = 0) {
  if (o.collision === "none") return false;
  if (dx > 180 || dx + o.w < -180) return false;
  const polygons = playerPolygons4(p);
  return obstacleBoxes4(o, time).some((b) => {
    const bottom = o.altitude || 0, top = bottom + b.top;
    const rect = [{ x: dx + b.left, y: bottom }, { x: dx + b.right, y: bottom }, { x: dx + b.right, y: top }, { x: dx + b.left, y: top }];
    return polygons.some((poly) => overlaps4(poly, rect));
  });
}
function sweptCollision4(before, after, o, dxBefore, dxAfter, time, dt) {
  if (Math.min(dxBefore, dxAfter) > 180 || Math.max(dxBefore, dxAfter) + o.w < -180) return false;
  const fallTravel = before.fallPose && after.fallPose ? Math.max(...["rider", "car"].map((part) => Math.abs(after.fallPose[part].angle - before.fallPose[part].angle) * (part === "car" ? 55 : 170) + Math.abs(after.fallPose[part].y - before.fallPose[part].y) + Math.abs(after.fallPose[part].x - before.fallPose[part].x))) : 0;
  const n = Math.max(1, Math.ceil((Math.abs(dxAfter - dxBefore) + Math.abs(after.y - before.y) + Math.abs(after.angle - before.angle) * 170 + fallTravel) / 4));
  for (let i = 0; i <= n; i++) {
    const f = i / n, p = { y: before.y + (after.y - before.y) * f, angle: before.angle + (after.angle - before.angle) * f, grab: (before.grab || 0) + ((after.grab || 0) - (before.grab || 0)) * f };
    if (before.fallPose && after.fallPose) p.fallPose = interpolateFall4(before.fallPose, after.fallPose, f);
    if (collisionAt4(p, o, dxBefore + (dxAfter - dxBefore) * f, time - dt + dt * f)) return true;
  }
  return false;
}
function nearWindow4(distance, speed) {
  return distance >= 0 && distance <= Math.max(0, speed) * GAMEPLAY4.nearSeconds + 1e-8;
}

// supabase/rulesets/roadster-v410/biomes.js?v=4.1.0
var BIOME_SCORE_STEP2 = 7e3;
var SCENERY_CYCLE2 = BIOME_CYCLE4;
function biomeAt2(score = 0) {
  const points = Number.isFinite(score) ? Math.max(0, score) : 0;
  const leg = Math.floor(points / BIOME_SCORE_STEP2), nextAt = (leg + 1) * BIOME_SCORE_STEP2;
  return { id: SCENERY_CYCLE2[leg % SCENERY_CYCLE2.length], leg, nextAt, nextIn: nextAt - points };
}

// supabase/rulesets/roadster-v410/routes.js?v=4.1.0
var STAGES4 = GAMEPLAY4.stages;
function stageAt4(progress) {
  return STAGES4.filter((t) => progress >= t).length - 1;
}
function makePattern4(kind, { speed = 360, type = { id: "truck", w: 110, h: 41 }, dx = 900 } = {}) {
  const item = (o, offset = 0) => ({ ...o, x: dx + offset, passed: false });
  if (kind === "air") return [item(type)];
  if (kind === "hover" || kind === "incoming") return [item(type)];
  if (kind === "precision") {
    const span = Math.min(200, Math.max(110, speed * 0.4 - 94)), cars = [], n = Math.min(2, Math.ceil(span / 110)), width = (span - 20 * (n - 1)) / n;
    for (let i = 0; i < n; i++) cars.push(item({ id: "truck", name: "CYBERBRICK", w: width, h: 41 * width / 110, inset: 4 }, i * (width + 20)));
    cars.push(item({ id: "truck", name: "CYBERBRICK", w: 110, h: 41, inset: 5 }, speed * 1.15));
    return cars;
  }
  if (kind === "mixed") return [item(type), item(type.h <= 57 ? type : { id: "truck", name: "CYBERBRICK", w: 110, h: 41, inset: 5 }, speed * 1.65)];
  if (kind === "thrust") {
    const n = Math.min(6, Math.max(4, Math.ceil(speed * 1.65 / 165)));
    return Array.from({ length: n }, (_, i) => item({ id: "truck", name: "CYBERBRICK", w: 110, h: 41, inset: 5 }, i * 165));
  }
  if (kind === "pair") return [item(type), item(type, speed * 1.5)];
  return [item(type)];
}
function validateRoute4(obstacles, { flight = createFlight4(), pace = createPace4(), economy = createEconomy4(), time = 0, allowThrust = true, burns = null, timingMargin = 0, leads = [0.1, 0.11, 0.115, 0.12, 0.125, 0.14, 0.16, 0.2, 0.3, 0.4, 0.5, 0.65], charges = [0, 0.5, 1] } = {}) {
  if (flight.airborne || pace.stumble > 0) return null;
  for (const charge of charges) for (const lead of leads) for (const burn of burns ?? (allowThrust && flight.fuel > 0 ? [0, 0.35, 0.65, 1.1] : [0])) {
    const p = { ...flight }, r = structuredClone(pace), e = { ...economy }, obs = obstacles.map((o) => ({ ...o })), actions = [];
    let charging = false, held = 0, elapsed = 0, lateTarget = null, lastThrust = false, nearLandings = 0, lateTakeoffs = 0;
    const dt = 1 / 120;
    for (let tick = 0; tick < 1440; tick++) {
      elapsed = tick * dt;
      const next = obs.find((o) => o.x + o.w > -47 && (!o.altitude || o.altitude < 163));
      if (!p.airborne && next) {
        const ttc = (next.x + (next.inset || 5) - 47) / Math.max(1, r.speed + (next.approachSpeed || 0));
        if (!charging && ttc <= lead + charge * GAMEPLAY4.chargeSeconds) {
          charging = true;
          held = 0;
          actions.push({ at: elapsed, action: "hold" });
        }
        if (charging) {
          held += dt;
          if (held + 1e-9 >= charge * GAMEPLAY4.chargeSeconds + (charge > 0 ? dt : 0)) {
            lateTarget = nearWindow4(next.x + (next.inset || 5) - 47, r.speed + (next.approachSpeed || 0)) ? next : null;
            launch4(p, charge);
            charging = false;
            actions.push({ at: elapsed, action: "jump", charge });
          }
        }
      }
      const before = { ...p }, useThrust = p.airborne && p.time >= 0.18 && p.time < 0.18 + burn;
      if (useThrust !== lastThrust) {
        actions.push({ at: elapsed, action: useThrust ? "thrust-on" : "thrust-off" });
        lastThrust = useThrust;
      }
      const landed = advanceFlight4(p, dt, { thrust: useThrust });
      advanceEconomy4(e, dt);
      advanceStreak4(e, dt);
      advancePace4(r, e, p, dt);
      const after = landed ? { ...p, angle: landed.angle } : p;
      let alive = true;
      for (const o of obs) {
        const old = o.x;
        o.x -= (r.speed + (o.approachSpeed || 0)) * dt;
        if (sweptCollision4(before, after, o, old, o.x, time + elapsed, dt)) {
          alive = false;
          break;
        }
        if (!o.passed && o.x + o.w < -50) {
          o.passed = true;
          passObstacle4(e);
        }
      }
      if (!alive || landed && !landed.good) break;
      if (landed) {
        let near = 0;
        const late = lateTarget && lateTarget.x + lateTarget.w - (lateTarget.inset || 5) < -47 ? 1 : 0;
        for (const o of obs) if (!o.altitude && !o.nearPaid && nearWindow4(-47 - (o.x + o.w - (o.inset || 5)), r.speed)) {
          near++;
          o.nearPaid = true;
        }
        settleLanding4(e, p, landed, { late, near });
        nearLandings += near;
        lateTakeoffs += late;
        lateTarget = null;
      }
      if (obs.every((o) => o.x + o.w < -180) && !p.airborne) {
        if (timingMargin > 0 && (!validateRoute4(obstacles, { flight, pace, economy, time, charges: [charge], leads: [lead - timingMargin], burns: [burn] }) || !validateRoute4(obstacles, { flight, pace, economy, time, charges: [charge], leads: [lead + timingMargin], burns: [burn] }))) break;
        return { charge, lead, burn, actions, nearLandings, lateTakeoffs, duration: elapsed, fuelUsed: flight.fuel - p.fuel, exit: { y: 0, angle: 0, vx: p.vx }, clearanceVerified: true, timingMargin };
      }
    }
  }
  return null;
}

// supabase/rulesets/roadster-v410/director.js?v=4.1.0
function createDirector4({ S, flight, pace, economy, spawnDistance, sceneTime = () => S.t, random: random3 = Math.random, relative = false }) {
  const initial = () => ({ wave: 0, last: null, fallbacks: 0, waiting: false, hardStreak: 0, leg: -1, legStartedAt: 0, groundSinceAir: 0, airCount: 0, lastAirAt: -1e9 });
  const state = initial();
  function reset() {
    Object.assign(state, initial());
  }
  function spawn() {
    if (flight.airborne || pace.recovery || pace.falling || S.obs.some((o) => !o.passed)) {
      S.next = 0.18;
      state.waiting = true;
      return;
    }
    state.waiting = false;
    const { id: biome, leg } = biomeAt2(S.score || 0);
    if (leg !== state.leg) {
      state.leg = leg;
      state.legStartedAt = S.t;
    }
    const stage = stageAt4(pace.progress), afterAir = state.last?.kind === "air", breath = afterAir || state.wave % 5 === 4 || state.hardStreak >= 2;
    const airDue = leg >= 2 && S.t - state.legStartedAt >= 8 && state.groundSinceAir >= 6 && S.t - state.lastAirAt >= 28;
    const pools = [["single"], ["single"], ["pair", "single"], ["single", "pair"], ["precision", "single", "pair"], ["pair", "precision", "thrust"], ["pair", "precision", "thrust"]];
    let kind = breath || airDue ? "single" : pools[stage][Math.floor(random3() * pools[stage].length)];
    const factoryIds = ["truck", "t800", "bydSeal", "xiaomiSu7", "batteryAgv", "xi"];
    const choices = OBSTACLES4.filter((o) => !o.altitude && o.collision !== "none" && (o.biomes === "all" || o.biomes.includes(biome)) && (biome !== "tesla-factory" || factoryIds.includes(o.id)) && (stage === 0 ? o.h <= 64 : stage < 2 ? o.h <= 94 : true));
    if (kind === "thrust" && flight.fuel < 65) kind = "pair";
    let type = choices[Math.floor(random3() * choices.length)], dx = spawnDistance();
    if (airDue && !breath && state.last?.kind === "single") {
      const first = state.airCount < 2;
      const pool = AIR_TYPES4.filter((o) => (o.biomes === "all" || o.biomes.includes(biome)) && (!first || o.h <= 55 && o.w <= 110));
      const model = pool[Math.floor(random3() * pool.length)];
      type = { ...model, altitude: first ? 24 : 32, approachSpeed: first ? 80 : 110 };
      kind = "air";
      dx = Math.max(dx, (S.speed + type.approachSpeed) * 2);
    }
    let obstacles = makePattern4(kind, { speed: S.speed, type, dx });
    let route = validateRoute4(obstacles, { flight, pace, economy, time: sceneTime(), allowThrust: kind !== "air", timingMargin: kind === "air" ? 0.09 : GAMEPLAY4.routeTimingMargin });
    if (route && route.fuelUsed > 0 && flight.fuel - route.fuelUsed < GAMEPLAY4.routeFuelReserve) route = null;
    if (!route) {
      state.fallbacks++;
      kind = "single";
      obstacles = makePattern4(kind, { speed: S.speed, type: OBSTACLES4.find((o) => o.id === "truck"), dx });
      route = validateRoute4(obstacles, { flight, pace, economy, time: sceneTime(), timingMargin: GAMEPLAY4.routeTimingMargin });
    }
    if (!route) {
      S.next = 0.3;
      return;
    }
    state.hardStreak = ["precision", "thrust"].includes(kind) ? state.hardStreak + 1 : 0;
    if (kind === "air") {
      state.airCount++;
      state.groundSinceAir = 0;
      state.lastAirAt = S.t;
    } else state.groundSinceAir++;
    state.wave++;
    state.last = { kind, stage, biome, leg, route, startedAt: S.t };
    for (const o of obstacles) S.obs.push({ ...o, x: o.x + (relative ? 0 : S.anchor), uid: ++S.entityId, passed: false, nearPaid: false, latePaid: false });
    S.next = kind === "air" ? route.duration + 1.25 : breath ? 2.3 : 1.2;
  }
  return { reset, spawn, state };
}

// supabase/rulesets/roadster-v410/random.js?v=4.1.0
function createRandom4(seed) {
  if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) throw Error("Invalid run seed");
  let state = seed;
  return { next() {
    state = state + 1831565813 >>> 0;
    let t = state;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }, get state() {
    return state;
  }, restore(value) {
    if (!Number.isInteger(value) || value < 0 || value > 4294967295) throw Error("Invalid random state");
    state = value;
  } };
}

// supabase/rulesets/roadster-v410/run.js
var RULESET4 = "roadster-v4.1.0";
var RUN_STEP4 = 1 / 120;
var RUN_COMMANDS4 = Object.freeze(["primary-down", "primary-up", "primary-cancel", "thrust-on", "thrust-off", "cancel"]);
var MAX_RECORDED_TICKS4 = 120 * 60 * 60;
var MAX_RECORDED_EVENTS4 = 24e3;
function createRun4({ seed = 0, record = true, reducedMotion = false } = {}) {
  const S = { mode: "menu", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY4.startSpeed, next: 1.7, obs: [], entityId: 0, anchor: 0 }, P = createFlight4(), E = createEconomy4(), pace = createPace4(), F = createFall4(), input = { charging: false, charge: 0, spin: false, thrust: false };
  let random3 = createRandom4(seed), events = [], log = [], lateId = null, lastLanding = null, recordable = true;
  const director = createDirector4({ S, flight: P, pace, economy: E, random: () => random3.next(), relative: true, sceneTime: () => S.t, spawnDistance: () => Math.max(900, S.speed * 1.5 + 180) });
  function clear() {
    Object.assign(input, { charging: false, charge: 0, spin: false, thrust: false });
    P.thrusting = false;
  }
  function sync() {
    S.t = S.tick * RUN_STEP4;
    S.speed = pace.speed;
    S.score = Math.floor(S.distance / 20 + E.bonus);
  }
  function reset(nextSeed = seed) {
    seed = nextSeed;
    random3 = createRandom4(seed);
    Object.assign(P, createFlight4());
    Object.assign(E, createEconomy4());
    Object.assign(pace, createPace4());
    Object.assign(F, createFall4());
    Object.assign(S, { mode: "playing", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY4.startSpeed, next: 1.7, obs: [], entityId: 0, lastCharge: 0 });
    clear();
    events = [];
    log = [];
    lateId = null;
    lastLanding = null;
    recordable = true;
    director.reset();
  }
  function jump() {
    if (S.mode !== "playing" || P.airborne || F.active || pace.stumble > 0) return false;
    lateId = null;
    for (const o of S.obs) {
      if (o.altitude || o.passed) continue;
      if (nearWindow4(o.x + (o.inset || 5) - 47, S.speed + (o.approachSpeed || 0))) {
        lateId = o.uid;
        break;
      }
    }
    const charge = input.charge;
    launch4(P, charge);
    S.lastCharge = charge;
    input.charging = false;
    input.charge = 0;
    input.spin = false;
    events.push({ type: "jump", charge });
    return true;
  }
  function command(action) {
    if (!RUN_COMMANDS4.includes(action)) throw Error("Unknown run command");
    if (S.mode !== "playing") return false;
    if (record && recordable) {
      if (log.length >= MAX_RECORDED_EVENTS4) recordable = false;
      else log.push([S.tick, RUN_COMMANDS4.indexOf(action)]);
    }
    if (action === "cancel") {
      clear();
      return true;
    }
    if (action === "primary-cancel") {
      input.spin = false;
      input.charging = false;
      input.charge = 0;
      return true;
    }
    if (action === "thrust-off") {
      input.thrust = false;
      return true;
    }
    if (action === "thrust-on") {
      if (!F.active) input.thrust = true;
      return true;
    }
    if (action === "primary-up") {
      if (input.charging) jump();
      input.spin = false;
      return true;
    }
    if (F.active) return hastenFall4(F);
    if (pace.stumble > 0) return false;
    if (P.airborne) {
      P.trickStarted = true;
      input.spin = true;
    } else {
      input.charging = true;
      input.charge = 0;
    }
    return true;
  }
  function step() {
    if (S.mode !== "playing") return { landed: null, impacts: 0 };
    S.tick++;
    if (S.tick > MAX_RECORDED_TICKS4) recordable = false;
    sync();
    if (input.charging) input.charge = Math.min(1, input.charge + RUN_STEP4 / GAMEPLAY4.chargeSeconds);
    advanceEconomy4(E, RUN_STEP4);
    advanceStreak4(E, RUN_STEP4);
    const physicsFall = () => fallPose4({ ...F, reduced: false }), wasFalling = F.active, before = { ...P, fallPose: F.active ? physicsFall() : null };
    let landed = null, fallStep = { impacts: 0, finished: false };
    if (wasFalling) {
      fallStep = advanceFall4(F, RUN_STEP4);
      if (fallStep.finished) {
        clear();
        S.next = Math.max(S.next, 0.8);
        events.push({ type: "recovered" });
      }
    } else landed = advanceFlight4(P, RUN_STEP4, { spin: input.spin, thrust: input.thrust });
    pace.falling = F.active;
    advancePace4(pace, E, P, RUN_STEP4);
    S.distance += pace.speed * RUN_STEP4;
    sync();
    const after = wasFalling ? { ...P, fallPose: physicsFall() } : landed ? { ...P, angle: landed.angle } : P;
    for (const o of S.obs) {
      const old = o.x;
      o.x -= (S.speed + (o.approachSpeed || 0)) * RUN_STEP4;
      if (sweptCollision4(before, after, o, old, o.x, S.t, RUN_STEP4)) {
        S.mode = "dead";
        clear();
        sync();
        events.push({ type: "death", obstacle: o });
        return { landed, impacts: fallStep.impacts };
      }
      if (!o.passed && o.x + o.w < -50) {
        o.passed = true;
        passObstacle4(E);
        if (o.altitude) events.push({ type: "air-passed" });
      }
    }
    if (landed) {
      let late = 0, near = 0;
      const target = S.obs.find((o) => o.uid === lateId);
      if (target && !target.latePaid && target.x + target.w - (target.inset || 5) < -47) {
        late = 1;
        target.latePaid = true;
      }
      for (const o of S.obs) {
        if (o.altitude || o.nearPaid) continue;
        if (nearWindow4(-47 - (o.x + o.w - (o.inset || 5)), S.speed)) {
          near++;
          o.nearPaid = true;
        }
      }
      const oldMultiplier = E.multiplier;
      lastLanding = settleLanding4(E, P, landed, { late, near });
      if (!landed.good) {
        stumble4(pace);
        beginFall4(F, landed, { reduced: reducedMotion, speed: pace.recovery.target });
        pace.falling = true;
        P.angle = 0;
        P.omega = 0;
        P.vx = 0;
        P.grab = 0;
        clear();
        advancePace4(pace, E, P, 0);
      }
      events.push({ type: "landing", landed, result: lastLanding, late, near, oldMultiplier });
      lateId = null;
    }
    if (!P.airborne && Math.abs(P.angle) > 1e-3) {
      P.angle *= Math.exp(-RUN_STEP4 * 18);
      P.omega = 0;
    }
    S.obs = S.obs.filter((o) => o.uid === lateId || o.x + o.w > (o.id === "joe" ? -480 : -400));
    S.next -= RUN_STEP4;
    if (S.next <= 0) director.spawn();
    sync();
    return { landed, impacts: fallStep.impacts };
  }
  function snapshot() {
    return structuredClone({ seed, S, P, E, pace, F, input, random: random3.state, director: director.state, lateId, lastLanding });
  }
  function restore(saved) {
    seed = saved.seed;
    for (const [a, b] of [[S, saved.S], [P, saved.P], [E, saved.E], [pace, saved.pace], [F, saved.F], [input, saved.input], [director.state, saved.director]]) Object.assign(a, structuredClone(b));
    random3 = createRandom4(seed);
    random3.restore(saved.random);
    lateId = saved.lateId;
    lastLanding = structuredClone(saved.lastLanding);
    events = [];
  }
  function replay() {
    return recordable ? { format: 1, ruleset: RULESET4, seed, ticks: S.tick, events: log.map((e) => [...e]) } : null;
  }
  return { S, P, E, pace, F, input, director, reset, jump, command, step, sync, snapshot, restore, replay, drainEvents() {
    const next = events;
    events = [];
    return next;
  }, get lastLanding() {
    return lastLanding;
  }, get seed() {
    return seed;
  }, get recordable() {
    return recordable;
  } };
}
function validateReplay4(value) {
  if (!value || value.format !== 1 || value.ruleset !== RULESET4 || !Number.isInteger(value.seed) || value.seed < 0 || value.seed > 4294967295 || !Number.isInteger(value.ticks) || value.ticks < 1 || value.ticks > MAX_RECORDED_TICKS4 || !Array.isArray(value.events) || value.events.length > MAX_RECORDED_EVENTS4) throw Error("Invalid or unsupported replay");
  let previous = -1;
  for (const event of value.events) {
    if (!Array.isArray(event) || event.length !== 2 || !Number.isInteger(event[0]) || event[0] < previous || event[0] < 0 || event[0] >= value.ticks || !Number.isInteger(event[1]) || event[1] < 0 || event[1] >= RUN_COMMANDS4.length) throw Error("Invalid replay input");
    previous = event[0];
  }
  return value;
}
function verifyReplay4(value) {
  const replay = validateReplay4(value), run = createRun4({ seed: replay.seed, record: false });
  run.reset();
  let event = 0;
  while (run.S.tick < replay.ticks && run.S.mode === "playing") {
    while (event < replay.events.length && replay.events[event][0] === run.S.tick) run.command(RUN_COMMANDS4[replay.events[event++][1]]);
    run.step();
    run.drainEvents();
  }
  if (run.S.mode !== "dead" || run.S.tick !== replay.ticks || event !== replay.events.length) throw Error("Replay does not end at its first collision");
  return { score: run.S.score, flips: run.E.flips, ticks: run.S.tick };
}

// supabase/rulesets/roadster-v430/run.js
var run_exports5 = {};
__export(run_exports5, {
  RULESET: () => RULESET5,
  RUN_COMMANDS: () => RUN_COMMANDS5,
  RUN_STEP: () => RUN_STEP5,
  createRun: () => createRun5,
  validateReplay: () => validateReplay5,
  verifyReplay: () => verifyReplay5
});

// supabase/rulesets/roadster-v430/boosters.js
var BOOSTERS = Object.freeze({
  shield: Object.freeze({ name: "INVINCIBLE", seconds: 8, color: "#7ce5f3" }),
  speed: Object.freeze({ name: "OVERDRIVE", seconds: 8, color: "#ffad62" }),
  jump: Object.freeze({ name: "HIGH JUMP", seconds: 12, color: "#d9ff62" }),
  life: Object.freeze({ name: "EXTRA LIFE", seconds: 0, color: "#ff6a78" }),
  score: Object.freeze({ name: "SCORE \xD73", seconds: 10, color: "#ffc86d" })
});
function createBoosters(seed = 0) {
  return { active: {}, hearts: 0, grace: 0, ghostIds: [], speedBlend: 0, pickups: [], nextAt: 8, serial: 0, bag: [], random: (seed ^ 2772213271) >>> 0, spoiledFlight: false };
}
var activeBooster = (q, id2) => (q?.active[id2] || 0) > 0;
function collectBooster(q, id2) {
  const def = BOOSTERS[id2];
  if (!def) return false;
  if (id2 === "life") {
    if (q.hearts >= 2) return false;
    q.hearts++;
    return true;
  }
  if (!activeBooster(q, id2) && Object.keys(q.active).length >= 3) return false;
  q.active[id2] = def.seconds;
  return true;
}
function advanceBoosters(q, dt) {
  for (const id2 of Object.keys(q.active)) {
    q.active[id2] = Math.max(0, q.active[id2] - dt);
    if (q.active[id2] === 0) delete q.active[id2];
  }
  q.grace = Math.max(0, q.grace - dt);
  const target = activeBooster(q, "speed") ? 1 : 0, delta = dt / (target ? 0.6 : 0.8);
  q.speedBlend = target ? Math.min(1, q.speedBlend + delta) : Math.max(0, q.speedBlend - delta);
}
function random(q) {
  q.random = Math.imul(q.random, 1664525) + 1013904223 >>> 0;
  return q.random / 4294967296;
}
function offerBooster(q, { time, speed, clear }) {
  if (!clear || q.pickups.length || time < q.nextAt) return null;
  if (!q.bag.length) {
    q.bag = Object.keys(BOOSTERS);
    for (let i = q.bag.length - 1; i > 0; i--) {
      const j = Math.floor(random(q) * (i + 1));
      [q.bag[i], q.bag[j]] = [q.bag[j], q.bag[i]];
    }
  }
  const eligible = (id3) => id3 === "life" ? q.hearts < 2 : activeBooster(q, id3) || Object.keys(q.active).length < 3;
  let index = q.bag.findIndex(eligible);
  if (index < 0) {
    q.nextAt = time + 2;
    return null;
  }
  const id2 = q.bag.splice(index, 1)[0], pickup = { id: id2, uid: ++q.serial, x: Math.max(900, speed * 1.9 + 180), y: q.serial === 1 || random(q) < 0.55 ? 104 : 240 };
  q.pickups.push(pickup);
  if (q.serial > 1 && random(q) < 0.4) {
    const second = q.bag.findIndex((other) => other !== id2 && eligible(other));
    if (second >= 0) {
      const next = q.bag.splice(second, 1)[0];
      q.pickups.push({ id: next, uid: ++q.serial, x: pickup.x + 240, y: pickup.y });
    }
  }
  q.nextAt = time + 14 + random(q) * 6;
  return pickup;
}

// supabase/rulesets/roadster-v430/gameplay-config.js
var GAMEPLAY5 = Object.freeze({
  version: "4.3.0",
  gravity: 1550,
  jumpSpeed: 560,
  chargedSpeed: 440,
  chargeSeconds: 0.4,
  spinSpeed: 7.2,
  spinAcceleration: 60,
  releaseSpeed: 1.8,
  releaseDeceleration: 24,
  landingAngle: Math.PI * 2 / 9,
  landingOmega: Math.PI * 4 / 3,
  perfectAngle: Math.PI / 18,
  perfectPoints: 50,
  thrustAcceleration: 2100,
  horizontalDrag: 1.8,
  maxHorizontal: 260,
  tank: 100,
  initialFuel: 50,
  fuelPerSecond: 80,
  fuelPerFlip: 25,
  attachSeconds: 0.12,
  obstaclePoints: 50,
  flipFactor: 50,
  nearPoints: 25,
  nearSeconds: 0.12,
  maxMultiplier: 50,
  multiplierStep: 1,
  comboDuration: 8,
  comboFalloff: 1.2,
  comboDecaySeconds: 0.5,
  streakStep: 0.05,
  maxStreak: 0.25,
  streakHold: 4,
  streakDecay: 0.1,
  fallSeconds: 2.8,
  fallSpeedSeconds: 0.65,
  fallMaxRate: 1.6,
  fallTapRate: 0.15,
  routeTimingMargin: 0.035,
  routeFuelReserve: 20,
  stumbleSeconds: 0.3,
  recoveryRatio: 0.55,
  recoveryMin: 1.2,
  recoveryExtra: 2.8,
  startSpeed: 360,
  maxSpeed: 660,
  rampSeconds: 150,
  stages: Object.freeze([0, 15, 35, 60, 90, 120, 150]),
  bestKey: "roadster-best-v3",
  tutorialKey: "roadster-coach-v3"
});

// supabase/rulesets/roadster-v430/enemy-sprite-data.js
var ENEMY_SPRITES3 = Object.freeze({ "sikorsky": { "file": "assets/encounters/v400/sikorsky.png", "w": 176, "h": 89.146, "pixels": [768, 389], "sourcePixels": [1536, 1024], "sourceCrop": [13, 146, 1520, 909], "alphaExtrema": [0, 255], "sha256": "5619dd383d0bbb6ed7115f767f21f1e86e720d2aeb9ce3f0f41a182f15da3520" }, "xi": { "file": "assets/encounters/v400/xi.png", "w": 72, "h": 109.281, "pixels": [506, 768], "sourcePixels": [1024, 1536], "sourceCrop": [51, 65, 978, 1471], "alphaExtrema": [0, 255], "sha256": "56f56642f4f29a2b3c6655a442be59d4df5f781327c20299fa9ff596f69c6ac0" }, "t800": { "file": "assets/encounters/v400/t800.png", "w": 57, "h": 109.44, "pixels": [400, 768], "sourcePixels": [1024, 1536], "sourceCrop": [183, 66, 925, 1489], "alphaExtrema": [0, 255], "sha256": "1661f9bf004a65db0c178ca6d7b17e42d9963299f627f450016e9443125495f8" }, "ufo": { "file": "assets/encounters/v400/ufo.png", "w": 104, "h": 47.26, "pixels": [768, 349], "sourcePixels": [1672, 940], "sourceCrop": [141, 130, 1535, 763], "alphaExtrema": [0, 255], "sha256": "926e3e760155afe3acbc9215b35465a78e3a49039762c7ff89f8bf1c1e8ec358" }, "primeDrone": { "file": "assets/encounters/v400/primeDrone.png", "w": 110, "h": 48.984, "pixels": [768, 342], "sourcePixels": [1821, 864], "sourceCrop": [10, 31, 1812, 833], "alphaExtrema": [0, 255], "sha256": "a46783dc00dd76be690c29c72f92fa834a02b2522aac366058cc2972822ab681" }, "twitterBird": { "file": "assets/encounters/v400/twitterBird.png", "w": 76, "h": 50.568, "pixels": [768, 511], "sourcePixels": [1536, 1024], "sourceCrop": [85, 50, 1460, 964], "alphaExtrema": [0, 255], "sha256": "46436e2c78ac2ac104426b8bc898f047cb8ee934a9b1a5dd08631a554f5ee94e" }, "homelessRow": { "file": "assets/encounters/v400/homelessRow.png", "w": 142, "h": 40.122, "pixels": [768, 217], "sourcePixels": [2073, 758], "sourceCrop": [79, 124, 2012, 670], "alphaExtrema": [0, 255], "sha256": "03ed702ddb2d5cd06d2c6174b8e88edce01a22adbae68570d268de367ea49806" }, "bydSeal": { "file": "assets/encounters/v400/bydSeal.png", "w": 138, "h": 44.562, "pixels": [768, 248], "sourcePixels": [2172, 724], "sourceCrop": [144, 74, 2061, 693], "alphaExtrema": [0, 255], "sha256": "840376084d808030f6900dbad884a825703c1dd7736fc147db457098759d8b69" }, "xiaomiSu7": { "file": "assets/encounters/v400/xiaomiSu7.png", "w": 138, "h": 42.047, "pixels": [768, 234], "sourcePixels": [1903, 826], "sourceCrop": [26, 190, 1877, 753], "alphaExtrema": [0, 255], "sha256": "3187a0f29bc97d4a73a1186cc1fbd60785ac6beea61dc55a10d7d70184e20bab" }, "batteryAgv": { "file": "assets/encounters/v400/batteryAgv.png", "w": 118, "h": 41.177, "pixels": [768, 268], "sourcePixels": [2012, 782], "sourceCrop": [131, 113, 1878, 722], "alphaExtrema": [0, 255], "sha256": "82d12e8efdb89038ea0351b7dc942754be9ab9f78aed29a88b2c4a12a8cc6d79" }, "qualitySkull": { "file": "assets/encounters/v400/qualitySkull.png", "w": 76, "h": 40.87, "pixels": [768, 413], "sourcePixels": [1536, 1024], "sourceCrop": [183, 152, 1413, 814], "alphaExtrema": [0, 255], "sha256": "955bb780f34142f0f9302839283022730bfd1c7688c48c46ac59cc18ad994d4b" }, "starlink": { "file": "assets/encounters/v400/starlink.png", "w": 112, "h": 69.271, "pixels": [768, 475], "sourcePixels": [1559, 1009], "sourceCrop": [76, 97, 1491, 973], "alphaExtrema": [0, 255], "sha256": "3988083ecbf0294a0c50b44df0bd8283347a56d5d9ffabe36ff6aa3a281d9e08" }, "regulatorDrone": { "file": "assets/encounters/v400/regulatorDrone.png", "w": 106, "h": 47.065, "pixels": [768, 341], "sourcePixels": [1536, 1024], "sourceCrop": [15, 176, 1521, 845], "alphaExtrema": [0, 255], "sha256": "99140365f63c6e6af46fafbfd90380459ae5e0a4e5709dfc371ebd1c3a5cf830" }, "reptileHead": { "file": "assets/encounters/v400/reptileHead.png", "w": 68, "h": 79.416, "pixels": [274, 320], "sourcePixels": [1173, 1341], "sourceCrop": [121, 97, 1077, 1212], "alphaExtrema": [0, 255], "sha256": "dc627f44d9efbaae3b93c44c5377ce25b518751b691071cf11a26f3670bcfa49" }, "moltenVat": { "file": "assets/encounters/v400/moltenVat.png", "w": 164, "h": 134.745, "pixels": [768, 631], "sourcePixels": [1351, 1164], "sourceCrop": [54, 71, 1298, 1093], "alphaExtrema": [0, 255], "sha256": "f7fe4d31e0588da095c2647e5548d3b8bebdd67aa9cbdcfe6e619963bd1198ca" } });

// supabase/rulesets/roadster-v430/content.js
function freeze5(value) {
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) freeze5(item);
    Object.freeze(value);
  }
  return value;
}
var BIOMES5 = freeze5(["spaceport", "tesla-factory"]);
var BIOME_CYCLE5 = freeze5(["spaceport", "tesla-factory"]);
var ANIMATIONS5 = freeze5(["taunt", "angry-look", "point-and-laugh", "trampoline-bounce", "money-guns", "podcast", "throw", "lightning", "reptile", "look"]);
var ASSETS5 = freeze5({
  ...Object.fromEntries(Object.entries(ENEMY_SPRITES3).map(([id2, s]) => ["encounter_" + id2, { file: s.file }])),
  encounter_moltenVat: { file: "assets/encounters/v411/moltenVat.png" },
  collage: { file: "collage-atlas.png" },
  extras: { file: "collage-extras.png" },
  cast: { file: "paper-cast.png" },
  photos: { file: "obstacle-photos.png" },
  joe: { file: "assets/characters/joe-rogan.png" },
  amber: { file: "assets/characters/amber-head-v247.png" },
  drone: { file: "assets/obstacles/phantom-v3.png" }
});
var none5 = { enabled: false };
var reaction5 = (animationId, trigger = "near", range = 300, space = "target") => ({ enabled: true, animationId, trigger, range, space });
function define5(base, options = {}) {
  return freeze5({
    ...base,
    definitionVersion: 1,
    category: options.category || "object",
    placement: base.altitude ? "air" : "ground",
    anchor: base.altitude ? "air-bottom-center" : "ground-center",
    biomes: options.biomes || "all",
    visual: { renderer: options.renderer || "prop", key: options.key || base.id, assets: options.assets || [], bob: options.bob || false },
    collision: options.collision || "box",
    reactions: { hero: options.hero || none5, obstacle: options.obstacle || none5 },
    collectible: true,
    provenance: "assets-provenance.json"
  });
}
function spriteDefinition3(id2, name2, options, altitude = 0) {
  const s = ENEMY_SPRITES3[
    /** @type {keyof typeof ENEMY_SPRITES} */
    id2
  ];
  return define5({ id: id2, name: name2, w: s.w, h: s.h, inset: id2 === "t800" ? 10 : 5, ...altitude ? { altitude } : {} }, { ...options, renderer: "sprite", assets: ["encounter_" + id2] });
}
var OBSTACLES5 = freeze5([
  define5({ id: "v8", name: "V8 \u2022 VERY LOUD", w: 108, h: 36 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define5({ id: "trump", name: "TARIFF MAN", w: 54, h: 94 }, { renderer: "character", assets: ["collage"], category: "person", bob: true, hero: reaction5("taunt"), obstacle: reaction5("angry-look") }),
  define5({ id: "protest", name: "COUCH CRITICS", w: 102, h: 94 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "group" }),
  define5({ id: "truck", name: "CYBERBRICK", w: 110, h: 41 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define5({ id: "doge", name: "MUCH WOW", w: 52, h: 64 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "animal" }),
  define5({ id: "pump", name: "BIG OIL", w: 54, h: 78 }, {}),
  define5({ id: "zuck", name: "ZUCK", w: 62, h: 94, inset: 5 }, { renderer: "character", assets: ["cast"], category: "person", hero: reaction5("money-guns", "airborne-near"), obstacle: reaction5("money-guns", "airborne-near") }),
  define5({ id: "openai", name: "OPENAI", w: 70, h: 68, inset: 5 }, { category: "emblem" }),
  define5({ id: "claude", name: "CLAUDE", w: 84, h: 73, inset: 6 }, { category: "emblem" }),
  define5({ id: "gemini", name: "GEMINI", w: 58, h: 78, inset: 4 }, { category: "emblem" }),
  define5({ id: "rogozin", name: "ROGOZIN / TRAMPOLINE", w: 88, h: 130, inset: 4 }, { renderer: "character", assets: ["cast"], category: "person", biomes: ["spaceport"], collision: "trampoline", hero: reaction5("point-and-laugh", "airborne-near"), obstacle: reaction5("trampoline-bounce", "passage") }),
  define5({ id: "amber", name: "AMBER HEARD", w: 58, h: 94, inset: 9 }, { renderer: "character", assets: ["amber"], category: "person", obstacle: reaction5("throw", "passage") }),
  define5({ id: "joe", name: "JOE ROGAN", w: 76, h: 94, inset: 10 }, { renderer: "character", assets: ["joe"], category: "person", hero: reaction5("podcast", "passage", 650, "self"), obstacle: reaction5("podcast", "passage", 650, "self") }),
  define5({ id: "muscleCoupe", name: "AMERICAN MUSCLE", w: 138, h: 45, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define5({ id: "muscleCompact", name: "SMALL BLOCK / BIG EGO", w: 112, h: 38, inset: 5 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define5({ id: "pickup", name: "BIG TRUCK ENERGY", w: 140, h: 57, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  ...[
    ["homelessRow", "SPARE CHANGE", "group", "all"],
    ["t800", "T-800 / AUTOMATION", "person", ["tesla-factory"]],
    ["bydSeal", "BYD SEAL", "vehicle", ["tesla-factory"]],
    ["xiaomiSu7", "XIAOMI SU7", "vehicle", ["tesla-factory"]],
    ["batteryAgv", "BATTERY SWAP", "vehicle", ["tesla-factory"]]
  ].map(([id2, name2, category, biomes]) => spriteDefinition3(String(id2), String(name2), { category: String(category), biomes: Array.isArray(biomes) ? biomes : "all" })),
  ...[
    ["ufo", "UNIDENTIFIED FLYING OPPORTUNITY", "all"],
    ["primeDrone", "PRIME PERSONAL SPACE", "all"],
    ["twitterBird", "THE FORMER BIRD", ["spaceport"]],
    ["starlink", "STARLINK / WRONG ORBIT", ["spaceport"]],
    ["regulatorDrone", "APPROVAL PENDING", "all"],
    ["sikorsky", "SIKORSKY / VS-300", ["spaceport"]],
    ["qualitySkull", "QUALITY CONTROL", ["tesla-factory"]]
  ].map(([id2, name2, biomes]) => spriteDefinition3(String(id2), String(name2), { category: "flying enemy", biomes: Array.isArray(biomes) ? biomes : "all", collision: "box", hero: reaction5(id2 === "ufo" ? "reptile" : "look", "near", 320) }, 32)),
  spriteDefinition3("xi", "COMRADE XI", { category: "person", biomes: ["tesla-factory"], collision: "box", hero: reaction5("lightning", "near", 380), obstacle: reaction5("lightning", "near", 380) })
]);
var PROP_TYPES5 = freeze5(OBSTACLES5.filter((o) => ["muscleCoupe", "muscleCompact", "pickup"].includes(o.id)));
var AIR_TYPES5 = freeze5(OBSTACLES5.filter((o) => o.placement === "air"));
var definitionsById5 = new Map(OBSTACLES5.map((o) => [o.id, o]));
var obstacleDefinition5 = (id2) => definitionsById5.get(id2);
function validateContent5(definitions = OBSTACLES5) {
  const errors = [], ids = /* @__PURE__ */ new Set();
  for (const o of definitions) {
    if (!o.id || ids.has(o.id)) errors.push(`duplicate or missing id: ${o.id}`);
    ids.add(o.id);
    if (!Number.isFinite(o.w) || !Number.isFinite(o.h) || o.w <= 0 || o.h <= 6) errors.push(`${o.id}: invalid size`);
    if (!["ground", "air"].includes(o.placement)) errors.push(`${o.id}: invalid placement`);
    if (o.placement === "air" && (!Number.isFinite(o.altitude) || !(Number(o.altitude) > 0))) errors.push(`${o.id}: invalid altitude`);
    if (o.placement === "ground" && o.altitude) errors.push(`${o.id}: ground altitude`);
    if (!["ground-center", "air-bottom-center"].includes(o.anchor)) errors.push(`${o.id}: invalid anchor`);
    if (o.biomes !== "all" && (!Array.isArray(o.biomes) || !o.biomes.length || o.biomes.some((b) => !BIOMES5.includes(b)))) errors.push(`${o.id}: unknown biome`);
    if (!o.visual || !["photo", "cutout", "character", "prop", "drone", "sprite"].includes(o.visual.renderer)) errors.push(`${o.id}: missing renderer`);
    for (const id2 of o.visual?.assets || []) if (!Object.hasOwn(ASSETS5, id2)) errors.push(`${o.id}: unknown asset ${id2}`);
    if (!["box", "trampoline", "none"].includes(o.collision)) errors.push(`${o.id}: missing collision profile`);
    if (o.inset !== void 0 && (!Number.isFinite(o.inset) || o.inset < 0 || o.inset * 2 >= o.w)) errors.push(`${o.id}: invalid inset`);
    for (
      const direction of
      /** @type {const} */
      ["hero", "obstacle"]
    ) {
      const r = o.reactions?.[direction];
      if (!r || typeof r.enabled !== "boolean") errors.push(`${o.id}: missing ${direction} reaction`);
      else if (r.enabled && (!ANIMATIONS5.includes(r.animationId) || !["near", "airborne-near", "passage"].includes(r.trigger) || !(r.range > 0) || !["target", "self"].includes(r.space))) errors.push(`${o.id}: missing animation ${r.animationId}`);
    }
  }
  return errors;
}
var contentErrors5 = validateContent5();
if (contentErrors5.length) throw new Error(`Invalid content: ${contentErrors5.join("; ")}`);

// supabase/rulesets/roadster-v430/physics.js
var STEP5 = 1 / 120;
function rogozinBounce5(time) {
  return 20 * Math.abs(Math.sin(time * 4.5));
}
function obstacleBoxes5(o, time = 0) {
  if ((o.collision || obstacleDefinition5(o.id)?.collision) === "trampoline") {
    return [
      { left: 6, right: o.w - 6, top: 16 },
      { left: o.w / 2 - 18, right: o.w / 2 + 18, top: 108 + rogozinBounce5(time) }
    ];
  }
  const inset = o.inset ?? 5;
  return [{ left: inset, right: o.w - inset, top: o.h - 6 }];
}

// supabase/rulesets/roadster-v430/fall.js
var clamp9 = (x) => Math.max(0, Math.min(1, x));
var ease5 = (x) => {
  x = clamp9(x);
  return x * x * (3 - 2 * x);
};
var mix5 = (a, b, t) => a + (b - a) * t;
var FALL_CONTACTS5 = Object.freeze([0.14, 0.36, 0.56]);
var FALL_CAR_CONTACTS5 = Object.freeze([0.16, 0.38]);
var FALL_CAR_HULL5 = Object.freeze([[-49, -7], [-8, -15], [8, -15], [48.5, 0], [47, 6], [27, 12], [-34, 12], [-46, 5]].map(Object.freeze));
function fallCarSupport5(angle) {
  return Math.max(...FALL_CAR_HULL5.map(([x, y]) => x * Math.sin(angle) + y * Math.cos(angle)));
}
var arc5 = (p, a, b, height) => {
  const t = clamp9((p - a) / (b - a));
  return t < 1e-12 || t > 1 - 1e-12 ? 0 : height * 4 * t * (1 - t);
};
var pulse5 = (p, hit) => ease5((p - hit + 0.035) / 0.035) * (1 - ease5((p - hit) / 0.055));
function track5(keys, p) {
  let i = 1;
  while (i < keys.length - 1 && p > keys[i][0]) i++;
  const [a, b] = [keys[i - 1], keys[i]];
  return mix5(a[1], b[1], ease5((p - a[0]) / (b[0] - a[0])));
}
function createFall5() {
  return { active: false, age: 0, duration: GAMEPLAY5.fallSeconds, rate: 1, taps: 0, angle: 0, reduced: false };
}
function beginFall5(f, result, { reduced = false, speed = GAMEPLAY5.startSpeed } = {}) {
  const angle = Math.atan2(Math.sin(result.angle), Math.cos(result.angle));
  const severity = clamp9((speed - GAMEPLAY5.startSpeed) / (GAMEPLAY5.maxSpeed - GAMEPLAY5.startSpeed));
  Object.assign(f, { active: true, age: 0, duration: GAMEPLAY5.fallSeconds + GAMEPLAY5.fallSpeedSeconds * severity, rate: 1, taps: 0, angle, reduced });
}
function hastenFall5(f) {
  if (!f.active) return false;
  f.taps++;
  f.rate = Math.min(GAMEPLAY5.fallMaxRate, f.rate + GAMEPLAY5.fallTapRate);
  return true;
}
function advanceFall5(f, dt) {
  if (!f.active) return { impacts: 0, finished: false };
  const previous = f.age;
  f.age = Math.min(f.duration, f.age + dt * f.rate);
  const impacts = FALL_CONTACTS5.filter((t) => previous < f.duration * t && f.age >= f.duration * t).length;
  f.active = f.age < f.duration;
  return { impacts, finished: !f.active };
}
function fallPose5(f) {
  const p = clamp9(f.age / f.duration), sit = ease5(p / 0.14), stand = ease5((p - 0.68) / 0.16), gather = ease5((p - 0.7) / 0.22), settle = clamp9((p - 0.97) / 0.03);
  const impact = Math.max(...FALL_CONTACTS5.map((hit) => pulse5(p, hit))), seat = sit * (1 - stand);
  const crouch = (0.72 + 0.18 * impact) * seat + (settle === 1 ? 0 : 0.1 * Math.sin(settle * Math.PI));
  const lift = p < 0.36 ? arc5(p, 0.14, 0.36, 32) : p < 0.56 ? arc5(p, 0.36, 0.56, 28) : arc5(p, 0.56, 0.97, 112);
  const angle = mix5(f.angle, -0.64, sit) * (1 - stand);
  const seatAnchor = -11 * Math.sin(angle) + (22.5 + 27 * crouch) * Math.cos(angle) + 9;
  const rider = { x: 34 * sit * (1 - gather), y: mix5(95, seatAnchor, seat) + lift, angle, seat, crouch, lift };
  const entry = (y) => ({ x: Math.sin(f.angle) * (y - 65), y: 65 + Math.cos(f.angle) * (y - 65) });
  const e = entry(95), c = entry(12);
  rider.x += e.x * (1 - sit);
  rider.y += (e.y - 95) * (1 - sit);
  const carAngle = track5([[0, f.angle], [0.16, 0.95], [0.29, Math.PI], [0.38, 2 * Math.PI - 1.02], [0.54, 2 * Math.PI], [1, 2 * Math.PI]], p);
  const carHop = p < 0.16 ? arc5(p, 0, 0.16, 20) : p < 0.38 ? arc5(p, 0.16, 0.38, 22) : arc5(p, 0.38, 0.54, 8);
  const car = { x: gather === 1 ? 0 : mix5(c.x, -88, ease5(p / 0.16)) * (1 - gather), y: p >= 0.54 ? 12 : mix5(c.y, fallCarSupport5(carAngle) + carHop, ease5(p / 0.06)), angle: carAngle, phase: 0 };
  let shake = 0;
  for (const hit of FALL_CONTACTS5) if (p >= hit) shake = Math.max(shake, Math.exp(-(p - hit) * 40));
  const pose = { car, rider, crouch, impact, flail: sit * (1 - ease5((p - 0.82) / 0.12)), push: 0, shake: shake * 2.4, progress: p };
  if (f.reduced) {
    pose.car = { x: 0, y: 12, angle: 0, phase: 0 };
    pose.rider = { x: 0, y: 95, angle: 0, seat: 0, crouch };
    pose.shake = 0;
    pose.push = 0;
    pose.flail = 0;
  }
  return pose;
}
function fallPolygons5(pose) {
  const seat = pose.rider.seat || 0, crouch = pose.rider.crouch || 0;
  const rider = [[-23, -70 + 4 * seat], [23 + 48 * seat, -70 + 4 * seat], [23 + 48 * seat, 68 - 27 * crouch], [-23, 68 - 27 * crouch]];
  return [[pose.car, FALL_CAR_HULL5.map(([x, y]) => [x, -y])], [pose.rider, rider]].map(([body2, vertices]) => {
    const c = Math.cos(body2.angle), s = Math.sin(body2.angle);
    return vertices.map(([x, y]) => ({ x: body2.x + c * x + s * y, y: body2.y - s * x + c * y }));
  });
}
function interpolateFall5(a, b, t) {
  const pose = {};
  for (const part of ["car", "rider"]) {
    pose[part] = {};
    for (const k of ["x", "y", "angle", "seat", "crouch", "phase"]) pose[part][k] = mix5(a[part][k] || 0, b[part][k] || 0, t);
  }
  return pose;
}

// supabase/rulesets/roadster-v430/gameplay.js
var TAU5 = Math.PI * 2;
var clamp10 = (x, a, b) => Math.max(a, Math.min(b, x));
var approach5 = (x, target, amount) => x < target ? Math.min(target, x + amount) : Math.max(target, x - amount);
function uprightError5(angle, direction = -1) {
  let e = ((angle + Math.PI) % TAU5 + TAU5) % TAU5 - Math.PI;
  if (Math.abs(Math.abs(e) - Math.PI) < 1e-9) e = -Math.sign(direction || -1) * Math.PI;
  return e;
}
function createFlight5(fuel = GAMEPLAY5.initialFuel) {
  return { y: 0, vy: 0, vx: 0, angle: 0, omega: 0, airborne: false, time: 0, fuel, thrusting: false, latched: false, attach: 0, maxTurn: 0, turns: 0, lastDirection: -1, trickStarted: false, grab: 0, launchVelocity: 0, jumpFactor: 1 };
}
function launch5(p, charge = 0) {
  if (p.airborne) return false;
  Object.assign(p, { y: 1e-3, vy: (GAMEPLAY5.jumpSpeed + GAMEPLAY5.chargedSpeed * clamp10(charge, 0, 1)) * (p.jumpFactor || 1), angle: 0, omega: 0, airborne: true, time: 0, latched: false, attach: 0, maxTurn: 0, turns: 0, trickStarted: false, grab: 0, launchVelocity: (GAMEPLAY5.jumpSpeed + GAMEPLAY5.chargedSpeed * clamp10(charge, 0, 1)) * (p.jumpFactor || 1) });
  return true;
}
function advanceFlight5(p, dt, { spin = false, thrust = false } = {}) {
  p.thrusting = false;
  const gripTarget = p.airborne && spin ? 1 : 0;
  p.grab = approach5(p.grab, gripTarget, dt / (gripTarget ? 0.12 : 0.18));
  if (!p.airborne) {
    p.vx *= Math.exp(-GAMEPLAY5.horizontalDrag * dt);
    return null;
  }
  p.time += dt;
  if (spin) {
    p.trickStarted = true;
    p.lastDirection = -1;
    p.omega = approach5(p.omega, -GAMEPLAY5.spinSpeed, GAMEPLAY5.spinAcceleration * dt);
  } else {
    const target = Math.sign(p.omega) * Math.min(Math.abs(p.omega), GAMEPLAY5.releaseSpeed);
    p.omega = approach5(p.omega, target, GAMEPLAY5.releaseDeceleration * dt);
  }
  p.angle += p.omega * dt;
  p.maxTurn = Math.max(p.maxTurn, -p.angle);
  p.turns = Math.floor((p.maxTurn + 1e-7) / TAU5);
  const burn = thrust ? Math.min(dt, p.fuel / GAMEPLAY5.fuelPerSecond) : 0;
  if (burn > 0) {
    p.fuel = Math.max(0, p.fuel - burn * GAMEPLAY5.fuelPerSecond);
    p.thrusting = true;
    p.latched = true;
    p.vx += Math.sin(p.angle) * GAMEPLAY5.thrustAcceleration * burn;
    p.vy += Math.cos(p.angle) * GAMEPLAY5.thrustAcceleration * burn;
  }
  if (p.latched) p.attach = Math.min(1, p.attach + dt / GAMEPLAY5.attachSeconds);
  p.vx = clamp10(p.vx * Math.exp(-GAMEPLAY5.horizontalDrag * dt), -GAMEPLAY5.maxHorizontal, GAMEPLAY5.maxHorizontal);
  p.y += p.vy * dt - 0.5 * GAMEPLAY5.gravity * dt * dt;
  p.vy -= GAMEPLAY5.gravity * dt;
  if (p.y > 0) return null;
  const good = Math.abs(uprightError5(p.angle)) <= GAMEPLAY5.landingAngle + 1e-9 && Math.abs(p.omega) <= GAMEPLAY5.landingOmega;
  const turns = good ? Math.max(p.turns, Math.round(-p.angle / TAU5)) : p.turns;
  const perfect = good && Math.abs(uprightError5(p.angle)) <= GAMEPLAY5.perfectAngle + 1e-9;
  const result = { good, perfect, turns, impact: Math.abs(p.vy), angle: p.angle, omega: p.omega };
  p.turns = turns;
  p.y = 0;
  p.vy = 0;
  p.airborne = false;
  p.thrusting = false;
  if (result.good) {
    p.angle = 0;
    p.omega = 0;
  }
  return result;
}
function createEconomy5() {
  return { scoreFactor: 1, bonus: 0, multiplier: 10, meter: 0, decay: 0, streak: 0, streakLeft: 0, flips: 0 };
}
function comboSeconds5(e) {
  return GAMEPLAY5.comboDuration - GAMEPLAY5.comboFalloff * (e.multiplier / 10 - 1);
}
function rewardAction5(e, count = 1) {
  e.multiplier = Math.min(GAMEPLAY5.maxMultiplier, e.multiplier + count * GAMEPLAY5.multiplierStep);
  e.meter = 1;
  e.decay = 0;
}
function advanceEconomy5(e, dt) {
  if (e.meter > 0) {
    const used = Math.min(dt, e.meter * comboSeconds5(e));
    e.meter = Math.max(0, e.meter - used / comboSeconds5(e));
    dt -= used;
  }
  if (e.meter === 0 && e.multiplier > 10) {
    e.decay += dt;
    while (e.decay + 1e-9 >= GAMEPLAY5.comboDecaySeconds && e.multiplier > 10) {
      e.multiplier--;
      e.decay -= GAMEPLAY5.comboDecaySeconds;
    }
  }
}
function advanceStreak5(e, dt) {
  const used = Math.min(dt, e.streakLeft);
  e.streakLeft -= used;
  e.streak = Math.max(0, e.streak - (dt - used) * GAMEPLAY5.streakDecay);
}
function passObstacle5(e) {
  const points = GAMEPLAY5.obstaclePoints * e.multiplier / 10 * (e.scoreFactor || 1);
  e.bonus += points;
  return points;
}
function settleLanding5(e, p, result, { late = 0, near = 0 } = {}) {
  if (!result.good) {
    e.multiplier = 10;
    e.meter = 0;
    e.decay = 0;
    e.streak = 0;
    e.streakLeft = 0;
    return { points: 0, turns: 0, late: 0, near: 0, perfect: false, good: false };
  }
  const n = result.turns, perfect = !!result.perfect, points = (GAMEPLAY5.flipFactor * n * (n + 1) + GAMEPLAY5.nearPoints * (late + near) + GAMEPLAY5.perfectPoints * Number(perfect)) * e.multiplier / 10 * (e.scoreFactor || 1);
  e.bonus += points;
  e.flips += n;
  p.fuel = Math.min(GAMEPLAY5.tank, p.fuel + GAMEPLAY5.fuelPerFlip * n);
  if (n + late + near + Number(perfect)) rewardAction5(e, n + late + near + Number(perfect));
  if (n || near) {
    e.streak = Math.min(GAMEPLAY5.maxStreak, e.streak + GAMEPLAY5.streakStep);
    e.streakLeft = GAMEPLAY5.streakHold;
  }
  return { points, turns: n, late, near, perfect, good: true };
}
function createPace5() {
  return { boost: 0, progress: 0, base: GAMEPLAY5.startSpeed, speed: GAMEPLAY5.startSpeed, recovery: null, stumble: 0, falling: false };
}
function stumble5(pace) {
  const target = pace.recovery?.target ?? pace.base, r = clamp10((target - GAMEPLAY5.startSpeed) / (GAMEPLAY5.maxSpeed - GAMEPLAY5.startSpeed), 0, 1);
  pace.recovery = { target, age: 0, duration: GAMEPLAY5.recoveryMin + GAMEPLAY5.recoveryExtra * r ** 1.5 };
  pace.stumble = GAMEPLAY5.stumbleSeconds;
  pace.base = target * GAMEPLAY5.recoveryRatio;
}
function recoverySpeed5(r, t) {
  const T = r.duration, d = r.target * (1 - GAMEPLAY5.recoveryRatio), v0 = r.target * GAMEPLAY5.recoveryRatio, h = 0.15, a = T - h;
  if (t <= a) return v0 + d * (t / T) ** 2;
  const u = clamp10((t - a) / h, 0, 1), start = v0 + d * (a / T) ** 2, slope = 2 * d * a / T ** 2, endSlope = r.target >= GAMEPLAY5.maxSpeed ? 0 : (GAMEPLAY5.maxSpeed - GAMEPLAY5.startSpeed) / GAMEPLAY5.rampSeconds;
  return (2 * u ** 3 - 3 * u * u + 1) * start + (u ** 3 - 2 * u * u + u) * h * slope + (-2 * u ** 3 + 3 * u * u) * r.target + (u ** 3 - u * u) * h * endSlope;
}
function advancePace5(pace, e, p, dt) {
  if (pace.recovery) {
    pace.stumble = Math.max(0, pace.stumble - dt);
    const r = pace.recovery;
    r.age = Math.min(r.duration, r.age + dt);
    pace.base = recoverySpeed5(r, r.age);
    if (r.age >= r.duration) {
      pace.base = r.target;
      pace.recovery = null;
    }
  } else if (!pace.falling) {
    pace.progress += dt;
    pace.base = GAMEPLAY5.startSpeed + (GAMEPLAY5.maxSpeed - GAMEPLAY5.startSpeed) * Math.min(1, pace.progress / GAMEPLAY5.rampSeconds);
  }
  pace.speed = Math.max(60, pace.base * (1 + e.streak) * (1 + (pace.boost || 0)) + p.vx);
  return pace.speed;
}
function playerPolygons5(p) {
  if (p.fallPose) return fallPolygons5(p.fallPose);
  const c = Math.cos(p.angle), s = Math.sin(p.angle);
  return [[-47, 0, 47, 25], [-23, 25, 23, 163 - 32 * (p.grab || 0)]].map(([l, b, r, t]) => [[l, b], [r, b], [r, t], [l, t]].map(([x, y]) => ({ x: c * x + s * (y - 65), y: p.y + 65 - s * x + c * (y - 65) })));
}
function overlaps5(poly, rect) {
  const axes = [{ x: 1, y: 0 }, { x: 0, y: 1 }];
  for (let i = 0; i < (poly.length === 4 ? 2 : poly.length); i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    axes.push({ x: -(b.y - a.y), y: b.x - a.x });
  }
  for (const a of axes) {
    let pmin = Infinity, pmax = -Infinity, rmin = Infinity, rmax = -Infinity;
    for (const p of poly) {
      const value = p.x * a.x + p.y * a.y;
      pmin = Math.min(pmin, value);
      pmax = Math.max(pmax, value);
    }
    for (const p of rect) {
      const value = p.x * a.x + p.y * a.y;
      rmin = Math.min(rmin, value);
      rmax = Math.max(rmax, value);
    }
    if (pmax <= rmin || rmax <= pmin) return false;
  }
  return true;
}
function collisionAt5(p, o, dx, time = 0) {
  if (o.collision === "none") return false;
  if (dx > 180 || dx + o.w < -180) return false;
  const polygons = playerPolygons5(p);
  return obstacleBoxes5(o, time).some((b) => {
    const bottom = o.altitude || 0, top = bottom + b.top;
    const rect = [{ x: dx + b.left, y: bottom }, { x: dx + b.right, y: bottom }, { x: dx + b.right, y: top }, { x: dx + b.left, y: top }];
    return polygons.some((poly) => overlaps5(poly, rect));
  });
}
function sweptCollision5(before, after, o, dxBefore, dxAfter, time, dt) {
  if (Math.min(dxBefore, dxAfter) > 180 || Math.max(dxBefore, dxAfter) + o.w < -180) return false;
  const fallTravel = before.fallPose && after.fallPose ? Math.max(...["rider", "car"].map((part) => Math.abs(after.fallPose[part].angle - before.fallPose[part].angle) * (part === "car" ? 55 : 170) + Math.abs(after.fallPose[part].y - before.fallPose[part].y) + Math.abs(after.fallPose[part].x - before.fallPose[part].x))) : 0;
  const n = Math.max(1, Math.ceil((Math.abs(dxAfter - dxBefore) + Math.abs(after.y - before.y) + Math.abs(after.angle - before.angle) * 170 + fallTravel) / 4));
  for (let i = 0; i <= n; i++) {
    const f = i / n, p = { y: before.y + (after.y - before.y) * f, angle: before.angle + (after.angle - before.angle) * f, grab: (before.grab || 0) + ((after.grab || 0) - (before.grab || 0)) * f };
    if (before.fallPose && after.fallPose) p.fallPose = interpolateFall5(before.fallPose, after.fallPose, f);
    if (collisionAt5(p, o, dxBefore + (dxAfter - dxBefore) * f, time - dt + dt * f)) return true;
  }
  return false;
}
function nearWindow5(distance, speed) {
  return distance >= 0 && distance <= Math.max(0, speed) * GAMEPLAY5.nearSeconds + 1e-8;
}

// supabase/rulesets/roadster-v430/biomes.js
var BIOME_SCORE_STEP3 = 7e3;
var SCENERY_CYCLE3 = BIOME_CYCLE5;
function biomeAt3(score = 0) {
  const points = Number.isFinite(score) ? Math.max(0, score) : 0;
  const leg = Math.floor(points / BIOME_SCORE_STEP3), nextAt = (leg + 1) * BIOME_SCORE_STEP3;
  return { id: SCENERY_CYCLE3[leg % SCENERY_CYCLE3.length], leg, nextAt, nextIn: nextAt - points };
}

// supabase/rulesets/roadster-v430/routes.js
var STAGES5 = GAMEPLAY5.stages;
function stageAt5(progress) {
  return STAGES5.filter((t) => progress >= t).length - 1;
}
function makePattern5(kind, { speed = 360, type = { id: "truck", w: 110, h: 41 }, dx = 900 } = {}) {
  const item = (o, offset = 0) => ({ ...o, x: dx + offset, passed: false });
  if (kind === "air") return [item(type)];
  if (kind === "hover" || kind === "incoming") return [item(type)];
  if (kind === "precision") {
    const span = Math.min(200, Math.max(110, speed * 0.4 - 94)), cars = [], n = Math.min(2, Math.ceil(span / 110)), width = (span - 20 * (n - 1)) / n;
    for (let i = 0; i < n; i++) cars.push(item({ id: "truck", name: "CYBERBRICK", w: width, h: 41 * width / 110, inset: 4 }, i * (width + 20)));
    cars.push(item({ id: "truck", name: "CYBERBRICK", w: 110, h: 41, inset: 5 }, speed * 1.15));
    return cars;
  }
  if (kind === "mixed") return [item(type), item(type.h <= 57 ? type : { id: "truck", name: "CYBERBRICK", w: 110, h: 41, inset: 5 }, speed * 1.65)];
  if (kind === "thrust") {
    const n = Math.min(6, Math.max(4, Math.ceil(speed * 1.65 / 165)));
    return Array.from({ length: n }, (_, i) => item({ id: "truck", name: "CYBERBRICK", w: 110, h: 41, inset: 5 }, i * 165));
  }
  if (kind === "pair") return [item(type), item(type, speed * 1.5)];
  return [item(type)];
}
function validateRoute5(obstacles, { flight = createFlight5(), pace = createPace5(), economy = createEconomy5(), time = 0, boosterState = null, allowThrust = true, burns = null, timingMargin = 0, leads = [0.1, 0.11, 0.115, 0.12, 0.125, 0.14, 0.16, 0.2, 0.3, 0.4, 0.5, 0.65], charges = [0, 0.5, 1] } = {}) {
  if (flight.airborne || pace.stumble > 0) return null;
  for (const charge of charges) for (const lead of leads) for (const burn of burns ?? (allowThrust && flight.fuel > 0 ? [0, 0.35, 0.65, 1.1] : [0])) {
    const q = boosterState ? structuredClone(boosterState) : null;
    const p = { ...flight }, r = structuredClone(pace), e = { ...economy }, obs = obstacles.map((o) => ({ ...o })), actions = [];
    let charging = false, held = 0, elapsed = 0, lateTarget = null, lastThrust = false, nearLandings = 0, lateTakeoffs = 0;
    const dt = 1 / 120;
    for (let tick = 0; tick < 1440; tick++) {
      elapsed = tick * dt;
      const next = obs.find((o) => o.x + o.w > -47 && (!o.altitude || o.altitude < 163));
      if (!p.airborne && next) {
        const ttc = (next.x + (next.inset || 5) - 47) / Math.max(1, r.speed + (next.approachSpeed || 0));
        if (!charging && ttc <= lead + charge * GAMEPLAY5.chargeSeconds) {
          charging = true;
          held = 0;
          actions.push({ at: elapsed, action: "hold" });
        }
        if (charging) {
          held += dt;
          if (held + 1e-9 >= charge * GAMEPLAY5.chargeSeconds + (charge > 0 ? dt : 0)) {
            lateTarget = nearWindow5(next.x + (next.inset || 5) - 47, r.speed + (next.approachSpeed || 0)) ? next : null;
            p.jumpFactor = q && activeBooster(q, "jump") ? 1.25 : 1;
            launch5(p, charge);
            charging = false;
            actions.push({ at: elapsed, action: "jump", charge });
          }
        }
      }
      if (q) {
        advanceBoosters(q, dt);
        r.boost = 0.35 * q.speedBlend;
        e.scoreFactor = activeBooster(q, "score") ? 3 : 1;
      }
      const before = { ...p }, useThrust = p.airborne && p.time >= 0.18 && p.time < 0.18 + burn;
      if (useThrust !== lastThrust) {
        actions.push({ at: elapsed, action: useThrust ? "thrust-on" : "thrust-off" });
        lastThrust = useThrust;
      }
      const landed = advanceFlight5(p, dt, { thrust: useThrust });
      advanceEconomy5(e, dt);
      advanceStreak5(e, dt);
      advancePace5(r, e, p, dt);
      const after = landed ? { ...p, angle: landed.angle } : p;
      let alive = true;
      for (const o of obs) {
        const old = o.x;
        o.x -= (r.speed + (o.approachSpeed || 0)) * dt;
        if (sweptCollision5(before, after, o, old, o.x, time + elapsed, dt)) {
          alive = false;
          break;
        }
        if (!o.passed && o.x + o.w < -50) {
          o.passed = true;
          passObstacle5(e);
        }
      }
      if (!alive || landed && !landed.good) break;
      if (landed) {
        let near = 0;
        const late = lateTarget && lateTarget.x + lateTarget.w - (lateTarget.inset || 5) < -47 ? 1 : 0;
        for (const o of obs) if (!o.altitude && !o.nearPaid && nearWindow5(-47 - (o.x + o.w - (o.inset || 5)), r.speed)) {
          near++;
          o.nearPaid = true;
        }
        settleLanding5(e, p, landed, { late, near });
        nearLandings += near;
        lateTakeoffs += late;
        lateTarget = null;
      }
      if (obs.every((o) => o.x + o.w < -180) && !p.airborne) {
        if (timingMargin > 0 && (!validateRoute5(obstacles, { flight, pace, economy, time, boosterState, charges: [charge], leads: [lead - timingMargin], burns: [burn] }) || !validateRoute5(obstacles, { flight, pace, economy, time, boosterState, charges: [charge], leads: [lead + timingMargin], burns: [burn] }))) break;
        return { charge, lead, burn, actions, nearLandings, lateTakeoffs, duration: elapsed, fuelUsed: flight.fuel - p.fuel, exit: { y: 0, angle: 0, vx: p.vx }, clearanceVerified: true, timingMargin };
      }
    }
  }
  return null;
}

// supabase/rulesets/roadster-v430/director.js
function createDirector5({ S, flight, pace, economy, boosters, spawnDistance, sceneTime = () => S.t, random: random3 = Math.random, relative = false }) {
  const initial = () => ({ wave: 0, last: null, fallbacks: 0, waiting: false, hardStreak: 0, leg: -1, legStartedAt: 0, groundSinceAir: 0, airCount: 0, lastAirAt: -1e9 });
  const state = initial();
  function reset() {
    Object.assign(state, initial());
  }
  function spawn() {
    if (flight.airborne || pace.recovery || pace.falling || S.obs.some((o) => !o.passed)) {
      S.next = 0.18;
      state.waiting = true;
      return;
    }
    state.waiting = false;
    const { id: biome, leg } = biomeAt3(S.score || 0);
    if (leg !== state.leg) {
      state.leg = leg;
      state.legStartedAt = S.t;
    }
    const stage = stageAt5(pace.progress), afterAir = state.last?.kind === "air", breath = afterAir || state.wave % 5 === 4 || state.hardStreak >= 2;
    const airDue = leg >= 2 && S.t - state.legStartedAt >= 8 && state.groundSinceAir >= 6 && S.t - state.lastAirAt >= 28;
    const pools = [["single"], ["single"], ["pair", "single"], ["single", "pair"], ["precision", "single", "pair"], ["pair", "precision", "thrust"], ["pair", "precision", "thrust"]];
    let kind = breath || airDue ? "single" : pools[stage][Math.floor(random3() * pools[stage].length)];
    const factoryIds = ["truck", "t800", "bydSeal", "xiaomiSu7", "batteryAgv", "xi"];
    const choices = OBSTACLES5.filter((o) => !o.altitude && o.collision !== "none" && (o.biomes === "all" || o.biomes.includes(biome)) && (biome !== "tesla-factory" || factoryIds.includes(o.id)) && (stage === 0 ? o.h <= 64 : stage < 2 ? o.h <= 94 : true));
    if (kind === "thrust" && flight.fuel < 65) kind = "pair";
    let type = choices[Math.floor(random3() * choices.length)], dx = spawnDistance();
    if (airDue && !breath && state.last?.kind === "single") {
      const first = state.airCount < 2;
      const pool = AIR_TYPES5.filter((o) => (o.biomes === "all" || o.biomes.includes(biome)) && (!first || o.h <= 55 && o.w <= 110));
      const model = pool[Math.floor(random3() * pool.length)];
      type = { ...model, altitude: first ? 24 : 32, approachSpeed: first ? 80 : 110 };
      kind = "air";
      dx = Math.max(dx, (S.speed + type.approachSpeed) * 2);
    }
    let obstacles = makePattern5(kind, { speed: S.speed, type, dx });
    let route = validateRoute5(obstacles, { flight, pace, economy, time: sceneTime(), boosterState: boosters, allowThrust: kind !== "air", timingMargin: kind === "air" ? 0.09 : GAMEPLAY5.routeTimingMargin });
    if (route && route.fuelUsed > 0 && flight.fuel - route.fuelUsed < GAMEPLAY5.routeFuelReserve) route = null;
    if (!route) {
      state.fallbacks++;
      kind = "single";
      obstacles = makePattern5(kind, { speed: S.speed, type: OBSTACLES5.find((o) => o.id === "truck"), dx });
      route = validateRoute5(obstacles, { flight, pace, economy, time: sceneTime(), boosterState: boosters, timingMargin: GAMEPLAY5.routeTimingMargin });
    }
    if (!route) {
      S.next = 0.3;
      return;
    }
    state.hardStreak = ["precision", "thrust"].includes(kind) ? state.hardStreak + 1 : 0;
    if (kind === "air") {
      state.airCount++;
      state.groundSinceAir = 0;
      state.lastAirAt = S.t;
    } else state.groundSinceAir++;
    state.wave++;
    state.last = { kind, stage, biome, leg, route, startedAt: S.t };
    for (const o of obstacles) S.obs.push({ ...o, x: o.x + (relative ? 0 : S.anchor), uid: ++S.entityId, passed: false, nearPaid: false, latePaid: false });
    S.next = kind === "air" ? route.duration + 1.25 : breath ? 2.3 : 1.2;
  }
  return { reset, spawn, state };
}

// supabase/rulesets/roadster-v430/random.js
function createRandom5(seed) {
  if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) throw Error("Invalid run seed");
  let state = seed;
  return { next() {
    state = state + 1831565813 >>> 0;
    let t = state;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }, get state() {
    return state;
  }, restore(value) {
    if (!Number.isInteger(value) || value < 0 || value > 4294967295) throw Error("Invalid random state");
    state = value;
  } };
}

// supabase/rulesets/roadster-v430/run.js
var RULESET5 = "roadster-v4.3.0";
var RUN_STEP5 = 1 / 120;
var RUN_COMMANDS5 = Object.freeze(["primary-down", "primary-up", "primary-cancel", "thrust-on", "thrust-off", "cancel"]);
var MAX_RECORDED_TICKS5 = 120 * 60 * 60;
var MAX_RECORDED_EVENTS5 = 24e3;
function createRun5({ seed = 0, record = true, reducedMotion = false } = {}) {
  const S = { mode: "menu", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY5.startSpeed, next: 1.7, obs: [], entityId: 0, anchor: 0 }, Q = createBoosters(seed), P = createFlight5(), E = createEconomy5(), pace = createPace5(), F = createFall5(), input = { charging: false, charge: 0, spin: false, thrust: false };
  let random3 = createRandom5(seed), events = [], log = [], lateId = null, lastLanding = null, recordable = true;
  const director = createDirector5({ S, flight: P, pace, economy: E, boosters: Q, random: () => random3.next(), relative: true, sceneTime: () => S.t, spawnDistance: () => Math.max(900, S.speed * 1.5 + 180) });
  function clear() {
    Object.assign(input, { charging: false, charge: 0, spin: false, thrust: false });
    P.thrusting = false;
  }
  function sync() {
    S.t = S.tick * RUN_STEP5;
    S.speed = pace.speed;
    S.score = Math.floor(S.distance / 20 + E.bonus);
  }
  function reset(nextSeed = seed) {
    seed = nextSeed;
    random3 = createRandom5(seed);
    Object.assign(Q, createBoosters(seed));
    Object.assign(P, createFlight5());
    Object.assign(E, createEconomy5());
    Object.assign(pace, createPace5());
    Object.assign(F, createFall5());
    Object.assign(S, { mode: "playing", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY5.startSpeed, next: 1.7, obs: [], entityId: 0, lastCharge: 0 });
    clear();
    events = [];
    log = [];
    lateId = null;
    lastLanding = null;
    recordable = true;
    director.reset();
  }
  function jump() {
    if (S.mode !== "playing" || P.airborne || F.active || pace.stumble > 0) return false;
    lateId = null;
    for (const o of S.obs) {
      if (o.altitude || o.passed) continue;
      if (nearWindow5(o.x + (o.inset || 5) - 47, S.speed + (o.approachSpeed || 0))) {
        lateId = o.uid;
        break;
      }
    }
    const charge = input.charge;
    P.jumpFactor = activeBooster(Q, "jump") ? 1.25 : 1;
    Q.spoiledFlight = false;
    launch5(P, charge);
    S.lastCharge = charge;
    input.charging = false;
    input.charge = 0;
    input.spin = false;
    events.push({ type: "jump", charge });
    return true;
  }
  function command(action) {
    if (!RUN_COMMANDS5.includes(action)) throw Error("Unknown run command");
    if (S.mode !== "playing") return false;
    if (record && recordable) {
      if (log.length >= MAX_RECORDED_EVENTS5) recordable = false;
      else log.push([S.tick, RUN_COMMANDS5.indexOf(action)]);
    }
    if (action === "cancel") {
      clear();
      return true;
    }
    if (action === "primary-cancel") {
      input.spin = false;
      input.charging = false;
      input.charge = 0;
      return true;
    }
    if (action === "thrust-off") {
      input.thrust = false;
      return true;
    }
    if (action === "thrust-on") {
      if (!F.active) input.thrust = true;
      return true;
    }
    if (action === "primary-up") {
      if (input.charging) jump();
      input.spin = false;
      return true;
    }
    if (F.active) return hastenFall5(F);
    if (pace.stumble > 0) return false;
    if (P.airborne) {
      P.trickStarted = true;
      input.spin = true;
    } else {
      input.charging = true;
      input.charge = 0;
    }
    return true;
  }
  function step() {
    if (S.mode !== "playing") return { landed: null, impacts: 0 };
    S.tick++;
    if (S.tick > MAX_RECORDED_TICKS5) recordable = false;
    sync();
    if (input.charging) input.charge = Math.min(1, input.charge + RUN_STEP5 / GAMEPLAY5.chargeSeconds);
    advanceBoosters(Q, RUN_STEP5);
    E.scoreFactor = activeBooster(Q, "score") ? 3 : 1;
    pace.boost = 0.35 * Q.speedBlend;
    advanceEconomy5(E, RUN_STEP5);
    advanceStreak5(E, RUN_STEP5);
    const physicsFall = () => fallPose5({ ...F, reduced: false }), wasFalling = F.active, before = { ...P, fallPose: F.active ? physicsFall() : null };
    let landed = null, fallStep = { impacts: 0, finished: false };
    if (wasFalling) {
      fallStep = advanceFall5(F, RUN_STEP5);
      if (fallStep.finished) {
        clear();
        S.next = Math.max(S.next, 0.8);
        events.push({ type: "recovered" });
      }
    } else landed = advanceFlight5(P, RUN_STEP5, { spin: input.spin, thrust: input.thrust });
    pace.falling = F.active;
    advancePace5(pace, E, P, RUN_STEP5);
    S.distance += pace.speed * RUN_STEP5;
    E.bonus += pace.speed * RUN_STEP5 / 20 * (E.scoreFactor - 1);
    sync();
    const after = wasFalling ? { ...P, fallPose: physicsFall() } : landed ? { ...P, angle: landed.angle } : P;
    for (const o of S.obs) {
      const old = o.x;
      o.x -= (S.speed + (o.approachSpeed || 0)) * RUN_STEP5;
      if (o.smashed) {
        o.smashAge += RUN_STEP5;
        continue;
      }
      if (sweptCollision5(before, after, o, old, o.x, S.t, RUN_STEP5)) {
        if (activeBooster(Q, "shield")) {
          o.smashed = true;
          o.smashAge = 0;
          if (!o.passed) {
            o.passed = true;
            passObstacle5(E);
          }
          events.push({ type: "smash", obstacle: { ...o } });
          continue;
        }
        if (Q.grace > 0 || Q.ghostIds.includes(o.uid)) {
          if (!Q.ghostIds.includes(o.uid)) Q.ghostIds.push(o.uid);
        } else if (Q.hearts > 0) {
          const oldMultiplier = E.multiplier;
          Q.hearts--;
          Q.grace = 2;
          Q.ghostIds.push(o.uid);
          Q.spoiledFlight = true;
          E.multiplier = 10;
          E.meter = 0;
          E.decay = 0;
          E.streak = 0;
          E.streakLeft = 0;
          events.push({ type: "rescued", oldMultiplier });
        } else {
          S.mode = "dead";
          clear();
          sync();
          events.push({ type: "death", obstacle: o });
          return { landed, impacts: fallStep.impacts };
        }
      }
      if (!o.passed && o.x + o.w < -50) {
        o.passed = true;
        passObstacle5(E);
        if (o.altitude) events.push({ type: "air-passed" });
      }
    }
    for (const orb of Q.pickups) {
      const old = orb.x;
      orb.x -= S.speed * RUN_STEP5;
      const inReach = Math.min(old, orb.x) <= 74 && Math.max(old, orb.x) >= -74 && Math.abs(P.y + 78 - orb.y) <= 100;
      if (!F.active && inReach && collectBooster(Q, orb.id)) {
        orb.collected = true;
        events.push({ type: "pickup", id: orb.id });
      }
    }
    Q.pickups = Q.pickups.filter((o) => !o.collected && o.x > -180);
    Q.ghostIds = Q.ghostIds.filter((id2) => S.obs.some((o) => o.uid === id2 && o.x + o.w > -180));
    if (landed) {
      let late = 0, near = 0;
      const target = S.obs.find((o) => o.uid === lateId);
      if (target && !target.latePaid && target.x + target.w - (target.inset || 5) < -47) {
        late = 1;
        target.latePaid = true;
      }
      for (const o of S.obs) {
        if (o.altitude || o.nearPaid) continue;
        if (nearWindow5(-47 - (o.x + o.w - (o.inset || 5)), S.speed)) {
          near++;
          o.nearPaid = true;
        }
      }
      const oldMultiplier = E.multiplier;
      lastLanding = settleLanding5(E, P, Q.spoiledFlight ? { ...landed, turns: 0, perfect: false } : landed, Q.spoiledFlight ? { late: 0, near: 0 } : { late, near });
      Q.spoiledFlight = false;
      if (!landed.good) {
        stumble5(pace);
        beginFall5(F, landed, { reduced: reducedMotion, speed: pace.recovery.target });
        pace.falling = true;
        P.angle = 0;
        P.omega = 0;
        P.vx = 0;
        P.grab = 0;
        clear();
        advancePace5(pace, E, P, 0);
      }
      events.push({ type: "landing", landed, result: lastLanding, late, near, oldMultiplier });
      lateId = null;
    }
    if (!P.airborne && Math.abs(P.angle) > 1e-3) {
      P.angle *= Math.exp(-RUN_STEP5 * 18);
      P.omega = 0;
    }
    S.obs = S.obs.filter((o) => o.smashed ? o.smashAge < 1.2 : o.uid === lateId || o.x + o.w > (o.id === "joe" ? -480 : -400));
    offerBooster(Q, { time: S.t, speed: S.speed, clear: !P.airborne && !F.active && !pace.recovery && S.obs.every((o) => o.passed) });
    S.next -= RUN_STEP5;
    if (S.next <= 0 && !Q.pickups.length) director.spawn();
    sync();
    return { landed, impacts: fallStep.impacts };
  }
  function snapshot() {
    return structuredClone({ seed, S, P, E, pace, F, Q, input, random: random3.state, director: director.state, lateId, lastLanding });
  }
  function restore(saved) {
    seed = saved.seed;
    for (const [a, b] of [[Q, saved.Q], [S, saved.S], [P, saved.P], [E, saved.E], [pace, saved.pace], [F, saved.F], [input, saved.input], [director.state, saved.director]]) Object.assign(a, structuredClone(b));
    random3 = createRandom5(seed);
    random3.restore(saved.random);
    lateId = saved.lateId;
    lastLanding = structuredClone(saved.lastLanding);
    events = [];
  }
  function replay() {
    return recordable ? { format: 1, ruleset: RULESET5, seed, ticks: S.tick, events: log.map((e) => [...e]) } : null;
  }
  return { S, P, E, pace, F, Q, input, director, reset, jump, command, step, sync, snapshot, restore, replay, drainEvents() {
    const next = events;
    events = [];
    return next;
  }, get lastLanding() {
    return lastLanding;
  }, get seed() {
    return seed;
  }, get recordable() {
    return recordable;
  } };
}
function validateReplay5(value) {
  if (!value || value.format !== 1 || value.ruleset !== RULESET5 || !Number.isInteger(value.seed) || value.seed < 0 || value.seed > 4294967295 || !Number.isInteger(value.ticks) || value.ticks < 1 || value.ticks > MAX_RECORDED_TICKS5 || !Array.isArray(value.events) || value.events.length > MAX_RECORDED_EVENTS5) throw Error("Invalid or unsupported replay");
  let previous = -1;
  for (const event of value.events) {
    if (!Array.isArray(event) || event.length !== 2 || !Number.isInteger(event[0]) || event[0] < previous || event[0] < 0 || event[0] >= value.ticks || !Number.isInteger(event[1]) || event[1] < 0 || event[1] >= RUN_COMMANDS5.length) throw Error("Invalid replay input");
    previous = event[0];
  }
  return value;
}
function verifyReplay5(value) {
  const replay = validateReplay5(value), run = createRun5({ seed: replay.seed, record: false });
  run.reset();
  let event = 0;
  while (run.S.tick < replay.ticks && run.S.mode === "playing") {
    while (event < replay.events.length && replay.events[event][0] === run.S.tick) run.command(RUN_COMMANDS5[replay.events[event++][1]]);
    run.step();
    run.drainEvents();
  }
  if (run.S.mode !== "dead" || run.S.tick !== replay.ticks || event !== replay.events.length) throw Error("Replay does not end at its first collision");
  return { score: run.S.score, flips: run.E.flips, ticks: run.S.tick };
}

// supabase/rulesets/roadster-v432/run.js
var run_exports6 = {};
__export(run_exports6, {
  RULESET: () => RULESET6,
  RUN_COMMANDS: () => RUN_COMMANDS6,
  RUN_STEP: () => RUN_STEP6,
  createRun: () => createRun6,
  validateReplay: () => validateReplay6,
  verifyReplay: () => verifyReplay6
});

// supabase/rulesets/roadster-v432/boosters.js
var BOOSTERS2 = Object.freeze({
  shield: Object.freeze({ name: "INVINCIBLE", seconds: 8, color: "#7ce5f3" }),
  speed: Object.freeze({ name: "OVERDRIVE", seconds: 8, color: "#ffad62" }),
  jump: Object.freeze({ name: "HIGH JUMP", seconds: 12, color: "#d9ff62" }),
  life: Object.freeze({ name: "EXTRA LIFE", seconds: 0, color: "#ff6a78" }),
  score: Object.freeze({ name: "SCORE \xD73", seconds: 10, color: "#ffc86d" })
});
function createBoosters2(seed = 0) {
  return { active: {}, hearts: 0, grace: 0, ghostIds: [], speedBlend: 0, pickups: [], nextAt: 8, serial: 0, bag: [], random: (seed ^ 2772213271) >>> 0, spoiledFlight: false };
}
var activeBooster2 = (q, id2) => (q?.active[id2] || 0) > 0;
function canCollectBooster(q, id2) {
  return !!BOOSTERS2[id2] && (id2 === "life" ? q.hearts < 2 : activeBooster2(q, id2) || Object.keys(q.active).length < 3);
}
function collectBooster2(q, id2) {
  const def = BOOSTERS2[id2];
  if (!canCollectBooster(q, id2)) return false;
  if (id2 === "life") {
    if (q.hearts >= 2) return false;
    q.hearts++;
    return true;
  }
  if (!activeBooster2(q, id2) && Object.keys(q.active).length >= 3) return false;
  q.active[id2] = def.seconds;
  return true;
}
function advanceBoosters2(q, dt) {
  for (const id2 of Object.keys(q.active)) {
    q.active[id2] = Math.max(0, q.active[id2] - dt);
    if (q.active[id2] === 0) delete q.active[id2];
  }
  q.grace = Math.max(0, q.grace - dt);
  const target = activeBooster2(q, "speed") ? 1 : 0, delta = dt / (target ? 0.6 : 0.8);
  q.speedBlend = target ? Math.min(1, q.speedBlend + delta) : Math.max(0, q.speedBlend - delta);
}
function random2(q) {
  q.random = Math.imul(q.random, 1664525) + 1013904223 >>> 0;
  return q.random / 4294967296;
}
function offerBooster2(q, { time, speed, clear }) {
  if (!clear || q.pickups.length || time < q.nextAt) return null;
  if (!q.bag.length) {
    q.bag = Object.keys(BOOSTERS2);
    for (let i = q.bag.length - 1; i > 0; i--) {
      const j = Math.floor(random2(q) * (i + 1));
      [q.bag[i], q.bag[j]] = [q.bag[j], q.bag[i]];
    }
  }
  const eligible = (id3) => id3 === "life" ? q.hearts < 2 : activeBooster2(q, id3) || Object.keys(q.active).length < 3;
  let index = q.bag.findIndex(eligible);
  if (index < 0) {
    q.nextAt = time + 2;
    return null;
  }
  const id2 = q.bag.splice(index, 1)[0], pickup = { id: id2, uid: ++q.serial, x: Math.max(900, speed * 1.9 + 180), y: q.serial === 1 || random2(q) < 0.55 ? 104 : 240 };
  q.pickups.push(pickup);
  if (q.serial > 1 && random2(q) < 0.4) {
    const second = q.bag.findIndex((other) => other !== id2 && eligible(other));
    if (second >= 0) {
      const next = q.bag.splice(second, 1)[0];
      q.pickups.push({ id: next, uid: ++q.serial, x: pickup.x + 240, y: pickup.y });
    }
  }
  q.nextAt = time + 14 + random2(q) * 6;
  return pickup;
}

// supabase/rulesets/roadster-v432/gameplay-config.js
var GAMEPLAY6 = Object.freeze({
  version: "4.3.2",
  gravity: 1550,
  jumpSpeed: 560,
  chargedSpeed: 440,
  chargeSeconds: 0.4,
  spinSpeed: 7.2,
  spinAcceleration: 60,
  releaseSpeed: 1.8,
  releaseDeceleration: 24,
  landingAngle: Math.PI * 2 / 9,
  landingOmega: Math.PI * 4 / 3,
  perfectAngle: Math.PI / 18,
  perfectPoints: 50,
  thrustAcceleration: 2100,
  horizontalDrag: 1.8,
  maxHorizontal: 260,
  tank: 100,
  initialFuel: 50,
  fuelPerSecond: 80,
  fuelPerFlip: 25,
  attachSeconds: 0.12,
  obstaclePoints: 50,
  flipFactor: 50,
  nearPoints: 25,
  nearSeconds: 0.12,
  maxMultiplier: 50,
  multiplierStep: 1,
  comboDuration: 8,
  comboFalloff: 1.2,
  comboDecaySeconds: 0.5,
  streakStep: 0.05,
  maxStreak: 0.25,
  streakHold: 4,
  streakDecay: 0.1,
  fallSeconds: 2.8,
  fallSpeedSeconds: 0.65,
  fallMaxRate: 1.6,
  fallTapRate: 0.15,
  routeTimingMargin: 0.035,
  routeFuelReserve: 20,
  stumbleSeconds: 0.3,
  recoveryRatio: 0.55,
  recoveryMin: 1.2,
  recoveryExtra: 2.8,
  startSpeed: 360,
  maxSpeed: 660,
  rampSeconds: 150,
  stages: Object.freeze([0, 15, 35, 60, 90, 120, 150]),
  bestKey: "roadster-best-v3",
  tutorialKey: "roadster-coach-v3"
});

// supabase/rulesets/roadster-v432/enemy-sprite-data.js
var ENEMY_SPRITES4 = Object.freeze({ "sikorsky": { "file": "assets/encounters/v400/sikorsky.png", "w": 176, "h": 89.146, "pixels": [768, 389], "sourcePixels": [1536, 1024], "sourceCrop": [13, 146, 1520, 909], "alphaExtrema": [0, 255], "sha256": "5619dd383d0bbb6ed7115f767f21f1e86e720d2aeb9ce3f0f41a182f15da3520" }, "xi": { "file": "assets/encounters/v400/xi.png", "w": 72, "h": 109.281, "pixels": [506, 768], "sourcePixels": [1024, 1536], "sourceCrop": [51, 65, 978, 1471], "alphaExtrema": [0, 255], "sha256": "56f56642f4f29a2b3c6655a442be59d4df5f781327c20299fa9ff596f69c6ac0" }, "t800": { "file": "assets/encounters/v400/t800.png", "w": 57, "h": 109.44, "pixels": [400, 768], "sourcePixels": [1024, 1536], "sourceCrop": [183, 66, 925, 1489], "alphaExtrema": [0, 255], "sha256": "1661f9bf004a65db0c178ca6d7b17e42d9963299f627f450016e9443125495f8" }, "ufo": { "file": "assets/encounters/v400/ufo.png", "w": 104, "h": 47.26, "pixels": [768, 349], "sourcePixels": [1672, 940], "sourceCrop": [141, 130, 1535, 763], "alphaExtrema": [0, 255], "sha256": "926e3e760155afe3acbc9215b35465a78e3a49039762c7ff89f8bf1c1e8ec358" }, "primeDrone": { "file": "assets/encounters/v400/primeDrone.png", "w": 110, "h": 48.984, "pixels": [768, 342], "sourcePixels": [1821, 864], "sourceCrop": [10, 31, 1812, 833], "alphaExtrema": [0, 255], "sha256": "a46783dc00dd76be690c29c72f92fa834a02b2522aac366058cc2972822ab681" }, "twitterBird": { "file": "assets/encounters/v400/twitterBird.png", "w": 76, "h": 50.568, "pixels": [768, 511], "sourcePixels": [1536, 1024], "sourceCrop": [85, 50, 1460, 964], "alphaExtrema": [0, 255], "sha256": "46436e2c78ac2ac104426b8bc898f047cb8ee934a9b1a5dd08631a554f5ee94e" }, "homelessRow": { "file": "assets/encounters/v400/homelessRow.png", "w": 142, "h": 40.122, "pixels": [768, 217], "sourcePixels": [2073, 758], "sourceCrop": [79, 124, 2012, 670], "alphaExtrema": [0, 255], "sha256": "03ed702ddb2d5cd06d2c6174b8e88edce01a22adbae68570d268de367ea49806" }, "bydSeal": { "file": "assets/encounters/v400/bydSeal.png", "w": 138, "h": 44.562, "pixels": [768, 248], "sourcePixels": [2172, 724], "sourceCrop": [144, 74, 2061, 693], "alphaExtrema": [0, 255], "sha256": "840376084d808030f6900dbad884a825703c1dd7736fc147db457098759d8b69" }, "xiaomiSu7": { "file": "assets/encounters/v400/xiaomiSu7.png", "w": 138, "h": 42.047, "pixels": [768, 234], "sourcePixels": [1903, 826], "sourceCrop": [26, 190, 1877, 753], "alphaExtrema": [0, 255], "sha256": "3187a0f29bc97d4a73a1186cc1fbd60785ac6beea61dc55a10d7d70184e20bab" }, "batteryAgv": { "file": "assets/encounters/v400/batteryAgv.png", "w": 118, "h": 41.177, "pixels": [768, 268], "sourcePixels": [2012, 782], "sourceCrop": [131, 113, 1878, 722], "alphaExtrema": [0, 255], "sha256": "82d12e8efdb89038ea0351b7dc942754be9ab9f78aed29a88b2c4a12a8cc6d79" }, "qualitySkull": { "file": "assets/encounters/v400/qualitySkull.png", "w": 76, "h": 40.87, "pixels": [768, 413], "sourcePixels": [1536, 1024], "sourceCrop": [183, 152, 1413, 814], "alphaExtrema": [0, 255], "sha256": "955bb780f34142f0f9302839283022730bfd1c7688c48c46ac59cc18ad994d4b" }, "starlink": { "file": "assets/encounters/v400/starlink.png", "w": 112, "h": 69.271, "pixels": [768, 475], "sourcePixels": [1559, 1009], "sourceCrop": [76, 97, 1491, 973], "alphaExtrema": [0, 255], "sha256": "3988083ecbf0294a0c50b44df0bd8283347a56d5d9ffabe36ff6aa3a281d9e08" }, "regulatorDrone": { "file": "assets/encounters/v400/regulatorDrone.png", "w": 106, "h": 47.065, "pixels": [768, 341], "sourcePixels": [1536, 1024], "sourceCrop": [15, 176, 1521, 845], "alphaExtrema": [0, 255], "sha256": "99140365f63c6e6af46fafbfd90380459ae5e0a4e5709dfc371ebd1c3a5cf830" }, "reptileHead": { "file": "assets/encounters/v400/reptileHead.png", "w": 68, "h": 79.416, "pixels": [274, 320], "sourcePixels": [1173, 1341], "sourceCrop": [121, 97, 1077, 1212], "alphaExtrema": [0, 255], "sha256": "dc627f44d9efbaae3b93c44c5377ce25b518751b691071cf11a26f3670bcfa49" }, "moltenVat": { "file": "assets/encounters/v400/moltenVat.png", "w": 164, "h": 134.745, "pixels": [768, 631], "sourcePixels": [1351, 1164], "sourceCrop": [54, 71, 1298, 1093], "alphaExtrema": [0, 255], "sha256": "f7fe4d31e0588da095c2647e5548d3b8bebdd67aa9cbdcfe6e619963bd1198ca" } });

// supabase/rulesets/roadster-v432/content.js
function freeze6(value) {
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) freeze6(item);
    Object.freeze(value);
  }
  return value;
}
var BIOMES6 = freeze6(["spaceport", "tesla-factory"]);
var BIOME_CYCLE6 = freeze6(["spaceport", "tesla-factory"]);
var ANIMATIONS6 = freeze6(["taunt", "angry-look", "point-and-laugh", "trampoline-bounce", "money-guns", "podcast", "throw", "lightning", "reptile", "look"]);
var ASSETS6 = freeze6({
  ...Object.fromEntries(Object.entries(ENEMY_SPRITES4).map(([id2, s]) => ["encounter_" + id2, { file: s.file }])),
  encounter_moltenVat: { file: "assets/encounters/v411/moltenVat.png" },
  collage: { file: "collage-atlas.png" },
  extras: { file: "collage-extras.png" },
  cast: { file: "paper-cast.png" },
  photos: { file: "obstacle-photos.png" },
  joe: { file: "assets/characters/joe-rogan.png" },
  amber: { file: "assets/characters/amber-head-v247.png" },
  drone: { file: "assets/obstacles/phantom-v3.png" }
});
var none6 = { enabled: false };
var reaction6 = (animationId, trigger = "near", range = 300, space = "target") => ({ enabled: true, animationId, trigger, range, space });
function define6(base, options = {}) {
  return freeze6({
    ...base,
    definitionVersion: 1,
    category: options.category || "object",
    placement: base.altitude ? "air" : "ground",
    anchor: base.altitude ? "air-bottom-center" : "ground-center",
    biomes: options.biomes || "all",
    visual: { renderer: options.renderer || "prop", key: options.key || base.id, assets: options.assets || [], bob: options.bob || false },
    collision: options.collision || "box",
    reactions: { hero: options.hero || none6, obstacle: options.obstacle || none6 },
    collectible: true,
    provenance: "assets-provenance.json"
  });
}
function spriteDefinition4(id2, name2, options, altitude = 0) {
  const s = ENEMY_SPRITES4[
    /** @type {keyof typeof ENEMY_SPRITES} */
    id2
  ];
  return define6({ id: id2, name: name2, w: s.w, h: s.h, inset: id2 === "t800" ? 10 : 5, ...altitude ? { altitude } : {} }, { ...options, renderer: "sprite", assets: ["encounter_" + id2] });
}
var OBSTACLES6 = freeze6([
  define6({ id: "v8", name: "V8 \u2022 VERY LOUD", w: 108, h: 36 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define6({ id: "trump", name: "TARIFF MAN", w: 54, h: 94 }, { renderer: "character", assets: ["collage"], category: "person", bob: true, hero: reaction6("taunt"), obstacle: reaction6("angry-look") }),
  define6({ id: "protest", name: "COUCH CRITICS", w: 102, h: 94 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "group" }),
  define6({ id: "truck", name: "CYBERBRICK", w: 110, h: 41 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define6({ id: "doge", name: "MUCH WOW", w: 52, h: 64 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "animal" }),
  define6({ id: "pump", name: "BIG OIL", w: 54, h: 78 }, {}),
  define6({ id: "zuck", name: "ZUCK", w: 62, h: 94, inset: 5 }, { renderer: "character", assets: ["cast"], category: "person", hero: reaction6("money-guns", "airborne-near"), obstacle: reaction6("money-guns", "airborne-near") }),
  define6({ id: "openai", name: "OPENAI", w: 70, h: 68, inset: 5 }, { category: "emblem" }),
  define6({ id: "claude", name: "CLAUDE", w: 84, h: 73, inset: 6 }, { category: "emblem" }),
  define6({ id: "gemini", name: "GEMINI", w: 58, h: 78, inset: 4 }, { category: "emblem" }),
  define6({ id: "rogozin", name: "ROGOZIN / TRAMPOLINE", w: 88, h: 130, inset: 4 }, { renderer: "character", assets: ["cast"], category: "person", biomes: ["spaceport"], collision: "trampoline", hero: reaction6("point-and-laugh", "airborne-near"), obstacle: reaction6("trampoline-bounce", "passage") }),
  define6({ id: "amber", name: "AMBER HEARD", w: 58, h: 94, inset: 9 }, { renderer: "character", assets: ["amber"], category: "person", obstacle: reaction6("throw", "passage") }),
  define6({ id: "joe", name: "JOE ROGAN", w: 76, h: 94, inset: 10 }, { renderer: "character", assets: ["joe"], category: "person", hero: reaction6("podcast", "passage", 650, "self"), obstacle: reaction6("podcast", "passage", 650, "self") }),
  define6({ id: "muscleCoupe", name: "AMERICAN MUSCLE", w: 138, h: 45, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define6({ id: "muscleCompact", name: "SMALL BLOCK / BIG EGO", w: 112, h: 38, inset: 5 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define6({ id: "pickup", name: "BIG TRUCK ENERGY", w: 140, h: 57, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  ...[
    ["homelessRow", "SPARE CHANGE", "group", "all"],
    ["t800", "T-800 / AUTOMATION", "person", ["tesla-factory"]],
    ["bydSeal", "BYD SEAL", "vehicle", ["tesla-factory"]],
    ["xiaomiSu7", "XIAOMI SU7", "vehicle", ["tesla-factory"]],
    ["batteryAgv", "BATTERY SWAP", "vehicle", ["tesla-factory"]]
  ].map(([id2, name2, category, biomes]) => spriteDefinition4(String(id2), String(name2), { category: String(category), biomes: Array.isArray(biomes) ? biomes : "all" })),
  ...[
    ["ufo", "UNIDENTIFIED FLYING OPPORTUNITY", "all"],
    ["primeDrone", "PRIME PERSONAL SPACE", "all"],
    ["twitterBird", "THE FORMER BIRD", ["spaceport"]],
    ["starlink", "STARLINK / WRONG ORBIT", ["spaceport"]],
    ["regulatorDrone", "APPROVAL PENDING", "all"],
    ["sikorsky", "SIKORSKY / VS-300", ["spaceport"]],
    ["qualitySkull", "QUALITY CONTROL", ["tesla-factory"]]
  ].map(([id2, name2, biomes]) => spriteDefinition4(String(id2), String(name2), { category: "flying enemy", biomes: Array.isArray(biomes) ? biomes : "all", collision: "box", hero: reaction6(id2 === "ufo" ? "reptile" : "look", "near", 320) }, 32)),
  spriteDefinition4("xi", "COMRADE XI", { category: "person", biomes: ["tesla-factory"], collision: "box", hero: reaction6("lightning", "near", 380), obstacle: reaction6("lightning", "near", 380) })
]);
var PROP_TYPES6 = freeze6(OBSTACLES6.filter((o) => ["muscleCoupe", "muscleCompact", "pickup"].includes(o.id)));
var AIR_TYPES6 = freeze6(OBSTACLES6.filter((o) => o.placement === "air"));
var definitionsById6 = new Map(OBSTACLES6.map((o) => [o.id, o]));
var obstacleDefinition6 = (id2) => definitionsById6.get(id2);
function validateContent6(definitions = OBSTACLES6) {
  const errors = [], ids = /* @__PURE__ */ new Set();
  for (const o of definitions) {
    if (!o.id || ids.has(o.id)) errors.push(`duplicate or missing id: ${o.id}`);
    ids.add(o.id);
    if (!Number.isFinite(o.w) || !Number.isFinite(o.h) || o.w <= 0 || o.h <= 6) errors.push(`${o.id}: invalid size`);
    if (!["ground", "air"].includes(o.placement)) errors.push(`${o.id}: invalid placement`);
    if (o.placement === "air" && (!Number.isFinite(o.altitude) || !(Number(o.altitude) > 0))) errors.push(`${o.id}: invalid altitude`);
    if (o.placement === "ground" && o.altitude) errors.push(`${o.id}: ground altitude`);
    if (!["ground-center", "air-bottom-center"].includes(o.anchor)) errors.push(`${o.id}: invalid anchor`);
    if (o.biomes !== "all" && (!Array.isArray(o.biomes) || !o.biomes.length || o.biomes.some((b) => !BIOMES6.includes(b)))) errors.push(`${o.id}: unknown biome`);
    if (!o.visual || !["photo", "cutout", "character", "prop", "drone", "sprite"].includes(o.visual.renderer)) errors.push(`${o.id}: missing renderer`);
    for (const id2 of o.visual?.assets || []) if (!Object.hasOwn(ASSETS6, id2)) errors.push(`${o.id}: unknown asset ${id2}`);
    if (!["box", "trampoline", "none"].includes(o.collision)) errors.push(`${o.id}: missing collision profile`);
    if (o.inset !== void 0 && (!Number.isFinite(o.inset) || o.inset < 0 || o.inset * 2 >= o.w)) errors.push(`${o.id}: invalid inset`);
    for (
      const direction of
      /** @type {const} */
      ["hero", "obstacle"]
    ) {
      const r = o.reactions?.[direction];
      if (!r || typeof r.enabled !== "boolean") errors.push(`${o.id}: missing ${direction} reaction`);
      else if (r.enabled && (!ANIMATIONS6.includes(r.animationId) || !["near", "airborne-near", "passage"].includes(r.trigger) || !(r.range > 0) || !["target", "self"].includes(r.space))) errors.push(`${o.id}: missing animation ${r.animationId}`);
    }
  }
  return errors;
}
var contentErrors6 = validateContent6();
if (contentErrors6.length) throw new Error(`Invalid content: ${contentErrors6.join("; ")}`);

// supabase/rulesets/roadster-v432/physics.js
var STEP6 = 1 / 120;
function rogozinBounce6(time) {
  return 20 * Math.abs(Math.sin(time * 4.5));
}
function obstacleBoxes6(o, time = 0) {
  if ((o.collision || obstacleDefinition6(o.id)?.collision) === "trampoline") {
    return [
      { left: 6, right: o.w - 6, top: 16 },
      { left: o.w / 2 - 18, right: o.w / 2 + 18, top: 108 + rogozinBounce6(time) }
    ];
  }
  const inset = o.inset ?? 5;
  return [{ left: inset, right: o.w - inset, top: o.h - 6 }];
}

// supabase/rulesets/roadster-v432/fall.js
var clamp11 = (x) => Math.max(0, Math.min(1, x));
var ease6 = (x) => {
  x = clamp11(x);
  return x * x * (3 - 2 * x);
};
var mix6 = (a, b, t) => a + (b - a) * t;
var FALL_CONTACTS6 = Object.freeze([0.14, 0.36, 0.56]);
var FALL_CAR_CONTACTS6 = Object.freeze([0.16, 0.38]);
var FALL_CAR_HULL6 = Object.freeze([[-49, -7], [-8, -15], [8, -15], [48.5, 0], [47, 6], [27, 12], [-34, 12], [-46, 5]].map(Object.freeze));
function fallCarSupport6(angle) {
  return Math.max(...FALL_CAR_HULL6.map(([x, y]) => x * Math.sin(angle) + y * Math.cos(angle)));
}
var arc6 = (p, a, b, height) => {
  const t = clamp11((p - a) / (b - a));
  return t < 1e-12 || t > 1 - 1e-12 ? 0 : height * 4 * t * (1 - t);
};
var pulse6 = (p, hit) => ease6((p - hit + 0.035) / 0.035) * (1 - ease6((p - hit) / 0.055));
function track6(keys, p) {
  let i = 1;
  while (i < keys.length - 1 && p > keys[i][0]) i++;
  const [a, b] = [keys[i - 1], keys[i]];
  return mix6(a[1], b[1], ease6((p - a[0]) / (b[0] - a[0])));
}
function createFall6() {
  return { active: false, age: 0, duration: GAMEPLAY6.fallSeconds, rate: 1, taps: 0, angle: 0, reduced: false };
}
function beginFall6(f, result, { reduced = false, speed = GAMEPLAY6.startSpeed } = {}) {
  const angle = Math.atan2(Math.sin(result.angle), Math.cos(result.angle));
  const severity = clamp11((speed - GAMEPLAY6.startSpeed) / (GAMEPLAY6.maxSpeed - GAMEPLAY6.startSpeed));
  Object.assign(f, { active: true, age: 0, duration: GAMEPLAY6.fallSeconds + GAMEPLAY6.fallSpeedSeconds * severity, rate: 1, taps: 0, angle, reduced });
}
function hastenFall6(f) {
  if (!f.active) return false;
  f.taps++;
  f.rate = Math.min(GAMEPLAY6.fallMaxRate, f.rate + GAMEPLAY6.fallTapRate);
  return true;
}
function advanceFall6(f, dt) {
  if (!f.active) return { impacts: 0, finished: false };
  const previous = f.age;
  f.age = Math.min(f.duration, f.age + dt * f.rate);
  const impacts = FALL_CONTACTS6.filter((t) => previous < f.duration * t && f.age >= f.duration * t).length;
  f.active = f.age < f.duration;
  return { impacts, finished: !f.active };
}
function fallPose6(f) {
  const p = clamp11(f.age / f.duration), sit = ease6(p / 0.14), stand = ease6((p - 0.68) / 0.16), gather = ease6((p - 0.7) / 0.22), settle = clamp11((p - 0.97) / 0.03);
  const impact = Math.max(...FALL_CONTACTS6.map((hit) => pulse6(p, hit))), seat = sit * (1 - stand);
  const crouch = (0.72 + 0.18 * impact) * seat + (settle === 1 ? 0 : 0.1 * Math.sin(settle * Math.PI));
  const lift = p < 0.36 ? arc6(p, 0.14, 0.36, 32) : p < 0.56 ? arc6(p, 0.36, 0.56, 28) : arc6(p, 0.56, 0.97, 112);
  const angle = mix6(f.angle, -0.64, sit) * (1 - stand);
  const seatAnchor = -11 * Math.sin(angle) + (22.5 + 27 * crouch) * Math.cos(angle) + 9;
  const rider = { x: 34 * sit * (1 - gather), y: mix6(95, seatAnchor, seat) + lift, angle, seat, crouch, lift };
  const entry = (y) => ({ x: Math.sin(f.angle) * (y - 65), y: 65 + Math.cos(f.angle) * (y - 65) });
  const e = entry(95), c = entry(12);
  rider.x += e.x * (1 - sit);
  rider.y += (e.y - 95) * (1 - sit);
  const carAngle = track6([[0, f.angle], [0.16, 0.95], [0.29, Math.PI], [0.38, 2 * Math.PI - 1.02], [0.54, 2 * Math.PI], [1, 2 * Math.PI]], p);
  const carHop = p < 0.16 ? arc6(p, 0, 0.16, 20) : p < 0.38 ? arc6(p, 0.16, 0.38, 22) : arc6(p, 0.38, 0.54, 8);
  const car = { x: gather === 1 ? 0 : mix6(c.x, -88, ease6(p / 0.16)) * (1 - gather), y: p >= 0.54 ? 12 : mix6(c.y, fallCarSupport6(carAngle) + carHop, ease6(p / 0.06)), angle: carAngle, phase: 0 };
  let shake = 0;
  for (const hit of FALL_CONTACTS6) if (p >= hit) shake = Math.max(shake, Math.exp(-(p - hit) * 40));
  const pose = { car, rider, crouch, impact, flail: sit * (1 - ease6((p - 0.82) / 0.12)), push: 0, shake: shake * 2.4, progress: p };
  if (f.reduced) {
    pose.car = { x: 0, y: 12, angle: 0, phase: 0 };
    pose.rider = { x: 0, y: 95, angle: 0, seat: 0, crouch };
    pose.shake = 0;
    pose.push = 0;
    pose.flail = 0;
  }
  return pose;
}
function fallPolygons6(pose) {
  const seat = pose.rider.seat || 0, crouch = pose.rider.crouch || 0;
  const rider = [[-23, -70 + 4 * seat], [23 + 48 * seat, -70 + 4 * seat], [23 + 48 * seat, 68 - 27 * crouch], [-23, 68 - 27 * crouch]];
  return [[pose.car, FALL_CAR_HULL6.map(([x, y]) => [x, -y])], [pose.rider, rider]].map(([body2, vertices]) => {
    const c = Math.cos(body2.angle), s = Math.sin(body2.angle);
    return vertices.map(([x, y]) => ({ x: body2.x + c * x + s * y, y: body2.y - s * x + c * y }));
  });
}
function interpolateFall6(a, b, t) {
  const pose = {};
  for (const part of ["car", "rider"]) {
    pose[part] = {};
    for (const k of ["x", "y", "angle", "seat", "crouch", "phase"]) pose[part][k] = mix6(a[part][k] || 0, b[part][k] || 0, t);
  }
  return pose;
}

// supabase/rulesets/roadster-v432/gameplay.js
var TAU6 = Math.PI * 2;
var clamp12 = (x, a, b) => Math.max(a, Math.min(b, x));
var approach6 = (x, target, amount) => x < target ? Math.min(target, x + amount) : Math.max(target, x - amount);
function uprightError6(angle, direction = -1) {
  let e = ((angle + Math.PI) % TAU6 + TAU6) % TAU6 - Math.PI;
  if (Math.abs(Math.abs(e) - Math.PI) < 1e-9) e = -Math.sign(direction || -1) * Math.PI;
  return e;
}
function createFlight6(fuel = GAMEPLAY6.initialFuel) {
  return { y: 0, vy: 0, vx: 0, angle: 0, omega: 0, airborne: false, time: 0, fuel, thrusting: false, latched: false, attach: 0, maxTurn: 0, turns: 0, lastDirection: -1, trickStarted: false, grab: 0, launchVelocity: 0, jumpFactor: 1 };
}
function launch6(p, charge = 0) {
  if (p.airborne) return false;
  Object.assign(p, { y: 1e-3, vy: (GAMEPLAY6.jumpSpeed + GAMEPLAY6.chargedSpeed * clamp12(charge, 0, 1)) * (p.jumpFactor || 1), angle: 0, omega: 0, airborne: true, time: 0, latched: false, attach: 0, maxTurn: 0, turns: 0, trickStarted: false, grab: 0, launchVelocity: (GAMEPLAY6.jumpSpeed + GAMEPLAY6.chargedSpeed * clamp12(charge, 0, 1)) * (p.jumpFactor || 1) });
  return true;
}
function advanceFlight6(p, dt, { spin = false, thrust = false } = {}) {
  p.thrusting = false;
  const gripTarget = p.airborne && spin ? 1 : 0;
  p.grab = approach6(p.grab, gripTarget, dt / (gripTarget ? 0.12 : 0.18));
  if (!p.airborne) {
    p.vx *= Math.exp(-GAMEPLAY6.horizontalDrag * dt);
    return null;
  }
  p.time += dt;
  if (spin) {
    p.trickStarted = true;
    p.lastDirection = -1;
    p.omega = approach6(p.omega, -GAMEPLAY6.spinSpeed, GAMEPLAY6.spinAcceleration * dt);
  } else {
    const target = Math.sign(p.omega) * Math.min(Math.abs(p.omega), GAMEPLAY6.releaseSpeed);
    p.omega = approach6(p.omega, target, GAMEPLAY6.releaseDeceleration * dt);
  }
  p.angle += p.omega * dt;
  p.maxTurn = Math.max(p.maxTurn, -p.angle);
  p.turns = Math.floor((p.maxTurn + 1e-7) / TAU6);
  const burn = thrust ? Math.min(dt, p.fuel / GAMEPLAY6.fuelPerSecond) : 0;
  if (burn > 0) {
    p.fuel = Math.max(0, p.fuel - burn * GAMEPLAY6.fuelPerSecond);
    p.thrusting = true;
    p.latched = true;
    p.vx += Math.sin(p.angle) * GAMEPLAY6.thrustAcceleration * burn;
    p.vy += Math.cos(p.angle) * GAMEPLAY6.thrustAcceleration * burn;
  }
  if (p.latched) p.attach = Math.min(1, p.attach + dt / GAMEPLAY6.attachSeconds);
  p.vx = clamp12(p.vx * Math.exp(-GAMEPLAY6.horizontalDrag * dt), -GAMEPLAY6.maxHorizontal, GAMEPLAY6.maxHorizontal);
  p.y += p.vy * dt - 0.5 * GAMEPLAY6.gravity * dt * dt;
  p.vy -= GAMEPLAY6.gravity * dt;
  if (p.y > 0) return null;
  const good = Math.abs(uprightError6(p.angle)) <= GAMEPLAY6.landingAngle + 1e-9 && Math.abs(p.omega) <= GAMEPLAY6.landingOmega;
  const turns = good ? Math.max(p.turns, Math.round(-p.angle / TAU6)) : p.turns;
  const perfect = good && Math.abs(uprightError6(p.angle)) <= GAMEPLAY6.perfectAngle + 1e-9;
  const result = { good, perfect, turns, impact: Math.abs(p.vy), angle: p.angle, omega: p.omega };
  p.turns = turns;
  p.y = 0;
  p.vy = 0;
  p.airborne = false;
  p.thrusting = false;
  if (result.good) {
    p.angle = 0;
    p.omega = 0;
  }
  return result;
}
function createEconomy6() {
  return { scoreFactor: 1, bonus: 0, multiplier: 10, meter: 0, decay: 0, streak: 0, streakLeft: 0, flips: 0 };
}
function comboSeconds6(e) {
  return GAMEPLAY6.comboDuration - GAMEPLAY6.comboFalloff * (e.multiplier / 10 - 1);
}
function rewardAction6(e, count = 1) {
  e.multiplier = Math.min(GAMEPLAY6.maxMultiplier, e.multiplier + count * GAMEPLAY6.multiplierStep);
  e.meter = 1;
  e.decay = 0;
}
function advanceEconomy6(e, dt) {
  if (e.meter > 0) {
    const used = Math.min(dt, e.meter * comboSeconds6(e));
    e.meter = Math.max(0, e.meter - used / comboSeconds6(e));
    dt -= used;
  }
  if (e.meter === 0 && e.multiplier > 10) {
    e.decay += dt;
    while (e.decay + 1e-9 >= GAMEPLAY6.comboDecaySeconds && e.multiplier > 10) {
      e.multiplier--;
      e.decay -= GAMEPLAY6.comboDecaySeconds;
    }
  }
}
function advanceStreak6(e, dt) {
  const used = Math.min(dt, e.streakLeft);
  e.streakLeft -= used;
  e.streak = Math.max(0, e.streak - (dt - used) * GAMEPLAY6.streakDecay);
}
function passObstacle6(e) {
  const points = GAMEPLAY6.obstaclePoints * e.multiplier / 10 * (e.scoreFactor || 1);
  e.bonus += points;
  return points;
}
function settleLanding6(e, p, result, { late = 0, near = 0 } = {}) {
  if (!result.good) {
    e.multiplier = 10;
    e.meter = 0;
    e.decay = 0;
    e.streak = 0;
    e.streakLeft = 0;
    return { points: 0, turns: 0, late: 0, near: 0, perfect: false, good: false };
  }
  const n = result.turns, perfect = !!result.perfect, points = (GAMEPLAY6.flipFactor * n * (n + 1) + GAMEPLAY6.nearPoints * (late + near) + GAMEPLAY6.perfectPoints * Number(perfect)) * e.multiplier / 10 * (e.scoreFactor || 1);
  e.bonus += points;
  e.flips += n;
  p.fuel = Math.min(GAMEPLAY6.tank, p.fuel + GAMEPLAY6.fuelPerFlip * n);
  if (n + late + near + Number(perfect)) rewardAction6(e, n + late + near + Number(perfect));
  if (n || near) {
    e.streak = Math.min(GAMEPLAY6.maxStreak, e.streak + GAMEPLAY6.streakStep);
    e.streakLeft = GAMEPLAY6.streakHold;
  }
  return { points, turns: n, late, near, perfect, good: true };
}
function createPace6() {
  return { boost: 0, progress: 0, base: GAMEPLAY6.startSpeed, speed: GAMEPLAY6.startSpeed, recovery: null, stumble: 0, falling: false };
}
function stumble6(pace) {
  const target = pace.recovery?.target ?? pace.base, r = clamp12((target - GAMEPLAY6.startSpeed) / (GAMEPLAY6.maxSpeed - GAMEPLAY6.startSpeed), 0, 1);
  pace.recovery = { target, age: 0, duration: GAMEPLAY6.recoveryMin + GAMEPLAY6.recoveryExtra * r ** 1.5 };
  pace.stumble = GAMEPLAY6.stumbleSeconds;
  pace.base = target * GAMEPLAY6.recoveryRatio;
}
function recoverySpeed6(r, t) {
  const T = r.duration, d = r.target * (1 - GAMEPLAY6.recoveryRatio), v0 = r.target * GAMEPLAY6.recoveryRatio, h = 0.15, a = T - h;
  if (t <= a) return v0 + d * (t / T) ** 2;
  const u = clamp12((t - a) / h, 0, 1), start = v0 + d * (a / T) ** 2, slope = 2 * d * a / T ** 2, endSlope = r.target >= GAMEPLAY6.maxSpeed ? 0 : (GAMEPLAY6.maxSpeed - GAMEPLAY6.startSpeed) / GAMEPLAY6.rampSeconds;
  return (2 * u ** 3 - 3 * u * u + 1) * start + (u ** 3 - 2 * u * u + u) * h * slope + (-2 * u ** 3 + 3 * u * u) * r.target + (u ** 3 - u * u) * h * endSlope;
}
function advancePace6(pace, e, p, dt) {
  if (pace.recovery) {
    pace.stumble = Math.max(0, pace.stumble - dt);
    const r = pace.recovery;
    r.age = Math.min(r.duration, r.age + dt);
    pace.base = recoverySpeed6(r, r.age);
    if (r.age >= r.duration) {
      pace.base = r.target;
      pace.recovery = null;
    }
  } else if (!pace.falling) {
    pace.progress += dt;
    pace.base = GAMEPLAY6.startSpeed + (GAMEPLAY6.maxSpeed - GAMEPLAY6.startSpeed) * Math.min(1, pace.progress / GAMEPLAY6.rampSeconds);
  }
  pace.speed = Math.max(60, pace.base * (1 + e.streak) * (1 + (pace.boost || 0)) + p.vx);
  return pace.speed;
}
function playerPolygons6(p) {
  if (p.fallPose) return fallPolygons6(p.fallPose);
  const c = Math.cos(p.angle), s = Math.sin(p.angle);
  return [[-47, 0, 47, 25], [-23, 25, 23, 163 - 32 * (p.grab || 0)]].map(([l, b, r, t]) => [[l, b], [r, b], [r, t], [l, t]].map(([x, y]) => ({ x: c * x + s * (y - 65), y: p.y + 65 - s * x + c * (y - 65) })));
}
function overlaps6(poly, rect) {
  const axes = [{ x: 1, y: 0 }, { x: 0, y: 1 }];
  for (let i = 0; i < (poly.length === 4 ? 2 : poly.length); i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    axes.push({ x: -(b.y - a.y), y: b.x - a.x });
  }
  for (const a of axes) {
    let pmin = Infinity, pmax = -Infinity, rmin = Infinity, rmax = -Infinity;
    for (const p of poly) {
      const value = p.x * a.x + p.y * a.y;
      pmin = Math.min(pmin, value);
      pmax = Math.max(pmax, value);
    }
    for (const p of rect) {
      const value = p.x * a.x + p.y * a.y;
      rmin = Math.min(rmin, value);
      rmax = Math.max(rmax, value);
    }
    if (pmax <= rmin || rmax <= pmin) return false;
  }
  return true;
}
function collisionAt6(p, o, dx, time = 0) {
  if (o.collision === "none") return false;
  if (dx > 180 || dx + o.w < -180) return false;
  const polygons = playerPolygons6(p);
  return obstacleBoxes6(o, time).some((b) => {
    const bottom = o.altitude || 0, top = bottom + b.top;
    const rect = [{ x: dx + b.left, y: bottom }, { x: dx + b.right, y: bottom }, { x: dx + b.right, y: top }, { x: dx + b.left, y: top }];
    return polygons.some((poly) => overlaps6(poly, rect));
  });
}
function sweptCollision6(before, after, o, dxBefore, dxAfter, time, dt) {
  if (Math.min(dxBefore, dxAfter) > 180 || Math.max(dxBefore, dxAfter) + o.w < -180) return false;
  const fallTravel = before.fallPose && after.fallPose ? Math.max(...["rider", "car"].map((part) => Math.abs(after.fallPose[part].angle - before.fallPose[part].angle) * (part === "car" ? 55 : 170) + Math.abs(after.fallPose[part].y - before.fallPose[part].y) + Math.abs(after.fallPose[part].x - before.fallPose[part].x))) : 0;
  const n = Math.max(1, Math.ceil((Math.abs(dxAfter - dxBefore) + Math.abs(after.y - before.y) + Math.abs(after.angle - before.angle) * 170 + fallTravel) / 4));
  for (let i = 0; i <= n; i++) {
    const f = i / n, p = { y: before.y + (after.y - before.y) * f, angle: before.angle + (after.angle - before.angle) * f, grab: (before.grab || 0) + ((after.grab || 0) - (before.grab || 0)) * f };
    if (before.fallPose && after.fallPose) p.fallPose = interpolateFall6(before.fallPose, after.fallPose, f);
    if (collisionAt6(p, o, dxBefore + (dxAfter - dxBefore) * f, time - dt + dt * f)) return true;
  }
  return false;
}
function nearWindow6(distance, speed) {
  return distance >= 0 && distance <= Math.max(0, speed) * GAMEPLAY6.nearSeconds + 1e-8;
}

// supabase/rulesets/roadster-v432/biomes.js
var BIOME_SCORE_STEP4 = 7e3;
var SCENERY_CYCLE4 = BIOME_CYCLE6;
function biomeAt4(score = 0) {
  const points = Number.isFinite(score) ? Math.max(0, score) : 0;
  const leg = Math.floor(points / BIOME_SCORE_STEP4), nextAt = (leg + 1) * BIOME_SCORE_STEP4;
  return { id: SCENERY_CYCLE4[leg % SCENERY_CYCLE4.length], leg, nextAt, nextIn: nextAt - points };
}

// supabase/rulesets/roadster-v432/routes.js
var STAGES6 = GAMEPLAY6.stages;
function stageAt6(progress) {
  return STAGES6.filter((t) => progress >= t).length - 1;
}
function makePattern6(kind, { speed = 360, type = { id: "truck", w: 110, h: 41 }, dx = 900 } = {}) {
  const item = (o, offset = 0) => ({ ...o, x: dx + offset, passed: false });
  if (kind === "air") return [item(type)];
  if (kind === "hover" || kind === "incoming") return [item(type)];
  if (kind === "precision") {
    const span = Math.min(200, Math.max(110, speed * 0.4 - 94)), cars = [], n = Math.min(2, Math.ceil(span / 110)), width = (span - 20 * (n - 1)) / n;
    for (let i = 0; i < n; i++) cars.push(item({ id: "truck", name: "CYBERBRICK", w: width, h: 41 * width / 110, inset: 4 }, i * (width + 20)));
    cars.push(item({ id: "truck", name: "CYBERBRICK", w: 110, h: 41, inset: 5 }, speed * 1.15));
    return cars;
  }
  if (kind === "mixed") return [item(type), item(type.h <= 57 ? type : { id: "truck", name: "CYBERBRICK", w: 110, h: 41, inset: 5 }, speed * 1.65)];
  if (kind === "thrust") {
    const n = Math.min(6, Math.max(4, Math.ceil(speed * 1.65 / 165)));
    return Array.from({ length: n }, (_, i) => item({ id: "truck", name: "CYBERBRICK", w: 110, h: 41, inset: 5 }, i * 165));
  }
  if (kind === "pair") return [item(type), item(type, speed * 1.5)];
  return [item(type)];
}
function validateRoute6(obstacles, { flight = createFlight6(), pace = createPace6(), economy = createEconomy6(), time = 0, boosterState = null, allowThrust = true, burns = null, timingMargin = 0, leads = [0.1, 0.11, 0.115, 0.12, 0.125, 0.14, 0.16, 0.2, 0.3, 0.4, 0.5, 0.65], charges = [0, 0.5, 1] } = {}) {
  if (flight.airborne || pace.stumble > 0) return null;
  for (const charge of charges) for (const lead of leads) for (const burn of burns ?? (allowThrust && flight.fuel > 0 ? [0, 0.35, 0.65, 1.1] : [0])) {
    const q = boosterState ? structuredClone(boosterState) : null;
    const p = { ...flight }, r = structuredClone(pace), e = { ...economy }, obs = obstacles.map((o) => ({ ...o })), actions = [];
    let charging = false, held = 0, elapsed = 0, lateTarget = null, lastThrust = false, nearLandings = 0, lateTakeoffs = 0;
    const dt = 1 / 120;
    for (let tick = 0; tick < 1440; tick++) {
      elapsed = tick * dt;
      const next = obs.find((o) => o.x + o.w > -47 && (!o.altitude || o.altitude < 163));
      if (!p.airborne && next) {
        const ttc = (next.x + (next.inset || 5) - 47) / Math.max(1, r.speed + (next.approachSpeed || 0));
        if (!charging && ttc <= lead + charge * GAMEPLAY6.chargeSeconds) {
          charging = true;
          held = 0;
          actions.push({ at: elapsed, action: "hold" });
        }
        if (charging) {
          held += dt;
          if (held + 1e-9 >= charge * GAMEPLAY6.chargeSeconds + (charge > 0 ? dt : 0)) {
            lateTarget = nearWindow6(next.x + (next.inset || 5) - 47, r.speed + (next.approachSpeed || 0)) ? next : null;
            p.jumpFactor = q && activeBooster2(q, "jump") ? 1.25 : 1;
            launch6(p, charge);
            charging = false;
            actions.push({ at: elapsed, action: "jump", charge });
          }
        }
      }
      if (q) {
        advanceBoosters2(q, dt);
        r.boost = 0.35 * q.speedBlend;
        e.scoreFactor = activeBooster2(q, "score") ? 3 : 1;
      }
      const before = { ...p }, useThrust = p.airborne && p.time >= 0.18 && p.time < 0.18 + burn;
      if (useThrust !== lastThrust) {
        actions.push({ at: elapsed, action: useThrust ? "thrust-on" : "thrust-off" });
        lastThrust = useThrust;
      }
      const landed = advanceFlight6(p, dt, { thrust: useThrust });
      advanceEconomy6(e, dt);
      advanceStreak6(e, dt);
      advancePace6(r, e, p, dt);
      const after = landed ? { ...p, angle: landed.angle } : p;
      let alive = true;
      for (const o of obs) {
        const old = o.x;
        o.x -= (r.speed + (o.approachSpeed || 0)) * dt;
        if (sweptCollision6(before, after, o, old, o.x, time + elapsed, dt)) {
          alive = false;
          break;
        }
        if (!o.passed && o.x + o.w < -50) {
          o.passed = true;
          passObstacle6(e);
        }
      }
      if (!alive || landed && !landed.good) break;
      if (landed) {
        let near = 0;
        const late = lateTarget && lateTarget.x + lateTarget.w - (lateTarget.inset || 5) < -47 ? 1 : 0;
        for (const o of obs) if (!o.altitude && !o.nearPaid && nearWindow6(-47 - (o.x + o.w - (o.inset || 5)), r.speed)) {
          near++;
          o.nearPaid = true;
        }
        settleLanding6(e, p, landed, { late, near });
        nearLandings += near;
        lateTakeoffs += late;
        lateTarget = null;
      }
      if (obs.every((o) => o.x + o.w < -180) && !p.airborne) {
        if (timingMargin > 0 && (!validateRoute6(obstacles, { flight, pace, economy, time, boosterState, charges: [charge], leads: [lead - timingMargin], burns: [burn] }) || !validateRoute6(obstacles, { flight, pace, economy, time, boosterState, charges: [charge], leads: [lead + timingMargin], burns: [burn] }))) break;
        return { charge, lead, burn, actions, nearLandings, lateTakeoffs, duration: elapsed, fuelUsed: flight.fuel - p.fuel, exit: { y: 0, angle: 0, vx: p.vx }, clearanceVerified: true, timingMargin };
      }
    }
  }
  return null;
}

// supabase/rulesets/roadster-v432/director.js
function createDirector6({ S, flight, pace, economy, boosters, spawnDistance, sceneTime = () => S.t, random: random3 = Math.random, relative = false }) {
  const initial = () => ({ wave: 0, last: null, fallbacks: 0, waiting: false, hardStreak: 0, leg: -1, legStartedAt: 0, groundSinceAir: 0, airCount: 0, lastAirAt: -1e9 });
  const state = initial();
  function reset() {
    Object.assign(state, initial());
  }
  function spawn() {
    if (flight.airborne || pace.recovery || pace.falling || S.obs.some((o) => !o.passed)) {
      S.next = 0.18;
      state.waiting = true;
      return;
    }
    state.waiting = false;
    const { id: biome, leg } = biomeAt4(S.score || 0);
    if (leg !== state.leg) {
      state.leg = leg;
      state.legStartedAt = S.t;
    }
    const stage = stageAt6(pace.progress), afterAir = state.last?.kind === "air", breath = afterAir || state.wave % 5 === 4 || state.hardStreak >= 2;
    const airDue = leg >= 2 && S.t - state.legStartedAt >= 8 && state.groundSinceAir >= 6 && S.t - state.lastAirAt >= 28;
    const pools = [["single"], ["single"], ["pair", "single"], ["single", "pair"], ["precision", "single", "pair"], ["pair", "precision", "thrust"], ["pair", "precision", "thrust"]];
    let kind = breath || airDue ? "single" : pools[stage][Math.floor(random3() * pools[stage].length)];
    const factoryIds = ["truck", "t800", "bydSeal", "xiaomiSu7", "batteryAgv", "xi"];
    const choices = OBSTACLES6.filter((o) => !o.altitude && o.collision !== "none" && (o.biomes === "all" || o.biomes.includes(biome)) && (biome !== "tesla-factory" || factoryIds.includes(o.id)) && (stage === 0 ? o.h <= 64 : stage < 2 ? o.h <= 94 : true));
    if (kind === "thrust" && flight.fuel < 65) kind = "pair";
    let type = choices[Math.floor(random3() * choices.length)], dx = spawnDistance();
    if (airDue && !breath && state.last?.kind === "single") {
      const first = state.airCount < 2;
      const pool = AIR_TYPES6.filter((o) => (o.biomes === "all" || o.biomes.includes(biome)) && (!first || o.h <= 55 && o.w <= 110));
      const model = pool[Math.floor(random3() * pool.length)];
      type = { ...model, altitude: first ? 24 : 32, approachSpeed: first ? 80 : 110 };
      kind = "air";
      dx = Math.max(dx, (S.speed + type.approachSpeed) * 2);
    }
    let obstacles = makePattern6(kind, { speed: S.speed, type, dx });
    let route = validateRoute6(obstacles, { flight, pace, economy, time: sceneTime(), boosterState: boosters, allowThrust: kind !== "air", timingMargin: kind === "air" ? 0.09 : GAMEPLAY6.routeTimingMargin });
    if (route && route.fuelUsed > 0 && flight.fuel - route.fuelUsed < GAMEPLAY6.routeFuelReserve) route = null;
    if (!route) {
      state.fallbacks++;
      kind = "single";
      obstacles = makePattern6(kind, { speed: S.speed, type: OBSTACLES6.find((o) => o.id === "truck"), dx });
      route = validateRoute6(obstacles, { flight, pace, economy, time: sceneTime(), boosterState: boosters, timingMargin: GAMEPLAY6.routeTimingMargin });
    }
    if (!route) {
      S.next = 0.3;
      return;
    }
    state.hardStreak = ["precision", "thrust"].includes(kind) ? state.hardStreak + 1 : 0;
    if (kind === "air") {
      state.airCount++;
      state.groundSinceAir = 0;
      state.lastAirAt = S.t;
    } else state.groundSinceAir++;
    state.wave++;
    state.last = { kind, stage, biome, leg, route, startedAt: S.t };
    for (const o of obstacles) S.obs.push({ ...o, x: o.x + (relative ? 0 : S.anchor), uid: ++S.entityId, passed: false, nearPaid: false, latePaid: false });
    S.next = kind === "air" ? route.duration + 1.25 : breath ? 2.3 : 1.2;
  }
  return { reset, spawn, state };
}

// supabase/rulesets/roadster-v432/random.js
function createRandom6(seed) {
  if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) throw Error("Invalid run seed");
  let state = seed;
  return { next() {
    state = state + 1831565813 >>> 0;
    let t = state;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }, get state() {
    return state;
  }, restore(value) {
    if (!Number.isInteger(value) || value < 0 || value > 4294967295) throw Error("Invalid random state");
    state = value;
  } };
}

// supabase/rulesets/roadster-v432/run.js
var RULESET6 = "roadster-v4.3.2";
var RUN_STEP6 = 1 / 120;
var RUN_COMMANDS6 = Object.freeze(["primary-down", "primary-up", "primary-cancel", "thrust-on", "thrust-off", "cancel"]);
var MAX_RECORDED_TICKS6 = 120 * 60 * 60;
var MAX_RECORDED_EVENTS6 = 24e3;
function createRun6({ seed = 0, record = true, reducedMotion = false } = {}) {
  const S = { mode: "menu", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY6.startSpeed, next: 1.7, obs: [], entityId: 0, anchor: 0 }, Q = createBoosters2(seed), P = createFlight6(), E = createEconomy6(), pace = createPace6(), F = createFall6(), input = { charging: false, charge: 0, spin: false, thrust: false };
  let random3 = createRandom6(seed), events = [], log = [], lateId = null, lastLanding = null, recordable = true;
  const director = createDirector6({ S, flight: P, pace, economy: E, boosters: Q, random: () => random3.next(), relative: true, sceneTime: () => S.t, spawnDistance: () => Math.max(900, S.speed * 1.5 + 180) });
  function clear() {
    Object.assign(input, { charging: false, charge: 0, spin: false, thrust: false });
    P.thrusting = false;
  }
  function sync() {
    S.t = S.tick * RUN_STEP6;
    S.speed = pace.speed;
    S.score = Math.floor(S.distance / 20 + E.bonus);
  }
  function reset(nextSeed = seed) {
    seed = nextSeed;
    random3 = createRandom6(seed);
    Object.assign(Q, createBoosters2(seed));
    Object.assign(P, createFlight6());
    Object.assign(E, createEconomy6());
    Object.assign(pace, createPace6());
    Object.assign(F, createFall6());
    Object.assign(S, { mode: "playing", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY6.startSpeed, next: 1.7, obs: [], entityId: 0, lastCharge: 0 });
    clear();
    events = [];
    log = [];
    lateId = null;
    lastLanding = null;
    recordable = true;
    director.reset();
  }
  function jump() {
    if (S.mode !== "playing" || P.airborne || F.active || pace.stumble > 0) return false;
    lateId = null;
    for (const o of S.obs) {
      if (o.altitude || o.passed) continue;
      if (nearWindow6(o.x + (o.inset || 5) - 47, S.speed + (o.approachSpeed || 0))) {
        lateId = o.uid;
        break;
      }
    }
    const charge = input.charge;
    P.jumpFactor = activeBooster2(Q, "jump") ? 1.25 : 1;
    Q.spoiledFlight = false;
    launch6(P, charge);
    S.lastCharge = charge;
    input.charging = false;
    input.charge = 0;
    input.spin = false;
    events.push({ type: "jump", charge });
    return true;
  }
  function command(action) {
    if (!RUN_COMMANDS6.includes(action)) throw Error("Unknown run command");
    if (S.mode !== "playing") return false;
    if (record && recordable) {
      if (log.length >= MAX_RECORDED_EVENTS6) recordable = false;
      else log.push([S.tick, RUN_COMMANDS6.indexOf(action)]);
    }
    if (action === "cancel") {
      clear();
      return true;
    }
    if (action === "primary-cancel") {
      input.spin = false;
      input.charging = false;
      input.charge = 0;
      return true;
    }
    if (action === "thrust-off") {
      input.thrust = false;
      return true;
    }
    if (action === "thrust-on") {
      if (!F.active) input.thrust = true;
      return true;
    }
    if (action === "primary-up") {
      if (input.charging) jump();
      input.spin = false;
      return true;
    }
    if (F.active) return hastenFall6(F);
    if (pace.stumble > 0) return false;
    if (P.airborne) {
      P.trickStarted = true;
      input.spin = true;
    } else {
      input.charging = true;
      input.charge = 0;
    }
    return true;
  }
  function step() {
    if (S.mode !== "playing") return { landed: null, impacts: 0 };
    S.tick++;
    if (S.tick > MAX_RECORDED_TICKS6) recordable = false;
    sync();
    if (input.charging) input.charge = Math.min(1, input.charge + RUN_STEP6 / GAMEPLAY6.chargeSeconds);
    advanceBoosters2(Q, RUN_STEP6);
    E.scoreFactor = activeBooster2(Q, "score") ? 3 : 1;
    pace.boost = 0.35 * Q.speedBlend;
    advanceEconomy6(E, RUN_STEP6);
    advanceStreak6(E, RUN_STEP6);
    const physicsFall = () => fallPose6({ ...F, reduced: false }), wasFalling = F.active, before = { ...P, fallPose: F.active ? physicsFall() : null };
    let landed = null, fallStep = { impacts: 0, finished: false };
    if (wasFalling) {
      fallStep = advanceFall6(F, RUN_STEP6);
      if (fallStep.finished) {
        clear();
        S.next = Math.max(S.next, 0.8);
        events.push({ type: "recovered" });
      }
    } else landed = advanceFlight6(P, RUN_STEP6, { spin: input.spin, thrust: input.thrust });
    pace.falling = F.active;
    advancePace6(pace, E, P, RUN_STEP6);
    S.distance += pace.speed * RUN_STEP6;
    E.bonus += pace.speed * RUN_STEP6 / 20 * (E.scoreFactor - 1);
    sync();
    const after = wasFalling ? { ...P, fallPose: physicsFall() } : landed ? { ...P, angle: landed.angle } : P;
    for (const o of S.obs) {
      const old = o.x;
      o.x -= (S.speed + (o.approachSpeed || 0)) * RUN_STEP6;
      if (o.smashed) {
        o.smashAge += RUN_STEP6;
        continue;
      }
      if (sweptCollision6(before, after, o, old, o.x, S.t, RUN_STEP6)) {
        if (activeBooster2(Q, "shield")) {
          o.smashed = true;
          o.smashAge = 0;
          if (!o.passed) {
            o.passed = true;
            passObstacle6(E);
          }
          events.push({ type: "smash", obstacle: { ...o } });
          continue;
        }
        if (Q.grace > 0 || Q.ghostIds.includes(o.uid)) {
          if (!Q.ghostIds.includes(o.uid)) Q.ghostIds.push(o.uid);
        } else if (Q.hearts > 0) {
          const oldMultiplier = E.multiplier;
          Q.hearts--;
          Q.grace = 2;
          Q.ghostIds.push(o.uid);
          Q.spoiledFlight = true;
          E.multiplier = 10;
          E.meter = 0;
          E.decay = 0;
          E.streak = 0;
          E.streakLeft = 0;
          events.push({ type: "rescued", oldMultiplier });
        } else {
          S.mode = "dead";
          clear();
          sync();
          events.push({ type: "death", obstacle: o });
          return { landed, impacts: fallStep.impacts };
        }
      }
      if (!o.passed && o.x + o.w < -50) {
        o.passed = true;
        passObstacle6(E);
        if (o.altitude) events.push({ type: "air-passed" });
      }
    }
    for (const orb of Q.pickups) {
      const old = orb.x;
      orb.x -= S.speed * RUN_STEP6;
      const inReach = Math.min(old, orb.x) <= 112 && Math.max(old, orb.x) >= -112 && Math.abs(P.y + 78 - orb.y) <= 122;
      if (!F.active && inReach && collectBooster2(Q, orb.id)) {
        orb.collected = true;
        events.push({ type: "pickup", id: orb.id, uid: orb.uid, x: orb.x, y: orb.y });
      }
    }
    Q.pickups = Q.pickups.filter((o) => !o.collected && o.x > -180);
    Q.ghostIds = Q.ghostIds.filter((id2) => S.obs.some((o) => o.uid === id2 && o.x + o.w > -180));
    if (landed) {
      let late = 0, near = 0;
      const target = S.obs.find((o) => o.uid === lateId);
      if (target && !target.latePaid && target.x + target.w - (target.inset || 5) < -47) {
        late = 1;
        target.latePaid = true;
      }
      for (const o of S.obs) {
        if (o.altitude || o.nearPaid) continue;
        if (nearWindow6(-47 - (o.x + o.w - (o.inset || 5)), S.speed)) {
          near++;
          o.nearPaid = true;
        }
      }
      const oldMultiplier = E.multiplier;
      lastLanding = settleLanding6(E, P, Q.spoiledFlight ? { ...landed, turns: 0, perfect: false } : landed, Q.spoiledFlight ? { late: 0, near: 0 } : { late, near });
      Q.spoiledFlight = false;
      if (!landed.good) {
        stumble6(pace);
        beginFall6(F, landed, { reduced: reducedMotion, speed: pace.recovery.target });
        pace.falling = true;
        P.angle = 0;
        P.omega = 0;
        P.vx = 0;
        P.grab = 0;
        clear();
        advancePace6(pace, E, P, 0);
      }
      events.push({ type: "landing", landed, result: lastLanding, late, near, oldMultiplier });
      lateId = null;
    }
    if (!P.airborne && Math.abs(P.angle) > 1e-3) {
      P.angle *= Math.exp(-RUN_STEP6 * 18);
      P.omega = 0;
    }
    S.obs = S.obs.filter((o) => o.smashed ? o.smashAge < 1.2 : o.uid === lateId || o.x + o.w > (o.id === "joe" ? -480 : -400));
    offerBooster2(Q, { time: S.t, speed: S.speed, clear: !P.airborne && !F.active && !pace.recovery && S.obs.every((o) => o.passed) });
    S.next -= RUN_STEP6;
    if (S.next <= 0 && !Q.pickups.length) director.spawn();
    sync();
    return { landed, impacts: fallStep.impacts };
  }
  function snapshot() {
    return structuredClone({ seed, S, P, E, pace, F, Q, input, random: random3.state, director: director.state, lateId, lastLanding });
  }
  function restore(saved) {
    seed = saved.seed;
    for (const [a, b] of [[Q, saved.Q], [S, saved.S], [P, saved.P], [E, saved.E], [pace, saved.pace], [F, saved.F], [input, saved.input], [director.state, saved.director]]) Object.assign(a, structuredClone(b));
    random3 = createRandom6(seed);
    random3.restore(saved.random);
    lateId = saved.lateId;
    lastLanding = structuredClone(saved.lastLanding);
    events = [];
  }
  function replay() {
    return recordable ? { format: 1, ruleset: RULESET6, seed, ticks: S.tick, events: log.map((e) => [...e]) } : null;
  }
  return { S, P, E, pace, F, Q, input, director, reset, jump, command, step, sync, snapshot, restore, replay, drainEvents() {
    const next = events;
    events = [];
    return next;
  }, get lastLanding() {
    return lastLanding;
  }, get seed() {
    return seed;
  }, get recordable() {
    return recordable;
  } };
}
function validateReplay6(value) {
  if (!value || value.format !== 1 || value.ruleset !== RULESET6 || !Number.isInteger(value.seed) || value.seed < 0 || value.seed > 4294967295 || !Number.isInteger(value.ticks) || value.ticks < 1 || value.ticks > MAX_RECORDED_TICKS6 || !Array.isArray(value.events) || value.events.length > MAX_RECORDED_EVENTS6) throw Error("Invalid or unsupported replay");
  let previous = -1;
  for (const event of value.events) {
    if (!Array.isArray(event) || event.length !== 2 || !Number.isInteger(event[0]) || event[0] < previous || event[0] < 0 || event[0] >= value.ticks || !Number.isInteger(event[1]) || event[1] < 0 || event[1] >= RUN_COMMANDS6.length) throw Error("Invalid replay input");
    previous = event[0];
  }
  return value;
}
function verifyReplay6(value) {
  const replay = validateReplay6(value), run = createRun6({ seed: replay.seed, record: false });
  run.reset();
  let event = 0;
  while (run.S.tick < replay.ticks && run.S.mode === "playing") {
    while (event < replay.events.length && replay.events[event][0] === run.S.tick) run.command(RUN_COMMANDS6[replay.events[event++][1]]);
    run.step();
    run.drainEvents();
  }
  if (run.S.mode !== "dead" || run.S.tick !== replay.ticks || event !== replay.events.length) throw Error("Replay does not end at its first collision");
  return { score: run.S.score, flips: run.E.flips, ticks: run.S.tick };
}

// supabase/rulesets.mjs
var supported = new Map([run_exports, run_exports2, run_exports3, run_exports4, run_exports5, run_exports6].map((r) => [r.RULESET, r]));
function ruleset(id2) {
  const r = supported.get(id2);
  if (!r) throw Error("Unsupported ruleset");
  return r;
}

// supabase/chunk.mjs
function verifyChunk(value, checkpoint = null, { maxTicks = 6e3, budgetMs = 400, now = () => performance.now() } = {}) {
  const { createRun: createRun7, validateReplay: validateReplay7, RUN_COMMANDS: RUN_COMMANDS7 } = ruleset(value?.ruleset);
  const replay = validateReplay7(value), run = createRun7({ seed: replay.seed, record: false });
  run.reset();
  let event = 0;
  if (checkpoint) {
    run.restore(checkpoint.run);
    event = checkpoint.event;
  }
  const start = run.S.tick, started = now();
  while (run.S.tick < replay.ticks && run.S.mode === "playing" && run.S.tick - start < maxTicks) {
    while (event < replay.events.length && replay.events[event][0] === run.S.tick) run.command(RUN_COMMANDS7[replay.events[event++][1]]);
    run.step();
    run.drainEvents();
    if ((run.S.tick - start) % 32 === 0 && now() - started >= budgetMs) break;
  }
  if (run.S.mode === "dead" || run.S.tick === replay.ticks) {
    if (run.S.mode !== "dead" || run.S.tick !== replay.ticks || event !== replay.events.length) return { outcome: "rejected", progress: run.S.tick };
    return { outcome: "accepted", result: { score: run.S.score, flips: run.E.flips, ticks: run.S.tick } };
  }
  return { outcome: "pending", progress: run.S.tick, checkpoint: { run: run.snapshot(), event } };
}

// supabase/handler.mjs
var enc = new TextEncoder();
var ORIGINS = ["https://gleb20.github.io", "http://127.0.0.1:8766", "http://127.0.0.1:8767", "http://localhost:8767"];
var ApiError = class extends Error {
  constructor(code, status = 400) {
    super(code);
    this.code = code;
    this.status = status;
  }
};
var hex = (b) => Array.from(new Uint8Array(b), (v) => v.toString(16).padStart(2, "0")).join("");
var hash = async (v) => hex(await crypto.subtle.digest("SHA-256", enc.encode(v)));
var id = (v) => {
  if (typeof v !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(v)) throw new ApiError("invalid_id");
  return v;
};
var name = (v) => {
  if (typeof v !== "string") throw new ApiError("invalid_nickname");
  v = v.normalize("NFKC").trim().replace(/ +/g, " ");
  if ([...v].length < 3 || [...v].length > 12 || !/^[\p{L}\p{N} _-]+$/u.test(v)) throw new ApiError("invalid_nickname");
  return v;
};
async function body(req, max = 524288) {
  if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json")) throw new ApiError("json_required", 415);
  if (Number(req.headers.get("content-length")) > max) throw new ApiError("body_too_large", 413);
  const reader = req.body?.getReader();
  if (!reader) throw new ApiError("invalid_body");
  let n = 0;
  const chunks = [];
  try {
    while (true) {
      const x = await reader.read();
      if (x.done) break;
      n += x.value.length;
      if (n > max) {
        await reader.cancel();
        throw new ApiError("body_too_large", 413);
      }
      chunks.push(x.value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(n);
  let i = 0;
  for (const x of chunks) {
    bytes.set(x, i);
    i += x.length;
  }
  try {
    const v = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (!v || typeof v !== "object" || Array.isArray(v)) throw Error();
    return v;
  } catch {
    throw new ApiError("invalid_body");
  }
}
function createHandler({ rpc, chunk = verifyChunk } = {}) {
  return async (req) => {
    const origin = req.headers.get("origin"), headers = { "Cache-Control": "no-store", "Vary": "Origin", "X-Content-Type-Options": "nosniff", "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type,Authorization,apikey,X-Run-Capability" };
    if (ORIGINS.includes(origin)) headers["Access-Control-Allow-Origin"] = origin;
    const json = (v, status = 200) => Response.json(v, { status, headers });
    try {
      const url = new URL(req.url), prefix = "/functions/v1/tesla-ranking", path = url.pathname.replace(/^\/(?:functions\/v1\/)?tesla-ranking(?=\/|$)/, "") || "/";
      if (req.method === "OPTIONS") {
        if (!ORIGINS.includes(origin)) throw new ApiError("origin_not_allowed", 403);
        return new Response(null, { status: 204, headers });
      }
      if (req.method !== "GET" && !ORIGINS.includes(origin)) throw new ApiError("origin_not_allowed", 403);
      if (path === "/health" && req.method === "GET") return json(await rpc("health", {}));
      if (path === "/scores" && req.method === "GET") {
        const page = Number(url.searchParams.get("page") || 1), snapshot = url.searchParams.get("snapshot");
        if (!Number.isInteger(page) || page < 1 || page > 1e4) throw new ApiError("invalid_page");
        if (snapshot !== null && (!Number.isSafeInteger(Number(snapshot)) || Number(snapshot) < 0)) throw new ApiError("invalid_snapshot");
        return json(await rpc("scores", { page, ...snapshot === null ? {} : { snapshot: Number(snapshot) } }));
      }
      if (path === "/preview" && req.method === "GET") {
        const score = Number(url.searchParams.get("score"));
        if (!Number.isSafeInteger(score) || score < 0 || score > 1e8) throw new ApiError("invalid_score");
        const page = url.searchParams.get("page");
        if (page !== null && (!Number.isInteger(Number(page)) || Number(page) < 1 || Number(page) > 1e4)) throw new ApiError("invalid_page");
        return json(await rpc("preview", { score, ...page ? { page: Number(page) } : {} }));
      }
      if (path.startsWith("/scores/") && req.method === "GET") return json(await rpc("entry", { id: id(path.slice(8)) }));
      if (path === "/sessions" && req.method === "POST") {
        const b = await body(req, 1024);
        try {
          ruleset(b.ruleset);
        } catch {
          throw new ApiError("ruleset_unavailable", 409);
        }
        const capability = hex(crypto.getRandomValues(new Uint8Array(32))), value = await rpc("create", { id: crypto.randomUUID(), publicId: crypto.randomUUID(), tokenHash: await hash(capability), seed: crypto.getRandomValues(new Uint32Array(1))[0], ruleset: b.ruleset });
        return json({ ...value, capability }, 201);
      }
      const match = path.match(/^\/sessions\/([^/]+)$/);
      const decorate = (v) => ({ ...v, continue: v.status === "pending", verifierUrl: null });
      if (match) {
        const cap = req.headers.get("x-run-capability") || req.headers.get("authorization")?.match(/^Bearer ([0-9a-f]{64})$/)?.[1];
        if (!cap || !/^[0-9a-f]{64}$/.test(cap)) throw new ApiError("unauthorized", 401);
        const p = { id: id(match[1]), tokenHash: await hash(cap) };
        if (req.method === "GET") return json(decorate(await rpc("get", p)));
        if (req.method !== "POST") throw new ApiError("method_not_allowed", 405);
        const b = await body(req), nickname = name(b.nickname);
        try {
          ruleset(b.replay?.ruleset).validateReplay(b.replay);
        } catch {
          throw new ApiError("invalid_replay");
        }
        const replay = { format: 1, ruleset: b.replay.ruleset, seed: b.replay.seed, ticks: b.replay.ticks, events: b.replay.events.map((e) => [e[0], e[1]]) };
        if (b.score !== void 0 && (!Number.isSafeInteger(b.score) || b.score < 0 || b.score > 1e8)) throw new ApiError("invalid_score");
        return json(decorate(await rpc("submit", { ...p, nickname, replay, ...b.score === void 0 ? {} : { claimedScore: b.score }, payloadHash: await hash(JSON.stringify({ nickname, replay })) })), 202);
      }
      if (path === "/verify" && req.method === "POST") {
        const b = await body(req, 1024);
        if (typeof b.capability !== "string" || !/^[0-9a-f]{64}$/.test(b.capability)) throw new ApiError("unauthorized", 401);
        const p = { id: id(b.sessionId), tokenHash: await hash(b.capability), lease: crypto.randomUUID() }, job = await rpc("claim", p);
        if (job.status !== "verifying") return json(decorate(job));
        const result = chunk(job.replay, job.checkpoint);
        return json(decorate(await rpc("advance", { ...p, revision: job.revision, ...result })));
      }
      throw new ApiError("not_found", 404);
    } catch (e) {
      if (e instanceof ApiError) return json({ error: e.code }, e.status);
      return json({ error: "service_unavailable" }, 503);
    }
  };
}
function createRpc({ url, key: key2, fetcher = fetch }) {
  return async (action, payload) => {
    const res = await fetcher(url + "/rest/v1/rpc/tesla_ranking_rpc", { method: "POST", headers: { "Content-Type": "application/json", apikey: key2, ...key2.startsWith("sb_secret_") ? {} : { Authorization: "Bearer " + key2 } }, body: JSON.stringify({ action, payload }), signal: AbortSignal.timeout(12e3) });
    const value = await res.json();
    if (!res.ok) {
      const code = value.message?.match(/TJ:([a-z_]+)/)?.[1];
      if (code) {
        const status = code === "unauthorized" ? 401 : code === "not_found" ? 404 : code === "rate_limited" ? 429 : code.includes("paused") ? 503 : code.includes("conflict") || code.includes("busy") || code === "stale_lease" ? 409 : code === "session_expired" ? 410 : 400;
        throw new ApiError(code, status);
      }
      throw Error("Database request failed");
    }
    return value;
  };
}

// supabase/entry.mjs
var secrets = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
var key = secrets.default || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!key) throw Error("Service credentials unavailable");
Deno.serve(createHandler({ rpc: createRpc({ url: Deno.env.get("SUPABASE_URL"), key }) }));
