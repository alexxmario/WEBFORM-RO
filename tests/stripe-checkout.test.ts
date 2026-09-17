import { beforeEach, afterEach, it, expect, vi } from "vitest";
const m = vi.hoisted(() => ({
  user: vi.fn(),
  from: vi.fn(),
  rpc: vi.fn(),
  price: vi.fn(),
  create: vi.fn(),
  customerCreate: vi.fn(),
  customerUpdate: vi.fn(),
  coupon: vi.fn(),
  sessionGet: vi.fn(),
  subList: vi.fn(),
}));
vi.mock("@/lib/server-user", () => ({ getServerUser: m.user }));
vi.mock("@/lib/supabase/server", () => ({
  supabaseServerAdmin: () => ({ from: m.from, rpc: m.rpc }),
}));
vi.mock("@/lib/stripe/prices", async (orig) => ({
  ...(await orig<typeof import("@/lib/stripe/prices")>()),
  checkedStripePrice: m.price,
}));
vi.mock("@/lib/stripe/server", () => ({
  stripeLive: () => true,
  paymentOrigin: () => "https://example.test",
  stripeServer: () => ({
    checkout: { sessions: { create: m.create, retrieve: m.sessionGet } },
    subscriptions: { list: m.subList },
    customers: { create: m.customerCreate, update: m.customerUpdate },
    coupons: { create: m.coupon },
  }),
}));
import { POST } from "@/app/api/payments/start/route";
import { STRIPE_TERMS_VERSION } from "@/lib/stripe/terms";
const body = {
  planId: "standard_lunar",
  requestKey: "00000000-0000-4000-8000-000000000001",
  accepted: true,
  termsVersion: STRIPE_TERMS_VERSION,
  billingInfo: {
    billingType: "individual",
    name: "Ana Pop",
    phone: "0722123456",
    county: "CJ",
    city: "Cluj",
    address: "Strada Test 12",
  },
};
const req = (patch: Record<string, unknown> = {}) =>
  new Request("https://example.test/api/payments/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, ...patch }),
  });
function query(data: unknown = null) {
  const q = {
    select: vi.fn(),
    eq: vi.fn(),
    not: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    single: vi.fn().mockResolvedValue({ data }),
    maybeSingle: vi.fn().mockResolvedValue({ data }),
    update: vi.fn(),
    upsert: vi.fn().mockResolvedValue({ error: null }),
  };
  for (const method of [
    "select",
    "eq",
    "not",
    "order",
    "limit",
    "update",
  ] as const)
    q[method].mockReturnValue(q);
  return q;
}
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
  m.user.mockResolvedValue({ id: "user1", email: "ana@example.test" });
  m.price.mockResolvedValue("price_confirmed");
  m.rpc.mockImplementation((name: string) =>
    Promise.resolve({ data: name === "webform_rate_limit" ? true : "order1" }),
  );
  m.subList.mockResolvedValue({ data: [], has_more: false });
  m.customerUpdate.mockResolvedValue({});
  m.coupon.mockResolvedValue({ id: "coupon1" });
  m.create.mockResolvedValue({
    id: "cs_1",
    url: "https://checkout.stripe.com/example",
  });
});
afterEach(() => vi.unstubAllEnvs());
it("requires authenticated user and explicit recurring consent", async () => {
  expect((await POST(req({ accepted: false }))).status).toBe(400);
  expect(m.create).not.toHaveBeenCalled();
  m.user.mockResolvedValue(null);
  expect((await POST(req())).status).toBe(401);
});
it("does not create a checkout without webhook configuration", async () => {
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", "");
  expect((await POST(req())).status).toBe(503);
  expect(m.create).not.toHaveBeenCalled();
});
it("never contacts Stripe Checkout if the database rejects the claim", async () => {
  m.from.mockReturnValue(query());
  m.rpc.mockImplementation((name: string) =>
    Promise.resolve(
      name === "webform_rate_limit"
        ? { data: true }
        : { error: { message: "Subscription already exists" } },
    ),
  );
  expect((await POST(req())).status).toBe(409);
  expect(m.create).not.toHaveBeenCalled();
});
it("uses the existing catalog price, persists consent and limits WEBFORM20 to one invoice", async () => {
  const saved = {
    update: vi
      .fn()
      .mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
  };
  m.from
    .mockReturnValueOnce(query())
    .mockReturnValueOnce(query({ customer_id: "cus_1" }))
    .mockReturnValueOnce(
      query({
        id: "order1",
        created_at: new Date().toISOString(),
        status: "pending",
      }),
    )
    .mockReturnValueOnce(saved);
  expect((await POST(req({ promoCode: "WEBFORM20" }))).status).toBe(200);
  expect(m.rpc).toHaveBeenCalledWith(
    "webform_stripe_claim",
    expect.objectContaining({
      p_amount: 144,
      p_version: STRIPE_TERMS_VERSION,
      p_user: "user1",
    }),
  );
  expect(m.coupon).toHaveBeenCalledWith(
    expect.objectContaining({
      duration: "once",
      amount_off: 3600,
      max_redemptions: 1,
    }),
    expect.anything(),
  );
  expect(m.create).toHaveBeenCalledWith(
    expect.objectContaining({
      mode: "subscription",
      line_items: [{ price: "price_confirmed", quantity: 1 }],
      customer: "cus_1",
      discounts: [{ coupon: "coupon1" }],
    }),
    { idempotencyKey: "webform-session-order1" },
  );
  expect(m.rpc.mock.invocationCallOrder[1]).toBeLessThan(
    m.create.mock.invocationCallOrder[0],
  );
});
it("blocks a duplicate subscription even if the first webhook was lost", async () => {
  m.from
    .mockReturnValueOnce(query())
    .mockReturnValueOnce(query({ customer_id: "cus_1" }));
  m.subList.mockResolvedValue({
    data: [{ status: "active" }],
    has_more: false,
  });
  expect((await POST(req())).status).toBe(409);
  expect(m.create).not.toHaveBeenCalled();
});
