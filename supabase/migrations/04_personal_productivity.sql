-- Create Personal Productivity Engine Tables

-- Calendar Events
create table if not exists public.calendar_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  description text,
  date date not null,
  time time not null,
  priority text not null check (priority in ('Critical', 'High', 'Medium', 'Low')),
  estimated_revenue numeric default 0,
  status text not null default 'Scheduled',
  category text not null check (category in ('Meeting', 'Viewing', 'Call', 'Insurance', 'Property', 'Personal', 'Idea', 'Reminder', 'Task')),
  linked_company text,
  linked_property text,
  linked_client text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Captures (ultra-fast raw text dump)
create table if not exists public.captures (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  raw_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ideas
create table if not exists public.ideas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  description text,
  priority text not null check (priority in ('Critical', 'High', 'Medium', 'Low')),
  tags text[] default array[]::text[],
  status text not null default 'New',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reminders
create table if not exists public.reminders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  date date not null,
  priority text not null check (priority in ('Critical', 'High', 'Medium', 'Low')),
  completed boolean default false not null,
  linked_capture uuid references public.captures(id) on delete set null,
  linked_idea uuid references public.ideas(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.calendar_events enable row level security;
alter table public.captures enable row level security;
alter table public.ideas enable row level security;
alter table public.reminders enable row level security;

-- Create Policies
create policy "Users can view own calendar events" on public.calendar_events for select using (auth.uid() = user_id);
create policy "Users can insert own calendar events" on public.calendar_events for insert with check (auth.uid() = user_id);
create policy "Users can update own calendar events" on public.calendar_events for update using (auth.uid() = user_id);
create policy "Users can delete own calendar events" on public.calendar_events for delete using (auth.uid() = user_id);

create policy "Users can view own captures" on public.captures for select using (auth.uid() = user_id);
create policy "Users can insert own captures" on public.captures for insert with check (auth.uid() = user_id);
create policy "Users can update own captures" on public.captures for update using (auth.uid() = user_id);
create policy "Users can delete own captures" on public.captures for delete using (auth.uid() = user_id);

create policy "Users can view own ideas" on public.ideas for select using (auth.uid() = user_id);
create policy "Users can insert own ideas" on public.ideas for insert with check (auth.uid() = user_id);
create policy "Users can update own ideas" on public.ideas for update using (auth.uid() = user_id);
create policy "Users can delete own ideas" on public.ideas for delete using (auth.uid() = user_id);

create policy "Users can view own reminders" on public.reminders for select using (auth.uid() = user_id);
create policy "Users can insert own reminders" on public.reminders for insert with check (auth.uid() = user_id);
create policy "Users can update own reminders" on public.reminders for update using (auth.uid() = user_id);
create policy "Users can delete own reminders" on public.reminders for delete using (auth.uid() = user_id);
