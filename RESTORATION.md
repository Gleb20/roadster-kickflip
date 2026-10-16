# Roadster Kickflip: restoration

Canonical source: Gleb20/roadster-kickflip main. Public game: https://gleb20.github.io/roadster-kickflip/

Based on approved a24229caf3a2c7a9ed27dde31822486620312009. Preserve paper-cutout visuals, original assets, BOOST/X2 circles, crouch animation, charge controls, jump physics, rocket scenes and Trump gestures. No redesign.

Added: seamless DO A FLIP start; Zuckerberg, eyed AI logos, Rogozin trampoline with inset hitboxes; removed AI INTERN. Bezos/Katy suspended rocket congratulates each 5000 score milestone with fireworks. Milestones reset per run and never repeat. Decorative cameo has no collision.

index.html embeds game.js and style.css: keep both copies synchronized. No build dependencies. Preview: python3 -m http.server 8765. Validate: node --check game.js. Compare protected functions and original assets against baseline; test desktop/mobile, charge/release/cancel, boost recharge, milestone crossing/restart.

Changes to progression/charge speed belong to the separate balancing task after Rogozin is verified on GitHub Pages. Refresh main before editing to preserve work from other chats.
