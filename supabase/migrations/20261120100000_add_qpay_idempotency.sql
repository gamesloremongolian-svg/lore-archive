-- Proposed QPay idempotency schema. This file is reviewed via PR only.
alter table public.payment_records
  add column if not exists idempotency_key text,
  add column if not exists invoice_creation_status text not null default 'not_started',
  add column if not exists invoice_response jsonb;

alter table public.payment_records
  add constraint payment_records_invoice_creation_status_check
  check (invoice_creation_status in ('not_started','creating','created','unknown','failed'));

create unique index if not exists payment_records_qpay_idempotency_uidx
  on public.payment_records (user_id, purpose, idempotency_key)
  where provider = 'qpay' and idempotency_key is not null;

create index if not exists payment_records_qpay_pending_created_idx
  on public.payment_records (created_at)
  where provider = 'qpay' and status = 'pending';
