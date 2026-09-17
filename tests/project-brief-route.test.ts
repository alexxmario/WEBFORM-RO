import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ user: vi.fn(), from: vi.fn(), rpc: vi.fn(), upsert: vi.fn(), notify: vi.fn() }));
vi.mock("@/lib/server-user", () => ({ getServerUser: mocks.user }));
vi.mock("@/lib/supabase/server", () => ({ supabaseServerAdmin: () => ({ from: mocks.from, rpc: mocks.rpc }) }));
vi.mock("@/lib/blueprint-notification", () => ({ notifyBlueprint: mocks.notify }));
import { POST } from "@/app/api/blueprint/route";
const payload = { briefVersion: 2, submissionKey: "00000000-0000-4000-8000-000000000001", businessName: "Atelier Luna", offering: "Mobilier la comandă", audience: "București", goal: "Cereri de ofertă", contact: "contact@example.test", termsAccepted: true };
const request = (body = payload) => new Request("http://localhost/api/blueprint", { method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json" } });
beforeEach(() => {
  vi.clearAllMocks();
  mocks.user.mockResolvedValue({ id: "owner" }); mocks.rpc.mockResolvedValue({ data: true });
  mocks.from.mockReturnValue({ upsert: mocks.upsert });
  mocks.upsert.mockReturnValue({ select: () => ({ maybeSingle: async () => ({ data: { id: "brief-id" }, error: null }) }) });
  mocks.notify.mockResolvedValue("sent");
});
it("saves the short brief through the authenticated endpoint without template selection", async () => {
  expect((await POST(request())).status).toBe(200);
  expect(mocks.upsert).toHaveBeenCalledWith(expect.objectContaining({ user_id: "owner", submission_key: payload.submissionKey, domain_status: null, references: [], pages: [], main_goal: payload.goal, full_data: expect.objectContaining({ briefVersion: 2 }) }), { onConflict: "user_id,submission_key", ignoreDuplicates: true });
});
it("does not persist an invalid essential answer", async () => {
  expect((await POST(request({ ...payload, offering: " " }))).status).toBe(400);
  expect(mocks.upsert).not.toHaveBeenCalled();
});
it("requires authentication before saving", async () => {
  mocks.user.mockResolvedValue(null);
  expect((await POST(request())).status).toBe(401);
  expect(mocks.upsert).not.toHaveBeenCalled();
});
