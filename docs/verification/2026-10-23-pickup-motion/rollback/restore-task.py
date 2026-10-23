#!/usr/bin/env python3
"""Guarded task-only inverse. Default rehearses; --apply mutates only exact candidate files."""
from pathlib import Path
import hashlib,json,shutil,tarfile,tempfile,sys
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[3]
ROWS=json.loads((HERE/'manifest.json').read_text())['files']
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None
def restore(root):
    for row in ROWS:
        if sha(root/row['path'])!=row['after']:raise RuntimeError('Newer or missing file; refusing: '+row['path'])
    with tarfile.open(HERE/'before.tar.gz') as before:
        for row in ROWS:
            p=root/row['path']
            if row['before'] is None:p.unlink()
            else:p.write_bytes(before.extractfile(row['path']).read())
    for row in ROWS:
        assert sha(root/row['path'])==row['before'],row['path']
if '--apply' in sys.argv:
    restore(ROOT);print('Restored only guarded local4.3.1 parent files; foreign work retained.')
else:
    with tempfile.TemporaryDirectory(prefix='tesla-holo-inverse-') as folder:
        root=Path(folder)
        for row in ROWS:
            p=root/row['path'];p.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(ROOT/row['path'],p)
        probe=root/ROWS[0]['path'];original=probe.read_bytes();probe.write_bytes(original+b'newer edit')
        try:restore(root)
        except RuntimeError:pass
        else:raise AssertionError('Guard failed to reject newer bytes')
        assert probe.read_bytes()==original+b'newer edit'
        probe.write_bytes(original);restore(root)
    result={'rehearsed':True,'exactParentHashes':True,'rejectsNewerEdits':True,'files':len(ROWS),'rootModified':False}
    (HERE/'rehearsal.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
