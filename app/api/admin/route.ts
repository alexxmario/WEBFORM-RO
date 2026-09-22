import { normalizeSubmission, paginateSubmissions } from "@/lib/admin-submissions";
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
  contacts: { table: "waitlist", columns: "id,email,name,business_type,tier,created_at" },
} as const;
const querySchema = z.object({ view: z.enum(["submissions", "clients", "projects", "orders", "leads", "contacts"]).default("submissions"), page: z.coerce.number().int().min(1).max(100000).default(1) });
const updateSchema = z.object({ id: z.string().uuid(), status: z.enum(projectStatuses), notes: z.string().max(10000), revision: z.string().uuid() }).strict();
export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const input = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
    if (!input.success) throw new ApiError(400, "Filtre invalide.");
    const { view, page } = input.data;
    const db = supabaseServerAdmin();
    if (view === "submissions") {
      // Each source contributes at most the first page * 25 records to the
      // global chronological page. Counts remain exact across all sources.
      const configs = [
        { kind: "campaign" as const, table: "campaign_leads", columns: "id,source,name,phone,company,city,services,business_type,status,notes,created_at" },
        { kind: "waitlist" as const, ...sources.leads },
        { kind: "project" as const, ...sources.projects },
      ];
      const results = await Promise.all(configs.map(async source => {
        const data: Record<string, unknown>[] = [];
        let count = 0;
        // Stay below the database's response row limit on later pages.
        for (let offset = 0; offset < page * 25; offset += 500) {
          const result = await db.from(source.table).select(source.columns, { count: "exact" })
            .order("created_at", { ascending: false }).order("id")
            .range(offset, Math.min(offset + 499, page * 25 - 1));
          if (result.error) throw result.error;
          count = result.count || 0;
          data.push(...(result.data || []) as unknown as Record<string, unknown>[]);
          if (data.length >= count || !result.data?.length) break;
        }
        return { data, count, error: null };
      }));
      for (const result of results) if (result.error) throw result.error;
      const records = results.flatMap((result, index) => (result.data || []).map(row =>
        normalizeSubmission(configs[index].kind, row as unknown as Record<string, unknown> & { id: string })));
      return NextResponse.json({ rows: paginateSubmissions(records, page), total: results.reduce((sum, result) => sum + (result.count || 0), 0),
        submissionCounts: results.map(result => result.count || 0), counts: [] }, { headers: { "Cache-Control": "private, no-store" } });
    }
    const source = sources[view];
    let rowsQuery = db.from(source.table).select(source.columns, { count: "exact" }).order("created_at", { ascending: false }).order("id");
    if (view === "contacts") rowsQuery = rowsQuery.eq("tier", "Contact");
    if (view === "leads") rowsQuery = rowsQuery.neq("tier", "Contact");
    const [rows, ...counts] = await Promise.all([
      rowsQuery.range((page - 1) * 25, page * 25 - 1),
      db.from("profiles").select("id", {count:"exact",head:true}).eq("role","client"),
      db.from("blueprints").select("id", {count:"exact",head:true}).neq("workflow_status","published"),
      db.from("orders").select("id", {count:"exact",head:true}).eq("status","pending"),
      db.from("waitlist").select("id", {count:"exact",head:true}).neq("tier","Contact"),
      db.from("waitlist").select("id", {count:"exact",head:true}).eq("tier","Contact"),
    ]);
    for (const result of [rows, ...counts]) if (result.error) throw result.error;
    const normalizedRows = view === "contacts"
      ? (rows.data || []).map((row) => {
          const record = row as unknown as Record<string, unknown>;
          try {
            const details = JSON.parse(String(record.business_type)) as Record<string, unknown>;
            const { business_type: _raw, ...rest } = record;
            void _raw;
            return {
              ...rest,
              email: details.email,
              business_name: details.businessName,
              phone: details.phone,
              subject: details.subject,
              message: details.message,
            };
          } catch {
            return record;
          }
        })
      : rows.data;
    return NextResponse.json({ rows: normalizedRows, total: rows.count, counts: counts.map(result => result.count ?? 0) }, { headers: {"Cache-Control":"private, no-store"} });
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
