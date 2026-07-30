-- Migration: AiX Intelligence Engine Foundation Schema
-- File: supabase/migrations/20260729_aix_intelligence_foundation.sql

-- Enable uuid-ossp if not already done
create extension if not exists "uuid-ossp";

-- Core Events Table (Append-Only)
create table if not exists public.aix_events (
  id uuid default uuid_generate_v4() primary key,
  application text not null,
  sdk_version text not null,
  event_version text not null,
  timestamp timestamptz not null default now(),
  session_id text not null,
  visitor_id text not null,
  event_type text not null,
  page text not null,
  referrer text,
  device text,
  browser text,
  country text,
  campaign text,
  metadata jsonb default '{}'::jsonb,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Optimize for queries filtering by application, event type, and timestamps
create index if not exists idx_aix_events_app_type_time 
  on public.aix_events (application, event_type, timestamp desc);

-- Optimize for session and visitor lookup
create index if not exists idx_aix_events_session_id 
  on public.aix_events (session_id);

create index if not exists idx_aix_events_visitor_id 
  on public.aix_events (visitor_id);

-- Optimize for analytics timeframe scans
create index if not exists idx_aix_events_timestamp 
  on public.aix_events (timestamp desc);

-- Row Level Security (RLS)
alter table public.aix_events enable row level security;

-- Policies:
-- 1. Ingestion is handled server-side via Supabase Service Role client, so no public INSERT policy is strictly required.
--    However, we explicitly grant Admin full access.
create policy "Admin read all events" on public.aix_events for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Admin insert events" on public.aix_events for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

