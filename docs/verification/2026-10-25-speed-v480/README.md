# Tesla Jump 4.8.0 — published

[Play 4.8.0](https://gleb20.github.io/roadster-kickflip/?v=4.8.0).

The first 20 seconds retain the existing pace. The later acceleration reaches a stable base speed of 740 at 150 progress seconds. Late obstacle motion on a 390px phone viewport is about 15.3% faster, with existing readability and input windows preserved. Falls and recovery delay progress.

Verification: 250 game tests, 16 server tests, 34 disposable database checks, and 12 automated 15-minute runs passed. All 192 public resource hashes match the tested release. Hosted verification accepted all 16 supported replay versions and rejected two forged results. Existing public records were unchanged; test results were isolated from the public leaderboard.

A fresh Chrome Incognito session passed start, result, retry, and pause checks. Physical phone acceptance and upgrade from an already installed old PWA remain unverified. Close old game tabs/app windows before opening the release. If an old client persists, use a private tab without deleting stored data.

The next bounded technical-debt stage is phone frame-time profiling and the reproduced PWA update delay. Client rollback has been rehearsed; retain server compatibility for already saved replays.
