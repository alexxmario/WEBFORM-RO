import { NextResponse } from "next/server";
import {
  ApiError,
  apiError,
  requireUser,
  jsonBody,
  rateLimit,
} from "@/lib/api";
import { supabaseServerAdmin } from "@/lib/supabase/server";
import { notifyBlueprint } from "@/lib/blueprint-notification";
import { z } from "zod";
export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    await rateLimit("notify", user.id, 5, 3600);
    const body = z
      .object({ blueprintId: z.string().uuid() })
      .safeParse(await jsonBody(request));
    if (!body.success) throw new ApiError(400, "ID invalid.");
    const { data, error } = await supabaseServerAdmin()
      .from("blueprints")
      .select("id")
      .eq("id", body.data.blueprintId)
      .eq("user_id", user.id)
      .single();
    if (error || !data) throw new ApiError(404, "Proiect inexistent.");
    const status = await notifyBlueprint(data.id);
    return NextResponse.json(
      { ok: status === "sent", status },
      { status: status === "sent" ? 200 : 503 },
    );
  } catch (error) {
    return apiError(error);
  }
}
