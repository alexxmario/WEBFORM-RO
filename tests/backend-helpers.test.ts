import { describe, it, expect } from "vitest";
import { hasSubscriptionAccess } from "@/lib/subscription";
import { detectAsset, assetIdFromUrl } from "@/lib/assets";
import { configuredVat, processorBilling } from "@/lib/payment-request";
describe("subscription access", () => {
  const now = new Date("2026-09-12T12:00:00Z");
  it.each(["active", "cancelled"])(
    "keeps paid access for %s until expiry",
    (status) =>
      expect(
        hasSubscriptionAccess(
          {
            subscription_status: status,
            subscription_expires_at: "2026-10-12T12:00:00Z",
          },
          now,
        ),
      ).toBe(true),
  );
  it.each([null, "bad-date", "2026-09-12T12:00:00Z"])(
    "rejects missing, invalid or expired dates: %s",
    (expiry) =>
      expect(
        hasSubscriptionAccess(
          { subscription_status: "active", subscription_expires_at: expiry },
          now,
        ),
      ).toBe(false),
  );
});
describe("uploads", () => {
  it("rejects active HTML even if a client claims image/png", () =>
    expect(
      detectAsset(Buffer.from("<html><script>alert(1)</script>")),
    ).toBeNull());
  it("recognizes file signatures", () =>
    expect(
      detectAsset(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]))
        ?.mime,
    ).toBe("image/png"));
  it("only accepts application asset URLs", () => {
    expect(assetIdFromUrl("https://evil.test/file")).toBeNull();
    expect(
      assetIdFromUrl("/api/assets/00000000-0000-4000-8000-000000000001"),
    ).toBeTruthy();
  });
});
describe("billing", () => {
  it("never infers a missing tax rate", () => {
    expect(configuredVat("")).toBeNull();
    expect(configuredVat("0")).toBe(0);
    expect(configuredVat("-1")).toBeNull();
  });
  it("uses the customer billing address instead of placeholders", () => {
    const r = processorBilling(
      {
        billingType: "individual",
        name: "Ana Popescu",
        phone: "0723456789",
        county: "Cluj",
        city: "Cluj-Napoca",
        address: "Strada Testului 12",
      },
      "ana@example.test",
    );
    expect(r).toMatchObject({
      firstName: "Ana",
      lastName: "Popescu",
      phone: "0723456789",
      city: "Cluj-Napoca",
      state: "Cluj",
      details: "Strada Testului 12",
    });
  });
});
