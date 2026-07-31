-- Migration: Notification Delivery Improvements
-- File: supabase/migrations/20260731_notification_delivery_improvements.sql

alter table public.notification_delivery_log
add column if not exists queued_at timestamptz default now(),
add column if not exists last_attempt_at timestamptz,
add column if not exists updated_at timestamptz default now();

-- Ensure unique constraint on event_id exists
do $$
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'notification_delivery_log_event_id_key'
  ) then
    alter table public.notification_delivery_log 
    add constraint notification_delivery_log_event_id_key unique (event_id);
  end if;
end;
$$;
