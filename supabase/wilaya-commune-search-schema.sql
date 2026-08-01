-- Souk El Business — recherche par wilaya + commune
-- À exécuter APRÈS supabase/saved-searches-schema.sql
-- À coller dans Supabase > SQL Editor > New query, puis "Run"

-- La colonne "location" des annonces contient déjà le nom de la wilaya
-- (choisie via un menu déroulant au dépôt de l'annonce) : rien à changer
-- de ce côté. Seule la commune est nouvelle.
alter table listings add column commune text;

alter table saved_searches add column wilaya text;
alter table saved_searches add column commune text;
