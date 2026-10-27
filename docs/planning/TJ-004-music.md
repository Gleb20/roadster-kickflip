## TJ-004 — принято пользователем, 27 октября 2026

Пользователь подтвердил результат 4.12.1: «Всё работает. Мне нравится. Готово». TJ-004 и исправление запуска музыки/эффектов приняты. Это пользовательская приёмка; самостоятельная инструментальная проверка физического iPhone/Safari не заявляется, точная первоначальная причина на устройстве не установлена. Ниже сохранены исторические статусы до приёмки. Runtime `a87d9c9`, правила `roadster-v4.11.0` не менялись. TJ-D01/TJ-D02 остаются отдельными; следующая самостоятельная карточка — TJ-005, автоматически не начата.

# TJ-004 — score-driven arrangement and musical biome handover

User decisions, 27 October 2026: instrumentation follows score/challenge, with a temporary boost accent; full arrangement at 30,000 points; a smooth rhythmic biome transition without a musical pause; light training music at the normal tempo. Implementation is authorised, including publication after verification.

Base: `19e42ad97efc499545fd266c7e05e3e27567711e`, published 4.11.4. Work: `/tmp/tesla-tj004-discovery-20261027`, `codex/tj004-music-v4120`. The original dirty project checkout is preserved. Parent archive: `/tmp/tesla-tj004-parent-v4114.tar`.

## Existing material and observed problem

Keep the user-selected Spaceport A / Orbital Overdrive and Factory B / Chrome Voltage, their source WAV/instrument exports, and all eight published 128 BPM, 4/4, 32-bar loops. These are approximate separated instruments, with no claim of perfect isolation. Prior R3 direction remains: atmosphere/motif, bass, drums, then full lead; preserve earned energy through biome changes. No new Suno generation or replacement composition is commissioned.

Fresh code verification reproduced a stale 360–660 speed normalisation despite the 520–1100 score-driven pace. At speed 680, before boost/combos, lead/bass gains were already 1 and drums .984. The old broad filter and global compensation changed the whole recording's brightness/level as instruments entered. This establishes a control mismatch, not a subjective diagnosis of the stems.

## Bounded implementation

`main.js` sends score, tutorial-active state, speed for effects, temporary speed-boost blend and read-only biome state. Music does not write the simulation. `music.js` remains the owner of playback and presentation-only scheduling.

| Score | Instrumentation |
| --- | --- |
| 0 | Harmony/textures and a clear fragment of the motif; bass/drums silent |
| 0–7,500 | Bass progressively enters |
| 2,500–15,000 | Drums progressively enter |
| 7,500–30,000 | Lead progressively opens to its full part |
| 30,000+ | Full arrangement; natural 32-bar material and temporary boost accents remain |

Smoothing avoids instantaneous switches after a large score award. A lost combo, recovery, or a new biome does not remove earned instrumentation. A new run starts from its own score. Boost adds at most .2 control intensity, small gain accents and brightness; it releases to the earned baseline. Gameplay music retains a fixed .58 internal master gain and a clear 9.5 kHz filter, with the user's independent Music control downstream. Menu/pause/result and effect ducking retain their separate purposes. Training uses the same musical clock and light fixed gains, regardless of lesson retries or temporary slow motion.

All stems retain one musical phase and playback rate 1. A biome handover begins at the next 4/4 bar and lasts one bar (1.875 seconds at 128 BPM); the visual transition and enemy pools proceed on their existing clock. Audio can trail the visual trigger by up to 3.75 seconds including the fade. Harmony/drums use equal-power weights; only competing bass/lead parts recede by 40% at the midpoint. There is no global brightness dip or silent bridge. AudioParam curves run on the audio clock, independently of render frames. If the destination music is not ready, retain the audible biome until it can enter on a bar. Pause keeps quiet music, hidden context suspension freezes the clock, and mute restores the same shared phase. Dispose permanently prevents late downloads or repeated unlock from connecting voices.

## Acceptance and limits

Test score progression through/above 30,000, bonus jumps, combo loss/recovery, boost/release, actual tutorial start/Skip, both biome directions, the common bar/loop grid, no duplicate sources, menu/start/pause/resume/home, hidden/restore, independent channel mute, failed/late loading, dispose, and a real PWA upgrade plus offline decode. Render the actual Web Audio graph and decode all loops to measure clipping, seams, transition signal continuity and levels. Audit original and grouped material without presenting spectral measurements as proof of timbre, instrument isolation or harmonic quality.

Ruleset stays `roadster-v4.11.0`; no backend, physics, scores, records, storage format, input or frozen replay bundle change. Retain all 19 immutable verifiers, pending/offline packets and collection/settings. Automated/desktop evidence does not establish subjective listening or physical iPhone acceptance; compare in play with headphones and the iPhone speaker.

Existing TJ-D01/TJ-D02 remain separate: physical full-frame measurement and diagnosis of a reproduced PWA activation delay. Recheck them before any debt change. No broader audio engine or content-admin work is included.
