create or replace function public.community_join_public_server(p_server_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $function$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  if coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'Registered account required';
  end if;
  if not exists (select 1 from public.community_servers where id = p_server_id and is_public = true) then
    raise exception 'Public server not found';
  end if;
  insert into public.community_server_members(server_id,user_id,role)
  values (p_server_id,auth.uid(),'member')
  on conflict (server_id,user_id) do nothing;
  return p_server_id;
end
$function$;
revoke all on function public.community_join_public_server(uuid) from public, anon;
grant execute on function public.community_join_public_server(uuid) to authenticated;