import { NextResponse } from "next/server";
import { supabaseServerAdmin } from "@/lib/supabase/server";
import { processNotification, calculateExpiryDate } from "@/lib/netopia";
import { getPlan } from "@/lib/pricing";

// Disable body parsing to receive raw text from Netopia
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Get raw body text
    const rawBody = await request.text();

    let notification;
    try {
      notification = JSON.parse(rawBody);
    } catch {
      console.error("Invalid JSON from Netopia:", rawBody);
      return NextResponse.json({ errorCode: 1, errorMessage: "Invalid JSON" });
    }

    const { order, payment } = notification;

    if (!order || !payment) {
      console.error("Missing order or payment in notification:", notification);
      return NextResponse.json({ errorCode: 1, errorMessage: "Invalid notification" });
    }

    // Process the notification
    const result = processNotification({ payment, order });

    console.log("Netopia notification received:", {
      orderId: result.orderId,
      status: result.status,
      statusText: result.statusText,
      isSuccessful: result.isSuccessful,
    });

    const supabase = supabaseServerAdmin();

    // Update order status in database
    const { data: orderData, error: orderFetchError } = await supabase
      .from("orders")
      .select("user_id, plan_id")
      .eq("id", result.orderId)
      .single();

    if (orderFetchError || !orderData) {
      console.error("Order not found:", result.orderId);
      // Still respond OK to Netopia so they don't retry
      return NextResponse.json({ errorCode: 0 });
    }

    // Update order status
    await supabase
      .from("orders")
      .update({
        status: result.isSuccessful ? "completed" : result.isPending ? "pending" : "failed",
        ntp_id: result.ntpId,
        payment_token: result.token,
        error_code: result.errorCode,
        error_message: result.errorMessage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", result.orderId);

    // If payment is successful, activate subscription
    if (result.isSuccessful) {
      const plan = getPlan(orderData.plan_id);
      const expiryDate = plan ? calculateExpiryDate(plan) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          subscription_status: "active",
          subscription_plan: orderData.plan_id,
          subscription_expires_at: expiryDate.toISOString(),
          netopia_token: result.token, // For recurring payments
        })
        .eq("id", orderData.user_id);

      if (profileError) {
        console.error("Error updating profile subscription:", profileError);
      } else {
        console.log("Subscription activated for user:", orderData.user_id);
      }
    }

    // Respond to Netopia with success
    return NextResponse.json({ errorCode: 0 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Respond OK to Netopia to prevent retries
    return NextResponse.json({ errorCode: 0 });
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({ message: "Netopia webhook endpoint" });
}
