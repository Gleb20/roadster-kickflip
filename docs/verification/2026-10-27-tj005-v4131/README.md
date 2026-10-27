## Published acceptance

Runtime 149d1ac, tree 08f753a65d94cce1ac72e13a27651ab799089932; Pages [40566780186](https://github.com/Gleb20/roadster-kickflip/actions/runs/40566780186) succeeded. All 204 resource hashes and service-worker bytes match. browser.json / public.json: 21 local and 21 real public checks pass, with zero preview ranking requests and no runtime errors. Portable round-trip, diagnostic replacement in the actual renderer, mobile start/pause and game/studio offline boot pass. No scores submitted. Human device acceptance and subjective music quality remain separate.

Actual inverse of published 4.13.1 restores exact 4.13.0; published feature inverse then restores exact 4.12.1. See published-inverse.json; that parent's 279 tests/check passed. Original dirty runtime/HEAD/index preserved. The public-host read-only startup leak described below is fixed; lower notes are historical pre-acceptance state.

# Material preview transport isolation — 4.13.1

Public 4.13.0 acceptance reproduced an extra read-only `/scores` request from the production-host `tesla-ready` leaderboard preload. Localhost had not exercised that host-specific branch. No score submission or data mutation happened. The studio draft and renderer otherwise passed the public round-trip checks up to this assertion.

4.13.1 skips the ordinary online startup/restore path in material previews and injects a transport that rejects any incidental later ranking access before network I/O. The memory-only preview outbox remains. Ordinary production gameplay, records and all 19 frozen verifiers are unchanged; the new cache identity prevents mixed old/new modules. Content format, material bytes, default weights and content digest are unchanged.

Parent: `f90fefd322eed8ea8a2f392a15e220fa56a8d6be` / 4.13.0. All 300 tests and all package/type/PWA checks pass. The shared PWA still has 204 hashed resources. This patch must pass the real public-host request assertion before acceptance; a localhost pass alone is insufficient. Final live receipts are recorded beside this file.

Rollback: reverse this patch in a clean checkout to the exact 4.13.0 tree `27323ce78a3cc4304819021b8447f3573202b012`, then reverse the feature commit to 4.12.1 tree `8a1d5fabf8f55fd8acf30c686adc7696fa851d6b` if needed. Publish a fresh PWA identity, preserve local draft/collection/settings/outbox and all accepted records; no backend/data rollback.
