-- =====================================================================
-- Néotisse · rendez-vous de départ (facultatif)
-- Recopie dans la base les 4 rendez-vous actuellement affichés sur le site,
-- pour que le calendrier ne soit pas vide au moment du branchement.
-- À lancer une seule fois, APRÈS schema.sql. Les photos pourront être
-- ajoutées ensuite depuis le back-office.
-- =====================================================================

insert into public.evenements (titre, court, categorie, date, debut, fin, lieu, description) values
  ('Initiation au filage de la laine', 'Initiation au filage', 'atelier', '2026-11-08', '10:00', '16:00', 'Montpellier',
   'Découvrez les gestes du filage traditionnel et apprenez à transformer la laine en fil, comme autrefois.'),
  ('Teinture végétale : les couleurs du vivant', 'Teinture végétale', 'evenement', '2026-11-19', '10:00', '16:00', 'Montpellier',
   'Explorez les pigments naturels et découvrez comment les plantes permettent de teindre les fibres textiles.'),
  ('Le textile dans l’Égypte ancienne', 'Le textile dans l’Égypte ancienne', 'conference', '2026-11-28', '14:00', '16:00', 'Montpellier',
   'Des sources écrites aux vestiges : la place du textile dans les sociétés de l’Égypte ancienne.'),
  ('Journée spéciale patrimoine textile', 'Patrimoine textile', 'exposition', '2026-12-05', '10:00', '17:00', 'Montpellier',
   'Tissus, outils et reconstitutions : une journée pour découvrir le patrimoine textile, du Néolithique au Moyen Âge.');

-- Les quatre ateliers affichés sur le site (les photos d'origine restent
-- utilisées tant qu'aucune photo n'est choisie dans le back-office).
insert into public.ateliers (id, titre, accroche, description, ordre) values
  ('filage', 'Filage de la laine', 'Le geste ancestral du filage', 'Du fuseau à la quenouille, découvrez le geste ancestral qui transforme la fibre en fil. Après une présentation des outils retrouvés en fouille, chacun·e s’essaie au filage de la laine brute.', 1),
  ('tissage', 'Tissage traditionnel', 'Le tissage sur métier', 'Initiez-vous au tissage sur métier, comme on le pratiquait du Néolithique au Moyen Âge. Chaîne, trame, motifs : on apprend à lire un tissu ancien avant de tisser sa propre bande.', 2),
  ('teinture', 'Teinture végétale', 'Les couleurs naturelles du passé', 'Garance, gaude, pastel… Explorez les couleurs naturelles du passé et découvrez comment les plantes permettent de teindre les fibres textiles.', 3),
  ('broderie', 'Broderie historique', 'Les motifs d’antan', 'Redécouvrez les motifs d’antan et les points utilisés sur les textiles anciens, puis brodez votre propre motif inspiré des pièces archéologiques.', 4)
on conflict (id) do nothing;
