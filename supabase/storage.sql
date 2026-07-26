-- AiX OS — Supabase Storage Setup
-- Run in Supabase SQL Editor AFTER creating the bucket in Dashboard

-- 1. Create bucket in Dashboard: Storage → New bucket
--    Name: Proprietati (or proprietati — update NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET to match)
--    Public bucket: YES

-- 2. Public read policy for property images
insert into storage.buckets (id, name, public)
values ('proprietati', 'proprietati', true)
on conflict (id) do update set public = true;

-- Allow public read
create policy "Public read property images"
  on storage.objects for select
  using ( bucket_id = 'proprietati' );

-- Allow any authenticated user to upload property images
create policy "Authenticated upload property images"
  on storage.objects for insert
  with check (
    bucket_id = 'proprietati'
    and auth.role() = 'authenticated'
  );

create policy "Owner or admin update property images"
  on storage.objects for update
  using (
    bucket_id = 'proprietati'
    and (auth.uid() = owner or auth.role() = 'admin')
  );

create policy "Owner or admin delete property images"
  on storage.objects for delete
  using (
    bucket_id = 'proprietati'
    and (auth.uid() = owner or auth.role() = 'admin')
  );

-- 3. Gallery format in properties table (jsonb):
--    ["slug/photo1.jpg", "slug/photo2.jpg"]
--    OR store paths relative to bucket root without bucket prefix

-- 4. Example update after upload:
-- update properties
-- set gallery = '["penthouse-floreasca/hero.jpg", "penthouse-floreasca/living.jpg"]'::jsonb,
--     image_url = 'penthouse-floreasca/hero.jpg'
-- where slug = 'penthouse-floreasca';
