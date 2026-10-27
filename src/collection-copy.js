import {OBSTACLES} from './content.js?v=4.13.1';
export const COLLECTION_COPY=Object.freeze(Object.fromEntries(OBSTACLES.map(o=>[o.id,[o.displayName,o.description]])));
