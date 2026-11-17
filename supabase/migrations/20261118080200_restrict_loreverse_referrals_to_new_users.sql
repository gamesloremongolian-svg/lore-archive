create or replace function public.claim_loreverse_referral(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user uuid := auth.uid();
  v_referrer uuid;
  v_code_created_at timestamptz;
  v_user_created_at timestamptz;
  v_confirmed timestamptz;
begin
  if v_user is null then raise exception 'Бүртгэлээрээ нэвтэрнэ үү.'; end if;

  select email_confirmed_at, created_at
    into v_confirmed, v_user_created_at
    from auth.users where id = v_user;

  if v_confirmed is null then
    return jsonb_build_object('claimed', false, 'reason', 'email_unconfirmed');
  end if;

  if p_code is null or length(trim(p_code)) < 6 then
    return jsonb_build_object('claimed', false, 'reason', 'invalid_code');
  end if;

  select user_id, created_at
    into v_referrer, v_code_created_at
    from public.loreverse_referral_codes
   where code = upper(trim(p_code));

  if v_referrer is null then
    return jsonb_build_object('claimed', false, 'reason', 'code_not_found');
  end if;

  if v_referrer = v_user then
    return jsonb_build_object('claimed', false, 'reason', 'self_referral');
  end if;

  if v_user_created_at <= v_code_created_at then
    return jsonb_build_object('claimed', false, 'reason', 'existing_account');
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