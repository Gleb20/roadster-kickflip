import {createRpc} from './handler.mjs';
import {createWorker,createWorkerHandler} from './worker.mjs';
const secrets=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}');
const key=secrets.default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
if(!key)throw Error('Service credentials unavailable');
const work=createWorker({rpc:createRpc({url:Deno.env.get('SUPABASE_URL'),key})});
Deno.serve(createWorkerHandler({work,secret:Deno.env.get('TESLA_RANKING_WORKER_SECRET')}));
