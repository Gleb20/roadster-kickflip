## Current replay contract 4.11.0

Immutable `roadster-v4.11.0` adds command7 (`tutorial-start`) at tick0 only, once, before ordinary input, optionally after command6 (`experienced-start`); command8 (`tutorial-skip`) is permitted only after a tutorial start and at most once in an envelope. Training cannot be restarted mid-run. The fixed prefix, collision protection, retry, safe completion, 25-point one-time lesson awards, excluded practice distance, biome-time exclusion and normal-run transition are all simulated identically on client and server. Slow motion scales the fixed-step clock's accumulation, preserving 1/120-second physics; UI finger animation uses display time. Pause/hidden retain priority.

Tutorial state and score offset are checkpointed, including an in-progress attempt. The entire same-run replay, including practice and subsequent first ordinary collision, must match the server score. Practice awards are capped at175; protected repetitions cannot farm score. All18historical folders remain unchanged; API, worker and SQL guard accept19versions. Old cached/offline replays remain immutable. For a client rollback keep all19server verifiers and accepted data. [Evidence](verification/2026-10-26-tj003-v4110/README.md).

## Historical replay contract4.10.0

Immutable `roadster-v4.10.0` adds score-driven pace, outside-portrait spawn, independent safe pickups and persisted first/retry startup. Command6 (`experienced-start`) is optional, unique, first event at tick0; it selects520 instead of360. No later profile changes are accepted. Pace distance/profile and pickups are serialized through checkpoints. All17historical verifiers remain unchanged; the API/database accept18versions. Client retained-best compatibility explicitly includes4.7.3/4.8.0/4.9.0. Old queued/finished records are not migrated to new physics.

## Current replay contract4.7.2

The browser and server use immutable `roadster-v4.7.2`; all13earlier implementations remain byte-identical. The deterministic director snapshots its camera/pace/history and saves a fully validated canonical ground route before discretionary air/pair/rail searches. Low reserve readability is explicitly calibrated; timing windows and production physics are unchanged. New14-version API/worker bundles and the strict13→14guard are deployed;14exact valid fixtures and2forged rejections pass with no public fixture rows. Older finished/offline packets and checkpoints remain supported. [Current evidence](verification/2026-10-24-encounter-pacing/fallback-v472/README.md). Earlier behavior descriptions below are historical.

## 4.2.0 submission transport — gameplay rules remain 4.1.0

The finished replay is already recorded incrementally as input transitions during the run. No new per-frame hashing or cryptographic work is added to rendering. Submit includes its displayed integer score as a consistency check. The server recomputes the complete score and first collision from its issued seed and frozen ruleset; an unequal claimed score is rejected. Legacy clients without this additional claim remain compatible. A checksum or arithmetic trick ledger can detect corruption/accounting mistakes but cannot authenticate player-authored events, so neither replaces simulation.

Verification is deployed as an autonomous private worker, with server-owned checkpoints, exclusive leases, revision checks and retry backoff. It still checks the exact replay. The 400ms compute scheduling target remains; a single step can overshoot it. `maxTicks=432000` removes the former 50-simulated-second interruption, reducing requests/checkpoint storage on fast hosts. Old `/verify` remains compatible. Accepted/pending rows and all four immutable rulesets are preserved.

The client displays an optimistic local row without status labels. A committed upload receipt transfers responsibility to the server. An unsent offline packet remains durable on the device; the app must reopen/reconnect to send it. New sessions now allow seven days for submission, and already received pending work does not expire during processing. A fully offline run still needs a server-issued session obtained before play; arbitrary client-chosen offline seeds are not promoted to ranked runs. Permanent rejection hides the optimistic row after reload; infrastructure failures retain the queue and retry automatically.

Current implementation and measured limits: [4.2.0 evidence](verification/2026-10-23-ranking-v420/README.md). Earlier transport descriptions below are historical.

## Aerial challenge4.1.0 —22October2026

Supersedes the4.0.0 harmless-flyby direction at the user's request. Xi is an ordinary colliding ground opponent in the factory pool, on the same baseline as cars and people. His mutual lightning reaction remains visual; body contact ends the run normally.

All seven flying models have box collision and belong to the ranked obstacle stream. Unlock is leg>=2: initial spaceport → first factory → return spaceport, beginning at14000 points. Allow8 seconds after each score-selected leg change before an air wave. A wave contains one low incoming aircraft, with no ground obstacle beneath it. It follows a single ground wave and forces a single ground breather afterward. Require at least6 ground waves and28 seconds between air spawns. First two air encounters use small models, altitude24 and approach80; later encounters use altitude32/approach110. Spawn at least2 seconds of approach distance away. Every admitted air wave has a shared production-physics route with no thrust, no fuel cost and timing margin±90ms. After its witnessed grounded exit, wait at least1.25seconds before the next wave. Failed route validation falls back to the ordinary ground single. Existing ground physics, rewards and input roles remain intact.

The foundry vat retains its approved source sprite, is320 units wide (formerly164), and is drawn inside the factory renderer after storage but before conveyor/shadows/robots, so production occludes its lower part. It stays background scenery. All three historical frozen rulesets remain unchanged;4.1.0 is additive. Preserve old finished4.0 records, best score and collection. Snapshot `/tmp/tesla-enemies-v410-before-20261022` protects the dirty source checkout and index. See `docs/verification/2026-10-22-aerial-v410/` for current verification and release evidence.

Rechecked debt: biome pools were fixed in4.0 and are no longer open; this task replaces safe flybys. Existing real-phone route-search/input timing and independent daylight remain separate. Proposed bounded debt follow-up is a real-phone event→step→render measurement after play acceptance.

## Encounters 4.0.0 — 22 October 2026

Approved and implemented: seven harmless timed flybys (UFO, Prime delivery drone, bluebird, Starlink, regulator drone, Sikorsky VS-300 with Igor Sikorsky, and factory quality servo-skull). Their state is cosmetic, independent of ranked RNG, fuel, score and collisions. A whole silhouette clears at least0.75 seconds before the route's charge/lead preparation; short approaches skip the encounter. No solitary aerial scoring wave or aerial ceiling remains.

UFO proximity temporarily replaces Elon’s head with a reptile head. Factory-only Xi exchanges two animated lightning paths with Elon's active hand; the scene is harmless and reduced-motion aware. A quieter background molten-metal vat contains a robotic thumbs-up arm. The factory ground pool uses truck, T-800 Arnold, BYD Seal, Xiaomi SU7 and battery AGV; the floating quality inspector supplies the fifth new factory opponent. Simpsons are replaced by two low lying South Park-style spectators. Existing Simpsons discovery/viewed timestamps migrate to the replacement while the historical entry is preserved.

New ranked generator is `roadster-v4.0.0`. Frozen3.4.2/3.8.0 remain byte-identical, and the hosted verifier supports all three. SQL migration only expands the existing RPC ruleset guard; no ranking rows, RLS or authentication settings change.15 photo/reference-guided generated assets, originals, prompts and provenance are retained in `art-source/enemies-v400-20261022/`. [Playable cast gallery](../assets/concepts/enemies-v400/review.html). [Verification evidence](verification/2026-10-22-enemies-v400/README.md).

135 game tests,9 server tests and source/content/type/PWA checks pass. Local browser coverage includes320/390 portrait,844 landscape,1440 desktop, native first jump, pause, reduced motion, two180-second production runs and actual3.9.3→4.0.0 upgrade/offline preservation. These are browser checks; physical iPhone/Safari acceptance remains open. Existing route-search performance and real-phone timing debt remain separate; no general refactor is added.

# New flight rules3.8.0

The current browser and frozen server simulation use roadster-v3.8.0 for the new hold/release rotation, changing grab silhouette, and ideal-landing rewards. rulesets.mjs explicitly preserves the old roadster-v3.4.2 implementation for cached clients and pending submissions. Backend compatibility is additive; do not change old frozen files. Score epochv3 and stored data are preserved. Deployment status is recorded in verification/2026-10-21-flight-v380/release-status.json.

# Reproducible runs — ruleset roadster-v3.8.0

Factory scenery in 3.6.2 reads active distance for spatial entry and the run clock for decorative machinery without changing the obstacle stream, commands, collision geometry or score. Versioned import URLs change for the coherent PWA package; frozen server ruleset files are untouched. Both biome boundaries are covered by a completed browser replay checked against the immutable server simulator.

`src/run.js` is the simulation used by the browser and replay verifier. It owns flight, fuel, scoring, pace, recovery, collisions, obstacle lifecycle, seeded director and semantic input. No DOM, viewport, drawing, audio or storage is needed. `main.js` handles actual keyboard/touch tokens, displays emitted effects and discovers only visible obstacles. Collisions still discover before presenting game-over.

The fixed step is 1/120 s. A run has a uint32 seed, serialisable PRNG state and tick count. Obstacles are rider-relative logical coordinates; resizing only changes the camera. Spawn distance is `max(900, speed*1.5+180)` in world units. Scene time restarts with the run; collision bobbing uses simulation ticks. Reduced-motion drawing does not change collision polygons. Route witnesses, timing margins, fuel reserve, breathers and the existing bounded speed ramp remain active.

`command` accepts primary-down/up/cancel, thrust-on/off and cancel-all. Real input sources are aggregated before recording so simultaneous keys/fingers keep their existing behaviour. Pause/blur cancels held controls; paused time adds no ticks. Automatic fall/death clears are derived from simulation rather than invented input records. `drainEvents` returns jump, landing, recovery, air-passage and death effects; consuming/painting them cannot change physics.

Replay format 1 contains ruleset, seed, final tick and ordered [tick, commandIndex] events. `verifyReplay` validates the envelope, applies those inputs to the same simulation and computes score/flips itself. It requires the declared final tick to be the first collision and all events to be consumed. Supplied score fields are ignored. A server must additionally compare seed/ruleset to its issued session, validate expiry/wall time, rate-limit, limit body bytes and enforce idempotency; this local foundation alone is not an online ranking or authentication system. Reproducibility does not prove human play.

The recording service envelope is one hour/24,000 events; exceeding it disables export, while casual gameplay keeps running without a timer. A future submission UI must explain this limit. `snapshot`/`restore` persist verifier continuation state; restore is for nonrecording verification jobs, not a local-save import or a replacement for the original input log. Preserve immutable ruleset implementations when publishing a new gameplay version so pending sessions can still be checked.

## Measurements and remaining work

Local Node 20, seed 93817, real director/witness-driven runs: 30 s (actual 32.03) verification 80.7 ms, replay 267 bytes; 10 min (actual 603.82) 1,362.7 ms /5,014 bytes; approximately one hour (actual 3592) 8,413.1 ms /33,305 bytes. Long run reached 1,140 waves without early death. Generation maxima per tick 22.9/36.9/62.0 ms. These are local measurements, not deployed CPU guarantees. `scripts/benchmark-replay.mjs` reproduces the fixtures.

This exceeds Workers Free's 10 ms CPU budget, so the leaderboard must use a suitable verifier service rather than trusting client scores. A Node verifier on a test/free service is the current candidate, with API/D1 persistence separated from its ephemeral filesystem. Provider workspace/budget remains an open deployment choice.

Confirmed performance debt: worst-case synchronous route search occasionally exceeds one display frame. After the shared-run/ranking stage, a bounded follow-up should remeasure route-search spikes and evaluate a worker or cached witnesses without changing accepted route/fuel guarantees. This does not justify an engine rewrite. Historical v2 encounter/contact scripts also still contain obsolete control assumptions; current gameplay/fall/collection/replay suites are the release gates.

## Rechecked update boundary,21 October2026

The existing3.7.3 PWA test times out waiting for Home-triggered activation after a synthetic second worker update, both on Chrome and Chromium. The same13 preceding checks pass in3.8.0, including cold offline navigation, preserved best/collection and explicit restart activation. This is an existing automatic-update-boundary issue requiring a separate focused investigation; it is not reported as a fully passed PWA suite. Extended legacy visual snapshot equality is also not counted as passed; focused held/open/grounded states are visually verified.
