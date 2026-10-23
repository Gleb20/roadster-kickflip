# Obstacle director audit — 23 October 2026

Research/handoff evidence, not an implemented release. Current inspected base is4.5.0 / remote main `44579d2e5d44a5aec3d4f76192d2e2a145b71db7`. Clean source: `/tmp/tesla-audio-v450-20261023`. The primary workspace runtime/index were not changed.

[Research, primary sources and implementation contract](../../planning/obstacle-director-20261023.md). Sol implementation is assigned to `/tmp/tesla-director-v460-20261023`, branch `codex/obstacle-director-v460`; its validation/release evidence must be recorded separately.

## Reproduction

Run from any directory, supplying the exact4.5.0 checkout:

```sh
node audit.mjs /tmp/tesla-audio-v450-20261023 /tmp/director-audit.json
node baseline-runs.mjs
```

`baseline-runs.mjs` intentionally pins the audited clean source path and writes `/tmp/tesla-director-audit-20261023/baseline-runs.json`. To reproduce elsewhere, update that source path and output directory in a disposable copy. Both scripts are read-only against gameplay sources. Node20.20.2 was used. `audit.json` contains24 synthetic pattern/state probes,7 real air definitions/collisions and16 settled-camera visibility estimates. `baseline-runs.json` contains4 witnessed240-second runs and every observed wave's full-step timing/rest measurement.

## Confirmed findings

- All7 air models at altitude32 collide with an upright ground player; director lowers the first2 to24.
- Thrust constructs4–6 Tesla; at speed510 and above in the inspected matrix it creates6, span935, gaps55. Not every candidate is admitted: route/fuel reserve still applies.
- On an isolated truck at360 with100 fuel, ordinary search selects charge0/thrust.35 and spends28 fuel; a zero-thrust-only search finds charge.5. Fuel priority is a search-order defect, not proof thrust is physically required.
- Default margin35ms checks one common lead and two endpoint perturbations; it does not establish a continuous forgiving action window or independent errors in a pair.
- Regular rest timers run from spawn. Sampled next spawn can occur8.33ms after the full ready condition. This is not the next collision/reaction time: travel distance still remains.
- Four witnessed runs stay alive to240s;62–63 waves, max observed3 objects; full spawn-step p95=11.06–15.38ms, max21.19–29.26ms. This is host timing, not phone performance. No human skill probability inferred.
- Boosted speed ceiling from multiplier terms is1113.75 before vx. Earlier825-only tests miss combined boost. At390px, settled camera, speed1113.75 and incoming110, generous first-edge warning estimate≈0.836s; full-silhouette warning is shorter.
- Biome filters already exist. Rail and air validation are separate; current director does not combine them.

## Preservation

Parent work only adds the planning document, this evidence directory and bounded prefixes to `docs/HANDOFF.md` / `RESTORATION.md`. Before copies, SHA-256, dirty-root diff/status: `/tmp/tesla-director-audit-20261023/`. `documentation-rollback.json` records unchanged suffix hashes and tested restoration of both edited documents; `documentation-prefixes.patch` retains just the parent document delta. It is evidence for a bounded inverse, not permission to apply an old patch over future edits. Root runtime/index checks are separate in `preservation.json`.

Existing PWA update boundary, daylight and physical-phone input acceptance remain outside this task. The relevant debt in this task is route comfort, speed envelope, real rest and bounded generation cost; no unrelated backlog was created.
