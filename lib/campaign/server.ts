import { leadSourceLabel } from "./lead-source";
import { Resend } from "resend";
import { ApiError } from "@/lib/api";
import { supabaseServerAdmin } from "@/lib/supabase/server";
import { tokenSchema } from "./schema";
import { campaignConfig } from "./config";
export async function previewLead(token: string) {
  if (!tokenSchema.safeParse(token).success)
    throw new ApiError(404, "Previzualizare indisponibilă.");
  const { data, error } = await supabaseServerAdmin()
    .from("campaign_leads")
    .select("*")
    .eq("preview_token", token)
    .maybeSingle();
  if (error) throw error;
  if (
    !data ||
    !data.preview_url ||
    !data.preview_expires_at ||
    Date.parse(data.preview_expires_at) <= Date.now()
  )
    throw new ApiError(
      410,
      "Previzualizarea a expirat. Cere-ne prelungirea linkului.",
    );
  return data;
}
export async function notifyLead(id: string, paid = false) {
  const db = supabaseServerAdmin();
  const { data, error } = await db
    .from("campaign_leads")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  const column = paid ? "payment_notification_sent_at" : "notification_sent_at";
  if (data[column]) return;
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.NOTIFICATION_EMAIL ||
    !process.env.NOTIFICATION_FROM_EMAIL
  )
    throw new Error("Campaign notifications not configured");
  const result = await new Resend(process.env.RESEND_API_KEY).emails.send(
    {
      from: process.env.NOTIFICATION_FROM_EMAIL,
      to: process.env.NOTIFICATION_EMAIL,
      subject: paid
        ? "Conectează domeniul — client plătit"
        : `Lead nou — sună în 5 minute: ${data.name}`,
      text: `${data.name}\nTelefon: ${data.phone}\nOraș: ${data.city || "—"}\nSursa: ${leadSourceLabel(data.source, data.attribution)}\nAfacere: ${data.business_type || "—"}\n${campaignConfig().origin}/admin/leads`,
    },
    { idempotencyKey: `campaign-${paid ? "paid" : "lead"}-${id}` },
  );
  if (result.error) throw new Error("Campaign email delivery failed");
  const update = await db
    .from("campaign_leads")
    .update({ [column]: new Date().toISOString() })
    .eq("id", id);
  if (update.error) throw update.error;
}
