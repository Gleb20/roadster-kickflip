# Published 4.4.2 - rare BACKUP chips

[Play on the phone](https://gleb20.github.io/roadster-kickflip/?v=4.4.2). Game `8cd9fd753f2031420d57808382fb175af110912c`, tree `4d86777e42c812b46eb38f3b31074017798f1020`; Pages `40005264545` succeeded. All 171 public hashes match; 21 public native touch/keyboard/pickup/pause/offline checks pass without runtime errors. No public QA scores. All 22 real records retain digest `14643e2e2e1e784a657038f258b8ba1a`.

## Accepted tuning

Each bag retains the four different ordinary boosters. BACKUP is added only to every third bag, and never to the first two bags. This changes one chip per four ordinary offers into one per twelve. The chip share among all offered boosters drops from 20% to about 7.7%; ordinary variety, offer interval, two-charge cap and collection behavior stay unchanged. Eligibility can postpone particular offers; these are generation ratios, not a promise about pickups or survival time. Four 30-bag samples each yield 30 of each ordinary type and ten chips; first chip times are 133-147 seconds in an uninterrupted clear-track scheduler. Human balance remains for phone playtesting.

## Validation and compatibility

174 game tests; 15 server tests; 24 disposable SQL checks; source/content/type/PWA checks; 35 arranged rail browser checks; 11 actual 4.4.1-to-4.4.2 PWA checks. Best, collection, finished 4.4.0 record, IndexedDB outbox, cold offline play and sprite cache survive the upgrade. The existing Restart boundary still requires closing the old tab. Two runs longer than 180 seconds each catch seven rails and verify exactly through JSON checkpoints. The new rarity regression initially failed with three chips instead of one per three bags, then passed for 64 seeds.

New immutable `roadster-v4.4.2`; all seven previous folders remain byte-identical. Fresh deployed API and worker editor reads match their bundles. Only an additive RPC version guard is migrated; authentication, scheduler and secrets are unchanged. Ten QA sessions are moved to the separate `qa-v442-20261023` epoch before submitting. All eight valid versions are accepted, fabricated score/end rejected, after the submitting process exits. The new 164.15-second hosted fixture collects ten boosters and matches exactly; no client verify calls.

## Recovery and next step

Complete published game-tree forward/inverse equality is rehearsed against parent `598198078ed9c0033dbdfe4c68b7e464592461f5`; restored parent passes 172 tests/checks. See rollback.json and `/tmp/tesla-backup-published.patch`. A public reversal needs a new frontend/cache identity while retaining eight-version backend support, pending/accepted packets and real records; do not roll back database data. Original dirty root runtime, HEAD and index remain untouched. Isolated release: `/tmp/tesla-backup-rarity-20261023`.

Exact next step: play 4.4.2 on the phone and assess chip scarcity. Physical iPhone/Safari is untested. Existing bounded debt proposal remains reproducing the PWA activation boundary before changing lifecycle logic; no unrelated refactor is introduced.
