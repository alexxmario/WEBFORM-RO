import { getPlan } from "@/lib/pricing";
import { NextResponse } from "next/server";
import { campaignStripe } from "@/lib/campaign/stripe";
import { supabaseServerAdmin } from "@/lib/supabase/server";
import { notifyLead } from "@/lib/campaign/server";
export async function POST(request: Request) {
  const secret = process.env.CAMPAIGN_STRIPE_WEBHOOK_SECRET;
  if (!secret)
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  let event;
  try {
    event = campaignStripe().webhooks.constructEvent(
      await request.text(),
      request.headers.get("stripe-signature") || "",
      secret,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object;
      if (session.payment_status !== "paid" || session.mode !== "subscription")
        return NextResponse.json({ ok: true });
      const id = session.metadata?.campaign_checkout_id;
      if (!id) return NextResponse.json({ ok: true });
      const db = supabaseServerAdmin();
      const checkout = await db
        .from("campaign_checkouts")
        .select("*")
        .eq("id", id)
        .single();
      if (checkout.error) throw checkout.error;
      const plan = getPlan(checkout.data.plan_id);
      if (
        !plan ||
        checkout.data.lead_id !== session.client_reference_id ||
        session.currency !== "ron" ||
        session.amount_total !== plan.price * 100
      )
        throw new Error("Checkout mismatch");
      const paidAt = new Date(event.created * 1000).toISOString();
      const saved = await db
        .from("campaign_leads")
        .update({
          status: "paid",
          paid_at: paidAt,
          stripe_subscription_id:
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription?.id,
        })
        .eq("id", checkout.data.lead_id)
        .is("paid_at", null);
      if (saved.error) throw saved.error;
      const done = await db
        .from("campaign_checkouts")
        .update({ stripe_session_id: session.id, completed_at: paidAt })
        .eq("id", id)
        .is("completed_at", null);
      if (done.error) throw done.error;
      await notifyLead(checkout.data.lead_id, true);
    }
    return NextResponse.json({ ok: true });
  } catch {
    console.error("Campaign webhook processing failed", event.id);
    return NextResponse.json({ error: "Retry required" }, { status: 503 });
  }
}
