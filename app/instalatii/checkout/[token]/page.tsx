import { previewLead } from "@/lib/campaign/server";
import { campaignConfig, campaignTerms } from "@/lib/campaign/config";
import { ApiError } from "@/lib/api";
import { Checkout } from "@/components/campaign/Checkout";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { token } = await params;
  let lead;
  try {
    lead = await previewLead(token);
  } catch (e) {
    if (!(e instanceof ApiError)) throw e;
    return (
      <main id="main" className="campaign shell campaign-section">
        <h1>Link indisponibil</h1>
        <p>{e.message}</p>
      </main>
    );
  }
  const c = campaignConfig();
  const query = await searchParams;
  return (
    <main id="main" className="campaign">
      <div className="shell campaign-section campaign-checkout">
        <p className="eyebrow">WEBFORM / ACTIVAREA SITE-ULUI</p>
        {lead.paid_at ? (
          <>
            <h1>Mulțumim!</h1>
            <p>
              Punem site-ul pe domeniul tău și te adăugăm pe Google Maps. Te
              anunțăm pe WhatsApp.
            </p>
          </>
        ) : (
          <>
            <h1>
              Îți place? <em>Îl punem live.</em>
            </h1>
            <Checkout
              token={token}
              version={c.termsVersion}
              terms={campaignTerms()}
              bonus={c.bonus}
              ready={Boolean(
                c.fee && c.bonus && process.env.CAMPAIGN_STRIPE_SECRET_KEY,
              )}
              pending={query.success === "1"}
            />
          </>
        )}
      </div>
    </main>
  );
}
