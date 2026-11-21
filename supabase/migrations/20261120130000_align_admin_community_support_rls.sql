-- Align production RLS with the admin UI role matrix.
-- Editors retain editorial/feedback access but cannot moderate chat or handle support tickets.

drop policy if exists "Staff moderate chat messages" on public.chat_messages;
create policy "Staff moderate chat messages" on public.chat_messages
  for update to authenticated
  using (public.is_staff(array['owner','admin']))
  with check (public.is_staff(array['owner','admin']));

drop policy if exists "Staff manage chat moderation" on public.chat_moderation;
create policy "Staff manage chat moderation" on public.chat_moderation
  for all to authenticated
  using (public.is_staff(array['owner','admin']))
  with check (public.is_staff(array['owner','admin']));

drop policy if exists "Staff update reports" on public.chat_reports;
create policy "Staff update reports" on public.chat_reports
  for update to authenticated
  using (public.is_staff(array['owner','admin']))
  with check (public.is_staff(array['owner','admin']));

drop policy if exists "Users read own reports and staff read all" on public.chat_reports;
create policy "Users read own reports and staff read all" on public.chat_reports
  for select to authenticated
  using (reporter_id = (select auth.uid()) or public.is_staff(array['owner','admin']));

drop policy if exists "Staff update support tickets" on public.support_tickets;
create policy "Staff update support tickets" on public.support_tickets
  for update to authenticated
  using (public.is_staff(array['owner','admin']))
  with check (public.is_staff(array['owner','admin']));

drop policy if exists "Users read own support tickets" on public.support_tickets;
create policy "Users read own support tickets" on public.support_tickets
  for select to authenticated
  using (user_id = (select auth.uid()) or public.is_staff(array['owner','admin']));

drop policy if exists "Ticket participants read replies" on public.support_ticket_replies;
create policy "Ticket participants read replies" on public.support_ticket_replies
  for select to authenticated
  using (
    exists (
      select 1 from public.support_tickets t
      where t.id = support_ticket_replies.ticket_id
        and (
          t.user_id = (select auth.uid())
          or public.is_staff(array['owner','admin'])
        )
    )
  );

drop policy if exists "Staff reply to tickets" on public.support_ticket_replies;
create policy "Staff reply to tickets" on public.support_ticket_replies
  for insert to authenticated
  with check (
    sender_id = (select auth.uid())
    and is_staff = true
    and public.is_staff(array['owner','admin'])
  );
