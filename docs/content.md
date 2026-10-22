## Encounters 4.0.0 — 22 October 2026

Approved and implemented: seven harmless timed flybys (UFO, Prime delivery drone, bluebird, Starlink, regulator drone, Sikorsky VS-300 with Igor Sikorsky, and factory quality servo-skull). Their state is cosmetic, independent of ranked RNG, fuel, score and collisions. A whole silhouette clears at least0.75 seconds before the route's charge/lead preparation; short approaches skip the encounter. No solitary aerial scoring wave or aerial ceiling remains.

UFO proximity temporarily replaces Elon’s head with a reptile head. Factory-only Xi exchanges two animated lightning paths with Elon's active hand; the scene is harmless and reduced-motion aware. A quieter background molten-metal vat contains a robotic thumbs-up arm. The factory ground pool uses truck, T-800 Arnold, BYD Seal, Xiaomi SU7 and battery AGV; the floating quality inspector supplies the fifth new factory opponent. Simpsons are replaced by two low lying South Park-style spectators. Existing Simpsons discovery/viewed timestamps migrate to the replacement while the historical entry is preserved.

New ranked generator is `roadster-v4.0.0`. Frozen3.4.2/3.8.0 remain byte-identical, and the hosted verifier supports all three. SQL migration only expands the existing RPC ruleset guard; no ranking rows, RLS or authentication settings change.15 photo/reference-guided generated assets, originals, prompts and provenance are retained in `art-source/enemies-v400-20261022/`. [Playable cast gallery](../assets/concepts/enemies-v400/review.html). [Verification evidence](verification/2026-10-22-enemies-v400/README.md).

135 game tests,9 server tests and source/content/type/PWA checks pass. Local browser coverage includes320/390 portrait,844 landscape,1440 desktop, native first jump, pause, reduced motion, two180-second production runs and actual3.9.3→4.0.0 upgrade/offline preservation. These are browser checks; physical iPhone/Safari acceptance remains open. Existing route-search performance and real-phone timing debt remain separate; no general refactor is added.

# Content catalogue

`src/content.js` is the canonical list of obstacle definitions. `src/catalog.js`, `PROP_TYPES` and `AIR_TYPES` are compatibility views of this list, not independent lists to edit. The file is checked against `src/content-types.d.ts`; no TypeScript runtime or browser build step is required.

Each definition has a permanent ID, display name, world width/height, collision inset/profile, ground/air placement, bottom-centre anchor, biome membership, visual renderer/key, asset references and independent hero/obstacle reactions. `all` means universal; a list means only those biomes. Version 3.6.0 activates factory scenery on the existing shared ranked obstacle stream. Biome membership is catalogue metadata for a future versioned spawn-pool change; it does not filter the current immutable roadster-v3.4.2 director. Rogozin can therefore still visit the factory in this first scenery release.

World units are independent of source-image pixels, transparent padding, camera scale and device DPR. Preserve aspect ratio and the contact anchor. The original sizes and existing timing/physics are retained in 3.1.0. Existing special painters remain implementations behind renderer keys; this release does not claim a complete data-driven humanoid animator.

## Add a compatible obstacle

1. Choose a new stable ID; never repurpose an ID after renaming artwork or display text.
2. Reuse a supported renderer/movement/collision profile, or implement a new profile once when its behaviour is actually new.
3. Add the definition to `OBSTACLES`. Set both reaction directions explicitly through `hero`/`obstacle` (omission normalises to `enabled:false`). Enabled reactions require a registered animation, trigger and positive range.
4. Register material files in `ASSETS` and reference their IDs. For new artwork follow the project's photograph/reference/provenance pipeline before producing sprites.
5. Run `npm ci`, `npm test` and `npm run check`. The check includes JavaScript syntax, material files, character painters and TypeScript validation of the pure content module.
6. Inspect `?review=obstacles`, actual gameplay, contact points and both reaction directions on desktop and mobile. New mechanics require route validation and regression tests before joining a spawn pool.

`BIOME_CYCLE` selects scenery every 10,000 current-run points: spaceport → factory → spaceport. Score is the only trigger; large bonuses immediately choose the actual band. In 3.6.2 a doorway starts just beyond the right viewport and travels left at road speed as a fixed world boundary. Two opaque clipped scenes meet behind the doorway; no crossfade or time requirement. Distance, difficulty, fuel and obstacles carry across. Pause freezes both boundary and machinery, retry resets to spaceport; resizing preserves the world boundary. Rocket events update only in spaceport and reschedule on return.

Factory bays alternate assembly, machining, storage and service at1320 units with0.14 parallax. Arms use0.24 scale (previous0.62), with calibrated pivots and car/conveyor proportions. A small forklift appears only during18 of each44 active seconds in the storage bay and passes behind racks. Workers are removed from drawing and active offline cache; historical sources/credits remain. Ten active factory sprites are decoded before play. Background sprites receive a one-time muted grade with alpha unchanged; the road and obstacle zone use a quieter dark palette. Foreground obstacle art and collision geometry are unchanged. New photo-guided paper rack/machine additions and source credits are recorded in assets/factory/organic-v362-provenance.json. Reduced motion freezes decorative machinery. Independent daylight, versioned biome spawn pools and ramp demonstration remain separate unfinished stages.
