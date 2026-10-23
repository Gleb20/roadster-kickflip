## Hosted rollout gate passed

See `hosted-results.json`, `hosted-scheduler.json`, `hosted-receipts.json` and both deployed-bundle manifests. The seven explicitly named fixtures use a separate score epoch, so no public test rows or destructive cleanup is needed. Existing public rows retain their baseline digest. Worker auth and Vault setup were explicitly confirmed by the user. One initial redacted placeholder was corrected before queue activation; unauthenticated calls then correctly returned401.

# Instant ranking 4.2.0 — local implementation

Base: `1399b40` (4.1.1). Candidate is not published and autonomous backend processing is not yet activated on Supabase.

- Normal leaderboard immediately after durable local save; cached rows first, latest surrounding page in the background. Equal scores follow existing ties. No submission status labels.
- Persistent per-run IndexedDB queue, one-time legacy import, idempotent original packet, automatic retry/reconnect. No browser-driven verification loop. Same run cannot produce two public rows.
- Receipt only after database commit; private worker/dispatcher can finish with all browser windows closed. Retries retain checkpoints and exclude concurrent claims. Rejected scores stay out of public ranking and vanish locally after reload.
- Exact frozen physics/scoring checks remain. No client-side checksum is treated as anti-cheat proof. Server rejects changed totals and replays ending after first collision. Legitimate old rulesets continue to work.

## Evidence

`game-tests.txt`: 140 passing tests. `server-tests.txt`: 13 passing tests. `source-checks.txt`: source, content, TypeScript and PWA manifest checks; 152 cached resources. All four frozen ruleset hashes passed. `database.json`: 20 integration checks, including leases, transient failures, expired pending tickets, duplicates/conflicts, fabricated totals, collision cutoff, old rulesets, preview nonmutation, anon denial and scheduler concurrency.

`browser/browser.json`: 17 native browser checks at 390/1440, row displayed in 68/64ms while upload was blocked, queue after offline reload, automatic send on reconnect, verification after closing browser context, silent rejection/reload, concurrent IndexedDB writes, zero runtime errors. API requests were redirected to a disposable local server; no public test scores were created. `upgrade/checks.json`: 10 actual 4.1.1→4.2.0 PWA checks, including legacy packet migration, best/collection/old finished record preservation and cold offline play. These are local Chromium checks, not real-phone or hosted acceptance.

`benchmark.json`: identical completed 3.4.2 compatibility fixtures at 32s/604s/3592s. Chunks 1→1, 13→4, 72→21; final scores, flips and collision ticks are exactly equal. About 70% fewer continuation requests/checkpoint writes for the long fixtures; CPU stayed roughly 1.4s/8.4s. Measurements use local Node, one sequential comparison, no hosted networking or billing. Reproduce with `node scripts/benchmark-background-ranking.mjs <fixture.json> ...` where each file contains the original `replay`; the measured inputs are retained in `fixtures/legacy-*.json`. Current 4.1 rules are separately covered by native submissions and SQL checks.

## Deployment order and limits

1. Recheck main and current RPC, preserve a bounded candidate and reviewed inverse. Apply only the additive background-ranking migration.
2. Configure the private worker secret and matching Vault names described in `supabase/README.md`. Deploy both generated function bundles; keep public API JWT enabled. Worker uses its own secret authentication.
3. Install the dispatcher/cron SQL. Verify public health says autonomous verification is enabled, an upload returns receipt before simulation, and the stored run completes with the browser closed. Verify transient retry, duplicate receipts, forged-score exclusion, all four rulesets, worker authentication and queue recovery. Retain exact hosted fixture IDs for targeted cleanup only.
4. Publish the tested frontend with expected-main protection. Verify live assets/PWA and native input. None of these hosted steps is claimed complete here.

Offline delivery requires the original server-issued session and completion within its seven-day submission window. Received jobs no longer expire with that ticket. An unsent packet cannot leave a fully closed browser until the game is opened online; the queue survives ordinary reload/restart, not deletion of site data. Per-device unfinished queue cap is 20. Actual storage failure keeps the form and explains how to retry; it never falsely reports a saved packet. There are no routine network/rejection status notices.

[Flow report](flow-report.html) records the accepted interaction and its validation. The user's explicit quiet-game requirement overrides generic flow-errors advice to show retry/offline notices. The only proposed follow-up is hosted latency/recovery measurement after deployment; existing unrelated phone timing/daylight work remains separate.

Provider references checked 23 October: [Cron](https://supabase.com/docs/guides/cron), [pg_net](https://supabase.com/docs/guides/database/extensions/pg_net), [Edge limits](https://supabase.com/docs/guides/functions/limits). Their supported scheduling/delivery model informed the prepared integration; it has not been exercised on the hosted project yet.
