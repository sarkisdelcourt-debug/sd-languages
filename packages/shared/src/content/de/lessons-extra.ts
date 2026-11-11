import { matchPairsAnswer } from "../../learning.js";
import type { HandwrittenExercise } from "../types.js";

/**
 * Exercices rédigés pour les quatre leçons allemandes ajoutées le 11/11/2026 (chemin en ville, rendez-vous
 * chez le coiffeur ou le dentiste, donner son avis, réclamer poliment). RÈGLE D'OR : un `id` publié ne change jamais.
 */
const pairs = (items: Array<[string, string]>) => items.map(([target, native]) => ({ target, native }));
const LISTEN_HINT = "Réécoutez autant de fois que nécessaire, puis écrivez les mots dans l'ordre entendu.";

const directions = pairs([["links", "à gauche"], ["rechts", "à droite"], ["geradeaus", "tout droit"], ["die Ampel", "le feu"]]);
const opinions = pairs([["die Meinung", "l'avis"], ["zustimmen", "approuver"], ["widersprechen", "contredire"], ["einverstanden", "d'accord"]]);

const REFUND_ANSWERS = ["Ich möchte", "Ich möchte gern", "Ich möchte gerne", "Ich hätte gern", "Ich hätte gerne"]
  .flatMap((opening) => ["Erstattung", "Rückerstattung"].flatMap((noun) => ["weil", "da"].flatMap((conjunction) =>
    ["defekt", "kaputt"].map((adjective) => `${opening} eine ${noun}, ${conjunction} das Gerät ${adjective} ist.`))));

export const DE_LESSON_EXERCISES: HandwrittenExercise[] = [
  // --- A1 · Demander son chemin en ville ------------------------------------------------------
  {
    id: "de-le-a1-way-pairs", skillTags: ["travel-vocabulary"], language: "de", level: "A1", topic: "travel", type: "match-pairs",
    prompt: "Associez chaque mot à sa traduction.",
    pairs: directions, answer: matchPairsAnswer(directions),
    explanation: "Quatre repères pour comprendre un itinéraire : links, rechts, geradeaus (en un seul mot) et die Ampel (féminin).",
    hint: "Geradeaus se dit comme « droit devant ».", focus: "Indications de direction"
  },
  {
    id: "de-le-a1-way-listen", skillTags: ["travel-vocabulary", "listening"], language: "de", level: "A1", topic: "travel", type: "listening",
    prompt: "Écoutez puis écrivez la phrase.",
    audioText: "Gehen Sie geradeaus und dann links.", answer: "Gehen Sie geradeaus und dann links.", acceptedAnswers: ["Gehen Sie gerade aus und dann links."],
    explanation: "« Allez tout droit, puis à gauche. » — à la forme de politesse, le verbe vient en premier : Gehen Sie…",
    hint: LISTEN_HINT, focus: "Comprendre un itinéraire"
  },
  {
    id: "de-le-a1-way-mcq-zum", skillTags: ["dative", "articles-gender"], language: "de", level: "A1", topic: "travel", type: "multiple-choice",
    prompt: "Complétez : Wie komme ich ___ Bahnhof, bitte?",
    choices: ["zum", "zur", "zu", "zun"], answer: "zum",
    explanation: "« zu » est suivi du datif et se contracte avec l'article : zu + dem = zum (masculin et neutre), zu + der = zur (féminin). Der Bahnhof est masculin : zum Bahnhof.",
    hint: "Der Bahnhof est masculin.", focus: "Aller à un lieu"
  },
  {
    id: "de-le-a1-way-gap-den", skillTags: ["accusative", "articles-gender"], language: "de", level: "A1", topic: "travel", type: "fill-gap",
    prompt: "Complétez avec l'article défini : Entschuldigung, ich suche ___ Bahnhof. (der Bahnhof)",
    answer: "den",
    explanation: "« suchen » est suivi de l'accusatif. Seul le masculin change : der Bahnhof devient den Bahnhof.",
    hint: "Masculin à l'accusatif.", focus: "Chercher un lieu"
  },
  {
    id: "de-le-a1-way-translation", skillTags: ["travel-vocabulary", "sentence-building"], language: "de", level: "A1", topic: "travel", type: "translation",
    prompt: "Traduisez : La pharmacie est à droite.",
    answer: "Die Apotheke ist rechts.",
    acceptedAnswers: ["Die Apotheke ist auf der rechten Seite.", "Die Apotheke ist da rechts.", "Die Apotheke ist dort rechts.", "Rechts ist die Apotheke.", "Die Apotheke liegt rechts.", "Die Apotheke befindet sich rechts.", "Die Apotheke liegt auf der rechten Seite.", "Die Apotheke befindet sich auf der rechten Seite."],
    explanation: "Die Apotheke est féminin. Rechts, seul, suffit pour dire « à droite » ; on peut aussi dire auf der rechten Seite.",
    hint: "Sujet, ist, puis l'adverbe de direction.", focus: "Situer un lieu"
  },

  // --- A2 · Rendez-vous chez le coiffeur ou le dentiste ---------------------------------------
  {
    id: "de-le-a2-appt-listen", skillTags: ["everyday-vocabulary", "listening"], language: "de", level: "A2", topic: "everyday", type: "listening",
    prompt: "Écoutez puis écrivez la phrase.",
    audioText: "Haben Sie am Freitag noch einen Termin frei?", answer: "Haben Sie am Freitag noch einen Termin frei?",
    explanation: "« Avez-vous encore un rendez-vous de libre vendredi ? » — la question commence par le verbe ; der Termin est à l'accusatif : einen Termin.",
    hint: LISTEN_HINT, focus: "Demander un créneau"
  },
  {
    id: "de-le-a2-appt-gap-beim", skillTags: ["dative", "articles-gender"], language: "de", level: "A2", topic: "everyday", type: "fill-gap",
    prompt: "Complétez : Ich habe morgen um zehn Uhr einen Termin ___ Zahnarzt. (chez le dentiste)",
    answer: "beim", acceptedAnswers: ["bei dem"],
    explanation: "« bei » est suivi du datif : bei + dem = beim. On dit beim Zahnarzt, beim Friseur pour « chez ». Avec un mouvement, on dit zum : Ich gehe zum Zahnarzt.",
    hint: "bei + dem se contracte.", focus: "Chez le dentiste ou le coiffeur"
  },
  {
    id: "de-le-a2-appt-translation", skillTags: ["everyday-vocabulary", "modals", "sentence-building"], language: "de", level: "A2", topic: "everyday", type: "translation",
    prompt: "Traduisez : Je voudrais me faire couper les cheveux.",
    answer: "Ich möchte mir die Haare schneiden lassen.",
    acceptedAnswers: ["Ich möchte die Haare schneiden lassen.", "Ich würde mir gern die Haare schneiden lassen.", "Ich möchte mir gern die Haare schneiden lassen.", "Ich würde mir gerne die Haare schneiden lassen.", "Ich möchte mir gerne die Haare schneiden lassen.", "Ich würde gern die Haare schneiden lassen.", "Ich möchte mir das Haar schneiden lassen."],
    explanation: "« lassen » + infinitif en fin de phrase : die Haare schneiden lassen. Die Haare est un pluriel ; mir (datif) précise que ce sont mes cheveux.",
    hint: "L'infinitif et lassen se placent à la fin.", focus: "Chez le coiffeur"
  },
  {
    id: "de-le-a2-appt-mcq-pain", skillTags: ["health-vocabulary", "present-tense"], language: "de", level: "A2", topic: "everyday", type: "multiple-choice",
    prompt: "À la réception du cabinet dentaire, vous dites que vous avez mal aux dents depuis hier. Quelle phrase choisissez-vous?",
    choices: ["Ich habe seit gestern Zahnschmerzen.", "Ich bin seit gestern Zahnschmerzen.", "Ich habe seit gestern Zahnarzt.", "Ich tue seit gestern Zahnschmerzen."],
    answer: "Ich habe seit gestern Zahnschmerzen.",
    explanation: "En allemand, on « a » des douleurs : Ich habe Zahnschmerzen. Seit gestern exprime la durée jusqu'à maintenant, avec un verbe au présent.",
    hint: "On « a » mal aux dents.", focus: "Décrire une douleur"
  },

  // --- B1 · Donner son avis, approuver ou nuancer ---------------------------------------------
  {
    id: "de-le-b1-opinion-pairs", skillTags: ["everyday-vocabulary"], language: "de", level: "B1", topic: "everyday", type: "match-pairs",
    prompt: "Associez chaque mot à sa traduction.",
    pairs: opinions, answer: matchPairsAnswer(opinions),
    explanation: "Zustimmen (séparable, avec le datif) = approuver ; widersprechen (datif aussi) = contredire ; einverstanden sein = être d'accord.",
    hint: "Widersprechen contient « sprechen » : parler contre.", focus: "Exprimer accord et désaccord"
  },
  {
    id: "de-le-b1-opinion-dass", skillTags: ["subordinate-clauses", "sentence-building"], language: "de", level: "B1", topic: "everyday", type: "word-bank",
    prompt: "Construisez : « Je trouve que c'est une bonne idée. »",
    tiles: ["Ich", "finde", "dass", "das", "eine", "gute", "Idee", "ist", "ein", "sei"],
    answer: "Ich finde, dass das eine gute Idee ist.", acceptedAnswers: ["Ich finde, das ist eine gute Idee.", "Ich finde das eine gute Idee.", "Das finde ich eine gute Idee."],
    explanation: "Après dass, le verbe conjugué part en fin de proposition. Sans dass, l'ordre est celui d'une principale : Ich finde, das ist eine gute Idee.",
    hint: "Avec dass, le verbe ist termine la phrase.", focus: "Donner son avis"
  },
  {
    id: "de-le-b1-opinion-mcq-agree", skillTags: ["everyday-vocabulary", "possessives"], language: "de", level: "B1", topic: "everyday", type: "multiple-choice",
    prompt: "Votre interlocuteur vient d'exprimer une opinion et vous êtes tout à fait d'accord. Que lui répondez-vous?",
    choices: ["Da bin ich ganz Ihrer Meinung.", "Da bin ich ganz anderer Meinung.", "Das ist mir völlig egal.", "Das sehe ich komplett anders."],
    answer: "Da bin ich ganz Ihrer Meinung.",
    explanation: "Ihrer Meinung sein = partager votre avis (génitif féminin). Anderer Meinung sein = être d'un autre avis.",
    hint: "Une seule réponse approuve votre interlocuteur.", focus: "Approuver"
  },
  {
    id: "de-le-b1-opinion-gap-zu", skillTags: ["separable-verbs", "dative"], language: "de", level: "B1", topic: "everyday", type: "fill-gap",
    prompt: "Complétez : Ich stimme Ihnen voll und ganz ___. (je suis tout à fait d'accord avec vous)",
    answer: "zu",
    explanation: "« zustimmen » est séparable : à la principale, la particule zu part en fin de phrase. Il se construit avec le datif : Ich stimme Ihnen zu.",
    hint: "La particule séparable se place à la fin.", focus: "Approuver"
  },
  {
    id: "de-le-b1-opinion-translation", skillTags: ["everyday-vocabulary", "sentence-building"], language: "de", level: "B1", topic: "everyday", type: "translation",
    prompt: "Traduisez : À mon avis, ce n'est pas une bonne solution.",
    answer: "Meiner Meinung nach ist das keine gute Lösung.",
    acceptedAnswers: ["Meiner Meinung nach ist es keine gute Lösung.", "Meiner Ansicht nach ist das keine gute Lösung.", "Meiner Ansicht nach ist es keine gute Lösung.", "Ich finde, das ist keine gute Lösung.", "Ich finde, dass das keine gute Lösung ist.", "Das ist meiner Meinung nach keine gute Lösung.", "Es ist meiner Meinung nach keine gute Lösung.", "Meiner Meinung nach ist dies keine gute Lösung.", "Meines Erachtens ist das keine gute Lösung.", "Meines Erachtens ist es keine gute Lösung."],
    explanation: "« Meiner Meinung nach » : nach est ici placé après le datif féminin. Die Lösung est un nom féminin : keine gute Lösung.",
    hint: "Meiner Meinung nach occupe la première place, le verbe vient ensuite.", focus: "Donner son avis"
  },
  {
    id: "de-le-b1-opinion-listen", skillTags: ["everyday-vocabulary", "listening"], language: "de", level: "B1", topic: "everyday", type: "listening",
    prompt: "Écoutez puis écrivez la phrase.",
    audioText: "Da sehe ich das ein bisschen anders.", answer: "Da sehe ich das ein bisschen anders.",
    explanation: "« Là, je vois cela un peu différemment. » — formule polie pour nuancer sans dire « non » ; ein bisschen = un peu.",
    hint: LISTEN_HINT, focus: "Nuancer un désaccord"
  },

  // --- B1 · Réclamer poliment et obtenir une solution -----------------------------------------
  {
    id: "de-le-b1-complaint-gap-ueber", skillTags: ["accusative", "everyday-vocabulary"], language: "de", level: "B1", topic: "everyday", type: "fill-gap",
    prompt: "Complétez : Ich möchte mich ___ den Lärm beschweren. (me plaindre du bruit)",
    answer: "über", acceptedAnswers: ["ueber"],
    explanation: "« sich beschweren über » est suivi de l'accusatif : über den Lärm. (À ne pas confondre avec bei : on se plaint auprès de quelqu'un, bei der Rezeption.)",
    hint: "Se plaindre « de quelque chose » : über + accusatif.", focus: "Exprimer une plainte"
  },
  {
    id: "de-le-b1-complaint-konj", skillTags: ["konjunktiv-2", "sentence-building"], language: "de", level: "B1", topic: "everyday", type: "word-bank",
    prompt: "Construisez : « Pourriez-vous me donner une autre chambre, s'il vous plaît ? »",
    tiles: ["Könnten", "Sie", "mir", "bitte", "ein", "anderes", "Zimmer", "geben", "Könnte", "andere", "gibt"],
    answer: "Könnten Sie mir bitte ein anderes Zimmer geben?", acceptedAnswers: ["Könnten Sie mir ein anderes Zimmer geben, bitte?", "Bitte könnten Sie mir ein anderes Zimmer geben?", "Könnten Sie mir ein anderes Zimmer bitte geben?"],
    explanation: "Könnten Sie…? (Konjunktiv II) adoucit la demande ; l'infinitif geben se place à la fin. Das Zimmer est neutre : ein anderes Zimmer.",
    hint: "Le verbe modal en tête, l'infinitif en dernier.", focus: "Demander une solution"
  },
  {
    id: "de-le-b1-complaint-mcq-cold", skillTags: ["konjunktiv-2", "everyday-vocabulary"], language: "de", level: "B1", topic: "everyday", type: "multiple-choice",
    prompt: "Au restaurant, votre plat est arrivé froid. Quelle réclamation est à la fois claire et polie?",
    choices: [
      "Entschuldigung, mein Essen ist leider kalt. Könnten Sie es bitte aufwärmen?",
      "Das Essen ist kalt. Machen Sie es sofort warm!",
      "Ihr Restaurant ist wirklich schlecht.",
      "Ich warte, bis das Essen noch kälter ist."
    ],
    answer: "Entschuldigung, mein Essen ist leider kalt. Könnten Sie es bitte aufwärmen?",
    explanation: "Une bonne réclamation décrit le problème (kalt), l'adoucit (leider, Entschuldigung) et demande une solution avec Könnten Sie… bitte?",
    hint: "Cherchez les mots d'adoucissement et la demande d'une solution.", focus: "Réclamer poliment"
  },
  {
    id: "de-le-b1-complaint-translation", skillTags: ["subordinate-clauses", "everyday-vocabulary"], language: "de", level: "B1", topic: "everyday", type: "translation",
    prompt: "Traduisez : Je voudrais un remboursement, parce que l'appareil est défectueux.",
    answer: "Ich möchte eine Erstattung, weil das Gerät defekt ist.",
    acceptedAnswers: [...REFUND_ANSWERS, "Ich würde gern eine Rückerstattung bekommen, weil das Gerät defekt ist.", "Ich würde gern eine Erstattung bekommen, weil das Gerät defekt ist."],
    explanation: "Après weil (ou da), le verbe conjugué part en fin de proposition : …, weil das Gerät defekt ist. Die Erstattung (ou Rückerstattung) = le remboursement ; das Gerät est neutre.",
    hint: "Après weil, le verbe ist est le dernier mot.", focus: "Obtenir un remboursement"
  },
  {
    id: "de-le-b1-complaint-listen", skillTags: ["everyday-vocabulary", "listening"], language: "de", level: "B1", topic: "everyday", type: "listening",
    prompt: "Écoutez puis écrivez la phrase.",
    audioText: "Ich bin mit dem Service leider nicht zufrieden.", answer: "Ich bin mit dem Service leider nicht zufrieden.",
    explanation: "« Je ne suis malheureusement pas satisfait du service. » — mit est suivi du datif : mit dem Service ; zufrieden sein mit = être satisfait de.",
    hint: LISTEN_HINT, focus: "Exprimer son insatisfaction"
  }
];
