from pathlib import Path
import concurrent.futures,hashlib,json,urllib.request
candidate=Path('/tmp/tesla-vat-v411-release-20261023');packet=Path('/Users/liubavskii/Desktop/work/Codex/Tesla Jump/docs/verification/2026-10-23-vat-v411');base='https://gleb20.github.io/roadster-kickflip/'
core=json.loads((packet/'runtime-manifest.json').read_text());core.append({'url':'sw.js','sha256':hashlib.sha256((candidate/'sw.js').read_bytes()).hexdigest()})
def check(item):
 request=urllib.request.Request(base+item['url'],headers={'Cache-Control':'no-cache'})
 with urllib.request.urlopen(request,timeout=60) as response:data=response.read()
 actual=hashlib.sha256(data).hexdigest();return {'url':item['url'],'expected':item['sha256'],'actual':actual,'matches':actual==item['sha256']}
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:rows=list(pool.map(check,core))
(packet/'public-hashes.json').write_text(json.dumps(rows,indent=2)+'\n');print(json.dumps({'resources':len(rows)-1,'workerMatches':rows[-1]['matches'],'allMatch':all(r['matches'] for r in rows),'mismatches':[r['url'] for r in rows if not r['matches']]}));assert all(r['matches'] for r in rows)
