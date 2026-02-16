import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { createPaymentRequest, isNetopiaConfigured } from "@/lib/netopia";
import { getPlan } from "@/lib/pricing";

export async function POST(request: Request) {
  try {
    const { planId, browserData } = await request.json();

    // Validate plan
    const plan = getPlan(planId);
    if (!plan) {
      return NextResponse.json(
        { error: "Plan invalid" },
        { status: 400 }
      );
    }

    // Check if Netopia is configured
    if (!isNetopiaConfigured()) {
      return NextResponse.json(
        {
          error: "Sistemul de plati nu este configurat inca. Te rugam sa ne contactezi pentru plata manuala.",
          notConfigured: true,
        },
        { status: 503 }
      );
    }

    // Get the access token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Trebuie sa fii autentificat" },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace("Bearer ", "");

    // Create Supabase client with the access token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    );

    // Get user from the token
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Trebuie sa fii autentificat" },
        { status: 401 }
      );
    }

    // Get user profile for name
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, business_name")
      .eq("id", user.id)
      .single();

    const userName = profile?.name || profile?.business_name || "Client";

    // Get client IP
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Create payment request
    const paymentResult = await createPaymentRequest({
      userId: user.id,
      userEmail: user.email || "",
      userName,
      planId,
      browserData,
      clientIp,
    });

    // Store order in database for tracking (use service role for insert)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: orderError } = await supabaseAdmin.from("orders").insert({
      id: paymentResult.orderId,
      user_id: user.id,
      plan_id: planId,
      amount: plan.price,
      currency: "RON",
      status: "pending",
      ntp_id: paymentResult.ntpId,
    });

    if (orderError) {
      console.error("Error saving order:", orderError);
      // Don't fail the payment, just log the error
    }

    return NextResponse.json({
      success: true,
      orderId: paymentResult.orderId,
      paymentUrl: paymentResult.paymentUrl,
    });
  } catch (error) {
    console.error("Payment start error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Eroare la initierea platii",
      },
      { status: 500 }
    );
  }
}
