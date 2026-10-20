# Installation and offline play

The game remains at its GitHub Pages address. Install from the menu or the browser's installation/share menu. iPhone/iPad instructions explain Add to Home Screen; browser support determines the available installation action. The manifest uses relative identity/scope/start URL, with 192/512 maskable icons made from the existing photo-derived car sprite. A staging path has a separate service-worker/cache scope.

The generated `sw.js` embeds SHA-256 for every offline resource: shell, styles, modules, current sprite atlases, audio, manifest and icons. Since 3.6.0 this includes all eleven factory sprites and their distribution credits; both scenery biomes are ready offline after a complete install. Run `npm run build:pwa` after changing runtime files. `npm run check:pwa` rejects stale hashes. An incomplete or mixed deployment fails installation and removes its candidate cache. First installation needs a connection and full material preparation; the guide reports readiness. Cache storage can be cleared/evicted by the browser and is not a backup.

An existing complete release serves coherent navigation and versioned resources offline. Online APIs and writes bypass the service worker. Collection/personal best remain in the existing localStorage keys; installing a PWA does not promise cross-browser/device synchronisation, and some platforms isolate standalone storage.

A new release waits. Apply UPDATE READY from menu/results only. Playing and paused attempts cannot apply it. The caller locks start/restart while activation is pending; another open game window blocks activation and restores controls. After explicit safe activation the page reloads. Closing all old windows also permits the browser's normal activation between sessions. Retain current and one previous complete cache within this app scope; unrelated apps' caches are untouched.

GitHub Pages can continue serving the complete frontend. Rollback is a new commit restoring tested files and a rebuilt worker with a fresh release version; already-installed clients receive it through the same safe-update route. Do not delete local saves. For a host migration, preserve or explicitly export saves; a new origin cannot directly read the old origin's storage.

Physical installation and iOS/Safari behaviour require device acceptance. Chromium emulation is evidence for tested flows, not physical-device verification.
