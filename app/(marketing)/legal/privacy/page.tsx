import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="container space-y-8 pb-16 pt-28">
        <div className="space-y-3">
          <Badge variant="ghost">Legal</Badge>
          <h1 className="font-display text-4xl font-semibold">Politica de Confidențialitate</h1>
          <p className="text-muted-foreground">
            Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">1. Operator de Date</h2>
            <p>
              Operatorul de date personale este <strong>IONESCU ALEXANDRU-MARIO PERSOANĂ FIZICĂ AUTORIZATĂ</strong>,
              cu sediul în București, Sector 1, Bulevardul Bucureștii Noi, Nr. 136, Parter, Ap. 5,
              CUI 52801591.
            </p>
            <p>
              Contact DPO: <Link href="mailto:alexionescu870@gmail.com" className="text-primary underline">alexionescu870@gmail.com</Link>
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">2. Datele pe Care le Colectăm</h2>
            <p>Colectăm următoarele categorii de date personale:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Date de identificare:</strong> nume, prenume, denumire firmă</li>
              <li><strong>Date de contact:</strong> adresă email, număr de telefon, adresă</li>
              <li><strong>Date de facturare:</strong> adresă de facturare, CUI (pentru persoane juridice)</li>
              <li><strong>Date tehnice:</strong> adresă IP, tip browser, date despre dispozitiv</li>
              <li><strong>Date din formular:</strong> răspunsurile din formularul Blueprint pentru crearea site-ului</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">3. Scopul și Temeiul Legal al Prelucrării</h2>
            <p>Prelucrăm datele personale pentru:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Executarea contractului</strong> (Art. 6(1)(b) GDPR): pentru furnizarea serviciilor comandate</li>
              <li><strong>Obligații legale</strong> (Art. 6(1)(c) GDPR): pentru conformarea cu cerințele fiscale și contabile</li>
              <li><strong>Interes legitim</strong> (Art. 6(1)(f) GDPR): pentru îmbunătățirea serviciilor și comunicări de suport</li>
              <li><strong>Consimțământ</strong> (Art. 6(1)(a) GDPR): pentru comunicări de marketing (doar cu acordul dvs.)</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">4. Stocarea și Securitatea Datelor</h2>
            <p>
              Datele sunt stocate pe servere securizate cu criptare în tranzit (SSL/TLS) și în repaus.
              Accesul este limitat la personalul autorizat și protejat prin autentificare multi-factor.
            </p>
            <p>
              Păstrăm datele pe durata relației contractuale și pentru perioada impusă de legislația fiscală
              (de regulă 10 ani pentru documente contabile).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">5. Transferul Datelor</h2>
            <p>
              Nu vindem și nu partajăm datele dvs. cu terți în scopuri publicitare.
              Putem partaja date cu:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Furnizori de servicii (găzduire, procesare plăți) în baza unor acorduri de prelucrare</li>
              <li>Autorități publice, când legea impune acest lucru</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">6. Cookie-uri</h2>
            <p>
              Operăm fără cookie-uri de tracking în mod implicit. Folosim doar cookie-uri esențiale
              pentru funcționarea site-ului (autentificare, sesiune). Dacă activăm analytics,
              aceste servicii pot seta propriile cookie-uri conform politicilor lor.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">7. Drepturile Dvs. (GDPR)</h2>
            <p>Conform Regulamentului GDPR, aveți următoarele drepturi:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Dreptul de acces:</strong> puteți solicita o copie a datelor personale</li>
              <li><strong>Dreptul la rectificare:</strong> puteți cere corectarea datelor inexacte</li>
              <li><strong>Dreptul la ștergere:</strong> puteți cere ștergerea datelor (&quot;dreptul de a fi uitat&quot;)</li>
              <li><strong>Dreptul la restricționare:</strong> puteți limita prelucrarea datelor</li>
              <li><strong>Dreptul la portabilitate:</strong> puteți primi datele într-un format structurat</li>
              <li><strong>Dreptul de opoziție:</strong> puteți obiecta la prelucrarea datelor</li>
              <li><strong>Dreptul de a retrage consimțământul:</strong> în orice moment, fără a afecta legalitatea prelucrării anterioare</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">8. Exercitarea Drepturilor</h2>
            <p>
              Pentru a vă exercita drepturile sau pentru orice întrebări privind datele personale,
              contactați-ne la:
            </p>
            <ul className="list-none space-y-1">
              <li>Email: <Link href="mailto:alexionescu870@gmail.com" className="text-primary underline">alexionescu870@gmail.com</Link></li>
              <li>Telefon: <Link href="tel:+40764902801" className="text-primary underline">+40 764 902 801</Link></li>
            </ul>
            <p className="mt-2">
              Vom răspunde în termen de 30 de zile. Exportul conținutului site-ului dvs. este disponibil;
              exportul complet poate fi achiziționat ca serviciu separat.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">9. Plângeri</h2>
            <p>
              Dacă considerați că prelucrarea datelor dvs. încalcă GDPR, aveți dreptul de a depune
              o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP):
            </p>
            <ul className="list-none space-y-1">
              <li>Website: <Link href="https://www.dataprotection.ro" className="text-primary underline" target="_blank">www.dataprotection.ro</Link></li>
              <li>Adresă: B-dul G-ral. Gheorghe Magheru 28-30, Sector 1, București</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
