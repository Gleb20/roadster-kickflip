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
