# SD Languages — audit et feuille de route
23 octobre 2026. Dépôt : C:/Users/SD/Documents/Codex/2026-10-19/referenced-chatgpt-conversation-this-is-an/exports/SD-Languages-complet-Claude-2026-10-21-final.

## Validation et limites
Inspection Astra puis reproductions exécutées par le coordinateur après interruption du quota Astra. Les 230 tests et types réussis sont ceux du précédent audit, non une nouvelle suite complète. Les reproductions ci-dessous utilisent des états synthétiques ; aucun profil personnel modifié. Analyse graphique fondée sur les sources, sans rendu observé.

## Défauts
**LANG-01 — P1 données : import insuffisamment validé. Reproduit.** packages/engine/src/backup.ts:161 accepte reviewCards:[null]. createDashboard échoue ensuite avec « Cannot read properties of null (reading 'language') ». Valider chaque élément et les relations entre identifiants avant remplacement ; conserver une sauvegarde précédente. Refuser l'import avec un message localisé précis.

**LANG-02 — P2 relais : checkpoint non enregistré après activité. Reproduit.** apps/web/src/local/device.ts:97 compare changesSinceCheckpoint de l'état courant avec le compteur de la sauvegarde déjà remis à zéro. État synthétique : avant=1, sauvegarde=0, comparaison=false. Capturer une révision avant export et comparer cette révision après export ; ne pas perdre les modifications faites pendant l'opération. Tests sans activité, avec activité, activité pendant export et échec de téléchargement.

**LANG-03 — P2 pédagogie : erreurs considérées résolues malgré un nouvel échec. Reproduit.** Dans les modules de progression/pratique, séquence faux, juste, juste, juste, faux : occurrenceCount=2, resolvedCount=3, erreurs ouvertes calculées=0 alors que lastCorrect=false. Définir la sémantique de résolution : une réussite résout un épisode ouvert, pas un crédit illimité consommant les futurs échecs. Test de cette séquence et migration prudente des compteurs existants.

**LANG-04 — P2 progression : même révision validée deux fois. Reproduit au moteur.** Deux POST consécutifs sur /api/reviews/:id, rating=good, produisent repetitions=2, intervalDays=4 et +10 XP. Le moteur accepte donc un rejeu comme une nouvelle révision. Le déclenchement exact par double clic UI reste à confirmer. Ajouter identifiant de tentative et vérification de version de carte ; une répétition de requête doit retourner le résultat initial.

**LANG-05 — P2 calendrier : série quotidienne fondée sur UTC. Reproduit.** Deux séances le 23/10 à 23h30 puis le 24/10 à 00h30, heure de Paris, donnent une série de 1 et date 2026-10-23. packages/engine/src/modules/progress.ts : définir un jour d'apprentissage selon le fuseau choisi. Tester minuit, changement d'heure et changement de fuseau ; décider explicitement le traitement du voyage.

## Risques restant à vérifier
Le test exploratoire de concurrence multi-store s'est arrêté sur une attente non résolue ; il ne prouve pas une perte de données. Refaire en deux contextes navigateur et préciser la présence des Web Locks. Vérifier aussi les mises à jour du cache PWA et les ajouts IA signalés par Astra : stockage des clés, contenu envoyé, erreurs réseau, garanties du README. Ces pistes ne sont pas classées comme failles confirmées.

## Feuille de route
| Lot | Travail | Dépendances | Effort | Acceptation |
|---|---|---|---|---|
| L-A | Import strict et sauvegarde de récupération | aucune | M | aucun import invalide ne remplace un profil sain |
| L-B | Checkpoint révisé et rejeu idempotent | A | M | export/reprise sans faux conflit, une tentative comptée une fois |
| L-C | Sémantique erreurs et jours locaux | B | M | les séquences reproduites passent, historique préservé |
| L-D | Audit multi-onglets, PWA et IA | A–C | M | matrice offline/mise à jour/conflits documentée, README exact |
| L-E | Séance quotidienne centrée sur les besoins | C/D | M | objectif clair, révision due, exercice, bilan |
| L-F | Progression par compétences et entraînement oral | E | L | acquis expliqués, feedback traçable, repli sans IA |

## Améliorations graphiques
Orientation proposée : espace d'apprentissage calme. Mettre une action « Continuer ma séance » en premier, puis la langue active, le temps prévu et l'objectif. Séparer maîtrise et XP pour éviter qu'un score élevé soit présenté comme une compétence démontrée. Réduire l'empilement de cartes de statistiques.

Dans l'exercice : énoncé, réponse, retour et prochaine action dans un ordre stable. L'erreur doit expliquer ce qui change et proposer une courte reprise. Les tableaux de progression utilisent texte et symboles en plus de la couleur. Ajouter une zone claire de sauvegarde/relais, avec date et appareil.

Le script exploratoire calcule 1,87:1 pour blanc sur #4fd1c0 et 3,05:1 pour blanc sur #ed6b64. Ces rapports décrivent les paires de couleurs, pas la conformité d'un composant réellement rendu : vérifier leur usage, taille et état avant correction. Employer du texte sombre sur les accents clairs et mesurer tous les états sur le rendu final.

Acceptation : clavier, lecture des retours par lecteur d'écran, focus stable, zoom 200 %, écrans étroits, couleurs distinguables sans perception rouge/vert, fonctionnement sans animation et état réseau compréhensible.

## Relais Claude Code
Commencer par L-A à L-C. Réutiliser les séquences exactes dans les tests. Préserver données existantes et rendre les migrations réversibles. Ne pas présenter la piste multi-onglets comme confirmée. Terminer par tests moteur et parcours navigateur import/export/révision, puis audit réel du rendu.
