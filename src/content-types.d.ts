export type Reaction = {enabled:false} | {enabled:true; animationId:string; trigger:'near'|'airborne-near'|'passage'; range:number};
export interface LegacyObstacle {id:string; name:string; w:number; h:number; inset?:number; altitude?:number; approachSpeed?:number}
export interface Visual {renderer:'photo'|'cutout'|'character'|'prop'|'drone'; key:string; assets:string[]; bob:boolean}
export interface ObstacleDefinition extends LegacyObstacle {
 definitionVersion:number; category:string; placement:'ground'|'air'; anchor:'ground-center'|'air-bottom-center';
 biomes:'all'|string[]; visual:Visual; collision:'box'|'trampoline';
 reactions:{hero:Reaction; obstacle:Reaction}; collectible:boolean; provenance:string;
}
export interface DefinitionOptions {renderer?:Visual['renderer']; key?:string; assets?:string[]; category?:string; biomes?:ObstacleDefinition['biomes']; collision?:ObstacleDefinition['collision']; hero?:Reaction; obstacle?:Reaction; bob?:boolean}
