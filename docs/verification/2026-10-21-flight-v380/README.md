# Published3.8.0 acceptance

The public game and compatible backend are live. Both native keyboard and native touch landed a PERFECT flip for150 points. Full results: public-checks.json, public-hashes.json, hosted-checks.json, actual-upgrade.json and release-status.json. Physical iPhone/Safari acceptance is the user test. No public QA scores were written. Earlier preflight limitations below remain precisely scoped.

# Flight3.8.0 verification

Local candidate based on public3.7.3.116 initial tests plus the saved-best migration regression pass;8 server tests,40 gameplay checks,23 focused native keyboard/touch checks and11 browser replay checks pass. Screenshots in landing/ show held grab, release extension, contact compression and overhold recovery. Mobile input begins with actual touch events; game-time stepping is accelerated in local mechanics fixtures, with obstacle spawning disabled only for those isolated mechanics. The general gameplay/replay suites retain real generated obstacles. Browser evidence does not establish physical iPhone/Safari feel.

No new raster assets. Existing art and category styles are reused. Server migration/function deployment was separately authorized, completed and verified byte for byte.13 hosted checks pass without public fixture scores;8 actual3.7.3→3.8.0 upgrade checks pass. Frontend publication is verified: commit2a4061309e1a5b1d6c2ad17683410136fba9c846, Pages39656822040 success,70 core hashes plus worker and27 public browser checks pass. Do not confuse this with a game failure.

PWA regression gate:13 checks pass, including cold offline navigation, saved score/collection persistence and explicit restart upgrade. Home automatic activation timed out both on unchanged published3.7.3 and this candidate, on Chrome and Chromium. This is recorded as an existing update-boundary issue, not a green full-suite result. A legacy extended visual suite passed grab/contact arrangements but failed repeated-render image equality; its whole suite is not counted as passed. Focused new mechanics and general gameplay/replay gates pass.

The published verification packet keeps three representative phone captures (grab, open, compression). Larger desktop/arranged/overhold captures remain in the local task packet. Full backward compatibility is checked locally with8 server tests and73 menu/disposable-database checks; hosted negative tests deliberately reject the final replay to avoid writing fake public scores.
