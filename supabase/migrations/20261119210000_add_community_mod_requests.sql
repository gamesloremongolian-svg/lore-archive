create table if not exists public.community_mod_requests (
 id uuid primary key default gen_random_uuid(),
 server_id uuid not null references public.community_servers(id) on delete cascade,
 requested_by uuid not null references auth.users(id) on delete cascade,
 mod_name text not null check (char_length(btrim(mod_name)) between 2 and 80),
 description text not null check (char_length(btrim(description)) between 10 and 1500),
 status text not null default 'pending' check (status in ('pending','reviewing','approved','rejected','completed')),
 admin_note text,
 reviewed_by uuid references auth.users(id) on delete set null,
 reviewed_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.community_mod_requests enable row level security;
drop policy if exists "Members submit own MOD requests" on public.community_mod_requests;
create policy "Members submit own MOD requests" on public.community_mod_requests for insert to authenticated with check (requested_by=(select auth.uid()) and public.community_is_member(server_id));
drop policy if exists "Users and server staff view MOD requests" on public.community_mod_requests;
create policy "Users and server staff view MOD requests" on public.community_mod_requests for select to authenticated using (requested_by=(select auth.uid()) or public.community_has_role(server_id,array['owner','admin','moderator']));
drop policy if exists "Server staff update MOD requests" on public.community_mod_requests;
create policy "Server staff update MOD requests" on public.community_mod_requests for update to authenticated using (public.community_has_role(server_id,array['owner','admin'])) with check (public.community_has_role(server_id,array['owner','admin']));
grant select,insert,update on public.community_mod_requests to authenticated;
revoke delete on public.community_mod_requests from anon,authenticated;