## Ruleset4.1.0 —late colliding aerial waves

Four-version dispatch preserves3.4.2,3.8.0 and4.0.0 and adds frozen4.1.0. `20261022140000_aerial_challenge_v410.sql` extends only the current deployed RPC ruleset guard, aborting on unexpected source. No table rows, permissions or security settings change. The current client retains old4.0 finished-score submission support. Xi and moving air hazards live in the ranked simulation; the vat remains decorative. Check all four manifests, chunk replay checkpoints and hosted incomplete-replay rejection before frontend publication.

## Ruleset4.0.0 encounters update —22October2026

`rulesets.mjs` dispatches frozen3.4.2,3.8.0 and4.0.0. The new frozen generator has ground-only templates and biome-eligible pools. Cosmetic encounters/lightning do not enter ranked simulation. `20261022130000_encounters_v400.sql` expands only the deployed RPC guard, aborting if the expected guard is absent; existing tables, data, role grants and gateway settings remain intact. The function bundle was deployed before the frontend.17 hosted checks confirm three-version sessions and rejection of incomplete fabricated-score replays; public scores remain19, fixture writes0. Reproduce using `node supabase/test-encounters-remote.mjs <output.json>`.

## Prepared3.8.0 compatibility update

rulesets.mjs dispatches explicitly to the untouched roadster-v3.4.2 and newly frozen roadster-v3.8.0 implementations. Session creation, replay parsing and resumed chunks use the declared version. Apply migrations/20261021110000_tuck_landing_v380.sql once to the existing project, then deploy the bundled tesla-ranking function with JWT gateway unchanged. The migration replaces the same service-only RPC body with two bounded changes: allow either ruleset on creation and store the requested supported ruleset in the new session. It preserves config flags, score epochv3, every row, grants and old checkpoints. No initial schema reapplication, score reset or data migration.

Deployment was separately authorized and completed on21 October2026; the downloaded bundle is byte-identical to the tested source. Local disposable PostgreSQL and dual-version verifier tests pass. For a frontend rollback, leave this additive server compatibility deployed, because it is required by clients that already cached3.8.0; keep all accepted data authoritative.

# Supabase staging ranking

Game hosting stays on GitHub Pages. This directory replaces the earlier Cloudflare/Render draft for the new candidate. That draft and its immutable 3.4.1 ruleset remain in their original clone/source branch. No existing Cloudflare staging resource is removed.

Target observed through the signed-in dashboard: Hype Train Games / `anzybyamdtouzxouhziu`, Free, eu-west-1. Supabase calls its default branch Production; this is not proof the project already hosts production data. Its public Table Editor and Functions list were empty. The plugin installation is confirmed, but no Supabase MCP project tools were exposed in this chat. The user explicitly approved this target project. The isolated schema and Edge Function are deployed and verified. Earlier approval rejections and scoped SQL corrections are resolved; the request to disable JWT was replaced with the standard enabled gateway plus a public publishable key. The current function source was downloaded as ZIP and matches the committed bundle byte for byte.

## API and trust

`handler.mjs` serves `/health`, `/sessions`, `/sessions/:id`, `/verify`, `/scores?page=N&snapshot=S` and `/scores/:publicId` under `/functions/v1/tesla-ranking/`. Browser writes require an allowed Origin; per-session operations additionally require a 256-bit capability. Only its SHA-256 is stored. The Supabase gateway remains enabled (`verify_jwt=true`); the browser supplies its deliberately public publishable key through apikey/Authorization and the private per-run token separately through X-Run-Capability. No player Auth account is created. No app table stores player IP, email or account information. Names are public, normalised, 3–12 letters/numbers/spaces/-/_. Origin checks do not replace capability or database authorisation.

`schema.sql` creates only the dedicated `tesla_ranking` schema, four RLS-protected tables, indexes and a service-only public RPC. Browser roles cannot execute the RPC or access private tables. The security-definer RPC has an empty search path and explicitly revoked PUBLIC/anon/authenticated execution; its role is to bridge the private schema, not player authentication. This arcade has no Supabase Auth accounts or auth.uid(). The Edge function validates per-run capabilities. The service key is obtained only from automatic server environment variables, never shipped to Pages. New secret keys and legacy service_role keys are supported.

Client score claims are discarded. Server-owned random seeds, elapsed-wall-time checks, canonical payload hashes and unique session IDs protect run identity and idempotence. Global session and submitted-byte budgets bound test usage; no raw IP is needed. Expired sessions/replays are removed in bounded batches on new-session creation after 7 additional days; public scores remain. In a quiet project cleanup is deferred until activity resumes.

## Bounded verification

`chunk.mjs` uses the exact frozen 3.4.2 simulation. Checkpoints come solely from private service state. A request processes at most 6,000 ticks and yields at a 400ms measured compute budget, checked every 32 ticks. This is a scheduling target, not a hard CPU guarantee: one route-search step can extend it. A lease/revision check commits each chunk atomically; retry resumes the stored checkpoint. The browser never uploads checkpoint state. It can close the dialog and keep playing; pending submissions survive reload and resume only on explicit retry. Processing is not autonomous while the browser is closed.

Hosted Supabase has a 2s CPU-per-request limit; wall time and background tasks do not bypass it. Local 32s/604s/3592s fixtures matched full verification exactly in 1/13/73 chunks; max local chunk ~669ms, checkpoint <=3333 bytes. The actual hosted 3594.54s fixture passed in 72 chunks, 57.44s total HTTP time; maximum HTTP request 2.32s includes networking and database I/O and is not a CPU measurement. All results matched the frozen simulation. The ordinary timing guard rejected this synthetic hour replay before a narrowly scoped QA-only start-time adjustment; the fixture was removed before release.

## Reproduce locally

- `npm test`; `npm run check` in repository root.
- `node --test supabase/tests/*.test.mjs`
- `node supabase/check-ruleset.mjs`
- Disposable SQL integration uses PGlite **0.5.10**, a development-only tool installed under `/tmp/tesla-pg-test`, not shipped to the game. Set `PGLITE_MODULE` to its `dist/index.js`; run `node supabase/make-sql-test.mjs` and `node supabase/test-database.mjs`.
- `node supabase/local-api.mjs` starts a disposable fixture DB/API on 8792 with 12 clearly named fixture rows. **Never deploy this helper.** Native browser suite `scripts/verify-online.cjs` accepts `BASE_URL` and optional `RANKING_PROXY`; use the proxy only for local tests. Without it the suite contacts the real Supabase API and creates test scores, so record and remove only those exact fixture IDs before opening the release to players.

## Deploy / reproduce in another approved empty project

1. Confirm current remote main, source freeze, target identity and unchanged migration preconditions. Inspect schemas as well as the public table list. Schema creation is intentionally not idempotent; an existing schema must stop deployment for inspection.
2. In the target SQL Editor run the current `test-schema.sql`; its transaction ends with ROLLBACK. Confirm PASS and absence of the test schema afterwards. Then apply `schema.sql` (or the same reviewed CLI-generated migration). Flags default false. Do not apply both.
3. Bundle `entry.mjs` to `functions/tesla-ranking/index.ts` with esbuild **0.28.2** (the available existing dev tool). Deploy `tesla-ranking` via the dashboard editor or authenticated CLI. `config.toml` specifies `verify_jwt=true`, matching the deployed dashboard. Preserve the enabled gateway and use the project public key in the browser. Per-run capabilities use X-Run-Capability, not the gateway Authorization header. The handler authenticates writes separately. Update online-config.js for a different project and regenerate PWA.
4. Confirm health and empty scores, anonymous RPC/table access denial, service-only privileges and Supabase advisors. No service secret may enter browser code, URLs or test evidence. Use the server-injected key. Do not print existing keys.
5. Enable only the one config row with a scoped WHERE; run actual API roundtrip, duplicates/conflicts, wrong-token/origin tests, pagination, reload retry, and hour-long stored-checkpoint verification. Collect actual hosted timings. Remove only explicitly recorded fixture IDs, not all rows. Then freeze candidate, test inverse and publish exact Pages tree with expected-head protection.
6. Keep the existing mobile game URL. Complete live asset-hash/PWA and real-input tests before reporting publication. Physical iPhone/Safari acceptance is the user's test.

A CLI **2.121.0** `migration new tesla_ranking_staging` created `migrations/20261020094057_tesla_ranking_staging.sql`. Its reviewed contents equal schema.sql. The identical schema was applied through the approved dashboard SQL Editor; no remote migration history was edited. Before later CLI-driven migrations, reconcile this baseline only after confirming schema equality; do not apply the initial migration a second time.

Fresh Security Advisor after deployment: 0 errors, 0 warnings; four informational RLS Enabled No Policy findings correspond to the intentionally closed private tables. The anon role was also denied a real REST RPC invocation (401 / SQL42501). Do not add permissive policies to silence these informational findings.
