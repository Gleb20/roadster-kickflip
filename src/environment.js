// The scenery is drawn once into small, reusable paper-cutout layers. Only
// compositing and the distant turbine rotors run on the animation frame.
const TILE_WIDTH = 1280;
const wrap = (value, span) => ((value % span) + span) % span;

function surface(width, height, paint) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(width);
  canvas.height = Math.ceil(height);
  const ctx = canvas.getContext('2d');
  paint(ctx, canvas.width, canvas.height);
  return canvas;
}

function polygon(ctx, points, fill, stroke, width = 1) {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(...points[i]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.stroke();
  }
}

function line(ctx, points, color, width = 1) {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(...points[i]);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function solarField(ctx, x, y, columns, rows) {
  for (let row = 0; row < rows; row++) {
    const size = 13 + row * 3;
    for (let col = 0; col < columns; col++) {
      const left = x + col * (size + 3) - row * 12;
      const top = y + row * 7;
      polygon(ctx, [[left + 3, top], [left + size, top],
        [left + size - 2, top + 5], [left, top + 5]], '#263c46', '#304953', .65);
      line(ctx, [[left + size / 2 + 1, top + .5],
        [left + size / 2 - 1, top + 4.5]], '#38505a', .55);
    }
  }
}

function hangar(ctx, x, baseline, width, height) {
  // A single subdued silhouette gives these the same cut-paper language as
  // the foreground without its high-contrast white sticker border.
  polygon(ctx, [[x, baseline], [x, baseline - height * .63],
    [x + width * .12, baseline - height * .87],
    [x + width * .28, baseline - height], [x + width * .72, baseline - height],
    [x + width * .88, baseline - height * .87],
    [x + width, baseline - height * .63], [x + width, baseline]], '#2b414a', '#39505a', 1.1);
  polygon(ctx, [[x + 10, baseline], [x + 10, baseline - height * .6],
    [x + width * .2, baseline - height * .79],
    [x + width * .8, baseline - height * .79],
    [x + width - 10, baseline - height * .6], [x + width - 10, baseline]], '#20343e');
  for (let i = 1; i < 6; i++) {
    const dx = x + 10 + (width - 20) * i / 6;
    line(ctx, [[dx, baseline - height * .58], [dx, baseline]], '#2d444e', .9);
  }
  line(ctx, [[x + width * .22, baseline - height * .87],
    [x + width * .78, baseline - height * .87]], '#53605b', 1.2);
  ctx.fillStyle = '#9f9d6540';
  ctx.fillRect(x + 6, baseline - 20, 3, 2);
  ctx.fillRect(x + width - 9, baseline - 20, 3, 2);
}

function dataCenter(ctx, x, baseline, width, height) {
  polygon(ctx, [[x, baseline], [x, baseline - height],
    [x + width - 12, baseline - height], [x + width, baseline - height + 7],
    [x + width, baseline]], '#293f49', '#364d56', 1);
  ctx.fillStyle = '#20333d';
  ctx.fillRect(x + width - 13, baseline - height + 8, 13, height - 8);
  for (let i = 0; i < 4; i++) {
    const left = x + 13 + i * (width - 40) / 4;
    ctx.fillStyle = '#334a52';
    ctx.fillRect(left, baseline - height - 6, 18, 6);
    ctx.fillStyle = '#20353f';
    ctx.fillRect(left, baseline - height + 13, 15, height - 24);
    line(ctx, [[left + 2, baseline - 18], [left + 12, baseline - 18]], '#657c6338', 1);
  }
}

function createLayers() {
  const hills = surface(TILE_WIDTH, 165, (ctx, w, h) => {
    polygon(ctx, [[0, 90], [78, 38], [157, 94], [236, 61], [319, 112],
      [425, 46], [512, 104], [613, 72], [705, 109], [814, 25],
      [900, 92], [1002, 57], [1120, 104], [1217, 66], [w, 90],
      [w, h], [0, h]], '#1b303b');
    polygon(ctx, [[0, 123], [113, 106], [220, 139], [360, 115],
      [505, 142], [640, 114], [782, 138], [960, 106], [1126, 142],
      [w, 123], [w, h], [0, h]], '#1e343e');
  });
  const turbines = [{x: 86, y: 43, size: .82}, {x: 295, y: 62, size: .62},
    {x: 726, y: 37, size: .9}, {x: 1080, y: 55, size: .72}];
  const fields = surface(TILE_WIDTH, 135, (ctx) => {
    for (const turbine of turbines) {
      const {x, y, size} = turbine;
      polygon(ctx, [[x - 1, y], [x + 1, y], [x + 3, 117], [x - 3, 117]], '#304750');
      ellipse(ctx, x, y, 2.3 * size, 2.3 * size, '#40545a');
    }
    solarField(ctx, 105, 91, 18, 5);
    solarField(ctx, 740, 94, 21, 5);
    dataCenter(ctx, 467, 119, 150, 36);
    dataCenter(ctx, 1180, 118, 78, 27);
  });
  const rotor = surface(64, 64, (ctx) => {
    ctx.translate(32, 32);
    for (let blade = 0; blade < 3; blade++) {
      ctx.save();
      ctx.rotate(blade * Math.PI * 2 / 3);
      polygon(ctx, [[-1, 1], [-2, -10], [0, -30], [2.2, -10], [1, 1]], '#3c525a');
      ctx.restore();
    }
    ellipse(ctx, 0, 0, 2, 2, '#4b5f63');
  });
  const buildings = surface(TILE_WIDTH, 130, (ctx) => {
    hangar(ctx, 26, 125, 174, 66);
    hangar(ctx, 449, 125, 220, 85);
    dataCenter(ctx, 779, 125, 193, 54);
    hangar(ctx, 1074, 125, 143, 56);
    // Low connecting service lanes keep buildings rooted in the landscape.
    line(ctx, [[0, 126], [TILE_WIDTH, 126]], '#344b52', 1);
  });
  const verge = surface(640, 48, (ctx) => {
    ctx.fillStyle = '#172b34';
    ctx.fillRect(0, 14, 640, 34);
    for (const [x, width] of [[36, 94], [347, 128]]) {
      polygon(ctx, [[x, 15], [x + 4, 5], [x + width - 5, 5],
        [x + width, 15]], '#2c424a');
      line(ctx, [[x + 7, 7], [x + width - 9, 7]], '#41554f', .8);
      ctx.fillStyle = '#adac6d66';
      ctx.fillRect(x + 10, 10, 6, 2);
    }
    line(ctx, [[0, 37], [640, 37]], '#21373e', 1);
  });
  return {hills, fields, turbines, rotor, buildings, verge};
}

function paintSky(ctx, W, H, ground) {
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, '#10151d');
  gradient.addColorStop(.7, '#1b303b');
  gradient.addColorStop(1, '#101c23');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 65; i++) {
    const radius = i % 5 === 0 ? 1.2 : .65;
    ellipse(ctx, (i * 157.13) % W, (i * i * 31.7) % (ground * .78),
      radius, radius, '#79929966');
  }
  const mx = W * .82, my = H * .26;
  ellipse(ctx, mx, my, 44, 44, '#aec7be12');
  ellipse(ctx, mx, my, 29, 29, '#c9d2b7');
  ellipse(ctx, mx - 9, my - 9, 8, 6, '#adbda5');
  ellipse(ctx, mx + 10, my + 7, 5, 8, '#b7c3ac');
}

function createRoad(height) {
  return surface(512, height, (ctx, width, h) => {
    const shade = ctx.createLinearGradient(0, 0, 0, h);
    shade.addColorStop(0, '#17242b');
    shade.addColorStop(1, '#101b22');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, width, h);
    // Deterministic, low-contrast aggregate: no random generation per frame.
    let seed = 8173;
    const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
    for (let i = 0; i < width * h / 110; i++) {
      ctx.fillStyle = i % 3 ? '#9bb3ac0b' : '#00000020';
      ctx.fillRect(random() * width, random() * h, 1 + random() * 1.4, .65);
    }
    const stripeY = Math.min(42, h * .36);
    ctx.fillStyle = '#69776b80';
    for (let x = 14; x < width; x += 128) ctx.fillRect(x, stripeY, 52, 2);
    line(ctx, [[0, stripeY + 23], [width, stripeY + 23]], '#8aa08e0b', 1);
    line(ctx, [[0, h - 12], [width, h - 12]], '#55716618', 1);
    // Reflectors are deliberately sparse and warm, below the obstacle plane.
    ctx.fillStyle = '#bda16d70';
    ctx.fillRect(83, 8, 5, 2);
    ctx.fillStyle = '#d9c08b14';
    ctx.fillRect(80, 7, 11, 4);
  });
}

/** Draw in CSS pixels; the caller keeps control of the canvas DPR transform. */
export function createEnvironmentRenderer() {
  let layers, sky, road, cacheKey = '';

  function tile(ctx, canvas, W, y, zoom, distance) {
    const width = canvas.width * zoom;
    const offset = wrap(distance, width);
    for (let x = -offset; x < W; x += width) {
      ctx.drawImage(canvas, x, y, width, canvas.height * zoom);
    }
  }

  return {
    draw(ctx, {W, H, ground, scale, roadDistance, sceneTime, rocketScene}) {
      if (W <= 0 || H <= 0) return;
      if (!layers) layers = createLayers();
      const key = `${W}:${H}:${ground}`;
      if (key !== cacheKey) {
        sky = surface(W, H, (skyCtx) => paintSky(skyCtx, W, H, ground));
        road = createRoad(Math.max(1, Math.ceil(H - ground)));
        cacheKey = key;
      }
      const zoom = Math.max(.72, Math.min(1.15, scale));
      const distance = roadDistance * scale;
      ctx.drawImage(sky, 0, 0);
      tile(ctx, layers.hills, W, ground - 28 - 165 * zoom, zoom, distance * .025);
      const fieldY = ground - 36 - 135 * zoom;
      tile(ctx, layers.fields, W, fieldY, zoom, distance * .045);
      const span = TILE_WIDTH * zoom;
      const offset = wrap(distance * .045, span);
      for (let start = -offset; start < W; start += span) {
        for (const turbine of layers.turbines) {
          const x = start + turbine.x * zoom;
          const size = turbine.size * zoom;
          if (x < -32 || x > W + 32) continue;
          ctx.save();
          ctx.translate(x, fieldY + turbine.y * zoom);
          ctx.rotate(sceneTime * .22 + turbine.x);
          ctx.drawImage(layers.rotor, -32 * size, -32 * size, 64 * size, 64 * size);
          ctx.restore();
        }
      }
      if (rocketScene) rocketScene();
      // The near terrain is opaque beneath the building silhouettes. Midground
      // hardware may appear above/alongside them, never through the strip below.
      ctx.fillStyle='#172b34';
      const nearBase=ground-29-5*zoom;
      ctx.fillRect(0,nearBase,W,ground+2-nearBase);
      tile(ctx, layers.buildings, W, ground - 29 - 130 * zoom, zoom, distance * .095);
      tile(ctx, layers.verge, W, ground - 48 * zoom, zoom, distance * .18);
      tile(ctx, road, W, ground + 2, 1, distance);
      line(ctx, [[0, ground], [W, ground]], '#7d978b', 1.6);
      line(ctx, [[0, ground + 2], [W, ground + 2]], '#243b40', 1);
    },
  };
}
