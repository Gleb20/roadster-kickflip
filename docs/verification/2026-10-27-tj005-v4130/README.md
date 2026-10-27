# TJ-005 — Material Studio and content package, 4.13.0

Verified candidate based on `477a73c1bbd8f9eb5b61191c6c5e31b9fe7f3e93` (4.12.1). Desktop authoring is implemented without changing the game HUD, art, music recordings or default encounter distribution. One canonical package compiles into a hashed immutable runtime module shared with the studio. Content ABI/schema/profile checks reject incompatible packages; gameplay-content hash must match a frozen ruleset lock. Initial weights are equal, with bit-exact uniform-choice mapping; rare/uncommon draft edits can be previewed but cannot enter ranked releases without a new frozen server version.

## Evidence

- `tests.log`: all 300 game tests pass, including contract rejection/round-trip/weighted choice and previous simulation equivalence.
- `check.log`: syntax, content, TypeScript, PWA and content-package build checks pass. 204 resources form one hashed PWA release.
- `server-tests.log`, `frozen.log`: all 16 server tests and all 19 historical frozen manifests pass. No server source/data migration or deployment is required.
- `exact-replays.json`: complete natural attempts (81.125 and 102.758 seconds), 23/30 waves, exact snapshots and complete replays against frozen 4.11.0. Both replay results verified. These are not 600-second survival claims.
- `browser.json`: 21 Chromium checks cover actual desktop material download/replacement, malformed-image/audio rejection with draft retained, IndexedDB restore, portable export/import of all 125 materials, a diagnostic replacement reaching the actual sprite renderer, production gameplay in isolated preview, explicit music audition, mobile start/pause and coherent game/studio offline boot. Preview issued no ranking requests and had no JavaScript errors.
- `upgrade/checks.json`: nine real PWA upgrade checks include deliberately corrupt `content/package.json`, refusal to replace the old working offline release, successful installation, and preservation of audio preferences, collection, onboarding state, best record and pending outbox. Closed-tab activation fallback was needed: existing TJ-D02 remains open.
- `desktop.png`, `mobile.png`, `upgrade/offline.png`: browser visual evidence. Desktop-only authoring; game tested at 440×956. Physical Mac/iPhone acceptance and subjective harmony/loop quality remain human checks.
- [Flow report](../../planning/TJ-005-flow-report.html): source/browsing evidence and untested usability states are distinguished.

## Bounded rollback

A task-only forward/reverse patch was applied in an isolated copy. Its reverse restored the exact parent, whose 279 tests and all checks passed (`rollback-tests.log`, `rollback-check.log`). The original dirty checkout, index and historical HEAD were never reset or staged. Reverse only the release delta in a clean checkout; publish with a fresh PWA identity. Preserve live records, collection, preferences, IndexedDB outbox and all frozen verifiers. No backend/data rollback.

## Deliberate boundaries

The studio edits files/descriptions/rarity for registered current scene/visual profiles. Existing backgrounds and choreography retain fixed atlas layouts; it is not a universal scene compositor. Cloud drafts, authorization and a Publish button remain TJ-007. New biome production and Suno/asset workflows are TJ-006 and the pilot card. Import never applies a draft to the live game. PNG geometry/layout and audio duration are checked; matching dimensions/duration cannot establish alpha quality, tempo, harmony or a pleasant transition. Inspect and audition before release.

Next bounded debt stage proposed: diagnose the reproduced PWA multi-tab activation boundary (TJ-D02) without clearing site data. TJ-D01 still needs a physical-phone frame measurement; neither is automatically started here.
