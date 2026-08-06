-- Add property video tour embed support to public.properties
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS video_provider TEXT,
ADD COLUMN IF NOT EXISTS video_thumbnail TEXT;
