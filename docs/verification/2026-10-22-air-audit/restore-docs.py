#!/usr/bin/env python3
"""Restore the exact documentation candidate only; preserve all runtime work."""
from pathlib import Path
import argparse
import hashlib
import json
import shutil
import tempfile

SNAPSHOT = Path('/tmp/tesla-air-audit-before-20261022')


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def restore(root, candidate, baseline):
    for name, expected in candidate['files'].items():
        target = root / name
        if not target.is_file() or digest(target) != expected:
            raise SystemExit(f'Refusing changed candidate: {name}')
    for name, expected in baseline['beforeDocs'].items():
        if digest(SNAPSHOT / name) != expected:
            raise SystemExit(f'Refusing changed snapshot: {name}')
    for name in baseline['beforeDocs']:
        shutil.copy2(SNAPSHOT / name, root / name)
    for name in candidate['files']:
        if name not in baseline['beforeDocs']:
            (root / name).unlink()
    for name, expected in baseline['beforeDocs'].items():
        if digest(root / name) != expected:
            raise SystemExit(f'Restored hash mismatch: {name}')
    assert all(not (root / name).exists() for name in candidate['files']
               if name not in baseline['beforeDocs'])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument('--rehearse', action='store_true')
    mode.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[3]
    candidate = json.loads((SNAPSHOT / 'candidate.json').read_text())
    baseline = json.loads((SNAPSHOT / 'manifest.json').read_text())
    if args.rehearse:
        with tempfile.TemporaryDirectory(prefix='tesla-air-audit-restore-') as folder:
            isolated = Path(folder)
            for name in candidate['files']:
                target = isolated / name
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(root / name, target)
            restore(isolated, candidate, baseline)
        print('PASS: three baseline documents restored; exact new files removed in isolation.')
    else:
        restore(root, candidate, baseline)
        print('Restored the documentation-only audit. Runtime and foreign files preserved.')


if __name__ == '__main__':
    main()
