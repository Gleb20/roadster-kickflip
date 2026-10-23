# Pickup motion · local4.3.2

User requested floating/bobbing spheres, a contact area larger than their image, a small lean toward Elon, then a shrinking flight into the character. Existing holographic sprites are reused. No new art or controls.

Working parameters: visual bob amplitude6 logical units, angular frequency2.8/s; attraction begins within240×180 logical units and is bounded by distance; actual swept capture changes from±74 horizontal /±100 vertical to±112 /±122 around the existing rider pickup center. Effect is granted once immediately at contact. A separate cosmetic320ms accelerating flight tracks the rotated torso and shrinks to zero. Up to8 cosmetic flights are retained; normal generation offers at most two together. Full/ineligible slots and falling riders do not collect or attract a sphere. Reduced motion disables bob/spin/attraction and uses a stationary130ms fade. Simulation time freezes the flight on pause; restart/home clears it. The drawing never moves the authoritative pickup geometry or delays input/effect activation.

[Visual review](visual-review.html). Capture/mid-flight/collected frames are actual renderer frames with arranged states and controlled simulation steps, not a video or physical-device playtest.

## Verification completed

-154 game tests passed; focused14 booster tests include expanded capture, out-of-range rejection, full slots, falling, swept crossing, pause, torso tracking, shrink and reduced motion.
-15 server tests and21 disposable PGlite checks passed. Current run replay and interrupted checkpoints match the new frozen verifier; all five earlier rulesets remain intact and supported. Fabricated totals/end ticks remain rejected.
-All source/content/TypeScript/PWA gates passed;166 resources. API and worker bundles regenerated locally, not deployed.
-34 focused browser checks at320/390/844/1440 plus reduced motion: immediate grant, flight movement/shrink, pause, finish, independent simultaneous pickups, full inventory and restart. Zero runtime errors.
-54 existing native keyboard/touch gameplay checks passed. First two attempts stopped in the paused state; cause was not established. An instrumented subsequent sequential run passed unchanged game code. Do not infer a new game defect or a confirmed infrastructure root cause from those interrupted attempts.
-11 actual4.3.1→4.3.2 PWA checks: old4.3.0 finished record, best, collection and immutable IndexedDB outbox survive; all new assets and pickup/aura work on cold offline launch. Explicit Restart again did not activate within12 seconds; closing/reopening the old tab activated the waiting worker. Existing lifecycle acceptance issue remains unresolved.
-Guarded sync from isolated copy; original Git HEAD/index and foreign changes preserved. Bounded inverse rehearsed, including rejection of newer edits.

Physical iPhone/Safari and human timing/performance acceptance are untested. Not published or deployed; no hosted acceptance or score submission was performed. Existing real-phone latency/daylight and older PWA update questions stay separate. Bounded debt follow-up proposal: reproduce the existing Restart/activation path before changing lifecycle logic; do not broaden this motion change into a refactor.

## Compatibility and exact next step

Frontend/cache4.3.2 uses additive roadster-v4.3.2 because capture geometry changes gameplay. The five old folders are untouched. New frozen folder roadster-v432, six-version registry, API/worker bundles and additive migration20261023120000_pickup_v432.sql are ready locally. Keep the earlier4.3.0 finished-record compatibility explicitly in the browser. Future authorized release must deploy both4.3 migrations in order and six-version bundles before the frontend, retaining all real scores/pending jobs.

Snapshot `/tmp/tesla-pickup-before-20261023/`; isolated candidate `/tmp/tesla-pickup-20261023`. Fresh remote main41ff44b contains the preceding4.2 publication documentation; it changes no new motion code and is retained. Canonical HANDOFF/RESTORATION are prepended without replacing foreign release evidence.

Exact next step: play/review the local4.3.2 pickup feedback. Publish only on a direct request for this result. Elevated one-way rails remain a separate future stage. Queue heartbeat stays paused.

## Rollback

Run `python3 docs/verification/2026-10-23-pickup-motion/rollback/restore-task.py --rehearse`. `--apply` refuses changed affected bytes, restores only this task to the complete local4.3.1 parent and removes exact new task files. Apply this inverse before any earlier art/booster inverse. Preserve the backend queue, public records, historical artwork and original index. Any public reversal requires a fresh frontend cache version and additive verifier compatibility.
