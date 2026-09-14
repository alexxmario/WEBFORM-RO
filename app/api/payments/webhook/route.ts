import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyNetopiaNotification } from "@/lib/netopia-verification";
import { supabaseServerAdmin } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
const notificationSchema = z.object({
  order: z.object({ orderID: z.string().min(1).max(150) }),
  payment: z.object({
    ntpID: z.string().min(1).max(150),
    amount: z.number().positive(),
    currency: z.literal("RON"),
    status: z.number().int().min(1).max(23),
    token: z.string().max(5000).optional(),
  }),
});
export async function POST(request: Request) {
  try {
    const body = await request.text();
    if (Buffer.byteLength(body) > 100_000)
      return NextResponse.json({ errorCode: 1 }, { status: 413 });
    const key = process.env.NETOPIA_IPN_PUBLIC_KEY;
    if (!key)
      return NextResponse.json(
        { errorCode: 1, errorMessage: "Verification not configured" },
        { status: 503 },
      );
    if (
      !verifyNetopiaNotification(
        body,
        request.headers.get("verification-token"),
        key,
        process.env.NETOPIA_SIGNATURE || "",
      )
    )
      return NextResponse.json(
        { errorCode: 1, errorMessage: "Invalid signature" },
        { status: 401 },
      );
    const parsed = notificationSchema.safeParse(JSON.parse(body));
    if (!parsed.success)
      return NextResponse.json(
        { errorCode: 1, errorMessage: "Invalid payload" },
        { status: 400 },
      );
    const { order, payment } = parsed.data;
    const { error } = await supabaseServerAdmin().rpc("webform_apply_payment", {
      p_order_id: order.orderID,
      p_ntp_id: payment.ntpID,
      p_amount: payment.amount,
      p_currency: payment.currency,
      p_status: payment.status,
      p_token: payment.token || null,
    });
    if (error) throw error;
    return NextResponse.json({ errorCode: 0 });
  } catch {
    return NextResponse.json(
      { errorCode: 1, errorMessage: "Notification could not be processed" },
      { status: 503 },
    );
  }
}
export async function GET() {
  return NextResponse.json({ message: "NETOPIA notification endpoint" });
}
