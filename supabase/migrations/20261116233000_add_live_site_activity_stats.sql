create or replace function public.get_loreverse_site_stats()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'total_visits', coalesce((select sum(page_views) from public.site_daily_stats), 0),
    'unique_visitors', coalesce((select sum(unique_visitors) from public.site_daily_stats), 0),
    'online_now', (select count(*) from public.site_presence where last_seen_at > now() - interval '5 minutes')
  );
$$;

create or replace function public.touch_loreverse_presence(p_session_id text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.site_presence
  set last_seen_at = now()
  where session_id = p_session_id
    and p_session_id ~ '^[A-Za-z0-9_-]{16,100}$';
$$;

revoke all on function public.get_loreverse_site_stats() from public;
revoke all on function public.touch_loreverse_presence(text) from public;
grant execute on function public.get_loreverse_site_stats() to anon, authenticated;
grant execute on function public.touch_loreverse_presence(text) to anon, authenticated;
