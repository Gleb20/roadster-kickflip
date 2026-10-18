# Pressure hiss / cold-gas thrust

Real recording: **Pressure Hiss**, unfa, published 19 December 2013. Author describes a recording of a factory air compressor using a Zoom H2. Source: https://freesound.org/people/unfa/sounds/211096/ . License shown on source page: CC0, https://creativecommons.org/publicdomain/zero/1.0/ . Accessed 18 October 2026. No generative-model training performed.

The downloadable high-quality preview is the exact runtime source: https://cdn.freesound.org/previews/211/211096_1038806-hq.mp3 . Original preview retained as `source-preview.mp3`; page retained as `source-page.html`. Runtime copy: `assets/audio/thrust-pressure-hiss.mp3`. Original author reports 5 seconds, 96 kHz / 24-bit stereo FLAC; the retained preview is MP3 stereo 48 kHz. Do not describe it as the original lossless recording.

Runtime adaptation is in `src/sound.js`: decoded once after SOUND opt-in, starts at 0.12 s, loops the 0.35–2.8 s region, 420 Hz high-pass, 15 ms onset / 60 ms release envelope, gain 0.2 after RMS normalisation toward 0.12 with a 0.8 sample-peak ceiling. The decoded preview is very quiet (RMS about 0.0032), so normalisation is necessary before the playback gain. Voices are bounded to two during rapid taps and disconnect on completion. No runtime contact with Freesound; only the local asset is fetched. The optional audio does not block startup. It plays only for actual fuel-burning thrust, including repeated pulses, and stops on pause, death, blur, empty tank, release or mute. Cosmetic kickflip/stabilisation jets stay quiet.

Browser decode, non-silence/RMS, live graph start/stop and unit resource-lifecycle tests are recorded under `docs/verification/2026-10-18-hud-v301/`. Physical-device loudness and human listening acceptance remain separate.
