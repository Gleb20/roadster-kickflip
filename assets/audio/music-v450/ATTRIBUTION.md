# Tesla Jump adaptive music, 4.5.0

Selected and authorised by the user, 23 October 2026:

- Spaceport A / Orbital Overdrive PEAK (R3), Suno: https://suno.com/song/2d7fcac6-5de2-4185-ab89-62e5e19d6a43
- Factory B / Chrome Voltage PEAK (R3), Suno: https://suno.com/song/45ac2e46-7763-4127-bfeb-2af29b147030

Official WAV originals and V2 Auto Split instrument WAV exports were downloaded through the user's Suno session. Source originals remain in the local `audio-source/selected-20261023/raw` archive and are not distributed with the game. No third-party song recordings or sampled melodies were added. Tiny separated vocal residues were omitted; instrument separation is approximate, not original production multitracks.

Game edits: measured 132.0 / 130.0313 BPM source sections slowed to common 128 BPM without intentional pitch change; 32 bars / 60 seconds; 24 ms cyclic seam blend; common per-biome gain, high-pass 35 Hz / low-pass 10 kHz, 24 kHz MP3. Stereo harmony/lead, mono rhythm/bass. See `scripts/prepare-audio.py` and `docs/verification/2026-10-23-audio-v450/processing.json` for cuts, source hashes and output hashes.

The arcade effects in `src/sound-effects.js` are original deterministic synthesis authored for this game. The previously recorded pressure-hiss thruster is retained byte-for-byte from the published 4.4.3 parent; its original recording provenance was not established in this task.
