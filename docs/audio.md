# Audio unlock recovery — 4.12.1

Each explicit unlock gesture can retry an unresolved AudioContext resume. Resume callbacks belong to their original context; a stale completion/rejection cannot clear a new context or newer pending cue. A canonical start/game cue can wait for asynchronous resume in the same single, 300 ms pending slot used by legacy confirmation tones. Hide/mute clears that slot, and hidden pressure audio stays stopped. Saved independent volumes and explicit mute remain authoritative. The 4.12.0 score arrangement and musical transitions are unchanged. [Reproduction, actual-signal checks and limits](verification/2026-10-27-audio-start-v4121/README.md). The sufficient failure path was reproduced with an injected blocked first resume; the user's physical iPhone cause is not yet established.

# TJ-004 / 4.12.0 — published score-driven music

User decisions on 27 October: earned instrumentation follows score/challenge and reaches the full arrangement at 30,000; boost gives a temporary accent; biome music flows on a bar without a pause; training is light at normal tempo. The selected Spaceport A and Factory B sources and all eight 60-second MP3 loops are unchanged.

Bass enters over 0–7,500 points, drums over 2,500–15,000, and the full lead over 7,500–30,000. Harmony and a fragment of the motif remain from the start. Combo loss and recovery do not reset this growth. The gameplay master stays at .58 and the filter at 9.5 kHz, with small boost accents; progress is heard through parts instead of a broad low-pass sweep or global volume compensation. Independent user volume, effect ducking, quiet menu/pause/result and the shared limiter remain.

The two biome groups retain the common 128 BPM clock, loop phase and playback rate 1. The next bar starts a one-bar (1.875 s) equal-power transition. Competing lead/bass parts alone recede 40% at its midpoint; the rhythm/harmony and global brightness remain. Audio can finish up to 3.75 s after the visual trigger, without delaying scenery, hazards or rules. A missing destination download leaves the current biome audible. AudioParam curves run independently of render frames. Hidden suspension freezes this clock; mute/unmute retains phase. Immediate mode/visibility/tutorial changes bypass update throttling; dispose cannot be revived by a pending download or later unlock.

[Agreed specification](planning/TJ-004-music.md) and [verification/rollback](verification/2026-10-27-tj004-v4120/README.md). Only cosmetic playback and the read-only snapshot changed; ranked rules remain `roadster-v4.11.0`, with all 19 frozen versions retained. Subjective listening, instrument-bleed/harmonic judgement and physical iPhone acceptance remain open. Existing TJ-D01 is separate. PWA activation delay TJ-D02 was reproduced during the local 4.11.4→4.12.0 upgrade: closing the old tab activated the new cache, while saved settings, collection, best and pending replay were preserved.

Earlier contracts below are historical where they describe the old speed/bonus normalisation, broad filter, global gain compensation or renderer-distance music crossfade; asset provenance, effects and independent channel controls still apply.

# Audio contract — 4.5.1

The user selected **Spaceport A / Orbital Overdrive PEAK (R3)** and **Factory B / Chrome Voltage PEAK (R3)**. A/B are generation labels, not compatibility settings. Both selections remain. Their official original WAV and V2 instrument exports are archived locally under `audio-source/selected-20261023/raw`; published assets are eight edited MP3 loops, about 5.5 MB total. Source links, hashes, measured cuts and processing are in [attribution](../assets/audio/music-v450/ATTRIBUTION.md) and [processing evidence](verification/2026-10-23-audio-v450/processing.json).

`src/music.js` owns cosmetic playback, `src/sound-effects.js` owns deterministic original arcade effects, and `src/sound.js` owns one gesture-unlocked context and mute. `main.js` passes a read-only presentation snapshot and drained canonical simulation events. Neither music nor synthesis writes gameplay state. Ranked `roadster-v4.4.2`, scoring, collision, input and all frozen server verifiers are retained.

Music uses a common 128 BPM / 4/4 grid and 32-bar / 60-second loop. Each biome has harmony/textures, lead, bass and drums. Menus use low gain and a warm low-pass with almost no beat; Play smoothly introduces rhythm. Actual speed, effective score multiplier, streak and speed-booster blend progressively open bass, drums, lead and brightness. Energy is not made by pitching the entire recording upward. A single musical phase continues through Play, Pause, Home, biome changes and re-enabling sound; playback is not restarted every frame. Biome weights follow the same world-distance transition as the renderer. Equal-power crossfading plus a short tonal bridge reduces competing leads in the middle. These are approximate separated stems, not guaranteed isolated original instruments.

New users retain the4.5.0 mix at100% music/100% effects. Browsers still require a first touch/key before creating/resuming audio. Legacy SOUND OFF migrates to0%/0%; legacy ON to100%/100%. A valid `roadster-audio-v2` mix takes precedence and persists both independent0–100% values. The menu SOUND button opens a small non-modal settings balloon; a second press, outside press, Escape or focus leaving dismisses it. Native range inputs apply immediately, with visible percentages and accessible labels. During a session the header contains only the existing44px Pause button; settings live in the pause menu. A260ms transform-based shared-control morph explains the Sound→Pause change; input never waits for animation. Home returns the Sound entry. There is one settings component, moved between the menu balloon and pause, so the values cannot diverge. Pause keeps very quiet music and stops movement loops. Hidden pages stop effects and suspend the context; returning leaves gameplay paused until the user's resume gesture. Decode or network failures leave gameplay usable; a later gesture can retry. All runtime music and the existing pressure hiss are in the verified PWA cache.

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


## Independent channels and presentation

The shared audio context and final limiter remain. Music now passes through a dedicated0–1 gain bus; effects and recorded thrust share the existing effects bus scaled by the effects setting. A25ms smoothing target avoids fader clicks. Zero effects disables one-shots and stops active/fading thrust and grinding; music retains its phase. Zero music stops its sources and leaves effects active. Re-enabling music reuses the decoded buffers at the shared musical phase. Mute/decode races are covered by tests. Existing music files, adaptive stem targets and pressure recording are unchanged.

Settings use native `input type=range`, keyboard arrows/Home/End, percentage output and one persistence model. Storage failures leave controls usable in memory. The English-only interface labels this section “Sound settings”, with “Effects” and “Music”; the muted accessible value is “Muted” and both the panel and popover use lang="en". Five44px maximum paper Elon heads map0%,1–25%,26–50%,51–75%,76–100% to grey/red-hand mute, covered mouth, shush, neutral and delighted shout. Pupil-free generated portraits receive small bounded tracking pupils in code. Artwork uses the actual hero style and the inspected Royal Society portrait; source, license, prompts and originals are in `art-source/audio-controls-v470/`.

The44px native SVG speaker extends the existing icon system: greyscale/red-cross at0%; low green LEDs and subtle cone movement, stronger green cone response, yellow-zone squash/lift/stretch, then red-zone dancing. This is a volume-responsive illustration, not a real spectrum analyser. Animations run only on visible settings while music is running; hidden panels/pages stop the loop. Reduced motion keeps static state/LED cues, centres the pupils and removes spatial UI/character movement. Native touch/keyboard and reduced-motion browser checks do not establish physical iPhone/Safari or screen-reader acceptance.
