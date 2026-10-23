#!/usr/bin/env python3
from pathlib import Path
import json,re,hashlib,urllib.request,concurrent.futures,time
root=Path(__file__).resolve().parents[1];sw=(root/'sw.js').read_text();core=json.loads(re.search(r'const CORE=(\[.*?\]);',sw,re.S).group(1));core.append({'url':'sw.js','sha256':hashlib.sha256((root/'sw.js').read_bytes()).hexdigest()})
base='https://gleb20.github.io/roadster-kickflip/'
def verify(item):
 for attempt in range(3):
  try:
   req=urllib.request.Request(base+item['url'],headers={'Cache-Control':'no-cache'})
   with urllib.request.urlopen(req,timeout=40) as r:data=r.read()
   digest=hashlib.sha256(data).hexdigest()
   if digest==item['sha256']:return {'url':item['url'],'sha256':digest,'bytes':len(data),'match':True,'retries':attempt}
   error='hash mismatch'
  except Exception as e:error=str(e)
  time.sleep(2)
 return {'url':item['url'],'match':False,'error':error}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:results=list(pool.map(verify,core))
out=root/'docs/verification/2026-10-23-audio-v450/live-hashes.json';out.write_text(json.dumps({'resources':len(results),'errors':sum(not x['match'] for x in results),'results':results},indent=2)+'\n');print(json.dumps({'resources':len(results),'errors':sum(not x['match'] for x in results)}));assert all(x['match'] for x in results)
