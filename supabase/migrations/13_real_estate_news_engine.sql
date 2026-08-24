-- 13_real_estate_news_engine.sql
-- Production Real Estate News Engine schema for AiX OS™

-- 1. Create main real_estate_news table
CREATE TABLE IF NOT EXISTS public.real_estate_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL UNIQUE,
  canonical_url TEXT,
  title TEXT NOT NULL,
  original_title TEXT,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  summary TEXT,
  image_url TEXT,
  author TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  category TEXT NOT NULL DEFAULT 'MARKET',
  subcategory TEXT,

  country TEXT DEFAULT 'Romania',
  city TEXT,
  district TEXT,
  neighborhood TEXT,

  property_segment TEXT,
  market_segment TEXT,

  importance_score NUMERIC(4,2) DEFAULT 5.00,
  relevance_score NUMERIC(4,2) DEFAULT 5.00,
  credibility_score NUMERIC(4,2) DEFAULT 5.00,
  aix_score NUMERIC(4,2) DEFAULT 5.00,

  is_featured BOOLEAN DEFAULT FALSE,
  is_breaking BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  is_archived BOOLEAN DEFAULT FALSE,

  tags JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  content_hash TEXT UNIQUE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create sources table
CREATE TABLE IF NOT EXISTS public.news_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  source_key TEXT NOT NULL UNIQUE,
  feed_url TEXT NOT NULL,
  website_url TEXT,
  category_default TEXT DEFAULT 'MARKET',
  credibility_score NUMERIC(4,2) DEFAULT 8.50,
  status TEXT DEFAULT 'ONLINE', -- ONLINE, DEGRADED, OFFLINE
  last_successful_fetch TIMESTAMP WITH TIME ZONE,
  last_failed_fetch TIMESTAMP WITH TIME ZONE,
  failure_count INT DEFAULT 0,
  response_time_ms INT DEFAULT 0,
  articles_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create ingestion logs table
CREATE TABLE IF NOT EXISTS public.news_ingestion_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_ms INT DEFAULT 0,
  articles_ingested INT DEFAULT 0,
  articles_rejected INT DEFAULT 0,
  articles_deduplicated INT DEFAULT 0,
  status TEXT DEFAULT 'SUCCESS',
  error_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Indexes
CREATE INDEX IF NOT EXISTS idx_real_estate_news_published_at ON public.real_estate_news (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_real_estate_news_source ON public.real_estate_news (source);
CREATE INDEX IF NOT EXISTS idx_real_estate_news_category ON public.real_estate_news (category);
CREATE INDEX IF NOT EXISTS idx_real_estate_news_country ON public.real_estate_news (country);
CREATE INDEX IF NOT EXISTS idx_real_estate_news_city ON public.real_estate_news (city);
CREATE INDEX IF NOT EXISTS idx_real_estate_news_is_published ON public.real_estate_news (is_published);
CREATE INDEX IF NOT EXISTS idx_real_estate_news_importance ON public.real_estate_news (importance_score DESC);
CREATE INDEX IF NOT EXISTS idx_real_estate_news_hash ON public.real_estate_news (content_hash);
CREATE INDEX IF NOT EXISTS idx_real_estate_news_slug ON public.real_estate_news (slug);

-- 5. Enable RLS
ALTER TABLE public.real_estate_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_ingestion_logs ENABLE ROW LEVEL SECURITY;

-- 6. Policies (Public Read)
DROP POLICY IF EXISTS "Public read real_estate_news" ON public.real_estate_news;
CREATE POLICY "Public read real_estate_news" ON public.real_estate_news FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read news_sources" ON public.news_sources;
CREATE POLICY "Public read news_sources" ON public.news_sources FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read news_ingestion_logs" ON public.news_ingestion_logs;
CREATE POLICY "Public read news_ingestion_logs" ON public.news_ingestion_logs FOR SELECT USING (true);

-- Service role full access policies
DROP POLICY IF EXISTS "Service role full access real_estate_news" ON public.real_estate_news;
CREATE POLICY "Service role full access real_estate_news" ON public.real_estate_news FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access news_sources" ON public.news_sources;
CREATE POLICY "Service role full access news_sources" ON public.news_sources FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access news_ingestion_logs" ON public.news_ingestion_logs;
CREATE POLICY "Service role full access news_ingestion_logs" ON public.news_ingestion_logs FOR ALL USING (true) WITH CHECK (true);

-- 7. Sync View or Compatibility Trigger for legacy `public.news`
-- Make sure legacy `public.news` table has compatible columns or sync trigger
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS aix_score NUMERIC(4,2);
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS score_explanation TEXT;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS investment_insight TEXT;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';

-- Add unique constraint on slug for legacy table if not existing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'news_slug_key'
  ) THEN
    ALTER TABLE public.news ADD CONSTRAINT news_slug_key UNIQUE (slug);
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;
