-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  name text,
  business_name text,
  phone_number text,
  role text not null default 'client' check (role in ('admin', 'client')),
  created_at timestamptz default now()
);

-- Rooms
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz default now()
);

-- Room members
create table if not exists public.room_members (
  room_id uuid references public.rooms (id) on delete cascade,
  profile_id uuid references public.profiles (id) on delete cascade,
  role text not null default 'client' check (role in ('admin', 'client')),
  primary key (room_id, profile_id)
);

-- Messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.messages enable row level security;

-- Profiles policies
create policy "profiles_select" on public.profiles
  for select using (role = 'admin' or id = auth.uid());

create policy "profiles_insert_self" on public.profiles
  for insert with check (id = auth.uid());

create policy "profiles_update_self" on public.profiles
  for update using (id = auth.uid());

-- Rooms policies
create policy "rooms_member_or_admin" on public.rooms
  for select using (
    exists (
      select 1 from public.room_members rm
      where rm.room_id = rooms.id and rm.profile_id = auth.uid()
    ) or auth.uid() in (select id from public.profiles where role = 'admin')
  );

create policy "rooms_insert_owner" on public.rooms
  for insert with check (created_by = auth.uid());

-- Room members policies
create policy "room_members_select" on public.room_members
  for select using (
    profile_id = auth.uid()
    or auth.uid() in (select id from public.profiles where role = 'admin')
  );

create policy "room_members_insert_self" on public.room_members
  for insert with check (profile_id = auth.uid());

-- Messages policies
create policy "messages_member" on public.messages
  for select using (
    exists (
      select 1 from public.room_members rm
      where rm.room_id = messages.room_id and rm.profile_id = auth.uid()
    ) or auth.uid() in (select id from public.profiles where role = 'admin')
  );

create policy "messages_insert_member" on public.messages
  for insert with check (
    sender_id = auth.uid() and
    exists (
      select 1 from public.room_members rm
      where rm.room_id = messages.room_id and rm.profile_id = auth.uid()
    )
  );
