revoke all on table public.direct_messages from anon;
revoke insert, update on table public.direct_messages from authenticated;
grant select on table public.direct_messages to authenticated;
grant insert (conversation_id,sender_id,body) on table public.direct_messages to authenticated;
grant update (read_at) on table public.direct_messages to authenticated;