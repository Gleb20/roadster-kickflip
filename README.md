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
