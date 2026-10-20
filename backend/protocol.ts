import {validateReplay,RULESET} from './rulesets/roadster-v341/run.js';
export {RULESET};
export type Replay={format:1;ruleset:string;seed:number;ticks:number;events:[number,number][]};
export class HttpError extends Error {status:number;code:string;constructor(status:number,code:string){super(code);this.status=status;this.code=code;}}
export function object(value:unknown):Record<string,unknown>{if(!value||typeof value!=='object'||Array.isArray(value))throw new HttpError(400,'invalid_body');return value as Record<string,unknown>;}
function isReplay(value:unknown):value is Replay{try{validateReplay(value);return true;}catch{return false;}}
export function replay(value:unknown):Replay{if(!isReplay(value))throw new HttpError(400,'invalid_replay');return {format:1,ruleset:value.ruleset,seed:value.seed,ticks:value.ticks,events:value.events.map(e=>[e[0],e[1]])};}
export function nickname(value:unknown):string{if(typeof value!=='string')throw new HttpError(400,'invalid_nickname');const name=value.normalize('NFKC').trim().replace(/ +/g,' ');if([...name].length<3||[...name].length>12||! /^[\p{L}\p{N} _-]+$/u.test(name))throw new HttpError(400,'invalid_nickname');return name;}
export function uuid(value:unknown):string{if(typeof value!=='string'||! /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value))throw new HttpError(400,'invalid_id');return value;}
export async function readJSON(request:Request,maxBytes=524288):Promise<unknown>{
 if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))throw new HttpError(415,'json_required');
 if(Number(request.headers.get('content-length'))>maxBytes)throw new HttpError(413,'body_too_large');
 const reader=request.body?.getReader();if(!reader)throw new HttpError(400,'invalid_body');let size=0;const chunks:Uint8Array[]=[];
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>maxBytes){await reader.cancel();throw new HttpError(413,'body_too_large');}chunks.push(value);}}finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 try{return JSON.parse(new TextDecoder('utf-8',{fatal:true,ignoreBOM:false}).decode(bytes));}catch{throw new HttpError(400,'invalid_json');}
}
