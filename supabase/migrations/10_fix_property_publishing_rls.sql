-- =========================================================================
-- MIGRATION 10: PERMANENT FIX FOR PROPERTY PUBLISHING & STORAGE RLS POLICIES
-- =========================================================================

-- 1. Ensure storage bucket exists for 'property-images'
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Clean up existing storage object policies to prevent duplicate policy errors
DROP POLICY IF EXISTS "Public Access to Property Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own property images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own property images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to Property Buckets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to property buckets" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images in property buckets" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images in property buckets" ON storage.objects;

-- 3. Storage Object RLS Policies (Strictly scoped to user ID folder)

-- SELECT: Public read access for property images
CREATE POLICY "Public Access to Property Images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'property-images');

-- INSERT: Authenticated users can upload to their own user_id directory
CREATE POLICY "Authenticated users can upload property images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'property-images'
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- UPDATE: Authenticated users can update files in their own user_id directory
CREATE POLICY "Users can update their own property images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'property-images'
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    )
    WITH CHECK (
        bucket_id = 'property-images'
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- DELETE: Authenticated users can delete files in their own user_id directory
CREATE POLICY "Users can delete their own property images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'property-images'
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );


-- 4. Clean up existing properties table policies to ensure exact RLS definitions
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.properties;
DROP POLICY IF EXISTS "Users can view own properties." ON public.properties;
DROP POLICY IF EXISTS "Users can insert own properties." ON public.properties;
DROP POLICY IF EXISTS "Users can update own properties." ON public.properties;
DROP POLICY IF EXISTS "Users can delete own properties." ON public.properties;
DROP POLICY IF EXISTS "Published properties are viewable by everyone" ON public.properties;
DROP POLICY IF EXISTS "Users can view their own properties" ON public.properties;
DROP POLICY IF EXISTS "Users can insert their own properties" ON public.properties;
DROP POLICY IF EXISTS "Users can update their own properties" ON public.properties;
DROP POLICY IF EXISTS "Users can delete their own properties" ON public.properties;

-- 5. Properties Table RLS Policies

-- SELECT: Public can view published properties; owners can view all their own properties
CREATE POLICY "Published properties are viewable by everyone" 
    ON public.properties FOR SELECT 
    USING (status = 'Published' OR (auth.role() = 'authenticated' AND auth.uid() = owner_id));

-- INSERT: Authenticated users can insert properties if owner_id matches their auth.uid()
CREATE POLICY "Users can insert their own properties" 
    ON public.properties FOR INSERT 
    WITH CHECK (
        auth.role() = 'authenticated' 
        AND auth.uid() = owner_id
    );

-- UPDATE: Authenticated users can update their own properties
CREATE POLICY "Users can update their own properties" 
    ON public.properties FOR UPDATE 
    USING (
        auth.role() = 'authenticated' 
        AND auth.uid() = owner_id
    )
    WITH CHECK (
        auth.role() = 'authenticated' 
        AND auth.uid() = owner_id
    );

-- DELETE: Authenticated users can delete their own properties
CREATE POLICY "Users can delete their own properties" 
    ON public.properties FOR DELETE 
    USING (
        auth.role() = 'authenticated' 
        AND auth.uid() = owner_id
    );
