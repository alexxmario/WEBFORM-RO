import { PGlite } from "@electric-sql/pglite";
import { beforeAll, afterAll, it, expect } from "vitest";
import { readFileSync } from "node:fs";
let db: PGlite;
const user = "10000000-0000-4000-8000-000000000001";
const key = "20000000-0000-4000-8000-000000000001";
const order = "WF-S-" + key;
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;
 create table profiles(id uuid primary key,subscription_status text,subscription_plan text,subscription_expires_at timestamptz,subscription_order_id text,netopia_token text);
 create table orders(id text primary key,user_id uuid references profiles(id),plan_id text,amount numeric,currency text,status text,billing_info jsonb,request_key uuid,request_fingerprint text,created_at timestamptz default now(),updated_at timestamptz default now(),activated_at timestamptz,access_expires_at timestamptz,checkout_url text);
 create unique index orders_request_once on orders(user_id,request_key);
 insert into profiles(id) values('${user}');`);
  await db.exec(
    readFileSync(
      "supabase/migrations/20260918_stripe_subscriptions.sql",
      "utf8",
    ),
  );
}, 60000);
afterAll(async () => await db?.close());
const claim = (k = key, plan = "standard_lunar", fingerprint = "same") =>
  db.query<{ id: string }>(
    "select webform_stripe_claim($1,$2,$3,180,$4,'{}','v1','terms') as id",
    [user, k, plan, fingerprint],
  );
const sync = (
  invoice: unknown = null,
  status = "active",
  cancel = false,
  event = 100,
) =>
  db.query("select webform_stripe_sync($1,$2,$3,$4,$5,$6,$7)", [
    order,
    "sub_1",
    "cus_1",
    status,
    cancel,
    event,
    invoice,
  ]);
it("serializes checkout requests even when keys differ", async () => {
  const a = await claim();
  const b = await claim("20000000-0000-4000-8000-000000000002");
  expect(a.rows[0].id).toBe(b.rows[0].id);
  await expect(
    claim(
      "20000000-0000-4000-8000-000000000003",
      "business_lunar",
      "different",
    ),
  ).rejects.toThrow("Checkout already open");
  await db.query("insert into stripe_customers values($1,$2)", [user, "cus_1"]);
});
it("never grants access from an active subscription without a paid invoice", async () => {
  await sync();
  const profile = await db.query<{ subscription_expires_at: null }>(
    "select subscription_expires_at from profiles where id=$1",
    [user],
  );
  expect(profile.rows[0].subscription_expires_at).toBeNull();
});
it("records duplicate invoices once and renewals with exact paid expiry", async () => {
  const initial = {
    id: "in_1",
    amount: 180,
    currency: "ron",
    reason: "subscription_create",
    period_end: "2030-02-01T00:00:00Z",
  };
  await sync(initial);
  await sync(initial);
  expect((await db.query("select * from stripe_invoices")).rows).toHaveLength(
    1,
  );
  const renewal = {
    id: "in_2",
    amount: 180,
    currency: "ron",
    reason: "subscription_cycle",
    period_end: "2030-03-01T00:00:00Z",
  };
  await sync(renewal);
  await sync(renewal, "active", false, 200);
  const profile = await db.query<{ subscription_expires_at: Date }>(
    "select subscription_expires_at from profiles where id=$1",
    [user],
  );
  expect(profile.rows[0].subscription_expires_at.toISOString()).toBe(
    "2030-03-01T00:00:00.000Z",
  );
  expect(
    (await db.query("select * from orders where id='WF-I-in_2'")).rows,
  ).toHaveLength(1);
});
it("preserves cancellation against older events and does not shorten the paid period", async () => {
  await sync(null, "active", true, 300);
  await sync(null, "active", false, 250);
  const profile = await db.query<{
    subscription_status: string;
    subscription_expires_at: Date;
  }>(
    "select subscription_status,subscription_expires_at from profiles where id=$1",
    [user],
  );
  expect(profile.rows[0].subscription_status).toBe("cancelled");
  expect(profile.rows[0].subscription_expires_at.toISOString()).toBe(
    "2030-03-01T00:00:00.000Z",
  );
});
it("rejects mismatched invoice amounts atomically", async () => {
  await expect(
    sync({
      id: "in_bad",
      amount: 1,
      currency: "ron",
      reason: "subscription_cycle",
      period_end: "2035-01-01T00:00:00Z",
    }),
  ).rejects.toThrow("Invoice mismatch");
  expect(
    (await db.query("select * from stripe_invoices where id='in_bad'")).rows,
  ).toHaveLength(0);
});
it("blocks a second subscription while one exists", async () => {
  await expect(claim("20000000-0000-4000-8000-000000000004")).rejects.toThrow(
    "Subscription already exists",
  );
});
it("keeps Stripe identities and mutating RPCs private", async () => {
  await db.exec("set role authenticated");
  try {
    await expect(db.query("select * from stripe_customers")).rejects.toThrow();
    await expect(sync()).rejects.toThrow();
    await expect(claim()).rejects.toThrow();
  } finally {
    await db.exec("reset role");
  }
});
