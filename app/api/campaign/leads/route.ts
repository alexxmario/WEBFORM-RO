import { createHash } from "node:crypto";
import { NextResponse, after } from "next/server";
import {
  apiError,
  ApiError,
  checkOrigin,
  jsonBody,
  rateLimit,
  requestIP,
} from "@/lib/api";
import { leadSchema } from "@/lib/campaign/schema";
import { campaignConfig } from "@/lib/campaign/config";
import { notifyLead } from "@/lib/campaign/server";
import { supabaseServerAdmin } from "@/lib/supabase/server";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    await rateLimit("campaign-leads", requestIP(request), 5, 3600);
    const parsed = leadSchema.safeParse(await jsonBody(request));
    if (!parsed.success)
      throw new ApiError(
        400,
        "Verifică numele, telefonul și câmpurile obligatorii.",
      );
    const p = parsed.data;
    const db = supabaseServerAdmin();
    const result = await db
      .from("campaign_leads")
      .insert({
        event_id: p.eventId,
        source: p.source,
        name: p.name,
        phone: p.phone,
        company: p.source === "instalatii" ? p.company === "yes" : null,
        city: p.source === "instalatii" ? p.city : null,
        services: p.source === "instalatii" ? p.services : [],
        business_type: p.source === "homepage" ? p.businessType : null,
        attribution: p.attribution,
        consent_version: "privacy-2026-09",
        marketing_consent: p.marketingConsent,
      })
      .select("id")
      .single();
    if (result.error && result.error.code !== "23505") throw result.error;
    if (result.data) {
      const id = result.data.id;
      after(async () => {
        await notifyLead(id).catch(() =>
          console.error("Campaign lead notification pending", id),
        );
        const c = campaignConfig();
        if (
          p.source !== "instalatii" ||
          !p.marketingConsent ||
          !c.pixel ||
          !process.env.CAMPAIGN_META_ACCESS_TOKEN
        )
          return;
        try {
          const response = await fetch(
            `https://graph.facebook.com/${process.env.CAMPAIGN_META_API_VERSION || "v23.0"}/${c.pixel}/events`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: AbortSignal.timeout(8000),
              body: JSON.stringify({
                access_token: process.env.CAMPAIGN_META_ACCESS_TOKEN,
                data: [
                  {
                    event_name: "Lead",
                    event_id: p.eventId,
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: "website",
                    event_source_url: `${c.origin}/instalatii`,
                    user_data: {
                      ph: [
                        createHash("sha256")
                          .update(p.phone.replace("+", ""))
                          .digest("hex"),
                      ],
                      client_ip_address: requestIP(request),
                      client_user_agent: request.headers.get("user-agent"),
                      ...(p.attribution.fbclid
                        ? { fbc: `fb.1.${Date.now()}.${p.attribution.fbclid}` }
                        : {}),
                    },
                  },
                ],
              }),
            },
          );
          if (!response.ok) console.error("Campaign CAPI delivery failed", id);
        } catch {
          console.error("Campaign CAPI delivery failed", id);
        }
      });
    }
    return NextResponse.json({ ok: true, eventId: p.eventId });
  } catch (e) {
    return apiError(e);
  }
}
