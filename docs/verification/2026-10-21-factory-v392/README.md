# Factory3.9.2 verification

Bounded robot/supply/surface refinement. No new illustration generation. Foreground forklift is explicitly cancelled; its old regression check is replaced by clear-aisle and varied-pose checks.

-124 game tests and source/content/type/PWA checks;132 core resources.
-50 production checks and all50 model/color/stage drawings,320/390 portrait,844 landscape,1440 desktop.
-Focused checks cover pickup-before-carry ordering, different neighboring poses, asynchronous motion, stage/cycle continuity, no labels, no cached forklift or moving foreground object, slow wall and static reduced motion. Arranged fixtures use actual production painters.
-Existing pause/resize/7,000-point transition checks and a natural route verify no gameplay/progression change.
-Exact forward/inverse rehearsal and dirty root HEAD/index audit. Public native-input/offline and resource hashes are recorded after publication.

CPU canvas submission timing and synthetic captures are not physical phone FPS claims. Physical iPhone/Safari remains user acceptance. Existing old PWA activation intermittency remains outside this patch.
