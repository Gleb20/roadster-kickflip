# Reproducible runs — ruleset roadster-v3.4.1

`src/run.js` is the simulation used by the browser and replay verifier. It owns flight, fuel, scoring, pace, recovery, collisions, obstacle lifecycle, seeded director and semantic input. No DOM, viewport, drawing, audio or storage is needed. `main.js` handles actual keyboard/touch tokens, displays emitted effects and discovers only visible obstacles. Collisions still discover before presenting game-over.

The fixed step is 1/120 s. A run has a uint32 seed, serialisable PRNG state and tick count. Obstacles are rider-relative logical coordinates; resizing only changes the camera. Spawn distance is `max(900, speed*1.5+180)` in world units. Scene time restarts with the run; collision bobbing uses simulation ticks. Reduced-motion drawing does not change collision polygons. Route witnesses, timing margins, fuel reserve, breathers and the existing bounded speed ramp remain active.

`command` accepts primary-down/up/cancel, thrust-on/off and cancel-all. Real input sources are aggregated before recording so simultaneous keys/fingers keep their existing behaviour. Pause/blur cancels held controls; paused time adds no ticks. Automatic fall/death clears are derived from simulation rather than invented input records. `drainEvents` returns jump, landing, recovery, air-passage and death effects; consuming/painting them cannot change physics.

Replay format 1 contains ruleset, seed, final tick and ordered [tick, commandIndex] events. `verifyReplay` validates the envelope, applies those inputs to the same simulation and computes score/flips itself. It requires the declared final tick to be the first collision and all events to be consumed. Supplied score fields are ignored. A server must additionally compare seed/ruleset to its issued session, validate expiry/wall time, rate-limit, limit body bytes and enforce idempotency; this local foundation alone is not an online ranking or authentication system. Reproducibility does not prove human play.

The recording service envelope is one hour/24,000 events; exceeding it disables export, while casual gameplay keeps running without a timer. A future submission UI must explain this limit. `snapshot`/`restore` persist verifier continuation state; restore is for nonrecording verification jobs, not a local-save import or a replacement for the original input log. Preserve immutable ruleset implementations when publishing a new gameplay version so pending sessions can still be checked.

## Measurements and remaining work

Local Node 20, seed 93817, real director/witness-driven runs: 30 s (actual 32.03) verification 80.7 ms, replay 267 bytes; 10 min (actual 603.82) 1,362.7 ms /5,014 bytes; approximately one hour (actual 3592) 8,413.1 ms /33,305 bytes. Long run reached 1,140 waves without early death. Generation maxima per tick 22.9/36.9/62.0 ms. These are local measurements, not deployed CPU guarantees. `scripts/benchmark-replay.mjs` reproduces the fixtures.

This exceeds Workers Free's 10 ms CPU budget, so the leaderboard must use a suitable verifier service rather than trusting client scores. A Node verifier on a test/free service is the current candidate, with API/D1 persistence separated from its ephemeral filesystem. Provider workspace/budget remains an open deployment choice.

Confirmed performance debt: worst-case synchronous route search occasionally exceeds one display frame. After the shared-run/ranking stage, a bounded follow-up should remeasure route-search spikes and evaluate a worker or cached witnesses without changing accepted route/fuel guarantees. This does not justify an engine rewrite. Historical v2 encounter/contact scripts also still contain obsolete control assumptions; current gameplay/fall/collection/replay suites are the release gates.
