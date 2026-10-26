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

6. **Coach à deux niveaux (22/10/2026).** Par défaut le dialogue est local et déterministe : `coach.ts` (relances, indices, suivi du thème) + `language-checker.ts` (≈ 30 règles d'erreurs de francophones, testées contre les faux positifs) — jamais présenté comme une IA. **Facultatif : coach Claude Haiku** (`claude-haiku-5-5`, Sarkis a acheté des crédits API) : partie pure `modules/ai-coach.ts` (consigne, schéma JSON, validation, coût, plafond), appel côté appli `apps/web/src/ai/` (SDK chargé à la demande, `dangerouslyAllowBrowser`). La clé vit dans la zone `meta` d'IndexedDB — jamais dans l'état, donc jamais dans le fichier de relais (test dédié). Le moteur valide toujours la progression (une étape n'avance pas sur < 3 mots) ; tout échec (clé, réseau, plafond mensuel, réponse invalide) retombe sur le coach local avec un bandeau. Les réponses IA portent `source: "ai"` (badge « IA »).
7. **Niveau déclaré (22/10/2026).** `settings.declaredLevel` prime sur le diagnostic (`modules/level.ts` → `currentLevel`) ; les leçons des niveaux inférieurs deviennent « Acquis ». Sarkis s'est déclaré B1 en anglais.
8. **En ligne** : https://sarkisdelcourt-debug.github.io/sd-languages/ — chaque envoi sur `main` republie (workflow `pages.yml`, tests compris).

9. **Audit du 21/10/2026 (branche `audit-2026-10-21`).** Correcteur tolérant (contractions, chiffres, US/UK, « 3 pm »), maîtrise des leçons avec les « détails à polir », bouton « Abandonner cette leçon », séries équilibrées par thème, générateurs plus didactiques (indice selon la phrase, distracteurs grammaticaux, traduction révélée après validation, verbes invariants hors drill prétérit), thème sombre par jetons, barre iPhone à 5 onglets, bandeau « en construction » pour l'allemand et l'espagnol. Détail dans `ROADMAP_CLAUDE.md`.

10. **Lot 2 du 22/10/2026 (branche `lot2-2026-10-22`).** Leçons anglaises en révision 3 (exercices choisis pour l'objectif, au niveau exact, aucun id partagé, pertinence testée ; 22 exercices A1–A2 rédigés dans `content/en/beginner.ts`), `skillTags` sur chaque exercice + liste fermée de compétences (`packages/shared/src/skills.ts`), vue « Mes acquis » (`modules/skills.ts` pur et testé, route `GET /api/skills/:language`, série ciblée `?skill=`), chapitres acquis repliés sur la carte du parcours, variantes contractées des textes à trous, scénario hôtel espagnol `es-hotel-check-in`. Les révisions s'appliquent en cascade et toutes les révisions retirées restent jouables.

Vérifications : `npm run typecheck`, `npm test` (300 tests, 26 fichiers au 26/10/2026), `npm run build`, `node --check apps/web/public/sw.js`.

## État exécutable au 21 octobre 2026

React 19 + TypeScript + Vite ; le moteur (`packages/engine`) tourne dans le navigateur, la progression vit dans IndexedDB.

Fonctionnalités opérationnelles :

- diagnostic A1–C1 indicatif pour les trois langues, ou niveau déclaré ;
- 6 548 exercices déterministes avec correction didactique (2 132 anglais, 2 176 allemand, 2 240 espagnol) + tests de vocabulaire, phrases du quotidien (`content/phrase-drills.ts`) et fiches de règles (`grammar-rules.ts`, `rules/`) — le détail par fonction est dans la section « État au 26/10/2026 » ci-dessous.
- 36 leçons guidées A1–B2, soit 12 par langue et 3 par niveau ; les leçons anglaises (révision 3) ont chacune 6 exercices propres à leur objectif, au niveau exact ; les chapitres sous le niveau déclaré se replient ;
- carte de compétences « Mes acquis » : exposition, dix dernières réponses, stabilité, erreurs ouvertes, prochaine révision et action conseillée, avec série ciblée ;
- carte du parcours en quatre chapitres, déblocage par maîtrise, recommandation expliquée, abandon possible ;
- mémoire des erreurs, XP, séries et répétition espacée ;
- séries d'entraînement « Recommandé » ou par thème, variées par format et par thème ;
- 13 scénarios de conversation guidée (dont l'hôtel espagnol du 22/10), coach par règles et correcteur de francophones ;
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

État de référence : 26 fichiers de tests, 300 tests réussis (26/10/2026).

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

- `packages/shared/src/lessons.ts` et `english-lessons.ts` : catalogue des 36 leçons (révisions en cascade, toutes les révisions retirées conservées) ;
- `packages/shared/src/skills.ts` et `packages/engine/src/modules/skills.ts` : liste fermée des compétences et calcul de la carte « Mes acquis » ;
- `packages/shared/src/curriculum.ts` : diagnostics, exercices, `contentCoverage` ;
- `packages/shared/src/content/` : banque anglaise (listes, `en/beginner.ts` pour l'A1–A2 rédigé) et `generators.ts` (exercices, variantes acceptées, `skillTags` déduits) ;
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

- Allemand et espagnol : ~2 200 exercices chacun (A1–B2), non relus par un locuteur natif ; l'espagnol B2 reste mince.
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



## État au 26/10/2026

- **Correcteur** (`learning.ts`) : tréma allemand distingué (ä ö ü → ae oe ue, ß → ss), accents ignorés ailleurs ; QCM strict ; « se faire comprendre » (`understandable`, `conceptsCovered`) avec garde-fous : négation, mots qui s'excluent (jours, directions, con/sin), faute de frappe tolérée seulement à partir de 8 lettres, jamais une simple voyelle finale ; heures 3:00 / 8h30 normalisées.
- **Maîtrise** : le bilan d'une leçon juge le PREMIER essai ; une réussite après avoir vu la correction est « corrigée » (pas d'XP de réussite, erreur mémorisée gardée ouverte). Indice à la demande en leçon. Le plan du jour ne promet une notion que si la leçon la contient.
- **Phrases du quotidien** (`content/phrase-drills.ts`, `content/<langue>/phrases.ts`, corrections de relecture dans `phrase-fix-data.ts`) : ~500 phrases à formulations multiples, deux sens, mots-clés pour l'intelligibilité.
- **Règles** : 81 fiches (`rules/`), « Je pars de 0 » (Accueil et Mes objectifs), exercices de genre générés depuis les listes de vocabulaire.
- **Voix** : enregistrements Piper (`apps/web/public/audio`, régénérés par `scripts/generate-audio.mts`, outils hors dépôt) ; repli sur la voix de l'appareil ; service worker : la page n'est mise en cache qu'avec ses scripts, plages audio gérées, cache des voix séparé.
- **Coach IA** : délai 10 s sans nouvelle tentative, cumul de dépense sous verrou, libellés selon l'état réel, CSP limitée à l'application et à api.anthropic.com. Le plafond reste une estimation locale : le vrai plafond est la limite de dépense sur console.anthropic.com.
- **Audits** : les rapports (23, 24 et 26/10/2026) sont dans `docs/audits/` en local, non publiés (dépôt public).