import { matchPairsAnswer } from "../../learning.js";
import type { HandwrittenExercise } from "../types.js";

/**
 * Exercices anglais écrits pour les leçons ajoutées en novembre 2026 (lessons-new-en.ts) : louer une
 * voiture, donner son avis, se plaindre poliment, intervenir en congrès. Ils complètent les listes de
 * vocabulaire et les banques de phrases, qui n'avaient pas de texte à trous, de traduction ou de QCM de
 * situation à ces thèmes et à ces niveaux.
 * RÈGLE D'OR : un `id` publié ne change jamais.
 */
const pairs = (items: Array<[string, string]>) => items.map(([target, native]) => ({ target, native }));

const complaintWords = pairs([["it's broken", "c'est cassé"], ["it doesn't work", "ça ne marche pas"], ["a replacement", "un article de remplacement"], ["the manager", "le responsable"]]);

/** Variantes d'une traduction : chaque liste propose les segments interchangeables à une position. */
const combine = (parts: string[][]): string[] => parts.reduce<string[]>((acc, options) => acc.flatMap((head) => options.map((option) => head + option)), [""]);

export const EN_LESSON_EXERCISES: HandwrittenExercise[] = [
  // --- A2 · Louer une voiture et demander un service ---------------------------------------
  {
    id: "en-hw-car-mcq-sat-nav", skillTags: ["polite-requests", "questions"], language: "en", level: "A2", topic: "travel", type: "multiple-choice",
    prompt: "Au comptoir de location, vous voulez demander poliment à l'employé de vous montrer le fonctionnement du GPS. Quelle phrase choisissez-vous ?",
    choices: ["You show me how works the sat nav?", "Could you show me how the sat nav works?", "Could you to show me the sat nav works?", "Could you showing me how the sat nav work?"],
    answer: "Could you show me how the sat nav works?",
    explanation: "Could you est suivi de la base verbale (show), sans to. Après how, l'ordre redevient sujet + verbe : how the sat nav works, sans inversion.",
    hint: "Une demande polie commence par Could you + verbe à la base.", focus: "Demander un service au comptoir"
  },
  {
    id: "en-hw-car-gap-included", skillTags: ["travel-vocabulary", "questions"], language: "en", level: "A2", topic: "travel", type: "fill-gap",
    prompt: "Complétez : Is the insurance ___ in the price of the car hire? (compris)",
    answer: "included",
    explanation: "Être compris dans le prix se dit be included in the price : le participe passé included suit is.",
    hint: "Un participe passé : être ___ dans le prix.", focus: "Louer une voiture : prix et assurance"
  },
  {
    id: "en-hw-car-translation-key", skillTags: ["polite-requests", "travel-vocabulary"], language: "en", level: "A2", topic: "travel", type: "translation",
    prompt: "Traduisez : Pourriez-vous me donner une deuxième clé pour la voiture, s'il vous plaît ?",
    answer: "Could you give me a second key for the car, please?",
    acceptedAnswers: [
      ...combine([["Could you ", "Could you please ", "Can you ", "Can you please "], ["give me "], ["a second ", "another ", "a spare ", "an extra "], ["key for the car", "car key", "key to the car"], [", please?", "?"]]),
      ...combine([["Could I have ", "Could I please have ", "Could I get ", "Can I have ", "Can I get ", "May I have "], ["a second ", "another ", "a spare ", "an extra "], ["key for the car", "car key", "key to the car"], [", please?", "?"]])
    ],
    explanation: "Could you give me… est la demande polie qui s'adresse à l'employé ; une deuxième clé se dit a second key, another key ou a spare key.",
    hint: "Could you + give me + a second key…", focus: "Demander un service au comptoir"
  },

  // --- B1 · Donner son avis et nuancer ------------------------------------------------------
  {
    id: "en-hw-opinion-mcq-nuance", skillTags: ["everyday-vocabulary", "polite-requests"], language: "en", level: "B1", topic: "everyday", type: "multiple-choice",
    prompt: "Un collègue propose une solution. Vous n'êtes pas totalement convaincu et voulez le dire sans froisser. Quelle réponse est la plus nuancée ?",
    choices: ["I disagree completely.", "That is wrong.", "I'm not entirely convinced.", "I am not agree with you."],
    answer: "I'm not entirely convinced.",
    explanation: "not entirely adoucit le désaccord : vous exprimez un doute plutôt qu'un refus. I am not agree est une faute (to agree est un verbe : I don't agree).",
    hint: "Cherchez la formule qui garde la porte ouverte.", focus: "Nuancer son avis"
  },
  {
    id: "en-hw-opinion-gap-although", skillTags: ["everyday-vocabulary"], language: "en", level: "B1", topic: "everyday", type: "fill-gap",
    prompt: "Complétez (bien que) : ___ the first option is cheaper, I think the second one is a better idea.",
    answer: "Although",
    acceptedAnswers: ["Though", "Even though", "While", "Whilst"],
    explanation: "Although (ou though, while, whilst) introduit une concession : on reconnaît un avantage avant de donner son avis. Ne dites pas « although … but ».",
    hint: "Un mot de concession, au début de la phrase.", focus: "Reconnaître un argument puis donner son avis"
  },
  {
    id: "en-hw-opinion-translation-point", skillTags: ["everyday-vocabulary", "sentence-building"], language: "en", level: "B1", topic: "everyday", type: "translation",
    prompt: "Traduisez : Je comprends votre point de vue, mais je ne suis pas tout à fait d'accord.",
    answer: "I see your point, but I don't entirely agree.",
    acceptedAnswers: combine([["I see ", "I can see ", "I understand ", "I can understand "], ["your point", "your point of view", "your view", "what you mean"], [", but I "], ["don't ", "do not "], ["entirely agree", "completely agree", "totally agree", "fully agree", "quite agree", "agree entirely", "agree completely", "agree with you entirely", "agree with you completely"], [".", " with you."]])
      .filter((sentence) => !sentence.includes("with you entirely with you") && !sentence.includes("with you completely with you")),
    explanation: "I see your point, but… reconnaît l'avis de l'autre avant de le nuancer ; not entirely adoucit I don't agree. On ne dit pas « I am not agree ».",
    hint: "I see your point, but… + négation adoucie.", focus: "Nuancer son avis"
  },

  // --- B1 · Se plaindre poliment et obtenir une solution ------------------------------------
  {
    id: "en-hw-complain-pairs", skillTags: ["everyday-vocabulary"], language: "en", level: "B1", topic: "everyday", type: "match-pairs",
    prompt: "Associez chaque expression à sa traduction.",
    pairs: complaintWords, answer: matchPairsAnswer(complaintWords),
    explanation: "Pour se plaindre, on décrit le problème (it doesn't work), puis on demande une solution (a replacement) ou on s'adresse à la bonne personne (the manager).",
    hint: "Doesn't work est une panne ; broken, un objet abîmé.", focus: "Se plaindre poliment : le problème"
  },
  {
    id: "en-hw-complain-build", skillTags: ["polite-requests", "sentence-building"], language: "en", level: "B1", topic: "everyday", type: "word-bank",
    prompt: "Construisez : « Je crains que la climatisation ne marche pas. »",
    tiles: ["I'm", "afraid", "the", "air", "conditioning", "doesn't", "work", "very", "don't", "can"],
    answer: "I'm afraid the air conditioning doesn't work.",
    explanation: "I'm afraid… adoucit l'annonce d'un problème. L'air conditioning est indénombrable : le verbe est au singulier (doesn't work).",
    hint: "Commencez par la formule qui adoucit.", focus: "Se plaindre poliment : le problème"
  },
  {
    id: "en-hw-complain-gap-brought", skillTags: ["irregular-past"], language: "en", level: "B1", topic: "everyday", type: "fill-gap",
    prompt: "Complétez : I ordered the fish, but they ___ me the chicken. (apporter, prétérit)",
    answer: "brought",
    explanation: "Bring est irrégulier : bring, brought, brought. Le prétérit décrit ce qui s'est passé au restaurant, une fois pour toutes.",
    hint: "bring → ?", focus: "Se plaindre poliment : décrire ce qui s'est passé"
  },
  {
    id: "en-hw-complain-translation-room", skillTags: ["present-perfect", "polite-requests"], language: "en", level: "B1", topic: "everyday", type: "translation",
    prompt: "Traduisez : Je voudrais faire une réclamation : la chambre n'a pas été nettoyée.",
    answer: "I'd like to make a complaint: the room hasn't been cleaned.",
    acceptedAnswers: combine([["I'd like ", "I would like "], ["to make a complaint", "to complain", "to make a formal complaint", "to lodge a complaint", "to file a complaint"], [": ", ". ", ", "], ["the room hasn't been cleaned.", "the room has not been cleaned.", "my room hasn't been cleaned.", "my room has not been cleaned."]]),
    explanation: "make a complaint = faire une réclamation. « N'a pas été nettoyée » se dit au passif au present perfect : hasn't been cleaned.",
    hint: "I'd like to make a complaint + passif au present perfect.", focus: "Se plaindre poliment : faire une réclamation"
  },

  // --- B2 · Intervenir dans un congrès : question, réponse, désaccord courtois --------------
  {
    id: "en-hw-conf-mcq-fair-point", skillTags: ["everyday-vocabulary", "polite-requests"], language: "en", level: "B2", topic: "everyday", type: "multiple-choice",
    prompt: "Un auditeur remarque que votre échantillon est petit, et il n'a pas tort. Quelle réponse est à la fois courtoise et nuancée ?",
    choices: ["Your remark is not important, so we should move on.", "That is a fair point, I am totally agree with you.", "I disagree. A small sample never matters.", "That's a fair point; the sample was small, although the effect was consistent."],
    answer: "That's a fair point; the sample was small, although the effect was consistent.",
    explanation: "That's a fair point reconnaît l'objection, puis although nuance sans se dérober. I am agree est une faute (I agree), et les deux autres réponses ferment la discussion.",
    hint: "Reconnaître l'objection, puis nuancer.", focus: "Répondre à une objection en congrès"
  },
  {
    id: "en-hw-conf-gap-with", skillTags: ["polite-requests", "everyday-vocabulary"], language: "en", level: "B2", topic: "everyday", type: "fill-gap",
    prompt: "Complétez : ___ respect, I am not sure the data support that conclusion. (avec tout le respect que je vous dois)",
    answer: "With",
    acceptedAnswers: ["With all due"],
    explanation: "With respect, (ou With all due respect,) est la formule courtoise qui introduit un désaccord ; elle prévient l'orateur que vous allez le contredire, poliment.",
    hint: "Une préposition de quatre lettres.", focus: "Désaccord courtois en congrès"
  },
  {
    id: "en-hw-conf-translation-outcome", skillTags: ["polite-requests", "medical-vocabulary"], language: "en", level: "B2", topic: "medical", type: "translation",
    prompt: "Traduisez : Merci pour cette présentation. Pourriez-vous préciser comment vous avez défini le critère principal ?",
    answer: "Thank you for the presentation. Could you clarify how you defined the primary outcome?",
    acceptedAnswers: [
      ...combine([["Thank you for the ", "Thank you for your ", "Thank you for this ", "Thank you for that ", "Thank you very much for the ", "Thank you very much for your ", "Thanks for the ", "Thanks for your "], ["presentation. ", "talk. "], ["Could you ", "Could you please ", "Can you ", "Would you be able to "], ["clarify ", "explain "], ["how you defined the primary outcome?", "how you defined the primary endpoint?", "how you defined the primary end point?", "how you defined the main outcome?", "how you defined the main endpoint?", "how the primary outcome was defined?", "how the primary endpoint was defined?"]]),
      ...combine([["Thank you for the ", "Thank you for your ", "Thanks for the "], ["presentation. ", "talk. "], ["Could you ", "Would you be able to "], ["specify how you defined the "], ["primary outcome?", "primary endpoint?", "primary outcome measure?"]])
    ],
    explanation: "Could you clarify how…? est la question polie ; après how, l'ordre reste sujet + verbe (you defined). Le critère principal d'un essai se dit the primary outcome (ou the primary endpoint).",
    hint: "Remerciez, puis Could you clarify how…", focus: "Poser une question précise en congrès"
  }
];
