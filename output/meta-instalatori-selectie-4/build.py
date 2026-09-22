from pathlib import Path
import json,shutil,zipfile,html
from PIL import Image
r=Path(__file__).parent;src=r.parent/'meta-instalatori-16-editorial';e=html.escape
assets=json.loads((r/'imagini-surse.json').read_text());allads=json.loads((src/'concepte.json').read_text());ads=[next(a for a in allads if a['id']==i) for i in [4,2,6,8]]
for a in assets:
 shutil.copy2(a['source'],r/a['file'])
 with Image.open(r/a['file']) as im:im.verify()
 with Image.open(r/a['file']) as im:a['size']=list(im.size)
(r/'imagini-surse.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2))
md='# Selecție reclame: 4, 2, 6, 8\n\nMențiunea „Scenariu ilustrativ” a fost eliminată din imaginile selectate cu ImageGen integrat. Textele principale sunt păstrate. Continuările promise după click rămân nepublicate; vezi fișierul continuari.html din pachet.\n\n'
cards=[]
for a in ads:
 md+=f"## {a['id']:02d}. {a['headline']}\n\n{a['copy']}\n\n**Titlu link:** {a['link']}\n\n**Descriere:** {a['description']}\n\n**CTA:** Learn more\n\n**Destinație locală:** {a['destination']}\n\n"
 cards.append(f'<article><h2>{a["id"]:02d}. {e(a["headline"])}</h2><a href="{a["file"]}" download><img src="{a["file"]}" alt="{e(a["headline"])}"></a><p><a href="{a["file"]}" download>Descarcă PNG ↗</a></p>'+''.join('<p>'+e(p)+'</p>' for p in a['copy'].split('\n\n'))+f'<p><b>{e(a["link"])}</b><br>{e(a["description"])}</p><p>CTA: Learn more</p><a href="{a["destination"]}">Continuarea după click ↗</a></article>')
(r/'texte-reclame.md').write_text(md)
shutil.copy2(src/'continuari.html',r/'continuari.html')
(r/'galerie.html').write_text('<!doctype html><html lang="ro"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>WebForm — selecția 4, 2, 6, 8</title><style>body{background:#080e13;color:#eef3f6;font:17px/1.6 Arial;margin:0}main{max-width:1120px;margin:auto;padding:30px 20px}h1{font-size:42px}h2{font-size:25px;line-height:1.3}a{color:#51d2e9}section{display:grid;grid-template-columns:1fr 1fr;gap:36px}img{width:100%;display:block}article{border-top:1px solid #33424c;padding-top:15px;margin-top:30px} @media(max-width:700px){section{grid-template-columns:1fr}}</style><main><h1>Selecția ta: 4, 2, 6, 8.</h1><p>Imagini fără mențiunea „Scenariu ilustrativ”.</p><p><a href="../webform-selectie-4-fara-eticheta.zip">Descarcă toate imaginile și textele ↗</a> · <a href="texte-reclame.md">Texte ↗</a></p><section>'+''.join(cards)+'</section></main></html>')
(r/'prompt-editare.txt').write_text('Editare cu ImageGen integrat: elimină exclusiv textul Scenariu ilustrativ din colțul inferior dreapta, reconstruind fundalul; păstrează restul textelor, semnătura webform, obiectele, paleta și compoziția.')
with zipfile.ZipFile(r.parent/'webform-selectie-4-fara-eticheta.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted(r.iterdir()):
  if p.suffix in ['.png','.md','.html','.json','.txt']:z.write(p,r.name+'/'+p.name)
assert len(list(r.glob('*.png')))==4
print('4 imagini, galerie, texte și ZIP pregătite.')
