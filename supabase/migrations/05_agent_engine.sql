-- Create Agent Engine Tables

create table if not exists public.agent_runs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  agent_name text not null,
  enabled boolean default true not null,
  schedule text not null check (schedule in ('Manual', 'Hourly', 'Daily', 'Weekly')),
  status text not null default 'Idle',
  last_run timestamp with time zone,
  next_run timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, agent_name)
);

create table if not exists public.agent_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  agent_name text not null,
  start_time timestamp with time zone not null,
  finish_time timestamp with time zone,
  duration_ms integer,
  result_summary text,
  error text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.agent_runs enable row level security;
alter table public.agent_logs enable row level security;

-- Create Policies
create policy "Users can view own agent_runs" on public.agent_runs for select using (auth.uid() = user_id);
create policy "Users can insert own agent_runs" on public.agent_runs for insert with check (auth.uid() = user_id);
create policy "Users can update own agent_runs" on public.agent_runs for update using (auth.uid() = user_id);
create policy "Users can delete own agent_runs" on public.agent_runs for delete using (auth.uid() = user_id);

create policy "Users can view own agent_logs" on public.agent_logs for select using (auth.uid() = user_id);
create policy "Users can insert own agent_logs" on public.agent_logs for insert with check (auth.uid() = user_id);
create policy "Users can delete own agent_logs" on public.agent_logs for delete using (auth.uid() = user_id);
