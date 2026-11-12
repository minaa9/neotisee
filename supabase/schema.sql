-- =====================================================================
-- Néotisse · base de données du back-office (Supabase)
-- À coller une seule fois dans Supabase > SQL Editor > New query > Run.
-- Voir docs/BACKOFFICE.md.
-- =====================================================================

-- ---------------------------------------------------------------- Tables

create table if not exists public.evenements (
  id          uuid primary key default gen_random_uuid(),
  titre       text not null check (char_length(titre) between 1 and 200),
  court       text check (char_length(court) <= 80),
  categorie   text not null check (categorie in ('atelier', 'evenement', 'conference', 'exposition')),
  date        date not null,
  debut       text not null default '10:00',
  fin         text not null default '16:00',
  lieu        text default 'Montpellier',
  description text check (char_length(description) <= 2000),
  image       text,
  created_at  timestamptz not null default now()
);

create table if not exists public.actualites (
  id          uuid primary key default gen_random_uuid(),
  titre       text not null check (char_length(titre) between 1 and 200),
  rubrique    text,
  paragraphes text[] not null default '{}',
  image       text,
  alt         text,
  publie      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.temoignages (
  id          uuid primary key default gen_random_uuid(),
  prenom      text check (char_length(prenom) <= 60),
  atelier     text check (char_length(atelier) <= 120),
  note        int  check (note between 1 and 5),
  texte       text not null check (char_length(texte) between 10 and 1500),
  date        text,
  statut      text not null default 'en_attente' check (statut in ('en_attente', 'publie', 'refuse')),
  created_at  timestamptz not null default now()
);

create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  nom         text not null check (char_length(nom) between 1 and 120),
  email       text not null check (char_length(email) <= 200),
  profil      text check (char_length(profil) <= 60),
  objet       text check (char_length(objet) <= 120),
  message     text not null check (char_length(message) between 10 and 5000),
  rdv         text,
  lu          boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------- Sécurité
-- Principe : les visiteurs peuvent LIRE ce qui est public et ENVOYER un
-- message ou un témoignage. Tout le reste est réservé aux membres de
-- l'association connectés au back-office.

alter table public.evenements  enable row level security;
alter table public.actualites  enable row level security;
alter table public.temoignages enable row level security;
alter table public.messages    enable row level security;

-- Événements : lecture publique, gestion par l'équipe
create policy "evenements lecture publique" on public.evenements
  for select using (true);
create policy "evenements gestion equipe" on public.evenements
  for all to authenticated using (true) with check (true);

-- Actualités : seules les publiées sont visibles du public
create policy "actualites lecture publique" on public.actualites
  for select using (publie = true);
create policy "actualites gestion equipe" on public.actualites
  for all to authenticated using (true) with check (true);

-- Témoignages : le public voit les publiés et peut en proposer (toujours « en attente »)
create policy "temoignages lecture publique" on public.temoignages
  for select using (statut = 'publie');
create policy "temoignages envoi public" on public.temoignages
  for insert to anon with check (statut = 'en_attente');
create policy "temoignages gestion equipe" on public.temoignages
  for all to authenticated using (true) with check (true);

-- Messages : le public peut seulement en envoyer, jamais les lire
create policy "messages envoi public" on public.messages
  for insert to anon with check (lu = false);
create policy "messages gestion equipe" on public.messages
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------- Photos
-- Dossier public « images » pour les photos des événements et actualités.

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "images lecture publique" on storage.objects
  for select using (bucket_id = 'images');
create policy "images envoi equipe" on storage.objects
  for insert to authenticated with check (bucket_id = 'images');
create policy "images suppression equipe" on storage.objects
  for delete to authenticated using (bucket_id = 'images');
