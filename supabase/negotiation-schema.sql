-- Souk El Business — négociation persistante (offres réelles)
-- À coller dans Supabase > SQL Editor > New query, puis "Run"

alter table listings add column negociable boolean not null default true;

create table offers (
  id serial primary key,
  listing_id integer not null references listings(id) on delete cascade,
  buyer_id text not null references sellers(id) on delete cascade,
  montant_propose numeric not null check (montant_propose > 0),
  statut text not null default 'en_attente'
    check (statut in ('en_attente', 'acceptee', 'refusee', 'contre_offre')),
  conclue_par_acheteur boolean not null default false,
  conclue_le timestamptz,
  created_at timestamptz not null default now(),
  unique (listing_id, buyer_id)
);

alter table offers enable row level security;

create policy "Buyers can create offers" on offers
  for insert with check (auth.uid()::text = buyer_id);

create policy "Buyer reads own offers" on offers
  for select using (auth.uid()::text = buyer_id);

create policy "Seller reads offers on own listings" on offers
  for select using (
    exists (
      select 1 from listings
      where listings.id = offers.listing_id
        and listings.seller_id = auth.uid()::text
    )
  );

create policy "Buyer updates own offers" on offers
  for update using (auth.uid()::text = buyer_id);

create policy "Seller updates offers on own listings" on offers
  for update using (
    exists (
      select 1 from listings
      where listings.id = offers.listing_id
        and listings.seller_id = auth.uid()::text
    )
  );
