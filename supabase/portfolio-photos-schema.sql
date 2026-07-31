-- Souk El Business — Portfolio en vraies photos (1 à 3 par réalisation)
-- À coller dans Supabase > SQL Editor > New query, puis "Run"

-- La table portfolio_items utilisait un simple émoji comme icône ; on la
-- remplace par de vraies photos hébergées dans Supabase Storage.
drop table if exists portfolio_items cascade;

create table portfolio_items (
  id serial primary key,
  seller_id text not null references sellers(id) on delete cascade,
  title text not null,
  description text not null default '',
  photos text[] not null,
  created_at timestamptz not null default now(),
  constraint portfolio_items_photos_length check (array_length(photos, 1) between 1 and 3)
);

alter table portfolio_items enable row level security;

create policy "Public read portfolio_items" on portfolio_items for select using (true);

create policy "Seller inserts own portfolio items" on portfolio_items
  for insert with check (auth.uid()::text = seller_id);

create policy "Seller deletes own portfolio items" on portfolio_items
  for delete using (auth.uid()::text = seller_id);

-- Espace de stockage public pour les photos de portfolio.
insert into storage.buckets (id, name, public)
values ('portfolio-photos', 'portfolio-photos', true)
on conflict (id) do nothing;

create policy "Public read portfolio photos" on storage.objects
  for select using (bucket_id = 'portfolio-photos');

create policy "Sellers upload their own portfolio photos" on storage.objects
  for insert with check (
    bucket_id = 'portfolio-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Sellers delete their own portfolio photos" on storage.objects
  for delete using (
    bucket_id = 'portfolio-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
