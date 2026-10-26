# TJ-003 contour refinement / 4.11.1

Parent: `9f0afc4662d516e3ee203289528d587ce1cb6761` (public 4.11.0). User requested silhouette-shaped highlights for lesson sprites and UI.

The scene is shaded after scenery and before the original foreground painters. Their existing alpha channels, current positions and rotations supply the exact silhouettes, including rail gaps and sprite transparency. There is no bounding-box opening, per-frame SVG rebuilding, image readback or duplicate sprite paint. Native UI controls retain their shapes; unrelated readouts dim with CSS, THRUST and the bonus card are highlighted during their lessons. Pause/sound keep their normal visibility and touch targets. No art, physics, scoring or backend change; the immutable ruleset remains `roadster-v4.11.0` and all 19 verifier manifests are intact.

Validation: 270 game tests, 16 server tests, syntax/content/types/PWA checks. Full seven-lesson keyboard course completed with 175 practice points. Pixel comparisons and snapshots cover 320×568, 440×956, 844×390 and 1280×800, including the moving/rotated hero, truck, rail, aircraft, pickup and native UI. Touch/multitouch/cancel, pause/resume, Skip and reduced motion passed at all four sizes. Real same-origin PWA upgrade from 4.11.0 to 4.11.1 and offline training preserve existing local data. See browser JSON/scripts for exact checks. Initial touch replay timed out once; instrumented repeat confirmed the touch hit the scene and all checks passed. No gameplay fix was inferred from that test timing.

Original dirty workspace/index is preserved; implementation is isolated in `/tmp/tesla-tj003-discovery-20261026`, branch `codex/tj003-contour-v4111`. The frozen parent archive is `/tmp/tesla-contour-v4110.tar.gz`. Forward/reverse patch rehearsal in `/tmp/tesla-contour-rollback` returned an empty diff against the parent, and its 270 tests/checks pass. `client-only.patch.gz` retains the bounded inverse. Apply only this delta in a clean checkout; a public reversal requires a fresh PWA cache version. Preserve all scores, storage and immutable verifier versions; no database rollback is involved.

Physical iPhone/PWA appearance is not verified. Recorded TJ-D01 full-frame/device profiling and TJ-D02 PWA lifecycle diagnosis remain separate; no new confirmed technical debt was found. A bounded next debt stage remains one physical-device full-frame measurement and diagnosis of a reproduced PWA activation delay.

Publication verification will be recorded below.
