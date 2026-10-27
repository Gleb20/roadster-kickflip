import {resourceUrl} from './content-runtime.js?v=4.13.1';
// One photographic atlas, decoded and trimmed once; ground anchors never depend on padding.
const CELLS = Object.freeze({
  v8: [0, 70, 591, 250],
  truck: [592, 70, 590, 250],
  muscleCoupe: [1183, 70, 591, 250],
  muscleCompact: [0, 480, 591, 270],
  pickup: [592, 480, 590, 270],
  amberHead: [1245, 350, 500, 525],
});

function surface(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  return canvas;
}

function extract(image, [x, y, w, h]) {
  const art = surface(w, h), c = art.getContext('2d', {willReadFrequently: true});
  c.drawImage(image, x, y, w, h, 0, 0, w, h);
  const pixels = c.getImageData(0, 0, w, h), d = pixels.data;
  const visited = new Uint8Array(w*h), queue = new Int32Array(w*h);
  let largest = [];
  // Remove disconnected atlas specks without keying out paint, skin, chrome or eyes.
  for (let seed = 0; seed < w*h; seed++) {
    if (visited[seed] || d[seed*4+3] < 32) continue;
    let start = 0, end = 1; queue[0] = seed; visited[seed] = 1;
    while (start < end) {
      const i = queue[start++], px = i%w, py = Math.floor(i/w);
      for (const j of [px ? i-1 : -1, px<w-1 ? i+1 : -1, py ? i-w : -1, py<h-1 ? i+w : -1]) {
        if (j >= 0 && !visited[j] && d[j*4+3] >= 32) { visited[j] = 1; queue[end++] = j; }
      }
    }
    if (end > largest.length) largest = queue.slice(0, end);
  }
  if (!largest.length) throw new Error('Empty photo cutout');
  visited.fill(0);
  let left=w, top=h, right=0, bottom=0;
  for (const i of largest) {
    visited[i]=1; const px=i%w, py=Math.floor(i/w);
    left=Math.min(left,px); right=Math.max(right,px); top=Math.min(top,py); bottom=Math.max(bottom,py);
  }
  for(let i=0;i<w*h;i++) if(!visited[i]) d[i*4+3]=0;
  c.putImageData(pixels,0,0);
  const result=surface(right-left+1,bottom-top+1);
  result.getContext('2d').drawImage(art,left,top,result.width,result.height,0,0,result.width,result.height);
  return result;
}

export function createPhotoRenderer() {
  const sprites = new Map(), ground = new Map();
  return {
    async load() {
      const image = new Image();
      image.src = resourceUrl(new URL('../obstacle-photos.png', import.meta.url).href);
      await image.decode();
      for (const [id, cell] of Object.entries(CELLS)) sprites.set(id, extract(image, cell));
    },
    has(id) { return Object.hasOwn(CELLS,id); },
    draw(ctx,id,x,y,w,h) {
      const image=sprites.get(id);
      if(!image) return false;
      const fit=Math.min(w/image.width,h/image.height),dw=image.width*fit,dh=image.height*fit;
      ctx.drawImage(image,x+(w-dw)/2,y+(h-dh)/2,dw,dh);
      return true;
    },
    drawGround(ctx,id,w,h) {
      const image=sprites.get(id);
      if(!image) return false;
      const key=`${id}:${w}:${h}`;
      if(!ground.has(key)) {
        const fit=Math.min(w/image.width,h/image.height),dw=image.width*fit,dh=image.height*fit;
        const pad=3,res=3,art=surface(Math.ceil((dw+pad*2)*res),Math.ceil((dh+pad*2)*res));
        const mask=surface(art.width,art.height),m=mask.getContext('2d'),c=art.getContext('2d');
        m.drawImage(image,pad*res,pad*res,dw*res,dh*res);
        m.globalCompositeOperation='source-in';m.fillStyle='#f4eedf';m.fillRect(0,0,mask.width,mask.height);
        for(let i=0;i<16;i++){const a=i*Math.PI/8;c.drawImage(mask,Math.cos(a)*1.4*res,Math.sin(a)*1.4*res);}
        c.drawImage(image,pad*res,pad*res,dw*res,dh*res);
        ground.set(key,{art,dw,dh,pad,res});
      }
      const a=ground.get(key);
      ctx.drawImage(a.art,-a.dw/2-a.pad,-a.dh-a.pad,a.art.width/a.res,a.art.height/a.res);
      return true;
    },
  };
}
