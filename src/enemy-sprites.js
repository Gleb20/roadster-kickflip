import {resourceUrl} from './content-runtime.js?v=4.13.1';
import {ASSETS} from './content.js?v=4.13.1';
import {ENEMY_SPRITES} from './enemy-sprite-data.js';
export function createEnemySprites(){
 const images=new Map();
 return {
  async load(){await Promise.all(Object.keys(ENEMY_SPRITES).map(async id=>{const image=new Image();image.src=resourceUrl(ASSETS['encounter_'+id].file);await image.decode();images.set(id,image);}));},
  draw(ctx,id,w,h,{flip=false,alpha=1}={}){
   const image=images.get(id);if(!image)return false;
   ctx.save();ctx.globalAlpha*=alpha;if(flip)ctx.scale(-1,1);ctx.drawImage(image,-w/2,-h,w,h);ctx.restore();return true;
  },
  head(ctx){const image=images.get('reptileHead');if(!image)return false;ctx.drawImage(image,-33,-74,68,78);return true;},
 };
}
