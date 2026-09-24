import Link from "next/link";
import { campaignConfig } from "@/lib/campaign/config";
import { CampaignLead } from "@/components/campaign/CampaignLead";
import styles from "../articole/article.module.css";
import local from "./landing-article.module.css";

export const dynamic = "force-dynamic";

export default function Page() {
  const c = campaignConfig();
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="WebForm — pagina principală"><em>web</em>form.</Link>
        <span>SITE-URI PENTRU INSTALATORI</span>
      </header>
      <main id="main" className={styles.main}>
        <article>
          <div className={styles.eyebrow}>TU AI MESERIA. NOI O PUNEM ONLINE.</div>
          <h1>Clientul cu țeava spartă te caută pe Google. Te găsește?</h1>
          <p className={styles.meta}>De echipa WebForm · Un site pentru meseria ta</p>
          <div className={styles.body}>
            <p>Când apare o problemă la instalație, omul vrea să afle repede pe cine poate suna.</p>
            <p>Ce lucrări faci? În ce zonă te deplasezi?</p>
            <p>Și cum poate lua legătura cu tine?</p>
            <p>Poate a primit numărul tău de la un vecin. Sau poate încearcă să găsească un instalator online.</p>
            <p>Un site îi oferă un loc în care să vadă aceste informații împreună.</p>
            <p>Cu numele tău, serviciile tale și fotografii din lucrările pe care le-ai făcut.</p>

            <h2>Tu știi meserie. Dar când să te ocupi și de site?</h2>
            <p>Între deplasări, lucrări și telefoane, este ușor să lași prezentarea afacerii pentru mai târziu.</p>
            <p>Mai ales dacă pare că trebuie să înveți o platformă, să scrii texte și să aranjezi singur fotografiile.</p>
            <p>La WebForm, poți începe cu o discuție de aproximativ 15 minute.</p>
            <p>Ne spui ce servicii faci și unde lucrezi. Ne trimiți câteva fotografii cu lucrări pe WhatsApp.</p>
            <p>Noi pregătim textele, designul și site-ul.</p>
            <p>Tu vezi rezultatul înainte să decizi și să plătești.</p>

            <h2>Ce ar trebui să găsească omul pe site-ul tău?</h2>
            <p>În primul rând, serviciile pe care le oferi, explicate simplu.</p>
            <p>Instalații sanitare, termice, centrale sau alte lucrări pe care le faci.</p>
            <p>Apoi, zona în care te deplasezi și câteva fotografii relevante din munca ta.</p>
            <p>Un buton de apel și unul de WhatsApp fac pasul următor ușor de găsit.</p>
            <p>Omul poate vedea dacă îl poți ajuta și te poate contacta pentru detalii.</p>
            <p>Site-ul nu garantează clienți sau o anumită poziție în Google. Îți oferă însă o prezentare clară, pe care o poți trimite și odată cu o recomandare.</p>
          </div>

          <section className={styles.offer} aria-label="Oferta WebForm pentru instalatori">
            <div className={styles.eyebrow}>CUM TE AJUTĂ WEBFORM</div>
            <section>
              <h2>0 lei avans. Vezi întâi, decizi apoi.</h2>
              <p>Construim site-ul fără cost inițial de realizare.</p>
              <p>Dacă îți place și vrei să îl publicăm, plătești abonamentul de 180 lei/lună.</p>
              <p>Dacă nu îți place, nu plătești nimic.</p>
              <p>Abonamentul nu are perioadă minimă contractuală și nici taxă de anulare anticipată.</p>
            </section>
            <section>
              <h2>Ne povestești.</h2>
              <p>Completezi formularul de la finalul paginii. Te contactăm și vorbim despre serviciile tale.</p>
              <p>Discuția durează aproximativ 15 minute. Noi scriem textele pornind de la ce ne spui.</p>
              <p>Ne trimiți fotografiile cu lucrări pe WhatsApp.</p>
            </section>
            <section>
              <h2>Vezi site-ul.</h2>
              <p>În maximum 7 zile de la discuție și primirea fotografiilor, îți trimitem site-ul pentru verificare.</p>
              <p>Îl poți parcurge și ne poți spune ce trebuie ajustat.</p>
              <p>Dacă depășim acest termen, prima lună este gratuită.</p>
              <p>După ce îl accepți și plătești, îl publicăm pe domeniul tău.</p>
            </section>
            <section>
              <h2>Noi îl administrăm.</h2>
              <p>Planul Start include un site de până la 3 pagini, domeniu, găzduire și certificat SSL.</p>
              <p>Site-ul este adaptat pentru telefon și include butoane de apel și WhatsApp.</p>
              <p>Te ajutăm și cu profilul Google Business, pentru prezența afacerii pe Google Maps.</p>
              <p>Când ai nevoie de o actualizare de conținut, ne trimiți cererea.</p>
              <p>În planul Start, actualizările sunt livrate în 7 zile, cu o cerere activă. Lucrările mai ample se discută separat.</p>
              <p>Găzduirea și administrarea sunt disponibile pe durata abonamentului.</p>
              <p>Domeniul este al tău. Rămâne al tău și dacă închei colaborarea.</p>
              <p>La plata anuală ai o reducere de 25%{c.bonus ? ` și ${c.bonus}` : ""}.</p>
            </section>
            <section>
              <h2>Vezi cum poate arăta.</h2>
              <p>Am pregătit un site demonstrativ pentru un instalator.</p>
              <p>Al tău va avea numele, serviciile și fotografiile afacerii tale.</p>
              <p><Link href="/instalatii/exemplu" className={styles.secondary}>Deschide site-ul demonstrativ →</Link></p>
            </section>
            <section>
              <h2>Începem cu o discuție despre meseria ta.</h2>
              <p>Lasă-ne numărul în formularul de mai jos și spune-ne în ce oraș lucrezi.</p>
              <p>Te vom contacta pentru a discuta despre site.</p>
              <p>Fără plată și fără obligații acum. Vezi întâi propunerea, apoi decizi.</p>
            </section>
            <div id="formular" className={`${styles.form} ${local.form}`}>
              <CampaignLead whatsapp={c.whatsapp} />
            </div>
          </section>
        </article>
      </main>
      <footer className={styles.footer}>
        <Link href="/" className={styles.brand}>webform.</Link>
        <span>© {new Date().getFullYear()} WebForm</span>
        <Link href="/legal/privacy">Confidențialitate</Link>
        <Link href="/legal/terms">Termeni</Link>
      </footer>
    </div>
  );
}
