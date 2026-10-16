const clamp=v=>Math.max(0,Math.min(1,v));
const ease=v=>{v=clamp(v);return v*v*(3-2*v)};
/** Distance-driven choreography: continues across a jump and freezes with pause. */
export function joeReaction(dx){
  if(!Number.isFinite(dx)||dx>=650||dx<=-480)return {reach:0,inhale:0,meme:0,smoke:0};
  const reach=ease((650-dx)/240)*(1-ease((-dx-230)/250));
  const inhale=ease((410-dx)/150)*(1-ease((40-dx)/100));
  const meme=ease((100-dx)/160)*(1-ease((-dx-210)/230));
  const smoke=ease((80-dx)/160)*(1-ease((-dx-190)/250));
  return {reach,inhale,meme,smoke};
}
