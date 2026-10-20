# Content catalogue

`src/content.js` is the canonical list of obstacle definitions. `src/catalog.js`, `PROP_TYPES` and `AIR_TYPES` are compatibility views of this list, not independent lists to edit. The file is checked against `src/content-types.d.ts`; no TypeScript runtime or browser build step is required.

Each definition has a permanent ID, display name, world width/height, collision inset/profile, ground/air placement, bottom-centre anchor, biome membership, visual renderer/key, asset references and independent hero/obstacle reactions. `all` means universal; a list means only those biomes. The factory metadata does not yet activate a factory scene.

World units are independent of source-image pixels, transparent padding, camera scale and device DPR. Preserve aspect ratio and the contact anchor. The original sizes and existing timing/physics are retained in 3.1.0. Existing special painters remain implementations behind renderer keys; this release does not claim a complete data-driven humanoid animator.

## Add a compatible obstacle

1. Choose a new stable ID; never repurpose an ID after renaming artwork or display text.
2. Reuse a supported renderer/movement/collision profile, or implement a new profile once when its behaviour is actually new.
3. Add the definition to `OBSTACLES`. Set both reaction directions explicitly through `hero`/`obstacle` (omission normalises to `enabled:false`). Enabled reactions require a registered animation, trigger and positive range.
4. Register material files in `ASSETS` and reference their IDs. For new artwork follow the project's photograph/reference/provenance pipeline before producing sprites.
5. Run `npm ci`, `npm test` and `npm run check`. The check includes JavaScript syntax, material files, character painters and TypeScript validation of the pure content module.
6. Inspect `?review=obstacles`, actual gameplay, contact points and both reaction directions on desktop and mobile. New mechanics require route validation and regression tests before joining a spawn pool.

`BIOME_CYCLE` records the planned ordered loop; runtime biome switching will be introduced in a later tested release. The current game remains the spaceport. No catalogue addition may silently replace public artwork or change balance.
