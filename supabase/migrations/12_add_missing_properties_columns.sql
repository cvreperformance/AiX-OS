-- Migration 12: Add missing property wizard columns & update status constraint to match application requirements

ALTER TABLE public.properties
    ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Apartment',
    ADD COLUMN IF NOT EXISTS listing_type TEXT DEFAULT 'Sale',
    ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Romania',
    ADD COLUMN IF NOT EXISTS district TEXT,
    ADD COLUMN IF NOT EXISTS neighborhood TEXT,
    ADD COLUMN IF NOT EXISTS address TEXT,
    ADD COLUMN IF NOT EXISTS built_area NUMERIC,
    ADD COLUMN IF NOT EXISTS usable_area NUMERIC,
    ADD COLUMN IF NOT EXISTS rooms INTEGER,
    ADD COLUMN IF NOT EXISTS year_built INTEGER,
    ADD COLUMN IF NOT EXISTS cover_image TEXT,
    ADD COLUMN IF NOT EXISTS video_url TEXT,
    ADD COLUMN IF NOT EXISTS video_provider TEXT,
    ADD COLUMN IF NOT EXISTS video_thumbnail TEXT,
    ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Drop old status check constraint if exists
ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_status_check;

-- Add comprehensive status check constraint supporting both 'Published'/'Draft' and 'active'/'sold'
ALTER TABLE public.properties 
    ADD CONSTRAINT properties_status_check 
    CHECK (status = ANY (ARRAY['Published'::text, 'Draft'::text, 'active'::text, 'sold'::text, 'reserved'::text, 'rented'::text, 'archived'::text]));

-- Backfill legacy mapping for backwards compatibility
UPDATE public.properties SET 
    address = COALESCE(address, location),
    usable_area = COALESCE(usable_area, area_sqm),
    cover_image = COALESCE(cover_image, image_url),
    category = COALESCE(category, property_type)
WHERE address IS NULL OR usable_area IS NULL OR cover_image IS NULL OR category IS NULL;

-- Trigger to auto-sync location/area_sqm/image_url for backwards compatibility with legacy queries
CREATE OR REPLACE FUNCTION sync_properties_compat_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.location IS NULL OR NEW.location = '' THEN
        NEW.location := COALESCE(NEW.address, NEW.city, 'București');
    END IF;
    IF NEW.address IS NULL OR NEW.address = '' THEN
        NEW.address := NEW.location;
    END IF;
    IF NEW.area_sqm IS NULL THEN
        NEW.area_sqm := NEW.usable_area;
    END IF;
    IF NEW.usable_area IS NULL THEN
        NEW.usable_area := NEW.area_sqm;
    END IF;
    IF NEW.image_url IS NULL OR NEW.image_url = '' THEN
        NEW.image_url := NEW.cover_image;
    END IF;
    IF NEW.cover_image IS NULL OR NEW.cover_image = '' THEN
        NEW.cover_image := NEW.image_url;
    END IF;
    IF NEW.property_type IS NULL OR NEW.property_type = '' THEN
        NEW.property_type := COALESCE(NEW.category, 'Apartment');
    END IF;
    IF NEW.category IS NULL OR NEW.category = '' THEN
        NEW.category := COALESCE(NEW.property_type, 'Apartment');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_properties_compat ON public.properties;

CREATE TRIGGER trigger_sync_properties_compat
    BEFORE INSERT OR UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION sync_properties_compat_fields();

-- Clean up and update properties table RLS policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.properties;
DROP POLICY IF EXISTS "Users can view own properties." ON public.properties;
DROP POLICY IF EXISTS "Users can insert own properties." ON public.properties;
DROP POLICY IF EXISTS "Users can update own properties." ON public.properties;
DROP POLICY IF EXISTS "Users can delete own properties." ON public.properties;
DROP POLICY IF EXISTS "Public read properties" ON public.properties;
DROP POLICY IF EXISTS "Admin all properties" ON public.properties;
DROP POLICY IF EXISTS "Authenticated insert properties" ON public.properties;
DROP POLICY IF EXISTS "Authenticated update properties" ON public.properties;
DROP POLICY IF EXISTS "Authenticated delete properties" ON public.properties;
DROP POLICY IF EXISTS "Published properties are viewable by everyone" ON public.properties;
DROP POLICY IF EXISTS "Users can view their own properties" ON public.properties;
DROP POLICY IF EXISTS "Users can insert their own properties" ON public.properties;
DROP POLICY IF EXISTS "Users can update their own properties" ON public.properties;
DROP POLICY IF EXISTS "Users can delete their own properties" ON public.properties;

CREATE POLICY "Published properties are viewable by everyone" 
    ON public.properties FOR SELECT 
    USING (status = 'Published' OR status = 'active' OR (auth.role() = 'authenticated' AND (owner_id IS NULL OR auth.uid() = owner_id)));

CREATE POLICY "Users can insert their own properties" 
    ON public.properties FOR INSERT 
    TO authenticated
    WITH CHECK (
        auth.role() = 'authenticated' 
        AND (owner_id IS NULL OR auth.uid() = owner_id)
    );

CREATE POLICY "Users can update their own properties" 
    ON public.properties FOR UPDATE 
    TO authenticated
    USING (
        auth.role() = 'authenticated' 
        AND (owner_id IS NULL OR auth.uid() = owner_id)
    )
    WITH CHECK (
        auth.role() = 'authenticated' 
        AND (owner_id IS NULL OR auth.uid() = owner_id)
    );

CREATE POLICY "Users can delete their own properties" 
    ON public.properties FOR DELETE 
    TO authenticated
    USING (
        auth.role() = 'authenticated' 
        AND (owner_id IS NULL OR auth.uid() = owner_id)
    );

-- Notify PostgREST schema cache to reload immediately
NOTIFY pgrst, 'reload schema';
