-- Proposed QPay idempotency schema. This file is reviewed via PR only.
alter table public.payment_records
  add column if not exists idempotency_key text,
  add column if not exists invoice_creation_status text not null default 'not_started',
  add column if not exists invoice_response jsonb,
  add column if not exists qpay_payment_id text,
  add column if not exists ebarimt_status text not null default 'not_requested',
  add column if not exists ebarimt_receiver_type text,
  add column if not exists ebarimt_receiver text,
  add column if not exists ebarimt_response jsonb;

alter table public.payment_records
  drop constraint if exists payment_records_invoice_creation_status_check;

alter table public.payment_records
  add constraint payment_records_invoice_creation_status_check
  check (invoice_creation_status in ('not_started','creating','created','unknown','failed'));

create unique index if not exists payment_records_qpay_idempotency_uidx
  on public.payment_records (user_id, purpose, idempotency_key)
  where provider = 'qpay' and idempotency_key is not null;

alter table public.payment_records
  drop constraint if exists payment_records_ebarimt_status_check;

alter table public.payment_records
  add constraint payment_records_ebarimt_status_check
  check (ebarimt_status in ('not_requested','creating','created','unknown','failed'));

create unique index if not exists payment_records_qpay_payment_id_uidx
  on public.payment_records (qpay_payment_id)
  where provider = 'qpay' and qpay_payment_id is not null;

create index if not exists payment_records_qpay_pending_created_idx
  on public.payment_records (created_at)
  where provider = 'qpay' and status = 'pending';


-- Atomically settle a verified QPay membership payment. A per-user advisory
-- transaction lock serializes simultaneous membership extensions.
drop function if exists public.settle_qpay_membership_payment(uuid, uuid, integer, timestamptz);

create or replace function public.settle_qpay_membership_payment(
  p_payment_id uuid,
  p_user_id uuid,
  p_duration_days integer,
  p_qpay_payment_id text default null,
  p_paid_at timestamptz default now()
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_payment public.payment_records%rowtype;
  v_membership public.memberships%rowtype;
  v_now timestamptz := now();
  v_start timestamptz;
  v_end timestamptz;
begin
  if p_duration_days is null or p_duration_days <= 0 then
    raise exception 'Invalid membership duration';
  end if;

  -- Serialize every settlement for this user, including different invoices.
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));

  select * into v_payment
    from public.payment_records
   where id = p_payment_id
     and user_id = p_user_id
     and provider = 'qpay'
     and purpose = 'membership'
   for update;

  if not found then
    raise exception 'QPay membership payment not found';
  end if;

  if v_payment.status = 'paid' then
    if p_qpay_payment_id is not null and v_payment.qpay_payment_id is null then
      update public.payment_records
         set qpay_payment_id = p_qpay_payment_id
       where id = v_payment.id;
    end if;
    return jsonb_build_object('ok', true, 'already_settled', true);
  end if;

  if v_payment.status <> 'pending' or v_payment.related_id is null then
    raise exception 'QPay membership payment is not pending';
  end if;

  select * into v_membership
    from public.memberships
   where id = v_payment.related_id
     and user_id = p_user_id
   for update;

  if not found then
    raise exception 'Membership record not found';
  end if;

  if v_membership.status <> 'active' then
    select greatest(coalesce(max(ends_at), v_now), v_now)
      into v_start
      from public.memberships
     where user_id = p_user_id
       and status = 'active'
       and ends_at > v_now;

    v_start := coalesce(v_start, v_now);
    v_end := v_start + make_interval(days => p_duration_days);

    update public.memberships
       set status = 'active',
           starts_at = v_start,
           ends_at = v_end
     where id = v_membership.id
       and user_id = p_user_id;
  end if;

  update public.payment_records
     set status = 'paid',
         paid_at = coalesce(p_paid_at, now()),
         qpay_payment_id = coalesce(p_qpay_payment_id, qpay_payment_id)
   where id = v_payment.id
     and user_id = p_user_id;

  return jsonb_build_object('ok', true, 'already_settled', false);
end;
$$;

revoke all on function public.settle_qpay_membership_payment(uuid, uuid, integer, text, timestamptz) from public, anon, authenticated;
grant execute on function public.settle_qpay_membership_payment(uuid, uuid, integer, text, timestamptz) to service_role;
