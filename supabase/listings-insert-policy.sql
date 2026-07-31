-- Souk El Business — autorise un vendeur connecté à publier ses propres annonces
-- À coller dans Supabase > SQL Editor > New query, puis "Run"

create policy "Users can insert own listings" on listings
  for insert with check (auth.uid()::text = seller_id);

create policy "Users can update own listings" on listings
  for update using (auth.uid()::text = seller_id);

create policy "Users can delete own listings" on listings
  for delete using (auth.uid()::text = seller_id);
