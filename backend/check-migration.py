"""Compare application rows/IDs/rank order in two isolated local D1 files."""
import hashlib
import json
from pathlib import Path
import sqlite3
import sys

def inspect(directory):
    root = Path(directory) / 'v3' / 'd1'
    if not root.is_dir():
        raise ValueError('Expected a local D1 persistence directory')
    files = [p for p in root.rglob('*.sqlite') if p.name != 'metadata.sqlite']
    if len(files) != 1:
        raise ValueError('Expected exactly one application database')
    db = sqlite3.connect(files[0].resolve().as_uri() + '?mode=ro', uri=True)
    assert db.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
    result = {}
    for table, key in [('runs', 'public_id'), ('sessions', 'id'), ('rate_buckets', 'key'), ('schema_versions', 'version')]:
        columns = [row[1:6] for row in db.execute('PRAGMA table_info(' + table + ')')]
        rows = db.execute('SELECT * FROM ' + table + ' ORDER BY ' + key).fetchall()
        digest = hashlib.sha256(json.dumps([columns, rows], ensure_ascii=True, separators=(',', ':')).encode()).hexdigest()
        result[table] = {'rows': len(rows), 'sha256': digest}
    order = db.execute('SELECT public_id FROM runs ORDER BY score_epoch,score DESC,accepted_at,public_id').fetchall()
    result['ranking_order'] = {'rows': len(order), 'sha256': hashlib.sha256(json.dumps(order, separators=(',', ':')).encode()).hexdigest()}
    db.close()
    return result

if __name__ == '__main__':
    if Path(sys.argv[1]).resolve() == Path(sys.argv[2]).resolve():
        raise ValueError('Source and restore must be separate databases')
    source, restored = inspect(sys.argv[1]), inspect(sys.argv[2])
    assert source == restored, 'Migration changed rows, schema, authentication hashes or ordering'
    print(json.dumps({'matched': True, 'tables': source}, indent=2))
