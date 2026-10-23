# English audio settings —4.6.1

Corrects the4.5.1 audio UI to follow the existing English-only interface. Visible labels are “Sound settings”, “Effects” and “Music”; the accessible muted value is “Muted”. Both settings containers use lang="en", and the initial SOUND button has an English accessible name. Source4.6.0/main `ede9ec6` includes the published obstacle director and is preserved.

203 unit tests and source/content/types/PWA190 checks pass.21 isolated Chrome checks at390×844 and1440×900 cover actual native keyboard sliders, independent saved levels, menu and pause names, English accessibility, reload and cold offline. Screenshots were inspected; no runtime errors or public score submissions. Physical iPhone/Safari and spoken screen reader remain untested. See `local/checks.json`, `tests.log`, `check.log` and `scope-and-rollback.json`.

Only audio text/language and release/cache identities change at runtime. Other runtime files are identical after version normalization; ranked roadster-v4.6.0, all frozen verifiers/backend, music/art and animations remain intact. A forward/reverse rehearsal restores exact parent hashes for all34 changed files. `runtime-forward.patch` is the bounded runtime/documentation delta. A public reversal needs a fresh cache version; retain all saved settings, scores/outbox and newer parallel changes. Do not restore the old dirty root.

Existing PWA lifecycle and physical-device acceptance questions were rechecked and remain separate; no unrelated debt task is started. Publication/live evidence follows in this directory.
