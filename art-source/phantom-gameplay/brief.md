# DJI Phantom 4 — Tesla Jump 3.0

Requested role: hovering and oncoming aerial obstacles, without attacks. Real representative: DJI Phantom 4 (2016), chosen for recognizable four-rotor white silhouette and camera/skids. Game size 92×40 logical units; bottom-centred anchor at obstacle altitude. Movement variants share one transparent sprite.

Photo verified visually before generation: Thomas Berwing (Volatus), 30 April 2016; https://commons.wikimedia.org/wiki/File:20160430-00226-DJI-Phantom4.jpg ; original https://upload.wikimedia.org/wikipedia/commons/0/0f/20160430-00226-DJI-Phantom4.jpg . Access 18 October 2026. CC BY-SA 3.0: https://creativecommons.org/licenses/by-sa/3.0/ . Supplied photo is front three-quarter; the generated isolated adaptation uses a shallow three-quarter presentation.

Style inherited from the mechanical/vehicle obstacle category, inspected `obstacle-photos.png`, not the human South Park category. `style-reference.png` is a byte-for-byte local copy for provenance. The built-in image_gen received both actual local image paths: `photo.jpg` and the root vehicle atlas. Exact prompt is in `prompt.txt`; original result is `generated.png`.

Generation requested real transparent alpha, intact motors/propellers/skids and a thin warm-white sticker edge. Deterministic preparation: sharp.trim().resize({width:512}), preserving aspect ratio and alpha. Final `assets/obstacles/phantom-v3.png`, 512×222 RGBA. Source image remains unchanged. Asset attribution/derivative license retained as CC BY-SA 3.0.

Visual checks: sprite compared with photographic vehicle art on light/dark backgrounds at game scale, and rendered in the actual scene. No reference photo or source atlas is loaded at runtime. Full physical-device visual acceptance remains open.
