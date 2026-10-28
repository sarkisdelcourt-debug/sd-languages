# L-D — Multi-onglets, PWA, IA : matrice établie par lecture du code (23/10/2026)

**Provenance.** Lecture de `apps/web/src/local/browser-store.ts`, `apps/web/public/sw.js`, `apps/web/src/ai/*`, `packages/engine/src/modules/ai-coach.ts` et du README. **Aucun essai en navigateur** : chaque ligne dit ce que le code fait, pas ce qui a été observé. Les cases « à essayer » ne sont pas confirmées.

## 1. Plusieurs onglets

| Situation | Ce que fait le code | Risque | Statut |
|---|---|---|---|
| Deux onglets modifient la progression | Toute écriture passe par `exclusive()` : verrou Web Locks `LOCK_NAME` si disponible, sinon file mémoire de l'onglet | Sans Web Locks (anciens Safari), deux onglets peuvent lire le même état puis écrire chacun le leur : dernier écrit gagne | à essayer ; Web Locks présents ? **non vérifié** sur iPhone |
| Un onglet est prévenu qu'un autre a écrit | `BroadcastChannel` + `onExternalChange` | Dépend de l'utilisation de l'écouteur par l'interface (non relu) | à essayer |
| Révision : deux onglets révisent la même carte | Corrigé le 23/10 : identifiant de tentative partagé par carte affichée | Deux onglets génèrent deux identifiants différents → deux révisions comptées | limite connue |
| Export en cours pendant une action | `applyExportCheckpoint` : le point de relais n'est posé que si rien n'a changé | — | testé (engine) |
| Test exploratoire du coordinateur | S'est arrêté sur une attente non résolue | Ne prouve rien | à refaire en deux contextes navigateur |

## 2. PWA et mises à jour

| Situation | Ce que fait `sw.js` (cache `shell-v8`) | Risque | Statut |
|---|---|---|---|
| Nouvelle version déployée | `install` : `skipWaiting()` ; `activate` : supprime les anciens caches préfixés, `clients.claim()` | Un onglet ouvert sur l'ancienne version peut demander un script à hash ancien devenu introuvable (cache supprimé, plus sur le serveur) | **risque identifié, non reproduit** |
| Navigation | Réseau d'abord, cache en secours | — | conforme |
| Fichiers de l'application | Cache d'abord, ajout au cache après réseau | Version mixte page/scripts si le précache a échoué (`allSettled` ignore les échecs) | à essayer hors ligne |
| Données plus récentes que le code | `migrateState` lève « Version de données non prise en charge » si la version stockée dépasse celle du code | Un onglet ou un appareil resté sur l'ancien code ne peut plus lire la progression | **à tester** |
| Tests du service worker | README : « pas encore de tests navigateur automatisés » | — | écart assumé |

## 3. IA facultative

| Sujet | Ce que fait le code | Statut |
|---|---|---|
| Activation | Désactivée par défaut ; exige `sk-ant-…` (`hasUsableKey`) | conforme |
| Stockage de la clé | Zone « meta » d'IndexedDB, hors progression, hors export de relais, effacée par « Effacer mes données » | conforme au commentaire du code ; **non testé** par un test de l'export |
| Appel | Directement depuis le navigateur (`dangerouslyAllowBrowser: true`), `maxRetries: 1`, délai 20 s | la clé est lisible par tout script de la page |
| Contenu envoyé | Dernières répliques, message, langue, niveau estimé, objectif, scénario, consigne du coach (« médecin ») | décrit dans le README depuis le 23/10 |
| Erreurs réseau | Hors ligne, plafond, clé refusée, réponse invalide, refus du modèle : retour au coach local, jamais d'exception | conforme à la lecture |
| Plafond mensuel | Estimation locale du coût (10 $ par défaut) | estimation, pas la facture |
| Écarts README corrigés le 23/10 | « ni clé d'API », « jamais présenté comme une IA », « aucune requête réseau » étaient faux | corrigé |
| Signalement à l'apprenant d'une réponse IA | `AI_NOTICE_EVENT` existe | **non relu, non testé** |

## À faire avec un navigateur
1. Deux onglets sur un vrai navigateur avec et sans Web Locks (Safari ancien).
2. Déployer deux versions et ouvrir l'ancienne pendant le déploiement (scripts introuvables ?).
3. Ouvrir la progression d'une version récente avec le code d'une version plus ancienne.
4. Vérifier à l'écran que les réponses IA sont signalées comme telles.
