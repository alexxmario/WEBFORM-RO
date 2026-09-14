import { beforeEach, expect, it, vi } from "vitest";
import { createHash } from "node:crypto";
const mocks = vi.hoisted(() => ({
  user: vi.fn(),
  from: vi.fn(),
  rpc: vi.fn(),
  payment: vi.fn(),
}));
vi.mock("@/lib/server-user", () => ({ getServerUser: mocks.user }));
vi.mock("@/lib/supabase/server", () => ({
  supabaseServerAdmin: () => ({ from: mocks.from, rpc: mocks.rpc }),
}));
vi.mock("@/lib/netopia", () => ({
  isNetopiaConfigured: () => true,
  generateOrderId: () => "WF-test",
  createPaymentRequest: mocks.payment,
}));
import { POST } from "@/app/api/payments/start/route";
const billingInfo = {
  billingType: "individual",
  name: "Ana Popescu",
  phone: "0723456789",
  county: "Cluj",
  city: "Cluj",
  address: "Strada Test 12",
};
const body = {
  planId: "standard_lunar",
  requestKey: "00000000-0000-4000-8000-000000000001",
  billingInfo,
};
const request = () =>
  new Request("http://localhost:3000/api/payments/start", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
beforeEach(() => {
  vi.clearAllMocks();
  mocks.user.mockResolvedValue({ id: "customer", email: "ana@example.test" });
  mocks.rpc.mockResolvedValue({ data: true });
  mocks.payment.mockResolvedValue({
    paymentUrl: "https://secure.netopia-payments.com/payment",
    ntpId: "ntp-test",
  });
});
it("does not start payment for an anonymous user", async () => {
  mocks.user.mockResolvedValue(null);
  expect((await POST(request())).status).toBe(401);
  expect(mocks.payment).not.toHaveBeenCalled();
});
it("saves the server-priced order before contacting the payment processor", async () => {
  const insert = vi.fn().mockResolvedValue({ error: null });
  const update = vi
    .fn()
    .mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
  mocks.from.mockReturnValueOnce({ insert }).mockReturnValueOnce({ update });
  expect((await POST(request())).status).toBe(200);
  expect(insert).toHaveBeenCalledWith(
    expect.objectContaining({
      amount: 180,
      currency: "RON",
      user_id: "customer",
      id: "WF-test",
    }),
  );
  expect(insert.mock.invocationCallOrder[0]).toBeLessThan(
    mocks.payment.mock.invocationCallOrder[0],
  );
});
it("never initiates a charge when the order cannot be saved", async () => {
  mocks.from.mockReturnValue({
    insert: vi.fn().mockResolvedValue({ error: { code: "DB_FAILURE" } }),
  });
  expect((await POST(request())).status).toBe(503);
  expect(mocks.payment).not.toHaveBeenCalled();
});
it("reuses the original checkout on a duplicate request", async () => {
  const fingerprint = createHash("sha256")
    .update(JSON.stringify({ planId: body.planId, amount: 180, billingInfo }))
    .digest("hex");
  const query: {
    select: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    single: ReturnType<typeof vi.fn>;
  } = {
    select: vi.fn(),
    eq: vi.fn(),
    single: vi
      .fn()
      .mockResolvedValue({
        data: {
          id: "old-order",
          plan_id: body.planId,
          status: "pending",
          checkout_url: "https://secure.netopia-payments.com/original",
          request_fingerprint: fingerprint,
        },
      }),
  };
  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  mocks.from
    .mockReturnValueOnce({
      insert: vi.fn().mockResolvedValue({ error: { code: "23505" } }),
    })
    .mockReturnValueOnce(query);
  const response = await POST(request());
  expect(response.status).toBe(200);
  expect((await response.json()).paymentUrl).toContain("/original");
  expect(mocks.payment).not.toHaveBeenCalled();
});
