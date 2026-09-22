export function campaignConfig() {
  return {
    bonus: process.env.CAMPAIGN_ANNUAL_BONUS || "",
    whatsapp: (process.env.CAMPAIGN_WHATSAPP || "").replace(/\D/g, ""),
    pixel: /^\d+$/.test(process.env.CAMPAIGN_META_PIXEL_ID || "")
      ? process.env.CAMPAIGN_META_PIXEL_ID!
      : "",
    termsVersion: `${process.env.CAMPAIGN_TERMS_VERSION || "instalatii-2026-09"}-fara-perioada-minima-v1`,
    origin: process.env.CAMPAIGN_SITE_URL || "https://ro.joinwebform.com",
  };
}
export function campaignTerms() {
  const c = campaignConfig();
  return `Abonament recurent, fără perioadă minimă contractuală și fără taxă de anulare anticipată. Domeniul rămâne al clientului. Start: până la 3 pagini, actualizări în 7 zile, o cerere activă; 180 lei/lună sau 1.620 lei/an. Business: până la 7 pagini, actualizări în 3 zile, două cereri active; 350 lei/lună sau 3.150 lei/an. Plata anuală include 25% reducere. Bonus anual: ${c.bonus}.`;
}
