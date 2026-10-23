// Observational play: charge, jump, flip/release, optional rail and air avoidance.
// This deliberately never reads director.route.actions or changes game state.
export function playInputs(r,state={lastLand:0,jumps:0},imperfect=false){
 const ground=r.S.obs.filter(o=>!o.altitude&&!o.passed&&!o.smashed).sort((a,b)=>a.x-b.x)[0],ttc=ground?(ground.x+(ground.inset||5)-47)/r.S.speed:Infinity;
 const air=r.S.obs.some(o=>o.altitude&&o.x+o.w> -50&&o.x/r.S.speed<2.4),rail=r.S.rails.find(o=>o.x+o.w>0),railT=rail?rail.x/r.S.speed:Infinity;
 if(!r.P.airborne&&!r.F.active&&r.pace.stumble<=0){
  if(!r.input.charging)r.command('primary-down');
  if(r.input.charge>=.75){if(r.G.support){if(rail&&rail.x+rail.w<170)r.command('primary-up');}
   else if(ttc<.55||rail&&railT<.9&&!air||ttc===Infinity&&!air&&!rail&&r.S.t-state.lastLand>.3)r.command('primary-up');}
 }else if(r.P.airborne&&!r.G.support){
  if(!r.P.trickStarted&&r.P.time>=.05)r.command('primary-down');
  const release=imperfect&&state.jumps%7===0?6.4:5;
  if(r.input.spin&&-r.P.angle>=release)r.command('primary-up');
 }
}
export function observePlay(r,state,events){for(const e of events){if(e.type==='landing')state.lastLand=r.S.t;if(e.type==='jump')state.jumps++;}}
