-- LOREVERSE Discord-style community MVP
-- Applied to Supabase project nfacspfctvunwbxtvvyi on 2026-11-18.
create table if not exists public.community_servers (
 id uuid primary key default gen_random_uuid(),
 name text not null check(char_length(btrim(name)) between 2 and 60),
 description text not null default '' check(char_length(description)<=500),
 icon_url text, owner_id uuid not null references auth.users(id) on delete cascade,
 is_public boolean not null default false, created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.community_server_members (
 server_id uuid not null references public.community_servers(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 role text not null default 'member' check(role in ('owner','admin','moderator','member')),
 joined_at timestamptz not null default now(), primary key(server_id,user_id)
);
create table if not exists public.community_channels (
 id uuid primary key default gen_random_uuid(),
 server_id uuid not null references public.community_servers(id) on delete cascade,
 name text not null check(name ~ '^[a-z0-9][a-z0-9-]{1,39}$'),
 description text not null default '' check(char_length(description)<=250),
 channel_type text not null default 'text' check(channel_type in ('text','announcement')),
 is_private boolean not null default false, position integer not null default 0,
 created_by uuid not null references auth.users(id), created_at timestamptz not null default now(),
 unique(server_id,name)
);
create table if not exists public.community_messages (
 id uuid primary key default gen_random_uuid(),
 channel_id uuid not null references public.community_channels(id) on delete cascade,
 author_id uuid not null references auth.users(id) on delete cascade,
 body text not null check(char_length(btrim(body)) between 1 and 4000),
 created_at timestamptz not null default now(), edited_at timestamptz, deleted_at timestamptz
);
create table if not exists public.community_invites (
 id uuid primary key default gen_random_uuid(),
 server_id uuid not null references public.community_servers(id) on delete cascade,
 token text not null unique default encode(gen_random_bytes(12),'hex'),
 created_by uuid not null references auth.users(id),
 max_uses integer check(max_uses is null or max_uses>0),
 uses integer not null default 0 check(uses>=0), expires_at timestamptz,
 created_at timestamptz not null default now()
);
create index if not exists community_server_members_user_idx on public.community_server_members(user_id,joined_at desc);
create index if not exists community_channels_server_idx on public.community_channels(server_id,position);
create index if not exists community_messages_channel_created_idx on public.community_messages(channel_id,created_at desc);
create index if not exists community_invites_server_idx on public.community_invites(server_id,created_at desc);
create or replace function public.community_is_member(p_server_id uuid) returns boolean
language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.community_server_members m where m.server_id=p_server_id and m.user_id=(select auth.uid())) $$;
create or replace function public.community_has_role(p_server_id uuid,p_roles text[]) returns boolean
language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.community_server_members m where m.server_id=p_server_id and m.user_id=(select auth.uid()) and m.role=any(p_roles)) $$;
create or replace function public.community_can_read_channel(p_channel_id uuid) returns boolean
language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.community_channels c join public.community_server_members m on m.server_id=c.server_id where c.id=p_channel_id and m.user_id=(select auth.uid()) and (not c.is_private or m.role in ('owner','admin','moderator'))) $$;
alter table public.community_servers enable row level security;
alter table public.community_server_members enable row level security;
alter table public.community_channels enable row level security;
alter table public.community_messages enable row level security;
alter table public.community_invites enable row level security;
grant select,insert,update,delete on public.community_servers,public.community_server_members,public.community_channels,public.community_messages,public.community_invites to authenticated;
grant select on public.community_servers to anon;
create policy "Members and public servers can be discovered" on public.community_servers for select to anon,authenticated
using(is_public=true or owner_id=(select auth.uid()) or public.community_is_member(id));
create policy "Server owners can update server" on public.community_servers for update to authenticated
using(public.community_has_role(id,array['owner','admin'])) with check(public.community_has_role(id,array['owner','admin']));
create policy "Server owners can delete server" on public.community_servers for delete to authenticated using(owner_id=(select auth.uid()));
create policy "Members can view server roster" on public.community_server_members for select to authenticated using(public.community_is_member(server_id));
create policy "Owners and admins can change member roles" on public.community_server_members for update to authenticated
using(public.community_has_role(server_id,array['owner','admin']) and role<>'owner')
with check(public.community_has_role(server_id,array['owner','admin']) and role in ('member','moderator'));
create policy "Admins can remove memberships" on public.community_server_members for delete to authenticated
using(public.community_has_role(server_id,array['owner','admin']) or user_id=(select auth.uid()));
create policy "Members can view channels" on public.community_channels for select to authenticated
using(public.community_is_member(server_id) and (not is_private or public.community_has_role(server_id,array['owner','admin','moderator'])));
create policy "Admins can create channels" on public.community_channels for insert to authenticated
with check(created_by=(select auth.uid()) and public.community_has_role(server_id,array['owner','admin']));
create policy "Admins can update channels" on public.community_channels for update to authenticated
using(public.community_has_role(server_id,array['owner','admin'])) with check(public.community_has_role(server_id,array['owner','admin']));
create policy "Admins can delete channels" on public.community_channels for delete to authenticated
using(public.community_has_role(server_id,array['owner','admin']));
create policy "Members can read channel messages" on public.community_messages for select to authenticated
using(deleted_at is null and public.community_can_read_channel(channel_id));
create policy "Members can send channel messages" on public.community_messages for insert to authenticated
with check(author_id=(select auth.uid()) and public.community_can_read_channel(channel_id));
create policy "Authors and moderators can edit messages" on public.community_messages for update to authenticated
using(author_id=(select auth.uid()) or exists(select 1 from public.community_channels c where c.id=channel_id and public.community_has_role(c.server_id,array['owner','admin','moderator'])))
with check(author_id=(select auth.uid()) or exists(select 1 from public.community_channels c where c.id=channel_id and public.community_has_role(c.server_id,array['owner','admin','moderator'])));
create policy "Server admins can view invites" on public.community_invites for select to authenticated
using(public.community_has_role(server_id,array['owner','admin','moderator']));
create policy "Server admins can create invites" on public.community_invites for insert to authenticated
with check(created_by=(select auth.uid()) and public.community_has_role(server_id,array['owner','admin','moderator']));
create policy "Server admins can revoke invites" on public.community_invites for delete to authenticated
using(public.community_has_role(server_id,array['owner','admin','moderator']));
create or replace function public.community_create_server(p_name text,p_description text default '') returns uuid
language plpgsql security definer set search_path=public
as $$ declare v_server_id uuid; begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 insert into public.community_servers(name,description,owner_id) values(btrim(p_name),coalesce(p_description,''),auth.uid()) returning id into v_server_id;
 insert into public.community_server_members(server_id,user_id,role) values(v_server_id,auth.uid(),'owner');
 insert into public.community_channels(server_id,name,description,created_by,position) values(v_server_id,'general','Ерөнхий чат',auth.uid(),0);
 return v_server_id; end $$;
create or replace function public.community_join_with_invite(p_token text) returns uuid
language plpgsql security definer set search_path=public
as $$ declare v_invite public.community_invites%rowtype; begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 select * into v_invite from public.community_invites where token=p_token for update;
 if not found then raise exception 'Invite not found'; end if;
 if v_invite.expires_at is not null and v_invite.expires_at<=now() then raise exception 'Invite expired'; end if;
 if v_invite.max_uses is not null and v_invite.uses>=v_invite.max_uses then raise exception 'Invite limit reached'; end if;
 insert into public.community_server_members(server_id,user_id,role) values(v_invite.server_id,auth.uid(),'member') on conflict(server_id,user_id) do nothing;
 update public.community_invites set uses=uses+1 where id=v_invite.id; return v_invite.server_id; end $$;
revoke all on function public.community_create_server(text,text) from public,anon;
revoke all on function public.community_join_with_invite(text) from public,anon;
grant execute on function public.community_create_server(text,text),public.community_join_with_invite(text) to authenticated;
revoke all on function public.community_is_member(uuid),public.community_has_role(uuid,text[]),public.community_can_read_channel(uuid) from public,anon;
grant execute on function public.community_is_member(uuid) to anon,authenticated;
grant execute on function public.community_has_role(uuid,text[]),public.community_can_read_channel(uuid) to authenticated;
do $$ begin
 if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='community_messages') then alter publication supabase_realtime add table public.community_messages; end if;
 if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='community_server_members') then alter publication supabase_realtime add table public.community_server_members; end if;
end $$;
