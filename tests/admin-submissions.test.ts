import { describe, expect, it } from "vitest";
import { normalizeSubmission, paginateSubmissions } from "@/lib/admin-submissions";

describe("Unified admin submissions", () => {
  it("includes plumber contact details and source", () => {
    const row = normalizeSubmission("campaign", { id: "1", source: "instalatii", name: "Test", phone: "0700000000", city: "Brașov", services: ["Sanitare", "Termice"] });
    expect(row.submission_source).toBe("Instalatori");
    expect(row.submission_details).toBe("0700000000 · Brașov · Sanitare, Termice");
  });
  it("distinguishes homepage from installer requests", () => {
    expect(normalizeSubmission("campaign", { id: "1", source: "homepage" }).submission_source).toBe("Pagina principală");
  });
  it("shows actual contact details rather than the internal deduplication address", () => {
    const row = normalizeSubmission("waitlist", { id: "2", tier: "Contact", email: "contact+internal@webform.invalid", business_type: JSON.stringify({ email: "test@example.com", phone: "0700000000", subject: "Site", message: "Mesaj complet" }) });
    expect(row.email).toBe("test@example.com");
    expect(row.message).toBe("Mesaj complet");
    expect(row.submission_source).toBe("Formular contact");
  });
  it("preserves legacy contact messages and quote contents", () => {
    expect(normalizeSubmission("waitlist", { id: "2", tier: "Contact", business_type: "Legacy" }).message).toBe("Legacy");
    expect(normalizeSubmission("waitlist", { id: "3", tier: "E-commerce", business_type: "Detalii ofertă" }).submission_details).toBe("Detalii ofertă");
    expect(normalizeSubmission("project", { id: "4", full_data: { brief: "full" } }).full_data).toEqual({ brief: "full" });
  });
  it("paginates across sources by newest date with a stable tie break", () => {
    const rows = [
      normalizeSubmission("project", { id: "c", created_at: "2026-09-15" }),
      normalizeSubmission("waitlist", { id: "a", created_at: "2026-09-17" }),
      normalizeSubmission("campaign", { id: "b", created_at: "2026-09-17" }),
    ];
    expect(paginateSubmissions(rows, 1, 2).map(row => row.id)).toEqual(["b", "a"]);
    expect(paginateSubmissions(rows, 2, 2).map(row => row.id)).toEqual(["c"]);
  });
});
