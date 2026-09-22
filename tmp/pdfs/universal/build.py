from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.enums import TA_LEFT
import json
OUT=Path('output/pdf/Ghid-universal-reclame-care-starnesc-curiozitatea.pdf')
pdfmetrics.registerFont(TTFont('Arial','/System/Library/Fonts/Supplemental/Arial.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Bold','/System/Library/Fonts/Supplemental/Arial Bold.ttf'))
pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='Arial-Bold',italic='Arial',boldItalic='Arial-Bold')
W,H=595.276,841.89
INK=HexColor('#172E36'); ACC=HexColor('#187668'); MUT=HexColor('#52666A'); PAPER=HexColor('#FAFAF6'); PALE=HexColor('#EAF2ED'); LINE=HexColor('#CDD9D3')
c=canvas.Canvas(str(OUT),pagesize=(W,H))
c.setTitle('Ghid universal pentru reclame care stârnesc curiozitatea')
c.setAuthor('Ghid de creație publicitară')
c.setSubject('Hook-uri, povești, beneficii, imagini în imagine și prompt reutilizabil pentru AI')
styles={
 'body':ParagraphStyle('body',fontName='Arial',fontSize=11,leading=16,textColor=INK,spaceAfter=9),
 'small':ParagraphStyle('small',fontName='Arial',fontSize=9,leading=13,textColor=MUT),
 'h':ParagraphStyle('h',fontName='Arial-Bold',fontSize=13,leading=17,textColor=INK),
 'call':ParagraphStyle('call',fontName='Arial-Bold',fontSize=14,leading=19,textColor=INK),
 'title':ParagraphStyle('title',fontName='Arial-Bold',fontSize=28,leading=32,textColor=INK),
 'quote':ParagraphStyle('quote',fontName='Arial-Bold',fontSize=13,leading=18,textColor=INK),
}
page=0; y=0; bottoms=[]
def para(text,kind='body',gap=9,x=44,width=None):
 global y
 p=Paragraph(text,styles[kind]); pw,ph=p.wrap(width or W-88,H)
 if y-ph<58: raise RuntimeError(f'Overflow page {page}: {y-ph}: {text[:70]}')
 p.drawOn(c,x,y-ph);y-=ph+gap
 return ph

def start(title,section):
 global page,y
 if page: bottoms.append((page,y));c.showPage()
 page+=1;c.setFillColor(PAPER);c.rect(0,0,W,H,fill=1,stroke=0)
 c.setFillColor(ACC);c.rect(44,H-43,24,3,fill=1,stroke=0)
 c.setFont('Arial-Bold',8);c.drawString(78,H-44,'GHID UNIVERSAL / CREAȚIE PUBLICITARĂ')
 c.setFillColor(MUT);c.setFont('Arial',8);c.drawRightString(W-44,H-44,section)
 c.setStrokeColor(LINE);c.line(44,43,W-44,43)
 c.setFillColor(MUT);c.setFont('Arial',8);c.drawString(44,29,'Curiozitate relevantă. Valoare reală. Ton pozitiv.')
 c.drawRightString(W-44,29,f'{page:02d} / 13')
 y=H-77;para(title,'title',gap=19)

def heading(t):para(t,'h',gap=7)
def call(t):
 global y
 p=Paragraph(t,styles['call']);_,ph=p.wrap(W-116,H)
 if y-ph-28<58:raise RuntimeError('Callout overflow')
 c.setFillColor(PALE);c.roundRect(44,y-ph-28,W-88,ph+28,7,fill=1,stroke=0)
 c.setFillColor(ACC);c.rect(44,y-ph-28,3,ph+28,fill=1,stroke=0)
 p.drawOn(c,58,y-14-ph);y-=ph+42

def example(label,hook,explanation):
 para(label.upper(),'small',gap=4)
 para(hook,'quote',gap=5)
 para(explanation,'body',gap=14)

start('Reclame care merită<br/>următorul click','FILOSOFIA')
para('Un sistem universal pentru afaceri, creatori și AI. Se aplică serviciilor, produselor, comerțului online și afacerilor locale.','body',gap=18)
call('SELL THE CLICK<br/>Fă omul să vrea explicația, apoi arată de ce oferta este relevantă.')
heading('Regula centrală')
para('Publicul trebuie să recunoască situația și beneficiul din prima. Curiozitatea se păstrează în jurul metodei, detaliului sau explicației. Contextul rămâne clar; mecanismul se dezvăluie treptat.')
heading('Ordinea care ghidează creația')
para('<b>Situație recognoscibilă + beneficiu concret + întrebare deschisă + valoare în text + continuare coerentă.</b> Imaginea și titlul pornesc aceeași poveste. Oferta intră după ce există un motiv real să citești.')
heading('Preferințe constante')
para('Ton pozitiv. Limbaj simplu. Un cuvânt important în CAPS în fiecare hook. Voce umană, de regulă „noi”, fără a deschide cu numele companiei. CTA întotdeauna <b>Learn more</b>.')
para('Scopul: conținut interesant și util care se simte firesc în feed. Grafica poate fi elaborată și aliniată brandului. Aspectul firesc nu cere ascunderea sursei comerciale.','small',gap=16)
para('<b>În acest ghid:</b> brief (2), hook-uri și limbaj (3-4), fapte și statistici (5-6), vizual (7), text și destinație (8), exemple (9-10), proces (11), prompt AI (12), control final (13).','small')

start('Înainte de titlu,<br/>înțelege afacerea','BRIEF MINIM')
call('După această postare, cititorul poate să...<br/>Completează cu un câștig util chiar dacă nu cumpără.')
for h,t in [
('Oferta și mecanismul','Ce se vinde? Ce face concret produsul sau serviciul? Ce este inclus și care sunt limitele reale? Folosește doar informații actuale confirmate.'),
('Publicul și momentul','Cine citește? Ce încearcă să obțină? În ce situație apare nevoia? Cine decide și cine folosește oferta?'),
('Beneficiul observabil','Ce poate face, primi, alege sau înțelege cititorul? Descrie situația concretă: o cerere cu fotografii, o alegere de mărime, un traseu de rezervare.'),
('Dovezile disponibile','Ce cazuri, măsurători, demonstrații, recenzii sau materiale reale există? Notează sursa, perioada și contextul. Marchează clar informațiile necunoscute.'),
('Identitatea și materialele','Culori, fonturi, ton, fotografii proprii, capturi reale și drepturi de utilizare. Confirmă ce se poate reprezenta prin imagini generate.'),
('Destinația clickului','Ce pagină continuă promisiunea? Ce oferă înainte să ceară un pas comercial? Este publicată sau doar propusă?')]:heading(h);para(t)
para('Dacă lipsește o informație esențială, cere clarificarea minimă. Continuă cu faptele disponibile și marchează ce rămâne de verificat.','small')

start('Hook-ul deschide<br/>o întrebare relevantă','MECANICA TITLULUI')
call('Beneficiul se vede. Metoda merită descoperită.')
heading('Surse diferite de curiozitate')
para('<b>Transformare:</b> cum ajunge cineva dintr-o situație într-alta.<br/><b>Detaliu surprinzător:</b> un gest, obiect sau element mic cu un rol interesant.<br/><b>Regulă:</b> un principiu simplu care explică ceva util.<br/><b>Poveste:</b> un moment real care cere continuarea.<br/><b>Constatare:</b> o observație sau un test cu bază clară.<br/><b>Posibilitate dorită:</b> o situație concretă în care cititorul ar vrea să ajungă.')
heading('Un cuvânt-cheie în CAPS')
para('Alege un cuvânt care poartă beneficiul, surpriza sau momentul: ÎNAINTE, DEJA, AUR, PRIMUL. Folosește un singur cuvânt-cheie în CAPS în fiecare hook; restul rămâne scris firesc. Accentul trebuie să schimbe lectura, nu să fie decor.')
heading('Păstrează o singură întrebare dominantă')
para('Titlul spune despre ce este vorba și de ce ar conta. Lasă pentru text explicația: cum se întâmplă, ce a fost schimbat, care este detaliul sau ce arată datele. Cuvinte precum „secret”, „magic” sau „aur” trebuie susținute de o explicație concretă.')
heading('Varietatea vine din idee')
para('Schimbă situația, tipul beneficiului, mecanismul și povestea. Repetarea aceleiași introduceri în alte industrii nu produce concepte distincte. „Pare trișat” poate fi un unghi, nu începutul tuturor reclamelor.')
para('Un hook despre un rezultat real se scrie după verificarea dovezii. O ipoteză se formulează ca posibilitate, fără a o transforma în poveste de succes.','small')

start('Discret, dar clar<br/>din prima','LIMBAJ ȘI TON')
heading('Lasă industria să reiasă din scenă')
para('„Cererea de renovare”, „programarea la coafor”, „fotografiile de nuntă” sau „bucătăria la comandă” califică publicul firesc. Cititorul se recunoaște în activitate, obiect și rezultat.')
call('„Cererea de renovare poate veni cu pozele deja atașate. Totul începe ÎNAINTE de primul mesaj.”')
heading('Evită deschiderea de vânzare')
para('Formule precum „Ai o firmă de...?”, „Ești...?” sau „Vrei să-ți crești afacerea?” fac mesajul să semene imediat cu o ofertă. Intră direct într-o situație interesantă. Numele companiei nu este necesar în primul rând.')
heading('Ton pozitiv în toate conceptele')
para('Construiește pe progres, posibilitate, descoperire și rezultat dorit. Fără frică, rușinare, amenințări, pierderi sau greșeli folosite ca motor al hook-ului. Păstrează limitele importante ca explicații neutre în text.')
heading('Voce simplă, umană')
para('Propoziții scurte, cuvinte obișnuite și paragrafe aerisite. Un paragraf aduce o informație nouă. Folosește „noi” când povestea ajunge la ofertă și când relatarea este autentică. Păstrează identificarea corectă a sursei comerciale.')
heading('Două verificări rapide')
para('<b>Claritate:</b> un cititor din domeniu înțelege situația fără explicații suplimentare?<br/><b>Intrigă:</b> mai are un motiv precis să citească după titlu? Dacă ai ascuns contextul sau ai explicat deja tot, rescrie.')

start('Fapte și povești<br/>care pot fi susținute','BAZA AFIRMAȚIILOR')
heading('Alege forma după dovada disponibilă')
para('<b>Caz real:</b> prezintă punctul de plecare, schimbarea, rezultatul, perioada și limitele. Ai nevoie de surse verificabile și de dreptul de a folosi materialele.<br/><b>Demonstrație:</b> arată exact un mecanism sau o diferență observabilă. O demonstrație vizuală nu dovedește automat vânzări.<br/><b>Scenariu:</b> introdu explicit „Imaginează-ți...” sau „Așa poate arăta...”.<br/><b>Calcul ipotetic:</b> etichetează-l ca exemplu în text, lângă cifre.<br/><b>Ipoteză:</b> formulează o posibilitate de testat, nu o concluzie.')
heading('Structura unei povești reale')
para('Moment interesant → situația inițială → ce s-a schimbat → mecanism → rezultat observat → ce poate învăța cititorul. Deschide cu momentul care justifică lectura, apoi adaugă contextul.')
call('„Cum a trecut de la [situație inițială] la [rezultat verificat] în [perioadă]?”<br/>Acesta este un șablon de documentare, nu un titlu gata de publicat.')
heading('Specificitate fără cifre inventate')
para('Specificitatea poate veni din lucruri primite, pași, context sau comportament: poze și dimensiuni într-o cerere, stilul ales înainte de întâlnire, o întrebare precisă. Un rezultat numeric cere o măsurătoare reală.')
para('Nu inventa clienți, citate, mărturii, venituri, procente, știri sau rezultate. Nu prezenta trafic, apăsări și solicitări ca fiind același lucru. „Automat” se folosește numai pentru un proces care funcționează efectiv fără intervenția descrisă ca eliminată.','small')

start('Cifre care explică<br/>povestea','STATISTICI ȘI MĂSURARE')
heading('Definește exact ce numeri')
para('Vizitator, persoană care apasă un buton, conversație începută, solicitare calificată și client sunt etape diferite. Definește „calificat” înainte de analiză, după criterii relevante pentru ofertă.')
call('Exemplu ipotetic:<br/>80 persoane care apasă / 1.000 vizitatori × 100 = 8%')
para('Exemplul presupune vizitatori unici și persoane unice care au apăsat cel puțin o dată, măsurați pe aceeași pagină și în aceeași perioadă. Cele 8% reprezintă rata persoanelor care au apăsat, nu rata clienților. Cifrele nu sunt benchmark sau rezultat al unei afaceri.')
heading('Fișa minimă pentru o afirmație numerică')
para('<b>Indicator:</b> ce reprezintă cifra.<br/><b>Numărător și numitor:</b> cine intră în calcul.<br/><b>Perioadă:</b> început și sfârșit.<br/><b>Sursă:</b> unde pot fi verificate datele.<br/><b>Context:</b> canal, pagină, ofertă și condiții relevante.<br/><b>Limite:</b> ce nu poate fi atribuit sau urmărit sigur.')
heading('Diferența observată nu explică singură cauza')
para('La o comparație înainte/după, verifică traficul, bugetul, sezonul și oferta. O schimbare observată concomitent cu o modificare de pagină nu demonstrează singură că pagina a provocat-o.')
heading('Folosește cifra în serviciul curiozității')
para('Hook-ul poate anunța o constatare. Corpul livrează cifra, definiția și contextul. Continuarea explică mecanismul și pașii de verificare. Nu crea mister prin omiterea condițiilor esențiale.')

start('Imaginea principală<br/>și detaliul care o explică','DIRECȚIA VIZUALĂ')
para('Preferință de lucru: grafici generate sau compoziții elaborate în identitatea afacerii. Scena trebuie să fie recognoscibilă pentru public, iar ideea să se înțeleagă pe mobil. Stilul vizual poate fi adaptat materialelor reale disponibile.')
# Original vector composition diagram, not an edited reference image.
x=44;top=y;dw=W-88;dh=196
c.setFillColor(PALE);c.roundRect(x,top-dh,dw,dh,8,fill=1,stroke=0)
c.setFillColor(HexColor('#D4E1D7'));c.roundRect(x+15,top-132,dw-30,117,5,fill=1,stroke=0)
c.setFillColor(INK);c.setFont('Arial-Bold',13);c.drawString(x+29,top-43,'SCENĂ PRINCIPALĂ')
c.setFont('Arial',10);c.drawString(x+29,top-65,'Situație + obiect + beneficiu dorit')
c.setStrokeColor(ACC);c.setLineWidth(2);c.line(x+200,top-96,x+340,top-83)
c.setFillColor(PAPER);c.setStrokeColor(ACC);c.circle(x+410,top-75,46,fill=1,stroke=1)
c.setFillColor(INK);c.setFont('Arial-Bold',10);c.drawCentredString(x+410,top-69,'DETALIU')
c.setFont('Arial',9);c.drawCentredString(x+410,top-86,'informație nouă')
c.setFillColor(INK);c.roundRect(x+15,top-dh+13,dw-30,44,4,fill=1,stroke=0)
c.setFillColor(PAPER);c.setFont('Arial-Bold',12);c.drawString(x+29,top-dh+30,'Titlu lizibil + un cuvânt-cheie în CAPS')
y-=dh+16
heading('Imagine în imagine, cu un rol precis')
para('Inserția circulară sau rectangulară dezvăluie un detaliu, arată contextul din spatele unui obiect ori explică un pas. O săgeată sau un cerc este util când leagă două informații. Evită repetarea aceleiași imagini fără un câștig de înțelegere.')
heading('Brief-ul pentru generare')
para('Precizează publicul, ideea, scena principală, inserția, relația dintre ele, textul exact, cuvântul în CAPS, paleta, formatul și referințele. Pentru fișiere finale de reclamă cere fundal opac și margini de siguranță.')
para('Verifică diacriticele, cifrele, obiectele și lizibilitatea. Marchează scenariile, conversațiile și comparațiile ilustrative când pot fi confundate cu dovezi. Nu fabrica un portofoliu, o recenzie sau o identitate editorială.','small')

start('De la hook la explicație.<br/>Apoi la ofertă.','TEXT ȘI DESTINAȚIE')
heading('Structura textului principal')
para('<b>1. Intră în moment.</b> O observație, o scenă sau un fapt care continuă titlul.<br/><b>2. Livrează ceva util.</b> O informație, o metodă, un exemplu, un calcul sau o dovadă.<br/><b>3. Explică suficient.</b> Cititorul înțelege de ce contează și ce poate aplica.<br/><b>4. Deschide următoarea întrebare.</b> Continuarea aprofundează o parte precisă.<br/><b>5. Leagă oferta.</b> Arată cum ajută concret produsul sau serviciul.<br/><b>6. Invită firesc.</b> CTA: <b>Learn more</b>.')
call('Valoarea începe în postare.<br/>Clickul duce la explicația promisă.')
heading('Un singur fir de la imagine la destinație')
para('Imaginea, hook-ul, textul, titlul linkului și pagina de după click dezvoltă aceeași promisiune. Un articol promis trebuie să existe. Dacă destinația este o pagină de produs, aceasta livrează explicația promisă înainte de cererea comercială.')
heading('Schelet reutilizabil')
para('„[Situație precisă]. [Detaliu interesant]. Iată ce poți verifica sau aplica: [pas util]. [Dovadă ori exemplu marcat]. Noi [mecanism real al ofertei]. În continuare găsești [informație precisă, prezentă la destinație].”')
heading('Lungimea servește povestea')
para('Scrie cât trebuie pentru a livra valoarea și a păstra interesul. Elimină paragrafele care repetă promisiunea. Un text lung merită doar dacă fiecare etapă aduce ceva nou.')

start('Exemple: situații clare,<br/>curiozitate discretă','BIBLIOTECĂ / 1')
para('Propuneri de hook-uri și direcții de conținut. Nu sunt cazuri reale sau rezultate demonstrate.','small',gap=16)
example('Renovări','„Cererea de renovare poate veni cu pozele deja atașate. Totul începe ÎNAINTE de primul mesaj.”','Valoare: modelul de cerere și informațiile utile. Inserție: lucrarea la care se referă mesajul. Oferta trebuie să susțină mecanismul prezentat.')
example('Contact online','„Un vizitator citește. Altul apasă pe WhatsApp. Ce face DIFERENȚA?”','Valoare: ce urmărești între vizită și conversație. Folosește date reale sau o metodă de test, fără să pretinzi o cauză universală.')
example('Salon','„De la «îmi place coafura» la «vreau o programare». Pasul MIC dintre cele două.”','Valoare: legătura dintre exemplul de rezultat, serviciul disponibil și pasul de programare. Imaginea trebuie să facă domeniul evident.')
example('Detailing auto','„Poza cu mașina proaspăt lustruită atrage privirea. Ce deschide CONVERSAȚIA?”','Valoare: un exemplu de prezentare a lucrării și cererea de informații pentru discuție. Nu atribui fotografiei rezultate comerciale neverificate.')
example('Fotografie de nuntă','„«Vrem fotografii ca acestea la nunta noastră.» Cum pregătești terenul pentru ACEST mesaj?”','Replica este ilustrativă, nu testimonial. Valoare: selecția portofoliului și o întrebare despre preferințele cuplului.')

start('Aceeași filozofie,<br/>alte tipuri de afaceri','BIBLIOTECĂ / 2')
para('Adaptează ideea la oferta reală. Exemplele arată mecanica titlului; nu sunt promisiuni de performanță.','small',gap=16)
example('Mobilă la comandă','„Bucătăria e încă o idee. Dar prima cerere poate conține DEJA poze, dimensiuni și stilul dorit.”','Valoare: o listă de pregătire și un model de solicitare. Dimensiunile orientative se disting de măsurătorile finale.')
example('Magazin online de îmbrăcăminte','„Mărimea potrivită poate începe cu o piesă pe care o ai DEJA.”','Valoare: explicarea comparației măsurătorilor cu un articol existent, dacă ghidul produsului susține metoda. Fără garanții universale de potrivire.')
example('Cazare','„O dimineață pe terasă poate fi PRIMUL pas spre următoarea vacanță.”','Valoare: ce poate afla oaspetele despre experiență, facilități și acces. Folosește fotografii și detalii reale; explică ce este inclus.')
example('Curs de limbi străine','„Prima conversație poate începe ÎNAINTE de prima lecție.”','Valoare: un exercițiu introductiv realizabil, dacă face parte din metodă. Continuarea oferă exercițiul; fără promisiuni de fluență inventate.')
example('Produse pentru organizarea casei','„Ordinea din sertar începe cu o alegere MICĂ. Care este?”','Valoare: o metodă de alegere a compartimentelor după obiecte și spațiu. Inserția arată criteriul de alegere, nu o comparație falsă înainte/după.')

start('Creează idei distincte.<br/>Învață din selecție.','PROCES ȘI TESTARE')
for h,t in [
('1. Extrage baza factuală','Completează brief-ul. Separă faptele de ipoteze și de informațiile necunoscute. Alege beneficiile pe care oferta le poate susține.'),
('2. Propune unghiuri diferite','Variază beneficiul, situația și mecanismul de curiozitate. Nu schimba doar industria într-o formulă repetată. Păstrează tonul pozitiv.'),
('3. Scrie hook-uri înainte de imagini','Propune mai multe începuturi. Selectează-le după claritate, interes, relevanță și baza promisiunii. Folosește preferințele concrete ale celui care aprobă.'),
('4. Construiește perechea imagine-text','Alege scena și inserția care dezvoltă exact hook-ul. Scrie textul principal, titlul linkului și continuarea înainte de generarea imaginilor.'),
('5. Produce și verifică','Verifică imaginile la dimensiune de mobil, toate textele și concordanța cu pagina de după click. Arhivează promptul și versiunea finală.'),
('6. Testează o ipoteză identificabilă','Când vrei să înțelegi ce produce diferența, schimbă controlat câte un element. Compară în contextul traficului, bugetului și perioadei.'),
('7. Urmărește și rezultatul comercial','Clickul este primul pas al reclamei. Evaluează și vizita reală, consumul paginii, solicitările relevante și clienții. Un click ieftin nu demonstrează singur valoarea pentru afacere.')]:heading(h);para(t)
para('Verifică specificațiile și regulile actuale ale platformei înainte de lansare. Acest ghid descrie un proces creativ, nu certifică setări sau tactici universal câștigătoare.','small')

start('Prompt reutilizabil<br/>pentru AI','COPIAZĂ ȘI COMPLETEAZĂ')
para('<b>Context:</b> Afacere/ofertă: [...] · Public: [...] · Situație: [...] · Beneficiu: [...] · Mecanism real: [...] · Dovezi și surse: [...] · Identitate vizuală: [...] · Materiale disponibile: [...] · Destinație: [...] · Număr de concepte: [...]','small',gap=16)
para('Creează reclame care vând interesul pentru explicație și următorul click. Gândește ca un editor de conținut și un copywriter de performanță. Aplică regulile de mai jos.','body')
para('''<b>1.</b> Publicul și situația trebuie să fie clare din prima, prin context. Evită introducerile „Ai firmă de...?” și „Ești...?”.<br/>
<b>2.</b> Beneficiul trebuie să fie concret. Păstrează curiozitatea în jurul mecanismului sau al detaliului care explică beneficiul.<br/>
<b>3.</b> Folosește exclusiv unghiuri pozitive: progres, posibilitate, descoperire și rezultat dorit.<br/>
<b>4.</b> Pune un singur cuvânt-cheie important în CAPS în fiecare hook.<br/>
<b>5.</b> Variază ideile, poveștile și structurile. Nu repeta aceeași formulă schimbând doar nișa.<br/>
<b>6.</b> Scrie simplu, cu paragrafe scurte. Începe din momentul interesant și oferă valoare chiar în postare.<br/>
<b>7.</b> Preferă fapte, demonstrații și povești verificabile. Nu inventa rezultate, clienți, știri, citate sau statistici. Marchează scenariile și calculele ipotetice.<br/>
<b>8.</b> Introdu oferta după explicație, prin mecanismul relevant. Folosește o voce umană, de regulă „noi”, și păstrează sursa comercială corect reprezentată.<br/>
<b>9.</b> Propune grafici în identitatea afacerii. Preferă imagine în imagine când inserția aduce o informație nouă și relevantă.<br/>
<b>10.</b> Păstrează aceeași promisiune în imagine, hook, text, titlul linkului și destinație. CTA întotdeauna <b>Learn more</b>.<br/>
<b>11.</b> Marchează paginile propuse și afirmațiile care cer verificare. Cere doar clarificările esențiale și continuă cu informațiile disponibile.''','body',gap=15)
para('<b>Livrare:</b> pentru fiecare concept, oferă structura de pe pagina următoare. La final explică ce câștigă cititorul și de ce oferta este continuarea relevantă. Rescrie orice concept care nu are răspunsuri concrete.','small')

start('Ce livrezi.<br/>Ce verifici.','CONTROL FINAL')
heading('Pachetul fiecărei reclame')
para('1. Publicul, situația și ipoteza conceptului.<br/>2. Beneficiul concret și baza afirmațiilor.<br/>3. Hook-ul cu un cuvânt-cheie în CAPS.<br/>4. Textul principal complet.<br/>5. Două hook-uri alternative, cu ton pozitiv.<br/>6. Titlul linkului, descrierea și CTA: Learn more.<br/>7. Scena principală, inserția și rolul fiecăreia.<br/>8. Textul exact din imagine și promptul de generare.<br/>9. Destinația, promisiunea livrată acolo și starea publicării.<br/>10. Afirmațiile și materialele încă de verificat.')
heading('Filtrul de aprobare')
para('• Se înțelege pentru cine este și ce situație descrie?<br/>• Beneficiul este concret, pozitiv și relevant pentru ofertă?<br/>• Titlul deschide o întrebare care merită răspunsul?<br/>• Cuvântul în CAPS accentuează ideea potrivită?<br/>• Textul livrează valoare înainte de click?<br/>• Faptele, cifrele și poveștile au o bază clară?<br/>• Inserția adaugă informație, iar imaginea este lizibilă?<br/>• Oferta apare firesc, prin mecanismul prezentat?<br/>• Destinația livrează exact continuarea promisă?<br/>• CTA-ul este Learn more?')
call('Elimină numele produsului. Mai rămâne ceva util?<br/>Citește titlul singur. Contextul este clar, iar metoda încă interesantă?')
para('Dacă beneficiul este vag, contextul ascuns, cifra fără bază sau pagina nepotrivită, rescrie înainte de a produce variante. Acest ghid sintetizează un mod de lucru și preferințe editoriale; performanța se stabilește prin testare.','small')
bottoms.append((page,y));assert page==13
c.save()
Path('tmp/pdfs/universal/layout.json').write_text(json.dumps(bottoms))
print(OUT.resolve());print('Pagini:',page,'Cel mai jos punct de conținut:',min(b for _,b in bottoms))
