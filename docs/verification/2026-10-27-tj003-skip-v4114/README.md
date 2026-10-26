# TJ-003 Skip placement / 4.11.4

Parent `7f3c7b63c0d33d86280a1333e0f352fcde2ee71c` (4.11.3). User requested moving Skip below the lesson copy and using uppercase to keep the header quiet.

`SKIP TRAINING` now follows the paragraph as a separate yellow text button. Its text aligns with the lesson copy; its touch target remains at least 44 px. The progress row no longer contains an action and its empty height is reduced. Existing measurement automatically reserves the full updated block for world framing. No input, lesson, physics, scoring, art or backend change; all other source changes are cache-version URLs. Ruleset remains `roadster-v4.11.0`, with 19 immutable verifiers intact.

Validation: 270 game tests and syntax/content/types/PWA checks pass. 56 focused browser checks cover four viewports and four lesson copy variants, actual rendered rider alpha below the complete block at height 1600, touch/keyboard Skip and offline 4.11.4. Minimum observed rider clearance is 12.75 px. Initial cold-start harness wait timed out once; a repeat after 150 ms confirmed active training and no page errors, without product changes. Physical iPhone acceptance remains open.

Frozen parent `/tmp/tesla-skip-parent-v4113.tar.gz`; client forward/reverse patch in `/tmp/tesla-skip-rollback` restores an empty parent diff and its 270 tests/checks pass. `client-only.patch.gz` is the bounded inverse. Revert only this layout delta in a clean checkout and publish a fresh PWA cache identity. Preserve all scores, local data and immutable verifiers; no database rollback.

Original dirty runtime/index preserved. Work: `/tmp/tesla-tj003-discovery-20261026`, branch `codex/tj003-skip-v4114`. No new confirmed technical debt. Existing TJ-D01/TJ-D02 remain separate; the bounded next debt stage remains a physical full-frame measurement and diagnosis of a reproduced PWA activation delay.

Published runtime `4030bb6257f2b36c0c3a9459f6d23564b4d748c1`; Pages `40407737190` succeeded. All 194 public resources match. Nine public checks pass: version, no QA hook, training start, uppercase button below copy, yellow 44 px target, working/persisted Skip, no score submissions and no console errors. See `public.json`, `public.png`, `live-hashes.json` and `pages.json`.
