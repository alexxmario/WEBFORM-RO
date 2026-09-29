from pathlib import Path
import json,re
root=Path('/Users/alexmario/Desktop/WEBFORM Romania')
old=(root/'output/pdf/Metoda-Sabri-Suby-ghid-fidel-video.md').read_text().split('\n---\n')
ads=json.loads((root/'output/meta-broad-ghid-v3/reclame-v2.json').read_text())
front=[]
front.append('''# Scrie la nivelul exemplelor aprobate
## Ghid Meta Ads V5 • Instrucțiunea de execuție începe aici

**Când utilizatorul cere reclame pe baza acestui ghid, produce headline-uri cu aceeași voce și construcție ca modelele de la paginile 2-3.** Nu porni de la un rezumat generic al teoriei. Aceste pagini definesc preferința creativă; capitolele de referință explică metoda.

### Acesta este nivelul de pornire

„De la «n-am timp de site» la prima versiune în 7 zile. Secretul e în ce NU faci tu.”

„Webform dezvăluie cum poți ține site-ul la zi fără să intri vreodată în panoul lui de administrare.”

„Telefonul tău poate ascunde cea mai convingătoare parte a viitorului site. Știi unde să te uiți?”

### Ce înseamnă «headline» în această cerere

Un hook principal complet: subiect comercial recognoscibil, rezultat dorit și un gol de informație care cere continuare. Poate avea două propoziții. Nu îl transforma într-un slogan de 3-5 cuvinte doar pentru că va exista și o imagine.

### Lucrează prin adaptarea unui model

Alege reperul apropiat din paginile 2-3. Păstrează mișcarea lui: obiecție → rezultat neașteptat; beneficiu → pas eliminat; obiect banal → resursă ascunsă. Schimbă situația și detaliile reale, apoi verifică dacă ai păstrat tocmai partea care creează curiozitate.

### Cum citești restul

**2-3:** zece headline-uri complete aprobate. **4-8:** structură, adaptare și selecție. **9-10:** reclame complete și imagini. **11:** oferta din exemple. **12:** navigare și instrucțiune de pornire. **13-49:** metoda și sursele, ca referință.

> Nu trebuie să fie mai prudent, mai corporativ sau mai scurt decât exemplele. Trebuie să fie la fel de curios și să susțină ceea ce promite.

Sursă: preferință creativă explicită a utilizatorului, seria Webform V2 aprobată. Nu este dovadă de performanță publicitară și nu este citat al lui Sabri.
''')
for start,end in [(0,5),(5,10)]:
 s=f'# Headline-uri aprobate: {start+1}-{end}\n## Corpus pozitiv • Acestea sunt repere, nu teme de rezumat\n\n'
 for i in range(start,end):
  a=ads[i]
  s+=f'### {i+1}. '+['Recomandare','Test revelator','Obiecție și rezultat','Beneficiu fără pasul așteptat','Diagnostic surprinzător','Resursă ascunsă','Preț și răsturnare','Descoperire apropiată','Situație neterminată','Mecanism numit'][i]+'\n\n'
  s+=a['hook']+'\n\n'
 s+='> Păstrează construcția și energia reperului ales. Nu reduce toate modelele la „Cum să...” sau „3 beneficii...”.\n\nSursă: headline-urile integrale din seria Webform V2 aprobată de utilizator. Oferta este contextuală; verifică datele înainte de reutilizare.\n'
 front.append(s)
front.append('''# Nu confunda cele patru texte
## O singură idee • Patru funcții diferite

### 1. Hook principal complet

„Webform dezvăluie cum poți ține site-ul la zi fără să intri vreodată în panoul lui de administrare.”

Acesta fixează ideea. Include rezultatul și contradicția. Rămâne reperul chiar dacă versiunea de pe imagine este mai scurtă.

### 2. Textul de pe imagine

„Cum ții site-ul la zi fără să intri în el?”

**Subtitlu:** „Webform dezvăluie ce se întâmplă după un simplu mesaj.”

Imaginea și subtitlul formează împreună hook-ul vizual. Nu elimina subtitlul dacă el poartă beneficiul sau curiozitatea. Nu schimba subiectul ca să încapă.

### 3. Lead-in-ul textului primar

„Schimbi programul pe site. Dar nu deschizi site-ul. Nici măcar nu cauți parola.”

Intră în situație și face omul să continue. Nu repetă doar headline-ul și nu începe cu prezentarea companiei.

### 4. Headline-ul linkului și descrierea

Poți păstra hook-ul complet când se potrivește câmpului folosit. Dacă trebuie scurtat, păstrează contrastul central. Descrierea aprobată: „Totul începe cu un mesaj. Vezi ce urmează.”

### Cazul care se strică ușor la scurtare

„Explici. Aprobi. Te relaxezi.” este incomplet singur. Cu „Cum ai un site profesionist fără să înveți să-l construiești” devine un mecanism legat de un rezultat. Livrează perechea, nu doar formula scurtă.

> Nu impune o limită universală de cuvinte headline-ului de concept. Optimizează separat pentru spațiul real, după ce ideea este puternică.

Sursă: anatomia reclamei din V2 și componentele seriei aprobate; delimitarea câmpurilor este instrucțiune editorială pentru producție.
''')
front.append('''# Adaptează structura, nu doar subiectul
## Operație concretă • Păstrează partea care trage spre click

### Model A: obiecție → rezultat → piesă lipsă

**Reper:** „De la «n-am timp de site» la prima versiune în 7 zile. Secretul e în ce NU faci tu.”

Păstrează obiecția recognoscibilă, rezultatul precis și informația amânată. În exemplu, piesa lipsă este delegarea construcției. Numărul de zile se folosește numai dacă oferta îl susține.

**Adaptare demonstrativă:** „«Nu mă pricep la site-uri.» Atunci cum ajungi să ai unul făcut pentru afacerea ta? Partea tehnică nu cade unde crezi.”

### Model B: beneficiu → pas presupus obligatoriu eliminat

**Reper:** „Cum ții site-ul la zi fără să intri în el?”

Păstrează rezultatul și paradoxul. „Actualizări incluse” explică serviciul, dar pierde surpriza. Răspunsul trebuie să existe: echipa implementează cererile din chat.

**Adaptare demonstrativă:** „Poți schimba informațiile de pe site fără să cauți parola platformei. Webform arată cum.”

### Model C: obiect banal → valoare comercială ascunsă

**Reper:** „Telefonul tău poate ascunde cea mai convingătoare parte a viitorului site. Știi unde să te uiți?”

Păstrează obiectul apropiat, valoarea neașteptată și locul încă nedezvăluit. Continuarea arată materialele reale de folosit.

**Adaptare demonstrativă:** „O parte din viitorul site poate fi deja scrisă. Caut-o în locul în care răspunzi zilnic clienților.”

> Adaptările de pe această pagină sunt exerciții editoriale noi. Reperele aprobate sunt cele de la paginile 2-3; nu declara automat că fiecare variație este aprobată sau câștigătoare.

Sursă: structuri extrase din seria aprobată, în spiritul V3/V5 privind păstrarea vocii și a mecanismului.
''')
front.append('''# Trei feluri de a strica un hook bun
## Contrast de calibrare • Respinge simplificarea care elimină intriga

### 1. Îl traduci într-o caracteristică

**Se pierde:** „Site administrat, fără bătăi de cap.”

**Se păstrează:** „Cum ții site-ul la zi fără să intri în el?”

Prima variantă numește serviciul. A doua creează contradicția care cere mecanismul. Când scurtezi, elimină cuvintele de legătură înainte să elimini contrastul.

### 2. Pui un număr în locul unei idei

**Se pierde:** „3 fotografii pentru un site mai bun.”

**Se păstrează:** „Telefonul tău poate ascunde cea mai convingătoare parte a viitorului site. Știi unde să te uiți?”

Numărul organizează conținutul, dar nu înlocuiește descoperirea. Cele trei tipuri de fotografii pot rămâne în subtitlu și în continuare.

### 3. Dezvălui tot mecanismul în headline

**Se pierde:** „Trimite informațiile, iar echipa îți construiește site-ul.”

**Se păstrează:** „De la «n-am timp de site» la prima versiune în 7 zile. Secretul e în ce NU faci tu.”

Explicația completă își are locul în text. Headline-ul face clar rezultatul și lasă deschisă întrebarea potrivită. Condițiile importante rămân vizibile lângă promisiune.

### Nici adjectivele nu rezolvă problema

„Secretul uimitor al unui site profesionist” nu are un mecanism distinct doar fiindcă sună intens. „Fără să intri în el” are o contradicție concretă. Caută schimbarea de așteptare, nu o colecție de adjective.

> Dacă o rescriere este mai elegantă, dar mai previzibilă decât reperul, revino la structura reperului.

Sursă: comparație editorială. Exemplele slabe sunt variante de contrast create pentru calibrare, nu rezultate primite din chatul nou.
''')
front.append('''# Vocea: mai aproape de o dezvăluire
## Ton • Direct, curios, viu, în română firească

### Ce transmite preferința utilizatorului

Exemplele oferite în engleză au folosit dezvăluire, „secret weapon”, un sistem numit și transformare. Transferă această energie în română. Nu le traduce într-o prezentare sobră de servicii și nu le copia afirmațiile despre viralitate ca fapte.

### Folosește o voce care promite continuare

„Webform dezvăluie...”, „Secretul e în...”, „Partea surprinzătoare?”, „Poate e deja...”, „fără să...”, „ce se întâmplă după...” sunt disponibile când au o explicație reală. Nu este obligatoriu să le folosești și nu le înșira în fiecare reclamă.

### Preferințe care nu trebuie aplicate mecanic

- Hook-ul poate avea una sau două propoziții; claritatea nu cere automat scurtare.
- Poți folosi întrebări, afirmații, replici și mecanisme numite. Nu transforma întregul set în întrebări.
- Beneficiile pozitive sunt punctul de pornire; un diagnostic intrigant poate funcționa în stilul aprobat.
- Numerele sunt utile când fac promisiunea concretă. Nu adăuga o listă doar pentru a avea o cifră.
- Broad înseamnă fără nișare pe industrie; nu înseamnă mesaje vagi, bune pentru orice produs.

### Adevărul este o condiție, nu un ton de voce

Îndepărtează afirmația nesusținută, nu energia. Înlocuiește „afaceri care devin virale” cu un mecanism verificabil, precum administrarea prin chat. Păstrează surpriza, rezultatul dorit și ritmul conversațional.

### Cum citești teoria din a doua parte

V1-V6 sunt videoclipurile-sursă. „Seria aprobată” este colecția Webform V2, nu videoclipul V2. Capitolele teoretice păstrează formulările creatorului; paginile 1-12 stabilesc aplicarea creativă cerută aici.

Sursă: feedbackul explicit al utilizatorului; interpretare editorială separată de prescripțiile din videoclipuri.
''')
front.append('''# Selectează prin comparație, nu prin note
## Proces • Un reper concret pentru fiecare headline

### 1. Fixează datele și ideea

Scrie rezultatul dorit, situația recognoscibilă, mecanismul real și ce poate fi arătat după click. Folosește oferta disponibilă. Nu inventa cercetare sau rezultate ca să ai material de copy.

### 2. Alege un reper din paginile 2-3

Identifică fraza care produce schimbarea de așteptare: „fără să intri”, „în ce NU faci tu”, „ascunde... în telefon”. Această funcție trebuie să existe și în noul headline.

### 3. Explorează trei construcții

Scrie intern o adaptare apropiată de reper, una cu altă situație recognoscibilă și una cu alt mecanism de curiozitate. Selectează după potrivirea cu oferta și cu vocea aprobată. Nu cere utilizatorului să repete preferința de ton deja cunoscută.

### 4. Fă verificări care pot eșua

- Poți sublinia în text expresia care surprinde? Dacă nu, rescrie.
- Poți numi întrebarea exactă rămasă deschisă? Dacă nu, rescrie.
- Hook-ul complet sau perechea vizuală spune ce câștigă omul? Dacă nu, adaugă beneficiul.
- Există în body și în continuare răspunsul promis? Dacă nu, schimbă promisiunea sau livrează conținutul lipsă.
- Ai eliminat mecanismul la scurtare? Dacă da, refă varianta scurtă.

### 5. Livrează setul final

Pentru reclame complete: hook principal, text pe imagine + subtitlu, lead-in, body, descriere de link, CTA Află mai multe și direcție vizuală. Pentru o cerere doar de headline-uri: livrează doar headline-urile. Scopul cerut are prioritate față de formatul implicit.

> Nu prezenta autoevaluări precum „curiozitate 9/10” drept validare. Verifică expresiile și continuitatea. Performanța se află prin testare reală, separat de aprobarea creativă.

Sursă: flux editorial revizuit. Cele trei variante sunt un ajutor de selecție, nu o promisiune de calitate sau o regulă atribuită creatorului.
''')
for index in [3,9]:
 a=ads[index]
 s='# Model complet: '+('beneficiul paradoxal' if index==3 else 'sistemul numit')+'\n## Reclamă aprobată • Imaginea și textul spun aceeași poveste\n\n'
 s+='**Hook principal:** '+a['hook']+'\n\n'
 s+='**Imagine:** '+a['image'].replace('\n',' ')+'\n\n**Subtitlu:** '+a['sub']+'\n\n'
 s+='### Text primar\n\n'+a['body']+'\n\n'
 s+='**Descriere:** '+a['desc']+'\n\n**CTA:** Află mai multe.\n\nSursă: seria Webform V2 aprobată creativ. Date comerciale de la 23.09.2026, de reverificat.\n'
 front.append(s)
front.append('''# Datele Webform din exemple
## Context • Nu cere AI-ului să deducă oferta dintr-un slogan

### Oferta folosită în seria aprobată

La 23 septembrie 2026, proiectul local descria un serviciu în care Webform construiește, găzduiește și administrează site-ul. Clientul trimite informațiile și materialele; colaborarea continuă în chat, în română.

- Start: 180 lei/lună, până la 3 pagini; design pentru mobil, domeniu, găzduire, SSL, administrare și formular de contact.
- Prima versiune: în 7 zile de la primirea formularului complet și a materialelor necesare. Nu echivalează cu lansare necondiționată în 7 zile.
- Actualizări Start: în 7 zile, o cerere activă. Business: în 3 zile, două cereri active. Lucrările mai ample se discută separat.
- Găzduirea și administrarea sunt disponibile pe durata abonamentului.
- Formularul și plata confirmată deschid proiectul; nu se promite automat un preview gratuit înainte de plată.

### Ce poate susține headline-ul

Delegarea construcției; actualizări cerute în chat; o prezentare ușor de transmis; informații disponibile după program; folosirea materialelor existente; verificarea traseului de contact pe telefon.

### Ce nu este demonstrat de aceste date

Mai mulți clienți într-un număr garantat, creșteri de venit, viralitate, primul loc în Google, rezultate ale concurenților sau economie de timp cuantificată. Nu transforma aceste rezultate în premisa headline-ului.

### Când folosești ghidul mai târziu

Aceste date sunt context istoric, nu o ofertă live verificată. Folosește informațiile actuale furnizate de utilizator sau din sursa disponibilă. Dacă nu poți confirma prețul ori termenul, alege un unghi care nu depinde de ele.

> Pentru altă afacere, înlocuiește fișa de ofertă. Păstrează mecanismele și vocea exemplelor, fără să transferi automat prețul, termenul sau modelul de abonament.

Sursă: homepage, FAQ și catalogul proiectului Webform consultate pentru seria inițială.
''')
front.append('''# Cum pornești un chat nou
## Instrucțiune scurtă • Restul documentului este referință

### Mesaj de folosit împreună cu documentul

Aplică ghidul atașat pentru [afacere]. Vreau [număr și livrabil], pentru [public], pe baza acestei oferte: [date actuale]. Folosește headline-urile complete de la paginile 2-3 ca repere de voce și structură. Adaptează prin contrastul și golul de informație din fiecare model, nu prin rezumarea beneficiului. Păstrează nivelul de clickbait aprobat. Livrează în română. Dacă cer broad, nu nișa pe industrii.

### Dacă cererea utilizatorului este scurtă

„Fă 10 reclame pentru Webform după ghid” activează deja standardul de la paginile 1-8. Nu cere separat dacă vrea „mai curajos” sau „mai clickbait”. Folosește contextul de ofertă disponibil și cere doar informația necesară care lipsește.

### Ordinea de lucru

Citește modelele pozitive. Alege unghiurile. Adaptează reperele. Verifică dacă intriga a supraviețuit. Scrie restul reclamei. Generează imaginile dacă sunt cerute. Fă revizia finală înainte de livrare.

### Unde găsești teoria

- 13-23: nucleul V2, headline-uri, lead-in, descriere, body și formate.
- 24-34: cercetare, producție, testare și continuitate după click.
- 35-39: awareness, sistemul de vânzare și fascinations.
- 40-47: încredere, advertoriale, scalare, diferențe între surse și exemplul USB.
- 48-49: indexul celor șase videoclipuri și glosarul.

### Ce s-a schimbat față de V4

Exemplele complete sunt acum la început, cele vechi și cele noi nu mai au aceeași greutate, hook-ul principal este separat de textul scurt pe imagine, iar selecția se face prin comparație cu reperele. Prompturile vechi au fost înlocuite, nu adăugate încă o dată la final.

Sursă: instrucțiune editorială. Ghidul poate îmbunătăți consecvența; nu garantează același rezultat la orice model. Nu autorizează publicare, contactarea altor persoane sau cheltuieli nesolicitate.
''')
front[7] = front[7].replace('Hook-ul complet sau perechea vizuală spune ce câștigă omul? Dacă nu, adaugă beneficiul.', 'Hook-ul complet sau perechea vizuală spune ce câștigă omul? Arată cuvintele care promit acel rezultat. Nu accepta un beneficiu existent doar în explicația unghiului.')
front[7] = front[7].replace('### 5. Livrează setul final', '### Poanta nu este suficientă\n\nDacă headline-ul se termină cu o replică isteață, verifică dacă a deschis și o promisiune. Cazurile respinse la pagina 9 arată această eroare. Păstrează observația bună, apoi completeaz-o cu beneficiul și motivul de continuare.\n\n### 5. Livrează setul final')
extra=(root/'tmp/pdfs/guide-v5/photographer-pages.txt').read_text().split('\n---\n')
front=front[:8]+extra+front[8:]
assert len(front)==14
front[0]=front[0].replace('4-8:', '4-10:').replace('9-10:', '11-12:').replace('**11:**', '**13:**').replace('**12:**', '**14:**').replace('**13-49:**','**15-51:**')
front[6]=front[6].replace('paginile 1-12','paginile 1-14')
front[13]=front[13].replace('paginile 1-8','paginile 1-10').replace('13-23:', '15-25:').replace('24-34:', '26-36:').replace('35-39:', '37-41:').replace('40-47:', '42-49:').replace('48-49:', '50-51:')
front[13]=front[13].replace('iar selecția se face prin comparație cu reperele.', 'iar selecția se face prin comparație cu reperele. Cele trei eșecuri reale pentru fotograf au acum un diagnostic și rescrieri demonstrative; simpla replică isteață nu mai trece filtrul.')
# Theory 4-38 becomes 13-47. Source index becomes 48-49.
theory=old[3:38]
for i,s in enumerate(theory):
 s=re.sub(r'(pagina )36\b',r'\g<1>47',s)
 theory[i]=s
idx=old[40:42]
# Update page references only in locator phrases, never reported experimental numbers.
for i,s in enumerate(idx):
 s=s.replace('În ghid: nucleul de la paginile 4-14, exemplul de la 38 și promptul de la 39-40.','În această ediție: nucleul la paginile 15-25, exemplul la 49; instrucțiunile de execuție la 1-14.')
 def convert(m):
  return re.sub(r'\d+',lambda q:str(int(q[0])+11) if int(q[0])<=38 else '1-14',m[0])
 # Replace previous ranges containing old prompt pages with explicit theory end + execution front.
 s=s.replace('36-40.','36-38; aplicarea editorială la începutul acestei ediții.').replace('35-40.','35-38; aplicarea editorială la începutul acestei ediții.')
 s=re.sub(r'În ghid: paginile [0-9, și-]+\.',convert,s)
 idx[i]=s
pages=front+theory+idx
assert len(pages)==51
(root/'output/pdf/GHID-COMPLET-META-ADS-V5.md').write_text('\n---\n'.join(pages))
(root/'output/pdf/START-AI-META-ADS-V5.md').write_text('\n---\n'.join(front[:10]+[front[12],front[13]]))
# Reuse typography and renderer, with simpler uniform navigation and early examples.
b=(root/'tmp/pdfs/guide-v4/build.py').read_text()
b=b.replace('GHID-COMPLET-META-ADS-V4','GHID-COMPLET-META-ADS-V5').replace('len(pages)==50','len(pages)==51').replace('EDIȚIA 4.0','EDIȚIA 5.0').replace('Ediția 4.0','Ediția 5.0').replace('tmp/pdfs/guide-v4/layout.json','tmp/pdfs/guide-v5/layout.json')
b=b.replace('compact = page_index in (46,47,48,50)','compact = page_index in (11,12)')
start=b.index('    if page_index==3:')
end=b.index('    for kind,txt in content:',start)
b=b[:start]+b[end:]
start=b.index('        if page_index==3 and kind==')
end=b.index('        y-=h+extra',start)
b=b[:start]+b[end:]
b=b.replace('if page_index in (47,48):','if page_index in (11,12):').replace("if page_index == 47 else", "if page_index == 11 else")
b=b.replace('M,68,width=168,height=210','M,64,width=144,height=180').replace('278-hh','244-hh')
b=b.replace("note = '<b>Reper vizual aprobat</b><br/><br/>Fotografie cu aspect firesc, obiecte recognoscibile, hook lizibil și un subtitlu care susține beneficiul. Imaginea deschide aceeași întrebare ca textul.<br/><br/>Transferă mecanismul și naturalețea. Nu copia obligatoriu biroul, cana sau bilețelele în fiecare reclamă.<br/><br/>Scenă ilustrativă generată AI; nu este dovadă de client.'", "note = '<b>Reper vizual aprobat</b><br/><br/>Hook-ul și subtitlul se citesc împreună. Păstrează ideea când comprimi textul.<br/><br/>Transferă naturalețea fotografiei, nu obligatoriu aceleași obiecte.<br/><br/>Scenă ilustrativă generată AI.'")
b=b.replace("c.drawString(M,32,'Metoda V2 + calibrare creativă aprobată.')","c.drawString(M,32,'Repere aprobate la început. Metoda în partea de referință.')")
(root/'tmp/pdfs/guide-v5/build.py').write_text(b)
print('V5: 51 pages. Operational section first, theory preserved, old prompts removed.')
