from pathlib import Path
import json,html,shutil,zipfile
from PIL import Image
root=Path(__file__).resolve().parent
ads=json.loads((root/'concepte.json').read_text())
assets=json.loads((root/'imagini-surse.json').read_text())
e=html.escape
cards=[]; thumbs=[]
md='''# 6 reclame — Imagine în imagine\n\nDirecție: beneficii pozitive, curiozitate, mecanism dezvăluit în text, un cuvânt-cheie în CAPS în fiecare titlu, voce «noi», CTA mereu «Learn more».\n\nImagini generate cu ImageGen integrat, folosind imaginea furnizată de utilizator ca referință de compoziție: scenă principală, inserție circulară cu informație suplimentară, titlu mare jos. Paletă: crem, cărbune, portocaliu. Nicio imagine nu este prezentată ca dovadă a unui client real.\n\nBaza editorială: playbook-ul PDF furnizat anterior și preferințele ulterioare din conversație. Oferta de referință este serviciul de site-uri și prezentare online din proiect. Textele nu pretind un sistem automat de calificare sau măsurare inclus în abonament. Prețurile și termenele comerciale nu sunt folosite.\n\n**Stare:** pachet de creație, nu campanie publicată. Ghidurile/articolele promise sunt propuse și trebuie publicate la destinație înainte de lansare. Cifrele din reclama 2 sunt un calcul ipotetic, nu rezultate reale.\n\n'''
for a,asset in zip(ads,assets):
 assert a['id']==asset['id']
 p=root/asset['file'];shutil.copy2(asset['source'],p)
 with Image.open(p) as im:
  im.verify()
 with Image.open(p) as im:
  assert im.mode=='RGB' or (im.mode=='RGBA' and im.getextrema()[-1]==(255,255)),f'Fundal transparent: {p}'
  size=im.size
 assert a['cta']=='Learn more'
 assert 'WEBFORM' not in a['copy'].upper()
 md+=f"## {a['id']:02d}. {a['headline']}\n\n**Public:** {a['niche']}\n\n### Text principal\n\n{a['copy']}\n\n**Titlu link:** {a['link']}\n\n**Descriere:** {a['description']}\n\n**CTA:** Learn more\n\n**Beneficiu:** {a['benefit']}\n\n**Baza afirmațiilor:** {a['basis']}\n\n**Destinație:** {a['destination']}\n\n**Concept vizual:** {a['visual']}\n\n**Fișier:** {asset['file']} ({size[0]} × {size[1]} px)\n\n**Prompt final:**\n\n{a['prompt']}\n\n"
 paragraphs=''.join('<p>'+e(s)+'</p>' for s in a['copy'].split('\n\n'))
 brief=''.join('<p><b>'+label+':</b> '+e(a[key])+'</p>' for label,key in [('Beneficiu','benefit'),('Baza afirmațiilor','basis'),('Destinație propusă','destination'),('Concept vizual','visual'),('Prompt ImageGen','prompt')])
 cards.append(f'''<article id="ad-{a['id']}"><div class="tag">{a['id']:02d} / {e(a['niche'])}</div><h2>{e(a['headline'])}</h2><div class="layout"><div><a href="{asset['file']}" target="_blank"><img src="{asset['file']}" alt="{e(a['headline'])}"></a><a class="download" href="{asset['file']}" download>Descarcă imaginea PNG ↗</a></div><div><div class="copy">{paragraphs}</div><div class="link"><b>{e(a['link'])}</b><p>{e(a['description'])}</p><span>Learn more</span></div></div></div><details><summary>Beneficiu, bază factuală și brief</summary>{brief}</details></article>''')
 thumbs.append(f'<a href="#ad-{a["id"]}"><img src="{asset["file"]}" alt="{e(a["headline"])}"><b>{a["id"]:02d}</b><span>{e(a["niche"])}</span></a>')
(root/'6-reclame-complete.md').write_text(md)
css='''*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#f7f5ef;color:#242320;font:16px/1.6 Arial,Helvetica,sans-serif}main{max-width:1240px;padding:40px 24px;margin:auto}header{max-width:850px}h1{font-size:clamp(36px,6vw,66px);line-height:1.05;letter-spacing:-.05em;margin:20px 0}h1 em{color:#d9532b;font-style:normal}.tag{color:#a94222;letter-spacing:.06em;font-size:12px;font-weight:bold}h2{font-size:clamp(25px,3vw,36px);line-height:1.18;letter-spacing:-.025em;margin:12px 0 25px}a{color:inherit}.tools{display:flex;gap:24px;flex-wrap:wrap;margin:24px 0}.tools a{font-weight:bold;text-underline-offset:5px}.note{background:#eee8dd;border-left:3px solid #d9532b;padding:16px;font-size:14px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;margin:34px 0 60px}.grid a{text-decoration:none}.grid img{width:100%;display:block;border-radius:6px}.grid b{display:inline-block;margin:8px 10px 0 0;color:#a94222}.grid span{font-size:13px}article{border-top:1px solid #cbc5b9;padding-top:26px;margin:40px 0 66px;scroll-margin-top:20px}.layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:42px}.layout img{width:100%;display:block;border-radius:6px}.download{display:inline-block;margin-top:12px;font-size:14px}.copy p{margin:0 0 16px}.copy p:first-child{font-size:20px;line-height:1.4;font-weight:bold}.link{padding:20px;background:#242320;color:#f7f5ef;border-radius:6px;margin-top:25px}.link p{margin:6px 0 16px;color:#d5d2c8}.link span{padding:5px 12px;border:1px solid #88867e;border-radius:4px;display:inline-block}details{border-top:1px solid #d6d1c6;margin-top:25px;padding-top:18px;overflow-wrap:anywhere}summary{cursor:pointer;font-weight:bold}details p{font-size:14px;max-width:95ch}@media(max-width:760px){main{padding:25px 16px}.layout{grid-template-columns:1fr;gap:25px}.grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}'''
page='<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>6 reclame — Imagine în imagine</title><style>'+css+'</style></head><body><main><header><div class="tag">6 RECLAME / IMAGINE ÎN IMAGINE</div><h1>Intriga în titlu.<br><em>Detaliul în imagine.</em></h1><p>Șase concepte pentru servicii locale, cu imagini generate după compoziția de referință și texte complete.</p><div class="tools"><a href="6-reclame-complete.md">Textele și briefurile ↗</a><a href="../6-reclame-imagine-in-imagine.zip">Descarcă pachetul ZIP ↗</a></div><p class="note">CTA: <b>Learn more</b>. Articolele promise sunt propuse, nepublicate. Imaginile sunt ilustrative; calculul din reclama 2 este ipotetic.</p></header><section class="grid" aria-label="Cele șase reclame">'+''.join(thumbs)+'</section>'+''.join(cards)+'</main></body></html>'
(root/'galerie.html').write_text(page)
archive=root.parent/'6-reclame-imagine-in-imagine.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted(root.iterdir()):
  if p.suffix in ['.png','.html','.md','.json']:z.write(p,root.name+'/'+p.name)
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 assert len([n for n in z.namelist() if n.endswith('.png')])==6
print('Galerie:',root/'galerie.html')
print('Arhivă verificată:',archive)
