export type Article = {
  ad: number;
  slug: string;
  category: string;
  title: string;
  intro: string;
  image: string;
  alt: string;
  takeaway: string;
  bridge: string;
  sections: {
    title: string;
    paragraphs: string[];
    example?: { label: string; text: string };
    items?: string[];
  }[];
};

export const articles: Article[] = [
  {
    ad: 4,
    slug: "lucrarile-tale-ajung-inaintea-ta",
    category: "Lucrările tale, la prezentare",
    title: "Prima întâlnire cu un client poate avea loc fără tine.",
    intro:
      "Tu ești la o lucrare. El se uită la un montaj făcut de tine. Deschide încă o fotografie. Și găsește ceva asemănător cu ce vrea la el acasă.",
    image: "04-lucrari-la-prezentare",
    alt: "O servietă deschisă cu miniaturi de instalații și fotografii de lucrări.",
    takeaway:
      "Alege trei lucrări diferite. Lângă fiecare, spune ce ai făcut, în ce spațiu și ce merită observat. Ai începutul unei prezentări pe care o poți trimite într-un singur link.",
    sections: [
      {
        title: "Ce se întâmplă după «îți dau numărul unui instalator»?",
        paragraphs: [
          "Imaginează-ți o recomandare între doi vecini. Unul are nevoie de un instalator. Celălalt îi trimite numărul tău. Până aici, totul îți este familiar.",
          "Acum adaugă un singur lucru lângă acel număr: un link cu lucrările tale. Omul îl poate deschide când are timp. Poate vedea ce montezi, unde te deplasezi și cum arată câteva proiecte la care ai lucrat.",
          "Recomandarea deschide conversația. Prezentarea îi dă ceva concret de explorat înainte să sune. Iar tu nu trebuie să cauți aceleași fotografii prin telefon de fiecare dată.",
        ],
      },
      {
        title: "Fotografia pe care o alegi prima are o treabă de făcut.",
        paragraphs: [
          "Deschide galeria telefonului și caută o lucrare de tipul celor pe care ai vrea să le primești în continuare. Pentru cineva care renovează o baie, un exemplu de instalație de baie poate fi un început mai util decât zece fotografii aproape identice cu un calorifer.",
          "Alege apoi alte două lucrări care arată servicii diferite. O prezentare scurtă, cu exemple ușor de înțeles, îi oferă vizitatorului mai multe puncte în care să recunoască propria nevoie.",
          "Folosește fotografii clare din lucrările tale, pe care ai acordul să le publici. Încadrează instalația astfel încât adresele, persoanele și lucrurile personale ale clientului să rămână în afara imaginii.",
        ],
      },
      {
        title: "Trei întrebări transformă o galerie într-o prezentare.",
        paragraphs: [
          "Tu știi ce s-a întâmplat la fiecare adresă. Cel care deschide pagina vede doar un cadru. Ajută-l cu puțin context, exact cât i-ai spune dacă ați privi fotografia împreună.",
        ],
        items: [
          "Ce ai făcut? Numește intervenția concretă.",
          "În ce fel de spațiu? Apartament, casă, baie în renovare — fără adresa clientului.",
          "Ce merită observat? Un detaliu vizibil pe care îl poți explica simplu.",
        ],
        example: {
          label: "Exemplu de prezentare · adaptează la lucrarea reală",
          text: "Montaj de obiecte sanitare într-o baie renovată. Am montat lavoarul și bateria. În fotografia de detaliu se vede racordarea de sub lavoar.",
        },
      },
      {
        title: "Un link bun răspunde și la întrebarea «vine până la mine?»",
        paragraphs: [
          "După fotografii, omul are nevoie de câteva repere practice: serviciile pe care le oferi, localitățile în care te deplasezi și un număr de telefon la îndemână. Pune-le aproape de lucrări, ca să poată continua din locul în care i-ai atras interesul.",
          "Poți trimite același link după o recomandare, când ți se cer exemple sau după o discuție în care cineva vrea să le arate și celorlalți din familie ce ați vorbit.",
          "Merită să verifici prezentarea chiar pe telefon. Se văd bine imaginile? Se citește ușor explicația? Se găsește contactul? Acesta este traseul pe care îl pregătești pentru viitorul client.",
        ],
      },
      {
        title:
          "Partea bună: materialul de pornire poate fi deja în buzunarul tău.",
        paragraphs: [
          "Câteva fotografii și explicațiile pe care le-ai da la telefon sunt suficiente pentru a începe. Nu trebuie să ai din prima un portofoliu cu zeci de proiecte. O selecție mică îți permite să vezi ce lipsește și ce merită fotografiat la următoarea lucrare.",
          "Iar când termini un proiect pe care vrei să-l arăți, prezentarea poate crește cu el. Un nou exemplu, o explicație scurtă, încă un motiv pentru cineva să se oprească și să privească.",
        ],
      },
    ],
    bridge:
      "Tu ne trimiți fotografiile și ne povestești ce ai făcut. Noi alegem împreună cu tine exemplele, scriem explicațiile și le așezăm într-un site ușor de trimis mai departe.",
  },
  {
    ad: 2,
    slug: "ce-merita-fotografiat-inainte-de-gresie",
    category: "Povestea din spatele finisajelor",
    title:
      "Cea mai interesantă fotografie a băii poate fi făcută înainte să fie gata.",
    intro:
      "După ce se pun finisajele, o parte din munca ta dispare din vedere. Există însă un moment în care o poți păstra: când traseele și etapele montajului încă se văd.",
    image: "02-sub-gresie",
    alt: "O fotografie cu instalațiile expuse, ținută în fața unei băi finisate.",
    takeaway:
      "La următoarea lucrare, păstrează trei cadre: începutul, un detaliu din timpul montajului și finalul. Adaugă câte o propoziție care explică ce se vede.",
    sections: [
      {
        title: "Baia gata spune doar o parte din poveste.",
        paragraphs: [
          "Un om care privește baia terminată observă lavoarul, bateria, gresia. Instalația din spatele lor poate să nu-i treacă prin minte. Tocmai de aceea, o fotografie din timpul lucrării îi poate deschide o perspectivă nouă.",
          "Pune lângă rezultatul final un cadru făcut înainte de finisaje. Dintr-odată, privitorul are două momente între care poate face legătura. Începe să înțeleagă unde ai intervenit și ce parte din transformare îți aparține.",
          "Fotografiile documentează etapele vizibile. Explicația ta le dă sens; o imagine singură nu poate demonstra toate lucrurile care țin de calitatea unei instalații.",
        ],
      },
      {
        title: "Cadrul 1: lasă-l să vadă de unde ai pornit.",
        paragraphs: [
          "Fă o fotografie de ansamblu, dintr-un loc din care se înțelege spațiul. Dacă revii la același unghi la final, transformarea va fi mai ușor de urmărit.",
          "Lângă imagine, spune care era cerința: o baie în renovare, pregătirea pentru un obiect sanitar nou, o intervenție punctuală. Menționează doar ceea ce ai făcut tu și ceea ce știi despre lucrare.",
        ],
        example: {
          label: "Exemplu de explicație",
          text: "Baie în renovare. În această etapă am pregătit traseele pentru amplasarea lavoarului în poziția stabilită cu proprietarul.",
        },
      },
      {
        title:
          "Cadrul 2: apropie-te de detaliul pe care l-ai explica unui client.",
        paragraphs: [
          "Aici intră fotografia pe care, poate, n-ai fi pus-o prima într-un portofoliu: racordurile, traseele înainte să fie acoperite sau o etapă a montajului. Alege un detaliu pentru care ai o explicație clară.",
          "Dacă folosești un termen tehnic, adaugă imediat ce înseamnă în acea lucrare. Cel care citește poate fi foarte interesat de renovarea lui fără să cunoască vocabularul meseriei tale.",
          "Merită să fotografiezi la o oprire firească a lucrului, cu zona vizibilă și lumină suficientă. Nu ai nevoie să transformi șantierul într-un studio. Ai nevoie să se înțeleagă ce arăți.",
        ],
      },
      {
        title: "Cadrul 3: închide povestea cu rezultatul.",
        paragraphs: [
          "Revino la imaginea de ansamblu. Acum cititorul poate lega detaliul ascuns de obiectele pe care le vede în baie. Dacă ai făcut doar instalația, precizează asta; finisajele pot aparține altor meseriași.",
          "Păstrează ordinea început–montaj–final și în prezentarea online. Trei fotografii bine explicate îi permit omului să urmărească proiectul fără să ghicească succesiunea.",
        ],
        items: [
          "Început: ce se pregătea și care era cerința.",
          "Montaj: ce ai realizat în etapa fotografiată.",
          "Final: cum se leagă intervenția ta de rezultatul vizibil.",
        ],
      },
      {
        title:
          "Ai doar fotografiile din timpul lucrării? Poți începe și de acolo.",
        paragraphs: [
          "Nu toate proiectele sunt documentate complet. Dacă ai doar două cadre utile, folosește-le și explică etapa în care au fost făcute. La următoarea lucrare vei ști deja ce fotografie îți lipsește.",
          "Înainte de publicare, verifică acordul clientului și lucrurile care apar în cadru. Poți descrie tipul de locuință și localitatea fără să expui adresa exactă sau obiectele personale.",
          "Povestea devine interesantă printr-o descoperire simplă: omul vede ceva ce finisajele ar fi ascuns. Tu ai fost acolo. Tu poți explica acea parte a lucrării.",
        ],
      },
    ],
    bridge:
      "Trimite-ne cadrele pe care le ai și povestește-ne etapele. Noi le punem în ordine, scriem explicațiile pe înțelesul clienților și construim pagina în care lucrarea poate fi urmărită de la început la final.",
  },
  {
    ad: 6,
    slug: "o-propozitie-schimba-o-fotografie",
    category: "Ce povestește o fotografie",
    title: "Același calorifer. Aceeași poză. O propoziție schimbă ce înțelegi.",
    intro:
      "Privești o fotografie cu un calorifer. Acum citești sub ea: «Montaj într-un spațiu nou.» Imaginea a rămas aceeași. Dar ai aflat ceva despre lucrare.",
    image: "06-poza-cu-poveste",
    alt: "Două fotografii ale aceluiași calorifer, una însoțită de o explicație.",
    takeaway:
      "Deschide o fotografie din telefon și completează: «Am făcut ___, într-un ___. În imagine se vede ___.» Păstrează doar detaliile reale și utile pentru cel care caută serviciul.",
    sections: [
      {
        title: "Tu vezi lucrarea. Clientul vede un obiect.",
        paragraphs: [
          "Când te uiți la fotografie, îți amintești locul, cerința și etapele prin care ai trecut. Pentru altcineva, toate acestea sunt în afara cadrului. El vede caloriferul, bateria sau distribuitorul.",
          "O explicație scurtă îi oferă un punct de pornire. A fost un montaj nou? O înlocuire? O parte din renovarea unei camere? Sunt situații diferite, chiar dacă obiectul din fotografie seamănă.",
          "Aici apare șansa ca omul să se gândească la propria lucrare: recunoaște o situație, apoi vrea să afle dacă îl poți ajuta și pe el.",
        ],
      },
      {
        title: "Începe cu verbul. Ce ai făcut, concret?",
        paragraphs: [
          "«Calorifer» numește obiectul. «Am montat un calorifer» numește serviciul. «Am înlocuit un calorifer într-un apartament» adaugă și situația. Fiecare pas îi oferă cititorului un reper în plus.",
          "Nu ai nevoie de o frază spectaculoasă la fiecare imagine. Verbul potrivit face deja o parte din muncă: am montat, am înlocuit, am racordat. Alege-l după ceea ce s-a întâmplat în realitate.",
        ],
        example: {
          label: "Exemplu de legendă · folosește doar dacă descrie lucrarea",
          text: "Înlocuire de calorifer într-un apartament. În fotografia de detaliu se văd racordurile după montaj.",
        },
      },
      {
        title: "Adaugă detaliul care îl ajută să se regăsească.",
        paragraphs: [
          "Gândește-te la întrebările pe care le primești la telefon. Cineva renovează. Altcineva are obiectul cumpărat. Alt om vrea să schimbe doar bateria. Tipul de spațiu și tipul de intervenție îl pot ajuta să înțeleagă dacă exemplul tău are legătură cu nevoia lui.",
          "Alege un singur detaliu relevant pentru început. O legendă încărcată cu fiecare etapă tehnică poate ascunde tocmai informația pe care omul o caută.",
          "Dacă o lucrare merită explicată pe larg, păstrează o descriere scurtă lângă fotografie și dezvoltă povestea pe pagina proiectului. Cititorul poate decide cât vrea să exploreze.",
        ],
      },
      {
        title: "Arată-i unde să se uite.",
        paragraphs: [
          "Expresia «în imagine se vede…» te obligă să fii concret. Poți indica racordarea de sub lavoar, poziția obiectului în spațiu sau o etapă dinainte de finisaje. Cititorul găsește apoi acel detaliu cu ochii lui.",
          "Evită să pui pe seama fotografiei lucruri pe care nu le poate arăta. Dacă ai făcut verificări, descrie separat verificările reale; simplul aspect al montajului nu spune totul despre funcționarea lui.",
        ],
        items: [
          "Ce ai făcut: intervenția.",
          "Unde se încadrează: tipul de spațiu sau situația.",
          "Ce poate observa omul: un detaliu din imagine.",
        ],
      },
      {
        title: "Un mic exercițiu, direct în galeria telefonului.",
        paragraphs: [
          "Alege trei fotografii cu lucrări diferite. Pentru fiecare, spune cu voce tare ce i-ai explica unui om care întreabă «asta ce lucrare a fost?». Scrie răspunsul în două propoziții.",
          "Citește-l apoi fără fotografie. Se înțelege serviciul? Privește fotografia împreună cu textul. Se potrivesc? Ai acum o legendă care adaugă context, în loc să repete numele obiectului.",
          "Adunate într-o pagină, aceste exemple pot fi trimise printr-un link. Când cineva întreabă dacă ai mai făcut o lucrare asemănătoare, are ce să vadă și ce să citească înainte să continuați discuția.",
        ],
      },
    ],
    bridge:
      "Răspunsurile sunt deja la tine. Tu ai fost la lucrare. Ne trimiți fotografiile și ne spui ce ai făcut; noi transformăm explicațiile în texte clare și le așezăm într-un site pe care îl poți trimite clienților.",
  },
  {
    ad: 8,
    slug: "ce-sa-contina-prima-cerere-de-montaj",
    category: "Înainte de «cât costă?»",
    title: "Prima cerere poate începe cu mai mult decât «cât costă?».",
    intro:
      "Localitatea. Ce trebuie montat. Dacă obiectul este deja cumpărat. O fotografie a locului. Cu aceste repere, ai de unde începe conversația.",
    image: "08-prima-intrebare",
    alt: "Un caiet de lucru cu o schiță de montaj și informații pentru prima discuție.",
    takeaway:
      "Pune lângă butonul de contact o invitație clară: localitatea, ce trebuie montat, dacă obiectul este cumpărat și o fotografie de ansamblu. Omul află ce îți este util chiar înainte să-ți scrie.",
    sections: [
      {
        title: "Omul știe ce vrea. Uneori nu știe ce ai nevoie să afli.",
        paragraphs: [
          "Pentru cineva care vrea să monteze un lavoar, «cât costă?» este un început firesc. Tu ai însă câteva întrebări înainte să poți discuta oferta: unde este lucrarea, ce există deja și ce trebuie făcut efectiv.",
          "O parte din aceste repere poate fi cerută chiar în pagina din care omul te contactează. O propoziție lângă buton îi arată cum să înceapă. El rămâne liber să te sune sau să-ți scrie, dar are acum un punct de orientare.",
          "Nu fiecare cerere va veni completă. Totuși, ai făcut vizibil ceva ce până atunci exista doar în întrebările tale de la telefon.",
        ],
      },
      {
        title: "Patru detalii care dau un început conversației.",
        paragraphs: [
          "Localitatea te ajută să stabilești dacă lucrarea este în zona ta. Tipul montajului arată serviciul de care este nevoie. Faptul că obiectul este sau nu cumpărat schimbă ce aveți de discutat mai departe. Fotografia oferă o primă vedere asupra locului.",
          "Pentru prima discuție, cere o fotografie de ansamblu a zonei relevante. Dacă ai nevoie de un anumit detaliu, îl poți solicita ulterior. O listă scurtă este mai ușor de urmat de cineva care nu știe încă ce contează tehnic.",
        ],
        items: [
          "Unde? Localitatea în care se află lucrarea.",
          "Ce? Obiectul sau intervenția dorită.",
          "Este cumpărat? Da, nu sau încă în alegere.",
          "Cum arată locul? O fotografie de ansamblu, dacă este posibil.",
        ],
      },
      {
        title: "Mesajul pe care îl poți pune chiar lângă contact.",
        paragraphs: [
          "Folosește o invitație pe care omul o poate urma fără explicații suplimentare. Lasă-i și posibilitatea să te contacteze dacă nu are toate informațiile.",
        ],
        example: {
          label: "Model de text pentru pagina ta",
          text: "Ai nevoie de un montaj? Spune-ne localitatea, ce vrei să montăm și dacă obiectul este deja cumpărat. Dacă poți, trimite și o fotografie de ansamblu a locului. Nu ai toate detaliile? Le discutăm la telefon.",
        },
      },
      {
        title: "Cum poate arăta răspunsul unui client.",
        paragraphs: [
          "Mai jos este un exemplu de mesaj construit după acele repere. Observă cât context încape în câteva rânduri, fără un formular lung.",
        ],
        example: {
          label: "Exemplu de mesaj, nu cerere reală",
          text: "Bună ziua! Lucrarea este în Brașov. Aș vrea să înlocuiesc lavoarul din baie. Lavoarul și bateria sunt cumpărate. Atașez o poză cu locul. Ce alte detalii vă sunt utile?",
        },
      },
      {
        title: "Fotografia deschide discuția. Evaluarea o duce mai departe.",
        paragraphs: [
          "Un astfel de mesaj îți oferă un punct de plecare. Poți cere dimensiuni, poți clarifica ce trebuie demontat și poți spune dacă este necesară o vizită. Oferta vine după ce ai informațiile de care ai nevoie.",
          "Pe site, explică acest lucru simplu: «Discutăm detaliile și stabilim ce trebuie evaluat înainte de ofertă.» Astfel, omul știe la ce să se aștepte când trimite fotografia.",
          "Pune invitația aproape de serviciul la care se referă și de contact. Dacă omul tocmai a citit despre montajul de obiecte sanitare, acolo este un loc firesc să afle și ce informații să pregătească.",
        ],
      },
      {
        title: "Pagina poate urma felul în care lucrezi deja.",
        paragraphs: [
          "Notează primele întrebări pe care le pui de obicei. Alege-le pe cele la care un client poate răspunde ușor înainte de discuție. Acesta poate fi începutul textului de lângă contact.",
          "Serviciile explicate, zona de lucru și câteva repere pentru cerere pot pregăti terenul pentru prima conversație. Tu continui de acolo cu experiența ta și cu întrebările potrivite fiecărei lucrări.",
        ],
      },
    ],
    bridge:
      "Tu ne spui cum preiei o lucrare și ce informații îți sunt utile la început. Noi construim pagina în jurul acestui proces: servicii explicate, repere pentru cerere și contact la îndemână.",
  },
];
