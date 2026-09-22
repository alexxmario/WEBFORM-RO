import Link from "next/link";
import { campaignConfig } from "@/lib/campaign/config";
import { CampaignLead } from "@/components/campaign/CampaignLead";
import { Demo } from "@/components/campaign/Demo";
export const dynamic = "force-dynamic";
export default function Page() {
  const c = campaignConfig();
  return (
    <div className="campaign">
      <header className="shell campaign-header">
        <Link href="/" className="campaign-brand">
          webform<span>®</span>
        </Link>
        <span>SITE-URI PENTRU INSTALATORI</span>
      </header>
      <main id="main">
        <section className="shell campaign-hero">
          <div>
            <p className="eyebrow">
              <span className="status-dot" /> TU REPARI. NOI TE PUNEM ONLINE.
            </p>
            <h1>
              Clientul cu țeava spartă te caută pe Google. <em>Te găsește?</em>
            </h1>
            <p className="campaign-intro">
              Îți facem site-ul gratuit. Plătești doar abonamentul de{" "}
              <strong>180 lei/lună</strong> – hosting, domeniu, SSL și
              modificări incluse.
            </p>
            <p className="campaign-benefits">
              0 lei avans · Live în 7 zile · Plătești doar dacă-ți place
            </p>
            <a href="#formular" className="action action-dark">
              Vreau site-ul meu ↗
            </a>
            <p className="campaign-small">
              Vezi site-ul înainte de plată.
            </p>
          </div>
          <div className="campaign-phone-wrap">
            <div className="campaign-phone">
              <div className="phone-speaker" />
              <Demo />
            </div>
            <span className="campaign-phone-note">
              Așa poate arăta
              <br />
              <strong>următorul tău început.</strong> ↗
            </span>
          </div>
        </section>
        <section className="campaign-tint">
          <div className="shell campaign-section campaign-two">
            <div>
              <p className="eyebrow">TOT CE AI NEVOIE</p>
              <h2>
                Tu știi meserie.
                <br />
                <em>Noi știm site-uri.</em>
              </h2>
              <p>
                Un loc al tău pe internet, pregătit să transforme vizitele în
                apeluri.
              </p>
            </div>
            <ul className="campaign-checks">
              {[
                "Construcția site-ului: 0 lei",
                "Tu ne dai 15 minute la telefon, noi scriem textele",
                "Live în 7 zile, altfel prima lună e gratuită",
                "Vezi site-ul înainte să plătești. Nu-ți place? Nu plătești nimic.",
                "Bonus: te punem pe Google Maps (profil Google Business)",
                "Buton de apel și WhatsApp direct pe site",
                `Bonus la plata anuală: 25% reducere${c.bonus ? ` + ${c.bonus}` : ""}`,
              ].map((text) => (
                <li key={text}>
                  <span>✓</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="shell campaign-section campaign-calculation">
          <p className="eyebrow">UN CALCUL SIMPLU</p>
          <h2>O singură intervenție îți plătește site-ul pe o lună.</h2>
          <p>
            180 lei/lună pentru un site care prezintă serviciile tale și face
            contactul mai simplu.
          </p>
          <small>
            Calcul ilustrativ pentru o intervenție de 180 lei; numărul de
            clienți nu este garantat.
          </small>
        </section>
        <section className="shell campaign-section">
          <p className="eyebrow">CUM FUNCȚIONEAZĂ</p>
          <h2>
            De la un telefon.
            <br />
            <em>La site-ul tău.</em>
          </h2>
          <div className="campaign-steps">
            {[
              "Completezi formularul (30 de secunde)",
              "Te sunăm și vorbim 15 minute",
              "În maximum 7 zile îți trimitem site-ul pe WhatsApp",
              "Dacă îți place, plătești și îl punem live pe domeniul tău",
            ].map((t, i) => (
              <article key={t}>
                <span>0{i + 1} /</span>
                <h3>{t}</h3>
              </article>
            ))}
          </div>
          <p className="campaign-small">
            Cele 7 zile se calculează după discuția telefonică și primirea
            pozelor.
          </p>
        </section>
        <section className="campaign-tint">
          <div className="shell campaign-section campaign-two">
            <Demo />
            <div>
              <p className="eyebrow">VEZI ÎNAINTE SĂ DECIZI</p>
              <h2>
                Un site pentru
                <br />
                <em>meseria ta.</em>
              </h2>
              <p>
                Acesta este un model demonstrativ. Al tău va avea numele,
                serviciile și fotografiile afacerii tale.
              </p>
              <Link
                className="action action-dark"
                href="/instalatii/exemplu"
                target="_blank"
              >
                Vezi exemplul ↗
              </Link>
            </div>
          </div>
        </section>
        <section className="shell campaign-section">
          <p className="eyebrow">LUCRĂM CU GRIJĂ, PE RÂND</p>
          <h2>Facem doar 2 site-uri pe zi.</h2>
          <p>Lasă-ne numărul și stabilim împreună următorul pas.</p>
          <div className="faq-list campaign-faq">
            {[
              [
                "Care e condiția?",
                "Abonament de 180 lei/lună, fără perioadă minimă contractuală și fără taxă de anulare anticipată.",
              ],
              ["Al cui e domeniul?", "Al tău. Rămâne al tău și dacă pleci."],
              [
                "Ce modificări sunt incluse?",
                "În Start: actualizări în 7 zile, o cerere activă. În Business: actualizări în 3 zile, două cereri active. Lucrările mai ample se discută separat.",
              ],
              [
                "Ce se întâmplă dacă nu-mi place site-ul?",
                "Nu plătești nimic.",
              ],
              [
                "Trebuie să scriu eu ceva?",
                "Nu. Ne spui la telefon, noi scriem. Ne trimiți doar câteva poze cu lucrări pe WhatsApp.",
              ],
              [
                "Cum funcționează garanția de 7 zile?",
                "Se calculează din momentul în care am vorbit la telefon și am primit pozele. Dacă depășim termenul, prima lună e gratuită.",
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section id="formular" className="campaign-tint">
          <div className="shell campaign-section campaign-two">
            <div>
              <p className="eyebrow">ÎNCEPE CU UN SALUT</p>
              <h2>
                Următorul client
                <br />
                <em>să te găsească.</em>
              </h2>
              <p>Lasă-ne numărul. Noi venim cu ideile, textele și site-ul.</p>
              <p>
                <strong>0 lei avans. Vezi întâi, decizi apoi.</strong>
              </p>
            </div>
            <CampaignLead whatsapp={c.whatsapp} />
          </div>
        </section>
      </main>
      <footer className="shell campaign-footer">
        <span>© {new Date().getFullYear()} WebForm</span>
        <Link href="/legal/privacy">Confidențialitate</Link>
        <Link href="/legal/terms">Termeni</Link>
      </footer>
      <nav className="campaign-sticky" aria-label="Contact rapid">
        <a href="#formular">Vreau site-ul ↗</a>
        {c.whatsapp && <a href={`https://wa.me/${c.whatsapp}`}>WhatsApp ↗</a>}
      </nav>
    </div>
  );
}
