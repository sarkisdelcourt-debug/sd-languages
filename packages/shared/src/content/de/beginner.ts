import { matchPairsAnswer } from "../../learning.js";
import type { HandwrittenExercise } from "../types.js";

/**
 * Allemand A1 rédigé (22/10/2026) : la banque allemande commençait à l'A2, les trois leçons A1
 * n'avaient donc que trois exercices à leur niveau. Thèmes : faire ses courses, se présenter à l'hôtel,
 * décrire son quotidien. RÈGLE D'OR : un `id` publié ne change jamais.
 */
const pairs = (items: Array<[string, string]>) => items.map(([target, native]) => ({ target, native }));
const LISTEN_HINT = "Réécoutez autant de fois que nécessaire, puis écrivez les mots dans l'ordre entendu.";

const shopping = pairs([["das Brot", "le pain"], ["das Wasser", "l'eau"], ["der Käse", "le fromage"], ["der Apfel", "la pomme"]]);
const hotel = pairs([["das Zimmer", "la chambre"], ["der Schlüssel", "la clé"], ["das Frühstück", "le petit-déjeuner"], ["die Nacht", "la nuit"]]);
const daily = pairs([["die Familie", "la famille"], ["die Arbeit", "le travail"], ["das Haus", "la maison"], ["der Freund", "l'ami"]]);

export const GERMAN_BEGINNER_EXERCISES: HandwrittenExercise[] = [
  // --- A1 · Faire des achats ---------------------------------------------------------------
  {
    id: "de-hw-a1-shop-pairs", skillTags: ["everyday-vocabulary"], language: "de", level: "A1", topic: "everyday", type: "match-pairs",
    prompt: "Associez chaque mot à sa traduction.",
    pairs: shopping, answer: matchPairsAnswer(shopping),
    explanation: "Retenez le nom avec son article : das Brot, das Wasser, der Käse, der Apfel.",
    hint: "Commencez par Wasser et Apfel, proches de l'anglais.", focus: "Faire des achats"
  },
  {
    id: "de-hw-a1-shop-build", skillTags: ["verb-second", "sentence-building"], language: "de", level: "A1", topic: "everyday", type: "word-bank",
    prompt: "Construisez : « Je voudrais un pain, s'il vous plaît. »",
    tiles: ["Ich", "möchte", "ein", "Brot", "bitte", "will", "das", "mag"],
    answer: "Ich möchte ein Brot, bitte.", acceptedAnswers: ["Ich möchte ein Brot bitte."],
    explanation: "Ich möchte… est la formule polie pour demander ; le verbe conjugué reste en deuxième position.",
    hint: "Sujet, puis möchte, puis l'article ein.", focus: "Demander un produit"
  },
  {
    id: "de-hw-a1-shop-listen", skillTags: ["everyday-vocabulary", "listening"], language: "de", level: "A1", topic: "everyday", type: "listening",
    prompt: "Écoutez puis écrivez la phrase.",
    audioText: "Das kostet zwei Euro.", answer: "Das kostet zwei Euro.",
    explanation: "« Cela coûte deux euros. » — kosten = coûter ; Euro reste au singulier après un nombre.",
    hint: LISTEN_HINT, focus: "Comprendre un prix"
  },
  {
    id: "de-hw-a1-shop-mcq-price", skillTags: ["everyday-vocabulary"], language: "de", level: "A1", topic: "everyday", type: "multiple-choice",
    prompt: "Vous voulez savoir combien coûte le fromage. Que demandez-vous ?",
    choices: ["Was kostet der Käse?", "Wo kostet der Käse?", "Wer kostet der Käse?", "Wann kostet der Käse?"],
    answer: "Was kostet der Käse?",
    explanation: "Was kostet…? = combien coûte… ? (littéralement « que coûte… ? »). Der Käse est masculin.",
    hint: "On demande « quoi » pour le prix.", focus: "Demander un prix"
  },
  {
    id: "de-hw-a1-shop-gap-nehmen", skillTags: ["present-tense"], language: "de", level: "A1", topic: "everyday", type: "fill-gap",
    prompt: "Complétez : Ich ___ das Brot. (nehmen — je prends)",
    answer: "nehme",
    explanation: "Avec ich, le verbe prend -e : ich nehme. (Attention : du nimmst, er nimmt.)",
    hint: "Ich + radical + -e.", focus: "Choisir un produit"
  },
  {
    id: "de-hw-a1-shop-translation", skillTags: ["everyday-vocabulary", "sentence-building"], language: "de", level: "A1", topic: "everyday", type: "translation",
    prompt: "Traduisez : Je voudrais de l'eau, s'il vous plaît.",
    answer: "Ich möchte Wasser, bitte.", acceptedAnswers: ["Ich möchte Wasser bitte.", "Ich möchte ein Wasser, bitte.", "Ich hätte gern Wasser, bitte."],
    explanation: "Pour une quantité indéfinie, l'allemand n'a pas d'article : Wasser.",
    hint: "Pas d'article devant Wasser.", focus: "Demander un produit"
  },

  // --- A1 · S'enregistrer à l'hôtel ----------------------------------------------------------
  {
    id: "de-hw-a1-hotel-pairs", skillTags: ["travel-vocabulary"], language: "de", level: "A1", topic: "travel", type: "match-pairs",
    prompt: "Associez chaque mot à sa traduction.",
    pairs: hotel, answer: matchPairsAnswer(hotel),
    explanation: "Quatre mots qui reviennent à chaque arrivée : das Zimmer, der Schlüssel, das Frühstück, die Nacht.",
    hint: "Das Zimmer ressemble à l'anglais « room ».", focus: "À l'hôtel"
  },
  {
    id: "de-hw-a1-hotel-build", skillTags: ["possessives", "sentence-building"], language: "de", level: "A1", topic: "travel", type: "word-bank",
    prompt: "Construisez : « Voici votre clé. »",
    tiles: ["Hier", "ist", "Ihr", "Schlüssel", "mein", "sind", "dein"],
    answer: "Hier ist Ihr Schlüssel.",
    explanation: "Ihr (avec majuscule) est le possessif de politesse : votre.",
    hint: "Hier ist… introduit ce que l'on montre.", focus: "Remettre une clé"
  },
  {
    id: "de-hw-a1-hotel-listen", skillTags: ["travel-vocabulary", "listening"], language: "de", level: "A1", topic: "travel", type: "listening",
    prompt: "Écoutez puis écrivez la phrase.",
    audioText: "Ich habe eine Reservierung.", answer: "Ich habe eine Reservierung.",
    explanation: "« J'ai une réservation. » — die Reservierung est féminin, d'où eine.",
    hint: LISTEN_HINT, focus: "Annoncer sa réservation"
  },
  {
    id: "de-hw-a1-hotel-mcq-name", skillTags: ["possessives"], language: "de", level: "A1", topic: "travel", type: "multiple-choice",
    prompt: "La réceptionniste demande votre nom. Quelle question entendez-vous ?",
    choices: ["Wie ist Ihr Name?", "Wo ist Ihr Name?", "Was ist Ihr Name?", "Wer ist Ihr Name?"],
    answer: "Wie ist Ihr Name?",
    explanation: "Wie ist Ihr Name? = quel est votre nom ? (littéralement « comment est votre nom ? »).",
    hint: "On demande « comment » pour un nom.", focus: "Donner son nom"
  },
  {
    id: "de-hw-a1-hotel-translation", skillTags: ["travel-vocabulary", "sentence-building"], language: "de", level: "A1", topic: "travel", type: "translation",
    prompt: "Traduisez : J'ai une chambre pour deux nuits.",
    answer: "Ich habe ein Zimmer für zwei Nächte.",
    explanation: "Das Zimmer est neutre, d'où ein ; die Nacht fait au pluriel Nächte (avec tréma).",
    hint: "Das Zimmer → ein Zimmer.", focus: "Réserver une chambre"
  },

  // --- A1 · Décrire son quotidien ------------------------------------------------------------
  {
    id: "de-hw-a1-daily-pairs", skillTags: ["everyday-vocabulary"], language: "de", level: "A1", topic: "everyday", type: "match-pairs",
    prompt: "Associez chaque mot à sa traduction.",
    pairs: daily, answer: matchPairsAnswer(daily),
    explanation: "Das Haus et die Familie se retiennent bien avec leur article ; der Freund est masculin.",
    hint: "Das Haus ressemble à l'anglais « house ».", focus: "Parler de soi"
  },
  {
    id: "de-hw-a1-daily-build", skillTags: ["verb-second", "present-tense", "sentence-building"], language: "de", level: "A1", topic: "everyday", type: "word-bank",
    prompt: "Construisez : « Nous habitons à Berlin. »",
    tiles: ["Wir", "wohnen", "in", "Berlin", "wohne", "nach", "wohnt"],
    answer: "Wir wohnen in Berlin.",
    explanation: "Avec wir, le verbe prend -en et reste en deuxième position.",
    hint: "Sujet, verbe, lieu.", focus: "Dire où l'on habite"
  },
  {
    id: "de-hw-a1-daily-listen", skillTags: ["present-tense", "listening"], language: "de", level: "A1", topic: "everyday", type: "listening",
    prompt: "Écoutez puis écrivez la phrase.",
    audioText: "Ich arbeite in Hamburg.", answer: "Ich arbeite in Hamburg.",
    explanation: "« Je travaille à Hambourg. » — arbeiten garde un -e- devant la terminaison : ich arbeite.",
    hint: LISTEN_HINT, focus: "Parler de son travail"
  },
  {
    id: "de-hw-a1-daily-gap-haben", skillTags: ["present-tense"], language: "de", level: "A1", topic: "everyday", type: "fill-gap",
    prompt: "Complétez : Er ___ zwei Kinder. (haben)",
    answer: "hat",
    explanation: "Haben est irrégulier à la troisième personne : er hat (et non « er habt »).",
    hint: "Er, sie, es → hat.", focus: "Parler de sa famille"
  },
  {
    id: "de-hw-a1-daily-translation", skillTags: ["present-tense", "sentence-building"], language: "de", level: "A1", topic: "everyday", type: "translation",
    prompt: "Traduisez : Mon ami habite à Munich.",
    answer: "Mein Freund wohnt in München.",
    explanation: "Mein Freund (masculin) + verbe à la 3e personne : wohnt.",
    hint: "Er, sie, es → wohnt.", focus: "Parler de ses proches"
  }
];
