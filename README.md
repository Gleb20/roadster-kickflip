## Factory vat4.1.1 —23October2026

User requested farther scenery and a much smaller arm. Vat now sits at the far wall, behind storage and production: baseline236 instead of126,0.8 perspective,0.5 alpha and0.12 parallax. New photo/style-guided transparent sprite shrinks the complete thumbs-up arm to about one third relative to the vessel. Original v400 asset is retained. Ranked roadster-v4.1.0, opponent balance, input, server and scores are unchanged.138 tests, source/content/type/PWA checks,10 scene/gallery checks and9 actual4.1.0→4.1.1 update/offline checks pass. Evidence: docs/verification/2026-10-23-vat-v411/. Existing real-phone timing/daylight debt remains separate; bounded proposed follow-up is real-phone latency measurement.

## Published4.1.0 —late colliding aircraft and ordinary Xi

[Play4.1.0](https://gleb20.github.io/roadster-kickflip/?v=4.1.0). Game commit729e584508adfb2604174eb2275dd65cb61672c7 / tree83a681669e180e68c82addf0168ce175bd28b093. Pages39852888504 succeeded; all151 core resources and worker match.138 game tests,10 server tests,26 local browser checks,9 actual4.0→4.1 upgrade checks,29 public native input/offline checks and6 public gallery checks pass. Both public input paths earned PERFECT. Two180-second witness runs contain2/3 isolated air waves; their first air encounters occur on leg2 (third section), with zero runtime errors. A no-jump late-air collision is reproduced through server JSON checkpoints.21 hosted checks support all four rulesets and add0 public fixture results. Xi is a colliding factory ground opponent; the enlarged vat is behind the production line. Old finished4.0 record, best and collection survive. Original HEAD/index remain intact; physical iPhone/Safari acceptance remains open. Evidence: `docs/verification/2026-10-22-aerial-v410/release-status.json`.

## Aerial challenge4.1.0 —22October2026

Supersedes the4.0.0 harmless-flyby direction at the user's request. Xi is an ordinary colliding ground opponent in the factory pool, on the same baseline as cars and people. His mutual lightning reaction remains visual; body contact ends the run normally.

All seven flying models have box collision and belong to the ranked obstacle stream. Unlock is leg>=2: initial spaceport → first factory → return spaceport, beginning at14000 points. Allow8 seconds after each score-selected leg change before an air wave. A wave contains one low incoming aircraft, with no ground obstacle beneath it. It follows a single ground wave and forces a single ground breather afterward. Require at least6 ground waves and28 seconds between air spawns. First two air encounters use small models, altitude24 and approach80; later encounters use altitude32/approach110. Spawn at least2 seconds of approach distance away. Every admitted air wave has a shared production-physics route with no thrust, no fuel cost and timing margin±90ms. After its witnessed grounded exit, wait at least1.25seconds before the next wave. Failed route validation falls back to the ordinary ground single. Existing ground physics, rewards and input roles remain intact.

The foundry vat retains its approved source sprite, is320 units wide (formerly164), and is drawn inside the factory renderer after storage but before conveyor/shadows/robots, so production occludes its lower part. It stays background scenery. All three historical frozen rulesets remain unchanged;4.1.0 is additive. Preserve old finished4.0 records, best score and collection. Snapshot `/tmp/tesla-enemies-v410-before-20261022` protects the dirty source checkout and index. See `docs/verification/2026-10-22-aerial-v410/` for current verification and release evidence.

Rechecked debt: biome pools were fixed in4.0 and are no longer open; this task replaces safe flybys. Existing real-phone route-search/input timing and independent daylight remain separate. Proposed bounded debt follow-up is a real-phone event→step→render measurement after play acceptance.

## Published4.0.0 — verified release

[Play4.0.0](https://gleb20.github.io/roadster-kickflip/?v=4.0.0) · [Interactive cast gallery](https://gleb20.github.io/roadster-kickflip/assets/concepts/enemies-v400/review.html). Game commit2ee9a877cd5318dbaf1a2d4ae238c8bfcdcf1cf9 / tree9fd035c8b08f3cb6686fd1168f27dab113476dca. Pages39833251084 succeeded.151 public core resources and worker match;29 public native keyboard/touch/two-finger/pause/offline checks and6 public gallery checks pass with no runtime errors. Both public input paths earned PERFECT. One initial grab-state wait timed out; the diagnostic rerun passed unchanged.135 game tests,9 server tests,26 local browser checks,9 actual PWA upgrade checks, two180-second production runs and17 hosted verifier checks pass. Best, viewed Simpsons→lying-character collection and old finished record survive. No public fixture result was added. Original HEAD/index remain intact. Physical iPhone/Safari review remains open. Evidence: `docs/verification/2026-10-22-enemies-v400/release-status.json`.

For an older installed PWA, close old game windows/app and reopen the versioned link; existing saves remain. Bounded debt follow-up proposed: measure real-phone event→step→render latency before any further route-search optimization.

## Encounters4.0.0

[Play4.0.0](https://gleb20.github.io/roadster-kickflip/?v=4.0.0) · [Cast gallery](https://gleb20.github.io/roadster-kickflip/assets/concepts/enemies-v400/review.html)

Safe timed flybys replace airborne jump ceilings. New cast includes Sikorsky in a VS-300, a UFO with reptile-Elon reaction, factory T-800/Chinese EVs/AGV/servo-skull, and Xi exchanging two-way cosmetic lightning with Elon. Two lying paper characters replace the Simpsons couch. Old collection discoveries and ranked records remain compatible. [Implementation and verification](docs/verification/2026-10-22-enemies-v400/README.md).

## Mobile input 3.9.3

[Play3.9.3](https://gleb20.github.io/roadster-kickflip/?v=3.9.3). Expanded THRUST target preserved. Tip text responds to game input, the same-looking cross dismisses it, and active gameplay suppresses native long-press gestures. Route-search calculations run faster while retaining identical results and frozen ranked rules.128 game tests,8 server tests and97 native mobile checks pass; physical iPhone/Safari verification remains open. [Release notes](docs/releases/3.9.3.md).

## Published factory3.9.2 — varied robot life

[Play3.9.2](https://gleb20.github.io/roadster-kickflip/?v=3.9.2). Commit1694bee; Pages39669942139 succeeded. The approved line composition stays. Neighboring robots alternate four resting poses, claw angles and independent handling phases. Small stacks of existing panels/glass/wheels make pickup, lift, fitting and return legible. The foreground forklift is removed. Quiet concrete grain, slight slab-tone variation and conveyor contact/cast shadows add depth without objects in the rider's aisle.

124 game tests and source/content/type/PWA checks pass. Mobile/desktop production and motion checks are recorded in [release evidence](docs/verification/2026-10-21-factory-v392/release-status.json). 27 public keyboard/touch/pause/two-finger/offline checks pass; all132 core resources and worker hashes match. The active cache excludes the forklift. Physical phone/Safari acceptance remains with the user.

## Published factory polish3.9.1

[Play3.9.1](https://gleb20.github.io/roadster-kickflip/?v=3.9.1). Commit6069f71; Pages39666878920 succeeded. Robots, wrists and tools render in front of the body; each station reaches and retracts smoothly across stage boundaries. Body stages blend briefly. Model-name plates are removed. The production plane is22% smaller and less contrasty, with occasional fast passes by the existing small forklift in the closer aisle. Wall and storage parallax are much slower. The rider remains the foreground focus.

7,000-point alternation, models/colours, concrete aisle and3.8.0 ranked physics stay unchanged.123 game tests,50 assembly checks and17 focused motion/depth checks pass at320/390 portrait,844 landscape and1440 desktop. [Release evidence](docs/verification/2026-10-21-factory-v391/release-status.json). 27 public native keyboard/touch/pause/two-finger/offline checks pass; all133 core resources and worker hashes match. Physical phone/Safari review remains with the user.

## Published3.9.0 — factory assembly

[Play3.9.0](https://gleb20.github.io/roadster-kickflip/?v=3.9.0). Commit e83a69e; Pages39663279071 succeeded. Locations alternate every7,000 current-run points. The factory has a concrete aisle with a yellow production boundary, a continuous assembly conveyor, proportionate articulated robots, and distant parts racks/CNC. Each visit selects a different Model S, Model X, Roadster2.0 or steel Cybertruck; successive bodies vary red/blue/white where applicable. Physics, replay ruleset and records retain3.8.0 behavior.

121 game tests,8 server tests,50 factory browser checks,64 biome checks and8 actual PWA upgrade checks pass. Tested320/390 portrait,844 landscape and1440 desktop. Physical phone review remains with the user. [Evidence](docs/verification/2026-10-21-factory-v390/release-status.json). 27 public keyboard/touch/pause/two-finger/offline checks pass; all132 public resources and worker hashes match. If the installed old PWA stays on3.8.0 after Restart, close its tabs/app and open the game again. Earlier entries below are history.

## Published3.8.0

[Play on your phone](https://gleb20.github.io/roadster-kickflip/?v=3.8.0). Hold in flight to grab/spin faster; release to straighten and slow. Ideal landing±10° earns50 base points, safe±40° remains, and knees compress on touchdown. Backend verification is updated without losing old scores. Public native keyboard/touch and offline checks pass. [Release evidence](docs/verification/2026-10-21-flight-v380/release-status.json). Earlier candidate notes are historical.

## Flight3.8.0 candidate

Hold in flight to grab and spin faster; release to straighten and slow rotation. Perfect landing±10° earns50 base points; safe±40° remains. Touchdown has a short leg-compression pulse. Candidate verification and deployment status: docs/verification/2026-10-21-flight-v380/. Compatible server verification is deployed; Pages publication status is recorded there.

# Tesla Jump3.7.3 — phone UI refinement

Compact Legend/install shortcuts, actual or possible global rank, focused pause/results and automatic PWA updates between attempts. [Play3.7.3](https://gleb20.github.io/roadster-kickflip/?v=3.7.3). [Verification and restore](docs/verification/2026-10-21-ui-v373/README.md). Release status is recorded in that packet; earlier headings below describe historical versions.

# Tesla Jump 3.7.1

[Play on GitHub Pages](https://gleb20.github.io/roadster-kickflip/?v=3.7.1)

Canvas2D browser/PWA game with controlled flips, directional thrust, landed trick chains and a persistent encounter collection.

This release gives the collection its own upper-menu preview card, adds compact Continue/Restart/Home pause controls, makes posting the primary finished-run action, highlights a personal best, and shows its current world rank after posting. A finished best can be posted later from the menu, including after reload, within the existing24-hour session window. Sharing creates a public score link. Replay tips is a quiet next-run checkbox. The new square PWA icon shows in-game Elon doing a photo-referenced kickflip over the bottom characters, a rolled video-derived Roadster with smoking thrusters and a diagonal rocket on a sparse background.

Pause can post a previously finished best while keeping the live run paused. The current attempt must end before it can be posted: the existing verifier requires a replay ending at its first collision. Older best numbers without a replay remain local. Estimated ranks are not fabricated. Restart and Home abandon the live attempt.

Current-run score still changes scenery every10,000 points: spaceport to factory to spaceport. Existing controls, physics, score compatibility, backend and saved best/collection/retry keys are preserved. No account is needed for the optional world leaderboard.

- [Gameplay rules](docs/gameplay-v3.md)
- [Menu flow and verification](docs/menus-v3.7.html)
- [PWA installation and safe updates](docs/pwa.md)
- [Release verification and rollback](docs/verification/2026-10-20-release-v3.7.1/README.md)
- [Artwork credits](assets/ui/ATTRIBUTION.md)

Run locally with `npm run dev`; verify with `npm test` and `npm run check`. The checked-in worker is generated with `npm run build:pwa`. Physical iPhone/Safari acceptance follows the user's test; it is not inferred from Chromium emulation.
