-- Souk El Business — Phase 3 : Les Talentueux (profils pro, portfolio, avis réels)
-- À coller dans Supabase > SQL Editor > New query, puis "Run"

-- Les avis de démo n'étaient pas liés à de vraies transactions : on repart
-- sur un vrai système d'avis, un seul par transaction réellement conclue.
drop table if exists reviews cascade;

create table reviews (
  id serial primary key,
  offer_id integer not null unique references offers(id) on delete cascade,
  seller_id text not null references sellers(id) on delete cascade,
  buyer_id text not null references sellers(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now()
);

alter table reviews enable row level security;

create policy "Public read reviews" on reviews for select using (true);

create policy "Buyer reviews own concluded transaction" on reviews
  for insert with check (
    auth.uid()::text = buyer_id
    and exists (
      select 1 from offers
      where offers.id = reviews.offer_id
        and offers.buyer_id = auth.uid()::text
        and offers.conclue_par_acheteur = true
    )
  );

-- Profil professionnel : métier affiché + statut "Talentueux" (activé
-- manuellement depuis Supabase pour l'instant, comme is_admin).
create table pro_profiles (
  seller_id text primary key references sellers(id) on delete cascade,
  metier text not null default '',
  verified boolean not null default false
);

alter table pro_profiles enable row level security;

create policy "Public read pro_profiles" on pro_profiles for select using (true);

create policy "Seller inserts own pro profile" on pro_profiles
  for insert with check (auth.uid()::text = seller_id);

create policy "Seller updates own pro profile" on pro_profiles
  for update using (auth.uid()::text = seller_id);

-- Portfolio : quelques réalisations en vitrine (icône + titre + description,
-- même logique que les annonces qui utilisent un émoji plutôt qu'une photo).
create table portfolio_items (
  id serial primary key,
  seller_id text not null references sellers(id) on delete cascade,
  emoji text not null default '🛠️',
  title text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

alter table portfolio_items enable row level security;

create policy "Public read portfolio_items" on portfolio_items for select using (true);

create policy "Seller inserts own portfolio items" on portfolio_items
  for insert with check (auth.uid()::text = seller_id);

create policy "Seller deletes own portfolio items" on portfolio_items
  for delete using (auth.uid()::text = seller_id);
