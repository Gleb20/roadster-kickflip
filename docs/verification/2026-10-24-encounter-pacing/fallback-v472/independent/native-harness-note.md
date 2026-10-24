# Native public test driver

The first4.7.2 attempt stopped after a pause because the test driver unconditionally sent CDP touchCancel even though no synthetic finger was down. Chrome rejected that protocol sequence with “Must send a TouchStart first”. The saved progress had no game runtime errors. This was not counted as a game or pacing pass.

The driver now cancels only a held finger and treats only the precise already-cleared-touch release protocol error as idempotent cleanup. Other protocol failures still throw. It does not alter game state, routes, physics or clocks. The acceptance run uses the same visible-only120ms input policy. After its saved180s result, optional ordinary game-over retention reads only this isolated profile own score/replay; no session capability is returned and no public score is submitted.
