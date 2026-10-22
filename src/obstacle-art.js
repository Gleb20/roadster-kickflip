/** Shared painter for the game and neutral collection portraits. */
export function createObstaclePainter({ctx,characters,photos,props,cutout,droneSprite,definition,enemySprites}){
 const characterPainters={joe:characters.joe,amber:characters.amber,rogozin:characters.rogozin,zuck:characters.zuckerberg,trump:characters.trumpPose};
 return (o,bob=0)=>{
  const visual=definition(o.id)?.visual;if(!visual)return false;
  if(visual.renderer==='sprite')return enemySprites?.draw(ctx,visual.key,o.w,o.h);
  if(visual.renderer==='drone'){ctx.drawImage(droneSprite,-o.w/2,-o.h,o.w,o.h);return true;}
  if(visual.renderer==='character')return characterPainters[visual.key]?.(o,bob);
  if(visual.renderer==='photo')return photos.drawGround(ctx,visual.key,o.w,o.h);
  if(visual.renderer==='cutout')return cutout(visual.key,-o.w/2,-o.h+bob,o.w,o.h,ctx);
  return props.draw(ctx,visual.key,o.w,o.h);
 };
}
