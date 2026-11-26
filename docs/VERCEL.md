# Mettre le site en ligne sur Vercel

Le site est prêt pour Vercel : `vercel.json` (redirections et sécurité),
`api/ga4-statistiques.js` (statistiques GA4 du back-office) et la balise
Google Analytics directement dans `index.html`.

## 1. Créer le projet (5 min)

1. Aller sur **vercel.com** › **Sign Up** › **Continue with GitHub** (compte `minaa9`).
2. **Add New… › Project** › choisir le dépôt **neotisee** › **Import**.
3. Framework : **Vite** (détecté tout seul). Ne rien changer d'autre.
4. Ouvrir **Environment Variables** et ajouter (valeurs à copier depuis
   Netlify › Project configuration › Environment variables, ou depuis Supabase › Project Settings › API) :

| Nom | Valeur |
|---|---|
| `VITE_SUPABASE_URL` | l'adresse du projet Supabase |
| `VITE_SUPABASE_ANON_KEY` | la clé publique (anon / publishable) |
| `GA4_PROPERTY_ID` | *(facultatif, pour les statistiques)* voir docs/STATISTIQUES.md |
| `GA4_SERVICE_ACCOUNT` | *(facultatif, pour les statistiques)* voir docs/STATISTIQUES.md |

5. **Deploy**. Le site est en ligne sur une adresse en `…vercel.app`.

Ensuite, chaque fusion sur `main` dans GitHub remet le site à jour tout seul.

## 2. Prévenir Supabase de la nouvelle adresse (2 min)

Supabase › **Authentication › URL Configuration** :
- **Site URL** : la nouvelle adresse Vercel (ex. `https://neotisee.vercel.app`)
- **Redirect URLs** : ajouter `https://neotisee.vercel.app/**`

Sans ça, le lien « mot de passe oublié » du back-office renverrait vers l'ancien site.

## 3. Google Analytics

- La balise GA4 (G-G6EEVQB8N4) est maintenant dans le code : rien à faire sur Vercel.
- Dans GA4 › Administration › Flux de données › Site vibecoding, on peut
  remplacer l'URL du flux par la nouvelle adresse (simple information).
- **Sur Netlify, supprimer le snippet « Google Analytics »** (Developer settings ›
  Snippet injection) si le site Netlify reste en ligne, sinon les visites de
  Netlify seraient comptées deux fois après un nouveau déploiement.
