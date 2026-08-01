-- Souk El Business — recherches enregistrées
-- À coller dans Supabase > SQL Editor > New query, puis "Run"

create table saved_searches (
  id serial primary key,
  user_id text not null references sellers(id) on delete cascade,
  query text not null default '',
  category text not null default 'Toutes catégories',
  created_at timestamptz not null default now()
);

alter table saved_searches enable row level security;

create policy "User creates own saved searches" on saved_searches
  for insert with check (auth.uid()::text = user_id);

create policy "User reads own saved searches" on saved_searches
  for select using (auth.uid()::text = user_id);

create policy "User deletes own saved searches" on saved_searches
  for delete using (auth.uid()::text = user_id);
