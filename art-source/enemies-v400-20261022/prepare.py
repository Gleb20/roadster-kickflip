"""Deterministic alpha cleanup, proportional resizing and contact sheets."""
from pathlib import Path
import json
import hashlib
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SOURCE = Path(__file__).resolve().parent
OUT = ROOT / 'assets/encounters/v400'
OUT.mkdir(parents=True, exist_ok=True)
widths = dict(sikorsky=176, xi=72, t800=57, ufo=104, primeDrone=110,
              twitterBird=76, homelessRow=142, bydSeal=138, xiaomiSu7=138,
              batteryAgv=118, qualitySkull=76, starlink=112,
              regulatorDrone=106, reptileHead=68, moltenVat=164)
metadata = {}
for name, width in widths.items():
    original = SOURCE / 'generated' / (name + '-original.png')
    im = Image.open(original).convert('RGBA')
    pixels = np.array(im)
    # The model adds a low-opacity soft halo. Retain solid connected artwork,
    # then antialias once at delivery size; do not paint or change the subject.
    solid = Image.fromarray(np.where(pixels[:, :, 3] >= 215, 255, 0).astype('uint8'))
    mask = np.array(solid.filter(ImageFilter.MedianFilter(5))) > 0
    pixels[:, :, 3] = np.where(mask, 255, 0).astype('uint8')
    clean = Image.fromarray(pixels)
    box = clean.getchannel('A').getbbox()
    assert box and box[0] > 0 and box[1] > 0 and box[2] < im.width and box[3] < im.height, (name, box)
    clean = clean.crop(box)
    limit = 320 if name == 'reptileHead' else 768
    clean.thumbnail((limit, limit), Image.Resampling.LANCZOS)
    # No padding: world geometry and actual silhouette aspect share an anchor.
    clean.save(OUT / (name + '.png'), optimize=True)
    metadata[name] = dict(file=f'assets/encounters/v400/{name}.png',
                          w=width, h=round(width * clean.height / clean.width, 3),
                          pixels=list(clean.size), sourcePixels=list(im.size),
                          sourceCrop=list(box), alphaExtrema=clean.getchannel('A').getextrema(),
                          sha256=hashlib.sha256((OUT / (name + '.png')).read_bytes()).hexdigest())
(SOURCE / 'prepared.json').write_text(json.dumps(metadata, indent=2) + '\n')
(ROOT / 'src/enemy-sprite-data.js').write_text('// Generated proportional sprite geometry. Sources: art-source/enemies-v400-20261022/.\nexport const ENEMY_SPRITES=Object.freeze(' + json.dumps(metadata, separators=(',', ':')) + ');\n')
for theme, bg in [('dark', '#172027'), ('light', '#e5e0d4')]:
    sheet = Image.new('RGB', (1200, 1080), bg)
    draw = ImageDraw.Draw(sheet)
    for i, (name, info) in enumerate(metadata.items()):
        sprite = Image.open(OUT / (name + '.png'))
        sprite.thumbnail((260, 180), Image.Resampling.LANCZOS)
        x, y = (i % 4) * 300, (i // 4) * 270
        sheet.paste(sprite, (x + (300 - sprite.width) // 2, y + 180 - sprite.height), sprite)
        draw.text((x + 12, y + 194), name, fill='#acb8b0' if theme == 'dark' else '#24313a')
        small = Image.open(OUT / (name + '.png'))
        small.thumbnail((info['w'], info['h']), Image.Resampling.LANCZOS)
        sheet.paste(small, (x + 12, y + 224), small)
    sheet.save(SOURCE / f'contact-{theme}.jpg', quality=92)
print(json.dumps({name: [v['w'], v['h']] for name, v in metadata.items()}))
