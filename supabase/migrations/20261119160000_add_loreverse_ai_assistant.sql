-- LOREVERSE AI assistant: guest quota and private signed-in conversation history.
create table if not exists public.lore_ai_guest_usage (
  fingerprint text not null,
  usage_date date not null default (timezone('Asia/Ulaanbaatar', now()))::date,
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (fingerprint, usage_date)
);
alter table public.lore_ai_guest_usage enable row level security;
revoke all on public.lore_ai_guest_usage from public, anon, authenticated;
grant all on public.lore_ai_guest_usage to service_role;

create or replace function public.consume_lore_ai_guest_quota(p_fingerprint text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare v_count integer;
begin
  if p_fingerprint is null or length(p_fingerprint) < 32 or length(p_fingerprint) > 128 then
    raise exception 'Invalid fingerprint';
  end if;
  insert into public.lore_ai_guest_usage(fingerprint, usage_date, request_count)
  values (p_fingerprint, (timezone('Asia/Ulaanbaatar', now()))::date, 1)
  on conflict (fingerprint, usage_date) do update
    set request_count = public.lore_ai_guest_usage.request_count + 1, updated_at = now()
    where public.lore_ai_guest_usage.request_count < 3
  returning request_count into v_count;
  if v_count is null then return jsonb_build_object('allowed', false, 'limit', 3); end if;
  return jsonb_build_object('allowed', true, 'remaining', 3 - v_count, 'limit', 3);
end;
$$;
revoke all on function public.consume_lore_ai_guest_quota(text) from public, anon, authenticated;
grant execute on function public.consume_lore_ai_guest_quota(text) to service_role;

create table if not exists public.lore_ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Шинэ яриа' check (char_length(title) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.lore_ai_conversations enable row level security;
drop policy if exists "Users manage own AI conversations" on public.lore_ai_conversations;
create policy "Users manage own AI conversations" on public.lore_ai_conversations
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
grant select, insert, update, delete on public.lore_ai_conversations to authenticated;

create table if not exists public.lore_ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.lore_ai_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null check (char_length(content) between 1 and 12000),
  sources jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists lore_ai_messages_conversation_created_idx
  on public.lore_ai_messages(conversation_id, created_at);
alter table public.lore_ai_messages enable row level security;
drop policy if exists "Users manage own AI messages" on public.lore_ai_messages;
create policy "Users manage own AI messages" on public.lore_ai_messages
for all to authenticated
using ((select auth.uid()) = user_id and exists (
  select 1 from public.lore_ai_conversations c
  where c.id = conversation_id and c.user_id = (select auth.uid())
))
with check ((select auth.uid()) = user_id and exists (
  select 1 from public.lore_ai_conversations c
  where c.id = conversation_id and c.user_id = (select auth.uid())
));
grant select, insert, delete on public.lore_ai_messages to authenticated;
