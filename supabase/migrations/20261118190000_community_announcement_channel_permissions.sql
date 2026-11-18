-- Announcement channels are read-only for regular members.
drop policy if exists "Members can send channel messages" on public.community_messages;

create policy "Members can send channel messages"
on public.community_messages
for insert
to authenticated
with check (
  author_id = (select auth.uid())
  and public.community_can_read_channel(channel_id)
  and exists (
    select 1
    from public.community_channels c
    where c.id = community_messages.channel_id
      and (
        c.channel_type <> 'announcement'
        or public.community_has_role(c.server_id, array['owner','admin','moderator'])
      )
  )
);
