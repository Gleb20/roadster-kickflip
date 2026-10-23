# Backup rarity 4.4.2

## Backup rarity 4.4.2 - release candidate, 23 October 2026

The backup chip now appears once per three shuffled bags: one chip for twelve ordinary boosters, previously one for four. The first two bags contain no backup. Ordinary booster variety, wave interval, collection animation and two-charge cap are retained. This is a working balance choice for phone playtesting; elapsed encounter time depends on safe gaps, eligibility and collection.

Base: published 4.4.1, remote commit `598198078ed9c0033dbdfe4c68b7e464592461f5`; rails, roof grab, camera and Home cleanup are preserved. New ranked `roadster-v4.4.2` is frozen separately; all seven earlier ruleset folders remain byte-for-byte unchanged. The completed 4.4.0 score record and IndexedDB outbox remain eligible after updating.

174 game tests, 15 server tests, 24 disposable database checks, 35 rail browser checks and 11 actual 4.4.1-to-4.4.2 PWA checks pass. Two 180-second rail witnesses replay exactly through JSON checkpoints. 64 seeded bag tests enforce the reduced chip rate. Physical iPhone/Safari remains untested. Existing Restart activation boundary remains separate; close old game windows and reopen the versioned link if necessary without deleting site data.

[Task evidence and next step](distribution.json). Publication follows the standing user instruction after backend and live verification. Existing debt proposal remains a bounded reproduction of the PWA activation boundary; no unrelated debt sprint is started.


Backend deployed and fresh editor reads exactly match the prepared bundles. All ten isolated hosted fixtures completed after the submitting process exited: eight versions accepted, forged score and end rejected. The new fixture collected ten boosters in 164.15 seconds. No public QA scores.

Exact inverse restores the complete parent tree and passes 172 parent tests and checks. Exact next step: publish with expected-head protection, compare all public hashes and run native public checks; then user phone playtest. Record public commit, Pages run and acceptance limits here.
