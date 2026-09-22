from pathlib import Path
import json, html, shutil, zipfile
from PIL import Image
root=Path(__file__).resolve().parent
ads=json.loads((root/'concepte.json').read_text())
assets=json.loads((root/'imagini-surse.json').read_text())
e=html.escape
intro='''# 10 reclame Meta — Ediția 2\n\nPublic: proprietari de firme de instalații. Voce: noi, fără numele brandului în textele publice.\n\n## Direcția revizuită\n\nBaza de creație: noul playbook furnizat de utilizator, citit integral: /Users/alexmario/Downloads/WebForm_Meta_Ads_AI_Playbook.pdf. Mecanica: imagine care surprinde + întrebare relevantă + beneficiu concret. Preferința explicită ulterioară a utilizatorului înlocuiește stilul raw native din PDF: imaginile sunt grafici generate, cu compoziții conceptuale și obiecte 3D, aliniate identității actuale din proiect.\n\nPaletă verificată în app/globals.css și REDESIGN_NOTES.md: crem #f7f5ef, cărbune #242320, portocaliu #d9532b și #ed754b. Documentul DESIGN.md descrie o identitate mai veche; am urmat implementarea și notele de redesign.\n\nOferta folosită: site-uri pentru instalatori, prezentare adaptată afacerii, texte, design pentru mobil, apel și WhatsApp, abonament. Nu sunt utilizate tarife sau termene comerciale exacte neconfirmate de utilizator. Cifrele din conceptul 9 sunt explicit ipotetice, nu prețuri ale ofertei. Nu există rezultate comerciale măsurate în sursele primite.\n\n## Starea destinațiilor\n\nArticolele și ghidurile menționate sunt propuse, nu publicate. Publicarea lor este necesară înainte de folosirea reclamelor cu promisiunea respectivă. Nu trimite o promisiune de ghid direct la formularul de contact. CTA de creație: Află mai multe. Acesta este un pachet de creație, nu o campanie lansată sau o validare a performanței.\n\n'''
md=intro
cards=[]
nav=[]
thumbs=[]
for a,item in zip(ads,assets):
 assert a['id']==item['id']
 filename=item['file']
 if not (root/filename).exists(): shutil.copy2(item['source'],root/filename)
 with Image.open(root/filename) as im: im.verify()
 with Image.open(root/filename) as im: size=im.size
 md+=f"## {a['id']:02d}. {a['headline']}\n\n"
 for label,key in [('Unghi / ipoteză','angle'),('Stil grafic','style'),('Ce întrerupe scroll-ul','interrupt')]:md+=f"**{label}:** {a[key]}\n\n"
 md+=f"### Text principal\n\n{a['copy']}\n\n"
 for label,key in [('Variantă pozitivă','positive'),('Variantă axată pe problemă','negative'),('Titlu link','link'),('Descriere link','description'),('De ce poate opri scroll-ul','why'),('Beneficiu concret','benefit'),('Întrebarea pentru continuare','loop'),('Destinație propusă','destination'),('De verificat înainte de publicare','verify'),('Textul cerut în imagine','text')]:md+=f"**{label}:** {a[key]}\n\n"
 md+=f"**CTA:** Află mai multe.\n\n**Imagine:** {filename} ({size[0]} × {size[1]} px).\n\n**Prompt ImageGen:**\n\n{a['prompt']}\n\n"
 paragraphs=''.join('<p>'+e(p)+'</p>' for p in a['copy'].split('\n\n'))
 brief=''.join('<p><strong>'+e(label)+':</strong> '+e(a[key])+'</p>' for label,key in [('Ipoteză','angle'),('Stil','style'),('Idee vizuală','interrupt'),('De ce poate opri scroll-ul','why'),('Beneficiu','benefit'),('Întrebarea pentru continuare','loop'),('Destinație propusă','destination'),('De verificat','verify'),('Prompt','prompt')])
 cards.append(f'''<article id="ad-{a['id']}"><div class="eyebrow">CONCEPT {a['id']:02d} · {e(a['style'])}</div><h2>{e(a['headline'])}</h2><div class="layout"><div><a href="{filename}" target="_blank"><img loading="lazy" src="{filename}" alt="{e(a['headline'])}"></a><a class="download" href="{filename}" download>Descarcă imaginea PNG ↗</a></div><div><div class="copy">{paragraphs}</div><div class="link"><b>{e(a['link'])}</b><p>{e(a['description'])}</p><span>Află mai multe</span></div><h3>Alte deschideri pentru testare</h3><p><b>Beneficiu:</b> {e(a['positive'])}</p><p><b>Problemă:</b> {e(a['negative'])}</p></div></div><details><summary>Ideea, beneficiul și ce trebuie verificat</summary>{brief}</details></article>''')
 nav.append(f'<a href="#ad-{a["id"]}">{a["id"]:02d}</a>')
 thumbs.append(f'<a href="#ad-{a["id"]}"><img src="{filename}" alt="Concept {a["id"]}: {e(a["headline"])}"><span>{a["id"]:02d} / {e(a["headline"])}</span></a>')
 assert not any('webform' in a[k].lower() for k in ['headline','copy','link','description','positive','negative'])
md+='## Autocontrol\n\n10 unghiuri distincte, 10 imagini originale, 20 de deschideri alternative. Fiecare postare livrează un test, o formulare sau o metodă înainte de click. Scenariile, conversațiile și comparațiile grafice sunt ilustrative. Nu sunt folosite știri, rezultate, mărturii sau studii de caz fabricate. Curiozitatea rămâne relevantă pentru proprietari de firme de instalații. Promisiunile de continuare sunt condiționate de publicarea ghidurilor propuse. Imaginile au fost generate cu instrumentul ImageGen integrat; prompturile finale sunt incluse.\n'
(root/'10-reclame-complete.md').write_text(md)
style='''*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#f7f5ef;color:#242320;font:16px/1.65 Arial,Helvetica,sans-serif}main{max-width:1240px;margin:auto;padding:50px 24px}.top{max-width:860px}.eyebrow{font-size:11px;letter-spacing:.1em;color:#a74626;font-weight:bold;text-transform:uppercase}h1{font-size:clamp(36px,6vw,66px);line-height:1.03;letter-spacing:-.055em;font-weight:700;margin:24px 0}h1 em{color:#d9532b;font-style:normal}h2{font-size:clamp(25px,3vw,36px);line-height:1.15;letter-spacing:-.03em;margin:12px 0 26px}h3{font-size:17px}.notice{padding:16px 20px;border-left:3px solid #d9532b;background:#eee8dd;font-size:14px}a{color:inherit}.tools{display:flex;gap:20px;flex-wrap:wrap;margin:22px 0}.tools a{font-weight:bold;text-decoration-thickness:1px;text-underline-offset:5px}nav{display:flex;gap:8px;flex-wrap:wrap;margin:32px 0}nav a{border:1px solid #ccc6bb;border-radius:40px;padding:5px 13px;text-decoration:none}nav a:hover{background:#242320;color:#fff}.overview{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:16px;margin-bottom:60px}.overview a{text-decoration:none;font-size:12px;line-height:1.3}.overview img{width:100%;display:block;margin-bottom:8px;border-radius:5px}.overview span{display:block}article{border-top:1px solid #c9c4b8;padding-top:28px;margin:40px 0 70px;scroll-margin-top:25px}.layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:44px}.layout img{display:block;width:100%;height:auto;border-radius:6px}.copy p{margin:0 0 15px}.copy p:first-child{font-size:20px;font-weight:700;line-height:1.4}.link{background:#242320;color:#f7f5ef;padding:20px;margin-top:24px;border-radius:6px}.link p{margin:5px 0 12px;color:#d0cec6}.link span{font-size:13px;display:inline-block;border:1px solid #8c8980;border-radius:4px;padding:4px 10px}.download{display:inline-block;margin-top:12px;font-size:14px}details{border-top:1px solid #d4cec3;padding-top:16px;margin-top:30px;overflow-wrap:anywhere}summary{cursor:pointer;font-weight:bold}details p{max-width:95ch;font-size:14px}.foot{font-size:13px;color:#6a665e}@media(max-width:800px){.overview{grid-template-columns:repeat(2,minmax(0,1fr))}.layout{grid-template-columns:1fr;gap:25px}main{padding:28px 16px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}'''
page='<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>10 reclame — Concepte grafice, ediția 2</title><style>'+style+'</style></head><body><main><header class="top"><div class="eyebrow">10 CONCEPTE / EDIȚIA 2 / SITE-URI PENTRU INSTALATORI</div><h1>O întrebare care oprește.<br><em>Un răspuns care ajută.</em></h1><p>Titluri cu mai multă curiozitate. Grafici conceptuale în crem, cărbune și portocaliu. Texte la persoana întâi, cu valoare înainte de click.</p><div class="tools"><a href="10-reclame-complete.md">Texte și briefuri complete ↗</a><a href="concepte.json">Concepte și prompturi ↗</a><a href="../10-meta-ads-playbook-v2.zip">Descarcă pachetul ZIP ↗</a></div><p class="notice"><strong>Destinațiile sunt propuse.</strong> Articolele și ghidurile promise trebuie publicate înainte de lansarea acestor reclame. Imaginile sunt ilustrații generate, nu dovezi ale unor cazuri reale.</p></header><nav>'+''.join(nav)+'</nav><section class="overview" aria-label="Toate cele 10 imagini">'+''.join(thumbs)+'</section>'+''.join(cards)+'<p class="foot">Imagini create cu ImageGen. Fiecare concept testează o ipoteză de atenție, nu garantează performanță.</p></main></body></html>'
(root/'galerie.html').write_text(page)
old=root.parent/'meta-ads-valoare-10'/'galerie.html'
backup=old.with_name('galerie-editia-1.html')
if not backup.exists():shutil.copy2(old,backup)
# Update the already-open gallery while preserving its original version.
import re
updated=re.sub(r'(href|src)="([^"#]+)"',lambda m:m.group(1)+'="'+('../meta-ads-playbook-v2/'+m.group(2) if not m.group(2).startswith('../') else m.group(2))+'"',page)
old.write_text(updated)
archive=root.parent/'10-meta-ads-playbook-v2.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted(root.iterdir()):
  if p.is_file() and p.suffix in ['.png','.html','.md','.json']:z.write(p,root.name+'/'+p.name)
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 assert len([n for n in z.namelist() if n.endswith('.png')])==10
print('10 imagini validate, texte și galerie actualizate, arhivă verificată:',archive)
