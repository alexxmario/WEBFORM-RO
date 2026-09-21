"use client";

import Script from "next/script";

export function AnalyticsScripts() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const fathomId = process.env.NEXT_PUBLIC_FATHOM_ID;
  const googleAdsId = "AW-18465571325";
  const googleTagId = gaId || googleAdsId;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-setup" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${gaId ? `gtag('config', '${gaId}');` : ""}
          gtag('config', '${googleAdsId}');
        `}
      </Script>
      {fathomId ? (
        <Script
          src="https://cdn.usefathom.com/script.js"
          strategy="afterInteractive"
          data-site={fathomId}
        />
      ) : null}
    </>
  );
}
