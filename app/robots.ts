import { siteConfig } from "@/lib/seo";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/instalatii",
          "/api/",
          "/admin/",
          "/_next/",
          "/private/",
          "/*.json$",
          "/dashboard/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/instalatii", "/api/", "/admin/", "/dashboard/"],
      },
      {
        userAgent: "Googlebot-Image",
        disallow: ["/instalatii"],
        allow: ["/images/", "/og-image.png", "/logo.png"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/instalatii", "/api/", "/admin/", "/dashboard/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
