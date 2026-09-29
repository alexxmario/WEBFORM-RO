from pathlib import Path
import json,re
ROOT=Path('/Users/alexmario/Desktop/WEBFORM Romania')
folders=['66c2a0ad-86c4-4ba6-84dd-b859a1d53185','a0a99d37-c049-4ba2-92dd-f08e2fd6ca2f','7d3084c1-55c5-46bd-9df3-241a3c9e55d0','7d0a4c5c-1251-4f0e-a776-aff79b180cd6','dfad5c8f-2c6c-4b58-a604-f77b116b6a6c','67928c09-92b1-498f-9571-ea26f2282fba']
ids=['HsjuAvqs3zU','Ea1hFxPx3JA','NTmWqnPIb2s','-ICL-axeBQY','bFR1y5_kAB4','QN_LVgvik-k']
paths={f'V{i}':Path('/Users/alexmario/.codex/attachments')/folder/'pasted-text.txt' for i,folder in enumerate(folders,1)}
texts={k:v.read_text() for k,v in paths.items()}
urls={f'V{i}':f'https://www.youtube.com/watch?v={video}' for i,video in enumerate(ids,1)}
data='''V2|4|Psihologie înaintea algoritmilor|You want to obsess over people
V2|4|Cele două sarcini|your ad has just two jobs
V2|4|Conținutul oferit de reclamă|deliver news, value or findings
V2|4|Scopul reclamei|sell the click
V2|5|Curiozitatea are prioritate|Curiosity is the most powerful
V2|5|Combină intriga cu beneficiul|a combination of clickbait and a targeted benefit
V2|5|Cele trei componente|This is the formula
V2|5|Respinge intriga necalificată|that's what we call blind intrigue
V2|6|Studiul atenției|We want to follow the attention
V2|6|Nu porni de la zero|You don't ever want to sit down to write your ads with a blank canvas
V2|6|Adaptarea modelului|swipe and deploy them for your own specific ads
V2|7|Imaginea este observată înaintea headline-ului|they first have a scroll stopping image
V2|7|Alinierea componentelor|theme everything around that
V5|8|Ponderea acordată headline-ului|spend 80% of your time writing the headlines
V5|8|Grabber de trei-patru cuvinte|Most headlines are three to four words
V5|8|Numere în headline|Essential number two is to always use numbers
V5|8|Intrigă obligatorie|The third essential is to have burning curiosity
V5|8|Beneficiul pozitiv|Always promise a big specific benefit
V5|8|Specificitate|make your headlines specific
V2|8|Hook pozitiv: preferință puternică|Eight out of 10 times outperform negative things
V2|8|Testarea ambelor direcții|try them both
V6|9|Primele cuvinte decid continuarea|the first 11 or 14 words
V6|9|Rezultatul din exemplul lead-in|I got 72 leads in 5 days. WTF?
V6|9|Deschide în acțiune|drop somebody right in the action
V6|9|Ghilimele și conversație|I like to put them in quotation marks
V2|10|Descrierea linkului|intriguing link description
V2|10|CTA categoric|A learn more CTA is the best
V6|10|Exercițiul de 48 de ore|let that thing run for 48 hours
V2|11|Procesul de scriere|you write the copy, you disregard the length
V2|11|Ținta de caractere|keep your ad to 2200 characters
V2|11|Citirea precede conversia|consumption precedes conversion
V5|11|Cine citește long copy|the buyers
V5|11|Editare severă|every single word, it needs to fight for its right to be on the page
V5|12|Raportul prospect / afacere|it needs to be 80% focused on the prospect
V5|12|Caracteristici spre beneficii|write out two corresponding benefits
V5|12|Valoarea învinge scepticismul|the antidote to skepticism is value
V2|12|Specificitate și personalitate|Add zest, personality, and specificity
V2|12|Dorința centrală contează cel mai mult|hitting the bullseye of your marketplace
V2|13|Raw native|what we call the raw native
V2|13|SMS|what I call the SMS ads
V2|13|Breaking news|the good old breaking news
V2|13|Nu doar breaking news|you can't have all of your ads just breaking news
V2|13|Native highlight|what we have is the native highlight
V2|13|Imaginea secundară nu este obligatorie|It doesn't have to be a secondary image
V2|13|Native social post|the native social post
V2|13|Secret info|what we call the secret info
V2|13|Cele două preferate|the raw native and the breaking news
V6|14|Strategia barbell|the barbell strategy
V6|14|Fotografii brute|There's no editing, no Photoshop
V6|14|Cealaltă extremă|super high production skits
V5|15|Prioritatea cercetării|what you say is infinitely more important than how you
V5|15|Cercetare aprofundată|spend a day, spend multiple days
V5|15|Nu peste șase luni fără research|you can't go more than 6 months
V5|15|Asamblarea copy-ului|instead you're assembling the copy
V5|15|Canalizează dorința|You want to channel desire
V5|16|Pitch înregistrat|record yourself or your best salesperson
V5|16|Rolul AI și al omului|a copy chief
V6|17|Poveste de interes larg|an absolute mass market story
V6|17|Exercițiul săptămânii|write one story ad this week
V6|18|Pagina fondatorului|create a founder brand page
V6|18|Păstrează reclama identică în primul test|Do not change anything on that thing
V1|19|Ritmul de scriere|writing five new ads every single day
V1|19|Studiul reclamelor clasice|five to 10 of these ads every single day
V3|19|Ora săptămânală pentru creative|dedicate one hour per week
V4|19|Volum și varietate|You need to build an army of ads
V3|20|Cuvântul de categorie|an identity trigger
V3|20|Clonarea începe cu body copy|start with your body copy
V3|21|Targeting specific prin creative|Broad targeting with super specific creative
V3|21|Comparația broad / interese|in 7 days time
V3|22|Reclame nealimentate de buget|all of those ads that get no spend
V6|22|Buget pentru reclamele nealimentate|have a dedicated budget where you force Meta to spend on it
V6|23|Imaginea obosește prima|the actual image creative fatigues the quickest
V6|23|Număr de statice noi|15, 30, 50, 100 new statics
V6|23|Fereastra deciziei|7-day rolling averages
V6|23|Controlul întregului cont|What are our CTRs doing across all of our campaigns?
V6|23|Frecvența în argumentul lui|if you're anything under three
V3|24|Obiecțiile reale|an objection handling ad
V3|24|Dovezi în carusel|run them as carousel ads
V3|24|Alte oferte|Retarget with a different offer
V3|25|Headline câștigător pe pagină|mirror that on my actual landing page
V3|25|Termenul exercițiului|fix it within 24 hours
V1|26|Preferința pentru cerere generată|I would pick demand generation
V5|27|Publicul în eyebrow copy|what's called the eyebrow copy
V5|27|Agitația durerii|You want to kick their bruised knee
V5|28|Alternativele încercate|dismantle their selling arguments one by one
V5|28|Dovezi care arată|showing and not telling
V5|29|Scarcity autentică|it should be real scarcity
V5|29|Comandă clară|Don't ask them to take action. Tell them
V5|29|PS-ul|start with a negative and end with a positive
V5|30|Bullet-ul trebuie să poată vinde singur|each one should justify the purchase all by themselves
V5|30|Curiozitatea din bullets|dial up that curiosity dial to a 10 out of 10
V4|31|Verificarea din afara paginii|the Google sniff test
V4|31|Traseul paralel|a parallel funnel
V4|32|Volumul creatorilor|20 to 30 pieces of organic content
V4|32|PR trimestrial|think every quarter what's happening in my business
V4|33|Forma advertorialului|either a listical or also doing X reasons why
V4|33|Ordinea argumentului|problem proof and then push to the CTA
V3|34|Rezultatul comercial prioritar|net free cash flow
V3|34|Controlul lunar al datelor|block out 3 hours a month
V2|36|Scrie unei persoane|Don't write our customer, write you
V2|36|Cealaltă recomandare despre pronume|Avoid using words like you and your in your ad
V2|38|Headline-ul exemplului USB|This client getting hacked feels illegal
'''
rows=[]
missing=[]
for row in data.strip().splitlines():
    src,page,topic,anchor=row.split('|')
    found=texts[src].casefold().find(anchor.casefold())
    if found<0:
        missing.append((src,topic,anchor))
    else:
        original=texts[src][found:found+len(anchor)]
        rows.append((src,page,topic,original))
if missing:raise RuntimeError(json.dumps(missing,ensure_ascii=False,indent=2))
intro='''# Audit de fidelitate: metoda Sabri Suby

Acest document verifică sursa regulilor din ediția 3.0. Reperul principal este V2. Fragmentele de mai jos sunt extrase literal din transcrierile furnizate, nu citate reconstruite din memorie. Numerele paginilor se referă la noul PDF de 42 de pagini.

## Corecții față de ediția anterioară

| Subiect | Ediția anterioară | Corecția fidelă |
|---|---|---|
| Curiozitate | Un modul printre șase alternative egale | Nucleul formulei V2, împreună cu pattern interrupt și beneficiul specific |
| Scopul reclamei | Acțiune comercială aleasă generic | News/value/findings și sell the click, apoi conversie în funnel |
| CTA | Learn more ca preferință înlocuibilă | Instrucțiune categorică în V2 și V6 |
| Hook pozitiv | Preferință de profil | Preferință puternică în V2, formulare categorică în V5 |
| Durere | Atenuată în sistemul de vânzare | Agitația explicită din pasul 5 este păstrată |
| Aspect nativ | Echivalent cu grafică elaborată | Regula repetată: reclama să nu arate ca o reclamă; raw native este prioritar |
| CAPS | Prezentat ca regulă de generare | Preferință din ghidul inițial; absentă din cele șase transcrieri |
| Imagine secundară | Preferință tratată aproape ca structură standard | Recomandată, dar explicit neobligatorie în V2 |
| Lead-in și link description | Comprimate în textul reclamei | Elemente separate, cu rol și exerciții proprii |
| Copywriting | Formule generale și control editorial | Research, pitch, beneficiu, specificitate, long copy, fascinations și copy chief |
| Tactici concrete | Generalizate | Cantități, ordine și intervale păstrate, atribuite surselor |
| Conversie externă | Accent pe pagina proprie | Parallel funnel, creator proof, PR și advertorial din V4 |

## Nivelurile de atribuire

- **Instrucțiunea creatorului:** ceea ce spune efectiv să faci, inclusiv formulările categorice.
- **Afirmația creatorului:** rezultatul revendicat, explicația despre algoritm sau inferența despre un brand.
- **Organizare editorială:** ordinea capitolelor, traducerea, promptul și legăturile dintre contexte.
- **Preferință proprie:** cerințe precum CAPS, care pot fi păstrate numai ca preferințe separate.

## Repere verificabile

Fragmentele sunt chei de căutare în transcrieri. Sunt intenționat scurte; contextul complet se găsește în fișierul sursă. Erorile fonetice din fragmente sunt păstrate, unde apar.

| Pagina | Regulă sau accent | Sursa și reperul exact |
|---|---|---|
'''
out=intro
for src,page,topic,quote in rows:
    out+=f'| {page} | {topic} | [{src}]({urls[src]}) · “{quote}” |\n'
out+='''
## Diferențe care rămân vizibile

- V2 cere să scrii pentru o persoană și să folosești „you”, dar apoi recomandă să eviți folosirea frecventă „you/your”. Nu este prezentată o reconciliere explicită în acel pasaj.
- V2 respinge blind intrigue; V6 folosește și o Trojan story cu deschidere de gossip larg și legătură târzie cu oferta. Ghidul marchează această diferență.
- V2 favorizează pozitivul opt din zece și spune să testezi ambele; V5 spune „Always promise a big specific benefit”, dar cere agitația durerii în sales copy.
- Lizibilitate: V2 clasa a V-a sau mai jos, personal III-IV; V5 clasa a VI-a sau mai jos.
- Bonusuri: V1 două-trei, V5 trei-patru. Teste simultane ca practică personală: V1 cinci, V3 trei.
- „Always use numbers” din V5 este păstrat ca prescripție, fără a ascunde că unele exemple ale creatorului nu au numere.
- Durata de rulare, numărul de reclame sau asemănarea lor cu alte materiale nu dovedesc singure cheltuiala sau profitul. Când creatorul face aceste inferențe, ghidul le identifică drept ale lui.

## Limita verificării

Au fost citite integral toate cele șase texte: 43.419 de cuvinte după numărarea simplă pe spații. Nu au fost validate independent rezultatele comerciale, afirmațiile despre algoritmi sau exemplele medicale. Imaginile descrise în clipuri nu au fost inspectate separat. Nu există timestamps în fișiere, deci nu sunt inventate.

## Fișierele sursă

'''
total=sum(len(s.split()) for s in texts.values())
out=out.replace('43.419',f'{total:,}'.replace(',','.'))
for src,p in paths.items():out+=f'- [{src}: transcriere integrală](<{p}>) · [videoclip]({urls[src]})\n'
out+=f'\nVerificare automată: toate cele {len(rows)} fragmente din tabel au fost regăsite în sursa indicată. Această verificare confirmă citatele, nu performanța revendicată.\n'
dest=ROOT/'output/pdf/Audit-fidelitate-Sabri-Suby.md'
dest.write_text(out)
print(json.dumps({'audit':str(dest),'verified_anchors':len(rows),'transcript_words':total},ensure_ascii=False))
