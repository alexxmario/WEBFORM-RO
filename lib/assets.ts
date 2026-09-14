export const ASSET_BUCKET = "webform-private-assets";
export function detectAsset(
  bytes: Uint8Array,
): { mime: string; extension: string } | null {
  const b = Buffer.from(bytes);
  if (b.length < 12) return null;
  if (b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
    return { mime: "image/png", extension: "png" };
  if (b[0] === 255 && b[1] === 216 && b[2] === 255)
    return { mime: "image/jpeg", extension: "jpg" };
  if (["GIF87a", "GIF89a"].includes(b.subarray(0, 6).toString()))
    return { mime: "image/gif", extension: "gif" };
  if (
    b.subarray(0, 4).toString() === "RIFF" &&
    b.subarray(8, 12).toString() === "WEBP"
  )
    return { mime: "image/webp", extension: "webp" };
  if (b.subarray(0, 5).toString() === "%PDF-")
    return { mime: "application/pdf", extension: "pdf" };
  return null;
}
export function assetIdFromUrl(url: string) {
  return /^\/api\/assets\/([0-9a-f-]{36})$/i.exec(url)?.[1] || null;
}
