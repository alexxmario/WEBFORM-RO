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
