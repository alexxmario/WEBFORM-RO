import { AdArticle } from "@/components/campaign/AdArticle";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import data from "@/lib/marketing-articles.json";
import { siteConfig } from "@/lib/seo";

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
    openGraph: { title: article.title, description, url, type: "article", siteName: "WebForm", images: [{ url: article.image.src, width: article.image.width, height: article.image.height, alt: article.image.alt }] },
    twitter: { title: article.title, description, card: "summary_large_image", images: [article.image.src] },
  };
}
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = data.articles.find((entry) => entry.slug === slug);
  if (!article) notFound();
  return <AdArticle title={article.title} intro={article.landingIntro} sections={article.landingSections} slug={article.slug} image={article.image} />;
}
