import {
  apiError,
  checkOrigin,
  jsonBody,
  rateLimit,
  requestIP,
} from "@/lib/api";
import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServerAdmin } from "@/lib/supabase/server";
const schema = z.object({
  name: z.string().trim().min(2).max(150),
  email: z.string().trim().email().max(254),
  businessType: z.string().max(200).default(""),
  tier: z.string().max(40).default("Starter"),
});
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const parsed = schema.safeParse(await jsonBody(request));
    if (!parsed.success)
      return NextResponse.json(
        { ok: false, message: "Date invalide" },
        { status: 400 },
      );
    await rateLimit("waitlist", requestIP(request), 5, 3600);
    const { error } = await supabaseServerAdmin().from("waitlist").upsert(
      {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        business_type: parsed.data.businessType,
        tier: parsed.data.tier,
      },
      { onConflict: "email", ignoreDuplicates: true },
    );
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
