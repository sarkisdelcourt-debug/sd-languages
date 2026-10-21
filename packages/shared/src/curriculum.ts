import type {
  CefrLevel,
  DiagnosticQuestion,
  Exercise,
  LanguageCode
} from "./types.js";
import { ENGLISH_BANK } from "./content/en/index.js";
import { SPANISH_A1_EXERCISES } from "./spanish-a1.js";

const DIAGNOSTIC_BY_LANGUAGE: Record<LanguageCode, DiagnosticQuestion[]> = {
  en: [
    {
      id: "diag-en-a1-greeting",
      language: "en",
      level: "A1",
      type: "multiple-choice",
      prompt: "Complétez : Hello, my name ___ Sam.",
      choices: ["am", "is", "are", "be"],
      answer: "is",
      explanation: "Avec « my name », sujet singulier, le verbe be prend la forme « is ».",
      hint: "Cherchez la forme de be utilisée avec he, she ou it.",
      focus: "Verbe be au présent",
      diagnosticWeight: 1
    },
    {
      id: "diag-en-a2-past",
      language: "en",
      level: "A2",
      type: "fill-gap",
      prompt: "Complétez avec le prétérit de go : Yesterday, we ___ to the cinema.",
      answer: "went",
      explanation: "Le prétérit irrégulier de « go » est « went ».",
      hint: "Il s'agit d'un verbe irrégulier.",
      focus: "Prétérit irrégulier",
      diagnosticWeight: 1
    },
    {
      id: "diag-en-b1-duration",
      language: "en",
      level: "B1",
      type: "multiple-choice",
      prompt: "Choisissez la bonne phrase pour une action commencée dans le passé et toujours vraie.",
      choices: [
        "I live here since three years.",
        "I have lived here for three years.",
        "I am living here since three years.",
        "I lived here for three years ago."
      ],
      answer: "I have lived here for three years.",
      explanation: "Le present perfect avec « for » exprime une durée qui se prolonge jusqu'au présent.",
      hint: "Associez present perfect et for.",
      focus: "Present perfect et durée",
      diagnosticWeight: 2
    },
    {
      id: "diag-en-b2-condition",
      language: "en",
      level: "B2",
      type: "fill-gap",
      prompt: "Complétez : If I had known about the delay, I ___ earlier.",
      answer: "would have left",
      explanation: "Le troisième conditionnel suit le modèle if + past perfect, puis would have + participe passé.",
      hint: "Utilisez would have suivi du participe passé de leave.",
      focus: "Troisième conditionnel",
      diagnosticWeight: 2
    },
    {
      id: "diag-en-c1-inversion",
      language: "en",
      level: "C1",
      type: "multiple-choice",
      prompt: "Complétez : Rarely ___ such a convincing argument.",
      choices: ["I heard", "have I heard", "I have heard", "did I have heard"],
      answer: "have I heard",
      explanation: "Après un adverbe négatif placé en tête, l'anglais soutenu emploie l'inversion auxiliaire-sujet.",
      hint: "« Rarely » en tête déclenche une inversion.",
      focus: "Inversion après un adverbe négatif",
      diagnosticWeight: 3
    },
    {
      id: "diag-en-c1-translation",
      language: "en",
      level: "C1",
      type: "translation",
      prompt: "Traduisez : Quoi qu'il arrive, nous maintiendrons notre décision.",
      answer: "Whatever happens, we will stand by our decision.",
      acceptedAnswers: [
        "Whatever happens, we'll stand by our decision.",
        "No matter what happens, we will stand by our decision.",
        "No matter what happens, we'll stand by our decision."
      ],
      explanation: "« Whatever happens » introduit une concession et « stand by a decision » signifie maintenir une décision.",
      hint: "Commencez par Whatever happens ou No matter what happens.",
      focus: "Concession et expression idiomatique",
      diagnosticWeight: 3
    }
  ],
  de: [
    {
      id: "diag-de-a1-copula",
      language: "de",
      level: "A1",
      type: "multiple-choice",
      prompt: "Complétez : Ich ___ Anna.",
      choices: ["bist", "bin", "ist", "seid"],
      answer: "bin",
      explanation: "À la première personne du singulier, sein se conjugue « ich bin ».",
      hint: "Cherchez la forme de sein avec ich.",
      focus: "Verbe sein au présent",
      diagnosticWeight: 1
    },
    {
      id: "diag-de-a2-accusative",
      language: "de",
      level: "A2",
      type: "fill-gap",
      prompt: "Complétez avec l'article défini : Ich sehe ___ Mann.",
      answer: "den",
      explanation: "Mann est masculin et complément d'objet direct : der devient den à l'accusatif.",
      hint: "Le masculin change à l'accusatif.",
      focus: "Accusatif masculin",
      diagnosticWeight: 1
    },
    {
      id: "diag-de-b1-subordinate",
      language: "de",
      level: "B1",
      type: "multiple-choice",
      prompt: "Choisissez la proposition correcte après weil.",
      choices: [
        "weil ich bin müde",
        "weil bin ich müde",
        "weil ich müde bin",
        "weil müde ich bin"
      ],
      answer: "weil ich müde bin",
      explanation: "Dans une subordonnée introduite par « weil », le verbe conjugué se place à la fin.",
      hint: "Le verbe conjugué ferme la subordonnée.",
      focus: "Ordre des mots en subordonnée",
      diagnosticWeight: 2
    },
    {
      id: "diag-de-b2-passive",
      language: "de",
      level: "B2",
      type: "fill-gap",
      prompt: "Complétez les deux blancs : Die Brücke ___ gerade ___.",
      answer: "wird gebaut",
      explanation: "Le passif d'action au présent se construit avec werden + participe II : « wird gebaut ».",
      hint: "Utilisez werden à la 3e personne, puis le participe II.",
      focus: "Passif d'action",
      diagnosticWeight: 2
    },
    {
      id: "diag-de-c1-konjunktiv",
      language: "de",
      level: "C1",
      type: "multiple-choice",
      prompt: "Complétez le discours indirect : Er behauptet, er ___ davon nichts gewusst.",
      choices: ["hat", "habe", "hätte", "sei"],
      answer: "habe",
      explanation: "Le discours indirect formel emploie ici le Konjunktiv I : « er habe gewusst ».",
      hint: "Cherchez le Konjunktiv I de haben à la 3e personne.",
      focus: "Konjunktiv I et discours indirect",
      diagnosticWeight: 3
    },
    {
      id: "diag-de-c1-translation",
      language: "de",
      level: "C1",
      type: "translation",
      prompt: "Traduisez : Plus tôt nous commencerons, mieux ce sera.",
      answer: "Je früher wir anfangen, desto besser wird es sein.",
      acceptedAnswers: [
        "Je früher wir beginnen, desto besser wird es sein.",
        "Je früher wir anfangen, umso besser wird es sein.",
        "Je früher wir beginnen, umso besser wird es sein."
      ],
      explanation: "La corrélation française « plus…, mieux… » se rend par « je…, desto/umso… ».",
      hint: "Utilisez la structure je …, desto …",
      focus: "Comparaison corrélative",
      diagnosticWeight: 3
    }
  ],
  es: [
    {
      id: "diag-es-a1-ser",
      language: "es",
      level: "A1",
      type: "multiple-choice",
      prompt: "Complétez : Yo ___ estudiante.",
      choices: ["eres", "soy", "es", "estoy"],
      answer: "soy",
      explanation: "Une identité ou profession s'exprime avec ser : « yo soy ».",
      hint: "Utilisez la première personne de ser.",
      focus: "Verbe ser au présent",
      diagnosticWeight: 1
    },
    {
      id: "diag-es-a2-past",
      language: "es",
      level: "A2",
      type: "fill-gap",
      prompt: "Complétez au passé simple : Ayer, Marta ___ una carta. (escribir)",
      answer: "escribió",
      explanation: "À la 3e personne du singulier, escribir donne « escribió » au pretérito indefinido.",
      hint: "La terminaison des verbes en -ir est -ió à cette personne.",
      focus: "Pretérito indefinido",
      diagnosticWeight: 1
    },
    {
      id: "diag-es-b1-subjunctive",
      language: "es",
      level: "B1",
      type: "multiple-choice",
      prompt: "Complétez : Espero que tú ___ mañana.",
      choices: ["vienes", "vendrás", "vengas", "venías"],
      answer: "vengas",
      explanation: "« Espero que » exprime un souhait et appelle le subjonctif présent : vengas.",
      hint: "Un souhait introduit par que déclenche le subjonctif.",
      focus: "Subjonctif présent",
      diagnosticWeight: 2
    },
    {
      id: "diag-es-b2-condition",
      language: "es",
      level: "B2",
      type: "fill-gap",
      prompt: "Complétez : Si tuviera más tiempo, ___ otro idioma. (aprender)",
      answer: "aprendería",
      explanation: "Avec si + imparfait du subjonctif, la conséquence se met au conditionnel.",
      hint: "Utilisez le conditionnel simple de aprender.",
      focus: "Hypothèse irréelle au présent",
      diagnosticWeight: 2
    },
    {
      id: "diag-es-c1-concession",
      language: "es",
      level: "C1",
      type: "multiple-choice",
      prompt: "Complétez pour évoquer une éventualité future : Aunque ___ mañana, iremos.",
      choices: ["llueve", "lloverá", "llueva", "llovió"],
      answer: "llueva",
      explanation: "Avec « aunque », une éventualité non réalisée appelle le subjonctif présent.",
      hint: "La pluie est hypothétique, pas constatée.",
      focus: "Concession au subjonctif",
      diagnosticWeight: 3
    },
    {
      id: "diag-es-c1-translation",
      language: "es",
      level: "C1",
      type: "translation",
      prompt: "Traduisez : Il se peut qu'ils aient oublié le rendez-vous.",
      answer: "Puede que hayan olvidado la cita.",
      acceptedAnswers: ["Puede que se hayan olvidado de la cita.", "Es posible que hayan olvidado la cita."],
      explanation: "« Puede que » commande le subjonctif ; pour une action passée, on emploie hayan + participe passé.",
      hint: "Utilisez puede que suivi du subjonctif passé.",
      focus: "Subjonctif passé et probabilité",
      diagnosticWeight: 3
    }
  ]
};

const EXERCISES_BY_LANGUAGE: Record<LanguageCode, Exercise[]> = {
  en: [
    {
      id: "en-a1-mcq-have",
      language: "en",
      level: "A1",
      type: "multiple-choice",
      prompt: "Complétez : She ___ two brothers.",
      choices: ["have", "has", "having", "is have"],
      answer: "has",
      explanation: "Au présent simple, have devient « has » à la 3e personne du singulier.",
      hint: "Le sujet est she.",
      focus: "Présent simple"
    },
    {
      id: "en-a1-gap-plural",
      language: "en",
      level: "A1",
      type: "fill-gap",
      prompt: "Complétez au pluriel : one child, two ___.",
      answer: "children",
      explanation: "Le pluriel de child est irrégulier : children.",
      hint: "Ce pluriel ne se forme pas avec -s.",
      focus: "Pluriels irréguliers"
    },
    {
      id: "en-a2-translation-routine",
      language: "en",
      level: "A2",
      type: "translation",
      prompt: "Traduisez : Je prends habituellement le bus pour aller au travail.",
      answer: "I usually take the bus to work.",
      acceptedAnswers: ["I usually go to work by bus."],
      explanation: "« Usually » se place avant le verbe principal ; « take the bus » désigne le moyen de transport.",
      hint: "Placez usually avant take.",
      focus: "Fréquence et habitudes"
    },
    {
      id: "en-a2-mcq-comparative",
      language: "en",
      level: "A2",
      type: "multiple-choice",
      prompt: "Complétez : This book is ___ than the film.",
      choices: ["interesting", "more interesting", "most interesting", "interestinger"],
      answer: "more interesting",
      explanation: "Un adjectif long forme son comparatif avec more + adjectif.",
      hint: "Interesting est un adjectif de plusieurs syllabes.",
      focus: "Comparatif"
    },
    {
      id: "en-b1-gap-since",
      language: "en",
      level: "B1",
      type: "fill-gap",
      prompt: "Complétez : She has worked here ___ 2021.",
      answer: "since",
      explanation: "« Since » introduit le point de départ d'une action encore en cours.",
      hint: "2021 est un point de départ, pas une durée.",
      focus: "Since et for"
    },
    {
      id: "en-b1-translation-advice",
      language: "en",
      level: "B1",
      type: "translation",
      prompt: "Traduisez : Tu devrais lui parler avant de décider.",
      answer: "You should talk to him before deciding.",
      acceptedAnswers: [
        "You should talk to her before deciding.",
        "You should speak to him before deciding.",
        "You should speak to her before deciding.",
        "You should talk to them before deciding."
      ],
      explanation: "Should exprime un conseil et est suivi de la base verbale ; before peut être suivi d'un gérondif.",
      hint: "Utilisez should + talk, puis before + verbe en -ing.",
      focus: "Conseil avec should"
    },
    {
      id: "en-b2-mcq-reported",
      language: "en",
      level: "B2",
      type: "multiple-choice",
      prompt: "Passez au discours indirect : “I am tired,” she said.",
      choices: [
        "She said that she is tired.",
        "She said that she was tired.",
        "She told that she was tired.",
        "She said me that she was tired."
      ],
      answer: "She said that she was tired.",
      explanation: "Après said au passé, am recule généralement à was au discours indirect.",
      hint: "Appliquez le recul du présent vers le prétérit.",
      focus: "Discours indirect"
    },
    {
      id: "en-b2-gap-wish",
      language: "en",
      level: "B2",
      type: "fill-gap",
      prompt: "Complétez : I wish I ___ how to solve this problem. (know)",
      answer: "knew",
      explanation: "Après wish, le prétérit exprime un regret ou une situation irréelle au présent.",
      hint: "Employez le prétérit de know.",
      focus: "Wish et irréel présent"
    },
    {
      id: "en-c1-translation-emphasis",
      language: "en",
      level: "C1",
      type: "translation",
      prompt: "Traduisez : Ce n'est qu'après la réunion que j'ai compris le problème.",
      answer: "Only after the meeting did I understand the problem.",
      acceptedAnswers: ["It was only after the meeting that I understood the problem."],
      explanation: "Only + complément placé en tête entraîne l'inversion de l'auxiliaire et du sujet.",
      hint: "Commencez par Only after et inversez did et I.",
      focus: "Inversion emphatique"
    },
    {
      id: "en-a1-mcq-airport-gate",
      language: "en",
      level: "A1",
      type: "multiple-choice",
      prompt: "Choisissez la question correcte pour trouver votre porte d'embarquement.",
      choices: ["Where is gate twelve?", "What gate twelve is?", "Where gate twelve?", "Is where gate twelve?"],
      answer: "Where is gate twelve?",
      explanation: "Avec le verbe be, une question directe suit l'ordre mot interrogatif + be + sujet.",
      hint: "Commencez par Where, puis placez is avant gate twelve.",
      focus: "Question de localisation en voyage"
    },
    {
      id: "en-a2-gap-grocery-any",
      language: "en",
      level: "A2",
      type: "fill-gap",
      prompt: "Complétez : Do we have ___ milk left?",
      answer: "any",
      explanation: "Dans une question neutre, on emploie généralement any devant un nom indénombrable.",
      hint: "Le déterminant attendu est fréquent dans les questions et les phrases négatives.",
      focus: "Some et any au quotidien"
    },
    {
      id: "en-b1-translation-report-deadline",
      language: "en",
      level: "B1",
      type: "translation",
      prompt: "Traduisez : Pourriez-vous m'envoyer le rapport avant vendredi ?",
      answer: "Could you send me the report by Friday?",
      acceptedAnswers: ["Could you send the report to me by Friday?", "Could you please send me the report by Friday?"],
      explanation: "Could you formule une demande polie et by Friday fixe une échéance au plus tard vendredi.",
      hint: "Utilisez Could you, puis by pour l'échéance.",
      focus: "Demande polie au travail"
    },
    {
      id: "en-b2-mcq-missed-flight",
      language: "en",
      level: "B2",
      type: "multiple-choice",
      prompt: "Complétez : If the taxi had arrived on time, we ___ our flight.",
      choices: ["wouldn't miss", "wouldn't have missed", "hadn't missed", "won't have missed"],
      answer: "wouldn't have missed",
      explanation: "Une conséquence passée irréelle se construit avec would have + participe passé.",
      hint: "La proposition en if est au past perfect : utilisez le troisième conditionnel.",
      focus: "Troisième conditionnel en voyage"
    },
    {
      id: "en-c1-gap-work-inversion",
      language: "en",
      level: "C1",
      type: "fill-gap",
      prompt: "Complétez avec l'auxiliaire et le sujet : Not only ___ the deadline, but she also improved the final design. (she / meet)",
      answer: "did she meet",
      explanation: "Après Not only placé en tête, le prétérit simple exige l'inversion did + sujet + base verbale.",
      hint: "Inversez did et she, puis gardez meet à la base verbale.",
      focus: "Inversion emphatique au travail"
    },
    {
      id: "en-b1-translation-doctor-appointment",
      language: "en",
      level: "B1",
      type: "translation",
      prompt: "Traduisez : J'ai rendez-vous chez le médecin à trois heures.",
      answer: "I have a doctor's appointment at three o'clock.",
      acceptedAnswers: ["I have an appointment with the doctor at three o'clock.", "I have a doctor's appointment at three."],
      explanation: "A doctor's appointment désigne un rendez-vous médical et at introduit une heure précise.",
      hint: "Utilisez have an appointment ou have a doctor's appointment.",
      focus: "Rendez-vous du quotidien"
    }
  ],
  de: [
    {
      id: "de-a1-mcq-present",
      language: "de",
      level: "A1",
      type: "multiple-choice",
      prompt: "Complétez : Wir ___ in Berlin.",
      choices: ["wohnt", "wohne", "wohnen", "wohnst"],
      answer: "wohnen",
      explanation: "Avec wir, le verbe au présent prend la terminaison -en.",
      hint: "Le sujet est wir.",
      focus: "Présent des verbes réguliers"
    },
    {
      id: "de-a1-gap-article",
      language: "de",
      level: "A1",
      type: "fill-gap",
      prompt: "Complétez avec l'article défini : ___ Frau kommt aus Wien.",
      answer: "die",
      explanation: "Frau est un nom féminin ; son article défini au nominatif est die.",
      hint: "Frau est féminin.",
      focus: "Genre et articles"
    },
    {
      id: "de-a2-translation-order",
      language: "de",
      level: "A2",
      type: "translation",
      prompt: "Traduisez : Demain, je vais au marché.",
      answer: "Morgen gehe ich auf den Markt.",
      acceptedAnswers: ["Ich gehe morgen auf den Markt."],
      explanation: "Quand Morgen occupe la première position, le verbe reste en deuxième position, avant le sujet.",
      hint: "Commencez par Morgen, puis placez le verbe.",
      focus: "Verbe en deuxième position"
    },
    {
      id: "de-a2-mcq-modal",
      language: "de",
      level: "A2",
      type: "multiple-choice",
      prompt: "Complétez : Ich ___ heute länger arbeiten.",
      choices: ["muss", "müsse", "musst", "müssen"],
      answer: "muss",
      explanation: "Müssen donne « ich muss » ; l'infinitif arbeiten reste à la fin.",
      hint: "Conjuguez müssen avec ich.",
      focus: "Verbes modaux"
    },
    {
      id: "de-b1-gap-perfect",
      language: "de",
      level: "B1",
      type: "fill-gap",
      prompt: "Complétez au Perfekt : Wir sind früh nach Hause ___. (gehen)",
      answer: "gegangen",
      explanation: "Gehen forme son Perfekt avec sein et le participe « gegangen ».",
      hint: "Le participe irrégulier commence par ge-.",
      focus: "Perfekt des verbes de déplacement"
    },
    {
      id: "de-b1-translation-because",
      language: "de",
      level: "B1",
      type: "translation",
      prompt: "Traduisez : Je reste à la maison parce qu'il pleut.",
      answer: "Ich bleibe zu Hause, weil es regnet.",
      explanation: "Weil introduit une subordonnée dans laquelle le verbe conjugué se place à la fin.",
      hint: "Après weil, placez regnet en fin de proposition.",
      focus: "Subordonnée avec weil"
    },
    {
      id: "de-b2-mcq-relative",
      language: "de",
      level: "B2",
      type: "multiple-choice",
      prompt: "Complétez : Das ist der Kollege, mit ___ ich arbeite.",
      choices: ["der", "den", "dem", "dessen"],
      answer: "dem",
      explanation: "La préposition mit régit le datif ; l'antécédent masculin impose le relatif dem.",
      hint: "Mit commande toujours le datif.",
      focus: "Pronom relatif au datif"
    },
    {
      id: "de-b2-gap-konjunktiv",
      language: "de",
      level: "B2",
      type: "fill-gap",
      prompt: "Complétez : Wenn ich mehr Geld hätte, ___ ich öfter reisen.",
      answer: "würde",
      explanation: "La conséquence d'une hypothèse irréelle se forme couramment avec würde + infinitif.",
      hint: "Utilisez le Konjunktiv II de werden.",
      focus: "Konjunktiv II"
    },
    {
      id: "de-c1-translation-nominal",
      language: "de",
      level: "C1",
      type: "translation",
      prompt: "Traduisez : Malgré les difficultés, le projet a été mené à bien.",
      answer: "Trotz der Schwierigkeiten wurde das Projekt erfolgreich abgeschlossen.",
      acceptedAnswers: ["Trotz der Schwierigkeiten ist das Projekt erfolgreich abgeschlossen worden."],
      explanation: "Trotz régit ici le génitif ; le passif au prétérit se forme avec wurde + participe II.",
      hint: "Utilisez trotz + génitif, puis le passif de abschließen.",
      focus: "Génitif et passif"
    },
    {
      id: "de-a1-mcq-hotel-key",
      language: "de",
      level: "A1",
      type: "multiple-choice",
      prompt: "Complétez à l'hôtel : Hier ist ___ Schlüssel.",
      choices: ["Ihr", "Ihre", "Ihren", "Ihrem"],
      answer: "Ihr",
      explanation: "Schlüssel est masculin et sujet au nominatif ; le possessif de politesse est Ihr.",
      hint: "Le nom masculin est ici au nominatif.",
      focus: "Possessif de politesse en voyage"
    },
    {
      id: "de-a2-gap-shopping-dative",
      language: "de",
      level: "A2",
      type: "fill-gap",
      prompt: "Complétez : Ich bezahle ___ Karte.",
      answer: "mit",
      explanation: "Pour indiquer un moyen de paiement, l'allemand emploie mit suivi du datif.",
      hint: "La préposition signifie ici « avec ».",
      focus: "Paiement au quotidien"
    },
    {
      id: "de-b1-translation-meeting-delay",
      language: "de",
      level: "B1",
      type: "translation",
      prompt: "Traduisez : La réunion commence dix minutes plus tard.",
      answer: "Die Besprechung beginnt zehn Minuten später.",
      acceptedAnswers: ["Das Meeting beginnt zehn Minuten später."],
      explanation: "Später exprime un décalage dans le temps et se place naturellement après la durée.",
      hint: "Utilisez beginnt et l'adverbe später.",
      focus: "Horaires au travail"
    },
    {
      id: "de-b2-mcq-train-announcement",
      language: "de",
      level: "B2",
      type: "multiple-choice",
      prompt: "Complétez l'annonce : Wegen einer technischen Störung ___ der Zug heute aus.",
      choices: ["fällt", "fallt", "fehlt", "fiele"],
      answer: "fällt",
      explanation: "Le verbe à particule séparable ausfallen donne « der Zug fällt aus » au présent.",
      hint: "Conjuguez ausfallen à la troisième personne du singulier.",
      focus: "Annonce ferroviaire"
    },
    {
      id: "de-c1-gap-work-reported",
      language: "de",
      level: "C1",
      type: "fill-gap",
      prompt: "Complétez au discours indirect : Die Projektleiterin erklärte, der Termin ___ nicht verschoben werden. (können)",
      answer: "könne",
      explanation: "Au discours indirect formel, le Konjunktiv I de können à la troisième personne du singulier est könne.",
      hint: "Utilisez le Konjunktiv I du verbe modal können.",
      focus: "Discours indirect au travail"
    },
    {
      id: "de-b1-translation-pharmacy",
      language: "de",
      level: "B1",
      type: "translation",
      prompt: "Traduisez : J'ai besoin de quelque chose contre le mal de tête.",
      answer: "Ich brauche etwas gegen Kopfschmerzen.",
      acceptedAnswers: ["Ich benötige etwas gegen Kopfschmerzen."],
      explanation: "La préposition gegen s'emploie pour demander un remède contre un symptôme.",
      hint: "Utilisez etwas gegen suivi du symptôme.",
      focus: "Demande à la pharmacie"
    }
  ],
  es: [
    {
      id: "es-a1-mcq-gender",
      language: "es",
      level: "A1",
      type: "multiple-choice",
      prompt: "Complétez : ___ casa es grande.",
      choices: ["El", "La", "Los", "Un"],
      answer: "La",
      explanation: "Casa est un nom féminin singulier ; l'article défini est la.",
      hint: "Casa se termine par -a et est féminin.",
      focus: "Genre et articles"
    },
    {
      id: "es-a1-gap-present",
      language: "es",
      level: "A1",
      type: "fill-gap",
      prompt: "Complétez : Nosotros ___ español. (hablar)",
      answer: "hablamos",
      explanation: "Au présent, hablar se conjugue « nosotros hablamos ».",
      hint: "Pour nosotros, remplacez -ar par -amos.",
      focus: "Présent des verbes en -ar"
    },
    {
      id: "es-a2-translation-location",
      language: "es",
      level: "A2",
      type: "translation",
      prompt: "Traduisez : La gare est près de l'hôtel.",
      answer: "La estación está cerca del hotel.",
      explanation: "Une localisation s'exprime avec estar ; de + el se contracte en del.",
      hint: "Utilisez estar et cerca de.",
      focus: "Localisation avec estar"
    },
    {
      id: "es-a2-mcq-object",
      language: "es",
      level: "A2",
      type: "multiple-choice",
      prompt: "Remplacez el libro : Compro el libro.",
      choices: ["Lo compro.", "Le compro.", "La compro.", "Los compro."],
      answer: "Lo compro.",
      explanation: "El libro est un complément direct masculin singulier, remplacé par lo avant le verbe.",
      hint: "Cherchez le pronom masculin singulier de complément direct.",
      focus: "Pronoms compléments directs"
    },
    {
      id: "es-b1-gap-imperfect",
      language: "es",
      level: "B1",
      type: "fill-gap",
      prompt: "Complétez pour une habitude passée : De niño, yo ___ al fútbol cada día. (jugar)",
      answer: "jugaba",
      explanation: "Une habitude passée se décrit à l'imparfait : yo jugaba.",
      hint: "La présence de cada día indique une habitude.",
      focus: "Imparfait de l'indicatif"
    },
    {
      id: "es-b1-translation-duration",
      language: "es",
      level: "B1",
      type: "translation",
      prompt: "Traduisez : J'apprends l'espagnol depuis deux ans.",
      answer: "Estudio español desde hace dos años.",
      acceptedAnswers: ["Aprendo español desde hace dos años.", "Llevo dos años estudiando español."],
      explanation: "Desde hace + durée exprime une action commencée dans le passé et toujours en cours.",
      hint: "Utilisez desde hace suivi de la durée.",
      focus: "Expression de la durée"
    },
    {
      id: "es-b2-mcq-subjunctive",
      language: "es",
      level: "B2",
      type: "multiple-choice",
      prompt: "Complétez : Busco a alguien que ___ ayudarme.",
      choices: ["puede", "pueda", "podrá", "pudo"],
      answer: "pueda",
      explanation: "L'antécédent recherché est indéfini ou non identifié, donc la relative prend le subjonctif.",
      hint: "La personne n'est pas encore identifiée.",
      focus: "Subjonctif dans les relatives"
    },
    {
      id: "es-b2-gap-pluperfect",
      language: "es",
      level: "B2",
      type: "fill-gap",
      prompt: "Complétez : Cuando llegué, ellos ya ___. (salir)",
      answer: "habían salido",
      explanation: "L'action de partir est antérieure à une autre action passée : on emploie le plus-que-parfait.",
      hint: "Utilisez haber à l'imparfait suivi du participe de salir.",
      focus: "Plus-que-parfait"
    },
    {
      id: "es-c1-translation-concession",
      language: "es",
      level: "C1",
      type: "translation",
      prompt: "Traduisez : Aussi convaincant que cela puisse paraître, il faut vérifier les données.",
      answer: "Por convincente que parezca, hay que comprobar los datos.",
      acceptedAnswers: ["Por muy convincente que parezca, hay que comprobar los datos."],
      explanation: "La tournure concessive « por + adjectif + que » appelle le subjonctif.",
      hint: "Commencez par Por convincente que et utilisez parecer au subjonctif.",
      focus: "Concession au subjonctif"
    },
    {
      id: "es-a1-mcq-hotel-room",
      language: "es",
      level: "A1",
      type: "multiple-choice",
      prompt: "Complétez à l'hôtel : Tengo una ___ a nombre de García.",
      choices: ["reserva", "maleta", "llave", "cuenta"],
      answer: "reserva",
      explanation: "Tener una reserva a nombre de alguien signifie avoir une réservation au nom de cette personne.",
      hint: "Le mot recherché correspond à « réservation ».",
      focus: "Arrivée à l'hôtel"
    },
    {
      id: "es-a2-gap-market-quantity",
      language: "es",
      level: "A2",
      type: "fill-gap",
      prompt: "Complétez : Quisiera medio kilo ___ tomates, por favor.",
      answer: "de",
      explanation: "En espagnol, une quantité est reliée au produit par la préposition de.",
      hint: "Utilisez la même préposition que dans « un vaso de agua ».",
      focus: "Quantités au marché"
    },
    {
      id: "es-b1-translation-work-schedule",
      language: "es",
      level: "B1",
      type: "translation",
      prompt: "Traduisez : Nous devons terminer cette tâche avant jeudi.",
      answer: "Tenemos que terminar esta tarea antes del jueves.",
      acceptedAnswers: ["Debemos terminar esta tarea antes del jueves."],
      explanation: "Tener que ou deber exprime l'obligation ; antes de devient antes del devant el jueves.",
      hint: "Utilisez tener que ou deber, puis antes del jueves.",
      focus: "Obligation et échéance au travail"
    },
    {
      id: "es-b2-mcq-flight-counterfactual",
      language: "es",
      level: "B2",
      type: "multiple-choice",
      prompt: "Complétez : Si hubiéramos salido antes, no ___ el vuelo.",
      choices: ["perderíamos", "habríamos perdido", "perdimos", "hubiéramos perdido"],
      answer: "habríamos perdido",
      explanation: "Une conséquence passée irréelle se forme au conditionnel passé : habríamos + participe.",
      hint: "La proposition en si est au plus-que-parfait du subjonctif.",
      focus: "Hypothèse passée en voyage"
    },
    {
      id: "es-c1-gap-work-concession",
      language: "es",
      level: "C1",
      type: "fill-gap",
      prompt: "Complétez : Por mucho que lo ___, no podremos entregar el informe hoy. (intentar)",
      answer: "intentemos",
      explanation: "La structure concessive por mucho que appelle ici le subjonctif présent.",
      hint: "Conjuguez intentar au présent du subjonctif avec nosotros.",
      focus: "Concession au travail"
    },
    {
      id: "es-b1-translation-doctor",
      language: "es",
      level: "B1",
      type: "translation",
      prompt: "Traduisez : Depuis hier, j'ai mal à la gorge.",
      answer: "Me duele la garganta desde ayer.",
      acceptedAnswers: ["Desde ayer me duele la garganta."],
      explanation: "Doler se construit avec un pronom indirect ; la garganta, singulier, impose duele.",
      hint: "Utilisez me duele et desde ayer.",
      focus: "Symptômes du quotidien"
    }
  ]
};

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  ...DIAGNOSTIC_BY_LANGUAGE.en,
  ...DIAGNOSTIC_BY_LANGUAGE.de,
  ...DIAGNOSTIC_BY_LANGUAGE.es
];

export const EXERCISES: Exercise[] = [
  ...EXERCISES_BY_LANGUAGE.en,
  ...EXERCISES_BY_LANGUAGE.de,
  ...EXERCISES_BY_LANGUAGE.es,
  ...SPANISH_A1_EXERCISES,
  ...ENGLISH_BANK
];

export function getDiagnosticQuestions(language: LanguageCode): DiagnosticQuestion[] {
  return DIAGNOSTIC_QUESTIONS.filter((question) => question.language === language);
}

export function getExercises(language: LanguageCode, level?: CefrLevel): Exercise[] {
  return EXERCISES.filter(
    (exercise) => exercise.language === language && (!level || exercise.level === level)
  );
}
