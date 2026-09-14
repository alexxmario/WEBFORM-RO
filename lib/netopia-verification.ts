import { createHash, verify } from "node:crypto";

/** NETOPIA v2 IPN verification, matching the provider's go-sdk/ipn.go. */
export function verifyNetopiaNotification(
  body: string,
  token: string | null,
  publicKey: string,
  signature: string,
): boolean {
  try {
    if (!token || !publicKey || !signature) return false;
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [headerPart, claimsPart, signedPart] = parts;
    const header = JSON.parse(Buffer.from(headerPart, "base64url").toString());
    const algorithms: Record<string, string> = {
      RS256: "RSA-SHA256",
      RS384: "RSA-SHA384",
      RS512: "RSA-SHA512",
    };
    if (!Object.prototype.hasOwnProperty.call(algorithms, header.alg))
      return false;
    if (
      !verify(
        algorithms[header.alg],
        Buffer.from(`${headerPart}.${claimsPart}`),
        publicKey.replace(/\\n/g, "\n"),
        Buffer.from(signedPart, "base64url"),
      )
    )
      return false;
    const claims = JSON.parse(Buffer.from(claimsPart, "base64url").toString());
    const now = Date.now() / 1000;
    const audience = Array.isArray(claims.aud) ? claims.aud[0] : claims.aud;
    return (
      claims.iss === "NETOPIA Payments" &&
      audience === signature &&
      (claims.exp === undefined ||
        (typeof claims.exp === "number" && claims.exp > now)) &&
      (claims.nbf === undefined ||
        (typeof claims.nbf === "number" && claims.nbf <= now)) &&
      claims.sub === createHash("sha512").update(body).digest("base64")
    );
  } catch {
    return false;
  }
}
