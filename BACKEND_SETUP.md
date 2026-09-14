# Backend deployment and verification

## Current external blocker

The replacement project accepts the configured publishable key. The owner reports running the bootstrap SQL. The public `profiles` probe now returns permission denied (`42501`), consistent with the expected restricted schema, instead of a missing table. Full server verification remains blocked: the existing server credential returns HTTP 401. Set the replacement project's `SUPABASE_SECRET_KEY` in local and deployment environment settings.

For this empty project, run `supabase/bootstrap-new-project.sql` once in the Supabase SQL Editor, or set `SUPABASE_DB_URL` locally for direct migration execution. The bootstrap is transactional, includes all current migrations and chat Realtime publication setup, and aborts safely if WebForm tables already exist. It has a local PostgreSQL integration test.

Current key names are `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and server-only `SUPABASE_SECRET_KEY`. Legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` remain fallback options. Never prefix the secret key with `NEXT_PUBLIC_`.

Run `npm run backend:check` for a non-secret configuration report.

## Latest local verification — 2026-09-13

- All 53 tests across 9 suites pass, including PostgreSQL policy/payment integration tests.
- ESLint passes. Dependency audit reports zero production vulnerabilities.
- Browser verification at desktop width and 390px mobile width: both generated illustrations load, process and pricing sections remain readable, and no horizontal overflow occurs.
- Anonymous requests to payment status and upload endpoints return HTTP 401.
- The external configuration check still reports Supabase `ENOTFOUND` and missing NETOPIA verification certificate and VAT configuration. Live signup, payment and realtime chat verification remains pending service restoration.

## Required configuration

Use Node 22.12 or newer. Run `npm ci` from the committed lockfile.

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`: the current project. Service role remains server-only.
- `NETOPIA_API_KEY`, `NETOPIA_SIGNATURE`, `NETOPIA_SANDBOX` (`true` for sandbox, `false` for live).
- `NETOPIA_IPN_PUBLIC_KEY`: NETOPIA v2 verification certificate for the selected environment. Do not substitute the merchant encryption certificate. PEM with real newlines or escaped `\n` is accepted.
- `NETOPIA_VAT_RATE`: explicitly configure the merchant's applicable percentage (including `0` if applicable). No tax status is inferred and displayed subscription totals remain unchanged.
- `NEXT_PUBLIC_NETOPIA_CONFIRM_URL`: deployed `/api/payments/webhook` HTTPS URL.
- `NEXT_PUBLIC_NETOPIA_RETURN_URL`: deployed `/subscribe/success` HTTPS URL. Each request appends its own order ID.
- Optional email notification: `RESEND_API_KEY`, `NOTIFICATION_EMAIL`, `NOTIFICATION_FROM_EMAIL` (a verified sending domain). Missing email configuration does not lose the blueprint; the API reports `not_configured` and authenticated retry is available.

In Supabase Auth, enable email confirmation and allow your deployed `/auth/confirm` redirect. Public signup uses Supabase's normal email verification flow, not administrator auto-confirmation. The database trigger creates client profiles atomically and never trusts metadata for roles. Provision administrators through a trusted administrative process.

## Database changes

For an existing project with the original WebForm tables, apply in order using Supabase SQL Editor:

1. `supabase/migrations/20260912_add_waitlist.sql`
2. `supabase/migrations/20260912_backend_integrity.sql`

The second migration is transactional and rerunnable. It replaces the old permissive RLS policies, restricts columns clients may update/read, creates server-only transactional payment/chat/rate-limit functions, adds idempotency indexes, creates a private storage bucket, and installs the profile creation trigger. It does not delete customer rows. Review existing custom policies before deploying because policies on the listed WebForm tables are intentionally replaced.

The original schema files are prerequisites for a completely empty database; the SQL tests build them first, then apply the new migrations twice to test upgrade repeatability. Do not run historic policies after the integrity migration.

New uploads use `webform-private-assets` and stable `/api/assets/<uuid>` links. The legacy public `blueprint-assets` bucket is not modified automatically: migrate legacy files with their owner records and retire old public links before treating historical uploads as private. New uploads do not inherit that exposure.

## Payment behavior

A checkout order is saved before the processor is contacted. One request key is used for the current checkout attempt. Retries return the same pending checkout when available, and a lost/ambiguous processor response cannot trigger a second charge automatically. A pending order without a checkout URL requires reconciliation in the provider dashboard.

Notifications are authenticated against the raw body, issuer and merchant, then processed in a database transaction with row locks. Amount/currency/provider identity mismatches fail. Duplicate confirmations do not extend access. Failed profile updates roll back the order transition. A refund of the current order revokes its access. Same-plan renewals extend the current paid period; plan changes start a fresh period immediately. Calendar arithmetic clamps to the last valid day of the target month.

There is **no scheduled automatic card debit**. Renewals are customer-initiated checkout payments, and cancellation preserves already paid access. Automatic recurring collection must be separately configured with NETOPIA and explicit recurring-payment consent; it is not silently enabled by storing a token.

## Verification before live traffic

- `npm test`: application and local PostgreSQL (PGlite) integration tests; no real services mocked as successful in production code.
- `npm run lint`, `npm run build`, `npm audit`.
- Test signup + email confirmation + login with the deployed Supabase project.
- Apply migrations, verify one customer cannot view another's profile/orders/files/chat or update roles/subscription fields.
- NETOPIA sandbox: successful, declined, cancelled, duplicate callback, refund, and a delayed callback after returning to the site. Test with an existing active subscription as well.
- Blueprint upload, submission retry, private download, notification retry and chat realtime reconnect.
- Confirm production callback URLs and live/sandbox mode before accepting money.

Protocol references: [NETOPIA's official IPN implementation](https://github.com/netopiapayments/go-sdk/blob/main/ipn.go), [Next.js security updates](https://nextjs.org/blog/security-update-2025-12-11).
