# Obstacle director 4.6.0

Initial research base was4.5.0/`44579d2e5d44a5aec3d4f76192d2e2a145b71db7`; final release integrates published audio-controls4.5.1 and uses parent `b7eb5b07f510ba3d7a450e3bbc9d124c0fed43cb`. Work ran in an isolated clone; the original dirty runtime/index were not changed. The adjacent planning document records calibrated preparation thresholds and algorithm details.

## Verification

- 203 game tests, 15 server tests, 24 disposable SQL checks; source, content, types and 190-resource PWA checks pass.
- `matrix.json` / `summary.json`: 1,000 structural seeds, 112 stage/biome/fuel states, 336 air-underpass cases; eight 600-second nominal/imperfect runs survive. 6,449 offline timing probes pass, including independent pair timing and moderate joint ground corners. Checkpoints and 75 server replay chunks reproduce the exact final result.
- Ordinary ground validates the full 180ms lead window plus independent charge±.1 at nominal lead; offline charge±.05/lead±.06 corners also pass. Tall singles validate charge±.1 jointly with lead±.09. Do not describe ordinary ground as the larger full rectangle.
- Early fallback starvation was reproduced and corrected without changing physics or preparation thresholds. Focused tests require early no-boost/recovery gaps ≤12s; seeds17/932 now present six waves in approximately26 seconds. Simplification during high effective speed remains deliberate.
- `browser/browser.json`: 17 native browser checks across320/390/844/1002/1440 widths, natural rail-air catch and ground bypass, native touch, zero runtime errors. PNG approach/landing evidence is retained.
- `upgrade/checks.json`: 18 actual service-worker upgrade checks retain the 4.4.2 best, collection, outbox, mute/tutorial state and cold offline audio. Existing Restart/closed-tab activation limitation remains.
- `performance-before.json`, `performance-after.json`, `browser/browser.json`: same seeds17/932/2026/42 ×240 seconds. Node candidate p95 approximately6.36–13.89ms; browser candidate3.6–9.2ms against old5.7–10.6ms. A browser71.7ms full-spawn-step spike occurred in seed17; that browser protocol retained sorted durations, so its exact encounter kind/budget ticks were not captured; worst-case improvement is not established. The aspirational4ms target is not achieved universally. Matrix timings include extra verification/GC/contention and are not a phone FPS claim.
- Eight old ruleset directories remain byte-identical. Final API/worker source readback matches local bundles; the new allowlist is additive. Hosted fixtures use a separate QA epoch; private capabilities remain only in `/tmp`, excluded from Git.

## Limits and next step

Physical iPhone/Safari, subjective difficulty and 60fps on a phone are not established by browser emulation. Use the public4.6.0 link for the phone playtest. A bounded follow-up may reproduce the already-known PWA activation boundary before changing lifecycle code; no unrelated debt sprint was started.

## Rollback

The parent snapshot and exact candidate delta are retained outside the source checkout. Disposable inverse rehearsal must reproduce the parent tree and pass parent tests/checks. Keep all nine backend rulesets and real scores/outbox when reverting the frontend. Do not overwrite the original dirty root with this clone.

Hosted completion: all nine valid rulesets accepted exactly; fake score and fake end tick rejected autonomously, no client verify calls. The current fixture lasts419.25s, collects17 seeded boosters and includes a natural rail-air encounter. All11 sessions belong to a separate QA epoch. The22 real records retain digest `446374e07d6d835b2a7e80a8230c8ff4`; pending0. See `hosted-results.json` and preservation before/after.

Concurrent release integration:4.5.1 audio controls, sound routing, UI/assets and their canonical documentation are preserved. `concurrent-integration.json` proves all nine frozen folders and generation/physics/camera modules are unchanged from the fully tested director candidate, so the long seeded matrix was not rerun. Combined203 tests/check190resources,182 rendered audio-control checks and18 actual4.5.1→4.6 upgrade checks pass. Latest-parent inverse replaces the initial4.5.0 rehearsal.
