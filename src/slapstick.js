// A fictional visual gag: projectiles never participate in gameplay collisions.
export function createSlapstick() {
  const projectiles=[];
  return {
    projectiles,
    update(dt,obstacles,obstacleDx){
      for(const o of obstacles){
        if(o.id!=='amber')continue;
        if(o.throwAge!==undefined){o.throwAge+=dt;o.throwProgress=.4+.6*Math.min(1,o.throwAge/.65);}
        else if(obstacleDx(o)+o.w < -95){
          o.throwAge=0;o.throwProgress=.4;
          projectiles.push({age:0,x:Math.min(-90,obstacleDx(o)+o.w/2+34),height:62});
        }else{o.throwProgress=.28*Math.max(0,Math.min(1,(100-obstacleDx(o)-o.w)/110));}
      }
      for(const p of projectiles)p.age+=dt;
      for(let i=projectiles.length-1;i>=0;i--)if(projectiles[i].age>1.1)projectiles.splice(i,1);
    },
    draw(ctx,{px,ground,scale}){
      for(const p of projectiles){
        const t=Math.min(1,p.age/.8),x=p.x+35*Math.sin(t*Math.PI)-48*t;
        const height=Math.max(0,62*(1-t)+170*t*(1-t));
        ctx.save();ctx.translate(px+x*scale,ground-height*scale);ctx.scale(scale,scale);
        if(t<1){
          for(let i=1;i<7;i++){
            const size=2.5-i*.22;ctx.fillStyle=`rgba(117,72,40,${.55-i*.06})`;
            ctx.beginPath();ctx.ellipse(-i*4,2+i*1.7,size,size*.7,0,0,Math.PI*2);ctx.fill();
          }
          ctx.rotate(t*2.2);
          const oval=(x,y,rx,ry,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();};
          oval(0,4,10,5,'#56351f');oval(0,0,8,5,'#80522f');oval(0,-5,5.5,4,'#91623a');oval(2,-9,3,3,'#94663d');
          oval(-3,0,2,2.4,'#fff5db');oval(3,0,2,2.4,'#fff5db');oval(-3,.5,.8,1.1,'#25201c');oval(3,.5,.8,1.1,'#25201c');
          ctx.strokeStyle='#f5dfbd';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,2,3,0,Math.PI);ctx.stroke();
        }else{
          ctx.globalAlpha=Math.max(0,1-(p.age-.8)/.3);ctx.fillStyle='#765037';ctx.beginPath();ctx.ellipse(0,0,14,2.5,0,0,Math.PI*2);ctx.fill();
        }
        ctx.restore();
      }
    }
  };
}
