-- Souk El Business — schéma initial (vendeurs, annonces, avis)
-- À coller dans Supabase > SQL Editor > New query, puis "Run"

create table sellers (
  id text primary key,
  name text not null,
  type text not null check (type in ('particulier', 'pro')),
  avatar_emoji text not null default '🛍️',
  description text not null default '',
  city text not null,
  member_since date not null default now(),
  transactions_count integer not null default 0,
  rating numeric(2, 1) not null default 0,
  created_at timestamptz not null default now()
);

create table listings (
  id serial primary key,
  seller_id text not null references sellers(id) on delete cascade,
  title text not null,
  price numeric not null check (price > 0),
  category text not null,
  location text not null,
  emoji text not null default '🛍️',
  description text not null default '',
  created_at timestamptz not null default now()
);

create table reviews (
  id serial primary key,
  seller_id text not null references sellers(id) on delete cascade,
  author text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now()
);

-- Lecture publique (le site affiche ces données à tous les visiteurs)
alter table sellers enable row level security;
alter table listings enable row level security;
alter table reviews enable row level security;

create policy "Public read sellers" on sellers for select using (true);
create policy "Public read listings" on listings for select using (true);
create policy "Public read reviews" on reviews for select using (true);

-- Données de départ (reprend les annonces de démo actuelles du site)
insert into sellers (id, name, type, avatar_emoji, description, city, member_since, transactions_count, rating) values
  ('atelier-nour', 'Atelier Nour', 'pro', '🫖', 'Atelier familial spécialisé dans le cuivre martelé depuis trois générations. Chaque pièce est façonnée et gravée à la main dans notre atelier de Marseille.', 'Marseille', '2022-03-01', 214, 4.8),
  ('maison-zayn', 'Maison Zayn', 'pro', '🧶', 'Sélection de tapis et textiles berbères tissés par des coopératives de femmes artisanes. Chaque achat soutient directement les productrices.', 'Lyon', '2021-06-01', 132, 4.9),
  ('epices-amir', 'Épices Amir', 'pro', '🌶️', 'Grossiste en épices originaires du Maghreb et du Moyen-Orient. Produits sourcés directement auprès de petits producteurs.', 'Paris', '2020-01-01', 587, 4.7),
  ('sarah-m', 'Sarah M.', 'particulier', '👡', 'Je revends de temps en temps des vêtements et accessoires ramenés de voyage, toujours en très bon état.', 'Toulouse', '2023-09-01', 9, 4.5),
  ('yasmine-b', 'Yasmine B.', 'particulier', '💍', 'Passionnée de bijoux anciens, je vends quelques pièces de ma collection personnelle.', 'Nice', '2023-05-01', 5, 5.0),
  ('amine-k', 'Amine K.', 'particulier', '🧵', 'Je vends des vêtements traditionnels portés une ou deux fois seulement.', 'Lille', '2023-11-01', 3, 4.3),
  ('hammam-beaute', 'Hammam Beauté', 'pro', '🧴', 'Boutique en ligne dédiée aux cosmétiques traditionnels : savon noir, gommage, huiles essentielles.', 'Paris', '2021-02-01', 341, 4.6),
  ('karim-t', 'Karim T.', 'particulier', '🏺', 'Amateur d''artisanat marocain, je revends quelques pièces ramenées de mes voyages.', 'Bordeaux', '2023-07-01', 7, 4.7),
  ('nadia-f', 'Nadia F.', 'particulier', '🏮', 'Je décore ma maison à l''orientale et je revends parfois quelques objets en double.', 'Strasbourg', '2023-04-01', 4, 4.5),
  ('bijoux-layla', 'Bijoux Layla', 'pro', '💎', 'Créatrice de bijoux fantaisie inspirés de l''artisanat oriental, fabriqués en petites séries.', 'Marseille', '2022-10-01', 168, 4.8),
  ('leila-r', 'Leïla R.', 'particulier', '🌿', 'Je revends des produits de beauté ramenés de voyage que je n''utilise pas assez vite.', 'Nantes', '2023-12-01', 2, 4.0),
  ('cuir-fil', 'Cuir & Fil', 'pro', '👜', 'Maroquinerie artisanale en cuir véritable, cousue main selon les techniques traditionnelles marocaines.', 'Lyon', '2020-08-01', 402, 4.9);

insert into listings (seller_id, title, price, category, location, emoji, description) values
  ('atelier-nour', 'Théière en cuivre gravée', 45, 'Maison & Déco', 'Marseille', '🫖', 'Théière artisanale en cuivre martelé, gravée à la main selon un savoir-faire traditionnel. Contenance 1L, idéale pour le thé à la menthe. Livrée avec son coffret.'),
  ('maison-zayn', 'Tapis berbère fait main', 180, 'Maison & Déco', 'Lyon', '🧶', 'Tapis berbère tissé main en laine naturelle, motifs authentiques. Dimensions 200x140cm. Pièce unique, chaque tapis diffère légèrement de par sa fabrication artisanale.'),
  ('epices-amir', 'Coffret d''épices du souk', 22, 'Épicerie fine', 'Paris', '🌶️', 'Coffret de 8 épices sélectionnées directement au souk : ras el hanout, cumin, paprika fumé, curcuma et plus encore. Idéal pour découvrir les saveurs orientales.'),
  ('sarah-m', 'Babouches brodées, peu portées', 18, 'Mode & Textile', 'Toulouse', '👡', 'Babouches brodées taille 38, portées seulement deux fois. Très bon état, ramenées d''un voyage au Maroc. Vente pour cause de taille non adaptée.'),
  ('yasmine-b', 'Collier argent ciselé', 60, 'Bijoux', 'Nice', '💍', 'Collier en argent massif ciselé à la main, motifs berbères traditionnels. Bijou de famille en excellent état, vendu avec son certificat d''authenticité.'),
  ('amine-k', 'Kaftan brodé, taille M', 35, 'Mode & Textile', 'Lille', '🧵', 'Kaftan brodé main, taille M, porté une seule fois pour une occasion spéciale. Couleur bordeaux, broderies dorées. Nettoyé à sec, prêt à porter.'),
  ('hammam-beaute', 'Savon noir traditionnel x3', 12, 'Beauté', 'Paris', '🧴', 'Lot de 3 savons noirs traditionnels à l''huile d''olive, parfaits pour le gommage au hammam. Fabrication artisanale, sans additifs chimiques.'),
  ('karim-t', 'Plateau marocain artisanal', 55, 'Artisanat', 'Bordeaux', '🏺', 'Plateau en laiton ciselé, diamètre 45cm, avec ses pieds pliants en bois. Rapporté du souk de Marrakech, jamais utilisé, toujours dans son emballage d''origine.'),
  ('nadia-f', 'Lanterne marocaine en fer forgé', 40, 'Maison & Déco', 'Strasbourg', '🏮', 'Lanterne en fer forgé et verre coloré, hauteur 35cm. Parfaite pour une ambiance orientale à la bougie ou avec une guirlande LED.'),
  ('bijoux-layla', 'Coffret bijoux fantaisie x5', 28, 'Bijoux', 'Marseille', '💎', 'Coffret de 5 bijoux fantaisie assortis (bracelets et boucles d''oreilles), inspiration orientale. Idéal pour compléter une tenue ou offrir en cadeau.'),
  ('leila-r', 'Huile d''argan pure 100ml', 15, 'Beauté', 'Nantes', '🌿', 'Flacon d''huile d''argan pure 100ml, rapportée directement du Maroc, pressée à froid. Entamée à environ 10%, vendue car j''en ai reçu deux en double.'),
  ('cuir-fil', 'Sac en cuir cousu main', 75, 'Mode & Textile', 'Lyon', '👜', 'Sac en cuir véritable, cousu main selon les techniques traditionnelles marocaines. Doublure en coton, fermoir en laiton. Existe en plusieurs coloris sur demande.');

insert into reviews (seller_id, author, rating, comment) values
  ('atelier-nour', 'Camille D.', 5, 'Théière magnifique, exactement comme sur les photos.'),
  ('atelier-nour', 'Farid B.', 4, 'Très bon échange, négociation facile et rapide.'),
  ('maison-zayn', 'Julien P.', 5, 'Tapis sublime, vendeur de confiance.'),
  ('epices-amir', 'Nora H.', 5, 'Épices très parfumées, envoi rapide.'),
  ('epices-amir', 'Marc L.', 4, 'Bon rapport qualité-prix.'),
  ('sarah-m', 'Inès T.', 4, 'Vendeuse sympa, prix négocié facilement.'),
  ('yasmine-b', 'Paul V.', 5, 'Bijou conforme, super négociation, vendeuse au top.'),
  ('hammam-beaute', 'Sophie M.', 5, 'Produits authentiques, livraison soignée.'),
  ('karim-t', 'Élodie R.', 5, 'Plateau magnifique, très bonne négociation sur le prix.'),
  ('bijoux-layla', 'Chloé F.', 5, 'Bijoux magnifiques, très réactive aux messages.'),
  ('cuir-fil', 'Antoine G.', 5, 'Sac superbe, qualité irréprochable.'),
  ('cuir-fil', 'Manon S.', 5, 'Deuxième achat chez eux, toujours parfait.');
