import { beforeEach, describe, expect, it, vi } from "vitest";
import { assignedPageSchema, localDateTime } from "@/lib/campaign/admin-schema";
const mocks = vi.hoisted(() => ({ user: vi.fn(), from: vi.fn(), notify: vi.fn() }));
vi.mock("@/lib/server-user", () => ({ getServerUser: mocks.user }));
vi.mock("@/lib/supabase/server", () => ({ supabaseServerAdmin: () => ({ from: mocks.from }) }));
vi.mock("@/lib/campaign/server", () => ({ notifyLead: mocks.notify }));
import { GET, PATCH } from "@/app/api/admin/campaign/route";
const id = "12345678-1234-4234-8234-123456789012";
const request = (patch: object, origin?: string) => new Request("http://localhost/api/admin/campaign", {
  method: "PATCH", headers: { "Content-Type": "application/json", ...(origin ? { origin } : {}) },
  body: JSON.stringify({ id, revision: id, ...patch }),
});
function admin() {
  mocks.user.mockResolvedValue({ id });
  mocks.from.mockReturnValueOnce({ select: () => ({ eq: () => ({ single: async () => ({ data: { role: "admin" } }) }) }) });
}
function query(data: unknown = { id }) {
  const q: Record<string, ReturnType<typeof vi.fn>> = {};
  for (const name of ["select", "order", "eq", "or", "not", "lte", "is", "update"]) q[name] = vi.fn(() => q);
  q.maybeSingle = vi.fn(async () => ({ data, error: null }));
  q.range = vi.fn(async () => ({ data: [], count: 0, error: null }));
  mocks.from.mockReturnValueOnce(q);
  return q;
}
beforeEach(() => { vi.resetAllMocks(); mocks.user.mockResolvedValue(null); });
describe("lead management", () => {
  it("requires authentication for reads and edits", async () => {
    expect((await GET(new Request("http://localhost/api/admin/campaign"))).status).toBe(401);
    expect((await PATCH(request({ notes: "test" }))).status).toBe(401);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("rejects non-admin edits and cross-origin writes", async () => {
    mocks.user.mockResolvedValue({ id });
    mocks.from.mockReturnValueOnce({ select: () => ({ eq: () => ({ single: async () => ({ data: { role: "client" } }) }) }) });
    expect((await PATCH(request({ assignedPage: "/ion" }))).status).toBe(403);
    expect((await PATCH(request({}, "https://other.test"))).status).toBe(403);
  });
  it("saves the page, notes and a timezone-aware follow-up together without marking preview sent", async () => {
    admin(); const q = query();
    expect((await PATCH(request({ assignedPage: "/ionel-tomas", notes: "Revino vineri", nextFollowUpAt: "2026-10-02T10:30:00+03:00" }))).status).toBe(200);
    expect(q.update).toHaveBeenCalledWith({ assigned_page: "/ionel-tomas", notes: "Revino vineri", next_follow_up_at: "2026-10-02T10:30:00+03:00" });
    expect(q.eq).toHaveBeenCalledWith("revision", id);
  });
  it("can clear assignment and follow-up", async () => {
    admin(); const q = query();
    expect((await PATCH(request({ assignedPage: null, nextFollowUpAt: null }))).status).toBe(200);
    expect(q.update).toHaveBeenCalledWith({ assigned_page: null, next_follow_up_at: null });
  });
  it("rejects stale saves", async () => {
    admin(); query(null);
    expect((await PATCH(request({ notes: "old" }))).status).toBe(409);
  });
  it.each(["//evil.test", "https://evil.test", "/../admin", "/%2fevil", "javascript:alert(1)"])("rejects unsafe page %s", async (assignedPage) => {
    admin(); expect((await PATCH(request({ assignedPage }))).status).toBe(400);
  });
  it("rejects invalid follow-up dates", async () => {
    admin(); expect((await PATCH(request({ nextFollowUpAt: "tomorrow" }))).status).toBe(400);
  });
  it("filters pending calls before pagination and excludes closed leads", async () => {
    admin(); const q = query();
    expect((await GET(new Request("http://localhost/api/admin/campaign?followUp=due&q=Ion&page=2"))).status).toBe(200);
    expect(q.not).toHaveBeenCalledWith("status", "in", "(paid,lost)");
    expect(q.lte).toHaveBeenCalledWith("next_follow_up_at", expect.any(String));
    expect(q.order).toHaveBeenCalledWith("next_follow_up_at", { ascending: true });
    expect(q.range).toHaveBeenCalledWith(25, 49);
    expect(q.or).toHaveBeenCalledWith("name.ilike.%Ion%");
  });
  it("normalizes Romanian phone searches", async () => {
    admin(); const q = query();
    await GET(new Request("http://localhost/api/admin/campaign?q=0722%20123%20456"));
    expect(q.or).toHaveBeenCalledWith("name.ilike.%0722 123 456%,phone.ilike.%+40722123456%");
  });
  it.each(["page=1.5", "page=-1", "followUp=invalid"])("rejects invalid filters %s", async (search) => {
    admin(); expect((await GET(new Request(`http://localhost/api/admin/campaign?${search}`))).status).toBe(400);
  });
  it("round trips UTC timestamps through a local date input", () => {
    const original = "2026-10-02T07:30:00.000Z";
    expect(new Date(localDateTime(original)).toISOString()).toBe(original);
    expect(localDateTime(null)).toBe("");
    expect(assignedPageSchema.parse(" /ionel-tomas ")).toBe("/ionel-tomas");
  });
});
