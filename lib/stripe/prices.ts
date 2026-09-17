import liveCatalog from "./live-prices.json";
import type Stripe from "stripe";
import { getPlan } from "@/lib/pricing";

/** Live catalogue confirmed by the account owner. These IDs are not secrets. */
export const LIVE_STRIPE_PRICES = liveCatalog;
export type StripePlanId = keyof typeof LIVE_STRIPE_PRICES;
export const stripePlanIds = [
  "standard_lunar",
  "standard_anual",
  "business_lunar",
  "business_anual",
] as const;

export function stripePriceId(planId: StripePlanId, live: boolean) {
  if (live) return LIVE_STRIPE_PRICES[planId];
  const value = process.env[`STRIPE_TEST_PRICE_${planId.toUpperCase()}`];
  if (!value || !/^price_[A-Za-z0-9]+$/.test(value))
    throw new Error(`Configure STRIPE_TEST_PRICE_${planId.toUpperCase()}`);
  return value;
}

/** Fail closed if a dashboard price differs from the amount shown on our site. */
export function verifyStripePrice(
  price: Stripe.Price,
  planId: StripePlanId,
  live: boolean,
) {
  const plan = getPlan(planId)!;
  if (
    !price.active ||
    price.livemode !== live ||
    price.currency !== "ron" ||
    price.unit_amount !== plan.price * 100 ||
    price.type !== "recurring" ||
    price.recurring?.interval !== plan.interval ||
    price.recurring.interval_count !== 1 ||
    price.recurring.usage_type !== "licensed" ||
    price.billing_scheme !== "per_unit" ||
    price.transform_quantity
  ) {
    throw new Error(`Stripe price configuration does not match ${planId}`);
  }
}

export async function checkedStripePrice(
  stripe: Stripe,
  planId: StripePlanId,
  live: boolean,
) {
  const id = stripePriceId(planId, live);
  verifyStripePrice(await stripe.prices.retrieve(id), planId, live);
  return id;
}
