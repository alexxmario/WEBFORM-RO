import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, ApiError, jsonBody } from "@/lib/api";
import { requireAdmin, projectStatuses } from "@/lib/admin";
import { supabaseServerAdmin } from "@/lib/supabase/server";

const sources = {
  clients: { table: "profiles", columns: "id,email,name,business_name,role,subscription_status,subscription_plan,subscription_expires_at,created_at" },
  projects: { table: "blueprints", columns: "id,user_id,business_name,one_liner,created_at,workflow_status,admin_notes,admin_revision,full_data,asset_uploads" },
  orders: { table: "orders", columns: "id,user_id,plan_id,amount,currency,status,created_at" },
  leads: { table: "waitlist", columns: "id,email,name,business_type,tier,created_at" },
} as const;
const querySchema = z.object({ view: z.enum(["clients", "projects", "orders", "leads"]).default("projects"), page: z.coerce.number().int().min(1).max(100000).default(1) });
const updateSchema = z.object({ id: z.string().uuid(), status: z.enum(projectStatuses), notes: z.string().max(10000), revision: z.string().uuid() }).strict();
export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const input = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
    if (!input.success) throw new ApiError(400, "Filtre invalide.");
    const { view, page } = input.data;
    const db = supabaseServerAdmin();
    const source = sources[view];
    const [rows, ...counts] = await Promise.all([
      db.from(source.table).select(source.columns, { count: "exact" }).order("created_at", { ascending: false }).order("id").range((page - 1) * 25, page * 25 - 1),
      db.from("profiles").select("id", {count:"exact",head:true}).eq("role","client"),
      db.from("blueprints").select("id", {count:"exact",head:true}).neq("workflow_status","published"),
      db.from("orders").select("id", {count:"exact",head:true}).eq("status","pending"),
      db.from("waitlist").select("id", {count:"exact",head:true}),
    ]);
    for (const result of [rows, ...counts]) if (result.error) throw result.error;
    return NextResponse.json({ rows: rows.data, total: rows.count, counts: counts.map(result => result.count ?? 0) }, { headers: {"Cache-Control":"private, no-store"} });
  } catch (error) { return apiError(error); }
}
export async function PATCH(request: Request) {
  try {
    await requireAdmin(request);
    const input = updateSchema.safeParse(await jsonBody(request));
    if (!input.success) throw new ApiError(400, "Datele proiectului sunt invalide.");
    const {id, status, notes, revision} = input.data;
    const { data, error } = await supabaseServerAdmin().from("blueprints")
      .update({workflow_status:status,admin_notes:notes,admin_revision:crypto.randomUUID()})
      .eq("id",id).eq("admin_revision",revision).select("id,workflow_status,admin_notes,admin_revision").maybeSingle();
    if (error) throw error;
    if (!data) throw new ApiError(409, "Proiectul a fost modificat sau nu mai există. Reîncarcă lista înainte de a salva.");
    return NextResponse.json({project:data}, {headers:{"Cache-Control":"private, no-store"}});
  } catch (error) { return apiError(error); }
}
