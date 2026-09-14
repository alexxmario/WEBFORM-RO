import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, apiError, requireUser } from "@/lib/api";
import { ASSET_BUCKET } from "@/lib/assets";
import { supabaseServerAdmin } from "@/lib/supabase/server";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser(request);
    const { id } = await params;
    if (!z.string().uuid().safeParse(id).success)
      throw new ApiError(404, "Fișier inexistent.");
    const db = supabaseServerAdmin();
    const { data: asset, error } = await db
      .from("blueprint_assets")
      .select("user_id,storage_path,original_name")
      .eq("id", id)
      .single();
    if (error || !asset) throw new ApiError(404, "Fișier inexistent.");
    if (asset.user_id !== user.id) {
      const { data: profile } = await db
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profile?.role !== "admin")
        throw new ApiError(404, "Fișier inexistent.");
    }
    const { data, error: signError } = await db.storage
      .from(ASSET_BUCKET)
      .createSignedUrl(asset.storage_path, 60, {
        download: asset.original_name,
      });
    if (signError || !data) throw signError;
    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: data.signedUrl,
        "Cache-Control": "private, no-store",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
