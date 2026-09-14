import { NextResponse } from "next/server";
import { apiError, requireUser, rateLimit } from "@/lib/api";
import { supabaseServerAdmin } from "@/lib/supabase/server";
export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    await rateLimit("cancel", user.id, 10, 300);
    const { error } = await supabaseServerAdmin()
      .from("profiles")
      .update({ subscription_status: "cancelled", netopia_token: null })
      .eq("id", user.id)
      .eq("subscription_status", "active");
    if (error) throw error;
    return NextResponse.json({
      success: true,
      message:
        "Abonamentul este anulat. Accesul rămâne disponibil până la expirarea perioadei plătite.",
    });
  } catch (error) {
    return apiError(error);
  }
}
