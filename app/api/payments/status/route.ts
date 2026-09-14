import { NextResponse } from "next/server";
import { ApiError, apiError, requireUser } from "@/lib/api";
import { supabaseServerAdmin } from "@/lib/supabase/server";
export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    const id = new URL(request.url).searchParams.get("orderId");
    if (!id || id.length > 150) throw new ApiError(400, "Comandă invalidă.");
    const { data, error } = await supabaseServerAdmin()
      .from("orders")
      .select("id,status,access_expires_at")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();
    if (error || !data) throw new ApiError(404, "Comanda nu a fost găsită.");
    return NextResponse.json(data, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}
