import { NextResponse } from "next/server";
import { apiError, ApiError, requireUser, rateLimit } from "@/lib/api";
import { supabaseServerAdmin } from "@/lib/supabase/server";
import { stripeServer, paymentOrigin } from "@/lib/stripe/server";
export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    await rateLimit("stripe-portal", user.id, 10, 300);
    const { data, error } = await supabaseServerAdmin()
      .from("stripe_customers")
      .select("customer_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new ApiError(404, "Nu ai încă un abonament Stripe.");
    const stripe = stripeServer();
    // Only card updates and invoices are enabled; cancellation is handled by our authenticated endpoint.
    const configuration = await stripe.billingPortal.configurations.create(
      {
        business_profile: {
          headline: "WebForm — facturi și metoda de plată",
          privacy_policy_url: `${paymentOrigin()}/legal/privacy`,
          terms_of_service_url: `${paymentOrigin()}/legal/terms`,
        },
        features: {
          payment_method_update: { enabled: true },
          invoice_history: { enabled: true },
          subscription_cancel: { enabled: false },
          subscription_update: { enabled: false },
          customer_update: { enabled: false },
        },
      },
      { idempotencyKey: "webform-portal-config-v1" },
    );
    const session = await stripe.billingPortal.sessions.create({
      customer: data.customer_id,
      configuration: configuration.id,
      return_url: `${paymentOrigin()}/account`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    return apiError(e);
  }
}
