import {basePace} from '../src/gameplay-config.js';
// A speed fixture must not jump to a different base on its first simulation tick.
export function progressAt(base){let lo=0,hi=150;for(let i=0;i<50;i++){const mid=(lo+hi)/2;if(basePace(mid)<base)lo=mid;else hi=mid;}return (lo+hi)/2;}
