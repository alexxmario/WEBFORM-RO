import type { Metadata } from "next";
import { AdArticle } from "@/components/campaign/AdArticle";
import { notFound } from "next/navigation";
import { articles } from "../articles";

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

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((entry) => entry.slug === slug);
  if (!article) notFound();
  const intros: Record<string, string[]> = {
    "lucrarile-tale-ajung-inaintea-ta": ["Tu ești la o lucrare. Noul client vrea să vadă ce ai mai făcut.", "Site-ul îi poate arăta munca ta înainte de primul apel."],
    "ce-merita-fotografiat-inainte-de-gresie": ["O parte din munca ta dispare sub gresie.", "Fotografiile făcute la timp pot arăta ce ai realizat."],
    "o-propozitie-schimba-o-fotografie": ["Clientul vede fotografia, dar nu știe ce ai făcut acolo.", "O explicație scurtă îl ajută să înțeleagă lucrarea."],
    "ce-sa-contina-prima-cerere-de-montaj": ["Primești «cât costă?», fără detalii despre montaj.", "Site-ul poate explica ce informații ai nevoie să primești."],
  };
  const sections = article.sections.slice(0, 3).map(section => ({ title: section.title, paragraphs: [...section.paragraphs.slice(0, 1), ...(section.example ? [section.example.text] : section.items ? [section.items.slice(0, 2).join(" ")] : section.paragraphs.slice(1, 2))].flatMap(p => p.split(/(?<=[.!?])\s+(?=[A-ZĂÂÎȘȚ„])/).map(s=>s.trim()).filter(Boolean)).slice(0, 4) }));
  return <AdArticle title={article.title} intro={intros[slug] ?? [article.intro]} sections={sections} slug={`instalatii-${article.slug}`} image={{src:`/images/articole-instalatori/${article.image}.png`, width:1200,height:628,alt:article.alt}} />;
}
