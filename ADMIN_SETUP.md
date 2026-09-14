# WebForm admin panel

Open `/admin`. The page and every `/api/admin` request independently require an authenticated user with `profiles.role = 'admin'`. A link appears in the administrator's account page. No role is inferred from email, user metadata or request parameters.

## Activate with the replacement Supabase project

1. Set both API keys for the new project in `.env.local` as described in `BACKEND_SETUP.md`. The last connection check returned HTTP 401 because the current keys belong to the previous project.
2. Apply the base schema and backend migrations. For an empty project, the tested order is `supabase/schema.sql`, `20260216_add_subscriptions.sql`, `supabase-blueprints-schema.sql`, `20260303_add_billing_info.sql`, `20260912_add_waitlist.sql`, `20260912_backend_integrity.sql` (migration filenames are under `supabase/migrations/`).
3. Apply `supabase/migrations/20260913_admin_workspace.sql` after the integrity migration. It adds project workflow, internal notes and a revision token; it is rerunnable.
4. Create and verify your account. In the trusted Supabase SQL editor, assign `role = 'admin'` to that account's exact `profiles.id`. Verify the account UUID before changing it. This panel intentionally cannot promote users or alter payment status.
5. Rebuild/restart Next.js after changing public environment variables, sign in, and open `/admin`.

## Included

- Paginated lists of customers/subscription expiry, projects and their submitted brief, orders, and waitlist contacts (25 records per page).
- Global counts of customers, unpublished projects, pending orders and waitlist contacts.
- Project workflow: new → in progress → client review → published; internal notes.
- Optimistic concurrency: a stale edit gets HTTP 409 instead of overwriting another administrator's changes.
- Private asset links use the existing authenticated file endpoint.
- Link to the existing administrator chat interface.
- Explicit loading, empty, failure and save confirmation states. No fictional data is served.

Changing project workflow does not deploy a website or send a customer notification. Payments and refunds remain processor-controlled. Amounts shown are order amounts, not an inferred revenue metric. Internal notes are inaccessible to client database roles. No card tokens, service keys or billing secrets are returned by the admin list endpoint.

## Validation

Automated authorization tests cover anonymous and non-admin access, cross-origin writes, invalid queries, forbidden extra fields, stale revisions and successful workflow updates. Local PostgreSQL tests apply the new migration twice and check customer access restrictions. Live testing requires the replacement Supabase project's keys, migrated database and an administrator account.
