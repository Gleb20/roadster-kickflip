/** Serializable uint32 PRNG. No renderer, viewport or global Math.random input. */
export function createRandom(seed){
 if(!Number.isInteger(seed)||seed<0||seed>0xffffffff)throw Error('Invalid run seed');
 let state=seed;
 return {next(){state=(state+0x6d2b79f5)>>>0;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;},get state(){return state;},restore(value){if(!Number.isInteger(value)||value<0||value>0xffffffff)throw Error('Invalid random state');state=value;}};
}
