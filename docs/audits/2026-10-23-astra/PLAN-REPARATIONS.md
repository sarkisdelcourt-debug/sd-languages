# PLAN-REPARATIONS — SD Languages (audit Astra du 23/10/2026)

**Statut : plan, aucune réparation effectuée.** Rapport source : `AUDIT-ASTRA-SD-LANGUAGES.md` (même dossier).
**Provenance :** agents Astra interrompus par la limite d'usage ; reproductions faites par le coordinateur sur états synthétiques (aucun profil personnel modifié). Les 230 tests et types viennent du précédent audit, pas d'une nouvelle suite complète. Aucun rendu observé. Planner Scinti 13 hors périmètre.

## Contraintes locales
Aucun `CLAUDE.md` ni `AGENTS.md` trouvé dans ce dépôt. Hypothèses prudentes :
- Lire le README et la configuration des tests avant de modifier ; conserver les commandes de test existantes.
- Préserver les données existantes, migrations réversibles, sauvegarde avant remplacement.
- Ne pas présenter la piste multi-onglets comme confirmée.
- Le chemin est un export (`SD-Languages-complet-Claude-2026-10-21-final`) : vérifier avant d'éditer qu'il s'agit bien du dépôt de travail, et sa correspondance avec la version déployée.

## Lots
| Lot | Priorité | Constats | Dépendances | Effort | Critère d'acceptation |
|---|---|---|---|---|---|
| L-A | P1 | LANG-01 | aucune | M | aucun import invalide ne remplace un profil sain, message précis |
| L-B | P2 | LANG-02, LANG-04 | A | M | export/reprise sans faux conflit, une tentative comptée une fois |
| L-C | P2 | LANG-03, LANG-05 | B | M | séquences reproduites passent, historique préservé |
| L-D | à vérifier | multi-onglets, PWA, IA | A–C | M | matrice offline / mise à jour / conflits, README exact |
| L-E | évolution | séance quotidienne | C, D | M | objectif, révision due, exercice, bilan |
| L-F | évolution | compétences, oral | E | L | acquis expliqués, feedback traçable, repli sans IA |

Ordre de reprise global : 3e position (L-A/B), L-C en 5e.

## Séquences exactes à réutiliser en test
- LANG-01 : `reviewCards:[null]`.
- LANG-03 : faux, juste, juste, juste, faux → erreur ouverte attendue.
- LANG-04 : deux POST `/api/reviews/:id`, rating=good → résultat initial renvoyé, +10 XP une seule fois.
- LANG-05 : 23/10 23h30 puis 24/10 00h30 heure de Paris → série de 2. Tester aussi changement d'heure et de fuseau.
- LANG-02 : activité pendant export, échec de téléchargement.

## Suivi
| ID | Reproduction | Correction | Tests | Statut | Limites |
|---|---|---|---|---|---|
| LANG-01 | reproduit le 23/10/2026 par test (`reviewCards:[null]` acceptée) | `parseBackupFile` (`packages/engine/src/backup.ts`) vérifie chaque élément de `reviewCards`, `mistakes`, `lessonSessions`, `processedAttemptIds` (objet, `id`, langue, statut de séance, types des champs présents), refuse les identifiants en double, les conversations/réglages/progressions abîmés et un bloc `sync` incohérent ; dernier filet : l'état migré doit passer `createDashboard`/`summarizeState`/`isPristine`, sinon import refusé avant tout remplacement | `backup.test.ts` : 5 tests (messages précis par élément, ancien profil accepté, « tout fichier accepté est affichable ») | **corrigé** (23/10/2026, non commité) | champs obligatoires volontairement minimaux (`id`, `language`, `status`) pour ne pas rejeter d'anciennes exportations ; `pronunciationAttempts` reste filtré en silence par `migrateState` ; non essayé avec un vrai fichier exporté de l'iPhone/PC (à faire : exporter puis réimporter sur copie). `store.replace` sauvegardait déjà l'état précédent (`before-import`) |
| LANG-02 | reproduit le 23/10/2026 par lecture : `createBackup` met le compteur à 0 puis `exportProgress` le compare au compteur courant | `syncRevision` (révision relevée avant l'export) + `applyExportCheckpoint` (`backup.ts`) ; `apps/web/src/local/device.ts` les utilise ; le travail fait pendant la feuille de partage n'est pas perdu et le point n'est pas posé | `backup.test.ts` : 4 tests (activité préalable, sans activité, activité pendant l'envoi, état non modifié en place) | **corrigé** (23/10/2026, non commité) | « échec de téléchargement » : `exportProgress` ne pose le point qu'après un envoi réussi (structure inchangée, non testé en navigateur) ; pas d'essai réel avec la feuille de partage iOS |
| LANG-03 | reproduit (séquence exacte de l'audit : faux, juste, juste, juste, faux → 0 erreur ouverte) ; contrôle par mutation le 23/10/2026 | `unresolvedCount` (`packages/engine/src/modules/mistakes.ts`) : chaque réussite solde **un** échec déjà survenu ; `resolvedCount` est plafonné à `occurrenceCount` à l'écriture (`practice-attempt.ts`) ; à la lecture, un profil déjà enregistré avec trop de crédit est corrigé **sans toucher aux compteurs** (dernier essai faux = au moins 1 erreur ouverte) ; branché sur les 5 sites (`adaptive-practice` ×2, `daily-plan`, `guided-lessons`, `skills`) | `mistakes-and-streak.test.ts` (5 tests : séquence reproduite, 5 autres séquences, rejeu, données existantes, plan quotidien) | **corrigé** (23/10/2026, non commité) | **sémantique confirmée par SD le 24/10/2026 : une réussite solde UN échec** : deux échecs de suite puis une réussite = 1 erreur encore ouverte (la réussite solde un échec) ; l'autre lecture possible (« épisode » : une réussite solde tous les échecs consécutifs) donnerait 0. Aucune migration des données enregistrées (donc réversible) ; les compteurs existants gardent leur valeur |
| LANG-04 | reproduit au moteur le 23/10/2026 (test rouge : le rejeu renvoyait une carte différente) ; **l'écran n'avait aucun garde contre le second clic** (`ReviewView.tsx`) | `POST /api/reviews/:cardId` exige `attemptId`, ignore un rejeu et renvoie la carte telle quelle (`rememberAttempt`, partagé avec les exercices, 1 000 dernières) ; `ReviewView` envoie un identifiant stable par carte affichée et bloque le second clic | `review-idempotence.test.ts` : 3 tests | **corrigé** (23/10/2026, non commité) | **changement de contrat** : tout appelant de l'API sans `attemptId` reçoit 400 (seul le client web en dépend, livré avec le moteur dans le même bundle ; vérifier qu'aucun cache PWA ancien ne mélange les versions) ; pas de vérification de version de carte (l'identifiant de tentative suffit au rejeu) ; la concurrence réelle est sérialisée par `BrowserStore` (non testée ici) |
| LANG-05 | reproduit (23h30 puis 00h30 à Paris : série 1, date 2026-10-23) ; contrôle par mutation | `learningDay(date, timeZone)`, `previousDay`, `deviceTimeZone` (`packages/engine/src/modules/progress.ts`) ; `recordPractice` compte en jours du fuseau de l'appareil (paramètre injectable), la veille est calculée sur la date (changements d'heure sûrs), fuseau inconnu → UTC | 7 tests : minuit à Paris, même instants en UTC, jour sauté, passage à l'heure d'hiver (journée de 25 h) et d'été (23 h), voyage Paris/New York, fuseau inconnu, bords de mois | **corrigé** (23/10/2026, non commité) | suite complète exécutée dans 3 fuseaux (UTC, Paris, Los Angeles) : 254 tests verts ; **règle de voyage décidée par défaut** : le jour est celui du fuseau en vigueur au moment de la séance (peut fusionner ou séparer des jours en voyage) — à confirmer ; `lastPracticeDate` déjà enregistrées en UTC : un décalage d'un jour est possible une seule fois à la transition ; la rotation quotidienne (`adaptive-practice.ts`, `router.ts`) utilise maintenant le même jour local (1 test, 255 tests verts dans 3 fuseaux) ; **L-D : matrice écrite par lecture du code** (`L-D-MATRICE.md`) et README corrigé (coach IA facultatif, clé API, requêtes réseau) ; aucun essai navigateur |

## Contrastes mesurés et corrigés le 24/10/2026
Mesure dans un vrai navigateur (couleur calculée de chaque texte contre son fond effectif, seuils 4,5:1 / 3:1 en grand texte) sur les 11 sections, thèmes clair et sombre. Défauts trouvés et corrigés dans `apps/web/src/styles.css` : bouton principal en thème sombre (blanc sur `#4fd1c0`, 1,87:1 → 9,1:1, variable `--on-accent`) ; pastille de parcours (même cas) ; boutons « Commencer la leçon » / « Écouter » et pastilles de chapitre (texte `--accent-ink` sur ambre ou menthe : 1,19:1 en sombre et ~4,0:1 en clair → 7,2:1) ; badge de navigation (blanc sur `#ed6b64`, 3,05:1 → 5,97:1) ; texte atténué du thème clair (`--muted` 3,87:1 sur fonds teintés → 4,81:1) ; texte atténué sur les cartes à fond sombre fixe (≈ 3:1 → ≥ 7:1). Résultat final : 850 textes mesurés par thème, **zéro défaut**. Limites : états au survol/focus, écrans étroits et pages ouvertes par une action non visitées ; mesure sur fond uni seulement (fonds en dégradé ignorés). Non commité.

## Rappels
Contrastes cités (1,87:1 et 3,05:1) décrivent des paires de couleurs, pas un rendu réel : mesurer sur l'écran final. Aucune publication.
