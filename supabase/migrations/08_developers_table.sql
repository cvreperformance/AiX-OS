-- 08_developers_table.sql

CREATE TABLE IF NOT EXISTS public.developers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cui TEXT UNIQUE,
  address TEXT,
  merged_from JSONB DEFAULT '[]'::jsonb,
  projects_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Public read policy for developers
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON public.developers FOR SELECT USING (true);
