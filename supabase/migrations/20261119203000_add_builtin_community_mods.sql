create table if not exists public.community_mod_installs (
  server_id uuid not null references public.community_servers(id) on delete cascade,
  mod_key text not null check (mod_key in ('welcome','anti_spam','leveling')),
  enabled boolean not null default true,
  settings jsonb not null default '{}'::jsonb,
  installed_by uuid not null references auth.users(id) on delete restrict,
  installed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key(server_id,mod_key)
);
alter table public.community_mod_installs enable row level security;
drop policy if exists "Members view installed community mods" on public.community_mod_installs;
create policy "Members view installed community mods" on public.community_mod_installs for select to authenticated using (public.community_is_member(server_id));
drop policy if exists "Server admins install community mods" on public.community_mod_installs;
create policy "Server admins install community mods" on public.community_mod_installs for insert to authenticated with check (installed_by=(select auth.uid()) and public.community_has_role(server_id,array['owner','admin']));
drop policy if exists "Server admins update community mods" on public.community_mod_installs;
create policy "Server admins update community mods" on public.community_mod_installs for update to authenticated using (public.community_has_role(server_id,array['owner','admin'])) with check (public.community_has_role(server_id,array['owner','admin']));
drop policy if exists "Server admins uninstall community mods" on public.community_mod_installs;
create policy "Server admins uninstall community mods" on public.community_mod_installs for delete to authenticated using (public.community_has_role(server_id,array['owner','admin']));
grant select,insert,update,delete on public.community_mod_installs to authenticated;

create table if not exists public.community_member_levels (
 server_id uuid not null references public.community_servers(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 xp integer not null default 0 check (xp>=0),
 level integer not null default 1 check (level>=1),
 last_xp_at timestamptz,
 updated_at timestamptz not null default now(),
 primary key(server_id,user_id)
);
alter table public.community_member_levels enable row level security;
drop policy if exists "Members view server levels" on public.community_member_levels;
create policy "Members view server levels" on public.community_member_levels for select to authenticated using (public.community_is_member(server_id));
grant select on public.community_member_levels to authenticated;
revoke insert,update,delete on public.community_member_levels from anon,authenticated;

create table if not exists public.community_mod_events (
 id bigint generated always as identity primary key,
 server_id uuid not null references public.community_servers(id) on delete cascade,
 mod_key text not null,
 event_type text not null,
 user_id uuid references auth.users(id) on delete set null,
 payload jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);
alter table public.community_mod_events enable row level security;
drop policy if exists "Server admins view mod events" on public.community_mod_events;
create policy "Server admins view mod events" on public.community_mod_events for select to authenticated using (public.community_has_role(server_id,array['owner','admin','moderator']));
grant select on public.community_mod_events to authenticated;
revoke insert,update,delete on public.community_mod_events from anon,authenticated;

create or replace function public.community_mod_guard_message()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare v_server uuid; v_settings jsonb; v_window integer; v_limit integer; v_count integer;
begin
 select server_id into v_server from public.community_channels where id=new.channel_id;
 select settings into v_settings from public.community_mod_installs where server_id=v_server and mod_key='anti_spam' and enabled=true;
 if not found then return new; end if;
 v_window:=greatest(5,least(60,coalesce((v_settings->>'window_seconds')::integer,10)));
 v_limit:=greatest(2,least(20,coalesce((v_settings->>'max_messages')::integer,5)));
 if exists(select 1 from public.community_messages where channel_id=new.channel_id and author_id=new.author_id and body=new.body and created_at>now()-make_interval(secs=>v_window)) then raise exception 'MOD: Ижил мессежийг дахин дахин илгээх боломжгүй.'; end if;
 select count(*) into v_count from public.community_messages where channel_id=new.channel_id and author_id=new.author_id and created_at>now()-make_interval(secs=>v_window);
 if v_count>=v_limit then raise exception 'MOD: Та хэт хурдан мессеж илгээж байна. Түр хүлээнэ үү.'; end if;
 return new;
end $$;
revoke all on function public.community_mod_guard_message() from public,anon,authenticated;
drop trigger if exists trg_community_mod_guard_message on public.community_messages;
create trigger trg_community_mod_guard_message before insert on public.community_messages for each row execute function public.community_mod_guard_message();

create or replace function public.community_mod_award_xp()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare v_server uuid; v_settings jsonb; v_xp integer;
begin
 select server_id into v_server from public.community_channels where id=new.channel_id;
 select settings into v_settings from public.community_mod_installs where server_id=v_server and mod_key='leveling' and enabled=true;
 if not found then return new; end if;
 v_xp:=greatest(1,least(100,coalesce((v_settings->>'xp_per_message')::integer,10)));
 insert into public.community_member_levels(server_id,user_id,xp,level,last_xp_at) values(v_server,new.author_id,v_xp,1,now())
 on conflict(server_id,user_id) do update set xp=public.community_member_levels.xp+excluded.xp,level=floor(sqrt((public.community_member_levels.xp+excluded.xp)::numeric/100))::integer+1,last_xp_at=now(),updated_at=now()
 where public.community_member_levels.last_xp_at is null or public.community_member_levels.last_xp_at<now()-interval '60 seconds';
 return new;
end $$;
revoke all on function public.community_mod_award_xp() from public,anon,authenticated;
drop trigger if exists trg_community_mod_award_xp on public.community_messages;
create trigger trg_community_mod_award_xp after insert on public.community_messages for each row execute function public.community_mod_award_xp();

create or replace function public.community_mod_welcome_event()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if exists(select 1 from public.community_mod_installs where server_id=new.server_id and mod_key='welcome' and enabled=true) then
  insert into public.community_mod_events(server_id,mod_key,event_type,user_id,payload) values(new.server_id,'welcome','member_joined',new.user_id,jsonb_build_object('role',new.role));
 end if;
 return new;
end $$;
revoke all on function public.community_mod_welcome_event() from public,anon,authenticated;
drop trigger if exists trg_community_mod_welcome_event on public.community_server_members;
create trigger trg_community_mod_welcome_event after insert on public.community_server_members for each row execute function public.community_mod_welcome_event();