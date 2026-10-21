// Decorative state only. Never consumes the replay/director random stream.
export const FACTORY_MODELS=Object.freeze(['model-s','model-x','roadster','cybertruck']);
export const FACTORY_COLORS=Object.freeze(['red','blue','white']);
export const PRODUCTION_SECONDS=30;
const pick=(items,previous,random)=>{const choices=items.filter(v=>v!==previous);return choices[Math.min(choices.length-1,Math.max(0,Math.floor(random()*choices.length)))];};
export function createFactoryProduction(random=Math.random){
 let visit=null,lastModel=null,lastColor=null;
 return {
  reset(){visit=null;},
  update(biome,time){
   const entering=biome.id==='tesla-factory';
   if(!entering&&!(visit&&biome.moving&&biome.from==='tesla-factory'))return;
   if(entering&&visit?.leg!==biome.leg){
    lastModel=pick(FACTORY_MODELS,lastModel,random);
    lastColor=lastModel==='cybertruck'?'steel':pick(FACTORY_COLORS,lastColor,random);
    visit={leg:biome.leg,model:lastModel,color:lastColor,start:time,cycle:0,elapsed:0};
   }
   const elapsed=Math.max(0,time-visit.start),cycle=Math.floor(elapsed/PRODUCTION_SECONDS);
   while(visit.cycle<cycle){visit.cycle++;if(visit.model!=='cybertruck')lastColor=visit.color=pick(FACTORY_COLORS,lastColor,random);}
   visit.elapsed=elapsed%PRODUCTION_SECONDS;
  },
  get state(){return visit?{...visit,stage:Math.min(4,Math.floor(visit.elapsed/5))}:null;},
 };
}
