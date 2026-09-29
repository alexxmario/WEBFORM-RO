begin;
alter table public.campaign_leads
  add column if not exists assigned_page text,
  add column if not exists next_follow_up_at timestamptz;
create index if not exists campaign_leads_follow_up_idx
  on public.campaign_leads(next_follow_up_at)
  where next_follow_up_at is not null and status not in ('paid', 'lost');
-- Existing RLS, server-only permissions and revision trigger also protect these fields.
commit;
