# Ground reserve correction4.7.1

The4.7.0 design matrix was insufficient to reveal a local mandatory-ground gap. Inseed56 a repeatedtruck guard correctly excludedtruck, then a random wide fallback hit the0.9s floating-point boundary and failed. Four plain rails left the same history unchanged. Later an air choice could follow a plain fallback and extend the ground gap. Published470 remains frozen; its public native run is diagnostic only.

The bounded correction chooses the narrowest eligible canonical low fallback, accepts only1e-8 rounding tolerance at tick-equivalent visibility boundaries, and prioritizes one ground encounter after an optional plain fallback. Full collision, charge and180ms timing checks, biome identity and repeat limits remain. The exact saved state now gives a validated BYD single; a separate canonical selection test proves AGV is the narrow biome alternative when needed.

`regression.json` compares actual observational inputs without route actions/fuel: old90s seed56 alive but four consecutive plain fallbacks and23.117s maximum ground input gap; new90s alive, at most one plain fallback, maximum ground input gap10.733s and spawn gap10.933s. These gaps include rail/air travel, not free flips. Twelve focused tests include exact boundary, eligible nonrepeat reserve, full physics and the unchanged less-than12s gap invariant.

239 combined tests,16server tests,27disposable SQL checks and PWA191 pass. All176 files in the twelve previous verifier folders are byte-identical; new471 graph is additive. Actual470-to471 PWA upgrade18checks preserve470finished record/outbox/settings, using the known closed-tab boundary. Earlier failed navigation wait is a test transport failure, not a game correctness result.

The4.7.0 matrices and CPU measurements are retained as predecessor evidence, not relabelled471. No broad matrix or optimization sweep was repeated for this bounded correction. Final471 hosted/public/native results are added after the actual actions. Physical iPhone/Safari, subjective enjoyment and phone profiling remain open.

## Hosted and rollback

Both471bundles freshly read back byte-exact after deployment,12-to13guard applied.15owned QA sessions complete autonomously:13exact valid versions accepted,2forged total/end rejected; client verify calls/public fixture writes0. New replay314.775s:78flips/17pickups/16catches/20pairs/7rail-air. Real22records through seq65 retain digest446374e07d6d835b2a7e80a8230c8ff4,pending0. Private capabilities are outside Git. The full inverse restores exact470tree dad184c3e08e4a3c21398faaaeb5ddf3b72c1c27;235parent tests/check191 pass.
