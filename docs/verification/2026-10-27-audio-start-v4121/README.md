## TJ-004 — принято пользователем, 27 октября 2026

Пользователь подтвердил результат 4.12.1: «Всё работает. Мне нравится. Готово». TJ-004 и исправление запуска музыки/эффектов приняты. Это пользовательская приёмка; самостоятельная инструментальная проверка физического iPhone/Safari не заявляется, точная первоначальная причина на устройстве не установлена. Ниже сохранены исторические статусы до приёмки. Runtime `a87d9c9`, правила `roadster-v4.11.0` не менялись. TJ-D01/TJ-D02 остаются отдельными; следующая самостоятельная карточка — TJ-005, автоматически не начата.

# Audio first-touch recovery / 4.12.1

Reported symptom: no music or effects at the start of an attempt without onboarding. Parent `94b33f12830f8933fbf5371e60a941a8bfa4648e` / 4.12.0; work `/tmp/tesla-tj004-discovery-20261027`, branch `codex/audio-start-v4121`. Frozen parent `/tmp/tesla-audio-start-parent-v4120.tar`.

## Reproduction and limits

A fresh returning-player profile on ordinary Chromium starts both channels with its first real touch, without a preliminary key/gesture. Therefore the user's physical-phone condition is not directly reproduced under ordinary Chromium policy. Saved-volume information was requested and has not yet been received. A native WebKit runner crashed in both headless and headed modes before a page could open on macOS 26.0.1; this is an infrastructure limitation, not evidence about Safari gameplay.

A sufficient failure path is reproduced against the parent using a real Chromium AudioContext/graph: suspend the new context, leave only its first resume promise unresolved, and use the real returning-player Play touch followed by a jump touch. The old `!resuming` gate prevents every subsequent retry. Context remains suspended, both measured output peaks are exactly zero, music voices are zero, and canonical effects are absent. This fault is explicitly injected; it is not claimed as the confirmed cause on the user's iPhone.

The candidate retries resume on each explicit unlock gesture and isolates callbacks to their own context. The same blocked-first-resume fixture now starts on the first Play touch: eight music sources, nonzero final-mixer signal (~.099 peak at the sampled point), one start cue and one jump cue. A single bounded canonical cue can survive asynchronous resume for at most 300 ms. Hide/mute clear queued cues; stale resolutions/rejections cannot clear a replacement context or newer pending cue. A hidden context cannot resurrect pressure hiss.

## Validation

279 game tests and syntax/content/types/PWA checks pass. Four added regression cases cover unresolved retry, the first canonical start cue, stale rejection, context replacement and hide/mute. These tests first fail against the parent; see `regression-red.log`.

`first-touch/normal.json` checks five saved mixes, including full and independent mute, using a real first Play touch with training already completed and no preliminary unlock. The combined output analyser measures music after the short start cue has ended, and a music-muted profile separately measures the actual jump effect. `first-touch/blocked.json` and `parent/blocked.json` retain candidate and parent fault comparisons, clearly marked `faultInjected`. No test forces user mute to change.

The copied `verify-lifecycle.cjs` covers the inherited 55 audio/score/biome/visibility/pause/mute/offline checks on three viewports; `verify-upgrade.cjs` covers 4.12.0→4.12.1 with settings, collection, best, lesson state and finished/pending replay preserved. All 24 normal first-touch, 6 candidate fault, 4 parent fault, 55 lifecycle and 8 upgrade checks pass with no runtime errors. The upgrade again needed the closed-tab activation boundary (existing TJ-D02); all saved data and offline audio were preserved. Screenshots stay local under `/tmp/tesla-audio-start-screenshots`. No public fixture scores are submitted.

Only `src/sound.js` changes runtime behavior. Other source changes update cache identity. Existing music/dynamics, recordings, visuals, input, physics, scores, all 19 frozen verifiers and backend remain. Ruleset stays `roadster-v4.11.0`. Physical iPhone/Safari and perceived audibility remain unverified; this patch corrects an established controller failure path, not a device-specific diagnosis.

## Tested rollback

`client-only.patch.gz` includes the forward client/cache delta and its matching regression tests. A clean isolated parent in `/tmp/tesla-audio-start-rollback-v4121` applies it forward (279 tests/checks pass), then reverses it (empty parent diff; 275 parent tests/checks pass). See `rollback.json` and `rollback-*.log`. A public reversal needs a fresh PWA cache version. Preserve saved volumes, collection, best, outbox and all old verifiers; no backend/data rollback. Original dirty runtime/index are preserved.

TJ-D01 and reproduced PWA activation delay TJ-D02 remain separate; the bounded proposed follow-up is diagnosis of TJ-D02, not a broad audio rewrite. No new open debt is introduced by this fix. Published runtime `a87d9c9b5b88e1e71ea35322ef51bc6856252514`; Pages `40486230080` succeeded. All 194 public resource hashes match. Public Chrome verification passes 24 ordinary first-touch checks over five saved mixes, 6 blocked-first-resume checks and 28 lifecycle/offline checks on three viewports, without runtime errors or score submission. Real output is nonzero in enabled channels; explicit mute remains. See `pages.json`, `live-hashes.json`, `public-first-touch/*.json` and `public/checks.json`. Physical iPhone confirmation remains open.
