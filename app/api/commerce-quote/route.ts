import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import {
  apiError,
  checkOrigin,
  jsonBody,
  rateLimit,
  requestIP,
} from "@/lib/api";
import { supabaseServerAdmin } from "@/lib/supabase/server";
import { commerceQuoteSchema } from "@/lib/commerce-quote";

export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const parsed = commerceQuoteSchema.safeParse(await jsonBody(request));
    if (!parsed.success)
      return NextResponse.json(
        { ok: false, message: "Verifică datele introduse." },
        { status: 400 },
      );
    await rateLimit("commerce-quote", requestIP(request), 5, 3600);

    const data = parsed.data;
    const details = [
      `Afacere: ${data.businessName}`,
      `Telefon: ${data.phone}`,
      `Produse: ${data.productCount}`,
      `Funcționalități: ${data.needs.join(", ") || "De stabilit"}`,
      data.currentSite ? `Site actual: ${data.currentSite}` : "",
      data.notes ? `Detalii: ${data.notes}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    const { error } = await supabaseServerAdmin().from("waitlist").upsert(
      {
        name: data.name,
        email: data.email.toLowerCase(),
        business_type: details,
        tier: "E-commerce",
      },
      { onConflict: "email" },
    );
    if (error) throw error;

    if (
      process.env.RESEND_API_KEY &&
      process.env.NOTIFICATION_EMAIL &&
      process.env.NOTIFICATION_FROM_EMAIL
    ) {
      const digest = createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex")
        .slice(0, 24);
      const { error: sendError } = await new Resend(
        process.env.RESEND_API_KEY,
      ).emails.send(
        {
          from: process.env.NOTIFICATION_FROM_EMAIL,
          to: process.env.NOTIFICATION_EMAIL,
          subject: `Cerere magazin online: ${data.businessName}`,
          text: `Cerere nouă pentru magazin online\n\nNume: ${data.name}\nEmail: ${data.email}\nTelefon: ${data.phone}\n${details}`,
        },
        { idempotencyKey: `commerce-quote-${digest}` },
      );
      if (sendError) console.error("Commerce quote email failed", sendError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
