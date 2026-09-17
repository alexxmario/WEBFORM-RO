import type Stripe from "stripe";
import { stripeServer } from "./server";
import { getPlan } from "@/lib/pricing";
import { stripePriceId, type StripePlanId } from "./prices";
import { supabaseServerAdmin } from "@/lib/supabase/server";
import { ensureProjectChatWelcome } from "@/lib/chat-welcome";
import { notifyLead } from "@/lib/campaign/server";
const idOf = (value: string | { id: string } | null | undefined) =>
  typeof value === "string" ? value : value?.id;

/** Only the invoice's paid period grants access; subscription status alone never does. */
export function paidInvoice(
  invoice: Stripe.Invoice,
  sub: Stripe.Subscription,
  planId: StripePlanId,
  initialAmount: number,
) {
  if (invoice.status !== "paid") return null;
  const plan = getPlan(planId)!;
  const lines = invoice.lines.data;
  const expected =
    invoice.billing_reason === "subscription_create"
      ? initialAmount
      : plan.price;
  if (
    idOf(invoice.parent?.subscription_details?.subscription) !== sub.id ||
    invoice.currency !== "ron" ||
    !["subscription_create", "subscription_cycle"].includes(
      invoice.billing_reason || "",
    ) ||
    invoice.total !== Math.round(expected * 100) ||
    invoice.amount_remaining !== 0 ||
    invoice.lines.has_more ||
    lines.length !== 1 ||
    lines[0].quantity !== 1 ||
    lines[0].pricing?.price_details?.price !== sub.items.data[0]?.price.id ||
    lines[0].parent?.subscription_item_details?.proration ||
    !lines[0].period.end
  )
    throw new Error("Stripe invoice mismatch");
  return {
    id: invoice.id,
    amount: invoice.total / 100,
    currency: invoice.currency,
    period_end: new Date(lines[0].period.end * 1000).toISOString(),
    reason: invoice.billing_reason,
  };
}

export async function syncMainSubscription(
  sub: Stripe.Subscription,
  eventTime: number,
  invoice?: Stripe.Invoice,
) {
  const orderId = sub.metadata.webform_order_id;
  if (!orderId) return;
  const db = supabaseServerAdmin();
  const found = await db
    .from("orders")
    .select("id,user_id,plan_id,amount,payment_provider")
    .eq("id", orderId)
    .single();
  if (found.error) throw found.error;
  const order = found.data;
  const items = sub.items.data;
  const customer = idOf(sub.customer);
  if (
    order.payment_provider !== "stripe" ||
    sub.metadata.webform_user_id !== order.user_id ||
    items.length !== 1 ||
    sub.items.has_more ||
    items[0].quantity !== 1 ||
    items[0].price.id !==
      stripePriceId(order.plan_id as StripePlanId, sub.livemode) ||
    !customer
  )
    throw new Error("Stripe subscription mismatch");
  const payment = invoice
    ? paidInvoice(
        invoice,
        sub,
        order.plan_id as StripePlanId,
        Number(order.amount),
      )
    : null;
  const synced = await db.rpc("webform_stripe_sync", {
    p_order: order.id,
    p_subscription: sub.id,
    p_customer: customer,
    p_status: sub.status,
    p_cancel: sub.cancel_at_period_end,
    p_event_time: eventTime,
    p_invoice: payment,
  });
  if (synced.error) throw synced.error;
  if (payment) {
    const profile = await db
      .from("profiles")
      .select("email")
      .eq("id", order.user_id)
      .single();
    if (profile.error) throw profile.error;
    await ensureProjectChatWelcome(order.user_id, profile.data.email || "");
  }
}

async function completeCampaign(session: Stripe.Checkout.Session) {
  const checkoutId = session.metadata?.campaign_checkout_id;
  if (
    !checkoutId ||
    session.payment_status !== "paid" ||
    session.mode !== "subscription"
  )
    return;
  const db = supabaseServerAdmin();
  const checkout = await db
    .from("campaign_checkouts")
    .select("*")
    .eq("id", checkoutId)
    .single();
  if (checkout.error) throw checkout.error;
  const plan = getPlan(checkout.data.plan_id);
  if (
    !plan ||
    session.client_reference_id !== checkout.data.lead_id ||
    session.currency !== "ron" ||
    session.amount_total !== plan.price * 100 ||
    (checkout.data.stripe_session_id &&
      checkout.data.stripe_session_id !== session.id)
  )
    throw new Error("Campaign payment mismatch");
  const paidAt = new Date().toISOString();
  const lead = await db
    .from("campaign_leads")
    .update({
      status: "paid",
      paid_at: paidAt,
      stripe_subscription_id: idOf(session.subscription),
    })
    .eq("id", checkout.data.lead_id)
    .is("paid_at", null);
  if (lead.error) throw lead.error;
  const done = await db
    .from("campaign_checkouts")
    .update({ stripe_session_id: session.id, completed_at: paidAt })
    .eq("id", checkoutId)
    .is("completed_at", null);
  if (done.error) throw done.error;
  await notifyLead(checkout.data.lead_id, true);
}

export async function processStripeEvent(event: Stripe.Event) {
  const stripe = stripeServer();
  const db = supabaseServerAdmin();
  const previous = await db
    .from("stripe_webhook_events")
    .select("id")
    .eq("id", event.id)
    .maybeSingle();
  if (previous.error) throw previous.error;
  if (previous.data) return;
  if (event.type === "checkout.session.completed") {
    // Retrieve the current object so webhook payload API versions cannot change interpretation.
    const session = await stripe.checkout.sessions.retrieve(
      event.data.object.id,
    );
    if (session.metadata?.campaign_checkout_id) await completeCampaign(session);
    else if (
      session.metadata?.webform_order_id &&
      session.mode === "subscription" &&
      idOf(session.subscription)
    ) {
      const sub = await stripe.subscriptions.retrieve(
        idOf(session.subscription)!,
      );
      if (
        session.metadata.webform_order_id !== sub.metadata.webform_order_id ||
        session.client_reference_id !== sub.metadata.webform_order_id
      )
        throw new Error("Session owner mismatch");
      const invoiceId = idOf(session.invoice);
      const invoice = invoiceId
        ? await stripe.invoices.retrieve(invoiceId)
        : undefined;
      await syncMainSubscription(sub, event.created, invoice);
    }
  } else if (
    event.type === "invoice.paid" ||
    event.type === "invoice.payment_failed"
  ) {
    const invoice = await stripe.invoices.retrieve(event.data.object.id);
    const subscriptionId = idOf(
      invoice.parent?.subscription_details?.subscription,
    );
    if (subscriptionId) {
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      if (sub.metadata.webform_order_id)
        await syncMainSubscription(sub, event.created, invoice);
    }
  } else if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const sub = await stripe.subscriptions.retrieve(event.data.object.id);
    if (sub.metadata.webform_order_id)
      await syncMainSubscription(sub, event.created);
  }
  const recorded = await db
    .from("stripe_webhook_events")
    .upsert({ id: event.id }, { onConflict: "id", ignoreDuplicates: true });
  if (recorded.error) throw recorded.error;
}
