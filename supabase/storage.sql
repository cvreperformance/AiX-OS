-- AiX OS — Supabase Storage Setup (Bucket: proprietati)

-- 1. Create or update bucket in Supabase
INSERT INTO storage.buckets (id, name, public)
VALUES ('proprietati', 'proprietati', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies to prevent conflict errors
DROP POLICY IF EXISTS "Public read property images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Owner or admin update property images" ON storage.objects;
DROP POLICY IF EXISTS "Owner or admin delete property images" ON storage.objects;
DROP POLICY IF EXISTS "Proprietati public read" ON storage.objects;
DROP POLICY IF EXISTS "Proprietati authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Proprietati user update own" ON storage.objects;
DROP POLICY IF EXISTS "Proprietati user delete own" ON storage.objects;

-- 3. Public read policy for property images
CREATE POLICY "Proprietati public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'proprietati');

-- 4. Authenticated upload policy (scoped to user's own directory)
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

-- 5. Owner update policy
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

-- 6. Owner delete policy
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
