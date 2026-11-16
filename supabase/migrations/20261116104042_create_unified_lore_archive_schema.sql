-- Applied to Supabase project on 2026-11-16 as create_unified_lore_archive_schema.
-- Additive schema: does not alter existing Loreverse tables.
create table if not exists public.archive_franchises (
 id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null,
 category text not null check (category in ('game','anime','manga','light_novel','web_novel','mixed')),
 description text not null default '', cover_image_url text,
 status text not null default 'draft' check (status in ('draft','review','published','archived')),
 created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.archive_works (
 id uuid primary key default gen_random_uuid(), franchise_id uuid references public.archive_franchises(id) on delete set null,
 slug text not null unique, work_type text not null check (work_type in ('game','anime','manga','light_novel','web_novel','visual_novel','other')),
 canonical_title text not null, release_year integer check (release_year between 1800 and 2200),
 external_ids jsonb not null default '{}'::jsonb, status text not null default 'draft' check (status in ('draft','review','published','archived')),
 created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.archive_work_translations (
 id uuid primary key default gen_random_uuid(), work_id uuid not null references public.archive_works(id) on delete cascade,
 language_code text not null check (language_code in ('mn','en','ja','ko')), title text not null, synopsis text not null default '',
 content jsonb not null default '{}'::jsonb, editorial_status text not null default 'draft' check (editorial_status in ('draft','review','published','archived')),
 canon_status text not null default 'unknown' check (canon_status in ('canon','non_canon','theory','unknown')),
 spoiler_level text not null default 'none' check (spoiler_level in ('none','minor','major','full')), sources jsonb not null default '[]'::jsonb,
 translated_from text check (translated_from is null or translated_from in ('mn','en','ja','ko')),
 author_id uuid references auth.users(id) on delete set null, reviewer_id uuid references auth.users(id) on delete set null,
 published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(work_id,language_code)
);
create table if not exists public.archive_entities (
 id uuid primary key default gen_random_uuid(), franchise_id uuid references public.archive_franchises(id) on delete cascade,
 work_id uuid references public.archive_works(id) on delete cascade,
 entity_type text not null check (entity_type in ('character','location','faction','item','species','concept','other')),
 slug text not null, canonical_name text not null, metadata jsonb not null default '{}'::jsonb,
 status text not null default 'draft' check (status in ('draft','review','published','archived')),
 created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(franchise_id,work_id,entity_type,slug), check(franchise_id is not null or work_id is not null)
);
create table if not exists public.archive_entity_translations (
 id uuid primary key default gen_random_uuid(), entity_id uuid not null references public.archive_entities(id) on delete cascade,
 language_code text not null check (language_code in ('mn','en','ja','ko')), display_name text not null, description text not null default '',
 content jsonb not null default '{}'::jsonb, editorial_status text not null default 'draft' check (editorial_status in ('draft','review','published','archived')),
 sources jsonb not null default '[]'::jsonb, author_id uuid references auth.users(id) on delete set null, reviewer_id uuid references auth.users(id) on delete set null,
 published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(entity_id,language_code)
);
create table if not exists public.archive_entity_relations (
 id uuid primary key default gen_random_uuid(), from_entity_id uuid not null references public.archive_entities(id) on delete cascade,
 to_entity_id uuid not null references public.archive_entities(id) on delete cascade, relation_type text not null, description text not null default '',
 status text not null default 'draft' check (status in ('draft','review','published','archived')),
 created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(),
 check(from_entity_id <> to_entity_id), unique(from_entity_id,to_entity_id,relation_type)
);
create table if not exists public.archive_timeline_events (
 id uuid primary key default gen_random_uuid(), work_id uuid not null references public.archive_works(id) on delete cascade,
 event_key text not null, sort_order integer not null default 0, in_universe_date text,
 spoiler_level text not null default 'none' check (spoiler_level in ('none','minor','major','full')),
 metadata jsonb not null default '{}'::jsonb, status text not null default 'draft' check (status in ('draft','review','published','archived')),
 created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(work_id,event_key)
);
create table if not exists public.archive_timeline_translations (
 id uuid primary key default gen_random_uuid(), event_id uuid not null references public.archive_timeline_events(id) on delete cascade,
 language_code text not null check (language_code in ('mn','en','ja','ko')), title text not null, summary text not null default '',
 content jsonb not null default '{}'::jsonb, editorial_status text not null default 'draft' check (editorial_status in ('draft','review','published','archived')),
 sources jsonb not null default '[]'::jsonb, author_id uuid references auth.users(id) on delete set null, reviewer_id uuid references auth.users(id) on delete set null,
 published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(event_id,language_code)
);
create index if not exists archive_works_franchise_idx on public.archive_works(franchise_id);
create index if not exists archive_work_translations_lang_status_idx on public.archive_work_translations(language_code,editorial_status);
create index if not exists archive_entities_franchise_idx on public.archive_entities(franchise_id);
create index if not exists archive_entities_work_idx on public.archive_entities(work_id);
create index if not exists archive_entity_translations_lang_idx on public.archive_entity_translations(language_code,editorial_status);
create index if not exists archive_timeline_events_work_order_idx on public.archive_timeline_events(work_id,sort_order);
create index if not exists archive_timeline_translations_lang_idx on public.archive_timeline_translations(language_code,editorial_status);
do $$ declare t text; begin
 foreach t in array array['archive_franchises','archive_works','archive_work_translations','archive_entities','archive_entity_translations','archive_entity_relations','archive_timeline_events','archive_timeline_translations'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('grant select on public.%I to anon, authenticated',t);
  execute format('grant insert,update,delete on public.%I to authenticated',t);
 end loop;
end $$;
create policy "Public reads published franchises" on public.archive_franchises for select to anon,authenticated using(status='published' or public.is_staff());
create policy "Staff manages franchises" on public.archive_franchises for all to authenticated using(public.is_staff(array['owner','admin','editor'])) with check(public.is_staff(array['owner','admin','editor']));
create policy "Public reads published works" on public.archive_works for select to anon,authenticated using(status='published' or public.is_staff());
create policy "Staff manages works" on public.archive_works for all to authenticated using(public.is_staff(array['owner','admin','editor'])) with check(public.is_staff(array['owner','admin','editor']));
create policy "Public reads published work translations" on public.archive_work_translations for select to anon,authenticated using(editorial_status='published' or public.is_staff());
create policy "Staff manages work translations" on public.archive_work_translations for all to authenticated using(public.is_staff(array['owner','admin','editor'])) with check(public.is_staff(array['owner','admin','editor']));
create policy "Public reads published entities" on public.archive_entities for select to anon,authenticated using(status='published' or public.is_staff());
create policy "Staff manages entities" on public.archive_entities for all to authenticated using(public.is_staff(array['owner','admin','editor'])) with check(public.is_staff(array['owner','admin','editor']));
create policy "Public reads published entity translations" on public.archive_entity_translations for select to anon,authenticated using(editorial_status='published' or public.is_staff());
create policy "Staff manages entity translations" on public.archive_entity_translations for all to authenticated using(public.is_staff(array['owner','admin','editor'])) with check(public.is_staff(array['owner','admin','editor']));
create policy "Public reads published entity relations" on public.archive_entity_relations for select to anon,authenticated using(status='published' or public.is_staff());
create policy "Staff manages entity relations" on public.archive_entity_relations for all to authenticated using(public.is_staff(array['owner','admin','editor'])) with check(public.is_staff(array['owner','admin','editor']));
create policy "Public reads published timeline events" on public.archive_timeline_events for select to anon,authenticated using(status='published' or public.is_staff());
create policy "Staff manages timeline events" on public.archive_timeline_events for all to authenticated using(public.is_staff(array['owner','admin','editor'])) with check(public.is_staff(array['owner','admin','editor']));
create policy "Public reads published timeline translations" on public.archive_timeline_translations for select to anon,authenticated using(editorial_status='published' or public.is_staff());
create policy "Staff manages timeline translations" on public.archive_timeline_translations for all to authenticated using(public.is_staff(array['owner','admin','editor'])) with check(public.is_staff(array['owner','admin','editor']));
