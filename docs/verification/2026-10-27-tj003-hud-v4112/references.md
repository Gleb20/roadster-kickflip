# Touch-cue references

Reviewed 2026-10-27, official sources only:

- [Material Design: radial reaction](https://m1.material.io/motion/choreography.html#radial-reaction): expanding reaction connects input to the point of touch. This is an interaction-reference example, not evidence that an automatic prompt improves our novice completion rate.
- [Microsoft PowerToys: Mouse Highlighter / Ripple](https://learn.microsoft.com/en-us/windows/powertoys/mouse-utilities#mouse-highlighter): click indicators support a ripple mode, duration/size and held-pointer behavior. Our game adapts that familiar cue to a white contact dot and two outward-fading rings.

Implementation: local CSS geometry; no downloaded art or dependencies. Invitation loop 1.4 s; ring offset .35 s. Held contact is steady. Release shrinks/fades for .48 s with one .6 s ring; no recurring press invitation once input is released. Reduced motion replaces these effects with static dot/ring states. On fine pointers the existing SPACE/SHIFT key cue remains.
