# Audio contract — 4.5.0

The user selected **Spaceport A / Orbital Overdrive PEAK (R3)** and **Factory B / Chrome Voltage PEAK (R3)**. A/B are generation labels, not compatibility settings. Both selections remain. Their official original WAV and V2 instrument exports are archived locally under `audio-source/selected-20261023/raw`; published assets are eight edited MP3 loops, about 5.5 MB total. Source links, hashes, measured cuts and processing are in [attribution](../assets/audio/music-v450/ATTRIBUTION.md) and [processing evidence](verification/2026-10-23-audio-v450/processing.json).

`src/music.js` owns cosmetic playback, `src/sound-effects.js` owns deterministic original arcade effects, and `src/sound.js` owns one gesture-unlocked context and mute. `main.js` passes a read-only presentation snapshot and drained canonical simulation events. Neither music nor synthesis writes gameplay state. Ranked `roadster-v4.4.2`, scoring, collision, input and all frozen server verifiers are retained.

Music uses a common 128 BPM / 4/4 grid and 32-bar / 60-second loop. Each biome has harmony/textures, lead, bass and drums. Menus use low gain and a warm low-pass with almost no beat; Play smoothly introduces rhythm. Actual speed, effective score multiplier, streak and speed-booster blend progressively open bass, drums, lead and brightness. Energy is not made by pitching the entire recording upward. A single musical phase continues through Play, Pause, Home, biome changes and re-enabling sound; playback is not restarted every frame. Biome weights follow the same world-distance transition as the renderer. Equal-power crossfading plus a short tonal bridge reduces competing leads in the middle. These are approximate separated stems, not guaranteed isolated original instruments.

New users default to SOUND ON. Browsers still require a first touch/key before creating/resuming audio: no automatic pre-gesture sound is promised. A stored SOUND OFF is always honoured and persists. The native sound button keeps its existing pressed state and accessible on/off label. Pause keeps very quiet music and stops movement loops. Hidden pages stop effects and suspend the context; returning leaves gameplay paused until the user's resume gesture. Decode or network failures leave gameplay usable; a later gesture can retry. All runtime music and the existing pressure hiss are in the verified PWA cache.

## Asset and event audit

| Trigger | Final sound | Mix / repetition policy |
| --- | --- | --- |
| Menu / Play / Pause / Home / result | Current biome score with state-dependent gain/filter | Smooth automation; no duplicate music sources or abrupt intro restart |
| Jump (`jump`) | Short rising chip sweep | One canonical takeoff cue; charge/hold itself stays silent |
| Any booster pickup (`pickup`) | Compact ascending arpeggio, pitch variant by booster | One cue per collected pickup, 70 ms minimum repeat |
| Ordinary landing (`landing`, good) | Quiet dry board thud | 100 ms minimum repeat |
| PERFECT landing (`landing`, perfect) | Clear three-note reward | Replaces ordinary thud, not stacked with it; 160 ms minimum repeat |
| Rough landing (`landing`, not good) | Low short scuff/thud | One cue at the failed landing; repeated body contacts remain silent |
| Rail catch (`rail-catch`) | Short metallic contact | 150 ms minimum repeat |
| Rail support / sliding | Low filtered noise loop | Only while actually supported in play; soft release, bounded fading sources |
| Thruster held and fuel available (`P.thrusting`) | Existing recorded pressure hiss | Existing normalisation, attack/release, two-source bound retained; key presses alone do not force sound |
| Helmet collision (`smash`) | Metallic shield crack | 85 ms minimum repeat; no damage/death cue |
| Backup chip collision rescue (`rescued`) | Digital fall-and-recover flourish | High priority; one canonical rescue cue, 400 ms minimum repeat |
| Back on board (`recovered`) | Very quiet short recovery interval | 400 ms minimum repeat |
| Unprotected collision / death (`death`) | Short descending crash | Highest priority; clears older effects and sliding |
| Start / sound-on confirmation | Small quiet chip acknowledgement | No sound when switching off |
| Passing obstacles / score ticks / combo counter / air-passed / discovery | Intentionally silent | Music reflects earned intensity; avoid constant reward chatter |
| Background rockets, factory robots, celebrity cameos, booster expiry | Intentionally silent in this release | Decorative events should not mask player actions or imply threats |

Effects have a shared maximum of eight one-shot voices, per-kind cooldowns, priority eviction and short envelopes. Rescue, shield, pickups and PERFECT briefly duck music. Thrust and sliding have independent hard bounds; mute/hidden state clears them. A final dynamics compressor limits combined peaks. Music gain is compensated as layers accumulate. No external sampled SFX were added; the legacy pressure recording is unchanged from the parent release (its original recording provenance was not established here).

Automated verification can establish routing, bounded voices, decoded seams, offline availability and state changes. Physical iPhone/Safari behaviour and the user's judgement of timbre, loudness and repetition still require listening in play. Existing PWA closed-tab activation and real-device input acceptance remain separate known questions; this task does not change that lifecycle.
