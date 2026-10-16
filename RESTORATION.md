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
