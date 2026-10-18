# Roadster / Kickflip — Tesla Jump 3.0.2

[Play online](https://gleb20.github.io/roadster-kickflip/?v=3.0.2)

A fan-made satirical runner with controlled backflips, directional cold-gas thrust and landed trick chains. All celebrity encounters are fictional game parody.

Hold screen / Space / W / Up to charge on the ground, release to jump. The first jump plays a cosmetic kickflip; hold again in the air to crouch, grab the Roadster and backflip. Release for limited stabilisation. Hold THRUST / B / either Shift independently to burn fuel; two fingers can rotate and thrust together. P/Escape pauses. Sound is opt-in. Personal best and completed tips are saved locally; legacy records remain separate.

Land flips and close manoeuvres to earn fuel, points, multiplier and up to +25% real speed. All actions are available immediately; ground/air obstacle patterns and tips introduce complexity over 150 progression seconds. A stumble loses the series and recovers speed; obstacle collisions end the run.

Run `npm run dev`; checks: `npm test` and `npm run check`. No build step or runtime dependencies. Canonical code is `src/`, `style.css`, `index.html`, `assets/`; `game.js` is only a compatibility import. `window.__qa` exists only on localhost; production retains read-only `render_game_to_text()` diagnostics.

[Gameplay rules](docs/gameplay-v3.md) · [Release and verification](docs/releases/2026-10-18-v3.0.2.md) · [Art provenance](assets-provenance.json)

Drone adaptation: Thomas Berwing (Volatus), CC BY-SA 3.0. Thruster recording: Pressure Hiss by unfa, CC0. Amber adaptation: Gage Skidmore, CC BY-SA 2.0. Source URLs, processing and full existing credits are retained in the provenance registry and art-source notes. Photo/style inputs and user screenshot references remain local; no reference pixels are included as new runtime art.

Physical-device performance, touch comfort, sound mix and human difficulty acceptance remain for playtesting.

3.0.2 adds tumbling recovery with tap-accelerated get-up, game-scoped native-selection protection and more forgiving dense patterns. Two impacts, restrained shake and existing face parts explain a rough landing. No obstacle immunity. See [release notes](docs/releases/2026-10-18-v3.0.2.md).
