import { NextResponse } from "next/server";
import { apiError, requireUser, rateLimit } from "@/lib/api";
import { supabaseServerAdmin } from "@/lib/supabase/server";
export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    await rateLimit("chat-init", user.id, 30, 60);
    // Identity and role come from the verified session/database, never the request body.
    const { data, error } = await supabaseServerAdmin().rpc(
      "webform_init_room",
      { p_user_id: user.id, p_email: user.email || "" },
    );
    if (error) throw error;
    return NextResponse.json({ roomId: data });
  } catch (error) {
    return apiError(error);
  }
}
