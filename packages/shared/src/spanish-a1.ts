import { matchPairsAnswer } from "./learning.js";
import type { Exercise, GuidedLessonDefinition } from "./types.js";

/**
 * Tranche verticale espagnol A1 (21/10/2026) : chaque leçon A1 reçoit ses propres exercices, dans
 * des formats variés à la Duolingo (associer, construire, écouter, choisir, compléter, traduire).
 * Les définitions remplacent la révision 1 de ces leçons ; l'ancienne révision reste lisible pour
 * une séance déjà commencée (voir RETIRED_LESSON_REVISIONS dans lessons.ts).
 */
const pairs = (items: Array<[string, string]>) => items.map(([target, native]) => ({ target, native }));

const greetings = pairs([["hola", "bonjour"], ["adiós", "au revoir"], ["gracias", "merci"], ["por favor", "s'il vous plaît"]]);
const family = pairs([["el hermano", "le frère"], ["la hermana", "la sœur"], ["los amigos", "les amis"], ["la familia", "la famille"]]);
const hotel = pairs([["la habitación", "la chambre"], ["la llave", "la clé"], ["el desayuno", "le petit-déjeuner"], ["la noche", "la nuit"]]);

export const SPANISH_A1_EXERCISES: Exercise[] = [
  // Leçon 1 — se présenter
  {
    id: "es-a1-l1-match-greetings", language: "es", level: "A1", type: "match-pairs",
    prompt: "Associez chaque mot à sa traduction.",
    pairs: greetings, answer: matchPairsAnswer(greetings),
    explanation: "Ces quatre formules suffisent pour ouvrir et fermer poliment un échange.",
    hint: "Hola se dit à toute heure de la journée.", focus: "Salutations"
  },
  {
    id: "es-a1-l1-mcq-llamo", language: "es", level: "A1", type: "multiple-choice",
    prompt: "Comment dit-on « Je m'appelle Ana » ?",
    choices: ["Me llamo Ana.", "Me llama Ana.", "Yo llamo Ana.", "Soy llamo Ana."], answer: "Me llamo Ana.",
    explanation: "Llamarse se construit avec un pronom : me llamo, te llamas, se llama.",
    hint: "Comme en français : je m'appelle → me…", focus: "Dire son prénom"
  },
  {
    id: "es-a1-l1-wordbank-origin", language: "es", level: "A1", type: "word-bank",
    prompt: "Construisez : « Je m'appelle Ana et je suis de Madrid. »",
    tiles: ["Me", "llamo", "Ana", "y", "soy", "de", "Madrid", "estoy", "es"],
    answer: "Me llamo Ana y soy de Madrid.",
    explanation: "Soy de + lieu donne l'origine ; y relie les deux informations.",
    hint: "L'origine se dit avec ser : soy de…", focus: "Se présenter"
  },
  {
    id: "es-a1-l1-listen-question", language: "es", level: "A1", type: "listening",
    prompt: "Écoutez puis écrivez la question.",
    audioText: "¿Cómo te llamas?", answer: "¿Cómo te llamas?",
    explanation: "Te llamas tutoie la personne ; en espagnol, ¿ ouvre aussi la question.",
    hint: "Sens : « Comment tu t'appelles ? »", focus: "Demander le prénom"
  },
  {
    id: "es-a1-l1-gap-ser", language: "es", level: "A1", type: "fill-gap",
    prompt: "Complétez : Yo ___ de Francia. (ser)",
    answer: "soy",
    explanation: "Ser à la première personne : soy. Il sert à dire son origine.",
    hint: "Soy, eres, es…", focus: "Ser au présent"
  },
  {
    id: "es-a1-l1-translation-and-you", language: "es", level: "A1", type: "translation",
    prompt: "Traduisez : Je suis de Lyon, et toi ?",
    answer: "Soy de Lyon, ¿y tú?", acceptedAnswers: ["Yo soy de Lyon, ¿y tú?"],
    explanation: "¿Y tú? renvoie la question. Le pronom yo est facultatif : la terminaison suffit.",
    hint: "« Et toi ? » se dit ¿y tú?", focus: "Relancer l'échange"
  },
  // Leçon 2 — présenter son groupe
  {
    id: "es-a1-l2-match-family", language: "es", level: "A1", type: "match-pairs",
    prompt: "Associez chaque mot à sa traduction.",
    pairs: family, answer: matchPairsAnswer(family),
    explanation: "El devant un nom masculin, la devant un nom féminin, los au masculin pluriel.",
    hint: "Hermano / hermana : -o masculin, -a féminin.", focus: "Famille et articles"
  },
  {
    id: "es-a1-l2-wordbank-we-speak", language: "es", level: "A1", type: "word-bank",
    prompt: "Construisez : « Nous parlons espagnol et anglais. »",
    tiles: ["Hablamos", "español", "e", "inglés", "y", "hablan", "Nosotros"],
    answer: "Hablamos español e inglés.", acceptedAnswers: ["Nosotros hablamos español e inglés."],
    explanation: "Avec nosotros, -ar devient -amos. Devant un mot qui commence par le son i, y devient e.",
    hint: "Le sujet nosotros peut être omis ; regardez le mot qui suit « et ».", focus: "Présent en -amos"
  },
  {
    id: "es-a1-l2-listen-sister", language: "es", level: "A1", type: "listening",
    prompt: "Écoutez puis écrivez la phrase.",
    audioText: "Ella es mi hermana.", answer: "Ella es mi hermana.",
    explanation: "Es (ser) présente une personne : ella es… ; mi est invariable devant hermano ou hermana.",
    hint: "Sens : « C'est ma sœur. »", focus: "Présenter quelqu'un"
  },
  {
    id: "es-a1-l2-mcq-ser-plural", language: "es", level: "A1", type: "multiple-choice",
    prompt: "Complétez : Mis amigos ___ simpáticos.",
    choices: ["son", "es", "somos", "están"], answer: "son",
    explanation: "Mis amigos = ellos, donc ser au pluriel : son. Ser décrit un trait durable.",
    hint: "Mis amigos remplace « ils ».", focus: "Ser au pluriel"
  },
  // Leçon 3 — arriver à l'hôtel
  {
    id: "es-a1-l3-match-hotel", language: "es", level: "A1", type: "match-pairs",
    prompt: "Associez chaque mot à sa traduction.",
    pairs: hotel, answer: matchPairsAnswer(hotel),
    explanation: "Le vocabulaire minimal d'une arrivée : la chambre, la clé, le petit-déjeuner, la nuit.",
    hint: "Llave ressemble peu à « clé » : retenez-le avec son article, la llave.", focus: "Vocabulaire de l'hôtel"
  },
  {
    id: "es-a1-l3-wordbank-nights", language: "es", level: "A1", type: "word-bank",
    prompt: "Construisez : « J'ai une réservation pour deux nuits. »",
    tiles: ["Tengo", "una", "reserva", "para", "dos", "noches", "por", "noche", "Tiene"],
    answer: "Tengo una reserva para dos noches.",
    explanation: "Tengo = j'ai ; para + durée prévue ; noche prend -s au pluriel.",
    hint: "Deux nuits : le nom est au pluriel.", focus: "Annoncer sa réservation"
  },
  {
    id: "es-a1-l3-listen-breakfast", language: "es", level: "A1", type: "listening",
    prompt: "Écoutez puis écrivez la question.",
    audioText: "¿A qué hora es el desayuno?", answer: "¿A qué hora es el desayuno?",
    explanation: "¿A qué hora…? demande une heure ; qué porte un accent dans une question.",
    hint: "Sens : « À quelle heure est le petit-déjeuner ? »", focus: "Demander une heure"
  },
  {
    id: "es-a1-l3-gap-number", language: "es", level: "A1", type: "fill-gap",
    prompt: "Complétez : Su habitación es la número ___. (12)",
    answer: "doce",
    explanation: "De 11 à 15 : once, doce, trece, catorce, quince.",
    hint: "Douze commence par d…", focus: "Nombres 11 à 15"
  },
  {
    id: "es-a1-l3-translation-key", language: "es", level: "A1", type: "translation",
    prompt: "Traduisez : La clé, s'il vous plaît.",
    answer: "La llave, por favor.",
    explanation: "Por favor se place en fin de demande, comme « s'il vous plaît ».",
    hint: "Clé = llave (féminin).", focus: "Demander poliment"
  }
];

type LessonRevision = Pick<GuidedLessonDefinition, "id" | "revision" | "estimatedMinutes" | "microCourse" | "exerciseIds">
  & Partial<Pick<GuidedLessonDefinition, "objective" | "focus">>;

export const SPANISH_A1_LESSON_REVISIONS: LessonRevision[] = [
  {
    id: "lesson-es-daily-basics", revision: 2, estimatedMinutes: 10,
    focus: "Saluer, dire son nom et son origine",
    microCourse: {
      title: "Trois phrases pour se présenter",
      introduction: "Saluez, donnez votre prénom avec me llamo, votre origine avec soy de, puis relancez avec ¿y tú?",
      points: [
        "Me llamo… donne votre prénom ; ¿Cómo te llamas? le demande.",
        "Soy de… donne votre origine : c'est le verbe ser.",
        "¿Y tú? renvoie la question à votre voisin."
      ],
      examples: [
        { target: "Hola, me llamo Ana. Soy de Madrid.", translation: "Bonjour, je m'appelle Ana. Je suis de Madrid." },
        { target: "¿Cómo te llamas?", translation: "Comment tu t'appelles ?" }
      ]
    },
    exerciseIds: [
      "es-a1-l1-match-greetings", "es-a1-l1-mcq-llamo", "es-a1-l1-wordbank-origin",
      "es-a1-l1-listen-question", "es-a1-l1-gap-ser", "es-a1-l1-translation-and-you"
    ]
  },
  {
    id: "lesson-es-introduce-a-group", revision: 2, estimatedMinutes: 10,
    microCourse: {
      title: "Accorder puis conjuguer",
      introduction: "L'article suit le genre du nom, et la terminaison du verbe dit qui parle : pas besoin du pronom.",
      points: [
        "El hermano, la hermana, los amigos : l'article s'accorde avec le nom.",
        "Avec nosotros, un verbe en -ar se termine en -amos : hablamos.",
        "Ser au pluriel : somos (nous), son (ils, elles)."
      ],
      examples: [
        { target: "Hablamos español e inglés.", translation: "Nous parlons espagnol et anglais." },
        { target: "Ella es mi hermana.", translation: "C'est ma sœur." }
      ]
    },
    exerciseIds: [
      "es-a1-l2-match-family", "es-a1-mcq-gender", "es-a1-gap-present",
      "es-a1-l2-wordbank-we-speak", "es-a1-l2-listen-sister", "es-a1-l2-mcq-ser-plural"
    ]
  },
  {
    id: "lesson-es-arrive-at-a-hotel", revision: 2, estimatedMinutes: 10,
    microCourse: {
      title: "Une information à la fois",
      introduction: "À la réception : annoncez la réservation, précisez la durée, puis demandez ce dont vous avez besoin.",
      points: [
        "Tengo una reserva a nombre de… annonce la réservation.",
        "Para dos noches précise la durée du séjour.",
        "Por favor termine poliment une demande."
      ],
      examples: [
        { target: "Tengo una reserva para dos noches.", translation: "J'ai une réservation pour deux nuits." },
        { target: "La llave, por favor.", translation: "La clé, s'il vous plaît." }
      ]
    },
    exerciseIds: [
      "es-a1-l3-match-hotel", "es-a1-mcq-hotel-room", "es-a1-l3-wordbank-nights",
      "es-a1-l3-listen-breakfast", "es-a1-l3-gap-number", "es-a1-l3-translation-key"
    ]
  }
];
