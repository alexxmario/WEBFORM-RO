import { Resend } from "resend";
import { supabaseServerAdmin } from "./supabase/server";
/** Email is secondary: a persisted blueprint never depends on delivery availability. */
export async function notifyBlueprint(id: string) {
  const db = supabaseServerAdmin();
  const { data: blueprint, error } = await db
    .from("blueprints")
    .select("business_name,user_id,notification_sent_at")
    .eq("id", id)
    .single();
  if (error) throw error;
  if (blueprint.notification_sent_at) return "sent";
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.NOTIFICATION_EMAIL ||
    !process.env.NOTIFICATION_FROM_EMAIL
  )
    return "not_configured";
  const { error: sendError } = await new Resend(
    process.env.RESEND_API_KEY,
  ).emails.send(
    {
      from: process.env.NOTIFICATION_FROM_EMAIL,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `Proiect nou WebForm: ${blueprint.business_name}`,
      text: `Un proiect nou a fost salvat.\nAfacere: ${blueprint.business_name}\nID: ${id}\nAccesează baza de date pentru detalii.`,
    },
    { idempotencyKey: `blueprint-${id}` },
  );
  if (sendError) throw sendError;
  const { error: updateError } = await db
    .from("blueprints")
    .update({ notification_sent_at: new Date().toISOString() })
    .eq("id", id);
  if (updateError) throw updateError;
  return "sent";
}
