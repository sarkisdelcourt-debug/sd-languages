# SD Languages — audit utilisateur et pédagogique ciblé

24 octobre 2026. Complément à l’audit du 23 octobre, à intégrer au même suivi Claude Code.

Dépôt : `C:/Users/SD/Documents/Codex/2026-10-19/referenced-chatgpt-conversation-this-is-an/exports/SD-Languages-complet-Claude-2026-10-21-final`.

## Conclusion

Languages est plus lisible et mieux focalisé pendant un exercice que Music Lab. Le principal défaut se situe avant l’action : plusieurs portes d’entrée concurrentes, beaucoup de contenu déplié et des recommandations dont la justification n’est pas toujours fidèle. La cohérence entre objectif, leçon, oral et bilan doit devenir la priorité.

Le dialogue local a correctement résisté au test de réponse hors sujet. La séance guidée a conservé son étape après navigation. Il faut préserver ces comportements et améliorer la précision des retours plutôt que remplacer tout le produit.

## Portée réelle

Inspection du rendu ordinateur, viewport 390 × 844, accueil, leçon anglaise A1, exercice d’association avec erreur volontaire, retour correctif, reprise de séance, vocabulaire, prononciation, dialogue local, carte du parcours espagnol, compétences espagnoles, révisions anglaises et relais de données. Sources ciblées consultées pour corroborer les constats.

Application exécutée sur une origine locale distincte `http://127.0.0.1:5194`, avec progression synthétique IndexedDB. La progression personnelle, l’ancienne base serveur et la séance B1 personnelle n’ont pas été modifiées. Aucune source applicative modifiée.

Limites : audit rapide ciblé, pas audit exhaustif. Ni cours complet, ni diagnostic complet, ni contenu allemand, ni les centaines de phrases, ni toutes les variantes de correction n’ont été validés. Pas de microphone, de reconnaissance réellement déclenchée, d’écoute humaine, d’appel IA, d’import/export effectif ou de recette PWA hors ligne sur iPhone. Le service worker n’est pas activé dans cette instance de développement. Aucune nouvelle suite de tests complète exécutée. La délégation complémentaire a été interrompue par une limite d’usage ; les conclusions ci-dessous reposent sur les inspections effectuées par le coordinateur, pas sur un audit Astra achevé.

## Constats et corrections

### LU-01 — P1 : la promesse sur la voix dépasse ce que garantit l’écran

**Observé et corroboré par le code.** Le laboratoire annonce en tête « L’audio n’est jamais enregistré ni envoyé ». Il propose ensuite un enregistrement temporaire et une reconnaissance dont le service vocal peut nécessiter Internet. `apps/web/src/lib/browser-speech.ts:53` instancie `SpeechRecognition` / `webkitSpeechRecognition` sans imposer un traitement local. Le bandeau figure dans `PronunciationLabView.tsx:175`.

Ce constat ne prouve pas une transmission pendant l’audit : aucune reconnaissance n’a été lancée. Il établit que la garantie globale « jamais envoyé » n’est pas justifiée pour toutes les options proposées.

**Correction :** distinguer clairement « Enregistrement pour vous réécouter : conservé temporairement sur cet appareil » et « Reconnaissance vocale du navigateur : peut utiliser un service distant selon le navigateur ». Remplacer « jamais enregistré » par « jamais conservé durablement par cette fonction ». Afficher cette distinction avant d’activer la reconnaissance ; garder une saisie manuelle et un enregistrement local séparés.

**Acceptation :** tous les messages sur voix, dictée et mode local décrivent la même réalité. Contrôler la route réseau et les permissions sur les navigateurs effectivement supportés avant toute promesse absolue.

### LU-02 — P2 : lien pédagogique erroné entre leçon et oral

**Reproduit.** Après avoir commencé « Commander simplement au café », Parler recommande « Where is gate twelve? », avec la justification « Cette phrase reprend la leçon actuellement en cours. »

**Cause précise :** `packages/shared/src/pronunciation.ts:8-9` relie cette phrase d’aéroport à `lesson-en-daily-basics`, identifiant de la leçon du café dans `packages/shared/src/lessons.ts`. `packages/engine/src/modules/pronunciation.ts:26-54` fait confiance à ce lien pour afficher la justification.

**Correction :** une phrase orale réellement alignée, par exemple une commande au café. Auditer toutes les associations `sourceLessonId`, surtout après réécriture des leçons. Si la correspondance est seulement de niveau, dire « phrase du même niveau », pas « reprend votre leçon ».

**Acceptation :** pour chaque leçon, phrase recommandée et objectif concordent ; ajouter un contrôle éditorial des associations, pas seulement un test d’existence de l’identifiant.

### LU-03 — P2 : sur mobile, la carte du parcours masque l’action utile

**Mesuré sur le parcours espagnol initial, viewport 390 × 844.** Le bouton « Commencer la leçon » est situé vers y=2 335 dans le document. Il faut traverser les quatre chapitres et de nombreuses étapes verrouillées avant de commencer l’étape disponible. Aucun débordement horizontal dans cette mesure : largeur document 375 pour viewport 390.

**Correction :** présenter d’abord la séance recommandée, son objectif, sa durée et son bouton. Carte du parcours sous « Voir mon parcours », avec chapitre courant ouvert et futurs chapitres repliés. Conserver les accès au parcours complet.

**Acceptation :** à 390 × 844, la première action utile est visible dans le premier écran ou immédiatement après le résumé court ; texte confortable, barre basse sans obstruction, aucun besoin de passer devant onze étapes verrouillées.

### LU-04 — P2 : recommandations de conversation orientées vers la cible, pas le point de départ

**Observé sur le profil neuf sans niveau établi.** Le dialogue liste d’abord B2 « Résoudre un incident avec un client », puis B1 et A2, tous marqués « Recommandé : Progression vers B2 ». Le scénario A1 du café vient en dernier, alors que la leçon et l’accueil dirigent le même profil vers A1.

La cible B2 peut expliquer cette liste, mais le mot « recommandé » ne permet pas de distinguer une séance accessible maintenant d’un objectif futur.

**Correction :** une recommandation principale adaptée au niveau observé/déclaré, avec difficulté explicite ; séparer « Pour maintenant » et « Pour aller plus loin ». Sans diagnostic, offrir un choix simple « commencer doucement » ou « indiquer mon niveau ».

**Acceptation :** même référence de niveau entre accueil, leçon et conversation ; une cible B2 n’entraîne pas automatiquement une première activité B2. Conserver la possibilité de choisir librement un défi.

### LU-05 — P2 : le feedback d’association n’identifie pas précisément les paires ratées

**Reproduit.** Dans l’exercice café, inversion volontaire de coffee/thé et tea/café, deux autres paires correctes. La correction affiche toutes les associations attendues deux fois : dans un grand titre puis dans « Forme attendue ». Elle ajoute une explication sur l’article a et « Au moins une paire est inversée ».

Le retour donne bien la solution et permet de réessayer, mais il demande de refaire soi-même le diagnostic et insiste sur une règle qui ne correspond pas à l’erreur de vocabulaire commise.

**Correction :** montrer « Tu as associé a coffee à un thé ; attendu : un café », puis la deuxième paire erronée ; conserver visuellement les paires correctes. Mettre l’explication de l’article dans une aide facultative. Proposer une récupération courte, puis une vérification différée dans un nouvel ordre.

**Acceptation :** feedback ciblé sur les paires incorrectes, pas de répétition intégrale de la solution dans le titre, aucun codage uniquement rouge/vert ; réussite après indice distinguée d’une première réussite autonome.

### LU-06 — P2 : le vocabulaire présente un catalogue avant de proposer une séance

**Observé.** Pour l’anglais, 539 mots, 34 listes thématiques plus « Toutes les listes » et « Mot au hasard », choix du sens et du format, puis bouton « Commencer une série de 10 ». Les premiers thèmes sont spécialisés et B1/B2, y compris sur le profil initial.

**Correction :** première carte « 10 mots utiles maintenant », avec thème et niveau ; afficher trois thèmes récents/recommandés, puis recherche et catalogue filtrable par usage et niveau. Garder les domaines médicaux, utiles au profil de SD, sans les imposer à toutes les séances. « Mot au hasard sans fin » doit annoncer une sortie et pouvoir devenir une série bornée.

**Acceptation :** démarrer une séance pertinente en deux actions maximum ; thème, direction et format restent visibles pendant la série ; retour au catalogue sans perdre les réglages.

### LU-07 — P2 : les compteurs de relais divergent après une conversation

**Reproduit.** Après la leçon et les deux messages du dialogue, la barre latérale indique « 3 changements à envoyer » alors que Mes données indique « 6 changements pas encore envoyés » sur le même écran. Capture conservée.

**Piste de cause :** `App.tsx` conserve le statut du relais et le rafraîchit via plusieurs callbacks `onProgress`. `DataView.tsx` recharge son propre statut à l’ouverture. À confirmer précisément sur les callbacks de conversation et parole avant correction ; aucune perte de progression n’est démontrée.

**Correction :** statut partagé ou notification après toute mutation persistée, y compris parole/conversation. Privilégier « Progression enregistrée ici · transfert à faire » ; réserver les nombres techniques à Mes données si leur unité ne correspond pas à des actions compréhensibles.

**Acceptation :** même statut dans navigation et Mes données après leçon, conversation, oral, réglages et reprise ; vérifier la mise à jour sans rechargement manuel. Ne pas confondre ce défaut d’affichage avec l’ancien bug de checkpoint.

### LU-08 — P2 : la carte des acquis surcharge l’utilisateur avant les premières données

**Observé en espagnol.** De nombreuses compétences sont toutes dépliées, chacune avec exposition, réussite récente, stabilité, erreurs ouvertes, prochaine révision et action. Pour un profil neuf, la plupart des valeurs sont zéro, tiret ou « aucune carte ».

**Point positif :** les états sont fondés sur des traces et explicités. `SkillsView.tsx` utilise textes et symboles en plus des couleurs. Il faut préserver ces preuves tout en réduisant leur présence initiale.

**Correction :** afficher d’abord « À travailler maintenant », puis acquis observés ; compétences jamais rencontrées dans un catalogue replié. Détail des cinq indicateurs à la demande. Renommer ou expliquer « stabilité » avant de présenter un pourcentage comme évident.

**Acceptation :** un utilisateur peut identifier sa prochaine compétence et comprendre pourquoi sans lire toutes les fiches ; les preuves restent accessibles.

### LU-09 — P2 éditorial : l’introduction d’une leçon déborde de son objectif

**Observé et source `packages/shared/src/lessons.ts:26-34`.** « Commander simplement au café » présente I would like, puis le -s de he/she, child→children et « She has two children ». Les exercices du café testés ensuite sont mieux centrés sur la situation.

**Correction :** limiter le repère initial à commander, préciser une boisson et dire please ; déplacer la conjugaison et les pluriels vers leurs leçons. Auditer les introductions après les révisions des banques d’exercices.

**Acceptation :** chaque règle introduite est nécessaire à la tâche et réutilisée dans la séance ; les exemples illustrent la situation annoncée. Un rappel transversal doit être identifié comme tel.

### LU-10 — P3 : accueil avec plusieurs invitations de même importance

**Observé.** Personnaliser le parcours, faire le diagnostic, parcours du jour, leçon guidée, exercices, vocabulaire et oral se succèdent. Une grande carte sombre accorde aussi beaucoup de place à 0 XP sur profil neuf. « Précision 0 % » traduit une absence de réponses comme un résultat nul.

**Correction :** une prochaine action principale ; niveau à indiquer ou diagnostic comme options d’un même démarrage ; masquer les indicateurs sans données ou écrire « pas encore mesuré ». Placer les XP après le résultat concret de la séance, sans les assimiler à la maîtrise.

## Ce qui a réellement bien fonctionné

- Erreur d’association détectée, correction puis action explicite pour réessayer.
- Après visite de Vocabulaire et Parler, retour à la bonne étape corrective de la leçon.
- Réponse « The spaceship repairs purple bicycles. » au café : le coach reste à l’étape 1, recentre et propose coffee/tea. « I would like a coffee, please. » fait correctement avancer à l’étape 2.
- L’erreur génère une carte de révision avec question de rappel avant affichage de la réponse.
- Navigation mobile à cinq entrées, contenu sans débordement horizontal sur l’état testé ; le problème vient surtout de l’ordre vertical.
- L’outil oral précise que le score compare les mots et ne mesure pas l’accent ni les phonèmes. Cette précision est à conserver et à rapprocher des résultats.

## Améliorations graphiques proposées

Conserver l’identité actuelle, les surfaces claires et la navigation latérale sur PC. Réduire les grands bandeaux, les répétitions et les cartes vides plutôt que changer toute la palette.

Écran du soir sur téléphone : « Anglais · 10 min · Commander au café », bouton Reprendre/Commencer, objectif en une phrase, puis un aperçu de l’étape. En dessous seulement : révisions dues et choix d’une autre activité. Le parcours complet devient une vue secondaire.

Dans une activité : consigne courte, réponse, bouton de validation, retour ciblé, prochaine action. Au maximum une notion nouvelle explicitement introduite à la fois. Réserver le grand titre à la tâche, pas à la totalité de la correction.

Vocabulaire : recherche, filtres niveau/usage et thèmes regroupés ; listes complètes dans un volet. Compétences : trois priorités lisibles et détails des preuves repliables. Oral : deux routes visuellement séparées, « M’écouter » et « Comparer les mots reconnus », avec limites propres à chacune. Relais : état de sauvegarde clair, action de transfert explicite, aucun compteur contradictoire.

Accessibilité à conserver et compléter : texte et forme en plus de la couleur, taille confortable sur téléphone, focus visible, lecture du feedback, validation sans déplacer brutalement le contexte. Contraste actuel non remesuré dans cet audit ; ne pas recycler les anciennes valeurs comme défauts présents.

## Feuille de route

| Lot | Priorité et travail | Vérification de sortie |
|---|---|---|
| A | LU-01, LU-02, LU-07 : messages honnêtes, association leçon/oral, statut de relais | Reproductions corrigées ; aucun message global de confidentialité contredit par une option ; statuts concordants |
| B | LU-03, LU-04, LU-10 : démarrage et recommandation cohérents | Profil neuf et B1 déclaré testés ; première action disponible immédiatement sur 390 × 844 ; cible séparée du niveau actuel |
| C | LU-05, LU-09 : alignement pédagogique et correction précise | Chaque erreur déclenche un retour pertinent ; introductions/exercices/dialogues alignés ; nouvel essai autonome après indice |
| D | LU-06, LU-08 : catalogue et compétences lisibles | Série pertinente démarrée rapidement ; prochaine compétence identifiable ; détails accessibles |
| E | Recette différée réelle | iPhone installé et hors ligne, voix, clavier, relais PC↔iPhone sur copies, banque allemand/espagnol, variantes valides de réponses |

Adapter aussi les objectifs au profil réel : anglais B1 pour aisance et nuances, allemand pour réactivation, espagnol pour bases. Ne pas appliquer le diagnostic du profil neuf de cet audit à la progression personnelle de SD.

## Relais Claude Code

Reproduire les constats sur le dépôt actuel, fusionner avec les tickets du 23 octobre et préserver les réparations déjà réalisées. Aucun ancien défaut d’import, de rejeu ou de série quotidienne n’est redéclaré présent sans nouveau test.

Fichiers à examiner : `App.tsx`, `DashboardView.tsx`, `GuidedLessonView.tsx`, `ExerciseAnswer.tsx`, `VocabularyView.tsx`, `SkillsView.tsx`, `PronunciationLabView.tsx`, `ConversationView.tsx`, `DataView.tsx`, `lib/browser-speech.ts`, `packages/shared/src/lessons.ts`, `pronunciation.ts`, moteur des recommandations et du relais.

Ne pas toucher à la progression personnelle ni clore la séance B1 active. Employer des profils synthétiques et copies de sauvegarde. Tests ciblés après corrections, puis contrôles projet requis selon les instructions locales. Les captures de cet audit sont dans `languages-captures/` : correction, parcours mobile, compteurs de relais.
