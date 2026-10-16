# Validation — online v2, 2026-10-16

## Confirmed

- Six Node test groups pass: fixed clock, interruptions, analytic jump, bounded Rogozin collisions, all catalog obstacles and accepted pairs.
- Real Chromium integration, intercepted RAF, 10 seconds after activating boost:

| Frame schedule | Simulation seconds | Distance | Boost recharge |
| --- | ---: | ---: | ---: |
| 30 Hz | 10.000000000000073 | 6535.843114055775 | 0.1666666666666666 |
| 60 Hz | 10.000000000000073 | 6535.843114055775 | 0.1666666666666666 |
| 120 Hz | 10.000000000000073 | 6535.843114055775 | 0.1666666666666666 |

- Chromium desktop 1440×900: observed approximately 60 FPS after warmup, renderer mean ~0.32 ms and p95 ~0.9 ms in a sampled interval.
- Chromium mobile emulation 390×844, touch input: observed 59 FPS, renderer mean ~0.28 ms and p95 ~0.5 ms in a sampled interval. These are desktop-host measurements, not physical iPhone results.
- Desktop, portrait and 844×390 landscape screenshots inspected. Checked boot, touch jump, full crouch, charged flip, boost, taunt, human sizes, all new props, cosmetic throw and 5000-point cameo/fireworks. No observed page errors.
- Original four PNG blobs match the prior GitHub source exactly.

## Scope

Frame timing is hardware-dependent. Physics and timers remain equal across the tested schedules; 30 FPS no longer turns 10 real seconds into 7.5 game seconds. CPU render samples exclude GPU presentation and should not be read as end-to-end latency. Native mobile Safari performance requires a physical iPhone test; Chromium emulation does not substitute for it.
