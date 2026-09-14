import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { apiError, checkOrigin, jsonBody, rateLimit, requestIP } from "@/lib/api";
import { contactSchema, contactSubjects } from "@/lib/contact";
import { supabaseServerAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const parsed = contactSchema.safeParse(await jsonBody(request));
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Verifică informațiile introduse." },
        { status: 400 },
      );
    }
    await rateLimit("contact", requestIP(request), 5, 3600);

    const data = parsed.data;
    const payload = JSON.stringify({
      email: data.email.toLowerCase(),
      phone: data.phone,
      businessName: data.businessName,
      subject: contactSubjects[data.subject],
      message: data.message,
    });
    const { error } = await supabaseServerAdmin().from("waitlist").insert({
      name: data.name,
      // Each message remains a separate record while the public address stays
      // inside the validated payload returned by the admin endpoint.
      email: `contact+${randomUUID()}@webform.invalid`,
      business_type: payload,
      tier: "Contact",
    });
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
