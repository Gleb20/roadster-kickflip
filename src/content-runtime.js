import {BUNDLED} from './content-bundle.js?v=4.13.0';
import {freezeContent,validatePackage} from './content-package.js?v=4.13.0';
const draft=globalThis.__TESLA_CONTENT_PREVIEW__;
export const previewContent=!!draft;
export const CONTENT=freezeContent(draft?.package||BUNDLED);
const errors=validatePackage(CONTENT);if(errors.length)throw Error('Content package: '+errors.join('; '));
export function resourceUrl(value){const root=new URL('../',import.meta.url),url=new URL(value,root);const path=url.href.startsWith(root.href)?url.href.slice(root.href.length).split('?')[0]:String(value);return draft?.urls?.[path]||value;}
export const CONTENT_ID=CONTENT.version+':'+(CONTENT.contentHash||'draft');
