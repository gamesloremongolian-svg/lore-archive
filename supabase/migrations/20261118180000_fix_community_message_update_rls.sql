-- Fix community message UPDATE authorization.
-- Authors must remain owners of their own message and retain access to the destination channel.
-- Moderators/admins/owners may moderate messages in channels they manage.
drop policy if exists "Authors and moderators can edit messages" on public.community_messages;

create policy "Authors and moderators can edit messages"
on public.community_messages
for update
to authenticated
using (
  author_id = (select auth.uid())
  or exists (
    select 1
    from public.community_channels c
    where c.id = community_messages.channel_id
      and public.community_has_role(c.server_id, array['owner','admin','moderator'])
  )
)
with check (
  (
    author_id = (select auth.uid())
    and public.community_can_read_channel(channel_id)
  )
  or exists (
    select 1
    from public.community_channels c
    where c.id = community_messages.channel_id
      and public.community_has_role(c.server_id, array['owner','admin','moderator'])
  )
);
