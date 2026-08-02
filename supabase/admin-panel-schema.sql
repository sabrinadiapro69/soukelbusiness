-- Souk El Business — panneau d'administration
-- À coller dans Supabase > SQL Editor > New query, puis "Run"
--
-- IMPORTANT — après avoir exécuté ce script, créez votre premier compte
-- administrateur manuellement (remplacez l'email par le vôtre) :
--
--   update sellers set role = 'admin'
--   where id = (select id::text from auth.users where email = 'votre-email@exemple.com');
--
-- Ce n'est volontairement pas possible depuis l'interface du site, pour
-- qu'aucun utilisateur ne puisse jamais s'attribuer ce rôle lui-même.

-- 1. Rôles -------------------------------------------------------------

alter table sellers add column role text not null default 'user'
  check (role in ('user', 'moderateur', 'admin'));

-- Fait correspondre le rôle au champ is_admin existant (conservé tel
-- quel, non utilisé par le nouveau code mais rien ne le supprime).
update sellers set role = 'admin' where is_admin = true;

-- Empêche la modification de son propre rôle, même via un appel direct
-- à l'API Supabase (et pas seulement en cachant le bouton dans
-- l'interface) : on retire le droit de modifier cette colonne à tous
-- les comptes connectés. Les changements de rôle se font uniquement
-- manuellement dans Supabase (aucune fonctionnalité de l'interface n'en
-- a besoin pour cette première version).
revoke update (role) on sellers from authenticated;

-- Note sur la recherche par email (/admin/utilisateurs) : l'email vit
-- dans auth.users, une table que l'app ne peut pas lire via une requête
-- normale. On ne le recopie PAS dans sellers (qui est en lecture
-- publique — "Public read sellers" — donc y stocker l'email finirait
-- par l'exposer publiquement, une simple restriction de colonne ne
-- suffit pas ici car "select *" sur sellers est utilisé partout dans le
-- site). La recherche par email se fait donc côté serveur avec la clé
-- service_role, via l'API Admin de Supabase (auth.admin.listUsers),
-- jamais en stockant une copie de l'email dans une table publique.

-- pro_profiles.verified existe déjà (voir talentueux-schema.sql). On
-- ajoute juste une colonne pour distinguer "jamais examiné" de "examiné
-- et rejeté" : sans elle, un profil rejeté (verified reste false)
-- réapparaîtrait indéfiniment dans la file d'attente à chaque visite.
alter table pro_profiles add column reviewed_at timestamptz;

-- 2. Suspension de compte ------------------------------------------------

alter table sellers add column status text not null default 'actif'
  check (status in ('actif', 'suspendu'));

-- Même protection que pour le rôle : seules les actions admin (qui
-- utilisent la clé service_role côté serveur, en dehors de RLS) peuvent
-- changer ce statut.
revoke update (status) on sellers from authenticated;

-- Les policies "Admins ..." sur listings (moderation-schema.sql) se
-- basaient sur is_admin. On les fait pointer sur role='admin', qui
-- devient la seule source de vérité pour les droits d'administration.
drop policy "Admins read all listings" on listings;
create policy "Admins read all listings" on listings
  for select using (
    exists (select 1 from sellers where id = auth.uid()::text and role = 'admin')
  );

drop policy "Admins update any listing" on listings;
create policy "Admins update any listing" on listings
  for update using (
    exists (select 1 from sellers where id = auth.uid()::text and role = 'admin')
  );

drop policy "Admins delete any listing" on listings;
create policy "Admins delete any listing" on listings
  for delete using (
    exists (select 1 from sellers where id = auth.uid()::text and role = 'admin')
  );

-- 3. Signalements ----------------------------------------------------------

create table reports (
  id serial primary key,
  type text not null check (type in ('annonce', 'utilisateur')),
  target_id text not null,
  reporter_id text not null references sellers(id) on delete cascade,
  motif text not null,
  description text not null default '',
  statut text not null default 'en_attente'
    check (statut in ('en_attente', 'traite', 'rejete')),
  created_at timestamptz not null default now()
);

alter table reports enable row level security;

create policy "User creates own report" on reports
  for insert with check (auth.uid()::text = reporter_id);

create policy "Admin reads all reports" on reports
  for select using (
    exists (select 1 from sellers where id = auth.uid()::text and role = 'admin')
  );

create policy "Admin updates reports" on reports
  for update using (
    exists (select 1 from sellers where id = auth.uid()::text and role = 'admin')
  );

-- 4. Journal d'audit --------------------------------------------------------

create table audit_log (
  id serial primary key,
  admin_id text references sellers(id) on delete set null,
  action text not null,
  cible_type text not null,
  cible_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

alter table audit_log enable row level security;

create policy "Admin reads audit_log" on audit_log
  for select using (
    exists (select 1 from sellers where id = auth.uid()::text and role = 'admin')
  );

create policy "Admin inserts audit_log" on audit_log
  for insert with check (
    exists (select 1 from sellers where id = auth.uid()::text and role = 'admin')
  );
