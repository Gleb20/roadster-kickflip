# Encounter pacing4.7.0

Starting main28e02f4 was4.6.3. Concurrent published4.6.4/main2cf6187 was inspected and its four renderer modules, source tests and all documentation were integrated intact. The frozen generation graph is unchanged by that integration. Original dirty checkout/index and historical untracked screenshots remain untouched.

## Implemented behavior

Three onboarding ground encounters, then singles/pairs and earlier aerial choices. Pair cadence progresses4→3→2 ground waves at60/150 active seconds. Aerial first gate22s, bounded per-biome introduction, global cooldown and ground spacing. Optional rail-ground and rail-air share production collision, catch and exit simulation with an ordinary non-grind bypass. Four deterministic alternating physical lengths retain minimum measured slide duration, with fixed-height source posts/caps. Full-streak/boost pairs retain the180ms timing window and moderate joint corners; the calibrated low-ground visibility floor interpolates0.85/0.75→0.58/0.48s, while aerial/tall profiles remain separate. See the canonical gameplay contract.

## Evidence and limits

-235 combined game tests,16 server tests,27 disposable SQL checks; content/types/PWA191 pass. New470 frozen simulation supports the same current graph; eleven historical folders remain byte-identical.
-`independent/`: four300s observational-input runs, all alive,77–86 ground objects,72–80 ground jump inputs and76–80 flips; seventeen–23pairs,6–7rail-air and5–6rail-ground. Ground objects are reported separately from optional rail catches and aerial scenery. The visible-only390px+120ms recognition runs also finish4×300s alive with20–25pairs and6–8rail-air.
-First air22.18–23.38s in the main runs; first factory-specific air0–6.55s after the first factory wave. Native visible-input installed offline PWA completes180s alive with43ground objects,8air,23flips,8pairs,6rail-ground,4rail-air and14catches. No route actions, fuel, QA state writes or public scores. Intermediate harness failures and corrected physical touch cancellation are explained in the independent notes.
-Actual slide medians early1.40–1.725s versus late0.925–1.125s. The four widths occur across the run set;1680 is represented in Node runs, not the native candidate sample. The normal and fast minimum catch-to-exit windows are verified in production physics.
-`performance.json`: entire spawn-containing step, same two seeds/policy/180s horizon. Baseline p9511.77/6.47ms; candidate23.65/15.89ms, max27.21/23.12ms. Max12,692/18,000 ticks,40policies,7failed retries with0.25s spacing. The richer joint proofs cost more CPU; no4ms goal, worst-case improvement or phone60fps claim is made.
-Actual4.6.3→4.7.0 update preserves records/outbox/audio/tutorial/collection and passes18checks; the known closed-tab activation boundary is retained. A fresh4.6.4→4.7.0 combined upgrade is checked separately after concurrent integration.

Physical iPhone/Safari and subjective enjoyment remain untested. The next bounded debt stage is physical-phone event→step→render profiling of joint generation and a short mixed-encounter playtest; it has not been started by this task. Backend/publication/rollback receipts are added as each actual action completes.

## Deployment and inverse

API/worker read back byte-exact after deployment. The additive11-to12 migration is applied. All14 owned QA sessions finish autonomously:12exact valid results accepted,2forged total/end rejected, zero public fixture writes or client verification calls. Current317.617s replay includes82flips/15pickups/17catches/23pairs/6rail-air. Public22records through seq65 retain digest446374e07d6d835b2a7e80a8230c8ff4, pending0. Private capabilities remain outside Git.

Both actual4.6.3-to4.7.0 and concurrent4.6.4-to4.7.0 upgrades pass18checks, preserving463finished record/outbox/settings. Known closed-tab activation boundary applies. Full inverse restores parent2cf6187 exact tree40818fa0f04070b08e1569bb9fc59657da051f9a;227parent tests/check191 pass. Retain all12backend versions and all data on frontend rollback.
