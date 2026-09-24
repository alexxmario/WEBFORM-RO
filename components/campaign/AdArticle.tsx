import Image from "next/image";
import { StickyLeadButton } from "./StickyLeadButton";
import { Demo } from "./Demo";
import { LeadForm } from "./LeadForm";
import styles from "./ad-article.module.css";

type Section = { title: string; paragraphs: string[] };
export function AdArticle({ title, intro, sections, slug, image, installerDemo = false }: {
  installerDemo?: boolean; title: string; intro: string[]; sections: Section[]; slug: string;
  image?: { src: string; width: number; height: number; alt: string };
}) {
  const offer = <>
    <strong>Construcția site-ului: 0 lei</strong>
    <p>Vezi site-ul înainte să plătești. Nu-ți place? Nu plătești nimic.</p>
    <p><b>Live în 7 zile</b></p>
    <p>180 lei/lună – hosting, domeniu, SSL și modificări incluse</p>
    <a className={styles.button} href="#formular">Vreau site-ul meu</a>
    <small>Termenul începe după discuție și primirea materialelor; publicarea necesită aprobarea și plata ta.</small>
  </>;
  return <div className={styles.page}>
    <main id="main" className={styles.main}>
      <article>
        <h1>{title}</h1>
        <div className={styles.intro}>{intro.map(p=><p key={p}>{p}</p>)}</div>
        <aside id="oferta-initiala" className={styles.offer} aria-label="Oferta WebForm">{offer}</aside>
        <div className={styles.reading}>{sections.slice(0,4).map(s=><section key={s.title}><h2>{s.title}</h2>{s.paragraphs.map(p=><p key={p}>{p}</p>)}</section>)}</div>
        {installerDemo && <section className={styles.demo}><h2>Așa poate arăta site-ul tău</h2><Demo /><p>Model demonstrativ. Site-ul tău va avea numele, serviciile și fotografiile tale.</p></section>}
        {image && <figure className={styles.figure}><Image {...image} alt={image.alt} sizes="(max-width: 640px) calc(100vw - 32px), 560px" /><figcaption>Exemplu vizual pentru prezentarea serviciilor tale.</figcaption></figure>}
        <section className={styles.steps}>
          <h2>Explici. Aprobi. Te relaxezi.</h2>
          <p><b>1. Explici.</b> Vorbim despre serviciile și zona ta. Ne trimiți fotografiile, noi pregătim textele și site-ul.</p>
          <p><b>2. Aprobi.</b> Vezi propunerea înainte de plată. Dacă îți place, o aprobăm împreună și o publicăm după plată.</p>
          <p><b>3. Te relaxezi.</b> Noi asigurăm găzduirea, domeniul, SSL și modificările incluse. În Start: actualizări în 7 zile, o cerere activă.</p>
        </section>
        <aside className={styles.offer} aria-label="Oferta înainte de formular">{offer}</aside>
        <section id="formular" className={styles.form}>
          <h2>Vreau site-ul meu</h2>
          <p>Lasă-ne datele. Te contactăm să discutăm despre site, fără plată acum.</p>
          <LeadForm source="instalatii" articleSlug={slug} landing />
        </section>
        <section className={styles.faq}>
          <h2>Întrebări frecvente</h2>
          <details><summary>Care e condiția?</summary><p>180 lei/lună, fără perioadă minimă contractuală. Abonamentul începe după ce accepți site-ul și plătești.</p></details>
          <details><summary>Al cui e domeniul?</summary><p>Al tău. Rămâne al tău și după încheierea colaborării.</p></details>
          <details><summary>Ce se întâmplă dacă nu-mi place site-ul?</summary><p>Nu plătești nimic.</p></details>
        </section>
      </article>
      <footer>WebForm · Site-uri pentru afacerea ta</footer>
    </main>
    <StickyLeadButton key={slug} />
  </div>;
}
