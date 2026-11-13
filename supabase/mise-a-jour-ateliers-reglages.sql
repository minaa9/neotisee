-- =====================================================================
-- Néotisse · mise à jour du back-office : ateliers et réglages
-- À lancer UNIQUEMENT si vous aviez déjà exécuté une ancienne version de
-- schema.sql (avant l'ajout des rubriques Ateliers et Réglages).
-- Une nouvelle installation n'en a pas besoin : schema.sql contient tout.
-- =====================================================================

create table if not exists public.ateliers (
  id          text primary key default gen_random_uuid()::text,
  titre       text not null check (char_length(titre) between 1 and 120),
  accroche    text check (char_length(accroche) <= 160),
  description text not null check (char_length(description) <= 2000),
  image       text,
  ordre       int  not null default 0,
  created_at  timestamptz not null default now()
);

-- Réglages du site : une ligne par groupe (coordonnees, reseaux, photos, annonce).
create table if not exists public.reglages (
  id          text primary key check (id in ('coordonnees', 'reseaux', 'photos', 'annonce')),
  valeur      jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.ateliers enable row level security;
alter table public.reglages enable row level security;

-- Ateliers et réglages : lecture publique, gestion par l'équipe
create policy "ateliers lecture publique" on public.ateliers
  for select using (true);
create policy "ateliers gestion equipe" on public.ateliers
  for all to authenticated using (true) with check (true);
create policy "reglages lecture publique" on public.reglages
  for select using (true);
create policy "reglages gestion equipe" on public.reglages
  for all to authenticated using (true) with check (true);

