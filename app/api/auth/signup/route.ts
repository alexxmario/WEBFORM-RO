import { z } from "zod";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServerAdmin } from "@/lib/supabase/server";
import {
  apiError,
  ApiError,
  jsonBody,
  checkOrigin,
  rateLimit,
  requestIP,
} from "@/lib/api";
const schema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
  name: z.string().trim().min(2).max(150),
  businessName: z.string().trim().min(2).max(150),
  phone: z.string().trim().min(6).max(30),
});
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const parsed = schema.safeParse(await jsonBody(request));
    if (!parsed.success)
      throw new ApiError(
        400,
        "Verifică datele introduse. Parola trebuie să aibă minimum 8 caractere.",
      );
    await rateLimit("signup", requestIP(request), 5, 3600);
    const body = parsed.data;
    const reserved = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());
    if (reserved.includes(body.email.toLowerCase()))
      throw new ApiError(400, "Folosește autentificarea pentru acest cont.");
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
    const { data, error } = await client.auth.signUp({
      email: body.email,
      password: body.password,
      options: {
        data: {
          name: body.name,
          business_name: body.businessName,
          phone_number: body.phone,
        },
        emailRedirectTo: `${new URL(request.url).origin}/auth/confirm`,
      },
    });
    if (error)
      throw new ApiError(
        400,
        "Nu am putut crea contul. Verifică datele sau folosește autentificarea.",
      );
    if (data.user && data.user.identities?.length) {
      const { error: profileError } = await supabaseServerAdmin()
        .from("profiles")
        .upsert(
          {
            id: data.user.id,
            email: body.email.toLowerCase(),
            name: body.name,
            business_name: body.businessName,
            phone_number: body.phone,
            role: "client",
          },
          { onConflict: "id", ignoreDuplicates: true },
        );
      if (profileError) throw profileError;
    }
    return NextResponse.json({
      success: true,
      confirmationRequired: !data.session,
      message: "Verifică emailul pentru confirmare, apoi autentifică-te.",
    });
  } catch (error) {
    return apiError(error);
  }
}
