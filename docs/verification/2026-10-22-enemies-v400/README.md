# Encounters4.0.0 verification

Scope: approved enemy/obstacle redesign plus Sikorsky and Xi. Base remote53ced2df0e8e964dcf7f1daf03f9c96785d4e0e5; the original dirty checkout/index are preserved. Candidate assembly and publication use `/tmp/tesla-enemies-v400-release-20261022`.

- `browser.json`:26 native-input/render/pause/gallery checks at320/390/844/1440; arranged encounter fixtures, browser emulation.
- `natural-runs.json`: two180-second production simulations driven by native keyboard witness actions, with no score/fuel/obstacle/collision overrides. Factory and flyby screenshots are captured during those runs.
- `upgrade/checks.json`: actual published3.9.3→4.0.0 PWA transition, best/finished3.8 record/collection migration, all15 sprites decoded offline, touch start.
- `database.json`: isolated PGlite rehearsal preserving all four tables and denying anonymous RPC execution.
- `server-prepared.json`: prepared Edge bundle and additive migration hashes. Migration applied; bundle deployed through existing Supabase project UI.
- `server-hosted.json`:17 hosted checks, three supported rulesets, invalid/incomplete replays rejected;19 public results before/after,0 fixture writes.
- Source validation:135 game tests,9 server tests; source/content/TypeScript/PWA and all three frozen manifests pass.

Art originals, actual reference photos/stills, exact imagegen prompts, normalization script and output hashes are in `art-source/enemies-v400-20261022/`. Delivery assets are `assets/encounters/v400/`; the gallery uses the real game renderer. Physical iPhone/Safari is not covered by browser emulation. PWA status must be based on activated workers, never registration alone.

Rollback: initial bounded source snapshot `/tmp/tesla-enemies-v400-before-20261022/before.tar.gz`; release inverse binary patch and parent-tree rehearsal are recorded in `rollback.json` once assembled. Restore only this task's delta in a separate checkout. Keep additive server compatibility; never remove public results or old collection entries. Existing route-search/real-phone measurement debt remains a separate bounded follow-up.
