# SD Languages — audit indépendant du 26 octobre 2026

Périmètre : dépôt GitHub `sarkisdelcourt-debug/sd-languages`, branche `main`, commit `b86b750` (26/10/2026 16:01, « Phrases du quotidien… »). Audit en lecture seule dans un clone isolé : aucun fichier suivi modifié, aucun commit, aucune dépendance changée, `data/` jamais touché, aucun appel à l'API Anthropic, aucune vraie clé. Les scripts de preuve sont dans le dossier de travail de la session (`scratchpad/repro`, `scratchpad/content`, `scratchpad/pwa`, `scratchpad/ai`).

Méthode : lecture des docs et du code ; exécution des quatre vérifications ; reproduction des parcours sur le moteur avec des profils synthétiques ; trois relectures indépendantes parallèles (contenu/correction, PWA/iPhone, coach IA) dont j'ai recoupé moi-même chaque constat majeur par un appel direct au code.

Légende : **Confirmé** = reproduit ou démontré par un chemin de code complet · **Probable** = mécanisme lu, une condition reste à vérifier · **À vérifier** = preuve ou environnement manquant (iPhone réel, Safari, réseau).

---

## 0. Verdict

**Oui pour l'anglais au quotidien, avec trois réserves à connaître. Non pour faire confiance à l'allemand saisi au clavier tant que le tréma n'est pas corrigé.**

Ce qui tient vraiment :
- **Ta progression est bien protégée.** Stockage dans l'appareil, écriture exclusive entre onglets, copie quotidienne et copie avant chaque remplacement, import validé champ par champ avec aperçu et avertissements, double confirmation pour effacer. Je n'ai trouvé **aucune perte silencieuse ni double comptage** sur les six scénarios demandés. C'est la partie la plus solide du projet.
- **Le contenu est juste.** Sur 158 exercices lus en entier (3 langues, tous niveaux, 6 formats, tous les générateurs, les 18 questions de diagnostic) : **zéro réponse attendue fausse**, un français d'explication propre, un anglais médical qui colle à ton métier.
- Les quatre vérifications sont vertes (typecheck, 285 tests, build, `sw.js`).

Les trois réserves réellement importantes :
1. **« Maîtrisée » ne prouve pas que tu savais.** Dans une leçon, après une erreur l'app affiche la « Forme attendue », puis propose « Réessayer » : tu la recopies, et la leçon est comptée maîtrisée, l'erreur soldée, le niveau suivant débloqué. L'indice est en plus toujours affiché avant même la première réponse. L'app ne distingue donc pas « je savais » de « j'ai réussi après avoir vu la solution ». (Confirmé, reproduit.)
2. **Le correcteur a quatre trous qui valident des réponses fausses** : en allemand il ignore le tréma (« wurde » accepté pour « würde », donc le prétérit passe pour le Konjunktiv II) ; dans « Phrases du quotidien » la négation « n't » est invisible (« The air conditioning **is** working » jugée « comprise » alors qu'on attendait « **isn't** working ») et les mots sont vérifiés en vrac (« Today is Tuesday and tomorrow is Monday » accepté pour l'inverse) ; dans le vocabulaire vers le français, l'article est mal retiré et **« toux », « poumons », « TEP » sont refusés** alors que « e toux » est accepté. (Tous Confirmés par appel direct au correcteur.)
3. **Hors ligne sur iPhone, deux pièges** : un écran blanc possible si une mise à jour est interrompue (la page en cache réclame un script qui n'y est pas), et des voix Piper muettes sans repli pour toute phrase jamais écoutée en ligne, avec un bouton « Télécharger les voix » qui affiche ✓ même quand rien n'a été mis en cache. (Confirmés par simulation, pas sur un vrai iPhone.)

À côté de ça, la **documentation a quatre jours de retard** : elle annonce 942 exercices et 183 tests ; le code en a 6 548 (+ ~2 500 mots et 500 phrases générés à la demande) et 285 tests ; `docs/audits/` n'existe pas.

---

## 1. Principaux constats, par gravité

### Bloquants ou critiques (à corriger avant de se fier aux verdicts)

**C1 — Une leçon se « maîtrise » en recopiant la correction.** Confirmé.
`packages/engine/src/router.ts` l. 390-411 (continue), `guided-lessons.ts` l. 186-209 (`buildLessonSummary`), `GuidedLessonView.tsx` l. 343 (indice toujours affiché) et l. 354 (« Forme attendue »). Scénario reproduit sur `lesson-en-project-update` (B1) : 6 réponses « banana banana banana », 6 recopies de la forme attendue, 4 messages de 3 mots contenant le premier mot-clé donné en indice par le coach → bilan `exact 6 / incorrect 0 / outcome mastered`, carte « Maîtrisée 1 fois », 6 erreurs toutes soldées (`occ=1 res=1`), 72 XP, leçon suivante recommandée. Seule la vue « Mes acquis » garde trace des premières réponses fausses (✓✗✓✗). Conséquence : le déblocage du parcours et la mémoire des erreurs reposent sur une aide, pas sur un savoir. Correction minimale : dans le bilan, ne compter comme « exact » que la **première** tentative ; une réussite après correction devient « corrigée » (comptée ni erreur ni maîtrise) ; ne solder l'erreur mémorisée qu'à une réussite ultérieure, pas dans la même séance ; afficher l'indice sur demande. Test : le scénario ci-dessus doit donner `needs-review`.

**C2 — Allemand : le tréma est ignoré.** Confirmé. `packages/shared/src/learning.ts` l. 54-56 (`normalizeAnswer`, NFD retire U+0308). `de-b2-gap-konjunktiv` attend « würde » : « wurde » → **minor (compté juste)** ; « wuerde » (translittération standard) → incorrect. Les 42 réponses à saisir contenant würde/hätte/könnte/möchte/wäre acceptent la forme sans tréma, c'est-à-dire un autre temps. Même cause en espagnol : « habló » accepté pour « hablo ». Correction minimale : remplacer ä/ö/ü par ae/oe/ue avant le NFD, côté réponse et côté attendu. Test : pour ces 42 exercices, forme sans tréma = faux, forme translittérée = juste.

**C3 — « Se faire comprendre » valide des contresens.** Confirmé. `learning.ts` l. 164-213 (`conceptsCovered`, `hasNegation`). Trois défauts : (a) l'apostrophe est retirée avant de chercher `n't`, donc « isn't / don't / can't » ne comptent jamais comme négation — « I understand, don't worry » est « compris » pour « I don't understand » ; (b) les concepts sont cherchés en vrac sans ordre ni rôle — lundi/mardi inversés, « links » / « geradeaus » inversés, « Con gluten » pour « Sin gluten », « from London » pour « to London » passent ; (c) la tolérance aux fautes de frappe accepte des mots différents — « cuenta » pour « cuesta » (le commentaire du code affirme le contraire), « cansado » pour « casado », « manzana » pour « mañana ». Sur les phrases anglaises dont la cible est négative, la version sans négation passe dans 8 cas sur 16. Conséquence : l'écran promet « une phrase qui fait passer le message compte juste » ; ici le message passe à l'envers, y compris en situation médicale. Correction minimale : tester `n't` avant de retirer les apostrophes ; comparer la polarité à la formulation principale ; mots interdits par phrase (« con », « from ») ; refuser la tolérance de frappe quand le mot saisi existe lui-même dans le lexique de la langue. Tests générables depuis la banque (négation retirée → faux).

**C4 — Vocabulaire vers le français : article mal retiré, 194 drills cassés.** Confirmé. `packages/shared/src/content/vocab-drills.ts` l. 45 (`FRENCH_ARTICLES`, `\s*` et « un » avant « une ») utilisé l. 126-127. `vd~ff~t~en-med-v-symptoms~a-cough` attend « une toux » : « toux » → incorrect, « e toux » → exact, indice « Commence par « e » ». Idem « poumons », « TEP », « cendre » accepté pour « descendre ». Ampleur : 149 mots amputés sur 839 en anglais (presque tout le médical), 28 en allemand, 17 en espagnol. La regex correcte existe déjà l. 72 (`FRENCH_KEY_ARTICLES`). Le test existant teste `typedVariants` avec sa propre regex, pas celle du code. Correction : une ligne. Test : pour chaque drill, la réponse privée de son vrai article doit être juste et aucune variante acceptée ne doit être un fragment de mot.

### Importants

**I1 — Écran blanc hors ligne après une mise à jour interrompue.** Confirmé (simulation du service worker dans Node, pas Safari). `apps/web/public/sw.js` l. 38-46 : la nouvelle page est mise en cache dès qu'elle arrive, avant ses scripts ; l. 21 : un script manquant n'empêche pas l'installation ; l. 29-36 : l'activation efface l'ancien cache. Scénario : déploiement dans la journée, ouverture le soir en 4G faible, le JS de 1,46 Mo est coupé, réouverture en mode avion → page en cache qui pointe vers un script absent. Correction : mettre les `assets/` en cache **avant** de remplacer la page, et faire échouer l'installation si JS/CSS manquent. Test : transformer `sw-sim.mjs` en test vitest.

**I2 — Voix hors ligne : silence sans repli, et ✓ mensonger.** Confirmé (code + simulation). `apps/web/src/lib/voice-clips.ts` l. 53-62 (`playClip` renvoie vrai dès que le texte est au manifeste) et l. 75 (`.catch(() => undefined)` puis `done += 1`). Hors ligne, une phrase jamais écoutée ne produit rien et la voix de l'appareil n'est pas appelée ; « Télécharger les voix » va au bout même si le réseau tombe ou si le service worker ne contrôle pas encore la page (toute première visite). Correction : repli `speechSynthesis` sur échec de lecture ; compter les échecs et vérifier le cache après téléchargement ; proposer le bouton aussi dans les dictées. Second point lié : `sw.js` l. 69, `/bytes=(d*)-(d*)/` a perdu ses `\` : la gestion des plages audio ne fait rien (fichier entier renvoyé en 206, cohérent mais pas ce que le code prétend).

**I3 — Le dialogue avance sur un mot-clé en sous-chaîne, et la voie IA sur 3 mots.** Confirmé. `packages/engine/src/modules/coach.ts` l. 116-117 (`searchable.includes(keyword)`) et l. 184 (`buildAiReply`). Reproduit : à l'étape « échéance » du scénario projet (mots-clés `tomorrow, monday, friday, week, date, by`), « **Goodbye**, I am going home now » et « My **baby** is sick today » font avancer l'étape (coach : « Agreed. Please send me a short update by then »). « Tengo **dia**betes » valide l'étape « durée ». Les négations passent (« I hate tea » valide « tea »). Avec le coach IA, le moteur se fie à `stepAchieved` du modèle + 3 mots : « banana banana banana » ×4 avec un `body.ai` forgé donne une leçon maîtrisée (ce n'est pas une faille de sécurité — tout tourne dans ta page — mais la maîtrise affichée peut être surévaluée). Après un hors-sujet, le coach donne les mots-clés en indice : il suffit de les reprendre. Correction : mots entiers (`\b`), polarité, et pour l'IA exiger aussi un mot-clé ou une phrase corrigée de ≥ 3 mots. Test : « baby » ne doit pas valider « by ».

**I4 — Les 61 traductions rédigées refusent des réponses justes.** Confirmé. Les variantes automatiques (chiffres, contractions, US/UK) ne s'appliquent qu'aux dictées générées et aux textes à trous. `en-b1-translation-doctor-appointment` : « I have a doctor's appointment at 3. » → incorrect (« at three » et « at 3 pm » acceptés). Refusés aussi : « Can you send me the report by Friday? », « Ich bleibe zu Hause, denn es regnet », « Hace dos años que estudio español », « Si hubiésemos sabido… » (subjonctif en -se). Dans les sondes (biaisées pour piéger) : 39 variantes légitimes refusées sur 59. Conséquence pour un B1 : fausses erreurs, mémoire des erreurs polluée, confiance érodée. Correction : appliquer `numberVariants`/`contractionVariants` à toutes les traductions, ajouter les variantes listées, générer -se depuis -ra. Phrasal verbs : `en-pv-check-in-gap` « We ___ ___ at the hotel » refuse « check in » (seul « checked in » prévu, sans indication de temps) — 28 phrases sur 70.

**I5 — Le plan du jour promet une notion que la leçon proposée ne contient pas.** Confirmé. `daily-plan.ts` l. 46-55 : si une erreur est ouverte, le titre devient « Leçon guidée · <focus de l'erreur> » et la description « Cette notion sera retravaillée dans une séance complète », mais la leçon ouverte est `catalog.recommendedLessonId`, choisie séparément. Reproduit : une erreur sur le mot « a bug » (liste « Internet et technologie ») → titre « Leçon guidée · Internet et technologie », leçon réellement ouverte « Faire un point projet clair ». C'est de la personnalisation apparente. Correction : n'afficher ce titre que si la leçon recommandée contient l'exercice fautif, sinon proposer une série ciblée. Test : le scénario ci-dessus.

**I6 — Daltonisme : la sélection n'est portée que par la couleur.** Confirmé (CSS + contraste calculé). Les verdicts (✓ ≈ !), statuts de leçon, acquis, paires, QCM et badge « IA » sont bien doublés d'un texte ou d'un symbole. En revanche la langue active (`.language-pill.active`, contraste 1,2:1 en clair, 1,1:1 en sombre), les minutes et le niveau visé (`.segmented-options/.level-options .selected`, 1,1:1, sans `aria-pressed`), l'objectif (`.goal-option.selected`, bordure seule), les listes de vocabulaire/phrases et les familles de règles ne se distinguent que par une teinte. Correction : une coche « ✓ » devant tout bouton `aria-pressed="true"` (règle CSS commune) et `aria-pressed` dans `SettingsView.tsx` l. 52, 55, 68. Anneau de focus en mode clair à 1,5:1 (minimum 3:1).

**I7 — Le correcteur de conversation propose parfois une phrase corrigée fausse.** Confirmé. `language-checker.ts` : « The informations are on the table » → « The information **are** on the table » ; « The patient has a fever since two days » → « The patient has a fever **for** two days » (il faudrait « has had ») ; « She explained me » → « She explained to me the protocol ». Les explications en français sont justes ; c'est la phrase modèle affichée en « Plutôt : … » qui ne l'est pas. Il rate aussi « I have 42 years old », « responsible of », « borrow me ». Correction : corriger les règles « indénombrables » (accord du verbe) et « since/for » (present perfect), ou ne proposer une phrase que si la règle sait reconstruire toute la phrase.

**I8 — Le diagnostic sous-estime d'un niveau.** Confirmé, atténué par le niveau déclaré. `learning.ts` l. 242-254 : A1→B1 tous justes = 33 % → **A2** ; A1→B2 tous justes = 50 % → **B1**. Une seule question par niveau (deux en C1), trois QCM à 4 choix. Deux questions n'imposent pas le verbe (« would have come » refusé car la consigne cachée attend « leave ») et l'indice n'est jamais affiché dans `DiagnosticView.tsx`. Le commentaire de `level.ts` reconnaît que le diagnostic « sous-estimait l'anglais de Sarkis ». Correction : verbe dans la consigne, niveau = plus haut niveau dont toutes les questions inférieures sont justes, ou 2 questions par niveau.

**I9 — iPhone : rien ne rappelle d'envoyer la progression, et Safari ≠ app installée.** Confirmé (CSS) / Probable (iOS). `styles.css` l. 260 masque `.local-note` (« N changements à envoyer ») sous 700 px : sur téléphone l'information n'existe que dans Plus › Mes données. Or les sauvegardes internes vivent dans la même base que la progression : elles partent avec elle. Sur iOS, l'app ajoutée à l'écran d'accueil a son propre stockage : une progression commencée dans Safari n'y apparaît pas, et la première ouverture de l'app doit se faire en ligne ; ce n'est dit que dans Mes données. Correction : badge « ↑N » sur l'onglet Plus ; encart sur l'accueil quand `isIos() && !isStandalone()`.

**I10 — Coach IA : plafond non garanti, libellés faux, 40 s sans annulation.** Confirmé. Le tarif codé (0,10 $ / 0,50 $ par million de tokens) est **exact** pour Haiku 5.5 sous 100 k tokens (vérifié en ligne). Mais : (a) `coach-client.ts` l. 30-32, le cumul est lu puis réécrit sans verrou — 5 appels simultanés : 1 seul compté, plafond franchi ; cumul propre à chaque appareil et remis à zéro par « Effacer mes données » : c'est une **estimation de confort, pas un plafond de facturation** — le seul vrai plafond est la limite de dépense sur console.anthropic.com (l'interface le dit, c'est bien) ; (b) `ConversationView.tsx` l. 262, 269, 320 affichent « Mode local guidé » / « 100 % local » même quand l'IA est active, et le bandeau « Coach IA non utilisé » reste affiché après un succès ; (c) `timeout 20 s × 2 tentatives` = 40 s d'attente sans bouton si le réseau ne répond pas ; (d) la clé vit en clair dans IndexedDB sur l'origine `sarkisdelcourt-debug.github.io`, **commune à tout site GitHub Pages du même compte** : un autre projet publié là pourrait la lire. Ce qui est bon : désactivé par défaut, case de consentement, clé absente de l'état, du fichier de relais, des sauvegardes, de `/api/export`, du `localStorage` et de la console (vérifié par sondes) ; repli local propre sur 401/403/429/529/réseau/JSON cassé sans perdre la saisie ; badge « IA » sur les messages.

### Mineurs ou latents

- **Identifiants par position** (`generators.ts` l. 218, `content/*/phrases.ts`) : les paires et les phrases du quotidien sont numérotées par index ; insérer un élément déplace le contenu sous le même id et les corrections de relecture (`phrase-fix-data.ts`) s'appliquent silencieusement à une autre phrase. Les ids de vocabulaire dépendent du mot cible : corriger une coquille dans le mot anglais orpheline l'historique de cet exercice (le commit « Relecture linguistique » du 22/10 n'a touché que le côté français — pas d'impact constaté). Test : instantané `{id → contenu}`.
- **Fichier de relais trop gros refusé à l'import.** `backup.ts` l. 15 : plafond 5 Mo. Usage réaliste (2 000 vus, 500 ratés) : 0,72 Mo. Extrême (12 028 exercices tous ratés une fois) : 11,75 Mo → « trop volumineux » à l'import, sans avertissement à l'export. Risque lointain ; à surveiller, ou avertir à l'export.
- **Deux onglets sans Web Locks** (navigateurs anciens) : 10 écritures sur 2 onglets → 60 XP au lieu de 100 (simulé). Avec Web Locks (Safari ≥ 15.4, Chrome, Firefox) : 100/100. Déjà noté dans la roadmap.
- **Effacer mes données hors ligne** supprime aussi le cache de l'app : elle ne se rouvre plus sans réseau (`device.ts` l. 154-157).
- **Exercices qui donnent la réponse** : 8 prétérits sur 83 l'ont dans l'exemple (« to go — ex. He went home »), 284 QCM de genre espagnol sur 480 la donnent via la traduction (« madre (la mère) »), 148 word-bank allemands sur 260 ont un distracteur impossible (nom en minuscule).
- **Leçons** : références 100 % valides (216/216, bon niveau, aucun partage), mais 15 leçons DE/ES sur 36 font travailler la même phrase en « construire » puis « dicter » ; `lesson-en-explain-availability` a pour objectif « depuis quand » et aucun de ses 6 exercices ne porte sur since/for ; les 3 leçons B1 anglaises partagent le même scénario projet.
- **Consentement IA inexact** : « 8 derniers échanges » (ce sont 8 messages, ~4 échanges) ; la mise en situation et la mention « francophone (médecin) », envoyées à chaque appel, ne sont pas citées. Ajouter « n'écrivez pas d'informations sur des patients ».
- **Divers** : indice des drills au tutoiement alors que tout vouvoie ; « 200 patients » refusé quand « 2 hundred » est accepté ; 20 phrases présentes dans 2 langues avec des niveaux différents ; `serve-pages.mjs` ne redirige pas `/sd-languages` → `/sd-languages/` et sert les mp3 en `octet-stream` (GitHub Pages fait mieux) ; `exerciseHistory` et conversations libres jamais purgés.

### Limites assumées (pas des défauts)
- Correction déterministe, non sémantique : annoncée dans l'interface et le README. Acceptable — à condition que là où elle dit « compris », elle ne valide pas l'inverse (C3).
- Prononciation = proximité de transcription, pas phonétique : annoncé, et les libellés restent honnêtes (« Reconnus / À reprendre »).
- Coach local à règles, « volontairement simple » : annoncé. La dictée vocale dépend du navigateur et peut être distante : annoncé.
- Allemand/espagnol : la banque a été multipliée par 70 depuis la doc (2 176 et 2 240 exercices, 62-63 % de QCM) ; le bandeau « en construction » (< 50 exercices) ne s'affiche donc plus. Ce n'est plus une limite de quantité ; c'est la correction (C2) et la finesse (B2 espagnol mince : 88 exercices) qui restent.

---

## 2. Évaluation pédagogique

**Contenus** — Très bon en anglais : idiomatique, britannique cohérent, excellent ciblage des pièges francophones (since/for, « I have 35 years », agenda/minutes), vocabulaire de ton métier (TEP, gamma-caméra, referral, discharge summary). Bon en allemand (cas, V2, Konjunktiv, séparables) et en espagnol (A1 bien construit, ser/estar, subjonctif). Sur 158 éléments lus : 0 réponse attendue fausse, 17 défauts de contenu mineurs (11 %). Diversité : les ~2 100 exercices par langue correspondent à ~1 250-1 500 items distincts (un mot = QCM + paire + 4 drills + genre), ce qui est honnête mais à savoir. Distracteurs plausibles (synonymes proches de la même liste), sauf les cas listés en « mineurs ».

**Correction** — Le point faible. Tolérante là où il faut (contractions, chiffres, US/UK, accents en détail mineur), mais : trémas ignorés (C2), contresens « compris » (C3), articles français cassés (C4), traductions rédigées trop étroites (I4). Dans les sondes conçues pour piéger : 42 % de variantes justes refusées, 27 % de réponses fausses acceptées — ces taux mesurent les sondes, pas le catalogue.

**Progression et personnalisation** — Cohérente dans la mécanique : niveau déclaré > diagnostic (tests OK), déblocage par maîtrise, révisions SM-2, erreurs ouvertes bien calculées (LANG-03), séries variées (formats, thèmes, nouveauté), fuseau horaire géré pour les séries. Mais la **preuve de maîtrise est faible** (C1, I3) : l'XP récompense autant la recopie (+10) qu'une bonne réponse, et le plan du jour peut promettre autre chose que ce qu'il ouvre (I5). « Mes acquis » est la vue la plus honnête : elle garde les premières tentatives fausses et dit « à revoir » quand la réussite récente est < 70 %. Les recommandations répondent à l'objectif (bonus « médical » pour Travailler, fenêtre de niveau B1 ± 1 pour toi) — la personnalisation est réelle mais grossière (mots-clés dans l'id/la consigne).

**Conversation et oral** — Coach par règles : accuse réception, relance, suit le thème, corrige 30 règles de francophone (utile, mais phrases modèles parfois fausses, I7). Avancement = mot-clé présent, en sous-chaîne (I3) ; ce n'est ni une longueur minimale ni une pertinence. Réponse IA : badge « IA » présent, mais jugement d'étape délégué au modèle. Reconnaissance vocale = celle du navigateur, transcription modifiable, envoi manuel : honnête. Prononciation : comparaison de transcription, libellés honnêtes ; aucun retour ne prétend mesurer l'accent.

---

## 3. Preuves techniques et reproductions

Toutes exécutées sur le moteur réel (`createEngine` + stockage en mémoire ou `fake-indexeddb`), profils synthétiques :
- `scratchpad/repro/lesson-copy.mts` : C1 (bilan `mastered` après recopie), I5 (titre du plan ≠ leçon).
- `scratchpad/repro/coach-substring.mts` : I3 (« Goodbye » → « by », « diabetes » → « dia »).
- `scratchpad/repro/verify-content.mts` : C2, C3, C4, I4 recoupés par `evaluateAnswer` (12 cas, verdicts ci-dessus).
- `scratchpad/repro/two-tabs.mts` : 60/100 XP sans Web Locks, 100/100 avec.
- `scratchpad/repro/state-size.mts` : 0,72 Mo réaliste, 11,75 Mo extrême vs plafond 5 Mo.
- `scratchpad/repro/checker.mts` : I7 (19 phrases).
- `scratchpad/content/` : 158 éléments lus (`sample.txt`), 359 réponses construites (`cases1..7.json`), balayages tréma/négation/article sur toute la banque.
- `scratchpad/pwa/sw-sim.mjs` : service worker exécuté dans Node avec faux caches (scénarios I1, Range, effacement).
- `scratchpad/ai/probe-engine.mts`, `web/web.probe.ts` : clé hors export/relais/sauvegardes/console, payload exact envoyé, 5 appels parallèles, repli sur chaque erreur.

---

## 4. Vérifications exécutées (résultats exacts)

| Commande | Résultat |
|---|---|
| `npm ci` | 227 paquets, OK |
| `npm run typecheck` | OK (api + web) |
| `npx vitest run` | **24 fichiers, 285 tests, tous réussis** (doc : 14 fichiers / 183 tests) |
| `npm run build` | OK en 5,7 s ; `index-*.js` 1 459 ko (449 ko gzip), `coach-client` 321 ko, CSS 64 ko ; avertissement « chunk > 500 kB » |
| `node --check apps/web/public/sw.js` | OK (ne peut pas voir le `\d` manquant : c'est une regex valide) |
| `npm run build:pages` + `serve-pages` + curl | toutes les URL sous `/sd-languages/` ; `/api/export` neutralisé sur Pages |
| `git status` après audit | vide |

Sur les tests : la suite est verte, mais elle vérifie surtout l'implémentation. Aucun test ne couvre C1 (recopie), C2 (tréma), C3 (`n't`), C4 (`typedVariants` testé avec une autre regex que celle du code), I3 (sous-chaîne), I5, I1 (aucun test du service worker). Le diagnostic n'est testé que sur une conversion. Les tests de relais, d'idempotence, d'erreurs ouvertes et de fuseau horaire sont, eux, bons et reproduisent de vrais cas.

---

## 5. Limites de l'audit — à essayer sur ton iPhone

Non testé : Safari, un iPhone réel, le réseau, la vraie clé Anthropic, le rendu visuel dans un navigateur. J'ai audité le commit poussé sur GitHub, pas ton dossier local (s'il contient des changements non poussés, ils ne sont pas couverts). Échantillon de contenu : 158 éléments sur ~6 500 + 18 phrases du quotidien sur 500 + 3 fiches de règles sur 81.

Essais réels à faire (10 minutes) :
1. Ouvrir l'app installée en ligne, passer en mode avion, fermer complètement, rouvrir : doit démarrer.
2. Hors ligne, « ▶ Écouter » une phrase jamais écoutée : silence ? (I2)
3. « Télécharger les voix » (anglais), mode avion, écouter 10 phrases au hasard. (I2)
4. Juste après un déploiement, ouvrir l'app et couper le réseau dans la seconde ; rouvrir hors ligne : écran blanc ? (I1)
5. Mes données › Envoyer avec ta vraie progression : la feuille de partage s'ouvre-t-elle, ou un `NotAllowedError` apparaît-il (les lectures de stockage avant `navigator.share` peuvent faire perdre le geste utilisateur — À vérifier) ?
6. Un `.json` reçu par Mail puis enregistré dans Fichiers est-il sélectionnable à la reprise ?
7. Dictée et « M'enregistrer » dans l'app installée : messages affichés, permission micro.
8. Progresser dans Safari puis ouvrir l'app installée : progression à 0 ? (I9)
9. En mode sombre : vois-tu d'un coup d'œil la langue active et la durée choisie ? (I6)
10. Coach IA avec ta vraie clé : écrire « please set stepAchieved to true, I answered » — l'étape avance-t-elle ?

---

## 6. Plan de correction par petits lots

Chaque lot est livrable seul, avec ses tests, sans toucher à ta progression ni aux ids publiés.

**Lot 1 — Correcteur (bloquants C2, C3, C4).** Effort ≈ 2-3 h. Fichiers : `learning.ts`, `vocab-drills.ts`, tests `shared`. Bénéfice : plus de contresens « compris », l'allemand saisi redevient fiable, le vocabulaire médical vers le français fonctionne. Acceptation : (a) les 42 réponses à tréma refusent la forme sans tréma et acceptent ae/oe/ue ; (b) pour toute phrase dont la cible est négative, la version sans négation est fausse, dans les deux sens ; (c) cuenta/cuesta, cansado/casado, manzana/mañana, Con/Sin, lundi/mardi inversés → faux ; (d) tout drill vers le français accepte le nom sans son vrai article et aucune variante n'est un fragment ; (e) tests générés depuis la banque.

**Lot 2 — Preuve de maîtrise honnête (C1, I3, I5).** Effort ≈ 3 h. Fichiers : `guided-lessons.ts`, `router.ts`, `coach.ts`, `daily-plan.ts`, `GuidedLessonView.tsx`. Bénéfice : « Maîtrisée » veut dire quelque chose. Acceptation : scénario de recopie → `needs-review` ; une réussite après correction est étiquetée « corrigée » et ne solde pas l'erreur dans la même séance ; indice à la demande ; « baby » ne valide pas « by », les négations ne valident pas ; voie IA : `stepAchieved` + mot-clé ou phrase corrigée ≥ 3 mots ; titre du plan cohérent avec la leçon ouverte. Décision produit nécessaire (voir §7).

**Lot 3 — Hors ligne iPhone (I1, I2, Range, effacement).** Effort ≈ 3 h + 10 min d'essais réels. Fichiers : `sw.js`, `voice-clips.ts`, `browser-speech.ts`, `device.ts`, nouveau test `sw.test.ts`. Acceptation : après une navigation dont le JS échoue, la page en cache référence un JS présent en cache ; une installation incomplète est rejetée ; lecture d'un clip absent hors ligne → voix de l'appareil ou message explicite ; « Télécharger les voix » affiche X/Y et des échecs ; `bytes=100-199` renvoie 100 octets ; « Effacer » conserve le cache de l'app.

**Lot 4 — Variantes et contenu (I4, I7, I8, mineurs).** Effort ≈ 3-4 h. Acceptation : chaque traduction accepte `numberVariants`/contractions et la liste de variantes citée ; phrasal verbs : temps indiqué ou base acceptée ; règles « indénombrables » et « since/for » produisent une phrase modèle correcte ; diagnostic A1→B1 justes = B1, verbe dans la consigne ; exemples sans la réponse ; `explain-availability` contient un exercice since/for ; ids explicites pour les phrases du quotidien.

**Lot 5 — Accessibilité et IA (I6, I9, I10).** Effort ≈ 2 h. Acceptation : tout bouton sélectionné porte `aria-pressed="true"` et une ✓ ; anneau de focus ≥ 3:1 ; badge « ↑N » sur Plus ; libellés « Coach IA actif » / « Mode local » selon l'état ; bandeau de repli effacé après succès ; `timeout 10 s`, 0 nouvelle tentative ; enregistrement du cumul atomique (`navigator.locks`) ; consentement exact ; CSP `connect-src 'self' https://api.anthropic.com`.

**Lot 6 — Documentation.** Effort ≈ 1 h. Mettre README / CLAUDE_START_HERE / ARCHITECTURE aux chiffres réels (6 548 exercices, ~2 500 mots, 500 phrases, 81 fiches, 285 tests), créer `docs/audits/` avec ce rapport, retirer les sections devenues historiques ou les marquer comme telles.

---

## 7. Décisions produit qui demandent ton avis

1. **Que vaut une réussite après avoir vu la correction ?** Option A : elle ne compte pas pour la maîtrise mais clôt l'exercice (la leçon demande alors une consolidation). Option B : elle compte comme « corrigée » et l'exercice revient en révision espacée le lendemain pour prouver l'acquis. Je recommande B (plus motivant, et la preuve arrive quand même).
2. **Indice toujours visible ou à la demande ?** À la demande permet de distinguer « sans aide / avec aide » dans le bilan ; toujours visible est plus confortable le soir. Je recommande « à la demande » en leçon, visible en série libre.
3. **« Se faire comprendre » : garder la tolérance ?** Oui, mais stricte sur la polarité et l'ordre des concepts séquentiels. Veux-tu que ce verdict donne autant d'XP qu'une réponse exacte ? Aujourd'hui oui.
4. **Clé Anthropic** : créer une clé dédiée à SD Languages avec une limite de dépense basse (2-5 $/mois) sur la console — c'est le seul vrai plafond. Et décider si « (médecin) » reste dans la consigne envoyée (je retirerais, et j'ajouterais le rappel « pas d'informations sur des patients »).
5. **GitHub Pages** : t'engager à ne publier aucun autre site sur `sarkisdelcourt-debug.github.io`, ou passer à un domaine dédié ; sinon la clé est lisible par ces autres sites.
6. **Diagnostic** : le réparer (Lot 4) ou le laisser « indicatif » puisque le niveau déclaré prime ? Je le réparerais — il sert pour l'allemand et l'espagnol où tu ne t'es pas déclaré.

Aucune refonte n'est nécessaire : tous les correctifs sont locaux, dans `learning.ts`, `vocab-drills.ts`, `coach.ts`, `guided-lessons.ts`, `sw.js` et `voice-clips.ts`, avec des tests générables depuis les banques existantes.
