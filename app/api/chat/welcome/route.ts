import { NextResponse } from "next/server";
import { ApiError, apiError, rateLimit, requireUser } from "@/lib/api";
import { ensureProjectChatWelcome } from "@/lib/chat-welcome";
import { supabaseServerAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    await rateLimit("chat-welcome", user.id, 10, 60);
    const db = supabaseServerAdmin();
    const [{ data: order }, { data: blueprint }] = await Promise.all([
      db.from("orders").select("id").eq("user_id", user.id).eq("status", "completed").limit(1).maybeSingle(),
      db.from("blueprints").select("id").eq("user_id", user.id).limit(1).maybeSingle(),
    ]);
    if (!order || !blueprint) throw new ApiError(403, "Proiectul nu este încă activ.");
    const result = await ensureProjectChatWelcome(user.id, user.email || "");
    return NextResponse.json({ ok: true, created: result.created });
  } catch (error) {
    return apiError(error);
  }
}
