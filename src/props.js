// Static paper props are rasterised once, including their shared outer cut line.
// All coordinates are authored at the declared aspect ratio; draw() fits, never stretches.
export const PROP_TYPES = Object.freeze([
  { id: 'muscleCoupe', name: 'AMERICAN MUSCLE', w: 138, h: 45, inset: 6 },
  { id: 'muscleCompact', name: 'SMALL BLOCK / BIG EGO', w: 112, h: 46, inset: 5 },
  { id: 'pickup', name: 'BIG TRUCK ENERGY', w: 140, h: 58, inset: 6 },
  { id: 'simpsonsCouch', name: 'EVERGREEN TERRACE', w: 136, h: 88, inset: 6 },
  { id: 'islandPavilion', name: 'PRIVATE ISLAND', w: 100, h: 82, inset: 7 },
]);

const INK = '#282c2c';
const PAPER = '#f5eee2';
const YELLOW = '#e7be50';
const RESOLUTION = 3;
const BORDER = 2;
const PAD = 4;

function polygon(c, points, fill, stroke = INK, width = .9) {
  c.beginPath();
  points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
  c.closePath();
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
}

function line(c, points, color = INK, width = .8) {
  c.beginPath();
  points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
  c.strokeStyle = color;
  c.lineWidth = width;
  c.stroke();
}

function oval(c, x, y, rx, ry, fill, stroke = INK, width = .8) {
  c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  c.fillStyle = fill; c.fill();
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
}

function box(c, x, y, w, h, fill, radius = 0, stroke = INK) {
  c.beginPath(); c.roundRect(x, y, w, h, radius);
  c.fillStyle = fill; c.fill();
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = .85; c.stroke(); }
}

function tire(c, x, y, r) {
  oval(c, x, y, r, r, '#292d2e');
  oval(c, x, y, r * .68, r * .68, '#a6a49a');
  oval(c, x, y, r * .4, r * .4, '#40494a');
  for (let i = 0; i < 5; i++) {
    const angle = i * Math.PI * .4;
    line(c, [[x, y], [x + Math.cos(angle) * r * .6, y + Math.sin(angle) * r * .6]], '#d6d1bf', 1);
  }
  oval(c, x, y, 1.4, 1.4, '#d4d0bf', null);
}

function muscle(c, compact) {
  // Long fastback and a shorter, boxier pony car have separate body geometry.
  const w = compact ? 112 : 138;
  const front = compact ? 89 : 113;
  const paint = compact ? '#3e7c79' : '#bc5140';
  const light = compact ? '#76aaa1' : '#d77454';
  polygon(c, compact
    ? [[3,24],[14,22],[27,7],[63,6],[81,20],[106,23],[109,34],[101,38],[11,38],[3,33]]
    : [[3,24],[17,22],[42,6],[78,5],[98,20],[132,23],[135,33],[126,37],[9,37],[3,33]], paint);
  polygon(c, compact
    ? [[21,22],[31,10],[60,10],[74,22]]
    : [[25,22],[44,9],[75,9],[91,22]], '#354c53');
  polygon(c, compact
    ? [[34,11],[46,11],[46,20],[28,20]]
    : [[45,10],[62,10],[62,20],[31,20]], '#8babad', null);
  line(c, compact ? [[50,9],[50,23]] : [[67,8],[68,23]], light, 2);
  polygon(c, [[4,25],[w-5,25],[w-5,28],[4,28]], light, null);
  box(c, 4, 30, w-9, 3.2, '#262e31', 0, null);
  line(c, compact ? [[49,24],[49,34],[75,34],[77,24]] : [[66,24],[66,34],[91,34],[94,24]], '#693d36', .65);
  box(c, compact ? 55 : 73, 25, 5, 1.5, '#d3cbb9', .5, null);
  box(c, w-10, 25, 7, 5, '#e6dab4', 1);
  box(c, 2, 26, 4, 5, '#d47650', .5);
  box(c, w-12, 35, 11, 2.5, '#b6b5a9', .6);
  box(c, 1, 35, 10, 2.5, '#b6b5a9', .6);
  tire(c, 23, 35, 8.5);
  tire(c, front, 35, 8.5);
  // A subtle bonnet stripe reads at gameplay size without adding visual noise.
  line(c, [[w-33,23],[w-8,25]], '#e0caa5', 1.5);
}

function pickup(c) {
  polygon(c, [[3,24],[52,24],[58,5],[91,5],[108,26],[134,29],[137,42],[127,47],[12,47],[3,40]], '#bfa676');
  polygon(c, [[58,23],[62,9],[87,9],[99,25]], '#3c545a');
  polygon(c, [[63,10],[73,10],[73,23],[60,23]], '#8ea6a1', null);
  line(c, [[79,8],[79,25]], '#dcc89b', 2);
  box(c, 6, 24, 44, 5, '#d9c79c', 1);
  line(c, [[6,30],[49,30],[49,40]], '#8c7757', 1);
  line(c, [[56,26],[56,43],[98,43],[100,27]], '#8c7757', .8);
  box(c, 61, 28, 7, 2, '#d4d5c5', .5);
  box(c, 3, 41, 132, 5, '#4b5350', 1, null);
  box(c, 127, 30, 10, 6, '#e9ddba', 1);
  line(c, [[129,38],[138,38]], '#343f41', 2);
  box(c, 125, 44, 14, 3, '#c9c8b8', .7);
  box(c, 1, 43, 10, 3, '#c9c8b8', .7);
  tire(c, 27, 44, 11);
  tire(c, 113, 44, 11);
  line(c, [[5,49],[13,49]], '#393f3d', 2);
}

function eyes(c, x, y, size = 3) {
  oval(c, x-size*.72, y, size, size*1.15, '#faf5e5', INK, .6);
  oval(c, x+size*.85, y, size, size*1.15, '#faf5e5', INK, .6);
  oval(c, x-size*.35, y+.25, .72, .9, INK, null);
  oval(c, x+size*1.22, y+.25, .72, .9, INK, null);
}

function couch(c) {
  box(c, 9, 48, 118, 32, '#ad6848', 8);
  box(c, 14, 51, 108, 25, '#bf7d54', 5);
  // Marge: her hair is a single silhouette, not a stack of outlined paper pieces.
  polygon(c, [[76,41],[69,32],[70,12],[73,4],[78,3],[82,5],[87,3],[91,7],[93,27],[89,40]], '#426a8c');
  box(c, 74, 35, 15, 22, YELLOW, 6);
  eyes(c, 81, 44, 2.8);
  oval(c, 86, 48, 4, 2.4, YELLOW);
  polygon(c, [[75,55],[89,54],[96,74],[69,74]], '#8aa85d');
  for (let i = 0; i < 5; i++) oval(c, 75+i*3, 55, 1.6, 1.6, '#bf6849', null);
  // Homer and his white polo, laid over the sofa back.
  oval(c, 53, 45, 12, 16, YELLOW);
  line(c, [[47,31],[50,28],[53,31]], INK, .7);
  line(c, [[53,30],[57,28],[60,31]], INK, .7);
  eyes(c, 55, 43, 3.4);
  oval(c, 57, 52, 9, 5.6, '#c6a16a');
  line(c, [[53,53],[61,54]], INK, .65);
  polygon(c, [[42,57],[57,58],[64,62],[65,74],[36,74],[37,63]], '#ebe7d4');
  polygon(c, [[45,58],[49,64],[53,59]], '#ddd8c4');
  box(c, 38, 71, 11, 11, '#5d7b91', 3);
  box(c, 52, 71, 11, 11, '#5d7b91', 3);
  // Bart's flat zig-zag hair and orange shirt.
  polygon(c, [[17,54],[17,35],[21,38],[24,34],[27,38],[30,34],[33,38],[35,36],[35,53],[30,59],[21,59]], YELLOW);
  eyes(c, 28, 45, 3.2);
  oval(c, 33, 50, 4, 2, YELLOW);
  polygon(c, [[19,57],[33,57],[38,72],[16,72]], '#ce6741');
  box(c, 19, 70, 15, 10, '#6b91aa', 2);
  // Lisa's starburst head, pearl necklace and red dress.
  polygon(c, [[102,53],[98,48],[101,44],[98,39],[104,38],[106,33],[111,37],[116,34],[118,40],[123,41],[120,47],[123,51],[116,55],[111,59],[105,56]], YELLOW);
  eyes(c, 111, 45, 3.1);
  oval(c, 117, 49, 4, 2, YELLOW);
  polygon(c, [[104,57],[116,57],[122,74],[99,74]], '#c85f45');
  for (let i = 0; i < 4; i++) oval(c, 105+i*3, 57, 1.2, 1.3, '#eee8d2', null);
  // Maggie sits between her parents, with blue bow and a red pacifier.
  polygon(c, [[66,65],[62,61],[65,58],[65,54],[70,55],[74,52],[77,57],[80,59],[77,64],[72,68]], YELLOW);
  polygon(c, [[68,55],[65,50],[71,52],[75,49],[76,55]], '#74a9b9');
  eyes(c, 71, 61, 2.2);
  oval(c, 73, 65, 2, 1.5, '#ba5949');
  polygon(c, [[66,68],[76,67],[81,77],[61,77]], '#7faebb');
  box(c, 6, 67, 12, 15, '#a55d40', 4);
  box(c, 119, 67, 12, 15, '#a55d40', 4);
  box(c, 17, 78, 103, 5, '#a55d40', 2);
  box(c, 13, 82, 9, 3, '#513c31', 1);
  box(c, 114, 82, 9, 3, '#513c31', 1);
  line(c, [[43,78],[43,82]], '#814b36', .7);
  line(c, [[92,78],[92,82]], '#814b36', .7);
}

function pavilion(c) {
  // Architectural caricature only: striped island pavilion, empty doorway, gold dome.
  box(c, 13, 35, 74, 42, '#dfd7bd', .5);
  for (const y of [41, 53, 65]) box(c, 14, y, 72, 6, '#628c9b', 0, null);
  polygon(c, [[10,35],[16,30],[84,30],[91,35]], '#eee3c4');
  c.beginPath(); c.moveTo(31,29); c.bezierCurveTo(30,18,37,11,50,8); c.bezierCurveTo(63,11,70,18,69,29); c.closePath();
  c.fillStyle = '#bd9f57'; c.fill(); c.strokeStyle = INK; c.lineWidth = .9; c.stroke();
  line(c, [[50,9],[46,19],[46,28]], '#dfc780', 1);
  line(c, [[50,8],[50,4]], '#a98e4d', 2);
  oval(c, 50, 4, 1.6, 1.6, '#d2b56b');
  box(c, 29, 28, 42, 4, '#b59959', .5);
  box(c, 39, 45, 22, 32, '#344b54', 5);
  box(c, 43, 50, 14, 27, '#243840', 2, null);
  for (const x of [19, 30, 65, 76]) box(c, x, 36, 5, 39, '#e8dec0', .5);
  box(c, 10, 75, 80, 3, '#beb69c', .5);
  box(c, 6, 78, 88, 2, '#ded2b2', .5);
}

function logo(c, id, w, h) {
  c.save(); c.translate(w/2, h/2);
  if (id === 'claude') {
    const points = [];
    for (let i = 0; i < 32; i++) {
      const angle = i*Math.PI/16, radius = i%2 ? w*.25 : w*.49;
      points.push([Math.cos(angle)*radius, Math.sin(angle)*radius*.86]);
    }
    polygon(c, points, '#cb8669');
  } else if (id === 'gemini') {
    polygon(c, [[0,-h/2],[9,-13],[w/2,0],[9,13],[0,h/2],[-9,13],[-w/2,0],[-9,-13]], '#82a7df');
    polygon(c, [[0,-h/2],[0,0],[-w/2,0],[-9,-13]], '#a5b5df', null);
    polygon(c, [[0,0],[w/2,0],[9,13],[0,h/2]], '#8295cf', null);
  } else {
    const ribbon = [[0,-28],[19,-28],[29,-10],[20,7],[0,7],[-9,-10],[0,-28]];
    c.save(); c.scale(.94, .94);
    // Paint the complete six-lobed silhouette first. No individual white ribbon edges.
    for (let i = 0; i < 6; i++) {
      c.save(); c.rotate(i*Math.PI/3); polygon(c, ribbon, '#62a98e', null); c.restore();
    }
    // Fine ink joins describe the interwoven motif inside the one paper cutout.
    for (let i = 0; i < 6; i++) {
      c.save(); c.rotate(i*Math.PI/3);
      line(c, [[0,-28],[19,-28],[29,-10],[20,7]], '#31594d', .8);
      line(c, [[1,-22],[15,-22],[22,-10],[16,1]], '#b1d0ad', 1.5);
      c.restore();
    }
    c.restore();
  }
  // Preserve the original oversized, left-looking mascot eyes.
  for (const x of [-10,10]) {
    oval(c, x, -1, 10, 12, '#fff8ed');
    oval(c, x-3, 0, 3, 4, '#172127', null);
  }
  c.restore();
}

function pump(c) {
  box(c, 5, 1, 36, 71, '#ded5c0', 4);
  box(c, 8, 4, 30, 65, '#b64c3d', 3);
  box(c, 10, 11, 25, 23, '#24343d', 2);
  box(c, 10, 47, 28, 17, '#e9d9b9', 2);
  c.textAlign = 'center'; c.textBaseline = 'alphabetic';
  c.font = 'bold 12px system-ui, sans-serif';
  c.fillStyle = '#e1f2bd'; c.fillText('V8', 22, 28);
  c.font = 'bold 10px system-ui, sans-serif';
  c.fillStyle = '#713e31'; c.fillText('OIL', 24, 59);
  line(c, [[40,19],[47,12],[51,17],[51,55],[45,59],[42,55],[42,39]], INK, 5);
  line(c, [[40,19],[47,12],[49,17],[49,54]], '#52605c', 1);
  box(c, 39, 37, 6, 11, '#303b3b', 1);
  box(c, 2, 70, 48, 7, '#d8cbb0', 2);
}

const EXISTING_PROP_TYPES = [
  { id: 'openai', w: 70, h: 68 },
  { id: 'claude', w: 84, h: 73 },
  { id: 'gemini', w: 58, h: 78 },
  { id: 'pump', w: 54, h: 78 },
];

const painters = {
  muscleCoupe: c => muscle(c, false),
  muscleCompact: c => muscle(c, true),
  pickup,
  simpsonsCouch: couch,
  islandPavilion: pavilion,
  openai: c => logo(c, 'openai', 70, 68),
  claude: c => logo(c, 'claude', 84, 73),
  gemini: c => logo(c, 'gemini', 58, 78),
  pump,
};

function canvas(w, h) {
  const result = document.createElement('canvas');
  result.width = w; result.height = h;
  return result;
}

function bake(type) {
  const width = (type.w + PAD*2)*RESOLUTION;
  const height = (type.h + PAD*2)*RESOLUTION;
  const art = canvas(width, height);
  const c = art.getContext('2d');
  c.scale(RESOLUTION, RESOLUTION);
  c.translate(PAD, PAD);
  c.lineJoin = 'round'; c.lineCap = 'round';
  painters[type.id](c);
  // Deterministic low-contrast paper fibres are clipped to the complete prop.
  c.globalCompositeOperation = 'source-atop';
  for (let i = 0; i < 85; i++) {
    const x = (i*43.71)%type.w, y = (i*17.39)%type.h;
    line(c, [[x,y],[x+2+(i%4),y-.4]], i%2 ? '#fff8e50a' : '#302e2709', .35);
  }
  c.globalCompositeOperation = 'source-over';
  const mask = canvas(width, height);
  const m = mask.getContext('2d');
  m.drawImage(art, 0, 0);
  m.globalCompositeOperation = 'source-in';
  m.fillStyle = PAPER; m.fillRect(0, 0, width, height);
  const result = canvas(width, height);
  const r = result.getContext('2d');
  for (let i = 0; i < 24; i++) {
    const a = i*Math.PI/12;
    r.drawImage(mask, Math.cos(a)*BORDER*RESOLUTION, Math.sin(a)*BORDER*RESOLUTION);
  }
  r.drawImage(art, 0, 0);
  return result;
}

export function createPropRenderer() {
  const cache = new Map();
  const catalog = new Map([...PROP_TYPES, ...EXISTING_PROP_TYPES].map(type => [type.id, type]));
  return {
    // Origin is the centre of the obstacle at ground level, matching main's renderer.
    draw(ctx, id, w, h) {
      const type = catalog.get(id);
      if (!type) return false;
      if (!cache.has(id)) cache.set(id, bake(type));
      const fit = Math.min(w/type.w, h/type.h);
      ctx.drawImage(cache.get(id), -(type.w/2+PAD)*fit, -(type.h+PAD)*fit,
        (type.w+PAD*2)*fit, (type.h+PAD*2)*fit);
      return true;
    },
  };
}
