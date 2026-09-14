import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createPaymentRequest,
  generateOrderId,
  isNetopiaConfigured,
} from "@/lib/netopia";
import { getPlan } from "@/lib/pricing";
import { billingSchema } from "@/lib/schemas/billing";
import {
  ApiError,
  apiError,
  jsonBody,
  rateLimit,
  requireUser,
  requestIP,
} from "@/lib/api";
import { supabaseServerAdmin } from "@/lib/supabase/server";
const schema = z.object({
  planId: z.string().max(50),
  requestKey: z.string().uuid(),
  billingInfo: billingSchema,
  browserData: z.record(z.string().max(2000)).optional(),
});
export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const parsed = schema.safeParse(await jsonBody(request));
    if (!parsed.success)
      throw new ApiError(400, "Verifică datele de facturare.");
    const { planId, requestKey, billingInfo, browserData } = parsed.data;
    const plan = getPlan(planId);
    if (!plan) throw new ApiError(400, "Plan invalid.");
    if (!isNetopiaConfigured())
      throw new ApiError(
        503,
        "Plata online este temporar indisponibilă. Te rugăm să ne contactezi.",
      );
    await rateLimit("checkout", user.id, 10, 300);
    const fingerprint = createHash("sha256")
      .update(JSON.stringify({ planId, amount: plan.price, billingInfo }))
      .digest("hex");
    const db = supabaseServerAdmin();
    const orderId = generateOrderId();
    // Persist before contacting the processor. The unique key handles double-clicks,
    // concurrent requests and retries after a lost HTTP response.
    const { error } = await db.from("orders").insert({
      id: orderId,
      user_id: user.id,
      plan_id: planId,
      amount: plan.price,
      currency: "RON",
      status: "pending",
      billing_info: billingInfo,
      request_key: requestKey,
      request_fingerprint: fingerprint,
    });
    if (error) {
      if (error.code !== "23505") throw error;
      const { data: existing, error: readError } = await db
        .from("orders")
        .select("id,plan_id,status,checkout_url,request_fingerprint")
        .eq("user_id", user.id)
        .eq("request_key", requestKey)
        .single();
      if (readError) throw readError;
      if (
        existing.plan_id !== planId ||
        existing.request_fingerprint !== fingerprint
      )
        throw new ApiError(409, "Planul s-a schimbat. Reîncarcă pagina.");
      if (existing.status === "completed")
        return NextResponse.json({
          success: true,
          orderId: existing.id,
          paymentUrl: `/subscribe/success?orderId=${encodeURIComponent(existing.id)}`,
        });
      if (existing.checkout_url && existing.status === "pending")
        return NextResponse.json({
          success: true,
          orderId: existing.id,
          paymentUrl: existing.checkout_url,
        });
      throw new ApiError(
        409,
        "Comanda este în curs de verificare. Nu iniția o plată nouă; verifică starea din cont.",
      );
    }
    const payment = await createPaymentRequest({
      orderId,
      userId: user.id,
      userEmail: user.email || "",
      planId,
      billingInfo,
      browserData,
      clientIp: requestIP(request),
    });
    if (!payment.paymentUrl || !payment.ntpId)
      throw new Error("Processor did not return checkout details");
    const url = new URL(payment.paymentUrl);
    if (url.protocol !== "https:")
      throw new Error("Invalid processor checkout URL");
    const { error: saveError } = await db
      .from("orders")
      .update({ ntp_id: payment.ntpId, checkout_url: payment.paymentUrl })
      .eq("id", orderId);
    if (saveError) throw saveError;
    return NextResponse.json({
      success: true,
      orderId,
      paymentUrl: payment.paymentUrl,
    });
  } catch (error) {
    return apiError(error);
  }
}
