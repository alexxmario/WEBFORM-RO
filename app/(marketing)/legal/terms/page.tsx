import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="container space-y-8 pb-16 pt-28">
        <div className="space-y-3">
          <Badge variant="ghost">Legal</Badge>
          <h1 className="font-display text-4xl font-semibold">Termeni și Condiții</h1>
          <p className="text-muted-foreground">
            Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">1. Informații despre Furnizor</h2>
            <p>
              Serviciile sunt furnizate de <strong>IONESCU ALEXANDRU-MARIO PERSOANĂ FIZICĂ AUTORIZATĂ</strong>,
              cu sediul în București, Sector 1, Bulevardul Bucureștii Noi, Nr. 136, Parter, Ap. 5,
              înregistrată cu CUI 52801591, Nr. Registrul Comerțului F2025043137007.
            </p>
            <p>
              Contact: <Link href="tel:+40764902801" className="text-primary underline">+40 764 902 801</Link>,
              Email: <Link href="mailto:alexionescu870@gmail.com" className="text-primary underline">alexionescu870@gmail.com</Link>
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">2. Descrierea Serviciilor</h2>
            <p>
              WebForm oferă servicii de creare, găzduire și gestionare a site-urilor web pe bază de abonament.
              Serviciile includ:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Design și dezvoltare site web personalizat</li>
              <li>Găzduire web securizată cu certificat SSL</li>
              <li>Înregistrare și gestionare domeniu</li>
              <li>Actualizări și modificări ale conținutului</li>
              <li>Suport tehnic și mentenanță</li>
              <li>Optimizare SEO de bază</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">3. Prețuri și Modalități de Plată</h2>
            <p>
              Toate prețurile sunt afișate în RON (Lei românești) și includ TVA acolo unde este aplicabil.
              Plățile se efectuează online prin card bancar sau transfer bancar.
            </p>
            <p>
              Abonamentul se facturează lunar. Taxele de setup sunt plătite o singură dată la începutul serviciului.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">4. Livrarea Serviciilor</h2>
            <p>
              Site-ul web va fi livrat în maximum 7 zile lucrătoare de la primirea și aprobarea
              formularului complet (Blueprint). Actualizările sunt procesate în 2-3 zile lucrătoare
              în funcție de planul ales.
            </p>
            <p>
              Pentru detalii complete, consultați{" "}
              <Link href="/legal/delivery" className="text-primary underline">
                Politica de Livrare
              </Link>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">5. Găzduire și Domeniu</h2>
            <p>
              Găzduirea, certificatul SSL și un domeniu sunt incluse în abonament.
              Anularea abonamentului duce la dezactivarea găzduirii și site-ul devine inaccesibil.
              Putem conecta domeniul dvs. existent la cerere.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">6. Dreptul de Retragere și Anulare</h2>
            <p>
              Aveți dreptul de a anula abonamentul în orice moment. Facturarea se oprește la
              sfârșitul perioadei curente de facturare. După anulare, site-ul este dezactivat
              și găzduirea încetează.
            </p>
            <p>
              Conform legislației privind protecția consumatorilor, aveți dreptul de retragere în
              termen de 14 zile de la achiziție, cu excepția cazului în care serviciul a fost deja prestat.
            </p>
            <p>
              Pentru detalii complete, consultați{" "}
              <Link href="/legal/cancellation" className="text-primary underline">
                Politica de Anulare
              </Link>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">7. Proprietatea Conținutului</h2>
            <p>
              Rămâneți proprietarul conținutului și al materialelor de brand pe care ni le furnizați.
              WebForm păstrează proprietatea intelectuală asupra platformei și infrastructurii tehnice.
              Exportul conținutului este disponibil; exportul complet al site-ului poate fi achiziționat
              ca serviciu separat.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">8. Protecția Datelor</h2>
            <p>
              Prelucrăm datele personale în conformitate cu Regulamentul General privind Protecția
              Datelor (GDPR). Pentru detalii complete, consultați{" "}
              <Link href="/legal/privacy" className="text-primary underline">
                Politica de Confidențialitate
              </Link>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">9. Limitarea Răspunderii</h2>
            <p>
              WebForm nu este responsabil pentru pierderi indirecte, întreruperi ale serviciului
              din motive independente de voința noastră, sau pentru conținutul furnizat de client.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">10. Legislație Aplicabilă</h2>
            <p>
              Acești termeni sunt guvernați de legislația română. Orice dispută va fi soluționată
              de instanțele competente din București, România.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">11. Contact</h2>
            <p>
              Pentru întrebări sau reclamații, ne puteți contacta la:
            </p>
            <ul className="list-none space-y-1">
              <li>Email: <Link href="mailto:alexionescu870@gmail.com" className="text-primary underline">alexionescu870@gmail.com</Link></li>
              <li>Telefon: <Link href="tel:+40764902801" className="text-primary underline">+40 764 902 801</Link></li>
              <li>Adresă: Bulevardul Bucureștii Noi, Nr. 136, Parter, Ap. 5, Sector 1, București</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
