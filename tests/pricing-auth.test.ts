import { describe, expect, it } from "vitest";
import { getPlan, getMonthlyEquivalent, PLANS } from "@/lib/pricing";
import { safeAuthRedirect } from "@/lib/auth-redirect";
describe("checkout pricing", () => {
  it("keeps the annual monthly equivalent exact", () => {
    expect(getMonthlyEquivalent(PLANS.business_anual)).toBe(262.5);
    expect(getMonthlyEquivalent(PLANS.standard_anual)).toBe(135);
  });
  it("charges the advertised annual discount", () => {
    expect(PLANS.business_anual.price).toBe(
      PLANS.business_lunar.price * 12 * 0.75,
    );
    expect(PLANS.standard_anual.price).toBe(
      PLANS.standard_lunar.price * 12 * 0.75,
    );
  });
  it("does not resolve unknown plans", () =>
    expect(getPlan("invalid")).toBeUndefined());
});
describe("login return path", () => {
  it("preserves selected checkout plans", () =>
    expect(safeAuthRedirect("/subscribe/billing?planId=business_anual")).toBe(
      "/subscribe/billing?planId=business_anual",
    ));
  it.each([
    "https://evil.test",
    "//evil.test",
    "/\\evil.test",
    "/\nevil.test",
    null,
  ])("rejects unsafe destinations: %s", (path) =>
    expect(safeAuthRedirect(path)).toBe("/subscribe"),
  );
});
