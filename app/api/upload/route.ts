import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { ApiError, apiError, rateLimit, requireSubscription } from "@/lib/api";
import { ASSET_BUCKET, detectAsset } from "@/lib/assets";
import { supabaseServerAdmin } from "@/lib/supabase/server";
export async function POST(request: Request) {
  try {
    const user = await requireSubscription(request);
    await rateLimit("upload", user.id, 30, 3600);
    if (Number(request.headers.get("content-length") || 0) > 11 * 1024 * 1024)
      throw new ApiError(413, "Limita este 10 MB per fișier.");
    const body = await request.formData();
    const file = body.get("file");
    if (
      !(file instanceof File) ||
      file.size === 0 ||
      file.size > 10 * 1024 * 1024
    )
      throw new ApiError(400, "Încarcă un fișier între 1 byte și 10 MB.");
    const buffer = Buffer.from(await file.arrayBuffer());
    const type = detectAsset(buffer);
    if (!type || (file.type && file.type !== type.mime))
      throw new ApiError(
        400,
        "Fișier invalid. Folosește JPG, PNG, WebP, GIF sau PDF.",
      );
    const id = randomUUID(),
      path = `${user.id}/${id}.${type.extension}`;
    const db = supabaseServerAdmin();
    const { error } = await db.storage
      .from(ASSET_BUCKET)
      .upload(path, buffer, { contentType: type.mime });
    if (error) throw error;
    const { error: recordError } = await db
      .from("blueprint_assets")
      .insert({
        id,
        user_id: user.id,
        storage_path: path,
        original_name: file.name.slice(0, 255),
        mime_type: type.mime,
        size_bytes: file.size,
      });
    if (recordError) {
      await db.storage.from(ASSET_BUCKET).remove([path]);
      throw recordError;
    }
    return NextResponse.json({
      ok: true,
      url: `/api/assets/${id}`,
      filename: file.name,
    });
  } catch (error) {
    return apiError(error);
  }
}
