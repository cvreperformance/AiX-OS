-- Create the storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security on the storage bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view public property images
CREATE POLICY "Public Access to Property Images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'property-images');

-- Policy: Authenticated users can upload images to their own directory (e.g., property-images/user_id/...)
CREATE POLICY "Authenticated users can upload property images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'property-images' 
        AND auth.role() = 'authenticated'
        -- Ensure the first path segment matches the user's ID
        -- e.g., 'auth.uid()/'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Policy: Authenticated users can update their own images
CREATE POLICY "Users can update their own property images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'property-images'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Policy: Authenticated users can delete their own images
CREATE POLICY "Users can delete their own property images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'property-images'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
