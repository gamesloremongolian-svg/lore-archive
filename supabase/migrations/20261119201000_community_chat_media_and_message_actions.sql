insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('community-chat-media','community-chat-media',true,10485760,array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public=true,file_size_limit=10485760,allowed_mime_types=array['image/jpeg','image/png','image/webp','image/gif'];

drop policy if exists "Community chat members upload own files" on storage.objects;
create policy "Community chat members upload own files"
on storage.objects for insert to authenticated
with check (
 bucket_id='community-chat-media'
 and (storage.foldername(name))[1]=(select auth.uid()::text)
 and exists (
   select 1 from public.community_channels c
   where c.id::text=(storage.foldername(name))[3]
     and public.community_is_member(c.server_id)
 )
 and coalesce((select auth.jwt()->>'is_anonymous')::boolean,false)=false
);

drop policy if exists "Community chat users delete own files" on storage.objects;
create policy "Community chat users delete own files"
on storage.objects for delete to authenticated
using (
 bucket_id='community-chat-media'
 and (storage.foldername(name))[1]=(select auth.uid()::text)
);

drop policy if exists "Community chat members read uploads" on storage.objects;
create policy "Community chat members read uploads"
on storage.objects for select to public
using (bucket_id='community-chat-media');

grant select,insert,update,delete on public.community_messages to authenticated;