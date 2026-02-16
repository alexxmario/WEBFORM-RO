import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { blueprintSchema } from "@/lib/zodSchemas";
import { supabaseServerAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { sessionId, ...formData } = payload;
    const parse = blueprintSchema.safeParse(formData);

    if (!parse.success) {
      return NextResponse.json(
        { ok: false, message: "Validation failed", issues: parse.error.flatten() },
        { status: 400 },
      );
    }

    const data = parse.data;
    const supabase = supabaseServerAdmin();

    // Get user from session
    const cookieStore = await cookies();
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
        },
      }
    );
    const { data: { user } } = await supabaseAuth.auth.getUser();

    // Save to Supabase
    const { data: blueprint, error } = await supabase
      .from("blueprints")
      .insert({
        user_id: user?.id || null,
        business_name: data.identity.businessName,
        one_liner: data.identity.oneLiner,
        what_you_sell: data.identity.whatYouSell,
        brand_personality: data.identity.brandPersonality,
        main_goal: data.vision.mainGoal === "Other" && data.vision.customMainGoal
          ? data.vision.customMainGoal
          : data.vision.mainGoal,
        "references": data.look.references,
        color_preference: data.look.colorPreference,
        imagery_vibe: data.look.imageryVibe,
        assets_note: data.look.assetsNote,
        asset_uploads: data.look.assetUploads,
        pages: data.content.pages,
        cta_destination: data.content.ctaDestination,
        domain_status: data.technical.domainStatus,
        integrations: data.technical.integrations,
        current_site: data.technical.currentSite,
        timeline_confirmed: data.confirmations.termsAccepted,
        cancellation_confirmed: data.confirmations.termsAccepted,
        sla_confirmed: data.confirmations.termsAccepted,
        full_data: data,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving blueprint:", error);
      return NextResponse.json(
        { ok: false, message: "Failed to save blueprint" },
        { status: 500 },
      );
    }

    // Organize assets into blueprint folder if there are uploads and sessionId
    if (sessionId && data.look.assetUploads && data.look.assetUploads.length > 0) {
      try {
        const organizeUrl = request.url.replace('/api/blueprint', '/api/blueprint/organize-assets');
        const organizeResponse = await fetch(organizeUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            blueprintId: blueprint.id,
            assetUrls: data.look.assetUploads,
          }),
        });

        if (organizeResponse.ok) {
          const { updatedUrls } = await organizeResponse.json();

          // Update blueprint with new URLs
          if (updatedUrls && updatedUrls.length > 0) {
            await supabase
              .from("blueprints")
              .update({ asset_uploads: updatedUrls })
              .eq("id", blueprint.id);

            console.log("Assets organized successfully for blueprint:", blueprint.id);
          }
        } else {
          console.error("Failed to organize assets:", await organizeResponse.text());
        }
      } catch (organizeError) {
        console.error("Asset organization error:", organizeError);
        // Don't fail the request if asset organization fails
      }
    }

    // Send email notification
    try {
      const emailResponse = await fetch(`${request.url.replace('/api/blueprint', '/api/blueprint/notify')}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprintId: blueprint.id, data }),
      });

      const emailResult = await emailResponse.json();

      if (!emailResponse.ok) {
        console.error("Email notification failed:", emailResult);
      } else {
        console.log("Email sent successfully:", emailResult);
      }
    } catch (emailError) {
      console.error("Email notification error:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ ok: true, id: blueprint.id });
  } catch (error) {
    console.error("Blueprint submission error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const supabase = supabaseServerAdmin();

  // Get user from session
  const cookieStore = await cookies();
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );
  const { data: { user } } = await supabaseAuth.auth.getUser();

  // Check if user has submitted a blueprint
  let hasBlueprint = false;
  if (user) {
    const { data: userBlueprint } = await supabase
      .from("blueprints")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    hasBlueprint = !!userBlueprint;
  }

  const { count } = await supabase
    .from("blueprints")
    .select("*", { count: "exact", head: true });

  return NextResponse.json({ ok: true, total: count || 0, hasBlueprint });
}
