# TJ-002: late pressure, 4.9.0

User accepted: thrusters offer an easier long-flight route; a demanding fuel-free jumping route remains available. The 4.8.0 release did not create enough late-game pressure.

## Changes

First 20 seconds retain the published physics and framing. Base speed smoothly reaches 960 at 150 progression seconds. At 390x844 the sustained obstacle motion is 339.62 CSS px/s, versus 261.79 in 4.8.0 (+29.7%). The hero has the same late base scale. Additional zoom applies to pickup/streak/thrust peaks; road and collision motion remain coherent.

After 120 progression seconds, the director can issue mixed three-obstacle sequences, spaced by approximately 1.1 seconds. Each sequence has a verified zero-fuel route, independently varied timing and a grounded exit. Powered flight can span the same triple with one launch. Passive late air waves are less frequent. Recovery and biome introduction retain simple encounters. Object dimensions, jump/thrust mechanics, fuel rewards and score formula are unchanged. Rail length includes 1920/2160 at the new peak speeds. Validation retains the first rail catch time when an endpoint produces another catch event.

Late preparation thresholds deliberately decrease with effective speed, with floors of 450 ms nominal / 350 ms early-error ground preparation (500/400 ms for tall singles), measured after full silhouette visibility and before the charge begins. The 180 ms timing window remains. Early thresholds are unchanged. Difficult candidates fall back to a verified ground encounter within the existing 18000-tick / 48-policy budget.

## Evidence

253 game tests, 16 server tests, 35 disposable database checks; source/content/types/PWA checks pass. Four 600-second observational runs at widths 390 and 600, seeds 17 and 932, complete with exact full and JSON-chunked replay verification. Identical 4.8.0 controls provide the comparison: late mandatory ground decisions rise from 19.5-19.7/min to 25.7-26.5/min; passive waves fall from 21-23% to 13-14%. These are simulation measurements, not player statistics or enjoyment acceptance. See summary.json and measure.mjs.

Triples tested across independent timing grids at 960/1200/1620, zero fuel, and a powered single-flight alternative including timing/burn variations. The transient +/-260 velocity / pickup-expiry matrix retains bounded encounters. First twenty seconds match the prior physical state for identical inputs. Historical sixteen replay folders remain unchanged; the seventeenth verifier is additive.

Local browser: 390x844, 320x568, 1440x900 late framing and 1620 boost; charge-to-jump state transition; no captured console errors. Physical phone acceptance remains open. Desktop maximum observed spawn step 86.6 ms in the new run; physical frame profiling and PWA update delay remain bounded technical debt.

## Publication

Backend deployed and verified: all 17 valid versions accepted autonomously, two forgeries rejected; the new 189.775-second replay exactly matched 70,774 points, 41 flips and 22,773 ticks, including 8 pickups and 9 rail catches. All 19 fixtures were isolated before submission; zero fixture writes reached the public ranking. The 28 original public records retain their exact pre-release digest. Client publication follows this verified candidate. Preserve all verifiers, pending submissions and accepted scores on client rollback; restore only the bounded client change with a fresh cache identity.
