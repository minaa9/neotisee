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
