# Gameplay and content ownership

3.1.0 retains the implemented 3.0.4 movement, balance, art and encounters described below. Obstacle definitions now live in `src/content.js`; their schema/materials are checked by `npm run check`. The TypeScript development tool does not ship in the browser. See [content guide](content.md) and [release sequence](UPGRADE-RELEASES.md).

# Tesla Jump 3.0.4 — implemented gameplay candidate

Status: 3.0.4 release, 18 October 2026; publication evidence is recorded in the release notes. `src/gameplay-config.js` is the source of numeric balance, `src/gameplay.js` owns deterministic flight, reward and pace rules. Existing art/encounters outside this feature remain intact.

## Controls and flight

Ground: hold screen / Space / W / Up to charge over 0.4 s, release to jump. Air: hold again to backflip, release for bounded shortest-path assistance. The first jump retains the old cosmetic kickflip, without a paid flip reward; the next airborne press switches immediately to manual rotation, and paid thrust also ends the cosmetic phase. No queued ground charge. THRUST / B / either Shift is held independently, including a second finger. Cancellation, blur and pause clear held input. Controls are available immediately.

Launch speed is 560 + 440 × charge, gravity 1550; spin max 6.2 rad/s, acceleration 60 rad/s². Assistance is capped at 3.5 rad/s and 28 rad/s²; a 180° tie preserves the previous direction. Landing requires angle within ±40° and angular velocity at most 240°/s. A good wheel-aligned landing completes the final degrees within the landing tolerance, so a 358-degree landing is not undercounted. Timing sweeps verify that tap/40% charge cannot land a flip, roughly half charge can, and charged thrust can land two. The threshold is physical, without a mechanic unlock.

Thrust acceleration is 2100 away from the underbody; its horizontal part has drag 1.8/s and a ±260 world-unit/s cap. Fuel: initial 50, capacity 100, burn 80/s, +25 per landed flip; no passive refill or ground burn. First thrust latches the car to the feet over 0.12 s for the remainder of the flight. During manual flips, vertical Roadster frame 0 and Elon share a pivot 65 above the tyre line. A 0.16 s tuck brings hands to the board edges at x=±43; the two 36-unit arm bones keep their lengths. The rotating body collision proxy follows the 32-unit crouch. The old nine-pose roll is reused for the first cosmetic jump and remains in the read-only review. Shared rotating collision proxies are an inset car rectangle and torso/head rectangle, tested against obstacle boxes using SAT and adaptive swept substeps. Air boxes have explicit altitude, top and bottom.

## Scores and speed

Distance gives floor(distance / 20), without multiplication. Passing an obstacle pays 50 × current multiplier immediately. Flight rewards settle only on a good landing: n flips pay 50n(n+1), late takeoff and close landing pay 25 each; sum uses the multiplier before landing. Each flip and each confirmed near event raises the multiplier by 0.1, capped at ×5. Multipliers use integer tenths. A bad landing cancels that flight's pending reward; previously passed obstacle rewards remain.

A late takeoff has ≤0.12 s until the ground obstacle's front collision edge reaches the car; it pays only after clearing that obstacle and landing. Close landing is ≤0.12 s of travel behind a ground obstacle's rear collision edge. No negative distances, no aerial landing bonuses, no repeat awards per obstacle/event. Compound events share one landing settlement.

Resultful actions refill the combo-support meter. Duration is 8 − 1.2(multiplier − 1) seconds; after expiry, lose 0.1 per 0.5 s. A landing with flips or a close landing adds +5 percentage points of speed once, capped at +25%; each refresh holds 4 s, then loses 10 percentage points/s. Meter decay, fuel, and earned speed are independent.

Speed feedback refinement, 18 October: earned speed is still a real +5% per resultful landing, capped at +25%; it moves obstacles, road and scenery faster. Camera framing follows only the normal progression pace, so temporary earned speed or stumble recovery is not compensated by zoom. Road travel is integrated in screen pixels each step, rather than multiplying all accumulated travel by the latest zoom. This avoids camera changes cancelling or reversing the road scroll. The feedback factor is the actual earned gain (1.00–1.25), limited by the net speed above base after directional thrust. Grounded boost lean is capped at 0.035 rad (about 2 degrees); the short translucent flame reaches at most 55 world units and 0.36 opacity, without the former broad halo. Six faint speed lines move with the road. Impossibru requires both the maximum 660-unit base pace and the full +25% actual earned gain (825 units/s, 500 km/h / about 311 mph). The first few tricks retain the ordinary face. Physical-device feel remains subject to playtesting.

A bad landing resets multiplier and earned speed, preserves remaining fuel, clears residual horizontal thrust speed and starts a seated recovery. Duration is 2.8 + 0.65 × clamp((pre-fall base speed − 360)/300, 0, 1) seconds. The rider leans back with separated bent legs (one raised, one forward) and spread arms, then drops onto his bottom, makes three diminishing contacts at 14%, 36% and 56%, braces with his palms, crouches and pushes off into a short leap onto the Roadster. Three video-derived kickflips share the same contacts; the car levels and hops under the feet for the return. Jump and thrust are locked; separate primary taps add 0.15 playback rate, capped at 1.6×, without jumping or skipping poses. Even maximum tapping preserves at least 1.75 s of animation. Up to 2.4 px impact shake and the unsettled face explain the slowdown. Reduced motion uses stationary crouch/expression without spin/shake. Seated and car collision proxies remain active; no obstacle immunity. Pause freezes the sequence. Held inputs are cleared at impact and completion; a fresh press is needed to jump. Base-speed recovery runs in parallel; progression and new patterns wait until the animation is complete, followed by at least 0.8 s before generation resumes. Base pace drops to 55%; recovery lasts 1.2 + 2.8r^1.5 s where r=(oldBase−360)/300. It follows a convex quadratic with a final 0.15 s Hermite join matching normal acceleration. Progression is frozen during recovery; a repeated stumble restarts recovery toward the original cruise target, avoiding an eventual speed discontinuity. Then the normal 360→660 world-unit/s ramp resumes over 150 progression seconds. UI maps this to 130→400 km/h before earned/flight modifiers.

## Progression and teaching

0–15 s low singles; 15–35 charged jumps/flips; 35–60 pairs/thrust practice; 60–90 hovering then incoming drones (incoming introduced after 72 s); 90–120 precision trains; 120–150 mixed/thrust trains; 150+ mixes the learned templates. Every fifth template is a low single with extra breathing room; a further breather follows any two consecutive complex templates. Recovery pauses difficulty. All abilities remain usable in the opening seconds.

Contextual, dismissible tips teach jump, charge, flip, thrust, air and near manoeuvres. Success persists in `roadster-coach-v3`; replay is in the main menu. Each run resets temporary tip dismissal. No tutorial dialogs, ability gates, account requirements or external telemetry.

Each template starts from the actual grounded player/fuel/pace state and has a witnessed grounded exit. A pure simulator searches input schedules including charge duration, thrust, near rewards, speed streak and moving air objects. Generated routes must also survive the same policy with takeoff lead shifted ±35 ms; mandatory-thrust routes retain at least 20 fuel, and thrust trains are considered only with at least 65 fuel. It never mutates the live state. Templates do not overlap an unfinished predecessor. If no witness is found, try a verified low single; if that too is invalid, wait. Empty fuel always keeps a recoverable path. Positions are never expanded/teleported during speed changes; camera scale changes smoothly and resize preserves obstacle-relative positions.

Precision in 3.0.4: at most two low cars in the first group, one high hovering drone (altitude 400) and a later third car with a 1.15-second offset. The former repeated drone ceiling and narrow forced takeoff were removed after physical-device feedback. Thrust trains are capped at six cars. Mixed ground/air patterns remain, with witnessed timing margin and low-fuel fallback. Close manoeuvres still earn rewards; the generator no longer insists on the former exact precision-only route.

## Persistence, diagnostics and acceptance

New best: `roadster-best-v3`; old `roadster-best-v1` remains untouched. Startup requires 12 decoded/baked material groups including the new drone. No dependency or backend added.

Read-only `render_game_to_text()` reports angle, omega, fuel, pending reward, landed flips, multiplier/meter, speed streak, recovery, progression, obstacle altitude/relative speed and director status. Mutation helpers remain localhost-only. Verification distinguishes real native keyboard/multitouch from arranged visual states and accelerated simulation; see `verification/2026-10-18-gameplay/README.md`. Human balance review and physical iPhone/Safari remain open.


## 3.0.1 HUD and audio

Race: the brand is replaced by a rolling odometer and multiplier in the upper left. Personal best is shown large in the menu and beside the final attempt result, not in the race HUD. LET'S GO is docked at the bottom; the sound button is right-aligned without a pause placeholder in the menu and slides left when pause appears. The visible combo-support bar/caption and upper speed/ramp display are removed. Logical combo decay remains unchanged.

Multiplier tiers are cream (1), chartreuse (2), cyan (3), violet (4), amber (5). Hidden support controls opacity 0.42–1, scale 0.88–1.05 and a ≤1.1 px shake. A lost combo detaches and falls for 650 ms, then is removed. Reduced motion uses static size and a short opacity-only exit.

Lower-left instrument: numeric speed in MPH (km/h × 0.6213711922) and an angled rail for earned trick speed only. Lower-right: mirrored rail for fuel only, user-reference cold-gas icon and a subtle clickable backplate. Prior responsive instrument sizes remain 104/90/76 px, with enlarged hit area. Distance has no visible readout.

Pressure hiss: real CC0 compressor recording by unfa; local optional MP3, decoded after SOUND opt-in. RMS normalisation to 0.12 with a 0.8 peak ceiling, 15 ms attack, 60 ms release, local loop, bounded audio sources, no sound for cosmetic/stabilisation jets. Release/pause/death/blur/fuel exhaustion/mute stop playback. Source and exact processing are in `art-source/thrust-audio/README.md`. Optional audio never gates startup. New UI SVG geometry follows user attachments; existing raster art is unchanged.

HUD refinement, 18 October: no visible distance readout; distance-based scoring remains unchanged. Both bottom instruments sit 12 px from the edge (safe-area inset + 8 px when larger). THRUST keeps its instrument size and enlarged hit area, with the original lightweight angular surface, pressed feedback and a soft white contour glow linked to fuel. The two glow layers are capped at 18% opacity / 2 px blur and 10% / 6 px, with a 24% maximum contour stroke, preventing a bright bloom.


## Mobile native interaction 3.0.4

Explicit non-selectable/non-draggable styles cover controls, descendants and the loader; WebKit callouts are disabled. Game-scoped native range selection is cleared on selectionchange/touch/pointer start; capture-phase selection, drag and context-menu defaults are blocked. Keyboard focus indicators and normal button activation remain. These protections do not alter the browser toolbar; physical iOS confirmation remains the user's playtest.
