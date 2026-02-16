import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";

export default function CancellationPage() {
  return (
    <>
      <Header />
      <main className="container space-y-8 pb-16 pt-28">
        <div className="space-y-3">
          <Badge variant="ghost">Legal</Badge>
          <h1 className="font-display text-4xl font-semibold">Politica de Anulare și Rambursare</h1>
          <p className="text-muted-foreground">
            Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">1. Dreptul de Retragere (14 zile)</h2>
            <p>
              Conform OUG 34/2014 privind drepturile consumatorilor, aveți dreptul de a vă retrage
              din contract în termen de <strong>14 zile calendaristice</strong> de la data încheierii
              contractului, fără a fi nevoie să justificați decizia.
            </p>
            <p className="mt-2">
              <strong>Excepție:</strong> Dreptul de retragere nu se aplică dacă serviciul a fost
              complet prestat înainte de expirarea perioadei de retragere și prestarea a început
              cu acordul dvs. expres, cu recunoașterea pierderii dreptului de retragere odată cu
              executarea completă a contractului.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">2. Cum să Vă Retrageți</h2>
            <p>
              Pentru a vă exercita dreptul de retragere, trebuie să ne informați printr-o declarație
              clară (de exemplu, o scrisoare trimisă prin poștă sau email). Puteți utiliza următorul
              model, dar nu este obligatoriu:
            </p>
            <div className="bg-muted/30 p-4 rounded-lg mt-2">
              <p className="italic">
                &quot;Subsemnatul/Subsemnata [Nume], vă informez prin prezenta despre retragerea mea
                din contractul pentru prestarea serviciului WebForm. Data comenzii: [Data].
                Nume: [Nume complet]. Adresă: [Adresă]. Semnătură (doar pentru comunicări pe hârtie).
                Data: [Data].&quot;
              </p>
            </div>
            <p className="mt-2">Trimiteți la:</p>
            <ul className="list-none space-y-1">
              <li>Email: <Link href="mailto:alexionescu870@gmail.com" className="text-primary underline">alexionescu870@gmail.com</Link></li>
              <li>Adresă: Bulevardul Bucureștii Noi, Nr. 136, Parter, Ap. 5, Sector 1, București</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">3. Efectele Retragerii</h2>
            <p>
              În cazul retragerii, vă vom rambursa toate plățile primite în termen de maximum
              <strong> 14 zile</strong> de la data la care am fost informați despre decizia dvs.
              de retragere.
            </p>
            <p className="mt-2">
              Rambursarea se va efectua folosind aceeași metodă de plată utilizată pentru
              tranzacția inițială, cu excepția cazului în care ați convenit altfel.
            </p>
            <p className="mt-2">
              Dacă ați solicitat începerea prestării serviciilor în perioada de retragere,
              ne veți plăti o sumă proporțională cu serviciile prestate până la momentul
              comunicării retragerii.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">4. Anularea Abonamentului</h2>
            <p>
              Puteți anula abonamentul lunar în orice moment. Anularea produce efecte
              la sfârșitul perioadei de facturare curente:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Facturarea se oprește începând cu următoarea perioadă</li>
              <li>Accesul la servicii continuă până la sfârșitul perioadei plătite</li>
              <li>După expirare, site-ul este dezactivat și găzduirea încetează</li>
              <li>Nu se oferă rambursări pentru perioada neutilizată din luna curentă</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">5. Taxele de Setup</h2>
            <p>
              Taxele de setup (configurare inițială) sunt plătite o singură dată și nu sunt
              rambursabile după începerea lucrărilor la site, deoarece acoperă munca de design
              și dezvoltare deja efectuată.
            </p>
            <p className="mt-2">
              În cazul retragerii în termen de 14 zile înainte de începerea lucrărilor,
              taxa de setup este rambursată integral.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">6. Exportul Datelor</h2>
            <p>
              La anulare, aveți dreptul să solicitați exportul conținutului dvs. (texte, imagini furnizate).
              Exportul complet al site-ului (cod sursă, design) poate fi achiziționat ca serviciu separat.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">7. Cum să Anulați</h2>
            <p>Pentru a anula abonamentul, contactați-ne la:</p>
            <ul className="list-none space-y-1">
              <li>Email: <Link href="mailto:alexionescu870@gmail.com" className="text-primary underline">alexionescu870@gmail.com</Link></li>
              <li>Telefon: <Link href="tel:+40764902801" className="text-primary underline">+40 764 902 801</Link></li>
              <li>Sau prin panoul de suport din contul dvs.</li>
            </ul>
            <p className="mt-2">
              Vă vom confirma anularea prin email în termen de 24 de ore.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">8. Contact pentru Reclamații</h2>
            <p>
              Pentru orice nemulțumiri sau reclamații privind serviciile noastre, vă rugăm
              să ne contactați. Ne angajăm să răspundem în termen de 48 de ore și să găsim
              o soluție echitabilă.
            </p>
            <p className="mt-2">
              De asemenea, aveți dreptul de a vă adresa Autorității Naționale pentru Protecția
              Consumatorilor (ANPC) sau instanțelor competente.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
