// Static paper props are rasterised once, including their shared outer cut line.
// All coordinates are authored at the declared aspect ratio; draw() fits, never stretches.
import {PROP_TYPES, OBSTACLES} from './content.js?v=4.11.0';
export {PROP_TYPES};

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

function eyes(c, x, y, size = 3) {
  oval(c, x-size*.72, y, size, size*1.15, '#faf5e5', INK, .6);
  oval(c, x+size*.85, y, size, size*1.15, '#faf5e5', INK, .6);
  oval(c, x-size*.35, y+.25, .72, .9, INK, null);
  oval(c, x+size*1.22, y+.25, .72, .9, INK, null);
}

function couch(c) {
  // The family uses the same round paper heads, oval eyes and mitten hands as the cast.
  box(c, 7, 46, 122, 35, '#ad6848', 7);
  box(c, 12, 50, 112, 25, '#bf7d54', 5);
  const face=(x,y,rx,ry)=>oval(c,x,y,rx,ry,YELLOW);
  const mouth=(x,y)=>line(c,[[x-3,y],[x+3,y]],INK,.7);
  // Marge: the beehive stays recognizable, the face becomes a South Park paper disk.
  polygon(c,[[73,40],[69,31],[70,10],[74,3],[79,4],[83,2],[89,5],[93,13],[92,31],[88,41]],'#426a8c');
  polygon(c,[[73,54],[89,54],[96,74],[68,74]],'#8aa85d');
  face(81,44,13,13); eyes(c,81,43,4.2); mouth(81,51);
  for(let i=0;i<5;i++) oval(c,75+i*3,56,1.5,1.5,'#bf6849',null);
  // Homer: short rounded head, white polo and blue trousers.
  polygon(c,[[39,57],[61,57],[66,74],[35,74]],'#ebe7d4');
  box(c,38,71,11,11,'#5d7b91',3); box(c,52,71,11,11,'#5d7b91',3);
  face(51,43,16,16);
  line(c,[[45,29],[48,26],[51,29]],INK,.7); line(c,[[51,28],[55,26],[58,30]],INK,.7);
  oval(c,51,51,9,6,'#c6a16a',null); eyes(c,51,41,4.8); mouth(51,53);
  oval(c,38,66,4,5,YELLOW,INK); oval(c,63,66,4,5,YELLOW,INK);
  // Bart: orange paper shirt and a compact spiky cap above the round face.
  polygon(c,[[17,57],[33,57],[38,73],[13,73]],'#ce6741');
  box(c,18,70,15,11,'#6b91aa',2); face(25,46,13,14);
  polygon(c,[[13,42],[13,31],[18,34],[21,30],[25,34],[29,30],[33,34],[37,31],[37,43]],YELLOW,null);
  eyes(c,25,45,4.2); mouth(25,54);
  oval(c,14,65,3.5,4,YELLOW,INK); oval(c,37,65,3.5,4,YELLOW,INK);
  // Lisa: star hair around a round paper face, red dress and necklace.
  polygon(c,[[103,56],[116,56],[123,74],[97,74]],'#c85f45');
  polygon(c,[[96,47],[92,39],[100,36],[101,29],[108,33],[114,28],[119,35],[126,36],[123,44],[127,50],[119,55],[111,61],[102,56]],YELLOW);
  face(110,45,12,12); eyes(c,110,43,4.1); mouth(110,52);
  for(let i=0;i<4;i++) oval(c,105+i*3,57,1.3,1.4,'#eee8d2',null);
  oval(c,99,66,3.5,4,YELLOW,INK); oval(c,122,66,3.5,4,YELLOW,INK);
  // Maggie sits in front; blue bow, round eyes and pacifier.
  polygon(c,[[65,67],[77,67],[82,78],[59,78]],'#7faebb');
  face(71,61,9,9); polygon(c,[[66,55],[63,49],[70,51],[76,48],[78,54]],'#74a9b9');
  eyes(c,71,60,3); oval(c,71,66,2.6,2,'#ba5949');
  box(c,5,67,12,15,'#a55d40',4); box(c,120,67,12,15,'#a55d40',4);
  box(c,17,78,103,5,'#a55d40',2); box(c,13,82,9,3,'#513c31',1); box(c,114,82,9,3,'#513c31',1);
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

const EXISTING_PROP_TYPES = OBSTACLES.filter(o=>o.visual.renderer==='prop');

const painters = {
  simpsonsCouch: couch,
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

export function createPropRenderer(photos) {
  const cache = new Map();
  const catalog = new Map([...PROP_TYPES, ...EXISTING_PROP_TYPES].map(type => [type.id, type]));
  return {
    // Origin is the centre of the obstacle at ground level, matching main's renderer.
    draw(ctx, id, w, h) {
      if (photos.drawGround(ctx, id, w, h)) return true;
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
