import { beforeEach, expect, it, vi } from "vitest";
import data from "@/lib/marketing-articles.json";
import { normalizeSubmission } from "@/lib/admin-submissions";
const mocks = vi.hoisted(() => ({ insert: vi.fn(), single: vi.fn(), telegram: vi.fn(), email: vi.fn(), after: vi.fn() }));
vi.mock("next/server", async (original) => ({ ...await original<typeof import("next/server")>(), after: mocks.after }));
vi.mock("@/lib/api", async (original) => ({ ...await original<typeof import("@/lib/api")>(), checkOrigin: vi.fn(), rateLimit: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ supabaseServerAdmin: () => ({ from: () => ({ insert: mocks.insert }) }) }));
vi.mock("@/lib/telegram-notification", () => ({ notifyTelegram: mocks.telegram }));
vi.mock("@/lib/campaign/server", () => ({ notifyLead: mocks.email }));
import { POST } from "@/app/api/campaign/leads/route";
const payload = { source: "homepage", name: "Test articol", phone: "0722123456", businessType: "Atelier", consent: true, eventId: "00000000-0000-4000-8000-000000000001", attribution: { article_slug: data.articles[0].slug, utm_content: "reclama-1" } };
const request = (body: unknown = payload) => new Request("http://localhost/api/campaign/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
beforeEach(() => {
  vi.clearAllMocks();
  mocks.insert.mockReturnValue({ select: () => ({ single: mocks.single }) });
  mocks.single.mockResolvedValue({ data: { id: "lead-1" }, error: null });
  mocks.email.mockResolvedValue(undefined);
  mocks.telegram.mockResolvedValue("sent");
});
it("saves article attribution and schedules both existing notifications with the ad identified", async () => {
  expect((await POST(request())).status).toBe(200);
  const saved = mocks.insert.mock.calls[0][0];
  expect(saved).toMatchObject({ source: "homepage", business_type: "Atelier", attribution: payload.attribution, phone: "+40722123456" });
  expect(normalizeSubmission("campaign", { ...saved, id: "lead-1" }).submission_source).toContain("reclama 1");
  await mocks.after.mock.calls[0][0]();
  expect(mocks.telegram).toHaveBeenCalledWith(expect.stringContaining("Articol · reclama 1"));
  expect(mocks.email).toHaveBeenCalledWith("lead-1");
});
it("does not duplicate notifications on a retried event", async () => {
  mocks.single.mockResolvedValue({ data: null, error: { code: "23505" } });
  expect((await POST(request())).status).toBe(200);
  expect(mocks.after).not.toHaveBeenCalled();
});
it("requires consent before creating a lead", async () => {
  expect((await POST(request({ ...payload, consent: false }))).status).toBe(400);
  expect(mocks.insert).not.toHaveBeenCalled();
});
it("keeps each selected ad independently identifiable in admin", () => {
  expect(data.articles).toHaveLength(11);
  expect(new Set(data.articles.map(a => a.slug)).size).toBe(11);
  for (const a of data.articles) expect(normalizeSubmission("campaign", { id: "test", source: "homepage", attribution: { article_slug: a.slug } }).submission_source).toContain(`reclama ${a.ad} ·`);
});
