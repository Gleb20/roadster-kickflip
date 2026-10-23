# Holographic boosters · local4.3.1

User approved replacing the five images with simpler sci-fi holograms. Cyan helmet = invincibility; amber jetpack = speed; lime spring = high jump; magenta chip = extra life; gold literal «х3» = score boost. New256×256 alpha PNGs are in assets/boosters/holo-v431/. Old sprites remain untouched. Card dimensions, sphere spin, aura and countdown remain unchanged. Two chip charges and chip rescue copy replace heart imagery/copy; internal state identifiers remain compatible.

[Open visual review](visual-review.html). Compare dark/light32px samples, enlarged80px images and actual game captures. Mobile backup chips also inspected at19px. Sources: [photo/reference brief](../../../art-source/boosters-holo-20261023/brief.md), generation.json, prompts.json, normalization.json and assets-provenance.json. Prototypes are SpaceX Crew Dragon helmet, NASA SAFER backpack (artistic exhaust adaptation), Lee Spring compression spring, RP2040 QFN chip; Adafruit879 yellow display supplies light-emission reference for typography only. Photos and actual game frame were passed to image_gen with alpha requested; no procedural substitute icons.

## Verification actually completed

- 151 game tests; source/content/TypeScript/PWA checks;166 hashed cache resources.
- 54 existing browser checks at320×740,390×844,844×390 and1440×900, native keyboard/touch pickup/jump, rescue, shield, pace, pause and reduced motion. Browser/checks.json records zero runtime errors. These are arranged-state checks, not human balance acceptance.
- 15 gallery previews decoded at256×256, dark/light and small-size edges visually inspected; see gallery.png and art-checks.json. All PNGs have alpha0–255 and partial-alpha edges.
- All five historical/current frozen server manifests verified unchanged. Current ranked ruleset stays roadster-v4.3.0. Apart from cosmetic painter/HUD/toast changes, source diff consists only of frontend query versions and display version. No server/data mutation.
- Guarded synchronization from isolated copy; original HEAD/index and all old booster images preserved. Exact bounded inverse rehearsed.

Physical iPhone/Safari and player balance not tested. No publication or deployment. Existing SW Restart activation question, phone latency and daylight remain separate; bounded debt proposal is to reproduce the existing Restart boundary before lifecycle changes, not an unsolicited art refactor.

## State and next step

Snapshot: /tmp/tesla-holo-before-20261023/; isolated candidate /tmp/tesla-holo-20261023. Latest remote main advanced during work from1399b40 to4040488 (4.2.0 release). Published ranking/outbox/worker sources were compared with the local parent and retained; existing differences belong to the preceding4.3.0 booster stage. The scheduler file was verified by Git blob hash. This art task did not revalidate hosted release state. No neighbouring chat was messaged.

Exact next step: user reviews the five hologram images in the gallery/current local game. If publication is explicitly requested, prepare release from fresh remote main, retain additive4.3 verifier support, and run the release-specific PWA/backend checks before publishing. Elevated one-way rails remain a separately authorized future prototype, not part of this cosmetic revision. Queue heartbeat remains paused.

## Rollback

Run `python3 docs/verification/2026-10-23-booster-holograms/rollback/restore-task.py --rehearse`. The optional --apply refuses newer affected bytes and restores the complete local4.3.0 parent only; it does not erase ranking changes, old art or foreign work. Evidence retained under rollback/.
