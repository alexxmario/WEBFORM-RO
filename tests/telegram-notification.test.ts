import { afterEach, describe, expect, it, vi } from "vitest";
import { notifyTelegram } from "@/lib/telegram-notification";
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });
describe("Telegram notifications", () => {
  it("does not send without a configured recipient", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "test-secret");
    vi.stubEnv("TELEGRAM_CHAT_ID", "");
    const fetcher = vi.fn(); vi.stubGlobal("fetch", fetcher);
    expect(await notifyTelegram("Cerere")).toBe("not_configured");
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("sends plain text to the configured recipient and limits message length", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "test-secret");
    vi.stubEnv("TELEGRAM_CHAT_ID", "123");
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal("fetch", fetcher);
    expect(await notifyTelegram("<client>" + "a".repeat(5000))).toBe("sent");
    const body = JSON.parse(fetcher.mock.calls[0][1].body);
    expect(body.chat_id).toBe("123");
    expect(body.text.length).toBe(4000);
    expect(body.parse_mode).toBeUndefined();
  });
  it("contains delivery failures without exposing the token", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "test-secret");
    vi.stubEnv("TELEGRAM_CHAT_ID", "123");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("test-secret")));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await notifyTelegram("Cerere")).toBe("failed");
    expect(JSON.stringify(log.mock.calls)).not.toContain("test-secret");
  });
});
