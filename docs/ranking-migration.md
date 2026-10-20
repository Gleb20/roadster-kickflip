# Ranking staging → production / hosting move

The frontend stays on GitHub Pages. Changing a Pages host later does not require moving results if the API/database remain. For a separate production API/database, preserve public IDs, sessions, capability hashes, rulesets, score epoch, scores and tie-breaking timestamps. Do not recreate rows with new IDs or copy only the first page. Existing local best/collection/PWA saves are origin-bound and are separate from the online database.

## Rehearsal evidence

20 October2026: exported the local workerd/D1 dataset with Wrangler and imported its SQL into a separate clean local D1 instance. `backend/check-migration.py` compared complete application schemas/rows and exact rank order. All20 public runs,76 sessions,3 rate buckets and1 schema-version row matched SHA-256. Source/restore were separate directories; the source remained untouched. Report:`/tmp/tesla-ranking-evidence/migration.json`. This verifies the SQL/data path locally; it is not a claim that production cutover has already happened.

The source export is `/tmp/tesla-ranking-rehearsal.sql` (mode600); source `/tmp/tesla-ranking-local`, restore `/tmp/tesla-ranking-restore-local`. Reproduce the comparison with `python3 backend/check-migration.py SOURCE_PERSISTENCE RESTORE_PERSISTENCE`. Actual export/import syntax is in `wrangler d1 export --help` / `wrangler d1 execute --help`. Local export uses the default `.wrangler/state`; the rehearsal used an ignored symlink to its isolated source. Never point an import at a database containing newer results.

Worker unit tests verify the write-freeze response and old-API proxy: capabilities are forwarded only to the configured HTTPS origin, including paths beginning with `//`, and a migration hop cannot loop. The row order is score descending, acceptance time ascending, public ID ascending. Pagination snapshots use the preserved sequence watermark.

## Concrete cutover procedure

1. Inventory current Worker, D1 ID, verifier source commit, ruleset manifests, schema version, counts, full public-ID/rank digest and pending/verifying sessions. Freeze deployment source/config. Save a private consistent database export; retain the original service/database. Confirm the target is empty and has its own bindings/secrets/origins.
2. Set staging `ACCEPTING_SESSIONS=false` to stop new sessions. Allow active verification jobs to finish, then set `ACCEPTING_WRITES=false` to freeze all POSTs, including internal claims/completions. Gameplay continues locally; consented client retry records remain available where browser storage works. Do not call a503 response a successful submission.
3. Export the complete staging schema/data using D1's remote export (or the authenticated provider export API). Import only into the new empty production DB. Include sessions/authentication hashes/replays, not just public rows. Compare every application table and rank ordering, schema version, sequence, public IDs and supported rulesets before enabling writes. Rehearse a rollback before opening the target.
4. Deploy/test the production API and verifier against the restored DB with writes paused. Wire the verifier's API URL and matching secret; preserve capability validation and old rulesets. If a lease was copied while verifying, let it finish/drain first or allow its120s expiry before a manual retry. Never invent an accepted score during recovery.
5. Point the old API's `MIGRATION_PROXY_URL` to the new HTTPS API, then enable production writes/new sessions. The old address forwards requests without writing the stale DB, so installed older Pages/PWA clients and issued session capabilities keep working. Update the new frontend's API URL in a separately verified release. Keep original `source_environment=staging` on migrated rows; the table may now be served by production without relabelling their origin.
6. Verify from the real Pages origin: old/new endpoint reads, first/last page, ties, own-rank link, a new completed run, pending retry, duplicate request and offline/error recovery. Compare counts/digests again and keep the staging snapshot read-only. Publish the actual deployment IDs/results in the release evidence.

## Rollback boundary

Before production accepts any new writes, revert the API/config to the preserved staging service and confirm the original hashes. After production accepts writes, retain the production DB as the active data source even if frontend/verifier code is rolled back. Reverting application files is not a database rollback. Do not restore the older snapshot over new scores. If moving data back is necessary, freeze writes and perform another full verified migration; preserve stable IDs and deduplicate by session ID.

No public endpoint deletes the leaderboard or edits scores. Administrative migration is an authenticated operation, with private exports kept outside the public repository. Cleanup of disposable test fixtures must use their recorded exact IDs and never delete unrelated/player records.
