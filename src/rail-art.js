/** Image-generated cutout, kept separate from deterministic rail geometry. */
export function createRailPainter(){
 const image=new Image();
 return {
  load(){image.src=new URL('../assets/rails/v440/rail.png',import.meta.url).href;return image.decode();},
  draw(ctx,rails,{px,ground,scale}){for(const r of rails){const x=px+r.x*scale,w=r.w*scale;if(x+w< -10||x>ctx.canvas.width)continue;const h=w*image.height/image.width;ctx.drawImage(image,x,ground-r.h*scale,w,h);}},
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
