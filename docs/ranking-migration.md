# Supabase staging → production, preserving test results

This is the procedure for the Supabase ranking, **not evidence of a completed cloud migration**. A local two-database rehearsal preserved 13 scores, 4 sessions, 3 rate buckets, all canonical hashes and full rank order; an imported pending checkpoint resumed to the exact result and the next identity was14. The earlier Cloudflare/Render alternative remains in its own source branch and backup; its paused staging service has no public results. Do not delete it as part of provisioning Supabase.

The frontend remains at https://gleb20.github.io/roadster-kickflip/. Hosting the score API elsewhere does not require moving the game.

## Freeze and export

1. Confirm source/target project IDs, schema and frozen ruleset hashes. Use a separate empty target. Keep the source schema and API deployed as a recoverable source. Archive the reviewed schema/migration/function bundle and configuration; do not copy provider API/service keys into the game or evidence.
2. On the source set `tesla_ranking.config.accepting_sessions=false, accepting_writes=false WHERE id=true`. Config reads hold a transaction SHARE lock, so the update waits for earlier writes. Confirm `/health` reports both false. Pending work cannot commit another checkpoint after that freeze completes; its last committed checkpoint remains valid.
3. Export a consistent PostgreSQL data snapshot of **all** `tesla_ranking` tables and sequence state: config, sessions, runs, rate_buckets. Preserve every column, including capability hashes, seed, ruleset, replay, checkpoint/event offset, progress, revision, leases, UUIDs, sequence numbers, nickname, score, ticks, timestamps, score epoch and source_environment. Store the private export encrypted or with mode600. It contains capabilities' hashes and replay state and must not become a public Pages asset.
4. Calculate per-table counts and SHA-256 of a canonical representation of every row, plus the complete ordered public ranking (score descending, accepted_at ascending, public_id ascending). Record the sequence next value. Read pagination uses a sequence watermark; retaining `seq` preserves already issued snapshots.

## Restore and verify

5. Apply the identical reviewed schema to the empty target. It creates one default config row; explicitly assert that the other three tables are empty, then remove **only that default config row** (`WHERE id=true`) before importing the source data. Restore all exported data and the identity sequence; do not regenerate UUIDs or timestamps. Keep flags false. Recreate the same service-only RPC privileges and frozen verification code; run advisors and anonymous-access denial checks.
6. Compare full row counts and canonical hashes, rank order, page boundaries and sequence state with the source. Rehearse a pending checkpoint resume, original capability access, duplicate submission, conflicting nickname and already accepted result. A different environment label on old runs is not a reason to rewrite their original source_environment.
7. Before changing the public frontend endpoint, deploy a forwarding version of the **old Edge endpoint** to route old cached clients and pending per-run capabilities to the new HTTPS endpoint. This forwarding release must be implemented and tested for the chosen destination at migration time: preserve method/path/query/body/Authorization/Origin, validate a fixed trusted target, disable redirects and prevent loops. Do not retire the old URL while cached clients need it. The initial candidate has no such forwarding switch and does not claim this step is already implemented.
8. Enable writes on the target, update the frontend endpoint and PWA manifest, then verify from the real Pages origin: listing, ties, first/last page, own rank, new completed run, retry after reload, offline recovery and duplicate request. Keep the frozen source untouched. Publish the actual migration report and deployment IDs before declaring production live.

## Rollback

Before target writes begin, route back to the unchanged frozen source and compare hashes again. After any new target write, keep that database authoritative even if frontend/function code is reverted. Do not restore an older staging snapshot over new scores. Moving results back requires another freeze/export/import/verification. Never delete accepted scores just to revert application code.

The immutable ruleset and score epoch define result compatibility. Current candidate uses `roadster-v3.4.2` / `v3`; future gameplay changes must freeze another verifier rather than changing this implementation in place. Preserve older verifier versions for pending sessions.
