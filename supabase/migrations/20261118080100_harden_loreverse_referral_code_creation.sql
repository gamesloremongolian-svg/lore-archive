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
      v_code := upper(substr(encode(gen_random_bytes(8), 'hex'), 1, 10));
      begin
        insert into public.loreverse_referral_codes(user_id, code)
        values (v_user, v_code)
        on conflict (user_id) do nothing;
        select code into v_code
        from public.loreverse_referral_codes
        where user_id = v_user;
        exit when v_code is not null;
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