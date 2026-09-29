import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { leadSchema, phoneSchema, tokenSchema } from "@/lib/campaign/schema";
const sample = {
  source: "instalatii",
  name: "Ion Pop",
  phone: "0722 123 456",
  consent: true,
  eventId: "00000000-0000-4000-8000-000000000001",
  company: "yes",
  city: "Brașov",
  services: ["Sanitare"],
};
describe("campaign validation", () => {
  it.each(["0722 123 456", "+40 722 123 456", "0040722123456"])(
    "normalizes Romanian phone %s",
    (v) => expect(phoneSchema.parse(v)).toBe("+40722123456"),
  );
  it.each(["+44722123456", "123", "+40123456789", "072212345678"])(
    "rejects invalid phone %s",
    (v) => expect(phoneSchema.safeParse(v).success).toBe(false),
  );
  it("requires consent, company and city; rejects honeypot", () => {
    expect(leadSchema.safeParse(sample).success).toBe(true);
    for (const change of [
      { consent: false },
      { company: "" },
      { city: "" },
      { website: "spam" },
    ])
      expect(leadSchema.safeParse({ ...sample, ...change }).success).toBe(
        false,
      );
  });
  it("validates homepage independently", () =>
    expect(
      leadSchema.safeParse({
        ...sample,
        source: "homepage",
        businessType: "Service auto",
        company: undefined,
        city: undefined,
      }).success,
    ).toBe(true));
  it("rejects short preview tokens", () => {
    expect(tokenSchema.safeParse("guessme").success).toBe(false);
    expect(tokenSchema.safeParse("a".repeat(64)).success).toBe(true);
  });
});
let db: PGlite;
beforeAll(async () => {
  db = new PGlite();
  await db.exec(
    "create role anon; create role authenticated; create role service_role bypassrls;",
  );
  await db.exec(
    readFileSync("supabase/migrations/20260917_campaign.sql", "utf8"),
  );
  await db.exec(
    readFileSync("supabase/migrations/20260917_campaign_plans.sql", "utf8"),
  );
  const management = readFileSync("supabase/migrations/20260929_lead_management.sql", "utf8");
  await db.exec(management);
  await db.exec(management);
}, 60000);
afterAll(async () => {
  await db?.close();
});
describe("campaign database integrity", () => {
  it("persists CRM fields with revision protection and allows clearing them", async () => {
    const lead = await db.query<{ id: string; revision: string }>("insert into campaign_leads(event_id,source,name,phone,consent_version) values(gen_random_uuid(),'homepage','CRM Test','+40722123456','v1') returning id,revision");
    const { id, revision } = lead.rows[0];
    const saved = await db.query<{ assigned_page: string; next_follow_up_at: Date; revision: string }>("update campaign_leads set assigned_page='/crm-test',next_follow_up_at='2026-10-02T07:30:00Z' where id=$1 and revision=$2 returning assigned_page,next_follow_up_at,revision", [id, revision]);
    expect(saved.rows[0].assigned_page).toBe('/crm-test');
    expect(saved.rows[0].next_follow_up_at.toISOString()).toBe('2026-10-02T07:30:00.000Z');
    expect(saved.rows[0].revision).not.toBe(revision);
    const stale = await db.query("update campaign_leads set notes='stale' where id=$1 and revision=$2 returning id", [id, revision]);
    expect(stale.rows).toHaveLength(0);
    const cleared = await db.query("update campaign_leads set assigned_page=null,next_follow_up_at=null where id=$1 returning assigned_page,next_follow_up_at", [id]);
    expect(cleared.rows[0]).toEqual({ assigned_page: null, next_follow_up_at: null });
  });
  it("hides leads and payment consent from public roles", async () => {
    await db.exec("set role anon");
    try {
      await expect(db.query("select * from campaign_leads")).rejects.toThrow();
      await expect(
        db.query("select * from campaign_checkouts"),
      ).rejects.toThrow();
      await expect(
        db.query(
          "select campaign_claim_checkout(gen_random_uuid(),gen_random_uuid(),'standard_lunar','v1','terms')",
        ),
      ).rejects.toThrow();
    } finally {
      await db.exec("reset role");
    }
  });
  it("preserves first call, paid state and serializes checkout attempts", async () => {
    const lead = await db.query<{ id: string }>(
      "insert into campaign_leads(event_id,source,name,phone,consent_version) values(gen_random_uuid(),'instalatii','Ion','+40722123456','v1') returning id",
    );
    const id = lead.rows[0].id;
    const first = await db.query<{ first_called_at: Date }>(
      "update campaign_leads set status='called' where id=$1 returning first_called_at",
      [id],
    );
    expect(first.rows[0].first_called_at).toBeTruthy();
    const next = await db.query<{ first_called_at: Date }>(
      "update campaign_leads set status='in_progress',first_called_at=null where id=$1 returning first_called_at",
      [id],
    );
    expect(next.rows[0].first_called_at).toEqual(first.rows[0].first_called_at);
    const a = await db.query<{ id: string }>(
      "select campaign_claim_checkout($1,gen_random_uuid(),'standard_lunar','v1','terms') as id",
      [id],
    );
    const b = await db.query<{ id: string }>(
      "select campaign_claim_checkout($1,gen_random_uuid(),'standard_lunar','v1','terms') as id",
      [id],
    );
    expect(a.rows[0].id).toBe(b.rows[0].id);
    await expect(
      db.query(
        "select campaign_claim_checkout($1,gen_random_uuid(),'standard_anual','v1','terms')",
        [id],
      ),
    ).rejects.toThrow();
    await expect(
      db.query(
        "select campaign_claim_checkout($1,gen_random_uuid(),'business_lunar','v1','terms')",
        [id],
      ),
    ).rejects.toThrow();
    await db.query(
      "update campaign_leads set paid_at=now(),status='paid' where id=$1",
      [id],
    );
    const paid = await db.query<{ status: string }>(
      "update campaign_leads set status='lost' where id=$1 returning status",
      [id],
    );
    expect(paid.rows[0].status).toBe("paid");
  });
});
