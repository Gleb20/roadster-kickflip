import {resourceUrl} from './content-runtime.js?v=4.13.0';
/** Image-generated cutout, kept separate from deterministic rail geometry. */
export function createRailPainter(){
 const image=new Image();
 return {
  load(){image.src=resourceUrl(new URL('../assets/rails/v440/rail.png',import.meta.url).href);return image.decode();},
  draw(ctx,rails,{px,ground,scale}){for(const r of rails){const x=px+r.x*scale,w=r.w*scale;if(x+w< -10||x>ctx.canvas.width)continue;// Preserve the photographed caps/posts and190-unit vertical geometry.
   // Only the clear middle span stretches horizontally for the discrete widths.
   const h=720*scale*image.height/image.width,cap=180*scale,sourceCap=image.width/4,y=ground-r.h*scale;
   ctx.drawImage(image,0,0,sourceCap,image.height,x,y,cap,h);
   ctx.drawImage(image,sourceCap,0,image.width-2*sourceCap,image.height,x+cap,y,w-2*cap,h);
   ctx.drawImage(image,image.width-sourceCap,0,sourceCap,image.height,x+w-cap,y,cap,h);}},
  sparks(ctx,g,{px,ground,scale,time,flight,reduced}){
   if(!g.support)return;
   ctx.save();ctx.translate(px,ground-(flight.y+8)*scale);ctx.scale(scale,scale);ctx.lineCap='round';
   // Contact stays legible at phone scale; reduced motion retains a static glint.
   ctx.strokeStyle='#fff0b2';ctx.lineWidth=Math.max(1.1/scale,1.6);ctx.globalAlpha=.95;
   ctx.beginPath();ctx.moveTo(-8,0);ctx.lineTo(3,0);ctx.stroke();
   if(!reduced)for(let i=0;i<12;i++){
    const t=(time*5.5+i/12+.14)%1,vx=38+i*3.4,vy=-24+(i%5)*10,x=-4-vx*t,y=vy*t+23*t*t;
    const length=7+8*t,dy=vy+46*t,n=Math.hypot(vx,dy),x2=x-vx/n*length,y2=y+dy/n*length;
    ctx.globalAlpha=(1-t)*.95;ctx.strokeStyle='#ffae42';ctx.lineWidth=Math.max(1.8/scale,2.4);
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();
    ctx.strokeStyle='#fff4c4';ctx.lineWidth=Math.max(.8/scale,1);ctx.stroke();
   }
   ctx.restore();
  }
 };
}
