## UI refinement 3.7.3 — phone feedback, 21 October2026

User phone feedback incorporated in3.7.3: compact orange Legend/install shortcuts, actual/possible global rank, quieter menu, simplified pause/results and automatic safe-boundary PWA updates. [Evidence](verification/2026-10-21-ui-v373/README.md). Earlier UI states are release history.

# Release3.7.1 - UI and PWA icon

User authorized publication of the completed menu/HUD refinements and corrected kickflip preview to the existing Pages URL. This bounded presentation release does not complete the older3.7 programme's full turntables or metallic head trophies. Sharing of verified scores and the app icon are implemented. Earlier open programme items remain individually unresolved.

## Factory spatial entry and quieter background — 3.6.2

User requested a gradual physical entry, muted factory background, much smaller arms, varied equipment sections, an occasional distant forklift and no factory workers. The score-only10k/20k/30k cycle is preserved. The doorway travels with the road; both scenes are opaque, without a fade. Background sprites are dimmed/desaturated once, with a darker obstacle plane. Four sections alternate assembly, machining, storage and service. Arms scale0.62→0.24; workers are absent from the renderer/cache. New photo-guided paper racks (Dexion P90) and machinery (Haas VF-2) are fictional background arrangements, with full provenance and no claim of actual Tesla equipment.

Base: public3.6.1 d83b2434fc64bb88c55d1cf158a29431140f0592. Immutable roadster-v3.4.2 generation, physics, collision shapes, scoring and backend are unchanged. Existing route-search stalls, ramp geometry, daylight and biome-specific pools were rechecked and remain outside this bounded visual update. After phone acceptance, the bounded debt proposal remains measuring route-search stalls before choosing an implementation. Evidence: verification/2026-10-20-v3.6.2/. Local3.7.x menu/icon work is a separate unpublished candidate and must incorporate this update before its release.

# Incremental upgrade releases

## Score-based biome correction 3.6.1 — 20 October 2026

User feedback supersedes the 150-second rule: current-run score is the only condition. At10,000 enter factory, at20,000 return to spaceport, at30,000 enter factory again. No minimum play time, survival condition, record requirement or waiting for the rocket. The existing four-second crossfade is animation only; pause freezes it. Multi-threshold bonuses select the actual score band immediately. The accepted scope changes no falls, physics, obstacle stream or leaderboard rules. Earlier time-based3.6.0 descriptions below are historical.


User-authorized on 20 October 2026: implement and publish successive tested releases to the existing GitHub Pages game, sending a versioned link after each release. Keep the frontend and leaderboard UI at `https://gleb20.github.io/roadster-kickflip/`. A separate API/data store is required for online writes; that does not require moving the game away from Pages.

## Completed increments

- 3.1.0: content foundation, published and live-verified (commit `8030efb5f161e25786f6bd2214876afe9acee79d`).
- 3.2.0: encounter collection, published and live-verified (commit `218c4618e1cffb18babbfba78be15c0a2e346c18`).

- 3.3.0: installable/offline PWA, published and live-verified (commit `01f32b8dd1973d8eb67fc1833bc0cbcc144cdcc4`).

- 3.4.0: reusable paper rider rig, published and live-verified (commit `b55e2be953233fcba8fbac3110a72a2e9693e454`).

## Current bounded release 3.6.0

Factory scenery now starts at 150 active simulation seconds and alternates with spaceport every 150 seconds, with a four-second crossfade. Prepared factory PNGs are preloaded/cached; background assembly/logistics animate without entering the gameplay collision plane. Existing ranked generation remains on immutable roadster-v3.4.2, including its shared encounter pool. No leaderboard data or provider configuration changes.

Supabase ranking 3.5.0 and compact-grab/encounter corrections 3.5.2 are already published; older Cloudflare/Render notes below are historical. The rest of programme 3.6 (independent daylight, versioned biome-specific obstacle pools and the demo ramp/stunt) is unfinished. Verified video showed an overhanging quarter-pipe, conflicting with the old written convex-arch interpretation; resolve that geometry before exact demonstration artwork. Physical-phone acceptance and recorded route-search performance debt remain separate.

## User-feedback increment3.4.2

The user prioritised a specific fall/reunion choreography before the pending online release. Two seated rebounds and a stronger third launch replace the palm push; a single nose/rear somersault replaces longitudinal car rolls. Recovery duration, input locks and tap acceleration remain. Current candidate evidence is in `verification/2026-10-20-v3.4.2/`. Ranking3.5 remains separate and must merge this new ruleset before deployment; do not publish the older candidate over3.4.2.

## Delivery order

1. **3.1 — Content foundation:** one obstacle catalogue, explicit anchors/renderers/reactions/biomes, validation and gradual typing. Preserve gameplay as a measurable baseline.
2. **3.2 — Encounter collection:** silhouettes, non-interrupting discovery (collision counts), menu/pause entry, detail cards and persistent NEW until first detail view. Full turntable artwork is a later content release; static cards must not be described as completed rotations.
3. **3.3 — PWA:** installation, deliberate offline content, independent staging/cache scopes and safe updates between attempts. Preserve the browser URL and saves.
4. **3.4 — Animation foundation; 3.4.1 — Reproducible runs:** reusable rig/clip contracts, seeded generation, shared headless simulation and bounded difficulty. Preserve foot/tyre contacts and the current controls.
5. **3.5 — Online leaderboard:** Cloudflare Workers/D1 API candidate with a separately sized Node replay verifier, while the game stays on Pages. Optional submission of any completed run, server validation, one record per run, pagination, retry/idempotency and migration rehearsals. Provider access, verifier CPU and costs must be tested before selecting deployment settings.
6. **3.6 — Biomes and light:** spaceport/factory loop, concrete/yellow markings, layered factory with workers/robots/logistics and near-wall convex ramp. Factory car-stunt preparation/performance replaces the rocket event there. Day/night remains independent of biome cycles.
7. **3.7 — Full presentation:** photo-referenced turntables, three metallic head trophies, sharing and separately reviewed preview artwork.

Minor versions/patches may split an item when that gives a smaller testable release. Do not skip an incomplete feature by marking it done. Artwork and physical-device feel have their own acceptance.

## Gate for each release

Freeze the candidate and exact parent; inspect the diff; run focused and existing checks; verify desktop/mobile views and real input; test the reverse change in an isolated checkout. Update main with an expected-head lease, confirm Pages deployed the correct commit, and compare live resource hashes/version. No claim of online publication from a local test or a successful ref update alone.

Send the versioned play link as soon as live checks pass, then continue the authorised sequence. User mobile feedback steers subsequent work. Keep unsent work in isolated checkouts and preserve unrelated local changes. Changing the frontend hosting or deleting leaderboard data is outside this instruction.
