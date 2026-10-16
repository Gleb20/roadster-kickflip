# Roadster / Kickflip

Canonical game: https://gleb20.github.io/roadster-kickflip/

Release 2.3.2: muted spaceport effects, nine-frame kickflip, rolling wheels and suspension, upright mutual taunts, tracking pupils and the X shirt logo. See [release checks](docs/releases/2026-10-16-v2.3.2.md).

An online Canvas 2D game with native JavaScript ES modules and a DOM UI. No runtime framework, CDN dependency, bundler or generated standalone HTML copies. The small `index.html` is the web entry point; all logic lives in `src/`.

## Development

Node 20+:

```sh
npm run dev
npm test
```

The server listens at http://127.0.0.1:8766. Publish this directory at the GitHub Pages repository root. Keep the original PNG atlases and obstacle-photos.png at their existing paths.

## Code ownership

- `src/clock.js`: fixed 120 Hz simulation clock; visible pause after a long interruption.
- `src/physics.js`: movement constants, analytic jump, collision bounds and pair clearance.
- `src/catalog.js`, `src/director.js`: obstacle definitions and progressive waves.
- `src/characters.js`: complete character silhouettes, animated limbs, shoes and cleaned head sprites.
- `src/props.js`: cached paper props and South Park-inspired couch family.
- `src/photo-cutouts.js`: shared photographic vehicle atlas and Amber head; clean alpha, proportional fitting and ground anchors.
- `src/environment.js`: cached sky, four parallax layers and asphalt.
- `src/rocket.js`: slow midground spaceport passage, launch/landing and recovery director.
- `src/spaceport-sprites.js`: single shared sprite atlas for hardware, exhaust, smoke, dust and explosions.
- `src/slapstick.js`: cosmetic Amber projectile with a bounded path behind the player.
- `src/main.js`: input, lifecycle, boost, score, composition and HUD integration.
- `style.css`: shared interface tokens, responsive layout and controls.

Tap/release, Space, W or Up jumps; hold 0.4 s for full charge. B or Shift activates boost. P/Escape pauses. Touch on UI buttons does not jump. Losing focus pauses the game. Local-only `window.__qa` exposes controlled test state; production exposes only a read-only JSON snapshot through `render_game_to_text()`.

## Balance and rendering

Start: 130 km/h (360 logical units/s), ramp to 400 km/h over 150 s. Boost still expands obstacle spacing and view range together, maintaining fair reaction time. Ordinary human obstacles are 94 units; Rogozin plus trampoline and peak bounce is 130 units. Collision boxes remain slightly inset and have no hidden charge requirement.

Simulation rate is independent of display refresh rate. Render resolution is capped at DPR 1.5 for touch devices, 2 for desktop and a 3-million-pixel budget. Backgrounds and static props are cached; HUD refreshes at 10 Hz. Identical FPS across different hardware cannot be guaranteed; game time and physics remain identical at 30/60/120 FPS.

## Validation

`npm test` covers clock schedules, interruption handling, jump extrema, every obstacle's launch window, trampoline phases and allowed two-obstacle patterns. Browser verification must cover real input, desktop/portrait/landscape, both boosts, taunt/crouch, resize, milestones, console errors and screenshots. Chrome mobile emulation is not a real iPhone performance test.

The original PNG source art remains unchanged. Scenery, props and character bodies are authored Canvas drawings in the same cut-paper palette. All five vehicle obstacles now use generated photographic cutouts. Amber Heard has a generated photographic-style head. Buildings are excluded from the obstacle pool. All celebrity scenes are fictional game parody.

Visual QA: `?review=obstacles` shows the complete obstacle cast using the live painters. This is a read-only contact sheet with no gameplay, editor or extra HTML build.

## Video-derived kickflip v2.2

`src/roadster-flip.js` plays nine normalized transparent frames from Tesla’s Roadster Event (11:26.690–11:29.890). AI-assisted background removal and exposure correction were used; this is retouched video imagery. Frames are selected by jump progress, without rotation, squash or negative scale. Idle and landing share frame 0. Review all poses and the loop at `?review=flip`. Individual PNGs and the runtime atlas are in `assets/roadster-flip/`; original captures are in `art-source/roadster-flip/`. Physics and UI are unchanged.

## Spaceport and face v2.3

Boost swaps a cached full face with an opaque facial replacement; there is no translucent feature overlay. Spaceport art is graded once and rendered behind the near hangars. Launch and landing last 14 seconds each; a passing site persists through events, with a capped parallax rate during boost. Failure recovers through a 5-second smoke event and a 12-second crawler delivery. Review the actual painters at `?review=spaceport`.

## Mutual taunt and gaze v2.3.2

Elon and Donny use only the hand nearest their opponent. Fixed-length arm bones lift a compact forearm; the middle finger points up while the other fingers fold into the palm. Its angle stays within ±15° of screen vertical (normally ±10°), compensating for body lean during boost and crouch. Within 300 logical units, both faces turn angry and both pairs of pupils track the opponent in two dimensions through approach, jump and departure. The boost face uses the same opaque cached base, so no original eyes or mouth show through. The cameo wave keeps priority. Active Donny poses are rendered dynamically so a cached ground pose cannot freeze his gaze during a jump. Elon's shirt retains the company X logo.

`npm test` includes arm-length, upright-finger and pupil-bound regressions. Optional rendered verification: start `npm run dev`, then run `node scripts/verify-characters.cjs` using an existing Playwright installation (`PLAYWRIGHT_MODULE` and `CHROMIUM_EXECUTABLE_PATH` can select local tooling). It measures finger angles after the final screen transform. Release checks and limits are recorded in [the release note](docs/releases/2026-10-16-v2.3.2.md).


## Rolling Roadster and rocket verification v2.3.2

The upright car is anchored at the measured tyre contact line of frame 0. Its photographed tyres and original rims are cached as separate layers; rim exposure is raised once for readability, and rotation follows speed in the fixed simulation step. A damped cosmetic spring lowers the body and Elon under jump charge, releases at takeoff, and compresses on landing. Tyres remain on the road while grounded. The nine airborne poses, jump physics and collision bounds are preserved; the old vertical jet polygons at takeoff/landing are removed. Pause freezes both wheels and suspension.

Rocket launch, landing, failures and crawler replacement use the existing muted midground atlas. Detonation now uses the exact ascent/descent altitude, eliminating a position jump. Full integrated cycles are verified with accelerated 120 Hz steps and regular rendering in Chromium. `scripts/verify-roadster.cjs` also exercises real charge/release, landing response, pause/resume, boost, wheel pixels and tyre contact at desktop/portrait/landscape sizes. See [release checks and rollback](docs/releases/2026-10-16-v2.3.2.md). Physical-device acceptance remains unverified.

## English, sound and meme scenes v2.4.0

All player-facing copy and accessible labels are English. SOUND ON/OFF is an immediate, keyboard-accessible opt-in toggle, persisted locally; a restored setting waits for a user gesture to unlock WebAudio. The original synthesized start, jump, landing, boost, pass and crash tones are preserved. Audio nodes disconnect after playback and a master gain mutes immediately.

Joe Rogan is a paper obstacle with headphones, a microphone and dynamic gaze. Elon raises a joint on approach, inhales, makes the podcast meme face while passing, exhales and lowers his arm on departure. The choreography depends on relative distance, freezes with pause and remains alive briefly after Joe leaves the viewport. Cameo waves have priority; Donny retains his angry mutual gaze during boost. Outside encounters, boost uses an Impossibru-inspired squint and grimace.

The smaller hangar and rocket now share a low ground plane behind near buildings. A stationary pad and independently cropped tower reuse the existing atlas. The tower retracts before liftoff and returns over 2.4 seconds after successful touchdown; failed landings leave it open until replacement delivery.

Refactoring: optional audio lives in `src/sound.js`; pure encounter choreography lives in `src/encounter.js`; shared spaceport layout drives gameplay and its review sheet. `npm run check` now checks every runtime JS module. No new dependencies. `scripts/verify-v24.cjs` exercises sound, real jump over Joe, departure cleanup, rocket frames, English states and responsive layouts with an existing Playwright installation.

## Mobile occlusion, flip exhaust and Safari audio v2.4.1

Mobile spaceport hardware is scaled up 1.65×. Opaque near terrain closes the strip below building silhouettes; the rocket, tower and hangar stay behind roofs/walls without protruding beneath them. Nine-pose, source-anchored thruster jets follow the car roll, clip at the road and produce a short landing dust cloud instead of green sparks. Dust updates in simulation, scrolls with the world and has bounded lifetime/count.

Sound uses an explicit playback AudioSession on opt-in where available, primes output in a user gesture, resumes interrupted/suspended contexts on touch completion and keeps the first effect through async unlock. Muting releases the prior session. Safari hardware audio remains unverified; see [v2.4.1 verification](docs/releases/2026-10-16-v2.4.1.md). `scripts/verify-v241.cjs` checks pixel occlusion, touch landing and audio recovery. `src/thrusters.js` owns the cosmetic exhaust and dust; physics is unchanged.

## Readiness-gated blueprint loader v2.4.2

Nine existing kickflip poses now animate as inline white SVG schematics inside a segmented instrument. The ring and progress bar track CSS and six decoded/baked material sets. The complete first scene, including Elon's actual face and cleaned-head cache, is prepared before enabling start and revealing the game. A failed resource or first scene keeps the game blocked and offers retry. Critical inline vectors/styles are visible before the larger resources arrive; reduced motion stays static. No new runtime dependencies or raster art.

See [release and verification details](docs/releases/2026-10-16-v2.4.2.md).
