# Adaptive arcade audio 4.5.0

User authorised selected Suno downloads, missing sound creation, integration, full audit and publication. Selected **Spaceport A (R3)** + **Factory B (R3)** are retained; no reason to force matching generation letters. Clean release checkout `/tmp/tesla-audio-v450-20261023` preserves the dirty original root. Parent is published 4.4.3 + its verified release documentation, `0da21eac859b4f1e5853051a99c71fd2811bfe66`; initially cloned runtime `58997d7` was fast-forwarded when the parallel documentation commit appeared.

[Audio contract and complete trigger audit](../../audio.md) · [flow report](flow-report.html) · [official source links and original hashes](sources.json) · [processing and stem hashes](processing.json).

Eight instrument-layer MP3s add about 5.5 MB. Source tempos measured from 129 drum onsets are 132.0 / 130.0313 BPM (prompt's 128 BPM was not assumed). Common 128 BPM, 32 bars, 60 seconds; 24 ms wrap blend, common biome gain, filtered extremes and 24 kHz stereo tonal / mono rhythm assets. Official originals and separate V2 WAVs remain outside Git in the local `audio-source` archive. Suno's archive export was blocked by Chrome; individual official WAV exports succeeded. No security warning was bypassed. Tiny vocal-separation residues omitted; category separation remains approximate.

## Verification

- `npm test`: 185/185 pass, including six new tests for adaptive routing, canonical cues, original sample envelopes, mute/decode races, retry containment, phase reuse and bounded voices. Existing pressure/Safari-resume characterisations pass.
- `npm run check`: syntax, 29 obstacle definitions / 22 material sources, TypeScript and PWA 182 hashed resources pass. [Logs](tests.log), [check log](check.log).
- 23 actual Chrome/mobile-viewport audio/browser checks pass: all seven requested cues through real canonical events, native held thrust input, menu/Play/pause/Home, speed/bonus, factory, saved mute/reload, cold offline playback and verified audio cache. No browser runtime errors. [Checks](browser/checks.json), [decoded loops](browser/decoded.json).
- Real OfflineAudioContext renders: menu RMS .00380, ordinary start .01869, peak .07242. Eight simultaneous one-shots plus peak music reach .64709, below clipping. [Measurements](browser/renders.json). These are test render measurements, not perceived loudness or a human listening assessment.
- 15 actual parent→candidate PWA upgrade checks pass with saved mute, best/collection, old record, immutable replay and IndexedDB outbox preserved. Candidate waits while parent is paused. The existing Restart/closed-tab activation boundary was observed again; closing the old tab and reopening activated the candidate. [Upgrade](upgrade/checks.json).
- [Scope check](scope-check.json): every non-audio runtime module is identical after cache-version normalization (and the public version literal); backend unchanged. Current ranked `roadster-v4.4.2` and eight frozen rulesets retained. No public score submission or backend deployment.

The first browser pass caught a removed legacy `tone` binding still referenced by the background rocket. It was corrected to an explicit silent callback in main; decorative rocket sound is intentionally omitted by the new audit. Subsequent false fixture failures came from stepping simulation faster than AudioContext automation and bypassing the input set for thrust; the harness now uses real elapsed audio time/native held input. Final runs above use unmodified application responses.

Physical iPhone/Safari, subjective timbre/volume and long-session repetition still require the user's game listening. Proposed bounded follow-up remains the previously known PWA activation-boundary reproduction; no unrelated debt sprint was started. The final publication, byte verification and exact inverse rehearsal are recorded in `release-status.json` when complete.
