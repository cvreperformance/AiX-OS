-- AiX OS — Supabase Schema
-- Run this in Supabase SQL Editor (free tier)

-- Enable UUID
create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

-- Properties / Anunțuri
create table if not exists public.properties (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  description text,
  price numeric not null,
  currency text default 'EUR',
  location text not null,
  city text default 'București',
  property_type text not null,
  bedrooms int,
  bathrooms int,
  area_sqm numeric,
  image_url text,
  gallery jsonb default '[]',
  aix_score numeric check (aix_score >= 1 and aix_score <= 10),
  score_explanation text,
  investment_insight text,
  features jsonb default '[]',
  status text default 'active' check (status in ('active', 'sold', 'reserved', 'draft')),
  featured boolean default false,
  developer_id uuid,
  agency_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Market Pulse / Știri
create table if not exists public.news (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  summary text,
  content text,
  category text,
  image_url text,
  aix_score numeric,
  score_explanation text,
  investment_insight text,
  source_url text,
  status text default 'published' check (status in ('draft', 'published')),
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Dezvoltatori
create table if not exists public.developers (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  name text not null,
  description text,
  logo_url text,
  website text,
  aix_score numeric,
  score_explanation text,
  projects_count int default 0,
  city text,
  status text default 'active',
  created_at timestamptz default now()
);

-- Agenții imobiliare
create table if not exists public.agencies (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  name text not null,
  description text,
  logo_url text,
  website text,
  phone text,
  email text,
  city text,
  aix_score numeric,
  properties_count int default 0,
  status text default 'active',
  created_at timestamptz default now()
);

-- Oportunități investiționale
create table if not exists public.opportunities (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  description text,
  opportunity_type text,
  location text,
  min_investment numeric,
  currency text default 'EUR',
  expected_yield numeric,
  aix_score numeric,
  score_explanation text,
  investment_insight text,
  image_url text,
  status text default 'active' check (status in ('active', 'closed', 'draft')),
  featured boolean default false,
  created_at timestamptz default now()
);

-- AI Chat messages (Advisor)
create table if not exists public.ai_conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  session_id text,
  role text check (role in ('user', 'assistant')),
  message text not null,
  created_at timestamptz default now()
);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger properties_updated_at
  before update on public.properties
  for each row execute function update_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.news enable row level security;
alter table public.developers enable row level security;
alter table public.agencies enable row level security;
alter table public.opportunities enable row level security;
alter table public.ai_conversations enable row level security;

-- Public read policies
create policy "Public read properties" on public.properties for select using (status = 'active');
create policy "Public read news" on public.news for select using (status = 'published');
create policy "Public read developers" on public.developers for select using (status = 'active');
create policy "Public read agencies" on public.agencies for select using (status = 'active');
create policy "Public read opportunities" on public.opportunities for select using (status = 'active');

-- Admin full access (authenticated admin)
create policy "Admin all properties" on public.properties for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin all news" on public.news for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin all developers" on public.developers for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin all agencies" on public.agencies for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin all opportunities" on public.opportunities for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Profile policies
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Leads / Contact Submissions
create table if not exists public.leads (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  service text,
  page text,
  name text not null,
  email text,
  phone text,
  message text,
  status text default 'new',
  source text
);

alter table public.leads enable row level security;
create policy "Public insert leads" on public.leads for insert with check (true);
create policy "Admin read all leads" on public.leads for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
