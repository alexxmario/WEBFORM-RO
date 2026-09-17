import { beforeEach, afterEach, it, expect, vi } from "vitest";
import Stripe from "stripe";
const mocks = vi.hoisted(() => ({ process: vi.fn() }));
vi.mock("@/lib/stripe/webhook", () => ({ processStripeEvent: mocks.process }));
import { POST } from "@/app/api/payments/stripe/webhook/route";
const stripe = new Stripe("sk_test_fake");
const secret = "whsec_local_test";
function req(body: string, valid = true) {
  return new Request("https://example.test/api/payments/stripe/webhook", {
    method: "POST",
    body,
    headers: {
      "stripe-signature": valid
        ? stripe.webhooks.generateTestHeaderString({ payload: body, secret })
        : "invalid",
    },
  });
}
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", secret);
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_fake");
  mocks.process.mockResolvedValue(undefined);
});
afterEach(() => vi.unstubAllEnvs());
it("rejects unsigned callbacks without touching entitlements", async () => {
  expect((await POST(req("{}", false))).status).toBe(400);
  expect(mocks.process).not.toHaveBeenCalled();
});
it("accepts a signed event only for the configured mode", async () => {
  expect(
    (
      await POST(
        req(
          JSON.stringify({
            id: "evt_1",
            type: "invoice.paid",
            livemode: false,
            data: { object: { id: "in_1" } },
          }),
        ),
      )
    ).status,
  ).toBe(200);
  expect(mocks.process).toHaveBeenCalledTimes(1);
});
it("rejects live events with test credentials", async () => {
  expect(
    (await POST(req(JSON.stringify({ id: "evt_1", livemode: true })))).status,
  ).toBe(400);
  expect(mocks.process).not.toHaveBeenCalled();
});
it("asks Stripe to retry when persistence fails", async () => {
  mocks.process.mockRejectedValue(new Error("database offline"));
  expect(
    (
      await POST(
        req(
          JSON.stringify({
            id: "evt_1",
            livemode: false,
            type: "invoice.paid",
          }),
        ),
      )
    ).status,
  ).toBe(503);
});
