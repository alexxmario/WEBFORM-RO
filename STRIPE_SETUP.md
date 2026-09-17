# Lansare Stripe — WebForm

## Ce se publică în același deploy

- Checkout-ul principal (`/api/payments/start`) folosește Stripe Checkout în modul subscription, cu catalogul existent Start/Business și lunar/anual. Același catalog este folosit după preview-ul instalatorilor.
- Facturarea recurentă este explicată și acceptată explicit în formular; textul, versiunea și momentul acceptării sunt salvate în comanda inițială.
- WEBFORM20 scade doar prima factură cu 20%. Reînnoirile folosesc prețul integral al planului. Discountul anual de 25% este deja inclus în prețurile anuale.
- Webhook-ul verifică semnătura, mediul Live/Test, clientul, abonamentul, prețul, moneda și perioada facturii. Numai factura achitată acordă acces. Return URL nu activează abonamente.
- Reînnoirile creează comenzi distincte; fiecare invoice se aplică o singură dată. Expirarea accesului este perioada achitată din Stripe, fără prelungiri duplicate. Evenimentele vechi nu suprascriu anulările noi.
- Din cont, clientul poate opri reînnoirea și poate deschide portalul Stripe pentru card și facturi. Portalul nu permite schimbarea planului sau anulări în afara endpointului autentificat.
- Checkout-ul blochează al doilea abonament cât timp există unul activ/incomplet sau o perioadă deja plătită. Schimbările de plan în timpul perioadei se discută cu WebForm; nu se creează două abonamente în paralel.
- NETOPIA rămâne disponibil pentru callback-urile comenzilor vechi. Nu există migrare automată de carduri, tokenuri sau abonamente NETOPIA. Codul vechi de inițiere rămâne în `lib/payments/netopia-start.ts` pentru regresii, dar nu este expus ca endpoint public.

## Configurația Vercel

| Variabilă | Rol |
| --- | --- |
| `CAMPAIGN_STRIPE_SECRET_KEY` | Cheia Stripe deja adăugată de proprietar; folosită de ambele fluxuri. Poate fi Sensitive. |
| `STRIPE_WEBHOOK_SECRET` | Secretul endpointului comun de mai jos; poate fi Sensitive. |
| `STRIPE_SECRET_KEY` | Opțional: alternativă cu prioritate față de CAMPAIGN_STRIPE_SECRET_KEY. Nu este necesară dublarea cheii. |
| `STRIPE_SITE_URL` | Opțional, implicit `https://ro.joinwebform.com`; pentru test local poate fi `http://localhost:3100`. |

Nu este necesară o cheie publică Stripe: checkout-ul este găzduit de Stripe. Nicio cheie secretă nu este trimisă în browser. CLI-ul Vercel exportă variabilele Sensitive fără valoare; acest lucru nu înseamnă că lipsesc la runtime.

## Webhook comun

URL: `https://ro.joinwebform.com/api/payments/stripe/webhook`

Evenimente: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`.

Acest endpoint tratează atât conturile existente, cât și plata după preview. Endpointul vechi `/api/campaign/webhook` nu este necesar pentru o configurare nouă. Sesiunile noi acceptă carduri; nu folosesc metode cu confirmare asincronă.

## Baza de date — înainte de deploy

Rulează **o singură dată** `supabase/stripe-launch.sql` în SQL Editor al proiectului existent. Este o tranzacție care adaugă:

1. Lead-uri și preview-uri private (`20260917_campaign.sql`).
2. Alegerea Start/Business în campanie (`20260917_campaign_plans.sql`).
3. Catalogul operațional Stripe: clienți, abonamente, facturi, evenimente și funcții atomice (`20260918_stripe_subscriptions.sql`).

Nu rula și fișierul consolidat și aceleași migrări separat. Scriptul păstrează tabelele/comenzile/profilele existente. În lipsa migrării, noul checkout și pagina contului nu pot funcționa.

## Testare și publicare

- `npm test`: teste unitare și PostgreSQL local (PGlite), inclusiv concurență la checkout, reînnoiri, duplicate, anulare și semnături webhook.
- `npm run lint`, `npx tsc --noEmit`, `npm run build`.
- Prețurile Live au fost confirmate de proprietar în conversație. Serverul le verifică direct în Stripe înainte de fiecare checkout; nu creează produse noi.
- Testarea efectivă a unei plăți necesită Stripe Test, cu cheie Test, patru prețuri Test și webhook Test. Variabile: `STRIPE_TEST_PRICE_STANDARD_LUNAR`, `STRIPE_TEST_PRICE_STANDARD_ANUAL`, `STRIPE_TEST_PRICE_BUSINESS_LUNAR`, `STRIPE_TEST_PRICE_BUSINESS_ANUAL`. Nu introduce carduri de test în Live și nu reutiliza prețurile Live cu o cheie Test.
- Un test unitar sau un build nu demonstrează că onboarding-ul Stripe Live este finalizat. Verifică în Stripe că plățile sunt activate și contul bancar este acceptat.
- În Stripe Billing activează notificările de factură/reînnoire și recuperarea plăților nereușite după preferințele firmei. Aplicația păstrează numai perioada deja achitată când o reînnoire eșuează.
- Refundurile și disputele se gestionează în Stripe și operațional; nu există automatizare care revocă accesul la fiecare refund. Schimbările manuale de preț, prorările și facturile neconforme cu abonamentul standard sunt respinse de sincronizare și necesită revizuire.
- După publicare, verifică o sesiune Checkout, primirea webhook-urilor și statusul contului. Nu iniția o plată Live de test fără acordul titularului cardului.

## Campania ascunsă

Pentru campanie rămân necesare configurările comerciale din `CAMPAIGN_SETUP.md`: WhatsApp, Pixel, taxa de construcție, bonusul anual, hostname-uri preview și expeditor Resend verificat. Lipsa acestora nu afectează checkout-ul principal Stripe. Plata după preview rămâne închisă până la completarea taxei/bonusului. Nu porni reclamele înainte de verificarea notificărilor către administrator.

## Referințe

[Stripe Checkout subscriptions](https://docs.stripe.com/payments/checkout/build-subscriptions), [subscription webhooks](https://docs.stripe.com/billing/subscriptions/webhooks).

## Verificări efectuate înainte de lansare

- 133 teste automate trecute; build, ESLint și TypeScript trecute.
- Proprietarul a configurat cheia Stripe și secretul webhook-ului ca Sensitive în Vercel Production. Valorile nu au fost afișate sau copiate în cod.
- Migrarea SQL a fost rulată de proprietar și verificată prin API-ul Supabase: toate tabelele/coloanele sunt prezente. Nu existau profile cu acces plătit activ la momentul verificării.
- Build-ul de producție execută `scripts/stripe-preflight.mjs`: verifică Stripe Live, cele patru prețuri, URL-ul și evenimentele webhook-ului, plus schema Supabase. Un eșec oprește deploy-ul înainte de promovare.

## Deploy publicat

- Production Ready: `dpl_BuSDrSa3izmgkeZ4YVfKKDfdfxnz`, 17 septembrie 2026.
- Domeniu: https://ro.joinwebform.com
- Build-ul Vercel a confirmat contul Stripe activ pentru încasări, toate cele patru prețuri, webhook-ul Live și migrările Supabase.
- Verificări HTTP Live: homepage 200 cu Stripe în footer; `/instalatii` 200 cu `X-Robots-Tag: noindex, nofollow`; sitemap fără campanie; checkout anonim 401; webhook fără semnătură 400.
- Nu a fost inițiată sau efectuată nicio plată reală. Verificările de formular folosesc interceptarea cererii de checkout în browser.
- Prima publicare a fost făcută din workspace prin Vercel CLI. Codul campaniei, integrarea Stripe și formularul simplificat sunt incluse împreună în sursele Git.

## Formular de pornire simplificat

- Cinci răspunsuri obligatorii: afacere, ofertă, public/zonă, obiectiv și contact.
- Prezența online și observațiile sunt opționale; logo-ul și materialele se discută în chat.
- Biblioteca de șabloane rămâne pentru inspirație, fără alegere în formular.
- API-ul acceptă noul brief versionat și formatul anterior. Folosește aceeași schemă Supabase, fără migrări suplimentare; nu inventează pagini, culori sau domeniu pentru client.
- Validarea și păstrarea răspunsurilor sunt testate automat; trimiterea în browser este interceptată, fără proiecte sau plăți de test în producție.
