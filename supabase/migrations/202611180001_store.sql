-- Extend the existing LORE COIN economy; do not create a second wallet.
alter table public.lore_coin_items add column if not exists icon text not null default '✦';
alter table public.lore_coin_items add column if not exists sort_order integer not null default 100;

create table if not exists public.store_equipped (
  user_id uuid not null references auth.users(id) on delete cascade,
  slot text not null check (slot in ('avatar','frame','badge','background')),
  item_id text not null references public.lore_coin_items(id) on delete cascade,
  updated_at timestamptz not null default now(),
  primary key (user_id,slot)
);
alter table public.store_equipped enable row level security;
drop policy if exists "users read own equipped items" on public.store_equipped;
create policy "users read own equipped items" on public.store_equipped for select to authenticated using (auth.uid()=user_id);

create or replace function public.store_equip(p_item_id text)
returns boolean language plpgsql security definer set search_path=public,auth as $$
declare uid uuid:=auth.uid(); item public.lore_coin_items%rowtype; slot_name text;
begin
  if uid is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false) then
    raise exception 'Бүртгэлтэй аккаунтаараа нэвтэрнэ үү';
  end if;
  select * into item from public.lore_coin_items where id=p_item_id and enabled=true;
  if not found then raise exception 'Бараа олдсонгүй'; end if;
  if not exists(select 1 from public.user_reward_inventory where user_id=uid and item_id=p_item_id and status='active') then
    raise exception 'Энэ бараа таны цуглуулгад байхгүй байна';
  end if;
  slot_name:=case item.item_type when 'avatar' then 'avatar' when 'profile_frame' then 'frame' when 'badge' then 'badge' when 'profile_background' then 'background' else null end;
  if slot_name is null then raise exception 'Энэ барааг тоноглох боломжгүй'; end if;
  insert into public.store_equipped(user_id,slot,item_id) values(uid,slot_name,p_item_id)
  on conflict(user_id,slot) do update set item_id=excluded.item_id,updated_at=now();
  return true;
end; $$;
grant select on public.store_equipped to authenticated;
grant execute on function public.store_equip(text) to authenticated;

insert into public.lore_coin_items(id,name,description,coin_cost,item_type,enabled,icon,sort_order) values
('store-aurora-frame','Aurora хүрээ','Профайлд гэрэлтсэн туяа нэмнэ.',300,'profile_frame',true,'🌌',10),
('store-void-frame','Void хүрээ','Харанхуй ертөнцийн минимал хүрээ.',350,'profile_frame',true,'🪐',20),
('store-star-badge','Star badge','Нэрийн хажууд харагдах одон тэмдэг.',180,'badge',true,'⭐',30),
('store-moon-badge','Moon badge','Сарны тэмдэгтэй профайлын чимэглэл.',180,'badge',true,'🌙',40),
('store-neon-background','Neon profile','Профайлын арын дэвсгэрийн эффект.',450,'profile_background',true,'🌃',50),
('store-chibi-avatar','Chibi avatar','Өхөөрдөм chibi төрлийн аватарын дүрс.',350,'avatar',true,'🦊',60),
('store-lore-sticker-pack','Lore sticker pack','Чатад ашиглах lore сэдэвт стикерийн багц.',120,'sticker_pack',true,'✨',70)
on conflict(id) do nothing;
