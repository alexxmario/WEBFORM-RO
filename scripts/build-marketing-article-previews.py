"""Refresh local article previews and the selected campaign's destination URLs."""
import html
import json
import re
import shutil
import zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]
folder = root / 'output/meta-selectate-publicare'
data = json.loads((root / 'lib/marketing-articles.json').read_text())
articles = data['articles']
base = 'https://ro.joinwebform.com'
css = (root / 'app/articole/article.module.css').read_text()
css = re.sub(r':global\(([^)]+)\)', r'\1', css)
out = folder / 'articole'
out.mkdir(exist_ok=True)
e = html.escape
links = []
for article in articles:
    url = f"{base}/articole/{article['slug']}"
    image = article['image']
    image_name = Path(image['src']).name
    (out / 'images').mkdir(exist_ok=True)
    shutil.copyfile(root / 'public' / image['src'].lstrip('/'), out / 'images' / image_name)
    picture = f'<figure class="figure"><img src="images/{e(image_name)}" width="{image["width"]}" height="{image["height"]}" alt="{e(image["alt"])}"></figure>'
    body = f'<p>{e(article["paragraphs"][0])}</p>' + picture + ''.join(f'<h2>{e(p[4:])}</h2>' if p.startswith('### ') else f'<p>{e(p)}</p>' for p in article['paragraphs'][1:])
    offer = ''.join(f"<section><h2>{e(s['title'])}</h2>" + ''.join(f'<p>{e(p)}</p>' for p in s['paragraphs']) + '</section>' for s in data['offer'])
    page = f'''<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(article['title'])}</title><style>*{{box-sizing:border-box}}body{{margin:0}}{css}</style></head><body class="page"><header class="header"><a class="brand" href="../galerie.html"><em>web</em>form.</a><span>PREVIZUALIZARE · RECLAMA {article['ad']}</span></header><main class="main" id="main"><article><div class="eyebrow">GHID WEBFORM</div><h1>{e(article['title'])}</h1><p class="meta">De echipa WebForm</p><div class="body">{body}</div><section class="offer"><div class="eyebrow">CUM TE AJUTĂ WEBFORM</div>{offer}<div class="form"><p>Formularul funcțional este integrat în pagina site-ului.</p><p>Nume · Telefon · Tipul afacerii · Acord de contact</p><a class="button" href="http://localhost:3000/articole/{article['slug']}#formular">Testează formularul local →</a><p class="campaign-small">Aceasta este o previzualizare locală. Linkul public devine disponibil după publicarea site-ului.</p></div></section></article></main><footer class="footer"><a href="../galerie.html">← Înapoi la reclame</a></footer></body></html>'''
    (out / f"{article['slug']}.html").write_text(page)
    links.append(dict(reclama=article['ad'], articol=article['title'], url=url, preview=f"articole/{article['slug']}.html"))
    md = '# ' + article['title'] + '\n\n' + '\n\n'.join(article['paragraphs']) + '\n\n' + '\n\n'.join('## '+s['title']+'\n\n'+'\n\n'.join(s['paragraphs']) for s in data['offer'])
    (out / f"{article['slug']}.md").write_text(md+'\n')
(folder/'linkuri-articole.json').write_text(json.dumps(links,ensure_ascii=False,indent=2)+'\n')
(folder/'linkuri-articole.md').write_text('# Destinații pentru cele 11 reclame\n\nLinkurile publice devin disponibile după publicarea modificărilor site-ului.\n\n| Reclamă | URL articol |\n| --- | --- |\n'+''.join(f"| {l['reclama']} | {l['url']} |\n" for l in links))
texts = json.loads((folder/'texte-publicare.json').read_text())
for ad in texts:
    ad['URL'] = next(l['url'] for l in links if l['reclama']==ad['number'])
(folder/'texte-publicare.json').write_text(json.dumps(texts,ensure_ascii=False,indent=2)+'\n')
md = '# Webform — selecție pentru publicare\n\nCTA: Află mai multe. Fiecare reclamă are propriul articol.\n\nLinkurile publice necesită publicarea site-ului.\n'
for ad in texts:
    md += f"\n## Reclama {ad['number']}\n\n**URL:** {ad['URL']}\n"
    for field in ['Primary text','Headline','Description']:
        md += f"\n**{field}**\n\n{ad[field]}\n"
    md += f"\n[Imagine]({ad['image']})\n"
(folder/'texte-publicare.md').write_text(md)
gallery = (folder/'galerie.html').read_text()
for link in links:
    pattern = rf'(<article id="r{link["reclama"]}">)(.*?)(</article>)'
    def update(m):
        content = re.sub(r'<p class="meta">CTA:.*?</p>', f'<p class="meta">CTA: Află mai multe<br>URL articol: <a href="{link["url"]}" target="_blank">{link["url"]}</a><br><a href="{link["preview"]}" target="_blank">Citește articolul — previzualizare locală ↗</a></p>', m[2], flags=re.S)
        return m[1]+content+m[3]
    gallery = re.sub(pattern,update,gallery,flags=re.S)
if 'linkuri-articole.md' not in gallery:
    gallery = gallery.replace('<nav>', '<p class="meta">Fiecare reclamă are un articol dedicat, cu formular de interes la final. <strong>Linkurile publice necesită publicarea modificărilor site-ului.</strong> <a href="linkuri-articole.md">Lista de linkuri ↗</a></p><nav>',1)
(folder/'galerie.html').write_text(gallery)
zip_path = folder/'webform-11-reclame-publicare.zip'
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED) as z:
    for path in sorted(folder.rglob('*')):
        if path.is_file() and path != zip_path:
            z.write(path,path.relative_to(folder))
print(f'{len(articles)} previews, destination mappings and publication package refreshed.')
