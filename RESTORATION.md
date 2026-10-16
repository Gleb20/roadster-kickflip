# Current source of truth

Canonical repository: Gleb20/roadster-kickflip, main.
Canonical URL: https://gleb20.github.io/roadster-kickflip/

The 2026-10-16 online v2 revision replaces the former duplicated inline HTML/JS source. Edit `src/` and `style.css`; never regenerate an inline HTML copy or use the old Sites checkout as a source. `index.html` only bootstraps the web game. Top-level `game.js` is a compatibility import, not a second implementation.

Approved direction: South Park-inspired cut-paper game scene, original head/car/rocket atlases, single white character silhouettes, modern restrained Apple-inspired DOM UI, acid yellow primary. Preserve crouching, flip, circular boost, progressive waves and the 5000-point Bezos/Katy event.

Prior balance commit: 305a936211c16e0b915d5313405b8f822fb160de. This revision retains its director and 0.4 s charge while fixing frame-rate slowdown, invisible Rogozin charge wall, duplicate hero arm, resize distance jump and render/simulation coupling. Start speed is higher and Rogozin peak is 130 units.

Before future changes, read fresh main and confirm no concurrent edits. Publish with expected-head protection; verify the Pages deployment and live game version before reporting publication.
