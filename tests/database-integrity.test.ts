import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { beforeAll, afterAll, describe, it, expect } from "vitest";
let db: PGlite;
const customer = "00000000-0000-4000-8000-000000000001";
const other = "00000000-0000-4000-8000-000000000002";
const admin = "00000000-0000-4000-8000-000000000003";
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create schema storage;
 create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb default '{}');
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 create function auth.role() returns text language sql stable as $$ select current_user::text $$;
 grant usage on schema auth to authenticated,service_role;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);`);
  const read = (p: string) => readFileSync(p, "utf8");
  await db.exec(
    read("supabase/schema.sql").replace(
      'create extension if not exists "uuid-ossp";',
      "",
    ),
  );
  await db.exec(read("supabase/migrations/20260216_add_subscriptions.sql"));
  await db.exec(read("supabase-blueprints-schema.sql"));
  await db.exec(read("supabase/migrations/20260303_add_billing_info.sql"));
  await db.exec(read("supabase/migrations/20260912_add_waitlist.sql"));
  await db.exec(read("supabase/migrations/20260912_backend_integrity.sql"));
  // Migration is deliberately rerunnable, including policy replacement.
  await db.exec(read("supabase/migrations/20260912_backend_integrity.sql"));
  await db.exec(read("supabase/migrations/20260913_admin_workspace.sql"));
  await db.exec(read("supabase/migrations/20260913_admin_workspace.sql"));
  await db.query("insert into auth.users(id) values ($1),($2),($3)", [
    customer,
    other,
    admin,
  ]);
  await db.query(
    "insert into profiles(id,email,role) values ($1,'client@example.test','client'),($2,'other@example.test','client'),($3,'admin@example.test','admin') on conflict(id) do update set email=excluded.email,role=excluded.role",
    [customer, other, admin],
  );
}, 60000);
afterAll(async () => {
  await db?.close();
});
async function asCustomer(sql: string) {
  try {
    await db.exec(
      `set role authenticated; select set_config('request.jwt.claim.sub','${customer}',false);`,
    );
    return await db.query(sql);
  } finally {
    await db.exec("reset role");
  }
}
describe("database authorization", () => {
  it("keeps internal project notes inaccessible to customers", async () => {
    await expect(asCustomer("select admin_notes from blueprints")).rejects.toThrow();
    await expect(asCustomer("update blueprints set workflow_status='published'")).rejects.toThrow();
  });
  it("does not allow a customer to grant themselves admin or a subscription", async () => {
    await expect(
      asCustomer(`update profiles set role='admin' where id='${customer}'`),
    ).rejects.toThrow();
    await expect(
      asCustomer(
        `update profiles set subscription_status='active' where id='${customer}'`,
      ),
    ).rejects.toThrow();
  });
  it("hides other customer profiles and payment tokens", async () => {
    expect((await asCustomer("select id from profiles")).rows).toHaveLength(1);
    await expect(
      asCustomer("select netopia_token from profiles"),
    ).rejects.toThrow();
  });
  it("forbids forging orders or joining another room", async () => {
    await expect(
      asCustomer(
        `insert into orders(id,user_id,plan_id,amount) values ('forged','${customer}','standard_lunar',180)`,
      ),
    ).rejects.toThrow();
    await expect(
      asCustomer(
        `insert into room_members(room_id,profile_id) values (gen_random_uuid(),'${customer}')`,
      ),
    ).rejects.toThrow();
  });
  it("only the server can execute payment and room management RPCs", async () => {
    await expect(
      asCustomer(`select webform_init_room('${customer}','ignored')`),
    ).rejects.toThrow();
    await expect(
      asCustomer(`select webform_apply_payment('fake','ntp',180,'RON',3,null)`),
    ).rejects.toThrow();
  });
  it("initializes one room without overwriting the customer profile", async () => {
    const first = await db.query<{ room: string }>(
      "select webform_init_room($1,$2) as room",
      [customer, "fake@attacker.test"],
    );
    const second = await db.query<{ room: string }>(
      "select webform_init_room($1,$2) as room",
      [customer, "different@test"],
    );
    expect(first.rows[0].room).toBe(second.rows[0].room);
    const profile = await db.query<{ email: string }>(
      "select email from profiles where id=$1",
      [customer],
    );
    expect(profile.rows[0].email).toBe("client@example.test");
  });
  it("enforces the shared rate limit", async () => {
    for (const expected of [true, true, false]) {
      const r = await db.query<{ ok: boolean }>(
        "select webform_rate_limit('test',2,60) as ok",
      );
      expect(r.rows[0].ok).toBe(expected);
    }
  });
});
describe("atomic payment transitions", () => {
  const order = "test-order";
  it("rejects wrong amounts before changing access", async () => {
    await db.query(
      "insert into orders(id,user_id,plan_id,amount) values($1,$2,'standard_lunar',180)",
      [order, customer],
    );
    await expect(
      db.query("select webform_apply_payment($1,'ntp',1,'RON',3,null)", [
        order,
      ]),
    ).rejects.toThrow("Payment mismatch");
    const r = await db.query<{ status: string }>(
      "select status from orders where id=$1",
      [order],
    );
    expect(r.rows[0].status).toBe("pending");
  });
  it("grants access once for concurrent paid and confirmed events", async () => {
    await Promise.all([
      db.query("select webform_apply_payment($1,'ntp',180,'RON',3,null)", [
        order,
      ]),
      db.query("select webform_apply_payment($1,'ntp',180,'RON',5,null)", [
        order,
      ]),
    ]);
    const r = await db.query<{ same: boolean; days: number }>(
      "select p.subscription_expires_at=o.access_expires_at as same, extract(day from p.subscription_expires_at-now()) as days from profiles p join orders o on o.user_id=p.id where o.id=$1",
      [order],
    );
    expect(r.rows[0].same).toBe(true);
    expect(Number(r.rows[0].days)).toBeLessThanOrEqual(31);
  });
  it("ignores late pending callbacks", async () => {
    await db.query("select webform_apply_payment($1,'ntp',180,'RON',1,null)", [
      order,
    ]);
    const r = await db.query<{ status: string }>(
      "select status from orders where id=$1",
      [order],
    );
    expect(r.rows[0].status).toBe("completed");
  });
  it("revokes a refunded current order and ignores replayed paid events", async () => {
    await db.query("select webform_apply_payment($1,'ntp',180,'RON',8,null)", [
      order,
    ]);
    await db.query("select webform_apply_payment($1,'ntp',180,'RON',3,null)", [
      order,
    ]);
    const r = await db.query<{ active: boolean }>(
      "select subscription_expires_at>now() as active from profiles where id=$1",
      [customer],
    );
    expect(r.rows[0].active).toBe(false);
  });
  it("does not grant access for cancelled status 4", async () => {
    await db.query(
      "insert into orders(id,user_id,plan_id,amount) values('cancelled-order',$1,'standard_lunar',180)",
      [other],
    );
    await db.exec(
      "select webform_apply_payment('cancelled-order','ntp2',180,'RON',4,null)",
    );
    const r = await db.query<{ status: string | null }>(
      "select subscription_status as status from profiles where id=$1",
      [other],
    );
    expect(r.rows[0].status).toBeNull();
  });
});
