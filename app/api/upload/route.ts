import { NextResponse } from "next/server";
import { supabaseServerAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop();
    const filename = `${timestamp}-${randomStr}.${extension}`;

    const supabase = supabaseServerAdmin();

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from("blueprint-assets")
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: "3600",
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("blueprint-assets")
      .getPublicUrl(filename);

    return NextResponse.json({
      ok: true,
      url: publicUrl,
      filename: file.name,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
