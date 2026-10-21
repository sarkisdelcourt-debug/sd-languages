# SD Languages

MVP local-first d'un coach linguistique pour progresser en anglais, réactiver l'allemand et commencer l'espagnol. L'application associe un diagnostic court, des exercices corrigés, une mémoire des erreurs, une répétition espacée, un suivi de progression et une conversation guidée.

Le MVP ne demande ni compte, ni abonnement, ni clé d'API. Les données d'apprentissage restent dans un fichier JSON sur la machine.

## Démarrage rapide

Prérequis : Node.js 22 ou plus récent et npm.

### Windows — lancement en double-cliquant

Double-cliquer sur **`Lancer SD Languages.cmd`**. Le lanceur démarre le serveur dans une petite fenêtre puis ouvre automatiquement l'application. Garder la fenêtre « SD Languages - serveur local » ouverte pendant l'utilisation ; la fermer arrête l'application.

### Terminal

```bash
npm install
npm run dev
```

Ouvrir ensuite <http://127.0.0.1:5173>. Le serveur local écoute uniquement sur `127.0.0.1:8787` et Vite relaie les appels `/api` pendant le développement.

Les données sont créées dans `data/sd-languages.json`. Pour choisir un autre emplacement :

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
npm test
npm run typecheck
npm run build
```

Les tests ne contactent aucun service externe. Ils couvrent notamment la normalisation des réponses, le score diagnostique, la répétition espacée, la persistance et les principaux parcours API.

## Ce qui fonctionne aujourd'hui

| Domaine | État MVP | Détail |
|---|---|---|
| Anglais, allemand, espagnol | Opérationnel | 6 questions diagnostiques et 15 exercices progressifs par langue |
| Diagnostic | Opérationnel | Score pondéré et estimation A1–C1 indicative |
| Exercices | Opérationnel | QCM, texte à trous et traduction |
| Correction didactique | Opérationnel, déterministe | Verdict exact, détail mineur ou erreur, avec réponse modèle, règle et point d'attention |
| Mémoire des erreurs | Opérationnel | Regroupement par exercice, compteur d'occurrences et résolutions |
| Répétition espacée | Opérationnel | Planification locale de type SM-2 simplifié |
| Progression | Opérationnel | XP, précision, série, niveau indicatif et cartes dues par langue |
| Parcours personnalisé | Opérationnel | Objectif, durée quotidienne et niveau cible configurables pour chaque langue |
| Parcours guidé A1–B2 | Opérationnel | 36 séances persistantes (12 par langue, 3 par niveau), carte en 4 chapitres, placement par diagnostic et déblocage par maîtrise |
| Parcours quotidien | Opérationnel | Plan adaptatif priorisé selon objectif, niveau, erreurs, cartes dues et temps disponible ; la leçon est l'action principale |
| Conversation | Opérationnel, guidé | 12 scénarios locaux en 4 étapes, dont un scénario B2 par langue, recommandations ciblées et historique séparé |
| Laboratoire de prononciation | Opérationnel, progressif | 12 phrases A1–B2, écoute normale ou lente, enregistrement éphémère, transcription assistée ou manuelle et comparaison explicable des mots |
| Lecture vocale | Opportuniste | Synthèse native du navigateur lorsqu'elle existe |
| Dictée vocale | Opportuniste | Reconnaissance du navigateur dans la conversation et le laboratoire, transcription modifiable et envoi toujours manuel |
| PWA hors ligne | Opérationnel avec limites explicites | Interface et bibliothèque préparées en cache, état de connexion visible, file IndexedDB et resynchronisation des réglages, réponses d'exercices, réponses de leçon contextualisées et analyses de transcription |
| Export du profil serveur | Opérationnel via API | `GET /api/export` télécharge le fichier de progression JSON ; l'outbox du navigateur reste séparée jusqu'au lot P0 de la feuille de route |

## Ce qui est préparé mais pas encore intégré

- conversation libre avec un modèle d'IA ;
- correction sémantique de réponses ouvertes ;
- analyse acoustique détaillée des phonèmes, du rythme et de l'accent ;
- voix neuronales avancées ;
- synchronisation entre appareils ;
- comptes, authentification et tableau enseignant.

Les contrats `CoachProvider`, `SpeechToTextProvider` et `TextToSpeechProvider` isolent ces futures intégrations. Leur ajout ne doit pas rendre le fournisseur local inutilisable. Aucune fonctionnalité actuelle n'est présentée comme une correction IA.

## Limites assumées du MVP

- Le niveau CECRL est un repère pédagogique, pas une certification.
- La correction ignore la casse et la ponctuation. Un accent manquant est accepté comme détail mineur et expliqué séparément ; la correction sémantique libre reste hors périmètre.
- Le catalogue comprend 18 questions diagnostiques et 45 exercices (15 par langue). Il démontre l'architecture mais ne remplace pas encore un cursus complet.
- Le parcours couvre A1 à B2 avec trois séances par niveau et par langue. Les 36 séances réemploient encore une banque de 45 exercices et 12 scénarios : le prochain enrichissement doit donc diversifier les exercices, les dialogues et les situations de transfert.
- Une séance terminée ne débloque le niveau suivant que si elle atteint le seuil de maîtrise : au moins deux tiers de réponses finales exactes, aucune erreur finale et trois étapes de dialogue validées. Sinon, l'application propose une consolidation.
- La dictée vocale dépend de l'API disponible dans le navigateur. Selon le navigateur, sa reconnaissance peut utiliser un service externe : elle n'est donc pas promise comme locale ou hors ligne.
- Le score du laboratoire mesure la proximité entre la transcription et la phrase modèle. Il ne certifie pas l'accent ni la qualité phonétique. Les enregistrements audio restent en mémoire vive, ne sont jamais envoyés à l'API et disparaissent en quittant la page.
- Après une première ouverture en production, la PWA prépare l'interface, ses fichiers versionnés et les principales lectures des trois langues. Une file IndexedDB garde les opérations rejouables lorsque le serveur local est arrêté : réglages, réponses d'exercice, réponses de leçon associées à leur séance et transcription de prononciation. Elle se vide au redémarrage ou via « Réessayer ».
- Les actions ordonnées qui exigent une réponse immédiate du moteur restent indisponibles sans serveur : diagnostic, transition d'une phase de leçon, dialogue, conversation libre et notation d'une carte de révision. Elles ne sont jamais mises en file pour éviter un conflit ou un double effet.
- Les conversations locales sont volontairement simples et prévisibles. Elles ne simulent pas un modèle génératif.

## Données et confidentialité

- Aucun appel analytique ou publicitaire.
- Aucun compte utilisateur.
- L'API est liée à `127.0.0.1`, donc non exposée au réseau local par défaut.
- La file hors ligne vit dans le stockage IndexedDB du navigateur. Une transcription validée peut y rester jusqu'à sa synchronisation ; l'audio n'y est jamais enregistré. L'export JSON de l'API ne contient pas cette file.
- Le fichier `data/*.json` est ignoré par Git.
- Une écriture temporaire suivie d'un renommage réduit le risque de fichier partiellement écrit.

Pour repartir de zéro, arrêter l'application puis supprimer manuellement `data/sd-languages.json`. Cette action efface la progression.

## Structure

```text
apps/web/                 interface React, PWA et synthèse vocale navigateur
apps/api/                 API locale, persistance et modules applicatifs
packages/shared/          types, catalogue, correction et moteur de répétition
data/                     données personnelles locales (ignorées)
docs/ARCHITECTURE.md      décisions techniques et points d'extension
```

## API locale

Les routes principales sont :

- `GET /api/dashboard`
- `GET|PATCH /api/settings/:language`
- `GET|POST /api/diagnostic/:language`
- `GET /api/plan/:language`
- `GET /api/pronunciation/:language`
- `POST /api/pronunciation/:promptId/attempts`
- `GET /api/lessons/:language` (paramètre facultatif `lessonId`)
- `POST /api/lessons/:language/start` (corps facultatif `{ "lessonId": "…" }`, sinon recommandation active)
- `POST /api/lessons/:language/continue`
- `POST /api/lessons/:language/answer`
- `POST /api/lessons/:language/message`
- `GET /api/practice/:language`
- `POST /api/practice/:exerciseId/answer`
- `GET|POST /api/reviews/:language-or-card`
- `GET /api/mistakes?language=en`
- `GET /api/scenarios/:language`
- `GET|POST /api/conversations/:language`
- `GET /api/export`

Les codes de langue acceptés sont `en`, `de` et `es`.
