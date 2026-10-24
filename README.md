# SD Languages

Coach linguistique local-first pour progresser en anglais, réactiver l'allemand et commencer l'espagnol. L'application associe un diagnostic court, des leçons guidées, des exercices corrigés (QCM, textes à trous, traduction, phrases à construire, paires à associer, dictées), une mémoire des erreurs, une répétition espacée, un suivi de progression, un coach de conversation par règles et un laboratoire de prononciation.

Elle ne demande ni compte, ni abonnement ; la clé d'API n'est nécessaire que si vous activez le coach IA facultatif (voir « Coach IA facultatif »). Le moteur pédagogique tourne dans le navigateur ; la progression vit dans IndexedDB sur chaque appareil et se transfère de l'un à l'autre par fichier. Version en ligne : <https://sarkisdelcourt-debug.github.io/sd-languages/> (installable sur iPhone, fonctionne hors ligne).

## Démarrage rapide

Prérequis : Node.js 22 ou plus récent et npm.

### Windows — lancement en double-cliquant

Double-cliquer sur **`Lancer SD Languages.cmd`**. Le lanceur démarre le serveur dans une petite fenêtre puis ouvre automatiquement l'application. Garder la fenêtre « SD Languages - serveur local » ouverte pendant l'utilisation ; la fermer arrête l'application.

### Terminal

```bash
npm install
npm run dev
```

Ouvrir ensuite <http://127.0.0.1:5173>. Le serveur Express (`127.0.0.1:8787`) n'est plus nécessaire à l'apprentissage : il sert le build sur le PC, garde les tests de parité HTTP et expose `GET /api/export` pour reprendre une fois l'ancien fichier `data/sd-languages.json`. Pour choisir un autre emplacement de ce fichier :

```bash
SD_LANGUAGES_DATA_FILE=./data/mon-profil.json npm run dev
```

Sous PowerShell :

```powershell
$env:SD_LANGUAGES_DATA_FILE = ".\data\mon-profil.json"
npm run dev
```

## Version de production locale

```bash
npm run build
npm start
```

Ouvrir <http://127.0.0.1:8787>. Le même serveur fournit alors l'API et l'interface compilée. L'installation en PWA est proposée par les navigateurs compatibles après une première visite.

## Vérifications

```bash
npm run typecheck
npm test
npm run build
node --check apps/web/public/sw.js
```

Les tests (148 au 21/10/2026, `vitest`) ne contactent aucun service externe. Ils couvrent la correction tolérante (contractions, chiffres, lexique US/UK), les générateurs de la banque anglaise, le coach par règles et le correcteur de francophones, les leçons guidées (maîtrise, abandon, révisions retirées), les séries d'entraînement, le relais par fichier, le stockage IndexedDB (`fake-indexeddb`) et la parité de l'API Express.

## Ce qui fonctionne aujourd'hui

| Domaine | État MVP | Détail |
|---|---|---|
| Anglais | Opérationnel | 875 exercices (médical, conversation, voyage, grammaire B1–B2, phrasal verbs, verbes irréguliers, faux amis) et 6 questions diagnostiques |
| Allemand, espagnol | En construction, annoncé dans l'interface | 15 et 30 exercices, 6 questions diagnostiques ; les leçons réemploient cette petite banque |
| Niveau | Opérationnel | Diagnostic pondéré A1–C1 indicatif, ou niveau déclaré par l'apprenant (les leçons inférieures passent « Acquis ») |
| Exercices | Opérationnel | QCM, texte à trous, traduction, phrase à construire, paires à associer, dictée ; séries de 6 variées par format et par thème |
| Correction didactique | Opérationnel, déterministe | Verdict exact, détail mineur (accent, apostrophe) ou erreur ; contractions, chiffres en lettres, variantes US/UK, « 3 pm » acceptés |
| Mémoire des erreurs | Opérationnel | Regroupement par exercice, compteur d'occurrences et résolutions |
| Répétition espacée | Opérationnel | Planification locale de type SM-2 simplifié |
| Progression | Opérationnel | XP, précision, série, niveau indicatif et cartes dues par langue |
| Parcours personnalisé | Opérationnel | Objectif, durée quotidienne et niveau cible configurables pour chaque langue |
| Parcours guidé A1–B2 | Opérationnel | 36 séances persistantes (12 par langue, 3 par niveau), carte en 4 chapitres, placement par diagnostic ou niveau déclaré, déblocage par maîtrise, abandon possible |
| Parcours quotidien | Opérationnel | Plan adaptatif priorisé selon objectif, niveau, erreurs, cartes dues et temps disponible ; la leçon est l'action principale |
| Conversation | Opérationnel, par règles | 12 scénarios en 4 étapes ; coach local (relances, indices, suivi du thème) et correcteur d'erreurs typiques de francophones ; avec le coach IA facultatif activé, les réponses du coach peuvent venir d'un modèle d'IA (voir « Coach IA facultatif ») |
| Laboratoire de prononciation | Opérationnel, progressif | 12 phrases A1–B2, écoute normale ou lente, enregistrement éphémère, transcription assistée ou manuelle et comparaison explicable des mots |
| Lecture vocale | Opportuniste | Synthèse native du navigateur lorsqu'elle existe |
| Dictée vocale | Opportuniste | Reconnaissance du navigateur dans la conversation et le laboratoire, transcription modifiable et envoi toujours manuel |
| PWA hors ligne | Opérationnel | Tout le moteur s'exécute dans l'appareil : aucune requête réseau pour apprendre (hors coach IA facultatif, désactivé par défaut), mode avion possible une fois installée |
| Relais entre appareils | Opérationnel | « Envoyer ma progression » produit un fichier ; l'autre appareil le reprend avec aperçu et avertissements ; sauvegardes automatiques restaurables (10 max) |
| Thème sombre | Opérationnel | Suit le réglage de l'appareil ; contrastes ≥ 4.5:1, états distingués par symbole et luminance |

## Ce qui est préparé mais pas encore intégré

- conversation libre avec un modèle d'IA, au-delà du coach IA facultatif décrit plus bas (réponses courtes dans un scénario) ;
- correction sémantique de réponses ouvertes ;
- analyse acoustique détaillée des phonèmes, du rythme et de l'accent ;
- voix neuronales avancées ;
- synchronisation entre appareils ;
- comptes, authentification et tableau enseignant.

Les contrats `CoachProvider`, `SpeechToTextProvider` et `TextToSpeechProvider` isolent ces futures intégrations. Leur ajout ne doit pas rendre le fournisseur local inutilisable : sans clé, hors ligne ou plafond atteint, le coach local répond.

## Coach IA facultatif

- **Désactivé par défaut.** Il ne fonctionne qu'avec votre propre clé API Anthropic (`sk-ant-…`), saisie dans les réglages.
- **Où vit la clé** : dans la zone « meta » d'IndexedDB de l'appareil, jamais dans la progression ; elle n'est ni exportée dans le fichier de relais ni publiée, et « Effacer mes données » la supprime. Elle reste lisible par le code de la page dans votre navigateur (appel direct depuis le navigateur, sans serveur intermédiaire).
- **Ce qui est envoyé à Anthropic** à chaque message du coach : les dernières répliques de la conversation en cours, votre nouveau message, la langue, votre niveau estimé et votre objectif, la mise en situation du scénario et la consigne du coach (qui présente l'apprenant comme un francophone médecin). Pas la progression complète, pas l'audio.
- **Plafond mensuel estimé** (10 $ par défaut) ; au-delà, hors ligne ou en cas d'erreur, retour automatique au coach local.
- Non vérifié par test automatisé : la façon dont l'interface signale à l'apprenant qu'une réponse vient de l'IA.

## Limites assumées du MVP

- Le niveau CECRL est un repère pédagogique, pas une certification.
- La correction ignore la casse et la ponctuation. Un accent manquant est accepté comme détail mineur et expliqué séparément ; la correction sémantique libre reste hors périmètre.
- Le catalogue compte 18 questions diagnostiques et 920 exercices, très inégalement répartis : 875 en anglais, 30 en espagnol, 15 en allemand. L'interface le dit lorsqu'une langue compte moins de 50 exercices.
- Le parcours couvre A1 à B2 avec trois séances par niveau et par langue. Les leçons anglaises tirent 6 exercices chacune de la banque ; celles d'allemand et d'espagnol réemploient leurs petites banques et 4 scénarios par langue.
- Une séance terminée ne débloque le niveau suivant que si elle atteint le seuil de maîtrise : au moins deux tiers de réponses finales justes (exactes ou à un détail près, un accent oublié n'est pas une erreur), aucune erreur finale et trois étapes de dialogue validées. Sinon, l'application propose une consolidation. « Abandonner cette leçon » la rend à nouveau disponible sans rien effacer d'autre.
- La correction accepte des variantes générées par règles (contractions, chiffres, lexique US/UK) ; une formulation juste mais non prévue peut encore être refusée : les réponses acceptées s'enrichissent au fil des retours.
- La dictée vocale dépend de l'API disponible dans le navigateur. Selon le navigateur, sa reconnaissance peut utiliser un service externe : elle n'est donc pas promise comme locale ou hors ligne.
- Le score du laboratoire mesure la proximité entre la transcription et la phrase modèle. Il ne certifie pas l'accent ni la qualité phonétique. Les enregistrements audio restent en mémoire vive, ne sont jamais envoyés à l'API et disparaissent en quittant la page.
- Il n'y a ni synchronisation automatique ni fusion entre appareils : reprendre un fichier remplace l'état de l'appareil (une copie est gardée avant chaque remplacement).
- Il n'existe pas encore de tests navigateur automatisés du service worker.
- Les conversations locales sont volontairement simples et prévisibles. Elles ne simulent pas un modèle génératif.

## Données et confidentialité

- Aucun appel analytique ou publicitaire.
- Aucun compte utilisateur.
- La progression vit dans IndexedDB (`sd-languages`), dans le navigateur de chaque appareil ; `localStorage` ne garde que la langue choisie. Aucune donnée n'est hébergée : GitHub Pages ne sert que l'application.
- L'audio n'est jamais enregistré ni envoyé ; seuls le score et le verdict d'un essai de prononciation sont conservés.
- Le serveur Express est lié à `127.0.0.1` ; son fichier `data/*.json` (ancienne progression du PC) est ignoré par Git et n'est plus écrit par l'application.
- « Mes données » permet d'envoyer, reprendre, restaurer une sauvegarde ou tout effacer (double confirmation).

## Structure

```text
apps/web/                 interface React, PWA, IndexedDB, relais par fichier, voix navigateur
apps/api/                 serveur Express du PC : build, parité HTTP, reprise de l'ancien JSON
packages/engine/          moteur pédagogique (routes « méthode + chemin », leçons, séries, coach, relais)
packages/shared/          types, banque de contenu, générateurs, correction, répétition espacée
scripts/                  utilitaires de contenu (voir ci-dessous)
data/                     ancienne progression locale du PC (ignorée)
docs/ARCHITECTURE.md      décisions techniques et points d'extension
```

## Moteur local et scripts

Les vues appellent des chemins `/api/…`, mais ils sont traités dans l'appareil par `packages/engine/src/router.ts` (aucune requête réseau). Le serveur Express de `apps/api` expose les mêmes routes pour les tests de parité et ajoute `GET /api/export` (reprise de l'ancien fichier).

Scripts de contenu, à lancer avec `npx tsx` :

- `scripts/content-stats.ts [en|de|es]` : effectifs de la banque par thème, format et niveau ;
- `scripts/bank-dump.ts en <topic|all>` : inventaire compact des exercices d'une langue ;
- `scripts/lesson-dump.ts en` : composition de chaque leçon guidée ;
- `scripts/serve-pages.mjs` (`npm run serve:pages` après `npm run build:pages`) : simule GitHub Pages sous `/sd-languages/`.

Les codes de langue acceptés sont `en`, `de` et `es`.
