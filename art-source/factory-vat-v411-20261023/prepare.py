from pathlib import Path
from PIL import Image
import json, hashlib
root=Path(__file__).resolve().parents[2]; packet=Path(__file__).resolve().parent
im=Image.open(packet/'original.png').convert('RGBA')
# Remove only near-invisible generated flecks (alpha <10/255), retaining antialiasing.
a=im.getchannel('A'); im.putalpha(a.point(lambda v: 0 if v<10 else v))
im=im.crop(im.getchannel('A').getbbox()); im.thumbnail((768,768),Image.Resampling.LANCZOS)
out=root/'assets/encounters/v411/moltenVat.png'; out.parent.mkdir(parents=True,exist_ok=True); im.save(out,optimize=True)
meta={'file':str(out.relative_to(root)),'pixels':list(im.size),'mode':im.mode,'alphaExtrema':im.getchannel('A').getextrema(),'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'normalization':'remove alpha<10 generated flecks; alpha crop; proportional Lanczos max768; remaining alpha preserved'}
(packet/'prepared.json').write_text(json.dumps(meta,indent=2)+'\n');print(json.dumps(meta))
