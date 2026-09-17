import { NextResponse } from "next/server";
import { stripeServer, stripeLive } from "@/lib/stripe/server";
import { processStripeEvent } from "@/lib/stripe/webhook";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret)
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 },
    );
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 512000)
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  let event;
  try {
    event = stripeServer().webhooks.constructEvent(
      raw,
      request.headers.get("stripe-signature") || "",
      secret,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  if (event.livemode !== stripeLive())
    return NextResponse.json({ error: "Mode mismatch" }, { status: 400 });
  try {
    await processStripeEvent(event);
    return NextResponse.json({ received: true });
  } catch {
    console.error("Stripe webhook requires retry", event.id, event.type);
    return NextResponse.json({ error: "Retry required" }, { status: 503 });
  }
}
