import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getServerUser } from "./server-user";
import { supabaseServerAdmin } from "./supabase/server";
import { hasSubscriptionAccess } from "./subscription";
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function apiError(error: unknown) {
  if (error instanceof ApiError)
    return NextResponse.json(
      { ok: false, error: error.message, message: error.message },
      { status: error.status },
    );
  console.error(
    "API operation failed",
    error instanceof Error ? error.message : "Database or service error",
  );
  return NextResponse.json(
    {
      ok: false,
      error: "Serviciul nu este disponibil momentan. Încearcă din nou.",
      message: "Serviciul nu este disponibil momentan. Încearcă din nou.",
    },
    { status: 503 },
  );
}
export async function jsonBody(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 512_000)
    throw new ApiError(413, "Cererea este prea mare.");
  const text = await request.text();
  if (Buffer.byteLength(text) > 512_000)
    throw new ApiError(413, "Cererea este prea mare.");
  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError(400, "Date JSON invalide.");
  }
}
export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    throw new ApiError(403, "Origine nepermisă.");
}
export async function requireUser(request?: Request) {
  if (request && request.method !== "GET") checkOrigin(request);
  const user = await getServerUser(request);
  if (!user) throw new ApiError(401, "Autentificare necesară.");
  return user;
}
export async function requireSubscription(request?: Request) {
  const user = await requireUser(request);
  const { data: profile, error } = await supabaseServerAdmin()
    .from("profiles")
    .select("role,subscription_status,subscription_expires_at")
    .eq("id", user.id)
    .single();
  if (error) throw error;
  if (profile?.role !== "admin" && !hasSubscriptionAccess(profile))
    throw new ApiError(
      403,
      "Activează un abonament pentru a trimite proiectul.",
    );
  return user;
}
/** Shared, atomic database counters work across serverless instances. */
export async function rateLimit(
  scope: string,
  identity: string,
  limit: number,
  seconds: number,
) {
  const key = createHash("sha256").update(`${scope}:${identity}`).digest("hex");
  const { data, error } = await supabaseServerAdmin().rpc(
    "webform_rate_limit",
    { p_key: key, p_limit: limit, p_seconds: seconds },
  );
  if (error) throw error;
  if (!data)
    throw new ApiError(
      429,
      "Prea multe încercări. Încearcă din nou mai târziu.",
    );
}
export function requestIP(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
