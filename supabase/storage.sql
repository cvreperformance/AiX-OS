-- AiX OS — Supabase Storage Setup
-- Run in Supabase SQL Editor AFTER creating the bucket in Dashboard

-- 1. Create bucket in Dashboard: Storage → New bucket
--    Name: Proprietati (or proprietati — update NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET to match)
--    Public bucket: YES

-- 2. Public read policy for property images
insert into storage.buckets (id, name, public)
values ('Proprietati', 'Proprietati', true)
on conflict (id) do update set public = true;

-- Allow public read
create policy "Public read property images"
on storage.objects for select
using ( bucket_id = 'Proprietati' );

-- Allow authenticated admins to upload (adjust role check as needed)
create policy "Admin upload property images"
on storage.objects for insert
with check (
  bucket_id = 'Proprietati'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

create policy "Admin update property images"
on storage.objects for update
using (
  bucket_id = 'Proprietati'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

create policy "Admin delete property images"
on storage.objects for delete
using (
  bucket_id = 'Proprietati'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- 3. Gallery format in properties table (jsonb):
--    ["slug/photo1.jpg", "slug/photo2.jpg"]
--    OR store paths relative to bucket root without bucket prefix

-- 4. Example update after upload:
-- update properties
-- set gallery = '["penthouse-floreasca/hero.jpg", "penthouse-floreasca/living.jpg"]'::jsonb,
--     image_url = 'penthouse-floreasca/hero.jpg'
-- where slug = 'penthouse-floreasca';
