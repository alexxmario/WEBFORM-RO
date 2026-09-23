import data from "@/lib/marketing-articles.json";

export function leadSourceLabel(source: unknown, attribution: unknown): string {
  const slug = attribution && typeof attribution === "object" && "article_slug" in attribution ? attribution.article_slug : undefined;
  const article = data.articles.find((entry) => entry.slug === slug);
  if (source === "homepage" && article) return `Articol · reclama ${article.ad} · ${article.title}`;
  return source === "instalatii" ? "Instalatori" : "Pagina principală";
}
