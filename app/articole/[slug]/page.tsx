import { LeadForm } from "@/components/campaign/LeadForm";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import data from "@/lib/marketing-articles.json";
import { siteConfig } from "@/lib/seo";
import styles from "../article.module.css";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export function generateStaticParams() {
  return data.articles.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = data.articles.find((entry) => entry.slug === slug);
  if (!article) return { title: "Articol negăsit" };
  const description = article.paragraphs.slice(0, 2).join(" ");
  const url = `${siteConfig.url}/articole/${slug}`;
  return {
    title: article.title,
    description,
    alternates: { canonical: url, languages: { "ro-RO": url } },
    openGraph: { title: article.title, description, url, type: "article", siteName: "WebForm" },
    twitter: { title: article.title, description, card: "summary_large_image" },
  };
}
export default async function ArticlePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const article = data.articles.find((entry) => entry.slug === slug);
  if (!article) notFound();
  const incoming = await searchParams;
  const attribution = new URLSearchParams();
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"]) {
    const value = incoming[key];
    if (typeof value === "string" && value) attribution.set(key, value);
  }
  if (!attribution.has("utm_content")) attribution.set("utm_content", `broad-ad-${article.ad}`);
  const query = attribution.toString();
  const words = [...article.paragraphs, ...data.offer.flatMap((section) => section.paragraphs)].join(" ").split(/\s+/).length;
  return <div className={styles.page}>
    <header className={styles.header}><a className={styles.brand} href={`/?${query}`} aria-label="WebForm — pagina principală"><em>web</em>form.</a><span>IDEI PENTRU AFACEREA TA</span></header>
    <main id="main" className={styles.main}>
      <article>
        <div className={styles.eyebrow}>GHID WEBFORM</div>
        <h1>{article.title}</h1>
        <p className={styles.meta}>De echipa WebForm · {Math.ceil(words / 180)} minute de citit</p>
        <div className={styles.body}>{article.paragraphs.map((paragraph, index) => paragraph.startsWith("### ") ? <h2 key={index}>{paragraph.slice(4)}</h2> : <p key={index}>{paragraph}</p>)}</div>
        <section className={styles.offer} aria-label="Oferta WebForm">
          <div className={styles.eyebrow}>CUM TE AJUTĂ WEBFORM</div>
          {data.offer.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
          <div className={styles.form} id="formular">
            <LeadForm source="homepage" articleSlug={article.slug} />
          </div>
          <p className={styles.start}><a href={`/templates?${query}`}>Vezi modelele de site</a> · <a href={`/?${query}#plans`}>Compară planurile</a></p>
        </section>
      </article>
    </main>
    <footer className={styles.footer}><Link className={styles.brand} href="/">webform.</Link><span>Site-ul tău, fără bătăi de cap.</span><a href="/legal/privacy">Confidențialitate</a><a href="/legal/terms">Termeni</a></footer>
  </div>;
}
