# WebForm redesign — 12 September 2026

The homepage now explains the managed website service in Romanian: what is included, example designs, the process, two subscription plans, and cancellation expectations. The new cream, charcoal and orange design carries into navigation, gallery, login, pricing, FAQ and account/form theme tokens. Template previews are examples, not claimed client work. Existing account, blueprint, upload, chat, billing and legal routes remain.

## Correctness changes

- Marketing and checkout share plan prices and features. Annual Business is 262.50 RON/month equivalent, billed as 3,150 RON/year. Plan selection survives the login redirect; external redirect destinations are rejected.
- Removed the global transform override that broke positioning; added mobile navigation, keyboard focus treatment and native expandable FAQs. Removed homepage 3D/video overhead and the fake commerce notification success dialog.
- Corrected NETOPIA v2 status handling: cancelled status 4 no longer grants access; paid/confirmed statuses 3 and 5 do. Added signature, merchant, payload and expiry verification for notifications, order amount checks, sequential duplicate protection and error responses that permit retries.
- A failed order save stops the checkout redirect. The payment return page checks the subscription instead of always claiming success. Billing prefill reads the actual `phone_number` column.
- Public signup cannot grant the admin role based on a submitted email. Added server-side signup validation and rollback if profile creation fails.
- Blueprint submission and uploads require login. Notification and asset organization also check blueprint ownership. Upload size/type/path validation and email HTML escaping are included.
- Expired active subscriptions no longer pass the blueprint page middleware.
- Waitlist submissions use persistent Supabase storage, report failures honestly and handle network errors. Added the required database migration.
- Repaired optional native test dependencies and updated stale blueprint test fixtures to match the current form.

## Before production

1. Configure `NETOPIA_IPN_PUBLIC_KEY` with the NETOPIA v2 notification verification certificate for the correct environment. The existing local merchant encryption certificate must not be assumed to be the notification verification key. Payment initiation returns an unavailable response until this is configured. Implementation reference: https://github.com/netopiapayments/go-sdk/blob/main/ipn.go.
2. Apply `supabase/migrations/20260912_add_waitlist.sql` through your normal database deployment process. No production database changes were made in this task.
3. Complete an end-to-end NETOPIA sandbox transaction with a test customer: signup, billing, payment, webhook, subscription access, blueprint upload, chat and cancellation. These external service operations were not exercised with real accounts or payments.
4. Review the existing dependency audit findings and billing integration before accepting money. The existing payment request still uses placeholder processor billing address fields and a hardcoded VAT setting. Recurring collection, refunds, concurrent webhook processing and database row-level policies need integration validation. The current webhook guards sequential retries; order/profile updates are not a single database transaction.

No revenue outcome or absence of all bugs is guaranteed. This is a tested redesign plus targeted defect fixes, not a completed production payment certification or comprehensive security audit.

## Validation completed

- `npm test`: 20 tests passed, including annual pricing, safe login redirects, blueprint validation and signed payment notification checks.
- `npx tsc --noEmit`: passed.
- ESLint across app, components, lib and middleware: passed.
- `npm run build`: passed; all 33 pages generated.
- Desktop and 390px mobile homepage visually inspected; annual toggle and mobile menu exercised in the browser.
- A local production preview is served at http://localhost:3000. No deployment was performed.


## Follow-up: original imagery, motion and backend completion

See BACKEND_SETUP.md for the current backend behavior and activation requirements; it supersedes the earlier outstanding-code list above. Added two original generated images, progressive scroll reveals, staggered entrances, hover motion and reduced-motion support. Payment writes are now atomic SQL transitions; uploads are private; billing uses customer data and an explicit tax setting; chat authorization no longer trusts submitted identity; dependency audit findings were addressed. The existing Supabase hostname does not resolve, so live integration activation remains blocked.
