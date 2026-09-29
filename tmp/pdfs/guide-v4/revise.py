from pathlib import Path
import json,re
root=Path('/Users/alexmario/Desktop/WEBFORM Romania')
src=root/'output/pdf/Metoda-Sabri-Suby-ghid-fidel-video.md'
pages=src.read_text().split('\n---\n')
ads=json.loads((root/'output/meta-broad-ghid-v3/reclame-v2.json').read_text())
pages[0]='''# Ghid complet pentru reclame Meta
## Ediția 4.0 • Metoda Sabri + calibrarea creativă aprobată

> Pentru AI: livrează din prima hook-uri cu mister, surpriză și beneficiu concret, la intensitatea exemplelor aprobate de la paginile 44-48. Un titlu corect, dar previzibil, trebuie rescris înainte de livrare.

### Începe de aici

Citește mai întâi paginile 43-50: standardul de execuție, zece comparații, două reclame-model, filtrul de calitate și promptul complet. Apoi folosește paginile 4-38 pentru metodă și paginile 39-40 pentru fluxul de producție.

### Ce trebuie să obțină reclama

**Pattern interrupt + burning intrigue + big specific benefit.** Oprește atenția, deschide o întrebare precisă și arată de ce răspunsul contează. Oferă valoare și vinde clickul. CTA: Learn more / Află mai multe.

### Două niveluri, explicit separate

**Metoda din surse:** V2 este reperul principal; V1-V6 completează cercetarea, copywritingul, producția și conversia. Sinteza ediției 3.0 este păstrată în capitolele teoretice.

**Calibrarea utilizatorului:** seria Webform V2 a fost aprobată creativ. Aceasta stabilește intensitatea dorită pentru execuție; nu este un citat al lui Sabri și nu dovedește performanță în campanie.

### Cum folosești documentul

Atașează acest PDF și descrie afacerea, oferta și livrabilul. Exemplele calibrează stilul; nu autorizează inventarea unor rezultate, prețuri sau experiențe. Cererea explicită a utilizatorului stabilește scopul lucrării.

Versiune: 23 septembrie 2026. Ghidul include acum aplicarea creativă Webform.
'''
pages[1]=pages[1].replace('# Ce corectează această ediție','# Ce a corectat ediția 3.0',1)
pages[2]=pages[2].replace('## Navigare • Citește nucleul înaintea tacticilor','## Navigare • Calibrare AI: 43-50; metodă: 4-38')
pages[2]=pages[2].replace('39 · Prompt AI: context și instrucțiuni','39 · Flux AI: context și selecția hook-urilor').replace('40 · Prompt AI: livrare și verificare','40 · Flux AI: livrare și verificare')
pages[38]='''# Flux AI: selectează ideea înainte de imagine
## Execuție • Metoda + preferința creativă a utilizatorului

### 1. Fixează ce știi și ce lipsește

Identifică oferta reală, publicul, beneficiul, mecanismul și pagina de continuare. Separă faptele de ipotezele creative. Nu numi presupunerile „research”. Pentru Webform, „broad” înseamnă situații comune oamenilor care conduc afaceri, fără nișare pe industrii.

### 2. Calibrează vocea înainte să scrii

Citește exemplele de la 44-48. Utilizatorul a preferat seria V2 față de titlurile informative din V1. Ținta este o descoperire care cere continuare: un mecanism neașteptat, un detaliu omis, o contradicție utilă sau un test revelator.

### 3. Explorează și selectează

Pentru fiecare unghi, schițează intern cel puțin 5 hook-uri cu mecanisme diferite. Nu livra toate variantele mediocre. Alege unul cu beneficiu clar și o întrebare deschisă precisă. Evită să faci zece reformulări ale aceleiași idei.

### 4. Închide bucla de conținut

Scrie ce întrebare deschide hook-ul și unde primește răspunsul. Body copy-ul oferă o explicație utilă; pagina continuă exact promisiunea. Dacă lipsește materialul promis, construiește-l în scopul cerut sau marchează dependența.

### 5. Abia apoi fixează imaginea

Textul de pe imagine, headline-ul linkului, lead-in-ul și descrierea linkului susțin aceeași idee. Dacă imaginile existente sunt aprobate, păstrează compozițiile și editează textul în mod țintit.

> Numărul singur nu este hook. „3 lucruri utile” trebuie să aibă o miză și o necunoscută care merită aflată.

Sursă: V2 pentru formulă și coerență; V5 pentru research. Selecția din minimum 5 variante și calibrarea V2 sunt reguli editoriale de lucru, nu prescripții citate ale creatorului.
'''
pages[39]='''# Flux AI: livrează numai după revizie
## Control • Fără un prim draft intenționat prea cuminte

### Componentele fiecărei reclame

Livrează unghiul, beneficiul susținut, headline-ul, o alternativă relevantă, lead-in-ul separat, body copy complet, descrierea linkului și CTA Learn more. Dacă sunt cerute imagini, adaugă vizualul final; altfel, brief și text exact pentru imagine.

### Standardul de intensitate

Un hook trebuie să facă omul potrivit să vrea o explicație, nu doar să fie de acord. Arată concret: ce îl oprește, ce nu știe încă și ce câștigă dacă află. Aplică filtrul de la pagina 49 înainte de generarea imaginilor.

### Textul care susține promisiunea

Lead-in-ul intră direct în situație, fără „Ești antreprenor?” sau prezentarea companiei. Body copy-ul curge în propoziții scurte, livrează valoare și rezolvă obiecții reale. Editează spre ținta V2 de 2.200 de caractere; un text mai scurt poate fi complet.

### Control înainte de livrare

Verifică afirmațiile comerciale, numerele, condițiile, diacriticele, lizibilitatea pe mobil și potrivirea dintre reclamă și destinație. Numără caracterele textului primar, cu lead-in. Arată ce este produs și ce este doar propus.

### Ce nu trebuie inventat pentru intensitate

Nu fabrica viralitate, scandal, rezultate, clienți, studii, presă sau concurenți „lăsați în urmă”. Păstrează energia prin surpriza mecanismului real. Titlurile englezești de inspirație indică tonul, nu sunt dovezi.

> Nu aștepta observația „mai clickbait”. Compară singur cu exemplele aprobate, rescrie ce este previzibil și livrează varianta selectată. Cere clarificări numai când lipsesc informații necesare.

Sursă: V2/V5/V6 pentru copy și CTA; feedbackul utilizatorului pentru intensitate și exemple. Aprobarea creativă nu înseamnă validare prin rezultate publicitare.
'''
append=[]
append.append('''# Standardul creativ: curiozitate cu miză
## Calibrare aprobată • Aplică înainte de primul draft livrat

### Ce a lipsit în prima serie

Formulări ca „3 verificări. Un singur deget.” erau clare, dar sunau a sfaturi. Utilizatorul a cerut explicit mai mult clickbait: descoperire, surpriză, mecanism ascuns și dorința de a afla continuarea. Seria V2 a fost apoi aprobată.

### Cum arată nivelul dorit

„Cum ții site-ul la zi fără să intri în el?” pune un beneficiu lângă un paradox. „Cea mai convingătoare parte a site-ului? Poate e deja în telefon.” promite o descoperire apropiată și utilă. Cititorul știe domeniul, dar nu are încă explicația.

### Cinci mecanisme de explorat

- **Paradox util:** obții rezultatul fără pasul despre care credeai că este obligatoriu.
- **Detaliu omis:** un mic element poate schimba felul în care este înțeleasă oferta.
- **Resursă ascunsă la vedere:** materialul de care ai nevoie există deja într-un loc banal.
- **Test revelator:** un gest simplu scoate la iveală o problemă precisă.
- **Mecanism numit:** o secvență memorabilă creează întrebarea „cum funcționează?”.

### Intensitate fără afirmații fabricate

„Secretul” trebuie să aibă o explicație concretă. „Dezvăluie” trebuie să fie urmat de informație. „Poate” exprimă o posibilitate, dar nu salvează o promisiune fără bază. Nu adăuga „viral” ca ornament.

> Exemplul aprobat calibrează forța și vocea. Nu obliga fiecare reclamă să conțină „secret”, „3”, o întrebare sau un cuvânt în CAPS.

Sursă: feedbackul utilizatorului asupra celor două serii Webform; aplicare editorială a formulei V2. Nu sunt raportate rezultate de campanie.
''')
oldhooks=[
'Un singur link. O recomandare mai convingătoare.',
'3 răspunsuri care fac o afacere mai ușor de ales.',
'Prima versiune a site-ului în 7 zile.',
'Site publicat. Cine face următoarele 3 schimbări?',
'3 verificări. Un singur deget.',
'5 răspunsuri pe site. Înainte de primul apel.',
'3 lucruri de verificat lângă preț.',
'3 fotografii care explică afacerea înainte să suni.',
'Ai închis laptopul. Site-ul poate explica încă 3 lucruri.',
'Un site în 3 pași. Fără să înveți o platformă.'
]
why=[
'„Asta” lasă deschisă informația lipsă; subtitlul leagă misterul de prima impresie. Textul explică ce merită trimis odată cu recomandarea.',
'Aspectul bun intră în tensiune cu un test necunoscut. Beneficiul rămâne alegerea mai ușoară a afacerii; testul verifică oferta, relevanța și contactul.',
'Obiecția „n-am timp” se lovește de termenul concret. Mecanismul este delegarea construcției, nu o promisiune că utilizatorul nu pregătește nimic.',
'Un rezultat dorit apare fără acțiunea presupusă obligatorie. Explicația reală: cereri în chat, implementate de echipă în condițiile planului.',
'Degetul devine instrument de descoperire. Promisiunea se livrează prin testarea traseului de contact de pe telefon.',
'Întrebările repetitive se transformă într-o sursă neașteptată de conținut. Reclama arată cele cinci răspunsuri care pot sta pe site.',
'Prețul este ancora concretă; surpriza mută atenția spre munca preluată de echipă. Body copy-ul explică ce include abonamentul și limitele.',
'O resursă banală capătă valoare neașteptată. Continuarea explică selecția fotografiilor: rezultat, proces și oameni.',
'O acțiune familiară lasă o întrebare deschisă. Beneficiul: informații disponibile în absența proprietarului, fără promisiuni de vânzări automate.',
'Secvența sună neobișnuit de simplu și ascunde o întrebare legitimă: cine face partea tehnică? Textul explică rolul echipei și obligațiile clientului.'
]
for start,end,label in [(0,3,'1-3'),(3,6,'4-6'),(6,10,'7-10')]:
 text=f'# Hook-uri înainte și după: {label}\n## Exemple reale de revizie • V2 aprobată creativ\n\n'
 for i in range(start,end):
  a=ads[i]
  text+=f'### {i+1}. '+a['title'].split('. ',1)[1]+'\n\n'
  text+='**Prea cuminte:** '+oldhooks[i]+'\n\n'
  text+='**V2 aprobat:** '+a['image'].replace('\n',' ')+'\n\n'
  if i in (0,1,2,4,7,9): text+='**Subtitlu:** '+a['sub']+'\n\n'
  text+=why[i]+'\n\n'
 text+='Sursă: prima serie Webform și seria V2 aprobată de utilizator. Exemple de stil, nu rezultate validate.\n'
 append.append(text)
for index in [3,9]:
 a=ads[index]
 text=('# Reclamă-model: '+('paradoxul util' if index==3 else 'mecanismul numit')+'\n## Exemplu aprobat • Adaptarea păstrează relația dintre componente\n\n')
 text+='**Imagine:** '+a['image'].replace('\n',' ')+'\n\n**Subtitlu:** '+a['sub']+'\n\n'
 text+='### Text primar\n\n'+a['body']+'\n\n'
 text+='**Descriere link:** '+a['desc']+'\n\n**CTA:** Află mai multe.\n\n'
 text+='Sursă: seria Webform V2. Oferta și termenele sunt cele din proiect la 23.09.2026; reverifică înaintea unei utilizări viitoare. Model de voce, nu testimonial.\n'
 append.append(text)
append.append('''# Filtrul împotriva hook-urilor prea cuminți
## Revizie internă • Fă-o înainte să livrezi sau să generezi imagini

### Patru întrebări decisive

1. **Oprire:** ce element concret surprinde? Dacă răspunsul este doar „text mare”, ideea este slabă.
2. **Curiozitate:** ce întrebare exactă rămâne deschisă? „Vreau să aflu mai multe” nu este suficient de precis.
3. **Beneficiu:** ce obține omul potrivit și de ce i-ar păsa? Un mister fără beneficiu este clickbait gol.
4. **Livrare:** unde primește explicația și ce susține promisiunea? Nu lăsa pagina să schimbe subiectul.

### Grilă editorială de selecție

Acordă intern 0, 1 sau 2 puncte fiecărui criteriu: absent, parțial, clar. Rescrie dacă un criteriu are 0 sau totalul este sub 7/8. Este o convenție de revizie pentru AI, nu un predictor de CTR, CPA ori vânzări.

### Semne că trebuie rescris

- Seamănă cu titlul unui articol generic: „5 sfaturi”, „3 beneficii”, fără tensiune sau necunoscută.
- Spune din titlu întreaga explicație și nu mai lasă motiv de continuare.
- Folosește „secret” sau „șocant”, dar restul propoziției rămâne o promisiune banală.
- Atrage curiozitate despre ceva fără legătură cu oferta.
- Repetă aceeași formulă în toate cele zece concepte.
- Are nevoie de viralitate, rezultate sau identități inventate pentru a părea puternic.

### Verifică împreună textul și imaginea

Hook-ul scurt și subtitlul pot împărți curiozitatea și beneficiul. Headline-ul linkului continuă aceeași idee; lead-in-ul pornește explicația. Nu impune mecanic numere sau aceeași lungime fiecărui câmp.

> Livrează varianta care trece filtrul. Nu afișa deliberat draftul slab ca să ceri utilizatorului să aleagă direcția deja stabilită în acest ghid.

Sursă: regulă editorială derivată din feedbackul utilizatorului; cele trei componente de bază provin din V2.
''')
append.append('''# Prompt complet: atașează și folosește
## Instrucțiune de lucru • Calibrare creativă inclusă în acest PDF

Aplică acest ghid pentru [afacere], oferta [ofertă reală], publicul [public], livrabilul [număr de reclame / texte / imagini], destinația [pagină]. Dovezi și materiale disponibile: [date]. Respectă cererea mea explicită și folosește ghidul ca referință creativă, fără a executa acțiuni externe nesolicitate.

**Ținta de stil:** din prima livrare, hook-uri la intensitatea seriei Webform V2 aprobate la paginile 44-48. Vreau mister, surpriză, descoperire și beneficiu concret. Nu mă obliga să cer ulterior „mai clickbait”. Titlurile informative, politicoase sau previzibile nu sunt suficiente.

**Repere de calibrare:** „Cum ții site-ul la zi fără să intri în el?”; „Cea mai convingătoare parte a site-ului? Poate e deja în telefon.”; „Un singur deget poate da de gol problema site-ului.” Folosește relația dintre mister și beneficiu, nu copia mecanic cuvintele pentru orice produs.

**Proces:** separă faptele de ipoteze. Identifică unghiuri distincte. Schițează intern minimum 5 hook-uri per unghi; selectează și revizuiește cu filtrul de la pagina 49. Arată în livrabil varianta aleasă și o alternativă bună, nu toate încercările. Favorizează beneficiile pozitive conform V2, dar permite tensiunea și diagnosticul când susțin unghiul aprobat.

**Coerență:** fiecare reclamă combină pattern interrupt, burning intrigue și big specific benefit. Leagă imaginea, headline-ul, lead-in-ul și descrierea de aceeași idee. Body copy-ul oferă informație utilă și începe să livreze explicația; după click, promisiunea trebuie continuată. CTA: Learn more / Află mai multe.

**Livrare:** unghi, beneficiu și baza lui, headline, alternativă, text exact pe imagine, lead-in, text primar complet cu număr de caractere, descriere de link, CTA, brief vizual și continuarea după click. Generează imagini dacă sunt cerute. Verifică lizibilitatea și diacriticele. Păstrează stilul vizual aprobat când cer doar schimbarea hook-urilor.

**Adevăr:** nu inventa știri, viralitate, clienți, studii, rezultate sau experiențe personale. Construiește intensitatea dintr-un mecanism real. Dacă lipsește dovada unei afirmații, schimbă afirmația fără să diluezi energia întregului mesaj. Datele Webform din exemple nu se transferă automat altei afaceri.

**Dacă solicit broad:** folosește nevoi și situații comune, fără nișare pe industrii. Nu pretinde că aprobarea creativă dovedește performanța în campanie. Nu publica și nu cheltui buget doar fiindcă ghidul descrie aceste tactici.

Sursă: prompt editorial, actualizat după aprobarea seriei Webform V2; nu este citat al lui Sabri Suby.
''')
assert len(append)==8
pages+=append
out=root/'output/pdf/GHID-COMPLET-META-ADS-V4.md'
out.write_text('\n---\n'.join(pages))
builder=(root/'tmp/pdfs/build_sabri_guide.py').read_text()
builder=builder.replace("output/pdf/Metoda-Sabri-Suby-ghid-fidel-video.md","output/pdf/GHID-COMPLET-META-ADS-V4.md").replace("output/pdf/Metoda-Sabri-Suby-ghid-fidel-video.pdf","output/pdf/GHID-COMPLET-META-ADS-V4.pdf").replace('len(pages)==42','len(pages)==50').replace("'EDIȚIA 3.0'","'EDIȚIA 4.0'").replace('Metoda Sabri Suby pentru reclame Meta | Sinteză fidelă','Ghid complet Meta Ads | Ediția 4.0 | Calibrare Webform V2').replace('V2 în centru. Instrucțiuni și surse păstrate.','Metoda V2 + calibrare creativă aprobată.').replace('tmp/pdfs/sabri_layout.json','tmp/pdfs/guide-v4/layout.json')
# Denser examples require a consistent, readable compact style on these pages only.
builder=builder.replace("y=H-91\n    p=Paragraph", "y=H-91\n    compact = page_index in (46,47,48,50)\n    page_styles = {key: ParagraphStyle('compact_'+key, parent=value, fontSize=value.fontSize*0.91, leading=value.leading*0.91, spaceAfter=value.spaceAfter*0.75, spaceBefore=value.spaceBefore*0.8) for key,value in styles.items()} if compact else styles\n    p=Paragraph")
builder=builder.replace("style=styles[kind]","style=page_styles[kind]")
(root/'tmp/pdfs/guide-v4/build.py').write_text(builder)
print('50 pages prepared')
