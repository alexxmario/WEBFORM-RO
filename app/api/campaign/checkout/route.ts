import { stripeLive } from "@/lib/stripe/server";
import { checkedStripePrice, stripePlanIds } from "@/lib/stripe/prices";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  apiError,
  ApiError,
  checkOrigin,
  jsonBody,
  rateLimit,
  requestIP,
} from "@/lib/api";
import { tokenSchema } from "@/lib/campaign/schema";
import { campaignConfig, campaignTerms } from "@/lib/campaign/config";
import { previewLead } from "@/lib/campaign/server";
import { campaignStripe } from "@/lib/campaign/stripe";
import { supabaseServerAdmin } from "@/lib/supabase/server";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    await rateLimit("campaign-checkout", requestIP(request), 10, 3600);
    const p = z
      .object({
        token: tokenSchema,
        planId: z.enum(stripePlanIds),
        accepted: z.literal(true),
        version: z.string(),
        attempt: z.string().uuid(),
      })
      .safeParse(await jsonBody(request));
    if (!p.success)
      throw new ApiError(400, "Acceptă termenii pentru a continua.");
    const c = campaignConfig();
    if (!c.fee || !c.bonus)
      throw new ApiError(503, "Oferta este în curs de configurare.");
    if (p.data.version !== c.termsVersion)
      throw new ApiError(409, "Termenii s-au actualizat. Reîncarcă pagina.");
    const lead = await previewLead(p.data.token);
    if (lead.paid_at) throw new ApiError(409, "Site-ul este deja achitat.");
    if (!process.env.STRIPE_WEBHOOK_SECRET)
      throw new ApiError(503, "Plata este în curs de configurare.");
    const stripe = campaignStripe();
    const priceId = await checkedStripePrice(
      stripe,
      p.data.planId,
      stripeLive(),
    );
    const db = supabaseServerAdmin();
    // A delayed webhook must not allow a second subscription after session expiry.
    const latest = await db
      .from("campaign_checkouts")
      .select("stripe_session_id")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (latest.error) throw latest.error;
    if (latest.data?.stripe_session_id) {
      const previous = await stripe.checkout.sessions.retrieve(
        latest.data.stripe_session_id,
      );
      if (previous.status === "complete")
        throw new ApiError(
          409,
          "Plata a fost trimisă. Așteptăm confirmarea securizată; nu este necesară o nouă plată.",
        );
    }
    const claim = await db.rpc("campaign_claim_checkout", {
      p_lead: lead.id,
      p_attempt: p.data.attempt,
      p_plan: p.data.planId,
      p_version: c.termsVersion,
      p_terms: campaignTerms(),
    });
    if (claim.error)
      throw new ApiError(
        409,
        "Există deja o plată în curs. Continuă cu opțiunea inițială sau revino în 32 de minute.",
      );
    const attempt = String(claim.data);
    const existing = await db
      .from("campaign_checkouts")
      .select("*")
      .eq("id", attempt)
      .single();
    if (existing.error) throw existing.error;
    if (
      existing.data.lead_id !== lead.id ||
      existing.data.plan_id !== p.data.planId ||
      existing.data.terms_version !== c.termsVersion ||
      existing.data.terms_text !== campaignTerms()
    )
      throw new ApiError(409, "Reîncepe plata.");
    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        payment_method_types: ["card"],
        client_reference_id: lead.id,
        metadata: { campaign_checkout_id: attempt },
        subscription_data: { metadata: { campaign_lead_id: lead.id } },
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${c.origin}/instalatii/checkout/${p.data.token}?success=1`,
        cancel_url: `${c.origin}/instalatii/checkout/${p.data.token}`,
        expires_at:
          Math.floor(new Date(existing.data.created_at).getTime() / 1000) +
          1860,
      },
      { idempotencyKey: `campaign-${attempt}` },
    );
    const saved = await db
      .from("campaign_checkouts")
      .update({ stripe_session_id: session.id })
      .eq("id", attempt);
    if (saved.error) throw saved.error;
    return NextResponse.json({ url: session.url });
  } catch (e) {
    return apiError(e);
  }
}
