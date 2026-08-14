-- =========================================================================
-- MIGRATION 11: STORAGE RLS POLICIES FOR CANONICAL 'proprietati' BUCKET
-- =========================================================================

-- 1. Ensure storage bucket exists for 'proprietati'
INSERT INTO storage.buckets (id, name, public)
VALUES ('proprietati', 'proprietati', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Clean up existing storage policies to prevent duplicates
DROP POLICY IF EXISTS "Public read property images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Owner or admin update property images" ON storage.objects;
DROP POLICY IF EXISTS "Owner or admin delete property images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to Property Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own property images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own property images" ON storage.objects;
DROP POLICY IF EXISTS "Proprietati public read" ON storage.objects;
DROP POLICY IF EXISTS "Proprietati authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Proprietati user update own" ON storage.objects;
DROP POLICY IF EXISTS "Proprietati user delete own" ON storage.objects;

-- 3. SELECT: Public read access for property images in 'proprietati'
CREATE POLICY "Proprietati public read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'proprietati');

-- 4. INSERT: Authenticated users can upload to their own user directory in 'proprietati'
-- Supports both 'properties/{user_id}/...' and '{user_id}/...'
CREATE POLICY "Proprietati authenticated upload"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'proprietati'
        AND auth.role() = 'authenticated'
        AND auth.uid() IS NOT NULL
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR
            ((storage.foldername(name))[1] = 'properties' AND (storage.foldername(name))[2] = auth.uid()::text)
        )
    );

-- 5. UPDATE: Authenticated users can update files in their own user directory
CREATE POLICY "Proprietati user update own"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'proprietati'
        AND auth.role() = 'authenticated'
        AND auth.uid() IS NOT NULL
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR
            ((storage.foldername(name))[1] = 'properties' AND (storage.foldername(name))[2] = auth.uid()::text)
        )
    )
    WITH CHECK (
        bucket_id = 'proprietati'
        AND auth.role() = 'authenticated'
        AND auth.uid() IS NOT NULL
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR
            ((storage.foldername(name))[1] = 'properties' AND (storage.foldername(name))[2] = auth.uid()::text)
        )
    );

-- 6. DELETE: Authenticated users can delete files in their own user directory
CREATE POLICY "Proprietati user delete own"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'proprietati'
        AND auth.role() = 'authenticated'
        AND auth.uid() IS NOT NULL
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR
            ((storage.foldername(name))[1] = 'properties' AND (storage.foldername(name))[2] = auth.uid()::text)
        )
    );
