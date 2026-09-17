import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { apiError, ApiError, jsonBody } from "@/lib/api";
import { supabaseServerAdmin } from "@/lib/supabase/server";
import { statuses } from "@/lib/campaign/schema";
import { notifyLead } from "@/lib/campaign/server";
const update = z.object({
  id: z.string().uuid(),
  revision: z.string().uuid(),
  status: z.enum(statuses).optional(),
  notes: z.string().max(10000).optional(),
  previewUrl: z.string().url().max(2000).optional(),
  extend: z.boolean().optional(),
  retryNotification: z.boolean().optional(),
});
export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const page = Math.max(
      1,
      Math.min(100000, Number(url.searchParams.get("page")) || 1),
    );
    let query = supabaseServerAdmin()
      .from("campaign_leads")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .order("id");
    if (status) {
      if (!statuses.includes(status as (typeof statuses)[number]))
        throw new ApiError(400, "Status invalid.");
      query = query.eq("status", status);
    }
    const { data, error, count } = await query.range(
      (page - 1) * 25,
      page * 25 - 1,
    );
    if (error) throw error;
    return NextResponse.json(
      { rows: data, total: count },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function PATCH(request: Request) {
  try {
    await requireAdmin(request);
    const input = update.safeParse(await jsonBody(request));
    if (!input.success) throw new ApiError(400, "Date invalide.");
    const p = input.data;
    const db = supabaseServerAdmin();
    if (p.retryNotification) {
      await notifyLead(p.id);
      const paid = await db
        .from("campaign_leads")
        .select("paid_at")
        .eq("id", p.id)
        .single();
      if (paid.error) throw paid.error;
      if (paid.data.paid_at) await notifyLead(p.id, true);
      return NextResponse.json({ ok: true });
    }
    const patch: Record<string, unknown> = {};
    if (p.status) {
      if (p.status === "paid")
        throw new ApiError(400, "Plata este confirmată automat de Stripe.");
      patch.status = p.status;
    }
    if (p.notes !== undefined) patch.notes = p.notes;
    if (p.previewUrl) {
      const u = new URL(p.previewUrl);
      const allowed = (process.env.CAMPAIGN_PREVIEW_HOSTS || "")
        .split(",")
        .map((x) => x.trim());
      if (
        u.protocol !== "https:" ||
        u.username ||
        u.password ||
        !allowed.includes(u.hostname)
      )
        throw new ApiError(
          400,
          "Folosește un domeniu HTTPS din CAMPAIGN_PREVIEW_HOSTS.",
        );
      patch.preview_url = u.toString();
      const current = await db
        .from("campaign_leads")
        .select("preview_token")
        .eq("id", p.id)
        .single();
      if (current.error) throw current.error;
      patch.preview_token =
        current.data.preview_token || randomBytes(32).toString("hex");
      patch.preview_expires_at = new Date(
        Date.now() + 14 * 86400000,
      ).toISOString();
      patch.status = "preview_sent";
    }
    if (p.extend) {
      const current = await db
        .from("campaign_leads")
        .select("preview_expires_at,preview_token")
        .eq("id", p.id)
        .single();
      if (current.error) throw current.error;
      if (!current.data.preview_token)
        throw new ApiError(400, "Publică mai întâi un preview.");
      patch.preview_expires_at = new Date(
        Math.max(Date.now(), Date.parse(current.data.preview_expires_at)) +
          14 * 86400000,
      ).toISOString();
    }
    const { data, error } = await db
      .from("campaign_leads")
      .update(patch)
      .eq("id", p.id)
      .eq("revision", p.revision)
      .select("*")
      .maybeSingle();
    if (error) throw error;
    if (!data)
      throw new ApiError(409, "Înregistrarea s-a schimbat. Reîncarcă lista.");
    return NextResponse.json({ row: data });
  } catch (e) {
    return apiError(e);
  }
}
