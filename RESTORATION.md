## Flight3.8.0 candidate restore

Parent c2cfa916c14645cedd1f4d17b9b4f83c1a6ee054 / tree7393ac6dd2f656f6ad2ed88cba1bc4cb991a4efc. Freeze the bounded diff, apply its inverse in isolation and compare the exact parent tree, then run the111 parent tests/checks. The original dirty checkout must retain its historical index and foreign files. Do not reset it.

After any3.8.0 client has shipped, retain additive dual-ruleset backend support even during a frontend rollback; do not restore an older database or reject new-version pending runs. A deployed frontend rollback needs a fresh cache identifier. Best score, collection, submitted identity and pending tokens survive. See docs/verification/2026-10-21-flight-v380/.

## UI3.7.3 restore

Parent `15f7693bbebd46bb6af601c88dc197b56711a6f1`, tree `d333eceb6e8f615c69cfe5b5f5ba68498a4b3c08`. Bounded release diff and exact reverse application are retained with the verification packet. Use an isolated checkout, reproduce the exact parent tree and pass its109 tests/checks. A deployed rollback needs a fresh cache version. Preserve local best, encounter collection, accepted score identity and pending results; no database rollback is part of this UI release. Do not reset the original dirty workspace. Check release-status.json for publication and restore evidence.

## Factory3.6.2 restore

Snapshot parent: public3.6.1 commit d83b2434fc64bb88c55d1cf158a29431140f0592, tree a2b2ed46f07c9183fc7aadec2836c6d5d0a549d8. Apply the release inverse in an isolated checkout and verify the exact parent tree before any rollback. Existing installation rollback requires a fresh frontend version and regenerated PWA hashes. Do not reset the original dirty workspace or replace the separate3.7.x UI candidate. Frozen diff, source hashes, checks and actual isolated restoration evidence: docs/verification/2026-10-20-v3.6.2/.

# Current source of truth

Canonical repository: Gleb20/roadster-kickflip, main.
Canonical URL: https://gleb20.github.io/roadster-kickflip/

The 2026-10-16 online v2 revision replaces the former duplicated inline HTML/JS source. Edit `src/` and `style.css`; never regenerate an inline HTML copy or use the old Sites checkout as a source. `index.html` only bootstraps the web game. Top-level `game.js` is a compatibility import, not a second implementation.

Approved direction: South Park-inspired cut-paper game scene, original head/car/rocket atlases, single white character silhouettes, modern restrained Apple-inspired DOM UI, acid yellow primary. Preserve crouching, flip, circular boost, progressive waves and the 5000-point Bezos/Katy event.

Prior balance commit: 305a936211c16e0b915d5313405b8f822fb160de. This revision retains its director and 0.4 s charge while fixing frame-rate slowdown, invisible Rogozin charge wall, duplicate hero arm, resize distance jump and render/simulation coupling. Start speed is higher and Rogozin peak is 130 units.

Before future changes, read fresh main and confirm no concurrent edits. Publish with expected-head protection; verify the Pages deployment and live game version before reporting publication.

## Obstacle style v2.1

All five car obstacles use obstacle-photos.png via src/photo-cutouts.js (proportional, alpha-trimmed, cached). Amber Heard uses a generated photographic-style head on her animated paper body. The couch family now uses round paper heads and oval eyes. islandPavilion and its painter are removed. Car collision heights follow visible proportions; all six physics tests pass. Do not restore procedural car painters or the building obstacle.

### Publication and verification (2026-10-16, obstacle style)

User explicitly authorized publication of the changed code and generated art to Gleb20/roadster-kickflip at 18:25 Moscow. Earlier auto-review blocks were resolved by this authorization. Base: a45122eacb0312419326c783a8ba7c06b586bf60; image blob: e85502981849e5f3e706b4d86753c1856f3a765f.

Six physics tests PASS; changed JavaScript syntax PASS. Local server is unavailable in the sandbox (EPERM). Verify the Pages deployment and ?review=obstacles contact sheet, then normal gameplay and console errors before reporting completion. Versioned imports include director -> catalog -> props so a cached old catalog cannot restore the removed pavilion.

Confirmed publication: commit 75f3617d090011e806212d1296cc2c1a59dbb5f4, Pages workflow 38924043020 completed successfully. Live Chrome contact sheet: all 16 obstacles visible, five photographic vehicles, recognizable Amber head, round paper couch family, no pavilion; no console errors. Live normal game: start/restart, pointer jump and boost verified, screenshot showed the airborne flip with active boost. The keyboard attempt was inconclusive due to button focus; do not report it as verified.

## Video kickflip v2.2

Player car now uses nine video-derived photo poses from the official Tesla Roadster Event. Preserve `src/roadster-flip.js` and `assets/roadster-flip/`; do not restore cosine flattening or runtime sprite rotation. `?review=flip` is the shared-entry art review, not a duplicate HTML build. Source timestamps and AI retouching are documented in assets-provenance.json.


## Combined release 2.3.2 — 2026-10-16

This release adds the muted spaceport sprite system and whole facial replacement, rolling Roadster wheels and suspension, upright one-hand taunts with a 15-degree screen-space limit, dynamic mutual pupils and the white X shirt logo. Nine video-derived flip frames remain unchanged. Rocket failure transitions preserve altitude.

The release is assembled from a frozen local snapshot against parent `331a970a2c3256856fbc3fe3fe287eea7584de37`, with expected-head protection. See [the release record](docs/releases/2026-10-16-v2.3.2.md) for validation, limits and rollback. Historical local chat exports, migration archives and machine-specific handoffs remain outside the public game release.


## Joe Rogan visual v2.4.4 — 16 October 2026

A generated transparent full-body South Park-style Joe replaces the procedural head/body/mic. Photo references: JRE #1169 for pink shirt, bald head and podcast equipment; supplemental smiling face reference is explicitly an editorial composite. No reference photo pixels are shipped. Source, exact built-in imagegen prompt and provenance are retained under art-source/joe-rogan/ and assets-provenance.json.

The intact headphones and separate boom mic are part of the sprite; a warm smile and gaze face Elon by mirroring after passing. The direct draw bypasses the cropped shared human buffer, with 94px visible height and the existing collision box. Eight material tasks gate startup, including decoded Joe art. Cache-busted entry/module chain and updated browser harnesses preserve loader and first-face guarantees. See [verification](docs/releases/2026-10-16-v2.4.4.md). Publication remains pending verification.


## Accepted release 2.4.8 — 18 October 2026

Final combined character, controls, encounter and contact update is authorized for publication. See [release record](docs/releases/2026-10-18-v2.4.8.md). Historical chat exports and machine-specific handoffs stay local. Fresh verification uses an isolated candidate; the original dirty checkout remains intact.


## Release 3.0.1 — 18 October 2026

Controlled flight, directional fuel thrust, landed trick economy, seven-stage validated patterns, forgiving landing/recovery, revised HUD and real pressure audio. Latest camera fix preserves real projected +5–25% earned speed; subdued flame/lean and maximum-speed-only Impossibru. See docs/gameplay-v3.md and docs/releases/2026-10-18-v3.0.1.md. This supersedes historical 2.x automatic flips, queued ground charge and passive boost. Original archives/private references remain local. Revert the release commit to return to 2.4.8; physical-device acceptance remains open.


## Release 3.0.2 — 18 October 2026

Authorized for immediate online publication after physical-device feedback. Native-selection protection, relaxed precision/dense patterns with ±35 ms timing margin and breathers, and a 1.65-second rolling recovery with separate car/rider, two impacts, unsettled expression, bounded shake and tap-accelerated get-up. Controls stay locked during recovery animation; obstacle collisions remain active. All module/style URLs use 3.0.2 to avoid stale phone caches. A single release commit reverts to published 3.0.1. See docs/releases/2026-10-18-v3.0.2.md.

## 3.0.3 — seated recovery

The rider now bounces on his bottom at three shared contact beats and pushes off the road onto the Roadster. The unchanged nine-frame video-derived atlas supplies three car kickflips. Duration follows pre-fall base speed (2.8–3.45 seconds); primary taps add 0.15 playback rate, up to 1.6×. Jump/thrust lock, pause, reduced motion, continued road travel and live collision remain. No new art/dependencies. Parent c37b935caf41e4629702e0dddd467bda8a555666 is the tested rollback target. Release verification: docs/releases/2026-10-18-v3.0.3.md.

## 3.0.4 — falling pose refinement

Backward torso lean, asymmetric raised/forward bent legs and spread arms follow the user-supplied pose reference. Existing paper parts only; no new art/reference pixels. Palms plant for get-up. Recovery duration, tapping and car animation unchanged. Parent 6fbc8657c1b007cee9183192da3d24454c3d1754 is the rollback target. See docs/releases/2026-10-18-v3.0.4.md.


## Release3.5.2

User authorised frontend publication on20 October2026. Base main210a26a /3.5.0. Scope: compact roof-supported grab, normal kickflip, continuous directed/self-contained encounters and persistent falling cash. Restore only from the frozen release patch on its recorded clean tree; preserve player scores/collection and backend data. Original dirty checkout is not the release source. Release evidence under docs/verification/2026-10-20-release-v3.5.2/; physical-phone acceptance remains open.

## Score-based biome correction3.6.1 —20 October2026

The user superseded150-second legs: every10,000 current-run points changes biome, with no other eligibility condition. The existing4s crossfade animates after the score trigger; pause freezes it and retry resets the band. Base49db4176eca01b5d3d2ae4e0d05b75105436e371, parent tree964650c3f5008a71b2c2fbd6229810d64b40b0ac. Snapshot /tmp/tesla-score-biomes-v361-parent.tar; isolated branch codex/score-biomes-v361 in /tmp/tesla-jump-factory-v360-20261020. Immutable replay/server data and all foreign work must remain intact. Release evidence: docs/verification/2026-10-20-v3.6.1/.


## Release3.7.1 - UI and kickflip icon

Parent369cce37d2676f09437e492a8dcf3873b6207e42 / treeae4063693d948ee2fc47fe39cdf38d440950e74a. Preserve all player scores, collection and pending posts. The additive roadster-score-record-v1 key may remain on code rollback. Use the exact release commit inverse only against that release tree; never apply it blindly over newer work. The inverse is tested in a separate checkout to restore the exact parent tree and its103 tests/checks. A rollback for installed users must be served under a fresh cache/release version, preserving safe update behavior. No database migration, score deletion or old verifier replacement is needed. Evidence: docs/verification/2026-10-20-release-v3.7.1/.
