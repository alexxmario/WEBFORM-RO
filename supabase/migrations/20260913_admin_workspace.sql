begin;
alter table public.blueprints add column if not exists workflow_status text not null default 'new' check (workflow_status in ('new','in_progress','review','published'));
alter table public.blueprints add column if not exists admin_notes text not null default '';
alter table public.blueprints add column if not exists admin_revision uuid not null default gen_random_uuid();
create index if not exists blueprints_workflow_status_idx on public.blueprints(workflow_status);
-- Internal workflow is written through the server after a verified database role check.
-- The integrity migration already revokes client INSERT/UPDATE privileges.
commit;
