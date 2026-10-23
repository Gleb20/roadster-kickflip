# Booster candidate 4.3.0 — local, 23 October 2026

Implementation began after both neighbouring tasks completed. Baseline is the complete **local 4.2.0** queue/ranking candidate, including the published 4.1.1 foundry-vat correction. Original root HEAD/index and all unrelated work are preserved. No Pages, Supabase, RPC, secret, scheduler or real-score mutation was performed.

## Implemented behavior

Five individually generated alpha sprites: shield, Starship/flame, green spring, heart, gold ×3 token. Pickups are glowing spheres, with the icon rotating around its vertical axis. Existing HUD hierarchy is retained: up to three small timed squares below the score with perimeter countdowns, plus up to two separate hearts. They do not intercept gameplay touches. Reduced motion keeps the sphere icon still and removes rescue blinking.

Initial working balance, subject to player review:

| Effect | Current parameter |
| --- | --- |
| Shield | 8 simulation seconds; collision throws the obstacle upward/forward with a short impact sound; preserves combo and hearts; obstacle pays once |
| Speed | 8 seconds; +35% real pace, combined with the existing earned-speed factor; 0.6s entry / 0.8s exit; separate flame feedback |
| Jump | 12 seconds; launch velocity ×1.25, captured at takeoff, unchanged gravity and landing contract |
| Life | up to two charges; auto rescue at a lethal collision; 2s protection plus protection until leaving every overlapping obstacle |
| Score | 10 seconds; ×3 to newly earned distance points and to event points; existing combo still caps at ×5, event multiplier reaches ×15 |

The score pickup does not multiply already banked points. Event rewards use the effect at settlement/passage time, consistent with existing landed-reward accounting. Same-type pickup refreshes its normal duration without stacking strength. A full rack does not replace an active effect. Timers stop on pause. Restart clears all temporary state.

A heart keeps the attempt, trajectory, input roles, previously banked points and remaining other effects. It resets combo and earned-speed streak, cancels pending reward from the impacted flight, and never pauses or opens a Continue button. Grace contact IDs prevent a large obstacle from spending a second heart when the short timer expires. Ordinary rough-landing recovery remains; hearts are for lethal obstacle contact. Shield collisions take precedence over spending a heart. A shield destroys contacted geometry immediately, so its expiry cannot strand the player inside that obstacle.

Pickups use a separate reproducible random stream, a shuffled five-type bag and clear gaps after an obstacle group. First offer is due after 8 active seconds; subsequent offers are due 14–20 seconds after the previous offer, when a safe gap is available. Sometimes a pair appears 240 world units apart, enabling combinations. Low spheres can be collected while driving; higher spheres invite a jump. Ground-obstacle pools and isolated late-air rules remain. Route validation advances temporary speed/jump expiry using the same simulation timing; it never requires protection to make a group possible.

## Verification

- `game-tests.txt`: 151 game tests; `source-checks.txt`: syntax/content/TypeScript/PWA gates, 160 hashed resources.
- `server-tests.txt`: 14 server tests; `database.json`: 21 disposable PGlite queue/worker/RPC checks, including current 4.3 and all four historical versions, forged totals, late collision cutoff and deduplication. This is local database evidence, not hosted cloud acceptance.
- `frozen-rulesets.txt`: all five immutable manifests match. Existing 3.4.2 / 3.8.0 / 4.0.0 / 4.1.0 folders are unchanged. 4.3.0 adds deterministic pickup state to replay/checkpoint simulation.
- `browser/checks.json`: 54 checks at 320/390 portrait, 844 landscape and 1440 desktop; actual forward pickup, keyboard/touch jump, ×15 HUD, pause, heart protection through a wide obstacle, shield launch and real-speed increase, reduced-motion capture. Prepared states are explicitly labeled; this is not an unaided human playtest.
- `upgrade/checks.json`: 11 actual local 4.2.0→4.3.0 PWA/IndexedDB/save/finished-record/offline checks. **Explicit Restart did not activate the waiting worker within 12s in this run; closing the old tab and opening the game activated it.** `closedTabBoundaryUsed=true` is retained in the result. Do not claim seamless Restart activation.
- `runs/summary.json`: two route-following simulation witnesses survive 180 active seconds, then end at 191.925s / 186.925s. Eight/five pickups; exact final scores 44,707 / 41,741 replay correctly. These are scripted routes, not a promise about human survival or balance.
- `rollback/`: guarded affected-file hashes, task-only patch and isolated inverse rehearsal. Initial full snapshot is `/tmp/tesla-boosters-before-20261023/baseline.tar`; frozen isolated baseline commit is `56099f8060b845e28e4f00c76a755b474fbd94db`.

Physical iPhone/Safari input feel, loudness and subjective balance remain untested. Existing real-phone timing and independent-daylight debt remain separate. After player acceptance, the bounded debt proposal remains a real-phone event→step→render measurement; the observed PWA update boundary needs separate diagnosis before promising seamless Restart updates.

## Later deployment and next stage

Not published. The 4.2 background-ranking migration/worker/scheduler are still a deployment prerequisite. Then add `20261023103000_boosters_v430.sql`, deploy the generated API and worker bundles with five-ruleset compatibility, verify hosted receipt/processing/legacy support without fake public scores, and only then publish the tested frontend under fresh-cache version 4.3.0. Preserve accepted rows, queued packets and all historical rulesets. Existing authorization covers implementation; publication of this candidate requires the user's instruction.

Rails/grinding remain a separate next stage: a short optional one-way elevated rail, pass through from below, catch on descent without hidden upright snapping, ordinary jump-off and safe ground exit, integrated as one verified generator segment. No rail/platform code, new aerial combinations, multi-floor levels or transport is included here.
