alter table public.direct_messages
  add column if not exists read_at timestamptz;
grant update (read_at) on public.direct_messages to authenticated;
drop policy if exists "Recipients mark direct messages as read" on public.direct_messages;
create policy "Recipients mark direct messages as read"
on public.direct_messages for update to authenticated
using (sender_id <> (select auth.uid()) and exists (
  select 1 from public.direct_conversations c where c.id=direct_messages.conversation_id
  and ((select auth.uid())=c.user_one or (select auth.uid())=c.user_two)
))
with check (sender_id <> (select auth.uid()) and read_at is not null and exists (
  select 1 from public.direct_conversations c where c.id=direct_messages.conversation_id
  and ((select auth.uid())=c.user_one or (select auth.uid())=c.user_two)
));

create or replace function public.notify_direct_message()
returns trigger language plpgsql security definer set search_path=''
as $$
declare v_recipient uuid; v_sender_name text;
begin
 select case when c.user_one=new.sender_id then c.user_two else c.user_one end into v_recipient
 from public.direct_conversations c where c.id=new.conversation_id
 and (c.user_one=new.sender_id or c.user_two=new.sender_id);
 if v_recipient is null then return new; end if;
 select coalesce(nullif(p.display_name,''),'LOREVERSE гишүүн') into v_sender_name
 from public.profiles p where p.id=new.sender_id;
 insert into public.user_notifications(user_id,title,body,notification_type,target_url)
 values(v_recipient,'Шинэ хувийн мессеж',coalesce(v_sender_name,'LOREVERSE гишүүн')||': '||left(new.body,120),
 'direct_message','/chat/?conversation='||new.conversation_id::text);
 return new;
end $$;
revoke all on function public.notify_direct_message() from public,anon,authenticated;
drop trigger if exists trg_notify_direct_message on public.direct_messages;
create trigger trg_notify_direct_message after insert on public.direct_messages
for each row execute function public.notify_direct_message();

create or replace function public.notify_friend_request()
returns trigger language plpgsql security definer set search_path=''
as $$
declare v_name text;
begin
 if tg_op='INSERT' then
  select coalesce(nullif(p.display_name,''),'LOREVERSE гишүүн') into v_name
  from public.profiles p where p.id=new.requester_id;
  insert into public.user_notifications(user_id,title,body,notification_type,target_url)
  values(new.addressee_id,'Найзын шинэ хүсэлт',coalesce(v_name,'LOREVERSE гишүүн')||' тантай найз болох хүсэлт илгээлээ.','friend_request','/profile/');
 elsif tg_op='UPDATE' and old.status is distinct from new.status and new.status='accepted' then
  select coalesce(nullif(p.display_name,''),'LOREVERSE гишүүн') into v_name
  from public.profiles p where p.id=new.addressee_id;
  insert into public.user_notifications(user_id,title,body,notification_type,target_url)
  values(new.requester_id,'Найзын хүсэлт зөвшөөрөгдлөө',coalesce(v_name,'LOREVERSE гишүүн')||' таны найзын хүсэлтийг зөвшөөрлөө.','friend_accepted','/profile/');
 end if;
 return new;
end $$;
revoke all on function public.notify_friend_request() from public,anon,authenticated;
drop trigger if exists trg_notify_friend_request on public.friend_requests;
create trigger trg_notify_friend_request after insert or update of status on public.friend_requests
for each row execute function public.notify_friend_request();

do $$
begin
 if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='user_notifications') then
  alter publication supabase_realtime add table public.user_notifications;
 end if;
 if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='friend_requests') then
  alter publication supabase_realtime add table public.friend_requests;
 end if;
end $$;