import { describe, expect, it } from "vitest";
import { createHash, generateKeyPairSync, sign } from "node:crypto";
import { verifyNetopiaNotification } from "@/lib/netopia-verification";
import { isPaymentSuccessful } from "@/lib/netopia";
const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});
const key = publicKey.export({ format: "pem", type: "spki" }).toString();
const body = JSON.stringify({ payment: { status: 3 } });
function token(overrides: Record<string, unknown> = {}) {
  const head = Buffer.from(JSON.stringify({ alg: "RS512" })).toString(
    "base64url",
  );
  const claims = Buffer.from(
    JSON.stringify({
      iss: "NETOPIA Payments",
      aud: "test-pos",
      sub: createHash("sha512").update(body).digest("base64"),
      exp: Date.now() / 1000 + 60,
      ...overrides,
    }),
  ).toString("base64url");
  return `${head}.${claims}.${sign("RSA-SHA512", Buffer.from(`${head}.${claims}`), privateKey).toString("base64url")}`;
}
describe("payment confirmation", () => {
  it("accepts a signed notification bound to the body and merchant", () =>
    expect(verifyNetopiaNotification(body, token(), key, "test-pos")).toBe(
      true,
    ));
  it("rejects a changed body", () =>
    expect(
      verifyNetopiaNotification(body + " ", token(), key, "test-pos"),
    ).toBe(false));
  it("rejects unsigned notifications", () =>
    expect(verifyNetopiaNotification(body, null, key, "test-pos")).toBe(false));
  it("rejects another merchant", () =>
    expect(verifyNetopiaNotification(body, token(), key, "other")).toBe(false));
  it("rejects expired tokens", () =>
    expect(
      verifyNetopiaNotification(body, token({ exp: 1 }), key, "test-pos"),
    ).toBe(false));
  it("does not grant a subscription for a cancelled v2 payment", () => {
    expect(isPaymentSuccessful(4)).toBe(false);
    expect(isPaymentSuccessful(3)).toBe(true);
    expect(isPaymentSuccessful(5)).toBe(true);
  });
});
