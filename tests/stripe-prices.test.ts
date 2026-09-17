import { afterEach, describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";
import {
  LIVE_STRIPE_PRICES,
  stripePriceId,
  verifyStripePrice,
} from "@/lib/stripe/prices";
afterEach(() => vi.unstubAllEnvs());
const price = {
  active: true,
  livemode: true,
  currency: "ron",
  unit_amount: 18000,
  type: "recurring",
  billing_scheme: "per_unit",
  transform_quantity: null,
  recurring: { interval: "month", interval_count: 1, usage_type: "licensed" },
} as Stripe.Price;
describe("confirmed Stripe catalogue", () => {
  it("maps the owner's four live prices to the correct plans", () => {
    expect(LIVE_STRIPE_PRICES).toEqual({
      standard_anual: "price_1UGfIALBC1ri3elDZcu38kbZ",
      business_anual: "price_1UGfGpLBC1ri3elDTtZOBKG6",
      business_lunar: "price_1UGfDqLBC1ri3elDEnT4hljB",
      standard_lunar: "price_1UGfC9LBC1ri3elDFh2hOezc",
    });
  });
  it("does not fall back to live prices in test mode", () => {
    vi.stubEnv("STRIPE_TEST_PRICE_STANDARD_LUNAR", "");
    expect(() => stripePriceId("standard_lunar", false)).toThrow();
    vi.stubEnv("STRIPE_TEST_PRICE_STANDARD_LUNAR", "price_test");
    expect(stripePriceId("standard_lunar", false)).toBe("price_test");
  });
  it("accepts the expected RON recurring price", () =>
    expect(() =>
      verifyStripePrice(price, "standard_lunar", true),
    ).not.toThrow());
  it.each([
    { unit_amount: 35000 },
    { currency: "eur" },
    { active: false },
    { livemode: false },
    {
      recurring: {
        interval: "year",
        interval_count: 1,
        usage_type: "licensed",
      },
    },
    {
      recurring: {
        interval: "month",
        interval_count: 2,
        usage_type: "licensed",
      },
    },
    {
      recurring: {
        interval: "month",
        interval_count: 1,
        usage_type: "metered",
      },
    },
  ])("rejects mismatched dashboard settings %j", (change) =>
    expect(() =>
      verifyStripePrice(
        { ...price, ...change } as Stripe.Price,
        "standard_lunar",
        true,
      ),
    ).toThrow(),
  );
});
