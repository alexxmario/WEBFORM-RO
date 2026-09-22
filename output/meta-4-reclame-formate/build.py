from pathlib import Path
import json,subprocess,shutil,zipfile,html
from PIL import Image
r=Path(__file__).parent
jobs=json.loads((r/'surse-si-prompturi.json').read_text())
assets=json.loads((r.parent/'meta-instalatori-selectie-4/imagini-surse.json').read_text())
folders={4:'04-lucrari-la-prezentare',2:'02-sub-gresie',6:'06-poza-cu-poveste',8:'08-prima-intrebare'}
sizes={'square':(1080,1080),'vertical':(1080,1920),'horizontal':(1200,628)}
for id,folder in folders.items():
 d=r/folder;d.mkdir(exist_ok=True)
 a=next(a for a in assets if a['id']==id)
 shutil.copy2(r.parent/'meta-instalatori-selectie-4'/a['file'],d/'original-4x5.png')
for j in jobs:
 w,h=sizes[j['format']]
 with Image.open(j['source']) as im:
  sw,sh=im.size
  assert abs((sw/sh)/(w/h)-1)<.015,(j['id'],j['format'],im.size)
 j['native_size']=[sw,sh]
 p=r/folders[j['id']]/f"{j['format']}-{w}x{h}.png"
 subprocess.run(['/usr/bin/sips','--resampleHeightWidth',str(h),str(w),j['source'],'--out',str(p)],check=True,stdout=subprocess.DEVNULL)
 with Image.open(p) as im:
  assert im.size==(w,h)
  assert im.mode=='RGB' or (im.mode=='RGBA' and im.getextrema()[-1]==(255,255))
 j['output']=str(p.relative_to(r))
(r/'surse-si-prompturi.json').write_text(json.dumps(jobs,ensure_ascii=False,indent=2))
(r/'README.md').write_text('''# 4 reclame — variante de format

Fiecare dintre cele 4 foldere conține:
- original-4x5.png: originalul aprobat, 1122 × 1402 px, aproximativ 4:5.
- square-1080x1080.png: pătrat 1:1.
- vertical-1080x1920.png: vertical 9:16.
- horizontal-1200x628.png: orizontal aproximativ 1,91:1.

Adaptări de compoziție cu ImageGen integrat, apoi export la dimensiunile exacte cu sips. Textele și ideea vizuală sunt păstrate; eticheta „Scenariu ilustrativ” nu este prezentă. Prompturile și proveniența sunt în surse-si-prompturi.json.

Acestea sunt variante pentru reclame statice; nu înlocuiesc materialele video sau formatele speciale. La încărcare, verifică previzualizarea fiecărui plasament, inclusiv suprapunerile interfeței. Semnătura discretă de jos poate fi acoperită pe anumite plasamente verticale.
''')
body=''
for id,folder in folders.items():
 body+=f'<section><h2>Reclama {id:02d}</h2><div class="grid">'
 for name in ['original-4x5.png','square-1080x1080.png','vertical-1080x1920.png','horizontal-1200x628.png']:
  body+=f'<a href="{folder}/{name}" download><img src="{folder}/{name}" alt="{name}"><span>{name}</span></a>'
 body+='</div></section>'
(r/'galerie.html').write_text('<!doctype html><html lang="ro"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>4 reclame — toate formatele</title><style>body{background:#080e13;color:#edf2f5;font:16px/1.5 Arial;padding:24px}main{max-width:1500px;margin:auto}a{color:#51d2e9;text-decoration:none}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}img{width:100%;height:350px;object-fit:contain;background:#152029}span{display:block;margin-top:8px;font-size:13px}section{margin:40px 0}@media(max-width:800px){.grid{grid-template-columns:repeat(2,1fr)}img{height:250px}}</style><main><h1>4 reclame. Toate variantele.</h1><p><a href="../webform-4-reclame-toate-formatele.zip">Descarcă cele 4 foldere ZIP ↗</a></p>'+body+'</main></html>')
assert len(list(r.glob('*/*.png')))==16
with zipfile.ZipFile(r.parent/'webform-4-reclame-toate-formatele.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted(r.rglob('*')):
  if p.is_file() and p.suffix!='.py':z.write(p,str(p.relative_to(r)))
with zipfile.ZipFile(r.parent/'webform-4-reclame-toate-formatele.zip') as z:assert z.testzip() is None
print('4 foldere, 16 PNG-uri. Dimensiuni, opacitate și ZIP verificate.')
