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
function createDirector({ S, flight, pace, economy, spawnDistance, sceneTime = () => S.t, random: random7 = Math.random, relative = false }) {
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
    let kind = breath ? "single" : pools[stage][Math.floor(random7() * pools[stage].length)];
    if (!breath && stage === 3 && pace.progress < 72) kind = "hover";
    const choices = OBSTACLES.filter((o) => !o.altitude && (stage === 0 ? o.h <= 64 : stage < 2 ? o.h <= 94 : true));
    if (kind === "thrust" && flight.fuel < 65) kind = "pair";
    const type = choices[Math.floor(random7() * choices.length)], dx = spawnDistance();
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
  let random7 = createRandom(seed), events = [], log = [], lateId = null, lastLanding = null, recordable = true;
  const director = createDirector({ S, flight: P, pace, economy: E, random: () => random7.next(), relative: true, sceneTime: () => S.t, spawnDistance: () => Math.max(900, S.speed * 1.5 + 180) });
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
    random7 = createRandom(seed);
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
    return structuredClone({ seed, S, P, E, pace, F, input, random: random7.state, director: director.state, lateId, lastLanding });
  }
  function restore(saved) {
    seed = saved.seed;
    for (const [a, b] of [[S, saved.S], [P, saved.P], [E, saved.E], [pace, saved.pace], [F, saved.F], [input, saved.input], [director.state, saved.director]]) Object.assign(a, structuredClone(b));
    random7 = createRandom(seed);
    random7.restore(saved.random);
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
function createDirector2({ S, flight, pace, economy, spawnDistance, sceneTime = () => S.t, random: random7 = Math.random, relative = false }) {
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
    let kind = breath ? "single" : pools[stage][Math.floor(random7() * pools[stage].length)];
    if (!breath && stage === 3 && pace.progress < 72) kind = "hover";
    const choices = OBSTACLES2.filter((o) => !o.altitude && (stage === 0 ? o.h <= 64 : stage < 2 ? o.h <= 94 : true));
    if (kind === "thrust" && flight.fuel < 65) kind = "pair";
    const type = choices[Math.floor(random7() * choices.length)], dx = spawnDistance();
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
  let random7 = createRandom2(seed), events = [], log = [], lateId = null, lastLanding = null, recordable = true;
  const director = createDirector2({ S, flight: P, pace, economy: E, random: () => random7.next(), relative: true, sceneTime: () => S.t, spawnDistance: () => Math.max(900, S.speed * 1.5 + 180) });
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
    random7 = createRandom2(seed);
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
    return structuredClone({ seed, S, P, E, pace, F, input, random: random7.state, director: director.state, lateId, lastLanding });
  }
  function restore(saved) {
    seed = saved.seed;
    for (const [a, b] of [[S, saved.S], [P, saved.P], [E, saved.E], [pace, saved.pace], [F, saved.F], [input, saved.input], [director.state, saved.director]]) Object.assign(a, structuredClone(b));
    random7 = createRandom2(seed);
    random7.restore(saved.random);
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
function createDirector3({ S, flight, pace, economy, spawnDistance, sceneTime = () => S.t, random: random7 = Math.random, relative = false }) {
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
    let kind = breath ? "single" : pools[stage][Math.floor(random7() * pools[stage].length)];
    const biome = biomeAt(S.score || 0).id;
    const factoryIds3 = ["truck", "t800", "bydSeal", "xiaomiSu7", "batteryAgv"];
    const choices = OBSTACLES3.filter((o) => !o.altitude && o.collision !== "none" && (o.biomes === "all" || o.biomes.includes(biome)) && (biome !== "tesla-factory" || factoryIds3.includes(o.id)) && (stage === 0 ? o.h <= 64 : stage < 2 ? o.h <= 94 : true));
    if (kind === "thrust" && flight.fuel < 65) kind = "pair";
    const type = choices[Math.floor(random7() * choices.length)], dx = spawnDistance();
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
  let random7 = createRandom3(seed), events = [], log = [], lateId = null, lastLanding = null, recordable = true;
  const director = createDirector3({ S, flight: P, pace, economy: E, random: () => random7.next(), relative: true, sceneTime: () => S.t, spawnDistance: () => Math.max(900, S.speed * 1.5 + 180) });
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
    random7 = createRandom3(seed);
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
    return structuredClone({ seed, S, P, E, pace, F, input, random: random7.state, director: director.state, lateId, lastLanding });
  }
  function restore(saved) {
    seed = saved.seed;
    for (const [a, b] of [[S, saved.S], [P, saved.P], [E, saved.E], [pace, saved.pace], [F, saved.F], [input, saved.input], [director.state, saved.director]]) Object.assign(a, structuredClone(b));
    random7 = createRandom3(seed);
    random7.restore(saved.random);
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
function createDirector4({ S, flight, pace, economy, spawnDistance, sceneTime = () => S.t, random: random7 = Math.random, relative = false }) {
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
    let kind = breath || airDue ? "single" : pools[stage][Math.floor(random7() * pools[stage].length)];
    const factoryIds3 = ["truck", "t800", "bydSeal", "xiaomiSu7", "batteryAgv", "xi"];
    const choices = OBSTACLES4.filter((o) => !o.altitude && o.collision !== "none" && (o.biomes === "all" || o.biomes.includes(biome)) && (biome !== "tesla-factory" || factoryIds3.includes(o.id)) && (stage === 0 ? o.h <= 64 : stage < 2 ? o.h <= 94 : true));
    if (kind === "thrust" && flight.fuel < 65) kind = "pair";
    let type = choices[Math.floor(random7() * choices.length)], dx = spawnDistance();
    if (airDue && !breath && state.last?.kind === "single") {
      const first = state.airCount < 2;
      const pool = AIR_TYPES4.filter((o) => (o.biomes === "all" || o.biomes.includes(biome)) && (!first || o.h <= 55 && o.w <= 110));
      const model = pool[Math.floor(random7() * pool.length)];
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
  let random7 = createRandom4(seed), events = [], log = [], lateId = null, lastLanding = null, recordable = true;
  const director = createDirector4({ S, flight: P, pace, economy: E, random: () => random7.next(), relative: true, sceneTime: () => S.t, spawnDistance: () => Math.max(900, S.speed * 1.5 + 180) });
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
    random7 = createRandom4(seed);
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
    return structuredClone({ seed, S, P, E, pace, F, input, random: random7.state, director: director.state, lateId, lastLanding });
  }
  function restore(saved) {
    seed = saved.seed;
    for (const [a, b] of [[S, saved.S], [P, saved.P], [E, saved.E], [pace, saved.pace], [F, saved.F], [input, saved.input], [director.state, saved.director]]) Object.assign(a, structuredClone(b));
    random7 = createRandom4(seed);
    random7.restore(saved.random);
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
  const eligible3 = (id3) => id3 === "life" ? q.hearts < 2 : activeBooster(q, id3) || Object.keys(q.active).length < 3;
  let index = q.bag.findIndex(eligible3);
  if (index < 0) {
    q.nextAt = time + 2;
    return null;
  }
  const id2 = q.bag.splice(index, 1)[0], pickup = { id: id2, uid: ++q.serial, x: Math.max(900, speed * 1.9 + 180), y: q.serial === 1 || random(q) < 0.55 ? 104 : 240 };
  q.pickups.push(pickup);
  if (q.serial > 1 && random(q) < 0.4) {
    const second = q.bag.findIndex((other) => other !== id2 && eligible3(other));
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
function createDirector5({ S, flight, pace, economy, boosters, spawnDistance, sceneTime = () => S.t, random: random7 = Math.random, relative = false }) {
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
    let kind = breath || airDue ? "single" : pools[stage][Math.floor(random7() * pools[stage].length)];
    const factoryIds3 = ["truck", "t800", "bydSeal", "xiaomiSu7", "batteryAgv", "xi"];
    const choices = OBSTACLES5.filter((o) => !o.altitude && o.collision !== "none" && (o.biomes === "all" || o.biomes.includes(biome)) && (biome !== "tesla-factory" || factoryIds3.includes(o.id)) && (stage === 0 ? o.h <= 64 : stage < 2 ? o.h <= 94 : true));
    if (kind === "thrust" && flight.fuel < 65) kind = "pair";
    let type = choices[Math.floor(random7() * choices.length)], dx = spawnDistance();
    if (airDue && !breath && state.last?.kind === "single") {
      const first = state.airCount < 2;
      const pool = AIR_TYPES5.filter((o) => (o.biomes === "all" || o.biomes.includes(biome)) && (!first || o.h <= 55 && o.w <= 110));
      const model = pool[Math.floor(random7() * pool.length)];
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
  let random7 = createRandom5(seed), events = [], log = [], lateId = null, lastLanding = null, recordable = true;
  const director = createDirector5({ S, flight: P, pace, economy: E, boosters: Q, random: () => random7.next(), relative: true, sceneTime: () => S.t, spawnDistance: () => Math.max(900, S.speed * 1.5 + 180) });
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
    random7 = createRandom5(seed);
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
    return structuredClone({ seed, S, P, E, pace, F, Q, input, random: random7.state, director: director.state, lateId, lastLanding });
  }
  function restore(saved) {
    seed = saved.seed;
    for (const [a, b] of [[Q, saved.Q], [S, saved.S], [P, saved.P], [E, saved.E], [pace, saved.pace], [F, saved.F], [input, saved.input], [director.state, saved.director]]) Object.assign(a, structuredClone(b));
    random7 = createRandom5(seed);
    random7.restore(saved.random);
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
  const eligible3 = (id3) => id3 === "life" ? q.hearts < 2 : activeBooster2(q, id3) || Object.keys(q.active).length < 3;
  let index = q.bag.findIndex(eligible3);
  if (index < 0) {
    q.nextAt = time + 2;
    return null;
  }
  const id2 = q.bag.splice(index, 1)[0], pickup = { id: id2, uid: ++q.serial, x: Math.max(900, speed * 1.9 + 180), y: q.serial === 1 || random2(q) < 0.55 ? 104 : 240 };
  q.pickups.push(pickup);
  if (q.serial > 1 && random2(q) < 0.4) {
    const second = q.bag.findIndex((other) => other !== id2 && eligible3(other));
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
function createDirector6({ S, flight, pace, economy, boosters, spawnDistance, sceneTime = () => S.t, random: random7 = Math.random, relative = false }) {
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
    let kind = breath || airDue ? "single" : pools[stage][Math.floor(random7() * pools[stage].length)];
    const factoryIds3 = ["truck", "t800", "bydSeal", "xiaomiSu7", "batteryAgv", "xi"];
    const choices = OBSTACLES6.filter((o) => !o.altitude && o.collision !== "none" && (o.biomes === "all" || o.biomes.includes(biome)) && (biome !== "tesla-factory" || factoryIds3.includes(o.id)) && (stage === 0 ? o.h <= 64 : stage < 2 ? o.h <= 94 : true));
    if (kind === "thrust" && flight.fuel < 65) kind = "pair";
    let type = choices[Math.floor(random7() * choices.length)], dx = spawnDistance();
    if (airDue && !breath && state.last?.kind === "single") {
      const first = state.airCount < 2;
      const pool = AIR_TYPES6.filter((o) => (o.biomes === "all" || o.biomes.includes(biome)) && (!first || o.h <= 55 && o.w <= 110));
      const model = pool[Math.floor(random7() * pool.length)];
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
  let random7 = createRandom6(seed), events = [], log = [], lateId = null, lastLanding = null, recordable = true;
  const director = createDirector6({ S, flight: P, pace, economy: E, boosters: Q, random: () => random7.next(), relative: true, sceneTime: () => S.t, spawnDistance: () => Math.max(900, S.speed * 1.5 + 180) });
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
    random7 = createRandom6(seed);
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
    return structuredClone({ seed, S, P, E, pace, F, Q, input, random: random7.state, director: director.state, lateId, lastLanding });
  }
  function restore(saved) {
    seed = saved.seed;
    for (const [a, b] of [[Q, saved.Q], [S, saved.S], [P, saved.P], [E, saved.E], [pace, saved.pace], [F, saved.F], [input, saved.input], [director.state, saved.director]]) Object.assign(a, structuredClone(b));
    random7 = createRandom6(seed);
    random7.restore(saved.random);
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

// supabase/rulesets/roadster-v440/run.js
var run_exports7 = {};
__export(run_exports7, {
  RULESET: () => RULESET7,
  RUN_COMMANDS: () => RUN_COMMANDS7,
  RUN_STEP: () => RUN_STEP7,
  createRun: () => createRun7,
  validateReplay: () => validateReplay7,
  verifyReplay: () => verifyReplay7
});

// supabase/rulesets/roadster-v440/gameplay-config.js?v=4.4.0
var GAMEPLAY7 = Object.freeze({
  version: "4.4.0",
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

// supabase/rulesets/roadster-v440/enemy-sprite-data.js
var ENEMY_SPRITES5 = Object.freeze({ "sikorsky": { "file": "assets/encounters/v400/sikorsky.png", "w": 176, "h": 89.146, "pixels": [768, 389], "sourcePixels": [1536, 1024], "sourceCrop": [13, 146, 1520, 909], "alphaExtrema": [0, 255], "sha256": "5619dd383d0bbb6ed7115f767f21f1e86e720d2aeb9ce3f0f41a182f15da3520" }, "xi": { "file": "assets/encounters/v400/xi.png", "w": 72, "h": 109.281, "pixels": [506, 768], "sourcePixels": [1024, 1536], "sourceCrop": [51, 65, 978, 1471], "alphaExtrema": [0, 255], "sha256": "56f56642f4f29a2b3c6655a442be59d4df5f781327c20299fa9ff596f69c6ac0" }, "t800": { "file": "assets/encounters/v400/t800.png", "w": 57, "h": 109.44, "pixels": [400, 768], "sourcePixels": [1024, 1536], "sourceCrop": [183, 66, 925, 1489], "alphaExtrema": [0, 255], "sha256": "1661f9bf004a65db0c178ca6d7b17e42d9963299f627f450016e9443125495f8" }, "ufo": { "file": "assets/encounters/v400/ufo.png", "w": 104, "h": 47.26, "pixels": [768, 349], "sourcePixels": [1672, 940], "sourceCrop": [141, 130, 1535, 763], "alphaExtrema": [0, 255], "sha256": "926e3e760155afe3acbc9215b35465a78e3a49039762c7ff89f8bf1c1e8ec358" }, "primeDrone": { "file": "assets/encounters/v400/primeDrone.png", "w": 110, "h": 48.984, "pixels": [768, 342], "sourcePixels": [1821, 864], "sourceCrop": [10, 31, 1812, 833], "alphaExtrema": [0, 255], "sha256": "a46783dc00dd76be690c29c72f92fa834a02b2522aac366058cc2972822ab681" }, "twitterBird": { "file": "assets/encounters/v400/twitterBird.png", "w": 76, "h": 50.568, "pixels": [768, 511], "sourcePixels": [1536, 1024], "sourceCrop": [85, 50, 1460, 964], "alphaExtrema": [0, 255], "sha256": "46436e2c78ac2ac104426b8bc898f047cb8ee934a9b1a5dd08631a554f5ee94e" }, "homelessRow": { "file": "assets/encounters/v400/homelessRow.png", "w": 142, "h": 40.122, "pixels": [768, 217], "sourcePixels": [2073, 758], "sourceCrop": [79, 124, 2012, 670], "alphaExtrema": [0, 255], "sha256": "03ed702ddb2d5cd06d2c6174b8e88edce01a22adbae68570d268de367ea49806" }, "bydSeal": { "file": "assets/encounters/v400/bydSeal.png", "w": 138, "h": 44.562, "pixels": [768, 248], "sourcePixels": [2172, 724], "sourceCrop": [144, 74, 2061, 693], "alphaExtrema": [0, 255], "sha256": "840376084d808030f6900dbad884a825703c1dd7736fc147db457098759d8b69" }, "xiaomiSu7": { "file": "assets/encounters/v400/xiaomiSu7.png", "w": 138, "h": 42.047, "pixels": [768, 234], "sourcePixels": [1903, 826], "sourceCrop": [26, 190, 1877, 753], "alphaExtrema": [0, 255], "sha256": "3187a0f29bc97d4a73a1186cc1fbd60785ac6beea61dc55a10d7d70184e20bab" }, "batteryAgv": { "file": "assets/encounters/v400/batteryAgv.png", "w": 118, "h": 41.177, "pixels": [768, 268], "sourcePixels": [2012, 782], "sourceCrop": [131, 113, 1878, 722], "alphaExtrema": [0, 255], "sha256": "82d12e8efdb89038ea0351b7dc942754be9ab9f78aed29a88b2c4a12a8cc6d79" }, "qualitySkull": { "file": "assets/encounters/v400/qualitySkull.png", "w": 76, "h": 40.87, "pixels": [768, 413], "sourcePixels": [1536, 1024], "sourceCrop": [183, 152, 1413, 814], "alphaExtrema": [0, 255], "sha256": "955bb780f34142f0f9302839283022730bfd1c7688c48c46ac59cc18ad994d4b" }, "starlink": { "file": "assets/encounters/v400/starlink.png", "w": 112, "h": 69.271, "pixels": [768, 475], "sourcePixels": [1559, 1009], "sourceCrop": [76, 97, 1491, 973], "alphaExtrema": [0, 255], "sha256": "3988083ecbf0294a0c50b44df0bd8283347a56d5d9ffabe36ff6aa3a281d9e08" }, "regulatorDrone": { "file": "assets/encounters/v400/regulatorDrone.png", "w": 106, "h": 47.065, "pixels": [768, 341], "sourcePixels": [1536, 1024], "sourceCrop": [15, 176, 1521, 845], "alphaExtrema": [0, 255], "sha256": "99140365f63c6e6af46fafbfd90380459ae5e0a4e5709dfc371ebd1c3a5cf830" }, "reptileHead": { "file": "assets/encounters/v400/reptileHead.png", "w": 68, "h": 79.416, "pixels": [274, 320], "sourcePixels": [1173, 1341], "sourceCrop": [121, 97, 1077, 1212], "alphaExtrema": [0, 255], "sha256": "dc627f44d9efbaae3b93c44c5377ce25b518751b691071cf11a26f3670bcfa49" }, "moltenVat": { "file": "assets/encounters/v400/moltenVat.png", "w": 164, "h": 134.745, "pixels": [768, 631], "sourcePixels": [1351, 1164], "sourceCrop": [54, 71, 1298, 1093], "alphaExtrema": [0, 255], "sha256": "f7fe4d31e0588da095c2647e5548d3b8bebdd67aa9cbdcfe6e619963bd1198ca" } });

// supabase/rulesets/roadster-v440/content.js?v=4.4.0
function freeze7(value) {
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) freeze7(item);
    Object.freeze(value);
  }
  return value;
}
var BIOMES7 = freeze7(["spaceport", "tesla-factory"]);
var BIOME_CYCLE7 = freeze7(["spaceport", "tesla-factory"]);
var ANIMATIONS7 = freeze7(["taunt", "angry-look", "point-and-laugh", "trampoline-bounce", "money-guns", "podcast", "throw", "lightning", "reptile", "look"]);
var ASSETS7 = freeze7({
  ...Object.fromEntries(Object.entries(ENEMY_SPRITES5).map(([id2, s]) => ["encounter_" + id2, { file: s.file }])),
  encounter_moltenVat: { file: "assets/encounters/v411/moltenVat.png" },
  collage: { file: "collage-atlas.png" },
  extras: { file: "collage-extras.png" },
  cast: { file: "paper-cast.png" },
  photos: { file: "obstacle-photos.png" },
  joe: { file: "assets/characters/joe-rogan.png" },
  amber: { file: "assets/characters/amber-head-v247.png" },
  drone: { file: "assets/obstacles/phantom-v3.png" }
});
var none7 = { enabled: false };
var reaction7 = (animationId, trigger = "near", range = 300, space = "target") => ({ enabled: true, animationId, trigger, range, space });
function define7(base, options = {}) {
  return freeze7({
    ...base,
    definitionVersion: 1,
    category: options.category || "object",
    placement: base.altitude ? "air" : "ground",
    anchor: base.altitude ? "air-bottom-center" : "ground-center",
    biomes: options.biomes || "all",
    visual: { renderer: options.renderer || "prop", key: options.key || base.id, assets: options.assets || [], bob: options.bob || false },
    collision: options.collision || "box",
    reactions: { hero: options.hero || none7, obstacle: options.obstacle || none7 },
    collectible: true,
    provenance: "assets-provenance.json"
  });
}
function spriteDefinition5(id2, name2, options, altitude = 0) {
  const s = ENEMY_SPRITES5[
    /** @type {keyof typeof ENEMY_SPRITES} */
    id2
  ];
  return define7({ id: id2, name: name2, w: s.w, h: s.h, inset: id2 === "t800" ? 10 : 5, ...altitude ? { altitude } : {} }, { ...options, renderer: "sprite", assets: ["encounter_" + id2] });
}
var OBSTACLES7 = freeze7([
  define7({ id: "v8", name: "V8 \u2022 VERY LOUD", w: 108, h: 36 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define7({ id: "trump", name: "TARIFF MAN", w: 54, h: 94 }, { renderer: "character", assets: ["collage"], category: "person", bob: true, hero: reaction7("taunt"), obstacle: reaction7("angry-look") }),
  define7({ id: "protest", name: "COUCH CRITICS", w: 102, h: 94 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "group" }),
  define7({ id: "truck", name: "CYBERBRICK", w: 110, h: 41 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define7({ id: "doge", name: "MUCH WOW", w: 52, h: 64 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "animal" }),
  define7({ id: "pump", name: "BIG OIL", w: 54, h: 78 }, {}),
  define7({ id: "zuck", name: "ZUCK", w: 62, h: 94, inset: 5 }, { renderer: "character", assets: ["cast"], category: "person", hero: reaction7("money-guns", "airborne-near"), obstacle: reaction7("money-guns", "airborne-near") }),
  define7({ id: "openai", name: "OPENAI", w: 70, h: 68, inset: 5 }, { category: "emblem" }),
  define7({ id: "claude", name: "CLAUDE", w: 84, h: 73, inset: 6 }, { category: "emblem" }),
  define7({ id: "gemini", name: "GEMINI", w: 58, h: 78, inset: 4 }, { category: "emblem" }),
  define7({ id: "rogozin", name: "ROGOZIN / TRAMPOLINE", w: 88, h: 130, inset: 4 }, { renderer: "character", assets: ["cast"], category: "person", biomes: ["spaceport"], collision: "trampoline", hero: reaction7("point-and-laugh", "airborne-near"), obstacle: reaction7("trampoline-bounce", "passage") }),
  define7({ id: "amber", name: "AMBER HEARD", w: 58, h: 94, inset: 9 }, { renderer: "character", assets: ["amber"], category: "person", obstacle: reaction7("throw", "passage") }),
  define7({ id: "joe", name: "JOE ROGAN", w: 76, h: 94, inset: 10 }, { renderer: "character", assets: ["joe"], category: "person", hero: reaction7("podcast", "passage", 650, "self"), obstacle: reaction7("podcast", "passage", 650, "self") }),
  define7({ id: "muscleCoupe", name: "AMERICAN MUSCLE", w: 138, h: 45, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define7({ id: "muscleCompact", name: "SMALL BLOCK / BIG EGO", w: 112, h: 38, inset: 5 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define7({ id: "pickup", name: "BIG TRUCK ENERGY", w: 140, h: 57, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  ...[
    ["homelessRow", "SPARE CHANGE", "group", "all"],
    ["t800", "T-800 / AUTOMATION", "person", ["tesla-factory"]],
    ["bydSeal", "BYD SEAL", "vehicle", ["tesla-factory"]],
    ["xiaomiSu7", "XIAOMI SU7", "vehicle", ["tesla-factory"]],
    ["batteryAgv", "BATTERY SWAP", "vehicle", ["tesla-factory"]]
  ].map(([id2, name2, category, biomes]) => spriteDefinition5(String(id2), String(name2), { category: String(category), biomes: Array.isArray(biomes) ? biomes : "all" })),
  ...[
    ["ufo", "UNIDENTIFIED FLYING OPPORTUNITY", "all"],
    ["primeDrone", "PRIME PERSONAL SPACE", "all"],
    ["twitterBird", "THE FORMER BIRD", ["spaceport"]],
    ["starlink", "STARLINK / WRONG ORBIT", ["spaceport"]],
    ["regulatorDrone", "APPROVAL PENDING", "all"],
    ["sikorsky", "SIKORSKY / VS-300", ["spaceport"]],
    ["qualitySkull", "QUALITY CONTROL", ["tesla-factory"]]
  ].map(([id2, name2, biomes]) => spriteDefinition5(String(id2), String(name2), { category: "flying enemy", biomes: Array.isArray(biomes) ? biomes : "all", collision: "box", hero: reaction7(id2 === "ufo" ? "reptile" : "look", "near", 320) }, 32)),
  spriteDefinition5("xi", "COMRADE XI", { category: "person", biomes: ["tesla-factory"], collision: "box", hero: reaction7("lightning", "near", 380), obstacle: reaction7("lightning", "near", 380) })
]);
var PROP_TYPES7 = freeze7(OBSTACLES7.filter((o) => ["muscleCoupe", "muscleCompact", "pickup"].includes(o.id)));
var AIR_TYPES7 = freeze7(OBSTACLES7.filter((o) => o.placement === "air"));
var definitionsById7 = new Map(OBSTACLES7.map((o) => [o.id, o]));
var obstacleDefinition7 = (id2) => definitionsById7.get(id2);
function validateContent7(definitions = OBSTACLES7) {
  const errors = [], ids = /* @__PURE__ */ new Set();
  for (const o of definitions) {
    if (!o.id || ids.has(o.id)) errors.push(`duplicate or missing id: ${o.id}`);
    ids.add(o.id);
    if (!Number.isFinite(o.w) || !Number.isFinite(o.h) || o.w <= 0 || o.h <= 6) errors.push(`${o.id}: invalid size`);
    if (!["ground", "air"].includes(o.placement)) errors.push(`${o.id}: invalid placement`);
    if (o.placement === "air" && (!Number.isFinite(o.altitude) || !(Number(o.altitude) > 0))) errors.push(`${o.id}: invalid altitude`);
    if (o.placement === "ground" && o.altitude) errors.push(`${o.id}: ground altitude`);
    if (!["ground-center", "air-bottom-center"].includes(o.anchor)) errors.push(`${o.id}: invalid anchor`);
    if (o.biomes !== "all" && (!Array.isArray(o.biomes) || !o.biomes.length || o.biomes.some((b) => !BIOMES7.includes(b)))) errors.push(`${o.id}: unknown biome`);
    if (!o.visual || !["photo", "cutout", "character", "prop", "drone", "sprite"].includes(o.visual.renderer)) errors.push(`${o.id}: missing renderer`);
    for (const id2 of o.visual?.assets || []) if (!Object.hasOwn(ASSETS7, id2)) errors.push(`${o.id}: unknown asset ${id2}`);
    if (!["box", "trampoline", "none"].includes(o.collision)) errors.push(`${o.id}: missing collision profile`);
    if (o.inset !== void 0 && (!Number.isFinite(o.inset) || o.inset < 0 || o.inset * 2 >= o.w)) errors.push(`${o.id}: invalid inset`);
    for (
      const direction of
      /** @type {const} */
      ["hero", "obstacle"]
    ) {
      const r = o.reactions?.[direction];
      if (!r || typeof r.enabled !== "boolean") errors.push(`${o.id}: missing ${direction} reaction`);
      else if (r.enabled && (!ANIMATIONS7.includes(r.animationId) || !["near", "airborne-near", "passage"].includes(r.trigger) || !(r.range > 0) || !["target", "self"].includes(r.space))) errors.push(`${o.id}: missing animation ${r.animationId}`);
    }
  }
  return errors;
}
var contentErrors7 = validateContent7();
if (contentErrors7.length) throw new Error(`Invalid content: ${contentErrors7.join("; ")}`);

// supabase/rulesets/roadster-v440/physics.js?v=4.4.0
var STEP7 = 1 / 120;
function rogozinBounce7(time) {
  return 20 * Math.abs(Math.sin(time * 4.5));
}
function obstacleBoxes7(o, time = 0) {
  if ((o.collision || obstacleDefinition7(o.id)?.collision) === "trampoline") {
    return [
      { left: 6, right: o.w - 6, top: 16 },
      { left: o.w / 2 - 18, right: o.w / 2 + 18, top: 108 + rogozinBounce7(time) }
    ];
  }
  const inset = o.inset ?? 5;
  return [{ left: inset, right: o.w - inset, top: o.h - 6 }];
}

// supabase/rulesets/roadster-v440/fall.js?v=4.4.0
var clamp13 = (x) => Math.max(0, Math.min(1, x));
var ease7 = (x) => {
  x = clamp13(x);
  return x * x * (3 - 2 * x);
};
var mix7 = (a, b, t) => a + (b - a) * t;
var FALL_CONTACTS7 = Object.freeze([0.14, 0.36, 0.56]);
var FALL_CAR_CONTACTS7 = Object.freeze([0.16, 0.38]);
var FALL_CAR_HULL7 = Object.freeze([[-49, -7], [-8, -15], [8, -15], [48.5, 0], [47, 6], [27, 12], [-34, 12], [-46, 5]].map(Object.freeze));
function fallCarSupport7(angle) {
  return Math.max(...FALL_CAR_HULL7.map(([x, y]) => x * Math.sin(angle) + y * Math.cos(angle)));
}
var arc7 = (p, a, b, height) => {
  const t = clamp13((p - a) / (b - a));
  return t < 1e-12 || t > 1 - 1e-12 ? 0 : height * 4 * t * (1 - t);
};
var pulse7 = (p, hit) => ease7((p - hit + 0.035) / 0.035) * (1 - ease7((p - hit) / 0.055));
function track7(keys, p) {
  let i = 1;
  while (i < keys.length - 1 && p > keys[i][0]) i++;
  const [a, b] = [keys[i - 1], keys[i]];
  return mix7(a[1], b[1], ease7((p - a[0]) / (b[0] - a[0])));
}
function createFall7() {
  return { active: false, age: 0, duration: GAMEPLAY7.fallSeconds, rate: 1, taps: 0, angle: 0, reduced: false };
}
function beginFall7(f, result, { reduced = false, speed = GAMEPLAY7.startSpeed } = {}) {
  const angle = Math.atan2(Math.sin(result.angle), Math.cos(result.angle));
  const severity = clamp13((speed - GAMEPLAY7.startSpeed) / (GAMEPLAY7.maxSpeed - GAMEPLAY7.startSpeed));
  Object.assign(f, { active: true, age: 0, duration: GAMEPLAY7.fallSeconds + GAMEPLAY7.fallSpeedSeconds * severity, rate: 1, taps: 0, angle, reduced });
}
function hastenFall7(f) {
  if (!f.active) return false;
  f.taps++;
  f.rate = Math.min(GAMEPLAY7.fallMaxRate, f.rate + GAMEPLAY7.fallTapRate);
  return true;
}
function advanceFall7(f, dt) {
  if (!f.active) return { impacts: 0, finished: false };
  const previous = f.age;
  f.age = Math.min(f.duration, f.age + dt * f.rate);
  const impacts = FALL_CONTACTS7.filter((t) => previous < f.duration * t && f.age >= f.duration * t).length;
  f.active = f.age < f.duration;
  return { impacts, finished: !f.active };
}
function fallPose7(f) {
  const p = clamp13(f.age / f.duration), sit = ease7(p / 0.14), stand = ease7((p - 0.68) / 0.16), gather = ease7((p - 0.7) / 0.22), settle = clamp13((p - 0.97) / 0.03);
  const impact = Math.max(...FALL_CONTACTS7.map((hit) => pulse7(p, hit))), seat = sit * (1 - stand);
  const crouch = (0.72 + 0.18 * impact) * seat + (settle === 1 ? 0 : 0.1 * Math.sin(settle * Math.PI));
  const lift = p < 0.36 ? arc7(p, 0.14, 0.36, 32) : p < 0.56 ? arc7(p, 0.36, 0.56, 28) : arc7(p, 0.56, 0.97, 112);
  const angle = mix7(f.angle, -0.64, sit) * (1 - stand);
  const seatAnchor = -11 * Math.sin(angle) + (22.5 + 27 * crouch) * Math.cos(angle) + 9;
  const rider = { x: 34 * sit * (1 - gather), y: mix7(95, seatAnchor, seat) + lift, angle, seat, crouch, lift };
  const entry = (y) => ({ x: Math.sin(f.angle) * (y - 65), y: 65 + Math.cos(f.angle) * (y - 65) });
  const e = entry(95), c = entry(12);
  rider.x += e.x * (1 - sit);
  rider.y += (e.y - 95) * (1 - sit);
  const carAngle = track7([[0, f.angle], [0.16, 0.95], [0.29, Math.PI], [0.38, 2 * Math.PI - 1.02], [0.54, 2 * Math.PI], [1, 2 * Math.PI]], p);
  const carHop = p < 0.16 ? arc7(p, 0, 0.16, 20) : p < 0.38 ? arc7(p, 0.16, 0.38, 22) : arc7(p, 0.38, 0.54, 8);
  const car = { x: gather === 1 ? 0 : mix7(c.x, -88, ease7(p / 0.16)) * (1 - gather), y: p >= 0.54 ? 12 : mix7(c.y, fallCarSupport7(carAngle) + carHop, ease7(p / 0.06)), angle: carAngle, phase: 0 };
  let shake = 0;
  for (const hit of FALL_CONTACTS7) if (p >= hit) shake = Math.max(shake, Math.exp(-(p - hit) * 40));
  const pose = { car, rider, crouch, impact, flail: sit * (1 - ease7((p - 0.82) / 0.12)), push: 0, shake: shake * 2.4, progress: p };
  if (f.reduced) {
    pose.car = { x: 0, y: 12, angle: 0, phase: 0 };
    pose.rider = { x: 0, y: 95, angle: 0, seat: 0, crouch };
    pose.shake = 0;
    pose.push = 0;
    pose.flail = 0;
  }
  return pose;
}
function fallPolygons7(pose) {
  const seat = pose.rider.seat || 0, crouch = pose.rider.crouch || 0;
  const rider = [[-23, -70 + 4 * seat], [23 + 48 * seat, -70 + 4 * seat], [23 + 48 * seat, 68 - 27 * crouch], [-23, 68 - 27 * crouch]];
  return [[pose.car, FALL_CAR_HULL7.map(([x, y]) => [x, -y])], [pose.rider, rider]].map(([body2, vertices]) => {
    const c = Math.cos(body2.angle), s = Math.sin(body2.angle);
    return vertices.map(([x, y]) => ({ x: body2.x + c * x + s * y, y: body2.y - s * x + c * y }));
  });
}
function interpolateFall7(a, b, t) {
  const pose = {};
  for (const part of ["car", "rider"]) {
    pose[part] = {};
    for (const k of ["x", "y", "angle", "seat", "crouch", "phase"]) pose[part][k] = mix7(a[part][k] || 0, b[part][k] || 0, t);
  }
  return pose;
}

// supabase/rulesets/roadster-v440/gameplay.js?v=4.4.0
var TAU7 = Math.PI * 2;
var clamp14 = (x, a, b) => Math.max(a, Math.min(b, x));
var approach7 = (x, target, amount) => x < target ? Math.min(target, x + amount) : Math.max(target, x - amount);
function uprightError7(angle, direction = -1) {
  let e = ((angle + Math.PI) % TAU7 + TAU7) % TAU7 - Math.PI;
  if (Math.abs(Math.abs(e) - Math.PI) < 1e-9) e = -Math.sign(direction || -1) * Math.PI;
  return e;
}
function createFlight7(fuel = GAMEPLAY7.initialFuel) {
  return { y: 0, vy: 0, vx: 0, angle: 0, omega: 0, airborne: false, time: 0, fuel, thrusting: false, latched: false, attach: 0, maxTurn: 0, turns: 0, lastDirection: -1, trickStarted: false, grab: 0, launchVelocity: 0, jumpFactor: 1 };
}
function launch7(p, charge = 0) {
  if (p.airborne) return false;
  Object.assign(p, { y: 1e-3, vy: (GAMEPLAY7.jumpSpeed + GAMEPLAY7.chargedSpeed * clamp14(charge, 0, 1)) * (p.jumpFactor || 1), angle: 0, omega: 0, airborne: true, time: 0, latched: false, attach: 0, maxTurn: 0, turns: 0, trickStarted: false, grab: 0, launchVelocity: (GAMEPLAY7.jumpSpeed + GAMEPLAY7.chargedSpeed * clamp14(charge, 0, 1)) * (p.jumpFactor || 1) });
  return true;
}
function advanceFlight7(p, dt, { spin = false, thrust = false } = {}) {
  p.thrusting = false;
  const gripTarget = p.airborne && spin ? 1 : 0;
  p.grab = approach7(p.grab, gripTarget, dt / (gripTarget ? 0.12 : 0.18));
  if (!p.airborne) {
    p.vx *= Math.exp(-GAMEPLAY7.horizontalDrag * dt);
    return null;
  }
  p.time += dt;
  if (spin) {
    p.trickStarted = true;
    p.lastDirection = -1;
    p.omega = approach7(p.omega, -GAMEPLAY7.spinSpeed, GAMEPLAY7.spinAcceleration * dt);
  } else {
    const target = Math.sign(p.omega) * Math.min(Math.abs(p.omega), GAMEPLAY7.releaseSpeed);
    p.omega = approach7(p.omega, target, GAMEPLAY7.releaseDeceleration * dt);
  }
  p.angle += p.omega * dt;
  p.maxTurn = Math.max(p.maxTurn, -p.angle);
  p.turns = Math.floor((p.maxTurn + 1e-7) / TAU7);
  const burn = thrust ? Math.min(dt, p.fuel / GAMEPLAY7.fuelPerSecond) : 0;
  if (burn > 0) {
    p.fuel = Math.max(0, p.fuel - burn * GAMEPLAY7.fuelPerSecond);
    p.thrusting = true;
    p.latched = true;
    p.vx += Math.sin(p.angle) * GAMEPLAY7.thrustAcceleration * burn;
    p.vy += Math.cos(p.angle) * GAMEPLAY7.thrustAcceleration * burn;
  }
  if (p.latched) p.attach = Math.min(1, p.attach + dt / GAMEPLAY7.attachSeconds);
  p.vx = clamp14(p.vx * Math.exp(-GAMEPLAY7.horizontalDrag * dt), -GAMEPLAY7.maxHorizontal, GAMEPLAY7.maxHorizontal);
  p.y += p.vy * dt - 0.5 * GAMEPLAY7.gravity * dt * dt;
  p.vy -= GAMEPLAY7.gravity * dt;
  if (p.y > 0) return null;
  const good = Math.abs(uprightError7(p.angle)) <= GAMEPLAY7.landingAngle + 1e-9 && Math.abs(p.omega) <= GAMEPLAY7.landingOmega;
  const turns = good ? Math.max(p.turns, Math.round(-p.angle / TAU7)) : p.turns;
  const perfect = good && Math.abs(uprightError7(p.angle)) <= GAMEPLAY7.perfectAngle + 1e-9;
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
function createEconomy7() {
  return { scoreFactor: 1, bonus: 0, multiplier: 10, meter: 0, decay: 0, streak: 0, streakLeft: 0, flips: 0 };
}
function comboSeconds7(e) {
  return GAMEPLAY7.comboDuration - GAMEPLAY7.comboFalloff * (e.multiplier / 10 - 1);
}
function rewardAction7(e, count = 1) {
  e.multiplier = Math.min(GAMEPLAY7.maxMultiplier, e.multiplier + count * GAMEPLAY7.multiplierStep);
  e.meter = 1;
  e.decay = 0;
}
function advanceEconomy7(e, dt) {
  if (e.meter > 0) {
    const used = Math.min(dt, e.meter * comboSeconds7(e));
    e.meter = Math.max(0, e.meter - used / comboSeconds7(e));
    dt -= used;
  }
  if (e.meter === 0 && e.multiplier > 10) {
    e.decay += dt;
    while (e.decay + 1e-9 >= GAMEPLAY7.comboDecaySeconds && e.multiplier > 10) {
      e.multiplier--;
      e.decay -= GAMEPLAY7.comboDecaySeconds;
    }
  }
}
function advanceStreak7(e, dt) {
  const used = Math.min(dt, e.streakLeft);
  e.streakLeft -= used;
  e.streak = Math.max(0, e.streak - (dt - used) * GAMEPLAY7.streakDecay);
}
function passObstacle7(e) {
  const points = GAMEPLAY7.obstaclePoints * e.multiplier / 10 * (e.scoreFactor || 1);
  e.bonus += points;
  return points;
}
function settleLanding7(e, p, result, { late = 0, near = 0 } = {}) {
  if (!result.good) {
    e.multiplier = 10;
    e.meter = 0;
    e.decay = 0;
    e.streak = 0;
    e.streakLeft = 0;
    return { points: 0, turns: 0, late: 0, near: 0, perfect: false, good: false };
  }
  const n = result.turns, perfect = !!result.perfect, points = (GAMEPLAY7.flipFactor * n * (n + 1) + GAMEPLAY7.nearPoints * (late + near) + GAMEPLAY7.perfectPoints * Number(perfect)) * e.multiplier / 10 * (e.scoreFactor || 1);
  e.bonus += points;
  e.flips += n;
  p.fuel = Math.min(GAMEPLAY7.tank, p.fuel + GAMEPLAY7.fuelPerFlip * n);
  if (n + late + near + Number(perfect)) rewardAction7(e, n + late + near + Number(perfect));
  if (n || near) {
    e.streak = Math.min(GAMEPLAY7.maxStreak, e.streak + GAMEPLAY7.streakStep);
    e.streakLeft = GAMEPLAY7.streakHold;
  }
  return { points, turns: n, late, near, perfect, good: true };
}
function createPace7() {
  return { boost: 0, progress: 0, base: GAMEPLAY7.startSpeed, speed: GAMEPLAY7.startSpeed, recovery: null, stumble: 0, falling: false };
}
function stumble7(pace) {
  const target = pace.recovery?.target ?? pace.base, r = clamp14((target - GAMEPLAY7.startSpeed) / (GAMEPLAY7.maxSpeed - GAMEPLAY7.startSpeed), 0, 1);
  pace.recovery = { target, age: 0, duration: GAMEPLAY7.recoveryMin + GAMEPLAY7.recoveryExtra * r ** 1.5 };
  pace.stumble = GAMEPLAY7.stumbleSeconds;
  pace.base = target * GAMEPLAY7.recoveryRatio;
}
function recoverySpeed7(r, t) {
  const T = r.duration, d = r.target * (1 - GAMEPLAY7.recoveryRatio), v0 = r.target * GAMEPLAY7.recoveryRatio, h = 0.15, a = T - h;
  if (t <= a) return v0 + d * (t / T) ** 2;
  const u = clamp14((t - a) / h, 0, 1), start = v0 + d * (a / T) ** 2, slope = 2 * d * a / T ** 2, endSlope = r.target >= GAMEPLAY7.maxSpeed ? 0 : (GAMEPLAY7.maxSpeed - GAMEPLAY7.startSpeed) / GAMEPLAY7.rampSeconds;
  return (2 * u ** 3 - 3 * u * u + 1) * start + (u ** 3 - 2 * u * u + u) * h * slope + (-2 * u ** 3 + 3 * u * u) * r.target + (u ** 3 - u * u) * h * endSlope;
}
function advancePace7(pace, e, p, dt) {
  if (pace.recovery) {
    pace.stumble = Math.max(0, pace.stumble - dt);
    const r = pace.recovery;
    r.age = Math.min(r.duration, r.age + dt);
    pace.base = recoverySpeed7(r, r.age);
    if (r.age >= r.duration) {
      pace.base = r.target;
      pace.recovery = null;
    }
  } else if (!pace.falling) {
    pace.progress += dt;
    pace.base = GAMEPLAY7.startSpeed + (GAMEPLAY7.maxSpeed - GAMEPLAY7.startSpeed) * Math.min(1, pace.progress / GAMEPLAY7.rampSeconds);
  }
  pace.speed = Math.max(60, pace.base * (1 + e.streak) * (1 + (pace.boost || 0)) + p.vx);
  return pace.speed;
}
function playerPolygons7(p) {
  if (p.fallPose) return fallPolygons7(p.fallPose);
  const c = Math.cos(p.angle), s = Math.sin(p.angle);
  return [[-47, 0, 47, 25], [-23, 25, 23, 163 - 32 * (p.grab || 0)]].map(([l, b, r, t]) => [[l, b], [r, b], [r, t], [l, t]].map(([x, y]) => ({ x: c * x + s * (y - 65), y: p.y + 65 - s * x + c * (y - 65) })));
}
function overlaps7(poly, rect) {
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
function collisionAt7(p, o, dx, time = 0) {
  if (o.collision === "none") return false;
  if (dx > 180 || dx + o.w < -180) return false;
  const polygons = playerPolygons7(p);
  return obstacleBoxes7(o, time).some((b) => {
    const bottom = o.altitude || 0, top = bottom + b.top;
    const rect = [{ x: dx + b.left, y: bottom }, { x: dx + b.right, y: bottom }, { x: dx + b.right, y: top }, { x: dx + b.left, y: top }];
    return polygons.some((poly) => overlaps7(poly, rect));
  });
}
function sweptCollision7(before, after, o, dxBefore, dxAfter, time, dt) {
  if (Math.min(dxBefore, dxAfter) > 180 || Math.max(dxBefore, dxAfter) + o.w < -180) return false;
  const fallTravel = before.fallPose && after.fallPose ? Math.max(...["rider", "car"].map((part) => Math.abs(after.fallPose[part].angle - before.fallPose[part].angle) * (part === "car" ? 55 : 170) + Math.abs(after.fallPose[part].y - before.fallPose[part].y) + Math.abs(after.fallPose[part].x - before.fallPose[part].x))) : 0;
  const n = Math.max(1, Math.ceil((Math.abs(dxAfter - dxBefore) + Math.abs(after.y - before.y) + Math.abs(after.angle - before.angle) * 170 + fallTravel) / 4));
  for (let i = 0; i <= n; i++) {
    const f = i / n, p = { y: before.y + (after.y - before.y) * f, angle: before.angle + (after.angle - before.angle) * f, grab: (before.grab || 0) + ((after.grab || 0) - (before.grab || 0)) * f };
    if (before.fallPose && after.fallPose) p.fallPose = interpolateFall7(before.fallPose, after.fallPose, f);
    if (collisionAt7(p, o, dxBefore + (dxAfter - dxBefore) * f, time - dt + dt * f)) return true;
  }
  return false;
}
function nearWindow7(distance, speed) {
  return distance >= 0 && distance <= Math.max(0, speed) * GAMEPLAY7.nearSeconds + 1e-8;
}

// supabase/rulesets/roadster-v440/boosters.js?v=4.4.0
var BOOSTERS3 = Object.freeze({
  shield: Object.freeze({ name: "INVINCIBLE", seconds: 8, color: "#7ce5f3" }),
  speed: Object.freeze({ name: "OVERDRIVE", seconds: 8, color: "#ffad62" }),
  jump: Object.freeze({ name: "HIGH JUMP", seconds: 12, color: "#d9ff62" }),
  life: Object.freeze({ name: "EXTRA LIFE", seconds: 0, color: "#ff6a78" }),
  score: Object.freeze({ name: "SCORE \xD73", seconds: 10, color: "#ffc86d" })
});
function createBoosters3(seed = 0) {
  return { active: {}, hearts: 0, grace: 0, ghostIds: [], speedBlend: 0, pickups: [], nextAt: 8, serial: 0, bag: [], random: (seed ^ 2772213271) >>> 0, spoiledFlight: false };
}
var activeBooster3 = (q, id2) => (q?.active[id2] || 0) > 0;
function canCollectBooster2(q, id2) {
  return !!BOOSTERS3[id2] && (id2 === "life" ? q.hearts < 2 : activeBooster3(q, id2) || Object.keys(q.active).length < 3);
}
function collectBooster3(q, id2) {
  const def = BOOSTERS3[id2];
  if (!canCollectBooster2(q, id2)) return false;
  if (id2 === "life") {
    if (q.hearts >= 2) return false;
    q.hearts++;
    return true;
  }
  if (!activeBooster3(q, id2) && Object.keys(q.active).length >= 3) return false;
  q.active[id2] = def.seconds;
  return true;
}
function advanceBoosters3(q, dt) {
  for (const id2 of Object.keys(q.active)) {
    q.active[id2] = Math.max(0, q.active[id2] - dt);
    if (q.active[id2] === 0) delete q.active[id2];
  }
  q.grace = Math.max(0, q.grace - dt);
  const target = activeBooster3(q, "speed") ? 1 : 0, delta = dt / (target ? 0.6 : 0.8);
  q.speedBlend = target ? Math.min(1, q.speedBlend + delta) : Math.max(0, q.speedBlend - delta);
}
function random3(q) {
  q.random = Math.imul(q.random, 1664525) + 1013904223 >>> 0;
  return q.random / 4294967296;
}
function offerBooster3(q, { time, speed, clear }) {
  if (!clear || q.pickups.length || time < q.nextAt) return null;
  if (!q.bag.length) {
    q.bag = Object.keys(BOOSTERS3);
    for (let i = q.bag.length - 1; i > 0; i--) {
      const j = Math.floor(random3(q) * (i + 1));
      [q.bag[i], q.bag[j]] = [q.bag[j], q.bag[i]];
    }
  }
  const eligible3 = (id3) => id3 === "life" ? q.hearts < 2 : activeBooster3(q, id3) || Object.keys(q.active).length < 3;
  let index = q.bag.findIndex(eligible3);
  if (index < 0) {
    q.nextAt = time + 2;
    return null;
  }
  const id2 = q.bag.splice(index, 1)[0], pickup = { id: id2, uid: ++q.serial, x: Math.max(900, speed * 1.9 + 180), y: q.serial === 1 || random3(q) < 0.55 ? 104 : 240 };
  q.pickups.push(pickup);
  if (q.serial > 1 && random3(q) < 0.4) {
    const second = q.bag.findIndex((other) => other !== id2 && eligible3(other));
    if (second >= 0) {
      const next = q.bag.splice(second, 1)[0];
      q.pickups.push({ id: next, uid: ++q.serial, x: pickup.x + 240, y: pickup.y });
    }
  }
  q.nextAt = time + 14 + random3(q) * 6;
  return pickup;
}

// supabase/rulesets/roadster-v440/rails.js?v=4.4.0
var RAIL = Object.freeze({ height: 190, length: 720, belly: 8, pointsPerUnit: 0.1, firstWave: 3, every: 7, exitSeconds: 1.25 });
var makeRail = (x) => ({ x, w: RAIL.length, h: RAIL.height, paid: [], passed: false });
var createGrind = () => ({ support: null, age: 0, exit: null, exitAge: 1, pending: 0, distance: 0, turns: 0 });
var railContactHeight = (p) => p.y + 65 + (RAIL.belly - 65) * Math.cos(p.angle);
function leaveRail(g, p) {
  g.support = null;
  g.age = 0;
  g.exit = "end";
  g.exitAge = 0;
  p.airborne = true;
  p.angle = uprightError7(p.angle);
  p.omega = 0;
  p.maxTurn = Math.max(0, -p.angle);
  p.turns = 0;
  p.time = 0;
  p.launchVelocity = 0;
  p.trickStarted = true;
}
function jumpFromRail(g, p, charge) {
  const y = p.y, angle = uprightError7(p.angle);
  leaveRail(g, p);
  p.airborne = false;
  launch7(p, charge);
  p.y += y;
  p.angle = angle;
  p.trickStarted = true;
  g.exit = "jump";
}
function newDistance(rail, a, b) {
  a = Math.max(0, a);
  b = Math.min(rail.w, b);
  if (b <= a) return 0;
  let fresh = b - a;
  for (const [l, r] of rail.paid) fresh -= Math.max(0, Math.min(b, r) - Math.max(a, l));
  const ranges = [...rail.paid, [a, b]].sort((x, y) => x[0] - y[0]), merged = [];
  for (const range of ranges) {
    const last = merged.at(-1);
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([...range]);
  }
  rail.paid = merged;
  return Math.max(0, fresh);
}
function advanceRail(g, p, before, rails, travel, dt, e, { spoiled = false, blocked = false } = {}) {
  g.exitAge = Math.min(1, g.exitAge + dt);
  const events = [], oldXs = rails.map((r) => r.x);
  for (const r of rails) {
    r.x -= travel;
    r.passed = r.x + r.w < 0;
  }
  let fraction = 0, rail = rails.find((r) => r.uid === g.support);
  if (g.support && !rail) {
    leaveRail(g, p);
    events.push({ type: "rail-exit", reason: "end" });
    return events;
  }
  if (!rail && !blocked && before.airborne) {
    const old = railContactHeight(before), now = railContactHeight(p);
    const good = p.vy <= 0 && Math.abs(uprightError7(p.angle)) <= GAMEPLAY7.landingAngle + 1e-9 && Math.abs(p.omega) <= GAMEPLAY7.landingOmega;
    if (good && old >= RAIL.height && now <= RAIL.height && old > now) {
      fraction = (old - RAIL.height) / (old - now);
      rail = rails.find((r, i) => {
        const x = oldXs[i] - travel * fraction;
        return x <= 0 && x + r.w >= 0;
      });
      if (rail) {
        g.support = rail.uid;
        g.age = 0;
        g.turns += Math.max(p.turns, Math.round(-p.angle / (Math.PI * 2)));
        p.turns = 0;
        p.airborne = false;
        p.omega = 0;
        p.vy = 0;
        p.thrusting = false;
        p.grab = 0;
        events.push({ type: "rail-catch", uid: rail.uid, impact: Math.abs(before.vy) });
      }
    }
  }
  if (rail) {
    const i = rails.indexOf(rail), start = -oldXs[i] + travel * fraction, end = -rail.x;
    const distance = newDistance(rail, start, end);
    if (!spoiled) {
      g.distance += distance;
      g.pending += distance * RAIL.pointsPerUnit * e.multiplier / 10 * (e.scoreFactor || 1);
    }
    g.age += dt * (1 - fraction);
    p.y = rail.h - 65 - (RAIL.belly - 65) * Math.cos(p.angle);
    p.vy = 0;
    p.omega = 0;
    p.thrusting = false;
    if (distance > 0) events.push({ type: "rail-travel", uid: rail.uid, distance, points: spoiled ? 0 : distance * RAIL.pointsPerUnit * e.multiplier / 10 * (e.scoreFactor || 1) });
    if (rail.x + rail.w <= 0) {
      leaveRail(g, p);
      events.push({ type: "rail-exit", reason: "end" });
    }
  }
  return events;
}
function validateRailRoute(rail, { flight = createFlight7(), pace = createPace7(), economy = createEconomy7(), boosterState = null, margin = 0.09 } = {}) {
  if (flight.airborne || pace.recovery || pace.falling) return null;
  const simulate = (lead, charge) => {
    const p = { ...flight }, r = structuredClone(pace), e = { ...economy }, q = boosterState ? structuredClone(boosterState) : null, g = createGrind(), rails = [{ ...structuredClone(rail), uid: 1 }], actions = [];
    let jumped = false, caught = false, charging = false, held = 0;
    for (let tick = 0; tick < 1800; tick++) {
      const dt = 1 / 120, t = tick * dt;
      if (!jumped && rails[0].x / Math.max(1, r.speed) <= lead + charge * GAMEPLAY7.chargeSeconds) {
        if (!charging) {
          charging = true;
          actions.push({ at: t, action: "hold" });
        }
        held += dt;
        if (held + 1e-9 >= charge * GAMEPLAY7.chargeSeconds + (charge > 0 ? dt : 0)) {
          p.jumpFactor = q && activeBooster3(q, "jump") ? 1.25 : 1;
          launch7(p, Math.min(1, (held - dt) / GAMEPLAY7.chargeSeconds));
          jumped = true;
          actions.push({ at: t, action: "jump", charge });
        }
      }
      if (q) {
        advanceBoosters3(q, dt);
        r.boost = 0.35 * q.speedBlend;
      }
      advanceEconomy7(e, dt);
      advanceStreak7(e, dt);
      const before = { ...p }, landed = advanceFlight7(p, dt);
      advancePace7(r, e, p, dt);
      const events = advanceRail(g, p, before, rails, r.speed * dt, dt, e);
      if (events.some((v) => v.type === "rail-catch")) caught = true;
      if (landed && !g.support) {
        if (!landed.good) return null;
        if (caught && rails[0].passed) return { charge, lead, burn: 0, actions, duration: t, fuelUsed: 0, clearanceVerified: true, timingMargin: margin, exit: { y: 0, angle: 0, vx: p.vx } };
      }
    }
    return null;
  };
  for (const charge of [0.5, 1]) for (const lead of [0.25, 0.35, 0.45, 0.55]) {
    const route = simulate(lead, charge);
    if (route && simulate(lead - margin, charge) && simulate(lead + margin, charge)) return route;
  }
  return null;
}

// supabase/rulesets/roadster-v440/biomes.js?v=4.4.0
var BIOME_SCORE_STEP5 = 7e3;
var SCENERY_CYCLE5 = BIOME_CYCLE7;
function biomeAt5(score = 0) {
  const points = Number.isFinite(score) ? Math.max(0, score) : 0;
  const leg = Math.floor(points / BIOME_SCORE_STEP5), nextAt = (leg + 1) * BIOME_SCORE_STEP5;
  return { id: SCENERY_CYCLE5[leg % SCENERY_CYCLE5.length], leg, nextAt, nextIn: nextAt - points };
}

// supabase/rulesets/roadster-v440/routes.js?v=4.4.0
var STAGES7 = GAMEPLAY7.stages;
function stageAt7(progress) {
  return STAGES7.filter((t) => progress >= t).length - 1;
}
function makePattern7(kind, { speed = 360, type = { id: "truck", w: 110, h: 41 }, dx = 900 } = {}) {
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
function validateRoute7(obstacles, { flight = createFlight7(), pace = createPace7(), economy = createEconomy7(), time = 0, boosterState = null, allowThrust = true, burns = null, timingMargin = 0, leads = [0.1, 0.11, 0.115, 0.12, 0.125, 0.14, 0.16, 0.2, 0.3, 0.4, 0.5, 0.65], charges = [0, 0.5, 1] } = {}) {
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
        if (!charging && ttc <= lead + charge * GAMEPLAY7.chargeSeconds) {
          charging = true;
          held = 0;
          actions.push({ at: elapsed, action: "hold" });
        }
        if (charging) {
          held += dt;
          if (held + 1e-9 >= charge * GAMEPLAY7.chargeSeconds + (charge > 0 ? dt : 0)) {
            lateTarget = nearWindow7(next.x + (next.inset || 5) - 47, r.speed + (next.approachSpeed || 0)) ? next : null;
            p.jumpFactor = q && activeBooster3(q, "jump") ? 1.25 : 1;
            launch7(p, charge);
            charging = false;
            actions.push({ at: elapsed, action: "jump", charge });
          }
        }
      }
      if (q) {
        advanceBoosters3(q, dt);
        r.boost = 0.35 * q.speedBlend;
        e.scoreFactor = activeBooster3(q, "score") ? 3 : 1;
      }
      const before = { ...p }, useThrust = p.airborne && p.time >= 0.18 && p.time < 0.18 + burn;
      if (useThrust !== lastThrust) {
        actions.push({ at: elapsed, action: useThrust ? "thrust-on" : "thrust-off" });
        lastThrust = useThrust;
      }
      const landed = advanceFlight7(p, dt, { thrust: useThrust });
      advanceEconomy7(e, dt);
      advanceStreak7(e, dt);
      advancePace7(r, e, p, dt);
      const after = landed ? { ...p, angle: landed.angle } : p;
      let alive = true;
      for (const o of obs) {
        const old = o.x;
        o.x -= (r.speed + (o.approachSpeed || 0)) * dt;
        if (sweptCollision7(before, after, o, old, o.x, time + elapsed, dt)) {
          alive = false;
          break;
        }
        if (!o.passed && o.x + o.w < -50) {
          o.passed = true;
          passObstacle7(e);
        }
      }
      if (!alive || landed && !landed.good) break;
      if (landed) {
        let near = 0;
        const late = lateTarget && lateTarget.x + lateTarget.w - (lateTarget.inset || 5) < -47 ? 1 : 0;
        for (const o of obs) if (!o.altitude && !o.nearPaid && nearWindow7(-47 - (o.x + o.w - (o.inset || 5)), r.speed)) {
          near++;
          o.nearPaid = true;
        }
        settleLanding7(e, p, landed, { late, near });
        nearLandings += near;
        lateTakeoffs += late;
        lateTarget = null;
      }
      if (obs.every((o) => o.x + o.w < -180) && !p.airborne) {
        if (timingMargin > 0 && (!validateRoute7(obstacles, { flight, pace, economy, time, boosterState, charges: [charge], leads: [lead - timingMargin], burns: [burn] }) || !validateRoute7(obstacles, { flight, pace, economy, time, boosterState, charges: [charge], leads: [lead + timingMargin], burns: [burn] }))) break;
        return { charge, lead, burn, actions, nearLandings, lateTakeoffs, duration: elapsed, fuelUsed: flight.fuel - p.fuel, exit: { y: 0, angle: 0, vx: p.vx }, clearanceVerified: true, timingMargin };
      }
    }
  }
  return null;
}

// supabase/rulesets/roadster-v440/director.js?v=4.4.0
function createDirector7({ S, flight, pace, economy, boosters, spawnDistance, sceneTime = () => S.t, random: random7 = Math.random, relative = false }) {
  const initial = () => ({ wave: 0, last: null, fallbacks: 0, waiting: false, hardStreak: 0, leg: -1, legStartedAt: 0, groundSinceAir: 0, airCount: 0, lastAirAt: -1e9 });
  const state = initial();
  function reset() {
    Object.assign(state, initial());
  }
  function spawn() {
    if (flight.airborne || pace.recovery || pace.falling || S.rails?.length > 0 || S.obs.some((o) => !o.passed)) {
      S.next = 0.18;
      state.waiting = true;
      return;
    }
    state.waiting = false;
    const { id: biome, leg } = biomeAt5(S.score || 0);
    if (leg !== state.leg) {
      state.leg = leg;
      state.legStartedAt = S.t;
    }
    if (state.wave >= RAIL.firstWave && (state.wave - RAIL.firstWave) % RAIL.every === 0 && state.last?.kind !== "air") {
      const rail = makeRail(spawnDistance()), route2 = validateRailRoute(rail, { flight, pace, economy, boosterState: boosters });
      if (route2) {
        state.wave++;
        state.hardStreak = 0;
        state.last = { kind: "rail", stage: stageAt7(pace.progress), biome, leg, route: route2, startedAt: S.t };
        (S.rails ??= []).push({ ...rail, uid: ++S.entityId });
        S.next = route2.duration + RAIL.exitSeconds;
        return;
      }
    }
    const stage = stageAt7(pace.progress), afterAir = state.last?.kind === "air", breath = afterAir || state.wave % 5 === 4 || state.hardStreak >= 2;
    const airDue = leg >= 2 && S.t - state.legStartedAt >= 8 && state.groundSinceAir >= 6 && S.t - state.lastAirAt >= 28;
    const pools = [["single"], ["single"], ["pair", "single"], ["single", "pair"], ["precision", "single", "pair"], ["pair", "precision", "thrust"], ["pair", "precision", "thrust"]];
    let kind = breath || airDue ? "single" : pools[stage][Math.floor(random7() * pools[stage].length)];
    const factoryIds3 = ["truck", "t800", "bydSeal", "xiaomiSu7", "batteryAgv", "xi"];
    const choices = OBSTACLES7.filter((o) => !o.altitude && o.collision !== "none" && (o.biomes === "all" || o.biomes.includes(biome)) && (biome !== "tesla-factory" || factoryIds3.includes(o.id)) && (stage === 0 ? o.h <= 64 : stage < 2 ? o.h <= 94 : true));
    if (kind === "thrust" && flight.fuel < 65) kind = "pair";
    let type = choices[Math.floor(random7() * choices.length)], dx = spawnDistance();
    if (airDue && !breath && state.last?.kind === "single") {
      const first = state.airCount < 2;
      const pool = AIR_TYPES7.filter((o) => (o.biomes === "all" || o.biomes.includes(biome)) && (!first || o.h <= 55 && o.w <= 110));
      const model = pool[Math.floor(random7() * pool.length)];
      type = { ...model, altitude: first ? 24 : 32, approachSpeed: first ? 80 : 110 };
      kind = "air";
      dx = Math.max(dx, (S.speed + type.approachSpeed) * 2);
    }
    let obstacles = makePattern7(kind, { speed: S.speed, type, dx });
    let route = validateRoute7(obstacles, { flight, pace, economy, time: sceneTime(), boosterState: boosters, allowThrust: kind !== "air", timingMargin: kind === "air" ? 0.09 : GAMEPLAY7.routeTimingMargin });
    if (route && route.fuelUsed > 0 && flight.fuel - route.fuelUsed < GAMEPLAY7.routeFuelReserve) route = null;
    if (!route) {
      state.fallbacks++;
      kind = "single";
      obstacles = makePattern7(kind, { speed: S.speed, type: OBSTACLES7.find((o) => o.id === "truck"), dx });
      route = validateRoute7(obstacles, { flight, pace, economy, time: sceneTime(), boosterState: boosters, timingMargin: GAMEPLAY7.routeTimingMargin });
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

// supabase/rulesets/roadster-v440/random.js?v=4.4.0
function createRandom7(seed) {
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

// supabase/rulesets/roadster-v440/run.js
var RULESET7 = "roadster-v4.4.0";
var RUN_STEP7 = 1 / 120;
var RUN_COMMANDS7 = Object.freeze(["primary-down", "primary-up", "primary-cancel", "thrust-on", "thrust-off", "cancel"]);
var MAX_RECORDED_TICKS7 = 120 * 60 * 60;
var MAX_RECORDED_EVENTS7 = 24e3;
function createRun7({ seed = 0, record = true, reducedMotion = false } = {}) {
  const S = { mode: "menu", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY7.startSpeed, next: 1.7, obs: [], rails: [], entityId: 0, anchor: 0 }, Q = createBoosters3(seed), G = createGrind(), P = createFlight7(), E = createEconomy7(), pace = createPace7(), F = createFall7(), input = { charging: false, charge: 0, spin: false, thrust: false };
  let random7 = createRandom7(seed), events = [], log = [], lateId = null, lastLanding = null, recordable = true;
  const director = createDirector7({ S, flight: P, pace, economy: E, boosters: Q, random: () => random7.next(), relative: true, sceneTime: () => S.t, spawnDistance: () => Math.max(900, S.speed * 1.5 + 180) });
  function clear() {
    Object.assign(input, { charging: false, charge: 0, spin: false, thrust: false });
    P.thrusting = false;
  }
  function sync() {
    S.t = S.tick * RUN_STEP7;
    S.speed = pace.speed;
    S.score = Math.floor(S.distance / 20 + E.bonus);
  }
  function reset(nextSeed = seed) {
    seed = nextSeed;
    random7 = createRandom7(seed);
    Object.assign(Q, createBoosters3(seed));
    Object.assign(G, createGrind());
    Object.assign(P, createFlight7());
    Object.assign(E, createEconomy7());
    Object.assign(pace, createPace7());
    Object.assign(F, createFall7());
    Object.assign(S, { mode: "playing", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY7.startSpeed, next: 1.7, obs: [], rails: [], entityId: 0, lastCharge: 0 });
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
      if (nearWindow7(o.x + (o.inset || 5) - 47, S.speed + (o.approachSpeed || 0))) {
        lateId = o.uid;
        break;
      }
    }
    const charge = input.charge;
    P.jumpFactor = activeBooster3(Q, "jump") ? 1.25 : 1;
    if (G.support) jumpFromRail(G, P, charge);
    else {
      Q.spoiledFlight = false;
      launch7(P, charge);
    }
    S.lastCharge = charge;
    input.charging = false;
    input.charge = 0;
    input.spin = false;
    events.push({ type: "jump", charge });
    return true;
  }
  function command(action) {
    if (!RUN_COMMANDS7.includes(action)) throw Error("Unknown run command");
    if (S.mode !== "playing") return false;
    if (record && recordable) {
      if (log.length >= MAX_RECORDED_EVENTS7) recordable = false;
      else log.push([S.tick, RUN_COMMANDS7.indexOf(action)]);
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
    if (F.active) return hastenFall7(F);
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
    if (S.tick > MAX_RECORDED_TICKS7) recordable = false;
    sync();
    if (input.charging) input.charge = Math.min(1, input.charge + RUN_STEP7 / GAMEPLAY7.chargeSeconds);
    advanceBoosters3(Q, RUN_STEP7);
    E.scoreFactor = activeBooster3(Q, "score") ? 3 : 1;
    pace.boost = 0.35 * Q.speedBlend;
    advanceEconomy7(E, RUN_STEP7);
    advanceStreak7(E, RUN_STEP7);
    const physicsFall = () => fallPose7({ ...F, reduced: false }), wasFalling = F.active, before = { ...P, fallPose: F.active ? physicsFall() : null };
    let landed = null, fallStep = { impacts: 0, finished: false };
    if (wasFalling) {
      fallStep = advanceFall7(F, RUN_STEP7);
      if (fallStep.finished) {
        clear();
        S.next = Math.max(S.next, 0.8);
        events.push({ type: "recovered" });
      }
    } else landed = advanceFlight7(P, RUN_STEP7, { spin: input.spin, thrust: input.thrust });
    pace.falling = F.active;
    advancePace7(pace, E, P, RUN_STEP7);
    S.distance += pace.speed * RUN_STEP7;
    E.bonus += pace.speed * RUN_STEP7 / 20 * (E.scoreFactor - 1);
    sync();
    events.push(...advanceRail(G, P, before, S.rails, S.speed * RUN_STEP7, RUN_STEP7, E, { spoiled: Q.spoiledFlight, blocked: wasFalling }));
    if (G.support) {
      landed = null;
      input.spin = false;
    }
    const after = wasFalling ? { ...P, fallPose: physicsFall() } : landed ? { ...P, angle: landed.angle } : P;
    for (const o of S.obs) {
      const old = o.x;
      o.x -= (S.speed + (o.approachSpeed || 0)) * RUN_STEP7;
      if (o.smashed) {
        o.smashAge += RUN_STEP7;
        continue;
      }
      if (sweptCollision7(before, after, o, old, o.x, S.t, RUN_STEP7)) {
        if (activeBooster3(Q, "shield")) {
          o.smashed = true;
          o.smashAge = 0;
          if (!o.passed) {
            o.passed = true;
            passObstacle7(E);
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
          G.pending = G.distance = G.turns = 0;
          E.multiplier = 10;
          E.meter = 0;
          E.decay = 0;
          E.streak = 0;
          E.streakLeft = 0;
          events.push({ type: "rescued", oldMultiplier });
        } else {
          S.mode = "dead";
          G.pending = G.distance = G.turns = 0;
          clear();
          sync();
          events.push({ type: "death", obstacle: o });
          return { landed, impacts: fallStep.impacts };
        }
      }
      if (!o.passed && o.x + o.w < -50) {
        o.passed = true;
        passObstacle7(E);
        if (o.altitude) events.push({ type: "air-passed" });
      }
    }
    for (const orb of Q.pickups) {
      const old = orb.x;
      orb.x -= S.speed * RUN_STEP7;
      const inReach = Math.min(old, orb.x) <= 112 && Math.max(old, orb.x) >= -112 && Math.abs(P.y + 78 - orb.y) <= 122;
      if (!F.active && inReach && collectBooster3(Q, orb.id)) {
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
        if (nearWindow7(-47 - (o.x + o.w - (o.inset || 5)), S.speed)) {
          near++;
          o.nearPaid = true;
        }
      }
      if (!Q.spoiledFlight) landed = { ...landed, turns: landed.turns + G.turns };
      const grindPoints = landed.good && !Q.spoiledFlight ? G.pending : 0, grindDistance = landed.good && !Q.spoiledFlight ? G.distance : 0;
      const oldMultiplier = E.multiplier;
      lastLanding = settleLanding7(E, P, Q.spoiledFlight ? { ...landed, turns: 0, perfect: false } : landed, Q.spoiledFlight ? { late: 0, near: 0 } : { late, near });
      Q.spoiledFlight = false;
      E.bonus += grindPoints;
      lastLanding.points += grindPoints;
      Object.assign(lastLanding, { grindPoints, grindDistance });
      if (grindDistance > 0) {
        rewardAction7(E);
        S.next = Math.max(S.next, RAIL.exitSeconds);
      }
      Object.assign(G, createGrind());
      if (!landed.good) {
        stumble7(pace);
        beginFall7(F, landed, { reduced: reducedMotion, speed: pace.recovery.target });
        pace.falling = true;
        P.angle = 0;
        P.omega = 0;
        P.vx = 0;
        P.grab = 0;
        clear();
        advancePace7(pace, E, P, 0);
      }
      events.push({ type: "landing", landed, result: lastLanding, late, near, oldMultiplier });
      lateId = null;
    }
    if (!P.airborne && !G.support && Math.abs(P.angle) > 1e-3) {
      P.angle *= Math.exp(-RUN_STEP7 * 18);
      P.omega = 0;
    }
    S.obs = S.obs.filter((o) => o.smashed ? o.smashAge < 1.2 : o.uid === lateId || o.x + o.w > (o.id === "joe" ? -480 : -400));
    S.rails = S.rails.filter((r) => r.x + r.w > -200 || r.uid === G.support);
    offerBooster3(Q, { time: S.t, speed: S.speed, clear: !P.airborne && !G.support && !S.rails.length && !F.active && !pace.recovery && S.obs.every((o) => o.passed) });
    S.next -= RUN_STEP7;
    if (S.next <= 0 && !Q.pickups.length) director.spawn();
    sync();
    return { landed, impacts: fallStep.impacts };
  }
  function snapshot() {
    return structuredClone({ seed, S, P, E, pace, F, Q, G, input, random: random7.state, director: director.state, lateId, lastLanding });
  }
  function restore(saved) {
    seed = saved.seed;
    for (const [a, b] of [[G, saved.G], [Q, saved.Q], [S, saved.S], [P, saved.P], [E, saved.E], [pace, saved.pace], [F, saved.F], [input, saved.input], [director.state, saved.director]]) Object.assign(a, structuredClone(b));
    random7 = createRandom7(seed);
    random7.restore(saved.random);
    lateId = saved.lateId;
    lastLanding = structuredClone(saved.lastLanding);
    events = [];
  }
  function replay() {
    return recordable ? { format: 1, ruleset: RULESET7, seed, ticks: S.tick, events: log.map((e) => [...e]) } : null;
  }
  return { S, P, E, pace, F, Q, G, input, director, reset, jump, command, step, sync, snapshot, restore, replay, drainEvents() {
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
function validateReplay7(value) {
  if (!value || value.format !== 1 || value.ruleset !== RULESET7 || !Number.isInteger(value.seed) || value.seed < 0 || value.seed > 4294967295 || !Number.isInteger(value.ticks) || value.ticks < 1 || value.ticks > MAX_RECORDED_TICKS7 || !Array.isArray(value.events) || value.events.length > MAX_RECORDED_EVENTS7) throw Error("Invalid or unsupported replay");
  let previous = -1;
  for (const event of value.events) {
    if (!Array.isArray(event) || event.length !== 2 || !Number.isInteger(event[0]) || event[0] < previous || event[0] < 0 || event[0] >= value.ticks || !Number.isInteger(event[1]) || event[1] < 0 || event[1] >= RUN_COMMANDS7.length) throw Error("Invalid replay input");
    previous = event[0];
  }
  return value;
}
function verifyReplay7(value) {
  const replay = validateReplay7(value), run = createRun7({ seed: replay.seed, record: false });
  run.reset();
  let event = 0;
  while (run.S.tick < replay.ticks && run.S.mode === "playing") {
    while (event < replay.events.length && replay.events[event][0] === run.S.tick) run.command(RUN_COMMANDS7[replay.events[event++][1]]);
    run.step();
    run.drainEvents();
  }
  if (run.S.mode !== "dead" || run.S.tick !== replay.ticks || event !== replay.events.length) throw Error("Replay does not end at its first collision");
  return { score: run.S.score, flips: run.E.flips, ticks: run.S.tick };
}

// supabase/rulesets/roadster-v442/run.js
var run_exports8 = {};
__export(run_exports8, {
  RULESET: () => RULESET8,
  RUN_COMMANDS: () => RUN_COMMANDS8,
  RUN_STEP: () => RUN_STEP8,
  createRun: () => createRun8,
  validateReplay: () => validateReplay8,
  verifyReplay: () => verifyReplay8
});

// supabase/rulesets/roadster-v442/gameplay-config.js
var GAMEPLAY8 = Object.freeze({
  version: "4.4.2",
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

// supabase/rulesets/roadster-v442/enemy-sprite-data.js
var ENEMY_SPRITES6 = Object.freeze({ "sikorsky": { "file": "assets/encounters/v400/sikorsky.png", "w": 176, "h": 89.146, "pixels": [768, 389], "sourcePixels": [1536, 1024], "sourceCrop": [13, 146, 1520, 909], "alphaExtrema": [0, 255], "sha256": "5619dd383d0bbb6ed7115f767f21f1e86e720d2aeb9ce3f0f41a182f15da3520" }, "xi": { "file": "assets/encounters/v400/xi.png", "w": 72, "h": 109.281, "pixels": [506, 768], "sourcePixels": [1024, 1536], "sourceCrop": [51, 65, 978, 1471], "alphaExtrema": [0, 255], "sha256": "56f56642f4f29a2b3c6655a442be59d4df5f781327c20299fa9ff596f69c6ac0" }, "t800": { "file": "assets/encounters/v400/t800.png", "w": 57, "h": 109.44, "pixels": [400, 768], "sourcePixels": [1024, 1536], "sourceCrop": [183, 66, 925, 1489], "alphaExtrema": [0, 255], "sha256": "1661f9bf004a65db0c178ca6d7b17e42d9963299f627f450016e9443125495f8" }, "ufo": { "file": "assets/encounters/v400/ufo.png", "w": 104, "h": 47.26, "pixels": [768, 349], "sourcePixels": [1672, 940], "sourceCrop": [141, 130, 1535, 763], "alphaExtrema": [0, 255], "sha256": "926e3e760155afe3acbc9215b35465a78e3a49039762c7ff89f8bf1c1e8ec358" }, "primeDrone": { "file": "assets/encounters/v400/primeDrone.png", "w": 110, "h": 48.984, "pixels": [768, 342], "sourcePixels": [1821, 864], "sourceCrop": [10, 31, 1812, 833], "alphaExtrema": [0, 255], "sha256": "a46783dc00dd76be690c29c72f92fa834a02b2522aac366058cc2972822ab681" }, "twitterBird": { "file": "assets/encounters/v400/twitterBird.png", "w": 76, "h": 50.568, "pixels": [768, 511], "sourcePixels": [1536, 1024], "sourceCrop": [85, 50, 1460, 964], "alphaExtrema": [0, 255], "sha256": "46436e2c78ac2ac104426b8bc898f047cb8ee934a9b1a5dd08631a554f5ee94e" }, "homelessRow": { "file": "assets/encounters/v400/homelessRow.png", "w": 142, "h": 40.122, "pixels": [768, 217], "sourcePixels": [2073, 758], "sourceCrop": [79, 124, 2012, 670], "alphaExtrema": [0, 255], "sha256": "03ed702ddb2d5cd06d2c6174b8e88edce01a22adbae68570d268de367ea49806" }, "bydSeal": { "file": "assets/encounters/v400/bydSeal.png", "w": 138, "h": 44.562, "pixels": [768, 248], "sourcePixels": [2172, 724], "sourceCrop": [144, 74, 2061, 693], "alphaExtrema": [0, 255], "sha256": "840376084d808030f6900dbad884a825703c1dd7736fc147db457098759d8b69" }, "xiaomiSu7": { "file": "assets/encounters/v400/xiaomiSu7.png", "w": 138, "h": 42.047, "pixels": [768, 234], "sourcePixels": [1903, 826], "sourceCrop": [26, 190, 1877, 753], "alphaExtrema": [0, 255], "sha256": "3187a0f29bc97d4a73a1186cc1fbd60785ac6beea61dc55a10d7d70184e20bab" }, "batteryAgv": { "file": "assets/encounters/v400/batteryAgv.png", "w": 118, "h": 41.177, "pixels": [768, 268], "sourcePixels": [2012, 782], "sourceCrop": [131, 113, 1878, 722], "alphaExtrema": [0, 255], "sha256": "82d12e8efdb89038ea0351b7dc942754be9ab9f78aed29a88b2c4a12a8cc6d79" }, "qualitySkull": { "file": "assets/encounters/v400/qualitySkull.png", "w": 76, "h": 40.87, "pixels": [768, 413], "sourcePixels": [1536, 1024], "sourceCrop": [183, 152, 1413, 814], "alphaExtrema": [0, 255], "sha256": "955bb780f34142f0f9302839283022730bfd1c7688c48c46ac59cc18ad994d4b" }, "starlink": { "file": "assets/encounters/v400/starlink.png", "w": 112, "h": 69.271, "pixels": [768, 475], "sourcePixels": [1559, 1009], "sourceCrop": [76, 97, 1491, 973], "alphaExtrema": [0, 255], "sha256": "3988083ecbf0294a0c50b44df0bd8283347a56d5d9ffabe36ff6aa3a281d9e08" }, "regulatorDrone": { "file": "assets/encounters/v400/regulatorDrone.png", "w": 106, "h": 47.065, "pixels": [768, 341], "sourcePixels": [1536, 1024], "sourceCrop": [15, 176, 1521, 845], "alphaExtrema": [0, 255], "sha256": "99140365f63c6e6af46fafbfd90380459ae5e0a4e5709dfc371ebd1c3a5cf830" }, "reptileHead": { "file": "assets/encounters/v400/reptileHead.png", "w": 68, "h": 79.416, "pixels": [274, 320], "sourcePixels": [1173, 1341], "sourceCrop": [121, 97, 1077, 1212], "alphaExtrema": [0, 255], "sha256": "dc627f44d9efbaae3b93c44c5377ce25b518751b691071cf11a26f3670bcfa49" }, "moltenVat": { "file": "assets/encounters/v400/moltenVat.png", "w": 164, "h": 134.745, "pixels": [768, 631], "sourcePixels": [1351, 1164], "sourceCrop": [54, 71, 1298, 1093], "alphaExtrema": [0, 255], "sha256": "f7fe4d31e0588da095c2647e5548d3b8bebdd67aa9cbdcfe6e619963bd1198ca" } });

// supabase/rulesets/roadster-v442/content.js
function freeze8(value) {
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) freeze8(item);
    Object.freeze(value);
  }
  return value;
}
var BIOMES8 = freeze8(["spaceport", "tesla-factory"]);
var BIOME_CYCLE8 = freeze8(["spaceport", "tesla-factory"]);
var ANIMATIONS8 = freeze8(["taunt", "angry-look", "point-and-laugh", "trampoline-bounce", "money-guns", "podcast", "throw", "lightning", "reptile", "look"]);
var ASSETS8 = freeze8({
  ...Object.fromEntries(Object.entries(ENEMY_SPRITES6).map(([id2, s]) => ["encounter_" + id2, { file: s.file }])),
  encounter_moltenVat: { file: "assets/encounters/v411/moltenVat.png" },
  collage: { file: "collage-atlas.png" },
  extras: { file: "collage-extras.png" },
  cast: { file: "paper-cast.png" },
  photos: { file: "obstacle-photos.png" },
  joe: { file: "assets/characters/joe-rogan.png" },
  amber: { file: "assets/characters/amber-head-v247.png" },
  drone: { file: "assets/obstacles/phantom-v3.png" }
});
var none8 = { enabled: false };
var reaction8 = (animationId, trigger = "near", range = 300, space = "target") => ({ enabled: true, animationId, trigger, range, space });
function define8(base, options = {}) {
  return freeze8({
    ...base,
    definitionVersion: 1,
    category: options.category || "object",
    placement: base.altitude ? "air" : "ground",
    anchor: base.altitude ? "air-bottom-center" : "ground-center",
    biomes: options.biomes || "all",
    visual: { renderer: options.renderer || "prop", key: options.key || base.id, assets: options.assets || [], bob: options.bob || false },
    collision: options.collision || "box",
    reactions: { hero: options.hero || none8, obstacle: options.obstacle || none8 },
    collectible: true,
    provenance: "assets-provenance.json"
  });
}
function spriteDefinition6(id2, name2, options, altitude = 0) {
  const s = ENEMY_SPRITES6[
    /** @type {keyof typeof ENEMY_SPRITES} */
    id2
  ];
  return define8({ id: id2, name: name2, w: s.w, h: s.h, inset: id2 === "t800" ? 10 : 5, ...altitude ? { altitude } : {} }, { ...options, renderer: "sprite", assets: ["encounter_" + id2] });
}
var OBSTACLES8 = freeze8([
  define8({ id: "v8", name: "V8 \u2022 VERY LOUD", w: 108, h: 36 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define8({ id: "trump", name: "TARIFF MAN", w: 54, h: 94 }, { renderer: "character", assets: ["collage"], category: "person", bob: true, hero: reaction8("taunt"), obstacle: reaction8("angry-look") }),
  define8({ id: "protest", name: "COUCH CRITICS", w: 102, h: 94 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "group" }),
  define8({ id: "truck", name: "CYBERBRICK", w: 110, h: 41 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define8({ id: "doge", name: "MUCH WOW", w: 52, h: 64 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "animal" }),
  define8({ id: "pump", name: "BIG OIL", w: 54, h: 78 }, {}),
  define8({ id: "zuck", name: "ZUCK", w: 62, h: 94, inset: 5 }, { renderer: "character", assets: ["cast"], category: "person", hero: reaction8("money-guns", "airborne-near"), obstacle: reaction8("money-guns", "airborne-near") }),
  define8({ id: "openai", name: "OPENAI", w: 70, h: 68, inset: 5 }, { category: "emblem" }),
  define8({ id: "claude", name: "CLAUDE", w: 84, h: 73, inset: 6 }, { category: "emblem" }),
  define8({ id: "gemini", name: "GEMINI", w: 58, h: 78, inset: 4 }, { category: "emblem" }),
  define8({ id: "rogozin", name: "ROGOZIN / TRAMPOLINE", w: 88, h: 130, inset: 4 }, { renderer: "character", assets: ["cast"], category: "person", biomes: ["spaceport"], collision: "trampoline", hero: reaction8("point-and-laugh", "airborne-near"), obstacle: reaction8("trampoline-bounce", "passage") }),
  define8({ id: "amber", name: "AMBER HEARD", w: 58, h: 94, inset: 9 }, { renderer: "character", assets: ["amber"], category: "person", obstacle: reaction8("throw", "passage") }),
  define8({ id: "joe", name: "JOE ROGAN", w: 76, h: 94, inset: 10 }, { renderer: "character", assets: ["joe"], category: "person", hero: reaction8("podcast", "passage", 650, "self"), obstacle: reaction8("podcast", "passage", 650, "self") }),
  define8({ id: "muscleCoupe", name: "AMERICAN MUSCLE", w: 138, h: 45, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define8({ id: "muscleCompact", name: "SMALL BLOCK / BIG EGO", w: 112, h: 38, inset: 5 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define8({ id: "pickup", name: "BIG TRUCK ENERGY", w: 140, h: 57, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  ...[
    ["homelessRow", "SPARE CHANGE", "group", "all"],
    ["t800", "T-800 / AUTOMATION", "person", ["tesla-factory"]],
    ["bydSeal", "BYD SEAL", "vehicle", ["tesla-factory"]],
    ["xiaomiSu7", "XIAOMI SU7", "vehicle", ["tesla-factory"]],
    ["batteryAgv", "BATTERY SWAP", "vehicle", ["tesla-factory"]]
  ].map(([id2, name2, category, biomes]) => spriteDefinition6(String(id2), String(name2), { category: String(category), biomes: Array.isArray(biomes) ? biomes : "all" })),
  ...[
    ["ufo", "UNIDENTIFIED FLYING OPPORTUNITY", "all"],
    ["primeDrone", "PRIME PERSONAL SPACE", "all"],
    ["twitterBird", "THE FORMER BIRD", ["spaceport"]],
    ["starlink", "STARLINK / WRONG ORBIT", ["spaceport"]],
    ["regulatorDrone", "APPROVAL PENDING", "all"],
    ["sikorsky", "SIKORSKY / VS-300", ["spaceport"]],
    ["qualitySkull", "QUALITY CONTROL", ["tesla-factory"]]
  ].map(([id2, name2, biomes]) => spriteDefinition6(String(id2), String(name2), { category: "flying enemy", biomes: Array.isArray(biomes) ? biomes : "all", collision: "box", hero: reaction8(id2 === "ufo" ? "reptile" : "look", "near", 320) }, 32)),
  spriteDefinition6("xi", "COMRADE XI", { category: "person", biomes: ["tesla-factory"], collision: "box", hero: reaction8("lightning", "near", 380), obstacle: reaction8("lightning", "near", 380) })
]);
var PROP_TYPES8 = freeze8(OBSTACLES8.filter((o) => ["muscleCoupe", "muscleCompact", "pickup"].includes(o.id)));
var AIR_TYPES8 = freeze8(OBSTACLES8.filter((o) => o.placement === "air"));
var definitionsById8 = new Map(OBSTACLES8.map((o) => [o.id, o]));
var obstacleDefinition8 = (id2) => definitionsById8.get(id2);
function validateContent8(definitions = OBSTACLES8) {
  const errors = [], ids = /* @__PURE__ */ new Set();
  for (const o of definitions) {
    if (!o.id || ids.has(o.id)) errors.push(`duplicate or missing id: ${o.id}`);
    ids.add(o.id);
    if (!Number.isFinite(o.w) || !Number.isFinite(o.h) || o.w <= 0 || o.h <= 6) errors.push(`${o.id}: invalid size`);
    if (!["ground", "air"].includes(o.placement)) errors.push(`${o.id}: invalid placement`);
    if (o.placement === "air" && (!Number.isFinite(o.altitude) || !(Number(o.altitude) > 0))) errors.push(`${o.id}: invalid altitude`);
    if (o.placement === "ground" && o.altitude) errors.push(`${o.id}: ground altitude`);
    if (!["ground-center", "air-bottom-center"].includes(o.anchor)) errors.push(`${o.id}: invalid anchor`);
    if (o.biomes !== "all" && (!Array.isArray(o.biomes) || !o.biomes.length || o.biomes.some((b) => !BIOMES8.includes(b)))) errors.push(`${o.id}: unknown biome`);
    if (!o.visual || !["photo", "cutout", "character", "prop", "drone", "sprite"].includes(o.visual.renderer)) errors.push(`${o.id}: missing renderer`);
    for (const id2 of o.visual?.assets || []) if (!Object.hasOwn(ASSETS8, id2)) errors.push(`${o.id}: unknown asset ${id2}`);
    if (!["box", "trampoline", "none"].includes(o.collision)) errors.push(`${o.id}: missing collision profile`);
    if (o.inset !== void 0 && (!Number.isFinite(o.inset) || o.inset < 0 || o.inset * 2 >= o.w)) errors.push(`${o.id}: invalid inset`);
    for (
      const direction of
      /** @type {const} */
      ["hero", "obstacle"]
    ) {
      const r = o.reactions?.[direction];
      if (!r || typeof r.enabled !== "boolean") errors.push(`${o.id}: missing ${direction} reaction`);
      else if (r.enabled && (!ANIMATIONS8.includes(r.animationId) || !["near", "airborne-near", "passage"].includes(r.trigger) || !(r.range > 0) || !["target", "self"].includes(r.space))) errors.push(`${o.id}: missing animation ${r.animationId}`);
    }
  }
  return errors;
}
var contentErrors8 = validateContent8();
if (contentErrors8.length) throw new Error(`Invalid content: ${contentErrors8.join("; ")}`);

// supabase/rulesets/roadster-v442/physics.js
var STEP8 = 1 / 120;
function rogozinBounce8(time) {
  return 20 * Math.abs(Math.sin(time * 4.5));
}
function obstacleBoxes8(o, time = 0) {
  if ((o.collision || obstacleDefinition8(o.id)?.collision) === "trampoline") {
    return [
      { left: 6, right: o.w - 6, top: 16 },
      { left: o.w / 2 - 18, right: o.w / 2 + 18, top: 108 + rogozinBounce8(time) }
    ];
  }
  const inset = o.inset ?? 5;
  return [{ left: inset, right: o.w - inset, top: o.h - 6 }];
}

// supabase/rulesets/roadster-v442/fall.js
var clamp15 = (x) => Math.max(0, Math.min(1, x));
var ease8 = (x) => {
  x = clamp15(x);
  return x * x * (3 - 2 * x);
};
var mix8 = (a, b, t) => a + (b - a) * t;
var FALL_CONTACTS8 = Object.freeze([0.14, 0.36, 0.56]);
var FALL_CAR_CONTACTS8 = Object.freeze([0.16, 0.38]);
var FALL_CAR_HULL8 = Object.freeze([[-49, -7], [-8, -15], [8, -15], [48.5, 0], [47, 6], [27, 12], [-34, 12], [-46, 5]].map(Object.freeze));
function fallCarSupport8(angle) {
  return Math.max(...FALL_CAR_HULL8.map(([x, y]) => x * Math.sin(angle) + y * Math.cos(angle)));
}
var arc8 = (p, a, b, height) => {
  const t = clamp15((p - a) / (b - a));
  return t < 1e-12 || t > 1 - 1e-12 ? 0 : height * 4 * t * (1 - t);
};
var pulse8 = (p, hit) => ease8((p - hit + 0.035) / 0.035) * (1 - ease8((p - hit) / 0.055));
function track8(keys, p) {
  let i = 1;
  while (i < keys.length - 1 && p > keys[i][0]) i++;
  const [a, b] = [keys[i - 1], keys[i]];
  return mix8(a[1], b[1], ease8((p - a[0]) / (b[0] - a[0])));
}
function createFall8() {
  return { active: false, age: 0, duration: GAMEPLAY8.fallSeconds, rate: 1, taps: 0, angle: 0, reduced: false };
}
function beginFall8(f, result, { reduced = false, speed = GAMEPLAY8.startSpeed } = {}) {
  const angle = Math.atan2(Math.sin(result.angle), Math.cos(result.angle));
  const severity = clamp15((speed - GAMEPLAY8.startSpeed) / (GAMEPLAY8.maxSpeed - GAMEPLAY8.startSpeed));
  Object.assign(f, { active: true, age: 0, duration: GAMEPLAY8.fallSeconds + GAMEPLAY8.fallSpeedSeconds * severity, rate: 1, taps: 0, angle, reduced });
}
function hastenFall8(f) {
  if (!f.active) return false;
  f.taps++;
  f.rate = Math.min(GAMEPLAY8.fallMaxRate, f.rate + GAMEPLAY8.fallTapRate);
  return true;
}
function advanceFall8(f, dt) {
  if (!f.active) return { impacts: 0, finished: false };
  const previous = f.age;
  f.age = Math.min(f.duration, f.age + dt * f.rate);
  const impacts = FALL_CONTACTS8.filter((t) => previous < f.duration * t && f.age >= f.duration * t).length;
  f.active = f.age < f.duration;
  return { impacts, finished: !f.active };
}
function fallPose8(f) {
  const p = clamp15(f.age / f.duration), sit = ease8(p / 0.14), stand = ease8((p - 0.68) / 0.16), gather = ease8((p - 0.7) / 0.22), settle = clamp15((p - 0.97) / 0.03);
  const impact = Math.max(...FALL_CONTACTS8.map((hit) => pulse8(p, hit))), seat = sit * (1 - stand);
  const crouch = (0.72 + 0.18 * impact) * seat + (settle === 1 ? 0 : 0.1 * Math.sin(settle * Math.PI));
  const lift = p < 0.36 ? arc8(p, 0.14, 0.36, 32) : p < 0.56 ? arc8(p, 0.36, 0.56, 28) : arc8(p, 0.56, 0.97, 112);
  const angle = mix8(f.angle, -0.64, sit) * (1 - stand);
  const seatAnchor = -11 * Math.sin(angle) + (22.5 + 27 * crouch) * Math.cos(angle) + 9;
  const rider = { x: 34 * sit * (1 - gather), y: mix8(95, seatAnchor, seat) + lift, angle, seat, crouch, lift };
  const entry = (y) => ({ x: Math.sin(f.angle) * (y - 65), y: 65 + Math.cos(f.angle) * (y - 65) });
  const e = entry(95), c = entry(12);
  rider.x += e.x * (1 - sit);
  rider.y += (e.y - 95) * (1 - sit);
  const carAngle = track8([[0, f.angle], [0.16, 0.95], [0.29, Math.PI], [0.38, 2 * Math.PI - 1.02], [0.54, 2 * Math.PI], [1, 2 * Math.PI]], p);
  const carHop = p < 0.16 ? arc8(p, 0, 0.16, 20) : p < 0.38 ? arc8(p, 0.16, 0.38, 22) : arc8(p, 0.38, 0.54, 8);
  const car = { x: gather === 1 ? 0 : mix8(c.x, -88, ease8(p / 0.16)) * (1 - gather), y: p >= 0.54 ? 12 : mix8(c.y, fallCarSupport8(carAngle) + carHop, ease8(p / 0.06)), angle: carAngle, phase: 0 };
  let shake = 0;
  for (const hit of FALL_CONTACTS8) if (p >= hit) shake = Math.max(shake, Math.exp(-(p - hit) * 40));
  const pose = { car, rider, crouch, impact, flail: sit * (1 - ease8((p - 0.82) / 0.12)), push: 0, shake: shake * 2.4, progress: p };
  if (f.reduced) {
    pose.car = { x: 0, y: 12, angle: 0, phase: 0 };
    pose.rider = { x: 0, y: 95, angle: 0, seat: 0, crouch };
    pose.shake = 0;
    pose.push = 0;
    pose.flail = 0;
  }
  return pose;
}
function fallPolygons8(pose) {
  const seat = pose.rider.seat || 0, crouch = pose.rider.crouch || 0;
  const rider = [[-23, -70 + 4 * seat], [23 + 48 * seat, -70 + 4 * seat], [23 + 48 * seat, 68 - 27 * crouch], [-23, 68 - 27 * crouch]];
  return [[pose.car, FALL_CAR_HULL8.map(([x, y]) => [x, -y])], [pose.rider, rider]].map(([body2, vertices]) => {
    const c = Math.cos(body2.angle), s = Math.sin(body2.angle);
    return vertices.map(([x, y]) => ({ x: body2.x + c * x + s * y, y: body2.y - s * x + c * y }));
  });
}
function interpolateFall8(a, b, t) {
  const pose = {};
  for (const part of ["car", "rider"]) {
    pose[part] = {};
    for (const k of ["x", "y", "angle", "seat", "crouch", "phase"]) pose[part][k] = mix8(a[part][k] || 0, b[part][k] || 0, t);
  }
  return pose;
}

// supabase/rulesets/roadster-v442/gameplay.js
var TAU8 = Math.PI * 2;
var clamp16 = (x, a, b) => Math.max(a, Math.min(b, x));
var approach8 = (x, target, amount) => x < target ? Math.min(target, x + amount) : Math.max(target, x - amount);
function uprightError8(angle, direction = -1) {
  let e = ((angle + Math.PI) % TAU8 + TAU8) % TAU8 - Math.PI;
  if (Math.abs(Math.abs(e) - Math.PI) < 1e-9) e = -Math.sign(direction || -1) * Math.PI;
  return e;
}
function createFlight8(fuel = GAMEPLAY8.initialFuel) {
  return { y: 0, vy: 0, vx: 0, angle: 0, omega: 0, airborne: false, time: 0, fuel, thrusting: false, latched: false, attach: 0, maxTurn: 0, turns: 0, lastDirection: -1, trickStarted: false, grab: 0, launchVelocity: 0, jumpFactor: 1 };
}
function launch8(p, charge = 0) {
  if (p.airborne) return false;
  Object.assign(p, { y: 1e-3, vy: (GAMEPLAY8.jumpSpeed + GAMEPLAY8.chargedSpeed * clamp16(charge, 0, 1)) * (p.jumpFactor || 1), angle: 0, omega: 0, airborne: true, time: 0, latched: false, attach: 0, maxTurn: 0, turns: 0, trickStarted: false, grab: 0, launchVelocity: (GAMEPLAY8.jumpSpeed + GAMEPLAY8.chargedSpeed * clamp16(charge, 0, 1)) * (p.jumpFactor || 1) });
  return true;
}
function advanceFlight8(p, dt, { spin = false, thrust = false } = {}) {
  p.thrusting = false;
  const gripTarget = p.airborne && spin ? 1 : 0;
  p.grab = approach8(p.grab, gripTarget, dt / (gripTarget ? 0.12 : 0.18));
  if (!p.airborne) {
    p.vx *= Math.exp(-GAMEPLAY8.horizontalDrag * dt);
    return null;
  }
  p.time += dt;
  if (spin) {
    p.trickStarted = true;
    p.lastDirection = -1;
    p.omega = approach8(p.omega, -GAMEPLAY8.spinSpeed, GAMEPLAY8.spinAcceleration * dt);
  } else {
    const target = Math.sign(p.omega) * Math.min(Math.abs(p.omega), GAMEPLAY8.releaseSpeed);
    p.omega = approach8(p.omega, target, GAMEPLAY8.releaseDeceleration * dt);
  }
  p.angle += p.omega * dt;
  p.maxTurn = Math.max(p.maxTurn, -p.angle);
  p.turns = Math.floor((p.maxTurn + 1e-7) / TAU8);
  const burn = thrust ? Math.min(dt, p.fuel / GAMEPLAY8.fuelPerSecond) : 0;
  if (burn > 0) {
    p.fuel = Math.max(0, p.fuel - burn * GAMEPLAY8.fuelPerSecond);
    p.thrusting = true;
    p.latched = true;
    p.vx += Math.sin(p.angle) * GAMEPLAY8.thrustAcceleration * burn;
    p.vy += Math.cos(p.angle) * GAMEPLAY8.thrustAcceleration * burn;
  }
  if (p.latched) p.attach = Math.min(1, p.attach + dt / GAMEPLAY8.attachSeconds);
  p.vx = clamp16(p.vx * Math.exp(-GAMEPLAY8.horizontalDrag * dt), -GAMEPLAY8.maxHorizontal, GAMEPLAY8.maxHorizontal);
  p.y += p.vy * dt - 0.5 * GAMEPLAY8.gravity * dt * dt;
  p.vy -= GAMEPLAY8.gravity * dt;
  if (p.y > 0) return null;
  const good = Math.abs(uprightError8(p.angle)) <= GAMEPLAY8.landingAngle + 1e-9 && Math.abs(p.omega) <= GAMEPLAY8.landingOmega;
  const turns = good ? Math.max(p.turns, Math.round(-p.angle / TAU8)) : p.turns;
  const perfect = good && Math.abs(uprightError8(p.angle)) <= GAMEPLAY8.perfectAngle + 1e-9;
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
function createEconomy8() {
  return { scoreFactor: 1, bonus: 0, multiplier: 10, meter: 0, decay: 0, streak: 0, streakLeft: 0, flips: 0 };
}
function comboSeconds8(e) {
  return GAMEPLAY8.comboDuration - GAMEPLAY8.comboFalloff * (e.multiplier / 10 - 1);
}
function rewardAction8(e, count = 1) {
  e.multiplier = Math.min(GAMEPLAY8.maxMultiplier, e.multiplier + count * GAMEPLAY8.multiplierStep);
  e.meter = 1;
  e.decay = 0;
}
function advanceEconomy8(e, dt) {
  if (e.meter > 0) {
    const used = Math.min(dt, e.meter * comboSeconds8(e));
    e.meter = Math.max(0, e.meter - used / comboSeconds8(e));
    dt -= used;
  }
  if (e.meter === 0 && e.multiplier > 10) {
    e.decay += dt;
    while (e.decay + 1e-9 >= GAMEPLAY8.comboDecaySeconds && e.multiplier > 10) {
      e.multiplier--;
      e.decay -= GAMEPLAY8.comboDecaySeconds;
    }
  }
}
function advanceStreak8(e, dt) {
  const used = Math.min(dt, e.streakLeft);
  e.streakLeft -= used;
  e.streak = Math.max(0, e.streak - (dt - used) * GAMEPLAY8.streakDecay);
}
function passObstacle8(e) {
  const points = GAMEPLAY8.obstaclePoints * e.multiplier / 10 * (e.scoreFactor || 1);
  e.bonus += points;
  return points;
}
function settleLanding8(e, p, result, { late = 0, near = 0 } = {}) {
  if (!result.good) {
    e.multiplier = 10;
    e.meter = 0;
    e.decay = 0;
    e.streak = 0;
    e.streakLeft = 0;
    return { points: 0, turns: 0, late: 0, near: 0, perfect: false, good: false };
  }
  const n = result.turns, perfect = !!result.perfect, points = (GAMEPLAY8.flipFactor * n * (n + 1) + GAMEPLAY8.nearPoints * (late + near) + GAMEPLAY8.perfectPoints * Number(perfect)) * e.multiplier / 10 * (e.scoreFactor || 1);
  e.bonus += points;
  e.flips += n;
  p.fuel = Math.min(GAMEPLAY8.tank, p.fuel + GAMEPLAY8.fuelPerFlip * n);
  if (n + late + near + Number(perfect)) rewardAction8(e, n + late + near + Number(perfect));
  if (n || near) {
    e.streak = Math.min(GAMEPLAY8.maxStreak, e.streak + GAMEPLAY8.streakStep);
    e.streakLeft = GAMEPLAY8.streakHold;
  }
  return { points, turns: n, late, near, perfect, good: true };
}
function createPace8() {
  return { boost: 0, progress: 0, base: GAMEPLAY8.startSpeed, speed: GAMEPLAY8.startSpeed, recovery: null, stumble: 0, falling: false };
}
function stumble8(pace) {
  const target = pace.recovery?.target ?? pace.base, r = clamp16((target - GAMEPLAY8.startSpeed) / (GAMEPLAY8.maxSpeed - GAMEPLAY8.startSpeed), 0, 1);
  pace.recovery = { target, age: 0, duration: GAMEPLAY8.recoveryMin + GAMEPLAY8.recoveryExtra * r ** 1.5 };
  pace.stumble = GAMEPLAY8.stumbleSeconds;
  pace.base = target * GAMEPLAY8.recoveryRatio;
}
function recoverySpeed8(r, t) {
  const T = r.duration, d = r.target * (1 - GAMEPLAY8.recoveryRatio), v0 = r.target * GAMEPLAY8.recoveryRatio, h = 0.15, a = T - h;
  if (t <= a) return v0 + d * (t / T) ** 2;
  const u = clamp16((t - a) / h, 0, 1), start = v0 + d * (a / T) ** 2, slope = 2 * d * a / T ** 2, endSlope = r.target >= GAMEPLAY8.maxSpeed ? 0 : (GAMEPLAY8.maxSpeed - GAMEPLAY8.startSpeed) / GAMEPLAY8.rampSeconds;
  return (2 * u ** 3 - 3 * u * u + 1) * start + (u ** 3 - 2 * u * u + u) * h * slope + (-2 * u ** 3 + 3 * u * u) * r.target + (u ** 3 - u * u) * h * endSlope;
}
function advancePace8(pace, e, p, dt) {
  if (pace.recovery) {
    pace.stumble = Math.max(0, pace.stumble - dt);
    const r = pace.recovery;
    r.age = Math.min(r.duration, r.age + dt);
    pace.base = recoverySpeed8(r, r.age);
    if (r.age >= r.duration) {
      pace.base = r.target;
      pace.recovery = null;
    }
  } else if (!pace.falling) {
    pace.progress += dt;
    pace.base = GAMEPLAY8.startSpeed + (GAMEPLAY8.maxSpeed - GAMEPLAY8.startSpeed) * Math.min(1, pace.progress / GAMEPLAY8.rampSeconds);
  }
  pace.speed = Math.max(60, pace.base * (1 + e.streak) * (1 + (pace.boost || 0)) + p.vx);
  return pace.speed;
}
function playerPolygons8(p) {
  if (p.fallPose) return fallPolygons8(p.fallPose);
  const c = Math.cos(p.angle), s = Math.sin(p.angle);
  return [[-47, 0, 47, 25], [-23, 25, 23, 163 - 32 * (p.grab || 0)]].map(([l, b, r, t]) => [[l, b], [r, b], [r, t], [l, t]].map(([x, y]) => ({ x: c * x + s * (y - 65), y: p.y + 65 - s * x + c * (y - 65) })));
}
function overlaps8(poly, rect) {
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
function collisionAt8(p, o, dx, time = 0) {
  if (o.collision === "none") return false;
  if (dx > 180 || dx + o.w < -180) return false;
  const polygons = playerPolygons8(p);
  return obstacleBoxes8(o, time).some((b) => {
    const bottom = o.altitude || 0, top = bottom + b.top;
    const rect = [{ x: dx + b.left, y: bottom }, { x: dx + b.right, y: bottom }, { x: dx + b.right, y: top }, { x: dx + b.left, y: top }];
    return polygons.some((poly) => overlaps8(poly, rect));
  });
}
function sweptCollision8(before, after, o, dxBefore, dxAfter, time, dt) {
  if (Math.min(dxBefore, dxAfter) > 180 || Math.max(dxBefore, dxAfter) + o.w < -180) return false;
  const fallTravel = before.fallPose && after.fallPose ? Math.max(...["rider", "car"].map((part) => Math.abs(after.fallPose[part].angle - before.fallPose[part].angle) * (part === "car" ? 55 : 170) + Math.abs(after.fallPose[part].y - before.fallPose[part].y) + Math.abs(after.fallPose[part].x - before.fallPose[part].x))) : 0;
  const n = Math.max(1, Math.ceil((Math.abs(dxAfter - dxBefore) + Math.abs(after.y - before.y) + Math.abs(after.angle - before.angle) * 170 + fallTravel) / 4));
  for (let i = 0; i <= n; i++) {
    const f = i / n, p = { y: before.y + (after.y - before.y) * f, angle: before.angle + (after.angle - before.angle) * f, grab: (before.grab || 0) + ((after.grab || 0) - (before.grab || 0)) * f };
    if (before.fallPose && after.fallPose) p.fallPose = interpolateFall8(before.fallPose, after.fallPose, f);
    if (collisionAt8(p, o, dxBefore + (dxAfter - dxBefore) * f, time - dt + dt * f)) return true;
  }
  return false;
}
function nearWindow8(distance, speed) {
  return distance >= 0 && distance <= Math.max(0, speed) * GAMEPLAY8.nearSeconds + 1e-8;
}

// supabase/rulesets/roadster-v442/boosters.js
var BOOSTERS4 = Object.freeze({
  shield: Object.freeze({ name: "INVINCIBLE", seconds: 8, color: "#7ce5f3" }),
  speed: Object.freeze({ name: "OVERDRIVE", seconds: 8, color: "#ffad62" }),
  jump: Object.freeze({ name: "HIGH JUMP", seconds: 12, color: "#d9ff62" }),
  life: Object.freeze({ name: "EXTRA LIFE", seconds: 0, color: "#ff6a78" }),
  score: Object.freeze({ name: "SCORE \xD73", seconds: 10, color: "#ffc86d" })
});
function createBoosters4(seed = 0) {
  return { active: {}, hearts: 0, grace: 0, ghostIds: [], speedBlend: 0, pickups: [], nextAt: 8, serial: 0, bag: [], bagCycle: 0, random: (seed ^ 2772213271) >>> 0, spoiledFlight: false };
}
var activeBooster4 = (q, id2) => (q?.active[id2] || 0) > 0;
function canCollectBooster3(q, id2) {
  return !!BOOSTERS4[id2] && (id2 === "life" ? q.hearts < 2 : activeBooster4(q, id2) || Object.keys(q.active).length < 3);
}
function collectBooster4(q, id2) {
  const def = BOOSTERS4[id2];
  if (!canCollectBooster3(q, id2)) return false;
  if (id2 === "life") {
    if (q.hearts >= 2) return false;
    q.hearts++;
    return true;
  }
  if (!activeBooster4(q, id2) && Object.keys(q.active).length >= 3) return false;
  q.active[id2] = def.seconds;
  return true;
}
function advanceBoosters4(q, dt) {
  for (const id2 of Object.keys(q.active)) {
    q.active[id2] = Math.max(0, q.active[id2] - dt);
    if (q.active[id2] === 0) delete q.active[id2];
  }
  q.grace = Math.max(0, q.grace - dt);
  const target = activeBooster4(q, "speed") ? 1 : 0, delta = dt / (target ? 0.6 : 0.8);
  q.speedBlend = target ? Math.min(1, q.speedBlend + delta) : Math.max(0, q.speedBlend - delta);
}
function random4(q) {
  q.random = Math.imul(q.random, 1664525) + 1013904223 >>> 0;
  return q.random / 4294967296;
}
function offerBooster4(q, { time, speed, clear }) {
  if (!clear || q.pickups.length || time < q.nextAt) return null;
  if (!q.bag.length) {
    q.bagCycle++;
    q.bag = Object.keys(BOOSTERS4).filter((id3) => id3 !== "life" || q.bagCycle % 3 === 0);
    for (let i = q.bag.length - 1; i > 0; i--) {
      const j = Math.floor(random4(q) * (i + 1));
      [q.bag[i], q.bag[j]] = [q.bag[j], q.bag[i]];
    }
  }
  const eligible3 = (id3) => id3 === "life" ? q.hearts < 2 : activeBooster4(q, id3) || Object.keys(q.active).length < 3;
  let index = q.bag.findIndex(eligible3);
  if (index < 0) {
    q.nextAt = time + 2;
    return null;
  }
  const id2 = q.bag.splice(index, 1)[0], pickup = { id: id2, uid: ++q.serial, x: Math.max(900, speed * 1.9 + 180), y: q.serial === 1 || random4(q) < 0.55 ? 104 : 240 };
  q.pickups.push(pickup);
  if (q.serial > 1 && random4(q) < 0.4) {
    const second = q.bag.findIndex((other) => other !== id2 && eligible3(other));
    if (second >= 0) {
      const next = q.bag.splice(second, 1)[0];
      q.pickups.push({ id: next, uid: ++q.serial, x: pickup.x + 240, y: pickup.y });
    }
  }
  q.nextAt = time + 14 + random4(q) * 6;
  return pickup;
}

// supabase/rulesets/roadster-v442/rails.js
var RAIL2 = Object.freeze({ height: 190, length: 720, belly: 8, pointsPerUnit: 0.1, firstWave: 3, every: 7, exitSeconds: 1.25 });
var makeRail2 = (x) => ({ x, w: RAIL2.length, h: RAIL2.height, paid: [], passed: false });
var createGrind2 = () => ({ support: null, age: 0, exit: null, exitAge: 1, pending: 0, distance: 0, turns: 0 });
var railContactHeight2 = (p) => p.y + 65 + (RAIL2.belly - 65) * Math.cos(p.angle);
function leaveRail2(g, p) {
  g.support = null;
  g.age = 0;
  g.exit = "end";
  g.exitAge = 0;
  p.airborne = true;
  p.angle = uprightError8(p.angle);
  p.omega = 0;
  p.maxTurn = Math.max(0, -p.angle);
  p.turns = 0;
  p.time = 0;
  p.launchVelocity = 0;
  p.trickStarted = true;
}
function jumpFromRail2(g, p, charge) {
  const y = p.y, angle = uprightError8(p.angle);
  leaveRail2(g, p);
  p.airborne = false;
  launch8(p, charge);
  p.y += y;
  p.angle = angle;
  p.trickStarted = true;
  g.exit = "jump";
}
function newDistance2(rail, a, b) {
  a = Math.max(0, a);
  b = Math.min(rail.w, b);
  if (b <= a) return 0;
  let fresh = b - a;
  for (const [l, r] of rail.paid) fresh -= Math.max(0, Math.min(b, r) - Math.max(a, l));
  const ranges = [...rail.paid, [a, b]].sort((x, y) => x[0] - y[0]), merged = [];
  for (const range of ranges) {
    const last = merged.at(-1);
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([...range]);
  }
  rail.paid = merged;
  return Math.max(0, fresh);
}
function advanceRail2(g, p, before, rails, travel, dt, e, { spoiled = false, blocked = false } = {}) {
  g.exitAge = Math.min(1, g.exitAge + dt);
  const events = [], oldXs = rails.map((r) => r.x);
  for (const r of rails) {
    r.x -= travel;
    r.passed = r.x + r.w < 0;
  }
  let fraction = 0, rail = rails.find((r) => r.uid === g.support);
  if (g.support && !rail) {
    leaveRail2(g, p);
    events.push({ type: "rail-exit", reason: "end" });
    return events;
  }
  if (!rail && !blocked && before.airborne) {
    const old = railContactHeight2(before), now = railContactHeight2(p);
    const good = p.vy <= 0 && Math.abs(uprightError8(p.angle)) <= GAMEPLAY8.landingAngle + 1e-9 && Math.abs(p.omega) <= GAMEPLAY8.landingOmega;
    if (good && old >= RAIL2.height && now <= RAIL2.height && old > now) {
      fraction = (old - RAIL2.height) / (old - now);
      rail = rails.find((r, i) => {
        const x = oldXs[i] - travel * fraction;
        return x <= 0 && x + r.w >= 0;
      });
      if (rail) {
        g.support = rail.uid;
        g.age = 0;
        g.turns += Math.max(p.turns, Math.round(-p.angle / (Math.PI * 2)));
        p.turns = 0;
        p.airborne = false;
        p.omega = 0;
        p.vy = 0;
        p.thrusting = false;
        p.grab = 0;
        events.push({ type: "rail-catch", uid: rail.uid, impact: Math.abs(before.vy) });
      }
    }
  }
  if (rail) {
    const i = rails.indexOf(rail), start = -oldXs[i] + travel * fraction, end = -rail.x;
    const distance = newDistance2(rail, start, end);
    if (!spoiled) {
      g.distance += distance;
      g.pending += distance * RAIL2.pointsPerUnit * e.multiplier / 10 * (e.scoreFactor || 1);
    }
    g.age += dt * (1 - fraction);
    p.y = rail.h - 65 - (RAIL2.belly - 65) * Math.cos(p.angle);
    p.vy = 0;
    p.omega = 0;
    p.thrusting = false;
    if (distance > 0) events.push({ type: "rail-travel", uid: rail.uid, distance, points: spoiled ? 0 : distance * RAIL2.pointsPerUnit * e.multiplier / 10 * (e.scoreFactor || 1) });
    if (rail.x + rail.w <= 0) {
      leaveRail2(g, p);
      events.push({ type: "rail-exit", reason: "end" });
    }
  }
  return events;
}
function validateRailRoute2(rail, { flight = createFlight8(), pace = createPace8(), economy = createEconomy8(), boosterState = null, margin = 0.09 } = {}) {
  if (flight.airborne || pace.recovery || pace.falling) return null;
  const simulate = (lead, charge) => {
    const p = { ...flight }, r = structuredClone(pace), e = { ...economy }, q = boosterState ? structuredClone(boosterState) : null, g = createGrind2(), rails = [{ ...structuredClone(rail), uid: 1 }], actions = [];
    let jumped = false, caught = false, charging = false, held = 0;
    for (let tick = 0; tick < 1800; tick++) {
      const dt = 1 / 120, t = tick * dt;
      if (!jumped && rails[0].x / Math.max(1, r.speed) <= lead + charge * GAMEPLAY8.chargeSeconds) {
        if (!charging) {
          charging = true;
          actions.push({ at: t, action: "hold" });
        }
        held += dt;
        if (held + 1e-9 >= charge * GAMEPLAY8.chargeSeconds + (charge > 0 ? dt : 0)) {
          p.jumpFactor = q && activeBooster4(q, "jump") ? 1.25 : 1;
          launch8(p, Math.min(1, (held - dt) / GAMEPLAY8.chargeSeconds));
          jumped = true;
          actions.push({ at: t, action: "jump", charge });
        }
      }
      if (q) {
        advanceBoosters4(q, dt);
        r.boost = 0.35 * q.speedBlend;
      }
      advanceEconomy8(e, dt);
      advanceStreak8(e, dt);
      const before = { ...p }, landed = advanceFlight8(p, dt);
      advancePace8(r, e, p, dt);
      const events = advanceRail2(g, p, before, rails, r.speed * dt, dt, e);
      if (events.some((v) => v.type === "rail-catch")) caught = true;
      if (landed && !g.support) {
        if (!landed.good) return null;
        if (caught && rails[0].passed) return { charge, lead, burn: 0, actions, duration: t, fuelUsed: 0, clearanceVerified: true, timingMargin: margin, exit: { y: 0, angle: 0, vx: p.vx } };
      }
    }
    return null;
  };
  for (const charge of [0.5, 1]) for (const lead of [0.25, 0.35, 0.45, 0.55]) {
    const route = simulate(lead, charge);
    if (route && simulate(lead - margin, charge) && simulate(lead + margin, charge)) return route;
  }
  return null;
}

// supabase/rulesets/roadster-v442/biomes.js
var BIOME_SCORE_STEP6 = 7e3;
var SCENERY_CYCLE6 = BIOME_CYCLE8;
function biomeAt6(score = 0) {
  const points = Number.isFinite(score) ? Math.max(0, score) : 0;
  const leg = Math.floor(points / BIOME_SCORE_STEP6), nextAt = (leg + 1) * BIOME_SCORE_STEP6;
  return { id: SCENERY_CYCLE6[leg % SCENERY_CYCLE6.length], leg, nextAt, nextIn: nextAt - points };
}

// supabase/rulesets/roadster-v442/routes.js
var STAGES8 = GAMEPLAY8.stages;
function stageAt8(progress) {
  return STAGES8.filter((t) => progress >= t).length - 1;
}
function makePattern8(kind, { speed = 360, type = { id: "truck", w: 110, h: 41 }, dx = 900 } = {}) {
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
function validateRoute8(obstacles, { flight = createFlight8(), pace = createPace8(), economy = createEconomy8(), time = 0, boosterState = null, allowThrust = true, burns = null, timingMargin = 0, leads = [0.1, 0.11, 0.115, 0.12, 0.125, 0.14, 0.16, 0.2, 0.3, 0.4, 0.5, 0.65], charges = [0, 0.5, 1] } = {}) {
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
        if (!charging && ttc <= lead + charge * GAMEPLAY8.chargeSeconds) {
          charging = true;
          held = 0;
          actions.push({ at: elapsed, action: "hold" });
        }
        if (charging) {
          held += dt;
          if (held + 1e-9 >= charge * GAMEPLAY8.chargeSeconds + (charge > 0 ? dt : 0)) {
            lateTarget = nearWindow8(next.x + (next.inset || 5) - 47, r.speed + (next.approachSpeed || 0)) ? next : null;
            p.jumpFactor = q && activeBooster4(q, "jump") ? 1.25 : 1;
            launch8(p, charge);
            charging = false;
            actions.push({ at: elapsed, action: "jump", charge });
          }
        }
      }
      if (q) {
        advanceBoosters4(q, dt);
        r.boost = 0.35 * q.speedBlend;
        e.scoreFactor = activeBooster4(q, "score") ? 3 : 1;
      }
      const before = { ...p }, useThrust = p.airborne && p.time >= 0.18 && p.time < 0.18 + burn;
      if (useThrust !== lastThrust) {
        actions.push({ at: elapsed, action: useThrust ? "thrust-on" : "thrust-off" });
        lastThrust = useThrust;
      }
      const landed = advanceFlight8(p, dt, { thrust: useThrust });
      advanceEconomy8(e, dt);
      advanceStreak8(e, dt);
      advancePace8(r, e, p, dt);
      const after = landed ? { ...p, angle: landed.angle } : p;
      let alive = true;
      for (const o of obs) {
        const old = o.x;
        o.x -= (r.speed + (o.approachSpeed || 0)) * dt;
        if (sweptCollision8(before, after, o, old, o.x, time + elapsed, dt)) {
          alive = false;
          break;
        }
        if (!o.passed && o.x + o.w < -50) {
          o.passed = true;
          passObstacle8(e);
        }
      }
      if (!alive || landed && !landed.good) break;
      if (landed) {
        let near = 0;
        const late = lateTarget && lateTarget.x + lateTarget.w - (lateTarget.inset || 5) < -47 ? 1 : 0;
        for (const o of obs) if (!o.altitude && !o.nearPaid && nearWindow8(-47 - (o.x + o.w - (o.inset || 5)), r.speed)) {
          near++;
          o.nearPaid = true;
        }
        settleLanding8(e, p, landed, { late, near });
        nearLandings += near;
        lateTakeoffs += late;
        lateTarget = null;
      }
      if (obs.every((o) => o.x + o.w < -180) && !p.airborne) {
        if (timingMargin > 0 && (!validateRoute8(obstacles, { flight, pace, economy, time, boosterState, charges: [charge], leads: [lead - timingMargin], burns: [burn] }) || !validateRoute8(obstacles, { flight, pace, economy, time, boosterState, charges: [charge], leads: [lead + timingMargin], burns: [burn] }))) break;
        return { charge, lead, burn, actions, nearLandings, lateTakeoffs, duration: elapsed, fuelUsed: flight.fuel - p.fuel, exit: { y: 0, angle: 0, vx: p.vx }, clearanceVerified: true, timingMargin };
      }
    }
  }
  return null;
}

// supabase/rulesets/roadster-v442/director.js
function createDirector8({ S, flight, pace, economy, boosters, spawnDistance, sceneTime = () => S.t, random: random7 = Math.random, relative = false }) {
  const initial = () => ({ wave: 0, last: null, fallbacks: 0, waiting: false, hardStreak: 0, leg: -1, legStartedAt: 0, groundSinceAir: 0, airCount: 0, lastAirAt: -1e9 });
  const state = initial();
  function reset() {
    Object.assign(state, initial());
  }
  function spawn() {
    if (flight.airborne || pace.recovery || pace.falling || S.rails?.length > 0 || S.obs.some((o) => !o.passed)) {
      S.next = 0.18;
      state.waiting = true;
      return;
    }
    state.waiting = false;
    const { id: biome, leg } = biomeAt6(S.score || 0);
    if (leg !== state.leg) {
      state.leg = leg;
      state.legStartedAt = S.t;
    }
    if (state.wave >= RAIL2.firstWave && (state.wave - RAIL2.firstWave) % RAIL2.every === 0 && state.last?.kind !== "air") {
      const rail = makeRail2(spawnDistance()), route2 = validateRailRoute2(rail, { flight, pace, economy, boosterState: boosters });
      if (route2) {
        state.wave++;
        state.hardStreak = 0;
        state.last = { kind: "rail", stage: stageAt8(pace.progress), biome, leg, route: route2, startedAt: S.t };
        (S.rails ??= []).push({ ...rail, uid: ++S.entityId });
        S.next = route2.duration + RAIL2.exitSeconds;
        return;
      }
    }
    const stage = stageAt8(pace.progress), afterAir = state.last?.kind === "air", breath = afterAir || state.wave % 5 === 4 || state.hardStreak >= 2;
    const airDue = leg >= 2 && S.t - state.legStartedAt >= 8 && state.groundSinceAir >= 6 && S.t - state.lastAirAt >= 28;
    const pools = [["single"], ["single"], ["pair", "single"], ["single", "pair"], ["precision", "single", "pair"], ["pair", "precision", "thrust"], ["pair", "precision", "thrust"]];
    let kind = breath || airDue ? "single" : pools[stage][Math.floor(random7() * pools[stage].length)];
    const factoryIds3 = ["truck", "t800", "bydSeal", "xiaomiSu7", "batteryAgv", "xi"];
    const choices = OBSTACLES8.filter((o) => !o.altitude && o.collision !== "none" && (o.biomes === "all" || o.biomes.includes(biome)) && (biome !== "tesla-factory" || factoryIds3.includes(o.id)) && (stage === 0 ? o.h <= 64 : stage < 2 ? o.h <= 94 : true));
    if (kind === "thrust" && flight.fuel < 65) kind = "pair";
    let type = choices[Math.floor(random7() * choices.length)], dx = spawnDistance();
    if (airDue && !breath && state.last?.kind === "single") {
      const first = state.airCount < 2;
      const pool = AIR_TYPES8.filter((o) => (o.biomes === "all" || o.biomes.includes(biome)) && (!first || o.h <= 55 && o.w <= 110));
      const model = pool[Math.floor(random7() * pool.length)];
      type = { ...model, altitude: first ? 24 : 32, approachSpeed: first ? 80 : 110 };
      kind = "air";
      dx = Math.max(dx, (S.speed + type.approachSpeed) * 2);
    }
    let obstacles = makePattern8(kind, { speed: S.speed, type, dx });
    let route = validateRoute8(obstacles, { flight, pace, economy, time: sceneTime(), boosterState: boosters, allowThrust: kind !== "air", timingMargin: kind === "air" ? 0.09 : GAMEPLAY8.routeTimingMargin });
    if (route && route.fuelUsed > 0 && flight.fuel - route.fuelUsed < GAMEPLAY8.routeFuelReserve) route = null;
    if (!route) {
      state.fallbacks++;
      kind = "single";
      obstacles = makePattern8(kind, { speed: S.speed, type: OBSTACLES8.find((o) => o.id === "truck"), dx });
      route = validateRoute8(obstacles, { flight, pace, economy, time: sceneTime(), boosterState: boosters, timingMargin: GAMEPLAY8.routeTimingMargin });
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

// supabase/rulesets/roadster-v442/random.js
function createRandom8(seed) {
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

// supabase/rulesets/roadster-v442/run.js
var RULESET8 = "roadster-v4.4.2";
var RUN_STEP8 = 1 / 120;
var RUN_COMMANDS8 = Object.freeze(["primary-down", "primary-up", "primary-cancel", "thrust-on", "thrust-off", "cancel"]);
var MAX_RECORDED_TICKS8 = 120 * 60 * 60;
var MAX_RECORDED_EVENTS8 = 24e3;
function createRun8({ seed = 0, record = true, reducedMotion = false } = {}) {
  const S = { mode: "menu", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY8.startSpeed, next: 1.7, obs: [], rails: [], entityId: 0, anchor: 0 }, Q = createBoosters4(seed), G = createGrind2(), P = createFlight8(), E = createEconomy8(), pace = createPace8(), F = createFall8(), input = { charging: false, charge: 0, spin: false, thrust: false };
  let random7 = createRandom8(seed), events = [], log = [], lateId = null, lastLanding = null, recordable = true;
  const director = createDirector8({ S, flight: P, pace, economy: E, boosters: Q, random: () => random7.next(), relative: true, sceneTime: () => S.t, spawnDistance: () => Math.max(900, S.speed * 1.5 + 180) });
  function clear() {
    Object.assign(input, { charging: false, charge: 0, spin: false, thrust: false });
    P.thrusting = false;
  }
  function sync() {
    S.t = S.tick * RUN_STEP8;
    S.speed = pace.speed;
    S.score = Math.floor(S.distance / 20 + E.bonus);
  }
  function reset(nextSeed = seed) {
    seed = nextSeed;
    random7 = createRandom8(seed);
    Object.assign(Q, createBoosters4(seed));
    Object.assign(G, createGrind2());
    Object.assign(P, createFlight8());
    Object.assign(E, createEconomy8());
    Object.assign(pace, createPace8());
    Object.assign(F, createFall8());
    Object.assign(S, { mode: "playing", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY8.startSpeed, next: 1.7, obs: [], rails: [], entityId: 0, lastCharge: 0 });
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
      if (nearWindow8(o.x + (o.inset || 5) - 47, S.speed + (o.approachSpeed || 0))) {
        lateId = o.uid;
        break;
      }
    }
    const charge = input.charge;
    P.jumpFactor = activeBooster4(Q, "jump") ? 1.25 : 1;
    if (G.support) jumpFromRail2(G, P, charge);
    else {
      Q.spoiledFlight = false;
      launch8(P, charge);
    }
    S.lastCharge = charge;
    input.charging = false;
    input.charge = 0;
    input.spin = false;
    events.push({ type: "jump", charge });
    return true;
  }
  function command(action) {
    if (!RUN_COMMANDS8.includes(action)) throw Error("Unknown run command");
    if (S.mode !== "playing") return false;
    if (record && recordable) {
      if (log.length >= MAX_RECORDED_EVENTS8) recordable = false;
      else log.push([S.tick, RUN_COMMANDS8.indexOf(action)]);
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
    if (F.active) return hastenFall8(F);
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
    if (S.tick > MAX_RECORDED_TICKS8) recordable = false;
    sync();
    if (input.charging) input.charge = Math.min(1, input.charge + RUN_STEP8 / GAMEPLAY8.chargeSeconds);
    advanceBoosters4(Q, RUN_STEP8);
    E.scoreFactor = activeBooster4(Q, "score") ? 3 : 1;
    pace.boost = 0.35 * Q.speedBlend;
    advanceEconomy8(E, RUN_STEP8);
    advanceStreak8(E, RUN_STEP8);
    const physicsFall = () => fallPose8({ ...F, reduced: false }), wasFalling = F.active, before = { ...P, fallPose: F.active ? physicsFall() : null };
    let landed = null, fallStep = { impacts: 0, finished: false };
    if (wasFalling) {
      fallStep = advanceFall8(F, RUN_STEP8);
      if (fallStep.finished) {
        clear();
        S.next = Math.max(S.next, 0.8);
        events.push({ type: "recovered" });
      }
    } else landed = advanceFlight8(P, RUN_STEP8, { spin: input.spin, thrust: input.thrust });
    pace.falling = F.active;
    advancePace8(pace, E, P, RUN_STEP8);
    S.distance += pace.speed * RUN_STEP8;
    E.bonus += pace.speed * RUN_STEP8 / 20 * (E.scoreFactor - 1);
    sync();
    events.push(...advanceRail2(G, P, before, S.rails, S.speed * RUN_STEP8, RUN_STEP8, E, { spoiled: Q.spoiledFlight, blocked: wasFalling }));
    if (G.support) {
      landed = null;
      input.spin = false;
    }
    const after = wasFalling ? { ...P, fallPose: physicsFall() } : landed ? { ...P, angle: landed.angle } : P;
    for (const o of S.obs) {
      const old = o.x;
      o.x -= (S.speed + (o.approachSpeed || 0)) * RUN_STEP8;
      if (o.smashed) {
        o.smashAge += RUN_STEP8;
        continue;
      }
      if (sweptCollision8(before, after, o, old, o.x, S.t, RUN_STEP8)) {
        if (activeBooster4(Q, "shield")) {
          o.smashed = true;
          o.smashAge = 0;
          if (!o.passed) {
            o.passed = true;
            passObstacle8(E);
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
          G.pending = G.distance = G.turns = 0;
          E.multiplier = 10;
          E.meter = 0;
          E.decay = 0;
          E.streak = 0;
          E.streakLeft = 0;
          events.push({ type: "rescued", oldMultiplier });
        } else {
          S.mode = "dead";
          G.pending = G.distance = G.turns = 0;
          clear();
          sync();
          events.push({ type: "death", obstacle: o });
          return { landed, impacts: fallStep.impacts };
        }
      }
      if (!o.passed && o.x + o.w < -50) {
        o.passed = true;
        passObstacle8(E);
        if (o.altitude) events.push({ type: "air-passed" });
      }
    }
    for (const orb of Q.pickups) {
      const old = orb.x;
      orb.x -= S.speed * RUN_STEP8;
      const inReach = Math.min(old, orb.x) <= 112 && Math.max(old, orb.x) >= -112 && Math.abs(P.y + 78 - orb.y) <= 122;
      if (!F.active && inReach && collectBooster4(Q, orb.id)) {
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
        if (nearWindow8(-47 - (o.x + o.w - (o.inset || 5)), S.speed)) {
          near++;
          o.nearPaid = true;
        }
      }
      if (!Q.spoiledFlight) landed = { ...landed, turns: landed.turns + G.turns };
      const grindPoints = landed.good && !Q.spoiledFlight ? G.pending : 0, grindDistance = landed.good && !Q.spoiledFlight ? G.distance : 0;
      const oldMultiplier = E.multiplier;
      lastLanding = settleLanding8(E, P, Q.spoiledFlight ? { ...landed, turns: 0, perfect: false } : landed, Q.spoiledFlight ? { late: 0, near: 0 } : { late, near });
      Q.spoiledFlight = false;
      E.bonus += grindPoints;
      lastLanding.points += grindPoints;
      Object.assign(lastLanding, { grindPoints, grindDistance });
      if (grindDistance > 0) {
        rewardAction8(E);
        S.next = Math.max(S.next, RAIL2.exitSeconds);
      }
      Object.assign(G, createGrind2());
      if (!landed.good) {
        stumble8(pace);
        beginFall8(F, landed, { reduced: reducedMotion, speed: pace.recovery.target });
        pace.falling = true;
        P.angle = 0;
        P.omega = 0;
        P.vx = 0;
        P.grab = 0;
        clear();
        advancePace8(pace, E, P, 0);
      }
      events.push({ type: "landing", landed, result: lastLanding, late, near, oldMultiplier });
      lateId = null;
    }
    if (!P.airborne && !G.support && Math.abs(P.angle) > 1e-3) {
      P.angle *= Math.exp(-RUN_STEP8 * 18);
      P.omega = 0;
    }
    S.obs = S.obs.filter((o) => o.smashed ? o.smashAge < 1.2 : o.uid === lateId || o.x + o.w > (o.id === "joe" ? -480 : -400));
    S.rails = S.rails.filter((r) => r.x + r.w > -200 || r.uid === G.support);
    offerBooster4(Q, { time: S.t, speed: S.speed, clear: !P.airborne && !G.support && !S.rails.length && !F.active && !pace.recovery && S.obs.every((o) => o.passed) });
    S.next -= RUN_STEP8;
    if (S.next <= 0 && !Q.pickups.length) director.spawn();
    sync();
    return { landed, impacts: fallStep.impacts };
  }
  function snapshot() {
    return structuredClone({ seed, S, P, E, pace, F, Q, G, input, random: random7.state, director: director.state, lateId, lastLanding });
  }
  function restore(saved) {
    seed = saved.seed;
    for (const [a, b] of [[G, saved.G], [Q, saved.Q], [S, saved.S], [P, saved.P], [E, saved.E], [pace, saved.pace], [F, saved.F], [input, saved.input], [director.state, saved.director]]) Object.assign(a, structuredClone(b));
    random7 = createRandom8(seed);
    random7.restore(saved.random);
    lateId = saved.lateId;
    lastLanding = structuredClone(saved.lastLanding);
    events = [];
  }
  function replay() {
    return recordable ? { format: 1, ruleset: RULESET8, seed, ticks: S.tick, events: log.map((e) => [...e]) } : null;
  }
  return { S, P, E, pace, F, Q, G, input, director, reset, jump, command, step, sync, snapshot, restore, replay, drainEvents() {
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
function validateReplay8(value) {
  if (!value || value.format !== 1 || value.ruleset !== RULESET8 || !Number.isInteger(value.seed) || value.seed < 0 || value.seed > 4294967295 || !Number.isInteger(value.ticks) || value.ticks < 1 || value.ticks > MAX_RECORDED_TICKS8 || !Array.isArray(value.events) || value.events.length > MAX_RECORDED_EVENTS8) throw Error("Invalid or unsupported replay");
  let previous = -1;
  for (const event of value.events) {
    if (!Array.isArray(event) || event.length !== 2 || !Number.isInteger(event[0]) || event[0] < previous || event[0] < 0 || event[0] >= value.ticks || !Number.isInteger(event[1]) || event[1] < 0 || event[1] >= RUN_COMMANDS8.length) throw Error("Invalid replay input");
    previous = event[0];
  }
  return value;
}
function verifyReplay8(value) {
  const replay = validateReplay8(value), run = createRun8({ seed: replay.seed, record: false });
  run.reset();
  let event = 0;
  while (run.S.tick < replay.ticks && run.S.mode === "playing") {
    while (event < replay.events.length && replay.events[event][0] === run.S.tick) run.command(RUN_COMMANDS8[replay.events[event++][1]]);
    run.step();
    run.drainEvents();
  }
  if (run.S.mode !== "dead" || run.S.tick !== replay.ticks || event !== replay.events.length) throw Error("Replay does not end at its first collision");
  return { score: run.S.score, flips: run.E.flips, ticks: run.S.tick };
}

// supabase/rulesets/roadster-v460/run.js
var run_exports9 = {};
__export(run_exports9, {
  RULESET: () => RULESET9,
  RUN_COMMANDS: () => RUN_COMMANDS9,
  RUN_STEP: () => RUN_STEP9,
  createRun: () => createRun9,
  validateReplay: () => validateReplay9,
  verifyReplay: () => verifyReplay9
});

// supabase/rulesets/roadster-v460/gameplay-config.js
var GAMEPLAY9 = Object.freeze({
  version: "4.6.0",
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

// supabase/rulesets/roadster-v460/enemy-sprite-data.js
var ENEMY_SPRITES7 = Object.freeze({ "sikorsky": { "file": "assets/encounters/v400/sikorsky.png", "w": 176, "h": 89.146, "pixels": [768, 389], "sourcePixels": [1536, 1024], "sourceCrop": [13, 146, 1520, 909], "alphaExtrema": [0, 255], "sha256": "5619dd383d0bbb6ed7115f767f21f1e86e720d2aeb9ce3f0f41a182f15da3520" }, "xi": { "file": "assets/encounters/v400/xi.png", "w": 72, "h": 109.281, "pixels": [506, 768], "sourcePixels": [1024, 1536], "sourceCrop": [51, 65, 978, 1471], "alphaExtrema": [0, 255], "sha256": "56f56642f4f29a2b3c6655a442be59d4df5f781327c20299fa9ff596f69c6ac0" }, "t800": { "file": "assets/encounters/v400/t800.png", "w": 57, "h": 109.44, "pixels": [400, 768], "sourcePixels": [1024, 1536], "sourceCrop": [183, 66, 925, 1489], "alphaExtrema": [0, 255], "sha256": "1661f9bf004a65db0c178ca6d7b17e42d9963299f627f450016e9443125495f8" }, "ufo": { "file": "assets/encounters/v400/ufo.png", "w": 104, "h": 47.26, "pixels": [768, 349], "sourcePixels": [1672, 940], "sourceCrop": [141, 130, 1535, 763], "alphaExtrema": [0, 255], "sha256": "926e3e760155afe3acbc9215b35465a78e3a49039762c7ff89f8bf1c1e8ec358" }, "primeDrone": { "file": "assets/encounters/v400/primeDrone.png", "w": 110, "h": 48.984, "pixels": [768, 342], "sourcePixels": [1821, 864], "sourceCrop": [10, 31, 1812, 833], "alphaExtrema": [0, 255], "sha256": "a46783dc00dd76be690c29c72f92fa834a02b2522aac366058cc2972822ab681" }, "twitterBird": { "file": "assets/encounters/v400/twitterBird.png", "w": 76, "h": 50.568, "pixels": [768, 511], "sourcePixels": [1536, 1024], "sourceCrop": [85, 50, 1460, 964], "alphaExtrema": [0, 255], "sha256": "46436e2c78ac2ac104426b8bc898f047cb8ee934a9b1a5dd08631a554f5ee94e" }, "homelessRow": { "file": "assets/encounters/v400/homelessRow.png", "w": 142, "h": 40.122, "pixels": [768, 217], "sourcePixels": [2073, 758], "sourceCrop": [79, 124, 2012, 670], "alphaExtrema": [0, 255], "sha256": "03ed702ddb2d5cd06d2c6174b8e88edce01a22adbae68570d268de367ea49806" }, "bydSeal": { "file": "assets/encounters/v400/bydSeal.png", "w": 138, "h": 44.562, "pixels": [768, 248], "sourcePixels": [2172, 724], "sourceCrop": [144, 74, 2061, 693], "alphaExtrema": [0, 255], "sha256": "840376084d808030f6900dbad884a825703c1dd7736fc147db457098759d8b69" }, "xiaomiSu7": { "file": "assets/encounters/v400/xiaomiSu7.png", "w": 138, "h": 42.047, "pixels": [768, 234], "sourcePixels": [1903, 826], "sourceCrop": [26, 190, 1877, 753], "alphaExtrema": [0, 255], "sha256": "3187a0f29bc97d4a73a1186cc1fbd60785ac6beea61dc55a10d7d70184e20bab" }, "batteryAgv": { "file": "assets/encounters/v400/batteryAgv.png", "w": 118, "h": 41.177, "pixels": [768, 268], "sourcePixels": [2012, 782], "sourceCrop": [131, 113, 1878, 722], "alphaExtrema": [0, 255], "sha256": "82d12e8efdb89038ea0351b7dc942754be9ab9f78aed29a88b2c4a12a8cc6d79" }, "qualitySkull": { "file": "assets/encounters/v400/qualitySkull.png", "w": 76, "h": 40.87, "pixels": [768, 413], "sourcePixels": [1536, 1024], "sourceCrop": [183, 152, 1413, 814], "alphaExtrema": [0, 255], "sha256": "955bb780f34142f0f9302839283022730bfd1c7688c48c46ac59cc18ad994d4b" }, "starlink": { "file": "assets/encounters/v400/starlink.png", "w": 112, "h": 69.271, "pixels": [768, 475], "sourcePixels": [1559, 1009], "sourceCrop": [76, 97, 1491, 973], "alphaExtrema": [0, 255], "sha256": "3988083ecbf0294a0c50b44df0bd8283347a56d5d9ffabe36ff6aa3a281d9e08" }, "regulatorDrone": { "file": "assets/encounters/v400/regulatorDrone.png", "w": 106, "h": 47.065, "pixels": [768, 341], "sourcePixels": [1536, 1024], "sourceCrop": [15, 176, 1521, 845], "alphaExtrema": [0, 255], "sha256": "99140365f63c6e6af46fafbfd90380459ae5e0a4e5709dfc371ebd1c3a5cf830" }, "reptileHead": { "file": "assets/encounters/v400/reptileHead.png", "w": 68, "h": 79.416, "pixels": [274, 320], "sourcePixels": [1173, 1341], "sourceCrop": [121, 97, 1077, 1212], "alphaExtrema": [0, 255], "sha256": "dc627f44d9efbaae3b93c44c5377ce25b518751b691071cf11a26f3670bcfa49" }, "moltenVat": { "file": "assets/encounters/v400/moltenVat.png", "w": 164, "h": 134.745, "pixels": [768, 631], "sourcePixels": [1351, 1164], "sourceCrop": [54, 71, 1298, 1093], "alphaExtrema": [0, 255], "sha256": "f7fe4d31e0588da095c2647e5548d3b8bebdd67aa9cbdcfe6e619963bd1198ca" } });

// supabase/rulesets/roadster-v460/content.js
function freeze9(value) {
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) freeze9(item);
    Object.freeze(value);
  }
  return value;
}
var BIOMES9 = freeze9(["spaceport", "tesla-factory"]);
var BIOME_CYCLE9 = freeze9(["spaceport", "tesla-factory"]);
var ANIMATIONS9 = freeze9(["taunt", "angry-look", "point-and-laugh", "trampoline-bounce", "money-guns", "podcast", "throw", "lightning", "reptile", "look"]);
var ASSETS9 = freeze9({
  ...Object.fromEntries(Object.entries(ENEMY_SPRITES7).map(([id2, s]) => ["encounter_" + id2, { file: s.file }])),
  encounter_moltenVat: { file: "assets/encounters/v411/moltenVat.png" },
  collage: { file: "collage-atlas.png" },
  extras: { file: "collage-extras.png" },
  cast: { file: "paper-cast.png" },
  photos: { file: "obstacle-photos.png" },
  joe: { file: "assets/characters/joe-rogan.png" },
  amber: { file: "assets/characters/amber-head-v247.png" },
  drone: { file: "assets/obstacles/phantom-v3.png" }
});
var none9 = { enabled: false };
var reaction9 = (animationId, trigger = "near", range = 300, space = "target") => ({ enabled: true, animationId, trigger, range, space });
function define9(base, options = {}) {
  return freeze9({
    ...base,
    definitionVersion: 1,
    category: options.category || "object",
    placement: base.altitude ? "air" : "ground",
    anchor: base.altitude ? "air-bottom-center" : "ground-center",
    biomes: options.biomes || "all",
    visual: { renderer: options.renderer || "prop", key: options.key || base.id, assets: options.assets || [], bob: options.bob || false },
    collision: options.collision || "box",
    reactions: { hero: options.hero || none9, obstacle: options.obstacle || none9 },
    collectible: true,
    provenance: "assets-provenance.json"
  });
}
function spriteDefinition7(id2, name2, options, altitude = 0) {
  const s = ENEMY_SPRITES7[
    /** @type {keyof typeof ENEMY_SPRITES} */
    id2
  ];
  return define9({ id: id2, name: name2, w: s.w, h: s.h, inset: id2 === "t800" ? 10 : 5, ...altitude ? { altitude } : {} }, { ...options, renderer: "sprite", assets: ["encounter_" + id2] });
}
var OBSTACLES9 = freeze9([
  define9({ id: "v8", name: "V8 \u2022 VERY LOUD", w: 108, h: 36 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define9({ id: "trump", name: "TARIFF MAN", w: 54, h: 94 }, { renderer: "character", assets: ["collage"], category: "person", bob: true, hero: reaction9("taunt"), obstacle: reaction9("angry-look") }),
  define9({ id: "protest", name: "COUCH CRITICS", w: 102, h: 94 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "group" }),
  define9({ id: "truck", name: "CYBERBRICK", w: 110, h: 41 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define9({ id: "doge", name: "MUCH WOW", w: 52, h: 64 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "animal" }),
  define9({ id: "pump", name: "BIG OIL", w: 54, h: 78 }, {}),
  define9({ id: "zuck", name: "ZUCK", w: 62, h: 94, inset: 5 }, { renderer: "character", assets: ["cast"], category: "person", hero: reaction9("money-guns", "airborne-near"), obstacle: reaction9("money-guns", "airborne-near") }),
  define9({ id: "openai", name: "OPENAI", w: 70, h: 68, inset: 5 }, { category: "emblem" }),
  define9({ id: "claude", name: "CLAUDE", w: 84, h: 73, inset: 6 }, { category: "emblem" }),
  define9({ id: "gemini", name: "GEMINI", w: 58, h: 78, inset: 4 }, { category: "emblem" }),
  define9({ id: "rogozin", name: "ROGOZIN / TRAMPOLINE", w: 88, h: 130, inset: 4 }, { renderer: "character", assets: ["cast"], category: "person", biomes: ["spaceport"], collision: "trampoline", hero: reaction9("point-and-laugh", "airborne-near"), obstacle: reaction9("trampoline-bounce", "passage") }),
  define9({ id: "amber", name: "AMBER HEARD", w: 58, h: 94, inset: 9 }, { renderer: "character", assets: ["amber"], category: "person", obstacle: reaction9("throw", "passage") }),
  define9({ id: "joe", name: "JOE ROGAN", w: 76, h: 94, inset: 10 }, { renderer: "character", assets: ["joe"], category: "person", hero: reaction9("podcast", "passage", 650, "self"), obstacle: reaction9("podcast", "passage", 650, "self") }),
  define9({ id: "muscleCoupe", name: "AMERICAN MUSCLE", w: 138, h: 45, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define9({ id: "muscleCompact", name: "SMALL BLOCK / BIG EGO", w: 112, h: 38, inset: 5 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define9({ id: "pickup", name: "BIG TRUCK ENERGY", w: 140, h: 57, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  ...[
    ["homelessRow", "SPARE CHANGE", "group", "all"],
    ["t800", "T-800 / AUTOMATION", "person", ["tesla-factory"]],
    ["bydSeal", "BYD SEAL", "vehicle", ["tesla-factory"]],
    ["xiaomiSu7", "XIAOMI SU7", "vehicle", ["tesla-factory"]],
    ["batteryAgv", "BATTERY SWAP", "vehicle", ["tesla-factory"]]
  ].map(([id2, name2, category, biomes]) => spriteDefinition7(String(id2), String(name2), { category: String(category), biomes: Array.isArray(biomes) ? biomes : "all" })),
  ...[
    ["ufo", "UNIDENTIFIED FLYING OPPORTUNITY", "all"],
    ["primeDrone", "PRIME PERSONAL SPACE", "all"],
    ["twitterBird", "THE FORMER BIRD", ["spaceport"]],
    ["starlink", "STARLINK / WRONG ORBIT", ["spaceport"]],
    ["regulatorDrone", "APPROVAL PENDING", "all"],
    ["sikorsky", "SIKORSKY / VS-300", ["spaceport"]],
    ["qualitySkull", "QUALITY CONTROL", ["tesla-factory"]]
  ].map(([id2, name2, biomes]) => spriteDefinition7(String(id2), String(name2), { category: "flying enemy", biomes: Array.isArray(biomes) ? biomes : "all", collision: "box", hero: reaction9(id2 === "ufo" ? "reptile" : "look", "near", 320) }, { ufo: 225, primeDrone: 215, twitterBird: 215, starlink: 250, regulatorDrone: 220, sikorsky: 245, qualitySkull: 210 }[String(id2)])),
  spriteDefinition7("xi", "COMRADE XI", { category: "person", biomes: ["tesla-factory"], collision: "box", hero: reaction9("lightning", "near", 380), obstacle: reaction9("lightning", "near", 380) })
]);
var PROP_TYPES9 = freeze9(OBSTACLES9.filter((o) => ["muscleCoupe", "muscleCompact", "pickup"].includes(o.id)));
var AIR_TYPES9 = freeze9(OBSTACLES9.filter((o) => o.placement === "air"));
var definitionsById9 = new Map(OBSTACLES9.map((o) => [o.id, o]));
var obstacleDefinition9 = (id2) => definitionsById9.get(id2);
function validateContent9(definitions = OBSTACLES9) {
  const errors = [], ids = /* @__PURE__ */ new Set();
  for (const o of definitions) {
    if (!o.id || ids.has(o.id)) errors.push(`duplicate or missing id: ${o.id}`);
    ids.add(o.id);
    if (!Number.isFinite(o.w) || !Number.isFinite(o.h) || o.w <= 0 || o.h <= 6) errors.push(`${o.id}: invalid size`);
    if (!["ground", "air"].includes(o.placement)) errors.push(`${o.id}: invalid placement`);
    if (o.placement === "air" && (!Number.isFinite(o.altitude) || !(Number(o.altitude) > 0))) errors.push(`${o.id}: invalid altitude`);
    if (o.placement === "ground" && o.altitude) errors.push(`${o.id}: ground altitude`);
    if (!["ground-center", "air-bottom-center"].includes(o.anchor)) errors.push(`${o.id}: invalid anchor`);
    if (o.biomes !== "all" && (!Array.isArray(o.biomes) || !o.biomes.length || o.biomes.some((b) => !BIOMES9.includes(b)))) errors.push(`${o.id}: unknown biome`);
    if (!o.visual || !["photo", "cutout", "character", "prop", "drone", "sprite"].includes(o.visual.renderer)) errors.push(`${o.id}: missing renderer`);
    for (const id2 of o.visual?.assets || []) if (!Object.hasOwn(ASSETS9, id2)) errors.push(`${o.id}: unknown asset ${id2}`);
    if (!["box", "trampoline", "none"].includes(o.collision)) errors.push(`${o.id}: missing collision profile`);
    if (o.inset !== void 0 && (!Number.isFinite(o.inset) || o.inset < 0 || o.inset * 2 >= o.w)) errors.push(`${o.id}: invalid inset`);
    for (
      const direction of
      /** @type {const} */
      ["hero", "obstacle"]
    ) {
      const r = o.reactions?.[direction];
      if (!r || typeof r.enabled !== "boolean") errors.push(`${o.id}: missing ${direction} reaction`);
      else if (r.enabled && (!ANIMATIONS9.includes(r.animationId) || !["near", "airborne-near", "passage"].includes(r.trigger) || !(r.range > 0) || !["target", "self"].includes(r.space))) errors.push(`${o.id}: missing animation ${r.animationId}`);
    }
  }
  return errors;
}
var contentErrors9 = validateContent9();
if (contentErrors9.length) throw new Error(`Invalid content: ${contentErrors9.join("; ")}`);

// supabase/rulesets/roadster-v460/physics.js
var STEP9 = 1 / 120;
function rogozinBounce9(time) {
  return 20 * Math.abs(Math.sin(time * 4.5));
}
function obstacleBoxes9(o, time = 0) {
  if ((o.collision || obstacleDefinition9(o.id)?.collision) === "trampoline") {
    return [
      { left: 6, right: o.w - 6, top: 16 },
      { left: o.w / 2 - 18, right: o.w / 2 + 18, top: 108 + rogozinBounce9(time) }
    ];
  }
  const inset = o.inset ?? 5;
  return [{ left: inset, right: o.w - inset, top: o.h - 6 }];
}

// supabase/rulesets/roadster-v460/fall.js
var clamp17 = (x) => Math.max(0, Math.min(1, x));
var ease9 = (x) => {
  x = clamp17(x);
  return x * x * (3 - 2 * x);
};
var mix9 = (a, b, t) => a + (b - a) * t;
var FALL_CONTACTS9 = Object.freeze([0.14, 0.36, 0.56]);
var FALL_CAR_CONTACTS9 = Object.freeze([0.16, 0.38]);
var FALL_CAR_HULL9 = Object.freeze([[-49, -7], [-8, -15], [8, -15], [48.5, 0], [47, 6], [27, 12], [-34, 12], [-46, 5]].map(Object.freeze));
function fallCarSupport9(angle) {
  return Math.max(...FALL_CAR_HULL9.map(([x, y]) => x * Math.sin(angle) + y * Math.cos(angle)));
}
var arc9 = (p, a, b, height) => {
  const t = clamp17((p - a) / (b - a));
  return t < 1e-12 || t > 1 - 1e-12 ? 0 : height * 4 * t * (1 - t);
};
var pulse9 = (p, hit) => ease9((p - hit + 0.035) / 0.035) * (1 - ease9((p - hit) / 0.055));
function track9(keys, p) {
  let i = 1;
  while (i < keys.length - 1 && p > keys[i][0]) i++;
  const [a, b] = [keys[i - 1], keys[i]];
  return mix9(a[1], b[1], ease9((p - a[0]) / (b[0] - a[0])));
}
function createFall9() {
  return { active: false, age: 0, duration: GAMEPLAY9.fallSeconds, rate: 1, taps: 0, angle: 0, reduced: false };
}
function beginFall9(f, result, { reduced = false, speed = GAMEPLAY9.startSpeed } = {}) {
  const angle = Math.atan2(Math.sin(result.angle), Math.cos(result.angle));
  const severity = clamp17((speed - GAMEPLAY9.startSpeed) / (GAMEPLAY9.maxSpeed - GAMEPLAY9.startSpeed));
  Object.assign(f, { active: true, age: 0, duration: GAMEPLAY9.fallSeconds + GAMEPLAY9.fallSpeedSeconds * severity, rate: 1, taps: 0, angle, reduced });
}
function hastenFall9(f) {
  if (!f.active) return false;
  f.taps++;
  f.rate = Math.min(GAMEPLAY9.fallMaxRate, f.rate + GAMEPLAY9.fallTapRate);
  return true;
}
function advanceFall9(f, dt) {
  if (!f.active) return { impacts: 0, finished: false };
  const previous = f.age;
  f.age = Math.min(f.duration, f.age + dt * f.rate);
  const impacts = FALL_CONTACTS9.filter((t) => previous < f.duration * t && f.age >= f.duration * t).length;
  f.active = f.age < f.duration;
  return { impacts, finished: !f.active };
}
function fallPose9(f) {
  const p = clamp17(f.age / f.duration), sit = ease9(p / 0.14), stand = ease9((p - 0.68) / 0.16), gather = ease9((p - 0.7) / 0.22), settle = clamp17((p - 0.97) / 0.03);
  const impact = Math.max(...FALL_CONTACTS9.map((hit) => pulse9(p, hit))), seat = sit * (1 - stand);
  const crouch = (0.72 + 0.18 * impact) * seat + (settle === 1 ? 0 : 0.1 * Math.sin(settle * Math.PI));
  const lift = p < 0.36 ? arc9(p, 0.14, 0.36, 32) : p < 0.56 ? arc9(p, 0.36, 0.56, 28) : arc9(p, 0.56, 0.97, 112);
  const angle = mix9(f.angle, -0.64, sit) * (1 - stand);
  const seatAnchor = -11 * Math.sin(angle) + (22.5 + 27 * crouch) * Math.cos(angle) + 9;
  const rider = { x: 34 * sit * (1 - gather), y: mix9(95, seatAnchor, seat) + lift, angle, seat, crouch, lift };
  const entry = (y) => ({ x: Math.sin(f.angle) * (y - 65), y: 65 + Math.cos(f.angle) * (y - 65) });
  const e = entry(95), c = entry(12);
  rider.x += e.x * (1 - sit);
  rider.y += (e.y - 95) * (1 - sit);
  const carAngle = track9([[0, f.angle], [0.16, 0.95], [0.29, Math.PI], [0.38, 2 * Math.PI - 1.02], [0.54, 2 * Math.PI], [1, 2 * Math.PI]], p);
  const carHop = p < 0.16 ? arc9(p, 0, 0.16, 20) : p < 0.38 ? arc9(p, 0.16, 0.38, 22) : arc9(p, 0.38, 0.54, 8);
  const car = { x: gather === 1 ? 0 : mix9(c.x, -88, ease9(p / 0.16)) * (1 - gather), y: p >= 0.54 ? 12 : mix9(c.y, fallCarSupport9(carAngle) + carHop, ease9(p / 0.06)), angle: carAngle, phase: 0 };
  let shake = 0;
  for (const hit of FALL_CONTACTS9) if (p >= hit) shake = Math.max(shake, Math.exp(-(p - hit) * 40));
  const pose = { car, rider, crouch, impact, flail: sit * (1 - ease9((p - 0.82) / 0.12)), push: 0, shake: shake * 2.4, progress: p };
  if (f.reduced) {
    pose.car = { x: 0, y: 12, angle: 0, phase: 0 };
    pose.rider = { x: 0, y: 95, angle: 0, seat: 0, crouch };
    pose.shake = 0;
    pose.push = 0;
    pose.flail = 0;
  }
  return pose;
}
function fallPolygons9(pose) {
  const seat = pose.rider.seat || 0, crouch = pose.rider.crouch || 0;
  const rider = [[-23, -70 + 4 * seat], [23 + 48 * seat, -70 + 4 * seat], [23 + 48 * seat, 68 - 27 * crouch], [-23, 68 - 27 * crouch]];
  return [[pose.car, FALL_CAR_HULL9.map(([x, y]) => [x, -y])], [pose.rider, rider]].map(([body2, vertices]) => {
    const c = Math.cos(body2.angle), s = Math.sin(body2.angle);
    return vertices.map(([x, y]) => ({ x: body2.x + c * x + s * y, y: body2.y - s * x + c * y }));
  });
}
function interpolateFall9(a, b, t) {
  const pose = {};
  for (const part of ["car", "rider"]) {
    pose[part] = {};
    for (const k of ["x", "y", "angle", "seat", "crouch", "phase"]) pose[part][k] = mix9(a[part][k] || 0, b[part][k] || 0, t);
  }
  return pose;
}

// supabase/rulesets/roadster-v460/gameplay.js
var TAU9 = Math.PI * 2;
var clamp18 = (x, a, b) => Math.max(a, Math.min(b, x));
var approach9 = (x, target, amount) => x < target ? Math.min(target, x + amount) : Math.max(target, x - amount);
function uprightError9(angle, direction = -1) {
  let e = ((angle + Math.PI) % TAU9 + TAU9) % TAU9 - Math.PI;
  if (Math.abs(Math.abs(e) - Math.PI) < 1e-9) e = -Math.sign(direction || -1) * Math.PI;
  return e;
}
function createFlight9(fuel = GAMEPLAY9.initialFuel) {
  return { y: 0, vy: 0, vx: 0, angle: 0, omega: 0, airborne: false, time: 0, fuel, thrusting: false, latched: false, attach: 0, maxTurn: 0, turns: 0, lastDirection: -1, trickStarted: false, grab: 0, launchVelocity: 0, jumpFactor: 1 };
}
function launch9(p, charge = 0) {
  if (p.airborne) return false;
  Object.assign(p, { y: 1e-3, vy: (GAMEPLAY9.jumpSpeed + GAMEPLAY9.chargedSpeed * clamp18(charge, 0, 1)) * (p.jumpFactor || 1), angle: 0, omega: 0, airborne: true, time: 0, latched: false, attach: 0, maxTurn: 0, turns: 0, trickStarted: false, grab: 0, launchVelocity: (GAMEPLAY9.jumpSpeed + GAMEPLAY9.chargedSpeed * clamp18(charge, 0, 1)) * (p.jumpFactor || 1) });
  return true;
}
function advanceFlight9(p, dt, { spin = false, thrust = false } = {}) {
  p.thrusting = false;
  const gripTarget = p.airborne && spin ? 1 : 0;
  p.grab = approach9(p.grab, gripTarget, dt / (gripTarget ? 0.12 : 0.18));
  if (!p.airborne) {
    p.vx *= Math.exp(-GAMEPLAY9.horizontalDrag * dt);
    return null;
  }
  p.time += dt;
  if (spin) {
    p.trickStarted = true;
    p.lastDirection = -1;
    p.omega = approach9(p.omega, -GAMEPLAY9.spinSpeed, GAMEPLAY9.spinAcceleration * dt);
  } else {
    const target = Math.sign(p.omega) * Math.min(Math.abs(p.omega), GAMEPLAY9.releaseSpeed);
    p.omega = approach9(p.omega, target, GAMEPLAY9.releaseDeceleration * dt);
  }
  p.angle += p.omega * dt;
  p.maxTurn = Math.max(p.maxTurn, -p.angle);
  p.turns = Math.floor((p.maxTurn + 1e-7) / TAU9);
  const burn = thrust ? Math.min(dt, p.fuel / GAMEPLAY9.fuelPerSecond) : 0;
  if (burn > 0) {
    p.fuel = Math.max(0, p.fuel - burn * GAMEPLAY9.fuelPerSecond);
    p.thrusting = true;
    p.latched = true;
    p.vx += Math.sin(p.angle) * GAMEPLAY9.thrustAcceleration * burn;
    p.vy += Math.cos(p.angle) * GAMEPLAY9.thrustAcceleration * burn;
  }
  if (p.latched) p.attach = Math.min(1, p.attach + dt / GAMEPLAY9.attachSeconds);
  p.vx = clamp18(p.vx * Math.exp(-GAMEPLAY9.horizontalDrag * dt), -GAMEPLAY9.maxHorizontal, GAMEPLAY9.maxHorizontal);
  p.y += p.vy * dt - 0.5 * GAMEPLAY9.gravity * dt * dt;
  p.vy -= GAMEPLAY9.gravity * dt;
  if (p.y > 0) return null;
  const good = Math.abs(uprightError9(p.angle)) <= GAMEPLAY9.landingAngle + 1e-9 && Math.abs(p.omega) <= GAMEPLAY9.landingOmega;
  const turns = good ? Math.max(p.turns, Math.round(-p.angle / TAU9)) : p.turns;
  const perfect = good && Math.abs(uprightError9(p.angle)) <= GAMEPLAY9.perfectAngle + 1e-9;
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
function createEconomy9() {
  return { scoreFactor: 1, bonus: 0, multiplier: 10, meter: 0, decay: 0, streak: 0, streakLeft: 0, flips: 0 };
}
function comboSeconds9(e) {
  return GAMEPLAY9.comboDuration - GAMEPLAY9.comboFalloff * (e.multiplier / 10 - 1);
}
function rewardAction9(e, count = 1) {
  e.multiplier = Math.min(GAMEPLAY9.maxMultiplier, e.multiplier + count * GAMEPLAY9.multiplierStep);
  e.meter = 1;
  e.decay = 0;
}
function advanceEconomy9(e, dt) {
  if (e.meter > 0) {
    const used = Math.min(dt, e.meter * comboSeconds9(e));
    e.meter = Math.max(0, e.meter - used / comboSeconds9(e));
    dt -= used;
  }
  if (e.meter === 0 && e.multiplier > 10) {
    e.decay += dt;
    while (e.decay + 1e-9 >= GAMEPLAY9.comboDecaySeconds && e.multiplier > 10) {
      e.multiplier--;
      e.decay -= GAMEPLAY9.comboDecaySeconds;
    }
  }
}
function advanceStreak9(e, dt) {
  const used = Math.min(dt, e.streakLeft);
  e.streakLeft -= used;
  e.streak = Math.max(0, e.streak - (dt - used) * GAMEPLAY9.streakDecay);
}
function passObstacle9(e) {
  const points = GAMEPLAY9.obstaclePoints * e.multiplier / 10 * (e.scoreFactor || 1);
  e.bonus += points;
  return points;
}
function settleLanding9(e, p, result, { late = 0, near = 0 } = {}) {
  if (!result.good) {
    e.multiplier = 10;
    e.meter = 0;
    e.decay = 0;
    e.streak = 0;
    e.streakLeft = 0;
    return { points: 0, turns: 0, late: 0, near: 0, perfect: false, good: false };
  }
  const n = result.turns, perfect = !!result.perfect, points = (GAMEPLAY9.flipFactor * n * (n + 1) + GAMEPLAY9.nearPoints * (late + near) + GAMEPLAY9.perfectPoints * Number(perfect)) * e.multiplier / 10 * (e.scoreFactor || 1);
  e.bonus += points;
  e.flips += n;
  p.fuel = Math.min(GAMEPLAY9.tank, p.fuel + GAMEPLAY9.fuelPerFlip * n);
  if (n + late + near + Number(perfect)) rewardAction9(e, n + late + near + Number(perfect));
  if (n || near) {
    e.streak = Math.min(GAMEPLAY9.maxStreak, e.streak + GAMEPLAY9.streakStep);
    e.streakLeft = GAMEPLAY9.streakHold;
  }
  return { points, turns: n, late, near, perfect, good: true };
}
function createPace9() {
  return { boost: 0, progress: 0, base: GAMEPLAY9.startSpeed, speed: GAMEPLAY9.startSpeed, recovery: null, stumble: 0, falling: false };
}
function stumble9(pace) {
  const target = pace.recovery?.target ?? pace.base, r = clamp18((target - GAMEPLAY9.startSpeed) / (GAMEPLAY9.maxSpeed - GAMEPLAY9.startSpeed), 0, 1);
  pace.recovery = { target, age: 0, duration: GAMEPLAY9.recoveryMin + GAMEPLAY9.recoveryExtra * r ** 1.5 };
  pace.stumble = GAMEPLAY9.stumbleSeconds;
  pace.base = target * GAMEPLAY9.recoveryRatio;
}
function recoverySpeed9(r, t) {
  const T = r.duration, d = r.target * (1 - GAMEPLAY9.recoveryRatio), v0 = r.target * GAMEPLAY9.recoveryRatio, h = 0.15, a = T - h;
  if (t <= a) return v0 + d * (t / T) ** 2;
  const u = clamp18((t - a) / h, 0, 1), start = v0 + d * (a / T) ** 2, slope = 2 * d * a / T ** 2, endSlope = r.target >= GAMEPLAY9.maxSpeed ? 0 : (GAMEPLAY9.maxSpeed - GAMEPLAY9.startSpeed) / GAMEPLAY9.rampSeconds;
  return (2 * u ** 3 - 3 * u * u + 1) * start + (u ** 3 - 2 * u * u + u) * h * slope + (-2 * u ** 3 + 3 * u * u) * r.target + (u ** 3 - u * u) * h * endSlope;
}
function advancePace9(pace, e, p, dt) {
  if (pace.recovery) {
    pace.stumble = Math.max(0, pace.stumble - dt);
    const r = pace.recovery;
    r.age = Math.min(r.duration, r.age + dt);
    pace.base = recoverySpeed9(r, r.age);
    if (r.age >= r.duration) {
      pace.base = r.target;
      pace.recovery = null;
    }
  } else if (!pace.falling) {
    pace.progress += dt;
    pace.base = GAMEPLAY9.startSpeed + (GAMEPLAY9.maxSpeed - GAMEPLAY9.startSpeed) * Math.min(1, pace.progress / GAMEPLAY9.rampSeconds);
  }
  pace.speed = Math.max(60, pace.base * (1 + e.streak) * (1 + (pace.boost || 0)) + p.vx);
  return pace.speed;
}
function playerPolygons9(p) {
  if (p.fallPose) return fallPolygons9(p.fallPose);
  const c = Math.cos(p.angle), s = Math.sin(p.angle);
  return [[-47, 0, 47, 25], [-23, 25, 23, 163 - 32 * (p.grab || 0)]].map(([l, b, r, t]) => [[l, b], [r, b], [r, t], [l, t]].map(([x, y]) => ({ x: c * x + s * (y - 65), y: p.y + 65 - s * x + c * (y - 65) })));
}
function overlaps9(poly, rect) {
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
function collisionAt9(p, o, dx, time = 0) {
  if (o.collision === "none") return false;
  if (dx > 180 || dx + o.w < -180) return false;
  const polygons = playerPolygons9(p);
  return obstacleBoxes9(o, time).some((b) => {
    const bottom = o.altitude || 0, top = bottom + b.top;
    const rect = [{ x: dx + b.left, y: bottom }, { x: dx + b.right, y: bottom }, { x: dx + b.right, y: top }, { x: dx + b.left, y: top }];
    return polygons.some((poly) => overlaps9(poly, rect));
  });
}
function sweptCollision9(before, after, o, dxBefore, dxAfter, time, dt) {
  if (Math.min(dxBefore, dxAfter) > 180 || Math.max(dxBefore, dxAfter) + o.w < -180) return false;
  const fallTravel = before.fallPose && after.fallPose ? Math.max(...["rider", "car"].map((part) => Math.abs(after.fallPose[part].angle - before.fallPose[part].angle) * (part === "car" ? 55 : 170) + Math.abs(after.fallPose[part].y - before.fallPose[part].y) + Math.abs(after.fallPose[part].x - before.fallPose[part].x))) : 0;
  const n = Math.max(1, Math.ceil((Math.abs(dxAfter - dxBefore) + Math.abs(after.y - before.y) + Math.abs(after.angle - before.angle) * 170 + fallTravel) / 4));
  for (let i = 0; i <= n; i++) {
    const f = i / n, p = { y: before.y + (after.y - before.y) * f, angle: before.angle + (after.angle - before.angle) * f, grab: (before.grab || 0) + ((after.grab || 0) - (before.grab || 0)) * f };
    if (before.fallPose && after.fallPose) p.fallPose = interpolateFall9(before.fallPose, after.fallPose, f);
    if (collisionAt9(p, o, dxBefore + (dxAfter - dxBefore) * f, time - dt + dt * f)) return true;
  }
  return false;
}
function nearWindow9(distance, speed) {
  return distance >= 0 && distance <= Math.max(0, speed) * GAMEPLAY9.nearSeconds + 1e-8;
}

// supabase/rulesets/roadster-v460/boosters.js
var BOOSTERS5 = Object.freeze({
  shield: Object.freeze({ name: "INVINCIBLE", seconds: 8, color: "#7ce5f3" }),
  speed: Object.freeze({ name: "OVERDRIVE", seconds: 8, color: "#ffad62" }),
  jump: Object.freeze({ name: "HIGH JUMP", seconds: 12, color: "#d9ff62" }),
  life: Object.freeze({ name: "EXTRA LIFE", seconds: 0, color: "#ff6a78" }),
  score: Object.freeze({ name: "SCORE \xD73", seconds: 10, color: "#ffc86d" })
});
function createBoosters5(seed = 0) {
  return { active: {}, hearts: 0, grace: 0, ghostIds: [], speedBlend: 0, pickups: [], nextAt: 8, serial: 0, bag: [], bagCycle: 0, random: (seed ^ 2772213271) >>> 0, spoiledFlight: false };
}
var activeBooster5 = (q, id2) => (q?.active[id2] || 0) > 0;
function canCollectBooster4(q, id2) {
  return !!BOOSTERS5[id2] && (id2 === "life" ? q.hearts < 2 : activeBooster5(q, id2) || Object.keys(q.active).length < 3);
}
function collectBooster5(q, id2) {
  const def = BOOSTERS5[id2];
  if (!canCollectBooster4(q, id2)) return false;
  if (id2 === "life") {
    if (q.hearts >= 2) return false;
    q.hearts++;
    return true;
  }
  if (!activeBooster5(q, id2) && Object.keys(q.active).length >= 3) return false;
  q.active[id2] = def.seconds;
  return true;
}
function advanceBoosters5(q, dt) {
  for (const id2 of Object.keys(q.active)) {
    q.active[id2] = Math.max(0, q.active[id2] - dt);
    if (q.active[id2] === 0) delete q.active[id2];
  }
  q.grace = Math.max(0, q.grace - dt);
  const target = activeBooster5(q, "speed") ? 1 : 0, delta = dt / (target ? 0.6 : 0.8);
  q.speedBlend = target ? Math.min(1, q.speedBlend + delta) : Math.max(0, q.speedBlend - delta);
}
function random5(q) {
  q.random = Math.imul(q.random, 1664525) + 1013904223 >>> 0;
  return q.random / 4294967296;
}
function offerBooster5(q, { time, speed, clear }) {
  if (!clear || q.pickups.length || time < q.nextAt) return null;
  if (!q.bag.length) {
    q.bagCycle++;
    q.bag = Object.keys(BOOSTERS5).filter((id3) => id3 !== "life" || q.bagCycle % 3 === 0);
    for (let i = q.bag.length - 1; i > 0; i--) {
      const j = Math.floor(random5(q) * (i + 1));
      [q.bag[i], q.bag[j]] = [q.bag[j], q.bag[i]];
    }
  }
  const eligible3 = (id3) => id3 === "life" ? q.hearts < 2 : activeBooster5(q, id3) || Object.keys(q.active).length < 3;
  let index = q.bag.findIndex(eligible3);
  if (index < 0) {
    q.nextAt = time + 2;
    return null;
  }
  const id2 = q.bag.splice(index, 1)[0], pickup = { id: id2, uid: ++q.serial, x: Math.max(900, speed * 1.9 + 180), y: q.serial === 1 || random5(q) < 0.55 ? 104 : 240 };
  q.pickups.push(pickup);
  if (q.serial > 1 && random5(q) < 0.4) {
    const second = q.bag.findIndex((other) => other !== id2 && eligible3(other));
    if (second >= 0) {
      const next = q.bag.splice(second, 1)[0];
      q.pickups.push({ id: next, uid: ++q.serial, x: pickup.x + 240, y: pickup.y });
    }
  }
  q.nextAt = time + 14 + random5(q) * 6;
  return pickup;
}

// supabase/rulesets/roadster-v460/rails.js
var RAIL3 = Object.freeze({ height: 190, length: 720, belly: 8, pointsPerUnit: 0.1, firstWave: 3, every: 7, exitSeconds: 1.25 });
var makeRail3 = (x) => ({ x, w: RAIL3.length, h: RAIL3.height, paid: [], passed: false });
var createGrind3 = () => ({ support: null, age: 0, exit: null, exitAge: 1, pending: 0, distance: 0, turns: 0 });
var railContactHeight3 = (p) => p.y + 65 + (RAIL3.belly - 65) * Math.cos(p.angle);
function leaveRail3(g, p) {
  g.support = null;
  g.age = 0;
  g.exit = "end";
  g.exitAge = 0;
  p.airborne = true;
  p.angle = uprightError9(p.angle);
  p.omega = 0;
  p.maxTurn = Math.max(0, -p.angle);
  p.turns = 0;
  p.time = 0;
  p.launchVelocity = 0;
  p.trickStarted = true;
}
function jumpFromRail3(g, p, charge) {
  const y = p.y, angle = uprightError9(p.angle);
  leaveRail3(g, p);
  p.airborne = false;
  launch9(p, charge);
  p.y += y;
  p.angle = angle;
  p.trickStarted = true;
  g.exit = "jump";
}
function newDistance3(rail, a, b) {
  a = Math.max(0, a);
  b = Math.min(rail.w, b);
  if (b <= a) return 0;
  let fresh = b - a;
  for (const [l, r] of rail.paid) fresh -= Math.max(0, Math.min(b, r) - Math.max(a, l));
  const ranges = [...rail.paid, [a, b]].sort((x, y) => x[0] - y[0]), merged = [];
  for (const range of ranges) {
    const last = merged.at(-1);
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([...range]);
  }
  rail.paid = merged;
  return Math.max(0, fresh);
}
function advanceRail3(g, p, before, rails, travel, dt, e, { spoiled = false, blocked = false } = {}) {
  g.exitAge = Math.min(1, g.exitAge + dt);
  const events = [], oldXs = rails.map((r) => r.x);
  for (const r of rails) {
    r.x -= travel;
    r.passed = r.x + r.w < 0;
  }
  let fraction = 0, rail = rails.find((r) => r.uid === g.support);
  if (g.support && !rail) {
    leaveRail3(g, p);
    events.push({ type: "rail-exit", reason: "end" });
    return events;
  }
  if (!rail && !blocked && before.airborne) {
    const old = railContactHeight3(before), now = railContactHeight3(p);
    const good = p.vy <= 0 && Math.abs(uprightError9(p.angle)) <= GAMEPLAY9.landingAngle + 1e-9 && Math.abs(p.omega) <= GAMEPLAY9.landingOmega;
    if (good && old >= RAIL3.height && now <= RAIL3.height && old > now) {
      fraction = (old - RAIL3.height) / (old - now);
      rail = rails.find((r, i) => {
        const x = oldXs[i] - travel * fraction;
        return x <= 0 && x + r.w >= 0;
      });
      if (rail) {
        g.support = rail.uid;
        g.age = 0;
        g.turns += Math.max(p.turns, Math.round(-p.angle / (Math.PI * 2)));
        p.turns = 0;
        p.airborne = false;
        p.omega = 0;
        p.vy = 0;
        p.thrusting = false;
        p.grab = 0;
        events.push({ type: "rail-catch", uid: rail.uid, impact: Math.abs(before.vy) });
      }
    }
  }
  if (rail) {
    const i = rails.indexOf(rail), start = -oldXs[i] + travel * fraction, end = -rail.x;
    const distance = newDistance3(rail, start, end);
    if (!spoiled) {
      g.distance += distance;
      g.pending += distance * RAIL3.pointsPerUnit * e.multiplier / 10 * (e.scoreFactor || 1);
    }
    g.age += dt * (1 - fraction);
    p.y = rail.h - 65 - (RAIL3.belly - 65) * Math.cos(p.angle);
    p.vy = 0;
    p.omega = 0;
    p.thrusting = false;
    if (distance > 0) events.push({ type: "rail-travel", uid: rail.uid, distance, points: spoiled ? 0 : distance * RAIL3.pointsPerUnit * e.multiplier / 10 * (e.scoreFactor || 1) });
    if (rail.x + rail.w <= 0) {
      leaveRail3(g, p);
      events.push({ type: "rail-exit", reason: "end" });
    }
  }
  return events;
}

// supabase/rulesets/roadster-v460/biomes.js
var BIOME_SCORE_STEP7 = 7e3;
var SCENERY_CYCLE7 = BIOME_CYCLE9;
function biomeAt7(score = 0) {
  const points = Number.isFinite(score) ? Math.max(0, score) : 0;
  const leg = Math.floor(points / BIOME_SCORE_STEP7), nextAt = (leg + 1) * BIOME_SCORE_STEP7;
  return { id: SCENERY_CYCLE7[leg % SCENERY_CYCLE7.length], leg, nextAt, nextIn: nextAt - points };
}

// supabase/rulesets/roadster-v460/routes.js
var STAGES9 = GAMEPLAY9.stages;
function stageAt9(progress) {
  return STAGES9.filter((t) => progress >= t).length - 1;
}
function makePattern9(kind, { speed = 360, type = { id: "truck", w: 110, h: 41 }, dx = 900, gapSeconds = 0.65 } = {}) {
  const item = (offset) => ({ ...type, x: dx + offset, passed: false });
  if (["pair", "spaced-pair", "mixed"].includes(kind)) return [item(0), item(speed * (0.9 + gapSeconds) + type.w)];
  if (["precision", "thrust", "low-cluster"].includes(kind)) return [item(0), item(type.w + 35)];
  return [item(0)];
}

// supabase/rulesets/roadster-v460/speed-feedback.js
var clamp01 = (value) => Math.max(0, Math.min(1, value));
var viewStrength = (speed) => Math.max(0, Math.min(1.3, (speed - GAMEPLAY9.startSpeed) / (GAMEPLAY9.maxSpeed - GAMEPLAY9.startSpeed)));
function baseViewScale(width, height) {
  const x = width * (width < 600 ? 0.24 : 0.29);
  return Math.min(1.25, Math.max(0.68, width / 650), height / 430, (width - x - 24) / 550);
}
function speedView(width, height, speed, strength = viewStrength(speed)) {
  const baseScale = baseViewScale(width, height), x = width * ((width < 600 ? 0.24 : 0.29) - 0.08 * strength);
  return {
    scale: baseScale / (1 + 0.44 * strength),
    x,
    baseScale,
    strength,
    energy: clamp01((speed - GAMEPLAY9.startSpeed) / (GAMEPLAY9.maxSpeed * 1.25 - GAMEPLAY9.startSpeed)),
    sceneryScale: Math.max(0.72, Math.min(1.15, baseScale)) / (1 + 0.18 * strength)
  };
}

// supabase/rulesets/roadster-v460/encounter-routes.js
var ENCOUNTER = Object.freeze({ tickBudget: 18e3, policyBudget: 40, window: 0.18, sample: 0.03, rest: 1.5, accentRest: 1.8, airCooldown: 28, railAirCooldown: 30, tallPreparation: 0.74, tallErrorPreparation: 0.64 });
var encounterBudget = () => ({ ticks: 0, policies: 0, candidates: 0, exhausted: false });
function preparationSeconds(type, pace, { charge = 0, lead = 0.2, speed = pace.speed } = {}) {
  const strength = Math.max(0, Math.min(1.3, (pace.base - GAMEPLAY9.startSpeed) / 300) - 0.02);
  const width = (550 * 1.25 + 24) / 0.71, view = speedView(width, 900, speed, strength);
  const silhouette = (width - view.x) / view.scale - type.w - 47;
  return silhouette / Math.max(60, speed + (type.approachSpeed || 0)) - charge * GAMEPLAY9.chargeSeconds - lead;
}
function simulateEncounter(obstacles, { flight = createFlight9(), pace = createPace9(), economy = createEconomy9(), boosterState = null, time = 0, rail = null, charge = 0.4, lead = 0.2, secondLead = lead, noInput = false, requireCatch = !!rail, budget = encounterBudget(), minGroundGap = 0, prefix = null, stopBeforeHold = null } = {}) {
  if (flight.airborne || pace.recovery || pace.falling || pace.stumble > 0 || budget.exhausted) return null;
  if (budget.policies >= ENCOUNTER.policyBudget) {
    budget.exhausted = true;
    return null;
  }
  budget.policies++;
  const p = { ...prefix?.p || flight }, r = structuredClone(prefix?.r || pace), e = { ...prefix?.e || economy }, q = prefix ? structuredClone(prefix.q) : boosterState ? structuredClone(boosterState) : null, g = prefix ? structuredClone(prefix.g) : createGrind3(), rails = prefix ? structuredClone(prefix.rails) : rail ? [{ ...structuredClone(rail), uid: 1 }] : [], obs = (prefix?.obs || obstacles).map((o) => ({ ...o })), actions = [];
  let charging = false, holdTick = 0, jumps = 0, caught = false, groundSince = null, minGap = Infinity, lateTarget = null, nearLandings = 0, lateTakeoffs = 0, firstPreparation = Infinity;
  const dt = 1 / 120, chargeTicks = Math.round(charge * GAMEPLAY9.chargeSeconds / dt), groundTargets = obs.filter((o) => !o.altitude);
  const horizon = Math.min(1800, Math.ceil((Math.max(0, ...obstacles.map((o) => o.x + o.w), rail ? rail.x + rail.w : 0) + 300) / Math.max(60, Math.min(pace.speed, pace.base)) * 120 + 360));
  for (let tick = prefix?.tick || 0; tick < horizon; tick++) {
    if (budget.ticks >= ENCOUNTER.tickBudget) {
      budget.exhausted = true;
      return null;
    }
    budget.ticks++;
    const t = tick * dt, target = rail ? jumps === 0 ? rails[0] : null : groundTargets.find((o) => !o.targeted && o.x + o.w > -47);
    if (stopBeforeHold !== null && target && (target.x + (target.inset || 5) - (rail ? 0 : 47)) / Math.max(1, r.speed + (target.approachSpeed || 0)) <= stopBeforeHold) return { p, r, e, q, g, rails, obs, tick };
    if (!noInput && !p.airborne && !g.support && target) {
      const targetLead = jumps > 0 ? secondLead : lead, ttc = (target.x + (target.inset || 5) - (rail ? 0 : 47)) / Math.max(1, r.speed + (target.approachSpeed || 0));
      if (!charging && ttc <= targetLead + chargeTicks * dt) {
        if (groundSince !== null) {
          const gap = t - groundSince;
          minGap = Math.min(minGap, gap);
          if (gap + 1e-8 < minGroundGap) return null;
        }
        charging = true;
        holdTick = tick;
        actions.push({ at: t, action: "hold" });
        const prep = rail && obs.length ? Math.min(...obs.map((o) => preparationSeconds(o, r, { charge: 0, lead: 0, speed: r.speed }) + (47 - o.x) / Math.max(60, r.speed + (o.approachSpeed || 0)))) : preparationSeconds(target, r, { charge: chargeTicks * dt / GAMEPLAY9.chargeSeconds, lead: targetLead, speed: r.speed });
        firstPreparation = Math.min(firstPreparation, prep);
      }
      if (charging && tick - holdTick >= chargeTicks) {
        const usedCharge = (tick - holdTick) * dt / GAMEPLAY9.chargeSeconds;
        p.jumpFactor = q && activeBooster5(q, "jump") ? 1.25 : 1;
        lateTarget = !rail && nearWindow9(target.x + (target.inset || 5) - 47, r.speed + (target.approachSpeed || 0)) ? target : null;
        launch9(p, usedCharge);
        target.targeted = true;
        jumps++;
        charging = false;
        actions.push({ at: t, action: "jump", charge: usedCharge });
      }
    }
    if (q) {
      advanceBoosters5(q, dt);
      r.boost = 0.35 * q.speedBlend;
      e.scoreFactor = activeBooster5(q, "score") ? 3 : 1;
    }
    advanceEconomy9(e, dt);
    advanceStreak9(e, dt);
    const before = { ...p };
    let landed = advanceFlight9(p, dt);
    advancePace9(r, e, p, dt);
    if (rail) {
      const events = advanceRail3(g, p, before, rails, r.speed * dt, dt, e);
      if (events.some((v) => v.type === "rail-catch")) caught = true;
      if (g.support) landed = null;
    }
    const after = landed ? { ...p, angle: landed.angle } : p;
    for (const o of obs) {
      const old = o.x;
      o.x -= (r.speed + (o.approachSpeed || 0)) * dt;
      if (sweptCollision9(before, after, o, old, o.x, time + t + dt, dt)) return null;
      if (!o.passed && o.x + o.w < -50) {
        o.passed = true;
        passObstacle9(e);
      }
    }
    if (landed) {
      if (!landed.good) return null;
      let near = 0;
      const late = lateTarget && lateTarget.x + lateTarget.w - (lateTarget.inset || 5) < -47 ? 1 : 0;
      for (const o of obs) if (!o.altitude && !o.nearPaid && nearWindow9(-47 - (o.x + o.w - (o.inset || 5)), r.speed)) {
        near++;
        o.nearPaid = true;
      }
      settleLanding9(e, p, landed, { late, near });
      nearLandings += near;
      lateTakeoffs += late;
      lateTarget = null;
      groundSince = t + dt;
      if (g.distance > 0) {
        e.bonus += g.pending;
        rewardAction9(e);
        Object.assign(g, createGrind3());
      }
    }
    if (obs.every((o) => o.x + o.w < -180) && rails.every((o) => o.x + o.w < -180) && !p.airborne && !g.support) {
      if (requireCatch && !caught) return null;
      return { charge, lead, secondLead, burn: 0, actions, duration: t + dt, fuelUsed: 0, nearLandings, lateTakeoffs, caught, jumps, minGroundGap: Number.isFinite(minGap) ? minGap : null, preparation: Number.isFinite(firstPreparation) ? firstPreparation : null, clearanceVerified: true, exit: { y: 0, angle: 0, vx: p.vx } };
    }
  }
  return null;
}
function prepareEncounter(obstacles, options, policies, budget = encounterBudget()) {
  const maxTrigger = Math.max(...policies.map(([charge, lead]) => lead + 0.09 + Math.round(Math.min(1, charge + 0.1) * GAMEPLAY9.chargeSeconds * 120) / 120));
  return simulateEncounter(obstacles, { ...options, budget, noInput: true, requireCatch: false, stopBeforeHold: maxTrigger });
}
function validateEncounter(obstacles, options = {}) {
  const budget = options.budget || encounterBudget(), rail = options.rail;
  if (options.noInput) return simulateEncounter(obstacles, { ...options, budget, requireCatch: false, noInput: true });
  const type = obstacles.find((o) => !o.altitude), speed = options.pace?.speed || 360, h = type?.h || 0;
  const lowCharge = Math.max(0, 0.19 - Math.max(0, speed - 360) * 16e-4), lowLead = 0.15 + Math.min(0.03, Math.max(0, speed - 360) * 25e-5);
  let policies = options.policies || (rail ? [[0.5, 0.35], [0.5, 0.5], [1, 0.35]] : h <= 45 ? [[lowCharge, lowLead], [speed < 500 ? 0.2 : 0.1, 0.16]] : h <= 78 ? [[speed < 410 ? 0.3 : 0.2, h <= 64 ? 0.2 : 0.24], [0.3, 0.24]] : h <= 100 ? [[speed < 460 ? 0.3 : 0.2, 0.27], [0.3, 0.28]] : [[0.3, 0.3], [0.4, 0.28], [0.5, 0.27]]);
  if (options.tallSingle && !rail) policies = [[0.3, 0.32], [0.35, 0.3], [0.4, 0.28]];
  const minPreparation = options.tallSingle ? h > 120 ? 0.72 : ENCOUNTER.tallPreparation : 0.9, minErrorPreparation = options.tallSingle ? h > 120 ? 0.62 : ENCOUNTER.tallErrorPreparation : 0.8;
  if (!rail && options.pace) policies = policies.filter(([charge, lead]) => preparationSeconds(type, options.pace, { charge, lead }) >= minPreparation - 0.02);
  if (!policies.length) return null;
  const prefix = prepareEncounter(obstacles, options, policies, budget);
  if (!prefix?.p) return null;
  const proof = { ...options, budget, prefix };
  for (const [charge, lead] of policies) {
    const base = simulateEncounter(obstacles, { ...proof, charge, lead });
    if (!base) continue;
    if ((!rail || obstacles.length) && (base.preparation ?? 0) < minPreparation) continue;
    let ok = true;
    for (let i = -3; i <= 3 && ok; i++) {
      if (i === 0) continue;
      const shifted = simulateEncounter(obstacles, { ...proof, charge, lead: lead + i * 0.03 });
      if (!shifted || (!rail || obstacles.length) && (shifted.preparation ?? 0) < minErrorPreparation) ok = false;
    }
    if (ok && base.jumps > 1) {
      const offsets = [-0.09, -0.06, -0.03, 0.03, 0.06, 0.09];
      for (const shift of offsets) for (const first of [false, true]) {
        const sample = simulateEncounter(obstacles, { ...proof, charge, lead: lead + (first ? shift : 0), secondLead: lead + (first ? 0 : shift) });
        if (!sample || (sample.preparation ?? 0) < minErrorPreparation) {
          ok = false;
          break;
        }
      }
      if (ok) for (const first of [-0.09, 0.09]) for (const second of [-0.09, 0.09]) {
        const sample = simulateEncounter(obstacles, { ...proof, charge, lead: lead + first, secondLead: lead + second });
        if (!sample || (sample.preparation ?? 0) < minErrorPreparation) {
          ok = false;
          break;
        }
      }
    }
    if (ok && !rail) for (const c of [Math.max(0, charge - 0.1), Math.min(1, charge + 0.1)]) {
      if (!simulateEncounter(obstacles, { ...proof, charge: c, lead })) {
        ok = false;
        break;
      }
    }
    if (ok && !rail) for (const c of [Math.max(0, charge - (options.tallSingle ? 0.1 : 0.05)), Math.min(1, charge + (options.tallSingle ? 0.1 : 0.05))]) for (const offset of options.tallSingle ? [-0.09, 0.09] : [-0.06, 0.06]) {
      if (!simulateEncounter(obstacles, { ...proof, charge: c, lead: lead + offset })) {
        ok = false;
        break;
      }
    }
    if (ok) return { ...base, preparation: rail && !obstacles.length ? null : base.preparation, preparationTarget: rail && !obstacles.length ? null : minPreparation, errorPreparationTarget: minErrorPreparation, timingMargin: 0.09, timingWindow: 0.18, sampleStep: 0.03 };
    if (budget.exhausted) return null;
  }
  return null;
}

// supabase/rulesets/roadster-v460/director.js
var factoryIds = ["truck", "t800", "bydSeal", "xiaomiSu7", "batteryAgv", "xi"];
var eligible = (o, biome) => o.biomes === "all" || o.biomes.includes(biome);
var airSpeed = { ufo: 65, primeDrone: 70, twitterBird: 95, starlink: 45, regulatorDrone: 60, sikorsky: 35, qualitySkull: 75 };
function createDirector9({ S, flight, pace, economy, boosters, spawnDistance, sceneTime = () => S.t, random: random7 = Math.random, relative = false }) {
  const initial = () => ({ wave: 0, last: null, fallbacks: 0, waiting: false, leg: -1, legStartedAt: 0, legDistance: 0, groundSinceAir: 0, airCount: 0, lastAirAt: -1e9, railCount: 0, lastRailAirAt: -1e9, phase: "introduce", flow: 0, active: false, restUntil: null, restSeconds: ENCOUNTER.rest, recoveryWaves: 0, history: [], seen: [], sinceTall: 2, budget: null });
  const state = initial();
  function reset() {
    Object.assign(state, initial());
  }
  function recover() {
    state.recoveryWaves = 2;
    state.restUntil = null;
    state.active = true;
    state.restSeconds = ENCOUNTER.accentRest;
    state.phase = "rest";
  }
  const clear = () => !flight.airborne && flight.y < 1 && !pace.recovery && !pace.falling && pace.stumble <= 0 && (S.rails || []).every((r) => r.x + r.w < -180) && S.obs.every((o) => o.x + o.w < -180 || o.smashed);
  function update() {
    const target = biomeAt7(S.score || 0);
    if (target.leg !== state.leg) {
      state.leg = target.leg;
      state.legStartedAt = S.t;
      state.legDistance = S.distance || 0;
    }
    if (state.active && clear()) {
      state.active = false;
      state.restUntil = S.t + state.restSeconds;
      S.next = Math.max(S.next, state.restSeconds);
    }
  }
  function spawn() {
    update();
    if (!clear() || state.restUntil !== null && S.t + 1e-8 < state.restUntil) {
      S.next = 0.18;
      state.waiting = true;
      return;
    }
    state.waiting = false;
    state.restUntil = null;
    const { id: biome, leg } = biomeAt7(S.score || 0), stage = stageAt9(pace.progress), budget = encounterBudget();
    state.budget = budget;
    const familiar = S.t - state.legStartedAt < 8 || S.distance !== void 0 && S.distance - state.legDistance < 2200, simple = pace.progress < 35 || familiar || state.recoveryWaves > 0, fast = S.speed > 760;
    const candidate = () => {
      if (budget.candidates >= 3 || budget.exhausted) return false;
      budget.candidates++;
      return true;
    };
    const opts = { flight, pace, economy, boosterState: boosters, time: sceneTime(), budget };
    const dx = Math.max(spawnDistance(), S.speed * 1.8 + 180), railDue = state.wave >= RAIL3.firstWave && (state.wave - RAIL3.firstWave) % RAIL3.every === 0;
    let kind = "single", obstacles = [], rail = null, route = null;
    const airPool = AIR_TYPES9.filter((o) => eligible(o, biome)), pick = (pool) => pool[Math.min(pool.length - 1, Math.floor(random7() * pool.length))];
    if (railDue && !state.recoveryWaves) {
      rail = makeRail3(dx);
      kind = "rail";
      const combined = pace.progress >= 150 && !familiar && !state.recoveryWaves && !fast && state.airCount >= 2 && state.groundSinceAir >= 4 && S.t - state.lastAirAt >= ENCOUNTER.airCooldown && state.railCount >= 2 && state.railCount % 3 === 2 && S.t - state.lastRailAirAt >= ENCOUNTER.railAirCooldown;
      if (combined && candidate()) {
        const small = airPool.filter((o) => o.w <= 110 && o.h <= 60 && state.seen.includes(o.id)), model = pick(small);
        if (model) {
          obstacles = [{ ...model, x: dx - 150, approachSpeed: airSpeed[model.id], passed: false }];
          route = validateEncounter(obstacles, { ...opts, rail, policies: [[0.5, 0.15], [0.5, 0.2]] });
          if (route) {
            const bypass = validateEncounter(obstacles, { ...opts, rail, noInput: true });
            if (bypass) {
              kind = "rail-air";
              route.bypass = bypass;
            } else route = null;
          }
        }
      }
      if (!route && candidate()) {
        obstacles = [];
        route = validateEncounter([], { ...opts, rail });
      }
      if (!route) rail = null;
    }
    const reserveRailAir = pace.progress >= 150 && state.airCount >= 2 && state.railCount >= 2 && state.railCount % 3 === 2;
    const airDue = !reserveRailAir && pace.progress >= 90 && !familiar && !state.recoveryWaves && state.groundSinceAir >= 4 && S.t - state.lastAirAt >= ENCOUNTER.airCooldown;
    if (!route && airDue && candidate()) {
      const pool = state.airCount < 2 ? airPool.filter((o) => o.w <= 110 && o.h <= 60) : airPool, model = pick(pool);
      if (model) {
        kind = "air-pass";
        obstacles = [{ ...model, x: dx, approachSpeed: airSpeed[model.id], passed: false }];
        route = validateEncounter(obstacles, { ...opts, noInput: true });
      }
    }
    if (!route && !fast) {
      const accent2 = !simple && state.phase === "accent", recent = state.history.slice(-2), repeat = recent.length === 2 && recent[0] === recent[1] ? recent[0] : null;
      const choices = OBSTACLES9.filter((o) => !o.altitude && o.collision !== "none" && eligible(o, biome) && (biome !== "tesla-factory" || factoryIds.includes(o.id)) && (simple ? o.h <= 64 : true) && (o.h < 90 || state.sinceTall >= 2) && o.id !== repeat);
      for (let attempt = 0; attempt < 3 && !route && candidate(); attempt++) {
        const fallback = choices.filter((o) => o.h <= 45), type = attempt === 2 ? fallback.find((o) => o.id === (S.speed < 430 && biome === "spaceport" ? "v8" : "truck")) || pick(fallback) : pick(choices);
        if (!type) break;
        kind = attempt === 0 && type.h < 90 && state.seen.includes(type.id) && accent2 && S.speed <= 700 && state.last?.kind !== "spaced-pair" ? pick(["spaced-pair", "low-cluster"]) : "single";
        obstacles = makePattern9(kind, { speed: S.speed, type, dx, gapSeconds: pace.progress < 90 ? 0.65 : 0.45 });
        route = validateEncounter(obstacles, { ...opts, tallSingle: kind === "single" && type.h >= 90, minGroundGap: pace.progress < 90 ? 0.65 : 0.45 });
        if (!route) state.fallbacks++;
      }
    }
    if (!route) {
      state.budget = budget;
      state.phase = "rest";
      state.restUntil = S.t + 1.5;
      S.next = 1.5;
      return;
    }
    state.wave++;
    state.active = true;
    state.restUntil = null;
    if (rail) {
      state.railCount++;
      if (kind === "rail-air") {
        state.lastRailAirAt = S.t;
        state.airCount++;
        state.groundSinceAir = 0;
        state.lastAirAt = S.t;
      }
    }
    if (kind === "air-pass") {
      state.airCount++;
      state.groundSinceAir = 0;
      state.lastAirAt = S.t;
    } else if (kind !== "rail-air") state.groundSinceAir++;
    const tallSingle = kind === "single" && obstacles[0]?.h >= 90;
    if (tallSingle) state.sinceTall = 0;
    else if (["single", "rail", "air-pass"].includes(kind)) state.sinceTall++;
    const accent = ["spaced-pair", "low-cluster", "rail-air"].includes(kind);
    state.restSeconds = accent ? ENCOUNTER.accentRest : ENCOUNTER.rest;
    for (const o of obstacles) if (!state.seen.includes(o.id)) state.seen.push(o.id);
    state.history.push(obstacles.find((o) => !o.altitude)?.id || kind);
    state.history = state.history.slice(-4);
    if (state.recoveryWaves > 0) state.recoveryWaves--;
    if (accent || state.phase === "accent") {
      state.phase = "rest";
      state.flow = 0;
    } else if (state.phase === "rest" || state.phase === "introduce") {
      state.phase = "flow";
      state.flow = 1;
    } else if (++state.flow >= 3) state.phase = "accent";
    state.last = { kind, tallSingle, stage, biome, leg, route, startedAt: S.t, restSeconds: state.restSeconds };
    for (const o of obstacles) S.obs.push({ ...o, x: o.x + (relative ? 0 : S.anchor), uid: ++S.entityId, passed: false, nearPaid: false, latePaid: false });
    if (rail) (S.rails ??= []).push({ ...rail, uid: ++S.entityId });
    S.next = 0.18;
  }
  return { reset, spawn, update, recover, state };
}

// supabase/rulesets/roadster-v460/random.js
function createRandom9(seed) {
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

// supabase/rulesets/roadster-v460/run.js
var RULESET9 = "roadster-v4.6.0";
var RUN_STEP9 = 1 / 120;
var RUN_COMMANDS9 = Object.freeze(["primary-down", "primary-up", "primary-cancel", "thrust-on", "thrust-off", "cancel"]);
var MAX_RECORDED_TICKS9 = 120 * 60 * 60;
var MAX_RECORDED_EVENTS9 = 24e3;
function createRun9({ seed = 0, record = true, reducedMotion = false } = {}) {
  const S = { mode: "menu", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY9.startSpeed, next: 1.7, obs: [], rails: [], entityId: 0, anchor: 0 }, Q = createBoosters5(seed), G = createGrind3(), P = createFlight9(), E = createEconomy9(), pace = createPace9(), F = createFall9(), input = { charging: false, charge: 0, spin: false, thrust: false };
  let random7 = createRandom9(seed), events = [], log = [], lateId = null, lastLanding = null, recordable = true;
  const director = createDirector9({ S, flight: P, pace, economy: E, boosters: Q, random: () => random7.next(), relative: true, sceneTime: () => S.t, spawnDistance: () => Math.max(900, S.speed * 1.5 + 180) });
  function clear() {
    Object.assign(input, { charging: false, charge: 0, spin: false, thrust: false });
    P.thrusting = false;
  }
  function sync() {
    S.t = S.tick * RUN_STEP9;
    S.speed = pace.speed;
    S.score = Math.floor(S.distance / 20 + E.bonus);
  }
  function reset(nextSeed = seed) {
    seed = nextSeed;
    random7 = createRandom9(seed);
    Object.assign(Q, createBoosters5(seed));
    Object.assign(G, createGrind3());
    Object.assign(P, createFlight9());
    Object.assign(E, createEconomy9());
    Object.assign(pace, createPace9());
    Object.assign(F, createFall9());
    Object.assign(S, { mode: "playing", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY9.startSpeed, next: 1.7, obs: [], rails: [], entityId: 0, lastCharge: 0 });
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
      if (nearWindow9(o.x + (o.inset || 5) - 47, S.speed + (o.approachSpeed || 0))) {
        lateId = o.uid;
        break;
      }
    }
    const charge = input.charge;
    P.jumpFactor = activeBooster5(Q, "jump") ? 1.25 : 1;
    if (G.support) jumpFromRail3(G, P, charge);
    else {
      Q.spoiledFlight = false;
      launch9(P, charge);
    }
    S.lastCharge = charge;
    input.charging = false;
    input.charge = 0;
    input.spin = false;
    events.push({ type: "jump", charge });
    return true;
  }
  function command(action) {
    if (!RUN_COMMANDS9.includes(action)) throw Error("Unknown run command");
    if (S.mode !== "playing") return false;
    if (record && recordable) {
      if (log.length >= MAX_RECORDED_EVENTS9) recordable = false;
      else log.push([S.tick, RUN_COMMANDS9.indexOf(action)]);
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
    if (F.active) return hastenFall9(F);
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
    if (S.tick > MAX_RECORDED_TICKS9) recordable = false;
    sync();
    if (input.charging) input.charge = Math.min(1, input.charge + RUN_STEP9 / GAMEPLAY9.chargeSeconds);
    advanceBoosters5(Q, RUN_STEP9);
    E.scoreFactor = activeBooster5(Q, "score") ? 3 : 1;
    pace.boost = 0.35 * Q.speedBlend;
    advanceEconomy9(E, RUN_STEP9);
    advanceStreak9(E, RUN_STEP9);
    const physicsFall = () => fallPose9({ ...F, reduced: false }), wasFalling = F.active, before = { ...P, fallPose: F.active ? physicsFall() : null };
    let landed = null, fallStep = { impacts: 0, finished: false };
    if (wasFalling) {
      fallStep = advanceFall9(F, RUN_STEP9);
      if (fallStep.finished) {
        clear();
        S.next = Math.max(S.next, 0.8);
        events.push({ type: "recovered" });
      }
    } else landed = advanceFlight9(P, RUN_STEP9, { spin: input.spin, thrust: input.thrust });
    pace.falling = F.active;
    advancePace9(pace, E, P, RUN_STEP9);
    S.distance += pace.speed * RUN_STEP9;
    E.bonus += pace.speed * RUN_STEP9 / 20 * (E.scoreFactor - 1);
    sync();
    events.push(...advanceRail3(G, P, before, S.rails, S.speed * RUN_STEP9, RUN_STEP9, E, { spoiled: Q.spoiledFlight, blocked: wasFalling }));
    if (G.support) {
      landed = null;
      input.spin = false;
    }
    const after = wasFalling ? { ...P, fallPose: physicsFall() } : landed ? { ...P, angle: landed.angle } : P;
    for (const o of S.obs) {
      const old = o.x;
      o.x -= (S.speed + (o.approachSpeed || 0)) * RUN_STEP9;
      if (o.smashed) {
        o.smashAge += RUN_STEP9;
        continue;
      }
      if (sweptCollision9(before, after, o, old, o.x, S.t, RUN_STEP9)) {
        if (activeBooster5(Q, "shield")) {
          o.smashed = true;
          o.smashAge = 0;
          if (!o.passed) {
            o.passed = true;
            passObstacle9(E);
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
          G.pending = G.distance = G.turns = 0;
          E.multiplier = 10;
          E.meter = 0;
          E.decay = 0;
          E.streak = 0;
          E.streakLeft = 0;
          events.push({ type: "rescued", oldMultiplier });
          director.recover();
        } else {
          S.mode = "dead";
          G.pending = G.distance = G.turns = 0;
          clear();
          sync();
          events.push({ type: "death", obstacle: o });
          return { landed, impacts: fallStep.impacts };
        }
      }
      if (!o.passed && o.x + o.w < -50) {
        o.passed = true;
        passObstacle9(E);
        if (o.altitude) events.push({ type: "air-passed" });
      }
    }
    for (const orb of Q.pickups) {
      const old = orb.x;
      orb.x -= S.speed * RUN_STEP9;
      const inReach = Math.min(old, orb.x) <= 112 && Math.max(old, orb.x) >= -112 && Math.abs(P.y + 78 - orb.y) <= 122;
      if (!F.active && inReach && collectBooster5(Q, orb.id)) {
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
        if (nearWindow9(-47 - (o.x + o.w - (o.inset || 5)), S.speed)) {
          near++;
          o.nearPaid = true;
        }
      }
      if (!Q.spoiledFlight) landed = { ...landed, turns: landed.turns + G.turns };
      const grindPoints = landed.good && !Q.spoiledFlight ? G.pending : 0, grindDistance = landed.good && !Q.spoiledFlight ? G.distance : 0;
      const oldMultiplier = E.multiplier;
      lastLanding = settleLanding9(E, P, Q.spoiledFlight ? { ...landed, turns: 0, perfect: false } : landed, Q.spoiledFlight ? { late: 0, near: 0 } : { late, near });
      Q.spoiledFlight = false;
      E.bonus += grindPoints;
      lastLanding.points += grindPoints;
      Object.assign(lastLanding, { grindPoints, grindDistance });
      if (grindDistance > 0) {
        rewardAction9(E);
        S.next = Math.max(S.next, RAIL3.exitSeconds);
      }
      Object.assign(G, createGrind3());
      if (!landed.good) {
        stumble9(pace);
        beginFall9(F, landed, { reduced: reducedMotion, speed: pace.recovery.target });
        pace.falling = true;
        director.recover();
        P.angle = 0;
        P.omega = 0;
        P.vx = 0;
        P.grab = 0;
        clear();
        advancePace9(pace, E, P, 0);
      }
      events.push({ type: "landing", landed, result: lastLanding, late, near, oldMultiplier });
      lateId = null;
    }
    if (!P.airborne && !G.support && Math.abs(P.angle) > 1e-3) {
      P.angle *= Math.exp(-RUN_STEP9 * 18);
      P.omega = 0;
    }
    S.obs = S.obs.filter((o) => o.smashed ? o.smashAge < 1.2 : o.uid === lateId || o.x + o.w > (o.id === "joe" ? -480 : -400));
    S.rails = S.rails.filter((r) => r.x + r.w > -200 || r.uid === G.support);
    offerBooster5(Q, { time: S.t, speed: S.speed, clear: !P.airborne && !G.support && !S.rails.length && !F.active && !pace.recovery && S.obs.every((o) => o.passed) });
    director.update();
    S.next -= RUN_STEP9;
    if (S.next <= 0 && !Q.pickups.length) director.spawn();
    sync();
    return { landed, impacts: fallStep.impacts };
  }
  function snapshot() {
    return structuredClone({ seed, S, P, E, pace, F, Q, G, input, random: random7.state, director: director.state, lateId, lastLanding });
  }
  function restore(saved) {
    seed = saved.seed;
    for (const [a, b] of [[G, saved.G], [Q, saved.Q], [S, saved.S], [P, saved.P], [E, saved.E], [pace, saved.pace], [F, saved.F], [input, saved.input], [director.state, saved.director]]) Object.assign(a, structuredClone(b));
    random7 = createRandom9(seed);
    random7.restore(saved.random);
    lateId = saved.lateId;
    lastLanding = structuredClone(saved.lastLanding);
    events = [];
  }
  function replay() {
    return recordable ? { format: 1, ruleset: RULESET9, seed, ticks: S.tick, events: log.map((e) => [...e]) } : null;
  }
  return { S, P, E, pace, F, Q, G, input, director, reset, jump, command, step, sync, snapshot, restore, replay, drainEvents() {
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
function validateReplay9(value) {
  if (!value || value.format !== 1 || value.ruleset !== RULESET9 || !Number.isInteger(value.seed) || value.seed < 0 || value.seed > 4294967295 || !Number.isInteger(value.ticks) || value.ticks < 1 || value.ticks > MAX_RECORDED_TICKS9 || !Array.isArray(value.events) || value.events.length > MAX_RECORDED_EVENTS9) throw Error("Invalid or unsupported replay");
  let previous = -1;
  for (const event of value.events) {
    if (!Array.isArray(event) || event.length !== 2 || !Number.isInteger(event[0]) || event[0] < previous || event[0] < 0 || event[0] >= value.ticks || !Number.isInteger(event[1]) || event[1] < 0 || event[1] >= RUN_COMMANDS9.length) throw Error("Invalid replay input");
    previous = event[0];
  }
  return value;
}
function verifyReplay9(value) {
  const replay = validateReplay9(value), run = createRun9({ seed: replay.seed, record: false });
  run.reset();
  let event = 0;
  while (run.S.tick < replay.ticks && run.S.mode === "playing") {
    while (event < replay.events.length && replay.events[event][0] === run.S.tick) run.command(RUN_COMMANDS9[replay.events[event++][1]]);
    run.step();
    run.drainEvents();
  }
  if (run.S.mode !== "dead" || run.S.tick !== replay.ticks || event !== replay.events.length) throw Error("Replay does not end at its first collision");
  return { score: run.S.score, flips: run.E.flips, ticks: run.S.tick };
}

// supabase/rulesets/roadster-v461/run.js
var run_exports10 = {};
__export(run_exports10, {
  RULESET: () => RULESET10,
  RUN_COMMANDS: () => RUN_COMMANDS10,
  RUN_STEP: () => RUN_STEP10,
  createRun: () => createRun10,
  validateReplay: () => validateReplay10,
  verifyReplay: () => verifyReplay10
});

// supabase/rulesets/roadster-v461/gameplay-config.js
var GAMEPLAY10 = Object.freeze({
  version: "4.6.1",
  gravity: 1550,
  jumpSpeed: 560,
  chargedSpeed: 440,
  chargeSeconds: 0.4,
  spinSpeed: 7.2,
  spinAcceleration: 60,
  releaseSpeed: 1.8,
  releaseDeceleration: 24,
  settleMinTurn: Math.PI * 17 / 12,
  settleApproach: Math.PI * 7 / 12,
  settleFullAngle: Math.PI * 5 / 36,
  settleDamping: 16,
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

// supabase/rulesets/roadster-v461/enemy-sprite-data.js
var ENEMY_SPRITES8 = Object.freeze({ "sikorsky": { "file": "assets/encounters/v400/sikorsky.png", "w": 176, "h": 89.146, "pixels": [768, 389], "sourcePixels": [1536, 1024], "sourceCrop": [13, 146, 1520, 909], "alphaExtrema": [0, 255], "sha256": "5619dd383d0bbb6ed7115f767f21f1e86e720d2aeb9ce3f0f41a182f15da3520" }, "xi": { "file": "assets/encounters/v400/xi.png", "w": 72, "h": 109.281, "pixels": [506, 768], "sourcePixels": [1024, 1536], "sourceCrop": [51, 65, 978, 1471], "alphaExtrema": [0, 255], "sha256": "56f56642f4f29a2b3c6655a442be59d4df5f781327c20299fa9ff596f69c6ac0" }, "t800": { "file": "assets/encounters/v400/t800.png", "w": 57, "h": 109.44, "pixels": [400, 768], "sourcePixels": [1024, 1536], "sourceCrop": [183, 66, 925, 1489], "alphaExtrema": [0, 255], "sha256": "1661f9bf004a65db0c178ca6d7b17e42d9963299f627f450016e9443125495f8" }, "ufo": { "file": "assets/encounters/v400/ufo.png", "w": 104, "h": 47.26, "pixels": [768, 349], "sourcePixels": [1672, 940], "sourceCrop": [141, 130, 1535, 763], "alphaExtrema": [0, 255], "sha256": "926e3e760155afe3acbc9215b35465a78e3a49039762c7ff89f8bf1c1e8ec358" }, "primeDrone": { "file": "assets/encounters/v400/primeDrone.png", "w": 110, "h": 48.984, "pixels": [768, 342], "sourcePixels": [1821, 864], "sourceCrop": [10, 31, 1812, 833], "alphaExtrema": [0, 255], "sha256": "a46783dc00dd76be690c29c72f92fa834a02b2522aac366058cc2972822ab681" }, "twitterBird": { "file": "assets/encounters/v400/twitterBird.png", "w": 76, "h": 50.568, "pixels": [768, 511], "sourcePixels": [1536, 1024], "sourceCrop": [85, 50, 1460, 964], "alphaExtrema": [0, 255], "sha256": "46436e2c78ac2ac104426b8bc898f047cb8ee934a9b1a5dd08631a554f5ee94e" }, "homelessRow": { "file": "assets/encounters/v400/homelessRow.png", "w": 142, "h": 40.122, "pixels": [768, 217], "sourcePixels": [2073, 758], "sourceCrop": [79, 124, 2012, 670], "alphaExtrema": [0, 255], "sha256": "03ed702ddb2d5cd06d2c6174b8e88edce01a22adbae68570d268de367ea49806" }, "bydSeal": { "file": "assets/encounters/v400/bydSeal.png", "w": 138, "h": 44.562, "pixels": [768, 248], "sourcePixels": [2172, 724], "sourceCrop": [144, 74, 2061, 693], "alphaExtrema": [0, 255], "sha256": "840376084d808030f6900dbad884a825703c1dd7736fc147db457098759d8b69" }, "xiaomiSu7": { "file": "assets/encounters/v400/xiaomiSu7.png", "w": 138, "h": 42.047, "pixels": [768, 234], "sourcePixels": [1903, 826], "sourceCrop": [26, 190, 1877, 753], "alphaExtrema": [0, 255], "sha256": "3187a0f29bc97d4a73a1186cc1fbd60785ac6beea61dc55a10d7d70184e20bab" }, "batteryAgv": { "file": "assets/encounters/v400/batteryAgv.png", "w": 118, "h": 41.177, "pixels": [768, 268], "sourcePixels": [2012, 782], "sourceCrop": [131, 113, 1878, 722], "alphaExtrema": [0, 255], "sha256": "82d12e8efdb89038ea0351b7dc942754be9ab9f78aed29a88b2c4a12a8cc6d79" }, "qualitySkull": { "file": "assets/encounters/v400/qualitySkull.png", "w": 76, "h": 40.87, "pixels": [768, 413], "sourcePixels": [1536, 1024], "sourceCrop": [183, 152, 1413, 814], "alphaExtrema": [0, 255], "sha256": "955bb780f34142f0f9302839283022730bfd1c7688c48c46ac59cc18ad994d4b" }, "starlink": { "file": "assets/encounters/v400/starlink.png", "w": 112, "h": 69.271, "pixels": [768, 475], "sourcePixels": [1559, 1009], "sourceCrop": [76, 97, 1491, 973], "alphaExtrema": [0, 255], "sha256": "3988083ecbf0294a0c50b44df0bd8283347a56d5d9ffabe36ff6aa3a281d9e08" }, "regulatorDrone": { "file": "assets/encounters/v400/regulatorDrone.png", "w": 106, "h": 47.065, "pixels": [768, 341], "sourcePixels": [1536, 1024], "sourceCrop": [15, 176, 1521, 845], "alphaExtrema": [0, 255], "sha256": "99140365f63c6e6af46fafbfd90380459ae5e0a4e5709dfc371ebd1c3a5cf830" }, "reptileHead": { "file": "assets/encounters/v400/reptileHead.png", "w": 68, "h": 79.416, "pixels": [274, 320], "sourcePixels": [1173, 1341], "sourceCrop": [121, 97, 1077, 1212], "alphaExtrema": [0, 255], "sha256": "dc627f44d9efbaae3b93c44c5377ce25b518751b691071cf11a26f3670bcfa49" }, "moltenVat": { "file": "assets/encounters/v400/moltenVat.png", "w": 164, "h": 134.745, "pixels": [768, 631], "sourcePixels": [1351, 1164], "sourceCrop": [54, 71, 1298, 1093], "alphaExtrema": [0, 255], "sha256": "f7fe4d31e0588da095c2647e5548d3b8bebdd67aa9cbdcfe6e619963bd1198ca" } });

// supabase/rulesets/roadster-v461/content.js
function freeze10(value) {
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) freeze10(item);
    Object.freeze(value);
  }
  return value;
}
var BIOMES10 = freeze10(["spaceport", "tesla-factory"]);
var BIOME_CYCLE10 = freeze10(["spaceport", "tesla-factory"]);
var ANIMATIONS10 = freeze10(["taunt", "angry-look", "point-and-laugh", "trampoline-bounce", "money-guns", "podcast", "throw", "lightning", "reptile", "look"]);
var ASSETS10 = freeze10({
  ...Object.fromEntries(Object.entries(ENEMY_SPRITES8).map(([id2, s]) => ["encounter_" + id2, { file: s.file }])),
  encounter_moltenVat: { file: "assets/encounters/v411/moltenVat.png" },
  collage: { file: "collage-atlas.png" },
  extras: { file: "collage-extras.png" },
  cast: { file: "paper-cast.png" },
  photos: { file: "obstacle-photos.png" },
  joe: { file: "assets/characters/joe-rogan.png" },
  amber: { file: "assets/characters/amber-head-v247.png" },
  drone: { file: "assets/obstacles/phantom-v3.png" }
});
var none10 = { enabled: false };
var reaction10 = (animationId, trigger = "near", range = 300, space = "target") => ({ enabled: true, animationId, trigger, range, space });
function define10(base, options = {}) {
  return freeze10({
    ...base,
    definitionVersion: 1,
    category: options.category || "object",
    placement: base.altitude ? "air" : "ground",
    anchor: base.altitude ? "air-bottom-center" : "ground-center",
    biomes: options.biomes || "all",
    visual: { renderer: options.renderer || "prop", key: options.key || base.id, assets: options.assets || [], bob: options.bob || false },
    collision: options.collision || "box",
    reactions: { hero: options.hero || none10, obstacle: options.obstacle || none10 },
    collectible: true,
    provenance: "assets-provenance.json"
  });
}
function spriteDefinition8(id2, name2, options, altitude = 0) {
  const s = ENEMY_SPRITES8[
    /** @type {keyof typeof ENEMY_SPRITES} */
    id2
  ];
  return define10({ id: id2, name: name2, w: s.w, h: s.h, inset: id2 === "t800" ? 10 : 5, ...altitude ? { altitude } : {} }, { ...options, renderer: "sprite", assets: ["encounter_" + id2] });
}
var OBSTACLES10 = freeze10([
  define10({ id: "v8", name: "V8 \u2022 VERY LOUD", w: 108, h: 36 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define10({ id: "trump", name: "TARIFF MAN", w: 54, h: 94 }, { renderer: "character", assets: ["collage"], category: "person", bob: true, hero: reaction10("taunt"), obstacle: reaction10("angry-look") }),
  define10({ id: "protest", name: "COUCH CRITICS", w: 102, h: 94 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "group" }),
  define10({ id: "truck", name: "CYBERBRICK", w: 110, h: 41 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define10({ id: "doge", name: "MUCH WOW", w: 52, h: 64 }, { renderer: "cutout", assets: ["extras"], bob: true, category: "animal" }),
  define10({ id: "pump", name: "BIG OIL", w: 54, h: 78 }, {}),
  define10({ id: "zuck", name: "ZUCK", w: 62, h: 94, inset: 5 }, { renderer: "character", assets: ["cast"], category: "person", hero: reaction10("money-guns", "airborne-near"), obstacle: reaction10("money-guns", "airborne-near") }),
  define10({ id: "openai", name: "OPENAI", w: 70, h: 68, inset: 5 }, { category: "emblem" }),
  define10({ id: "claude", name: "CLAUDE", w: 84, h: 73, inset: 6 }, { category: "emblem" }),
  define10({ id: "gemini", name: "GEMINI", w: 58, h: 78, inset: 4 }, { category: "emblem" }),
  define10({ id: "rogozin", name: "ROGOZIN / TRAMPOLINE", w: 88, h: 130, inset: 4 }, { renderer: "character", assets: ["cast"], category: "person", biomes: ["spaceport"], collision: "trampoline", hero: reaction10("point-and-laugh", "airborne-near"), obstacle: reaction10("trampoline-bounce", "passage") }),
  define10({ id: "amber", name: "AMBER HEARD", w: 58, h: 94, inset: 9 }, { renderer: "character", assets: ["amber"], category: "person", obstacle: reaction10("throw", "passage") }),
  define10({ id: "joe", name: "JOE ROGAN", w: 76, h: 94, inset: 10 }, { renderer: "character", assets: ["joe"], category: "person", hero: reaction10("podcast", "passage", 650, "self"), obstacle: reaction10("podcast", "passage", 650, "self") }),
  define10({ id: "muscleCoupe", name: "AMERICAN MUSCLE", w: 138, h: 45, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define10({ id: "muscleCompact", name: "SMALL BLOCK / BIG EGO", w: 112, h: 38, inset: 5 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  define10({ id: "pickup", name: "BIG TRUCK ENERGY", w: 140, h: 57, inset: 6 }, { renderer: "photo", assets: ["photos"], category: "vehicle" }),
  ...[
    ["homelessRow", "SPARE CHANGE", "group", "all"],
    ["t800", "T-800 / AUTOMATION", "person", ["tesla-factory"]],
    ["bydSeal", "BYD SEAL", "vehicle", ["tesla-factory"]],
    ["xiaomiSu7", "XIAOMI SU7", "vehicle", ["tesla-factory"]],
    ["batteryAgv", "BATTERY SWAP", "vehicle", ["tesla-factory"]]
  ].map(([id2, name2, category, biomes]) => spriteDefinition8(String(id2), String(name2), { category: String(category), biomes: Array.isArray(biomes) ? biomes : "all" })),
  ...[
    ["ufo", "UNIDENTIFIED FLYING OPPORTUNITY", "all"],
    ["primeDrone", "PRIME PERSONAL SPACE", "all"],
    ["twitterBird", "THE FORMER BIRD", ["spaceport"]],
    ["starlink", "STARLINK / WRONG ORBIT", ["spaceport"]],
    ["regulatorDrone", "APPROVAL PENDING", "all"],
    ["sikorsky", "SIKORSKY / VS-300", ["spaceport"]],
    ["qualitySkull", "QUALITY CONTROL", ["tesla-factory"]]
  ].map(([id2, name2, biomes]) => spriteDefinition8(String(id2), String(name2), { category: "flying enemy", biomes: Array.isArray(biomes) ? biomes : "all", collision: "box", hero: reaction10(id2 === "ufo" ? "reptile" : "look", "near", 320) }, { ufo: 225, primeDrone: 215, twitterBird: 215, starlink: 250, regulatorDrone: 220, sikorsky: 245, qualitySkull: 210 }[String(id2)])),
  spriteDefinition8("xi", "COMRADE XI", { category: "person", biomes: ["tesla-factory"], collision: "box", hero: reaction10("lightning", "near", 380), obstacle: reaction10("lightning", "near", 380) })
]);
var PROP_TYPES10 = freeze10(OBSTACLES10.filter((o) => ["muscleCoupe", "muscleCompact", "pickup"].includes(o.id)));
var AIR_TYPES10 = freeze10(OBSTACLES10.filter((o) => o.placement === "air"));
var definitionsById10 = new Map(OBSTACLES10.map((o) => [o.id, o]));
var obstacleDefinition10 = (id2) => definitionsById10.get(id2);
function validateContent10(definitions = OBSTACLES10) {
  const errors = [], ids = /* @__PURE__ */ new Set();
  for (const o of definitions) {
    if (!o.id || ids.has(o.id)) errors.push(`duplicate or missing id: ${o.id}`);
    ids.add(o.id);
    if (!Number.isFinite(o.w) || !Number.isFinite(o.h) || o.w <= 0 || o.h <= 6) errors.push(`${o.id}: invalid size`);
    if (!["ground", "air"].includes(o.placement)) errors.push(`${o.id}: invalid placement`);
    if (o.placement === "air" && (!Number.isFinite(o.altitude) || !(Number(o.altitude) > 0))) errors.push(`${o.id}: invalid altitude`);
    if (o.placement === "ground" && o.altitude) errors.push(`${o.id}: ground altitude`);
    if (!["ground-center", "air-bottom-center"].includes(o.anchor)) errors.push(`${o.id}: invalid anchor`);
    if (o.biomes !== "all" && (!Array.isArray(o.biomes) || !o.biomes.length || o.biomes.some((b) => !BIOMES10.includes(b)))) errors.push(`${o.id}: unknown biome`);
    if (!o.visual || !["photo", "cutout", "character", "prop", "drone", "sprite"].includes(o.visual.renderer)) errors.push(`${o.id}: missing renderer`);
    for (const id2 of o.visual?.assets || []) if (!Object.hasOwn(ASSETS10, id2)) errors.push(`${o.id}: unknown asset ${id2}`);
    if (!["box", "trampoline", "none"].includes(o.collision)) errors.push(`${o.id}: missing collision profile`);
    if (o.inset !== void 0 && (!Number.isFinite(o.inset) || o.inset < 0 || o.inset * 2 >= o.w)) errors.push(`${o.id}: invalid inset`);
    for (
      const direction of
      /** @type {const} */
      ["hero", "obstacle"]
    ) {
      const r = o.reactions?.[direction];
      if (!r || typeof r.enabled !== "boolean") errors.push(`${o.id}: missing ${direction} reaction`);
      else if (r.enabled && (!ANIMATIONS10.includes(r.animationId) || !["near", "airborne-near", "passage"].includes(r.trigger) || !(r.range > 0) || !["target", "self"].includes(r.space))) errors.push(`${o.id}: missing animation ${r.animationId}`);
    }
  }
  return errors;
}
var contentErrors10 = validateContent10();
if (contentErrors10.length) throw new Error(`Invalid content: ${contentErrors10.join("; ")}`);

// supabase/rulesets/roadster-v461/physics.js
var STEP10 = 1 / 120;
function rogozinBounce10(time) {
  return 20 * Math.abs(Math.sin(time * 4.5));
}
function obstacleBoxes10(o, time = 0) {
  if ((o.collision || obstacleDefinition10(o.id)?.collision) === "trampoline") {
    return [
      { left: 6, right: o.w - 6, top: 16 },
      { left: o.w / 2 - 18, right: o.w / 2 + 18, top: 108 + rogozinBounce10(time) }
    ];
  }
  const inset = o.inset ?? 5;
  return [{ left: inset, right: o.w - inset, top: o.h - 6 }];
}

// supabase/rulesets/roadster-v461/fall.js
var clamp19 = (x) => Math.max(0, Math.min(1, x));
var ease10 = (x) => {
  x = clamp19(x);
  return x * x * (3 - 2 * x);
};
var mix10 = (a, b, t) => a + (b - a) * t;
var FALL_CONTACTS10 = Object.freeze([0.14, 0.36, 0.56]);
var FALL_CAR_CONTACTS10 = Object.freeze([0.16, 0.38]);
var FALL_CAR_HULL10 = Object.freeze([[-49, -7], [-8, -15], [8, -15], [48.5, 0], [47, 6], [27, 12], [-34, 12], [-46, 5]].map(Object.freeze));
function fallCarSupport10(angle) {
  return Math.max(...FALL_CAR_HULL10.map(([x, y]) => x * Math.sin(angle) + y * Math.cos(angle)));
}
var arc10 = (p, a, b, height) => {
  const t = clamp19((p - a) / (b - a));
  return t < 1e-12 || t > 1 - 1e-12 ? 0 : height * 4 * t * (1 - t);
};
var pulse10 = (p, hit) => ease10((p - hit + 0.035) / 0.035) * (1 - ease10((p - hit) / 0.055));
function track10(keys, p) {
  let i = 1;
  while (i < keys.length - 1 && p > keys[i][0]) i++;
  const [a, b] = [keys[i - 1], keys[i]];
  return mix10(a[1], b[1], ease10((p - a[0]) / (b[0] - a[0])));
}
function createFall10() {
  return { active: false, age: 0, duration: GAMEPLAY10.fallSeconds, rate: 1, taps: 0, angle: 0, reduced: false };
}
function beginFall10(f, result, { reduced = false, speed = GAMEPLAY10.startSpeed } = {}) {
  const angle = Math.atan2(Math.sin(result.angle), Math.cos(result.angle));
  const severity = clamp19((speed - GAMEPLAY10.startSpeed) / (GAMEPLAY10.maxSpeed - GAMEPLAY10.startSpeed));
  Object.assign(f, { active: true, age: 0, duration: GAMEPLAY10.fallSeconds + GAMEPLAY10.fallSpeedSeconds * severity, rate: 1, taps: 0, angle, reduced });
}
function hastenFall10(f) {
  if (!f.active) return false;
  f.taps++;
  f.rate = Math.min(GAMEPLAY10.fallMaxRate, f.rate + GAMEPLAY10.fallTapRate);
  return true;
}
function advanceFall10(f, dt) {
  if (!f.active) return { impacts: 0, finished: false };
  const previous = f.age;
  f.age = Math.min(f.duration, f.age + dt * f.rate);
  const impacts = FALL_CONTACTS10.filter((t) => previous < f.duration * t && f.age >= f.duration * t).length;
  f.active = f.age < f.duration;
  return { impacts, finished: !f.active };
}
function fallPose10(f) {
  const p = clamp19(f.age / f.duration), sit = ease10(p / 0.14), stand = ease10((p - 0.68) / 0.16), gather = ease10((p - 0.7) / 0.22), settle = clamp19((p - 0.97) / 0.03);
  const impact = Math.max(...FALL_CONTACTS10.map((hit) => pulse10(p, hit))), seat = sit * (1 - stand);
  const crouch = (0.72 + 0.18 * impact) * seat + (settle === 1 ? 0 : 0.1 * Math.sin(settle * Math.PI));
  const lift = p < 0.36 ? arc10(p, 0.14, 0.36, 32) : p < 0.56 ? arc10(p, 0.36, 0.56, 28) : arc10(p, 0.56, 0.97, 112);
  const angle = mix10(f.angle, -0.64, sit) * (1 - stand);
  const seatAnchor = -11 * Math.sin(angle) + (22.5 + 27 * crouch) * Math.cos(angle) + 9;
  const rider = { x: 34 * sit * (1 - gather), y: mix10(95, seatAnchor, seat) + lift, angle, seat, crouch, lift };
  const entry = (y) => ({ x: Math.sin(f.angle) * (y - 65), y: 65 + Math.cos(f.angle) * (y - 65) });
  const e = entry(95), c = entry(12);
  rider.x += e.x * (1 - sit);
  rider.y += (e.y - 95) * (1 - sit);
  const carAngle = track10([[0, f.angle], [0.16, 0.95], [0.29, Math.PI], [0.38, 2 * Math.PI - 1.02], [0.54, 2 * Math.PI], [1, 2 * Math.PI]], p);
  const carHop = p < 0.16 ? arc10(p, 0, 0.16, 20) : p < 0.38 ? arc10(p, 0.16, 0.38, 22) : arc10(p, 0.38, 0.54, 8);
  const car = { x: gather === 1 ? 0 : mix10(c.x, -88, ease10(p / 0.16)) * (1 - gather), y: p >= 0.54 ? 12 : mix10(c.y, fallCarSupport10(carAngle) + carHop, ease10(p / 0.06)), angle: carAngle, phase: 0 };
  let shake = 0;
  for (const hit of FALL_CONTACTS10) if (p >= hit) shake = Math.max(shake, Math.exp(-(p - hit) * 40));
  const pose = { car, rider, crouch, impact, flail: sit * (1 - ease10((p - 0.82) / 0.12)), push: 0, shake: shake * 2.4, progress: p };
  if (f.reduced) {
    pose.car = { x: 0, y: 12, angle: 0, phase: 0 };
    pose.rider = { x: 0, y: 95, angle: 0, seat: 0, crouch };
    pose.shake = 0;
    pose.push = 0;
    pose.flail = 0;
  }
  return pose;
}
function fallPolygons10(pose) {
  const seat = pose.rider.seat || 0, crouch = pose.rider.crouch || 0;
  const rider = [[-23, -70 + 4 * seat], [23 + 48 * seat, -70 + 4 * seat], [23 + 48 * seat, 68 - 27 * crouch], [-23, 68 - 27 * crouch]];
  return [[pose.car, FALL_CAR_HULL10.map(([x, y]) => [x, -y])], [pose.rider, rider]].map(([body2, vertices]) => {
    const c = Math.cos(body2.angle), s = Math.sin(body2.angle);
    return vertices.map(([x, y]) => ({ x: body2.x + c * x + s * y, y: body2.y - s * x + c * y }));
  });
}
function interpolateFall10(a, b, t) {
  const pose = {};
  for (const part of ["car", "rider"]) {
    pose[part] = {};
    for (const k of ["x", "y", "angle", "seat", "crouch", "phase"]) pose[part][k] = mix10(a[part][k] || 0, b[part][k] || 0, t);
  }
  return pose;
}

// supabase/rulesets/roadster-v461/gameplay.js
var TAU10 = Math.PI * 2;
var clamp20 = (x, a, b) => Math.max(a, Math.min(b, x));
var approach10 = (x, target, amount) => x < target ? Math.min(target, x + amount) : Math.max(target, x - amount);
function uprightError10(angle, direction = -1) {
  let e = ((angle + Math.PI) % TAU10 + TAU10) % TAU10 - Math.PI;
  if (Math.abs(Math.abs(e) - Math.PI) < 1e-9) e = -Math.sign(direction || -1) * Math.PI;
  return e;
}
function resetAirRotation(p) {
  p.spinHeld = false;
  p.settleTarget = 0;
}
function createFlight10(fuel = GAMEPLAY10.initialFuel) {
  return { spinHeld: false, settleTarget: 0, y: 0, vy: 0, vx: 0, angle: 0, omega: 0, airborne: false, time: 0, fuel, thrusting: false, latched: false, attach: 0, maxTurn: 0, turns: 0, lastDirection: -1, trickStarted: false, grab: 0, launchVelocity: 0, jumpFactor: 1 };
}
function launch10(p, charge = 0) {
  if (p.airborne) return false;
  resetAirRotation(p);
  Object.assign(p, { y: 1e-3, vy: (GAMEPLAY10.jumpSpeed + GAMEPLAY10.chargedSpeed * clamp20(charge, 0, 1)) * (p.jumpFactor || 1), angle: 0, omega: 0, airborne: true, time: 0, latched: false, attach: 0, maxTurn: 0, turns: 0, trickStarted: false, grab: 0, launchVelocity: (GAMEPLAY10.jumpSpeed + GAMEPLAY10.chargedSpeed * clamp20(charge, 0, 1)) * (p.jumpFactor || 1) });
  return true;
}
function advanceFlight10(p, dt, { spin = false, thrust = false } = {}) {
  p.thrusting = false;
  const gripTarget = p.airborne && spin ? 1 : 0;
  p.grab = approach10(p.grab, gripTarget, dt / (gripTarget ? 0.12 : 0.18));
  if (!p.airborne) {
    resetAirRotation(p);
    p.vx *= Math.exp(-GAMEPLAY10.horizontalDrag * dt);
    return null;
  }
  p.time += dt;
  if (spin) {
    p.settleTarget = 0;
    p.trickStarted = true;
    p.lastDirection = -1;
    p.omega = approach10(p.omega, -GAMEPLAY10.spinSpeed, GAMEPLAY10.spinAcceleration * dt);
  } else {
    if (p.spinHeld) {
      const progress = -p.angle, turn = Math.max(1, Math.round(progress / TAU10));
      const target2 = turn * TAU10, stopping = progress + p.omega * p.omega / (2 * GAMEPLAY10.releaseDeceleration);
      p.settleTarget = p.omega < 0 && progress >= (turn - 1) * TAU10 + GAMEPLAY10.settleMinTurn && Math.abs(target2 - progress) <= GAMEPLAY10.settleApproach && Math.abs(stopping - target2) <= GAMEPLAY10.landingAngle ? target2 : 0;
    }
    const target = Math.sign(p.omega) * Math.min(Math.abs(p.omega), GAMEPLAY10.releaseSpeed);
    p.omega = approach10(p.omega, target, GAMEPLAY10.releaseDeceleration * dt);
    if (p.settleTarget) {
      const past = -p.angle - p.settleTarget;
      if (p.omega > 0 || past > GAMEPLAY10.landingAngle || past < -GAMEPLAY10.settleApproach) p.settleTarget = 0;
      else if (Math.abs(p.omega) <= GAMEPLAY10.releaseSpeed + 1e-9) {
        const u = clamp20((past - GAMEPLAY10.perfectAngle) / (GAMEPLAY10.settleFullAngle - GAMEPLAY10.perfectAngle), 0, 1);
        p.omega *= Math.exp(-GAMEPLAY10.settleDamping * u * u * (3 - 2 * u) * dt);
      }
    }
  }
  p.spinHeld = spin;
  p.angle += p.omega * dt;
  p.maxTurn = Math.max(p.maxTurn, -p.angle);
  p.turns = Math.floor((p.maxTurn + 1e-7) / TAU10);
  const burn = thrust ? Math.min(dt, p.fuel / GAMEPLAY10.fuelPerSecond) : 0;
  if (burn > 0) {
    p.fuel = Math.max(0, p.fuel - burn * GAMEPLAY10.fuelPerSecond);
    p.thrusting = true;
    p.latched = true;
    p.vx += Math.sin(p.angle) * GAMEPLAY10.thrustAcceleration * burn;
    p.vy += Math.cos(p.angle) * GAMEPLAY10.thrustAcceleration * burn;
  }
  if (p.latched) p.attach = Math.min(1, p.attach + dt / GAMEPLAY10.attachSeconds);
  p.vx = clamp20(p.vx * Math.exp(-GAMEPLAY10.horizontalDrag * dt), -GAMEPLAY10.maxHorizontal, GAMEPLAY10.maxHorizontal);
  p.y += p.vy * dt - 0.5 * GAMEPLAY10.gravity * dt * dt;
  p.vy -= GAMEPLAY10.gravity * dt;
  if (p.y > 0) return null;
  const good = Math.abs(uprightError10(p.angle)) <= GAMEPLAY10.landingAngle + 1e-9 && Math.abs(p.omega) <= GAMEPLAY10.landingOmega;
  const turns = good ? Math.max(p.turns, Math.round(-p.angle / TAU10)) : p.turns;
  const perfect = good && Math.abs(uprightError10(p.angle)) <= GAMEPLAY10.perfectAngle + 1e-9;
  const result = { good, perfect, turns, impact: Math.abs(p.vy), angle: p.angle, omega: p.omega };
  p.turns = turns;
  p.y = 0;
  p.vy = 0;
  p.airborne = false;
  p.thrusting = false;
  resetAirRotation(p);
  if (result.good) {
    p.angle = 0;
    p.omega = 0;
  }
  return result;
}
function createEconomy10() {
  return { scoreFactor: 1, bonus: 0, multiplier: 10, meter: 0, decay: 0, streak: 0, streakLeft: 0, flips: 0 };
}
function comboSeconds10(e) {
  return GAMEPLAY10.comboDuration - GAMEPLAY10.comboFalloff * (e.multiplier / 10 - 1);
}
function rewardAction10(e, count = 1) {
  e.multiplier = Math.min(GAMEPLAY10.maxMultiplier, e.multiplier + count * GAMEPLAY10.multiplierStep);
  e.meter = 1;
  e.decay = 0;
}
function advanceEconomy10(e, dt) {
  if (e.meter > 0) {
    const used = Math.min(dt, e.meter * comboSeconds10(e));
    e.meter = Math.max(0, e.meter - used / comboSeconds10(e));
    dt -= used;
  }
  if (e.meter === 0 && e.multiplier > 10) {
    e.decay += dt;
    while (e.decay + 1e-9 >= GAMEPLAY10.comboDecaySeconds && e.multiplier > 10) {
      e.multiplier--;
      e.decay -= GAMEPLAY10.comboDecaySeconds;
    }
  }
}
function advanceStreak10(e, dt) {
  const used = Math.min(dt, e.streakLeft);
  e.streakLeft -= used;
  e.streak = Math.max(0, e.streak - (dt - used) * GAMEPLAY10.streakDecay);
}
function passObstacle10(e) {
  const points = GAMEPLAY10.obstaclePoints * e.multiplier / 10 * (e.scoreFactor || 1);
  e.bonus += points;
  return points;
}
function settleLanding10(e, p, result, { late = 0, near = 0 } = {}) {
  if (!result.good) {
    e.multiplier = 10;
    e.meter = 0;
    e.decay = 0;
    e.streak = 0;
    e.streakLeft = 0;
    return { points: 0, turns: 0, late: 0, near: 0, perfect: false, good: false };
  }
  const n = result.turns, perfect = !!result.perfect, points = (GAMEPLAY10.flipFactor * n * (n + 1) + GAMEPLAY10.nearPoints * (late + near) + GAMEPLAY10.perfectPoints * Number(perfect)) * e.multiplier / 10 * (e.scoreFactor || 1);
  e.bonus += points;
  e.flips += n;
  p.fuel = Math.min(GAMEPLAY10.tank, p.fuel + GAMEPLAY10.fuelPerFlip * n);
  if (n + late + near + Number(perfect)) rewardAction10(e, n + late + near + Number(perfect));
  if (n || near) {
    e.streak = Math.min(GAMEPLAY10.maxStreak, e.streak + GAMEPLAY10.streakStep);
    e.streakLeft = GAMEPLAY10.streakHold;
  }
  return { points, turns: n, late, near, perfect, good: true };
}
function createPace10() {
  return { boost: 0, progress: 0, base: GAMEPLAY10.startSpeed, speed: GAMEPLAY10.startSpeed, recovery: null, stumble: 0, falling: false };
}
function stumble10(pace) {
  const target = pace.recovery?.target ?? pace.base, r = clamp20((target - GAMEPLAY10.startSpeed) / (GAMEPLAY10.maxSpeed - GAMEPLAY10.startSpeed), 0, 1);
  pace.recovery = { target, age: 0, duration: GAMEPLAY10.recoveryMin + GAMEPLAY10.recoveryExtra * r ** 1.5 };
  pace.stumble = GAMEPLAY10.stumbleSeconds;
  pace.base = target * GAMEPLAY10.recoveryRatio;
}
function recoverySpeed10(r, t) {
  const T = r.duration, d = r.target * (1 - GAMEPLAY10.recoveryRatio), v0 = r.target * GAMEPLAY10.recoveryRatio, h = 0.15, a = T - h;
  if (t <= a) return v0 + d * (t / T) ** 2;
  const u = clamp20((t - a) / h, 0, 1), start = v0 + d * (a / T) ** 2, slope = 2 * d * a / T ** 2, endSlope = r.target >= GAMEPLAY10.maxSpeed ? 0 : (GAMEPLAY10.maxSpeed - GAMEPLAY10.startSpeed) / GAMEPLAY10.rampSeconds;
  return (2 * u ** 3 - 3 * u * u + 1) * start + (u ** 3 - 2 * u * u + u) * h * slope + (-2 * u ** 3 + 3 * u * u) * r.target + (u ** 3 - u * u) * h * endSlope;
}
function advancePace10(pace, e, p, dt) {
  if (pace.recovery) {
    pace.stumble = Math.max(0, pace.stumble - dt);
    const r = pace.recovery;
    r.age = Math.min(r.duration, r.age + dt);
    pace.base = recoverySpeed10(r, r.age);
    if (r.age >= r.duration) {
      pace.base = r.target;
      pace.recovery = null;
    }
  } else if (!pace.falling) {
    pace.progress += dt;
    pace.base = GAMEPLAY10.startSpeed + (GAMEPLAY10.maxSpeed - GAMEPLAY10.startSpeed) * Math.min(1, pace.progress / GAMEPLAY10.rampSeconds);
  }
  pace.speed = Math.max(60, pace.base * (1 + e.streak) * (1 + (pace.boost || 0)) + p.vx);
  return pace.speed;
}
function playerPolygons10(p) {
  if (p.fallPose) return fallPolygons10(p.fallPose);
  const c = Math.cos(p.angle), s = Math.sin(p.angle);
  return [[-47, 0, 47, 25], [-23, 25, 23, 163 - 32 * (p.grab || 0)]].map(([l, b, r, t]) => [[l, b], [r, b], [r, t], [l, t]].map(([x, y]) => ({ x: c * x + s * (y - 65), y: p.y + 65 - s * x + c * (y - 65) })));
}
function overlaps10(poly, rect) {
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
function collisionAt10(p, o, dx, time = 0) {
  if (o.collision === "none") return false;
  if (dx > 180 || dx + o.w < -180) return false;
  const polygons = playerPolygons10(p);
  return obstacleBoxes10(o, time).some((b) => {
    const bottom = o.altitude || 0, top = bottom + b.top;
    const rect = [{ x: dx + b.left, y: bottom }, { x: dx + b.right, y: bottom }, { x: dx + b.right, y: top }, { x: dx + b.left, y: top }];
    return polygons.some((poly) => overlaps10(poly, rect));
  });
}
function sweptCollision10(before, after, o, dxBefore, dxAfter, time, dt) {
  if (Math.min(dxBefore, dxAfter) > 180 || Math.max(dxBefore, dxAfter) + o.w < -180) return false;
  const fallTravel = before.fallPose && after.fallPose ? Math.max(...["rider", "car"].map((part) => Math.abs(after.fallPose[part].angle - before.fallPose[part].angle) * (part === "car" ? 55 : 170) + Math.abs(after.fallPose[part].y - before.fallPose[part].y) + Math.abs(after.fallPose[part].x - before.fallPose[part].x))) : 0;
  const n = Math.max(1, Math.ceil((Math.abs(dxAfter - dxBefore) + Math.abs(after.y - before.y) + Math.abs(after.angle - before.angle) * 170 + fallTravel) / 4));
  for (let i = 0; i <= n; i++) {
    const f = i / n, p = { y: before.y + (after.y - before.y) * f, angle: before.angle + (after.angle - before.angle) * f, grab: (before.grab || 0) + ((after.grab || 0) - (before.grab || 0)) * f };
    if (before.fallPose && after.fallPose) p.fallPose = interpolateFall10(before.fallPose, after.fallPose, f);
    if (collisionAt10(p, o, dxBefore + (dxAfter - dxBefore) * f, time - dt + dt * f)) return true;
  }
  return false;
}
function nearWindow10(distance, speed) {
  return distance >= 0 && distance <= Math.max(0, speed) * GAMEPLAY10.nearSeconds + 1e-8;
}

// supabase/rulesets/roadster-v461/boosters.js
var BOOSTERS6 = Object.freeze({
  shield: Object.freeze({ name: "INVINCIBLE", seconds: 8, color: "#7ce5f3" }),
  speed: Object.freeze({ name: "OVERDRIVE", seconds: 8, color: "#ffad62" }),
  jump: Object.freeze({ name: "HIGH JUMP", seconds: 12, color: "#d9ff62" }),
  life: Object.freeze({ name: "EXTRA LIFE", seconds: 0, color: "#ff6a78" }),
  score: Object.freeze({ name: "SCORE \xD73", seconds: 10, color: "#ffc86d" })
});
function createBoosters6(seed = 0) {
  return { active: {}, hearts: 0, grace: 0, ghostIds: [], speedBlend: 0, pickups: [], nextAt: 8, serial: 0, bag: [], bagCycle: 0, random: (seed ^ 2772213271) >>> 0, spoiledFlight: false };
}
var activeBooster6 = (q, id2) => (q?.active[id2] || 0) > 0;
function canCollectBooster5(q, id2) {
  return !!BOOSTERS6[id2] && (id2 === "life" ? q.hearts < 2 : activeBooster6(q, id2) || Object.keys(q.active).length < 3);
}
function collectBooster6(q, id2) {
  const def = BOOSTERS6[id2];
  if (!canCollectBooster5(q, id2)) return false;
  if (id2 === "life") {
    if (q.hearts >= 2) return false;
    q.hearts++;
    return true;
  }
  if (!activeBooster6(q, id2) && Object.keys(q.active).length >= 3) return false;
  q.active[id2] = def.seconds;
  return true;
}
function advanceBoosters6(q, dt) {
  for (const id2 of Object.keys(q.active)) {
    q.active[id2] = Math.max(0, q.active[id2] - dt);
    if (q.active[id2] === 0) delete q.active[id2];
  }
  q.grace = Math.max(0, q.grace - dt);
  const target = activeBooster6(q, "speed") ? 1 : 0, delta = dt / (target ? 0.6 : 0.8);
  q.speedBlend = target ? Math.min(1, q.speedBlend + delta) : Math.max(0, q.speedBlend - delta);
}
function random6(q) {
  q.random = Math.imul(q.random, 1664525) + 1013904223 >>> 0;
  return q.random / 4294967296;
}
function offerBooster6(q, { time, speed, clear }) {
  if (!clear || q.pickups.length || time < q.nextAt) return null;
  if (!q.bag.length) {
    q.bagCycle++;
    q.bag = Object.keys(BOOSTERS6).filter((id3) => id3 !== "life" || q.bagCycle % 3 === 0);
    for (let i = q.bag.length - 1; i > 0; i--) {
      const j = Math.floor(random6(q) * (i + 1));
      [q.bag[i], q.bag[j]] = [q.bag[j], q.bag[i]];
    }
  }
  const eligible3 = (id3) => id3 === "life" ? q.hearts < 2 : activeBooster6(q, id3) || Object.keys(q.active).length < 3;
  let index = q.bag.findIndex(eligible3);
  if (index < 0) {
    q.nextAt = time + 2;
    return null;
  }
  const id2 = q.bag.splice(index, 1)[0], pickup = { id: id2, uid: ++q.serial, x: Math.max(900, speed * 1.9 + 180), y: q.serial === 1 || random6(q) < 0.55 ? 104 : 240 };
  q.pickups.push(pickup);
  if (q.serial > 1 && random6(q) < 0.4) {
    const second = q.bag.findIndex((other) => other !== id2 && eligible3(other));
    if (second >= 0) {
      const next = q.bag.splice(second, 1)[0];
      q.pickups.push({ id: next, uid: ++q.serial, x: pickup.x + 240, y: pickup.y });
    }
  }
  q.nextAt = time + 14 + random6(q) * 6;
  return pickup;
}

// supabase/rulesets/roadster-v461/rails.js
var RAIL4 = Object.freeze({ height: 190, length: 720, belly: 8, pointsPerUnit: 0.1, firstWave: 3, every: 7, exitSeconds: 1.25 });
var makeRail4 = (x) => ({ x, w: RAIL4.length, h: RAIL4.height, paid: [], passed: false });
var createGrind4 = () => ({ support: null, age: 0, exit: null, exitAge: 1, pending: 0, distance: 0, turns: 0 });
var railContactHeight4 = (p) => p.y + 65 + (RAIL4.belly - 65) * Math.cos(p.angle);
function leaveRail4(g, p) {
  resetAirRotation(p);
  g.support = null;
  g.age = 0;
  g.exit = "end";
  g.exitAge = 0;
  p.airborne = true;
  p.angle = uprightError10(p.angle);
  p.omega = 0;
  p.maxTurn = Math.max(0, -p.angle);
  p.turns = 0;
  p.time = 0;
  p.launchVelocity = 0;
  p.trickStarted = true;
}
function jumpFromRail4(g, p, charge) {
  const y = p.y, angle = uprightError10(p.angle);
  leaveRail4(g, p);
  p.airborne = false;
  launch10(p, charge);
  p.y += y;
  p.angle = angle;
  p.trickStarted = true;
  g.exit = "jump";
}
function newDistance4(rail, a, b) {
  a = Math.max(0, a);
  b = Math.min(rail.w, b);
  if (b <= a) return 0;
  let fresh = b - a;
  for (const [l, r] of rail.paid) fresh -= Math.max(0, Math.min(b, r) - Math.max(a, l));
  const ranges = [...rail.paid, [a, b]].sort((x, y) => x[0] - y[0]), merged = [];
  for (const range of ranges) {
    const last = merged.at(-1);
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([...range]);
  }
  rail.paid = merged;
  return Math.max(0, fresh);
}
function advanceRail4(g, p, before, rails, travel, dt, e, { spoiled = false, blocked = false } = {}) {
  g.exitAge = Math.min(1, g.exitAge + dt);
  const events = [], oldXs = rails.map((r) => r.x);
  for (const r of rails) {
    r.x -= travel;
    r.passed = r.x + r.w < 0;
  }
  let fraction = 0, rail = rails.find((r) => r.uid === g.support);
  if (g.support && !rail) {
    leaveRail4(g, p);
    events.push({ type: "rail-exit", reason: "end" });
    return events;
  }
  if (!rail && !blocked && before.airborne) {
    const old = railContactHeight4(before), now = railContactHeight4(p);
    const good = p.vy <= 0 && Math.abs(uprightError10(p.angle)) <= GAMEPLAY10.landingAngle + 1e-9 && Math.abs(p.omega) <= GAMEPLAY10.landingOmega;
    if (good && old >= RAIL4.height && now <= RAIL4.height && old > now) {
      fraction = (old - RAIL4.height) / (old - now);
      rail = rails.find((r, i) => {
        const x = oldXs[i] - travel * fraction;
        return x <= 0 && x + r.w >= 0;
      });
      if (rail) {
        resetAirRotation(p);
        g.support = rail.uid;
        g.age = 0;
        g.turns += Math.max(p.turns, Math.round(-p.angle / (Math.PI * 2)));
        p.turns = 0;
        p.airborne = false;
        p.omega = 0;
        p.vy = 0;
        p.thrusting = false;
        p.grab = 0;
        events.push({ type: "rail-catch", uid: rail.uid, impact: Math.abs(before.vy) });
      }
    }
  }
  if (rail) {
    const i = rails.indexOf(rail), start = -oldXs[i] + travel * fraction, end = -rail.x;
    const distance = newDistance4(rail, start, end);
    if (!spoiled) {
      g.distance += distance;
      g.pending += distance * RAIL4.pointsPerUnit * e.multiplier / 10 * (e.scoreFactor || 1);
    }
    g.age += dt * (1 - fraction);
    p.y = rail.h - 65 - (RAIL4.belly - 65) * Math.cos(p.angle);
    p.vy = 0;
    p.omega = 0;
    p.thrusting = false;
    if (distance > 0) events.push({ type: "rail-travel", uid: rail.uid, distance, points: spoiled ? 0 : distance * RAIL4.pointsPerUnit * e.multiplier / 10 * (e.scoreFactor || 1) });
    if (rail.x + rail.w <= 0) {
      leaveRail4(g, p);
      events.push({ type: "rail-exit", reason: "end" });
    }
  }
  return events;
}

// supabase/rulesets/roadster-v461/biomes.js
var BIOME_SCORE_STEP8 = 7e3;
var SCENERY_CYCLE8 = BIOME_CYCLE10;
function biomeAt8(score = 0) {
  const points = Number.isFinite(score) ? Math.max(0, score) : 0;
  const leg = Math.floor(points / BIOME_SCORE_STEP8), nextAt = (leg + 1) * BIOME_SCORE_STEP8;
  return { id: SCENERY_CYCLE8[leg % SCENERY_CYCLE8.length], leg, nextAt, nextIn: nextAt - points };
}

// supabase/rulesets/roadster-v461/routes.js
var STAGES10 = GAMEPLAY10.stages;
function stageAt10(progress) {
  return STAGES10.filter((t) => progress >= t).length - 1;
}
function makePattern10(kind, { speed = 360, type = { id: "truck", w: 110, h: 41 }, dx = 900, gapSeconds = 0.65 } = {}) {
  const item = (offset) => ({ ...type, x: dx + offset, passed: false });
  if (["pair", "spaced-pair", "mixed"].includes(kind)) return [item(0), item(speed * (0.9 + gapSeconds) + type.w)];
  if (["precision", "thrust", "low-cluster"].includes(kind)) return [item(0), item(type.w + 35)];
  return [item(0)];
}

// supabase/rulesets/roadster-v461/speed-feedback.js
var clamp012 = (value) => Math.max(0, Math.min(1, value));
var viewStrength2 = (speed) => Math.max(0, Math.min(1.3, (speed - GAMEPLAY10.startSpeed) / (GAMEPLAY10.maxSpeed - GAMEPLAY10.startSpeed)));
function baseViewScale2(width, height) {
  const x = width * (width < 600 ? 0.24 : 0.29);
  return Math.min(1.25, Math.max(0.68, width / 650), height / 430, (width - x - 24) / 550);
}
function speedView2(width, height, speed, strength = viewStrength2(speed)) {
  const baseScale = baseViewScale2(width, height), x = width * ((width < 600 ? 0.24 : 0.29) - 0.08 * strength);
  return {
    scale: baseScale / (1 + 0.44 * strength),
    x,
    baseScale,
    strength,
    energy: clamp012((speed - GAMEPLAY10.startSpeed) / (GAMEPLAY10.maxSpeed * 1.25 - GAMEPLAY10.startSpeed)),
    sceneryScale: Math.max(0.72, Math.min(1.15, baseScale)) / (1 + 0.18 * strength)
  };
}

// supabase/rulesets/roadster-v461/encounter-routes.js
var ENCOUNTER2 = Object.freeze({ tickBudget: 18e3, policyBudget: 40, window: 0.18, sample: 0.03, rest: 1.5, accentRest: 1.8, airCooldown: 28, railAirCooldown: 30, tallPreparation: 0.74, tallErrorPreparation: 0.64 });
var encounterBudget2 = () => ({ ticks: 0, policies: 0, candidates: 0, exhausted: false });
function preparationSeconds2(type, pace, { charge = 0, lead = 0.2, speed = pace.speed } = {}) {
  const strength = Math.max(0, Math.min(1.3, (pace.base - GAMEPLAY10.startSpeed) / 300) - 0.02);
  const width = (550 * 1.25 + 24) / 0.71, view = speedView2(width, 900, speed, strength);
  const silhouette = (width - view.x) / view.scale - type.w - 47;
  return silhouette / Math.max(60, speed + (type.approachSpeed || 0)) - charge * GAMEPLAY10.chargeSeconds - lead;
}
function simulateEncounter2(obstacles, { flight = createFlight10(), pace = createPace10(), economy = createEconomy10(), boosterState = null, time = 0, rail = null, charge = 0.4, lead = 0.2, secondLead = lead, noInput = false, requireCatch = !!rail, budget = encounterBudget2(), minGroundGap = 0, prefix = null, stopBeforeHold = null } = {}) {
  if (flight.airborne || pace.recovery || pace.falling || pace.stumble > 0 || budget.exhausted) return null;
  if (budget.policies >= ENCOUNTER2.policyBudget) {
    budget.exhausted = true;
    return null;
  }
  budget.policies++;
  const p = { ...prefix?.p || flight }, r = structuredClone(prefix?.r || pace), e = { ...prefix?.e || economy }, q = prefix ? structuredClone(prefix.q) : boosterState ? structuredClone(boosterState) : null, g = prefix ? structuredClone(prefix.g) : createGrind4(), rails = prefix ? structuredClone(prefix.rails) : rail ? [{ ...structuredClone(rail), uid: 1 }] : [], obs = (prefix?.obs || obstacles).map((o) => ({ ...o })), actions = [];
  let charging = false, holdTick = 0, jumps = 0, caught = false, groundSince = null, minGap = Infinity, lateTarget = null, nearLandings = 0, lateTakeoffs = 0, firstPreparation = Infinity;
  const dt = 1 / 120, chargeTicks = Math.round(charge * GAMEPLAY10.chargeSeconds / dt), groundTargets = obs.filter((o) => !o.altitude);
  const horizon = Math.min(1800, Math.ceil((Math.max(0, ...obstacles.map((o) => o.x + o.w), rail ? rail.x + rail.w : 0) + 300) / Math.max(60, Math.min(pace.speed, pace.base)) * 120 + 360));
  for (let tick = prefix?.tick || 0; tick < horizon; tick++) {
    if (budget.ticks >= ENCOUNTER2.tickBudget) {
      budget.exhausted = true;
      return null;
    }
    budget.ticks++;
    const t = tick * dt, target = rail ? jumps === 0 ? rails[0] : null : groundTargets.find((o) => !o.targeted && o.x + o.w > -47);
    if (stopBeforeHold !== null && target && (target.x + (target.inset || 5) - (rail ? 0 : 47)) / Math.max(1, r.speed + (target.approachSpeed || 0)) <= stopBeforeHold) return { p, r, e, q, g, rails, obs, tick };
    if (!noInput && !p.airborne && !g.support && target) {
      const targetLead = jumps > 0 ? secondLead : lead, ttc = (target.x + (target.inset || 5) - (rail ? 0 : 47)) / Math.max(1, r.speed + (target.approachSpeed || 0));
      if (!charging && ttc <= targetLead + chargeTicks * dt) {
        if (groundSince !== null) {
          const gap = t - groundSince;
          minGap = Math.min(minGap, gap);
          if (gap + 1e-8 < minGroundGap) return null;
        }
        charging = true;
        holdTick = tick;
        actions.push({ at: t, action: "hold" });
        const prep = rail && obs.length ? Math.min(...obs.map((o) => preparationSeconds2(o, r, { charge: 0, lead: 0, speed: r.speed }) + (47 - o.x) / Math.max(60, r.speed + (o.approachSpeed || 0)))) : preparationSeconds2(target, r, { charge: chargeTicks * dt / GAMEPLAY10.chargeSeconds, lead: targetLead, speed: r.speed });
        firstPreparation = Math.min(firstPreparation, prep);
      }
      if (charging && tick - holdTick >= chargeTicks) {
        const usedCharge = (tick - holdTick) * dt / GAMEPLAY10.chargeSeconds;
        p.jumpFactor = q && activeBooster6(q, "jump") ? 1.25 : 1;
        lateTarget = !rail && nearWindow10(target.x + (target.inset || 5) - 47, r.speed + (target.approachSpeed || 0)) ? target : null;
        launch10(p, usedCharge);
        target.targeted = true;
        jumps++;
        charging = false;
        actions.push({ at: t, action: "jump", charge: usedCharge });
      }
    }
    if (q) {
      advanceBoosters6(q, dt);
      r.boost = 0.35 * q.speedBlend;
      e.scoreFactor = activeBooster6(q, "score") ? 3 : 1;
    }
    advanceEconomy10(e, dt);
    advanceStreak10(e, dt);
    const before = { ...p };
    let landed = advanceFlight10(p, dt);
    advancePace10(r, e, p, dt);
    if (rail) {
      const events = advanceRail4(g, p, before, rails, r.speed * dt, dt, e);
      if (events.some((v) => v.type === "rail-catch")) caught = true;
      if (g.support) landed = null;
    }
    const after = landed ? { ...p, angle: landed.angle } : p;
    for (const o of obs) {
      const old = o.x;
      o.x -= (r.speed + (o.approachSpeed || 0)) * dt;
      if (sweptCollision10(before, after, o, old, o.x, time + t + dt, dt)) return null;
      if (!o.passed && o.x + o.w < -50) {
        o.passed = true;
        passObstacle10(e);
      }
    }
    if (landed) {
      if (!landed.good) return null;
      let near = 0;
      const late = lateTarget && lateTarget.x + lateTarget.w - (lateTarget.inset || 5) < -47 ? 1 : 0;
      for (const o of obs) if (!o.altitude && !o.nearPaid && nearWindow10(-47 - (o.x + o.w - (o.inset || 5)), r.speed)) {
        near++;
        o.nearPaid = true;
      }
      settleLanding10(e, p, landed, { late, near });
      nearLandings += near;
      lateTakeoffs += late;
      lateTarget = null;
      groundSince = t + dt;
      if (g.distance > 0) {
        e.bonus += g.pending;
        rewardAction10(e);
        Object.assign(g, createGrind4());
      }
    }
    if (obs.every((o) => o.x + o.w < -180) && rails.every((o) => o.x + o.w < -180) && !p.airborne && !g.support) {
      if (requireCatch && !caught) return null;
      return { charge, lead, secondLead, burn: 0, actions, duration: t + dt, fuelUsed: 0, nearLandings, lateTakeoffs, caught, jumps, minGroundGap: Number.isFinite(minGap) ? minGap : null, preparation: Number.isFinite(firstPreparation) ? firstPreparation : null, clearanceVerified: true, exit: { y: 0, angle: 0, vx: p.vx } };
    }
  }
  return null;
}
function prepareEncounter2(obstacles, options, policies, budget = encounterBudget2()) {
  const maxTrigger = Math.max(...policies.map(([charge, lead]) => lead + 0.09 + Math.round(Math.min(1, charge + 0.1) * GAMEPLAY10.chargeSeconds * 120) / 120));
  return simulateEncounter2(obstacles, { ...options, budget, noInput: true, requireCatch: false, stopBeforeHold: maxTrigger });
}
function validateEncounter2(obstacles, options = {}) {
  const budget = options.budget || encounterBudget2(), rail = options.rail;
  if (options.noInput) return simulateEncounter2(obstacles, { ...options, budget, requireCatch: false, noInput: true });
  const type = obstacles.find((o) => !o.altitude), speed = options.pace?.speed || 360, h = type?.h || 0;
  const lowCharge = Math.max(0, 0.19 - Math.max(0, speed - 360) * 16e-4), lowLead = 0.15 + Math.min(0.03, Math.max(0, speed - 360) * 25e-5);
  let policies = options.policies || (rail ? [[0.5, 0.35], [0.5, 0.5], [1, 0.35]] : h <= 45 ? [[lowCharge, lowLead], [speed < 500 ? 0.2 : 0.1, 0.16]] : h <= 78 ? [[speed < 410 ? 0.3 : 0.2, h <= 64 ? 0.2 : 0.24], [0.3, 0.24]] : h <= 100 ? [[speed < 460 ? 0.3 : 0.2, 0.27], [0.3, 0.28]] : [[0.3, 0.3], [0.4, 0.28], [0.5, 0.27]]);
  if (options.tallSingle && !rail) policies = [[0.3, 0.32], [0.35, 0.3], [0.4, 0.28]];
  const minPreparation = options.tallSingle ? h > 120 ? 0.72 : ENCOUNTER2.tallPreparation : 0.9, minErrorPreparation = options.tallSingle ? h > 120 ? 0.62 : ENCOUNTER2.tallErrorPreparation : 0.8;
  if (!rail && options.pace) policies = policies.filter(([charge, lead]) => preparationSeconds2(type, options.pace, { charge, lead }) >= minPreparation - 0.02);
  if (!policies.length) return null;
  const prefix = prepareEncounter2(obstacles, options, policies, budget);
  if (!prefix?.p) return null;
  const proof = { ...options, budget, prefix };
  for (const [charge, lead] of policies) {
    const base = simulateEncounter2(obstacles, { ...proof, charge, lead });
    if (!base) continue;
    if ((!rail || obstacles.length) && (base.preparation ?? 0) < minPreparation) continue;
    let ok = true;
    for (let i = -3; i <= 3 && ok; i++) {
      if (i === 0) continue;
      const shifted = simulateEncounter2(obstacles, { ...proof, charge, lead: lead + i * 0.03 });
      if (!shifted || (!rail || obstacles.length) && (shifted.preparation ?? 0) < minErrorPreparation) ok = false;
    }
    if (ok && base.jumps > 1) {
      const offsets = [-0.09, -0.06, -0.03, 0.03, 0.06, 0.09];
      for (const shift of offsets) for (const first of [false, true]) {
        const sample = simulateEncounter2(obstacles, { ...proof, charge, lead: lead + (first ? shift : 0), secondLead: lead + (first ? 0 : shift) });
        if (!sample || (sample.preparation ?? 0) < minErrorPreparation) {
          ok = false;
          break;
        }
      }
      if (ok) for (const first of [-0.09, 0.09]) for (const second of [-0.09, 0.09]) {
        const sample = simulateEncounter2(obstacles, { ...proof, charge, lead: lead + first, secondLead: lead + second });
        if (!sample || (sample.preparation ?? 0) < minErrorPreparation) {
          ok = false;
          break;
        }
      }
    }
    if (ok && !rail) for (const c of [Math.max(0, charge - 0.1), Math.min(1, charge + 0.1)]) {
      if (!simulateEncounter2(obstacles, { ...proof, charge: c, lead })) {
        ok = false;
        break;
      }
    }
    if (ok && !rail) for (const c of [Math.max(0, charge - (options.tallSingle ? 0.1 : 0.05)), Math.min(1, charge + (options.tallSingle ? 0.1 : 0.05))]) for (const offset of options.tallSingle ? [-0.09, 0.09] : [-0.06, 0.06]) {
      if (!simulateEncounter2(obstacles, { ...proof, charge: c, lead: lead + offset })) {
        ok = false;
        break;
      }
    }
    if (ok) return { ...base, preparation: rail && !obstacles.length ? null : base.preparation, preparationTarget: rail && !obstacles.length ? null : minPreparation, errorPreparationTarget: minErrorPreparation, timingMargin: 0.09, timingWindow: 0.18, sampleStep: 0.03 };
    if (budget.exhausted) return null;
  }
  return null;
}

// supabase/rulesets/roadster-v461/director.js
var factoryIds2 = ["truck", "t800", "bydSeal", "xiaomiSu7", "batteryAgv", "xi"];
var eligible2 = (o, biome) => o.biomes === "all" || o.biomes.includes(biome);
var airSpeed2 = { ufo: 65, primeDrone: 70, twitterBird: 95, starlink: 45, regulatorDrone: 60, sikorsky: 35, qualitySkull: 75 };
function createDirector10({ S, flight, pace, economy, boosters, spawnDistance, sceneTime = () => S.t, random: random7 = Math.random, relative = false }) {
  const initial = () => ({ wave: 0, last: null, fallbacks: 0, waiting: false, leg: -1, legStartedAt: 0, legDistance: 0, groundSinceAir: 0, airCount: 0, lastAirAt: -1e9, railCount: 0, lastRailAirAt: -1e9, phase: "introduce", flow: 0, active: false, restUntil: null, restSeconds: ENCOUNTER2.rest, recoveryWaves: 0, history: [], seen: [], sinceTall: 2, budget: null });
  const state = initial();
  function reset() {
    Object.assign(state, initial());
  }
  function recover() {
    state.recoveryWaves = 2;
    state.restUntil = null;
    state.active = true;
    state.restSeconds = ENCOUNTER2.accentRest;
    state.phase = "rest";
  }
  const clear = () => !flight.airborne && flight.y < 1 && !pace.recovery && !pace.falling && pace.stumble <= 0 && (S.rails || []).every((r) => r.x + r.w < -180) && S.obs.every((o) => o.x + o.w < -180 || o.smashed);
  function update() {
    const target = biomeAt8(S.score || 0);
    if (target.leg !== state.leg) {
      state.leg = target.leg;
      state.legStartedAt = S.t;
      state.legDistance = S.distance || 0;
    }
    if (state.active && clear()) {
      state.active = false;
      state.restUntil = S.t + state.restSeconds;
      S.next = Math.max(S.next, state.restSeconds);
    }
  }
  function spawn() {
    update();
    if (!clear() || state.restUntil !== null && S.t + 1e-8 < state.restUntil) {
      S.next = 0.18;
      state.waiting = true;
      return;
    }
    state.waiting = false;
    state.restUntil = null;
    const { id: biome, leg } = biomeAt8(S.score || 0), stage = stageAt10(pace.progress), budget = encounterBudget2();
    state.budget = budget;
    const familiar = S.t - state.legStartedAt < 8 || S.distance !== void 0 && S.distance - state.legDistance < 2200, simple = pace.progress < 35 || familiar || state.recoveryWaves > 0, fast = S.speed > 760;
    const candidate = () => {
      if (budget.candidates >= 3 || budget.exhausted) return false;
      budget.candidates++;
      return true;
    };
    const opts = { flight, pace, economy, boosterState: boosters, time: sceneTime(), budget };
    const dx = Math.max(spawnDistance(), S.speed * 1.8 + 180), railDue = state.wave >= RAIL4.firstWave && (state.wave - RAIL4.firstWave) % RAIL4.every === 0;
    let kind = "single", obstacles = [], rail = null, route = null;
    const airPool = AIR_TYPES10.filter((o) => eligible2(o, biome)), pick = (pool) => pool[Math.min(pool.length - 1, Math.floor(random7() * pool.length))];
    if (railDue && !state.recoveryWaves) {
      rail = makeRail4(dx);
      kind = "rail";
      const combined = pace.progress >= 150 && !familiar && !state.recoveryWaves && !fast && state.airCount >= 2 && state.groundSinceAir >= 4 && S.t - state.lastAirAt >= ENCOUNTER2.airCooldown && state.railCount >= 2 && state.railCount % 3 === 2 && S.t - state.lastRailAirAt >= ENCOUNTER2.railAirCooldown;
      if (combined && candidate()) {
        const small = airPool.filter((o) => o.w <= 110 && o.h <= 60 && state.seen.includes(o.id)), model = pick(small);
        if (model) {
          obstacles = [{ ...model, x: dx - 150, approachSpeed: airSpeed2[model.id], passed: false }];
          route = validateEncounter2(obstacles, { ...opts, rail, policies: [[0.5, 0.15], [0.5, 0.2]] });
          if (route) {
            const bypass = validateEncounter2(obstacles, { ...opts, rail, noInput: true });
            if (bypass) {
              kind = "rail-air";
              route.bypass = bypass;
            } else route = null;
          }
        }
      }
      if (!route && candidate()) {
        obstacles = [];
        route = validateEncounter2([], { ...opts, rail });
      }
      if (!route) rail = null;
    }
    const reserveRailAir = pace.progress >= 150 && state.airCount >= 2 && state.railCount >= 2 && state.railCount % 3 === 2;
    const airDue = !reserveRailAir && pace.progress >= 90 && !familiar && !state.recoveryWaves && state.groundSinceAir >= 4 && S.t - state.lastAirAt >= ENCOUNTER2.airCooldown;
    if (!route && airDue && candidate()) {
      const pool = state.airCount < 2 ? airPool.filter((o) => o.w <= 110 && o.h <= 60) : airPool, model = pick(pool);
      if (model) {
        kind = "air-pass";
        obstacles = [{ ...model, x: dx, approachSpeed: airSpeed2[model.id], passed: false }];
        route = validateEncounter2(obstacles, { ...opts, noInput: true });
      }
    }
    if (!route && !fast) {
      const accent2 = !simple && state.phase === "accent", recent = state.history.slice(-2), repeat = recent.length === 2 && recent[0] === recent[1] ? recent[0] : null;
      const choices = OBSTACLES10.filter((o) => !o.altitude && o.collision !== "none" && eligible2(o, biome) && (biome !== "tesla-factory" || factoryIds2.includes(o.id)) && (simple ? o.h <= 64 : true) && (o.h < 90 || state.sinceTall >= 2) && o.id !== repeat);
      for (let attempt = 0; attempt < 3 && !route && candidate(); attempt++) {
        const fallback = choices.filter((o) => o.h <= 45), type = attempt === 2 ? fallback.find((o) => o.id === (S.speed < 430 && biome === "spaceport" ? "v8" : "truck")) || pick(fallback) : pick(choices);
        if (!type) break;
        kind = attempt === 0 && type.h < 90 && state.seen.includes(type.id) && accent2 && S.speed <= 700 && state.last?.kind !== "spaced-pair" ? pick(["spaced-pair", "low-cluster"]) : "single";
        obstacles = makePattern10(kind, { speed: S.speed, type, dx, gapSeconds: pace.progress < 90 ? 0.65 : 0.45 });
        route = validateEncounter2(obstacles, { ...opts, tallSingle: kind === "single" && type.h >= 90, minGroundGap: pace.progress < 90 ? 0.65 : 0.45 });
        if (!route) state.fallbacks++;
      }
    }
    if (!route) {
      state.budget = budget;
      state.phase = "rest";
      state.restUntil = S.t + 1.5;
      S.next = 1.5;
      return;
    }
    state.wave++;
    state.active = true;
    state.restUntil = null;
    if (rail) {
      state.railCount++;
      if (kind === "rail-air") {
        state.lastRailAirAt = S.t;
        state.airCount++;
        state.groundSinceAir = 0;
        state.lastAirAt = S.t;
      }
    }
    if (kind === "air-pass") {
      state.airCount++;
      state.groundSinceAir = 0;
      state.lastAirAt = S.t;
    } else if (kind !== "rail-air") state.groundSinceAir++;
    const tallSingle = kind === "single" && obstacles[0]?.h >= 90;
    if (tallSingle) state.sinceTall = 0;
    else if (["single", "rail", "air-pass"].includes(kind)) state.sinceTall++;
    const accent = ["spaced-pair", "low-cluster", "rail-air"].includes(kind);
    state.restSeconds = accent ? ENCOUNTER2.accentRest : ENCOUNTER2.rest;
    for (const o of obstacles) if (!state.seen.includes(o.id)) state.seen.push(o.id);
    state.history.push(obstacles.find((o) => !o.altitude)?.id || kind);
    state.history = state.history.slice(-4);
    if (state.recoveryWaves > 0) state.recoveryWaves--;
    if (accent || state.phase === "accent") {
      state.phase = "rest";
      state.flow = 0;
    } else if (state.phase === "rest" || state.phase === "introduce") {
      state.phase = "flow";
      state.flow = 1;
    } else if (++state.flow >= 3) state.phase = "accent";
    state.last = { kind, tallSingle, stage, biome, leg, route, startedAt: S.t, restSeconds: state.restSeconds };
    for (const o of obstacles) S.obs.push({ ...o, x: o.x + (relative ? 0 : S.anchor), uid: ++S.entityId, passed: false, nearPaid: false, latePaid: false });
    if (rail) (S.rails ??= []).push({ ...rail, uid: ++S.entityId });
    S.next = 0.18;
  }
  return { reset, spawn, update, recover, state };
}

// supabase/rulesets/roadster-v461/random.js
function createRandom10(seed) {
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

// supabase/rulesets/roadster-v461/run.js
var RULESET10 = "roadster-v4.6.1";
var RUN_STEP10 = 1 / 120;
var RUN_COMMANDS10 = Object.freeze(["primary-down", "primary-up", "primary-cancel", "thrust-on", "thrust-off", "cancel"]);
var MAX_RECORDED_TICKS10 = 120 * 60 * 60;
var MAX_RECORDED_EVENTS10 = 24e3;
function createRun10({ seed = 0, record = true, reducedMotion = false } = {}) {
  const S = { mode: "menu", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY10.startSpeed, next: 1.7, obs: [], rails: [], entityId: 0, anchor: 0 }, Q = createBoosters6(seed), G = createGrind4(), P = createFlight10(), E = createEconomy10(), pace = createPace10(), F = createFall10(), input = { charging: false, charge: 0, spin: false, thrust: false };
  let random7 = createRandom10(seed), events = [], log = [], lateId = null, lastLanding = null, recordable = true;
  const director = createDirector10({ S, flight: P, pace, economy: E, boosters: Q, random: () => random7.next(), relative: true, sceneTime: () => S.t, spawnDistance: () => Math.max(900, S.speed * 1.5 + 180) });
  function clear() {
    Object.assign(input, { charging: false, charge: 0, spin: false, thrust: false });
    P.thrusting = false;
  }
  function sync() {
    S.t = S.tick * RUN_STEP10;
    S.speed = pace.speed;
    S.score = Math.floor(S.distance / 20 + E.bonus);
  }
  function reset(nextSeed = seed) {
    seed = nextSeed;
    random7 = createRandom10(seed);
    Object.assign(Q, createBoosters6(seed));
    Object.assign(G, createGrind4());
    Object.assign(P, createFlight10());
    Object.assign(E, createEconomy10());
    Object.assign(pace, createPace10());
    Object.assign(F, createFall10());
    Object.assign(S, { mode: "playing", tick: 0, t: 0, distance: 0, score: 0, speed: GAMEPLAY10.startSpeed, next: 1.7, obs: [], rails: [], entityId: 0, lastCharge: 0 });
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
      if (nearWindow10(o.x + (o.inset || 5) - 47, S.speed + (o.approachSpeed || 0))) {
        lateId = o.uid;
        break;
      }
    }
    const charge = input.charge;
    P.jumpFactor = activeBooster6(Q, "jump") ? 1.25 : 1;
    if (G.support) jumpFromRail4(G, P, charge);
    else {
      Q.spoiledFlight = false;
      launch10(P, charge);
    }
    S.lastCharge = charge;
    input.charging = false;
    input.charge = 0;
    input.spin = false;
    events.push({ type: "jump", charge });
    return true;
  }
  function command(action) {
    if (!RUN_COMMANDS10.includes(action)) throw Error("Unknown run command");
    if (S.mode !== "playing") return false;
    if (record && recordable) {
      if (log.length >= MAX_RECORDED_EVENTS10) recordable = false;
      else log.push([S.tick, RUN_COMMANDS10.indexOf(action)]);
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
    if (F.active) return hastenFall10(F);
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
    if (S.tick > MAX_RECORDED_TICKS10) recordable = false;
    sync();
    if (input.charging) input.charge = Math.min(1, input.charge + RUN_STEP10 / GAMEPLAY10.chargeSeconds);
    advanceBoosters6(Q, RUN_STEP10);
    E.scoreFactor = activeBooster6(Q, "score") ? 3 : 1;
    pace.boost = 0.35 * Q.speedBlend;
    advanceEconomy10(E, RUN_STEP10);
    advanceStreak10(E, RUN_STEP10);
    const physicsFall = () => fallPose10({ ...F, reduced: false }), wasFalling = F.active, before = { ...P, fallPose: F.active ? physicsFall() : null };
    let landed = null, fallStep = { impacts: 0, finished: false };
    if (wasFalling) {
      fallStep = advanceFall10(F, RUN_STEP10);
      if (fallStep.finished) {
        clear();
        S.next = Math.max(S.next, 0.8);
        events.push({ type: "recovered" });
      }
    } else landed = advanceFlight10(P, RUN_STEP10, { spin: input.spin, thrust: input.thrust });
    pace.falling = F.active;
    advancePace10(pace, E, P, RUN_STEP10);
    S.distance += pace.speed * RUN_STEP10;
    E.bonus += pace.speed * RUN_STEP10 / 20 * (E.scoreFactor - 1);
    sync();
    events.push(...advanceRail4(G, P, before, S.rails, S.speed * RUN_STEP10, RUN_STEP10, E, { spoiled: Q.spoiledFlight, blocked: wasFalling }));
    if (G.support) {
      landed = null;
      input.spin = false;
    }
    const after = wasFalling ? { ...P, fallPose: physicsFall() } : landed ? { ...P, angle: landed.angle } : P;
    for (const o of S.obs) {
      const old = o.x;
      o.x -= (S.speed + (o.approachSpeed || 0)) * RUN_STEP10;
      if (o.smashed) {
        o.smashAge += RUN_STEP10;
        continue;
      }
      if (sweptCollision10(before, after, o, old, o.x, S.t, RUN_STEP10)) {
        if (activeBooster6(Q, "shield")) {
          o.smashed = true;
          o.smashAge = 0;
          if (!o.passed) {
            o.passed = true;
            passObstacle10(E);
          }
          events.push({ type: "smash", obstacle: { ...o } });
          continue;
        }
        if (Q.grace > 0 || Q.ghostIds.includes(o.uid)) {
          if (!Q.ghostIds.includes(o.uid)) Q.ghostIds.push(o.uid);
        } else if (Q.hearts > 0) {
          const oldMultiplier = E.multiplier;
          Q.hearts--;
          resetAirRotation(P);
          Q.grace = 2;
          Q.ghostIds.push(o.uid);
          Q.spoiledFlight = true;
          G.pending = G.distance = G.turns = 0;
          E.multiplier = 10;
          E.meter = 0;
          E.decay = 0;
          E.streak = 0;
          E.streakLeft = 0;
          events.push({ type: "rescued", oldMultiplier });
          director.recover();
        } else {
          S.mode = "dead";
          resetAirRotation(P);
          G.pending = G.distance = G.turns = 0;
          clear();
          sync();
          events.push({ type: "death", obstacle: o });
          return { landed, impacts: fallStep.impacts };
        }
      }
      if (!o.passed && o.x + o.w < -50) {
        o.passed = true;
        passObstacle10(E);
        if (o.altitude) events.push({ type: "air-passed" });
      }
    }
    for (const orb of Q.pickups) {
      const old = orb.x;
      orb.x -= S.speed * RUN_STEP10;
      const inReach = Math.min(old, orb.x) <= 112 && Math.max(old, orb.x) >= -112 && Math.abs(P.y + 78 - orb.y) <= 122;
      if (!F.active && inReach && collectBooster6(Q, orb.id)) {
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
        if (nearWindow10(-47 - (o.x + o.w - (o.inset || 5)), S.speed)) {
          near++;
          o.nearPaid = true;
        }
      }
      if (!Q.spoiledFlight) landed = { ...landed, turns: landed.turns + G.turns };
      const grindPoints = landed.good && !Q.spoiledFlight ? G.pending : 0, grindDistance = landed.good && !Q.spoiledFlight ? G.distance : 0;
      const oldMultiplier = E.multiplier;
      lastLanding = settleLanding10(E, P, Q.spoiledFlight ? { ...landed, turns: 0, perfect: false } : landed, Q.spoiledFlight ? { late: 0, near: 0 } : { late, near });
      Q.spoiledFlight = false;
      E.bonus += grindPoints;
      lastLanding.points += grindPoints;
      Object.assign(lastLanding, { grindPoints, grindDistance });
      if (grindDistance > 0) {
        rewardAction10(E);
        S.next = Math.max(S.next, RAIL4.exitSeconds);
      }
      Object.assign(G, createGrind4());
      if (!landed.good) {
        stumble10(pace);
        beginFall10(F, landed, { reduced: reducedMotion, speed: pace.recovery.target });
        pace.falling = true;
        director.recover();
        P.angle = 0;
        P.omega = 0;
        P.vx = 0;
        P.grab = 0;
        clear();
        advancePace10(pace, E, P, 0);
      }
      events.push({ type: "landing", landed, result: lastLanding, late, near, oldMultiplier });
      lateId = null;
    }
    if (!P.airborne && !G.support && Math.abs(P.angle) > 1e-3) {
      P.angle *= Math.exp(-RUN_STEP10 * 18);
      P.omega = 0;
    }
    S.obs = S.obs.filter((o) => o.smashed ? o.smashAge < 1.2 : o.uid === lateId || o.x + o.w > (o.id === "joe" ? -480 : -400));
    S.rails = S.rails.filter((r) => r.x + r.w > -200 || r.uid === G.support);
    offerBooster6(Q, { time: S.t, speed: S.speed, clear: !P.airborne && !G.support && !S.rails.length && !F.active && !pace.recovery && S.obs.every((o) => o.passed) });
    director.update();
    S.next -= RUN_STEP10;
    if (S.next <= 0 && !Q.pickups.length) director.spawn();
    sync();
    return { landed, impacts: fallStep.impacts };
  }
  function snapshot() {
    return structuredClone({ seed, S, P, E, pace, F, Q, G, input, random: random7.state, director: director.state, lateId, lastLanding });
  }
  function restore(saved) {
    seed = saved.seed;
    for (const [a, b] of [[G, saved.G], [Q, saved.Q], [S, saved.S], [P, saved.P], [E, saved.E], [pace, saved.pace], [F, saved.F], [input, saved.input], [director.state, saved.director]]) Object.assign(a, structuredClone(b));
    random7 = createRandom10(seed);
    random7.restore(saved.random);
    lateId = saved.lateId;
    lastLanding = structuredClone(saved.lastLanding);
    events = [];
  }
  function replay() {
    return recordable ? { format: 1, ruleset: RULESET10, seed, ticks: S.tick, events: log.map((e) => [...e]) } : null;
  }
  return { S, P, E, pace, F, Q, G, input, director, reset, jump, command, step, sync, snapshot, restore, replay, drainEvents() {
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
function validateReplay10(value) {
  if (!value || value.format !== 1 || value.ruleset !== RULESET10 || !Number.isInteger(value.seed) || value.seed < 0 || value.seed > 4294967295 || !Number.isInteger(value.ticks) || value.ticks < 1 || value.ticks > MAX_RECORDED_TICKS10 || !Array.isArray(value.events) || value.events.length > MAX_RECORDED_EVENTS10) throw Error("Invalid or unsupported replay");
  let previous = -1;
  for (const event of value.events) {
    if (!Array.isArray(event) || event.length !== 2 || !Number.isInteger(event[0]) || event[0] < previous || event[0] < 0 || event[0] >= value.ticks || !Number.isInteger(event[1]) || event[1] < 0 || event[1] >= RUN_COMMANDS10.length) throw Error("Invalid replay input");
    previous = event[0];
  }
  return value;
}
function verifyReplay10(value) {
  const replay = validateReplay10(value), run = createRun10({ seed: replay.seed, record: false });
  run.reset();
  let event = 0;
  while (run.S.tick < replay.ticks && run.S.mode === "playing") {
    while (event < replay.events.length && replay.events[event][0] === run.S.tick) run.command(RUN_COMMANDS10[replay.events[event++][1]]);
    run.step();
    run.drainEvents();
  }
  if (run.S.mode !== "dead" || run.S.tick !== replay.ticks || event !== replay.events.length) throw Error("Replay does not end at its first collision");
  return { score: run.S.score, flips: run.E.flips, ticks: run.S.tick };
}

// supabase/rulesets.mjs
var supported = new Map([run_exports, run_exports2, run_exports3, run_exports4, run_exports5, run_exports6, run_exports7, run_exports8, run_exports9, run_exports10].map((r) => [r.RULESET, r]));
function ruleset(id2) {
  const r = supported.get(id2);
  if (!r) throw Error("Unsupported ruleset");
  return r;
}

// supabase/chunk.mjs
function verifyChunk(value, checkpoint = null, { maxTicks = 6e3, budgetMs = 400, now = () => performance.now() } = {}) {
  const { createRun: createRun11, validateReplay: validateReplay11, RUN_COMMANDS: RUN_COMMANDS11 } = ruleset(value?.ruleset);
  const replay = validateReplay11(value), run = createRun11({ seed: replay.seed, record: false });
  run.reset();
  let event = 0;
  if (checkpoint) {
    run.restore(checkpoint.run);
    event = checkpoint.event;
  }
  const start = run.S.tick, started = now();
  while (run.S.tick < replay.ticks && run.S.mode === "playing" && run.S.tick - start < maxTicks) {
    while (event < replay.events.length && replay.events[event][0] === run.S.tick) run.command(RUN_COMMANDS11[replay.events[event++][1]]);
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
