begin;

-- Authorization helpers avoid recursive RLS and never accept a caller-chosen user.
create or replace function public.webform_is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.profiles where id=auth.uid() and role='admin');
$$;
revoke all on function public.webform_is_admin() from public;
grant execute on function public.webform_is_admin() to authenticated;

-- Remove historical permissive policies, not customer data.
do $$ declare p record; begin
 for p in select schemaname,tablename,policyname from pg_policies
 where schemaname='public' and tablename in ('profiles','orders','rooms','room_members','messages','blueprints','waitlist') loop
 execute format('drop policy %I on %I.%I',p.policyname,p.schemaname,p.tablename);
 end loop;
end $$;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.messages enable row level security;
alter table public.blueprints enable row level security;
alter table public.waitlist enable row level security;

revoke all on public.profiles,public.orders,public.rooms,public.room_members,public.messages,public.blueprints,public.waitlist from anon,authenticated;
grant select (id,email,name,business_name,phone_number,role,created_at,subscription_status,subscription_plan,subscription_expires_at) on public.profiles to authenticated;
grant update (name,business_name,phone_number) on public.profiles to authenticated;
grant select on public.rooms,public.room_members,public.messages to authenticated;
grant insert (id,room_id,sender_id,content) on public.messages to authenticated;
grant select (id,user_id,plan_id,amount,currency,status,created_at,updated_at) on public.orders to authenticated;
grant all on public.profiles,public.orders,public.rooms,public.room_members,public.messages,public.blueprints,public.waitlist to service_role;

create policy profiles_read on public.profiles for select to authenticated using(id=auth.uid() or public.webform_is_admin());
create policy profiles_edit on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
create policy orders_read on public.orders for select to authenticated using(user_id=auth.uid() or public.webform_is_admin());
create policy members_read on public.room_members for select to authenticated using(profile_id=auth.uid() or public.webform_is_admin());
create policy rooms_read on public.rooms for select to authenticated using(public.webform_is_admin() or exists(select 1 from public.room_members where room_id=rooms.id and profile_id=auth.uid()));
create policy messages_read on public.messages for select to authenticated using(public.webform_is_admin() or exists(select 1 from public.room_members where room_id=messages.room_id and profile_id=auth.uid()));
create policy messages_send on public.messages for insert to authenticated with check(sender_id=auth.uid() and char_length(trim(content)) between 1 and 5000 and (public.webform_is_admin() or exists(select 1 from public.room_members where room_id=messages.room_id and profile_id=auth.uid())));

alter table public.blueprints add column if not exists user_id uuid references public.profiles(id) on delete set null;
alter table public.blueprints add column if not exists submission_key uuid;
alter table public.blueprints add column if not exists notification_sent_at timestamptz;
create unique index if not exists blueprints_submission_once on public.blueprints(user_id,submission_key);
create index if not exists messages_room_time on public.messages(room_id,created_at);

create table if not exists public.request_limits(key text primary key, count integer not null, resets_at timestamptz not null);
alter table public.request_limits enable row level security;
revoke all on public.request_limits from anon,authenticated;
create or replace function public.webform_rate_limit(p_key text,p_limit integer,p_seconds integer) returns boolean
language plpgsql security definer set search_path='' as $$
declare attempts integer; begin
 if p_limit<1 or p_seconds<1 then raise exception 'Invalid limit'; end if;
 delete from public.request_limits where resets_at<now()-interval '1 day';
 insert into public.request_limits as limits(key,count,resets_at) values(p_key,1,now()+make_interval(secs=>p_seconds))
 on conflict(key) do update set count=case when limits.resets_at<=now() then 1 else limits.count+1 end,
 resets_at=case when limits.resets_at<=now() then now()+make_interval(secs=>p_seconds) else limits.resets_at end returning count into attempts;
 return attempts<=p_limit;
end $$;
revoke all on function public.webform_rate_limit(text,integer,integer) from public,anon,authenticated;
grant execute on function public.webform_rate_limit(text,integer,integer) to service_role;

create or replace function public.webform_init_room(p_user_id uuid,p_email text) returns uuid
language plpgsql security definer set search_path='' as $$
declare room uuid; begin
 if not exists(select 1 from public.profiles where id=p_user_id) then raise exception 'Profile missing'; end if;
 insert into public.rooms(name,created_by,slug) values('Suport WebForm',p_user_id,p_user_id::text)
 on conflict(slug) do update set slug=excluded.slug returning id into room;
 insert into public.room_members(room_id,profile_id,role) select room,id,role from public.profiles where id=p_user_id or role='admin'
 on conflict(room_id,profile_id) do nothing;
 return room;
end $$;
revoke all on function public.webform_init_room(uuid,text) from public,anon,authenticated;
grant execute on function public.webform_init_room(uuid,text) to service_role;

-- Atomic order/profile transition: duplicate or concurrent notifications cannot
-- grant access twice. A rollback also rolls back the order status.
alter table public.orders add column if not exists activated_at timestamptz;
alter table public.orders add column if not exists access_expires_at timestamptz;
alter table public.orders add column if not exists checkout_url text;
alter table public.orders add column if not exists request_key uuid;
alter table public.orders add column if not exists request_fingerprint text;
alter table public.profiles add column if not exists subscription_order_id text;
create unique index if not exists orders_request_once on public.orders(user_id,request_key);
create or replace function public.webform_apply_payment(p_order_id text,p_ntp_id text,p_amount numeric,p_currency text,p_status integer,p_token text default null) returns text
language plpgsql security definer set search_path='' as $$
declare o public.orders%rowtype; pr public.profiles%rowtype; expiry timestamptz; begin
 select * into o from public.orders where id=p_order_id for update;
 if not found then raise exception 'Unknown order'; end if;
 if o.amount<>p_amount or o.currency<>p_currency or (o.ntp_id is not null and o.ntp_id<>p_ntp_id) then raise exception 'Payment mismatch'; end if;
 select * into pr from public.profiles where id=o.user_id for update;
 if not found then raise exception 'Profile missing'; end if;
 if p_status in (8,10,17) then
  update public.orders set status='refunded',ntp_id=p_ntp_id,updated_at=now() where id=o.id;
  if pr.subscription_order_id=o.id then
   update public.profiles set subscription_status='cancelled',subscription_expires_at=now(),netopia_token=null where id=o.user_id;
  end if;
  return 'refunded';
 end if;
 if o.status='refunded' or o.activated_at is not null or o.status='completed' then return o.status; end if;
 if p_status in (3,5) then
  if o.plan_id not in ('standard_lunar','standard_anual','business_lunar','business_anual') then raise exception 'Unknown plan'; end if;
  -- Renewals extend the same plan; plan changes start a new period immediately.
  expiry=case when split_part(pr.subscription_plan,'_',1)=split_part(o.plan_id,'_',1) and pr.subscription_expires_at>now() then pr.subscription_expires_at else now() end;
  expiry=expiry + case when o.plan_id like '%_anual' then interval '1 year' else interval '1 month' end;
  update public.profiles set subscription_status='active',subscription_plan=o.plan_id,subscription_expires_at=expiry,subscription_order_id=o.id,netopia_token=p_token where id=o.user_id;
  update public.orders set status='completed',activated_at=now(),access_expires_at=expiry,ntp_id=p_ntp_id,payment_token=p_token,updated_at=now() where id=o.id;
  return 'completed';
 end if;
 update public.orders set status=case when p_status in (1,2,6,7,14,15,18) then 'pending' else 'failed' end,ntp_id=p_ntp_id,updated_at=now() where id=o.id;
 return 'recorded';
end $$;
revoke all on function public.webform_apply_payment(text,text,numeric,text,integer,text) from public,anon,authenticated;
grant execute on function public.webform_apply_payment(text,text,numeric,text,integer,text) to service_role;

-- Private asset metadata. Files are served through owner-checked API routes.
create table if not exists public.blueprint_assets (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
 storage_path text not null unique, original_name text not null, mime_type text not null,
 size_bytes integer not null, blueprint_id uuid references public.blueprints(id) on delete set null,
 created_at timestamptz not null default now()
);
alter table public.blueprint_assets enable row level security;
revoke all on public.blueprint_assets from anon,authenticated;
grant all on public.blueprint_assets to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('webform-private-assets','webform-private-assets',false,10485760,array['image/jpeg','image/png','image/webp','image/gif','application/pdf'])
on conflict(id) do update set public=false,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;

-- Profile creation is atomic with signup; user metadata never determines privileges.
create or replace function public.webform_create_profile() returns trigger
language plpgsql security definer set search_path='' as $$ begin
 insert into public.profiles(id,email,name,business_name,phone_number,role)
 values(new.id,new.email,left(new.raw_user_meta_data->>'name',150),left(new.raw_user_meta_data->>'business_name',150),left(new.raw_user_meta_data->>'phone_number',30),'client')
 on conflict(id) do nothing;
 return new;
end $$;
revoke all on function public.webform_create_profile() from public,anon,authenticated;
drop trigger if exists webform_profile_created on auth.users;
create trigger webform_profile_created after insert on auth.users for each row execute function public.webform_create_profile();

commit;
