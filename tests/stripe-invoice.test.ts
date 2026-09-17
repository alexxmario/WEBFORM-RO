import { describe, it, expect } from "vitest";
import type Stripe from "stripe";
import { paidInvoice } from "@/lib/stripe/webhook";
const sub = {
  id: "sub_1",
  items: { data: [{ price: { id: "price_1" } }] },
} as Stripe.Subscription;
const invoice = {
  id: "in_1",
  status: "paid",
  currency: "ron",
  total: 14400,
  amount_remaining: 0,
  billing_reason: "subscription_create",
  parent: { subscription_details: { subscription: "sub_1" } },
  lines: {
    has_more: false,
    data: [
      {
        quantity: 1,
        pricing: { price_details: { price: "price_1" } },
        parent: { subscription_item_details: { proration: false } },
        period: { end: 1900000000 },
      },
    ],
  },
} as Stripe.Invoice;
describe("invoice entitlement validation", () => {
  it("uses the paid invoice period and initial promotion amount", () => {
    expect(paidInvoice(invoice, sub, "standard_lunar", 144)).toEqual(
      expect.objectContaining({
        id: "in_1",
        amount: 144,
        period_end: new Date(1900000000000).toISOString(),
      }),
    );
  });
  it("does not activate unpaid invoices", () =>
    expect(
      paidInvoice({ ...invoice, status: "open" }, sub, "standard_lunar", 144),
    ).toBeNull());
  it.each([
    { currency: "eur" },
    { total: 1 },
    { amount_remaining: 100 },
    { billing_reason: "subscription_update" },
    { parent: { subscription_details: { subscription: "sub_other" } } },
    { lines: { ...invoice.lines, has_more: true } },
  ])("rejects unsupported invoice %j", (patch) =>
    expect(() =>
      paidInvoice(
        { ...invoice, ...patch } as Stripe.Invoice,
        sub,
        "standard_lunar",
        144,
      ),
    ).toThrow(),
  );
  it("does not repeat the first-payment discount on renewals", () => {
    expect(() =>
      paidInvoice(
        { ...invoice, billing_reason: "subscription_cycle" },
        sub,
        "standard_lunar",
        144,
      ),
    ).toThrow();
    expect(
      paidInvoice(
        { ...invoice, billing_reason: "subscription_cycle", total: 18000 },
        sub,
        "standard_lunar",
        144,
      )?.amount,
    ).toBe(180);
  });
});
