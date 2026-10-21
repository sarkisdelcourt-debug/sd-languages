import type { GuidedLessonDefinition } from "./types.js";

function supplementalLesson(
  definition: Omit<GuidedLessonDefinition, "revision" | "conversationTurnGoal">
): GuidedLessonDefinition {
  return { ...definition, revision: 1, conversationTurnGoal: 4 };
}

export const GUIDED_LESSONS: GuidedLessonDefinition[] = [
  {
    id: "lesson-en-daily-basics",
    revision: 1,
    language: "en",
    level: "A1",
    sequence: 1,
    title: "Commander simplement au café",
    objective: "Formuler une commande courte, préciser votre choix et comprendre une question simple.",
    focus: "Présent simple et vocabulaire quotidien",
    goalAffinity: ["basics", "travel", "fluency"],
    estimatedMinutes: 10,
    microCourse: {
      title: "Une phrase courte qui fonctionne",
      introduction: "Pour commander, une structure stable suffit : I would like + ce que vous voulez. Vous pouvez ensuite ajouter please.",
      points: [
        "I would like est plus poli que I want.",
        "Au présent simple, she et he prennent souvent un -s au verbe.",
        "Retenez les pluriels irréguliers fréquents comme child → children."
      ],
      examples: [
        { target: "I would like a coffee, please.", translation: "Je voudrais un café, s'il vous plaît." },
        { target: "She has two children.", translation: "Elle a deux enfants." }
      ]
    },
    exerciseIds: ["en-a1-mcq-have", "en-a1-gap-plural", "en-a1-mcq-airport-gate"],
    scenarioId: "en-daily-cafe",
    conversationTurnGoal: 4
  },
  {
    id: "lesson-en-routine-travel",
    revision: 1,
    language: "en",
    level: "A2",
    sequence: 4,
    title: "Parler de sa routine en voyage",
    objective: "Décrire une habitude, comparer deux options et demander une information utile à l'hôtel.",
    focus: "Habitudes, comparaison et voyage",
    goalAffinity: ["travel", "fluency", "basics"],
    prerequisiteLessonId: "lesson-en-count-and-describe",
    estimatedMinutes: 12,
    microCourse: {
      title: "Donner des repères concrets",
      introduction: "Au niveau A2, vous reliez des phrases simples avec des repères de fréquence, de quantité et de comparaison.",
      points: [
        "Usually se place avant le verbe principal : I usually take the bus.",
        "Un adjectif court prend souvent -er pour comparer : cheaper, faster.",
        "Dans une question, any est fréquent pour parler d'une quantité indéterminée."
      ],
      examples: [
        { target: "I usually take the bus to work.", translation: "Je prends habituellement le bus pour aller au travail." },
        { target: "Is breakfast included?", translation: "Le petit-déjeuner est-il compris ?" }
      ]
    },
    exerciseIds: ["en-a2-translation-routine", "en-a2-mcq-comparative", "en-a2-gap-grocery-any"],
    scenarioId: "en-travel-hotel",
    conversationTurnGoal: 4
  },
  {
    id: "lesson-en-project-update",
    revision: 1,
    language: "en",
    level: "B1",
    sequence: 7,
    title: "Faire un point projet clair",
    objective: "Présenter votre avancée, expliquer un blocage et convenir d'une échéance.",
    focus: "Present perfect et communication professionnelle",
    goalAffinity: ["work", "fluency"],
    prerequisiteLessonId: "lesson-en-state-routine-and-needs",
    estimatedMinutes: 15,
    microCourse: {
      title: "Relier le passé au présent",
      introduction: "Pour parler d'un travail commencé dans le passé et encore vrai aujourd'hui, l'anglais emploie souvent le present perfect.",
      points: [
        "Since introduit un point de départ : since Monday, since 2024.",
        "For introduit une durée : for two days, for a week.",
        "Dans un point projet, annoncez d'abord le fait, puis l'impact et la prochaine étape."
      ],
      examples: [
        { target: "I have worked on this since Monday.", translation: "Je travaille là-dessus depuis lundi." },
        { target: "I need feedback before Friday.", translation: "J'ai besoin d'un retour avant vendredi." }
      ]
    },
    exerciseIds: ["en-b1-gap-since", "en-b1-translation-report-deadline"],
    scenarioId: "en-work-project-update",
    conversationTurnGoal: 4
  },
  {
    id: "lesson-en-handle-setback",
    revision: 1,
    language: "en",
    level: "B2",
    sequence: 10,
    title: "Expliquer un imprévu avec nuance",
    objective: "Raconter ce qui aurait pu se passer, exprimer un regret et proposer une solution crédible.",
    focus: "Hypothèse passée, regret et discours indirect",
    goalAffinity: ["work", "fluency", "travel"],
    prerequisiteLessonId: "lesson-en-explain-availability",
    estimatedMinutes: 16,
    microCourse: {
      title: "Distinguer le fait de l'hypothèse",
      introduction: "Pour analyser un imprévu, séparez le fait, sa cause et l'alternative qui n'a pas eu lieu.",
      points: [
        "If + past perfect, would have + participe passé décrit une conséquence passée irréelle.",
        "I wish + prétérit exprime un regret sur la situation présente.",
        "Au discours indirect, le temps recule souvent d'un cran."
      ],
      examples: [
        { target: "If we had left earlier, we would not have missed the flight.", translation: "Si nous étions partis plus tôt, nous n'aurions pas raté le vol." },
        { target: "She said that she was tired.", translation: "Elle a dit qu'elle était fatiguée." }
      ]
    },
    exerciseIds: ["en-b2-mcq-missed-flight", "en-b2-gap-wish", "en-b2-mcq-reported"],
    scenarioId: "en-work-service-recovery",
    conversationTurnGoal: 4
  },
  {
    id: "lesson-de-daily-basics",
    revision: 1,
    language: "de",
    level: "A1",
    sequence: 1,
    title: "Faire des achats avec des phrases sûres",
    objective: "Demander un produit, préciser une quantité et comprendre le montant à payer.",
    focus: "Présent, articles et demandes simples",
    goalAffinity: ["basics", "travel", "fluency"],
    estimatedMinutes: 10,
    microCourse: {
      title: "Garder le verbe en deuxième position",
      introduction: "Une phrase allemande simple devient plus prévisible lorsque vous placez le verbe conjugué juste après le premier élément.",
      points: [
        "Wir wohnen suit le modèle sujet + verbe + complément.",
        "Les noms allemands prennent une majuscule.",
        "Ich möchte… permet de demander poliment un produit."
      ],
      examples: [
        { target: "Wir wohnen in Berlin.", translation: "Nous habitons à Berlin." },
        { target: "Ich möchte ein Brot, bitte.", translation: "Je voudrais un pain, s'il vous plaît." }
      ]
    },
    exerciseIds: ["de-a1-mcq-present", "de-a1-gap-article", "de-a1-mcq-hotel-key"],
    scenarioId: "de-daily-grocery",
    conversationTurnGoal: 4
  },
  {
    id: "lesson-de-train-ticket",
    revision: 1,
    language: "de",
    level: "A2",
    sequence: 4,
    title: "Acheter un billet de train",
    objective: "Indiquer votre destination, préciser le trajet et comprendre les informations essentielles.",
    focus: "Ordre des mots et datif",
    goalAffinity: ["travel", "basics", "fluency"],
    prerequisiteLessonId: "lesson-de-build-basic-sentences",
    estimatedMinutes: 12,
    microCourse: {
      title: "Construire une demande utile",
      introduction: "En allemand, le verbe conjugué reste généralement en deuxième position. Une structure stable rend votre demande plus facile à produire.",
      points: [
        "Commencez par Ich möchte pour formuler une demande polie.",
        "Après mit, utilisez le datif : mit der Karte.",
        "Gardez le verbe conjugué en deuxième position dans la phrase principale."
      ],
      examples: [
        { target: "Ich möchte eine Fahrkarte nach Berlin.", translation: "Je voudrais un billet pour Berlin." },
        { target: "Ich bezahle mit der Karte.", translation: "Je paie par carte." }
      ]
    },
    exerciseIds: ["de-a2-translation-order", "de-a2-gap-shopping-dative"],
    scenarioId: "de-travel-station",
    conversationTurnGoal: 4
  },
  {
    id: "lesson-de-explain-organise",
    revision: 1,
    language: "de",
    level: "B1",
    sequence: 7,
    title: "Organiser et justifier une décision",
    objective: "Raconter une action passée, expliquer une raison et fixer les modalités d'une réunion.",
    focus: "Perfekt et subordonnée avec weil",
    goalAffinity: ["work", "fluency"],
    prerequisiteLessonId: "lesson-de-pay-and-confirm",
    estimatedMinutes: 15,
    microCourse: {
      title: "Mettre le verbe à la bonne place",
      introduction: "Le sens reste clair lorsque vous distinguez la proposition principale de la justification introduite par weil.",
      points: [
        "Au Perfekt, le participe passé se place en fin de proposition.",
        "Après weil, le verbe conjugué passe à la fin.",
        "Annoncez d'abord la décision, puis sa raison."
      ],
      examples: [
        { target: "Wir sind früh nach Hause gegangen.", translation: "Nous sommes rentrés tôt à la maison." },
        { target: "Ich bleibe zu Hause, weil es regnet.", translation: "Je reste à la maison parce qu'il pleut." }
      ]
    },
    exerciseIds: ["de-b1-gap-perfect", "de-b1-translation-because", "de-b1-translation-meeting-delay"],
    scenarioId: "de-work-meeting",
    conversationTurnGoal: 4
  },
  {
    id: "lesson-de-handle-disruption",
    revision: 1,
    language: "de",
    level: "B2",
    sequence: 10,
    title: "Gérer un changement de programme",
    objective: "Comprendre un incident, formuler une hypothèse et négocier une solution de remplacement.",
    focus: "Konjunktiv II et précision grammaticale",
    goalAffinity: ["travel", "work", "fluency"],
    prerequisiteLessonId: "lesson-de-explain-health-absence",
    estimatedMinutes: 16,
    microCourse: {
      title: "Présenter une solution hypothétique",
      introduction: "Le Konjunktiv II permet de proposer, conseiller ou imaginer une alternative avec la distance appropriée.",
      points: [
        "Wenn + Konjunktiv II pose une condition irréelle ou prudente.",
        "Le pronom relatif reprend le cas imposé par la préposition.",
        "Dans une annonce, le verbe séparable garde son préfixe en fin de phrase."
      ],
      examples: [
        { target: "Wenn ich mehr Zeit hätte, würde ich anders planen.", translation: "Si j'avais plus de temps, je planifierais autrement." },
        { target: "Der Zug fällt heute aus.", translation: "Le train est supprimé aujourd'hui." }
      ]
    },
    exerciseIds: ["de-b2-gap-konjunktiv", "de-b2-mcq-relative", "de-b2-mcq-train-announcement"],
    scenarioId: "de-travel-disruption",
    conversationTurnGoal: 4
  },
  {
    id: "lesson-es-daily-basics",
    revision: 1,
    language: "es",
    level: "A1",
    sequence: 1,
    title: "Se présenter dans son quartier",
    objective: "Dire qui vous êtes, d'où vous venez et poser une première question à un voisin.",
    focus: "Genre, présent et présentation",
    goalAffinity: ["basics", "fluency", "travel"],
    estimatedMinutes: 10,
    microCourse: {
      title: "Se présenter avec ser",
      introduction: "Ser sert à donner une identité ou une origine. Une présentation simple peut tenir en deux phrases bien maîtrisées.",
      points: [
        "Soy… donne votre identité ou votre origine.",
        "Les articles la et el s'accordent avec le nom.",
        "Les verbes en -ar prennent -amos avec nosotros."
      ],
      examples: [
        { target: "Soy de Francia.", translation: "Je viens de France." },
        { target: "Nosotros hablamos español.", translation: "Nous parlons espagnol." }
      ]
    },
    exerciseIds: ["es-a1-mcq-gender", "es-a1-gap-present", "es-a1-mcq-hotel-room"],
    scenarioId: "es-daily-neighbours",
    conversationTurnGoal: 4
  },
  {
    id: "lesson-es-new-neighbour",
    revision: 1,
    language: "es",
    level: "A2",
    sequence: 4,
    title: "Se repérer dans un nouveau quartier",
    objective: "Vous présenter, parler de votre origine et demander où se trouve un service.",
    focus: "Ser, estar et localisation",
    goalAffinity: ["basics", "travel", "fluency"],
    prerequisiteLessonId: "lesson-es-arrive-at-a-hotel",
    estimatedMinutes: 10,
    microCourse: {
      title: "Choisir entre ser et estar",
      introduction: "Ser sert à présenter l'identité ou l'origine. Estar sert notamment à situer une personne ou un lieu.",
      points: [
        "Soy de… présente votre origine.",
        "Estoy en… indique votre position actuelle.",
        "¿Dónde está…? permet de localiser un lieu ou un service."
      ],
      examples: [
        { target: "Soy de Francia.", translation: "Je viens de France." },
        { target: "¿Dónde está la panadería?", translation: "Où est la boulangerie ?" }
      ]
    },
    exerciseIds: ["es-a1-gap-present", "es-a2-translation-location"],
    scenarioId: "es-daily-neighbours",
    conversationTurnGoal: 4
  },
  {
    id: "lesson-es-experience-work",
    revision: 1,
    language: "es",
    level: "B1",
    sequence: 7,
    title: "Présenter son expérience professionnelle",
    objective: "Raconter une expérience, exprimer une durée et préciser une échéance de travail.",
    focus: "Récit, durée et obligation",
    goalAffinity: ["work", "fluency"],
    prerequisiteLessonId: "lesson-es-find-and-identify",
    estimatedMinutes: 15,
    microCourse: {
      title: "Relier expérience et situation actuelle",
      introduction: "Pour parler de votre parcours, combinez un récit au passé avec une durée encore valable aujourd'hui.",
      points: [
        "L'imparfait décrit une habitude passée.",
        "Desde hace + durée relie le passé au présent.",
        "Tener que + infinitif exprime une obligation concrète."
      ],
      examples: [
        { target: "Aprendo español desde hace dos años.", translation: "J'apprends l'espagnol depuis deux ans." },
        { target: "Tenemos que terminar antes del jueves.", translation: "Nous devons terminer avant jeudi." }
      ]
    },
    exerciseIds: ["es-b1-gap-imperfect", "es-b1-translation-duration", "es-b1-translation-work-schedule"],
    scenarioId: "es-work-interview",
    conversationTurnGoal: 4
  },
  {
    id: "lesson-es-negotiate-conditions",
    revision: 1,
    language: "es",
    level: "B2",
    sequence: 10,
    title: "Négocier une solution sous conditions",
    objective: "Exprimer une hypothèse, parler d'une action antérieure et trouver un compromis.",
    focus: "Subjonctif, antériorité et hypothèse passée",
    goalAffinity: ["work", "fluency", "travel"],
    prerequisiteLessonId: "lesson-es-explain-health-availability",
    estimatedMinutes: 16,
    microCourse: {
      title: "Choisir le mode selon la certitude",
      introduction: "Au niveau B2, le choix entre indicatif et subjonctif précise si la personne, l'action ou la condition est réelle, recherchée ou hypothétique.",
      points: [
        "Busco a alguien que… appelle le subjonctif si la personne n'est pas identifiée.",
        "Habían + participe passé marque une action antérieure à un autre passé.",
        "Si + plus-que-parfait du subjonctif décrit une condition passée irréelle."
      ],
      examples: [
        { target: "Busco a alguien que pueda ayudarme.", translation: "Je cherche quelqu'un qui puisse m'aider." },
        { target: "Si hubiéramos salido antes, no habríamos perdido el vuelo.", translation: "Si nous étions partis plus tôt, nous n'aurions pas raté le vol." }
      ]
    },
    exerciseIds: ["es-b2-mcq-subjunctive", "es-b2-gap-pluperfect", "es-b2-mcq-flight-counterfactual"],
    scenarioId: "es-work-negotiation",
    conversationTurnGoal: 4
  },
  supplementalLesson({
    id: "lesson-en-ask-and-clarify", language: "en", level: "A1", sequence: 2,
    title: "Poser une question simple",
    objective: "Demander un lieu et donner une information personnelle courte.",
    focus: "Questions avec be et troisième personne du présent",
    goalAffinity: ["basics", "travel", "fluency"], prerequisiteLessonId: "lesson-en-daily-basics", estimatedMinutes: 9,
    microCourse: {
      title: "Construire une question directe",
      introduction: "Une question courte devient facile à produire avec un ordre stable : mot interrogatif, auxiliaire, puis sujet.",
      points: ["Utilisez Where + is pour localiser un lieu.", "Avec she ou he, employez has et non have.", "Gardez une seule information importante par question."],
      examples: [{ target: "Where is gate twelve?", translation: "Où est la porte douze ?" }]
    },
    exerciseIds: ["en-a1-mcq-airport-gate", "en-a1-mcq-have"], scenarioId: "en-daily-cafe"
  }),
  supplementalLesson({
    id: "lesson-en-count-and-describe", language: "en", level: "A1", sequence: 3,
    title: "Parler des personnes et des quantités",
    objective: "Dire ce que quelqu'un possède et employer un pluriel fréquent.",
    focus: "Has et pluriels irréguliers",
    goalAffinity: ["basics", "fluency"], prerequisiteLessonId: "lesson-en-ask-and-clarify", estimatedMinutes: 9,
    microCourse: {
      title: "Nommer puis compter",
      introduction: "Une description utile combine un sujet, un verbe précis et une quantité.",
      points: ["Après she ou he, utilisez has.", "Child devient children au pluriel.", "Placez le nombre avant le nom."],
      examples: [{ target: "She has two children.", translation: "Elle a deux enfants." }]
    },
    exerciseIds: ["en-a1-mcq-have", "en-a1-gap-plural"], scenarioId: "en-daily-cafe"
  }),
  supplementalLesson({
    id: "lesson-en-compare-options", language: "en", level: "A2", sequence: 5,
    title: "Comparer deux options du quotidien",
    objective: "Comparer des choix et demander si une quantité est disponible.",
    focus: "Comparatif et some/any",
    goalAffinity: ["basics", "travel"], prerequisiteLessonId: "lesson-en-routine-travel", estimatedMinutes: 11,
    microCourse: {
      title: "Comparer puis vérifier",
      introduction: "Présentez la différence principale avant de confirmer la disponibilité de votre choix.",
      points: ["Un adjectif long se construit souvent avec more.", "Any convient aux questions neutres.", "Concluez avec une demande courte."],
      examples: [{ target: "Is this option more interesting?", translation: "Cette option est-elle plus intéressante ?" }]
    },
    exerciseIds: ["en-a2-mcq-comparative", "en-a2-gap-grocery-any"], scenarioId: "en-travel-hotel"
  }),
  supplementalLesson({
    id: "lesson-en-state-routine-and-needs", language: "en", level: "A2", sequence: 6,
    title: "Expliquer sa routine et ses besoins",
    objective: "Décrire une habitude puis demander un service concret.",
    focus: "Adverbes de fréquence et quantité indéterminée",
    goalAffinity: ["basics", "travel", "fluency"], prerequisiteLessonId: "lesson-en-compare-options", estimatedMinutes: 11,
    microCourse: {
      title: "De l'habitude à la demande",
      introduction: "Partir d'une routine aide votre interlocuteur à comprendre pourquoi vous formulez une demande.",
      points: ["Usually se place avant le verbe principal.", "Any introduit souvent une quantité dans une question.", "Reliez les idées avec but ou so."],
      examples: [{ target: "I usually take the bus to work.", translation: "Je prends habituellement le bus pour aller au travail." }]
    },
    exerciseIds: ["en-a2-translation-routine", "en-a2-gap-grocery-any"], scenarioId: "en-travel-hotel"
  }),
  supplementalLesson({
    id: "lesson-en-give-advice-and-request", language: "en", level: "B1", sequence: 8,
    title: "Conseiller et demander une action",
    objective: "Donner un conseil et formuler une demande professionnelle polie.",
    focus: "Should, could you et échéance avec by",
    goalAffinity: ["work", "fluency"], prerequisiteLessonId: "lesson-en-project-update", estimatedMinutes: 14,
    microCourse: {
      title: "Adapter le degré de politesse",
      introduction: "Un conseil et une demande n'ont pas la même force : choisissez la structure selon l'action attendue.",
      points: ["Should est suivi de la base verbale.", "Could you…? adoucit une demande.", "By Friday signifie au plus tard vendredi."],
      examples: [{ target: "Could you send me the report by Friday?", translation: "Pourriez-vous m'envoyer le rapport avant vendredi ?" }]
    },
    exerciseIds: ["en-b1-translation-advice", "en-b1-translation-report-deadline"], scenarioId: "en-work-project-update"
  }),
  supplementalLesson({
    id: "lesson-en-explain-availability", language: "en", level: "B1", sequence: 9,
    title: "Expliquer une indisponibilité",
    objective: "Annoncer un rendez-vous et préciser depuis quand une situation dure.",
    focus: "Rendez-vous, since et impact sur le planning",
    goalAffinity: ["work", "fluency"], prerequisiteLessonId: "lesson-en-give-advice-and-request", estimatedMinutes: 14,
    microCourse: {
      title: "Donner le fait puis son impact",
      introduction: "Une justification professionnelle reste utile lorsqu'elle est brève et suivie d'une solution.",
      points: ["Appointment at introduit l'heure du rendez-vous.", "Since introduit un point de départ.", "Proposez ensuite une nouvelle disponibilité."],
      examples: [{ target: "I have a doctor's appointment at three.", translation: "J'ai rendez-vous chez le médecin à trois heures." }]
    },
    exerciseIds: ["en-b1-translation-doctor-appointment", "en-b1-gap-since"], scenarioId: "en-work-project-update"
  }),
  supplementalLesson({
    id: "lesson-en-report-and-regret", language: "en", level: "B2", sequence: 11,
    title: "Rapporter un incident et un regret",
    objective: "Distinguer ce qui a été dit de ce que l'on souhaiterait changer.",
    focus: "Discours indirect et wish",
    goalAffinity: ["work", "fluency"], prerequisiteLessonId: "lesson-en-handle-setback", estimatedMinutes: 16,
    microCourse: {
      title: "Fait rapporté, regret présent",
      introduction: "Le recul des temps rapporte les paroles ; wish crée une distance avec la réalité actuelle.",
      points: ["Said that est souvent suivi d'un temps reculé.", "Wish + prétérit exprime un regret présent.", "Terminez par une solution concrète."],
      examples: [{ target: "She said that she was tired.", translation: "Elle a dit qu'elle était fatiguée." }]
    },
    exerciseIds: ["en-b2-mcq-reported", "en-b2-gap-wish"], scenarioId: "en-work-service-recovery"
  }),
  supplementalLesson({
    id: "lesson-en-analyse-missed-connection", language: "en", level: "B2", sequence: 12,
    title: "Analyser une correspondance manquée",
    objective: "Reconstruire la cause d'un incident et rapporter une explication.",
    focus: "Troisième conditionnel et discours indirect",
    goalAffinity: ["travel", "work", "fluency"], prerequisiteLessonId: "lesson-en-report-and-regret", estimatedMinutes: 16,
    microCourse: {
      title: "Reconstruire une autre issue",
      introduction: "Séparez le fait, sa cause et la conséquence irréelle pour rester clair malgré une structure complexe.",
      points: ["If est suivi du past perfect.", "Would have + participe décrit le résultat irréel.", "Le discours indirect rapporte ensuite l'explication."],
      examples: [{ target: "If we had left earlier, we would not have missed the flight.", translation: "Si nous étions partis plus tôt, nous n'aurions pas raté le vol." }]
    },
    exerciseIds: ["en-b2-mcq-missed-flight", "en-b2-mcq-reported"], scenarioId: "en-work-service-recovery"
  }),
  supplementalLesson({
    id: "lesson-de-check-in-politely", language: "de", level: "A1", sequence: 2,
    title: "S'enregistrer avec politesse",
    objective: "Reconnaître un nom et employer le possessif de politesse.",
    focus: "Nominatif, genre et Ihr",
    goalAffinity: ["travel", "basics"], prerequisiteLessonId: "lesson-de-daily-basics", estimatedMinutes: 9,
    microCourse: {
      title: "Identifier qui possède quoi",
      introduction: "L'article indique le genre du nom ; le possessif précise à qui l'objet appartient.",
      points: ["Die accompagne un nom féminin fréquent.", "Der accompagne un nom masculin fréquent.", "Ihr marque ici la politesse."],
      examples: [{ target: "Hier ist Ihr Schlüssel.", translation: "Voici votre clé." }]
    },
    exerciseIds: ["de-a1-mcq-hotel-key", "de-a1-gap-article"], scenarioId: "de-daily-grocery"
  }),
  supplementalLesson({
    id: "lesson-de-build-basic-sentences", language: "de", level: "A1", sequence: 3,
    title: "Décrire son quotidien",
    objective: "Produire une phrase au présent et choisir l'article adapté.",
    focus: "Verbe avec wir et genre des noms",
    goalAffinity: ["basics", "fluency"], prerequisiteLessonId: "lesson-de-check-in-politely", estimatedMinutes: 9,
    microCourse: {
      title: "Sujet, verbe, nom",
      introduction: "Une phrase sûre garde le verbe conjugué juste après le sujet.",
      points: ["Avec wir, le verbe se termine souvent en -en.", "Les noms prennent une majuscule.", "Choisissez l'article selon le genre."],
      examples: [{ target: "Wir wohnen in Berlin.", translation: "Nous habitons à Berlin." }]
    },
    exerciseIds: ["de-a1-mcq-present", "de-a1-gap-article"], scenarioId: "de-daily-grocery"
  }),
  supplementalLesson({
    id: "lesson-de-plan-a-trip", language: "de", level: "A2", sequence: 5,
    title: "Formuler un projet de trajet",
    objective: "Dire ce que l'on doit faire et placer correctement le verbe.",
    focus: "Verbe modal et ordre V2",
    goalAffinity: ["travel", "fluency"], prerequisiteLessonId: "lesson-de-train-ticket", estimatedMinutes: 11,
    microCourse: {
      title: "Deux verbes, deux positions",
      introduction: "Le modal est conjugué en deuxième position et l'infinitif ferme la phrase.",
      points: ["Ich muss exprime une nécessité.", "L'infinitif se place à la fin.", "Après un complément initial, le sujet suit le verbe."],
      examples: [{ target: "Morgen muss ich früh fahren.", translation: "Demain, je dois partir tôt." }]
    },
    exerciseIds: ["de-a2-mcq-modal", "de-a2-translation-order"], scenarioId: "de-travel-station"
  }),
  supplementalLesson({
    id: "lesson-de-pay-and-confirm", language: "de", level: "A2", sequence: 6,
    title: "Payer et confirmer son choix",
    objective: "Indiquer un moyen de paiement et exprimer une nécessité.",
    focus: "Mit + datif et verbes modaux",
    goalAffinity: ["travel", "basics"], prerequisiteLessonId: "lesson-de-plan-a-trip", estimatedMinutes: 11,
    microCourse: {
      title: "Confirmer une transaction",
      introduction: "Une phrase de paiement combine l'action, le moyen utilisé et, si besoin, une contrainte.",
      points: ["Mit impose le datif.", "Dites mit der Karte.", "Müssen exprime une nécessité."],
      examples: [{ target: "Ich bezahle mit der Karte.", translation: "Je paie par carte." }]
    },
    exerciseIds: ["de-a2-gap-shopping-dative", "de-a2-mcq-modal"], scenarioId: "de-travel-station"
  }),
  supplementalLesson({
    id: "lesson-de-explain-a-delay", language: "de", level: "B1", sequence: 8,
    title: "Justifier un retard de réunion",
    objective: "Annoncer un changement d'horaire et en donner la raison.",
    focus: "Weil et repères temporels",
    goalAffinity: ["work", "fluency"], prerequisiteLessonId: "lesson-de-explain-organise", estimatedMinutes: 14,
    microCourse: {
      title: "Annonce puis justification",
      introduction: "La proposition principale donne le changement ; la subordonnée en explique la cause.",
      points: ["Après weil, le verbe va à la fin.", "Une virgule sépare les deux propositions.", "Später précise le décalage."],
      examples: [{ target: "Die Besprechung beginnt später, weil der Zug Verspätung hat.", translation: "La réunion commence plus tard parce que le train a du retard." }]
    },
    exerciseIds: ["de-b1-translation-because", "de-b1-translation-meeting-delay"], scenarioId: "de-work-meeting"
  }),
  supplementalLesson({
    id: "lesson-de-explain-health-absence", language: "de", level: "B1", sequence: 9,
    title: "Expliquer une absence pour raison de santé",
    objective: "Demander un remède et raconter un déplacement passé.",
    focus: "Gegen + symptôme et Perfekt avec sein",
    goalAffinity: ["work", "fluency"], prerequisiteLessonId: "lesson-de-explain-a-delay", estimatedMinutes: 14,
    microCourse: {
      title: "Du problème à l'explication",
      introduction: "Nommez le symptôme, puis racontez brièvement ce que vous avez fait.",
      points: ["Etwas gegen introduit le symptôme.", "Un déplacement au Perfekt emploie souvent sein.", "Le participe se place à la fin."],
      examples: [{ target: "Ich bin früh nach Hause gegangen.", translation: "Je suis rentré tôt à la maison." }]
    },
    exerciseIds: ["de-b1-translation-pharmacy", "de-b1-gap-perfect"], scenarioId: "de-work-meeting"
  }),
  supplementalLesson({
    id: "lesson-de-propose-an-alternative", language: "de", level: "B2", sequence: 11,
    title: "Proposer une solution de remplacement",
    objective: "Comprendre une suppression et suggérer une option hypothétique.",
    focus: "Ausfallen et Konjunktiv II",
    goalAffinity: ["travel", "work", "fluency"], prerequisiteLessonId: "lesson-de-handle-disruption", estimatedMinutes: 16,
    microCourse: {
      title: "Incident réel, solution prudente",
      introduction: "L'indicatif annonce le fait ; le Konjunktiv II permet de proposer sans imposer.",
      points: ["Ausfallen est un verbe séparable.", "Wenn + Konjunktiv II pose l'hypothèse.", "Würde + infinitif présente la solution."],
      examples: [{ target: "Wenn der Zug ausfiele, würde ich den Bus nehmen.", translation: "Si le train était supprimé, je prendrais le bus." }]
    },
    exerciseIds: ["de-b2-mcq-train-announcement", "de-b2-gap-konjunktiv"], scenarioId: "de-travel-disruption"
  }),
  supplementalLesson({
    id: "lesson-de-clarify-a-disruption", language: "de", level: "B2", sequence: 12,
    title: "Préciser les acteurs d'un incident",
    objective: "Comprendre une annonce puis préciser avec qui l'on doit agir.",
    focus: "Verbe séparable et relatif au datif",
    goalAffinity: ["travel", "work"], prerequisiteLessonId: "lesson-de-propose-an-alternative", estimatedMinutes: 16,
    microCourse: {
      title: "Relier l'information utile",
      introduction: "Une proposition relative précise une personne ou un service sans répéter le nom.",
      points: ["Mit impose le datif.", "Le relatif masculin au datif est dem.", "Le préfixe aus revient en fin de phrase."],
      examples: [{ target: "Das ist der Kollege, mit dem ich reise.", translation: "C'est le collègue avec qui je voyage." }]
    },
    exerciseIds: ["de-b2-mcq-relative", "de-b2-mcq-train-announcement"], scenarioId: "de-travel-disruption"
  }),
  supplementalLesson({
    id: "lesson-es-introduce-a-group", language: "es", level: "A1", sequence: 2,
    title: "Présenter son groupe",
    objective: "Nommer des personnes ou objets et dire quelle langue le groupe parle.",
    focus: "Genre et présent en -amos",
    goalAffinity: ["basics", "fluency"], prerequisiteLessonId: "lesson-es-daily-basics", estimatedMinutes: 9,
    microCourse: {
      title: "Accorder puis conjuguer",
      introduction: "L'article dépend du nom et la terminaison du verbe dépend du sujet.",
      points: ["La accompagne un nom féminin.", "Avec nosotros, un verbe en -ar se termine en -amos.", "Prononcez clairement les voyelles finales."],
      examples: [{ target: "Nosotros hablamos español.", translation: "Nous parlons espagnol." }]
    },
    exerciseIds: ["es-a1-mcq-gender", "es-a1-gap-present"], scenarioId: "es-daily-neighbours"
  }),
  supplementalLesson({
    id: "lesson-es-arrive-at-a-hotel", language: "es", level: "A1", sequence: 3,
    title: "Donner son nom à l'hôtel",
    objective: "Annoncer une réservation et reconnaître le genre d'un nom courant.",
    focus: "Tener una reserva et article féminin",
    goalAffinity: ["travel", "basics"], prerequisiteLessonId: "lesson-es-introduce-a-group", estimatedMinutes: 9,
    microCourse: {
      title: "Une information à la fois",
      introduction: "Une arrivée simple commence par la réservation puis ajoute le nom de la personne.",
      points: ["Tengo signifie j'ai.", "Reserva est féminin.", "A nombre de introduit le nom."],
      examples: [{ target: "Tengo una reserva a nombre de García.", translation: "J'ai une réservation au nom de García." }]
    },
    exerciseIds: ["es-a1-mcq-hotel-room", "es-a1-mcq-gender"], scenarioId: "es-daily-neighbours"
  }),
  supplementalLesson({
    id: "lesson-es-order-a-meal", language: "es", level: "A2", sequence: 5,
    title: "Commander une quantité au restaurant",
    objective: "Préciser une quantité et remplacer un produit déjà nommé.",
    focus: "Quantité + de et pronom direct",
    goalAffinity: ["travel", "basics"], prerequisiteLessonId: "lesson-es-new-neighbour", estimatedMinutes: 11,
    microCourse: {
      title: "Nommer puis reprendre",
      introduction: "La première phrase nomme le produit ; la suivante peut le reprendre avec un pronom.",
      points: ["Une quantité est suivie de de.", "Lo reprend un nom masculin singulier.", "Le pronom se place avant le verbe."],
      examples: [{ target: "Quiero el pan. Lo compro.", translation: "Je veux le pain. Je l'achète." }]
    },
    exerciseIds: ["es-a2-gap-market-quantity", "es-a2-mcq-object"], scenarioId: "es-travel-restaurant"
  }),
  supplementalLesson({
    id: "lesson-es-find-and-identify", language: "es", level: "A2", sequence: 6,
    title: "Trouver un service dans le quartier",
    objective: "Localiser un lieu et reprendre un nom sans le répéter.",
    focus: "Estar de localisation et pronom direct",
    goalAffinity: ["travel", "basics", "fluency"], prerequisiteLessonId: "lesson-es-order-a-meal", estimatedMinutes: 11,
    microCourse: {
      title: "Localiser puis préciser",
      introduction: "Estar place le lieu ; le pronom reprend ensuite l'objet déjà connu.",
      points: ["Está cerca de localise un lieu.", "De + el devient del.", "Lo ou la se place avant le verbe."],
      examples: [{ target: "La estación está cerca del hotel.", translation: "La gare est près de l'hôtel." }]
    },
    exerciseIds: ["es-a2-translation-location", "es-a2-mcq-object"], scenarioId: "es-daily-neighbours"
  }),
  supplementalLesson({
    id: "lesson-es-tell-career-story", language: "es", level: "B1", sequence: 8,
    title: "Raconter son parcours",
    objective: "Décrire une habitude passée et une expérience toujours actuelle.",
    focus: "Imparfait et desde hace",
    goalAffinity: ["work", "fluency"], prerequisiteLessonId: "lesson-es-experience-work", estimatedMinutes: 14,
    microCourse: {
      title: "Passé descriptif, durée actuelle",
      introduction: "Séparez ce qui était habituel de ce qui continue encore aujourd'hui.",
      points: ["L'imparfait décrit une habitude passée.", "Le présent avec desde hace décrit une durée actuelle.", "Ajoutez un repère de temps concret."],
      examples: [{ target: "Trabajo aquí desde hace dos años.", translation: "Je travaille ici depuis deux ans." }]
    },
    exerciseIds: ["es-b1-gap-imperfect", "es-b1-translation-duration"], scenarioId: "es-work-interview"
  }),
  supplementalLesson({
    id: "lesson-es-explain-health-availability", language: "es", level: "B1", sequence: 9,
    title: "Négocier sa disponibilité",
    objective: "Signaler un symptôme et maintenir une échéance réaliste.",
    focus: "Doler, obligation et date limite",
    goalAffinity: ["work", "fluency"], prerequisiteLessonId: "lesson-es-tell-career-story", estimatedMinutes: 14,
    microCourse: {
      title: "Problème puis engagement",
      introduction: "Expliquez brièvement la contrainte avant de proposer une échéance crédible.",
      points: ["Me duele introduit le symptôme.", "Tener que exprime l'obligation.", "Antes de fixe la limite."],
      examples: [{ target: "Me duele la garganta, pero tenemos que terminar antes del jueves.", translation: "J'ai mal à la gorge, mais nous devons terminer avant jeudi." }]
    },
    exerciseIds: ["es-b1-translation-doctor", "es-b1-translation-work-schedule"], scenarioId: "es-work-interview"
  }),
  supplementalLesson({
    id: "lesson-es-find-a-collaborator", language: "es", level: "B2", sequence: 11,
    title: "Définir un profil recherché",
    objective: "Décrire une personne non identifiée et vérifier une expérience antérieure.",
    focus: "Subjonctif dans la relative et plus-que-parfait",
    goalAffinity: ["work", "fluency"], prerequisiteLessonId: "lesson-es-negotiate-conditions", estimatedMinutes: 16,
    microCourse: {
      title: "Recherche ouverte, passé antérieur",
      introduction: "Le subjonctif marque le profil non encore trouvé ; le plus-que-parfait ordonne les faits passés.",
      points: ["Alguien que pueda décrit un profil non identifié.", "Habían + participe marque l'antériorité.", "Gardez une chronologie explicite."],
      examples: [{ target: "Busco a alguien que pueda ayudarme.", translation: "Je cherche quelqu'un qui puisse m'aider." }]
    },
    exerciseIds: ["es-b2-mcq-subjunctive", "es-b2-gap-pluperfect"], scenarioId: "es-work-negotiation"
  }),
  supplementalLesson({
    id: "lesson-es-explain-a-missed-deadline", language: "es", level: "B2", sequence: 12,
    title: "Analyser un délai manqué",
    objective: "Ordonner les faits passés et imaginer une autre issue.",
    focus: "Plus-que-parfait et condition passée irréelle",
    goalAffinity: ["work", "fluency"], prerequisiteLessonId: "lesson-es-find-a-collaborator", estimatedMinutes: 16,
    microCourse: {
      title: "Ce qui s'était passé, ce qui aurait pu changer",
      introduction: "Posez d'abord l'antériorité puis formulez le scénario qui n'a pas eu lieu.",
      points: ["Habían + participe décrit le fait antérieur.", "Si hubiéramos introduit la condition irréelle.", "Habríamos + participe donne la conséquence."],
      examples: [{ target: "Si hubiéramos empezado antes, habríamos terminado a tiempo.", translation: "Si nous avions commencé plus tôt, nous aurions terminé à temps." }]
    },
    exerciseIds: ["es-b2-gap-pluperfect", "es-b2-mcq-flight-counterfactual"], scenarioId: "es-work-negotiation"
  })
];
