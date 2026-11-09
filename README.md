# Néotisse

Site vitrine de l'association Néotisse (React + Vite + Tailwind CSS), intégré depuis les maquettes Figma.

## Lancer le site

```bash
npm install
npm run dev
```

Puis ouvrir l'adresse affichée (par défaut http://localhost:5173).

## Organisation

- `docs/` : brief, charte design et TODO du projet
- `src/pages/` : une page par fichier (Accueil, L'association, L'équipe, Nos ateliers, Actualités, Calendrier, Livre d'or, Contact)
- `src/sections/home/` : les sections de l'accueil
- `src/components/` : éléments réutilisables (header, footer, boutons, cartes…)
- `src/data/` : **contenus modifiables** (rendez-vous du calendrier, actualités, ateliers, témoignages, coordonnées)
- `src/assets/` : images exportées de Figma

## Modifier les contenus

Pour ajouter un rendez-vous, un article ou un témoignage, il suffit de copier un bloc dans le fichier correspondant de `src/data/` et d'en changer les textes.

Les couleurs et les polices de la charte sont définies dans `src/index.css`.
