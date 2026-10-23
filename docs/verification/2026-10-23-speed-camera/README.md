# Speed-responsive framing — 4.4.3

Authorized scope: make acceleration-related camera withdrawal perceptible rather than merely shrinking obstacles. The release builds on published4.4.2/b63e2af, retaining rare BACKUP chips, all eight replay versions, old records and the earlier raised road/Home correction. No backend deployment or score submission belongs to this task.

## Diagnosis and evidence

The4.4.1/4.4.2 camera reads150-second run progress, ignores actual bonuses/recovery, fixes the horizontal anchor and clamps scenery above the object scale. Its ordinary390px-screen obstacle velocity rises178→205px/s despite world velocity360→660 (83%). The change is gradual over150s, and speed streaks previously represented bonuses only. This explains the reported weak relationship; it is not a measured user-perception result.

Research: [Itay Keren, Scroll Back](https://www.gamedeveloper.com/design/scroll-back-the-theory-and-practice-of-cameras-in-side-scrollers) discusses forward focus, speed-derived projected focus and smoothing; [Torralba/Isola/Freeman, Foundations of Computer Vision](https://visionbook.mit.edu/2d_motion_from_3d.html) separates image scaling from translation/depth parallax. GDC Vault pages redirected to maintenance; the author's accessible article was used instead. These support the principles, not the specific tuning numbers or an asserted human benefit.

## Applied tuning

The real pace now controls one shared normalized framing state (0→1 at360→660 world units/s, capped1.3 for faster bonuses). It moves the phone anchor24%→16% and changes zoom1→1/1.44 at ordinary max speed; faster bonuses can reveal a little more while capped to protect readability. Exponential response4/s opens forward view promptly;1.25/s returns gently, with no overshoot. Ordinary max phone objects are11% larger than before while the24px-margin forward horizon is preserved (878→883 world units at390×844).

Scenery recedes15% at ordinary max speed as part of the same framing. Near-road pixel travel integrates real world travel using the launch-scale plane, so zoom cannot cancel its acceleration. Background parallax remains slower. Small speed traces occupy only the sky edge and below the road, exclude the obstacle corridor and disappear under reduced motion. Ground baseline, sprite contact/hit geometry, jump/rail mechanics, anti-cheat and backup rarity remain unchanged.

The near road is an intentionally closer depth plane, not an assertion that its pixel displacement equals obstacle displacement. The existing speed verifier now checks proportional true-speed change on that plane and correct object motion under its own zoom; obsolete fixed-camera expectations are removed. Pausing freezes the entire framing; Home/restart reset it.

## Verification and acceptance limits

179 game tests and source/content/TypeScript/PWA gates pass (170 core resources).45 prior camera/Home/multitouch checks pass on the final4.4.3/rarity base.41 speed-framing checks cover320×568,390×844,844×390,1440×900, both biomes and reduced motion;98 held-pace speed checks and35 rail checks passed on renderer-identical camera code before the rarity merge. Two final seeded witnesses catch7 rails each and match the current frozen server replay exactly. Actual4.4.2→4.4.3 PWA upgrade retains best, collection, current completed replay and IndexedDB queue;13 checks pass including cold offline. The known Restart activation boundary still needed closing/reopening the old tab. It is not fixed here.

[Compare in motion](review.html). comparison.webp is75 frames at133ms from paired actual-renderer captures. The ordinary150s ramp is deliberately compressed into3s in both versions; enemies/obstacles are arranged between ticks and collisions excluded. This is a prepared comparison, not a human playthrough. The before camera is4.4.1, byte-equivalent to4.4.2 apart from import versions; the camera's visible renderer after the rarity merge is unchanged. Real data and commands are preserved.

Physical iPhone/Safari, comfort, whether the pullback feels clear and preferred and real thumb occlusion remain unverified. Numbers are bounded working values. Existing bounded debt proposal: reproduce the PWA Restart activation cause and measure input/readability on the physical phone; no unrelated audit or new backlog commitment added.

Rollback will be recorded against the exact4.4.2 release parent. A public reversal needs a fresh frontend/cache version, retained eight-version replay support, best/collection, queued packets and accepted records. Never roll back database rows.
