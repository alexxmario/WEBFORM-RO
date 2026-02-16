import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";

export default function DeliveryPage() {
  return (
    <>
      <Header />
      <main className="container space-y-8 pb-16 pt-28">
        <div className="space-y-3">
          <Badge variant="ghost">Legal</Badge>
          <h1 className="font-display text-4xl font-semibold">Politica de Livrare</h1>
          <p className="text-muted-foreground">
            Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">1. Natura Serviciilor</h2>
            <p>
              WebForm oferă servicii digitale de creare și gestionare a site-urilor web.
              Toate serviciile sunt livrate electronic, fără livrare fizică de produse.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">2. Procesul de Livrare</h2>
            <p>Livrarea serviciilor urmează următorii pași:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <strong>Completarea formularului:</strong> Completați formularul Blueprint cu
                informațiile despre afacerea dvs., preferințe de design și funcționalități dorite.
              </li>
              <li>
                <strong>Confirmarea plății:</strong> După efectuarea plății, veți primi
                confirmarea prin email.
              </li>
              <li>
                <strong>Dezvoltarea site-ului:</strong> Echipa noastră începe lucrul la
                site-ul dvs. bazându-se pe informațiile furnizate.
              </li>
              <li>
                <strong>Prezentare și feedback:</strong> Vă prezentăm site-ul pentru aprobare
                și efectuăm ajustările necesare.
              </li>
              <li>
                <strong>Lansare:</strong> După aprobarea finală, site-ul este publicat și
                devine accesibil online.
              </li>
            </ol>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">3. Termene de Livrare</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border/60 rounded-lg">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="border border-border/60 px-4 py-2 text-left text-foreground">Serviciu</th>
                    <th className="border border-border/60 px-4 py-2 text-left text-foreground">Termen</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border/60 px-4 py-2">Lansare site nou</td>
                    <td className="border border-border/60 px-4 py-2">7 zile lucrătoare</td>
                  </tr>
                  <tr>
                    <td className="border border-border/60 px-4 py-2">Actualizări (Plan Start)</td>
                    <td className="border border-border/60 px-4 py-2">3 zile lucrătoare</td>
                  </tr>
                  <tr>
                    <td className="border border-border/60 px-4 py-2">Actualizări (Plan Business)</td>
                    <td className="border border-border/60 px-4 py-2">2 zile lucrătoare</td>
                  </tr>
                  <tr>
                    <td className="border border-border/60 px-4 py-2">Actualizări (Plan Premium)</td>
                    <td className="border border-border/60 px-4 py-2">24 ore</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2">
              Termenele încep de la primirea formularului complet și confirmarea plății.
              Zilele lucrătoare sunt de luni până vineri, exclusiv sărbătorile legale.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">4. Condiții pentru Livrare</h2>
            <p>Pentru a respecta termenele de livrare, aveți următoarele responsabilități:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Furnizarea informațiilor complete și corecte în formular</li>
              <li>Răspunsuri prompte la solicitările de clarificare (în termen de 48 ore)</li>
              <li>Furnizarea materialelor necesare (logo, texte, imagini) la timp</li>
              <li>Feedback și aprobare în termen rezonabil</li>
            </ul>
            <p className="mt-2">
              Întârzierile cauzate de lipsa răspunsurilor sau materialelor din partea clientului
              nu sunt incluse în termenele de livrare.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">5. Confirmarea Livrării</h2>
            <p>
              Veți primi notificare prin email când site-ul este gata pentru revizuire și
              când este lansat public. Accesul la panoul de suport este disponibil imediat
              după confirmarea plății.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">6. Probleme cu Livrarea</h2>
            <p>
              În cazul oricăror întârzieri sau probleme, vă vom notifica proactiv și vom
              colabora pentru găsirea unei soluții. Pentru reclamații sau întrebări,
              contactați-ne la:
            </p>
            <ul className="list-none space-y-1">
              <li>Email: <Link href="mailto:alexionescu870@gmail.com" className="text-primary underline">alexionescu870@gmail.com</Link></li>
              <li>Telefon: <Link href="tel:+40764902801" className="text-primary underline">+40 764 902 801</Link></li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
