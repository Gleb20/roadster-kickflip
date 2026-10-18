// Deterministic packaging only: alpha bounds, proportional resizing, registered panels.
const sharp=require(process.env.SHARP_MODULE||'sharp');
const fs=require('node:fs');
const version=process.argv[2]||'v246';
if(!['v246','v247'].includes(version))throw new Error('Unknown cast source version');
const root='art-source/cast-'+version+'/',out='assets/characters/';
async function bounds(image){
 const {data,info}=await image.clone().ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let l=info.width,t=info.height,r=0,b=0;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>=128){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
 return {left:Math.max(0,l-2),top:Math.max(0,t-2),width:Math.min(info.width-1,r+2)-Math.max(0,l-2)+1,height:Math.min(info.height-1,b+2)-Math.max(0,t-2)+1};
}
(async()=>{
 const record={sources:{}};
 for(const id of ['bezos','katy']){
  const source=root+id+(fs.existsSync(root+id+'-alpha.png')?'-alpha.png':fs.existsSync(root+id+'-clean.png')?'-clean.png':'-generated.png'),meta=await sharp(source).metadata(),w=Math.floor(meta.width/2),frames=[];
  record.sources[id]=source;
  const panels=[];
  for(let i=0;i<2;i++){
   const panel=sharp(await sharp(source).extract({left:i*w,top:0,width:w,height:meta.height}).png().toBuffer());
   panels.push({panel,box:await bounds(panel)});
  }
  const common=version==='v247'?Math.min(...panels.flatMap(({box})=>[480/box.height,304/box.width])):null;
  for(let i=0;i<2;i++){
   const {panel,box}=panels[i],factor=common??Math.min(480/box.height,304/box.width),h=Math.round(box.height*factor),width=Math.round(box.width*factor);
   const image=await panel.extract(box).resize(width,h).png().toBuffer();
   // Common shoe baseline at 496; proportional fit inside a 304x480 safe area.
   frames.push({input:image,left:i*320+Math.round((320-width)/2),top:496-h});
   (record[id]??=[]).push({panel:i,sourceBounds:box,width,height:h});
  }
  await sharp({create:{width:640,height:512,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(frames).png().toFile(out+id+'-'+version+'.png');
 }
 const amber=sharp(root+'amber-generated.png'),box=await bounds(amber);record.amber={sourceBounds:box};record.sources.amber=root+'amber-generated.png';
 await amber.extract(box).resize(256,256,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toFile(out+'amber-head-'+version+'.png');
 fs.writeFileSync(root+'normalization.json',JSON.stringify(record,null,2));
 // Opaque preview backgrounds reveal actual alpha; never ship preview composites.
 const parts=[];for(const [i,id] of ['bezos','katy','amber'].entries()){
  const path=out+(id==='amber'?'amber-head':id)+'-'+version+'.png';
  const image=await sharp(path).resize({width:id==='amber'?210:400}).png().toBuffer();parts.push({input:image,left:i*440+10,top:30});
 }
 for(const [name,color] of [['dark','#172027'],['light','#f2eadc']])await sharp({create:{width:1320,height:400,channels:4,background:color}}).composite(parts).png().toFile(root+'alpha-'+name+'.png');
})().catch(e=>{console.error(e);process.exitCode=1});
