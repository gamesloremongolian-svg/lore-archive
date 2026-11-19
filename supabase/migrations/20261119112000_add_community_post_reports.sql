-- Community Feed reports: separate from chat message reports.
create table if not exists public.community_post_reports (
 id uuid primary key default gen_random_uuid(),
 post_id uuid not null references public.community_posts(id) on delete cascade,
 reporter_id uuid not null references auth.users(id) on delete cascade,
 reason text not null check (char_length(reason) between 3 and 500),
 status text not null default 'open' check (status in ('open','reviewed','dismissed')),
 created_at timestamptz not null default now(),
 reviewed_by uuid references auth.users(id),
 reviewed_at timestamptz,
 unique(post_id,reporter_id)
);
create index if not exists community_post_reports_status_idx on public.community_post_reports(status,created_at desc);
alter table public.community_post_reports enable row level security;
grant select,insert on public.community_post_reports to authenticated;
grant update on public.community_post_reports to authenticated;
create policy "Users submit own community post reports" on public.community_post_reports
 for insert to authenticated with check(reporter_id=(select auth.uid()) and status='open' and reviewed_by is null and reviewed_at is null);
create policy "Users read own community post reports and staff read all" on public.community_post_reports
 for select to authenticated using(reporter_id=(select auth.uid()) or public.is_staff(array['owner','admin','moderator']));
create policy "Staff review community post reports" on public.community_post_reports
 for update to authenticated using(public.is_staff(array['owner','admin','moderator']))
 with check(public.is_staff(array['owner','admin','moderator']) and status in ('reviewed','dismissed'));
