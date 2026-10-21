## Factory3.9.0 — approved art integrated,21 October2026

User approved the assembly and four-model sprite packets and requested earlier entry at7,000 points, then alternating every7,000. Production runtime is based on remote main72403dc. Location changes keep the physical world doorway and gameplay state. The whole ground plane becomes concrete slabs inside the hangar, separated from production by one continuous yellow line; there is no interior lane marking.

A30-second decorative production cycle carries a proportionate car along the conveyor: shell, panels, paint (metal trim for Cybertruck), glass/lights and wheels. Four IK robot stations use approved cropped tools and model-specific parts. Car follows slowly right on narrow screens; distant racks and CNC share a slower parallax plane. S/X/Roadster choose red/blue/white per body excluding the previous colour; Cybertruck stays steel. A different model is chosen each entry. State freezes on pause, survives resizing and progresses through the outgoing doorway. Choices use separate cosmetic randomness and persist in memory across retry/Home.

121 game and8 server tests plus source/content/type/PWA checks pass.50 factory checks cover all50 model/color/stage drawings and320/390 portrait,844 landscape,1440 desktop.64 biome checks include an unmodified-obstacle310-second route: first factory at52.31s/7,146 points, then14k/21k/etc. This is one route, not a guaranteed entry time.8 actual3.8.0-to3.9.0 upgrade checks retain best, collection, finished3.8.0 record and cold offline launch. Physical iPhone/Safari acceptance remains with the user. Current publication evidence: [release-status.json](verification/2026-10-21-factory-v390/release-status.json).

The3.8.0 physics, score epoch, saved scores, compatible dual-ruleset backend and frozen verifier remain unchanged. No backend deployment or public test-score writes. Older approval-pending art entries are superseded by this integration. Ramps remain cancelled. Rechecked open topics: route-search stalls, independent daylight and biome-specific obstacle pools remain outside this scope; after phone acceptance, the bounded debt proposal remains a fresh route-search timing measurement.

## Published3.8.0 — grab, release and ideal landing

[Play3.8.0](https://gleb20.github.io/roadster-kickflip/?v=3.8.0). Game commit2a4061309e1a5b1d6c2ad17683410136fba9c846, tested treedf68cbc4ba97557e7c16d9d5937f983d504b399a; Pages39656822040 succeeded. The new hold/release physics, visible extension,±10° PERFECT+50 bonus, retained±40° safe zone and touchdown leg compression are public. Compatible dual-ruleset backend is deployed; old records/pending sessions remain supported.10 existing scores retained; no fake public test scores added.

117 game tests,8 server tests and all source/content/type/cache checks pass.27 public native keyboard/touch/pause/two-finger/offline checks pass with no runtime errors. Both real-input paths landed one ideal flip for150 points. All70 public core resources and the worker match.8 exact old-PWA→new-PWA checks preserve best, collection and old finished record. A synthetic repeated-update Home timeout reproduces on the old release and remains separately recorded; explicit restart and actual-version migration pass. Physical phone feel remains the user's review. Evidence: [release-status.json](verification/2026-10-21-flight-v380/release-status.json).

Earlier candidate/pending entries below are history. The separate unapproved factory assembly art is excluded; its cancelled ramp is not an open feature. After phone acceptance, the bounded debt proposal remains a fresh route-search timing measurement.

## Flight3.8.0 — authorized release,21 October2026

The user approved updating the server together with the game if a simpler exchange cannot resist request tampering through browser Network tools. Hidden fields, browser-computed hashes/signatures and duration limits do not establish that a claimed score came from play. Keep the existing server replay verifier for this release; there is no authorized switch to client-trusted totals or obligation to build a second verification scheme.

Backend deployed with both frozen rulesets. Its downloaded bundle matches the tested source SHA256b13297aa39747b21410e9918ccde22e771853a0c6f8dccf1b818a4a8ff4b70e4. RPC body matchesc42da7aa4a1b64b9ebf8fffbd68ba630;10 accepted scores and263 pre-existing sessions preserved, epochv3 and enabled JWT gateway unchanged.13 hosted checks pass, including old/new session support and rejection of an incomplete replay with a fabricated huge total. No public QA scores were added.8 exact3.7.3→3.8.0 upgrade checks pass, including native-touch restart, retained best/collection/old finished best and cold offline start. Earlier synthetic repeated-update Home timeout remains recorded separately.

Frontend publication is in progress. Check release-status.json before claiming it live. The separate unapproved factory-assembly art stays outside this release; the ramp has been cancelled in that separate brief. Route-search timing, independent daylight and obstacle pools remain outside this task.

## Flight3.8.0 candidate acceptance state

117 game tests and all source/content/type/cache checks pass;8 server tests;23 native keyboard/touch landing checks;40 general gameplay;11 replay;73 menu/disposable-database checks. Exact inverse reproduces public3.7.3 tree7393ac6dd2f656f6ad2ed88cba1bc4cb991a4efc and111 tests/checks.13 PWA checks pass before the same Home-activation timeout seen on unchanged3.7.3; explicit restart and cold offline pass. Legacy extended screenshot equality is not a green whole-suite claim. Earlier Supabase authorization blocker is resolved by direct human approval. Backend is deployed; Pages publication follows. Runtime source is ready and snapshotted; preserve the old public release until server compatibility is applied or the user explicitly chooses an offline-only trial.

## Flight3.8.0 — candidate for phone acceptance

Based on public3.7.3 c2cfa916c14645cedd1f4d17b9b4f83c1a6ee054. Hold in the air: one compact grab, 7.2rad/s. Release: extend over0.18s, brake at24rad/s² toward existing-direction1.8rad/s; there is no automatic upright targeting. Reholding restores the grab over0.12s. Safe landing remains±40° and≤240°/s; ideal is±10° and pays+50 base points, including ordinary upright jumps. The pre-landing multiplier applies once; ideal adds0.1 combo, never fuel or an extra speed-streak increment by itself. Overholding still falls. A grounded0.28s leg-compression pulse absorbs touchdown and freezes on pause.

New immutable ruleset roadster-v3.8.0 accompanies the changed rotation, silhouette timing and scoring. The old roadster-v3.4.2 verifier remains byte-identical. Prepared server dispatcher and additive RPC update accept both versions, preserve score epochv3, accepted scores and old pending sessions. Old saved bests remain usable after upgrade. Server deployment is authorized and complete; both old and new online session creation were verified. Current publication/verification state: [release-status.json](verification/2026-10-21-flight-v380/release-status.json).

Recorded synchronous route-search stalls and independent daylight and biome-specific pools remain open and outside this feature. After physical-phone acceptance, propose a bounded measurement of route-search stalls before choosing an optimisation.

## UI refinement 3.7.3 — phone feedback, 21 October2026

Based on published3.7.1 `15f7693bbebd46bb6af601c88dc197b56711a6f1`. Equal compact square shortcuts sit under the header: Install app left, orange Legend right; Legend reuses the approved silhouette. Main menu shows Personal Best and a fetched global rank, centered Leaderboard, then a centered Let's Go / next-run tips dock. Removed local/online readiness copy. Verified bests use their actual entry rank; unsubmitted/legacy bests use “Would rank #N globally”, counting existing equal scores before the new result in one leaderboard snapshot. Lookup uses existing read-only pages with logarithmic requests; no backend/schema/ruleset change and no automatic public submission. Loading and unavailable states never invent a rank.

Pause has Home top right, Current Run, primary Resume and a square secondary Restart to its right. No pause posting/leaderboard/divider. Results have Home top right, a primary-color Submit score text action immediately below Your Score, then record celebration/flips and a wider muted Try again. Saved-best posting remains explicitly available in the menu when eligible. Existing24h submission and legacy-replay limitations are preserved.

Automatic verified PWA updates replace the manual update action, at a visible menu with no dialog or an explicit start/restart boundary. Active/paused attempts, finished-score screens, forms and other game windows remain protected. Exact behavior and older-version migration: pwa.md. Original icon, factory3.6.2, physics, generation, score epoch and backend are retained. Existing route-search performance debt and factory ramp/daylight/pools remain separate; bounded next proposal is fresh route-search measurement after phone acceptance.

# Tesla Jump - release3.7.1

User explicitly authorized publication of the UI and corrected kickflip PWA icon to the existing GitHub Pages game on20 October2026. Parent is369cce37d2676f09437e492a8dcf3873b6207e42 /3.6.2. Release is isolated from the original dirty checkout. Scope: collection teaser, compact pause controls, score-first results, retained finished best, actual server rank, public score links, next-run tutorial checkbox and final simplified kickflip icon. No gameplay/balance/backend/ranking-rule change. The actual accepted result identity is persisted; late acceptance of another run cannot overwrite the best's identity. Existing saves remain intact.

The immutable verifier accepts only a run ending at its first collision. Pause therefore submits a saved finished best while preserving the current paused attempt. Legacy best numbers without replay remain local. Posting is explicit and limited by the unchanged24-hour server session window. Source photo and video references, exact generator prompt and public credits are retained; research photo/TV pixels stay out of the release package. Physical-device acceptance remains the user's next step. [Release evidence](verification/2026-10-20-release-v3.7.1/README.md).

Recorded synchronous route-search work is still outside this release. Next bounded debt proposal: remeasure its stalls before choosing caching or workers. Factory ramp/daylight/pool decisions and full turntables remain open, not marked complete by the UI work.

The latest3.6.2 spatial factory entrance, quieter sections and rack/machine assets are included intact. The earlier3.6.1-based candidate was never published.

## Factory spatial entry and quieter background — 3.6.2

User requested a gradual physical entry, muted factory background, much smaller arms, varied equipment sections, an occasional distant forklift and no factory workers. The score-only10k/20k/30k cycle is preserved. The doorway travels with the road; both scenes are opaque, without a fade. Background sprites are dimmed/desaturated once, with a darker obstacle plane. Four sections alternate assembly, machining, storage and service. Arms scale0.62→0.24; workers are absent from the renderer/cache. New photo-guided paper racks (Dexion P90) and machinery (Haas VF-2) are fictional background arrangements, with full provenance and no claim of actual Tesla equipment.

Base: public3.6.1 d83b2434fc64bb88c55d1cf158a29431140f0592. Immutable roadster-v3.4.2 generation, physics, collision shapes, scoring and backend are unchanged. Existing route-search stalls, ramp geometry, daylight and biome-specific pools were rechecked and remain outside this bounded visual update. After phone acceptance, the bounded debt proposal remains measuring route-search stalls before choosing an implementation. Evidence: verification/2026-10-20-v3.6.2/. Local3.7.x menu/icon work is a separate unpublished candidate and must incorporate this update before its release.

## Score-based biomes3.6.1 —20 October2026

User rejected the2:30 wait and explicitly selected score as the only condition: every10,000 points of the current run advances BIOME_CYCLE (10k factory,20k spaceport,30k factory). Implemented in isolated /tmp/tesla-jump-factory-v360-20261020, branch codex/score-biomes-v361, from public49db4176eca01b5d3d2ae4e0d05b75105436e371. createBiomeScene remembers the score-boundary transition; time only animates the existing4s crossfade and pauses with the run. No rocket/landing/survival/minimum-time gate. Restart clears the score band. A large bonus immediately selects the correct band. Shared ranked generation and immutable roadster-v3.4.2 remain unchanged; no backend, scores or art changes. Evidence and release status: verification/2026-10-20-v3.6.1/. Older150s requirements are superseded. Existing route-search debt/ramp/daylight remain outside this user-requested correction; next bounded debt proposal is still measurement only.

# Tesla Jump — release3.5.2

## Factory 3.6.0 candidate — 20 October 2026

User requested connecting the factory with the first transition after 2–3 minutes. Implemented in isolated `/tmp/tesla-jump-factory-v360-20261020` from public 3.5.2 (`4b33e3b276de4cf65a69ee9ba7409f731022c80b`). Starts at 150 active simulation seconds, repeats every 150 seconds with four-second crossfade; pause freezes the clock and retry returns to spaceport. Both complete scenes are preloaded and cached for offline use. Existing photo-referenced packet was copied byte for byte; robot pivots calibrated in the assembled scene. No new drawing.

This is a scenery increment: shared ranked generation/physics and immutable server ruleset remain roadster-v3.4.2. Rogozin can still visit the factory; catalogue biome restrictions are not yet enforced by that existing director. A future gameplay-pool change needs a separately versioned verifier. Factory ramp/demo and independent daylight remain unfinished; video ramp shape still needs resolution. Do not revive obsolete Cloudflare/Render infrastructure decisions. Existing route-search debt is outside this bounded request; propose a remeasurement only after release. Candidate checks, exact parent, freeze and inverse evidence: `verification/2026-10-20-v3.6.0/`.


Authorised for publication on20 October2026 for phone acceptance. One approved compact grab: both soles on photographed roof, front-left sill grip, rear-right reactions and preserved facial expressions/gaze. Ordinary jumps retain nine-frame kickflips; manual grabs keep roof toward rider. Content reactions declare space target/self: directed taunt/money/point versus mouth-local Joe drag then withdrawal/exhale. Persistent slower cash falls after firing stops. Simulation/ranking ruleset remains roadster-v3.4.2; no backend or score-data changes.

Base main210a26a /3.5.0. [Release packet](verification/2026-10-20-release-v3.5.2/README.md), [animation contract](hero-animation.md), [gameplay](gameplay-v3.md). Physical iPhone/Safari acceptance remains the user's test. Existing route-search debt remains separate; propose bounded remeasurement after acceptance. Original dirty workspace is preserved and must not be reset/staged as the release source.
