import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
const root=process.argv[2]||'/tmp/tesla-audio-v450-20261023';
const {createFlight,launch,advanceFlight,uprightError}=await import(pathToFileURL(path.join(root,'src/gameplay.js')));
const dt=1/120,deg=x=>x*180/Math.PI,rows=[];
for(const height of [0,190])for(const factor of [1,1.25])for(const charge of [.5,1])for(const hold of [.7,.8,.9,1,1.1]){
 const p=createFlight();p.jumpFactor=factor;launch(p,charge);p.y+=height;
 let release=null,firstSafe=null,result=null;
 for(let tick=0;tick<1200;tick++){
  const t=tick*dt,spin=t<hold;
  if(!spin&&!release)release={time:t,angle:deg(p.angle),omega:p.omega,y:p.y};
  result=advanceFlight(p,dt,{spin});
  if(release&&!firstSafe&&Math.abs(uprightError(p.angle))<=Math.PI*2/9&&Math.abs(p.omega)<=Math.PI*4/3)firstSafe={time:t+dt,angle:deg(p.angle),y:p.y};
  if(result){result={...result,angle:deg(result.angle),time:t+dt};break;}
 }
 rows.push({height,factor,charge,hold,release,firstSafe,result,passiveOverrun:!!firstSafe&&!result?.good});
}
const output={base:root,dt,kind:'Controlled flight fixtures, not player success rates. Elevated launch uses same y offset as rail jump.',residualDegreesPerSecond:deg(1.8),rows};
const file=path.join(path.dirname(fileURLToPath(import.meta.url)),'baseline.json');fs.writeFileSync(file,JSON.stringify(output,null,2));
console.log(JSON.stringify({cases:rows.length,passiveOverrunCases:rows.filter(r=>r.passiveOverrun).length,examples:rows.filter(r=>r.passiveOverrun).slice(0,5)},null,2));
