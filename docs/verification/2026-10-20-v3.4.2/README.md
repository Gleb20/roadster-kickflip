# 3.4.2 — seated rebound and Roadster reunion

Parent: `f139299f91c8047b3eaee86ad2e9a24be786d8eb` (published3.4.1). Isolated candidate: `/tmp/tesla-jump-fall-v342-20261020`; the original dirty checkout and unfinished3.5 candidate were not used as a release source. Frozen parent archive: `/tmp/tesla-fall-v342-base.tar.gz`.

## Requested/resulting behaviour

Two low seated rebounds lead directly from the third seated contact into a higher launch. The rider leans further back, with two forward bent legs and raised hands. An impact pulse folds knees, drops shoulders and lowers the head relative to the torso, then rebounds. Standing occurs aloft; the feet land on the level Roadster. The car stays behind him, pitches nose-first then rear-first in a single end-over-end somersault, levels and drives under him before landing. Original paper parts and the existing upright Roadster photo are reused; no raster artwork or engine change.

## Verification

- Baseline:73 Node tests and all checks,21 native fall/input checks before edits.
- Candidate:78 Node tests; syntax,19-content validation, gradual type checks and50-resource PWA package all pass.
- 21 native fall/input checks: actual bad landing, speed/tap limits, return of jump control, pause/resume, reduced motion, obstacle collision during recovery.324 normal ticks versus205 with four taps in this scenario.
- 31 arranged choreography checks using actual painters at390x844,844x390,1440x900: three seated contacts, nose/rear ground contacts, stronger third arc, car behind the hero, docking before foot landing, deterministic redraw. The screenshots are arranged phase captures, not a physical-device playtest.
- 40 gameplay checks,11 browser/headless replay checks,15 real service-worker update/offline/failure/multiwindow checks. No JS/console errors.
- New meaningful geometry regressions cover fixed arm/leg lengths during compression, pelvis and car floor contacts, temporal continuity and a rotating-car collision that occurs between endpoint frames.

## Contracts and limits

Existing recovery duration2.8–3.45s,1.6x tap cap, input locks, score/fuel rules, pause and reduced-motion alternative remain. Changed collision geometry is labelled `roadster-v3.4.2`; the unpublished3.5 ranking candidate must merge this release and freeze the new ruleset before deployment. Never publish that older candidate directly over3.4.2. Physical iPhone/Safari feel remains the user's acceptance. The supplied pose image is a local motion reference, not a new published game asset.

## Release and rollback

Freeze the candidate tree, verify its inverse in an isolated checkout against the exact parent tree, publish with the expected main head, then confirm the Pages deployment SHA and live resource hashes separately. Publication is not inferred from these local checks. Runtime screenshots and final release/inverse manifests are retained in the original workspace verification folder after acceptance.
