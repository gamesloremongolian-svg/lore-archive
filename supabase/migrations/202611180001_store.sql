-- LOREVERSE Store: shared account wallet and cosmetic inventory
create table if not exists public.store_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  category text not null check (category in ('avatar','frame','badge','background','sticker')),
  icon text not null default '✦',
  price bigint not null check (price >= 0),
  active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists public.store_wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance bigint not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.store_ledger (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount bigint not null,
  reason text not null,
  reference_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.store_inventory (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id uuid not null references public.store_items(id) on delete cascade,
  purchased_at timestamptz not null default now(),
  primary key (user_id,item_id)
);

create table if not exists public.store_equipped (
  user_id uuid not null references auth.users(id) on delete cascade,
  slot text not null check (slot in ('avatar','frame','badge','background')),
  item_id uuid not null references public.store_items(id) on delete cascade,
  updated_at timestamptz not null default now(),
  primary key (user_id,slot)
);

alter table public.store_items enable row level security;
alter table public.store_wallets enable row level security;
alter table public.store_ledger enable row level security;
alter table public.store_inventory enable row level security;
alter table public.store_equipped enable row level security;

drop policy if exists "store active catalog is public" on public.store_items;
create policy "store active catalog is public" on public.store_items for select using (active);
drop policy if exists "users read own wallet" on public.store_wallets;
create policy "users read own wallet" on public.store_wallets for select to authenticated using (auth.uid() = user_id);
drop policy if exists "users read own ledger" on public.store_ledger;
create policy "users read own ledger" on public.store_ledger for select to authenticated using (auth.uid() = user_id);
drop policy if exists "users read own inventory" on public.store_inventory;
create policy "users read own inventory" on public.store_inventory for select to authenticated using (auth.uid() = user_id);
drop policy if exists "users read own equipped items" on public.store_equipped;
create policy "users read own equipped items" on public.store_equipped for select to authenticated using (auth.uid() = user_id);

create or replace function public.store_get_wallet()
returns bigint language plpgsql security definer set search_path=public,auth as $$
declare uid uuid := auth.uid(); bal bigint;
begin
  if uid is null then raise exception 'Нэвтэрнэ үү'; end if;
  insert into public.store_wallets(user_id,balance) values(uid,100)
  on conflict(user_id) do nothing;
  if not exists(select 1 from public.store_ledger where user_id=uid) then
    insert into public.store_ledger(user_id,amount,reason) values(uid,100,'welcome_bonus');
  end if;
  select balance into bal from public.store_wallets where user_id=uid;
  return bal;
end; $$;

create or replace function public.store_purchase(p_item_id uuid)
returns bigint language plpgsql security definer set search_path=public,auth as $$
declare uid uuid := auth.uid(); item public.store_items%rowtype; bal bigint;
begin
  if uid is null then raise exception 'Нэвтэрнэ үү'; end if;
  select * into item from public.store_items where id=p_item_id and active=true;
  if not found then raise exception 'Бараа олдсонгүй'; end if;
  insert into public.store_wallets(user_id,balance) values(uid,100) on conflict(user_id) do nothing;
  select balance into bal from public.store_wallets where user_id=uid for update;
  if exists(select 1 from public.store_inventory where user_id=uid and item_id=p_item_id) then
    raise exception 'Та энэ барааг аль хэдийн эзэмшиж байна';
  end if;
  if bal < item.price then raise exception 'LORE COIN хүрэлцэхгүй байна'; end if;
  update public.store_wallets set balance=balance-item.price,updated_at=now() where user_id=uid returning balance into bal;
  insert into public.store_inventory(user_id,item_id) values(uid,p_item_id);
  insert into public.store_ledger(user_id,amount,reason,reference_id) values(uid,-item.price,'purchase',p_item_id);
  return bal;
end; $$;

create or replace function public.store_equip(p_item_id uuid)
returns boolean language plpgsql security definer set search_path=public,auth as $$
declare uid uuid := auth.uid(); item public.store_items%rowtype; slot_name text;
begin
  if uid is null then raise exception 'Нэвтэрнэ үү'; end if;
  select * into item from public.store_items where id=p_item_id and active=true;
  if not found then raise exception 'Бараа олдсонгүй'; end if;
  if not exists(select 1 from public.store_inventory where user_id=uid and item_id=p_item_id) then
    raise exception 'Энэ бараа таны цуглуулгад байхгүй байна';
  end if;
  if item.category not in ('avatar','frame','badge','background') then raise exception 'Энэ төрлийн барааг одоогоор тоноглох боломжгүй'; end if;
  slot_name := item.category;
  insert into public.store_equipped(user_id,slot,item_id) values(uid,slot_name,p_item_id)
  on conflict(user_id,slot) do update set item_id=excluded.item_id,updated_at=now();
  return true;
end; $$;

grant select on public.store_items to anon,authenticated;
grant select on public.store_wallets,public.store_ledger,public.store_inventory,public.store_equipped to authenticated;
grant execute on function public.store_get_wallet() to authenticated;
grant execute on function public.store_purchase(uuid) to authenticated;
grant execute on function public.store_equip(uuid) to authenticated;

insert into public.store_items(slug,name,description,category,icon,price,sort_order) values
('aurora-frame','Aurora хүрээ','Профайлд гэрэлтсэн туяа нэмнэ.','frame','🌌',60,1),
('void-frame','Void хүрээ','Харанхуй ертөнцийн минимал хүрээ.','frame','🪐',80,2),
('star-badge','Star badge','Таны нэрийн хажууд харагдах одон тэмдэг.','badge','⭐',45,3),
('moon-badge','Moon badge','Сарны тэмдэгтэй профайлын чимэглэл.','badge','🌙',45,4),
('neon-background','Neon profile','Профайлын арын дэвсгэрийн эффект.','background','🌃',100,5),
('chibi-avatar','Chibi avatar','Өхөөрдөм chibi төрлийн аватарын дүрс.','avatar','🦊',75,6),
('lore-sticker-pack','Lore sticker pack','Чатад ашиглах lore сэдэвт стикерийн багц.','sticker','✨',35,7)
on conflict(slug) do nothing;
