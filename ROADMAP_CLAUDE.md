# SD Languages — feuille de route pour Claude

Cette feuille de route part du MVP exécutable livré au 21 octobre 2026. Les priorités protègent d'abord la progression locale et la qualité pédagogique, puis élargissent le contenu et les capacités intelligentes.

## Principes de priorisation

- **P0** : fiabilité, absence de perte et vérification du comportement réel.
- **P1** : valeur pédagogique quotidienne et diversité du cursus.
- **P2** : personnalisation explicable et nouvelles interactions locales.
- **P3** : intégrations facultatives nécessitant consentement, budget ou infrastructure.

Chaque lot doit rester exécutable à sa fin. Une fonctionnalité non testée ou uniquement maquettée doit être étiquetée comme telle.

## Note du 21/10/2026 — lot d'audit (branche `audit-2026-10-21`, un commit par point)

1. Correcteur tolérant : contractions (`'d` would/had selon le contexte, let's, would've…), chiffres ↔ mots (0–30, 40, 50, 100, an hour), lexique US ↔ UK, tiret/espace, « 3 pm » / « 3 p.m. » / « 3pm », « o'clock » ; réponses acceptées ajoutées à 8 exercices.
2. Leçons : maîtrise avec exact + détails à polir ≥ 2/3 ; `POST /api/lessons/:language/abandon` et bouton « Abandonner cette leçon » (rien d'autre n'est effacé).
3. Série « Recommandé » : départage par hachage jour + id (0–1000), au plus 2 exercices par thème, médical garanti pour l'objectif « Travailler ».
4. Générateurs : indice selon la forme de la phrase, distracteurs grammaticaux, traduction des dictées révélée après validation, verbes invariants hors drill prétérit, exemples au prétérit.
5. Thème sombre par jetons, barre iPhone à 5 onglets, CSS mort de l'outbox retiré.
6. Petits bugs : langue affichée, note de confidentialité vocale, coach allemand au tutoiement, `aria-pressed`, cartes de révision lisibles, `/api/export` seulement sur le PC et en ligne, message « données inaccessibles ».
7. Bandeau « en construction » quand une langue compte moins de 50 exercices.
8. Documentation remise à jour (README, CLAUDE_START_HERE, ARCHITECTURE, EXPORT_MANIFEST, scripts).

Doutes signalés dans le rapport : sur téléphone, « Parler » est sous « Plus » (cinq onglets maximum) ; les variantes acceptées sont générées par règles et peuvent accepter une forme maladroite (« I would seen it » pour « I'd seen it ») sans jamais refuser une forme juste listée.

---

## Lot P0 — fiabiliser le mode hors ligne

> **Révisé le 21/10/2026 (mode téléphone).** Le moteur tourne désormais dans l'appareil : il n'y a
> plus d'outbox ni de conflits serveur. Fait : stockage IndexedDB exclusif entre onglets (Web Locks +
> file locale), relais par fichier PC ⟷ iPhone avec aperçu et avertissements, sauvegardes
> automatiques restaurables, reprise de l'ancien fichier PC, effacement complet en double
> confirmation, test réel « serveur arrêté → rechargement » réussi. Reste : hébergement HTTPS
> (décision de Sarkis), tests Playwright automatisés du service worker, thème sombre pour l'usage du
> soir, synchro automatique éventuelle (P3). Les points 1 à 11 ci-dessous sont l'ancienne version.

### Objectif

Garantir qu'une coupure, un redémarrage ou deux onglets ouverts ne puissent ni perdre une action ni doubler la progression.

### Travail

1. Ajouter des tests unitaires IndexedDB avec `fake-indexeddb` : création, ordre FIFO, fusion des réglages, reprise après erreur, conflit 4xx et migration du schéma.
2. Ajouter Playwright et des scénarios de production réels : première visite **en ligne** pour installer et préparer la PWA, puis coupure, recharge hors ligne, arrêt/redémarrage du serveur, fermeture/réouverture du navigateur et resynchronisation.
3. Créer un panneau « Synchronisation » montrant : en attente, en cours, synchronisée, bloquée, motif et action possible.
4. Ajouter un lease IndexedDB lorsque Web Locks est absent, afin de conserver l'exclusion mutuelle entre onglets.
5. Ajouter un backoff exponentiel : base 2 secondes, plafond 5 minutes, jitter ±20 %, remise à zéro après succès ou relance manuelle.
6. Définir la résolution des conflits : afficher le motif ; permettre « réessayer inchangé » après actualisation, ou « abandonner » avec confirmation. Une réponse pédagogique bloquée n'est jamais modifiée sur place ; elle est abandonnée puis recréée avec un nouvel identifiant et un contexte courant.
7. Intégrer l'outbox à l'export de confidentialité ou produire un second fichier clairement annoncé.
8. Ajouter un import JSON validé avec aperçu, sauvegarde automatique du profil courant et restauration testée. L'export devient alors une vraie sauvegarde récupérable.
9. Ajouter « Effacer mes données » avec double confirmation. Suspendre d'abord la synchronisation et fermer les écritures, puis couvrir JSON et fichiers temporaires, IndexedDB, Cache Storage, `localStorage` et onglets ouverts. Ne proposer l'effacement qu'après livraison de l'import/restauration.
10. Afficher un indicateur « données mises en cache » dans les vues relues hors ligne.
11. Rendre la durée d'idempotence compatible avec la durée maximale de l'outbox : journal d'opérations persistant ou rétention explicitement supérieure au délai de rejeu supporté.

### Critères d'acceptation

- Une réponse rejouable produit exactement un effet après reconnexion.
- Un conflit ne disparaît jamais silencieusement.
- Deux onglets ne synchronisent pas simultanément la même action.
- Une recharge hors ligne affiche l'interface et les données préparées, sans écran blanc.
- L'utilisateur peut exporter puis effacer toutes les copies locales connues.
- Une sauvegarde exportée peut être réimportée avant que l'effacement soit proposé.

---

## Lot P1 — donner une identité propre aux 36 leçons

> **Banque anglaise du 22/10/2026** (`packages/shared/src/content/`) : Sarkis tournait en rond sur
> 15 exercices. Méthode mixte décidée avec lui : listes (vocabulaire, phrases, phrasal verbs, verbes
> irréguliers) transformées par `generators.ts` + exercices rédigés (grammaire, faux amis). Thèmes :
> médical, conversation, voyage, grammaire, phrasal verbs, irréguliers, faux amis. « Exercices
> ciblés » = séries de 6 avec bilan, choix du thème, exclusion de la série vue, et
> `exerciseHistory` pour favoriser le neuf. Règle : un id publié ne change jamais. Reste : relier ces
> exercices aux leçons guidées anglaises (révision 2, comme l'espagnol A1) et faire de même en
> allemand et espagnol.

> **Tranche espagnol A1 faite le 21/10/2026** (`packages/shared/src/spanish-a1.ts`) : 3 leçons en
> révision 2, 6 exercices chacune (≥ 4 propres, ≥ 4 formats), 3 formats à la Duolingo (`word-bank`,
> `match-pairs`, `listening`) dans `ExerciseAnswer.tsx`, ancienne révision conservée pour les séances
> en cours (`RETIRED_LESSON_REVISIONS`). Reste pour l'A1 : un scénario hôtel propre à la leçon 3, une
> relecture par un hispanophone, puis valider avec Sarkis avant d'étendre le modèle à l'A2 et aux autres langues.

### Objectif

Passer d'une architecture de cursus complète à un contenu suffisamment varié pour un usage régulier.

### Travail

1. Porter la banque de 45 à au moins 108 exercices, soit trois exercices distincts par leçon.
2. Limiter le réemploi d'un même exercice dans deux leçons consécutives.
3. Ajouter 12 scénarios pour atteindre deux mises en situation par niveau et par langue.
4. Porter la prononciation de 12 à 36 phrases, avec une phrase liée à chaque leçon.
5. Ajouter des formats locaux : remise en ordre, association, choix contextuel, transformation et mini-dictée.
6. Faire relire le contenu par une personne compétente dans chaque langue : naturel des formulations, niveau CECRL, variantes acceptables et explications en français.
7. Ajouter un champ `skillTags` stable aux exercices et leçons : temps, cas, ordre des mots, fonctions communicatives, vocabulaire et prononciation.

### Critères d'acceptation

- Chaque leçon possède un objectif observable et des exercices qui lui sont propres.
- Aucune réponse correcte courante n'est rejetée sans explication.
- Les niveaux A1–B2 montrent une progression réelle de complexité.
- Les tests garantissent unicité, langue, niveau, prérequis et validité des références.

---

## Lot P1 — construire la carte de compétences

### Objectif

Faire apparaître ce que l'apprenant sait réellement, au-delà d'un total de XP.

### Travail

1. Définir 15 à 25 micro-compétences par langue à partir des `skillTags`.
2. Calculer pour chaque compétence : exposition, réussite récente, stabilité, erreurs ouvertes et prochaine révision.
3. Ajouter une vue « Mes acquis » sous forme de liste hiérarchique accessible, complétée par une visualisation compacte.
4. Expliquer chaque score avec des preuves : exercices récents, erreurs et leçons associées.
5. Proposer une action immédiate : consolider, revoir, pratiquer en contexte ou prononcer.

### Critères d'acceptation

- Aucun score opaque : chaque recommandation cite sa raison.
- Les compétences d'une langue n'affectent jamais une autre langue.
- La vue reste lisible sans couleur et au clavier.

---

## Lot P2 — moteur adaptatif de session

### Objectif

Composer une séance courte qui alterne rappel, découverte, production et transfert, selon le temps disponible.

### Travail

1. Construire un planificateur pur et testé prenant en entrée : temps, objectif, niveau, cartes dues, erreurs, fatigue approximée et compétences sous-exposées.
2. Introduire trois intensités : 5 minutes « essentiel », 10–15 minutes « standard », 20 minutes « approfondi ».
3. Éviter deux tâches identiques de suite et espacer les erreurs récentes.
4. Ajouter un bilan « ce que vous avez renforcé » avec une suggestion unique pour demain.
5. Mesurer localement la durée réelle des activités, sans analytique externe.

### Critères d'acceptation

- Le plan tient dans le budget choisi avec une tolérance de deux minutes.
- Deux profils différents reçoivent des plans différents pour une raison visible.
- Le moteur reste déterministe et testable sans réseau.

---

## Lot P2 — studio oral enrichi, toujours local-first

### Objectif

Améliorer l'oral sans prétendre fournir une analyse phonétique que le système ne réalise pas.

### Travail

1. Ajouter un mode shadowing : écoute, pause réglable, répétition, réécoute et auto-évaluation.
2. Ajouter des paires minimales adaptées à chaque langue et au niveau.
3. Conserver l'audio uniquement en mémoire vive, avec minuterie et bouton d'effacement explicite.
4. Séparer les indicateurs : mots reconnus, ordre, rythme auto-évalué et confiance de l'apprenant.
5. Préparer un port `PronunciationAnalyzerProvider` pour une analyse acoustique future, sans l'activer par défaut.

### Critères d'acceptation

- Aucun texte n'affirme mesurer l'accent ou les phonèmes sans analyse acoustique.
- Le parcours fonctionne encore sans reconnaissance vocale.
- L'audio ne se retrouve ni dans le JSON, ni dans IndexedDB, ni dans l'export.

---

## Lot P2 — accessibilité et qualité d'interface

### Objectif

Rendre les parcours longs aussi efficaces au clavier, sur mobile et avec un lecteur d'écran.

### Travail

1. Auditer WCAG 2.1 AA : contraste, ordre de focus, intitulés, annonces dynamiques et cibles tactiles.
2. Tester la carte de 12 leçons à 360, 768, 1280 et 1920 px.
3. Ajouter des tests de navigation clavier pour les activités principales.
4. Vérifier les états chargement, vide, erreur, hors ligne, synchronisation et conflit.
5. Réduire les re-rendus et mesurer le poids initial du bundle.

### Critères d'acceptation

- Toutes les actions essentielles sont réalisables sans souris.
- Aucun état important ne dépend uniquement de la couleur.
- La réduction des animations est respectée.

---

## Lot P3 — IA facultative et budgétée

### Objectif

Ajouter une conversation plus libre et une correction sémantique sans rendre l'application dépendante d'un fournisseur.

### Travail

1. Implémenter un fournisseur derrière `CoachProvider`, sélectionnable dans les réglages.
2. Demander un consentement explicite avant tout envoi et afficher les données qui partiront.
3. Ajouter budget mensuel, longueur maximale, délai, annulation et repli automatique sur `LocalCoachProvider`.
4. Envoyer uniquement le contexte minimal ; exclure l'historique global et les données non nécessaires.
5. Étiqueter chaque retour : local déterministe ou généré par le fournisseur choisi.
6. Ajouter des tests de contrat afin qu'un fournisseur indisponible ne casse jamais le parcours.

### Critères d'acceptation

- Le MVP reste pleinement utilisable sans clé d'API.
- Les coûts maximums sont visibles avant activation.
- Une panne distante revient au coach local sans perte de saisie.
- Les réponses générées ne modifient pas directement la progression sans validation déterministe.

---

## Lot P3 — sauvegarde et multi-profils

### Objectif

Permettre une utilisation durable par plusieurs personnes sur une même machine.

### Travail

1. Étendre l'import validé du lot P0 avec une fusion sélective entre profils.
2. Introduire des profils locaux séparés sans authentification distante.
3. Préparer une migration de `JsonStore` vers SQLite si le volume le justifie.
4. Ajouter des sauvegardes datées automatiques et leur politique de rétention.
5. Prévoir ensuite, séparément, une synchronisation chiffrée multi-appareils.

### Critères d'acceptation

- Une importation invalide n'altère jamais le profil courant.
- Le choix fusion/remplacement est explicite et réversible par sauvegarde.
- Les données de deux profils ne se croisent jamais.

---

## Ordre conseillé à Claude

1. Exécuter et documenter le lot P0 complet.
2. Enrichir d'abord une tranche verticale : anglais A1 avec exercices, scénario et prononciation uniques.
3. Faire valider cette tranche, puis appliquer le modèle à l'allemand et à l'espagnol.
4. Construire les `skillTags` et la carte de compétences avant de complexifier le moteur adaptatif.
5. Terminer les lots P2 locaux avant toute IA distante.
6. N'aborder P3 qu'avec une décision explicite sur fournisseur, confidentialité et budget.

## À ne pas faire

- Ne pas réécrire toute l'application pour adopter un nouveau framework.
- Ne pas ajouter une base distante avant que le besoin multi-appareils soit décidé.
- Ne pas mettre en file une mutation ordonnée sans identifiant d'opération et précondition serveur.
- Ne pas changer un identifiant de leçon ou supprimer une révision encore référencée.
- Ne pas gonfler l'interface avec des badges, gradients ou cartes sans fonction pédagogique.
- Ne pas déclarer une fonctionnalité « IA » ou « phonétique » si elle repose sur des règles ou une transcription.

