# Historical preparation completed — final frontend4.6.2 / physics461

[Authoritative final packet/status](../2026-10-24-rotation-v462/README.md). Preparation below is retained as history; the frontend was renumbered to preserve the separately published English audio4.6.1. Physics461 and all its hosted results remain immutable.

# Historical implementation evidence — superseded by final4.6.1

The4.5-based investigation below is retained as provenance. [Final combined4.6.1 packet](../2026-10-24-rotation-v461/README.md) is authoritative for version, backend, final tests and publication.

# Release-only air rotation candidate — 24 October 2026

Runtime commit `9e35c3a`, parent `44579d2` (4.5.0). Isolated checkout `/tmp/tesla-rotation-20261024`; the original dirty root, director checkout and audio checkout were not edited. This is an internal implementation candidate: version, ranked tag, frozen rulesets and backend remain unchanged. **Do not publish this tree under its old ranked tag.** Integrate over the actual final main, allocate a new immutable verifier, add backend support, rerun affected gates, then publish under the standing authorization. Director4.6 and volume UI are ahead in the release queue.

## Runtime and tuning

`spinHeld` and `settleTarget` live in the ordinary serialized flight state. On spin→release only, select one nearby complete turn, require negative omega, at least255° of that turn, at most105° approach, and projected stopping position within the existing ±40° safe sector. Forecast uses `omega²/(2*24)` with the original release deceleration. A release at240°/7.2 predicts301.879° and receives no assistance;120/180° also remain ineligible forever unless the player actually reholds and makes a new release.

The body first opens and brakes exactly as before. Additional damping starts only once ordinary braking reaches1.8rad/s and the selected turn has passed by more than the original PERFECT10°. Smoothstep ramps from10° to25°, with maximum exponential coefficient16/s. This only decreases angular speed: no angle assignment, direction change or upright torque. Rehold cancels on that same simulation tick. Existing hold7.2/60, grab.12/.18, safe40/PERFECT10/landing-omega, geometry, fuel, collision, score and thrust impulse rules are unchanged. Thrust still follows the actual resulting angle.

270°/90° were initial bounds. The physical forecast already excludes gross underrotation; those extra geometric bounds introduced a four-tick fail interval between valid windows on the full-booster rail fixture.255°/105° remove that interval without changing the stopping-angle gate. Effective first eligibility at full omega begins258.1206°; the tick grid first reaches258.8337°. This tuning is accepted by parent review, not claimed to be a published external standard.

## Measurements

`node docs/verification/2026-10-24-rotation-implementation/sweep.mjs BASELINE CANDIDATE` reproduces24,080 cases: five charges, two jump factors, actual ground/`jumpFromRail` launch, four thrust profiles,301 release ticks at120Hz. `sweep.json` retains every changed case and contiguous safe/PERFECT/eligible windows for all80 groups. Counts describe controlled fixtures, never player success probabilities.

| Comparison | fail→safe | safe→fail | PERFECT→safe | safe→PERFECT | fail→PERFECT | turn changes |
|---|---:|---:|---:|---:|---:|---:|
| baseline →270°/90° |788|0|0|0|0|0|
| baseline →255°/105° |873|0|0|0|0|0|

`tuning.json` compares all changed windows and retains85 added rescues. Their release angles258.8337–269.1469° predict320.7131–331.0264°. The full-charge/full-booster rail safe interval changes from51–81ticks to51–105ticks; PERFECT62–69 stays exact. Ground equivalent changes56–86 to56–105; PERFECT68–74 stays exact. Historical `land(.5,.8)` PERFECT and `land(.5,.7)` safe/non-PERFECT are retained; ordinary zero-spin route snapshots, choices and timing match the old verifier after explicitly proving both new state fields inactive.

The target release−306.962° at.8s now contacts at−383.9345°, omega−.001774; baseline contact−424.705° is a fall. Exact additional contact delays.5/1/2s cause only.006030/.006032/.006032° further candidate drift, versus51.566/103.132/206.265° baseline. The natural asymptote−383.9406° stays outside PERFECT. See `delayed-contact.json`.

Not every eligible release is safe. Synthetic338.10°/7.2 settles399.989°;338.12° is barely forecast-eligible, drifts past400° and cancels (400.656° after5s).338.13° fails eligibility. The actual120Hz hold grid has a continuous upper safe boundary here. No later target is acquired after leaving the sector. Late second-turn releases still fail when contact comes before braking. Longer-flight early-release gaps remain under late/pulsed thrust because stopping-angle eligibility intentionally denies a rough early abort; angle also changes actual thrust direction and contact timing. No ground-time predictor or autopilot fills those intervals.

## Verification and limits

- 194 tests and `npm run check` pass: syntax, content, TypeScript and182 PWA resources. Complete logs are retained. Nine focused tests cover target/extensions, early/late/inertia boundaries, zero/opposite omega, monotone angular movement, immediate rehold, thrust/fuel/restart, JSON state, pause/cancel, rails, death/rescue/reset and recorded replay.
- 39 native browser checks at390×844,844×390 and1440×900 pass without runtime errors. Real browser keyboard/touch inputs cover grab→open→settle→landing, retained PERFECT, overhold→fall, release→rehold, pause/resume and two independent fingers (release spin while thrust remains). `scripts/verify-air-rotation.cjs` retains the script and screenshots. The main animation clock is stopped deliberately to step exact physics ticks.
- 12 identical angle/grab/pose inputs give byte-identical renderer diagnostics against untouched parent: feet, arms, grip, face/expression, car and body geometry. All presentation/audio source files are byte-identical; hashes in `validation.json`.390 settle and844 grab screenshots were inspected. The old `verify-landing.cjs` fails its obsolete bodyDrop32 assertion on both untouched parent and candidate; current approved roof grab is43. It is not reported as a passing legacy suite.
- Recorded positive witness seed17:0 primary-down;48 primary-up then primary-down;144 primary-up; first collision474, score173, flips1. Runtime replay and17-tick JSON chunks (including active settle) match the full snapshot; forged±1 completion ticks reject. This is pre-freeze local evidence; final new-ruleset server/API/worker coverage is still required. Historical frozen folders/backend are untouched; real records/outbox were not mutated.
- Exact runtime forward+inverse in `/tmp/tesla-rotation-rollback-20261024` restores parent tree and clean status;185 restored-parent tests/check pass. Runtime patch and hash are in `validation.json`. Public rollback must use a fresh cache version and retain additive verifier support, accepted data and queued packets.

Physical iPhone/Safari, subjective feel, final director4.6 rail-air matrix, actual production upgrade and public release verification remain for integration. Existing PWA closed-tab activation and physical-phone input questions remain separate. Proposed bounded follow-up after release: a phone pass covering one early/timely/late release, continued thrust, rehold and rail; no unrelated redesign or debt sprint is started.
