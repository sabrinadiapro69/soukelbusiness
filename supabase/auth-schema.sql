-- Souk El Business — inscription/connexion
-- À coller dans Supabase > SQL Editor > New query, puis "Run"
-- (à exécuter après schema.sql)

-- Autorise un utilisateur connecté à modifier son propre profil vendeur
create policy "Users can update own seller profile" on sellers
  for update using (auth.uid()::text = id);

-- Crée automatiquement un profil vendeur quand quelqu'un s'inscrit,
-- à partir des infos passées dans le formulaire d'inscription
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.sellers (id, name, type, city, avatar_emoji)
  values (
    new.id::text,
    coalesce(new.raw_user_meta_data->>'name', 'Nouveau vendeur'),
    coalesce(new.raw_user_meta_data->>'type', 'particulier'),
    coalesce(new.raw_user_meta_data->>'city', ''),
    '🙂'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
