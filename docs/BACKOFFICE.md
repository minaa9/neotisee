# Back-office Néotisse

Le back-office se trouve à l'adresse **`/admin`** du site (par exemple `https://votre-site.netlify.app/admin`).

Il permet à l'équipe de gérer, sans toucher au code :

| Rubrique | Ce qu'on peut faire |
| --- | --- |
| **Tableau de bord** | Vue d'ensemble : rendez-vous à venir, messages non lus, témoignages à relire, actualités en ligne. |
| **Événements** | Ajouter, modifier, supprimer les rendez-vous du calendrier (avec photo). |
| **Actualités** | Écrire un article, le publier ou le garder en brouillon. Le plus récent est « à la une ». |
| **Livre d'or** | Relire les témoignages envoyés par les visiteurs, les publier ou les refuser. |
| **Messages** | Lire les messages du formulaire de contact et y répondre par e-mail. |

---

## Les deux modes

- **Mode démo** (par défaut) : tant que Supabase n'est pas branché, tout fonctionne mais les changements restent **dans votre navigateur**. N'importe quelle adresse e-mail permet d'entrer. Pratique pour tester et pour la soutenance.
- **Mode en ligne** : une fois Supabase branché (étapes ci-dessous), les données sont enregistrées dans une vraie base, visibles par tous les visiteurs, et seul le compte de l'association peut se connecter.

---

## Brancher Supabase (gratuit, environ 15 minutes)

### 1. Créer le projet
1. Créez un compte sur [supabase.com](https://supabase.com) (avec l'adresse de l'association).
2. **New project** → nom : `neotisse` → choisissez un mot de passe de base de données (gardez-le) → région **West EU (Paris)** pour que les données restent en Europe.

### 2. Créer les tables
1. Dans le menu de gauche : **SQL Editor** → **New query**.
2. Collez tout le contenu du fichier [`supabase/schema.sql`](../supabase/schema.sql) → **Run**.
3. (Facultatif) Nouvelle requête avec [`supabase/seed.sql`](../supabase/seed.sql) → **Run** : ajoute les rendez-vous déjà affichés sur le site.

### 3. Créer le compte de l'association
1. **Authentication** → **Sign In / Providers** → désactivez **Allow new users to sign up** (personne d'autre ne pourra créer de compte).
2. **Authentication** → **Users** → **Add user** → **Create new user** : l'adresse e-mail et un mot de passe solide, cochez **Auto Confirm User**.
3. Répétez pour chaque membre de l'équipe qui doit accéder au back-office.

### 4. Récupérer les deux clés
**Project Settings** → **API** (ou **Data API** / **API Keys**) :
- **Project URL** (ressemble à `https://abcdefgh.supabase.co`)
- la clé **anon / public** (ou **publishable key**)

> Ces deux valeurs sont faites pour être publiques : la sécurité est assurée par les règles du fichier `schema.sql`. **Ne mettez jamais** la clé `service_role` / `secret` dans le site.

### 5. Sur votre ordinateur
1. Copiez le fichier `.env.example` en `.env.local` (à la racine du projet).
2. Remplissez les deux valeurs.
3. Relancez `npm run dev`. Le bandeau « Mode démo » disparaît du back-office.

Le fichier `.env.local` n'est jamais envoyé sur GitHub.

### 6. Sur Netlify
1. Netlify → votre site → **Site configuration** → **Environment variables** → **Add a variable** :
   - `VITE_SUPABASE_URL` = l'URL du projet
   - `VITE_SUPABASE_ANON_KEY` = la clé anon / publishable
2. **Deploys** → **Trigger deploy** → **Deploy site**.

C'est tout : le back-office en ligne est branché.

---

## Comment ça marche (pour les curieux)

- `src/lib/store.js` : lit et écrit les données (Supabase, ou le navigateur en mode démo).
- `src/lib/usePublic.js` : les pages du site (calendrier, actualités, livre d'or, accueil) affichent les contenus du back-office. Si la base est injoignable, elles gardent les contenus d'origine.
- `src/admin/` : les pages du back-office.
- Le formulaire de contact et le livre d'or enregistrent les envois dans la base (en mode démo, ils ouvrent aussi la messagerie comme avant).
- Les témoignages envoyés arrivent **en attente** : ils n'apparaissent sur le site qu'après avoir été publiés dans le back-office.
