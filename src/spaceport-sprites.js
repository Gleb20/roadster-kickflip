// One alpha atlas; all frames are cropped once, kept at a shared animation scale.
const CELLS = [
  [100,8,120,301], [320,8,307,304], [633,116,307,193], [946,220,300,90],
  [110,347,110,296], [410,347,130,296], [710,347,150,296], [1040,347,130,296],
  [20,666,292,245], [320,666,307,245], [632,666,310,245], [947,666,300,245],
  [20,917,292,329], [320,917,307,329], [632,917,310,329], [947,917,300,329],
];
CELLS.push([320,8,307,270], [320,278,307,34]);
export function createSpaceportSprites(){
  const frames=[];
  return {
    async load(){
      const image=new Image();image.src=new URL('../assets/spaceport/spaceport-atlas.png',import.meta.url).href;await image.decode();
      for(const [x,y,w,h] of CELLS){
        const c=document.createElement('canvas');c.width=w;c.height=h;
        const g=c.getContext('2d');g.drawImage(image,x,y,w,h,0,0,w,h);
        // Bake atmospheric tint once, with transparency intact. No per-frame filters.
        g.globalCompositeOperation='source-atop';g.fillStyle='#203b4938';g.fillRect(0,0,w,h);
        frames.push(c);
      }
    },
    draw(ctx,index,x,y,w,h,anchorY=1,alpha=1){
      const frame=frames[index];if(!frame)return;
      ctx.save();ctx.globalAlpha*=alpha;
      ctx.drawImage(frame,x-w/2,y-h*anchorY,w,h);ctx.restore();
    }
  };
}
