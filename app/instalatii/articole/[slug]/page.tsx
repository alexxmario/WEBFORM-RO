import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "../articles";
import { campaignConfig } from "@/lib/campaign/config";
import styles from "../article.module.css";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = articles.find((item) => item.slug === slug);
  if (!entry) return { title: "Articol negăsit | WebForm" };
  return {
    title: `${entry.title} | WebForm`,
    description: entry.intro,
    openGraph: {
      title: entry.title,
      description: entry.intro,
      type: "article",
      images: [
        {
          url: `/images/articole-instalatori/${entry.image}.png`,
          width: 1200,
          height: 628,
          alt: entry.alt,
        },
      ],
    },
  };
}

export default async function ArticlePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  const incoming = await searchParams;
  const attribution = new URLSearchParams();
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "fbclid",
  ]) {
    const value = incoming[key];
    if (typeof value === "string" && value) attribution.set(key, value);
  }
  if (!attribution.has("utm_content"))
    attribution.set("utm_content", `instalatori-ad-${article.ad}`);
  const config = campaignConfig();
  const words = [
    article.intro,
    ...article.sections.flatMap((s) => [
      s.title,
      ...s.paragraphs,
      ...(s.items || []),
      s.example?.text || "",
    ]),
  ]
    .join(" ")
    .split(/\s+/).length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link
          href="/"
          aria-label="WebForm — pagina principală"
          className={styles.brand}
        >
          <em>web</em>form.
        </Link>
        <span>IDEI PENTRU INSTALATORI</span>
      </header>
      <main id="main">
        <article>
          <div className={styles.hero}>
            <p className={styles.eyebrow}>{article.category}</p>
            <h1>{article.title}</h1>
            <p className={styles.intro}>{article.intro}</p>
            <div className={styles.meta}>
              <span>De echipa WebForm</span>
              <span>{Math.max(3, Math.ceil(words / 180))} minute de citit</span>
            </div>
          </div>
          <figure className={styles.figure}>
            <Image
              src={`/images/articole-instalatori/${article.image}.png`}
              alt={article.alt}
              width={1200}
              height={628}
              sizes="(max-width: 1000px) 100vw, 1000px"
              priority
            />
          </figure>
          <div className={styles.reading}>
            <aside className={styles.contents} aria-label="În acest articol">
              <span>ÎN ACEST ARTICOL</span>
              {article.sections.map((section, i) => (
                <a key={section.title} href={`#ideea-${i + 1}`}>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  {section.title}
                </a>
              ))}
            </aside>
            <div className={styles.body}>
              {article.sections.map((section, i) => (
                <section
                  id={`ideea-${i + 1}`}
                  key={section.title}
                  className={styles.section}
                >
                  <span className={styles.number}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  {section.items && (
                    <ul>
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.example && (
                    <div className={styles.example}>
                      <span>{section.example.label}</span>
                      <blockquote>{section.example.text}</blockquote>
                    </div>
                  )}
                </section>
              ))}
              <aside className={styles.takeaway}>
                <span>DE ÎNCERCAT LA URMĂTOAREA LUCRARE</span>
                <p>{article.takeaway}</p>
              </aside>
            </div>
          </div>
        </article>
        <section className={styles.offer} aria-labelledby="offer-title">
          <div className={styles.offerIntro}>
            <p className={styles.eyebrow}>MAI DEPARTE, CU WEBFORM</p>
            <h2 id="offer-title">
              Tu ai meseria.
              <br />
              Noi o punem <em>în pagină.</em>
            </h2>
            <p>{article.bridge}</p>
          </div>
          <div className={styles.steps}>
            <div>
              <span>01</span>
              <h3>Ne povestești.</h3>
              <p>
                O discuție de aproximativ 15 minute și fotografiile tale trimise
                pe WhatsApp ne dau punctul de pornire.
              </p>
            </div>
            <div>
              <span>02</span>
              <h3>Vezi propunerea.</h3>
              <p>
                Pregătim textele și site-ul. Primești previzualizarea în maximum
                7 zile de la discuție și primirea fotografiilor. O vezi înainte
                să decizi și să plătești.
              </p>
            </div>
            <div>
              <span>03</span>
              <h3>Noi îl administrăm.</h3>
              <p>
                După acceptare și plată, publicăm site-ul. Ne ocupăm de
                găzduire, domeniu, SSL și modificările incluse în abonament.
              </p>
            </div>
          </div>
          <div className={styles.offerBottom}>
            <div>
              <p className={styles.price}>
                0 lei avans <span>·</span> 180 lei/lună
              </p>
              <p className={styles.terms}>
                Abonamentul Start: până la 3 pagini, minimum 12 luni. Modificări
                în 7 zile, o cerere activă. La anularea înainte de termen se
                aplică taxa de construcție
                {config.fee
                  ? ` de ${config.fee} lei`
                  : ", comunicată înainte de acceptare"}
                . Domeniul rămâne al tău.
              </p>
            </div>
            <div className={styles.actions}>
              <a className={styles.button} href={`/instalatii/formular?${attribution.toString()}`}>
                Vreau să vă povestesc ↗
              </a>
              <a
                className={styles.secondary}
                href={`/instalatii/exemplu?${attribution.toString()}`}
              >
                Vezi un site demonstrativ →
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <Link className={styles.brand} href="/">
          <em>web</em>form.
        </Link>
        <p>Lucrări reale. Explicații clare. Un loc al lor online.</p>
        <a href="/legal/privacy">Confidențialitate</a>
      </footer>
    </div>
  );
}
