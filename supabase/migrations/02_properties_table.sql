-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Information
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    category TEXT NOT NULL, -- e.g., 'Apartment', 'House', 'Villa', 'Land', 'Commercial', 'Office', 'Industrial', 'Luxury Asset', 'Other'
    listing_type TEXT NOT NULL, -- e.g., 'Sale', 'Rent', 'Auction', 'Off Market'
    status TEXT NOT NULL DEFAULT 'Draft', -- 'Draft', 'Published', 'Sold', 'Rented', 'Archived'
    
    -- Pricing
    price NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    negotiable BOOLEAN DEFAULT false,
    commission TEXT,
    monthly_costs NUMERIC,
    
    -- Location
    country TEXT NOT NULL DEFAULT 'Romania',
    city TEXT NOT NULL,
    district TEXT,
    neighborhood TEXT,
    address TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    
    -- Details
    built_area NUMERIC,
    usable_area NUMERIC,
    land_area NUMERIC,
    rooms INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    floor INTEGER,
    total_floors INTEGER,
    year_built INTEGER,
    energy_class TEXT,
    
    -- Amenities & Features (Stored as JSONB array of strings)
    features JSONB DEFAULT '[]'::jsonb,
    
    -- Media (URLs directly stored)
    cover_image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Policies

-- 1. Anyone can view published properties
CREATE POLICY "Public profiles are viewable by everyone." ON public.properties
    FOR SELECT USING (status = 'Published');

-- 2. Users can view their own properties (even if draft/archived)
CREATE POLICY "Users can view own properties." ON public.properties
    FOR SELECT USING (auth.uid() = owner_id);

-- 3. Users can insert their own properties
CREATE POLICY "Users can insert own properties." ON public.properties
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- 4. Users can update their own properties
CREATE POLICY "Users can update own properties." ON public.properties
    FOR UPDATE USING (auth.uid() = owner_id);

-- 5. Users can delete their own properties
CREATE POLICY "Users can delete own properties." ON public.properties
    FOR DELETE USING (auth.uid() = owner_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_properties_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at_trigger
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION update_properties_updated_at();

-- Generate Slug Trigger
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE OR REPLACE FUNCTION generate_property_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := lower(regexp_replace(unaccent(NEW.title), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(md5(random()::text), 1, 6);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_property_slug
    BEFORE INSERT OR UPDATE OF title ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION generate_property_slug();

