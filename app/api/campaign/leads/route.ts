import { leadSourceLabel } from "@/lib/campaign/lead-source";
import { notifyTelegram } from "@/lib/telegram-notification";
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
        company: p.source === "instalatii" && p.company ? p.company === "yes" : null,
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
        await notifyTelegram(`Cerere nouă — ${leadSourceLabel(p.source, p.attribution)}\nNume: ${p.name}\nTelefon: ${p.phone}\nOraș: ${p.source === "instalatii" ? p.city : "—"}\nAfacere: ${p.source === "homepage" ? p.businessType : "—"}`);
        await notifyLead(id).catch(() =>
          console.error("Campaign lead notification pending", id),
        );

      });
    }
    return NextResponse.json({ ok: true, eventId: p.eventId });
  } catch (e) {
    return apiError(e);
  }
}
