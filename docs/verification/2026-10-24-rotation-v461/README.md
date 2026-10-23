# Historical prepared frontend4.6.1 — immutable physics461 retained

This frontend candidate was never published: the authorized parallel English audio copy fix took UI4.6.1 first. [Final frontend4.6.2 packet/status](../2026-10-24-rotation-v462/README.md) is authoritative. All physics461 frozen files, backend bundles, hosted QA and measurement data below are retained byte-for-byte; current frontend versions and physics ruleset identifiers are separate.

# Air rotation4.6.1 — final release packet

Status: backend deployed and verified; frontend publication/live verification in progress. The final Pages/head and live results will be recorded in `release-status.json`. [Phone4.6.1](https://gleb20.github.io/roadster-kickflip/?v=4.6.1).

Exact combined parent: published4.6.0 `ede9ec6042fd6c262eda2873861974cde72a082b`. Runtime `890bcb2` preserves audio4.5.1 independent sliders, paper expressions and all director4.6 pacing/rail-air rules. Work is isolated in `/tmp/tesla-rotation-20261024`, branch `codex/air-rotation-v461`; original dirty root/audio/director checkouts are not edited. Earlier4.5 candidate evidence is historical. Normalized source changes are limited to angular gameplay/config, lifecycle resets in run/rails and frontend finished-record compatibility; other current source changes are cache query versions.

## Behaviour and bounded tuning

Eligibility is fixed on one actual spin→release: at least255° of the selected turn, at most105° approach, negative omega and the original stopping forecast within safe±40°. Early120/180/240° releases cannot acquire a target later. Body opening/ordinary braking stays intact until1.8rad/s. Only beyond PERFECT10° does smoothstep damping increase, reaching16/s by25°. It dissipates angular speed and never assigns angle, reverses direction or adds upright torque. Rehold cancels immediately. Grab.12/.18, hold7.2/60, landing40/10/speed, collisions, fuel, points, actual thrust impulse/direction, visuals and audio remain unchanged.

255°/105° supersede the historical270°/90° draft: the stopping forecast already excludes rough underrotation; the extra geometric cutoff introduced a four-tick fail interval on the boosted rail fixture. Current full-charge/full-booster rail safe interval51–105ticks is continuous, PERFECT62–69 unchanged. Ground safe56–105, PERFECT68–74 unchanged. Synthetic near338.12°/7.2 can still barely overrun the safe sector; no guarantee or later recapture is added. Early-release gaps under continued/late thrust remain intentional because orientation changes real thrust trajectory and eligibility still requires the original release to be physically near a complete turn.

The boosted/full-charge/.8s target changes contact−424.705° (fall) to−383.9345° (safe, non-PERFECT). Additional.5/1/2s contact delay causes only about.006° further drift instead of51.566/103.132/206.265°. Settling retains a natural tilt near−383.9406°.

## Verified final tree

- `sweep.json`:24,080 cases on the exact combined parent/candidate: five charges, two jump factors, ground/actual rail jump, four thrust profiles,301 release ticks.873 fail→safe,0 safe→fail,0 PERFECT→safe,0 safe→PERFECT,0 fail→PERFECT,0 turn changes. Counts are controlled fixtures, not human success probabilities. Existing half-charge.8 PERFECT/.7 safe, rough abort, overhold and late second-spin failures remain.
- 212 game tests and `npm run check`: source/content/types/PWA190 resources.16 server tests;27 disposable SQL checks including new spin through an active service checkpoint, automatic fake score/end rejection and all nine legacy acceptances. Current/frozen spin replay and bounded JSON chunks match exactly. All ten frozen manifests verify; every byte of the nine old folders matches parent.
- Director matrix:1000 structural seeds,112 stage/biome/fuel states,336 air underpasses,6449 timing probes and eight600-second nominal/imperfect runs pass. Existing zero-spin route choices, timing and seeded run physics match frozen4.6.0 after explicitly proving the new transient fields inactive. Performance figures in the matrix are local diagnostics, not phone FPS or a new optimization claim.
- 39 native browser checks at390×844,844×390,1440×900 pass: roof grab→open→settle→landing, retained PERFECT, overhold→fall, release→rehold, pause/resume and two independent touch fingers.12 identical renderer inputs produce identical feet, arms, grip, face and car diagnostics against combined4.6.0. Source normalization confirms no semantic director/audio/render change.
- 14 actual4.6.0→4.6.1 service-worker upgrade checks retain exact completed old replay, IndexedDB outbox, best, collection, tutorial and both audio levels. Cold offline assets/music and boosted settle pass. Known closed-tab activation fallback was required; no PWA lifecycle fix is claimed.

## Backend and hosted preservation

Additive migration `20261024010000_air_rotation_v461.sql` updates only the known RPC ruleset guard9→10, returns if already installed and aborts on unexpected source. No data/grant/scheduler/JWT changes. Both API and private worker were deployed through the authorized dashboard; explicit ZIP readback sha256 matches local bundles (`backend-readback.json`). The browser download event did not fire, but actual ZIP files were successfully downloaded and compared.

Twelve QA sessions were moved to unique `qa-v461-20261024-rotation` before submission, with exact ready/null-payload readback proof. All ten valid rulesets were accepted with exact totals; fake score and extra end tick rejected autonomously without client `/verify`. Historical4.6.0 QA includes a real rail-air encounter over251s. The new positive local fixture has active state at145; hosted acceptance proves autonomous exact replay, while active persisted-checkpoint coverage is established separately by local/PGlite tests. No production chunk budget was changed and no client checkpoint was uploaded.

The original22 public rows retain exact row IDs and full-row hashes. Combined ID/hash SHA256 before/after is `1d3aff2d32baf7d52ad9c62b619d368a04ed2486d9ab346c8084310a0698f413`; public fixture writes0. Concurrent legitimate new IDs would be permitted without restoring/deleting them. Capabilities remain in0600 `/tmp` files and are excluded from Git. Real score/outbox data are preserved.

## Rollback and limits

Runtime forward+inverse is rehearsed against exact parent `ede9ec6` in `/tmp/tesla-rotation-v461-rollback`, restoring a clean identical tree. Its runtime is byte-identical to the tested203-test parent; parent tests/check pass. The complete final delta/inverse tree proof is recorded in `rollback.json` after final documentation commit. Public reversal changes frontend/gameplay with a fresh cache identity and keeps all ten backend verifiers and accepted/queued records. Do not reverse the migration, deploy an old worker or roll back database rows.

Physical iPhone/Safari and subjective feel remain unverified. After release, the bounded follow-up is a phone pass covering early/timely/late release, continued thrust, rehold and rail. Existing closed-tab activation remains separate; no unrelated audit or debt sprint is started.
