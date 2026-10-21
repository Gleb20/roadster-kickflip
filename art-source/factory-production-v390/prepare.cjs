const fs=require('fs'),path=require('path'),crypto=require('crypto'),sharp=require(process.env.SHARP_MODULE||'sharp');
const root=path.resolve(process.argv[2]||'.'),dest=path.resolve(process.argv[3]||'.'),out=dest+'/assets/factory',records=[];
async function save(id,source,{region,width}={}){const input=root+'/'+source;let img=sharp(input);if(region)img=img.extract(region);if(width)img=img.resize({width});const file=out+'/'+id+'.png';await img.png().toFile(file);const m=await sharp(file).metadata();records.push({id,file:'assets/factory/'+id+'.png',source,region:region||null,size:[m.width,m.height],sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')});}
(async()=>{const packet='assets/concepts/factory-assembly-20261021/';for(const id of ['robot-base','robot-upper','robot-fore','tool-grip','tool-paint','conveyor-cutout','rack-cutout'])await save('assembly-'+id,packet+id+'.png');
for(const model of ['model-s','model-x','roadster','cybertruck']){
 const colors=model==='cybertruck'?['steel']:['red','blue','white'];for(const color of colors)for(let stage=0;stage<5;stage++){const id=`${model}-${color}-${stage}`;await save(id,'assets/concepts/factory-lineup-20261021/'+id+'.png');}
 const source=`assets/concepts/factory-lineup-20261021/${model}-parts.png`,m=await sharp(root+'/'+source).metadata();
 // Cells follow the approved atlas. Trim actual alpha bounds inside each cell, never paint or stretch.
 for(const [id,index] of [['door',0],['glass',4],['wheel',3]]){let cell;
 if(index===0)cell={left:0,top:0,width:Math.round(m.width*({'model-s':.36,'model-x':.35,roadster:.41,cybertruck:.375}[model])),height:Math.round(m.height*.54)};
 if(index===3)cell={left:0,top:Math.round(m.height*.54),width:Math.round(m.width*.26),height:m.height-Math.round(m.height*.54)};
 if(index===4)cell={left:Math.round(m.width*(model==='cybertruck'?.28:.26)),top:Math.round(m.height*.54),width:Math.round(m.width*(model==='cybertruck'?.26:.42)),height:m.height-Math.round(m.height*.54)};
 const {data,info}=await sharp(root+'/'+source).extract(cell).ensureAlpha().raw().toBuffer({resolveWithObject:true});const seen=new Uint8Array(info.width*info.height);let largest=[];
for(let pixel=0;pixel<seen.length;pixel++){if(seen[pixel]||data[pixel*4+3]<=100)continue;const component=[pixel];seen[pixel]=1;for(let q=0;q<component.length;q++){const n=component[q],x=n%info.width,y=Math.floor(n/info.width);for(const k of [x>0?n-1:-1,x+1<info.width?n+1:-1,y>0?n-info.width:-1,y+1<info.height?n+info.width:-1])if(k>=0&&!seen[k]&&data[k*4+3]>100){seen[k]=1;component.push(k);}}if(component.length>largest.length)largest=component;}
const keep=new Uint8Array(seen.length);for(const n of largest){const x=n%info.width,y=Math.floor(n/info.width);for(let yy=Math.max(0,y-1);yy<=Math.min(info.height-1,y+1);yy++)for(let xx=Math.max(0,x-1);xx<=Math.min(info.width-1,x+1);xx++)keep[yy*info.width+xx]=1;}
let l=info.width,t=info.height,r=0,b=0;for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(keep[y*info.width+x]&&data[(y*info.width+x)*4+3]>100){l=Math.min(l,x);r=Math.max(r,x+1);t=Math.min(t,y);b=Math.max(b,y+1)};
 for(let pixel=0;pixel<keep.length;pixel++)if(!keep[pixel])data[pixel*4+3]=0;
const normalized=`/private/tmp/${model}-part-${id}.png`;await sharp(data,{raw:{width:info.width,height:info.height,channels:4}}).extract({left:l,top:t,width:r-l,height:b-t}).resize({width:256}).png().toFile(normalized);
const final=out+`/${model}-part-${id}.png`;fs.copyFileSync(normalized,final);const sm=await sharp(final).metadata();records.push({id:`${model}-part-${id}`,file:`assets/factory/${model}-part-${id}.png`,source,cell,method:'Largest separate alpha island, original alpha/colour retained; proportional crop',size:[sm.width,sm.height],sha256:crypto.createHash('sha256').update(fs.readFileSync(final)).digest('hex')});
 }
}
fs.writeFileSync(dest+'/assets/factory/assembly-provenance.json',JSON.stringify({method:'Approved generated art: byte-preserving copies and proportional alpha crops. Original photo/prompt provenance retained in art-source packets. No new generation.',packets:['factory-assembly-20261021','factory-lineup-20261021'],records},null,2)+'\n');console.log(records.length+' prepared assets');})().catch(e=>{console.error(e);process.exit(1)});
