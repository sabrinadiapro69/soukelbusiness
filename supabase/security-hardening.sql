-- Souk El Business — renforcements de sécurité
-- À coller dans Supabase > SQL Editor > New query, puis "Run"

-- Empêche l'upload de fichiers trop volumineux ou d'un type autre qu'image
-- dans le portfolio, même si quelqu'un contournait les vérifications du site.
update storage.buckets
set file_size_limit = 5242880, -- 5 Mo
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
where id = 'portfolio-photos';
