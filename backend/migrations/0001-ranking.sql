CREATE TABLE IF NOT EXISTS sessions (
 id TEXT PRIMARY KEY, token_hash TEXT NOT NULL, seed INTEGER NOT NULL,
 ruleset TEXT NOT NULL, score_epoch TEXT NOT NULL, created_at INTEGER NOT NULL,
 expires_at INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'ready',
 payload_hash TEXT, nickname TEXT, replay TEXT, submitted_at INTEGER,
 public_id TEXT UNIQUE, failure TEXT, lease_hash TEXT, lease_until INTEGER,
 verify_attempts INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS session_expiry ON sessions(expires_at);
CREATE TABLE IF NOT EXISTS runs (
 seq INTEGER PRIMARY KEY AUTOINCREMENT, public_id TEXT NOT NULL UNIQUE, session_id TEXT NOT NULL UNIQUE,
 score_epoch TEXT NOT NULL, ruleset TEXT NOT NULL, nickname TEXT NOT NULL,
 score INTEGER NOT NULL CHECK(score>=0), flips INTEGER NOT NULL CHECK(flips>=0),
 ticks INTEGER NOT NULL CHECK(ticks>0), accepted_at INTEGER NOT NULL,
 source_environment TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS ranking_order ON runs(score_epoch,score DESC,accepted_at,public_id);
CREATE TABLE IF NOT EXISTS rate_buckets (key TEXT PRIMARY KEY,n INTEGER NOT NULL,expires_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS rate_expiry ON rate_buckets(expires_at);
CREATE TABLE IF NOT EXISTS schema_versions(version INTEGER PRIMARY KEY,applied_at TEXT NOT NULL);
INSERT OR IGNORE INTO schema_versions VALUES(1,strftime('%Y-%m-%dT%H:%M:%SZ','now'));
