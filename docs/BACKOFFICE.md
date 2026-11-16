# Back-office Néotisse

Le back-office se trouve à l'adresse **`/admin`** du site (par exemple `https://votre-site.netlify.app/admin`).

Il permet à l'équipe de gérer, sans toucher au code :

| Rubrique | Ce qu'on peut faire |
| --- | --- |
| **Tableau de bord** | Vue d'ensemble : rendez-vous à venir, messages non lus, témoignages à relire, actualités en ligne. |
| **Événements** | Ajouter, modifier, supprimer les rendez-vous du calendrier (avec photo). |
| **Actualités** | Écrire un article, le publier ou le garder en brouillon. Le plus récent est « à la une ». |
| **Ateliers** | Changer le nom, l'accroche, la description et la photo des ateliers, en ajouter, les réordonner. |
| **Livre d'or** | Relire les témoignages envoyés par les visiteurs, les publier ou les refuser. |
| **Messages** | Lire les messages du formulaire de contact, y répondre par e-mail, les marquer lus / non lus, les exporter. |
| **Réglages** | Coordonnées, réseaux sociaux, photos des pages, bandeau d'annonce, mot de passe, export des données. |

---

## Les deux modes

- **Mode démo** : tant que Supabase n'est pas branché, le back-office s'ouvre **uniquement sur votre ordinateur** (`npm run dev`, adresse `localhost`). N'importe quelle adresse e-mail permet d'entrer, et les changements restent dans votre navigateur. Pratique pour tester.
- **Sur le site en ligne sans Supabase**, la page `/admin` affiche « Espace fermé » : **personne ne peut entrer**. (Pour une soutenance sans Supabase, on peut ajouter la variable `VITE_ADMIN_DEMO=true` sur Netlify, puis la retirer ensuite.)
- **Mode en ligne** : une fois Supabase branché (étapes ci-dessous), les données sont enregistrées dans une vraie base, et seuls les comptes créés par l'association peuvent se connecter.

## La sécurité, en bref

| Protection | Comment |
| --- | --- |
| Personne ne peut s'inscrire | Les comptes sont créés à la main dans Supabase (inscriptions désactivées). |
| Mots de passe | Jamais stockés en clair (Supabase), 10 caractères minimum avec une jauge de solidité. |
| Essais répétés | Après 5 erreurs, la connexion est bloquée 2 minutes (et Supabase limite aussi les essais). |
| Session oubliée ouverte | Déconnexion automatique après 30 minutes sans activité. |
| Changer le mot de passe | Le mot de passe actuel est redemandé. |
| Ordinateur perdu | Réglages → Compte et sécurité → « Déconnecter tous les appareils ». |
| Données | Règles de la base (RLS) : un visiteur peut seulement envoyer un message ou un témoignage, jamais lire ni modifier. |
| Hébergement | En-têtes de sécurité Netlify, `/admin` jamais référencé par Google. |

---

## Brancher Supabase (gratuit, environ 15 minutes)

### 1. Créer le projet
1. Créez un compte sur [supabase.com](https://supabase.com) (avec l'adresse de l'association).
2. **New project** → nom : `neotisse` → choisissez un mot de passe de base de données (gardez-le) → région **West EU (Paris)** pour que les données restent en Europe.

### 2. Créer les tables
1. Dans le menu de gauche : **SQL Editor** → **New query**.
2. Collez tout le contenu du fichier [`supabase/schema.sql`](../supabase/schema.sql) → **Run**.
3. (Facultatif) Nouvelle requête avec [`supabase/seed.sql`](../supabase/seed.sql) → **Run** : ajoute les rendez-vous et les ateliers déjà affichés sur le site.

> Vous aviez déjà lancé `schema.sql` avant l'arrivée des rubriques **Ateliers** et **Réglages** ? Lancez seulement [`supabase/mise-a-jour-ateliers-reglages.sql`](../supabase/mise-a-jour-ateliers-reglages.sql).

### 3. Créer le compte (avec votre adresse)
1. **Authentication** → **Sign In / Providers** → désactivez **Allow new users to sign up** (personne d'autre ne pourra créer de compte).
2. **Authentication** → **Users** → **Add user** → **Create new user** : **votre** adresse e-mail et un mot de passe solide (10 caractères ou plus, majuscules, chiffres, symbole), cochez **Auto Confirm User**.
3. **Authentication** → **URL Configuration** :
   - **Site URL** : l'adresse du site, par ex. `https://votre-site.netlify.app`
   - **Redirect URLs** → **Add URL** : `https://votre-site.netlify.app/admin/**` (et `http://localhost:5173/admin/**` pour tester en local)

   Sans cette étape, les liens « mot de passe oublié » et « changement d'adresse » ne ramènent pas au site.

### Transmettre l'accès à l'association
Une fois le site prêt, sans jamais leur donner votre mot de passe définitif :
1. Connectez-vous → **Réglages** → **Compte et sécurité** → **Adresse e-mail de connexion** : mettez l'adresse de l'association, puis cliquez sur les liens de confirmation reçus.
2. La personne de l'association va sur `/admin`, clique sur **Mot de passe oublié ?** et choisit **son** mot de passe. Le vôtre ne fonctionne plus.
3. Elle clique sur **Déconnecter tous les appareils** : plus personne d'autre n'est connecté.

Pour ajouter un autre membre de l'équipe : refaites l'étape 3.2 avec son adresse.

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
