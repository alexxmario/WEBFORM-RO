import { LeadForm } from "@/components/campaign/LeadForm";
import "@/app/instalatii/campaign.css";
import { DesignStudio } from "@/components/DesignStudio";
import { HomeMotion } from "@/components/HomeMotion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Globe2,
  MousePointer2,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  BadgePercent,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Plans } from "@/components/Plans";
import { FAQ } from "@/components/FAQ";
import { templateOptions } from "@/lib/templates";

export default function HomePage() {
  return (
    <>
      <Header />
      <HomeMotion />
      <main id="main" className="home-page">
        <section className="hero-wrap shell">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> SITE-UL TĂU. GRIJA NOASTRĂ.
            </p>
            <h1>
              O afacere bună
              <br />
              merită un site
              <br />
              <em>pe măsură.</em>
            </h1>
            <p className="hero-description">
              Îl construim. Îl găzduim. Îl ținem la zi.
              <br className="hidden sm:block" /> Un site profesionist, fără
              bătăi de cap.
              <br className="hidden sm:block" /> De la{" "}
              <strong>180 lei / lună.</strong>
            </p>
            <div className="hero-actions">
              <Link className="action action-dark" href="#plans">
                Alege site-ul tău <ArrowUpRight size={18} />
              </Link>
              <Link className="text-link" href="#design-studio">
                Explorează designul <ArrowRight size={17} />
              </Link>
            </div>
            <div className="hero-notes">
              <span>
                <Check size={14} /> Gata în 7 zile*
              </span>
              <span>
                <Check size={14} /> Găzduire inclusă
              </span>
              <span>
                <BadgePercent size={14} /> Cod WEBFORM20 · −20% la prima plată
              </span>
            </div>
          </div>
          <div className="hero-art hero-art-generated hero-editorial">
            <div className="art-caption">
              <span>O PRIMĂ IMPRESIE CARE RĂMÂNE</span>
              <span>WEBFORM STUDIO ↗</span>
            </div>
            <div className="hero-scene">
              <Image
                src="/images/architecture-editorial.png"
                alt="Concept vizual pentru arhitectură: vilă din piatră naturală, lumină și spațiu"
                width={1536}
                height={1024}
                priority
                sizes="(max-width: 760px) 100vw, 50vw"
              />
              <div className="hero-editorial-label"><small>FORMA / CONCEPT WEBFORM</small>Loc pentru<br />extraordinar.</div>
            </div>
            <div className="floating-note">
              <span className="note-icon">
                <Check size={20} />
              </span>
              <div>
                <strong>Din lumea ta. În lumea online.</strong>
                <span>Un site care arată cine ești.</span>
              </div>
            </div>
            <div className="art-bottom">
              <span>
                Tu conduci afacerea.
                <br />
                <strong>Noi ne ocupăm de site.</strong>
              </span>
              <span className="asterisk" aria-hidden="true">
                ✳
              </span>
            </div>
          </div>
        </section>
        <div className="benefit-strip">
          <div className="shell">
            <span>
              <Sparkles size={18} /> Design adaptat afacerii tale
            </span>
            <span>
              <Globe2 size={18} /> Domeniu & găzduire
            </span>
            <span>
              <ShieldCheck size={18} /> Securitate & mentenanță
            </span>
            <span>
              <MessageCircle size={18} /> Proiect și modificări în chat
            </span>
          </div>
        </div>
        <DesignStudio />
        <section className="campaign"><div className="shell campaign-section campaign-two"><div><p className="eyebrow">VEZI ÎNAINTE SĂ DECIZI</p><h2>Vrei să vezi site-ul înainte să plătești?</h2><p>Lasă-ne numărul și te sunăm.</p></div><LeadForm source="homepage" /></div></section>
        <section className="shell home-section" id="why-webform">
          <div className="section-heading">
            <div>
              <p className="eyebrow">MAI MULT DECÂT UN SITE</p>
              <h2>
                Ai deja un job.
                <br />
                Site-ul nu trebuie să fie al doilea.
              </h2>
            </div>
            <p>
              De la prima schiță la următoarea actualizare, ai o echipă care se
              ocupă de tot. Într-un singur abonament.
            </p>
          </div>
          <div className="value-grid">
            {[
              [
                "01",
                "Frumos. Și folositor.",
                "Un design care pune afacerea ta în valoare și îi ajută pe vizitatori să înțeleagă ce oferi și cum te pot contacta.",
              ],
              [
                "02",
                "Fără partea complicată.",
                "Domeniu, găzduire, certificat SSL și optimizare pentru mobil. Le configurăm și le gestionăm pentru tine.",
              ],
              [
                "03",
                "Rămânem alături de tine.",
                "Ai un serviciu nou sau alte fotografii? Ne scrii în chat. Noi facem modificările, tu îți vezi de afacere.",
              ],
            ].map(([n, title, text]) => (
              <article key={n}>
                <span className="number-label">{n} /</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="portfolio-section">
          <div className="shell home-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">UN PUNCT DE PLECARE BUN</p>
                <h2>Stilul tău. Amprenta ta.</h2>
              </div>
              <Link className="text-link" href="/templates">
                Explorează toate cele {templateOptions.length} modele{" "}
                <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="work-grid">
              {[
                {
                  id: "archito",
                  name: "Spațiu pentru idei mari.",
                  category: "ARHITECTURĂ & DESIGN",
                },
                {
                  id: "aether",
                  name: "Un brand care se simte.",
                  category: "BEAUTY & LIFESTYLE",
                },
                {
                  id: "faster",
                  name: "Energie, de la primul click.",
                  category: "SERVICII & BUSINESS",
                },
              ].map((t) => (
                <a
                  className="work-card"
                  key={t.id}
                  href={`/templates/${t.id}.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="work-image">
                    <Image
                      src={`/templates/${t.id}.png`}
                      width={640}
                      height={480}
                      alt={`Previzualizare model ${t.category.toLowerCase()}`}
                    />
                    <span className="work-arrow">
                      <ArrowUpRight size={22} />
                    </span>
                  </div>
                  <p className="eyebrow">{t.category}</p>
                  <h3>{t.name}</h3>
                </a>
              ))}
            </div>
            <p className="portfolio-note">
              Modele de design, personalizate cu textele, imaginile și
              identitatea afacerii tale.
            </p>
          </div>
        </section>
        <section className="client-proof-section" id="proiecte-reale">
          <div className="shell home-section client-proof-grid">
            <div>
              <p className="eyebrow">PROIECTE REALE, AFACERI REALE</p>
              <h2>Prezențe online<br />transformate.</h2>
              <p className="section-description">
                De la produse auto la experiențe culinare, construim site-uri care fac oferta mai clară și drumul clientului mai simplu.
              </p>
              <div className="client-logo-list">
                {[
                  {
                    name: "eNavigații",
                    detail: "E-commerce auto",
                    domain: "piloton.enavigatii.ro",
                    href: "https://piloton.enavigatii.ro",
                    logo: "/client-logos/enavigatii.webp",
                    width: 235,
                    height: 80,
                    dark: true,
                  },
                  {
                    name: "PilotOn Navi",
                    detail: "Catalog și vânzare online",
                    domain: "navi.piloton.ro",
                    href: "https://navi.piloton.ro",
                    logo: "/client-logos/piloton.png",
                    width: 202,
                    height: 62,
                    dark: false,
                  },
                  {
                    name: "Zaitoone",
                    detail: "Restaurant și experiență locală",
                    domain: "zaitoone.ro",
                    href: "https://zaitoone.ro",
                    logo: "/client-logos/zaitoone.png",
                    width: 104,
                    height: 100,
                    dark: true,
                  },
                ].map((project) => (
                  <a className="client-logo-row" href={project.href} key={project.name} target="_blank" rel="noopener noreferrer">
                    <span className={`client-logo-frame ${project.dark ? "client-logo-dark" : ""}`}>
                      <Image src={project.logo} alt={`${project.name} logo`} width={project.width} height={project.height} />
                    </span>
                    <span className="client-project-meta">
                      <strong>{project.name}</strong>
                      <small>{project.detail} · {project.domain}</small>
                    </span>
                    <ArrowUpRight size={18} />
                  </a>
                ))}
              </div>
            </div>
            <aside className="client-proof-stat">
              <span className="client-proof-number client-proof-number-traffic">50K+</span>
              <h3>vizite / lună</h3>
              <p>Trafic cumulat pentru proiectele prezentate, construite ca afacerile să fie găsite, înțelese și alese mai ușor.</p>
              <div className="client-proof-industries">
                <span>Automotive</span><span>E-commerce</span><span>HoReCa</span>
              </div>
            </aside>
          </div>
        </section>
        <section
          className="shell home-section process-section"
          id="how-it-works"
        >
          <div>
            <p className="eyebrow">SIMPLU, DE LA ÎNCEPUT</p>
            <h2>
              De la „am nevoie de un site”
              <br />
              la „suntem online”.
            </h2>
            <p className="section-description">
              Fără ședințe interminabile.
              <br />
              Fără termeni tehnici de descifrat.
            </p>
            <Link className="text-link" href="#plans">
              Hai să începem <ArrowRight size={18} />
            </Link>
            <figure className="craft-scene">
              <Image
                src="/images/website-crafted.png"
                alt="Textele și imaginile se reunesc într-un website complet, pregătit de lansare"
                width={1536}
                height={1024}
                sizes="(max-width: 760px) 100vw, 40vw"
              />
              <figcaption>
                De la materialele tale la un site gata de lansare.
              </figcaption>
            </figure>
          </div>
          <div className="process-steps">
            {[
              [
                "01",
                "Alegi serviciul potrivit.",
                "Alegi planul pentru site sau ceri o ofertă dacă ai nevoie de un magazin online.",
              ],
              [
                "02",
                "Completezi formularul scurt.",
                "Cinci răspunsuri scurte despre afacere, clienți și rezultatul pe care îl vrei.",
              ],
              [
                "03",
                "Salvăm proiectul și activezi planul.",
                "Vezi confirmarea proiectului, apoi faci plata securizată pentru planul ales.",
              ],
              [
                "04",
                "Intrăm în chat, construim și publicăm.",
                "Primești prima versiune în chat, trimiți modificările și rămânem acolo și după lansare.",
              ],
            ].map(([n, title, desc]) => (
              <article key={n}>
                <span>{n}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="chat-workflow-section" id="chat-workflow">
          <div className="shell home-section chat-workflow-grid">
            <div>
              <p className="eyebrow">UN SINGUR LOC PENTRU TOT PROIECTUL</p>
              <h2>Fără telefoane pierdute.<br />Fără conversații împrăștiate.</h2>
              <p className="section-description">
                După ce formularul este salvat și plata este confirmată, intri direct în chat-ul proiectului. Acolo discutăm detaliile, îți trimitem site-ul și notăm fiecare modificare.
              </p>
              <Link className="action action-dark" href="#plans">Începe proiectul <ArrowUpRight size={18} /></Link>
            </div>
            <div className="chat-workflow-card" aria-label="Exemplu de conversație în chat-ul proiectului">
              <div className="chat-workflow-head"><span className="status-dot" /> Chat proiect · Echipa WebForm</div>
              <div className="chat-bubble chat-bubble-team">Bine ai venit! Am primit formularul. Îl analizăm și revenim aici în cel mult o zi lucrătoare.</div>
              <div className="chat-bubble chat-bubble-client">Perfect. Pot să vă trimit aici și logo-ul nou?</div>
              <div className="chat-bubble chat-bubble-team">Da. Tot aici primești și prima versiune a site-ului pentru verificare.</div>
              <div className="chat-workflow-input">Scrie un mesaj… <MessageCircle size={17} /></div>
            </div>
          </div>
        </section>
        <section className="pricing-section" id="plans">
          <div className="shell home-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">UN ABONAMENT. TOTUL LA LOCUL LUI.</p>
                <h2>
                  Un site bun.
                  <br />
                  Un preț clar.
                </h2>
              </div>
              <p>
                Alege în funcție de ce are nevoie afacerea ta. Designul,
                găzduirea și administrarea sunt incluse în abonamente. Pentru magazin online pregătim o ofertă după nevoile tale.
              </p>
            </div>
            <Plans />
            <p className="pricing-footnote">
              * Prima versiune în 7 zile de la primirea formularului complet și
              a materialelor. Serviciile de găzduire și administrare sunt
              disponibile pe durata abonamentului.
            </p>
          </div>
        </section>
        <section className="shell home-section faq-section">
          <div>
            <p className="eyebrow">BINE DE ȘTIUT</p>
            <h2>
              Întrebări mici.
              <br />
              Răspunsuri clare.
            </h2>
            <p className="section-description">
              Mai ai o întrebare?{" "}
              <a href="mailto:alexionescu870@gmail.com" className="underline">
                Scrie-ne.
              </a>
            </p>
          </div>
          <FAQ />
        </section>
        <section className="shell final-cta">
          <div>
            <p className="eyebrow">URMĂTORUL PAS PENTRU AFACEREA TA</p>
            <h2>
              Tu ai viziunea.
              <br />
              Noi facem site-ul.
            </h2>
          </div>
          <Link href="#plans" className="action action-dark">
            Găsește planul potrivit <ArrowUpRight size={20} />
          </Link>
          <MousePointer2
            className="cta-pointer"
            size={90}
            strokeWidth={1}
            aria-hidden="true"
          />
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
