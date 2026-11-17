create table if not exists public.loreverse_referral_codes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  code text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.loreverse_referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_user_id uuid not null references auth.users(id) on delete cascade,
  referred_user_id uuid not null unique references auth.users(id) on delete cascade,
  referral_code text not null,
  created_at timestamptz not null default now(),
  constraint loreverse_referrals_no_self check (referrer_user_id <> referred_user_id)
);

create index if not exists loreverse_referrals_referrer_idx
  on public.loreverse_referrals(referrer_user_id, created_at desc);

alter table public.loreverse_referral_codes enable row level security;
alter table public.loreverse_referrals enable row level security;
revoke all on public.loreverse_referral_codes from anon, authenticated;
revoke all on public.loreverse_referrals from anon, authenticated;

create or replace function public.get_my_loreverse_referrals()
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user uuid := auth.uid();
  v_code text;
  v_count integer;
begin
  if v_user is null then raise exception 'Нэвтэрч орно уу.'; end if;

  select code into v_code
  from public.loreverse_referral_codes
  where user_id = v_user;

  if v_code is null then
    loop
      v_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));
      begin
        insert into public.loreverse_referral_codes(user_id, code)
        values (v_user, v_code);
        exit;
      exception when unique_violation then
        v_code := null;
      end;
    end loop;
  end if;

  select count(*)::integer into v_count
  from public.loreverse_referrals r
  join auth.users u on u.id = r.referred_user_id
  where r.referrer_user_id = v_user
    and u.email_confirmed_at is not null;

  return jsonb_build_object(
    'code', v_code,
    'invite_count', coalesce(v_count, 0),
    'invite_url', 'https://lore-archive.pages.dev/?ref=' || v_code
  );
end;
$$;

create or replace function public.claim_loreverse_referral(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user uuid := auth.uid();
  v_referrer uuid;
  v_confirmed timestamptz;
begin
  if v_user is null then raise exception 'Бүртгэлээрээ нэвтэрнэ үү.'; end if;

  select email_confirmed_at into v_confirmed
  from auth.users where id = v_user;

  if v_confirmed is null then
    return jsonb_build_object('claimed', false, 'reason', 'email_unconfirmed');
  end if;

  if p_code is null or length(trim(p_code)) < 6 then
    return jsonb_build_object('claimed', false, 'reason', 'invalid_code');
  end if;

  select user_id into v_referrer
  from public.loreverse_referral_codes
  where code = upper(trim(p_code));

  if v_referrer is null then
    return jsonb_build_object('claimed', false, 'reason', 'code_not_found');
  end if;

  if v_referrer = v_user then
    return jsonb_build_object('claimed', false, 'reason', 'self_referral');
  end if;

  insert into public.loreverse_referrals(referrer_user_id, referred_user_id, referral_code)
  values (v_referrer, v_user, upper(trim(p_code)))
  on conflict (referred_user_id) do nothing;

  if not found then
    return jsonb_build_object('claimed', false, 'reason', 'already_claimed');
  end if;

  return jsonb_build_object('claimed', true, 'reason', 'success');
end;
$$;

revoke all on function public.get_my_loreverse_referrals() from public, anon;
revoke all on function public.claim_loreverse_referral(text) from public, anon;
grant execute on function public.get_my_loreverse_referrals() to authenticated;
grant execute on function public.claim_loreverse_referral(text) to authenticated;
