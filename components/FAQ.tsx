const faqs = [
  [
    "Ce este inclus în abonament?",
    "Construirea site-ului pe baza unui model ales de tine, adaptarea la afacerea ta, găzduire, domeniu, SSL și administrare. Numărul de pagini și ritmul actualizărilor depind de planul ales.",
  ],
  [
    "Trebuie să știu ceva despre site-uri?",
    "Nu. Completezi formularul cu informații despre afacerea ta și ne trimiți materialele. Noi ne ocupăm de design și de partea tehnică. Comunici cu noi direct în chat.",
  ],
  [
    "În cât timp este gata site-ul?",
    "Prima versiune este gata în 7 zile după ce primim formularul complet, textele și imaginile necesare. Îți trimitem site-ul pentru verificare înainte de publicare.",
  ],
  [
    "Pot să modific site-ul după lansare?",
    "Da. Trimiți cererile în chat: texte, imagini sau modificări de conținut. Pe Start, actualizările sunt livrate în 7 zile, iar pe Business în 3 zile. Lucrările mai ample sunt discutate separat.",
  ],
  [
    "Pot folosi domeniul pe care îl am deja?",
    "Da. Conectăm domeniul existent la noul site. Dacă nu ai unul, te ajutăm cu alegerea și configurarea lui.",
  ],
  [
    "Ce se întâmplă dacă anulez?",
    "Poți anula din cont. Site-ul rămâne disponibil până la sfârșitul perioadei plătite, apoi găzduirea și administrarea se opresc. Pentru mutarea site-ului, discutăm separat opțiunile de export.",
  ],
];
export function FAQ() {
  return (
    <div className="faq-list">
      {faqs.map(([q, a]) => (
        <details key={q}>
          <summary>
            {q}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
