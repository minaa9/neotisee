# Statistiques du back-office (Google Analytics 4)

La page **Back-office › Statistiques** affiche les chiffres de Google Analytics 4
directement dans le back-office : visiteurs, pages vues, engagement, demandes
envoyées, sources de trafic, appareils, pages les plus vues, villes, et les
objectifs du plan de pilotage (seuils modifiables avec « Modifier les objectifs »).

Tant que GA4 n'est pas relié, la page affiche des **données d'exemple** avec un
bandeau jaune. Pour afficher les vrais chiffres, il faut une seule fois :

## 1. Créer un compte de service Google (10 min)

1. Aller sur **console.cloud.google.com** avec le compte Google de GA4.
2. En haut : **Sélectionner un projet › Nouveau projet**, nom « Neotisse stats », **Créer**.
3. Menu **API et services › Bibliothèque** : chercher **Google Analytics Data API** › **Activer**.
4. Menu **IAM et administration › Comptes de service › Créer un compte de service** :
   nom « neotisse-stats », **Créer et continuer**, puis **OK** (aucun rôle à donner).
5. Cliquer sur le compte créé › onglet **Clés › Ajouter une clé › Créer une clé › JSON**.
   Un fichier `.json` se télécharge : c'est la clé (à garder secrète, ne jamais la mettre sur GitHub).
6. Copier l'adresse e-mail du compte de service (elle finit par `iam.gserviceaccount.com`).

## 2. Donner accès à GA4 (2 min)

1. **analytics.google.com › Administration › Gestion des accès à la propriété › + › Ajouter des utilisateurs**.
2. Coller l'e-mail du compte de service, rôle **Lecteur**, décocher « Informer par e-mail », **Ajouter**.
3. Dans **Administration › Détails de la propriété**, copier l'**ID de la propriété** (un nombre, ex. `512345678`).

## 3. Ajouter deux variables sur Netlify (2 min)

Netlify › projet **neotisse-codee** › **Project configuration › Environment variables › Add a variable** :

| Nom | Valeur |
|---|---|
| `GA4_PROPERTY_ID` | l'ID de la propriété (ex. `512345678`) |
| `GA4_SERVICE_ACCOUNT` | tout le contenu du fichier `.json` téléchargé (ouvrir avec TextEdit, tout copier) |

Puis **Deploys › Trigger deploy › Deploy site**. Le bandeau jaune disparaît :
ce sont les vrais chiffres.

## Comment ça marche

- `netlify/functions/ga4-statistiques.mjs` interroge l'API Google Analytics Data
  avec le compte de service. Elle vérifie à chaque appel que la personne est
  connectée au back-office (jeton Supabase) : les chiffres ne sont jamais publics.
- Les objectifs (seuil bas, seuil haut, objectif de demandes) sont enregistrés dans
  la table `reglages` (ligne `objectifs`).
- Seuls les visiteurs qui acceptent les cookies de mesure d'audience sont comptés en détail.

## Base de données déjà installée ?

Si la base Supabase existait avant cette mise à jour, lancer une fois
`supabase/mise-a-jour-textes-statistiques.sql` dans **Supabase › SQL Editor**
(sinon les objectifs et les « Textes du site » ne peuvent pas être enregistrés).
