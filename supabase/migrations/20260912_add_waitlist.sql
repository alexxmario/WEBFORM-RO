-- Private lead storage. Writes go through the validated server endpoint.
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  business_type text not null default '',
  tier text not null default 'Starter',
  created_at timestamptz not null default now()
);
alter table public.waitlist enable row level security;
