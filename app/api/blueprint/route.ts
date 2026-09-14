import { NextResponse } from "next/server";
import { z } from "zod";
import { blueprintSchema } from "@/lib/zodSchemas";
import { supabaseServerAdmin } from "@/lib/supabase/server";
import {
  ApiError,
  apiError,
  jsonBody,
  requireSubscription,
  requireUser,
  rateLimit,
} from "@/lib/api";
import { assetIdFromUrl } from "@/lib/assets";
import { notifyBlueprint } from "@/lib/blueprint-notification";
import { ensureProjectChatWelcome } from "@/lib/chat-welcome";
export async function POST(request: Request) {
  try {
    const user = await requireSubscription(request);
    await rateLimit("blueprint", user.id, 10, 300);
    const payload = await jsonBody(request);
    const envelope = z
      .object({ submissionKey: z.string().uuid() })
      .safeParse(payload);
    const parse = blueprintSchema.safeParse(payload);
    if (!envelope.success || !parse.success)
      throw new ApiError(400, "Verifică informațiile din formular.");
    const data = parse.data,
      db = supabaseServerAdmin(),
      submissionKey = envelope.data.submissionKey;
    const uploads = data.look.assetUploads || [];
    const assetIds = uploads.map(assetIdFromUrl);
    if (
      assetIds.some((id) => !id) ||
      uploads.length > 20 ||
      new Set(uploads).size !== uploads.length
    )
      throw new ApiError(400, "Lista de fișiere este invalidă.");
    if (assetIds.length) {
      const { data: owned, error } = await db
        .from("blueprint_assets")
        .select("id")
        .eq("user_id", user.id)
        .in("id", assetIds);
      if (error) throw error;
      if (owned?.length !== assetIds.length)
        throw new ApiError(403, "Un fișier nu aparține acestui cont.");
    }
    const { data: blueprint, error } = await db
      .from("blueprints")
      .upsert(
        {
          user_id: user.id,
          submission_key: submissionKey,
          business_name: data.identity.businessName,
          one_liner: data.identity.oneLiner,
          what_you_sell: data.identity.whatYouSell,
          brand_personality: data.identity.brandPersonality,
          main_goal:
            data.vision.mainGoal === "Other"
              ? data.vision.customMainGoal
              : data.vision.mainGoal,
          references: data.look.references,
          color_preference: data.look.colorPreference,
          imagery_vibe: data.look.imageryVibe,
          assets_note: data.look.assetsNote,
          asset_uploads: uploads,
          pages: data.content.pages,
          cta_destination: data.content.ctaDestination,
          domain_status: data.technical.domainStatus,
          integrations: data.technical.integrations,
          current_site: data.technical.currentSite,
          timeline_confirmed: true,
          cancellation_confirmed: true,
          sla_confirmed: true,
          full_data: data,
        },
        { onConflict: "user_id,submission_key", ignoreDuplicates: true },
      )
      .select("id")
      .maybeSingle();
    if (error) throw error;
    let id = blueprint?.id;
    if (!id) {
      const { data: existing, error: readError } = await db
        .from("blueprints")
        .select("id")
        .eq("user_id", user.id)
        .eq("submission_key", submissionKey)
        .single();
      if (readError) throw readError;
      id = existing.id;
    }
    if (assetIds.length) {
      const { error: assetError } = await db
        .from("blueprint_assets")
        .update({ blueprint_id: id })
        .eq("user_id", user.id)
        .in("id", assetIds);
      if (assetError) throw assetError;
    }
    let notification = "pending";
    try {
      notification = await notifyBlueprint(id);
    } catch {
      console.error("Blueprint saved; notification requires retry", id);
    }
    let chatReady = false;
    try {
      await ensureProjectChatWelcome(user.id, user.email || "");
      chatReady = true;
    } catch (error) {
      console.error("Blueprint saved; welcome message requires retry", error);
    }
    return NextResponse.json({ ok: true, id, notification, chatReady });
  } catch (error) {
    return apiError(error);
  }
}
export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    const { data, error } = await supabaseServerAdmin()
      .from("blueprints")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);
    if (error) throw error;
    return NextResponse.json(
      { ok: true, hasBlueprint: !!data?.length },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return apiError(error);
  }
}
