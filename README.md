# Roadster / Kickflip

Canonical game: https://gleb20.github.io/roadster-kickflip/

An online Canvas 2D game with native JavaScript ES modules and a DOM UI. No runtime framework, CDN dependency, bundler or generated standalone HTML copies. The small `index.html` is the web entry point; all logic lives in `src/`.

## Development

Node 20+:

```sh
npm run dev
npm test
```

The server listens at http://127.0.0.1:8766. Publish this directory at the GitHub Pages repository root. Keep the four original PNG atlases at their existing paths.

## Code ownership

- `src/clock.js`: fixed 120 Hz simulation clock; visible pause after a long interruption.
- `src/physics.js`: movement constants, analytic jump, collision bounds and pair clearance.
- `src/catalog.js`, `src/director.js`: obstacle definitions and progressive waves.
- `src/characters.js`: complete character silhouettes, animated limbs, shoes and cleaned head sprites.
- `src/props.js`: cached proportional paper props and vehicles.
- `src/environment.js`: cached sky, four parallax layers and asphalt.
- `src/rocket.js`: original launch, landing and recovery events.
- `src/slapstick.js`: cosmetic Amber projectile with a bounded path behind the player.
- `src/main.js`: input, lifecycle, boost, score, composition and HUD integration.
- `style.css`: shared interface tokens, responsive layout and controls.

Tap/release, Space, W or Up jumps; hold 0.4 s for full charge. B or Shift activates boost. P/Escape pauses. Touch on UI buttons does not jump. Losing focus pauses the game. Local-only `window.__qa` exposes controlled test state; production exposes only a read-only JSON snapshot through `render_game_to_text()`.

## Balance and rendering

Start: 130 km/h (360 logical units/s), ramp to 400 km/h over 150 s. Boost still expands obstacle spacing and view range together, maintaining fair reaction time. Ordinary human obstacles are 94 units; Rogozin plus trampoline and peak bounce is 130 units. Collision boxes remain slightly inset and have no hidden charge requirement.

Simulation rate is independent of display refresh rate. Render resolution is capped at DPR 1.5 for touch devices, 2 for desktop and a 3-million-pixel budget. Backgrounds and static props are cached; HUD refreshes at 10 Hz. Identical FPS across different hardware cannot be guaranteed; game time and physics remain identical at 30/60/120 FPS.

## Validation

`npm test` covers clock schedules, interruption handling, jump extrema, every obstacle's launch window, trampoline phases and allowed two-obstacle patterns. Browser verification must cover real input, desktop/portrait/landscape, both boosts, taunt/crouch, resize, milestones, console errors and screenshots. Chrome mobile emulation is not a real iPhone performance test.

The original PNG source art remains unchanged. New scenery, props and character poses are authored Canvas drawings in the same cut-paper palette. All celebrity scenes are fictional game parody.
