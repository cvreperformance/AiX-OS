-- Migration: AiX Knowledge Engine Schema
-- File: supabase/migrations/20260729_aix_knowledge_engine.sql

-- Visitor Knowledge Table (Extensible JSONB Structure)
create table if not exists public.aix_visitor_knowledge (
  visitor_id text primary key,
  application text not null,
  profile_version text not null,
  knowledge_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  profile jsonb not null default '{}'::jsonb,
  signals jsonb not null default '{}'::jsonb,
  statistics jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb
);

-- Optimize for application lookup
create index if not exists idx_aix_visitor_knowledge_app 
  on public.aix_visitor_knowledge (application);

-- Row Level Security (RLS)
alter table public.aix_visitor_knowledge enable row level security;

-- Admin policies
create policy "Admin read all knowledge" on public.aix_visitor_knowledge for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Admin modify knowledge" on public.aix_visitor_knowledge for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

