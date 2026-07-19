-- 07_companies_table.sql

CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cui TEXT UNIQUE,
  name TEXT NOT NULL,
  industry TEXT,
  caen TEXT,
  status TEXT,
  location TEXT,
  website TEXT,
  estimated_size TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security – public read for all users
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON public.companies FOR SELECT USING (true);
