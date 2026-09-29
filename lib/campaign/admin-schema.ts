import { z } from "zod";

// Only local, readable page paths: never a protocol-relative or executable URL.
export const assignedPageSchema = z.string().trim().max(300).regex(
  /^\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\/?$/,
  "Introdu o cale precum /numele-clientului.",
).nullable();

export const followUpSchema = z.string().datetime({ offset: true }).nullable();

export function localDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
