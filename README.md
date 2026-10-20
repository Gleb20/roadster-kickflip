# Tesla Jump 3.6.0

[Play on GitHub Pages](https://gleb20.github.io/roadster-kickflip/?v=3.6.0)

Canvas 2D browser/PWA game with controlled flips, directional thrust, landed trick chains and a persistent encounter collection.

The Tesla factory now appears at 2:30 of active play, regardless of score. A four-second scenery crossfade keeps the attempt running; every 150 seconds the route alternates spaceport and factory. Assembly robots, conveyors, fictional workers, moving logistics and concrete/yellow markings use the prepared paper sprites. Both locations work offline after a complete PWA install. Existing controls, grab/reactions, physics, scores and the Supabase leaderboard stay compatible.

- [Current gameplay rules](docs/gameplay-v3.md)
- [Content catalogue and obstacle pipeline](docs/content.md)
- [Hero animation contract](docs/hero-animation.md)
- [Replay contract](docs/replay.md)
- [PWA installation, offline play and safe updates](docs/pwa.md)
- [Incremental release sequence](docs/UPGRADE-RELEASES.md)
- [3.4.2 validation and rollback](docs/verification/2026-10-20-v3.4.2/README.md)

The collection unlocks visible encounters even on collision, without interrupting play. Browse it from the menu or pause; NEW clears on the first detailed view. Portraits are currently static. Browser saves remain local. Online ranking uses the existing Supabase API while the game stays on GitHub Pages. Biome-specific obstacle pools, independent daylight, the demonstration ramp/stunt, full portrait rotations, head trophies and sharing remain later unfinished increments.

Node20+; `npm ci`, `npm run dev`, `npm test`, `npm run check`. The local server is http://127.0.0.1:8766. Run `npm run build:pwa` after runtime changes to regenerate the coherent offline package. TypeScript checks the content contract only; it is not a runtime dependency.

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

## Online ranking 3.5.0

Optional arcade names and verified all-time scores use Supabase while the game remains on GitHub Pages. Ranking is available from the menu, pause and completed runs; any eligible run can be posted, including a non-record score. Ten rows per page, highlighted own rank, durable explicit retries and staged replay verification are implemented. See [service setup](supabase/README.md) and [migration preserving results](docs/ranking-migration.md). Metallic rank badges are implemented; illustrated rotating head trophies and sharing preview art remain later visual stages.
