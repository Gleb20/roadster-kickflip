# TJ-003 / 4.11.0 — immersive driving lessons

Status: published and verified. Runtime `08ca5eeacd66984ececf82b388e4ea9d0c524ac5`; Pages `40396673050` succeeded; all194public resources match. Ten fresh public checks include the complete real-time course, same-run continuation, explicit replay and Skip, with no score submissions or console errors. Base `b97339aeac110663d3a5ef96e86ffc4192557cda` / 4.10.0. Isolated checkout `/tmp/tesla-tj003-discovery-20261026`, branch `codex/tj003-onboarding-v4110`. The original workspace's tracked runtime diff and index remain byte-identical to the pre-discovery snapshot.

## Accepted behavior

The user approved 4.10.0 as the teaching baseline. Seven fixed, seed-independent practice scenes teach jump, charge, manual flip/release, airborne THRUST, rail catch/exit, driving beneath an air hazard and a score pickup. One lesson is visible at a time. The same run continues after the course with its earned score; there is no separate tutorial leaderboard or automatic restart.

Protection and retry are part of immutable `roadster-v4.11.0`, shared by browser and verifier. Each completed lesson awards 25 points once; practice distance and ordinary awards do not accumulate points. All seven award 175 points. Failed attempts cannot die or farm score. Tutorial time does not advance biome transitions. The collected score pickup retains its remaining effect after the course. Skip ends the whole course until an explicit replay, retaining completed lesson points. Held controls are cleared on retry, transition, skip and pause.

New players receive training automatically; existing start/best/legacy-tip evidence suppresses automatic training on update. Interactive lesson status uses a separate local key. `Replay training on next run` starts the course only on the next explicit start. Existing records, collections, cached packets and old tip data are retained.

## Validation

- 270 game tests; `npm run check` (syntax/content/types/PWA); 16 server tests; 37 disposable SQL checks. All 19 frozen manifests verified; all 18 historical folders unchanged.
- Nine focused tutorial tests cover actual command inputs, drain-before-step event consumption, protected retries, anti-farming, start/skip replay grants, JSON checkpoints, fixed-step slow motion, storage refusal, biome time, later-run reset and exact ordinary-run equivalence with 4.10.0 for both start profiles.
- Browser: 11 complete-course/persistence/replay/skip checks and 51 checks over 320×568, 440×956, 844×390 and 1280×800. Touch hold/release, independent multitouch, cancellation, pause/resume, reduced motion, card bounds, genuine 4.10→4.11 cache upgrade, preserved data, offline load/training and offline Skip pass.
- The complete keyboard course uses actual keyboard events with production fixed steps driven by the QA harness; it is not a real-time novice usability study. Updated full-course capture also checks console warnings/errors. Browser plugin unavailable; installed Playwright/isolated Chrome used.
- Hosted: 24 owned sessions isolated into `qa-v4110-20261026` before any submissions. 22 exact results accepted (19 versions, plus complete tutorial, Skip and protected-retry cases); forged score and end tick rejected. Autonomous worker completion required no client verify requests. Public QA writes: zero; public record count: 28.
- API and worker source copied as complete files and compared exactly before deployment and after reload: 756986 and 753311 characters respectively. The strictly additive SQL guard adds 4.11.0, with unchanged grants/authentication/tables. Generated bundles are minified to make full-file transfer reliable; authored sources remain readable.

Evidence: `game-tests.log`, `check.log`, `server-tests.log`, `database.log`, `rulesets.log`, `browser-lessons.json`, `browser-matrix.json`, `hosted-fixtures.json`, `hosted-receipts.json`, `hosted-results.json`, `backend-deployment.json` and the included screenshots. Session capabilities remain only in `/tmp/tesla-v4110-hosted-private.json`, never in the repository.

## Rollback

Parent archive: `/tmp/tesla-tj003-parent-v4100.tar`. The bounded `client-only.patch.gz` inverse was applied in `/tmp/tesla-tj003-rollback`: all211parent client/test/script files match byte for byte, all four new client files are removed, and261parent tests plus `check` pass. See `rollback.json` and the two parent logs. It restores client/tests/scripts to 4.10.0 while retaining additive server support for all 19 versions. Never remove 4.11.0 verifiers, pending packets, accepted scores or the SQL guard after a client rollback. Do not reset or overwrite the original dirty workspace.

## Limits and existing debt

Physical iPhone 17 Pro Max/Safari acceptance and a novice's understanding remain unverified. Desktop and emulated touch are not physical-phone evidence. Existing TJ-D01 (full-frame/generator profiling on the phone) and TJ-D02 (independent PWA activation-lifecycle diagnosis) remain separate; a bounded next debt stage can profile one physical-phone run and investigate an actually reproduced update delay. Neither is started automatically.
