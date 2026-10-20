# Tesla Jump ranking backend — candidate 0.1.0

The game and leaderboard UI stay on GitHub Pages. A small Cloudflare Worker/D1 API stores sessions and results; a separate Node service replays inputs in a bounded worker thread and reports the computed score. This directory has no runtime npm dependencies. Development/type tooling requires Node24+, matching the bundled test runtime.

Staging API: `https://tesla-jump-ranking-staging.liubavskiiga.workers.dev`. D1: `tesla-jump-ranking-staging`, ID `67a52384-f50a-465f-af2a-d9c479bc4eb1`. At initial provisioning both new sessions and writes are paused. The verifier is not deployed yet; do not report the online leaderboard as released until the complete deployed roundtrip passes. Public game remains3.4.1 while frontend3.5 is prepared.

## Local checks

Install development dependencies with Node24: `npm ci --prefix backend`. Copy `.dev.vars.example` to `.dev.vars` for local dummy keys only. `.dev.vars` and `.wrangler` are ignored. Never deploy the fixture key values or commit real credentials.

Apply `migrations/0001-ranking.sql` with `wrangler d1 execute DB --local --file migrations/0001-ranking.sql` from this directory. Start `npm run dev`; this explicitly enables writes on the local instance, while the default deployment config stays paused. The configured preview ID preserves a separate local database; CLI commands are local unless explicitly passed `--remote`.

Start the Node verifier with `API_URL=http://127.0.0.1:8787 VERIFY_KEY=local-test-only ALLOWED_ORIGINS=http://127.0.0.1:8766 node backend/verifier.mjs` from repository root. Run the game at port8766 and use `?online=1` to enable local integration. Ordinary local gameplay tests do not contact the ranking API. The public build always prepares online sessions when connected.

`npm --prefix backend run check` validates Worker TypeScript against generated bindings/current Workers types. `npm --prefix backend test` runs protocol, immutable-ruleset, migration-control and verifier concurrency checks under Node24. `node backend/test-api.mjs` exercises actual local workerd/D1 and Node verification; use an empty disposable local database. Its fixture API/Node key is explicitly local-only. Root `scripts/verify-online.cjs` exercises native browser controls against that local stack.

## Service contracts

- `POST /sessions` issues a random capability/seed for one ruleset. This creates no public result.
- `POST /sessions/{id}` with its Bearer capability and nickname/replay opts into publication. Canonical payload hashes make retries idempotent; another payload conflicts.
- `GET /sessions/{id}` with that capability reads verification status. Public clients never receive a verifier key.
- `GET /scores?page=N&snapshot=S` returns ten rows. A sequence watermark keeps pages stable as new scores arrive. Refresh starts a new snapshot.
- `GET /scores/{publicId}` returns the public entry, rank, page and matching watermark.
- `/internal/claim` and `/internal/complete` require the separate verifier secret. Atomic leases and a transactional insert/update enforce one result per session.
- Node `POST /verify` accepts the existing session capability, claims the persisted job and replays the immutable ruleset. One CPU job runs at a time; overload is retryable. A60s bound and96MiB worker heap prevent unbounded work. Process loss leaves a120s lease that can be retried. No local filesystem is used as the result database.

Replay envelopes are limited to one hour/24,000 events/512KiB HTTP body. Casual play continues past recording limits. Server checks the issued seed/ruleset, envelope/order, timing, terminal collision and computed score. It does not prove the inputs were human. No old local best is imported as a verified result.

Nickname is3–12 normalised letters/numbers/spaces/-/_. It is displayed as text, never HTML. Session capabilities are random, per-run and stored server-side as hashes. The application does not store raw IP, user-agent or email. Creation limits use a short-lived daily HMAC of IP; buckets expire. Provider networking may still process technical request metadata. Public nickname/score records remain; session/replay records are deleted seven days after session expiry by daily cleanup. Logs contain event/request ID only; invocation logs and traces are disabled. Backups contain nicknames/replays/authentication hashes and must stay private.

## Deploy the verifier after provider choice

The prepared Node option is one free Render web service, region Frankfurt, with repository root, build `node backend/check-ruleset.mjs`, start `node backend/verifier.mjs`, health `/health`, Node24. It needs `API_URL`, `VERIFY_KEY` and `ALLOWED_ORIGINS`. Use a fresh cryptographic verifier secret shared with the Worker; create an independent `RATE_KEY` Worker secret. Do not print/save those values in the repo. A free instance may take about a minute to wake; the frontend keeps the result pending and allows manual retry.

Only the Render workspace **Tab-10** is available, but none is selected. User confirmation of that resource identity is still pending; do not create Render resources before it. A paid Cloudflare verifier is an alternative only after the user selects that option and its required plan is available. A bounded queue experiment did not complete the hour replay on the current Free plan; CPU configuration was explicitly rejected by the provider. No tariff was changed. See `docs/verification/2026-10-20-queue-probe/`.

After the actual verifier health check succeeds, configure `VERIFIER_URL`, provider secrets and the correct origins on the API. Enable writes/session creation, exercise a real issued session → completed native browser run → explicit nickname submission → verified public row → idempotent retry. Check score/rank/pagination from the public Pages origin, then freeze/reverse-test and publish frontend3.5. Do not seed the public table with synthetic local fixtures.

For cutover/rollback, follow [migration](../docs/ranking-migration.md). Keep the immutable `rulesets/roadster-v341` package and its hash manifest; new gameplay rules must retain supported older verifiers for pending sessions. Visual-only changes can keep this ruleset when simulation outputs remain identical.
