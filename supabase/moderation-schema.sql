-- Souk El Business — modération des annonces
-- À coller dans Supabase > SQL Editor > New query, puis "Run"

-- Statut des annonces : les annonces existantes restent visibles (approuvées),
-- seules les nouvelles publications passeront désormais par la modération.
alter table listings add column status text not null default 'approved'
  check (status in ('pending', 'approved', 'rejected'));
alter table listings alter column status set default 'pending';

-- Droits d'administratrice
alter table sellers add column is_admin boolean not null default false;

update sellers set is_admin = true
where id = (select id::text from auth.users where email = 'contact@one-concept.fr');

-- Seules les annonces approuvées sont visibles publiquement
drop policy "Public read listings" on listings;
create policy "Public read approved listings" on listings
  for select using (status = 'approved');

-- Une vendeuse/un vendeur voit aussi ses propres annonces, même en attente
create policy "Sellers read own listings" on listings
  for select using (auth.uid()::text = seller_id);

-- L'administratrice voit et modère toutes les annonces
create policy "Admins read all listings" on listings
  for select using (
    exists (select 1 from sellers where id = auth.uid()::text and is_admin = true)
  );

create policy "Admins update any listing" on listings
  for update using (
    exists (select 1 from sellers where id = auth.uid()::text and is_admin = true)
  );

create policy "Admins delete any listing" on listings
  for delete using (
    exists (select 1 from sellers where id = auth.uid()::text and is_admin = true)
  );
