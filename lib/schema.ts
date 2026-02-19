import { siteConfig } from "./seo";

type FAQItem = {
  question: string;
  answer: string;
};

// Organization Schema - Pentru brand recognition
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: "WebForm Romania",
  alternateName: "WebForm",
  url: siteConfig.url,
  logo: {
    "@type": "ImageObject",
    url: `${siteConfig.url}/logo.png`,
    width: 512,
    height: 512,
  },
  image: `${siteConfig.url}/og-image.png`,
  description:
    "WebForm construieste, gazduieste si gestioneaza site-uri web premium cu lansare rapida in 7 zile si actualizari in 3 zile.",
  foundingDate: "2024",
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.address.city,
    addressCountry: siteConfig.address.countryCode,
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      contactType: "customer service",
      email: siteConfig.email,
      availableLanguage: ["Romanian", "English"],
      areaServed: "RO",
    },
  ],
  sameAs: [
    siteConfig.linkedinUrl,
    "https://twitter.com/webform_ro",
    "https://www.facebook.com/webform.ro",
  ],
  slogan: "Site-ul tau, construit pentru tine - gestionat pentru totdeauna",
  areaServed: {
    "@type": "Country",
    name: "Romania",
  },
};

// LocalBusiness Schema - Pentru cautari locale
export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteConfig.url}/#localbusiness`,
  name: "WebForm Romania",
  image: `${siteConfig.url}/logo.png`,
  url: siteConfig.url,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.address.city,
    addressCountry: siteConfig.address.countryCode,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 45.6579,
    longitude: 25.6012,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  priceRange: "$$",
  currenciesAccepted: "RON",
  paymentAccepted: "Card de credit, Transfer bancar",
  areaServed: {
    "@type": "Country",
    name: "Romania",
  },
};

// Product/Service Schema - Pentru serviciile oferite
export const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": `${siteConfig.url}/#product`,
  name: "WebForm Platform",
  description:
    "Platforma completa de creare si gestionare site-uri web cu gazduire, domeniu si actualizari incluse.",
  image: `${siteConfig.url}/og-image.png`,
  brand: {
    "@type": "Brand",
    name: "WebForm",
    logo: `${siteConfig.url}/logo.png`,
  },
  offers: [
    {
      "@type": "Offer",
      name: "WebForm Start",
      description:
        "Pentru proprietarii de afaceri mici care au nevoie de un website simplu si curat.",
      price: "150",
      priceCurrency: "RON",
      priceValidUntil: "2026-12-31",
      url: `${siteConfig.url}/#plans`,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "WebForm Romania",
      },
    },
    {
      "@type": "Offer",
      name: "WebForm Business",
      description:
        "Cel mai popular plan - acopera 70%+ din clienti cu functionalitati avansate.",
      price: "350",
      priceCurrency: "RON",
      priceValidUntil: "2026-12-31",
      url: `${siteConfig.url}/#plans`,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "WebForm Romania",
      },
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
  },
};

// Service Schema
export const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${siteConfig.url}/#service`,
  name: "Servicii Web Design si Dezvoltare",
  serviceType: "Web Design si Management",
  provider: {
    "@type": "Organization",
    name: "WebForm Romania",
    url: siteConfig.url,
  },
  description:
    "Creare site-uri web profesionale cu design modern, optimizare SEO, gazduire si mentenanta continua inclusa in abonament.",
  areaServed: {
    "@type": "Country",
    name: "Romania",
  },
  termsOfService: `${siteConfig.url}/legal/terms`,
};

// WebSite Schema - Pentru sitelinks in Google
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  name: siteConfig.name,
  alternateName: "WebForm Romania",
  url: siteConfig.url,
  description: siteConfig.description,
  publisher: {
    "@id": `${siteConfig.url}/#organization`,
  },
  inLanguage: "ro-RO",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// WebPage Schema
export const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${siteConfig.url}/#webpage`,
  url: siteConfig.url,
  name: siteConfig.title,
  description: siteConfig.description,
  isPartOf: {
    "@id": `${siteConfig.url}/#website`,
  },
  about: {
    "@id": `${siteConfig.url}/#organization`,
  },
  inLanguage: "ro-RO",
  datePublished: "2024-01-01",
  dateModified: new Date().toISOString().split("T")[0],
};

// BreadcrumbList Schema
export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// FAQ Schema
export function buildFaqJsonLd(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// Predefined FAQ items in Romanian
export const defaultFaqItems: FAQItem[] = [
  {
    question: "Cat dureaza sa fie gata site-ul meu?",
    answer:
      "Site-ul tau va fi construit si lansat in 7 zile de la aprobarea Formularului.",
  },
  {
    question: "Ce este inclus in abonament?",
    answer:
      "Abonamentul include: gazduire, domeniu, SSL, actualizari nelimitate, mentenanta, suport si optimizare continua.",
  },
  {
    question: "Pot schimba sablonul ulterior?",
    answer:
      "Da, poti schimba sablonul oricand fara costuri suplimentare si fara timp de nefunctionare.",
  },
  {
    question: "Ce se intampla daca vreau sa anulez?",
    answer:
      "Poti anula oricand. Oferim si export complet al site-ului ca serviciu platit separat.",
  },
  {
    question: "Cat de rapid sunt procesate actualizarile?",
    answer:
      "Actualizarile sunt procesate in 3 zile pentru planul Business si 7 zile pentru planul Start.",
  },
];

// HowTo Schema pentru procesul de lucru
export const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Cum sa obtii un site web profesional cu WebForm",
  description:
    "Ghid pas cu pas pentru a obtine site-ul tau web profesional in doar 7 zile.",
  totalTime: "P7D",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "RON",
    value: "150",
  },
  step: [
    {
      "@type": "HowToStep",
      name: "Trimite Formularul",
      text: "Completeaza formularul Blueprint cu detaliile despre afacerea ta si obiectivele site-ului.",
      url: `${siteConfig.url}/start`,
    },
    {
      "@type": "HowToStep",
      name: "Alege un sablon",
      text: "Selecteaza din peste 100 de sabloane premium cel care se potriveste brandului tau.",
      url: `${siteConfig.url}/templates`,
    },
    {
      "@type": "HowToStep",
      name: "Construim site-ul",
      text: "Echipa noastra construieste site-ul tau in 7 zile cu verificari asincrone.",
    },
    {
      "@type": "HowToStep",
      name: "Lansare si gestionare",
      text: "Site-ul tau este lansat si gestionat pentru totdeauna cu actualizari nelimitate.",
    },
  ],
};

// Combined JSON-LD for homepage
export const homePageJsonLd = [
  organizationJsonLd,
  websiteJsonLd,
  webPageJsonLd,
  productJsonLd,
  serviceJsonLd,
  localBusinessJsonLd,
  howToJsonLd,
  buildFaqJsonLd(defaultFaqItems),
];
