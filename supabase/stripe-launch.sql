-- Run once in the existing project SQL Editor before deploying the Stripe checkout.
-- Adds private tables and payment columns; preserves existing orders and profiles.
begin;

-- 20260917_campaign.sql
-- Campaign data is only accessible via authenticated server endpoints.
create table public.campaign_leads (
 id uuid primary key default gen_random_uuid(), event_id uuid not null unique,
 source text not null check(source in ('instalatii','homepage')), name text not null, phone text not null,
 company boolean, city text, services jsonb not null default '[]', business_type text,
 attribution jsonb not null default '{}', consent_version text not null, consent_at timestamptz not null default now(), marketing_consent boolean not null default false,
 created_at timestamptz not null default now(), status text not null default 'new' check(status in ('new','called','in_progress','preview_sent','paid','lost')),
 notes text not null default '', first_called_at timestamptz, revision uuid not null default gen_random_uuid(),
 preview_token text unique, preview_url text, preview_expires_at timestamptz,
 paid_at timestamptz, stripe_subscription_id text, notification_sent_at timestamptz, payment_notification_sent_at timestamptz
);
create index campaign_leads_status_created on public.campaign_leads(status,created_at desc);
create table public.campaign_checkouts (
 id uuid primary key default gen_random_uuid(), lead_id uuid not null references public.campaign_leads(id),
 interval text not null check(interval in ('month','year')), terms_version text not null, terms_text text not null, accepted_at timestamptz not null default now(),
 stripe_session_id text unique, created_at timestamptz not null default now(), completed_at timestamptz
);
alter table public.campaign_leads enable row level security;
alter table public.campaign_checkouts enable row level security;
revoke all on public.campaign_leads, public.campaign_checkouts from anon, authenticated;
grant all on public.campaign_leads, public.campaign_checkouts to service_role;
-- Preserve the actual first-call timestamp and protect paid state from accidental edits.
create function public.campaign_lead_update() returns trigger language plpgsql set search_path=public as $$
begin
 if old.first_called_at is not null then new.first_called_at=old.first_called_at;
 elsif new.status='called' then new.first_called_at=now(); end if;
 if old.paid_at is not null then new.status='paid'; end if;
 new.revision=gen_random_uuid(); return new;
end $$;
create trigger campaign_lead_update before update on public.campaign_leads for each row execute function public.campaign_lead_update();
-- Serialize checkout creation for each lead across serverless requests.
create function public.campaign_claim_checkout(p_lead uuid,p_attempt uuid,p_interval text,p_version text,p_terms text)
returns uuid language plpgsql security definer set search_path=public as $$
declare existing public.campaign_checkouts; payment_time timestamptz;
begin
 select paid_at into payment_time from campaign_leads where id=p_lead for update;
 if not found or payment_time is not null then raise exception 'Lead unavailable'; end if;
 select * into existing from campaign_checkouts where lead_id=p_lead and created_at>now()-interval '32 minutes' order by created_at desc limit 1;
 if found then
  if existing.interval<>p_interval then raise exception 'Checkout already open'; end if;
  return existing.id;
 end if;
 insert into campaign_checkouts(id,lead_id,interval,terms_version,terms_text) values(p_attempt,p_lead,p_interval,p_version,p_terms);
 return p_attempt;
end $$;
revoke all on function public.campaign_claim_checkout(uuid,uuid,text,text,text) from public,anon,authenticated;
grant execute on function public.campaign_claim_checkout(uuid,uuid,text,text,text) to service_role;

-- 20260917_campaign_plans.sql
alter table public.campaign_checkouts add column plan_id text;
update public.campaign_checkouts set plan_id=case when interval='month' then 'standard_lunar' else 'standard_anual' end;
alter table public.campaign_checkouts alter column plan_id set not null;
alter table public.campaign_checkouts add constraint campaign_checkout_plan check(plan_id in ('standard_lunar','standard_anual','business_lunar','business_anual'));
alter table public.campaign_checkouts add constraint campaign_checkout_plan_interval check(interval=case when plan_id like '%_anual' then 'year' else 'month' end);
-- Replace the old signature so all callers must select a plan explicitly.
drop function public.campaign_claim_checkout(uuid,uuid,text,text,text);
create function public.campaign_claim_checkout(p_lead uuid,p_attempt uuid,p_plan text,p_version text,p_terms text)
returns uuid language plpgsql security definer set search_path=public as $$
declare existing public.campaign_checkouts; payment_time timestamptz;
begin
 if p_plan not in ('standard_lunar','standard_anual','business_lunar','business_anual') then raise exception 'Unknown plan'; end if;
 select paid_at into payment_time from campaign_leads where id=p_lead for update;
 if not found or payment_time is not null then raise exception 'Lead unavailable'; end if;
 select * into existing from campaign_checkouts where lead_id=p_lead and created_at>now()-interval '32 minutes' order by created_at desc limit 1;
 if found then
  if existing.plan_id<>p_plan or existing.terms_version<>p_version or existing.terms_text<>p_terms then raise exception 'Checkout already open'; end if;
  return existing.id;
 end if;
 insert into campaign_checkouts(id,lead_id,interval,plan_id,terms_version,terms_text)
 values(p_attempt,p_lead,case when p_plan like '%_anual' then 'year' else 'month' end,p_plan,p_version,p_terms);
 return p_attempt;
end $$;
revoke all on function public.campaign_claim_checkout(uuid,uuid,text,text,text) from public,anon,authenticated;
grant execute on function public.campaign_claim_checkout(uuid,uuid,text,text,text) to service_role;

-- 20260918_stripe_subscriptions.sql
alter table public.orders add column payment_provider text not null default 'netopia' check(payment_provider in ('netopia','stripe'));
alter table public.orders add column stripe_session_id text unique;
alter table public.orders add column stripe_subscription_id text;
alter table public.orders add column terms_version text;
alter table public.orders add column terms_text text;
alter table public.orders add column terms_accepted_at timestamptz;
create table public.stripe_customers (
 user_id uuid primary key references public.profiles(id), customer_id text not null unique
);
create table public.stripe_subscriptions (
 id text primary key, user_id uuid not null references public.profiles(id), initial_order_id text not null unique references public.orders(id),
 customer_id text not null, plan_id text not null, status text not null,
 cancel_at_period_end boolean not null default false, state_event_time bigint not null default 0,
 paid_until timestamptz, updated_at timestamptz not null default now()
);
create index stripe_subscriptions_user on public.stripe_subscriptions(user_id);
create table public.stripe_invoices (
 id text primary key, subscription_id text not null references public.stripe_subscriptions(id), order_id text not null references public.orders(id),
 amount numeric not null, period_end timestamptz not null, paid_at timestamptz not null default now()
);
create table public.stripe_webhook_events(id text primary key, processed_at timestamptz not null default now());
alter table public.stripe_customers enable row level security;
alter table public.stripe_subscriptions enable row level security;
alter table public.stripe_invoices enable row level security;
alter table public.stripe_webhook_events enable row level security;
revoke all on public.stripe_customers,public.stripe_subscriptions,public.stripe_invoices,public.stripe_webhook_events from anon,authenticated;
grant all on public.stripe_customers,public.stripe_subscriptions,public.stripe_invoices,public.stripe_webhook_events to service_role;

-- Lock the profile before accepting a new subscription, including separate tabs/devices.
create function public.webform_stripe_claim(p_user uuid,p_key uuid,p_plan text,p_amount numeric,p_fingerprint text,p_billing jsonb,p_version text,p_terms text)
returns text language plpgsql security definer set search_path=public as $$
declare pr public.profiles; o public.orders; order_id text;
begin
 select * into pr from profiles where id=p_user for update;
 if not found then raise exception 'Profile missing'; end if;
 if p_plan not in ('standard_lunar','standard_anual','business_lunar','business_anual') or p_amount<=0 then raise exception 'Invalid plan'; end if;
 select * into o from orders where user_id=p_user and request_key=p_key;
 if found and o.status='completed' and o.payment_provider='stripe' and o.request_fingerprint=p_fingerprint then return o.id; end if;
 if exists(select 1 from stripe_subscriptions where user_id=p_user and status not in ('canceled','incomplete_expired'))
 or (pr.subscription_status in ('active','cancelled') and pr.subscription_expires_at>now()) then raise exception 'Subscription already exists'; end if;
 select * into o from orders where user_id=p_user and payment_provider='stripe' and status='pending' and created_at>now()-interval '32 minutes' order by created_at desc limit 1;
 if found then
  if o.request_fingerprint<>p_fingerprint then raise exception 'Checkout already open'; end if;
  return o.id;
 end if;
 if exists(select 1 from orders where user_id=p_user and request_key=p_key) then raise exception 'Checkout expired'; end if;
 if p_billing->>'promotion_code' is not null and exists(select 1 from orders where user_id=p_user and status='completed') then raise exception 'Promotion already used'; end if;
 order_id='WF-S-'||p_key::text;
 insert into orders(id,user_id,plan_id,amount,currency,status,billing_info,request_key,request_fingerprint,payment_provider,terms_version,terms_text,terms_accepted_at)
 values(order_id,p_user,p_plan,p_amount,'RON','pending',p_billing,p_key,p_fingerprint,'stripe',p_version,p_terms,now());
 return order_id;
end $$;
revoke all on function public.webform_stripe_claim(uuid,uuid,text,numeric,text,jsonb,text,text) from public,anon,authenticated;
grant execute on function public.webform_stripe_claim(uuid,uuid,text,numeric,text,jsonb,text,text) to service_role;

-- One transaction records each invoice exactly once and grants its exact paid period.
-- Late subscription events cannot roll back newer state; late invoices never shorten access.
create function public.webform_stripe_sync(p_order text,p_subscription text,p_customer text,p_status text,p_cancel boolean,p_event_time bigint,p_invoice jsonb default null)
returns void language plpgsql security definer set search_path=public as $$
declare o public.orders; s public.stripe_subscriptions; invoice_order text; until_time timestamptz; expected numeric;
begin
 select * into o from orders where id=p_order;
 if not found or o.payment_provider<>'stripe' then raise exception 'Unknown Stripe order'; end if;
 perform 1 from profiles where id=o.user_id for update;
 select * into o from orders where id=p_order for update;
 if o.stripe_subscription_id is not null and o.stripe_subscription_id<>p_subscription then raise exception 'Subscription mismatch'; end if;
 if not exists(select 1 from stripe_customers where user_id=o.user_id and customer_id=p_customer) then raise exception 'Customer mismatch'; end if;
 insert into stripe_subscriptions(id,user_id,initial_order_id,customer_id,plan_id,status,cancel_at_period_end,state_event_time)
 values(p_subscription,o.user_id,o.id,p_customer,o.plan_id,p_status,p_cancel,p_event_time) on conflict(id) do nothing;
 select * into s from stripe_subscriptions where id=p_subscription for update;
 if s.initial_order_id<>o.id or s.customer_id<>p_customer then raise exception 'Subscription mismatch'; end if;
 if p_event_time>s.state_event_time or (p_event_time=s.state_event_time and (p_cancel or p_status='canceled')) then
  update stripe_subscriptions set status=p_status,cancel_at_period_end=p_cancel,state_event_time=p_event_time,updated_at=now() where id=s.id;
 end if;
 update orders set stripe_subscription_id=p_subscription where id=o.id;
 if p_invoice is not null and not exists(select 1 from stripe_invoices where id=p_invoice->>'id') then
  until_time=(p_invoice->>'period_end')::timestamptz;
  expected=case when p_invoice->>'reason'='subscription_create' then o.amount else case o.plan_id when 'standard_lunar' then 180 when 'standard_anual' then 1620 when 'business_lunar' then 350 when 'business_anual' then 3150 end end;
  if (p_invoice->>'amount')::numeric<>expected or p_invoice->>'currency'<>'ron' or p_invoice->>'reason' not in ('subscription_create','subscription_cycle') then raise exception 'Invoice mismatch'; end if;
  invoice_order=case when p_invoice->>'reason'='subscription_create' then o.id else 'WF-I-'||(p_invoice->>'id') end;
  if invoice_order<>o.id then
   insert into orders(id,user_id,plan_id,amount,currency,status,billing_info,payment_provider,stripe_subscription_id,activated_at,access_expires_at)
   values(invoice_order,o.user_id,o.plan_id,expected,'RON','completed',o.billing_info,'stripe',s.id,now(),until_time);
  else
   update orders set status='completed',activated_at=coalesce(activated_at,now()),access_expires_at=until_time,updated_at=now() where id=o.id;
  end if;
  insert into stripe_invoices(id,subscription_id,order_id,amount,period_end) values(p_invoice->>'id',s.id,invoice_order,expected,until_time);
  update stripe_subscriptions set paid_until=greatest(paid_until,until_time) where id=s.id;
 end if;
 select * into s from stripe_subscriptions where id=p_subscription;
 -- Do not let events from an old subscription overwrite a newer subscription.
 if s.paid_until is not null and not exists(select 1 from stripe_subscriptions newer join orders no on no.id=newer.initial_order_id where newer.user_id=o.user_id and newer.id<>s.id and no.created_at>o.created_at and newer.paid_until is not null) then
  update profiles set subscription_plan=s.plan_id,subscription_order_id=o.id,
   subscription_expires_at=s.paid_until,
   subscription_status=case when s.status in ('canceled','unpaid','incomplete_expired') or s.cancel_at_period_end then 'cancelled' else 'active' end,
   netopia_token=null where id=o.user_id;
 end if;
end $$;
revoke all on function public.webform_stripe_sync(text,text,text,text,boolean,bigint,jsonb) from public,anon,authenticated;
grant execute on function public.webform_stripe_sync(text,text,text,text,boolean,bigint,jsonb) to service_role;

notify pgrst, 'reload schema';
commit;
