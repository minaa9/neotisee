-- =====================================================================
-- Néotisse · mise à jour du back-office : textes du site et statistiques
-- À lancer UNE FOIS dans Supabase > SQL Editor > New query > Run
-- si votre base existait déjà avant l'ajout de :
--   · Réglages › Textes du site   (ligne « textes »)
--   · Statistiques › Objectifs    (ligne « objectifs »)
-- Peut être relancé sans danger : rien n'est effacé.
-- =====================================================================

alter table public.reglages drop constraint if exists reglages_id_check;
alter table public.reglages
  add constraint reglages_id_check
  check (id in ('coordonnees', 'reseaux', 'photos', 'annonce', 'textes', 'objectifs'));
