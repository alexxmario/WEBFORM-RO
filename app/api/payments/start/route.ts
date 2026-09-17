import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  apiError,
  ApiError,
  jsonBody,
  rateLimit,
  requireUser,
} from "@/lib/api";
import { billingSchema } from "@/lib/schemas/billing";
import { getPlan } from "@/lib/pricing";
import {
  getPromotion,
  normalizePromotionCode,
  promotionPrice,
} from "@/lib/promotions";
import { supabaseServerAdmin } from "@/lib/supabase/server";
import { checkedStripePrice, stripePlanIds } from "@/lib/stripe/prices";
import { stripeServer, stripeLive, paymentOrigin } from "@/lib/stripe/server";
import { STRIPE_TERMS_VERSION, STRIPE_TERMS_TEXT } from "@/lib/stripe/terms";
const schema = z.object({
  planId: z.enum(stripePlanIds),
  requestKey: z.string().uuid(),
  billingInfo: billingSchema,
  promoCode: z.string().trim().max(40).optional(),
  accepted: z.literal(true),
  termsVersion: z.literal(STRIPE_TERMS_VERSION),
});
export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const parsed = schema.safeParse(await jsonBody(request));
    if (!parsed.success)
      throw new ApiError(
        400,
        "Verifică datele de facturare și acceptă reînnoirea abonamentului.",
      );
    await rateLimit("checkout", user.id, 10, 300);
    if (!process.env.STRIPE_WEBHOOK_SECRET)
      throw new ApiError(
        503,
        "Plata este în curs de configurare. Revino în curând.",
      );
    const { planId, requestKey, billingInfo, promoCode } = parsed.data;
    const plan = getPlan(planId)!;
    const code = normalizePromotionCode(promoCode),
      promotion = getPromotion(code);
    if (code && !promotion)
      throw new ApiError(400, "Codul promoțional nu este valid.");
    const pricing = promotion
      ? promotionPrice(plan, promotion)
      : { originalPrice: plan.price, discount: 0, finalPrice: plan.price };
    const stripe = stripeServer();
    const price = await checkedStripePrice(stripe, planId, stripeLive());
    const db = supabaseServerAdmin();
    // Check a previous completed session even when its webhook has not arrived yet.
    const previous = await db
      .from("orders")
      .select("stripe_session_id")
      .eq("user_id", user.id)
      .eq("payment_provider", "stripe")
      .not("stripe_session_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (previous.error) throw previous.error;
    if (previous.data?.stripe_session_id) {
      const session = await stripe.checkout.sessions.retrieve(
        previous.data.stripe_session_id,
      );
      if (session.status === "complete" && session.subscription) {
        const sub = await stripe.subscriptions.retrieve(
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id,
        );
        if (!["canceled", "incomplete_expired"].includes(sub.status))
          throw new ApiError(
            409,
            "Ai deja un abonament sau o plată în curs de confirmare. Gestionează-l din cont.",
          );
      }
    }
    const stored = await db
      .from("stripe_customers")
      .select("customer_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (stored.error) throw stored.error;
    if (stored.data?.customer_id) {
      const subscriptions = await stripe.subscriptions.list({
        customer: stored.data.customer_id,
        status: "all",
        limit: 100,
      });
      if (
        subscriptions.has_more ||
        subscriptions.data.some(
          (sub) => !["canceled", "incomplete_expired"].includes(sub.status),
        )
      )
        throw new ApiError(
          409,
          "Ai deja un abonament Stripe. Gestionează-l din cont.",
        );
    }
    const fingerprint = createHash("sha256")
      .update(
        JSON.stringify({
          planId,
          amount: pricing.finalPrice,
          promoCode: code,
          billingInfo,
          termsVersion: STRIPE_TERMS_VERSION,
        }),
      )
      .digest("hex");
    const claim = await db.rpc("webform_stripe_claim", {
      p_user: user.id,
      p_key: requestKey,
      p_plan: planId,
      p_amount: pricing.finalPrice,
      p_fingerprint: fingerprint,
      p_billing: promotion
        ? {
            ...billingInfo,
            promotion_code: code,
            original_amount: plan.price,
            discount_amount: pricing.discount,
          }
        : billingInfo,
      p_version: STRIPE_TERMS_VERSION,
      p_terms: STRIPE_TERMS_TEXT,
    });
    if (claim.error) {
      if (claim.error.message?.includes("Checkout expired"))
        return NextResponse.json(
          {
            error:
              "Sesiunea anterioară a expirat. Apasă din nou pentru a porni plata.",
            resetCheckout: true,
          },
          { status: 409 },
        );
      throw new ApiError(
        409,
        claim.error.message?.includes("Promotion")
          ? "Codul WEBFORM20 este disponibil doar la prima plată."
          : "Ai deja un abonament activ sau o plată în curs. Verifică în cont; pentru o sesiune nefinalizată, revino în 32 de minute.",
      );
    }
    const orderId = String(claim.data);
    const order = await db
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();
    if (order.error) throw order.error;
    if (order.data.status === "completed")
      return NextResponse.json({
        success: true,
        orderId,
        paymentUrl: `/subscribe/success?orderId=${orderId}`,
      });
    if (order.data.stripe_session_id) {
      const session = await stripe.checkout.sessions.retrieve(
        order.data.stripe_session_id,
      );
      if (session.status === "open" && session.url)
        return NextResponse.json({
          success: true,
          orderId,
          paymentUrl: session.url,
        });
      throw new ApiError(
        409,
        "Verifică starea plății în cont înainte de a începe o sesiune nouă.",
      );
    }
    let customerId = stored.data?.customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create(
        { email: user.email, metadata: { webform_user_id: user.id } },
        { idempotencyKey: `webform-customer-${user.id}` },
      );
      const save = await db
        .from("stripe_customers")
        .upsert(
          { user_id: user.id, customer_id: customer.id },
          { onConflict: "user_id", ignoreDuplicates: true },
        );
      if (save.error) throw save.error;
      const canonical = await db
        .from("stripe_customers")
        .select("customer_id")
        .eq("user_id", user.id)
        .single();
      if (canonical.error) throw canonical.error;
      customerId = canonical.data.customer_id;
    }
    const company = billingInfo.billingType === "company";
    await stripe.customers.update(customerId, {
      name: company ? billingInfo.companyName : billingInfo.name,
      phone: company ? billingInfo.contactPhone : billingInfo.phone,
      address: {
        country: "RO",
        state: company ? billingInfo.hqCounty : billingInfo.county,
        city: company ? billingInfo.hqCity : billingInfo.city,
        line1: company ? billingInfo.hqAddress : billingInfo.address,
      },
      invoice_settings: {
        custom_fields: company
          ? [
              {
                name: "CUI",
                value: `${billingInfo.cuiPrefix}${billingInfo.cui}`.slice(
                  0,
                  140,
                ),
              },
            ]
          : [],
      },
    });
    let coupon: string | undefined;
    if (promotion) {
      const created = await stripe.coupons.create(
        {
          duration: "once",
          amount_off: Math.round(pricing.discount * 100),
          currency: "ron",
          name: "WEBFORM20 — prima plată",
          max_redemptions: 1,
        },
        { idempotencyKey: `webform-discount-${orderId}` },
      );
      coupon = created.id;
    }
    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        payment_method_types: ["card"],
        customer: customerId,
        client_reference_id: orderId,
        line_items: [{ price, quantity: 1 }],
        discounts: coupon ? [{ coupon }] : undefined,
        metadata: { webform_order_id: orderId },
        subscription_data: {
          metadata: {
            webform_order_id: orderId,
            webform_user_id: user.id,
            webform_plan_id: planId,
          },
        },
        custom_text: { submit: { message: STRIPE_TERMS_TEXT } },
        success_url: `${paymentOrigin()}/subscribe/success?orderId=${encodeURIComponent(orderId)}`,
        cancel_url: `${paymentOrigin()}/subscribe/billing?planId=${planId}`,
        expires_at: Math.floor(Date.parse(order.data.created_at) / 1000) + 1860,
      },
      { idempotencyKey: `webform-session-${orderId}` },
    );
    if (!session.url) throw new Error("Missing Stripe checkout URL");
    const saved = await db
      .from("orders")
      .update({ stripe_session_id: session.id, checkout_url: session.url })
      .eq("id", orderId);
    if (saved.error) throw saved.error;
    return NextResponse.json({
      success: true,
      orderId,
      paymentUrl: session.url,
    });
  } catch (error) {
    return apiError(error);
  }
}
