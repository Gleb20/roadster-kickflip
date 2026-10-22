# Factory vat4.1.1

User requested a farther vat and a much smaller hand. This visual patch moves the vat baseline from126 to236 units behind the player, applies0.8 perspective scale, reduces alpha0.64→0.5 and parallax0.3→0.12. It draws before wall storage and production. The complete projecting robotic arm is about one third its old size relative to the vessel. New transparent768×414 sprite uses the approved vat target, actual Samwha foundry photo and current game scene in built-in image_gen. Original v400 files are retained.

Ranked rules remain roadster-v4.1.0. No collision, generation, score, input or backend changes. Four frozen rulesets remain unchanged.

Validation:138 game tests, source/content/types/PWA checks,10 scene/gallery/alpha browser checks at320/390 portrait,844 landscape and1440 desktop including reduced motion. Actual4.1.0→4.1.1 worker upgrade:9 checks, preserving best, collection and finished score record; new sprite decodes offline. Localhost ranking CORS warnings are infrastructure scope, with no game runtime errors. These are browser checks, not physical iPhone/Safari acceptance.

Baseline45b55a525466071cca22170fa9682d5859303be4, tree5014308de9963d2305b5c6b6bcf6b87567b7fbe0. Snapshot /tmp/tesla-vat-v411-before-20261023; isolated candidate /tmp/tesla-vat-v411-release-20261023. Rehearse bounded forward and inverse patch in a clean clone, verify exact parent tree and parent tests/checks. Never reset original dirty checkout. A public reversal needs a fresh cache version.

Existing real-phone input latency and separate daylight debt were rechecked and remain outside this visual task. Proposed bounded follow-up remains a real-phone event→step→render measurement after play acceptance.
