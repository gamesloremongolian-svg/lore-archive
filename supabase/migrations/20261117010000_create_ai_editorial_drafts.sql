-- Staff membership table shared by the admin and AI editorial workspaces.
-- The first owner must be provisioned manually after creating their Auth account.
create table if not exists public.staff_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','editor')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.staff_members enable row level security;
grant select on public.staff_members to authenticated;
grant insert, update, delete on public.staff_members to authenticated;
drop policy if exists "staff read own membership" on public.staff_members;
create policy "staff read own membership" on public.staff_members
  for select to authenticated
  using (user_id = auth.uid() or public.is_staff(array['owner','admin']));
drop policy if exists "owners manage staff memberships" on public.staff_members;
create policy "owners manage staff memberships" on public.staff_members
  for all to authenticated
  using (public.is_staff(array['owner']))
  with check (public.is_staff(array['owner']));

-- AI editorial drafts used by /editorial/ai.html.
-- Relies on public.staff_members(user_id, role, active) already existing.

create table if not exists public.ai_editorial_drafts (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  universe text,
  content_type text not null,
  title text not null,
  slug text not null,
  summary text not null default '',
  body text not null,
  source_urls text[] not null default '{}',
  canon_status text not null default 'unknown'
    check (canon_status in ('canon','non_canon','theory','unknown')),
  status text not null default 'draft'
    check (status in ('draft','review','approved')),
  created_by uuid not null default auth.uid() references auth.users(id),
  reviewed_by uuid references auth.users(id),
  published_post_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_editorial_drafts_created_at_idx
  on public.ai_editorial_drafts (created_at desc);
create index if not exists ai_editorial_drafts_status_idx
  on public.ai_editorial_drafts (status);

alter table public.ai_editorial_drafts enable row level security;

create or replace function public.is_active_staff(allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.staff_members s
    where s.user_id = auth.uid()
      and s.active = true
      and s.role = any (allowed_roles)
  );
$$;

revoke all on function public.is_active_staff(text[]) from public, anon;
grant execute on function public.is_active_staff(text[]) to authenticated;

drop policy if exists "staff read ai drafts" on public.ai_editorial_drafts;
create policy "staff read ai drafts" on public.ai_editorial_drafts
  for select to authenticated
  using (public.is_active_staff(array['owner','admin','editor']));

drop policy if exists "staff insert ai drafts" on public.ai_editorial_drafts;
create policy "staff insert ai drafts" on public.ai_editorial_drafts
  for insert to authenticated
  with check (
    public.is_active_staff(array['owner','admin','editor'])
    and created_by = auth.uid()
    and status = 'draft'
  );

-- Editors may edit drafts and send them to review; only owner/admin may approve/publish.
drop policy if exists "staff update ai drafts" on public.ai_editorial_drafts;
create policy "staff update ai drafts" on public.ai_editorial_drafts
  for update to authenticated
  using (public.is_active_staff(array['owner','admin','editor']))
  with check (
    public.is_active_staff(array['owner','admin'])
    or (public.is_active_staff(array['editor']) and status in ('draft','review'))
  );
