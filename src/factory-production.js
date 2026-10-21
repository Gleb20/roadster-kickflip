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

const smooth=n=>{const x=Math.max(0,Math.min(1,n));return x*x*x*(x*(x*6-15)+10);};
// Pick from the station tray, lift clear, fit, then retract continuously.
export function assemblyAction(time,index){
 const age=time-index*5,back=1-smooth((age-5)/1.25);
 return {pickup:smooth((age-.3)/1.4)*back,reach:smooth((age-2)/2.4)*back,carry:smooth((age-1.8)/.2)*(1-smooth((age-4.8)/.2))};
}
export const FACTORY_DEPTH=Object.freeze({wall:.002,storage:.006,lineScale:.78});
const restPoses=[[-10,-100,-.4],[35,-118,.3],[-20,-72,-.85],[65,-104,-1.35]];
// Stable station identity; no frame-time random calls or shared replay state.
export function robotIdlePose(index,time,reducedMotion=false){
 const variant=((index%4)+4)%4,[x,y,angle]=restPoses[variant];
 if(reducedMotion)return {x,y,angle,carry:0,variant};
 const phase=((time*.82+index*2.13)%10+10)%10;
 let pickup=0;
 if(phase<2.5)pickup=smooth((phase-.8)/1.3);
 else if(phase<6)pickup=1-smooth((phase-2.5)/1.7);
 else if(phase<8)pickup=smooth((phase-6)/1.4);
 else pickup=1-smooth((phase-8)/1.5);
 const idle=1-pickup,wave=time*.65+index*1.7;
 return {x:x*idle+76*pickup+Math.sin(wave)*3*idle,y:y*idle-22*pickup+Math.cos(wave*.8)*2.5*idle,angle:angle*idle+Math.sin(wave+.9)*.07*idle,carry:smooth((phase-2.15)/.25)*(1-smooth((phase-7.4)/.3)),variant};
}
