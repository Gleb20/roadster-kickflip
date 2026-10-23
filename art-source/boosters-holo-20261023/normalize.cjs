const sharp=require('sharp'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
(async()=>{const report=[];for(const id of ['shield','speed','jump','life','score']){
 const source=path.join(__dirname,'generated',id+'.png');
 const {data,info}=await sharp(source).trim({threshold:5}).resize(224,224,{fit:'inside'}).png().toBuffer({resolveWithObject:true});
 const left=Math.floor((256-info.width)/2),top=Math.floor((256-info.height)/2),out=path.join(root,'assets/boosters/holo-v431',id+'.png');
 await sharp(data).extend({left,right:256-info.width-left,top,bottom:256-info.height-top,background:'#0000'}).png().toFile(out);
 const {data:rgba,info:ri}=await sharp(out).ensureAlpha().raw().toBuffer({resolveWithObject:true});let min=255,max=0,partial=0;
 for(let i=3;i<rgba.length;i+=4){min=Math.min(min,rgba[i]);max=Math.max(max,rgba[i]);if(rgba[i]>0&&rgba[i]<255)partial++;}
 if(ri.width!==256||ri.height!==256||min!==0||max===0||!partial)throw Error('Bad sprite '+id);
 report.push({id,width:ri.width,height:ri.height,alphaMin:min,alphaMax:max,partialAlphaPixels:partial});
 }fs.writeFileSync(path.join(__dirname,'normalization.json'),JSON.stringify({method:'sharp trim threshold 5, aspect-preserving fit inside 224, centered transparent padding to 256; alpha retained',assets:report},null,2));console.log(report);})();
