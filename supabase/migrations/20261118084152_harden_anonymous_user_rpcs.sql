-- Security hardening: anonymous Auth sessions must not create community servers,
-- join private communities, consume registered-user AI quota, or generate referrals.
-- Public read-only RPCs remain public by design.

CREATE OR REPLACE FUNCTION public.community_create_server(
  p_name text,
  p_description text DEFAULT ''::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_server_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) THEN
    RAISE EXCEPTION 'Registered account required';
  END IF;

  INSERT INTO public.community_servers(name, description, owner_id)
  VALUES (btrim(p_name), COALESCE(p_description, ''), auth.uid())
  RETURNING id INTO v_server_id;

  INSERT INTO public.community_server_members(server_id, user_id, role)
  VALUES (v_server_id, auth.uid(), 'owner');

  INSERT INTO public.community_channels(server_id, name, description, created_by, position)
  VALUES (v_server_id, 'general', 'Ерөнхий чат', auth.uid(), 0);

  RETURN v_server_id;
END
$function$;

CREATE OR REPLACE FUNCTION public.community_join_with_invite(p_token text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_invite public.community_invites%rowtype;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) THEN
    RAISE EXCEPTION 'Registered account required';
  END IF;

  SELECT * INTO v_invite
  FROM public.community_invites
  WHERE token = p_token
  FOR UPDATE;

  IF NOT FOUND THEN RAISE EXCEPTION 'Invite not found'; END IF;
  IF v_invite.expires_at IS NOT NULL AND v_invite.expires_at <= now() THEN
    RAISE EXCEPTION 'Invite expired';
  END IF;
  IF v_invite.max_uses IS NOT NULL AND v_invite.uses >= v_invite.max_uses THEN
    RAISE EXCEPTION 'Invite limit reached';
  END IF;

  INSERT INTO public.community_server_members(server_id, user_id, role)
  VALUES (v_invite.server_id, auth.uid(), 'member')
  ON CONFLICT(server_id, user_id) DO NOTHING;

  UPDATE public.community_invites
  SET uses = uses + 1
  WHERE id = v_invite.id;

  RETURN v_invite.server_id;
END
$function$;

CREATE OR REPLACE FUNCTION public.consume_lore_ai_quota()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_count integer;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) THEN
    RAISE EXCEPTION 'Registered account required';
  END IF;

  INSERT INTO public.lore_ai_usage(user_id, usage_date, request_count)
  VALUES (v_uid, timezone('Asia/Ulaanbaatar', now())::date, 1)
  ON CONFLICT(user_id, usage_date) DO UPDATE
  SET request_count = public.lore_ai_usage.request_count + 1,
      updated_at = now()
  WHERE public.lore_ai_usage.request_count < 10
  RETURNING request_count INTO v_count;

  IF v_count IS NULL THEN
    RETURN jsonb_build_object('allowed', false, 'limit', 10);
  END IF;

  RETURN jsonb_build_object('allowed', true, 'remaining', 10 - v_count, 'limit', 10);
END
$function$;

CREATE OR REPLACE FUNCTION public.get_my_loreverse_referrals()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $function$
DECLARE
  v_user uuid := auth.uid();
  v_code text;
  v_count integer;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Нэвтэрч орно уу.';
  END IF;

  IF COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) THEN
    RAISE EXCEPTION 'Бүртгэлтэй хэрэглэгчээр нэвтэрнэ үү.';
  END IF;

  SELECT code INTO v_code
  FROM public.loreverse_referral_codes
  WHERE user_id = v_user;

  IF v_code IS NULL THEN
    LOOP
      v_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));
      BEGIN
        INSERT INTO public.loreverse_referral_codes(user_id, code)
        VALUES (v_user, v_code)
        ON CONFLICT (user_id) DO NOTHING;

        SELECT code INTO v_code
        FROM public.loreverse_referral_codes
        WHERE user_id = v_user;

        EXIT WHEN v_code IS NOT NULL;
      EXCEPTION WHEN unique_violation THEN
        v_code := NULL;
      END;
    END LOOP;
  END IF;

  SELECT count(*)::integer INTO v_count
  FROM public.loreverse_referrals r
  JOIN auth.users u ON u.id = r.referred_user_id
  WHERE r.referrer_user_id = v_user
    AND u.email_confirmed_at IS NOT NULL;

  RETURN jsonb_build_object(
    'code', v_code,
    'invite_count', COALESCE(v_count, 0),
    'invite_url', 'https://lore-archive.pages.dev/?ref=' || v_code
  );
END
$function$;
