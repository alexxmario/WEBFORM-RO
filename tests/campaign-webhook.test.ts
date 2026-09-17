import { beforeEach, describe, it, expect, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  construct: vi.fn(),
  from: vi.fn(),
  notify: vi.fn(),
}));
vi.mock("@/lib/campaign/stripe", () => ({
  campaignStripe: () => ({ webhooks: { constructEvent: mocks.construct } }),
}));
vi.mock("@/lib/supabase/server", () => ({
  supabaseServerAdmin: () => ({ from: mocks.from }),
}));
vi.mock("@/lib/campaign/server", () => ({ notifyLead: mocks.notify }));
import { POST } from "@/app/api/campaign/webhook/route";
const request = () =>
  new Request("https://example.test/api/campaign/webhook", {
    method: "POST",
    headers: { "stripe-signature": "sig" },
    body: "raw",
  });
const event = (payment_status = "paid", amount_total = 18000) => ({
  id: "evt_test",
  created: 1700000000,
  type: "checkout.session.completed",
  data: {
    object: {
      id: "cs_test",
      mode: "subscription",
      payment_status,
      currency: "ron",
      amount_total,
      client_reference_id: "lead1",
      subscription: "sub_test",
      metadata: { campaign_checkout_id: "checkout1" },
    },
  },
});
beforeEach(() => {
  vi.clearAllMocks();
  process.env.CAMPAIGN_STRIPE_WEBHOOK_SECRET = "whsec_test";
  mocks.notify.mockResolvedValue(undefined);
});
describe("campaign Stripe webhook", () => {
  it("rejects forged signatures before accessing database", async () => {
    mocks.construct.mockImplementation(() => {
      throw new Error("bad signature");
    });
    expect((await POST(request())).status).toBe(400);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("never marks an unpaid session paid", async () => {
    mocks.construct.mockReturnValue(event("unpaid"));
    expect((await POST(request())).status).toBe(200);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("rejects unexpected amounts", async () => {
    mocks.construct.mockReturnValue(event("paid", 1));
    mocks.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: {
              lead_id: "lead1",
              interval: "month",
              plan_id: "standard_lunar",
            },
          }),
        }),
      }),
    });
    expect((await POST(request())).status).toBe(503);
    expect(mocks.notify).not.toHaveBeenCalled();
  });
  it("persists confirmed payment and retries failed notification", async () => {
    mocks.construct.mockReturnValue(event());
    const updates: unknown[] = [];
    mocks.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: {
              lead_id: "lead1",
              interval: "month",
              plan_id: "standard_lunar",
            },
          }),
        }),
      }),
      update: (data: unknown) => {
        updates.push(data);
        return { eq: () => ({ is: async () => ({ error: null }) }) };
      },
    }));
    mocks.notify.mockRejectedValueOnce(new Error("mail unavailable"));
    expect((await POST(request())).status).toBe(503);
    expect(updates).toContainEqual(
      expect.objectContaining({
        status: "paid",
        stripe_subscription_id: "sub_test",
      }),
    );
    expect((await POST(request())).status).toBe(200);
    expect(mocks.notify).toHaveBeenCalledWith("lead1", true);
  });
});
