-- Make user-attributed audit references nullable so account deletion can
-- preserve moderation/review history while removing the account.
do $$
declare
  item record;
begin
  for item in
    select n.nspname as schema_name,
           c.relname as table_name,
           a.attname as column_name,
           k.conname as constraint_name
    from pg_constraint k
    join pg_class c on c.oid = k.conrelid
    join pg_namespace n on n.oid = c.relnamespace
    join pg_attribute a on a.attrelid = c.oid and a.attnum = any(k.conkey)
    where k.contype = 'f'
      and k.confrelid = 'auth.users'::regclass
      and (n.nspname, c.relname, a.attname) in (
        ('public','advertisement_requests','reviewed_by'),
        ('public','bug_reports','reviewed_by'),
        ('public','chat_messages','deleted_by'),
        ('public','chat_moderation','moderator_id'),
        ('public','community_channels','created_by'),
        ('public','community_invites','created_by')
      )
  loop
    execute format('alter table %I.%I alter column %I drop not null',
      item.schema_name, item.table_name, item.column_name);
    execute format('alter table %I.%I drop constraint %I',
      item.schema_name, item.table_name, item.constraint_name);
    execute format(
      'alter table %I.%I add constraint %I foreign key (%I) references auth.users(id) on delete set null',
      item.schema_name, item.table_name, item.constraint_name, item.column_name
    );
  end loop;
end $$;
