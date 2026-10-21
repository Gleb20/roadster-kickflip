# Factory3.9.0 acceptance packet

Runtime, approved art and physical score-based biome integration based on main72403dc. `release-status.json` is the current publication state; older release notes below the new top entries are historical.

-121 unit/integration game tests and8 server regression tests. All source/content/type/PWA checks pass;132 coherent hashed core resources.
-50 factory browser assertions with model/contact fixtures, all50 model/color/stage drawings,320/390 portrait,844 landscape and1440 desktop. Fixtures arrange score/time/distance and use actual runtime painters and IK, not a natural run. Original full contact fixtures retained in the local workspace; selected final screenshots distributed here.
-64 biome browser assertions, including native keyboard jump/pause, resize/retry/reduced-motion and physical entrance/exit. The310-second natural route uses the real unmodified obstacle/physics pipeline and legal director-route commands. First factory at52.31s/7,146points; this timing is one seed/route, not guaranteed for every player. No public scores posted.
-Actual old3.8.0 install and new3.9.0 upgrade are exercised with retained local best/collection/finished3.8.0 record, then cold offline start. Restart activation is intermittent in the old PWA; failures are retained in `upgrade/restart-timeout.json`. A closed-old-tab boundary activates the waiting verified worker. This task does not change the existing PWA activation protocol. Existing local-origin ranking CORS failure is separate from game runtime; the public origin is checked on publication.
-The exact forward/inverse patch restores parent tree8ecdefcbb03f0ba103dcfad8020fbc1d50341f0a and117 parent tests/checks. Binary candidate/release patches, full captures and original dirty-tree snapshots are retained in the original workspace; do not overwrite concurrent files using them. Roll back publicly with a new cache version, retaining compatible backend and scores.

Canvas timings report CPU draw-call submission on desktop Chromium, not physical phone frame rate. Physical iPhone/Safari appearance and feel remain pending user testing.
