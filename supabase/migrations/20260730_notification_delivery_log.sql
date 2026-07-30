-- Migration: Create notification_delivery_log
-- File: supabase/migrations/20260730_notification_delivery_log.sql

create table if not exists public.notification_delivery_log (
  id uuid primary key default gen_random_uuid(),
  event_id uuid unique not null,
  application text not null,
  event_type text not null,
  telegram_status text not null,
  attempts integer not null default 0,
  sent_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);

-- Optimize queries searching by event_id or telegram_status
create index if not exists idx_notification_delivery_log_event_id 
  on public.notification_delivery_log (event_id);

create index if not exists idx_notification_delivery_log_status 
  on public.notification_delivery_log (telegram_status);

-- Enable RLS and grant full admin access
alter table public.notification_delivery_log enable row level security;

create policy "Admin read all delivery logs" on public.notification_delivery_log for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Admin modify delivery logs" on public.notification_delivery_log for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
