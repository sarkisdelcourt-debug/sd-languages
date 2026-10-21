# SD Languages — relais complet vers Claude

Ce fichier est le point d'entrée pour reprendre le projet sans relire toute la conversation d'origine.

## Mission

Faire évoluer SD Languages comme coach linguistique local-first, didactique et peu coûteux pour trois langues :

- anglais : perfectionnement et aisance ;
- allemand : réactivation des acquis ;
- espagnol : construction des bases.

L'application doit rester utile sans compte, sans abonnement et sans fournisseur d'IA. Toute intégration distante future doit être facultative, annoncée clairement et accompagnée d'un repli local.

## Décision du 21 octobre 2026 : mode téléphone (prime sur le reste de ce document)

Sarkis utilise l'application **sur iPhone le soir (souvent hors ligne) et sur le PC**. Décisions prises avec lui :

1. **Tout tourne dans l'appareil.** Le moteur (`packages/engine`) s'exécute dans le navigateur ; la progression vit dans IndexedDB (`apps/web/src/local/browser-store.ts`). Aucune requête réseau pour apprendre : l'application marche en mode avion une fois installée.
2. **Relais par fichier entre PC et iPhone** (pas de serveur de synchro, pas de fusion automatique). « Envoyer ma progression » produit un fichier ; l'autre appareil le « reprend » et remplace son état. `packages/engine/src/backup.ts` avertit si l'appareil perdrait des changements ou si le fichier est plus ancien. Une copie est gardée avant chaque remplacement + une par jour (10 max).
3. **Le serveur Express n'est plus nécessaire à l'apprentissage.** Il sert le build sur le PC, garde les tests de parité HTTP et expose `/api/export` pour reprendre une fois l'ancien `data/sd-languages.json`.
4. **L'ancienne outbox hors ligne est supprimée** (plus de serveur à rejoindre) ; les contraintes 5 et 6 ci-dessous ne concernent plus que l'historique.
5. **Hébergement HTTPS à décider** avec Sarkis : l'iPhone a besoin d'une adresse HTTPS pour installer la PWA, le micro et le service worker. Aucune donnée n'est hébergée, seulement l'application.

6. **Pas d'API d'IA (22/10/2026).** Sarkis a refusé une clé API payante (son forfait claude.ai ne la couvre pas). Le dialogue reste local : `packages/engine/src/modules/coach.ts` (relances, indices, suivi du thème) + `language-checker.ts` (≈ 30 règles d'erreurs de francophones, testées aussi contre les faux positifs). Ne jamais le présenter comme une IA.
7. **Niveau déclaré (22/10/2026).** `settings.declaredLevel` prime sur le diagnostic (`modules/level.ts` → `currentLevel`) ; les leçons des niveaux inférieurs deviennent « Acquis ». Sarkis s'est déclaré B1 en anglais.
8. **En ligne** : https://sarkisdelcourt-debug.github.io/sd-languages/ — chaque envoi sur `main` republie (workflow `pages.yml`, tests compris).

9. **Audit du 21/10/2026 (branche `audit-2026-10-21`).** Correcteur tolérant (contractions, chiffres, US/UK, « 3 pm »), maîtrise des leçons avec les « détails à polir », bouton « Abandonner cette leçon », séries équilibrées par thème, générateurs plus didactiques (indice selon la phrase, distracteurs grammaticaux, traduction révélée après validation, verbes invariants hors drill prétérit), thème sombre par jetons, barre iPhone à 5 onglets, bandeau « en construction » pour l'allemand et l'espagnol. Détail dans `ROADMAP_CLAUDE.md`.

Vérifications : `npm run typecheck`, `npm test` (148 tests au 21/10, 12 fichiers), `npm run build`, `node --check apps/web/public/sw.js`.

## État exécutable au 21 octobre 2026

React 19 + TypeScript + Vite ; le moteur (`packages/engine`) tourne dans le navigateur, la progression vit dans IndexedDB.

Fonctionnalités opérationnelles :

- diagnostic A1–C1 indicatif pour les trois langues, ou niveau déclaré ;
- 920 exercices déterministes avec correction didactique : 875 en anglais (banque générée + rédigée), 30 en espagnol, 15 en allemand — l'interface annonce les langues « en construction » ;
- 36 leçons guidées A1–B2, soit 12 par langue et 3 par niveau ; les leçons anglaises (révision 2) tirent 6 exercices chacune de la banque ;
- carte du parcours en quatre chapitres, déblocage par maîtrise, recommandation expliquée, abandon possible ;
- mémoire des erreurs, XP, séries et répétition espacée ;
- séries d'entraînement « Recommandé » ou par thème, variées par format et par thème ;
- 12 scénarios de conversation guidée, coach par règles et correcteur de francophones ;
- laboratoire de prononciation avec synthèse navigateur, enregistrement audio éphémère et comparaison de transcription ;
- PWA installable, tout hors ligne ; relais par fichier PC ⟷ iPhone, sauvegardes automatiques ;
- thème clair / sombre selon l'appareil.

État utilisateur à préserver : une séance anglaise B1 `lesson-en-project-update` est active en phase `conversation` sur l'appareil de Sarkis. Ne jamais la clore ni réinitialiser la progression pendant une évolution ordinaire ; `data/sd-languages.json` est l'ancienne progression du PC, à ne jamais toucher.

## Démarrage

Prérequis : Node.js 22 ou plus récent.

```bash
npm install
npm run build
npm start
```

Ouvrir ensuite `http://127.0.0.1:8787/`.

Pendant le développement :

```bash
npm run dev
```

L'interface Vite est alors disponible sur `http://127.0.0.1:5173/`. Le service worker n'est activé que dans le build de production ; les tests hors ligne doivent donc utiliser `npm run build && npm start`.

## Vérifications obligatoires avant livraison

```bash
npm run typecheck
npm test
npm run build
node --check apps/web/public/sw.js
```

État de référence : 12 fichiers de tests, 148 tests réussis (21/10/2026).

## Architecture à connaître

```text
apps/web/                  React, PWA, IndexedDB (browser-store.ts), relais par fichier, voix navigateur
apps/api/                  serveur Express du PC : build, parité HTTP, GET /api/export
packages/engine/           moteur : router.ts (routes), modules/ (leçons, séries, coach, correcteur, plan), backup.ts (relais)
packages/shared/           types, banque de contenu (content/), générateurs, correction, leçons, scénarios
scripts/                   content-stats, bank-dump, lesson-dump, serve-pages
data/sd-languages.json     ancienne progression du PC — à ne jamais toucher
docs/ARCHITECTURE.md       décisions techniques et limites actuelles
ROADMAP_CLAUDE.md          ordre recommandé des prochains travaux
EXPORT_MANIFEST.md         contenu et règles de confidentialité de l'export
```

Points d'entrée importants :

- `packages/shared/src/lessons.ts` et `english-lessons.ts` : catalogue des 36 leçons (révisions retirées conservées) ;
- `packages/shared/src/curriculum.ts` : diagnostics, exercices, `contentCoverage` ;
- `packages/shared/src/content/` : banque anglaise (listes) et `generators.ts` (exercices, variantes acceptées) ;
- `packages/shared/src/learning.ts` : normalisation, verdicts, cartes de révision ;
- `packages/engine/src/modules/guided-lessons.ts` : déblocage, recommandation, maîtrise, abandon ;
- `packages/engine/src/modules/adaptive-practice.ts` : classement et séries variées ;
- `apps/web/src/local/browser-store.ts` et `device.ts` : IndexedDB, relais, sauvegardes ;
- `apps/web/public/sw.js` : caches PWA ;
- `apps/web/src/components/GuidedLessonView.tsx` : carte et séance guidée ;
- `packages/engine/src/router.ts` : routes du moteur (reprises telles quelles par `apps/api/src/app.ts`).

## Contraintes non négociables

1. Préserver les identifiants et révisions des leçons existantes lorsqu'une session peut encore les référencer.
2. Ne jamais effacer ou réinitialiser `data/sd-languages.json` sans demande explicite.
3. Garder l'API liée à `127.0.0.1` par défaut.
4. Ne pas présenter une règle déterministe comme une correction par IA.
5. Ne jamais persister l'audio. Une transcription peut rester temporairement dans l'outbox, uniquement jusqu'à synchronisation.
6. Ne mettre hors ligne que des mutations idempotentes ou validées par un contexte de séance explicite et obligatoire côté serveur.
7. Conserver un repli local si une IA, une voix distante ou une analyse acoustique est ajoutée.
8. Expliquer les recommandations pédagogiques à l'utilisateur.
9. Vérifier clavier, lecteur d'écran, mobile et réduction des animations pour chaque nouvelle interface.
10. Maintenir une distinction visible entre fonctionnalité opérationnelle, expérimentation et intégration future.

## Limites actuelles importantes

- L'allemand (15 exercices) et l'espagnol (30) restent des ébauches ; leurs 24 leçons réemploient ces petites banques et 4 scénarios par langue.
- La correction est tolérante par règles (contractions, chiffres, US/UK) mais pas sémantique : une formulation juste non prévue peut être refusée.
- Le score de prononciation mesure la proximité de la transcription, pas les phonèmes, le rythme ou l'accent.
- Il n'existe pas encore de tests navigateur automatisés du service worker ni de tests de rendu du thème sombre.
- Il n'existe ni comptes, ni synchronisation automatique multi-appareils, ni fournisseur IA.

## Première action recommandée

Enrichir l'allemand puis l'espagnol sur le modèle de la banque anglaise (`packages/shared/src/content/`), et décider avec Sarkis des tests navigateur (service worker, thème sombre). Ne pas attaquer l'IA ou la voix avancée avant.

## Méthode de travail attendue

Avant de modifier :

1. lire `README.md`, `docs/ARCHITECTURE.md` et `ROADMAP_CLAUDE.md` ;
2. inspecter les données et le code réellement présents ;
3. lancer les quatre vérifications de référence ;
4. annoncer les fichiers touchés et les risques pour la progression ;
5. réaliser un lot vertical limité, avec tests et documentation ;
6. distinguer dans le compte rendu ce qui fonctionne réellement de ce qui reste préparé.

