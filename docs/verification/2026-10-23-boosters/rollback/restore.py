#!/usr/bin/env python3
"""Guarded task-only restoration; refuses any newer or unrelated modifications."""
import argparse,hashlib,io,json,pathlib,shutil,tarfile,tempfile
here=pathlib.Path(__file__).resolve().parent
p=argparse.ArgumentParser();group=p.add_mutually_exclusive_group(required=True);group.add_argument('--rehearse',action='store_true');group.add_argument('--apply',action='store_true');p.add_argument('--root',type=pathlib.Path,default=here.parents[3]);args=p.parse_args();root=args.root.resolve();manifest=json.loads((here/'files.json').read_text());digest=lambda path:hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else None
for name,m in manifest.items():
 if digest(root/name)!=m['after']:raise SystemExit('Refusing newer/missing candidate file: '+name)
def restore(target):
 with tarfile.open(here/'before-files.tar.gz','r:gz') as archive:
  for name,m in manifest.items():
   path=target/name
   if m['before'] is None:path.unlink()
   else:
    path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(archive.extractfile(name).read())
 for name,m in manifest.items():
  if digest(target/name)!=m['before']:raise RuntimeError('Restoration mismatch: '+name)
if args.rehearse:
 with tempfile.TemporaryDirectory(prefix='tesla-boosters-restore-') as directory:
  target=pathlib.Path(directory)
  for name in manifest:
   path=target/name;path.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/name,path)
  restore(target)
else:restore(root)
print(json.dumps({'mode':'rehearse' if args.rehearse else 'apply','affectedFiles':len(manifest),'verified':True}))
