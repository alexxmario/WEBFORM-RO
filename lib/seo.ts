import type { Metadata } from "next";
import type { DefaultSeoProps } from "next-seo";

export const siteConfig = {
  name: "WebForm",
  title: "WebForm — Site-ul tău, construit pentru tine — gestionat pentru totdeauna",
  titleTemplate: "%s | WebForm România",
  description:
    "Lansare în 7 zile. Actualizări în 3 zile. WebForm construiește, găzduiește și gestionează site-ul tău sub un singur abonament. Fără constructori de site-uri, fără bătăi de cap tehnice.",
  url: "https://ro.joinwebform.com",
  domain: "ro.joinwebform.com",
  creator: "WebForm România",
  locale: "ro_RO",
  language: "ro",
  keywords: [
    "creare site",
    "creare site web",
    "creare site pret",
    "web design",
    "web design romania",
    "web design pret",
    "site web profesional",
    "site pentru afaceri",
    "site web abonament",
    "site web firma",
    "realizare site web",
    "mentenanta site",
    "gazduire site",
    "site web rapid",
    "pagina de prezentare",
    "site optimizat",
    "site mobil",
    "site responsive",
    "site ieftin",
    "site simplu",
    "firma creare site",
    "agentie web design",
    "site pentru companii",
    "site de prezentare firma",
    "cat costa un site",
    "pret site web",
    "site web romania",
    "servicii web",
  ],
  themeColor: "#0F0F11",
  twitterHandle: "@webform_ro",
  linkedinUrl: "https://www.linkedin.com/company/webform-ro",
  email: "contact@webform.site",
  phone: "+40 722 000 000",
  address: {
    street: "România",
    city: "Brașov",
    country: "România",
    countryCode: "RO",
  },
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.creator, url: siteConfig.url }],
  creator: siteConfig.creator,
  publisher: siteConfig.creator,
  applicationName: siteConfig.name,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "ro-RO": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Creare site-uri web profesionale`,
        type: "image/png",
      },
      {
        url: "/og-square.png",
        width: 600,
        height: 600,
        alt: `${siteConfig.name} Logo`,
        type: "image/png",
      },
    ],
    countryName: "România",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
    images: {
      url: "/api/og",
      alt: `${siteConfig.name} - Site-uri web profesionale`,
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  category: "technology",
  classification: "Web Development Services",
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  other: {
    "msapplication-TileColor": "#0F0F11",
    "theme-color": siteConfig.themeColor,
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": siteConfig.name,
    "mobile-web-app-capable": "yes",
    "geo.region": "RO",
    "geo.placename": "România",
    "content-language": "ro",
  },
};

// Page-specific metadata helpers
export function generatePageMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || "/api/og";

  return {
    title,
    description,
    alternates: {
      canonical: path || "/",
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

// For next-seo library compatibility
export const defaultSeo: DefaultSeoProps = {
  title: siteConfig.title,
  description: siteConfig.description,
  canonical: siteConfig.url,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [
      {
        url: `${siteConfig.url}/api/og`,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    handle: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    {
      name: "keywords",
      content: siteConfig.keywords.join(", "),
    },
    {
      name: "author",
      content: siteConfig.creator,
    },
  ],
};
