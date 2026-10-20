# Tesla Jump 3.2.0

[Play on GitHub Pages](https://gleb20.github.io/roadster-kickflip/?v=3.2.0)

Canvas 2D browser game with native ES modules and DOM controls. 3.2.0 adds a local encounter collection to the 3.1 content foundation. Meet obstacles (including crashes), then browse silhouettes and unlocked cards from the main menu or pause. NEW clears only after the first detail view and persists between visits. Existing portraits are reused; full rotation artwork is a later content increment.

- [Current gameplay rules](docs/gameplay-v3.md)
- [Content definitions and adding obstacles](docs/content.md)
- [Incremental release sequence](docs/UPGRADE-RELEASES.md)

Node 20+; `npm ci`, `npm run dev`, `npm test`, `npm run check`. The browser uses checked-in JavaScript directly; TypeScript is a development check of the content contract, not a new runtime dependency. The local server is http://127.0.0.1:8766.

The game and forthcoming collection/leaderboard UI stay on the existing GitHub Pages URL. PWA, factory, new animation contracts, full turntables and the online API are subsequent releases, not features claimed by this version. Historical release notes below describe earlier states.

---

## Historical release and architecture notes

# Roadster / Kickflip — Tesla Jump 3.0.4

[Play online](https://gleb20.github.io/roadster-kickflip/?v=3.0.4)

A fan-made satirical runner with controlled backflips, directional cold-gas thrust and landed trick chains. All celebrity encounters are fictional game parody.

Hold screen / Space / W / Up to charge on the ground, release to jump. The first jump plays a cosmetic kickflip; hold again in the air to crouch, grab the Roadster and backflip. Release for limited stabilisation. Hold THRUST / B / either Shift independently to burn fuel; two fingers can rotate and thrust together. P/Escape pauses. Sound is opt-in. Personal best and completed tips are saved locally; legacy records remain separate.

Land flips and close manoeuvres to earn fuel, points, multiplier and up to +25% real speed. All actions are available immediately; ground/air obstacle patterns and tips introduce complexity over 150 progression seconds. A stumble loses the series and recovers speed; obstacle collisions end the run.

Run `npm run dev`; checks: `npm test` and `npm run check`. No build step or runtime dependencies. Canonical code is `src/`, `style.css`, `index.html`, `assets/`; `game.js` is only a compatibility import. `window.__qa` exists only on localhost; production retains read-only `render_game_to_text()` diagnostics.

[Gameplay rules](docs/gameplay-v3.md) · [Release and verification](docs/releases/2026-10-18-v3.0.4.md) · [Art provenance](assets-provenance.json)

Drone adaptation: Thomas Berwing (Volatus), CC BY-SA 3.0. Thruster recording: Pressure Hiss by unfa, CC0. Amber adaptation: Gage Skidmore, CC BY-SA 2.0. Source URLs, processing and full existing credits are retained in the provenance registry and art-source notes. Photo/style inputs and user screenshot references remain local; no reference pixels are included as new runtime art.

Physical-device performance, touch comfort, sound mix and human difficulty acceptance remain for playtesting.

3.0.4 replaces rapid rolling with three seated contacts, diminishing rebounds and a push-off leap back onto the Roadster. Its three kickflips follow the same impacts and finish upright under the feet. Speed-scaled duration is 2.8–3.45 s; taps speed playback up to 1.6×. Existing selection guards, forgiving patterns and scores are preserved. See [release notes](docs/releases/2026-10-18-v3.0.4.md).

3.0.4 adjusts the existing fall pose to lean back with asymmetrical bent legs and spread arms, using the user's pose illustration as movement reference. Fixed leg lengths prevent stretched or stacked feet. Existing recovery timing and controls remain. [Release notes](docs/releases/2026-10-18-v3.0.4.md).
