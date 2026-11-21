-- Lore Coins are closed-loop engagement points, not money or a cash equivalent.
alter table public.lore_coin_items drop constraint if exists lore_coin_items_item_type_check;
alter table public.lore_coin_items add constraint lore_coin_items_item_type_check
check (item_type = any (array['profile_frame','badge','premium_discount','avatar','profile_background','sticker_pack','profile_effect','nameplate','chat_theme','emoji_pack','soundboard_pack','profile_card']));
update public.lore_coin_items set enabled=false where item_type='premium_discount';

create table if not exists public.lore_achievement_definitions (
  achievement_key text primary key,
  title text not null,
  description text not null default '',
  icon text not null default '✦',
  coin_reward integer not null default 0 check (coin_reward between 0 and 500),
  xp_reward integer not null default 0 check (xp_reward between 0 and 1000),
  achievement_group text not null default 'activity',
  enabled boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now()
);
create table if not exists public.lore_user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_key text not null references public.lore_achievement_definitions(achievement_key),
  claimed_at timestamptz not null default now(),
  unique(user_id, achievement_key)
);
alter table public.lore_achievement_definitions enable row level security;
alter table public.lore_user_achievements enable row level security;
drop policy if exists "Enabled achievements are public" on public.lore_achievement_definitions;
create policy "Enabled achievements are public" on public.lore_achievement_definitions for select to anon, authenticated using (enabled=true);
drop policy if exists "Users read own achievements" on public.lore_user_achievements;
create policy "Users read own achievements" on public.lore_user_achievements for select to authenticated using (user_id=auth.uid() or public.is_staff(array['owner','admin']::text[]));

insert into public.lore_achievement_definitions(achievement_key,title,description,icon,coin_reward,xp_reward,achievement_group,sort_order)
values
 ('daily_7_streak','7 өдрийн тууштай хэрэглэгч','7 өдөр дараалан өдөр тутмын урамшууллаа ав.','🔥',50,100,'streak',10),
 ('daily_30_checkins','Сарын идэвхтэн','Нийт 30 өдөр өдөр тутмын урамшууллаа ав.','🌙',120,250,'streak',20),
 ('bug_hunter_first','Bug Hunter I','Баталгаажсан эхний алдаагаа мэдээл.','🐞',25,50,'contribution',30),
 ('bug_hunter_5','Bug Hunter V','5 баталгаажсан алдаанд тусал.','🛡️',100,200,'contribution',40)
on conflict (achievement_key) do update set title=excluded.title,description=excluded.description,icon=excluded.icon,coin_reward=excluded.coin_reward,xp_reward=excluded.xp_reward,enabled=true,sort_order=excluded.sort_order;

insert into public.lore_coin_items(id,name,description,coin_cost,item_type,enabled,icon,sort_order,is_featured)
values
 ('profile-card-nebula','Nebula Profile Card','Профайлд харагдах сансрын сэдэвт карт.',700,'profile_card',true,'🌌',15,true),
 ('profile-card-sakura','Sakura Profile Card','Сакура цэцгийн уур амьсгалтай профайл карт.',650,'profile_card',true,'🌸',16,true),
 ('profile-card-void','Void Profile Card','Хар нил ягаан Void загвартай профайл карт.',850,'profile_card',true,'✦',17,false)
on conflict(id) do update set name=excluded.name,description=excluded.description,coin_cost=excluded.coin_cost,item_type=excluded.item_type,enabled=true,icon=excluded.icon,sort_order=excluded.sort_order,is_featured=excluded.is_featured;

create or replace function public.claim_lore_achievement(p_achievement_key text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); a public.lore_achievement_definitions%rowtype; progress bigint:=0; required bigint:=1; v_season_id uuid; inserted_id uuid;
begin
 if uid is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false) then raise exception 'Бүртгэлтэй аккаунтаар нэвтэрнэ үү'; end if;
 select * into a from public.lore_achievement_definitions where achievement_key=p_achievement_key and enabled=true;
 if not found then raise exception 'Амжилт олдсонгүй'; end if;
 if p_achievement_key='daily_7_streak' then
   select coalesce(max(streak_days),0) into progress from public.lore_daily_checkins where user_id=uid; required:=7;
 elsif p_achievement_key='daily_30_checkins' then
   select count(*) into progress from public.lore_daily_checkins where user_id=uid; required:=30;
 elsif p_achievement_key='bug_hunter_first' then
   select count(*) into progress from public.bug_reports where user_id=uid and status='resolved' and reward_awarded_at is not null; required:=1;
 elsif p_achievement_key='bug_hunter_5' then
   select count(*) into progress from public.bug_reports where user_id=uid and status='resolved' and reward_awarded_at is not null; required:=5;
 else raise exception 'Энэ амжилтын шалгуур одоогоор идэвхгүй байна';
 end if;
 if progress<required then raise exception 'Амжилтын шалгуур хараахан биелээгүй байна'; end if;
 insert into public.lore_user_achievements(user_id,achievement_key) values(uid,a.achievement_key)
 on conflict(user_id,achievement_key) do nothing returning id into inserted_id;
 if inserted_id is null then return jsonb_build_object('success',false,'duplicate',true,'message','Энэ амжилтын шагналыг өмнө авсан байна'); end if;
 insert into public.profiles(id) values(uid) on conflict(id) do nothing;
 select ls.id into v_season_id from public.lore_seasons ls where ls.active=true and now() between ls.starts_at and ls.ends_at limit 1;
 perform set_config('app.loreverse_economy_write','on',true);
 update public.profiles pr set lore_coins=pr.lore_coins+a.coin_reward,total_xp=pr.total_xp+a.xp_reward,
  season_xp=case when v_season_id is null then pr.season_xp else pr.season_xp+a.xp_reward end,
  season_id=coalesce(v_season_id,pr.season_id),updated_at=now() where pr.id=uid;
 insert into public.lore_reward_events(user_id,event_key,xp_delta,coin_delta,reference_id)
 values(uid,'achievement:'||a.achievement_key,a.xp_reward,a.coin_reward,a.achievement_key)
 on conflict(user_id,event_key,reference_id) do nothing;
 return jsonb_build_object('success',true,'achievement',a.achievement_key,'coins',a.coin_reward,'xp',a.xp_reward,'progress',progress);
end $$;
revoke all on function public.claim_lore_achievement(text) from public;
grant execute on function public.claim_lore_achievement(text) to authenticated;

create or replace function public.claim_daily_lore_reward()
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
 result:=public.claim_lore_daily_reward();
 return jsonb_build_object(
   'claimed',coalesce((result->>'success')::boolean,true),
   'message',coalesce(result->>'message','Өдрийн урамшуулал шинэчлэгдлээ.'),
   'coins',result->'balance',
   'reward',result->'reward',
   'streak',result->'streak'
 );
end $$;
revoke all on function public.claim_daily_lore_reward() from public;
grant execute on function public.claim_daily_lore_reward() to authenticated;

create or replace function public.redeem_lore_coins(p_item_id text)
returns jsonb language plpgsql security definer set search_path='public','auth' as $$
declare uid uuid:=auth.uid(); item public.lore_coin_items%rowtype; balance bigint; redemption uuid;
begin
 if uid is null then raise exception 'Нэвтэрнэ үү'; end if;
 if coalesce((auth.jwt()->>'is_anonymous')::boolean,false) then raise exception 'Lore Coins ашиглахын тулд бүртгэлтэй хэрэглэгчээр нэвтэрнэ үү'; end if;
 select * into item from public.lore_coin_items where id=p_item_id and enabled=true;
 if item.id is null then raise exception 'Энэ шагнал боломжгүй байна'; end if;
 if item.item_type not in ('profile_frame','badge','avatar','profile_background','sticker_pack','profile_effect','nameplate','chat_theme','emoji_pack','soundboard_pack','profile_card') then
   raise exception 'Lore Coins-ийг мөнгө, төлбөр, Premium хөнгөлөлт болон бэлэн мөнгөтэй дүйцэх зүйлд ашиглах боломжгүй';
 end if;
 perform set_config('app.loreverse_economy_write','on',true);
 update public.profiles set lore_coins=lore_coins-item.coin_cost where id=uid and lore_coins>=item.coin_cost returning lore_coins into balance;
 if not found then raise exception 'Lore Coins хүрэлцэхгүй байна'; end if;
 insert into public.lore_coin_redemptions(user_id,item_id,coins_spent) values(uid,item.id,item.coin_cost) returning id into redemption;
 insert into public.user_reward_inventory(user_id,item_id,redemption_id) values(uid,item.id,redemption);
 return jsonb_build_object('success',true,'redemption_id',redemption,'remaining_coins',balance,'item',item.name);
end $$;
revoke all on function public.redeem_lore_coins(text) from public;
grant execute on function public.redeem_lore_coins(text) to authenticated;

create or replace function public.store_equip(p_item_id text)
returns boolean language plpgsql security definer set search_path='public','auth' as $$
declare uid uuid:=auth.uid(); item public.lore_coin_items%rowtype; slot_name text;
begin
 if uid is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false) then raise exception 'Бүртгэлтэй аккаунтаараа нэвтэрнэ үү'; end if;
 select * into item from public.lore_coin_items where id=p_item_id and enabled=true;
 if not found then raise exception 'Бараа олдсонгүй'; end if;
 if not exists(select 1 from public.user_reward_inventory where user_id=uid and item_id=p_item_id and status='active') then raise exception 'Энэ бараа таны цуглуулгад байхгүй байна'; end if;
 slot_name:=case item.item_type
  when 'avatar' then 'avatar' when 'profile_frame' then 'frame' when 'badge' then 'badge'
  when 'profile_background' then 'background' when 'profile_effect' then 'effect'
  when 'nameplate' then 'nameplate' when 'chat_theme' then 'chat_theme'
  when 'profile_card' then 'profile_card' else null end;
 if slot_name is null then raise exception 'Энэ барааг тоноглох боломжгүй'; end if;
 insert into public.store_equipped(user_id,slot,item_id) values(uid,slot_name,p_item_id)
 on conflict(user_id,slot) do update set item_id=excluded.item_id,updated_at=now();
 return true;
end $$;
create or replace function public.store_unequip(p_slot text)
returns boolean language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid();
begin
 if uid is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false) then raise exception 'Бүртгэлтэй аккаунтаараа нэвтэрнэ үү'; end if;
 if p_slot not in ('avatar','frame','badge','background','effect','nameplate','chat_theme','profile_card') then raise exception 'Тоноглолын төрөл буруу байна'; end if;
 delete from public.store_equipped where user_id=uid and slot=p_slot;
 return true;
end $$;
