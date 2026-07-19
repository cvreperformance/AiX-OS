-- 06_news_table.sql

create table if not exists public.news (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  url text,
  source text,
  category text,
  published_at timestamp with time zone,
  content text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable row level security and a simple policy for read access
alter table public.news enable row level security;
create policy "public read" on public.news for select using (true);
