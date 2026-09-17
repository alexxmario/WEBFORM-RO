import { readFileSync } from 'node:fs';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
// Sensitive Vercel variables are available here during the remote production build.
// Print only pass/fail metadata, never credentials or raw API responses.
if(process.env.VERCEL_ENV!=='production'&&!process.argv.includes('--check')){
 console.log('Stripe preflight: skipped outside production.');
}else{
 try{
 const key=process.env.STRIPE_SECRET_KEY||process.env.CAMPAIGN_STRIPE_SECRET_KEY;
 if(!/^(sk|rk)_live_/.test(key||''))throw new Error('A Live Stripe secret key is required.');
 if(!process.env.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_'))throw new Error('STRIPE_WEBHOOK_SECRET is missing or invalid.');
 const stripe=new Stripe(key,{timeout:15000,maxNetworkRetries:1});
 const account=await stripe.accounts.retrieve();if(!account.charges_enabled)throw new Error('Stripe account cannot accept charges yet. Complete account activation.');
 console.log('OK Stripe account can accept charges.');
 const ids=JSON.parse(readFileSync(new URL('../lib/stripe/live-prices.json',import.meta.url),'utf8'));
 const expected={standard_lunar:[18000,'month'],standard_anual:[162000,'year'],business_lunar:[35000,'month'],business_anual:[315000,'year']};
 for(const [plan,id]of Object.entries(ids)){const price=await stripe.prices.retrieve(id);const [amount,interval]=expected[plan];if(!price.active||!price.livemode||price.currency!=='ron'||price.unit_amount!==amount||price.recurring?.interval!==interval||price.recurring.interval_count!==1||price.recurring.usage_type!=='licensed'||price.billing_scheme!=='per_unit'||price.transform_quantity)throw new Error(`Stripe catalog mismatch: ${plan}`);console.log(`OK Stripe price ${plan}.`);}
 const origin=new URL(process.env.STRIPE_SITE_URL||process.env.CAMPAIGN_SITE_URL||'https://ro.joinwebform.com').origin;
 const expectedUrl=`${origin}/api/payments/stripe/webhook`;
 const required=['checkout.session.completed','invoice.paid','invoice.payment_failed','customer.subscription.updated','customer.subscription.deleted'];
 let found=false;
 for await(const endpoint of stripe.webhookEndpoints.list({limit:100})){if(endpoint.url===expectedUrl&&endpoint.status==='enabled'&&endpoint.livemode&&(endpoint.enabled_events.includes('*')||required.every(type=>endpoint.enabled_events.includes(type)))){found=true;break;}}
 if(!found)throw new Error('The Live webhook URL or required events are not configured.');
 console.log('OK Live webhook endpoint and event selection.');
 const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
 for(const[table,columns]of [['orders','id,payment_provider,stripe_session_id,terms_version'],['stripe_customers','user_id'],['stripe_subscriptions','id'],['stripe_invoices','id'],['stripe_webhook_events','id'],['campaign_leads','id'],['campaign_checkouts','id,plan_id']]){const r=await db.from(table).select(columns).limit(0);if(r.error)throw new Error(`Database migration missing or inaccessible: ${table}`);}
 console.log('OK Stripe and campaign database migrations.');
 }catch(error){const message=error instanceof Error?error.message:'unknown';// Stripe messages can contain request details; keep external failures generic.
 const safe=/^(A Live|STRIPE_WEBHOOK|Stripe account|Stripe catalog|The Live|Database migration)/.test(message)?message:'External verification failed; check Stripe/Supabase credentials and connectivity.';
 console.error(`Stripe production preflight blocked: ${safe}`);process.exitCode=1;
 }
}
