import {createHandler,createRpc} from './handler.mjs';
const secrets=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}');
const key=secrets.default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
if(!key)throw Error('Service credentials unavailable');
Deno.serve(createHandler({rpc:createRpc({url:Deno.env.get('SUPABASE_URL'),key})}));
