-- Restrict account-specific SECURITY DEFINER RPCs to authenticated users.
-- These routines require auth.uid() and must not be callable by anonymous visitors.
revoke execute on function public.community_is_member(uuid) from public, anon;
revoke execute on function public.list_friend_requests() from public, anon;
revoke execute on function public.list_my_friends() from public, anon;
revoke execute on function public.respond_friend_request(uuid, boolean) from public, anon;
revoke execute on function public.send_friend_request(uuid) from public, anon;
revoke execute on function public.store_equip(text) from public, anon;

grant execute on function public.community_is_member(uuid) to authenticated;
grant execute on function public.list_friend_requests() to authenticated;
grant execute on function public.list_my_friends() to authenticated;
grant execute on function public.respond_friend_request(uuid, boolean) to authenticated;
grant execute on function public.send_friend_request(uuid) to authenticated;
grant execute on function public.store_equip(text) to authenticated;
