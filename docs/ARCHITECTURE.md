# Architecture du MVP

## Principes

1. **Local-first** : le contenu et les données essentielles résident sur la machine.
2. **Cœur déterministe** : correction, diagnostic et répétition espacée sont testables sans réseau.
3. **Modules remplaçables** : les fournisseurs de conversation et de voix sont des ports, pas des dépendances du domaine.
4. **Une seule source pédagogique** : le catalogue TypeScript partagé alimente l'API et ses tests.
5. **Progression isolée par langue** : les métriques, diagnostics, révisions et conversations ne se mélangent pas.

## Flux principal

```text
Interface React
      │ requêtes /api
      ▼
API Express locale
      ├── diagnostic ── moteur de score partagé
      ├── settings ──── objectif / temps / niveau cible par langue
      ├── practice ──── correction déterministe
      │                    ├── progression
      │                    ├── mémoire des erreurs
      │                    └── création d'une carte SRS
      ├── reviews ───── planificateur SRS
      ├── daily plan ── priorisation objectif / temps / niveau / erreurs / révisions
      ├── lesson ────── machine d'état micro-cours / pratique / dialogue / bilan
      ├── pronunciation ─ comparaison déterministe de transcription / progression compacte
      └── conversation ─ fournisseur local guidé
                           │
                           ▼
                    fichier JSON local
```

## Persistance

`JsonStore` sérialise les mutations dans une file en mémoire. Chaque état est d'abord écrit dans un fichier temporaire, puis renommé. Ce choix évite une dépendance native et facilite l'installation sous Windows.

Pour une utilisation multi-profils ou un catalogue beaucoup plus vaste, le port de persistance pourra être remplacé par SQLite sans modifier les règles métier.

Le champ `version` prépare les migrations futures. L'état courant est en version 5. Il sépare l'historique détaillé des sessions (`lessonSessions`) d'un registre compact et durable (`lessonProgress`) et ajoute `pronunciationProgress` avec un historique borné de résultats. Le lecteur complète les champs absents et reconstruit les registres possibles, ce qui permet d'ouvrir les profils créés dans les versions antérieures.

## Leçons guidées

Le catalogue `packages/shared/src/lessons.ts` contient douze étapes A1–B2 par langue, soit trois séances par niveau et 36 au total. Chaque définition référence des exercices et un scénario existants, déclare sa position, son prérequis, son point central et ses affinités avec les objectifs. Une session persistée suit cinq phases (`intro`, `practice`, `correction`, `conversation`, `summary`) et conserve l'identifiant et la révision exacts de sa définition. Une reprise ne peut donc pas basculer silencieusement vers une autre leçon lorsque le catalogue évolue.

Le moteur de recommandation est partagé avec le plan quotidien. Il place d'abord l'apprenant au niveau du diagnostic, plafonné par son objectif, puis privilégie une séance en cours, une erreur non résolue, une étape nouvellement ouverte et l'affinité avec l'objectif. Les leçons déjà maîtrisées restent accessibles. Une séance terminée sans le seuil de maîtrise est enregistrée comme `needs-review` et ne débloque pas le prérequis suivant.

La conversation d'une leçon est isolée de la conversation libre. La mutation d'une tentative est partagée entre la pratique libre et la leçon afin de préserver l'idempotence, les XP, la mémoire des erreurs et les cartes de répétition espacée. Après deux essais incorrects, la séance continue en conservant l'erreur pour révision. Le dialogue se termine après le scénario réussi ou quatre réponses ; le bilan distingue alors une séance maîtrisée d'une séance à consolider.

## Correction et diagnostic

La correction compare deux formes normalisées de la réponse aux variantes explicitement acceptées. La première conserve les accents pour distinguer une réponse exacte d'un détail orthographique ; la seconde permet d'accepter un accent manquant sans casser l'élan. Le retour est structuré en trois verdicts (`exact`, `minor`, `incorrect`) et alimente une explication pédagogique : modèle, règle et point d'attention.

Le diagnostic additionne des poids croissants avec le niveau de la question, puis projette le pourcentage sur A1 à C1. Il donne une orientation, jamais une certification.

## Répétition espacée

Le planificateur reprend les idées de SM-2 : répétitions, facteur de facilité, intervalle et lapses. Les notes `again`, `hard`, `good` et `easy` modifient l'intervalle. Toutes les dates sont stockées en ISO UTC.

## Idempotence et concurrence

Chaque tentative d'exercice reçoit un `attemptId` généré par l'interface. Le serveur conserve les 1 000 identifiants les plus récents et n'incrémente pas deux fois la progression lors d'un double envoi. Une réponse de leçon transporte en plus le `sessionId` et l'`exerciseId` attendus : un rejeu hors ligne ne peut donc pas s'appliquer à une autre étape. La file de mutation du stockage évite la perte d'une mise à jour lorsque deux requêtes arrivent presque ensemble.

## IA et voix

Le MVP utilise `LocalCoachProvider`. Les scénarios sont classés selon l'objectif et le niveau cible enregistrés pour la langue. Les futurs fournisseurs devront implémenter le même contrat et prévoir un repli local en cas d'indisponibilité.

Les ports `SpeechToTextProvider` et `TextToSpeechProvider` décrivent les limites du backend. La lecture actuelle utilise `speechSynthesis`. La dictée emploie, lorsqu'elle existe, `SpeechRecognition` : elle démarre uniquement après une action utilisateur, remplit une zone de texte modifiable et n'envoie jamais le message automatiquement. Sa disponibilité, son fonctionnement hors ligne et son éventuel traitement distant dépendent du navigateur et du système.

Le laboratoire de prononciation propose trois niveaux de repli. `speechSynthesis` fournit le modèle oral ; `MediaRecorder` permet une réécoute locale éphémère ; `SpeechRecognition`, lorsqu'il est disponible et explicitement déclenché, fournit une transcription. Ces deux dernières voies ne sont jamais démarrées simultanément. L'audio reste dans une URL objet en mémoire vive et n'est ni envoyé, ni persisté, ni exporté.

La fonction partagée `assessPronunciation` aligne les mots reconnus sur le modèle. Elle expose trois mesures lisibles — couverture pondérée des mots clés, ordre et précision — puis produit un repère sur 100. Ce repère mesure l'intelligibilité transcrite, pas les phonèmes, le rythme ou l'accent. Le serveur recalcule toujours le résultat à partir de la transcription et ne fait jamais confiance à un score fourni par le client. Seuls le score, le verdict et les agrégats de progression sont conservés dans le profil. En cas de coupure, la transcription peut rester temporairement dans la file IndexedDB jusqu'à son rejeu ; l'audio n'y entre jamais.

## Personnalisation et évolutivité des données

Chaque langue possède ses propres réglages : objectif (`aisance`, `voyage`, `travail` ou `bases`), budget quotidien et niveau cible. Ces préférences restent dans le même état local versionné et influencent le plan quotidien, la sélection d'exercices et les recommandations de conversation. La lecture fusionne les champs manquants avec des valeurs sûres afin de préserver les profils créés par la première version.

## PWA et hors ligne

Le service worker sépare deux caches versionnés. Le cache `shell` contient la page, le manifeste, l'icône et les fichiers JS/CSS Vite détectés lors de l'installation. Le cache `api` utilise le réseau d'abord puis les dernières réponses valides. `/api/health` et `/api/export` restent strictement réseau ; une réponse relue depuis le cache porte `X-SD-Data-Source: cache` afin que l'interface affiche le mode hors ligne.

La base IndexedDB `sd-languages-offline` contient une outbox indépendante du fichier JSON. Seules les mutations rejouables y entrent : réglages absolus, exercice libre avec `attemptId`, prononciation avec `attemptId`, et réponse de leçon avec identifiants de séance et d'exercice obligatoires côté serveur. Les réglages successifs d'une même langue sont fusionnés. La synchronisation est séquentielle et protégée entre onglets lorsque Web Locks est disponible. Le lot P0 doit ajouter un lease IndexedDB de secours pour les navigateurs qui n'exposent pas cette API. Les erreurs réseau et serveur restent en attente, tandis qu'un conflit client devient visible comme action à vérifier.

Les mutations dont l'ordre change le sens ne sont pas mises en file : diagnostic, `continue` et message de leçon, révision espacée, démarrage de scénario et conversation. Cette limite est volontaire : le mode hors ligne privilégie l'absence de perte et de double progression plutôt qu'une fausse autonomie.

## Prochaines étapes recommandées

`ROADMAP_CLAUDE.md` définit l'ordre normatif. Le premier lot est la fiabilisation hors ligne : tests navigateur, tests IndexedDB, lease multi-onglets de secours, conflits, export/import et effacement récupérable. Viennent ensuite la validation et l'enrichissement des 36 leçons, la carte de compétences, le studio oral avancé et, seulement après, les fournisseurs IA facultatifs.
