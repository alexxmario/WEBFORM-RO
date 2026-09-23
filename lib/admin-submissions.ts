import { leadSourceLabel } from "@/lib/campaign/lead-source";
type RecordRow = Record<string, unknown> & { id: string };
export type Submission = RecordRow & { submission_source: string; submission_kind: string };

export function normalizeSubmission(kind: "campaign" | "waitlist" | "project", row: RecordRow): Submission {
  if (kind === "campaign") return {
    ...row,
    submission_kind: kind,
    submission_source: leadSourceLabel(row.source, row.attribution),
    submission_details: [row.phone, row.city, row.business_type, Array.isArray(row.services) ? row.services.join(", ") : ""].filter(Boolean).join(" · "),
  };
  if (kind === "project") return {
    ...row,
    submission_kind: kind,
    submission_source: "Brief proiect",
    submission_details: row.one_liner,
  };
  if (row.tier === "Contact") {
    let details: Record<string, unknown> = {};
    try { const parsed = JSON.parse(String(row.business_type)); if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) details = parsed; } catch { /* Keep legacy messages visible. */ }
    return {
      ...row,
      submission_kind: kind,
      submission_source: "Formular contact",
      email: details.email || row.email,
      business_name: details.businessName,
      phone: details.phone,
      subject: details.subject,
      message: details.message || row.business_type,
      business_type: undefined,
      submission_details: [details.subject, details.phone, details.email].filter(Boolean).join(" · "),
    };
  }
  return {
    ...row,
    submission_kind: kind,
    submission_source: row.tier === "E-commerce" ? "Ofertă magazin online" : "Cerere abonament",
    submission_details: row.business_type,
  };
}

export function paginateSubmissions(rows: Submission[], page: number, size = 25) {
  return rows.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)) || a.submission_kind.localeCompare(b.submission_kind) || a.id.localeCompare(b.id)).slice((page - 1) * size, page * size);
}
