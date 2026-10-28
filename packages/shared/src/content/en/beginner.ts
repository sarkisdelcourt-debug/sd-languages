import { matchPairsAnswer } from "../../learning.js";
import type { HandwrittenExercise } from "../types.js";

/**
 * Anglais A1–A2 rédigé (22/10/2026) : la banque générée commence à l'A2 (voyage) et au B1, les
 * trois leçons A1 et deux leçons A2 n'avaient donc pas d'exercices à leur niveau exact. Thèmes du
 * quotidien, simples : café, se présenter, famille, comparer, routine et demandes polies.
 * RÈGLE D'OR : un `id` publié ne change jamais.
 */
const pairs = (items: Array<[string, string]>) => items.map(([target, native]) => ({ target, native }));
const LISTEN_HINT = "Réécoutez autant de fois que nécessaire, puis écrivez les mots dans l'ordre entendu.";

const cafe = pairs([["a coffee", "un café"], ["a tea", "un thé"], ["a glass of water", "un verre d'eau"], ["a sandwich", "un sandwich"]]);
const questionWords = pairs([["where", "où"], ["when", "quand"], ["who", "qui"], ["how much", "combien"]]);
const family = pairs([["the brother", "le frère"], ["the sister", "la sœur"], ["the children", "les enfants"], ["the parents", "les parents"]]);
const comparatives = pairs([["cheaper", "moins cher"], ["faster", "plus rapide"], ["better", "meilleur"], ["bigger", "plus grand"]]);

export const BEGINNER_EXERCISES: HandwrittenExercise[] = [
  // --- A1 · Commander simplement au café ---------------------------------------------------
  {
    id: "en-hw-a1-cafe-pairs", skillTags: ["everyday-vocabulary"], language: "en", level: "A1", topic: "everyday", type: "match-pairs",
    prompt: "Associez chaque mot à sa traduction.",
    pairs: cafe, answer: matchPairsAnswer(cafe),
    explanation: "Au café, l'article a accompagne presque toujours ce que l'on commande : a coffee, a tea, a sandwich.",
    hint: "Commencez par les mots qui ressemblent au français.", focus: "Commander au café"
  },
  {
    id: "en-hw-a1-cafe-build", skillTags: ["polite-requests", "sentence-building"], language: "en", level: "A1", topic: "everyday", type: "word-bank",
    prompt: "Construisez : « Je voudrais un café, s'il vous plaît. »",
    tiles: ["I", "would", "like", "a", "coffee", "please", "want", "the"],
    answer: "I would like a coffee, please.", acceptedAnswers: ["I'd like a coffee, please."],
    explanation: "I would like (ou I'd like) est la façon polie de commander ; I want est trop direct.",
    hint: "Commencez par le sujet, puis would like.", focus: "Commander au café"
  },
  {
    id: "en-hw-a1-cafe-listen", skillTags: ["polite-requests", "questions", "listening"], language: "en", level: "A1", topic: "everyday", type: "listening",
    prompt: "Écoutez puis écrivez la question.",
    audioText: "Would you like something to eat?", answer: "Would you like something to eat?",
    explanation: "« Voulez-vous quelque chose à manger ? » — Would you like…? est la question polie du serveur ; something to eat = quelque chose à manger.",
    hint: LISTEN_HINT, focus: "Comprendre une question au café"
  },
  {
    id: "en-hw-a1-cafe-mcq-here", skillTags: ["everyday-vocabulary"], language: "en", level: "A1", topic: "everyday", type: "multiple-choice",
    prompt: "Le serveur demande « For here or to take away? ». Vous restez sur place : que répondez-vous ?",
    choices: ["For here, please.", "To take away, please.", "I stay, please.", "Here I am, please."],
    answer: "For here, please.",
    explanation: "For here = sur place ; to take away (ou to go aux États-Unis) = à emporter.",
    hint: "Sur place se dit avec here.", focus: "Comprendre une question au café"
  },
  {
    id: "en-hw-a1-cafe-gap-have", skillTags: ["polite-requests", "present-simple"], language: "en", level: "A1", topic: "everyday", type: "fill-gap",
    prompt: "Complétez : Can I ___ a tea, please? (avoir)",
    answer: "have",
    explanation: "Can I have…? est une demande simple et polie ; après can, le verbe reste à la base verbale : have.",
    hint: "Le verbe « avoir » à la base verbale.", focus: "Commander au café"
  },
  {
    id: "en-hw-a1-cafe-translation", skillTags: ["polite-requests", "everyday-vocabulary"], language: "en", level: "A1", topic: "everyday", type: "translation",
    prompt: "Traduisez : Un thé et un sandwich, s'il vous plaît.",
    answer: "A tea and a sandwich, please.",
    acceptedAnswers: ["One tea and a sandwich, please.", "A tea and a sandwich please."],
    explanation: "Pour commander, il suffit de nommer ce que l'on veut avec l'article a, puis please.",
    hint: "a tea, a sandwich, please.", focus: "Commander au café"
  },

  // --- A1 · Poser une question simple ------------------------------------------------------
  {
    id: "en-hw-a1-ask-build", skillTags: ["questions", "sentence-building"], language: "en", level: "A1", topic: "everyday", type: "word-bank",
    prompt: "Construisez : « Où est la gare, s'il vous plaît ? »",
    tiles: ["Where", "is", "the", "station", "please", "are", "what"],
    answer: "Where is the station, please?",
    explanation: "Question avec be : le mot interrogatif, puis is, puis le sujet (the station).",
    hint: "Commencez par le mot interrogatif, puis is.", focus: "Poser une question simple"
  },
  {
    id: "en-hw-a1-ask-listen", skillTags: ["questions", "listening"], language: "en", level: "A1", topic: "everyday", type: "listening",
    prompt: "Écoutez puis écrivez la question.",
    audioText: "Where are you from?", answer: "Where are you from?",
    explanation: "« D'où venez-vous ? » — From se place en fin de question ; on répond I'm from + ville ou pays.",
    hint: LISTEN_HINT, focus: "Comprendre une question simple"
  },
  {
    id: "en-hw-a1-ask-gap-am", skillTags: ["present-simple"], language: "en", level: "A1", topic: "everyday", type: "fill-gap",
    prompt: "Complétez : I ___ from France. (be)",
    answer: "am",
    explanation: "Avec I, le verbe be prend la forme am : I am from France, souvent contracté en I'm from France.",
    hint: "I + be → ?", focus: "Dire d'où l'on vient"
  },
  {
    id: "en-hw-a1-ask-translation", skillTags: ["present-simple", "everyday-vocabulary"], language: "en", level: "A1", topic: "everyday", type: "translation",
    prompt: "Traduisez : Je m'appelle Anna et je viens de Paris.",
    answer: "My name is Anna and I am from Paris.",
    acceptedAnswers: [
      "My name is Anna and I'm from Paris.",
      "My name's Anna and I'm from Paris.",
      "I am Anna and I am from Paris.",
      "I'm Anna and I'm from Paris."
    ],
    explanation: "My name is… donne le prénom, I am from… l'origine. Pas de call ici : « je m'appelle » ne se dit pas « I call me ».",
    hint: "My name is…, I am from…", focus: "Se présenter"
  },
  {
    id: "en-hw-a1-ask-pairs", skillTags: ["questions"], language: "en", level: "A1", topic: "everyday", type: "match-pairs",
    prompt: "Associez chaque mot interrogatif à sa traduction.",
    pairs: questionWords, answer: matchPairsAnswer(questionWords),
    explanation: "Le mot interrogatif ouvre la question ; be ou l'auxiliaire vient juste après : Where is…? When do…?",
    hint: "Where ressemble à here : un lieu.", focus: "Poser une question simple"
  },

  // --- A1 · Parler des personnes et des quantités ------------------------------------------
  {
    id: "en-hw-a1-family-pairs", skillTags: ["everyday-vocabulary"], language: "en", level: "A1", topic: "everyday", type: "match-pairs",
    prompt: "Associez chaque mot à sa traduction.",
    pairs: family, answer: matchPairsAnswer(family),
    explanation: "Children est un pluriel irrégulier (child → children) ; parents prend un -s régulier.",
    hint: "Un seul de ces pluriels ne se termine pas par -s.", focus: "Famille et pluriels"
  },
  {
    id: "en-hw-a1-family-build", skillTags: ["present-simple", "sentence-building"], language: "en", level: "A1", topic: "everyday", type: "word-bank",
    prompt: "Construisez : « Elle a deux sœurs et un frère. »",
    tiles: ["She", "has", "two", "sisters", "and", "one", "brother", "have", "a"],
    answer: "She has two sisters and one brother.",
    explanation: "Avec she, have devient has ; le nombre se place avant le nom, qui prend -s au pluriel.",
    hint: "Commencez par le sujet, puis le verbe.", focus: "Dire ce que quelqu'un possède"
  },
  {
    id: "en-hw-a1-family-listen", skillTags: ["present-simple", "listening"], language: "en", level: "A1", topic: "everyday", type: "listening",
    prompt: "Écoutez puis écrivez la phrase.",
    audioText: "We have three children.", answer: "We have three children.",
    explanation: "« Nous avons trois enfants. » — Avec we, le verbe reste have ; children est le pluriel irrégulier de child.",
    hint: LISTEN_HINT, focus: "Famille et pluriels"
  },
  {
    id: "en-hw-a1-family-translation", skillTags: ["present-simple", "everyday-vocabulary"], language: "en", level: "A1", topic: "everyday", type: "translation",
    prompt: "Traduisez : J'ai deux frères et une sœur.",
    answer: "I have two brothers and a sister.",
    acceptedAnswers: [
      "I have two brothers and one sister.",
      "I've got two brothers and a sister.",
      "I have got two brothers and a sister.",
      "I've got two brothers and one sister.",
      "I have got two brothers and one sister."
    ],
    explanation: "I have (ou I've got, courant au Royaume-Uni) + nombre + nom au pluriel : two brothers.",
    hint: "I have two…, a sister.", focus: "Dire ce que quelqu'un possède"
  },

  // --- A2 · Comparer deux options du quotidien ---------------------------------------------
  {
    id: "en-hw-a2-compare-build", skillTags: ["comparatives", "sentence-building"], language: "en", level: "A2", topic: "everyday", type: "word-bank",
    prompt: "Construisez : « Le train est moins cher que l'avion. »",
    tiles: ["The", "train", "is", "cheaper", "than", "the", "plane", "more", "that"],
    answer: "The train is cheaper than the plane.",
    explanation: "Adjectif court : cheaper + than. « Moins cher » se dit cheaper (plus bon marché), le contraire de more expensive.",
    hint: "Commencez par le sujet, puis le verbe.", focus: "Comparer deux options"
  },
  {
    id: "en-hw-a2-compare-listen", skillTags: ["comparatives", "listening"], language: "en", level: "A2", topic: "everyday", type: "listening",
    prompt: "Écoutez puis écrivez la phrase.",
    audioText: "This hotel is better than the other one.", answer: "This hotel is better than the other one.",
    explanation: "« Cet hôtel est meilleur que l'autre. » — Good a un comparatif irrégulier : better ; the other one évite de répéter hotel.",
    hint: LISTEN_HINT, focus: "Comparer deux options"
  },
  {
    id: "en-hw-a2-compare-pairs", skillTags: ["comparatives"], language: "en", level: "A2", topic: "everyday", type: "match-pairs",
    prompt: "Associez chaque comparatif à sa traduction.",
    pairs: comparatives, answer: matchPairsAnswer(comparatives),
    explanation: "Adjectif court : -er (consonne doublée dans bigger) ; good devient better, irrégulier.",
    hint: "Good ne prend pas -er : cherchez sa forme irrégulière.", focus: "Comparer deux options"
  },
  {
    id: "en-hw-a2-compare-translation", skillTags: ["comparatives"], language: "en", level: "A2", topic: "everyday", type: "translation",
    prompt: "Traduisez : Cette chambre est plus grande que l'autre.",
    answer: "This room is bigger than the other one.",
    acceptedAnswers: [
      "This room is larger than the other one.",
      "This room is bigger than the other.",
      "This room is larger than the other.",
      "This bedroom is bigger than the other one."
    ],
    explanation: "Big → bigger (consonne doublée) + than ; the other one reprend room sans le répéter.",
    hint: "bigger than…", focus: "Comparer deux options"
  },

  // --- A2 · Expliquer sa routine et ses besoins --------------------------------------------
  {
    id: "en-hw-a2-routine-gap-usually", skillTags: ["present-simple"], language: "en", level: "A2", topic: "everyday", type: "fill-gap",
    prompt: "Complétez avec l'adverbe de fréquence (d'habitude) : I ___ go to the gym on Mondays.",
    answer: "usually", acceptedAnswers: ["normally", "generally"],
    explanation: "Usually se place avant le verbe principal : I usually go. Après be, il se place après : I am usually late.",
    hint: "D'habitude = usually.", focus: "Adverbes de fréquence"
  },
  {
    id: "en-hw-a2-request-mcq", skillTags: ["polite-requests", "quantifiers"], language: "en", level: "A2", topic: "everyday", type: "multiple-choice",
    prompt: "Vous voulez de l'eau au restaurant. Choisissez la demande polie.",
    choices: ["Could I have some water, please?", "I want water.", "Give me water.", "Water, you give me?"],
    answer: "Could I have some water, please?",
    explanation: "Could I have…, please? est la demande polie standard ; some accompagne un indénombrable comme water.",
    hint: "Commencez par Could I…", focus: "Demander un service"
  },
  {
    id: "en-hw-a2-routine-translation", skillTags: ["present-simple", "everyday-vocabulary"], language: "en", level: "A2", topic: "everyday", type: "translation",
    prompt: "Traduisez : Je me lève d'habitude à sept heures.",
    answer: "I usually get up at seven.",
    acceptedAnswers: [
      "I usually get up at seven o'clock.",
      "I usually get up at 7.",
      "I usually get up at 7 o'clock.",
      "I usually wake up at seven.",
      "I usually wake up at seven o'clock.",
      "I usually wake up at 7.",
      "Usually I get up at seven.",
      "Usually, I get up at seven."
    ],
    explanation: "Se lever se dit get up ; usually se place avant le verbe ; l'heure est introduite par at.",
    hint: "I usually get up at…", focus: "Adverbes de fréquence"
  },

  // --- Révision 4 (28/10/2026) : exercices de format différent pour remplacer les constructions redondantes ---
  {
    id: "en-hw-a1-cafe-gap-like", skillTags: ["polite-requests", "present-simple"], language: "en", level: "A1", topic: "everyday", type: "fill-gap",
    prompt: "Complétez : I would ___ a tea, please. (aimer)",
    answer: "like",
    explanation: "I would like (ou I'd like) est la façon polie de commander ; après would, le verbe reste à la base verbale : like.",
    hint: "Le verbe « aimer » à la base verbale.", focus: "Commander au café"
  },
  {
    id: "en-hw-a1-ask-mcq-where", skillTags: ["questions"], language: "en", level: "A1", topic: "everyday", type: "multiple-choice",
    prompt: "Complétez la question : ___ is the bus stop, please? (où)",
    choices: ["Where", "When", "Who", "How much"],
    answer: "Where",
    explanation: "Where demande un lieu : Where is the bus stop? When = quand, who = qui, how much = combien.",
    hint: "On cherche un lieu.", focus: "Poser une question simple"
  },
  {
    id: "en-hw-a1-family-gap-has", skillTags: ["present-simple"], language: "en", level: "A1", topic: "everyday", type: "fill-gap",
    prompt: "Complétez : My brother ___ three children. (avoir)",
    answer: "has",
    explanation: "Avec he, she ou un nom singulier comme my brother, have devient has.",
    hint: "Un sujet singulier à la troisième personne.", focus: "Dire ce que quelqu'un possède"
  },
  {
    id: "en-hw-a2-compare-mcq-than", skillTags: ["comparatives"], language: "en", level: "A2", topic: "everyday", type: "multiple-choice",
    prompt: "Choisissez la phrase correcte : le train est plus rapide que le bus.",
    choices: ["The train is faster than the bus.", "The train is more fast than the bus.", "The train is fast than the bus.", "The train is faster that the bus."],
    answer: "The train is faster than the bus.",
    explanation: "Un adjectif court prend -er : fast → faster ; la comparaison s'introduit par than, jamais that.",
    hint: "Adjectif court + -er, puis than.", focus: "Comparer deux options"
  }
];
