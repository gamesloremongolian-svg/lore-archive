
-- Hybrid Global + Game-specific Community Feed
create table if not exists public.community_posts (
 id uuid primary key default gen_random_uuid(),
 author_id uuid not null references auth.users(id) on delete cascade,
 game_slug text not null default 'general',
 category text not null default 'discussion' check (category in ('discussion','news','question','guide','fanart','event')),
 body text not null check (char_length(body) between 1 and 5000),
 spoiler_level text not null default 'none' check (spoiler_level in ('none','minor','major')),
 status text not null default 'published' check (status in ('published','hidden','removed')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.community_post_media (
 id uuid primary key default gen_random_uuid(), post_id uuid not null references public.community_posts(id) on delete cascade,
 author_id uuid not null references auth.users(id) on delete cascade, media_url text not null,
 media_type text not null default 'image' check (media_type in ('image','video')), created_at timestamptz not null default now()
);
create table if not exists public.community_post_likes (
 post_id uuid not null references public.community_posts(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade, created_at timestamptz not null default now(),
 primary key(post_id,user_id)
);
create table if not exists public.community_post_comments (
 id uuid primary key default gen_random_uuid(), post_id uuid not null references public.community_posts(id) on delete cascade,
 author_id uuid not null references auth.users(id) on delete cascade,
 body text not null check(char_length(body) between 1 and 1500),
 status text not null default 'published' check(status in ('published','hidden','removed')), created_at timestamptz not null default now()
);
create table if not exists public.community_follows (
 follower_id uuid not null references auth.users(id) on delete cascade,
 followed_id uuid not null references auth.users(id) on delete cascade, created_at timestamptz not null default now(),
 primary key(follower_id,followed_id), check(follower_id <> followed_id)
);
create index if not exists community_posts_feed_idx on public.community_posts(status,created_at desc);
create index if not exists community_posts_game_idx on public.community_posts(game_slug,status,created_at desc);
create index if not exists community_post_comments_post_idx on public.community_post_comments(post_id,created_at);
create index if not exists community_follows_followed_idx on public.community_follows(followed_id);
alter table public.community_posts enable row level security;
alter table public.community_post_media enable row level security;
alter table public.community_post_likes enable row level security;
alter table public.community_post_comments enable row level security;
alter table public.community_follows enable row level security;
grant select on public.community_posts,public.community_post_media,public.community_post_likes,public.community_post_comments,public.community_follows to anon,authenticated;
grant insert,update,delete on public.community_posts,public.community_post_media,public.community_post_likes,public.community_post_comments,public.community_follows to authenticated;
create policy "Public reads published community posts" on public.community_posts for select to anon,authenticated using(status='published' or author_id=(select auth.uid()) or public.is_staff(array['owner','admin','moderator']));
create policy "Members create own community posts" on public.community_posts for insert to authenticated with check(author_id=(select auth.uid()) and status='published');
create policy "Authors and moderators update community posts" on public.community_posts for update to authenticated using(author_id=(select auth.uid()) or public.is_staff(array['owner','admin','moderator'])) with check(author_id=(select auth.uid()) or public.is_staff(array['owner','admin','moderator']));
create policy "Authors and moderators delete community posts" on public.community_posts for delete to authenticated using(author_id=(select auth.uid()) or public.is_staff(array['owner','admin','moderator']));
create policy "Public reads community post media" on public.community_post_media for select to anon,authenticated using(exists(select 1 from public.community_posts p where p.id=post_id and (p.status='published' or p.author_id=(select auth.uid()) or public.is_staff(array['owner','admin','moderator']))));
create policy "Authors add post media" on public.community_post_media for insert to authenticated with check(author_id=(select auth.uid()) and exists(select 1 from public.community_posts p where p.id=post_id and p.author_id=(select auth.uid())));
create policy "Authors remove post media" on public.community_post_media for delete to authenticated using(author_id=(select auth.uid()) or public.is_staff(array['owner','admin','moderator']));
create policy "Public reads post likes" on public.community_post_likes for select to anon,authenticated using(true);
create policy "Users add own post likes" on public.community_post_likes for insert to authenticated with check(user_id=(select auth.uid()));
create policy "Users remove own post likes" on public.community_post_likes for delete to authenticated using(user_id=(select auth.uid()));
create policy "Public reads published post comments" on public.community_post_comments for select to anon,authenticated using(status='published' or author_id=(select auth.uid()) or public.is_staff(array['owner','admin','moderator']));
create policy "Users create own post comments" on public.community_post_comments for insert to authenticated with check(author_id=(select auth.uid()) and status='published');
create policy "Authors and moderators delete comments" on public.community_post_comments for delete to authenticated using(author_id=(select auth.uid()) or public.is_staff(array['owner','admin','moderator']));
create policy "Public reads follows" on public.community_follows for select to anon,authenticated using(true);
create policy "Users follow from own account" on public.community_follows for insert to authenticated with check(follower_id=(select auth.uid()));
create policy "Users unfollow from own account" on public.community_follows for delete to authenticated using(follower_id=(select auth.uid()));
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('community-media','community-media',true,15728640,array['image/jpeg','image/png','image/webp','image/gif'])
on conflict(id) do update set public=true,file_size_limit=15728640,allowed_mime_types=array['image/jpeg','image/png','image/webp','image/gif'];
create policy "Public reads community media" on storage.objects for select to anon,authenticated using(bucket_id='community-media');
create policy "Users upload own community media" on storage.objects for insert to authenticated with check(bucket_id='community-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "Users delete own community media" on storage.objects for delete to authenticated using(bucket_id='community-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
