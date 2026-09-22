import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

let storage: Map<string, string>;
let scripts: unknown[];

beforeEach(() => {
  vi.resetModules();
  storage = new Map();
  scripts = [];
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  });
  vi.stubGlobal("window", { location: { reload: vi.fn() } });
  vi.stubGlobal("document", {
    createElement: () => ({}),
    head: { appendChild: (script: unknown) => scripts.push(script) },
  });
});
afterEach(() => vi.unstubAllGlobals());

const fields = { name: "Ion Pop", phone: "+40722123456", city: "Brașov" };

describe("Meta consent and event delivery", () => {
  it("does not load Meta or queue any event before consent or after refusal", async () => {
    const meta = await import("@/lib/meta-pixel");
    meta.trackMetaPageView("/instalatii");
    meta.trackMetaLead("lead-1", fields);
    meta.saveMetaConsent(false);
    meta.trackMetaPageView("/instalatii");
    expect(scripts).toHaveLength(0);
    expect(window.fbq).toBeUndefined();
  });

  it("loads once and sends one PageView per route visit despite repeated effects", async () => {
    const meta = await import("@/lib/meta-pixel");
    meta.saveMetaConsent(true);
    meta.trackMetaPageView("/instalatii");
    meta.trackMetaPageView("/instalatii");
    expect(scripts).toHaveLength(1);
    expect(window.fbq?.queue?.filter((args) => args[1] === "PageView")).toHaveLength(1);
    meta.trackMetaPageView("/legal/privacy");
    meta.trackMetaPageView("/instalatii");
    expect(window.fbq?.queue?.filter((args) => args[1] === "PageView")).toHaveLength(3);
  });

  it("sends Lead once per submission ID and allowlists manual matching fields", async () => {
    const meta = await import("@/lib/meta-pixel");
    meta.saveMetaConsent(true);
    meta.trackMetaPageView("/instalatii");
    const input = { ...fields, email: " ION@example.com ", company: "yes", services: ["Termice"], external_id: "secret" };
    meta.trackMetaLead("lead-1", input);
    meta.trackMetaLead("lead-1", input);
    const queue = window.fbq?.queue ?? [];
    expect(queue.filter((args) => args[1] === "Lead")).toEqual([
      ["track", "Lead", {}, { eventID: "lead-1" }],
    ]);
    expect(queue.find((args) => args[0] === "init" && args.length === 3)?.[2]).toEqual({
      fn: "ion", ln: "pop", ph: "40722123456", ct: "brasov", em: "ion@example.com",
    });
    expect(queue).toContainEqual(["set", "autoConfig", false, meta.META_PIXEL_ID]);
  });

  it("blocks an in-flight form's Lead after withdrawal and clears queued events", async () => {
    const meta = await import("@/lib/meta-pixel");
    meta.saveMetaConsent(true);
    meta.trackMetaPageView("/instalatii");
    meta.saveMetaConsent(false);
    meta.trackMetaLead("lead-1", fields);
    meta.trackMetaPageView("/legal/privacy");
    expect(window.fbq?.queue).toEqual([]);
    expect(window.location.reload).toHaveBeenCalledOnce();
  });

  it("fails closed when browser storage is unavailable", async () => {
    vi.stubGlobal("localStorage", { getItem: () => { throw new Error("Blocked"); } });
    const meta = await import("@/lib/meta-pixel");
    meta.trackMetaPageView("/instalatii");
    expect(scripts).toHaveLength(0);
  });
});
