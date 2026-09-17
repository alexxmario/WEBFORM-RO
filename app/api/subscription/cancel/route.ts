import { NextResponse } from "next/server";
import { apiError, requireUser, rateLimit } from "@/lib/api";
import { supabaseServerAdmin } from "@/lib/supabase/server";
import { stripeServer } from "@/lib/stripe/server";
import { syncMainSubscription } from "@/lib/stripe/webhook";
export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    await rateLimit("cancel", user.id, 10, 300);
    const db = supabaseServerAdmin();
    const subscription = await db
      .from("stripe_subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .not("status", "in", "(canceled,incomplete_expired)")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (subscription.error) throw subscription.error;
    if (subscription.data) {
      const sub = await stripeServer().subscriptions.update(
        subscription.data.id,
        { cancel_at_period_end: true },
        { idempotencyKey: `webform-cancel-${subscription.data.id}` },
      );
      await syncMainSubscription(sub, Math.floor(Date.now() / 1000));
    } else {
      const { error } = await db
        .from("profiles")
        .update({ subscription_status: "cancelled", netopia_token: null })
        .eq("id", user.id)
        .eq("subscription_status", "active");
      if (error) throw error;
    }
    return NextResponse.json({
      success: true,
      message:
        "Reînnoirea este oprită. Accesul rămâne disponibil până la expirarea perioadei plătite.",
    });
  } catch (error) {
    return apiError(error);
  }
}
