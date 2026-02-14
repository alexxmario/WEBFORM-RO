import { siteConfig } from "@/lib/seo";
import type { MetadataRoute } from "next";

type SitemapEntry = {
  route: string;
  priority: number;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
};

const routes: SitemapEntry[] = [
  // Pagini principale - prioritate maxima
  { route: "", priority: 1.0, changeFrequency: "daily" },
  { route: "/templates", priority: 0.9, changeFrequency: "weekly" },
  { route: "/start", priority: 0.9, changeFrequency: "weekly" },

  // Pagini secundare
  { route: "/pricing", priority: 0.8, changeFrequency: "weekly" },
  { route: "/waitlist", priority: 0.7, changeFrequency: "monthly" },
  { route: "/about", priority: 0.6, changeFrequency: "monthly" },
  { route: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { route: "/support", priority: 0.6, changeFrequency: "monthly" },

  // Pagini utilitare
  { route: "/thank-you", priority: 0.3, changeFrequency: "yearly" },
  { route: "/status", priority: 0.4, changeFrequency: "daily" },

  // Pagini legale
  { route: "/legal/terms", priority: 0.4, changeFrequency: "yearly" },
  { route: "/legal/privacy", priority: 0.4, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map(({ route, priority, changeFrequency }) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
