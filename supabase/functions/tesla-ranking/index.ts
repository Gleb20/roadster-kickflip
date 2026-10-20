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
function createDirector({ S, flight, pace, economy, spawnDistance, sceneTime = () => S.t, random = Math.random, relative = false }) {
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
    let kind = breath ? "single" : pools[stage][Math.floor(random() * pools[stage].length)];
    if (!breath && stage === 3 && pace.progress < 72) kind = "hover";
    const choices = OBSTACLES.filter((o) => !o.altitude && (stage === 0 ? o.h <= 64 : stage < 2 ? o.h <= 94 : true));
    if (kind === "thrust" && flight.fuel < 65) kind = "pair";
    const type = choices[Math.floor(random() * choices.length)], dx = spawnDistance();
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
  let random = createRandom(seed), events = [], log = [], lateId = null, lastLanding = null, recordable = true;
  const director = createDirector({ S, flight: P, pace, economy: E, random: () => random.next(), relative: true, sceneTime: () => S.t, spawnDistance: () => Math.max(900, S.speed * 1.5 + 180) });
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
    random = createRandom(seed);
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
    return structuredClone({ seed, S, P, E, pace, F, input, random: random.state, director: director.state, lateId, lastLanding });
  }
  function restore(saved) {
    seed = saved.seed;
    for (const [a, b] of [[S, saved.S], [P, saved.P], [E, saved.E], [pace, saved.pace], [F, saved.F], [input, saved.input], [director.state, saved.director]]) Object.assign(a, structuredClone(b));
    random = createRandom(seed);
    random.restore(saved.random);
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

// supabase/chunk.mjs
function verifyChunk(value, checkpoint = null, { maxTicks = 6e3, budgetMs = 400, now = () => performance.now() } = {}) {
  const replay = validateReplay(value), run = createRun({ seed: replay.seed, record: false });
  run.reset();
  let event = 0;
  if (checkpoint) {
    run.restore(checkpoint.run);
    event = checkpoint.event;
  }
  const start = run.S.tick, started = now();
  while (run.S.tick < replay.ticks && run.S.mode === "playing" && run.S.tick - start < maxTicks) {
    while (event < replay.events.length && replay.events[event][0] === run.S.tick) run.command(RUN_COMMANDS[replay.events[event++][1]]);
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
      if (path.startsWith("/scores/") && req.method === "GET") return json(await rpc("entry", { id: id(path.slice(8)) }));
      if (path === "/sessions" && req.method === "POST") {
        const b = await body(req, 1024);
        if (b.ruleset !== RULESET) throw new ApiError("ruleset_unavailable", 409);
        const capability = hex(crypto.getRandomValues(new Uint8Array(32))), value = await rpc("create", { id: crypto.randomUUID(), publicId: crypto.randomUUID(), tokenHash: await hash(capability), seed: crypto.getRandomValues(new Uint32Array(1))[0], ruleset: RULESET });
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
          validateReplay(b.replay);
        } catch {
          throw new ApiError("invalid_replay");
        }
        const replay = { format: 1, ruleset: b.replay.ruleset, seed: b.replay.seed, ticks: b.replay.ticks, events: b.replay.events.map((e) => [e[0], e[1]]) };
        return json(decorate(await rpc("submit", { ...p, nickname, replay, payloadHash: await hash(JSON.stringify({ nickname, replay })) })), 202);
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
