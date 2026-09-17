import Stripe from "stripe";
import { ApiError } from "@/lib/api";
export function stripeKey() {
  return (
    process.env.STRIPE_SECRET_KEY ||
    process.env.CAMPAIGN_STRIPE_SECRET_KEY ||
    ""
  );
}
export function stripeLive() {
  return /^(sk|rk)_live_/.test(stripeKey());
}
export function stripeServer() {
  const key = stripeKey();
  if (!key)
    throw new ApiError(
      503,
      "Plata online este temporar indisponibilă. Contactează-ne.",
    );
  return new Stripe(key, { maxNetworkRetries: 2, timeout: 15000 });
}
export function paymentOrigin() {
  const url = new URL(
    process.env.STRIPE_SITE_URL ||
      process.env.CAMPAIGN_SITE_URL ||
      "https://ro.joinwebform.com",
  );
  if (url.protocol !== "https:" && url.hostname !== "localhost")
    throw new Error("Invalid Stripe return origin");
  return url.origin;
}
