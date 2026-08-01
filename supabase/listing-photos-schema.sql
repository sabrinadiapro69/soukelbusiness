-- Souk El Business — photos réelles pour les annonces (1 à 3 par annonce)
-- À coller dans Supabase > SQL Editor > New query, puis "Run"

alter table listings add column photos text[] not null default '{}';

-- Espace de stockage public pour les photos d'annonces (même principe que
-- le portfolio des Talentueux).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-photos',
  'listing-photos',
  true,
  5242880, -- 5 Mo
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

create policy "Public read listing photos" on storage.objects
  for select using (bucket_id = 'listing-photos');

create policy "Sellers upload their own listing photos" on storage.objects
  for insert with check (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Sellers delete their own listing photos" on storage.objects
  for delete using (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
