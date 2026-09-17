# Campania instalații

Flux nou: `/instalatii` → lead → `/admin/leads` → preview privat → Stripe Checkout → webhook → „Plătit”. Formularul homepage folosește aceeași listă cu sursa `homepage`. Planurile rămân aceleași. Checkout-ul principal este pregătit pentru Stripe; vezi `STRIPE_SETUP.md` pentru lansarea comună.

## Configurare înainte de lansare

1. Aplică `supabase/migrations/20260917_campaign.sql`, apoi `supabase/migrations/20260917_campaign_plans.sql` în proiectul Supabase existent, după migrările anterioare (rate limiting folosește `webform_rate_limit`). Tabelele noi au RLS și sunt accesibile numai prin server cu cheia service-role; adminul folosește rolul existent din `profiles`.
2. Adaugă variabilele de mai jos în Vercel și redeploy. Nu folosi prefixul `NEXT_PUBLIC_` pentru chei secrete.
3. Creează/configurează contul Stripe, activează RON și plățile recurente. Folosește mai întâi chei de test. Checkout folosește catalogul Live confirmat din `lib/stripe/prices.ts`: Start 180 lei/lună sau 1.620 lei/an; Business 350 lei/lună sau 3.150 lei/an. Instalatorii aleg aceleași planuri. Serverul verifică prețul în Stripe înainte de a crea sesiunea. În Test trebuie configurate Price IDs separate. Prețurile reprezintă suma finală încasată; configurația fiscală/facturarea firmei se verifică separat în contul Stripe.
4. Configurează webhook-ul Stripe la `https://ro.joinwebform.com/api/payments/stripe/webhook`, cu evenimentele `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated` și `customer.subscription.deleted`. Copiază secretul `whsec_...`. Numai webhook-ul semnat confirmă plata; revenirea pe success URL nu este dovadă de plată. Abonamentele se reînnoiesc în Stripe. Administrarea anulărilor, plăților recurente nereușite și eventuala taxă de reziliere se face în Stripe/manual; taxa nu este debitată automat.
5. Configurează Resend cu domeniul expeditorului verificat și destinatarul pentru notificări. Notificarea de lead pornește imediat după răspunsul formularului (`after` în Next.js); lead-ul rămâne salvat chiar dacă emailul eșuează. În admin vezi notificările restante și le poți retrimite. Webhook-ul de plată răspunde 503 dacă emailul eșuează, astfel încât Stripe să reîncerce. Verifică livrarea reală înainte de reclame.
6. Configurează Meta Pixel și, opțional, tokenul CAPI. Pixelul se inițializează exclusiv din landing; PageView și Lead se trimit după acordul separat pentru măsurare. Lead folosește același `event_id` în browser și CAPI. Refuzul nu blochează formularul. UTM-urile și fbclid sunt salvate pentru cererea curentă; nu este creat un istoric de navigare.
7. Publică site-ul clientului pe un domeniu de preview HTTPS separat, care permite iframe. Adaugă hostname-ul exact în `CAMPAIGN_PREVIEW_HOSTS`, apoi publică URL-ul din admin. Wrapper-ul folosește token criptografic de 64 caractere, expirare de 14 zile, iframe sandbox și noindex/no-referrer. Extinderea adaugă 14 zile. Site-ul original extern trebuie și el protejat/noindex; expirarea wrapper-ului nu revocă URL-ul extern. Nu include date confidențiale în site-ul demonstrativ. Sandbox-ul permite JavaScript, dar blochează formulare, popups și navigarea paginii părinte.
8. Completează taxa, bonusul și WhatsApp înainte de lansare. Plata rămâne blocată până există taxa, bonusul și cheia Stripe. Dacă WhatsApp lipsește, butoanele lui sunt ascunse. Exemplul inclus este un model HTML/CSS demonstrativ, fără imagini externe sau numere fictive apelabile.

| Variabilă | Valoare / rol |
| --- | --- |
| `CAMPAIGN_SITE_URL` | `https://ro.joinwebform.com` (sau originea mediului de test) |
| `CAMPAIGN_CONSTRUCTION_FEE` | Taxa pozitivă de construcție, în lei; obligatorie pentru checkout |
| `CAMPAIGN_ANNUAL_BONUS` | Textul bonusului anual; obligatoriu pentru checkout |
| `CAMPAIGN_WHATSAPP` | Număr internațional, ex. `407xxxxxxxx` |
| `CAMPAIGN_TERMS_VERSION` | Implicit `instalatii-2026-09-v2`; schimbă versiunea la orice schimbare de termeni |
| `CAMPAIGN_PREVIEW_HOSTS` | Hostname-uri exacte, separate prin virgulă, fără protocol/path |
| `CAMPAIGN_STRIPE_SECRET_KEY` | `sk_test_...` apoi `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Secretul endpointului webhook, separat pentru test/live |
| `CAMPAIGN_META_PIXEL_ID` | ID numeric public; doar acest ID ajunge în browser |
| `CAMPAIGN_META_ACCESS_TOKEN` | Secret CAPI opțional, exclusiv server |
| `CAMPAIGN_META_API_VERSION` | Implicit `v23.0`; verifică versiunea acceptată în aplicația Meta |
| `RESEND_API_KEY` | Cheia Resend existentă sau nouă |
| `NOTIFICATION_FROM_EMAIL` | Adresă de pe domeniul verificat Resend |
| `NOTIFICATION_EMAIL` | Destinatar notificări |
| `NEXT_PUBLIC_SUPABASE_URL` | Configurația existentă |
| `SUPABASE_SECRET_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | Cheia server existentă |

## Verificare integrată în staging

- Trimite un lead de pe telefon; verifică datele, UTM/fbclid, emailul și sursa în admin. Repetă de pe homepage. Verifică GDPR, honeypot și limita de 5 cereri/oră/IP.
- Acceptă/refuză măsurarea Meta și verifică Events Manager; pentru CAPI verifică deduplicarea după `Lead` + `event_id`.
- Marchează `Sunat`: timpul primului apel se fixează în baza de date și nu mai poate fi rescris.
- Publică preview, copiază mesajul WhatsApp, verifică expirarea/prelungirea și un token invalid.
- Plătește în Stripe test pentru ambele perioade. Verifică acceptarea termenilor (text, versiune, moment), webhook-ul, statusul și emailul „Conectează domeniul”. Verifică și retry-ul webhook-ului.
- Un singur checkout poate fi inițiat pe lead într-o fereastră de 32 de minute; cererile repetate pe aceeași perioadă reutilizează checkout-ul. Schimbarea perioadei după deschiderea Stripe necesită expirarea ferestrei. Stripe expiră sesiunea după aproximativ 31 minute.
- Garanția primei luni gratuite la întârziere se aplică operațional, prin ajustare/refund Stripe, înainte de facturare sau după caz; nu există automatizare pentru măsurarea predării materialelor.
- Nu închide NETOPIA până nu ai verificat plățile Stripe și situația contractelor/abonamentelor existente. Checkout-ul principal este migrat în cod, cu păstrarea callback-urilor istorice NETOPIA.

## Referințe implementare

- [Stripe: abonamente cu Checkout](https://docs.stripe.com/payments/checkout/build-subscriptions)
- [Meta: deduplicarea evenimentelor](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events)

## Fișiere

Lista completă a fișierelor create/modificate pentru această implementare este în `CAMPAIGN_FILES.md`. Fișierele neversionate care existau deja în workspace nu au fost modificate.

## Verificări locale efectuate

- Build Next.js de producție, ESLint și TypeScript.
- 87 teste automate trecute (inclusiv 16 noi pentru campanie: telefon, consimțământ, honeypot, permisiuni SQL, primul apel, checkout concurent și webhook semnat).
- Chromium: landing la 320, 390 și 1440 px, fără overflow orizontal; homepage la 390 px fără overflow; fără erori JavaScript observate.
- Trimitere formular în browser cu răspuns API simulat: normalizare telefon, UTM/fbclid și confirmare vizuală. Acesta nu este un test de livrare în Supabase/Resend/Stripe/Meta live.
- Migrarea nu a fost aplicată bazei de producție și modificările nu au fost publicate pe Vercel.


## Catalogul Stripe confirmat

| Plan | Price ID Live |
| --- | --- |
| Start lunar | `price_1UGfC9LBC1ri3elDFh2hOezc` |
| Start anual | `price_1UGfIALBC1ri3elDZcu38kbZ` |
| Business lunar | `price_1UGfDqLBC1ri3elDEnT4hljB` |
| Business anual | `price_1UGfGpLBC1ri3elDTtZOBKG6` |

Pentru Test, creează prețuri echivalente în Stripe Test și setează `STRIPE_TEST_PRICE_STANDARD_LUNAR`, `STRIPE_TEST_PRICE_STANDARD_ANUAL`, `STRIPE_TEST_PRICE_BUSINESS_LUNAR`, `STRIPE_TEST_PRICE_BUSINESS_ANUAL`. Cheia Test nu folosește niciodată implicit catalogul Live.

Catalogul este conectat în cod la checkout-ul după preview. Checkout-ul principal folosește acum Stripe în cod, inclusiv activarea accesului, reînnoirile și anularea; migrarea SQL din `STRIPE_SETUP.md` trebuie aplicată înainte de deploy. Salvarea identificatoarelor nu activează singură plățile Live.
