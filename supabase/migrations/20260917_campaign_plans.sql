begin;
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
commit;
