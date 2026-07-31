-- Souk El Business — recadrage des données de démonstration
-- À coller dans Supabase > SQL Editor > New query, puis "Run"
-- Ne touche que les 12 vendeurs/annonces de démo créés au tout début
-- (par leur id fixe) — aucun compte ou annonce réel n'est modifié.

update sellers set city = 'Alger', description = 'Atelier familial spécialisé dans le cuivre martelé depuis trois générations. Chaque pièce est façonnée et gravée à la main dans notre atelier d''Alger.' where id = 'atelier-nour';
update sellers set city = 'Ghardaïa', description = 'Sélection de tapis et textiles berbères tissés par des coopératives de femmes artisanes du Sud algérien. Chaque achat soutient directement les productrices.' where id = 'maison-zayn';
update sellers set city = 'Alger', description = 'Traiteur et pâtisserie traditionnelle algérienne : makrout, épices, plats préparés à la commande.' where id = 'epices-amir';
update sellers set city = 'Tlemcen' where id = 'sarah-m';
update sellers set city = 'Annaba' where id = 'yasmine-b';
update sellers set city = 'Sétif' where id = 'amine-k';
update sellers set city = 'Alger', description = 'Boutique dédiée aux cosmétiques traditionnels algériens : savon noir, gommage, huiles.' where id = 'hammam-beaute';
update sellers set city = 'Constantine', description = 'Amateur d''artisanat local, je revends quelques pièces ramenées de mes voyages en Algérie.' where id = 'karim-t';
update sellers set city = 'Béjaïa' where id = 'nadia-f';
update sellers set city = 'Oran' where id = 'bijoux-layla';
update sellers set city = 'Sidi Bel Abbès' where id = 'leila-r';
update sellers set city = 'Tizi Ouzou', description = 'Maroquinerie artisanale en cuir véritable, cousue main selon les techniques traditionnelles kabyles.' where id = 'cuir-fil';

update listings set category = 'Artisanat & Métiers', location = 'Alger', price = 4500 where seller_id = 'atelier-nour';
update listings set category = 'Maison & Jardin', location = 'Ghardaïa', price = 22000 where seller_id = 'maison-zayn';
update listings set title = 'Coffret de pâtisseries traditionnelles', category = 'Artisanat & Métiers', location = 'Alger', price = 2500, description = 'Assortiment de pâtisseries et épices traditionnelles algériennes : makrout, ras el hanout, cumin, paprika fumé. Préparé à la commande.' where seller_id = 'epices-amir';
update listings set category = 'Dressing', location = 'Tlemcen', price = 1800, description = 'Babouches brodées taille 38, portées seulement deux fois. Très bon état, artisanat local. Vente pour cause de taille non adaptée.' where seller_id = 'sarah-m';
update listings set category = 'Dressing', location = 'Annaba', price = 6500 where seller_id = 'yasmine-b';
update listings set category = 'Dressing', location = 'Sétif', price = 4200 where seller_id = 'amine-k';
update listings set category = 'Artisanat & Métiers', location = 'Alger', price = 1200, description = 'Lot de 3 savons noirs traditionnels à l''huile d''olive, parfaits pour le gommage au hammam. Fabrication artisanale locale.' where seller_id = 'hammam-beaute';
update listings set title = 'Plateau en laiton ciselé', category = 'Artisanat & Métiers', location = 'Constantine', price = 6000, description = 'Plateau en laiton ciselé, diamètre 45cm, avec ses pieds pliants en bois. Artisanat local, jamais utilisé.' where seller_id = 'karim-t';
update listings set title = 'Lanterne en fer forgé', category = 'Maison & Jardin', location = 'Béjaïa', price = 4500, description = 'Lanterne en fer forgé et verre coloré, hauteur 35cm. Parfaite pour une ambiance à la bougie ou avec une guirlande LED.' where seller_id = 'nadia-f';
update listings set category = 'Dressing', location = 'Oran', price = 3000, description = 'Coffret de 5 bijoux fantaisie assortis (bracelets et boucles d''oreilles), inspiration berbère. Idéal pour offrir.' where seller_id = 'bijoux-layla';
update listings set title = 'Huile d''olive artisanale 500ml', category = 'Artisanat & Métiers', location = 'Sidi Bel Abbès', price = 1500, description = 'Flacon d''huile d''olive pressée à froid, production familiale de Kabylie. Entamé à environ 10%, vendu car j''en ai reçu deux en double.' where seller_id = 'leila-r';
update listings set category = 'Dressing', location = 'Tizi Ouzou', price = 8000, description = 'Sac en cuir véritable, cousu main selon les techniques traditionnelles kabyles. Doublure en coton, fermoir en laiton.' where seller_id = 'cuir-fil';
