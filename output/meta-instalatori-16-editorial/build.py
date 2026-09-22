from pathlib import Path
import json,html,shutil,zipfile,csv,ast
from PIL import Image
r=Path(__file__).parent;e=html.escape
ads=json.loads((r/'concepte.json').read_text());assets=json.loads((r/'imagini-surse.json').read_text())
# Reuse only the editorial explanatory paragraphs from the first pack, not its design.
tree=ast.parse((r.parent/'meta-instalatori-16/build_deliverables.py').read_text())
old=next(ast.literal_eval(n.value) for n in tree.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='lessons' for t in n.targets))
order=[4,8,4,1,8,1,2,13,6,3,11,7,8,12,1,4]
lessons=[old[j] for j in order]
lessons[4]=('Ce notezi când faci fotografia',['Păstrează alături de imagine serviciul realizat, tipul spațiului și detaliul pe care vrei să îl explici. Folosește numai fotografii pe care ai dreptul să le publici.','Exemplu de notă: „[Serviciu] într-un [spațiu]. În imagine se vede [detaliu].” Înlocuiește câmpurile cu faptele proiectului tău.','Când cineva cere exemple, poți selecta proiectul relevant. Cele șase luni din reclamă sunt un scenariu: nu există un termen sau un număr de cereri garantat.'])
lessons[11]=('Cuvântul potrivit are și context',['„Baterie” poate desemna obiecte diferite. „Montaj baterie de baie” precizează serviciul într-un limbaj accesibil.','Aplică aceeași regulă listei tale: acțiune, obiect, context. De exemplu „înlocuire calorifer în apartament”, dacă acesta este un serviciu pe care îl prestezi.','Explică apoi zona și ce informații sunt utile la contact. Nu presupune că vizitatorul cunoaște jargonul meseriei.'])
lessons[14]=('Ce îi povestești celui care scrie',['Pentru fiecare fotografie, explică ce ai realizat, în ce tip de spațiu și ce detaliu merită remarcat. Evită afirmațiile pe care imaginea și informațiile proiectului nu le pot susține.','Pregătește și lista serviciilor, zona de lucru și modul de contact. O prezentare clară pornește de la aceste informații concrete.','Noi discutăm cu tine și redactăm textele pentru site. Verifici propunerea și corectitudinea informațiilor înainte de publicare.'])
css='''*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#080e13;color:#f1f4f6;font:16px/1.65 Arial,sans-serif}main{max-width:1320px;margin:auto;padding:42px 26px}h1{font-size:clamp(38px,5vw,70px);line-height:1.06;letter-spacing:-.04em;max-width:950px}h1 em{color:#ffce2e;font-style:normal}h2{font-size:clamp(24px,3vw,34px);line-height:1.2;letter-spacing:-.025em}a{color:inherit;text-underline-offset:5px}.tag{color:#51d2e9;font-size:13px}.note{border-left:3px solid #ffce2e;background:#141e25;padding:18px;max-width:980px}.tools{display:flex;gap:24px;flex-wrap:wrap}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;margin:40px 0}.grid a{text-decoration:none}.grid img{display:block;width:100%}.grid span{display:block;font-size:13px;margin-top:8px;color:#b8c6cf}.layout{display:grid;grid-template-columns:1fr 1fr;gap:40px}.layout img{width:100%;display:block}.copy p{margin:0 0 20px}.copy p:first-child{font-size:21px}.link{background:#17252e;padding:20px}.link p{margin:8px 0}.cta{display:inline-block;border:1px solid #82919a;padding:5px 12px}article{border-top:1px solid #293a44;padding-top:28px;margin:48px 0;scroll-margin-top:20px}details{margin-top:24px;overflow-wrap:anywhere}summary{cursor:pointer;color:#51d2e9}.reading{max-width:800px}.reading p{font-size:19px}.offer{background:#17252e;padding:24px}.step{color:#ffce2e;font-weight:bold}@media(max-width:760px){main{padding:25px 16px}.grid{grid-template-columns:repeat(2,1fr);gap:14px}.layout{grid-template-columns:1fr;gap:22px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}'''
def page(title,body):return '<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+e(title)+'</title><style>'+css+'</style></head><body><main>'+body+'</main></body></html>'
assert len(ads)==len(assets)==16
for a in assets:
 shutil.copy2(a['source'],r/a['file'])
 with Image.open(r/a['file']) as im:im.verify()
 with Image.open(r/a['file']) as im:
  assert im.mode=='RGB' or (im.mode=='RGBA' and im.getextrema()[-1]==(255,255))
  a['size']=list(im.size)
(r/'imagini-surse.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2))
md='# WebForm — 16 reclame editoriale pentru instalatori\n\nVersiunea bazată pe direcția aprobată: curiozitate în headline, poveste în imagine, explicație în text. Culori discrete: cărbune, alb, galben și cyan. Fără prețuri, promisiuni de rezultate sau ofertă pe imagine. Marca este semnată discret.\n\nImagini originale generate cu ImageGen integrat; scene ilustrative. Textele urmează ghidul universal și ritmul exemplelor din facebook_ad_16183.pdf, fără statisticile ori urgența nesusținute din acesta.\n\nStare: pachet local, nepublicat. Toate cele 16 continuări sunt în continuari.html; înainte de lansare, publică pagina relevantă și folosește adresa ei drept destinație. Legătura către oferta WebForm urmează după explicație.\n\n'
cards=[];thumbs=[];articles=[]
for a,(lt,paras) in zip(ads,lessons):
 assert a['cta']=='Learn more'
 for h in [a['headline']]+a['alternatives']:
  assert len([w for w in h.split() if w.isupper() and len(w)>1])==1,h
 md+=f"## {a['id']:02d}. {a['headline']}\n\n**Imagine:** {a['file']}\n\n**Public:** {a['audience']}\n\n**Situație / unghi:** {a['angle']}\n\n**Ipoteză:** {a['hypothesis']}\n\n**Beneficiu:** {a['benefit']}\n\n**Baza afirmațiilor:** {a['basis']}\n\n### Text principal\n\n{a['copy']}\n\n**Alternative:**\n\n- {a['alternatives'][0]}\n- {a['alternatives'][1]}\n\n**Titlu link:** {a['link']}\n\n**Descriere:** {a['description']}\n\n**CTA:** Learn more\n\n**Destinație:** {a['destination']} — {a['publication']}\n\n**Promisiunea livrată:** {lt}\n\n**Scena și relația vizuală:** {a['visual']}\n\n**Text în imagine:** {a['headline']} · webform · Scenariu ilustrativ\n\n**De verificat înainte de lansare:** publicarea continuării, oferta live și concordanța serviciilor prezentate. Imaginile generate nu se folosesc ca portofoliu real.\n\n**Prompt final:** {a['prompt']}\n\n"
 p=''.join('<p>'+e(s)+'</p>' for s in a['copy'].split('\n\n'))
 cards.append(f'<article id="reclama-{a["id"]}"><div class="tag">{a["id"]:02d} / {e(a["angle"])}</div><h2>{e(a["headline"])}</h2><div class="layout"><div><a href="{a["file"]}"><img loading="lazy" src="{a["file"]}" alt="{e(a["headline"])}"></a><p><a download href="{a["file"]}">Descarcă PNG ↗</a></p></div><div class="copy">'+p+f'<div class="link"><b>{e(a["link"])}</b><p>{e(a["description"])}</p><span class="cta">Learn more</span></div><p><a href="{a["destination"]}">Citește continuarea ↗</a></p><b>Alte două hook-uri</b><ul>'+''.join('<li>'+e(h)+'</li>' for h in a['alternatives'])+'</ul></div></div><details><summary>Concept, bază factuală și prompt</summary>'+''.join('<p><b>'+e(k)+':</b> '+e(a[k])+'</p>' for k in ['hypothesis','benefit','basis','visual','publication','prompt'])+'</details></article>')
 thumbs.append(f'<a href="#reclama-{a["id"]}"><img src="{a["file"]}" alt="{e(a["headline"])}"><span>{a["id"]:02d} · {e(a["angle"])}</span></a>')
 articles.append(f'<article class="reading" id="reclama-{a["id"]}"><div class="tag">{a["id"]:02d} / {e(a["angle"])}</div><h2>{e(lt)}</h2>'+''.join(f'<p><span class="step">{j}.</span> {e(s)}</p>' for j,s in enumerate(paras,1))+'<div class="offer"><b>Cum putem ajuta</b><p>Noi putem organiza informațiile și lucrările tale reale într-un site pentru activitatea de instalații. Discutăm cu tine, scriem textele și adaptăm prezentarea serviciilor.</p><a href="https://ro.joinwebform.com/instalatii">Vezi exemplul de site și condițiile colaborării ↗</a></div></article>')
(r/'16-reclame-complete.md').write_text(md)
intro='<div class="tag">webform / 16 povești pentru instalatori</div><h1>Întâi vrei să afli.<br><em>Apoi descoperi oferta.</em></h1><p>16 concepte vizuale distincte, texte complete și 32 hook-uri alternative.</p><div class="tools"><a href="16-reclame-complete.md">Textele și prompturile ↗</a><a href="continuari.html">Continuările după click ↗</a><a href="../webform-instalatori-16-editorial.zip">Descarcă pachetul ZIP ↗</a></div><p class="note">Scene ilustrative generate. CTA: <b>Learn more</b>. Continuările sunt pregătite local, dar trebuie publicate înainte de lansare.</p>'
(r/'galerie.html').write_text(page('WebForm — 16 reclame editoriale',intro+'<nav class="grid">'+''.join(thumbs)+'</nav>'+''.join(cards)))
(r/'continuari.html').write_text(page('WebForm — explicațiile după click','<div class="tag">webform / continuări editoriale</div><h1>Dincolo de headline.</h1><p class="note">Texte pregătite pentru publicare. Aceasta este o previzualizare locală, nu pagina live.</p><p><a href="galerie.html">Înapoi la galerie ↗</a></p>'+''.join(articles)))
with (r/'texte-reclame.csv').open('w',encoding='utf-8-sig',newline='') as f:
 fields=['id','file','headline','copy','link','description','cta','destination'];w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows({k:a[k] for k in fields} for a in ads)
(r/'README.md').write_text('''# 16 reclame editoriale — WebForm / instalatori

Deschide galerie.html. Această versiune aplică ultima direcție aprobată: conținut bazat pe curiozitate, situații recognoscibile și varietate de compoziție; oferta apare după explicație.

Conținut: 16 PNG-uri originale opace, 16 texte principale, 32 hook-uri alternative, titluri și descrieri de link, CTA Learn more, briefuri și prompturi, CSV pentru copiere și 16 continuări editoriale. Dimensiunile native sunt în imagini-surse.json; nu au fost decupate sau redimensionate.

Generare: ImageGen integrat. Paletă discretă: cărbune, alb, galben, cyan. Semnătura webform identifică sursa. Scenele sunt illustrative, nu lucrări reale sau testimoniale.

Nu s-au publicat pagini sau reclame. Fiecare continuare trebuie publicată și verificată înainte de folosirea URL-ului în campanie. CSV este pentru organizare/copiere, nu un format garantat de import în Meta.
''')
archive=r.parent/'webform-instalatori-16-editorial.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted(r.iterdir()):
  if p.suffix in ['.png','.md','.json','.html','.csv']:z.write(p,r.name+'/'+p.name)
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 assert len([n for n in z.namelist() if n.endswith('.png')])==16
print('Pachet verificat: 16 imagini, 16 texte, 32 alternative, 16 continuări, galerie, CSV și ZIP.')
