# Manifeste de l'export SD Languages

## Contenu inclus

- code source React, TypeScript et Express ;
- catalogue pédagogique partagé ;
- tests et configuration de build ;
- build de production dans `apps/web/dist` ;
- PWA, service worker et manifeste ;
- documentation technique ;
- `CLAUDE_START_HERE.md` et `ROADMAP_CLAUDE.md` ;
- `package.json` et `package-lock.json` ;
- lanceur Windows ;
- fichier `data/sd-languages.json` avec la progression locale actuelle.

## Contenu volontairement exclu

- `node_modules` : dépendances volumineuses et propres à la machine, recréées avec `npm install` ;
- fichiers temporaires `data/*.tmp` ;
- journaux, couverture de tests et caches d'outils s'ils existent ;
- la progression IndexedDB du navigateur (`sd-languages`) : depuis le mode téléphone, c'est elle qui fait foi sur chaque appareil ; elle n'appartient pas au dossier du projet et se transfère par « Envoyer ma progression ».

## Données personnelles

L'archive contient l'ancienne progression du PC (`data/sd-languages.json`) : réglages, résultats, erreurs, révisions et séance en cours au moment de l'export. Elle ne contient ni compte, ni mot de passe, ni clé d'API, ni enregistrement audio.

Cette archive est un transfert complet du **dossier projet**. Elle ne constitue pas un export des stockages du navigateur : la progression IndexedDB courante, `localStorage` et les caches PWA sont extérieurs au dossier ; le fichier produit par « Envoyer ma progression » est la sauvegarde de référence.

Ne pas publier cette archive dans un dépôt public sans retirer ou anonymiser `data/sd-languages.json`.

## Reconstitution

Après extraction :

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

L'application doit répondre sur `http://127.0.0.1:8787/`.

