# Release4.3.2

Authorized23 October2026 for direct phone testing. Standing preference: publish completed authorized game changes after checks, without a second publication approval; task-specific hold requests take precedence.

Combines the unpublished booster stage, holographic image revision and collection feedback. Five boosters, three timed slots, two automatic rescue chips, x3 score factor above x5 combo, floating/magnetic pickup and shrinking flight. Elevated rails and vehicles are not part of this release.

Base: remote main41ff44b70f69b1d6974cbea4d52258b0118ef617, published4.2.0. Dirty root HEAD/index preserved. Isolated candidate /tmp/tesla-v432-release-20261023. All four previously published frozen verifiers plus the local4.3.0 verifier remain unchanged;4.3.2 is additive.

Checks:154 game tests;15 server tests;21 disposable SQL checks; source/content/TypeScript/PWA166 resources. Earlier focused browser evidence:34 motion checks,54 native keyboard/touch gameplay checks,11 actual4.3.1-to4.3.2 update/offline/save/outbox checks. Exact public bundle/Pages/native checks are recorded separately after deployment. Physical iPhone/Safari is untested; the user tests the public version on the phone.

Two additive RPC guard migrations admit4.3.0 and4.3.2. Public baseline20 runs, digest7597ae836d491753829c51f0de6cb367; migration leaves it exact. Fresh deployed API/worker editor content is hashed and matches the prepared bundles. Existing worker secret, Vault dispatch and authentication are retained. Hosted fixtures use only named QA session IDs moved to a separate score epoch before upload; synthetic clock adjustment is confined to those QA fixtures. No public fixture scores or destructive cleanup.

The historical local rollback patch for the first booster stage is retained in the workspace, excluded from this release tree because it embeds an older full checkout. Source originals, photo references, exact prompts and alpha sprites remain in art-source/. Public rollback uses a tested inverse against the release parent and a fresh frontend/cache version, retaining six-version server support and real records. Do not restore an old database or remove compatibility needed by already-installed clients.

Known acceptance limit: the local PWA Restart boundary did not activate within12 seconds; close/reopen activated the new worker. Older3.7.3 in-app-browser cache behavior and physical-phone latency remain separate. After this stage, the bounded debt proposal is to reproduce that update path before changing lifecycle logic.

Final release status, commit, Pages run, live hashes and exact next step are saved in release-status.json and handoff docs after public verification.
