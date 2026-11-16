-- Require a registered account (not an anonymous Auth session) for social actions.
drop policy if exists "Members create own community posts" on public.community_posts;
create policy "Members create own community posts" on public.community_posts for insert to authenticated
with check(author_id=(select auth.uid()) and status='published' and coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false)=false);
drop policy if exists "Authors and moderators update community posts" on public.community_posts;
create policy "Authors and moderators update community posts" on public.community_posts for update to authenticated
using((author_id=(select auth.uid()) and coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false)=false) or public.is_staff(array['owner','admin','moderator']))
with check((author_id=(select auth.uid()) and coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false)=false) or public.is_staff(array['owner','admin','moderator']));
drop policy if exists "Authors and moderators delete community posts" on public.community_posts;
create policy "Authors and moderators delete community posts" on public.community_posts for delete to authenticated
using((author_id=(select auth.uid()) and coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false)=false) or public.is_staff(array['owner','admin','moderator']));
drop policy if exists "Authors add post media" on public.community_post_media;
create policy "Authors add post media" on public.community_post_media for insert to authenticated
with check(author_id=(select auth.uid()) and coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false)=false and exists(select 1 from public.community_posts p where p.id=post_id and p.author_id=(select auth.uid())));
drop policy if exists "Users add own post likes" on public.community_post_likes;
create policy "Users add own post likes" on public.community_post_likes for insert to authenticated
with check(user_id=(select auth.uid()) and coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false)=false);
drop policy if exists "Users remove own post likes" on public.community_post_likes;
create policy "Users remove own post likes" on public.community_post_likes for delete to authenticated
using(user_id=(select auth.uid()) and coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false)=false);
drop policy if exists "Users create own post comments" on public.community_post_comments;
create policy "Users create own post comments" on public.community_post_comments for insert to authenticated
with check(author_id=(select auth.uid()) and status='published' and coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false)=false);
drop policy if exists "Users follow from own account" on public.community_follows;
create policy "Users follow from own account" on public.community_follows for insert to authenticated
with check(follower_id=(select auth.uid()) and coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false)=false);
drop policy if exists "Users unfollow from own account" on public.community_follows;
create policy "Users unfollow from own account" on public.community_follows for delete to authenticated
using(follower_id=(select auth.uid()) and coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false)=false);
drop policy if exists "Users upload own community media" on storage.objects;
create policy "Users upload own community media" on storage.objects for insert to authenticated
with check(bucket_id='community-media' and (storage.foldername(name))[1]=(select auth.uid())::text and coalesce((select (auth.jwt()->>'is_anonymous')::boolean),false)=false);
