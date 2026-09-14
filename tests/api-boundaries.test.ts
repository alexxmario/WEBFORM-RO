import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  user: vi.fn(),
  rpc: vi.fn(),
  from: vi.fn(),
}));
vi.mock("@/lib/server-user", () => ({ getServerUser: mocks.user }));
vi.mock("@/lib/supabase/server", () => ({
  supabaseServerAdmin: () => ({ rpc: mocks.rpc, from: mocks.from }),
}));
import { POST as initChat } from "@/app/api/chat/init/route";
import { POST as cancel } from "@/app/api/subscription/cancel/route";
import { POST as blueprint } from "@/app/api/blueprint/route";
import { POST as webhook } from "@/app/api/payments/webhook/route";
beforeEach(() => {
  vi.clearAllMocks();
  mocks.user.mockResolvedValue(null);
  mocks.rpc.mockResolvedValue({ data: true, error: null });
});
const req = (path: string, body: unknown = {}) =>
  new Request(`http://localhost:3000${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
describe("API security boundaries", () => {
  it.each([
    ["chat", initChat],
    ["cancel", cancel],
    ["blueprint", blueprint],
  ] as const)(
    "rejects anonymous %s writes before accessing data",
    async (_name, handler) => {
      expect((await handler(req("/api/test"))).status).toBe(401);
      expect(mocks.rpc).not.toHaveBeenCalled();
      expect(mocks.from).not.toHaveBeenCalled();
    },
  );
  it("ignores client-supplied user IDs and admin emails", async () => {
    mocks.user.mockResolvedValue({
      id: "real-user",
      email: "real@example.test",
    });
    mocks.rpc
      .mockResolvedValueOnce({ data: true })
      .mockResolvedValueOnce({ data: "room-id" });
    const r = await initChat(
      req("/api/chat/init", {
        userId: "victim",
        email: "admin@example.test",
        role: "admin",
      }),
    );
    expect(r.status).toBe(200);
    expect(mocks.rpc).toHaveBeenLastCalledWith("webform_init_room", {
      p_user_id: "real-user",
      p_email: "real@example.test",
    });
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("blocks cross-origin authenticated mutations", async () => {
    mocks.user.mockResolvedValue({ id: "real-user" });
    const r = await cancel(
      new Request("http://localhost:3000/api/subscription/cancel", {
        method: "POST",
        headers: { origin: "https://attacker.test" },
      }),
    );
    expect(r.status).toBe(403);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("never processes an unsigned payment callback", async () => {
    vi.stubEnv("NETOPIA_IPN_PUBLIC_KEY", "not-a-real-key");
    const r = await webhook(
      req("/api/payments/webhook", {
        order: { orderID: "fake" },
        payment: { status: 3 },
      }),
    );
    expect(r.status).toBe(401);
    expect(mocks.rpc).not.toHaveBeenCalled();
    vi.unstubAllEnvs();
  });
});
