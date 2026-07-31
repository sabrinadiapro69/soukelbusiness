-- Souk El Business — Phase 4 : taux de change DA/EUR indicatif
-- À coller dans Supabase > SQL Editor > New query, puis "Run"

create table parametres (
  id integer primary key default 1,
  taux_eur_da numeric not null default 260,
  updated_at timestamptz not null default now(),
  constraint parametres_single_row check (id = 1)
);

insert into parametres (id, taux_eur_da) values (1, 260)
on conflict (id) do nothing;

alter table parametres enable row level security;

create policy "Public read parametres" on parametres for select using (true);

-- Pour changer le taux affiché sur le site : Table Editor > parametres >
-- modifier la valeur de taux_eur_da (nombre de DA pour 1 €), puis "Save".
